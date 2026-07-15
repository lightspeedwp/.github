#!/usr/bin/env python3
"""Lightweight checks for the zendesk-ticket-triage skill bundle."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_SECTIONS = [
    "Issue summary",
    "Urgency",
    "Severity",
    "Recommended priority",
    "Issue type",
    "Likely owner",
    "Duplicate or pattern risk",
    "Customer impact",
    "Confirmed facts",
    "Inferred risks or concerns",
    "Missing information",
    "Escalation signals",
    "Recommended next action",
    "Recommended downstream skill",
]

CANONICAL_SKILLS = [
    "zendesk-router-skill",
    "zendesk-triage-router",
    "zendesk-evidence-collector",
    "zendesk-case-readiness-check",
    "zendesk-draft-response",
    "zendesk-customer-research",
    "zendesk-customer-escalation",
    "zendesk-handoff-prep",
    "zendesk-duplicate-pattern-review",
    "zendesk-knowledge-candidate-review",
    "zendesk-create-knowledge",
    "zendesk-backlog-trend-analysis",
    "zendesk-evidence-quality-review",
]

OPTIONAL_SKILLS = [
    "zendesk-refund-assessment",
    "zendesk-bug-report-package",
]

LEGACY_SKILLS = [
    "ticket-triage",
    "draft-response",
    "customer-escalation",
    "create-knowledge",
    "backlog-trend-analysis",
    "case-investigation",
]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def all_text() -> str:
    return "\n".join(
        path.read_text(encoding="utf-8")
        for path in ROOT.rglob("*")
        if path.is_file() and path.suffix in {".md", ".yaml", ".yml", ".json"}
    )


def test_skill_md_has_frontmatter() -> None:
    skill_md = read("SKILL.md")
    assert skill_md.startswith("---\n")
    assert re.search(r"\nname: zendesk-ticket-triage\n", skill_md)
    assert "description:" in skill_md.split("---", 2)[1]


def test_template_sections() -> None:
    template = read("templates/internal-triage-package.md")
    for section in REQUIRED_SECTIONS:
        assert f"## {section}" in template


def test_package_examples_include_required_sections() -> None:
    for filename in [
        "examples/01-incomplete-inbound-case.md",
        "examples/02-messy-multi-issue-ticket.md",
        "examples/03-ambiguous-ownership.md",
        "examples/04-escalation-signals.md",
    ]:
        example = read(filename)
        for section in REQUIRED_SECTIONS:
            assert f"## {section}" in example, f"{filename} is missing {section}"


def test_schema_required_fields_match_fixture() -> None:
    schema = json.loads(read("schemas/triage-package.schema.json"))
    fixture = json.loads(read("fixtures/sample-triage-package.json"))
    for field in schema["required"]:
        assert field in fixture
    assert fixture["urgency"] in schema["properties"]["urgency"]["enum"]
    assert fixture["severity"] in schema["properties"]["severity"]["enum"]
    assert fixture["recommended_priority"] in schema["properties"]["recommended_priority"]["enum"]
    assert fixture["issue_type"] in schema["properties"]["issue_type"]["enum"]
    assert fixture["likely_owner"] in schema["properties"]["likely_owner"]["enum"]
    assert fixture["duplicate_or_pattern_risk"] in schema["properties"]["duplicate_or_pattern_risk"]["enum"]
    assert fixture["escalation_signals"] in schema["properties"]["escalation_signals"]["enum"]


def test_template_avoids_downstream_triage_router_loop() -> None:
    template = read("templates/internal-triage-package.md")
    downstream = template.split("## Recommended downstream skill", 1)[1]
    assert "Use `zendesk-triage-router` only as a route-away note" in downstream


def test_canonical_skill_names_present() -> None:
    text = all_text()
    for skill in CANONICAL_SKILLS:
        assert skill in text


def test_optional_skills_are_marked_optional_or_fallback() -> None:
    skill_md = read("SKILL.md") + "\n" + read("references/canonical-workflow-map.yaml")
    for skill in OPTIONAL_SKILLS:
        assert skill in skill_md
        nearby = skill_md[max(0, skill_md.find(skill) - 240): skill_md.find(skill) + 360].lower()
        assert "attached" in nearby or "optional" in nearby or "fallback" in nearby


def test_legacy_names_are_only_warned_against() -> None:
    workflow_map = read("references/canonical-workflow-map.yaml")
    router_compatibility = read("references/router-compatibility.md")
    skill_md = read("SKILL.md")
    for legacy in LEGACY_SKILLS:
        assert legacy not in skill_md or "legacy" in skill_md.lower() or "deprecated" in skill_md.lower()
        assert legacy in workflow_map or legacy in router_compatibility


def test_shared_agent_examples_present() -> None:
    for filename in [
        "examples/06-shared-agent-no-zendesk-access.md",
        "examples/07-router-invocation.md",
        "examples/08-downstream-skill-unavailable.md",
    ]:
        assert (ROOT / filename).exists()


def test_no_obvious_real_sensitive_data_in_examples_or_fixtures() -> None:
    text = "\n".join(
        path.read_text(encoding="utf-8")
        for folder in ["examples", "fixtures"]
        for path in (ROOT / folder).rglob("*.*")
    )
    assert "@lsdev.biz" not in text
    assert "lightspeedwp.agency" not in text
    assert "https://" not in text
    assert "Bearer " not in text
    assert "api_key" not in text.lower()


if __name__ == "__main__":
    test_skill_md_has_frontmatter()
    test_template_sections()
    test_package_examples_include_required_sections()
    test_schema_required_fields_match_fixture()
    test_template_avoids_downstream_triage_router_loop()
    test_canonical_skill_names_present()
    test_optional_skills_are_marked_optional_or_fallback()
    test_legacy_names_are_only_warned_against()
    test_shared_agent_examples_present()
    test_no_obvious_real_sensitive_data_in_examples_or_fixtures()
    print("all lightweight skill checks passed")
