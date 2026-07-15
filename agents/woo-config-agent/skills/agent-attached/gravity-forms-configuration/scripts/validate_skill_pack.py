#!/usr/bin/env python3
"""Local structural validator for the Gravity Forms Configuration skill package.

The script is deterministic and offline. It does not validate live Gravity Forms,
WordPress, MCP, add-on, payment gateway, or email-delivery behaviour.
"""
import json
import re
import sys
from pathlib import Path

REQUIRED_FILES = [
    "SKILL.md",
    "agents/openai.yaml",
    "references/source-register.md",
    "references/core-concepts.md",
    "references/mcp-and-rest-api-contract.md",
    "references/mcp-action-recipes.md",
    "references/change-risk-and-approval.md",
    "references/qa-and-test-playbooks.md",
    "references/environment-and-compatibility.md",
    "references/import-export-and-migration.md",
    "references/fields-and-form-objects.md",
    "references/workflows.md",
    "references/notifications-confirmations-merge-tags.md",
    "references/addons-integrations.md",
    "references/spam-security-privacy.md",
    "references/accessibility.md",
    "references/troubleshooting.md",
    "references/routing-and-agent-use.md",
    "templates/auditor-handoff-intake.md",
    "schemas/auditor-handoff.schema.json",
    "references/auditor-handoff-contract.md",
    "references/auditor-configuration-handoff.schema.json",
    "schemas/auditor-configuration-handoff.schema.json",
    "references/auditor-configuration-contract.md",
    "schemas/site-preflight.schema.json",
    "schemas/form-config.schema.json",
    "schemas/change-plan.schema.json",
    "schemas/validation-report.schema.json",
    "schemas/agent-profile.schema.json",
    "schemas/mcp-capability-map.schema.json",
    "schemas/qa-matrix.schema.json",
    "schemas/notification-audit.schema.json",
    "schemas/troubleshooting-case.schema.json",
    "templates/preflight-report.md",
    "templates/configuration-plan.md",
    "templates/change-summary.md",
    "templates/test-report.md",
    "templates/handoff-note.md",
    "templates/manual-implementation-plan.md",
    "templates/risk-review.md",
    "templates/notification-audit.md",
    "templates/troubleshooting-runbook.md",
    "templates/data-retention-review.md",
    "references/embedding-and-page-integration.md",
    "references/consent-localisation-and-microcopy.md",
    "schemas/embed-validation.schema.json",
    "schemas/consent-copy-review.schema.json",
    "templates/embed-validation.md",
    "templates/consent-copy-review.md",
    "templates/feed-audit.md",
    "references/entry-data-lifecycle.md",
    "references/feeds-payments-user-registration.md",
    "intake/form-requirements-intake.md",
    "profiles/wordpress-configuration-agent.md",
    "profiles/woocommerce-configuration-agent.md",
    "profiles/tour-operator-configuration-agent.md",
    "references/feeds-payments-user-registration.md",
    "references/entry-data-lifecycle.md",
    "schemas/feed-audit.schema.json",
    "schemas/data-retention-review.schema.json",
    "templates/feed-audit.md",
    "templates/data-retention-review.md",
    "references/embedding-and-page-integration.md",
    "references/consent-localisation-and-microcopy.md",
    "schemas/embed-validation.schema.json",
    "schemas/consent-copy-review.schema.json",
    "templates/embed-validation.md",
    "templates/consent-copy-review.md",
    "references/conditional-dynamic-calculation-logic.md",
    "references/webhooks-and-automation-feeds.md",
    "schemas/logic-map-review.schema.json",
    "schemas/webhook-feed-review.schema.json",
    "templates/logic-map-review.md",
    "templates/webhook-feed-review.md",
    "references/operations-maintenance-and-inventory.md",
    "references/permissions-and-capability-governance.md",
    "schemas/form-inventory-audit.schema.json",
    "schemas/permissions-review.schema.json",
    "templates/form-inventory-audit.md",
    "templates/permissions-review.md",
    "references/frontend-layout-and-theme-styling.md",
    "schemas/frontend-style-audit.schema.json",
    "schemas/layout-regression-check.schema.json",
    "templates/frontend-style-audit.md",
    "templates/layout-regression-check.md",
    "references/analytics-conversion-and-attribution.md",
    "schemas/conversion-tracking-plan.schema.json",
    "schemas/tracking-qa-report.schema.json",
    "templates/conversion-tracking-plan.md",
    "templates/tracking-qa-report.md",
    "references/post-creation-and-ugc-workflows.md",
    "references/survey-poll-quiz-assessments.md",
    "schemas/assessment-plan.schema.json",
    "schemas/results-review.schema.json",
    "templates/assessment-plan.md",
    "templates/results-review.md",
    "references/payment-donation-event-flows.md",
    "schemas/payment-flow-review.schema.json",
    "schemas/payment-test-report.schema.json",
    "templates/payment-flow-review.md",
    "templates/payment-test-report.md",
    "schemas/post-creation-feed-review.schema.json",
    "schemas/ugc-moderation-handoff.schema.json",
    "templates/post-creation-feed-review.md",
    "templates/ugc-moderation-handoff.md",
    "tests/test-prompts.md",
    "tests/acceptance-checklist.md",
]

BANNED_SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*['\"][^'\"]{8,}['\"]"),
    re.compile(r"(?i)license[_-]?key\s*[:=]"),
]


def fail(msg: str) -> int:
    print(f"ERROR: {msg}", file=sys.stderr)
    return 1


def warn(msg: str) -> None:
    print(f"WARN: {msg}")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def validate_frontmatter(root: Path) -> int:
    skill = read(root / "SKILL.md")
    if not skill.startswith("---\n"):
        return fail("SKILL.md missing YAML frontmatter")
    end = skill.find("\n---\n", 4)
    if end == -1:
        return fail("SKILL.md frontmatter not closed")
    fm = skill[4:end]
    if "name: gravity-forms-configuration" not in fm:
        return fail("SKILL.md name must be gravity-forms-configuration")
    if "description:" not in fm:
        return fail("SKILL.md missing description")
    if len(fm.split()) < 25:
        return fail("SKILL.md description is too short for reliable triggering")
    return 0


def validate_json_files(root: Path) -> int:
    status = 0
    for path in root.rglob("*.json"):
        try:
            json.loads(read(path))
        except Exception as exc:
            status |= fail(f"invalid JSON in {path.relative_to(root)}: {exc}")
    return status


def validate_required_files(root: Path) -> int:
    missing = [rel for rel in REQUIRED_FILES if not (root / rel).exists()]
    if missing:
        return fail("missing required files: " + ", ".join(missing))
    return 0


def validate_references(root: Path) -> int:
    status = 0
    skill = read(root / "SKILL.md")
    for rel in [
        "references/mcp-action-recipes.md",
        "references/change-risk-and-approval.md",
        "references/qa-and-test-playbooks.md",
    "references/environment-and-compatibility.md",
    "references/import-export-and-migration.md",
        "intake/form-requirements-intake.md",
        "templates/manual-implementation-plan.md",
        "templates/risk-review.md",
    "templates/notification-audit.md",
    "templates/troubleshooting-runbook.md",
    "templates/data-retention-review.md",
    "references/embedding-and-page-integration.md",
    "references/consent-localisation-and-microcopy.md",
    "schemas/embed-validation.schema.json",
    "schemas/consent-copy-review.schema.json",
    "templates/embed-validation.md",
    "templates/consent-copy-review.md",
    "templates/feed-audit.md",
    "references/entry-data-lifecycle.md",
    "references/feeds-payments-user-registration.md",
    "references/conditional-dynamic-calculation-logic.md",
    "references/webhooks-and-automation-feeds.md",
    "schemas/logic-map-review.schema.json",
    "schemas/webhook-feed-review.schema.json",
    "templates/logic-map-review.md",
    "templates/webhook-feed-review.md",
    "references/operations-maintenance-and-inventory.md",
    "references/permissions-and-capability-governance.md",
    "schemas/form-inventory-audit.schema.json",
    "schemas/permissions-review.schema.json",
    "templates/form-inventory-audit.md",
    "templates/permissions-review.md",
    "references/frontend-layout-and-theme-styling.md",
    "schemas/frontend-style-audit.schema.json",
    "schemas/layout-regression-check.schema.json",
    "templates/frontend-style-audit.md",
    "templates/layout-regression-check.md",
    "references/analytics-conversion-and-attribution.md",
    "schemas/conversion-tracking-plan.schema.json",
    "schemas/tracking-qa-report.schema.json",
    "templates/conversion-tracking-plan.md",
    "templates/tracking-qa-report.md",
    "references/post-creation-and-ugc-workflows.md",
    "references/survey-poll-quiz-assessments.md",
    "schemas/assessment-plan.schema.json",
    "schemas/results-review.schema.json",
    "templates/assessment-plan.md",
    "templates/results-review.md",
    "references/payment-donation-event-flows.md",
    "schemas/payment-flow-review.schema.json",
    "schemas/payment-test-report.schema.json",
    "templates/payment-flow-review.md",
    "templates/payment-test-report.md",
    "schemas/post-creation-feed-review.schema.json",
    "schemas/ugc-moderation-handoff.schema.json",
    "templates/post-creation-feed-review.md",
    "templates/ugc-moderation-handoff.md",
    "references/survey-poll-quiz-assessments.md",
    "schemas/assessment-plan.schema.json",
    "schemas/results-review.schema.json",
    "templates/assessment-plan.md",
    "templates/results-review.md",
    "references/payment-donation-event-flows.md",
    "schemas/payment-flow-review.schema.json",
    "schemas/payment-test-report.schema.json",
    "templates/payment-flow-review.md",
    "templates/payment-test-report.md",
    "references/auditor-handoff-contract.md",
    "schemas/auditor-configuration-handoff.schema.json",
    "references/auditor-configuration-contract.md",
    "schemas/auditor-handoff.schema.json",
    "templates/auditor-handoff-intake.md",
    ]:
        if rel not in skill:
            status |= fail(f"SKILL.md does not reference {rel}")
    return status


def validate_no_placeholders_or_secrets(root: Path) -> int:
    status = 0
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".md", ".json", ".yaml", ".yml", ".py", ".svg"}:
            continue
        text = read(path)
        markers = ["TO" + "DO", "TB" + "D"]
        if any(marker in text for marker in markers):
            status |= fail(f"placeholder marker found in {path.relative_to(root)}")
        for pattern in BANNED_SECRET_PATTERNS:
            if pattern.search(text):
                status |= fail(f"possible secret pattern found in {path.relative_to(root)}")
    return status


def validate_test_prompt_count(root: Path) -> int:
    p = root / "tests/test-prompts.md"
    text = read(p)
    count = len(re.findall(r"^##\s+\d+\.\s+", text, flags=re.M))
    if count < 140:
        return fail(f"expected at least 140 numbered test prompts, found {count}")
    return 0


def validate_auditor_configuration_contract(root: Path) -> int:
    status = 0
    required_schema = root / "schemas/auditor-configuration-handoff.schema.json"
    reference_schema = root / "references/auditor-configuration-handoff.schema.json"
    contract = root / "references/auditor-configuration-contract.md"
    template = root / "templates/auditor-handoff-intake.md"

    if required_schema.exists() and reference_schema.exists():
        try:
            canonical = json.loads(read(required_schema))
            copied = json.loads(read(reference_schema))
            if canonical != copied:
                status |= fail("reference copy of auditor configuration schema does not match canonical schema")
        except Exception as exc:
            status |= fail(f"could not compare auditor configuration schema copies: {exc}")

    if required_schema.exists():
        data = json.loads(read(required_schema))
        for key in [
            "contract_version",
            "handoff_id",
            "source_skill",
            "target_skill",
            "findings_included",
            "affected_items",
            "approval_requirements",
            "validation_steps",
            "rollback_notes",
        ]:
            if key not in data.get("required", []):
                status |= fail(f"auditor configuration schema missing required field {key}")

    if contract.exists():
        contract_text = read(contract)
        for heading in [
            "## Purpose",
            "## Boundary rules",
            "## Handoff packet",
            "## Handoff readiness",
            "## Configuration intake response",
            "## Post-change validation report",
            "## Required prompt handoff format",
        ]:
            if heading not in contract_text:
                status |= fail(f"auditor configuration contract missing heading {heading}")

    if template.exists():
        template_text = read(template)
        for heading in [
            "## Handoff intake status",
            "## Source findings",
            "## Verified current state",
            "## Readiness gaps",
            "## Proposed change plan",
            "## Approval checkpoint",
            "## Validation plan",
            "## Rollback plan",
        ]:
            if heading not in template_text:
                status |= fail(f"auditor handoff intake template missing heading {heading}")
    return status

def main(argv: list[str]) -> int:
    root = Path(argv[1]) if len(argv) > 1 else Path.cwd()
    if not root.exists():
        return fail(f"skill path does not exist: {root}")
    status = 0
    status |= validate_required_files(root)
    status |= validate_frontmatter(root)
    status |= validate_json_files(root)
    status |= validate_references(root)
    status |= validate_no_placeholders_or_secrets(root)
    status |= validate_test_prompt_count(root)
    status |= validate_auditor_configuration_contract(root)
    if status == 0:
        print(f"OK: {root} passed local skill-pack validation")
    return status


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
