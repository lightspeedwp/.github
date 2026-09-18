#!/usr/bin/env python3
"""Validate Yoast skill structure, routing references, and lightweight package hygiene."""
from pathlib import Path
import sys

CORE_FILES = [
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
    "references/file-routing-index.md",
    "references/evidence-state-model.md",
    "references/audit-triage-model.md",
    "references/decision-register-model.md",
    "references/conflict-resolution-playbook.md",
    "references/client-communication-guardrails.md",
    "docs/reference-refresh-protocol.md",
    "docs/current-verification-playbook.md",
    "templates/source-register-row-template.md",
    "templates/yoast-troubleshooting-note.md",
    "templates/yoast-decision-log.md",
    "templates/client-safe-summary.md",
    "tests/research-pack-scenario-tests.md",
    "tests/audit-triage-scenario-tests.md",
    "tests/decision-conflict-scenario-tests.md",
    "tests/artefact-review-scenario-tests.md",
    "templates/rendered-output-qa-report.md",
    "templates/settings-export-review.md",
    "references/rendered-output-qa-playbook.md",
    "references/settings-export-review-playbook.md",
    "references/state-comparison-playbook.md",
    "references/plugin-update-regression-playbook.md",
    "templates/yoast-state-comparison-report.md",
    "templates/yoast-regression-test-report.md",
    "templates/yoast-acceptance-criteria.md",
    "tests/comparison-regression-scenario-tests.md",
    "references/access-level-workflow.md",
    "references/remediation-backlog-model.md",
    "templates/yoast-remediation-backlog.md",
    "templates/wordpress-admin-change-plan.md",
    "schemas/remediation-item.schema.json",
    "fixtures/sample-remediation-item.json",
    "scripts/validate_remediation_pack.py",
    "tests/access-remediation-scenario-tests.md",
    "references/portfolio-audit-playbook.md",
    "references/agency-defaults-drift-model.md",
    "templates/yoast-portfolio-audit-summary.md",
    "templates/yoast-defaults-drift-report.md",
    "schemas/portfolio-site-summary.schema.json",
    "fixtures/sample-portfolio-site-summary.json",
    "scripts/validate_portfolio_pack.py",
    "tests/portfolio-defaults-scenario-tests.md",

    "references/ai-assisted-seo-workflow.md",
    "references/ai-metadata-review-model.md",
    "templates/ai-metadata-approval-pack.md",
    "templates/yoast-ai-plus-positioning-note.md",
    "schemas/ai-metadata-item.schema.json",
    "fixtures/sample-ai-metadata-item.json",
    "scripts/validate_ai_metadata_pack.py",
    "tests/ai-assisted-seo-scenario-tests.md",
    "tests/health-review-scenario-tests.md",
    "scripts/validate_health_review_pack.py",
    "fixtures/sample-health-review.json",
    "schemas/health-review.schema.json",
    "templates/yoast-retainer-review-note.md",
    "templates/yoast-health-summary.md",
    "references/yoast-health-score-model.md",
    "references/periodic-health-review-playbook.md",

    "references/ai-assisted-seo-workflow.md",
    "references/ai-metadata-review-model.md",
    "templates/ai-metadata-approval-pack.md",
    "templates/yoast-ai-plus-positioning-note.md",
    "schemas/ai-metadata-item.schema.json",
    "fixtures/sample-ai-metadata-item.json",
    "scripts/validate_ai_metadata_pack.py",
    "tests/ai-assisted-seo-scenario-tests.md",

    "references/bulk-metadata-governance.md",
    "references/approval-queue-workflow.md",
    "templates/metadata-bulk-edit-plan.md",
    "templates/yoast-approval-queue.md",
    "schemas/bulk-metadata-change.schema.json",
    "fixtures/sample-bulk-metadata-change.json",
    "scripts/validate_bulk_metadata_pack.py",
    "tests/bulk-metadata-governance-scenario-tests.md",
]

ROUTED_PATHS = [
    "tests/related-skills-routing-scenario-tests.md",
    "scripts/validate_related_skill_routing.py",
    "references/related-skills-routing.md",
    "tests/multilingual-hreflang-scenario-tests.md",
    "scripts/validate_multilingual_pack.py",
    "fixtures/sample-multilingual-page-set.json",
    "schemas/multilingual-page-set.schema.json",
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
    "references/configuration-playbooks.md",
    "references/qa-checklists.md",
    "references/source-register.md",
    "references/research-pack-output-spec.md",
    "references/future-skill-architecture.md",
    "references/file-routing-index.md",
    "references/evidence-state-model.md",
    "references/audit-triage-model.md",
    "references/decision-register-model.md",
    "references/conflict-resolution-playbook.md",
    "references/client-communication-guardrails.md",
    "intake/client-site-intake.md",
    "intake/wordpress-site-intake.md",
    "intake/woocommerce-intake.md",
    "intake/migration-intake.md",
    "templates/yoast-configuration-report.md",
    "templates/yoast-audit-report.md",
    "templates/yoast-woocommerce-report.md",
    "templates/developer-handoff.md",
    "templates/launch-qa-checklist.md",
    "templates/yoast-research-pack.md",
    "templates/yoast-troubleshooting-note.md",
    "templates/yoast-decision-log.md",
    "templates/client-safe-summary.md",
    "docs/research-workflow.md",
    "docs/reference-refresh-protocol.md",
    "docs/current-verification-playbook.md",
    "docs/maintenance-guide.md",
    "schemas/decision-record.schema.json",
    "fixtures/sample-decision-record.json",
    "scripts/validate_decision_records.py",
    "scripts/validate_artefact_review.py",
    "fixtures/sample-rendered-output-check.json",
    "schemas/rendered-output-check.schema.json",
    "references/state-comparison-playbook.md",
    "references/plugin-update-regression-playbook.md",
    "templates/yoast-state-comparison-report.md",
    "templates/yoast-regression-test-report.md",
    "templates/yoast-acceptance-criteria.md",
    "schemas/regression-check.schema.json",
    "fixtures/sample-regression-check.json",
    "scripts/validate_regression_pack.py",
    "tests/comparison-regression-scenario-tests.md",
    "references/access-level-workflow.md",
    "references/remediation-backlog-model.md",
    "templates/yoast-remediation-backlog.md",
    "templates/wordpress-admin-change-plan.md",
    "schemas/remediation-item.schema.json",
    "fixtures/sample-remediation-item.json",
    "scripts/validate_remediation_pack.py",
    "tests/access-remediation-scenario-tests.md",
    "references/portfolio-audit-playbook.md",
    "references/agency-defaults-drift-model.md",
    "templates/yoast-portfolio-audit-summary.md",
    "templates/yoast-defaults-drift-report.md",
    "schemas/portfolio-site-summary.schema.json",
    "fixtures/sample-portfolio-site-summary.json",
    "scripts/validate_portfolio_pack.py",
    "tests/portfolio-defaults-scenario-tests.md",

    "references/ai-assisted-seo-workflow.md",
    "references/ai-metadata-review-model.md",
    "templates/ai-metadata-approval-pack.md",
    "templates/yoast-ai-plus-positioning-note.md",
    "schemas/ai-metadata-item.schema.json",
    "fixtures/sample-ai-metadata-item.json",
    "scripts/validate_ai_metadata_pack.py",
    "tests/ai-assisted-seo-scenario-tests.md",

    "references/bulk-metadata-governance.md",
    "references/approval-queue-workflow.md",
    "templates/metadata-bulk-edit-plan.md",
    "templates/yoast-approval-queue.md",
    "schemas/bulk-metadata-change.schema.json",
    "fixtures/sample-bulk-metadata-change.json",
    "scripts/validate_bulk_metadata_pack.py",
    "tests/bulk-metadata-governance-scenario-tests.md",
]

ALLOWED_LARGE_BINARY_EXTENSIONS = {".svg"}
MAX_PACKAGE_BYTES = 25 * 1024 * 1024


def fail(payload):
    print(payload)
    return 1


def main(root="."):
    root = Path(root)
    missing = [p for p in CORE_FILES if not (root / p).exists()]
    if missing:
        return fail({"missing_core_files": missing})

    skill_text = (root / "SKILL.md").read_text(encoding="utf-8")
    routing_text = (root / "references/file-routing-index.md").read_text(encoding="utf-8")
    future_text = (root / "references/future-skill-architecture.md").read_text(encoding="utf-8")

    route_corpus = "\n".join([skill_text, routing_text, future_text])
    missing_from_routes = [p for p in ROUTED_PATHS if p not in route_corpus]
    if missing_from_routes:
        return fail({"unrouted_paths": missing_from_routes})

    file_count = 0
    total_size = 0
    binary_like = []
    for path in root.rglob("*"):
        if path.is_file():
            file_count += 1
            total_size += path.stat().st_size
            suffix = path.suffix.lower()
            if suffix not in {".md", ".yaml", ".yml", ".json", ".py", ".svg"}:
                binary_like.append(str(path.relative_to(root)))
            if suffix not in ALLOWED_LARGE_BINARY_EXTENSIONS and path.stat().st_size > 1024 * 1024:
                return fail({"large_text_or_unknown_file": str(path.relative_to(root)), "bytes": path.stat().st_size})

    if binary_like:
        return fail({"unexpected_file_types": binary_like})
    if total_size > MAX_PACKAGE_BYTES:
        return fail({"package_too_large_bytes": total_size})

    print(f"skill structure validation passed: {file_count} files, {total_size} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main(*(sys.argv[1:] or [])))
