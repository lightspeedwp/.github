#!/usr/bin/env python3
"""Validate that the Yoast configuration skill has required reference, intake, profile, template, docs, v2 support files, and no unresolved TODO markers."""
from pathlib import Path
import sys

REQUIRED = [
    "tests/redirect-migration-scenario-tests.md",
    "scripts/validate_redirect_migration_pack.py",
    "fixtures/sample-redirect-map-row.json",
    "schemas/redirect-map-row.schema.json",
    "templates/migration-launch-seo-control-plan.md",
    "templates/redirect-map-review.md",
    "references/redirect-map-decision-model.md",
    "references/redirect-migration-governance.md",
    "tests/multilingual-hreflang-scenario-tests.md",
    "scripts/validate_multilingual_pack.py",
    "fixtures/sample-multilingual-page-set.json",
    "schemas/multilingual-page-set.schema.json",
    "templates/translated-metadata-approval-pack.md",
    "templates/multilingual-seo-qa-report.md",
    "references/locale-metadata-governance.md",
    "references/multilingual-hreflang-playbook.md",
    "references/content-structure-taxonomy-playbook.md",
    "references/taxonomy-indexation-decision-model.md",
    "templates/taxonomy-indexation-decision-pack.md",
    "templates/content-structure-remediation-plan.md",
    "schemas/taxonomy-decision.schema.json",
    "fixtures/sample-taxonomy-decision.json",
    "scripts/validate_taxonomy_pack.py",
    "tests/content-taxonomy-scenario-tests.md",
    "SKILL.md",
    "scripts/validate_related_skill_routing.py",
    "tests/related-skills-routing-scenario-tests.md",
    "references/related-skills-routing.md",
    "agents/openai.yaml",
    "references/product-capability-matrix.md",
    "references/configuration-reference.md",
    "references/feature-behaviour-reference.md",
    "references/schema-reference.md",
    "references/woocommerce-seo-reference.md",
    "references/developer-api-reference.md",
    "references/configuration-playbooks.md",
    "references/qa-checklists.md",
    "references/source-register.md",
    "references/research-pack-output-spec.md",
    "references/future-skill-architecture.md",
    "references/file-routing-index.md",
    "scripts/validate_artefact_review.py",
    "fixtures/sample-rendered-output-check.json",
    "schemas/rendered-output-check.schema.json",
    "tests/artefact-review-scenario-tests.md",
    "templates/rendered-output-qa-report.md",
    "templates/settings-export-review.md",
    "references/rendered-output-qa-playbook.md",
    "references/settings-export-review-playbook.md",
    "references/evidence-state-model.md",
    "intake/client-site-intake.md",
    "intake/wordpress-site-intake.md",
    "intake/woocommerce-intake.md",
    "intake/migration-intake.md",
    "profiles/business-website.md",
    "profiles/local-business.md",
    "profiles/publisher-blog.md",
    "profiles/ecommerce-catalogue.md",
    "profiles/ecommerce-transactional.md",
    "profiles/multilingual-site.md",
    "profiles/migration-rebuild.md",
    "templates/yoast-configuration-report.md",
    "templates/yoast-audit-report.md",
    "templates/yoast-woocommerce-report.md",
    "templates/developer-handoff.md",
    "templates/launch-qa-checklist.md",
    "templates/yoast-research-pack.md",
    "templates/source-register-row-template.md",
    "templates/yoast-troubleshooting-note.md",
    "docs/current-verification-playbook.md",
    "references/audit-triage-model.md",
    "docs/usage-guide.md",
    "docs/research-workflow.md",
    "docs/evidence-policy.md",
    "docs/maintenance-guide.md",
    "docs/reference-refresh-protocol.md",
    "docs/changelog.md",
    "schemas/yoast-setting.schema.json",
    "schemas/configuration-check.schema.json",
    "schemas/product-capability.schema.json",
    "schemas/schema-piece.schema.json",
    "schemas/source-register.schema.json",
    "schemas/research-pack.schema.json",
    "fixtures/sample-yoast-settings-export.json",
    "fixtures/sample-wordpress-content-types.json",
    "fixtures/sample-woocommerce-taxonomies.json",
    "fixtures/sample-schema-output.json",
    "fixtures/sample-source-register-row.json",
    "tests/reference-data-validation.md",
    "tests/configuration-scenario-tests.md",
    "tests/woocommerce-scenario-tests.md",
    "tests/developer-api-reference-tests.md",
    "tests/research-pack-scenario-tests.md",
    "tests/audit-triage-scenario-tests.md",
    "scripts/validate_evidence_states.py",
    "fixtures/sample-audit-finding.json",
    "schemas/audit-finding.schema.json",
    "templates/yoast-troubleshooting-note.md",
    "docs/current-verification-playbook.md",
    "references/audit-triage-model.md",
    "references/periodic-health-review-playbook.md",

    "references/ai-assisted-seo-workflow.md",
    "references/ai-metadata-review-model.md",
    "templates/ai-metadata-approval-pack.md",
    "templates/yoast-ai-plus-positioning-note.md",
    "schemas/ai-metadata-item.schema.json",
    "fixtures/sample-ai-metadata-item.json",
    "scripts/validate_ai_metadata_pack.py",
    "tests/ai-assisted-seo-scenario-tests.md",
    "references/yoast-health-score-model.md",
    "templates/yoast-health-summary.md",
    "templates/yoast-retainer-review-note.md",
    "schemas/health-review.schema.json",
    "fixtures/sample-health-review.json",
    "scripts/validate_health_review_pack.py",
    "tests/health-review-scenario-tests.md",
]

REQUIRED_SKILL_REFERENCES = [
    "references/related-skills-routing.md",
    "templates/translated-metadata-approval-pack.md",
    "templates/multilingual-seo-qa-report.md",
    "references/locale-metadata-governance.md",
    "references/multilingual-hreflang-playbook.md",
    "references/product-capability-matrix.md",
    "references/configuration-reference.md",
    "references/feature-behaviour-reference.md",
    "references/woocommerce-seo-reference.md",
    "references/schema-reference.md",
    "references/developer-api-reference.md",
    "references/qa-checklists.md",
    "references/research-pack-output-spec.md",
    "templates/yoast-research-pack.md",
    "templates/source-register-row-template.md",
    "templates/yoast-troubleshooting-note.md",
    "docs/current-verification-playbook.md",
    "references/audit-triage-model.md",
]

FORBIDDEN_MARKERS = ["TODO", "TBD", "lorem ipsum"]


def parse_frontmatter(text):
    if not text.startswith("---\n"):
        raise ValueError("SKILL.md missing YAML frontmatter")
    parts = text.split("---", 2)
    if len(parts) < 3:
        raise ValueError("SKILL.md frontmatter not closed")
    _empty, fm, _body = parts
    data = {}
    for line in fm.splitlines():
        if not line.strip() or ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip('"').strip("'")
    return data


def main(root="."):
    root = Path(root)
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        print({"missing": missing})
        return 1

    skill_text = (root / "SKILL.md").read_text(encoding="utf-8")
    try:
        frontmatter = parse_frontmatter(skill_text)
    except Exception as exc:
        print({"frontmatter_error": str(exc)})
        return 1

    if frontmatter.get("name") != "yoast-configuration":
        print({"invalid_name": frontmatter.get("name")})
        return 1
    desc = frontmatter.get("description", "")
    if len(desc) < 200 or "woocommerce" not in desc or "schema" not in desc:
        print({"weak_description": desc})
        return 1

    missing_refs = [p for p in REQUIRED_SKILL_REFERENCES if p not in skill_text]
    if missing_refs:
        print({"skill_missing_references": missing_refs})
        return 1

    bad = []
    for p in REQUIRED:
        text = (root / p).read_text(encoding="utf-8", errors="ignore")
        if any(marker in text for marker in FORBIDDEN_MARKERS):
            bad.append(p)
    if bad:
        print({"unresolved_markers": bad})
        return 1

    print("reference data validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
