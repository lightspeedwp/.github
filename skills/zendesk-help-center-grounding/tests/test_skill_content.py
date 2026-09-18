#!/usr/bin/env python3
"""Lightweight content checks for zendesk-help-center-grounding."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def test_required_files_exist() -> None:
    required = [
        "SKILL.md",
        "agents/openai.yaml",
        "references/routing-boundaries.md",
        "references/shared-agent-setup.md",
        "references/memory-policy.md",
        "templates/grounding-brief-template.md",
        "examples/grounding-examples.md",
        "schemas/grounding-brief.schema.json",
    ]
    missing = [path for path in required if not (ROOT / path).exists()]
    assert not missing, f"missing required files: {missing}"


def test_routing_boundaries_name_adjacent_skills() -> None:
    content = read("references/routing-boundaries.md")
    for skill in [
        "zendesk-draft-response",
        "zendesk-customer-research",
        "zendesk-customer-escalation",
        "zendesk-evidence-quality-review",
        "zendesk-ticket-triage",
        "zendesk-refund-assessment",
    ]:
        assert skill in content, f"routing boundary missing {skill}"


def test_separates_documented_guidance_from_inference() -> None:
    content = read("SKILL.md")
    for phrase in [
        "documented guidance",
        "interpretation",
        "inference required",
        "Do not invent policy",
        "missing documentation",
    ]:
        assert phrase in content, f"missing safety phrase: {phrase}"


def test_output_template_has_expected_sections() -> None:
    template = read("templates/grounding-brief-template.md")
    for heading in [
        "## Bottom line",
        "## Relevant sources",
        "## Documented position",
        "## Alignment check",
        "## Gaps and risks",
        "## Safe drafting guidance",
        "## Handoff",
    ]:
        assert heading in template, f"template missing {heading}"


def test_schema_is_valid_json_and_has_required_shape() -> None:
    schema = json.loads(read("schemas/grounding-brief.schema.json"))
    assert schema["title"] == "Zendesk Help Center Grounding Brief"
    assert "documentation_status" in schema["required"]
    assert "recommended_downstream_skill" in schema["required"]
    statuses = schema["properties"]["documentation_status"]["enum"]
    assert "conflict" in statuses
    assert "inference required" in statuses


def test_examples_cover_edge_cases() -> None:
    examples = read("examples/grounding-examples.md")
    for phrase in [
        "Straightforward support",
        "Draft conflicts",
        "incomplete or ambiguous",
        "conflict or appear outdated",
        "route away",
    ]:
        assert phrase.lower() in examples.lower(), f"examples missing {phrase}"


if __name__ == "__main__":
    tests = [
        test_required_files_exist,
        test_routing_boundaries_name_adjacent_skills,
        test_separates_documented_guidance_from_inference,
        test_output_template_has_expected_sections,
        test_schema_is_valid_json_and_has_required_shape,
        test_examples_cover_edge_cases,
    ]
    for test in tests:
        test()
    print(f"{len(tests)} tests passed")
