#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_FILES = [
    'prompts/lightspeed-playwright-mcp-validation-prompt.md',
    'prompts/lightspeed-playwright-mcp-repair-prompt.md',
    'prompts/README.md',
    'tests/README.md',
    'tests/schema-validation-tests.md',
]

REQUIRED_TEXT = {
    'prompts/lightspeed-playwright-mcp-validation-prompt.md': [
        'LightSpeed Playwright MCP app',
        'browser automation and QA support',
        'should not be the default path',
    ],
    'prompts/lightspeed-playwright-mcp-repair-prompt.md': [
        'LightSpeed Playwright MCP',
        'should only support browser exploration, debugging, or QA assistance',
    ],
    'prompts/README.md': [
        'lightspeed-playwright-mcp-validation-prompt.md',
        'lightspeed-playwright-mcp-repair-prompt.md',
    ],
    'tests/README.md': [
        'lightweight MCP check',
    ],
    'tests/schema-validation-tests.md': [
        '## MCP Checks',
        'LightSpeed Playwright MCP',
        'browser automation and QA support',
    ],
}


def main() -> int:
    issues: list[str] = []
    for rel_path in REQUIRED_FILES:
        path = ROOT / rel_path
        if not path.exists():
            issues.append(f'Missing required file: {rel_path}')
            continue
        text = path.read_text(encoding='utf-8')
        for expected in REQUIRED_TEXT.get(rel_path, []):
            if expected not in text:
                issues.append(f'{rel_path}: missing required text: {expected}')

    if issues:
        print('MCP reference issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1

    print('validate-mcp-references.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
