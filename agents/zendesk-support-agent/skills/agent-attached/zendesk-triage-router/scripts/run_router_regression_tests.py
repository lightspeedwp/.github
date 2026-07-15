#!/usr/bin/env python3
"""Run deterministic regression checks for zendesk-triage-router cases.

This does not simulate the language model. It validates that the packaged
regression cases, namespace map, and router guardrails remain aligned so future
edits do not reintroduce legacy routing or missing-workflow assumptions.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

CANONICAL_WORKFLOWS = {
    "zendesk-triage-router",
    "zendesk-router-skill",
    "zendesk-evidence-collector",
    "zendesk-customer-research",
    "zendesk-draft-response",
    "zendesk-customer-escalation",
    "zendesk-handoff-prep",
    "zendesk-case-readiness-check",
    "zendesk-duplicate-pattern-review",
    "zendesk-knowledge-candidate-review",
    "zendesk-create-knowledge",
    "zendesk-backlog-trend-analysis",
    "zendesk-evidence-quality-review",
}

LEGACY_NON_PREFIXED_ROUTES = {"-".join(parts) for parts in [
    ("case", "investigation"),
    ("draft", "response"),
    ("customer", "escalation"),
    ("create", "knowledge"),
    ("backlog", "trend", "analysis"),
]}

LEGACY_OR_PREMATURE_PATTERNS = [
    "ticket-triage",
    *sorted(LEGACY_NON_PREFIXED_ROUTES),
    "linear-triage-router",
    "linear-gap-analyzer",
    "linear-the-architect",
]

REQUIRED_CASE_IDS = {
    "embedded-classification-only",
    "proof-root-cause",
    "customer-reply-confirmed-facts",
    "customer-reply-thin-evidence",
    "impact-escalation",
    "support-handoff-not-escalation",
    "duplicate-ambiguity",
    "weekly-trend-report",
    "documentation-worthiness",
    "documentation-draft-approved",
    "explicit-downstream-handoff-before-github",
    "customer-account-context-only",
    "review-existing-draft",
    "missing-attached-workflow-fallback",
    "zendesk-unavailable-pasted-evidence",
    "shared-agent-installation-smoke-test",
    "canonical-reply-workflow-unavailable",
    "zendesk-field-signals-triage",
    "manual-output-qa-for-ambiguous-route",
    "return-to-central-zendesk-router",
}

VALID_MODES = {"embedded_triage", "routing", "plain_language_fallback"}


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"{path.relative_to(path.parents[1])} is invalid JSON: {exc}") from exc


def scan_namespace_map(text: str) -> set[str]:
    return set(re.findall(r"canonical:\s*(zendesk-[a-z0-9-]+)", text))


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    errors: list[str] = []

    cases_path = root / "references" / "router-regression-cases.json"
    namespace_path = root / "references" / "workflow-namespace-map.yaml"
    skill_md_path = root / "SKILL.md"

    for required in [cases_path, namespace_path, skill_md_path]:
        if not required.is_file():
            errors.append(f"missing required file: {required.relative_to(root)}")

    if errors:
        return fail(errors)

    data = load_json(cases_path)
    cases = data.get("cases")
    if not isinstance(cases, list) or not cases:
        errors.append("router-regression-cases.json must contain a non-empty cases array")
        return fail(errors)

    namespace_text = namespace_path.read_text(encoding="utf-8")
    mapped_canonical = scan_namespace_map(namespace_text) | {"zendesk-triage-router"}
    missing_from_map = CANONICAL_WORKFLOWS - mapped_canonical
    if missing_from_map:
        errors.append("workflow namespace map missing canonical workflows: " + ", ".join(sorted(missing_from_map)))

    seen_ids: set[str] = set()
    for index, case in enumerate(cases, start=1):
        case_id = case.get("id")
        if not case_id or not isinstance(case_id, str):
            errors.append(f"case {index} missing string id")
            continue
        if case_id in seen_ids:
            errors.append(f"duplicate case id: {case_id}")
        seen_ids.add(case_id)

        if not case.get("input"):
            errors.append(f"{case_id}: missing input")

        expected = case.get("expected")
        if not isinstance(expected, dict):
            errors.append(f"{case_id}: expected must be an object")
            continue

        mode = expected.get("mode")
        if mode not in VALID_MODES:
            errors.append(f"{case_id}: invalid mode {mode!r}")

        primary = expected.get("primary_workflow")
        executable = expected.get("executable_workflow", primary)

        if mode in {"embedded_triage", "routing"}:
            if primary not in CANONICAL_WORKFLOWS:
                errors.append(f"{case_id}: primary_workflow must name the canonical intent, got {primary!r}")
            if executable != primary:
                errors.append(f"{case_id}: executable_workflow must not differ from canonical primary_workflow")
        if mode == "plain_language_fallback":
            if primary is not None:
                errors.append(f"{case_id}: fallback cases must not name an executable primary_workflow")
            if not expected.get("fallback_plain_language"):
                errors.append(f"{case_id}: fallback case missing fallback_plain_language")

        supporting = expected.get("optional_supporting_workflow")
        if supporting and supporting != "none" and supporting not in CANONICAL_WORKFLOWS:
            errors.append(f"{case_id}: optional_supporting_workflow must be canonical or none, got {supporting!r}")

        forbidden = set(expected.get("must_not_route_to", []))
        if primary in forbidden or executable in forbidden:
            errors.append(f"{case_id}: selected workflow is also listed in must_not_route_to")

        if mode != "plain_language_fallback" and primary in LEGACY_OR_PREMATURE_PATTERNS:
            errors.append(f"{case_id}: legacy or premature route used as canonical primary: {primary}")

        available = case.get("available_workflows")
        if available is not None:
            if not isinstance(available, list) or not all(isinstance(item, str) for item in available):
                errors.append(f"{case_id}: available_workflows must be a list of strings")
            elif mode != "plain_language_fallback" and executable not in available:
                errors.append(f"{case_id}: executable workflow is not listed as available")

        reference = expected.get("must_consult_reference")
        if reference and not (root / reference).is_file():
            errors.append(f"{case_id}: must_consult_reference does not exist: {reference}")

    missing_cases = REQUIRED_CASE_IDS - seen_ids
    if missing_cases:
        errors.append("missing required regression cases: " + ", ".join(sorted(missing_cases)))

    skill_md = skill_md_path.read_text(encoding="utf-8")
    for snippet in ["router-regression-cases.json", "run_router_regression_tests.py", "parent-agent-routing.md", "zendesk-field-map.md", "routing-boundaries.md"]:
        if snippet not in skill_md:
            errors.append(f"SKILL.md missing test harness reference: {snippet}")

    if errors:
        return fail(errors)

    print(f"Router regression cases passed ({len(cases)} cases).")
    return 0


def fail(errors: list[str]) -> int:
    print("Router regression checks failed:")
    for error in errors:
        print(f"- {error}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
