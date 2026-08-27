#!/usr/bin/env python3
"""Static validator for the zendesk-refund-assessment skill package."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "SKILL.md",
    "agents/openai.yaml",
    "assets/icon.svg",
    "templates/refund-assessment-template.md",
    "schemas/refund-assessment.schema.json",
    "references/shared-agent-setup.md",
    "references/connector-fallbacks.md",
    "references/router-interoperability.md",
    "references/output-contract.md",
    "references/routing-boundaries.md",
    "references/memory-policy.md",
    "references/shared-agent-deployment-checklist.md",
    "references/changelog.md",
    "tests/smoke-prompts.md",
    "tests/refund-assessment-fixtures.json",
    "tests/refund-assessment-fixtures.schema.json",
]

CANONICAL_SKILLS = [
    "zendesk-router-skill",
    "zendesk-triage-router",
    "zendesk-evidence-collector",
    "zendesk-case-readiness-check",
    "zendesk-draft-response",
    "zendesk-help-center-grounding",
    "zendesk-customer-escalation",
    "zendesk-customer-research",
    "zendesk-evidence-quality-review",
]

LEGACY_ALIASES = [
    "`ticket-triage`",
    "`draft-response`",
    "`customer-escalation`",
    "`case-investigation`",
    "`create-knowledge`",
]

PORTABILITY_MARKERS = [
    r"ashley@",
    r"lsdev\.biz",
    r"private view",
    r"personal gmail",
    r"my gmail",
    r"my zendesk",
    r"my slack",
]

REQUIRED_OUTPUT_HEADINGS = [
    "request summary",
    "refund or compensation type",
    "confirmed evidence",
    "inference or uncertainty",
    "missing evidence",
    "relevant policy basis",
    "prior commitments or expectation risk",
    "approval or escalation needs",
    "risk factors",
    "recommended safest next step",
    "safe to draft customer reply now?",
    "recommended downstream skill",
]

DANGEROUS_WORDING = [
    "always approve",
    "automatically approve",
    "guarantee the refund",
    "refund them now",
    "definitely entitled",
]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def validate_required_files(errors: list[str]) -> None:
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            fail(errors, f"missing required file: {rel}")


def validate_frontmatter(errors: list[str]) -> None:
    text = read("SKILL.md")
    if not text.startswith("---\n"):
        fail(errors, "SKILL.md must start with YAML frontmatter")
        return
    match = re.match(r"---\n(.*?)\n---\n", text, flags=re.S)
    if not match:
        fail(errors, "SKILL.md frontmatter is not closed")
        return
    fm = match.group(1)
    if "name: zendesk-refund-assessment" not in fm:
        fail(errors, "frontmatter name must be zendesk-refund-assessment")
    if "description:" not in fm:
        fail(errors, "frontmatter description is missing")
    if re.search(r"description:.*[A-Z]", fm):
        fail(errors, "frontmatter description should remain lowercase")
    for phrase in ["refund", "credit", "compensation", "goodwill", "policy-exception", "zendesk-router-skill"]:
        if phrase not in fm:
            fail(errors, f"frontmatter description should mention: {phrase}")


def validate_references(errors: list[str]) -> None:
    skill = read("SKILL.md")
    for rel in REQUIRED_FILES:
        if rel.startswith(("references/", "templates/", "schemas/", "tests/", "scripts/")):
            if rel not in skill and rel not in ["tests/refund-assessment-fixtures.schema.json"]:
                fail(errors, f"SKILL.md does not reference {rel}")


def validate_output_contract(errors: list[str]) -> None:
    template = read("templates/refund-assessment-template.md").lower()
    contract = read("references/output-contract.md").lower()
    schema = json.loads(read("schemas/refund-assessment.schema.json"))
    schema_required = set(schema.get("required", []))
    for heading in REQUIRED_OUTPUT_HEADINGS:
        if f"## {heading}" not in template:
            fail(errors, f"template missing heading: {heading}")
        if f"`{heading}`" not in contract and heading not in contract:
            fail(errors, f"output contract missing heading: {heading}")
    for key in [h.replace(" ", "_").replace("?", "") for h in REQUIRED_OUTPUT_HEADINGS]:
        if key not in schema_required:
            fail(errors, f"schema required list missing key: {key}")


def validate_routing(errors: list[str]) -> None:
    all_text = "\n".join(
        p.read_text(encoding="utf-8")
        for p in ROOT.rglob("*.md")
        if ".zip" not in str(p)
    )
    for skill in CANONICAL_SKILLS:
        if skill not in all_text:
            fail(errors, f"canonical skill not mentioned anywhere: {skill}")
    for alias in LEGACY_ALIASES:
        if alias in all_text:
            fail(errors, f"legacy alias should not appear in shared-agent routing text: {alias}")


def validate_shared_agent(errors: list[str]) -> None:
    all_text = "\n".join(
        p.read_text(encoding="utf-8")
        for p in ROOT.rglob("*.md")
    ).lower()
    for marker in PORTABILITY_MARKERS:
        if re.search(marker, all_text):
            fail(errors, f"possible non-portable personal/workspace marker found: {marker}")
    for required in [
        "do not assume",
        "shared workspace agent",
        "pasted context",
        "smallest useful",
        "not available in this run",
    ]:
        if required not in all_text:
            fail(errors, f"shared-agent wording missing: {required}")


def validate_fixtures(errors: list[str]) -> None:
    fixtures = json.loads(read("tests/refund-assessment-fixtures.json"))
    if not isinstance(fixtures, list) or len(fixtures) < 5:
        fail(errors, "fixtures must contain at least five cases")
        return
    ids = set()
    for item in fixtures:
        for key in ["id", "prompt", "expected_primary_behaviour", "must_include", "must_not_include"]:
            if key not in item:
                fail(errors, f"fixture missing {key}: {item}")
        if item.get("id") in ids:
            fail(errors, f"duplicate fixture id: {item.get('id')}")
        ids.add(item.get("id"))
        for bad in ["real customer", "ticket #", "@example.com"]:
            if bad in json.dumps(item).lower():
                fail(errors, f"fixture may include non-anonymised data: {item.get('id')}")


def validate_language_safety(errors: list[str]) -> None:
    all_text = "\n".join(
        p.read_text(encoding="utf-8")
        for p in ROOT.rglob("*.md")
    ).lower()
    for phrase in DANGEROUS_WORDING:
        if phrase in all_text:
            fail(errors, f"unsafe wording found: {phrase}")
    for phrase in ["approval authority", "evidence is insufficient", "policy appears to support", "not confirmed"]:
        if phrase not in all_text:
            fail(errors, f"conservative wording pattern missing: {phrase}")


def main() -> int:
    errors: list[str] = []
    validate_required_files(errors)
    if not errors:
        validate_frontmatter(errors)
        validate_references(errors)
        validate_output_contract(errors)
        validate_routing(errors)
        validate_shared_agent(errors)
        validate_fixtures(errors)
        validate_language_safety(errors)
    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Validation passed: zendesk-refund-assessment is shared-agent and router ready.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
