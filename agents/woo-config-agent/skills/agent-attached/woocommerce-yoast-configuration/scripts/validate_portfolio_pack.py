#!/usr/bin/env python3
"""Validate portfolio/defaults-drift workflow files for the Yoast configuration skill."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/portfolio-audit-playbook.md",
    "references/agency-defaults-drift-model.md",
    "templates/yoast-portfolio-audit-summary.md",
    "templates/yoast-defaults-drift-report.md",
    "schemas/portfolio-site-summary.schema.json",
    "fixtures/sample-portfolio-site-summary.json",
    "tests/portfolio-defaults-scenario-tests.md",
]

ALLOWED_FINDING_TYPES = {
    "portfolio_pattern", "site_specific_defect", "accepted_exception", "evidence_gap", "needs_deep_audit"
}


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        return fail({"missing_portfolio_files": missing})

    schema = json.loads((root / "schemas/portfolio-site-summary.schema.json").read_text(encoding="utf-8"))
    fixture = json.loads((root / "fixtures/sample-portfolio-site-summary.json").read_text(encoding="utf-8"))

    required = set(schema.get("required", []))
    missing_required = sorted(required - set(fixture.keys()))
    if missing_required:
        return fail({"portfolio_fixture_missing_required": missing_required})

    if fixture.get("portfolio_finding_type") not in ALLOWED_FINDING_TYPES:
        return fail({"invalid_portfolio_finding_type": fixture.get("portfolio_finding_type")})

    corpus = "\n".join((root / p).read_text(encoding="utf-8", errors="ignore") for p in [
        "SKILL.md",
        "references/file-routing-index.md",
        "references/future-skill-architecture.md",
        "docs/usage-guide.md",
        "docs/maintenance-guide.md",
    ] if (root / p).exists())
    unrouted = [p for p in REQUIRED if p not in corpus and not p.startswith("fixtures/") and not p.startswith("schemas/")]
    if unrouted:
        return fail({"portfolio_files_not_routed": unrouted})

    print("portfolio pack validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
