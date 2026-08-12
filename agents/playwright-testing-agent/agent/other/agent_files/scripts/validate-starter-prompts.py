#!/usr/bin/env python3
import sys

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
        'prompt': 'Run the agent file-quality workflow against templates, examples, schemas, memory, references, and business context. Report validation failures and recommend fixes.'
    }
]
MISSION_KEYWORDS = ['playwright', 'prd', 'figma', 'repo', 'bugherd', 'validate']
UNSAFE_PHRASES = ['commit directly to main', 'log to bugherd automatically', 'write without approval', 'push straight to production']


def intent_signature(text: str) -> str:
    lowered = text.lower()
    flags = []
    for keyword in MISSION_KEYWORDS:
        flags.append(keyword if keyword in lowered else '')
    return '|'.join(flags)


def main() -> int:
    issues: list[str] = []
    if len(STARTER_PROMPTS) != 6:
        issues.append(f'Expected 6 starter prompts but found {len(STARTER_PROMPTS)}')
    titles = set()
    prompts = set()
    intents = set()
    for index, item in enumerate(STARTER_PROMPTS, start=1):
        title = item.get('title', '').strip()
        prompt = item.get('prompt', '').strip()
        if not title:
            issues.append(f'Starter prompt {index}: missing title')
        if not prompt:
            issues.append(f'Starter prompt {index}: missing prompt body')
        if title in titles:
            issues.append(f'Duplicate starter prompt title: {title}')
        if prompt in prompts:
            issues.append(f'Duplicate starter prompt body: {title}')
        if len(prompt.split()) < 12:
            issues.append(f'Starter prompt is too short or vague: {title}')
        signature = intent_signature(prompt)
        if signature in intents:
            issues.append(f'Starter prompt intent appears duplicated: {title}')
        if not any(keyword in prompt.lower() for keyword in MISSION_KEYWORDS):
            issues.append(f'Starter prompt does not align clearly with the agent mission: {title}')
        for phrase in UNSAFE_PHRASES:
            if phrase in prompt.lower():
                issues.append(f'Starter prompt requests unsafe write behaviour: {title}')
        titles.add(title)
        prompts.add(prompt)
        intents.add(signature)
    if issues:
        print('Starter prompt validation issues found:')
        for issue in issues:
            print(f'- {issue}')
        return 1
    print('validate-starter-prompts.py: all checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
