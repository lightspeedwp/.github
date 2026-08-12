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
from typing import Any, Iterable

try:
    import yaml
except ModuleNotFoundError:  # pragma: no cover
    yaml = None

try:
    from jsonschema import Draft7Validator, FormatChecker
except ModuleNotFoundError:  # pragma: no cover
    Draft7Validator = None
    FormatChecker = None

DEFAULT_EXTENSIONS = [".md", ".mdx", ".html", ".php", ".twig", ".njk", ".liquid", ".yml", ".yaml"]
DEFAULT_EXCLUDES = ["node_modules/**", "vendor/**", ".git/**", "dist/**", "build/**", ".next/**", "coverage/**"]
DEFAULT_SCHEMA_KEYS = {"required", "properties", "minProperties", "maxProperties", "additionalProperties"}
MARKDOWN_EXTENSIONS = {".md", ".mdx"}
SEMVER_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+$")
HEADING_RE = re.compile(r"^(#{1,6})\s*(.*)$")
INLINE_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
MALFORMED_LINK_HINT_RE = re.compile(r"\[[^\]]+\]\([^)]*$")


@dataclass
class FileResult:
    path: str
    passed: bool = False
    markdown_issues: list[str] = field(default_factory=list)
    frontmatter_issues: list[str] = field(default_factory=list)
    version_issues: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    suggested_fix: str | None = None

    @property
    def issues(self) -> list[str]:
        return self.frontmatter_issues + self.markdown_issues + self.version_issues


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate content files for Markdown quality, frontmatter compliance, and SemVer rules.")
    parser.add_argument("--target", required=True)
    parser.add_argument("--schema", required=True)
    parser.add_argument("--report")
    parser.add_argument("--include", action="append", default=[])
    parser.add_argument("--exclude", action="append", default=[])
    parser.add_argument("--enforce-version-increment", action="store_true")
    parser.add_argument("--base-ref")
    parser.add_argument("--fail-on-empty", action="store_true")
    return parser.parse_args()


def load_yaml_file(path: Path) -> Any:
    if yaml is None:
        raise RuntimeError("Missing dependency: PyYAML. Install requirements.txt before running the validator.")
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise RuntimeError(f"Schema file not found: {path}") from exc
    except yaml.YAMLError as exc:
        raise RuntimeError(f"Schema YAML is invalid: {exc}") from exc


def deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    merged = copy.deepcopy(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = copy.deepcopy(value)
    return merged


def compile_schema(raw_schema: dict[str, Any], suffix: str | None) -> dict[str, Any]:
    base = {key: copy.deepcopy(raw_schema[key]) for key in DEFAULT_SCHEMA_KEYS if key in raw_schema}
    overrides = raw_schema.get("fileTypeOverrides", {}) or {}
    if suffix and suffix in overrides:
        base = deep_merge(base, overrides[suffix])
    return base


def relative_posix(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def path_variants(path_text: str) -> list[str]:
    parts = path_text.split("/") if path_text else []
    basename = parts[-1] if parts else path_text
    variants = {path_text, f"./{path_text}", basename}
    if len(parts) == 1:
        variants.update({f"**/{path_text}", f"*/{path_text}"})
    return [v for v in variants if v]


def matches_any(path_text: str, patterns: Iterable[str]) -> bool:
    variants = path_variants(path_text)
    return any(fnmatch.fnmatch(variant, pattern) for pattern in patterns for variant in variants)


def default_include_patterns() -> list[str]:
    patterns: list[str] = []
    for ext in DEFAULT_EXTENSIONS:
        patterns.extend([f"*{ext}", f"**/*{ext}"])
    return patterns


def collect_files(target: Path, includes: list[str], excludes: list[str]) -> list[Path]:
    results = []
    for path in target.rglob("*"):
        if not path.is_file():
            continue
        rel = relative_posix(path, target)
        if matches_any(rel, excludes):
            continue
        if matches_any(rel, includes):
            results.append(path)
    return sorted(results)


def split_frontmatter(text: str) -> tuple[str | None, str | None, list[str]]:
    issues: list[str] = []
    if yaml is None:
        return None, None, ["Missing dependency: PyYAML. Install requirements.txt before running the validator."]
    if text.startswith("\ufeff"):
        return None, None, ["BOM marker found before opening frontmatter delimiter."]
    if not (text.startswith("---\n") or text.startswith("---\r\n") or text == "---"):
        return None, None, ["Missing YAML frontmatter at the very top of the file."]
    lines = text.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return None, None, ["Missing YAML frontmatter at the very top of the file."]
    closing_index = None
    for idx in range(1, len(lines)):
        if lines[idx].strip() == "---":
            closing_index = idx
            break
    if closing_index is None:
        return None, None, ["Opening frontmatter delimiter found, but closing delimiter is missing."]
    yaml_block = "".join(lines[1:closing_index])
    body = "".join(lines[closing_index + 1 :])
    return yaml_block, body, issues


def parse_frontmatter(text: str) -> tuple[dict[str, Any] | None, str | None, list[str]]:
    yaml_block, body, issues = split_frontmatter(text)
    if issues:
        return None, body, issues
    try:
        parsed = yaml.safe_load(yaml_block or "") or {}
    except yaml.YAMLError as exc:
        return None, body, [f"Invalid YAML frontmatter: {exc}"]
    if not isinstance(parsed, dict):
        return None, body, ["Frontmatter must parse to a YAML object/map."]
    return parsed, body, []


def build_suggested_fix(data: dict[str, Any] | None, required_fields: list[str], schema_properties: dict[str, Any], schema_defaults: dict[str, Any]) -> str:
    working = dict(data or {})
    for field_name in required_fields:
        if field_name in working:
            continue
        if field_name in schema_defaults:
            working[field_name] = copy.deepcopy(schema_defaults[field_name])
            continue
        property_schema = schema_properties.get(field_name, {}) or {}
        if "default" in property_schema:
            working[field_name] = copy.deepcopy(property_schema["default"])
        elif property_schema.get("enum"):
            working[field_name] = copy.deepcopy(property_schema["enum"][0])
        elif property_schema.get("type") == "array":
            working[field_name] = []
        elif property_schema.get("type") == "object":
            working[field_name] = {}
        elif property_schema.get("type") == "boolean":
            working[field_name] = False
        elif field_name == "title":
            working[field_name] = "Example"
        else:
            working[field_name] = "CHANGE_ME"
    allowed = set(schema_properties.keys())
    if allowed:
        working = {k: v for k, v in working.items() if k in allowed or k in required_fields}
    dumped = yaml.safe_dump(working, sort_keys=False, allow_unicode=True).strip()
    return f"---\n{dumped}\n---"


def validate_markdown_structure(path: Path, body: str, root: Path) -> tuple[list[str], list[str]]:
    issues: list[str] = []
    warnings: list[str] = []
    headings: list[tuple[int, str]] = []
    seen_headings: dict[str, int] = {}
    for line in body.splitlines():
        m = HEADING_RE.match(line)
        if not m:
            continue
        level = len(m.group(1))
        title = m.group(2).strip()
        if not title:
            issues.append(f"Empty heading at level h{level}.")
            continue
        headings.append((level, title))
        key = title.casefold()
        seen_headings[key] = seen_headings.get(key, 0) + 1
    h1_count = sum(1 for level, _ in headings if level == 1)
    if h1_count != 1:
        issues.append(f"Expected exactly one H1, found {h1_count}.")
    prev_level = None
    for level, title in headings:
        if prev_level is not None and level > prev_level + 1:
            issues.append(f"Heading level jumps from h{prev_level} to h{level} at `{title}`.")
        prev_level = level
    for title, count in seen_headings.items():
        if count > 1:
            warnings.append(f"Repeated heading detected: `{title}` appears {count} times.")
    for line in body.splitlines():
        if MALFORMED_LINK_HINT_RE.search(line):
            issues.append("Malformed inline link detected.")
        for _, target in INLINE_LINK_RE.findall(line):
            target = target.strip()
            if not target or target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            link_path = target.split("#", 1)[0]
            if not link_path:
                continue
            candidate = (path.parent / link_path).resolve()
            try:
                candidate.relative_to(root.resolve())
            except ValueError:
                warnings.append(f"Could not safely validate local link target `{target}`.")
                continue
            if not candidate.exists():
                warnings.append(f"Local link target does not exist: `{target}`.")
    return issues, warnings


def parse_semver(version: str) -> tuple[int, int, int] | None:
    if not isinstance(version, str) or not SEMVER_RE.match(version):
        return None
    parts = version.split('.')
    return int(parts[0]), int(parts[1]), int(parts[2])


def git_show_text(base_ref: str, relative_path: str, cwd: Path) -> str | None:
    try:
        result = subprocess.run(
            ["git", "show", f"{base_ref}:{relative_path}"],
            cwd=str(cwd),
            capture_output=True,
            text=True,
            check=False,
        )
    except OSError:
        return None
    if result.returncode != 0:
        return None
    return result.stdout


def strip_version_line(text: str) -> str:
    return "\n".join(line for line in text.splitlines() if not re.match(r"^version\s*:\s*.+$", line.strip()))


def validate_version_increment(current_path: Path, target_root: Path, current_frontmatter: dict[str, Any], body: str, base_ref: str | None) -> tuple[list[str], list[str]]:
    issues: list[str] = []
    warnings: list[str] = []
    if not base_ref:
        warnings.append("Version increment enforcement requested without a base reference.")
        return issues, warnings
    repo_root = target_root.resolve()
    relative_path = relative_posix(current_path, repo_root)
    prior_text = git_show_text(base_ref, relative_path, repo_root)
    if prior_text is None:
        warnings.append(f"Could not compare `{relative_path}` against base ref `{base_ref}`.")
        return issues, warnings
    prior_frontmatter, prior_body, prior_issues = parse_frontmatter(prior_text)
    if prior_issues or prior_frontmatter is None:
        warnings.append(f"Could not parse prior frontmatter for `{relative_path}` from `{base_ref}`.")
        return issues, warnings
    current_version = current_frontmatter.get("version")
    prior_version = prior_frontmatter.get("version")
    current_normalized = strip_version_line(body)
    prior_normalized = strip_version_line(prior_body or "")
    if current_normalized == prior_normalized and current_frontmatter == prior_frontmatter:
        return issues, warnings
    if current_version == prior_version:
        issues.append(f"File changed compared with `{base_ref}` but `version` was not incremented.")
        return issues, warnings
    current_parsed = parse_semver(str(current_version))
    prior_parsed = parse_semver(str(prior_version))
    if current_parsed and prior_parsed and current_parsed <= prior_parsed:
        issues.append(f"Version `{current_version}` is not greater than base version `{prior_version}`.")
    else:
        warnings.append("Version changed, but the correct MAJOR/MINOR/PATCH increment should be confirmed manually.")
    return issues, warnings


def validate_file(path: Path, root: Path, raw_schema: dict[str, Any], enforce_version_increment: bool, base_ref: str | None) -> FileResult:
    result = FileResult(path=relative_posix(path, root))
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        result.frontmatter_issues.append(f"Could not read file: {exc}")
        return result

    frontmatter, body, fm_issues = parse_frontmatter(text)
    result.frontmatter_issues.extend(fm_issues)
    schema = compile_schema(raw_schema, path.suffix.lower())
    schema_properties = schema.get("properties", {}) or {}
    schema_defaults = raw_schema.get("suggestedDefaults", {}) or {}
    effective_required = list(schema.get("required", raw_schema.get("required", [])))

    if fm_issues:
        result.suggested_fix = build_suggested_fix(frontmatter, effective_required, schema_properties, schema_defaults)
        return result

    if Draft7Validator is None or FormatChecker is None:
        result.frontmatter_issues.append("Missing dependency: jsonschema. Install requirements.txt before running the validator.")
        result.suggested_fix = build_suggested_fix(frontmatter, effective_required, schema_properties, schema_defaults)
        return result

    validator = Draft7Validator(schema, format_checker=FormatChecker())
    errors = sorted(validator.iter_errors(frontmatter), key=lambda err: list(err.absolute_path))
    for err in errors:
        field_path = '.'.join(str(part) for part in err.absolute_path)
        result.frontmatter_issues.append(f"{field_path + ': ' if field_path else ''}{err.message}")

    version_value = frontmatter.get("version")
    if version_value is None:
        result.version_issues.append("Missing required frontmatter field: `version`.")
    elif parse_semver(str(version_value)) is None:
        result.version_issues.append("`version` must use SemVer `MAJOR.MINOR.PATCH`.")

    if path.suffix.lower() in MARKDOWN_EXTENSIONS and body is not None:
        md_issues, md_warnings = validate_markdown_structure(path, body, root)
        result.markdown_issues.extend(md_issues)
        result.warnings.extend(md_warnings)

    if enforce_version_increment and not result.version_issues:
        ver_issues, ver_warnings = validate_version_increment(path, root, frontmatter, body or "", base_ref)
        result.version_issues.extend(ver_issues)
        result.warnings.extend(ver_warnings)

    if result.issues:
        result.suggested_fix = build_suggested_fix(frontmatter, effective_required, schema_properties, schema_defaults)
    result.passed = not result.issues
    return result


def render_report(results: list[FileResult], includes: list[str], excludes: list[str], empty_scan_warning: str | None) -> str:
    files_scanned = len(results)
    passed = sum(1 for r in results if r.passed)
    failed = sum(1 for r in results if not r.passed)
    warnings_count = (1 if empty_scan_warning else 0) + sum(len(r.warnings) for r in results)
    markdown_issue_count = sum(len(r.markdown_issues) for r in results)
    frontmatter_issue_count = sum(len(r.frontmatter_issues) for r in results)
    version_issue_count = sum(len(r.version_issues) for r in results)

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
        f"| Markdown issues | {markdown_issue_count} |",
        f"| Frontmatter issues | {frontmatter_issue_count} |",
        f"| Version issues | {version_issue_count} |",
        "",
        "## Scan Settings",
        "",
        f"- Includes: {', '.join(f'`{i}`' for i in includes)}",
        f"- Excludes: {', '.join(f'`{i}`' for i in excludes)}",
        "",
    ]
    if empty_scan_warning:
        lines.extend(["## Warnings", "", f"- {empty_scan_warning}", ""])
    warning_items = [(r.path, w) for r in results for w in r.warnings]
    if warning_items:
        lines.extend(["## Warnings", ""])
        for path, warning in warning_items:
            lines.append(f"- `{path}`: {warning}")
        lines.append("")
    failed_files = [r for r in results if not r.passed]
    if failed_files:
        lines.extend(["## Failed Files", ""])
        for r in failed_files:
            lines.append(f"### `{r.path}`")
            lines.append("")
            lines.append("**Issues:**")
            lines.append("")
            for issue in r.issues:
                lines.append(f"- {issue}")
            if r.suggested_fix:
                lines.extend(["", "**Suggested fix:**", "", "```yaml", r.suggested_fix, "```"])
            lines.append("")
    lines.extend(["## Passed Files", ""])
    passed_files = [r for r in results if r.passed]
    if passed_files:
        for r in passed_files:
            lines.append(f"- `{r.path}`")
    else:
        lines.append("- None")
    lines.extend([
        "",
        "## Recommended next actions",
        "",
        "1. Fix blocking frontmatter errors.",
        "2. Fix markdown structure issues.",
        "3. Confirm the correct SemVer increment for changed files.",
        "4. Re-run the validator.",
        "",
    ])
    return '\n'.join(lines)


def main() -> int:
    args = parse_args()
    target = Path(args.target).resolve()
    schema_path = Path(args.schema).resolve()
    if not target.exists() or not target.is_dir():
        print(f"Target directory not found or not a directory: {target}", file=sys.stderr)
        return 2
    if yaml is None or Draft7Validator is None or FormatChecker is None:
        missing = []
        if yaml is None:
            missing.append("PyYAML")
        if Draft7Validator is None or FormatChecker is None:
            missing.append("jsonschema")
        print(f"Missing dependencies: {', '.join(missing)}. Install requirements.txt before running the validator.", file=sys.stderr)
        return 2
    try:
        raw_schema = load_yaml_file(schema_path)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 2
    if not isinstance(raw_schema, dict):
        print("Schema must be a YAML object/map.", file=sys.stderr)
        return 2
    includes = args.include or default_include_patterns()
    excludes = list(DEFAULT_EXCLUDES) + list(args.exclude or [])
    try:
        files = collect_files(target, includes, excludes)
    except Exception as exc:
        print(f"Failed to collect files: {exc}", file=sys.stderr)
        return 2
    results = [validate_file(path, target, raw_schema, args.enforce_version_increment, args.base_ref) for path in files]
    empty_scan_warning = None
    if not files:
        empty_scan_warning = "No matching files were found for the current target and glob settings."
    report = render_report(results, includes, excludes, empty_scan_warning)
    if args.report:
        Path(args.report).write_text(report, encoding='utf-8')
    else:
        print(report)
    if not files:
        return 1 if args.fail_on_empty else 0
    return 0 if all(r.passed for r in results) else 1


if __name__ == '__main__':
    sys.exit(main())
