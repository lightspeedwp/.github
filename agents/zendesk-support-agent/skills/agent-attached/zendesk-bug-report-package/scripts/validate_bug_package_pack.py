#!/usr/bin/env python3
"""Validate zendesk-bug-report-package shared-agent package contents."""
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
    "references/routing-boundaries.md",
    "references/shared-agent-setup.md",
    "references/memory-policy.md",
    "references/router-integration.md",
    "references/source-access-profile.md",
    "templates/bug-package-template.md",
    "examples/bug-package-cases.md",
    "examples/shared-agent-smoke-tests.md",
    "fixtures/router-bug-package-cases.json",
    "schemas/bug-package.schema.json",
]

CANONICAL_SKILLS = [
    "zendesk-bug-report-package",
    "zendesk-triage-router",
    "zendesk-evidence-collector",
    "zendesk-customer-research",
    "zendesk-customer-escalation",
    "zendesk-draft-response",
    "zendesk-evidence-quality-review",
    "zendesk-help-center-grounding",
    "zendesk-duplicate-pattern-review",
    "zendesk-handoff-prep",
]

BANNED_MARKERS = [
    "Ash's",
    "Ash’s",
    "ashley@",
    "my Gmail",
    "my Zendesk",
    "my Slack",
    "private Zendesk view",
    "TODO",
]


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).is_file():
            fail(f"missing required file: {rel}")

    skill_md = read("SKILL.md")
    if not re.match(r"^---\nname: zendesk-bug-report-package\ndescription: .+\n---\n", skill_md, re.S):
        fail("SKILL.md frontmatter missing expected name/description")
    if "shared-agent" not in skill_md and "shared workspace" not in skill_md:
        fail("SKILL.md should include shared-agent/shared workspace behaviour")
    for rel in REQUIRED_FILES:
        if rel.startswith(("references/", "templates/", "schemas/", "examples/", "fixtures/", "scripts/")) and rel not in skill_md:
            fail(f"SKILL.md does not mention bundled resource: {rel}")

    routing = read("references/routing-boundaries.md")
    router_integration = read("references/router-integration.md")
    combined_routing = routing + "\n" + router_integration
    for skill in CANONICAL_SKILLS:
        if skill not in combined_routing and skill != "zendesk-bug-report-package":
            fail(f"routing references missing canonical skill: {skill}")
    if "zendesk-ticket-triage" in combined_routing:
        fail("routing references should use canonical zendesk-triage-router, not legacy zendesk-ticket-triage")

    template = read("templates/bug-package-template.md")
    for term in [
        "Problem statement",
        "Affected context",
        "Expected behaviour",
        "Actual behaviour",
        "Reproduction clues or steps",
        "Troubleshooting already attempted",
        "Impact and severity signals",
        "Evidence register",
        "Recommended next action",
        "Caution notes",
        "Support-observed",
    ]:
        if term not in template:
            fail(f"template missing required term: {term}")

    schema = json.loads(read("schemas/bug-package.schema.json"))
    required = schema.get("required", [])
    for field in ["readiness", "problem_statement", "evidence_register", "recommended_next_action"]:
        if field not in required:
            fail(f"schema missing required field: {field}")
    actual_props = schema["properties"]["actual_behaviour"]["properties"]
    if "support_observed" not in actual_props:
        fail("schema actual_behaviour should include support_observed")

    fixtures = json.loads(read("fixtures/router-bug-package-cases.json"))
    cases = fixtures.get("cases")
    if not isinstance(cases, list) or len(cases) < 5:
        fail("fixtures must contain at least five cases")
    for case in cases:
        for field in ["id", "input", "expected_primary_skill", "expected_supporting_skill", "requires_zendesk_access", "notes"]:
            if field not in case:
                fail(f"fixture missing {field}: {case}")

    text_files = list(ROOT.glob("**/*.md")) + list(ROOT.glob("**/*.yaml")) + list(ROOT.glob("**/*.json"))
    for file_path in text_files:
        content = file_path.read_text(encoding="utf-8")
        for marker in BANNED_MARKERS:
            if marker in content:
                fail(f"banned marker found in {file_path.relative_to(ROOT)}: {marker}")

    print("OK: zendesk-bug-report-package structure, routing references, fixtures, schema, and shared-agent portability checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
