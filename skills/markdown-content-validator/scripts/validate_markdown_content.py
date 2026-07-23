#!/usr/bin/env python3
import argparse
import fnmatch
import re
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

SEMVER_RE = re.compile(r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$")
HEADING_RE = re.compile(r'^(#{1,6})\s+(.*)$')
LINK_RE = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
TABLE_RULE_RE = re.compile(r'^\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$')
URL_SCHEME_RE = re.compile(r'^[a-zA-Z][a-zA-Z0-9+.-]*://')


class MiniYAMLError(ValueError):
    pass


class MiniYAMLParser:
    def __init__(self, text: str):
        self.lines = text.splitlines()

    def parse(self) -> Any:
        cleaned = []
        for raw in self.lines:
            if not raw.strip() or raw.lstrip().startswith('#'):
                continue
            cleaned.append(raw.rstrip('\n'))
        self.lines = cleaned
        if not self.lines:
            return {}
        value, index = self._parse_block(0, 0)
        if index != len(self.lines):
            raise MiniYAMLError('Unexpected trailing YAML content.')
        return value

    def _parse_block(self, index: int, indent: int) -> Tuple[Any, int]:
        if index >= len(self.lines):
            return {}, index
        current_indent = self._indent(self.lines[index])
        if current_indent < indent:
            return {}, index
        stripped = self.lines[index].strip()
        if stripped.startswith('- '):
            return self._parse_list(index, indent)
        return self._parse_mapping(index, indent)

    def _parse_mapping(self, index: int, indent: int) -> Tuple[Dict[str, Any], int]:
        data: Dict[str, Any] = {}
        while index < len(self.lines):
            line = self.lines[index]
            line_indent = self._indent(line)
            if line_indent < indent:
                break
            if line_indent > indent:
                raise MiniYAMLError(f'Unexpected indentation: {line}')
            stripped = line.strip()
            if stripped.startswith('- '):
                raise MiniYAMLError('Mixed list and mapping at same indentation level.')
            if ':' not in stripped:
                raise MiniYAMLError(f'Invalid mapping entry: {line}')
            key, remainder = stripped.split(':', 1)
            key = key.strip()
            remainder = remainder.strip()
            index += 1
            if remainder == '':
                if index < len(self.lines) and self._indent(self.lines[index]) > indent:
                    value, index = self._parse_block(index, indent + 2)
                else:
                    value = None
            else:
                value = self._parse_scalar(remainder)
            data[key] = value
        return data, index

    def _parse_list(self, index: int, indent: int) -> Tuple[List[Any], int]:
        data: List[Any] = []
        while index < len(self.lines):
            line = self.lines[index]
            line_indent = self._indent(line)
            if line_indent < indent:
                break
            if line_indent != indent:
                raise MiniYAMLError(f'Unexpected indentation: {line}')
            stripped = line.strip()
            if not stripped.startswith('- '):
                break
            remainder = stripped[2:].strip()
            index += 1
            if remainder == '':
                if index < len(self.lines) and self._indent(self.lines[index]) > indent:
                    value, index = self._parse_block(index, indent + 2)
                else:
                    value = None
            elif ': ' in remainder or remainder.endswith(':'):
                synthetic = ' ' * (indent + 2) + remainder
                self.lines.insert(index, synthetic)
                value, index = self._parse_mapping(index, indent + 2)
            else:
                value = self._parse_scalar(remainder)
            data.append(value)
        return data, index

    @staticmethod
    def _indent(line: str) -> int:
        return len(line) - len(line.lstrip(' '))

    @staticmethod
    def _parse_scalar(value: str) -> Any:
        if value in ('true', 'false'):
            return value == 'true'
        if value in ('null', '~'):
            return None
        if value.startswith('"') and value.endswith('"'):
            inner = value[1:-1]
            return bytes(inner, 'utf-8').decode('unicode_escape')
        if value.startswith("'") and value.endswith("'"):
            return value[1:-1]
        if re.fullmatch(r'-?\d+', value):
            return int(value)
        if value.startswith('[') and value.endswith(']'):
            inner = value[1:-1].strip()
            if not inner:
                return []
            return [MiniYAMLParser._parse_scalar(part.strip()) for part in inner.split(',')]
        return value


def mini_yaml_load(text: str) -> Any:
    return MiniYAMLParser(text).parse()


@dataclass
class Issue:
    severity: str
    message: str
    line: Optional[int] = None


@dataclass
class FileResult:
    path: str
    passed: bool = True
    issues: List[Issue] = field(default_factory=list)
    warnings: List[Issue] = field(default_factory=list)
    suggestions: List[Issue] = field(default_factory=list)
    current_version: Optional[str] = None

    def add(self, severity: str, message: str, line: Optional[int] = None) -> None:
        issue = Issue(severity, message, line)
        if severity == 'error':
            self.passed = False
            self.issues.append(issue)
        elif severity == 'warning':
            self.warnings.append(issue)
        else:
            self.suggestions.append(issue)


def load_yaml(path: Path) -> Dict[str, Any]:
    data = mini_yaml_load(path.read_text(encoding='utf-8')) or {}
    if not isinstance(data, dict):
        raise MiniYAMLError(f'YAML file must contain a mapping: {path}')
    return data


def find_files(target: Path, includes: List[str], excludes: List[str]) -> List[Path]:
    candidates = [target] if target.is_file() else [p for p in target.rglob('*') if p.is_file()]
    matched = []
    for path in candidates:
        rel = path.as_posix()
        name = path.name
        if includes and not any(fnmatch.fnmatch(rel, pat) or fnmatch.fnmatch(name, pat) for pat in includes):
            continue
        if excludes and any(fnmatch.fnmatch(rel, pat) or fnmatch.fnmatch(name, pat) for pat in excludes):
            continue
        matched.append(path)
    return sorted(matched)


def parse_frontmatter(text: str) -> Tuple[Optional[Dict[str, Any]], int, Optional[str]]:
    if text.startswith('\ufeff'):
        return None, 0, 'BOM marker found before frontmatter opening delimiter.'
    if not text.startswith('---\n') and text != '---':
        return None, 0, 'Missing YAML frontmatter at the very top of the file.'
    lines = text.splitlines(keepends=True)
    end_index = None
    for idx in range(1, len(lines)):
        if lines[idx].strip() == '---':
            end_index = idx
            break
    if end_index is None:
        return None, 0, 'Frontmatter opening delimiter found, but closing delimiter is missing.'
    frontmatter_text = ''.join(lines[1:end_index])
    try:
        data = mini_yaml_load(frontmatter_text) or {}
    except MiniYAMLError as exc:
        return None, end_index + 1, f'Invalid YAML frontmatter: {exc}'
    if not isinstance(data, dict):
        return None, end_index + 1, 'Frontmatter must parse to a YAML mapping.'
    body_start = sum(len(line) for line in lines[: end_index + 1])
    return data, body_start, None


def validate_type(value: Any, expected: str) -> bool:
    mapping = {
        'string': str,
        'array': list,
        'object': dict,
        'integer': int,
        'number': (int, float),
        'boolean': bool,
    }
    py_type = mapping.get(expected)
    return isinstance(value, py_type) if py_type else True


def validate_schema(frontmatter: Dict[str, Any], schema: Dict[str, Any], result: FileResult) -> None:
    required = schema.get('required', [])
    properties = schema.get('properties', {})
    min_props = schema.get('minProperties')
    max_props = schema.get('maxProperties')
    additional_props = schema.get('additionalProperties', True)

    for field_name in required:
        if field_name not in frontmatter:
            result.add('error', f'Missing required frontmatter field: `{field_name}`')

    if min_props is not None and len(frontmatter) < min_props:
        result.add('error', f'Frontmatter has too few fields: {len(frontmatter)} < {min_props}')
    if max_props is not None and len(frontmatter) > max_props:
        result.add('error', f'Frontmatter has too many fields: {len(frontmatter)} > {max_props}')

    if not additional_props:
        for field_name in sorted(set(frontmatter) - set(properties)):
            result.add('error', f'Unexpected frontmatter field: `{field_name}`')

    for field_name, rules in properties.items():
        if field_name not in frontmatter:
            continue
        value = frontmatter[field_name]
        expected_type = rules.get('type')
        if expected_type and not validate_type(value, expected_type):
            result.add('error', f'Frontmatter field `{field_name}` must be of type `{expected_type}`')
            continue
        if expected_type == 'string':
            if 'minLength' in rules and len(value) < rules['minLength']:
                result.add('error', f'Frontmatter field `{field_name}` is shorter than {rules["minLength"]}')
            if 'maxLength' in rules and len(value) > rules['maxLength']:
                result.add('error', f'Frontmatter field `{field_name}` is longer than {rules["maxLength"]}')
            if 'pattern' in rules and not re.fullmatch(rules['pattern'], value):
                result.add('error', f'Frontmatter field `{field_name}` does not match the required pattern')
            if rules.get('format') == 'date':
                try:
                    date.fromisoformat(value)
                except ValueError:
                    result.add('error', f'Frontmatter field `{field_name}` must use ISO date format YYYY-MM-DD')
        if 'enum' in rules and value not in rules['enum']:
            result.add('error', f'Frontmatter field `{field_name}` must use one of: {", ".join(map(str, rules["enum"]))}')
        if expected_type == 'array':
            item_rules = rules.get('items', {})
            for item in value:
                item_type = item_rules.get('type')
                if item_type and not validate_type(item, item_type):
                    result.add('error', f'Frontmatter field `{field_name}` contains an item with invalid type')
                    continue
                if 'enum' in item_rules and item not in item_rules['enum']:
                    result.add('error', f'Frontmatter field `{field_name}` contains an invalid value: `{item}`')


def slugify_heading(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    return re.sub(r'\s+', '-', text)


def validate_markdown(text: str, result: FileResult, frontmatter_title: Optional[str] = None) -> None:
    lines = text.splitlines()
    in_code_fence = False
    code_fence_line = None
    headings: List[Tuple[int, str, int]] = []
    last_heading_level = 0
    previous_blank = False
    local_anchor_targets = set()
    anchor_links: List[Tuple[str, int]] = []

    for index, line in enumerate(lines, start=1):
        if line.endswith(' ') or line.endswith('\t'):
            result.add('warning', 'Trailing whitespace', index)

        if line.strip().startswith('```'):
            if not in_code_fence:
                in_code_fence = True
                code_fence_line = index
                if index < len(lines) and lines[index].strip().startswith('```'):
                    result.add('warning', 'Empty code fence', index)
            else:
                in_code_fence = False
                code_fence_line = None
            continue

        if in_code_fence:
            continue

        if line.strip() == '':
            if previous_blank:
                result.add('warning', 'Repeated blank lines', index)
            previous_blank = True
        else:
            previous_blank = False

        match = HEADING_RE.match(line)
        if match:
            level = len(match.group(1))
            heading_text = match.group(2).strip()
            if not heading_text:
                result.add('error', 'Empty heading', index)
            if last_heading_level and level > last_heading_level + 1:
                result.add('error', f'Heading level jumps from h{last_heading_level} to h{level}', index)
            if len(heading_text) > 120:
                result.add('warning', 'Heading is excessively long', index)
            headings.append((level, heading_text, index))
            local_anchor_targets.add(slugify_heading(heading_text))
            last_heading_level = level

        for _, target in LINK_RE.findall(line):
            if target.startswith('#'):
                anchor_links.append((target[1:], index))
            elif '://' in target and not URL_SCHEME_RE.match(target):
                result.add('error', f'Malformed external link: `{target}`', index)
            elif target.startswith('http') and ' ' in target:
                result.add('error', f'Malformed external link: `{target}`', index)

        if '|' in line and index < len(lines):
            next_line = lines[index] if index < len(lines) else ''
            if '|' in next_line and not TABLE_RULE_RE.match(next_line.strip()):
                result.add('warning', 'Suspicious table formatting', index)

    if in_code_fence and code_fence_line is not None:
        result.add('error', 'Unclosed code fence', code_fence_line)

    seen = {}
    for _, heading_text, line_no in headings:
        key = heading_text.lower()
        if key in seen:
            result.add('warning', f'Duplicate heading: `{heading_text}`', line_no)
        seen[key] = line_no

    for anchor, line_no in anchor_links:
        if slugify_heading(anchor) not in local_anchor_targets and anchor not in local_anchor_targets:
            result.add('warning', f'Local anchor link has no matching heading: `#{anchor}`', line_no)

    if frontmatter_title and headings and frontmatter_title.strip() != headings[0][1].strip():
        result.add('suggestion', 'Frontmatter title and first heading differ')

    if text and not text.endswith('\n'):
        result.add('warning', 'Missing final newline')


def get_git_previous_content(repo_root: Path, path: Path, base_ref: str) -> Optional[str]:
    rel_path = path.relative_to(repo_root).as_posix() if path.is_relative_to(repo_root) else path.as_posix()
    show = subprocess.run(['git', 'show', f'{base_ref}:{rel_path}'], cwd=repo_root, check=False, capture_output=True, text=True)
    return show.stdout if show.returncode == 0 else None


def compare_versions(current_version: Optional[str], previous_text: Optional[str]) -> Tuple[bool, Optional[str]]:
    if current_version is None:
        return False, None
    if previous_text is None:
        return True, 'Version increment could not be verified because no previous version was available.'
    previous_frontmatter, _, error = parse_frontmatter(previous_text)
    if error or not previous_frontmatter:
        return True, 'Version increment could not be verified because no previous version was available.'
    previous_version = previous_frontmatter.get('version')
    if previous_version is None:
        return True, 'Version increment could not be verified because no previous version was available.'
    if previous_version == current_version:
        return False, f'File changed but version was not incremented. Current version: `{current_version}`'
    return True, None


def render_report(results: List[FileResult], output_path: Path) -> None:
    scanned = len(results)
    failed = [r for r in results if not r.passed]
    passed = [r for r in results if r.passed]
    warning_count = sum(len(r.warnings) for r in results)
    markdown_issues = sum(1 for r in results for i in (r.issues + r.warnings) if 'frontmatter' not in i.message.lower() and 'version' not in i.message.lower())
    frontmatter_issues = sum(1 for r in results for i in r.issues if 'frontmatter' in i.message.lower() or 'field' in i.message.lower())
    missing_version = sum(1 for r in results for i in r.issues if i.message == 'Missing required frontmatter field: `version`')
    invalid_version = sum(1 for r in results for i in r.issues if i.message == 'Frontmatter field `version` does not match the required pattern')
    no_increment = sum(1 for r in results for i in r.issues if 'version was not incremented' in i.message.lower())

    lines = [
        '# Markdown Content Validation Report', '', '## Summary', '',
        '| Metric | Count |', '|---|---:|',
        f'| Files scanned | {scanned} |',
        f'| Passed | {len(passed)} |',
        f'| Failed | {len(failed)} |',
        f'| Warnings | {warning_count} |',
        f'| Markdown issues | {markdown_issues} |',
        f'| Frontmatter issues | {frontmatter_issues} |',
        f'| Missing version | {missing_version} |',
        f'| Invalid version format | {invalid_version} |',
        f'| Changed without version increment | {no_increment} |', '', '## Failed Files', ''
    ]
    if failed:
        for result in failed:
            lines.append(f'### `{result.path}`')
            lines.append('')
            lines.append('**Issues:**')
            lines.append('')
            for issue in result.issues:
                prefix = f'Line {issue.line}: ' if issue.line else ''
                lines.append(f'- {prefix}{issue.message}')
            if result.current_version:
                lines.extend(['', f'**Current version:** `{result.current_version}`'])
            lines.append('')
    else:
        lines.extend(['None.', ''])
    lines.extend(['## Passed Files', ''])
    if passed:
        for result in passed:
            lines.append(f'- `{result.path}`')
    else:
        lines.append('- None')
    lines.extend(['', '## Recommended next actions', '', '1. Fix blocking frontmatter errors.', '2. Fix markdown structure and formatting issues.', '3. Confirm the correct SemVer increment for changed files.', '4. Re-run the validator.', ''])
    output_path.write_text('\n'.join(lines), encoding='utf-8')


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Validate markdown content, frontmatter schema compliance, and versioning.')
    parser.add_argument('--target', required=True)
    parser.add_argument('--schema', required=True)
    parser.add_argument('--report', required=True)
    parser.add_argument('--include', action='append', default=[])
    parser.add_argument('--exclude', action='append', default=[])
    parser.add_argument('--enforce-version-increment', action='store_true')
    parser.add_argument('--base-ref')
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    target = Path(args.target)
    schema_path = Path(args.schema)
    report_path = Path(args.report)
    if not target.exists():
        print(f'Target does not exist: {target}', file=sys.stderr)
        return 2
    if not schema_path.exists():
        print(f'Schema does not exist: {schema_path}', file=sys.stderr)
        return 2
    try:
        schema = load_yaml(schema_path)
    except Exception as exc:
        print(f'Failed to load schema: {exc}', file=sys.stderr)
        return 2

    includes = args.include or ['*.md', '*.markdown', '*.mdx']
    excludes = args.exclude or ['.git/*', 'node_modules/*', '.venv/*', 'venv/*']
    try:
        files = find_files(target, includes, excludes)
    except Exception as exc:
        print(f'Failed to enumerate files: {exc}', file=sys.stderr)
        return 2
    if not files:
        print('No files matched the requested target and filters.', file=sys.stderr)
        return 2

    repo_root = Path.cwd()
    results: List[FileResult] = []
    for path in files:
        result = FileResult(path=path.as_posix())
        try:
            text = path.read_text(encoding='utf-8')
        except Exception as exc:
            result.add('error', f'Could not read file: {exc}')
            results.append(result)
            continue
        frontmatter, body_start, fm_error = parse_frontmatter(text)
        if fm_error:
            result.add('error', fm_error)
            results.append(result)
            continue
        validate_schema(frontmatter, schema, result)
        version = frontmatter.get('version')
        result.current_version = version if isinstance(version, str) else None
        if version is None:
            result.add('error', 'Missing required frontmatter field: `version`')
        elif not isinstance(version, str):
            result.add('error', 'Frontmatter field `version` must be of type `string`')
        body_text = text[body_start:].lstrip('\n')
        validate_markdown(body_text, result, frontmatter.get('title'))
        if args.enforce_version_increment:
            if not args.base_ref:
                result.add('warning', 'Version increment could not be verified because no base reference was provided.')
            else:
                previous_text = get_git_previous_content(repo_root, path, args.base_ref)
                if previous_text is None:
                    result.add('warning', 'Version increment could not be verified because no previous version was available.')
                elif previous_text != text:
                    ok, message = compare_versions(version if isinstance(version, str) else None, previous_text)
                    if message and not ok:
                        result.add('error', message)
                    elif message:
                        result.add('warning', message)
        results.append(result)

    try:
        report_path.parent.mkdir(parents=True, exist_ok=True)
        render_report(results, report_path)
    except Exception as exc:
        print(f'Failed to write report: {exc}', file=sys.stderr)
        return 2
    return 1 if any(not r.passed for r in results) else 0


if __name__ == '__main__':
    raise SystemExit(main())
