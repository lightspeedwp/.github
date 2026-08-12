#!/usr/bin/env python3
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REFERENCE_RE = re.compile(r'`((?:examples|schemas|fixtures|profiles|prompts|scripts|tests|memory)/[^`]+\.(?:md|json|py|sh)|README\.md|business-context\.md)`')
INVALID_SCHEMA_REF_RE = re.compile(r'`schema/[^`]+\.[^`]+`|\(schema/[^)]+\.[^)]+\)|\[schema/[^\]]+\.[^\]]+\]')
RELATIVE_LINK_RE = re.compile(r'\[[^\]]+\]\((?!https?://|#|mailto:)([^)]+)\)')
ENTITY_TAG_FILE_RE = re.compile(r'\{\{label:([^,}]+),id:([^,}]+),type:file\}\}')
MARKDOWN_DIRS = ['examples', 'schemas', 'fixtures', 'profiles', 'prompts', 'scripts', 'tests', 'memory']
OPTIONAL_REFERENCES = {'business-context.md'}


def main() -> int:
    issues: list[str] = []
    markdown_files = [ROOT / 'README.md']
    for folder in MARKDOWN_DIRS:
        path = ROOT / folder
        if path.exists():
            markdown_files.extend(path.rglob('*.md'))
    optional_root_files = [ROOT / 'business-context.md']
    markdown_files.extend(optional_root_files)
    seen = set()
    for path in markdown_files:
        if not path.exists():
            continue
        rel = path.relative_to(ROOT).as_posix()
        if rel in seen:
            continue
        seen.add(rel)
        text = path.read_text(encoding='utf-8')
        if INVALID_SCHEMA_REF_RE.search(text):
            issues.append(f'{rel}: found invalid schema/ reference')
        for match in REFERENCE_RE.findall(text):
            if match in OPTIONAL_REFERENCES and not (ROOT / match).exists():
                continue
            if not (ROOT / match).exists():
                issues.append(f'{rel}: broken internal reference to {match}')
        for match in RELATIVE_LINK_RE.findall(text):
            target = (path.parent / match).resolve()
            if not target.exists():
                issues.append(f'{rel}: broken relative link to {match}')
        for label, _ in ENTITY_TAG_FILE_RE.findall(text):
            if '/' in label and not (ROOT / label).exists():
                issues.append(f'{rel}: entity-tag file label points to a missing file path: {label}')
    if issues:
        print('Link and reference issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1
    print('validate-links-and-references.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
