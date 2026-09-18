#!/usr/bin/env python3
"""Validate periodic health review workflow files, schema, fixture and routing coverage."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/periodic-health-review-playbook.md",
    "references/yoast-health-score-model.md",
    "templates/yoast-health-summary.md",
    "templates/yoast-retainer-review-note.md",
    "schemas/health-review.schema.json",
    "fixtures/sample-health-review.json",
    "tests/health-review-scenario-tests.md",
]

ROUTING_REQUIRED = [
    "references/periodic-health-review-playbook.md",
    "references/yoast-health-score-model.md",
    "templates/yoast-health-summary.md",
    "templates/yoast-retainer-review-note.md",
]

ALLOWED_REVIEW_TYPES = {"monthly", "quarterly", "post_launch", "post_update", "portfolio", "ad_hoc"}
ALLOWED_STATUS = {"green", "light_amber", "amber", "red", "critical", "unscored"}
ALLOWED_CONFIDENCE = {"high", "medium", "low", "insufficient"}


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        return fail({"missing_health_review_files": missing})

    for rel in REQUIRED:
        text = (root / rel).read_text(encoding="utf-8")
        if "TO" + "DO" in text or "TB" + "D" in text:
            return fail({"unresolved_marker": rel})

    fixture = json.loads((root / "fixtures/sample-health-review.json").read_text(encoding="utf-8"))
    schema = json.loads((root / "schemas/health-review.schema.json").read_text(encoding="utf-8"))
    for key in schema.get("required", []):
        if key not in fixture:
            return fail({"fixture_missing_required_key": key})
    if fixture.get("review_type") not in ALLOWED_REVIEW_TYPES:
        return fail({"invalid_review_type": fixture.get("review_type")})
    if fixture.get("overall_status") not in ALLOWED_STATUS:
        return fail({"invalid_overall_status": fixture.get("overall_status")})
    if fixture.get("confidence") not in ALLOWED_CONFIDENCE:
        return fail({"invalid_confidence": fixture.get("confidence")})
    score = fixture.get("configuration_health_score")
    if score is not None and not (0 <= score <= 100):
        return fail({"invalid_score": score})

    corpus = "\n".join([
        (root / "SKILL.md").read_text(encoding="utf-8"),
        (root / "references/file-routing-index.md").read_text(encoding="utf-8"),
        (root / "references/future-skill-architecture.md").read_text(encoding="utf-8"),
    ])
    missing_routes = [p for p in ROUTING_REQUIRED if p not in corpus]
    if missing_routes:
        return fail({"health_review_unrouted_paths": missing_routes})

    print("health review pack validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
