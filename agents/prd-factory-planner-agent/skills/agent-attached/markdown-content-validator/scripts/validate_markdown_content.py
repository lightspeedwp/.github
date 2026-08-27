#!/usr/bin/env python3
import argparse
import fnmatch
import re
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

SEMVER_RE = re.compile(r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$")
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n?", re.DOTALL)
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*\S)\s*$")
BULLET_RE = re.compile(r"^(\s*)([-*+])\s+")
DEFAULT_INCLUDE = ["*.md", "*.markdown", "*.mdx"]
DEFAULT_EXCLUDE = [".git/*", "node_modules/*", ".venv/*", "venv/*", "dist/*", "build/*"]


@dataclass
class FileIssue:
    level: str
    message: str
    suggestion: Optional[str] = None


@dataclass
class FileResult:
    path: str
    passed: bool = True
    errors: List[FileIssue] = field(default_factory=list)
    warnings: List[FileIssue] = field(default_factory=list)
    suggestions: List[FileIssue] = field(default_factory=list)
    frontmatter: Dict[str, Any] = field(default_factory=dict)

    def add(self, level: str, message: str, suggestion: Optional[str] = None):
        issue = FileIssue(level=level, message=message, suggestion=suggestion)
        if level == "error":
            self.errors.append(issue)
            self.passed = False
        elif level == "warning":
            self.warnings.append(issue)
        else:
            self.suggestions.append(issue)


class YamlLiteError(Exception):
    pass


class YamlLiteParser:
    def __init__(self, text: str):
        self.lines = text.splitlines()

    def parse(self) -> Any:
        entries = self._preprocess()
        if not entries:
            return {}
        value, next_index = self._parse_block(entries, 0, entries[0][0])
        if next_index != len(entries):
            raise YamlLiteError("Unexpected trailing content")
        return value

    def _preprocess(self) -> List[Tuple[int, str]]:
        processed = []
        for raw in self.lines:
            if not raw.strip():
                continue
            indent = len(raw) - len(raw.lstrip(" "))
            stripped = raw.strip()
            if stripped.startswith("#"):
                continue
            processed.append((indent, stripped))
        return processed

    def _parse_block(self, entries: List[Tuple[int, str]], index: int, indent: int) -> Tuple[Any, int]:
        if entries[index][1].startswith("- "):
            return self._parse_list(entries, index, indent)
        return self._parse_map(entries, index, indent)

    def _parse_list(self, entries: List[Tuple[int, str]], index: int, indent: int) -> Tuple[List[Any], int]:
        items: List[Any] = []
        while index < len(entries):
            current_indent, text = entries[index]
            if current_indent < indent:
                break
            if current_indent != indent or not text.startswith("- "):
                raise YamlLiteError(f"Invalid list structure near `{text}`")
            value_text = text[2:].strip()
            if not value_text:
                if index + 1 >= len(entries) or entries[index + 1][0] <= indent:
                    items.append("")
                    index += 1
                else:
                    value, index = self._parse_block(entries, index + 1, entries[index + 1][0])
                    items.append(value)
            elif ": " in value_text or value_text.endswith(":"):
                pseudo_entries = [(indent + 2, value_text)]
                cursor = index + 1
                while cursor < len(entries) and entries[cursor][0] > indent:
                    pseudo_entries.append(entries[cursor])
                    cursor += 1
                value, _ = self._parse_map(pseudo_entries, 0, indent + 2)
                items.append(value)
                index = cursor
            else:
                items.append(self._parse_scalar(value_text))
                index += 1
        return items, index

    def _parse_map(self, entries: List[Tuple[int, str]], index: int, indent: int) -> Tuple[Dict[str, Any], int]:
        mapping: Dict[str, Any] = {}
        while index < len(entries):
            current_indent, text = entries[index]
            if current_indent < indent:
                break
            if current_indent != indent:
                raise YamlLiteError(f"Invalid indentation near `{text}`")
            if ":" not in text:
                raise YamlLiteError(f"Expected key/value pair near `{text}`")
            key, remainder = text.split(":", 1)
            key = key.strip()
            remainder = remainder.strip()
            if not key:
                raise YamlLiteError("Empty key found in YAML content")
            if remainder:
                mapping[key] = self._parse_scalar(remainder)
                index += 1
            else:
                if index + 1 < len(entries) and entries[index + 1][0] > current_indent:
                    value, index = self._parse_block(entries, index + 1, entries[index + 1][0])
                    mapping[key] = value
                else:
                    mapping[key] = {}
                    index += 1
        return mapping, index

    def _parse_scalar(self, raw: str) -> Any:
        if raw in {"true", "false"}:
            return raw == "true"
        if raw in {"null", "~"}:
            return None
        if raw.startswith('"') and raw.endswith('"') and len(raw) >= 2:
            return raw[1:-1].replace('\\"', '"').replace('\\n', '\n').replace('\\t', '\t').replace('\\\\', '\\')
        if raw.startswith("'") and raw.endswith("'") and len(raw) >= 2:
            return raw[1:-1]
        if re.fullmatch(r"-?[0-9]+", raw):
            try:
                return int(raw)
            except ValueError:
                return raw
        return raw


def parse_yaml_lite(text: str) -> Any:
    return YamlLiteParser(text).parse()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate markdown files, YAML frontmatter, and SemVer metadata.")
    parser.add_argument("--target", required=True)
    parser.add_argument("--schema", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--include", action="append", default=[])
    parser.add_argument("--exclude", action="append", default=[])
    parser.add_argument("--enforce-version-increment", action="store_true")
    parser.add_argument("--base-ref", default=None)
    return parser.parse_args()


def load_schema(schema_path: Path) -> Dict[str, Any]:
    if not schema_path.exists():
        raise FileNotFoundError(f"Schema file not found: {schema_path}")
    content = schema_path.read_text(encoding="utf-8")
    data = parse_yaml_lite(content)
    if not isinstance(data, dict):
        raise YamlLiteError("Schema must parse to a mapping")
    return data


def should_include(path: Path, includes: List[str], excludes: List[str], root: Path) -> bool:
    rel = path.relative_to(root).as_posix()
    if any(fnmatch.fnmatch(rel, pattern) for pattern in excludes):
        return False
    return any(fnmatch.fnmatch(rel, pattern) for pattern in includes)


def discover_files(target: Path, includes: List[str], excludes: List[str]) -> List[Path]:
    if target.is_file():
        return [target]
    matches = []
    for item in target.rglob("*"):
        if item.is_file() and should_include(item, includes, excludes, target):
            matches.append(item)
    return sorted(matches)


def parse_frontmatter(text: str, result: FileResult) -> Tuple[Optional[Dict[str, Any]], str]:
    if text.startswith("\ufeff"):
        result.add("error", "BOM marker detected before frontmatter.")
        return None, text
    if not text.startswith("---\n"):
        result.add("error", "Missing YAML frontmatter at the very top of the file.")
        return None, text
    match = FRONTMATTER_RE.match(text)
    if not match:
        result.add("error", "Frontmatter is malformed or not properly closed with triple dashes.")
        return None, text
    raw = match.group(1)
    body = text[match.end():]
    try:
        data = parse_yaml_lite(raw)
    except Exception as exc:
        result.add("error", f"Frontmatter is not valid YAML: {exc}")
        return None, body
    if not isinstance(data, dict):
        result.add("error", "Frontmatter must parse to a YAML mapping.")
        return None, body
    return data, body


def validate_value(field: str, value: Any, rules: Dict[str, Any], result: FileResult):
    expected_type = rules.get("type")
    if expected_type == "string":
        if not isinstance(value, str):
            result.add("error", f"Frontmatter schema violation at `{field}`: expected string.")
            return
        min_len = rules.get("minLength")
        max_len = rules.get("maxLength")
        if isinstance(min_len, int) and len(value) < min_len:
            result.add("error", f"Frontmatter schema violation at `{field}`: string is shorter than {min_len}.")
        if isinstance(max_len, int) and len(value) > max_len:
            result.add("error", f"Frontmatter schema violation at `{field}`: string is longer than {max_len}.")
        pattern = rules.get("pattern")
        if isinstance(pattern, str) and not re.fullmatch(pattern, value):
            result.add("error", f"Frontmatter schema violation at `{field}`: `{value}` does not match the required pattern.")
        enum = rules.get("enum")
        if isinstance(enum, list) and value not in enum:
            result.add("error", f"Frontmatter schema violation at `{field}`: `{value}` is not an accepted value.")
        if rules.get("format") == "date":
            try:
                datetime.strptime(value, "%Y-%m-%d")
            except ValueError:
                result.add("error", f"Frontmatter schema violation at `{field}`: `{value}` is not a valid date in YYYY-MM-DD format.")
    elif expected_type == "array":
        if not isinstance(value, list):
            result.add("error", f"Frontmatter schema violation at `{field}`: expected array.")
            return
        item_rules = rules.get("items", {})
        for index, item in enumerate(value):
            validate_value(f"{field}[{index}]", item, item_rules, result)
    elif expected_type == "boolean":
        if not isinstance(value, bool):
            result.add("error", f"Frontmatter schema violation at `{field}`: expected boolean.")
    elif expected_type == "integer":
        if not isinstance(value, int):
            result.add("error", f"Frontmatter schema violation at `{field}`: expected integer.")


def validate_schema(frontmatter: Dict[str, Any], schema: Dict[str, Any], result: FileResult):
    required = schema.get("required", [])
    properties = schema.get("properties", {})

    for field in required:
        if field not in frontmatter:
            result.add("error", f"Missing required frontmatter field: `{field}`", suggestion='version: "1.0.0"' if field == "version" else None)

    min_props = schema.get("minProperties")
    max_props = schema.get("maxProperties")
    if isinstance(min_props, int) and len(frontmatter) < min_props:
        result.add("error", f"Frontmatter schema violation at `frontmatter`: expected at least {min_props} properties.")
    if isinstance(max_props, int) and len(frontmatter) > max_props:
        result.add("error", f"Frontmatter schema violation at `frontmatter`: expected at most {max_props} properties.")

    if schema.get("additionalProperties") is False:
        extra = sorted(set(frontmatter.keys()) - set(properties.keys()))
        for key in extra:
            result.add("error", f"Frontmatter schema violation at `{key}`: additional properties are not allowed.")

    for field, rules in properties.items():
        if field in frontmatter and isinstance(rules, dict):
            validate_value(field, frontmatter[field], rules, result)

    version = frontmatter.get("version")
    if version is None:
        return
    if not isinstance(version, str) or not SEMVER_RE.fullmatch(version):
        result.add("error", f"Invalid SemVer version format: `{version}`", suggestion='Use `MAJOR.MINOR.PATCH`, for example `1.0.0`.')


def validate_markdown(body: str, result: FileResult):
    lines = body.splitlines()
    last_heading_level = 0
    seen_headings = set()
    fence_open = False
    last_bullet_by_indent: Dict[int, str] = {}
    blank_run = 0

    for index, line in enumerate(lines, start=1):
        if line.rstrip(" \t") != line:
            result.add("warning", f"Line {index}: trailing whitespace detected.")

        if line == "":
            blank_run += 1
            if blank_run >= 3:
                result.add("suggestion", f"Line {index}: repeated blank lines detected.")
        else:
            blank_run = 0

        if line.startswith("```"):
            if fence_open and index > 1 and lines[index - 2].startswith("```"):
                result.add("warning", f"Line {index - 1}: empty code fence detected.")
            fence_open = not fence_open

        heading_match = HEADING_RE.match(line)
        if heading_match:
            level = len(heading_match.group(1))
            title = heading_match.group(2).strip()
            if not title:
                result.add("error", f"Line {index}: empty heading.")
            if len(title) > 120:
                result.add("suggestion", f"Line {index}: heading is excessively long.")
            if last_heading_level and level > last_heading_level + 1:
                result.add("error", f"Line {index}: heading level jumps from `h{last_heading_level}` to `h{level}`.")
            lowered = title.lower()
            if lowered in seen_headings:
                result.add("warning", f"Line {index}: duplicate heading `{title}`.")
            seen_headings.add(lowered)
            last_heading_level = level

        bullet_match = BULLET_RE.match(line)
        if bullet_match:
            indent = len(bullet_match.group(1))
            marker = bullet_match.group(2)
            prev = last_bullet_by_indent.get(indent)
            if prev and prev != marker:
                result.add("warning", f"Line {index}: inconsistent bullet style at indent level {indent}.")
            last_bullet_by_indent[indent] = marker

        for _, target in LINK_RE.findall(line):
            if target.startswith(("http://", "https://")):
                if " " in target:
                    result.add("warning", f"Line {index}: malformed external link `{target}`.")
            elif target.startswith("#"):
                continue
            else:
                normalized = target.split("#", 1)[0]
                if normalized and not Path(normalized).suffix:
                    result.add("suggestion", f"Line {index}: internal link `{target}` could not be verified automatically.")

        if "|" in line and index < len(lines):
            next_line = lines[index] if index < len(lines) else ""
            if line.count("|") >= 2 and not re.match(r"^\s*\|?\s*[-:]+", next_line):
                result.add("warning", f"Line {index}: possible invalid table formatting.")

    if fence_open:
        result.add("error", "Unclosed code fence detected.")
    if body and not body.endswith("\n"):
        result.add("warning", "Missing final newline.")


def file_from_ref(base_ref: str, path: Path, repo_root: Path) -> Optional[str]:
    rel = path.relative_to(repo_root).as_posix()
    completed = subprocess.run(["git", "show", f"{base_ref}:{rel}"], cwd=repo_root, capture_output=True, text=True)
    if completed.returncode != 0:
        return None
    return completed.stdout


def check_version_increment(path: Path, current_frontmatter: Dict[str, Any], result: FileResult, base_ref: Optional[str], repo_root: Path):
    if not base_ref:
        result.add("warning", "Version increment could not be verified because no previous version was available.")
        return
    previous_text = file_from_ref(base_ref, path, repo_root)
    if previous_text is None:
        result.add("warning", "Version increment could not be verified because no previous version was available.")
        return
    previous_result = FileResult(path=result.path)
    previous_frontmatter, _ = parse_frontmatter(previous_text, previous_result)
    if not previous_frontmatter:
        result.add("warning", "Version increment could not be verified because the previous file state had invalid or missing frontmatter.")
        return
    current_version = current_frontmatter.get("version")
    previous_version = previous_frontmatter.get("version")
    if current_version == previous_version:
        result.add("warning", f"File changed but version was not incremented. Current version: `{current_version}`.", suggestion="Use PATCH for small fixes, MINOR for backward-compatible additions, or MAJOR for breaking structural changes.")


def make_report(results: List[FileResult], report_path: Path):
    files_scanned = len(results)
    passed = sum(1 for item in results if item.passed and not item.warnings)
    failed = files_scanned - passed
    warning_count = sum(len(item.warnings) for item in results)
    markdown_issues = sum(len([i for i in item.errors + item.warnings + item.suggestions if "frontmatter" not in i.message.lower() and "version" not in i.message.lower()]) for item in results)
    frontmatter_issues = sum(len([i for i in item.errors + item.warnings if "frontmatter" in i.message.lower()]) for item in results)
    missing_version = sum(len([i for i in item.errors if "Missing required frontmatter field: `version`" in i.message]) for item in results)
    invalid_version = sum(len([i for i in item.errors if "Invalid SemVer version format" in i.message]) for item in results)
    unchanged_version = sum(len([i for i in item.warnings if "version was not incremented" in i.message]) for item in results)

    lines = [
        "# Markdown Content Validation Report",
        "",
        "## Summary",
        "",
        "| Metric | Count |",
        "|---|---:|",
        f"| Files scanned | {files_scanned} |",
        f"| Passed | {passed} |",
        f"| Failed | {failed} |",
        f"| Warnings | {warning_count} |",
        f"| Markdown issues | {markdown_issues} |",
        f"| Frontmatter issues | {frontmatter_issues} |",
        f"| Missing version | {missing_version} |",
        f"| Invalid version format | {invalid_version} |",
        f"| Changed without version increment | {unchanged_version} |",
        "",
        "## Failed Files",
        "",
    ]

    failed_items = [item for item in results if not item.passed or item.warnings or item.suggestions]
    if not failed_items:
        lines.extend(["No failed or warning-level files.", ""])
    else:
        for item in failed_items:
            lines.append(f"### `{item.path}`")
            lines.append("")
            lines.append("**Issues:**")
            lines.append("")
            for group in (item.errors, item.warnings, item.suggestions):
                for issue in group:
                    lines.append(f"- {issue.message}")
            lines.append("")
            suggestions = [issue.suggestion for issue in item.errors + item.warnings + item.suggestions if issue.suggestion]
            if suggestions:
                lines.append("**Suggested fix:**")
                lines.append("")
                lines.append("```text")
                lines.extend(suggestions)
                lines.append("```")
                lines.append("")

    lines.extend(["## Passed Files", ""])
    passed_files = [item.path for item in results if item.passed and not item.warnings and not item.suggestions]
    if passed_files:
        for item in passed_files:
            lines.append(f"- `{item}`")
    else:
        lines.append("None")

    lines.extend([
        "",
        "## Recommended next actions",
        "",
        "1. Fix blocking frontmatter errors.",
        "2. Fix markdown structure and formatting issues.",
        "3. Confirm the correct SemVer increment for changed files.",
        "4. Re-run the validator.",
        "",
    ])
    report_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    args = parse_args()
    target = Path(args.target).resolve()
    schema_path = Path(args.schema).resolve()
    report_path = Path(args.report).resolve()

    if not target.exists():
        print(f"Target path does not exist: {target}", file=sys.stderr)
        return 2

    try:
        schema = load_schema(schema_path)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2

    includes = args.include or DEFAULT_INCLUDE
    excludes = DEFAULT_EXCLUDE + args.exclude

    try:
        files = discover_files(target, includes, excludes)
    except Exception as exc:
        print(f"Failed to discover files: {exc}", file=sys.stderr)
        return 2

    if not files:
        print("No files matched the target and include/exclude rules.", file=sys.stderr)
        return 2

    repo_root = Path.cwd()
    results: List[FileResult] = []

    for file_path in files:
        relative = file_path.relative_to(target if target.is_dir() else file_path.parent).as_posix() if target.is_dir() else file_path.name
        result = FileResult(path=relative)
        try:
            text = file_path.read_text(encoding="utf-8")
        except Exception as exc:
            result.add("error", f"Could not read file: {exc}")
            results.append(result)
            continue

        frontmatter, body = parse_frontmatter(text, result)
        if frontmatter is not None:
            result.frontmatter = frontmatter
            validate_schema(frontmatter, schema, result)
            if args.enforce_version_increment:
                check_version_increment(file_path, frontmatter, result, args.base_ref, repo_root)
        validate_markdown(body if frontmatter is not None else text, result)
        results.append(result)

    try:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        make_report(results, report_path)
    except Exception as exc:
        print(f"Failed to write report: {exc}", file=sys.stderr)
        return 2

    if any(not item.passed for item in results):
        return 1
    if any(item.warnings for item in results):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
