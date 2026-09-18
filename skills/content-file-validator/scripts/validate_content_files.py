#!/usr/bin/env python3
from __future__ import annotations

import argparse
import copy
import fnmatch
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

SEMVER_RE = re.compile(r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$")
HEADING_RE = re.compile(r"^(#{1,6})[ \t]+(.+?)\s*$")
LINK_RE = re.compile(r"\[([^\]]*)\]\(([^)]*)\)")
WARNING_NO_PREVIOUS = "Version increment could not be verified because no previous version was available."


@dataclass
class FileResult:
    path: Path
    passed: bool = True
    issues: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    suggested_fix: str | None = None
    current_version: str | None = None
    suggested_versions: list[str] = field(default_factory=list)
    markdown_issue_count: int = 0
    frontmatter_issue_count: int = 0
    version_issue_count: int = 0

    def add_issue(self, issue: str, category: str) -> None:
        self.issues.append(issue)
        self.passed = False
        if category == "markdown":
            self.markdown_issue_count += 1
        elif category == "frontmatter":
            self.frontmatter_issue_count += 1
        elif category == "version":
            self.version_issue_count += 1


class ValidationError(Exception):
    pass


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate Markdown structure, YAML frontmatter schema compliance, and SemVer versioning."
    )
    parser.add_argument("--target", required=True, help="Target directory to scan.")
    parser.add_argument("--schema", required=True, help="Schema path.")
    parser.add_argument("--report", required=True, help="Markdown report output path.")
    parser.add_argument("--include", action="append", default=[], help="Include glob. Repeatable.")
    parser.add_argument("--exclude", action="append", default=[], help="Exclude glob. Repeatable.")
    parser.add_argument(
        "--enforce-version-increment",
        action="store_true",
        help="Fail when changed files do not increment version, where previous state is available.",
    )
    parser.add_argument("--base-ref", help="Git base ref to compare against.")
    parser.add_argument("--auto-fix", action="store_true", help="Apply safe automatic fixes.")
    parser.add_argument("--change-type", choices=["major", "minor", "patch"], help="Explicit increment type.")
    return parser.parse_args()


def strip_comment(value: str) -> str:
    in_single = False
    in_double = False
    result: list[str] = []
    for char in value:
        if char == "'" and not in_double:
            in_single = not in_single
        elif char == '"' and not in_single:
            in_double = not in_double
        elif char == "#" and not in_single and not in_double:
            break
        result.append(char)
    return "".join(result).rstrip()


def parse_scalar(value: str) -> Any:
    value = strip_comment(value).strip()
    if value == "":
        return ""
    if value in {"true", "True"}:
        return True
    if value in {"false", "False"}:
        return False
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    if value.startswith('"') and value.endswith('"'):
        return value[1:-1].replace('\\"', '"').replace("\\\\", "\\")
    if value.startswith("'") and value.endswith("'"):
        return value[1:-1].replace("\\'", "'").replace("\\\\", "\\")
    return value


def parse_simple_yaml(text: str) -> Any:
    raw_lines = [line.rstrip("\n") for line in text.splitlines()]
    lines = [line for line in raw_lines if line.strip() and not line.lstrip().startswith("#")]

    def parse_block(start: int, indent: int) -> tuple[Any, int]:
        if start >= len(lines):
            return {}, start
        current = lines[start]
        current_indent = len(current) - len(current.lstrip(" "))
        if current_indent < indent:
            return {}, start
        if current.lstrip().startswith("- "):
            items: list[Any] = []
            index = start
            while index < len(lines):
                line = lines[index]
                line_indent = len(line) - len(line.lstrip(" "))
                if line_indent < indent or not line.lstrip().startswith("- "):
                    break
                content = line.lstrip()[2:]
                if content.strip():
                    items.append(parse_scalar(content))
                    index += 1
                    continue
                child, index = parse_block(index + 1, line_indent + 2)
                items.append(child)
            return items, index

        mapping: dict[str, Any] = {}
        index = start
        while index < len(lines):
            line = lines[index]
            line_indent = len(line) - len(line.lstrip(" "))
            if line_indent < indent:
                break
            if line_indent > indent:
                raise ValidationError(f"Unexpected indentation in YAML near: {line.strip()}")
            stripped = line.strip()
            if ":" not in stripped:
                raise ValidationError(f"Invalid YAML line: {stripped}")
            key, rest = stripped.split(":", 1)
            if rest.strip() == "":
                child, index = parse_block(index + 1, indent + 2)
                mapping[key.strip()] = child
            else:
                mapping[key.strip()] = parse_scalar(rest)
                index += 1
        return mapping, index

    parsed, next_index = parse_block(0, 0)
    if next_index != len(lines):
        raise ValidationError("Could not parse entire YAML document.")
    return parsed


def dump_scalar(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    text = str(value)
    if text == "" or re.search(r"[:#\n]", text) or text.strip() != text or re.fullmatch(r"-?\d+(\.\d+)?", text):
        escaped = text.replace('"', '\\"')
        return f'"{escaped}"'
    return text


def dump_simple_yaml(data: Any, indent: int = 0, parent_key: str | None = None) -> str:
    prefix = " " * indent
    if isinstance(data, dict):
        lines: list[str] = []
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                lines.append(f"{prefix}{key}:")
                lines.append(dump_simple_yaml(value, indent + 2, key))
            else:
                rendered = dump_scalar(value)
                if key == "version" and isinstance(value, str) and not rendered.startswith(("'", '"')):
                    rendered = f'"{value}"'
                lines.append(f"{prefix}{key}: {rendered}")
        return "\n".join(lines)
    if isinstance(data, list):
        lines = []
        for item in data:
            if isinstance(item, (dict, list)):
                lines.append(f"{prefix}-")
                lines.append(dump_simple_yaml(item, indent + 2, parent_key))
            else:
                lines.append(f"{prefix}- {dump_scalar(item)}")
        return "\n".join(lines)
    return f"{prefix}{dump_scalar(data)}"


def load_yaml_file(path: Path) -> dict[str, Any]:
    try:
        data = parse_simple_yaml(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValidationError(f"Schema file not found: {path}") from exc
    if not isinstance(data, dict):
        raise ValidationError(f"YAML file must contain a mapping at top level: {path}")
    return data


def should_include(rel_path: str, includes: list[str], excludes: list[str]) -> bool:
    default_patterns = ["*.md", "*.markdown", "*.mdx", "*.template", "*.tmpl"]
    include_patterns = includes or default_patterns
    if not any(fnmatch.fnmatch(rel_path, pattern) for pattern in include_patterns):
        return False
    if any(fnmatch.fnmatch(rel_path, pattern) for pattern in excludes):
        return False
    return True


def iter_target_files(target: Path, includes: list[str], excludes: list[str]) -> list[Path]:
    if not target.exists():
        raise ValidationError(f"Target path does not exist: {target}")
    if not target.is_dir():
        raise ValidationError(f"Target path must be a directory: {target}")
    files: list[Path] = []
    for path in sorted(p for p in target.rglob("*") if p.is_file()):
        rel = path.relative_to(target).as_posix()
        if should_include(rel, includes, excludes):
            files.append(path)
    return files


def split_frontmatter(text: str) -> tuple[dict[str, Any] | None, str | None, str | None]:
    if not text.startswith("---\n"):
        return None, None, None
    end = text.find("\n---", 4)
    if end == -1:
        raise ValidationError("Frontmatter opening delimiter found but closing delimiter is missing.")
    yaml_block = text[4:end]
    remainder_start = end + 4
    if remainder_start < len(text) and text[remainder_start] == "\n":
        remainder_start += 1
    remainder = text[remainder_start:]
    try:
        parsed = parse_simple_yaml(yaml_block) or {}
    except ValidationError as exc:
        raise ValidationError(f"Invalid YAML frontmatter: {exc}") from exc
    if not isinstance(parsed, dict):
        raise ValidationError("Frontmatter must parse to a YAML mapping.")
    return parsed, yaml_block, remainder


def dump_frontmatter(data: dict[str, Any]) -> str:
    return dump_simple_yaml(data).strip()


def validate_schema(frontmatter: dict[str, Any], schema: dict[str, Any]) -> list[str]:
    issues: list[str] = []
    required = schema.get("required", [])
    properties = schema.get("properties", {})
    additional = schema.get("additionalProperties", True)
    min_props = schema.get("minProperties")
    max_props = schema.get("maxProperties")

    for field in required:
        if field not in frontmatter:
            issues.append(f"Missing required frontmatter field: `{field}`")

    if min_props is not None and len(frontmatter) < min_props:
        issues.append(f"Frontmatter has too few properties: expected at least {min_props}")
    if max_props is not None and len(frontmatter) > max_props:
        issues.append(f"Frontmatter has too many properties: expected at most {max_props}")

    if additional is False:
        for key in frontmatter:
            if key not in properties:
                issues.append(f"Unexpected frontmatter field: `{key}`")

    for key, rules in properties.items():
        if key not in frontmatter:
            continue
        issues.extend(validate_property(key, frontmatter[key], rules))
    return issues


def validate_property(name: str, value: Any, rules: dict[str, Any]) -> list[str]:
    issues: list[str] = []
    expected_type = rules.get("type")
    if expected_type == "string":
        if not isinstance(value, str):
            issues.append(f"Field `{name}` must be a string")
            return issues
        min_length = rules.get("minLength")
        max_length = rules.get("maxLength")
        if min_length is not None and len(value) < min_length:
            issues.append(f"Field `{name}` is shorter than {min_length} characters")
        if max_length is not None and len(value) > max_length:
            issues.append(f"Field `{name}` exceeds {max_length} characters")
        pattern = rules.get("pattern")
        if pattern and not re.fullmatch(pattern, value):
            issues.append(f"Field `{name}` does not match required pattern")
        enum = rules.get("enum")
        if enum and value not in enum:
            issues.append(f"Field `{name}` must be one of: {', '.join(map(str, enum))}")
        if rules.get("format") == "date" and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
            issues.append(f"Field `{name}` must use YYYY-MM-DD format")
    elif expected_type == "array":
        if not isinstance(value, list):
            issues.append(f"Field `{name}` must be an array")
            return issues
        item_rules = rules.get("items", {})
        for item in value:
            issues.extend(validate_property(name, item, item_rules))
    return issues


def slugify_heading(text: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", text.strip().lower())
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-{2,}", "-", slug)
    return slug.strip("-")


def classify_change_suggestions(version: str) -> list[str]:
    major, minor, patch = [int(part) for part in version.split(".")]
    return [f"{major}.{minor}.{patch + 1}", f"{major}.{minor + 1}.0", f"{major + 1}.0.0"]


def bump_version(version: str, change_type: str) -> str:
    major, minor, patch = [int(part) for part in version.split(".")]
    if change_type == "patch":
        return f"{major}.{minor}.{patch + 1}"
    if change_type == "minor":
        return f"{major}.{minor + 1}.0"
    if change_type == "major":
        return f"{major + 1}.0.0"
    raise ValidationError(f"Unsupported change type: {change_type}")


def git_show(base_ref: str, rel_path: str) -> str | None:
    try:
        result = subprocess.run(["git", "show", f"{base_ref}:{rel_path}"], check=False, capture_output=True, text=True)
    except FileNotFoundError:
        return None
    if result.returncode != 0:
        return None
    return result.stdout


def maybe_get_previous_text(file_path: Path, target: Path, base_ref: str | None) -> str | None:
    if not base_ref:
        return None
    rel_path = file_path.relative_to(target.parent).as_posix()
    return git_show(base_ref, rel_path)


def apply_safe_autofix(
    file_path: Path,
    frontmatter: dict[str, Any],
    remainder: str,
    result: FileResult,
    args: argparse.Namespace,
) -> bool:
    updated = copy.deepcopy(frontmatter)
    changed = False
    if "version" not in updated:
        updated["version"] = "1.0.0"
        changed = True
    elif args.change_type and isinstance(updated.get("version"), str) and SEMVER_RE.fullmatch(updated["version"]):
        updated["version"] = bump_version(updated["version"], args.change_type)
        changed = True

    if not changed:
        return False

    rendered = f"---\n{dump_frontmatter(updated)}\n---\n{remainder}"
    file_path.write_text(rendered, encoding="utf-8")
    result.warnings.append("Applied safe auto-fix changes.")
    return True


def build_suggested_fix(frontmatter: dict[str, Any]) -> str:
    suggestion = copy.deepcopy(frontmatter)
    if "title" not in suggestion:
        suggestion["title"] = "Example"
    if "status" not in suggestion:
        suggestion["status"] = "draft"
    if "type" not in suggestion:
        suggestion["type"] = "guide"
    if "version" not in suggestion:
        suggestion["version"] = "1.0.0"
    return f"---\n{dump_frontmatter(suggestion)}\n---"


def validate_markdown(file_path: Path, text: str, result: FileResult) -> None:
    lines = text.splitlines()
    headings: list[tuple[int, str, int]] = []
    seen_headings: dict[str, int] = {}
    code_fence_count = 0

    for index, line in enumerate(lines, start=1):
        stripped = line.strip()
        if stripped.startswith("```"):
            code_fence_count += 1

        heading_match = HEADING_RE.match(line)
        if heading_match:
            level = len(heading_match.group(1))
            heading_text = heading_match.group(2).strip()
            if not heading_text:
                result.add_issue(f"Empty heading on line {index}", "markdown")
            headings.append((level, heading_text, index))
            normalised = heading_text.casefold()
            seen_headings[normalised] = seen_headings.get(normalised, 0) + 1

        if line.lstrip().startswith("#") and not HEADING_RE.match(line):
            result.add_issue(f"Malformed heading syntax on line {index}", "markdown")

    if code_fence_count % 2 != 0:
        result.add_issue("Unmatched fenced code block detected.", "markdown")

    h1_count = sum(1 for level, _, _ in headings if level == 1)
    if h1_count == 0:
        result.add_issue("Missing H1 heading.", "markdown")
    elif h1_count > 1:
        result.add_issue("Multiple H1 headings found.", "markdown")

    for idx in range(1, len(headings)):
        previous_level, _, _ = headings[idx - 1]
        current_level, _, line_no = headings[idx]
        if current_level > previous_level + 1:
            result.add_issue(
                f"Heading level jumps from h{previous_level} to h{current_level} on line {line_no}",
                "markdown",
            )

    for heading_text, count in seen_headings.items():
        if count > 1:
            result.add_issue(f"Repeated heading: `{heading_text}`", "markdown")

    anchors = {slugify_heading(text) for _, text, _ in headings if text}
    body_lines = lines
    for index, line in enumerate(body_lines, start=1):
        for match in LINK_RE.finditer(line):
            destination = match.group(2).strip()
            if not destination:
                result.add_issue(f"Malformed link with empty destination on line {index}", "markdown")
                continue
            if " " in destination and not destination.startswith("<"):
                result.add_issue(f"Malformed link destination on line {index}: `{destination}`", "markdown")
                continue
            if destination.startswith("#"):
                anchor = destination[1:]
                if anchor not in anchors:
                    result.add_issue(f"Broken local anchor link on line {index}: `{destination}`", "markdown")
                continue
            parsed = urlparse(destination)
            if parsed.scheme in {"http", "https"}:
                if not parsed.netloc:
                    result.add_issue(f"Malformed remote link on line {index}: `{destination}`", "markdown")
                continue
            if destination.startswith("mailto:") or destination.startswith("tel:"):
                continue
            local_target = destination.split("#", 1)[0]
            if local_target:
                resolved = (file_path.parent / local_target).resolve()
                if not resolved.exists():
                    result.add_issue(f"Broken local file link on line {index}: `{destination}`", "markdown")


def validate_file(file_path: Path, target: Path, schema: dict[str, Any], args: argparse.Namespace) -> FileResult:
    result = FileResult(path=file_path.relative_to(target.parent))
    text = file_path.read_text(encoding="utf-8")

    try:
        frontmatter, _, remainder = split_frontmatter(text)
    except ValidationError as exc:
        result.add_issue(str(exc), "frontmatter")
        result.suggested_fix = build_suggested_fix({})
        return result

    if frontmatter is None or remainder is None:
        result.add_issue("Missing YAML frontmatter at the top of the document", "frontmatter")
        result.suggested_fix = build_suggested_fix({})
        return result

    for issue in validate_schema(frontmatter, schema):
        result.add_issue(issue, "frontmatter")

    version_value = frontmatter.get("version")
    if "version" not in frontmatter:
        result.add_issue("Missing required frontmatter field: `version`", "version")
    elif not isinstance(version_value, str):
        result.add_issue("Field `version` must be a string", "version")
    elif not SEMVER_RE.fullmatch(version_value):
        result.add_issue("Invalid version format: expected MAJOR.MINOR.PATCH", "version")
    else:
        result.current_version = version_value
        result.suggested_versions = classify_change_suggestions(version_value)

    validate_markdown(file_path, remainder, result)

    if args.enforce_version_increment:
        previous_text = maybe_get_previous_text(file_path, target, args.base_ref)
        if previous_text is None:
            result.warnings.append(WARNING_NO_PREVIOUS)
        else:
            try:
                previous_frontmatter, _, previous_remainder = split_frontmatter(previous_text)
            except ValidationError:
                previous_frontmatter, previous_remainder = None, None
            if previous_frontmatter is not None:
                previous_version = previous_frontmatter.get("version")
                previous_body = previous_remainder or ""
                current_body = remainder
                doc_changed = (previous_body != current_body) or (previous_frontmatter != frontmatter)
                if doc_changed and previous_version == version_value:
                    result.add_issue("File changed but version was not incremented.", "version")

    if result.issues:
        result.suggested_fix = build_suggested_fix(frontmatter)
        if args.auto_fix:
            try:
                fixed = apply_safe_autofix(file_path, frontmatter, remainder, result, args)
            except Exception as exc:
                raise ValidationError(f"Auto-fix failed for {file_path}: {exc}") from exc
            if fixed:
                refreshed_args = argparse.Namespace(**{**vars(args), "auto_fix": False})
                return validate_file(file_path, target, schema, refreshed_args)
    return result


def write_report(report_path: Path, results: list[FileResult]) -> None:
    files_scanned = len(results)
    passed = sum(1 for r in results if r.passed)
    failed = sum(1 for r in results if not r.passed)
    warnings_count = sum(len(r.warnings) for r in results)
    markdown_issues = sum(r.markdown_issue_count for r in results)
    frontmatter_issues = sum(r.frontmatter_issue_count for r in results)
    version_issues = sum(r.version_issue_count for r in results)

    lines = [
        "# Content File Validation Report",
        "",
        "## Summary",
        "",
        "| Metric | Count |",
        "|---|---:|",
        f"| Files scanned | {files_scanned} |",
        f"| Passed | {passed} |",
        f"| Failed | {failed} |",
        f"| Warnings | {warnings_count} |",
        f"| Markdown issues | {markdown_issues} |",
        f"| Frontmatter issues | {frontmatter_issues} |",
        f"| Version issues | {version_issues} |",
        "",
        "## Failed Files",
        "",
    ]

    failed_results = [r for r in results if not r.passed]
    if not failed_results:
        lines.extend(["No failed files.", ""])
    else:
        for result in failed_results:
            lines.append(f"### `{result.path.as_posix()}`")
            lines.append("")
            lines.append("**Issues:**")
            lines.append("")
            for issue in result.issues:
                lines.append(f"- {issue}")
            lines.append("")
            if result.suggested_fix:
                lines.append("**Suggested fix:**")
                lines.append("")
                lines.append("```yaml")
                lines.append(result.suggested_fix.replace("```", "``\\`"))
                lines.append("```")
                lines.append("")

    warning_results = [r for r in results if r.warnings]
    if warning_results:
        lines.extend(["## Warnings", ""])
        for result in warning_results:
            lines.append(f"### `{result.path.as_posix()}`")
            lines.append("")
            for warning in result.warnings:
                lines.append(f"- {warning}")
            lines.append("")

    passed_results = [r for r in results if r.passed]
    if passed_results:
        lines.extend(["## Passed Files", ""])
        for result in passed_results:
            lines.append(f"- `{result.path.as_posix()}`")
        lines.append("")

    lines.extend(
        [
            "## Recommended next actions",
            "",
            "1. Fix blocking frontmatter errors.",
            "2. Fix markdown structure issues.",
            "3. Confirm the correct SemVer increment for changed files.",
            "4. Re-run the validator.",
            "",
        ]
    )

    report_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    args = parse_args()
    try:
        target = Path(args.target).resolve()
        schema_path = Path(args.schema).resolve()
        report_path = Path(args.report).resolve()
        schema = load_yaml_file(schema_path)
        files = iter_target_files(target, args.include, args.exclude)
        results = [validate_file(path, target, schema, args) for path in files]
        write_report(report_path, results)
        return 1 if any(not result.passed for result in results) else 0
    except ValidationError as exc:
        sys.stderr.write(f"{exc}\n")
        return 2
    except Exception as exc:
        sys.stderr.write(f"Unexpected error: {exc}\n")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())