#!/usr/bin/env python3
from __future__ import annotations

import argparse
import fnmatch
import re
import subprocess
import sys
from collections import Counter
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urlparse

SEMVER_RE = re.compile(r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$")
HEADING_RE = re.compile(r"^(#{1,6})\s*(.*)$")
LINK_RE = re.compile(r'!?\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
TABLE_DIVIDER_RE = re.compile(r"^\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$")
BULLET_RE = re.compile(r"^(\s*)([-*+])\s+\S")


@dataclass
class Issue:
    severity: str
    message: str
    suggestion: str | None = None


@dataclass
class FileResult:
    path: str
    issues: list[Issue] = field(default_factory=list)
    warnings: list[Issue] = field(default_factory=list)
    suggestions: list[Issue] = field(default_factory=list)
    passed: bool = True
    current_version: str | None = None
    version_increment_checked: bool = False

    def add(self, severity: str, message: str, suggestion: str | None = None) -> None:
        issue = Issue(severity=severity, message=message, suggestion=suggestion)
        if severity == "error":
            self.issues.append(issue)
            self.passed = False
        elif severity == "warning":
            self.warnings.append(issue)
        else:
            self.suggestions.append(issue)


@dataclass
class ParsedFrontmatter:
    data: dict[str, Any] | None
    body: str
    raw: str | None
    error: str | None = None
    missing: bool = False
    misplaced: bool = False


class ConfigurationError(Exception):
    pass


def _strip_inline_comment(value: str) -> str:
    if " #" not in value:
        return value
    return value.split(" #", 1)[0].rstrip()


def _parse_scalar(value: str) -> Any:
    value = _strip_inline_comment(value.strip())
    if value == "":
        return ""
    if value in {"true", "True"}:
        return True
    if value in {"false", "False"}:
        return False
    if value in {"null", "Null", "~"}:
        return None
    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
        return value[1:-1]
    if re.fullmatch(r"-?\d+", value):
        try:
            return int(value)
        except ValueError:
            pass
    return value


def parse_simple_yaml(text: str) -> Any:
    lines = text.splitlines()
    root: Any = None
    stack: list[tuple[int, Any]] = []

    def peek_next_nonempty(start: int) -> str | None:
        for candidate in lines[start:]:
            stripped = candidate.strip()
            if stripped and not stripped.startswith("#"):
                return candidate
        return None

    def attach_child(parent: Any, key: str | None, child: Any) -> None:
        if isinstance(parent, dict):
            assert key is not None
            parent[key] = child
        elif isinstance(parent, list):
            parent.append(child)
        else:
            raise ConfigurationError("Invalid YAML structure")

    for index, raw_line in enumerate(lines):
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        indent = len(raw_line) - len(raw_line.lstrip(" "))
        content = raw_line.strip()

        while stack and indent < stack[-1][0]:
            stack.pop()

        parent = stack[-1][1] if stack else None

        if content.startswith("- "):
            if not isinstance(parent, list):
                raise ConfigurationError(f"YAML list item without list context on line {index + 1}")
            item_text = content[2:].strip()
            if not item_text:
                item: Any = {}
                parent.append(item)
                stack.append((indent + 2, item))
                continue
            if ":" in item_text and not item_text.startswith(("http://", "https://")):
                key, rest = item_text.split(":", 1)
                item = {key.strip(): _parse_scalar(rest.strip()) if rest.strip() else {}}
                parent.append(item)
                if not rest.strip():
                    stack.append((indent + 2, item[key.strip()]))
                continue
            parent.append(_parse_scalar(item_text))
            continue

        if ":" not in content:
            raise ConfigurationError(f"Unsupported YAML line on line {index + 1}: {content}")

        key, rest = content.split(":", 1)
        key = key.strip()
        rest = rest.strip()

        if root is None:
            root = {}
            stack.append((indent, root))
            parent = root
        elif parent is None:
            parent = root

        if not isinstance(parent, dict):
            raise ConfigurationError(f"YAML mapping entry without mapping context on line {index + 1}")

        if rest:
            parent[key] = _parse_scalar(rest)
            continue

        next_line = peek_next_nonempty(index + 1)
        if next_line is None:
            parent[key] = {}
            continue

        next_content = next_line.strip()
        next_indent = len(next_line) - len(next_line.lstrip(" "))
        if next_indent <= indent:
            parent[key] = {}
            continue
        child: Any = [] if next_content.startswith("- ") else {}
        parent[key] = child
        stack.append((next_indent, child))

    return root if root is not None else {}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate markdown content and frontmatter.")
    parser.add_argument("--target", required=True, help="Target directory or file to scan")
    parser.add_argument("--schema", required=True, help="Path to YAML schema file")
    parser.add_argument("--report", required=True, help="Path to write markdown report")
    parser.add_argument("--include", action="append", default=[], help="Include glob pattern (repeatable)")
    parser.add_argument("--exclude", action="append", default=[], help="Exclude glob pattern (repeatable)")
    parser.add_argument("--enforce-version-increment", action="store_true", help="Require changed files to bump version")
    parser.add_argument("--base-ref", help="Git base reference for changed-file comparison")
    return parser.parse_args()


def load_yaml(path: Path) -> Any:
    try:
        with path.open("r", encoding="utf-8") as handle:
            return parse_simple_yaml(handle.read())
    except FileNotFoundError as exc:
        raise ConfigurationError(f"Schema file not found: {path}") from exc
    except ConfigurationError as exc:
        raise ConfigurationError(f"Schema YAML is invalid: {exc}") from exc


def match_any(path: str, patterns: Iterable[str]) -> bool:
    return any(fnmatch.fnmatch(path, pattern) for pattern in patterns)


def iter_target_files(target: Path, includes: list[str], excludes: list[str]) -> list[Path]:
    include_patterns = includes or ["**/*.md", "**/*.mdx", "**/*.markdown", "*.md", "*.mdx", "*.markdown"]
    if target.is_file():
        candidates = [target]
    elif target.is_dir():
        candidates = sorted(p for p in target.rglob("*") if p.is_file())
    else:
        raise ConfigurationError(f"Target path does not exist: {target}")

    selected: list[Path] = []
    for candidate in candidates:
        rel = candidate.relative_to(target.parent if target.is_file() else target).as_posix() if target.is_file() else candidate.relative_to(target).as_posix()
        full = candidate.as_posix()
        if not (match_any(rel, include_patterns) or match_any(full, include_patterns)):
            continue
        if excludes and (match_any(rel, excludes) or match_any(full, excludes)):
            continue
        selected.append(candidate)
    return selected


def parse_frontmatter(text: str) -> ParsedFrontmatter:
    if text.startswith("\ufeff"):
        return ParsedFrontmatter(data=None, body=text.lstrip("\ufeff"), raw=None, error="BOM marker is not allowed before frontmatter.", misplaced=True)
    if not text.startswith("---\n") and text != "---":
        if text.startswith("---\r\n"):
            opening = "---\r\n"
        else:
            opening = None
        if opening is None:
            stripped = text.lstrip()
            if stripped.startswith("---"):
                return ParsedFrontmatter(data=None, body=text, raw=None, error="Frontmatter must begin at the very top of the file with no leading whitespace or content.", misplaced=True)
            return ParsedFrontmatter(data=None, body=text, raw=None, missing=True)
    newline = "\r\n" if text.startswith("---\r\n") else "\n"
    closing = f"{newline}---{newline}"
    end_index = text.find(closing, 4)
    if end_index == -1:
        if text.endswith(f"{newline}---"):
            end_index = len(text) - 4
            raw = text[4:end_index]
            body = ""
        else:
            return ParsedFrontmatter(data=None, body=text, raw=None, error="Frontmatter opening found but closing '---' delimiter is missing.")
    else:
        raw = text[4:end_index]
        body = text[end_index + len(closing):]
    try:
        parsed = parse_simple_yaml(raw) if raw.strip() else {}
    except ConfigurationError as exc:
        return ParsedFrontmatter(data=None, body=body, raw=raw, error=f"Frontmatter YAML is invalid: {exc}")
    if parsed is None:
        parsed = {}
    if not isinstance(parsed, dict):
        return ParsedFrontmatter(data=None, body=body, raw=raw, error="Frontmatter must parse to a YAML object.")
    return ParsedFrontmatter(data=parsed, body=body, raw=raw)


def validate_schema(frontmatter: dict[str, Any], schema: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    required = schema.get("required", []) or []
    properties = schema.get("properties", {}) or {}

    for field in required:
        if field not in frontmatter:
            errors.append(f"Missing required frontmatter field: `{field}`")

    if "minProperties" in schema and len(frontmatter) < schema["minProperties"]:
        errors.append(f"Frontmatter has fewer than the minimum allowed fields: {schema['minProperties']}")
    if "maxProperties" in schema and len(frontmatter) > schema["maxProperties"]:
        errors.append(f"Frontmatter has more than the maximum allowed fields: {schema['maxProperties']}")

    if schema.get("additionalProperties") is False:
        unknown = sorted(set(frontmatter) - set(properties))
        for key in unknown:
            errors.append(f"Unsupported frontmatter field: `{key}`")

    for key, rules in properties.items():
        if key not in frontmatter:
            continue
        value = frontmatter[key]
        errors.extend(validate_value(key, value, rules))

    return errors


def validate_value(name: str, value: Any, rules: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    expected_type = rules.get("type")
    if expected_type == "string":
        if not isinstance(value, str):
            return [f"Frontmatter field `{name}` must be a string"]
        if "minLength" in rules and len(value) < rules["minLength"]:
            errors.append(f"Frontmatter field `{name}` is shorter than {rules['minLength']} characters")
        if "maxLength" in rules and len(value) > rules["maxLength"]:
            errors.append(f"Frontmatter field `{name}` is longer than {rules['maxLength']} characters")
        if "enum" in rules and value not in rules["enum"]:
            errors.append(f"Frontmatter field `{name}` must be one of: {', '.join(map(str, rules['enum']))}")
        pattern = rules.get("pattern")
        if pattern:
            pattern = pattern.replace("\\\\", "\\")
        if pattern and not re.match(pattern, value):
            errors.append(f"Frontmatter field `{name}` does not match the required pattern")
        if rules.get("format") == "date":
            try:
                date.fromisoformat(value)
            except ValueError:
                errors.append(f"Frontmatter field `{name}` must be an ISO date (YYYY-MM-DD)")
    elif expected_type == "array":
        if not isinstance(value, list):
            return [f"Frontmatter field `{name}` must be an array"]
        item_rules = rules.get("items", {})
        for item in value:
            errors.extend(validate_value(name, item, item_rules))
    return errors


def normalize_anchor(value: str) -> str:
    anchor = value.strip().lower()
    anchor = re.sub(r"[^a-z0-9\s-]", "", anchor)
    anchor = re.sub(r"\s+", "-", anchor)
    anchor = re.sub(r"-+", "-", anchor)
    return anchor


def validate_markdown(path: Path, body: str, result: FileResult, root: Path) -> None:
    lines = body.splitlines()
    heading_levels: list[int] = []
    headings: list[str] = []
    in_code_fence = False
    code_fence_start = 0
    code_fence_content = 0
    blank_run = 0
    table_expected_columns: int | None = None
    current_bullet_marker: str | None = None

    for idx, line in enumerate(lines, start=1):
        if line.endswith(" ") or line.endswith("\t"):
            result.add("suggestion", f"Line {idx}: trailing whitespace")
        if line.strip() == "":
            blank_run += 1
            if blank_run > 1:
                result.add("warning", f"Line {idx}: repeated blank lines")
        else:
            blank_run = 0

        if line.startswith("```"):
            if in_code_fence:
                if code_fence_content == 0:
                    result.add("error", f"Line {code_fence_start}: empty code fence")
                in_code_fence = False
                code_fence_content = 0
            else:
                in_code_fence = True
                code_fence_start = idx
            continue
        if in_code_fence:
            if line.strip():
                code_fence_content += 1
            continue

        heading_match = HEADING_RE.match(line)
        if heading_match:
            level = len(heading_match.group(1))
            text = heading_match.group(2).strip()
            if not text:
                result.add("suggestion", f"Line {idx}: empty heading")
            if heading_levels and level > heading_levels[-1] + 1:
                result.add("warning", f"Line {idx}: heading level jumps from `h{heading_levels[-1]}` to `h{level}`")
            heading_levels.append(level)
            headings.append(text)
            if len(text) > 80:
                result.add("warning", f"Line {idx}: heading is longer than 80 characters")
            continue

        bullet_match = BULLET_RE.match(line)
        if bullet_match:
            marker = bullet_match.group(2)
            indent = len(bullet_match.group(1))
            if indent == 0:
                if current_bullet_marker is None:
                    current_bullet_marker = marker
                elif current_bullet_marker != marker:
                    result.add("warning", f"Line {idx}: inconsistent bullet style in the same list block")
            continue
        current_bullet_marker = None

        if "|" in line and line.strip().startswith("|"):
            columns = [col.strip() for col in line.strip().strip("|").split("|")]
            if idx < len(lines) and TABLE_DIVIDER_RE.match(lines[idx].strip() if idx < len(lines) else ""):
                table_expected_columns = len(columns)
            elif table_expected_columns is not None and len(columns) != table_expected_columns:
                result.add("warning", f"Line {idx}: inconsistent table column count")
        else:
            table_expected_columns = None

        for match in LINK_RE.finditer(line):
            target = match.group(2)
            if target.startswith("#"):
                anchor = target[1:]
                if anchor not in {normalize_anchor(h) for h in headings}:
                    result.add("error", f"Line {idx}: broken internal anchor link `{target}`")
            elif re.match(r"^[a-zA-Z]+://", target):
                parsed = urlparse(target)
                if not parsed.scheme or not parsed.netloc:
                    result.add("warning", f"Line {idx}: malformed external link `{target}`")
            elif not target.startswith("mailto:"):
                file_target = target.split("#", 1)[0]
                resolved = (path.parent / file_target).resolve()
                try:
                    resolved.relative_to(root.resolve())
                except ValueError:
                    pass
                if file_target and not resolved.exists():
                    result.add("error", f"Line {idx}: broken internal link `{target}`")

    if in_code_fence:
        result.add("error", f"Line {code_fence_start}: unclosed code fence")

    counts = Counter(h for h in headings if h)
    for heading, count in counts.items():
        if count > 1:
            result.add("warning", f"Duplicate heading: `{heading}` appears {count} times")


def load_previous_file(base_ref: str, rel_path: str) -> str | None:
    command = ["git", "show", f"{base_ref}:{rel_path}"]
    try:
        completed = subprocess.run(command, capture_output=True, check=False, text=True)
    except FileNotFoundError:
        raise ConfigurationError("Git is required for version-increment checks but is not available")
    if completed.returncode != 0:
        return None
    return completed.stdout


def compare_versions(base_ref: str | None, rel_path: str, current_text: str, current_version: str | None, result: FileResult) -> None:
    result.version_increment_checked = True
    if not base_ref:
        result.add("warning", "Version increment could not be verified because no previous version was available.")
        return
    previous_text = load_previous_file(base_ref, rel_path)
    if previous_text is None:
        result.add("warning", "Version increment could not be verified because no previous version was available.")
        return
    if previous_text == current_text:
        return
    previous_frontmatter = parse_frontmatter(previous_text)
    previous_version = None
    if previous_frontmatter.data:
        previous_version = previous_frontmatter.data.get("version")
    if previous_version == current_version:
        result.add(
            "error",
            "File changed but version was not incremented.",
            "Choose a patch, minor, or major bump based on the scope of the change.",
        )


def validate_file(path: Path, root: Path, schema: dict[str, Any], enforce_version_increment: bool, base_ref: str | None) -> FileResult:
    result = FileResult(path=path.relative_to(root).as_posix())
    text = path.read_text(encoding="utf-8")
    if text and not text.endswith("\n"):
        result.add("warning", "Missing final newline")

    parsed = parse_frontmatter(text)
    if parsed.missing:
        result.add("error", "Missing YAML frontmatter at the top of the file", 'Add frontmatter bounded by `---` with at least `title`, `status`, `type`, and `version`.')
        return result
    if parsed.misplaced and parsed.error:
        result.add("error", parsed.error)
        return result
    if parsed.error:
        result.add("error", parsed.error)
        return result

    assert parsed.data is not None
    schema_errors = validate_schema(parsed.data, schema)
    for message in schema_errors:
        result.add("error", message)

    version = parsed.data.get("version")
    result.current_version = version if isinstance(version, str) else None
    if version is None:
        result.add("error", "Missing required frontmatter field: `version`")
    elif not isinstance(version, str) or not SEMVER_RE.match(version):
        result.add("error", "Frontmatter field `version` must be valid SemVer `MAJOR.MINOR.PATCH`")

    validate_markdown(path, parsed.body, result, root)

    if enforce_version_increment:
        compare_versions(base_ref, result.path, text, result.current_version, result)

    return result


def build_report(results: list[FileResult]) -> str:
    files_scanned = len(results)
    passed_files = [r for r in results if r.passed and not r.issues]
    failed_files = [r for r in results if r.issues]
    warning_count = sum(len(r.warnings) for r in results)
    markdown_issue_count = sum(
        sum(1 for issue in r.issues + r.warnings + r.suggestions if any(token in issue.message.lower() for token in ["heading", "markdown", "code fence", "blank", "table", "link", "bullet", "newline", "whitespace"]))
        for r in results
    )
    frontmatter_issue_count = sum(
        sum(1 for issue in r.issues if "frontmatter" in issue.message.lower() or "yaml" in issue.message.lower())
        for r in results
    )
    missing_version_count = sum(1 for r in results for issue in r.issues if "missing required frontmatter field: `version`" in issue.message.lower())
    invalid_version_count = sum(1 for r in results for issue in r.issues if "semver" in issue.message.lower())
    unchanged_version_count = sum(1 for r in results for issue in r.issues if "version was not incremented" in issue.message.lower())

    lines: list[str] = []
    lines.append("# Markdown Content Validation Report")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append("| Metric | Count |")
    lines.append("|---|---:|")
    lines.append(f"| Files scanned | {files_scanned} |")
    lines.append(f"| Passed | {len(passed_files)} |")
    lines.append(f"| Failed | {len(failed_files)} |")
    lines.append(f"| Warnings | {warning_count} |")
    lines.append(f"| Markdown issues | {markdown_issue_count} |")
    lines.append(f"| Frontmatter issues | {frontmatter_issue_count} |")
    lines.append(f"| Missing version | {missing_version_count} |")
    lines.append(f"| Invalid version format | {invalid_version_count} |")
    lines.append(f"| Changed without version increment | {unchanged_version_count} |")
    lines.append("")
    lines.append("## Failed Files")
    lines.append("")
    if failed_files:
        for result in failed_files:
            lines.append(f"### `{result.path}`")
            lines.append("")
            lines.append("**Issues:**")
            lines.append("")
            for issue in result.issues:
                lines.append(f"- {issue.message}")
            if result.warnings:
                lines.append("")
                lines.append("**Warnings:**")
                lines.append("")
                for issue in result.warnings:
                    lines.append(f"- {issue.message}")
            suggestions = [issue.suggestion for issue in result.issues if issue.suggestion]
            if suggestions:
                lines.append("")
                lines.append("**Suggested fix:**")
                lines.append("")
                lines.append(suggestions[0])
            if any("version was not incremented" in issue.message.lower() for issue in result.issues):
                lines.append("")
                lines.append(f"**Current version:** `{result.current_version or 'unknown'}`")
                lines.append("")
                lines.append("**Suggested options:**")
                lines.append("")
                lines.append("- `1.2.1` for a patch-level wording, typo, clarification, or maintenance fix.")
                lines.append("- `1.3.0` for a backward-compatible addition.")
                lines.append("- `2.0.0` for a breaking template, schema, or structural change.")
            lines.append("")
    else:
        lines.append("No failed files.")
        lines.append("")

    lines.append("## Passed Files")
    lines.append("")
    if passed_files:
        for result in passed_files:
            lines.append(f"- `{result.path}`")
    else:
        lines.append("No files passed without blocking errors.")
    lines.append("")
    lines.append("## Recommended next actions")
    lines.append("")
    lines.append("1. Fix blocking frontmatter errors.")
    lines.append("2. Fix markdown structure and formatting issues.")
    lines.append("3. Confirm the correct SemVer increment for changed files.")
    lines.append("4. Re-run the validator.")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    args = parse_args()
    try:
        target = Path(args.target).resolve()
        schema_path = Path(args.schema).resolve()
        report_path = Path(args.report).resolve()
        schema = load_yaml(schema_path)
        if not isinstance(schema, dict):
            raise ConfigurationError("Schema root must be a mapping/object")
        files = iter_target_files(target, args.include, args.exclude)
        if not files:
            raise ConfigurationError("No files matched the requested target and glob filters")
        root = target if target.is_dir() else target.parent
        results = [validate_file(path, root, schema, args.enforce_version_increment, args.base_ref) for path in files]
        report = build_report(results)
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(report, encoding="utf-8")
        return 1 if any(r.issues for r in results) else 0
    except ConfigurationError as exc:
        print(f"Configuration error: {exc}", file=sys.stderr)
        return 2
    except Exception as exc:  # pragma: no cover
        print(f"Runtime error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
