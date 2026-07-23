#!/usr/bin/env python3
"""Validate multilingual and hreflang workflow files for the Yoast configuration skill."""
from pathlib import Path
import json
import sys

REQUIRED = [
    "references/multilingual-hreflang-playbook.md",
    "references/locale-metadata-governance.md",
    "templates/multilingual-seo-qa-report.md",
    "templates/translated-metadata-approval-pack.md",
    "schemas/multilingual-page-set.schema.json",
    "fixtures/sample-multilingual-page-set.json",
    "tests/multilingual-hreflang-scenario-tests.md",
]

ROUTING_REQUIRED = [
    "references/multilingual-hreflang-playbook.md",
    "references/locale-metadata-governance.md",
    "templates/multilingual-seo-qa-report.md",
    "templates/translated-metadata-approval-pack.md",
    "scripts/validate_multilingual_pack.py",
]

KEYWORDS = ["hreflang", "translation", "canonical", "sitemap", "metadata"]


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        return fail({"missing_multilingual_files": missing})

    for rel in ["schemas/multilingual-page-set.schema.json", "fixtures/sample-multilingual-page-set.json"]:
        try:
            json.loads((root / rel).read_text(encoding="utf-8"))
        except Exception as exc:
            return fail({"invalid_json": rel, "error": str(exc)})

    sample = json.loads((root / "fixtures/sample-multilingual-page-set.json").read_text(encoding="utf-8"))
    for field in ["set_id", "default_url", "language_urls", "evidence_state", "qa_status"]:
        if field not in sample:
            return fail({"sample_missing_field": field})
    if not sample.get("language_urls") or len(sample["language_urls"]) < 2:
        return fail({"sample_language_urls": "expected at least two language URLs"})

    corpus = "\n".join([
        (root / "SKILL.md").read_text(encoding="utf-8"),
        (root / "references/file-routing-index.md").read_text(encoding="utf-8"),
        (root / "references/future-skill-architecture.md").read_text(encoding="utf-8"),
    ])
    missing_routes = [p for p in ROUTING_REQUIRED if p not in corpus]
    if missing_routes:
        return fail({"missing_multilingual_routes": missing_routes})

    combined = "\n".join((root / p).read_text(encoding="utf-8") for p in REQUIRED if p.endswith(".md"))
    missing_keywords = [k for k in KEYWORDS if k not in combined.lower()]
    if missing_keywords:
        return fail({"missing_keywords": missing_keywords})

    print("multilingual pack validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
