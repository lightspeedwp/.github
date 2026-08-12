#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REQUIRED_FOLDERS = [
    'examples', 'schemas', 'fixtures', 'profiles', 'prompts', 'tests', 'scripts'
]
OPTIONAL_FOLDERS = ['memory']
REQUIRED_FILES = [
    'README.md',
    'examples/README.md',
    'schemas/README.md',
    'fixtures/README.md',
    'profiles/README.md',
    'prompts/README.md',
    'prompts/routing-validation-cleanup-prompt.md',
    'prompts/routing-audits-prompt.md',
    'prompts/readme-refreshes-prompt.md',
    'prompts/validation-pack-tightening-prompt.md',
    'prompts/validation-scripts-tightening-prompt.md',
    'prompts/validation-docs-tests-tightening-prompt.md',
    'prompts/validation-reference-alignment-prompt.md',
    'prompts/skills-routing-validation-prompt.md',
    'prompts/skills-routing-repair-prompt.md',
    'scripts/README.md',
    'tests/README.md',
    'tests/schema-validation-tests.md',
    'scripts/validate-folder-schemas.sh',
    'scripts/validate-agent-pack.py',
    'scripts/validate-markdown-structure.py',
    'scripts/validate-template-schema-alignment.py',
    'scripts/validate-memory-hygiene.py',
    'scripts/validate-source-priority-consistency.py',
    'scripts/validate-business-context.py',
    'scripts/validate-starter-prompts.py',
    'scripts/validate-links-and-references.py',
    'scripts/validate-skills-routing.py'
]
REQUIRED_SCHEMAS = [
    'schemas/test-case.schema.json',
    'schemas/test-suite-plan.schema.json',
    'schemas/bugherd-failure.schema.json',
    'schemas/repo-analysis.schema.json',
    'schemas/figma-context.schema.json',
    'schemas/requirements-traceability.schema.json',
    'schemas/agent-file.schema.json',
    'schemas/memory-file.schema.json'
]
REQUIRED_EXAMPLES = [
    'examples/prd-to-test-cases-example.md',
    'examples/playwright-spec-example.md',
    'examples/bugherd-failure-example.md',
    'examples/repo-analysis-example.md',
    'examples/figma-context-example.md',
    'examples/requirements-traceability-example.md'
]
REQUIRED_FIXTURES: list[str] = []
REQUIRED_PROFILES = [
    'profiles/default-wordpress-profile.md',
    'profiles/woocommerce-profile.md',
    'profiles/lsxd-profile.md',
    'profiles/accessibility-smoke-profile.md',
    'profiles/visual-regression-profile.md'
]
STARTER_PROMPTS = [
    {
        'title': 'PRD to test cases',
        'prompt': 'I have a WordPress or WooCommerce PRD. Extract the testable requirements, assign requirement IDs, and turn them into human-readable Playwright test cases before writing any code.'
    },
    {
        'title': 'Analyse repo structure',
        'prompt': 'Review this GitHub repo and recommend the best Playwright test structure, including config, folders, fixtures, test IDs, CI notes, and approval gates before any write-back.'
    },
    {
        'title': 'Use Figma for QA',
        'prompt': 'Use the provided Figma file, prototype, or design context to identify UI states, breakpoint expectations, interaction rules, and visual regression candidates for Playwright tests.'
    },
    {
        'title': 'Generate tests',
        'prompt': 'Convert these approved human-readable test cases into maintainable Playwright specs with clear locators, fixtures, assertions, and requirement traceability.'
    },
    {
        'title': 'Package BugHerd failure',
        'prompt': 'Turn this Playwright failure output into a BugHerd-ready task with reproduction steps, requirement ID, test case ID, URL, viewport, browser, expected result, actual result, and attachment notes.'
    },
    {
        'title': 'Validate agent pack',
        'prompt': 'Run the agent file-quality workflow against examples, schemas, profiles, prompts, tests, scripts, memory, and business context. Report validation failures and recommend fixes.'
    }
]
FILE_NAME_PATTERNS = [
    re.compile(r'^[a-z0-9\-/]+\.md$'),
    re.compile(r'^[a-z0-9\-/]+\.schema\.json$'),
    re.compile(r'^[a-z0-9\-/]+\.json$'),
    re.compile(r'^[a-z0-9\-/]+\.py$'),
    re.compile(r'^[a-z0-9\-/]+\.sh$'),
    re.compile(r'^README\.md$'),
    re.compile(r'^[a-z0-9\-/]+/README\.md$'),
]


def read_text(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def validate_json_schema(path: Path, issues: list[str]) -> None:
    try:
        data = json.loads(read_text(path))
    except Exception as exc:
        issues.append(f'{path.relative_to(ROOT).as_posix()}: invalid JSON ({exc})')
        return
    for field in ('$schema', 'title', 'type', 'required', 'properties'):
        if field not in data:
            issues.append(f'{path.relative_to(ROOT).as_posix()}: missing required schema field {field}')


def validate_starter_prompts(issues: list[str]) -> None:
    if len(STARTER_PROMPTS) != 6:
        issues.append(f'Expected 6 starter prompts but found {len(STARTER_PROMPTS)}')
    seen_titles = set()
    seen_prompts = set()
    for index, item in enumerate(STARTER_PROMPTS, start=1):
        title = item.get('title', '').strip()
        prompt = item.get('prompt', '').strip()
        if not title:
            issues.append(f'Starter prompt {index}: missing title')
        if not prompt:
            issues.append(f'Starter prompt {index}: missing prompt body')
        if title in seen_titles:
            issues.append(f'Starter prompt title is duplicated: {title}')
        if prompt in seen_prompts:
            issues.append(f'Starter prompt prompt body is duplicated: {title}')
        if len(prompt.split()) < 12:
            issues.append(f'Starter prompt is too short or vague: {title}')
        seen_titles.add(title)
        seen_prompts.add(prompt)


def main() -> int:
    issues: list[str] = []
    for folder in REQUIRED_FOLDERS:
        if not (ROOT / folder).is_dir():
            issues.append(f'Missing required folder: {folder}/')
    for folder in OPTIONAL_FOLDERS:
        if (ROOT / folder).is_dir() and folder == 'memory':
            for expected in ['memory/todos.md', 'memory/user-preferences.md']:
                if not (ROOT / expected).exists():
                    issues.append(f'{folder}/ is present but expected companion file is missing: {expected}')
    if (ROOT / 'schema').exists():
        issues.append('Disallowed schema/ folder found; use schemas/ instead')
    required_paths = REQUIRED_FILES + REQUIRED_SCHEMAS + REQUIRED_EXAMPLES + REQUIRED_FIXTURES + REQUIRED_PROFILES
    for file_path in required_paths:
        if not (ROOT / file_path).exists():
            issues.append(f'Missing required file: {file_path}')
    for path in ROOT.rglob('*'):
        if path.is_file():
            rel = path.relative_to(ROOT).as_posix()
            if not any(pattern.match(rel) for pattern in FILE_NAME_PATTERNS):
                issues.append(f'Filename does not follow current naming rules: {rel}')
            if rel.endswith('.schema.json'):
                validate_json_schema(path, issues)
    validate_starter_prompts(issues)
    if issues:
        print('Validation issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1
    print('validate-agent-pack.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
