from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path('.')
ROUTING_REFERENCE = ROOT / 'references' / 'skill-collision-inventory.md'
DEFAULT_INSTRUCTIONS_CANDIDATES = [
    ROOT / 'instructions.snapshot.md',
    ROOT / 'references' / 'instructions.snapshot.md',
]
SKILL_TOKEN_RE = re.compile(r'`(zendesk-[a-z0-9-]+)`')
SECTION_RE = re.compile(r'^##\s+(?P<title>.+?)\s*$')

ATTACHED_SKILLS = {
    'zendesk-bug-report-package',
    'zendesk-ticket-triage',
    'zendesk-evidence-collector',
    'zendesk-case-readiness-check',
    'zendesk-backlog-trend-analysis',
    'zendesk-create-knowledge',
    'zendesk-customer-escalation',
    'zendesk-customer-research',
    'zendesk-draft-response',
    'zendesk-duplicate-pattern-review',
    'zendesk-evidence-quality-review',
    'zendesk-handoff-prep',
    'zendesk-help-center-grounding',
    'zendesk-knowledge-candidate-review',
    'zendesk-refund-assessment',
    'zendesk-router-skill',
    'zendesk-triage-router',
}

EXPECTED_SECTIONS = {
    'Routing skills': {'zendesk-router-skill', 'zendesk-triage-router'},
    'Evidence and readiness skills': {
        'zendesk-evidence-collector',
        'zendesk-case-readiness-check',
        'zendesk-evidence-quality-review',
    },
    'Delivery skills': {
        'zendesk-draft-response',
        'zendesk-handoff-prep',
        'zendesk-customer-escalation',
        'zendesk-backlog-trend-analysis',
    },
    'Knowledge and pattern skills': {
        'zendesk-duplicate-pattern-review',
        'zendesk-knowledge-candidate-review',
        'zendesk-create-knowledge',
    },
    'Specialist skills': {
        'zendesk-customer-research',
        'zendesk-refund-assessment',
        'zendesk-bug-report-package',
        'zendesk-ticket-triage',
    },
}


class ValidationError(Exception):
    pass


def read_text(path: Path) -> str:
    if not path.exists():
        raise ValidationError(f'Missing file: {path}')
    text = path.read_text(encoding='utf-8')
    if not text.strip():
        raise ValidationError(f'File is empty: {path}')
    return text


def find_default_instructions_file() -> Path | None:
    for path in DEFAULT_INSTRUCTIONS_CANDIDATES:
        if path.exists():
            return path
    return None


def extract_section_skills(text: str) -> dict[str, set[str]]:
    sections: dict[str, list[str]] = {}
    current_section: str | None = None
    for line in text.splitlines():
        match = SECTION_RE.match(line.strip())
        if match:
            current_section = match.group('title')
            sections.setdefault(current_section, [])
            continue
        if current_section is None:
            continue
        for skill in SKILL_TOKEN_RE.findall(line):
            sections[current_section].append(skill)
    return {section: set(skills) for section, skills in sections.items()}


def validate_sections(section_skills: dict[str, set[str]]) -> None:
    missing_sections = [section for section in EXPECTED_SECTIONS if section not in section_skills]
    if missing_sections:
        raise ValidationError('Missing routing sections: ' + ', '.join(missing_sections))

    for section, expected_skills in EXPECTED_SECTIONS.items():
        found = section_skills.get(section, set())
        missing = sorted(expected_skills - found)
        extra = sorted(found - expected_skills)
        if missing:
            raise ValidationError(f'{section} is missing expected skills: ' + ', '.join(missing))
        if extra:
            raise ValidationError(f'{section} contains unexpected skills: ' + ', '.join(extra))


def validate_against_attached_skills(skills: set[str], source_name: str) -> None:
    unknown = sorted(skills - ATTACHED_SKILLS)
    if unknown:
        raise ValidationError(f'{source_name} references unattached skills: ' + ', '.join(unknown))


def validate_inventory_reference() -> None:
    text = read_text(ROUTING_REFERENCE)
    section_skills = extract_section_skills(text)
    validate_sections(section_skills)

    inventory_skills = set().union(*section_skills.values())
    validate_against_attached_skills(inventory_skills, str(ROUTING_REFERENCE))

    missing_from_inventory = sorted(ATTACHED_SKILLS - inventory_skills)
    if missing_from_inventory:
        raise ValidationError(
            'Attached Zendesk skills missing from the routing inventory: '
            + ', '.join(missing_from_inventory)
        )


def validate_instructions_snapshot(path: Path) -> None:
    text = read_text(path)
    instruction_skills = set(SKILL_TOKEN_RE.findall(text))
    if not instruction_skills:
        raise ValidationError(f'No Zendesk skill references found in {path}')
    validate_against_attached_skills(instruction_skills, str(path))


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Validate Zendesk skill-routing references against the attached skill inventory.'
    )
    parser.add_argument(
        '--instructions-file',
        type=Path,
        default=None,
        help='Optional markdown snapshot of agent instructions to validate skill references.',
    )
    args = parser.parse_args()

    validate_inventory_reference()

    instructions_path = args.instructions_file or find_default_instructions_file()
    if instructions_path is not None:
        validate_instructions_snapshot(instructions_path)
        print(f'Skill routing inventory validation passed with instructions snapshot {instructions_path}.')
        return

    print('Skill routing inventory validation passed. No instructions snapshot was provided, so only the routing reference was checked.')


if __name__ == '__main__':
    try:
        main()
    except ValidationError as exc:
        raise SystemExit(str(exc)) from exc
