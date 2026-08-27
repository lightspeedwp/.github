#!/usr/bin/env python3
"""Validate the zendesk-router-skill package structure and shared-agent portability.

Run from the skill root or pass the skill root as the first argument:

    python3 scripts/validate_router_pack.py
    python3 scripts/validate_router_pack.py /path/to/zendesk-router-skill

This is a lightweight maintenance check. It does not test model reasoning directly;
it verifies that the skill package contains the guardrails and fixture data needed
for consistent shared-agent routing behaviour.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REQUIRED_FILES = [
    "SKILL.md",
    "agents/openai.yaml",
    "references/shared-agent-readiness.md",
    "references/connector-requirements.md",
    "references/routing-matrix.md",
    "references/output-contract.md",
    "references/test-cases.md",
    "references/shared-agent-deployment-checklist.md",
    "references/maintenance-and-release-guide.md",
    "references/changelog.md",
    "references/router-test-fixtures.json",
    "references/companion-skill-manifest.json",
    "references/companion-skill-manifest.schema.json",
    "references/companion-interoperability-audit.md",
]

REQUIRED_SKILLS = [
    "zendesk-triage-router",
    "zendesk-evidence-collector",
    "zendesk-case-readiness-check",
    "zendesk-draft-response",
    "zendesk-customer-escalation",
    "zendesk-handoff-prep",
    "zendesk-knowledge-candidate-review",
    "zendesk-create-knowledge",
    "zendesk-duplicate-pattern-review",
    "zendesk-backlog-trend-analysis",
    "zendesk-customer-research",
    "zendesk-evidence-quality-review",
]

OUTPUT_FIELDS = [
    "**Primary skill:**",
    "**Why this skill:**",
    "**Supporting skill:**",
    "**What input would help next:**",
]

# Keep this list focused on individual-user assumptions and private-context leakage.
# Do not include broad company/team terms that may appear in legitimate examples.
BANNED_PERSONAL_MARKERS = [
    "Ash's",
    "Ash’s",
    "ashley@",
    "lsdev.biz",
    "my Gmail",
    "my calendar",
    "my Zendesk",
    "my Slack",
]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def check_required_files(root: Path, errors: list[str]) -> None:
    for rel in REQUIRED_FILES:
        if not (root / rel).is_file():
            errors.append(f"missing required file: {rel}")


def check_frontmatter(root: Path, errors: list[str]) -> None:
    skill_md = read_text(root / "SKILL.md")
    match = re.match(r"^---\n(?P<yaml>.*?)\n---\n", skill_md, re.DOTALL)
    if not match:
        errors.append("SKILL.md must start with YAML frontmatter")
        return

    frontmatter = match.group("yaml")
    if "name: zendesk-router-skill" not in frontmatter:
        errors.append("frontmatter name must be zendesk-router-skill")
    if "description:" not in frontmatter:
        errors.append("frontmatter description is missing")
    if not re.search(r"description: .*shared-agent", frontmatter, re.DOTALL):
        errors.append("frontmatter description should mention shared-agent safety/compatibility")
    if "unavailable zendesk access" not in frontmatter.lower():
        errors.append("frontmatter description should cover unavailable Zendesk access")
    if "permission-aware" not in frontmatter.lower():
        errors.append("frontmatter description should mention permission-aware routing")


def check_output_contract(root: Path, errors: list[str]) -> None:
    combined = "\n".join(read_text(root / rel) for rel in ["SKILL.md", "references/output-contract.md"])
    for field in OUTPUT_FIELDS:
        if field not in combined:
            errors.append(f"missing output contract field: {field}")


def check_routing_coverage(root: Path, errors: list[str]) -> None:
    routing_matrix = read_text(root / "references/routing-matrix.md")
    skill_md = read_text(root / "SKILL.md")
    combined = routing_matrix + "\n" + skill_md
    for skill in REQUIRED_SKILLS:
        if skill not in combined:
            errors.append(f"routing coverage missing for: {skill}")


def check_reference_links(root: Path, errors: list[str]) -> None:
    skill_md = read_text(root / "SKILL.md")
    for rel in REQUIRED_FILES:
        if rel.startswith("references/") and rel not in skill_md:
            errors.append(f"SKILL.md does not mention reference: {rel}")


def check_deployment_checklist(root: Path, errors: list[str]) -> None:
    checklist = read_text(root / "references/shared-agent-deployment-checklist.md")
    required_terms = [
        "Zendesk connector access",
        "related `zendesk-` workflow skills",
        "Permission-Safe Router Behaviour Tests",
        "validate_router_pack.py",
        "references/companion-skill-manifest.json",
        "companion-interoperability-audit",
        "Parent-Agent Skill-Selection Tests",
    ]
    for term in required_terms:
        if term not in checklist:
            errors.append(f"deployment checklist missing term: {term}")




def check_maintenance_references(root: Path, errors: list[str]) -> None:
    guide = read_text(root / "references/maintenance-and-release-guide.md")
    changelog = read_text(root / "references/changelog.md")
    required_guide_terms = [
        "skill.zip",
        "references/changelog.md",
        "validate_router_pack.py",
        "Shared-Agent Review Prompt",
        "25 MB",
        "companion-skill-manifest",
        "companion-interoperability-audit",
    ]
    for term in required_guide_terms:
        if term not in guide:
            errors.append(f"maintenance guide missing term: {term}")

    if not re.search(r"##\s+\d+\.\d+\.\d+\s+-\s+\d{4}-\d{2}-\d{2}", changelog):
        errors.append("changelog must contain at least one dated semantic-version entry")
    if "real customer" in changelog.lower():
        errors.append("changelog should not mention or include real customer data")


def check_shared_agent_portability(root: Path, errors: list[str]) -> None:
    text_files = list(root.glob("**/*.md")) + list(root.glob("**/*.yaml")) + list(root.glob("**/*.json"))
    for file_path in text_files:
        content = read_text(file_path)
        for marker in BANNED_PERSONAL_MARKERS:
            if marker in content:
                errors.append(f"personal/shared-agent portability marker found in {file_path.relative_to(root)}: {marker}")


def check_fixtures(root: Path, errors: list[str]) -> None:
    fixture_path = root / "references/router-test-fixtures.json"
    try:
        data = json.loads(read_text(fixture_path))
    except json.JSONDecodeError as exc:
        errors.append(f"router-test-fixtures.json is invalid JSON: {exc}")
        return

    cases = data.get("cases")
    if not isinstance(cases, list) or len(cases) < 5:
        errors.append("router-test-fixtures.json must contain at least five cases")
        return

    required_case_fields = {
        "id",
        "input",
        "expected_primary_skill",
        "expected_supporting_skill",
        "requires_zendesk_access",
        "notes",
    }
    seen_ids: set[str] = set()
    for index, case in enumerate(cases, start=1):
        missing = sorted(required_case_fields - set(case))
        if missing:
            errors.append(f"fixture case {index} missing fields: {', '.join(missing)}")
        case_id = case.get("id")
        if case_id in seen_ids:
            errors.append(f"duplicate fixture id: {case_id}")
        seen_ids.add(case_id)

        primary = case.get("expected_primary_skill")
        if primary not in REQUIRED_SKILLS and primary != "clarify-or-route-from-pasted-evidence":
            errors.append(f"fixture {case_id} has unknown primary skill: {primary}")


def check_companion_manifest(root: Path, errors: list[str]) -> None:
    manifest_path = root / "references/companion-skill-manifest.json"
    schema_path = root / "references/companion-skill-manifest.schema.json"
    try:
        manifest = json.loads(read_text(manifest_path))
    except json.JSONDecodeError as exc:
        errors.append(f"companion-skill-manifest.json is invalid JSON: {exc}")
        return

    try:
        schema = json.loads(read_text(schema_path))
    except json.JSONDecodeError as exc:
        errors.append(f"companion-skill-manifest.schema.json is invalid JSON: {exc}")
        return

    if schema.get("title") != "Zendesk Router Companion Skill Manifest":
        errors.append("companion manifest schema has unexpected title")

    if manifest.get("router_skill") != "zendesk-router-skill":
        errors.append("companion manifest router_skill must be zendesk-router-skill")

    policy = manifest.get("shared_agent_policy")
    if not isinstance(policy, dict):
        errors.append("companion manifest shared_agent_policy must be an object")
        return

    if policy.get("zendesk_connector_required_for_router") is not False:
        errors.append("companion manifest must state that Zendesk connector is not required for the router itself")
    if policy.get("personal_context_allowed") is not False:
        errors.append("companion manifest must disallow personal context")
    if policy.get("real_customer_data_allowed_in_examples") is not False:
        errors.append("companion manifest must disallow real customer data in examples")
    fallback = policy.get("fallback_when_connector_unavailable", "")
    if "smallest useful" not in fallback.lower() or "pasted" not in fallback.lower():
        errors.append("companion manifest fallback should ask for the smallest useful pasted evidence")

    skills = manifest.get("skills")
    if not isinstance(skills, list):
        errors.append("companion manifest skills must be a list")
        return

    manifest_skill_names = [item.get("name") for item in skills if isinstance(item, dict)]
    for skill in REQUIRED_SKILLS:
        if skill not in manifest_skill_names:
            errors.append(f"companion manifest missing skill: {skill}")

    required_fields = {
        "name",
        "category",
        "install_recommendation",
        "zendesk_access",
        "primary_when",
        "supporting_when",
        "fallback_when_unavailable",
    }
    seen: set[str] = set()
    for index, item in enumerate(skills, start=1):
        if not isinstance(item, dict):
            errors.append(f"companion manifest skill {index} must be an object")
            continue
        missing = sorted(required_fields - set(item))
        if missing:
            errors.append(f"companion manifest skill {index} missing fields: {', '.join(missing)}")
        name = item.get("name")
        if name in seen:
            errors.append(f"duplicate companion manifest skill: {name}")
        seen.add(name)
        if name not in REQUIRED_SKILLS:
            errors.append(f"unknown companion manifest skill: {name}")
        fallback = item.get("fallback_when_unavailable", "")
        if not isinstance(fallback, str) or len(fallback.strip()) < 20:
            errors.append(f"companion manifest skill {name} needs a useful fallback_when_unavailable")


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    root = root.resolve()
    errors: list[str] = []

    if not root.is_dir():
        print(f"ERROR: skill root is not a directory: {root}", file=sys.stderr)
        return 2

    check_required_files(root, errors)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    check_frontmatter(root, errors)
    check_output_contract(root, errors)
    check_routing_coverage(root, errors)
    check_reference_links(root, errors)
    check_deployment_checklist(root, errors)
    check_maintenance_references(root, errors)
    check_shared_agent_portability(root, errors)
    check_fixtures(root, errors)
    check_companion_manifest(root, errors)

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print("OK: zendesk-router-skill structure, routing coverage, fixtures, companion manifest, maintenance references, and shared-agent portability checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
