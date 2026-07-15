#!/usr/bin/env python3
"""Regression checks for the Zendesk Draft Response skill package.

Usage:
  python scripts/run_skill_checks.py .

The checks are intentionally lightweight and dependency-free so they can run in
shared-agent packaging or local review environments.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from pathlib import Path
from typing import Any

REQUIRED_FILES = [
    "SKILL.md",
    "agents/openai.yaml",
    "templates/customer-reply-template.md",
    "templates/reply-only-template.md",
    "templates/CONNECTORS.example.md",
    "schemas/support-reply-context.schema.json",
    "references/shared-agent-setup.md",
    "references/shared-agent-installation-checklist.md",
    "references/shared-agent-regression-tests.md",
    "references/data-redaction-rules.md",
    "references/routing-boundaries.md",
    "references/connector-source-map.md",
    "references/evidence-quality-rules.md",
    "references/escalation-boundaries.md",
    "references/localisation-rules.md",
    "references/tone-playbook.md",
    "scripts/lint_reply.py",
    "scripts/redact_context.py",
    "templates/redacted-support-context-template.md",
]

EXAMPLE_STEMS = [
    "new-issue",
    "frustrated-follow-up",
    "no-eta-delay",
    "feature-limitation",
    "billing-risk",
    "localisation",
]

# Patterns that should not appear in a shared-agent-safe skill package.
NON_PORTABLE_PATTERNS = {
    "connector_id": re.compile(r"connector_[a-z0-9]+", re.IGNORECASE),
    "app_id": re.compile(r"asdk_app_[a-z0-9]+", re.IGNORECASE),
    "file_id": re.compile(r"id:[a-z0-9]{20,}", re.IGNORECASE),
    "must_use_personal_memory": re.compile(r"\bmust rely on personal memory\b", re.IGNORECASE),
}

TEXT_EXTENSIONS = {".md", ".yaml", ".yml", ".json", ".py", ".txt"}


def load_linter(skill_root: Path) -> Any:
    lint_path = skill_root / "scripts" / "lint_reply.py"
    spec = importlib.util.spec_from_file_location("lint_reply", lint_path)
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load scripts/lint_reply.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def collect_text_files(skill_root: Path) -> list[Path]:
    return [
        path for path in skill_root.rglob("*")
        if path.is_file() and path.suffix.lower() in TEXT_EXTENSIONS
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Run regression checks for a skill package.")
    parser.add_argument("skill_root", type=Path, help="Path to the skill folder")
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON only")
    args = parser.parse_args()

    root = args.skill_root.resolve()
    checks: list[dict[str, str]] = []
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []

    def ok(code: str, message: str) -> None:
        checks.append({"code": code, "message": message})

    def error(code: str, message: str) -> None:
        errors.append({"code": code, "message": message})

    def warn(code: str, message: str) -> None:
        warnings.append({"code": code, "message": message})

    if not root.exists() or not root.is_dir():
        error("missing_skill_root", f"Skill root does not exist or is not a directory: {root}")
    else:
        ok("skill_root", f"Skill root found: {root}")

    for rel in REQUIRED_FILES:
        if not (root / rel).is_file():
            error("missing_required_file", f"Missing required file: {rel}")
    ok("required_file_scan", "Required file scan completed.")

    for stem in EXAMPLE_STEMS:
        input_path = root / "examples" / f"{stem}.input.md"
        expected_path = root / "examples" / f"{stem}.expected.md"
        if not input_path.is_file() or not expected_path.is_file():
            error("missing_example_pair", f"Missing example pair for: {stem}")
    ok("example_pair_scan", "Example pair scan completed.")

    schema_path = root / "schemas" / "support-reply-context.schema.json"
    if schema_path.is_file():
        try:
            json.loads(schema_path.read_text(encoding="utf-8"))
            ok("schema_json", "support-reply-context schema is valid JSON.")
        except json.JSONDecodeError as exc:
            error("invalid_schema_json", f"Schema JSON is invalid: {exc}")

    for path in collect_text_files(root):
        rel = path.relative_to(root).as_posix()
        if rel == "scripts/run_skill_checks.py":
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for code, pattern in NON_PORTABLE_PATTERNS.items():
            if pattern.search(text):
                error("non_portable_reference", f"{code} pattern found in {rel}")
    ok("non_portable_scan", "Non-portable connector/file ID scan completed.")


    skill_text = (root / "SKILL.md").read_text(encoding="utf-8", errors="replace") if (root / "SKILL.md").is_file() else ""
    routing_text = (root / "references" / "routing-boundaries.md").read_text(encoding="utf-8", errors="replace") if (root / "references" / "routing-boundaries.md").is_file() else ""
    smoke_text = (root / "tests" / "shared-agent-smoke-prompts.md").read_text(encoding="utf-8", errors="replace") if (root / "tests" / "shared-agent-smoke-prompts.md").is_file() else ""

    boundary_requirements = {
        "skill_references_routing_boundaries": ("references/routing-boundaries.md" in skill_text),
        "skill_returns_to_router": ("zendesk-router-skill" in skill_text and "Return to `zendesk-router-skill`" in skill_text),
        "skill_avoids_second_router": ("second Zendesk router" in skill_text or "second zendesk router" in skill_text.lower()),
        "routing_network_owner": ("`zendesk-router-skill` owns the full Zendesk skill network" in routing_text),
        "routing_no_full_map": ("must not maintain or present a complete map" in routing_text),
        "smoke_router_boundary": ("Router Boundary" in smoke_text and "zendesk-router-skill" in smoke_text),
    }
    for code, passed in boundary_requirements.items():
        if not passed:
            error("routing_boundary_missing", f"Missing routing boundary requirement: {code}")
    ok("routing_boundary_scan", "Routing boundary scan completed.")

    if (root / "scripts" / "lint_reply.py").is_file():
        try:
            linter = load_linter(root)
            for stem in EXAMPLE_STEMS:
                expected_path = root / "examples" / f"{stem}.expected.md"
                if not expected_path.is_file():
                    continue
                result = linter.lint(expected_path.read_text(encoding="utf-8"))
                if result["issues"]:
                    error("example_lint_issue", f"{expected_path.relative_to(root)} has lint issues: {result['issues']}")
                if result["warnings"]:
                    warn("example_lint_warning", f"{expected_path.relative_to(root)} has lint warnings: {result['warnings']}")
            ok("example_lint", "Bundled expected replies were linted.")
        except Exception as exc:  # noqa: BLE001 - tool should report, not crash unclearly.
            error("linter_failed", f"Could not run bundled linter: {exc}")

    redactor_path = root / "scripts" / "redact_context.py"
    if redactor_path.is_file():
        try:
            spec = importlib.util.spec_from_file_location("redact_context", redactor_path)
            if spec is None or spec.loader is None:
                raise RuntimeError("Could not load scripts/redact_context.py")
            redactor = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(redactor)
            sample = (
                "Customer Jane Smith from Acme Ltd emailed jane@acme.test about "
                "https://private.example.test/admin and ticket #123456. "
                "Bearer [REDACTED_SECRET]"
            )
            redacted, counts = redactor.redact(sample, [("Jane Smith", "Customer A"), ("Acme Ltd", "Example Account")])
            forbidden = ["jane@acme.test", "private.example.test", "#123456", "abcdefghijklmnopqrstuvwxyz123456", "Jane Smith", "Acme Ltd"]
            if any(value in redacted for value in forbidden):
                error("redactor_self_test_failed", "Redaction helper left sensitive sample values in output.")
            elif not counts:
                error("redactor_self_test_failed", "Redaction helper did not report any replacements.")
            else:
                ok("redactor_self_test", "Redaction helper self-test passed.")
        except Exception as exc:  # noqa: BLE001 - tool should report, not crash unclearly.
            error("redactor_failed", f"Could not run bundled redactor: {exc}")

    payload = {
        "status": "pass" if not errors else "fail",
        "check_count": len(checks),
        "error_count": len(errors),
        "warning_count": len(warnings),
        "checks": checks,
        "errors": errors,
        "warnings": warnings,
    }

    if args.json:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    else:
        print(f"status: {payload['status']}")
        print(f"checks: {len(checks)}")
        print(f"errors: {len(errors)}")
        for item in errors:
            print(f"- ERROR {item['code']}: {item['message']}")
        print(f"warnings: {len(warnings)}")
        for item in warnings:
            print(f"- WARN {item['code']}: {item['message']}")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
