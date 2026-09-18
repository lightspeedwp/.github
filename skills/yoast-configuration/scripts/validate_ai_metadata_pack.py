#!/usr/bin/env python3
"""Validate AI-assisted SEO workflow files, schema, fixture, and routing coverage."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/ai-assisted-seo-workflow.md",
    "references/ai-metadata-review-model.md",
    "templates/ai-metadata-approval-pack.md",
    "templates/yoast-ai-plus-positioning-note.md",
    "schemas/ai-metadata-item.schema.json",
    "fixtures/sample-ai-metadata-item.json",
    "tests/ai-assisted-seo-scenario-tests.md",
]

REQUIRED_ROUTE_TEXT = [
    "references/ai-assisted-seo-workflow.md",
    "references/ai-metadata-review-model.md",
    "templates/ai-metadata-approval-pack.md",
    "templates/yoast-ai-plus-positioning-note.md",
    "scripts/validate_ai_metadata_pack.py",
]

VALID_EVIDENCE_STATES = {
    "approved_page_copy",
    "partial_page_copy",
    "settings_template_only",
    "product_data_only",
    "unverified_claim_source",
    "ai_generated_source",
    "current_product_packaging_claim",
}
VALID_REVIEW_STATES = {
    "draft",
    "needs_source_evidence",
    "needs_content_edit",
    "needs_client_approval",
    "approved_for_admin_entry",
    "approved_as_template_pattern",
    "rejected",
    "live_verified",
}


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        return fail({"missing_ai_pack_files": missing})

    schema = json.loads((root / "schemas/ai-metadata-item.schema.json").read_text(encoding="utf-8"))
    fixture = json.loads((root / "fixtures/sample-ai-metadata-item.json").read_text(encoding="utf-8"))

    required = set(schema.get("required", []))
    missing_required = [key for key in required if key not in fixture]
    if missing_required:
        return fail({"fixture_missing_required_keys": missing_required})

    if fixture.get("evidence_state") not in VALID_EVIDENCE_STATES:
        return fail({"invalid_evidence_state": fixture.get("evidence_state")})
    if fixture.get("review_state") not in VALID_REVIEW_STATES:
        return fail({"invalid_review_state": fixture.get("review_state")})
    if not fixture.get("qa_checks"):
        return fail({"missing_qa_checks": True})

    route_corpus = "\n".join([
        (root / "SKILL.md").read_text(encoding="utf-8"),
        (root / "references/file-routing-index.md").read_text(encoding="utf-8"),
        (root / "references/future-skill-architecture.md").read_text(encoding="utf-8"),
        (root / "docs/maintenance-guide.md").read_text(encoding="utf-8"),
    ])
    missing_routes = [text for text in REQUIRED_ROUTE_TEXT if text not in route_corpus]
    if missing_routes:
        return fail({"missing_ai_routes": missing_routes})

    print("AI metadata pack validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
