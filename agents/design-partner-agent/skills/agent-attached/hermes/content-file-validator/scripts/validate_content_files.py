#!/usr/bin/env python3
from __future__ import annotations

import argparse
import copy
import datetime as dt
import fnmatch
import hashlib
import json
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Set, Tuple

DEFAULT_EXTENSIONS = [
    ".md", ".mdx", ".html", ".php", ".twig", ".njk", ".liquid", ".yml", ".yaml",
]
DEFAULT_EXCLUDES = [
    "node_modules/**", "vendor/**", ".git/**", "dist/**", "build/**", ".next/**", "coverage/**",
]
SEMVER_RE = re.compile(r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$")
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---(?:\n|\Z)", re.DOTALL)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*\S)?\s*$")
MARKDOWN_LINK_RE = re.compile(r'\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
MUSTACHE_RE = re.compile(r"{{\s*([a-zA-Z0-9_.-]+)\s*}}")

FRONTMATTER_EXTENSIONS = {".md", ".mdx", ".html", ".php", ".twig", ".njk", ".liquid"}
MARKDOWN_EXTENSIONS = {".md", ".mdx"}
YAML_EXTENSIONS = {".yml", ".yaml"}


class ConfigurationError(Exception):
    pass


@dataclass
class Issue:
    category: str
    message: str
    suggestion: Optional[str] = None


@dataclass
class FileResult:
    path: str
    passed: bool = False
    markdown_issues: List[Issue] = field(default_factory=list)
    frontmatter_issues: List[Issue] = field(default_factory=list)
    version_issues: List[Issue] = field(default_factory=list)
    handoff_issues: List[Issue] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    @property
    def all_issues(self) -> List[Issue]:
        return self.markdown_issues + self.frontmatter_issues + self.version_issues + self.handoff_issues


@dataclass
class SchemaBundle:
    root: Dict[str, Any]
    overrides: Dict[str, Dict[str, Any]]


@dataclass(order=True, frozen=True)
class SemVer:
    major: int
    minor: int
    patch: int

    @classmethod
    def parse(cls, value: str) -> "SemVer":
        match = SEMVER_RE.fullmatch(value)
        if not match:
            raise ValueError(value)
        return cls(*(int(part) for part in match.groups()))

    def bump(self, level: str) -> "SemVer":
        if level == "major":
            return SemVer(self.major + 1, 0, 0)
        if level == "minor":
            return SemVer(self.major, self.minor + 1, 0)
        if level == "patch":
            return SemVer(self.major, self.minor, self.patch + 1)
        raise ValueError(level)

    def __str__(self) -> str:
        return f"{self.major}.{self.minor}.{self.patch}"


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate Markdown, schema, and handoff content files.")
    parser.add_argument("--target", required=True)
    parser.add_argument("--schema", required=True)
    parser.add_argument("--report")
    parser.add_argument("--include", action="append", default=[])
    parser.add_argument("--exclude", action="append", default=[])
    parser.add_argument("--baseline")
    parser.add_argument("--base-ref")
    parser.add_argument("--change-level", choices=["major", "minor", "patch"])
    parser.add_argument("--enforce-version-increment", action="store_true")
    parser.add_argument("--handoff-manifest")
    return parser.parse_args(argv)


def normalize(path: Path) -> str:
    return path.as_posix()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="strict")


def parse_scalar(value: str) -> Any:
    value = value.strip()
    if value in {"true", "false"}:
        return value == "true"
    if value in {"null", "~"}:
        return None
    if value.startswith('"') and value.endswith('"'):
        return json.loads(value)
    if value.startswith("'") and value.endswith("'"):
        return value[1:-1].replace("\\'", "'").replace("\\\\", "\\")
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    if re.fullmatch(r"-?\d+\.\d+", value):
        return float(value)
    return value


def parse_yaml_text(text: str) -> Any:
    cleaned: List[Tuple[int, str]] = []
    for raw in text.splitlines():
        if not raw.strip():
            continue
        if raw.lstrip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        cleaned.append((indent, raw.rstrip()))

    def parse_node(index: int, indent: int) -> Tuple[Any, int]:
        if index >= len(cleaned):
            return {}, index
        current_indent, current_line = cleaned[index]
        if current_indent < indent:
            return {}, index
        if current_line.strip().startswith("- "):
            return parse_list(index, indent)
        return parse_map(index, indent)

    def parse_list(index: int, indent: int) -> Tuple[List[Any], int]:
        items: List[Any] = []
        while index < len(cleaned):
            current_indent, line = cleaned[index]
            if current_indent < indent:
                break
            if current_indent != indent or not line.strip().startswith("- "):
                break
            content = line.strip()[2:].strip()
            index += 1
            if not content:
                nested, index = parse_node(index, indent + 2)
                items.append(nested)
                continue
            if ":" in content:
                key, raw_value = content.split(":", 1)
                key = key.strip()
                raw_value = raw_value.strip()
                item: Dict[str, Any] = {}
                if raw_value:
                    item[key] = parse_scalar(raw_value)
                else:
                    if index < len(cleaned) and cleaned[index][0] > indent:
                        nested, index = parse_node(index, indent + 2)
                        item[key] = nested
                    else:
                        item[key] = {}
                while index < len(cleaned):
                    next_indent, next_line = cleaned[index]
                    if next_indent < indent + 2:
                        break
                    if next_line.strip().startswith("- "):
                        break
                    if next_indent != indent + 2:
                        raise ConfigurationError(f"Invalid YAML indentation near: {next_line.strip()}")
                    stripped = next_line.strip()
                    if ":" not in stripped:
                        raise ConfigurationError(f"Invalid YAML mapping near: {stripped}")
                    nested_key, nested_value = stripped.split(":", 1)
                    nested_key = nested_key.strip()
                    nested_value = nested_value.strip()
                    index += 1
                    if nested_value:
                        item[nested_key] = parse_scalar(nested_value)
                    else:
                        if index < len(cleaned) and cleaned[index][0] > next_indent:
                            nested, index = parse_node(index, next_indent + 2)
                            item[nested_key] = nested
                        else:
                            item[nested_key] = {}
                items.append(item)
                continue
            items.append(parse_scalar(content))
        return items, index

    def parse_map(index: int, indent: int) -> Tuple[Dict[str, Any], int]:
        obj: Dict[str, Any] = {}
        while index < len(cleaned):
            current_indent, line = cleaned[index]
            if current_indent < indent:
                break
            if current_indent != indent:
                raise ConfigurationError(f"Unexpected indentation near: {line.strip()}")
            stripped = line.strip()
            if stripped.startswith("- "):
                raise ConfigurationError(f"Unexpected list item near: {stripped}")
            if ":" not in stripped:
                raise ConfigurationError(f"Invalid YAML line: {stripped}")
            key, raw_value = stripped.split(":", 1)
            key = key.strip()
            raw_value = raw_value.strip()
            index += 1
            if raw_value:
                obj[key] = parse_scalar(raw_value)
                continue
            if index < len(cleaned) and cleaned[index][0] > current_indent:
                nested, index = parse_node(index, current_indent + 2)
                obj[key] = nested
            else:
                obj[key] = {}
        return obj, index

    if not cleaned:
        return {}
    parsed, index = parse_node(0, cleaned[0][0])
    if index != len(cleaned):
        raise ConfigurationError("Could not parse the full YAML payload.")
    return parsed


def dump_yaml_value(value: Any, indent: int = 0) -> List[str]:
    pad = " " * indent
    lines: List[str] = []
    if isinstance(value, dict):
        for key, nested in value.items():
            if isinstance(nested, (dict, list)):
                lines.append(f"{pad}{key}:")
                lines.extend(dump_yaml_value(nested, indent + 2))
            elif nested is True:
                lines.append(f"{pad}{key}: true")
            elif nested is False:
                lines.append(f"{pad}{key}: false")
            elif nested is None:
                lines.append(f"{pad}{key}: null")
            elif isinstance(nested, (int, float)):
                lines.append(f"{pad}{key}: {nested}")
            else:
                text = str(nested)
                if any(ch in text for ch in [":", "#"]) or text == "" or text.strip() != text:
                    text = json.dumps(text)
                lines.append(f"{pad}{key}: {text}")
        return lines
    if isinstance(value, list):
        for item in value:
            if isinstance(item, dict):
                first = True
                for key, nested in item.items():
                    if first and not isinstance(nested, (dict, list)):
                        text = json.dumps(str(nested)) if isinstance(nested, str) and (":" in nested or "#" in nested or nested.strip() != nested) else nested
                        lines.append(f"{pad}- {key}: {text}")
                        first = False
                    else:
                        if first:
                            lines.append(f"{pad}- {key}:")
                            first = False
                        else:
                            lines.append(f"{pad}  {key}:")
                        lines.extend(dump_yaml_value(nested, indent + 4))
            else:
                lines.append(f"{pad}- {item}")
        return lines
    return [f"{pad}{value}"]


def load_yaml_text(text: str, source_label: str) -> Any:
    try:
        return parse_yaml_text(text)
    except ConfigurationError as exc:
        raise ConfigurationError(f"{source_label} is not valid YAML:\n{exc}") from exc


def load_yaml_file(path: Path, source_label: str) -> Any:
    if not path.exists():
        raise ConfigurationError(f"{source_label} not found: {path}")
    return load_yaml_text(read_text(path), source_label)


def build_schema_bundle(raw: Dict[str, Any]) -> SchemaBundle:
    if not isinstance(raw, dict):
        raise ConfigurationError("Schema file must parse to a mapping.")
    schema = copy.deepcopy(raw)
    overrides = schema.pop("overrides", {}) or {}
    if not isinstance(overrides, dict):
        raise ConfigurationError("Schema overrides must be a mapping.")
    if schema.get("type") != "object":
        raise ConfigurationError("Top-level schema type must be `object`.")
    return SchemaBundle(root=schema, overrides=overrides)


def schema_for_file(bundle: SchemaBundle, relative_path: str) -> Dict[str, Any]:
    schema = copy.deepcopy(bundle.root)
    for pattern, override in bundle.overrides.items():
        if fnmatch.fnmatch(relative_path, pattern):
            schema = deep_merge(schema, copy.deepcopy(override))
    return schema


def deep_merge(base: Dict[str, Any], override: Dict[str, Any]) -> Dict[str, Any]:
    for key, value in override.items():
        if key in base and isinstance(base[key], dict) and isinstance(value, dict):
            base[key] = deep_merge(base[key], value)
        else:
            base[key] = copy.deepcopy(value)
    return base


def should_include(relative_path: str, includes: Sequence[str], excludes: Sequence[str]) -> bool:
    if any(fnmatch.fnmatch(relative_path, pattern) for pattern in excludes):
        return False
    if includes:
        return any(fnmatch.fnmatch(relative_path, pattern) for pattern in includes)
    return any(relative_path.endswith(ext) for ext in DEFAULT_EXTENSIONS)


def iter_files(root: Path, includes: Sequence[str], excludes: Sequence[str]) -> Iterable[Path]:
    for path in sorted(root.rglob("*")):
        if path.is_file():
            rel = normalize(path.relative_to(root))
            if should_include(rel, includes, excludes):
                yield path


def parse_frontmatter(text: str) -> Tuple[Optional[Dict[str, Any]], List[Issue]]:
    issues: List[Issue] = []
    if text.startswith("\ufeff"):
        issues.append(Issue("frontmatter", "File begins with a BOM before the opening frontmatter fence."))
        return None, issues
    if not text.startswith("---"):
        issues.append(Issue("frontmatter", "File does not start with YAML frontmatter at the top of the document."))
        return None, issues
    match = FRONTMATTER_RE.match(text)
    if not match:
        issues.append(Issue("frontmatter", "Frontmatter fence is incomplete or malformed."))
        return None, issues
    try:
        parsed = parse_yaml_text(match.group(1)) if match.group(1).strip() else {}
    except ConfigurationError as exc:
        issues.append(Issue("frontmatter", f"Frontmatter is not valid YAML: {exc}"))
        return None, issues
    if parsed is None:
        parsed = {}
    if not isinstance(parsed, dict):
        issues.append(Issue("frontmatter", "Frontmatter must parse to a mapping."))
        return None, issues
    return parsed, issues


def strip_frontmatter(text: str) -> str:
    match = FRONTMATTER_RE.match(text)
    return text[match.end():] if match else text


def validate_markdown(relative_path: str, text: str, root: Path) -> List[Issue]:
    if Path(relative_path).suffix not in MARKDOWN_EXTENSIONS:
        return []
    body = strip_frontmatter(text)
    issues: List[Issue] = []
    headings: List[Tuple[int, str, int]] = []
    heading_counts: Dict[str, int] = {}

    for line_no, line in enumerate(body.splitlines(), start=1):
        match = HEADING_RE.match(line)
        if match:
            level = len(match.group(1))
            title = (match.group(2) or "").strip()
            if not title:
                issues.append(Issue("markdown", f"Empty heading on line {line_no}."))
            headings.append((level, title, line_no))
            if title:
                key = title.lower()
                heading_counts[key] = heading_counts.get(key, 0) + 1

    h1_count = sum(1 for level, _, _ in headings if level == 1)
    if h1_count == 0:
        issues.append(Issue("markdown", "Markdown file is missing an H1 heading."))
    elif h1_count > 1:
        issues.append(Issue("markdown", f"Markdown file contains multiple H1 headings ({h1_count})."))

    seen_repeat_reported: Set[str] = set()
    previous_level: Optional[int] = None
    for level, title, line_no in headings:
        if previous_level is not None and level > previous_level + 1:
            issues.append(Issue("markdown", f"Heading level jumps from h{previous_level} to h{level} on line {line_no}."))
        previous_level = level
        if title and heading_counts.get(title.lower(), 0) > 1 and title.lower() not in seen_repeat_reported:
            issues.append(Issue("markdown", f"Repeated heading: `{title}`."))
            seen_repeat_reported.add(title.lower())

    link_spans = list(MARKDOWN_LINK_RE.finditer(body))
    if ("[" in body and not link_spans) or body.count("[") != body.count("]"):
        issues.append(Issue("markdown", "Potential malformed Markdown link syntax detected."))

    for match in link_spans:
        target = match.group(2)
        if target.startswith(("http://", "https://", "mailto:", "#")):
            continue
        target_path = target.split("#", 1)[0]
        if not target_path:
            continue
        resolved = (root / target_path).resolve()
        if not resolved.exists():
            issues.append(Issue("markdown", f"Broken local link target: `{target}`."))
    return issues


def validate_date_string(value: str) -> bool:
    try:
        dt.date.fromisoformat(value)
    except ValueError:
        return False
    return True


def validate_schema_value(value: Any, schema: Dict[str, Any], field: str) -> List[Issue]:
    issues: List[Issue] = []
    expected_type = schema.get("type")
    type_map = {
        "string": str,
        "array": list,
        "boolean": bool,
        "object": dict,
        "integer": int,
        "number": (int, float),
    }
    if expected_type in type_map and not isinstance(value, type_map[expected_type]):
        issues.append(Issue("frontmatter", f"{field}: expected {expected_type}."))
        return issues

    if isinstance(value, str):
        min_length = schema.get("minLength")
        max_length = schema.get("maxLength")
        if isinstance(min_length, int) and len(value) < min_length:
            issues.append(Issue("frontmatter", f"{field}: string is shorter than the minimum length {min_length}."))
        if isinstance(max_length, int) and len(value) > max_length:
            issues.append(Issue("frontmatter", f"{field}: string is longer than the maximum length {max_length}."))
        pattern = schema.get("pattern")
        if isinstance(pattern, str) and not re.fullmatch(pattern, value):
            issues.append(Issue("frontmatter", f"{field}: value does not match required pattern `{pattern}`."))
        if schema.get("format") == "date" and not validate_date_string(value):
            issues.append(Issue("frontmatter", f"{field}: value is not a valid ISO date."))

    enum = schema.get("enum")
    if isinstance(enum, list) and value not in enum:
        issues.append(Issue("frontmatter", f"{field}: value `{value}` is not in the allowed set {enum}."))

    if isinstance(value, list) and isinstance(schema.get("items"), dict):
        for idx, item in enumerate(value):
            issues.extend(validate_schema_value(item, schema["items"], f"{field}[{idx}]"))

    if isinstance(value, dict) and isinstance(schema.get("properties"), dict):
        nested_required = schema.get("required", [])
        nested_props = schema.get("properties", {})
        for nested_field in nested_required:
            if nested_field not in value:
                issues.append(Issue("frontmatter", f"{field}.{nested_field}: missing required field."))
        for nested_key, nested_value in value.items():
            if nested_key in nested_props and isinstance(nested_props[nested_key], dict):
                issues.extend(validate_schema_value(nested_value, nested_props[nested_key], f"{field}.{nested_key}"))
    return issues


def validate_frontmatter_data(data: Dict[str, Any], schema: Dict[str, Any]) -> List[Issue]:
    issues: List[Issue] = []
    required = schema.get("required", [])
    properties = schema.get("properties", {})
    additional = schema.get("additionalProperties", True)
    min_props = schema.get("minProperties")
    max_props = schema.get("maxProperties")

    for field in required:
        if field not in data:
            issues.append(Issue("frontmatter", f"Missing required frontmatter field: `{field}`."))

    if isinstance(min_props, int) and len(data) < min_props:
        issues.append(Issue("frontmatter", f"Frontmatter has fewer than {min_props} properties."))
    if isinstance(max_props, int) and len(data) > max_props:
        issues.append(Issue("frontmatter", f"Frontmatter has more than {max_props} properties."))

    if additional is False:
        for key in data.keys():
            if key not in properties:
                issues.append(Issue("frontmatter", f"Disallowed frontmatter field: `{key}`."))

    for key, value in data.items():
        if key in properties and isinstance(properties[key], dict):
            issues.extend(validate_schema_value(value, properties[key], key))
    return issues


def suggested_frontmatter(data: Optional[Dict[str, Any]], schema: Dict[str, Any]) -> str:
    properties = schema.get("properties", {})
    required = schema.get("required", [])
    suggestion = copy.deepcopy(data) if isinstance(data, dict) else {}
    for field in required:
        if field in suggestion:
            continue
        prop = properties.get(field, {})
        if field == "version":
            suggestion[field] = "1.0.0"
        elif isinstance(prop.get("enum"), list) and prop["enum"]:
            suggestion[field] = prop["enum"][0]
        elif prop.get("type") == "array":
            suggestion[field] = []
        elif prop.get("type") == "object":
            suggestion[field] = {}
        else:
            suggestion[field] = ""
    return "---\n" + "\n".join(dump_yaml_value(suggestion)).rstrip() + "\n---"


def compute_signature(text: str, frontmatter: Optional[Dict[str, Any]]) -> str:
    meta = copy.deepcopy(frontmatter) if isinstance(frontmatter, dict) else {}
    meta.pop("version", None)
    payload = {"frontmatter": meta, "body": strip_frontmatter(text)}
    return hashlib.sha256(json.dumps(payload, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()


def git_root_for(path: Path) -> Optional[Path]:
    try:
        result = subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=path, capture_output=True, text=True, check=True)
    except Exception:
        return None
    root = result.stdout.strip()
    return Path(root) if root else None


def read_git_base_file(target_root: Path, relative_path: str, base_ref: str) -> Optional[str]:
    repo_root = git_root_for(target_root)
    if repo_root is None:
        return None
    abs_target = (target_root / relative_path).resolve()
    try:
        rel_to_repo = abs_target.relative_to(repo_root.resolve()).as_posix()
    except ValueError:
        return None
    try:
        result = subprocess.run(["git", "show", f"{base_ref}:{rel_to_repo}"], cwd=repo_root, capture_output=True, text=True, check=True)
    except Exception:
        return None
    return result.stdout


def compare_versions(relative_path: str, text: str, frontmatter: Optional[Dict[str, Any]], baseline_root: Optional[Path], base_ref: Optional[str], target_root: Path, enforce_increment: bool, change_level: Optional[str]) -> Tuple[List[Issue], List[str]]:
    issues: List[Issue] = []
    warnings: List[str] = []
    baseline_text: Optional[str] = None

    if baseline_root:
        candidate = baseline_root / relative_path
        if candidate.exists() and candidate.is_file():
            baseline_text = read_text(candidate)
    elif base_ref:
        baseline_text = read_git_base_file(target_root, relative_path, base_ref)

    if baseline_text is None or frontmatter is None:
        return issues, warnings

    baseline_frontmatter, baseline_parse_issues = parse_frontmatter(baseline_text)
    if baseline_parse_issues or baseline_frontmatter is None:
        warnings.append("Baseline comparison was skipped because the baseline file has invalid or missing frontmatter.")
        return issues, warnings

    if compute_signature(text, frontmatter) == compute_signature(baseline_text, baseline_frontmatter):
        return issues, warnings

    current_version = frontmatter.get("version")
    baseline_version = baseline_frontmatter.get("version")
    if not isinstance(current_version, str) or not isinstance(baseline_version, str):
        issues.append(Issue("version", "Changed file could not be compared because the current or baseline `version` field is missing or not a string."))
        return issues, warnings

    try:
        current_semver = SemVer.parse(current_version)
        baseline_semver = SemVer.parse(baseline_version)
    except ValueError:
        issues.append(Issue("version", "Changed file could not be compared because the current or baseline `version` is not valid semantic versioning."))
        return issues, warnings

    if enforce_increment and current_semver <= baseline_semver:
        issues.append(Issue("version", f"File changed relative to baseline, but version did not increase. Previous version was {baseline_semver}; current version is {current_semver}."))
        return issues, warnings

    if change_level:
        expected = baseline_semver.bump(change_level)
        if current_semver != expected:
            issues.append(Issue("version", f"File changed relative to baseline and expected a {change_level} bump from {baseline_semver} to {expected}, but found {current_semver}."))
    else:
        warnings.append("Changed file detected. Confirm the intended SemVer change type (major, minor, or patch) if the correct increment is not obvious.")

    return issues, warnings


def extract_placeholders(text: str) -> Set[str]:
    return {match.group(1).strip() for match in MUSTACHE_RE.finditer(text)}


def validate_yaml_file(relative_path: str, text: str) -> List[Issue]:
    if Path(relative_path).suffix not in YAML_EXTENSIONS:
        return []
    try:
        parse_yaml_text(text)
    except ConfigurationError as exc:
        return [Issue("handoff", f"YAML file is not valid: {exc}")]
    return []


def append_issue(bucket: Dict[str, List[Issue]], relative_path: str, issue: Issue) -> None:
    bucket.setdefault(relative_path, []).append(issue)


def validate_handoff_manifest(target_root: Path, manifest_path: Path) -> Dict[str, List[Issue]]:
    issues_by_path: Dict[str, List[Issue]] = {}
    manifest_rel = normalize(manifest_path.relative_to(target_root))
    manifest = load_yaml_file(manifest_path, "Handoff manifest")
    if not isinstance(manifest, dict):
        append_issue(issues_by_path, manifest_rel, Issue("handoff", "Handoff manifest must parse to a mapping."))
        return issues_by_path

    templates = manifest.get("templates")
    if not isinstance(templates, list) or not templates:
        append_issue(issues_by_path, manifest_rel, Issue("handoff", "Handoff manifest must include at least one template entry."))
        return issues_by_path

    required_manifest_fields = {"template_id", "template_path", "schema_path", "source_artifact", "handoff_target"}
    for index, entry in enumerate(templates):
        if not isinstance(entry, dict):
            append_issue(issues_by_path, manifest_rel, Issue("handoff", f"Manifest entry {index} must be a mapping."))
            continue
        missing_manifest_fields = sorted(required_manifest_fields - set(entry.keys()))
        if missing_manifest_fields:
            append_issue(issues_by_path, manifest_rel, Issue("handoff", f"Manifest entry `{entry.get('template_id', index)}` is missing required fields: {missing_manifest_fields}."))
            continue

        template_rel = str(entry["template_path"])
        schema_rel = str(entry["schema_path"])
        template_path = (target_root / template_rel).resolve()
        schema_path = (target_root / schema_rel).resolve()

        if not template_path.exists():
            append_issue(issues_by_path, manifest_rel, Issue("handoff", f"Manifest entry `{entry['template_id']}` references a missing template file: `{template_rel}`."))
            continue
        if not schema_path.exists():
            append_issue(issues_by_path, manifest_rel, Issue("handoff", f"Manifest entry `{entry['template_id']}` references a missing schema file: `{schema_rel}`."))
            continue

        try:
            schema_data = load_yaml_file(schema_path, f"Handoff schema `{schema_rel}`")
        except ConfigurationError as exc:
            append_issue(issues_by_path, schema_rel, Issue("handoff", str(exc)))
            continue
        if not isinstance(schema_data, dict):
            append_issue(issues_by_path, schema_rel, Issue("handoff", "Handoff schema must parse to a mapping."))
            continue

        template_text = read_text(template_path)
        template_rel_norm = normalize(template_path.relative_to(target_root))
        schema_rel_norm = normalize(schema_path.relative_to(target_root))

        if schema_data.get("template_id") != entry["template_id"]:
            append_issue(issues_by_path, schema_rel_norm, Issue("handoff", f"Schema template_id `{schema_data.get('template_id')}` does not match manifest template_id `{entry['template_id']}`."))
        if schema_data.get("handoff_target") != entry["handoff_target"]:
            append_issue(issues_by_path, schema_rel_norm, Issue("handoff", f"Schema handoff_target `{schema_data.get('handoff_target')}` does not match manifest handoff_target `{entry['handoff_target']}`."))
        if schema_data.get("source_artifact") != entry["source_artifact"]:
            append_issue(issues_by_path, schema_rel_norm, Issue("handoff", f"Schema source_artifact `{schema_data.get('source_artifact')}` does not match manifest source_artifact `{entry['source_artifact']}`."))

        for required_key in ["schema_version", "template_id", "source_artifact", "handoff_target", "template", "intake", "downstream"]:
            if required_key not in schema_data:
                append_issue(issues_by_path, schema_rel_norm, Issue("handoff", f"Handoff schema is missing required top-level field `{required_key}`."))

        template_block = schema_data.get("template", {}) if isinstance(schema_data.get("template"), dict) else {}
        intake_block = schema_data.get("intake", {}) if isinstance(schema_data.get("intake"), dict) else {}
        downstream_block = schema_data.get("downstream", {}) if isinstance(schema_data.get("downstream"), dict) else {}

        required_sections = template_block.get("required_sections", []) or []
        required_placeholders = set(template_block.get("required_placeholders", []) or [])
        optional_placeholders = set(template_block.get("optional_placeholders", []) or [])
        intake_values = set(intake_block.get("required_values", []) or [])
        downstream_values = set(downstream_block.get("required_values", []) or [])
        declared_placeholders = required_placeholders | optional_placeholders
        actual_placeholders = extract_placeholders(template_text)

        for section in required_sections:
            if section not in template_text:
                append_issue(issues_by_path, template_rel_norm, Issue("handoff", f"Template is missing required section `{section}`."))

        missing_required_placeholders = sorted(required_placeholders - actual_placeholders)
        for placeholder in missing_required_placeholders:
            append_issue(issues_by_path, template_rel_norm, Issue("handoff", f"Template is missing required placeholder `{{{{{placeholder}}}}}`."))

        unknown_placeholders = sorted(actual_placeholders - declared_placeholders)
        for placeholder in unknown_placeholders:
            append_issue(issues_by_path, template_rel_norm, Issue("handoff", f"Template uses placeholder `{{{{{placeholder}}}}}` that is not declared in the matching schema."))

        missing_intake_values = sorted(intake_values - actual_placeholders)
        for value in missing_intake_values:
            append_issue(issues_by_path, template_rel_norm, Issue("handoff", f"Template does not capture required intake value `{value}` for the next workflow step."))

        missing_downstream_values = sorted(downstream_values - actual_placeholders)
        for value in missing_downstream_values:
            append_issue(issues_by_path, template_rel_norm, Issue("handoff", f"Template does not capture downstream-required value `{value}` needed for the destination workflow."))

    return issues_by_path


def validate_file(path: Path, root: Path, bundle: SchemaBundle, baseline_root: Optional[Path], base_ref: Optional[str], enforce_increment: bool, change_level: Optional[str], handoff_issues_by_path: Dict[str, List[Issue]]) -> FileResult:
    relative_path = normalize(path.relative_to(root))
    suffix = path.suffix.lower()
    result = FileResult(path=relative_path)
    text = read_text(path)

    result.markdown_issues.extend(validate_markdown(relative_path, text, root))

    if suffix in FRONTMATTER_EXTENSIONS:
        frontmatter, parse_issues = parse_frontmatter(text)
        result.frontmatter_issues.extend(parse_issues)
        schema = schema_for_file(bundle, relative_path)
        if frontmatter is not None:
            result.frontmatter_issues.extend(validate_frontmatter_data(frontmatter, schema))
            version = frontmatter.get("version")
            if version is None:
                result.version_issues.append(Issue("version", "Missing required frontmatter field: `version`.", suggestion=suggested_frontmatter(frontmatter, schema)))
            elif not isinstance(version, str) or not SEMVER_RE.fullmatch(version):
                result.version_issues.append(Issue("version", "`version` must use SemVer `MAJOR.MINOR.PATCH`, for example `1.0.0`."))
            compare_issues, compare_warnings = compare_versions(relative_path, text, frontmatter, baseline_root, base_ref, root, enforce_increment, change_level)
            result.version_issues.extend(compare_issues)
            result.warnings.extend(compare_warnings)
        else:
            result.frontmatter_issues = [Issue(issue.category, issue.message, suggestion=suggested_frontmatter(None, schema)) for issue in result.frontmatter_issues]
    elif suffix in YAML_EXTENSIONS:
        result.handoff_issues.extend(validate_yaml_file(relative_path, text))

    result.handoff_issues.extend(handoff_issues_by_path.get(relative_path, []))
    result.passed = not result.all_issues
    return result


def build_report(results: List[FileResult]) -> str:
    scanned = len(results)
    passed = sum(1 for item in results if item.passed)
    failed = sum(1 for item in results if not item.passed)
    warnings = sum(len(item.warnings) for item in results)
    markdown_issues = sum(len(item.markdown_issues) for item in results)
    frontmatter_issues = sum(len(item.frontmatter_issues) for item in results)
    version_issues = sum(len(item.version_issues) for item in results)
    handoff_issues = sum(len(item.handoff_issues) for item in results)

    lines = [
        "# Content File Validation Report",
        "",
        "## Summary",
        "",
        "| Metric | Count |",
        "|---|---:|",
        f"| Files scanned | {scanned} |",
        f"| Passed | {passed} |",
        f"| Failed | {failed} |",
        f"| Warnings | {warnings} |",
        f"| Markdown issues | {markdown_issues} |",
        f"| Frontmatter issues | {frontmatter_issues} |",
        f"| Version issues | {version_issues} |",
        f"| Handoff issues | {handoff_issues} |",
        "",
        "## Failed Files",
        "",
    ]

    failed_files = [item for item in results if not item.passed]
    if not failed_files:
        lines.append("None.")
    else:
        for item in failed_files:
            lines.append(f"### `{item.path}`")
            lines.append("")
            lines.append("**Issues:**")
            lines.append("")
            for issue in item.all_issues:
                lines.append(f"- {issue.message}")
            lines.append("")
            suggestion = next((issue.suggestion for issue in item.all_issues if issue.suggestion), None)
            if suggestion:
                lines.append("**Suggested fix:**")
                lines.append("")
                lines.append("```yaml")
                lines.append(suggestion.replace("---\n", "").replace("\n---", ""))
                lines.append("```")
                lines.append("")
            for warning in item.warnings:
                lines.append(f"**Warning:** {warning}")
                lines.append("")

    lines.extend(["## Passed Files", ""])
    passed_files = [item.path for item in results if item.passed]
    if not passed_files:
        lines.append("None.")
    else:
        for path in passed_files:
            lines.append(f"* `{path}`")

    lines.extend([
        "",
        "## Recommended next actions",
        "",
        "1. Fix blocking frontmatter and schema errors.",
        "2. Fix markdown structure and link issues.",
        "3. Fix handoff manifest, template, or schema mismatches.",
        "4. Confirm the correct SemVer increment for changed files.",
        "5. Re-run the validator.",
    ])
    return "\n".join(lines).rstrip() + "\n"


def main(argv: Optional[Sequence[str]] = None) -> int:
    try:
        args = parse_args(argv)
        target_root = Path(args.target).expanduser().resolve()
        schema_path = Path(args.schema).expanduser().resolve()
        baseline_root = Path(args.baseline).expanduser().resolve() if args.baseline else None
        handoff_manifest = Path(args.handoff_manifest).expanduser().resolve() if args.handoff_manifest else None

        if not target_root.exists() or not target_root.is_dir():
            raise ConfigurationError(f"Target directory does not exist or is not a directory: {target_root}")
        if baseline_root and (not baseline_root.exists() or not baseline_root.is_dir()):
            raise ConfigurationError(f"Baseline directory does not exist or is not a directory: {baseline_root}")
        if args.change_level and not (args.baseline or args.base_ref):
            raise ConfigurationError("--change-level requires --baseline or --base-ref.")
        if args.enforce_version_increment and not (args.baseline or args.base_ref):
            raise ConfigurationError("--enforce-version-increment requires --baseline or --base-ref.")
        if handoff_manifest and not handoff_manifest.exists():
            raise ConfigurationError(f"Handoff manifest not found: {handoff_manifest}")

        bundle = build_schema_bundle(load_yaml_file(schema_path, "Frontmatter schema"))
        excludes = list(dict.fromkeys(DEFAULT_EXCLUDES + list(args.exclude)))
        includes = list(args.include)
        handoff_issues_by_path = validate_handoff_manifest(target_root, handoff_manifest) if handoff_manifest else {}
        results = [
            validate_file(path, target_root, bundle, baseline_root, args.base_ref, args.enforce_version_increment, args.change_level, handoff_issues_by_path)
            for path in iter_files(target_root, includes, excludes)
        ]

        unresolved_handoff_paths = {path for path in handoff_issues_by_path.keys() if path not in {item.path for item in results}}
        for rel_path in sorted(unresolved_handoff_paths):
            synthetic = FileResult(path=rel_path, passed=False)
            synthetic.handoff_issues.extend(handoff_issues_by_path[rel_path])
            results.append(synthetic)

        report = build_report(results)
        if args.report:
            Path(args.report).expanduser().resolve().write_text(report, encoding="utf-8")
        else:
            sys.stdout.write(report)
        return 0 if all(item.passed for item in results) else 1
    except ConfigurationError as exc:
        sys.stderr.write(f"Configuration error: {exc}\n")
        return 2
    except Exception as exc:
        sys.stderr.write(f"Unexpected error: {exc}\n")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())