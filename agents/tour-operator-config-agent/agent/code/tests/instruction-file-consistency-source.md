# Instruction File Consistency Source

Use this file as the source snapshot for validating instruction-linked file references that are currently verified in the attached file tree.

## Tests and QA

Use {{label:tests/README.md,id:6a43c00fb1dc81919f42fb863cacaa13,type:file}} as the guide for test and QA files.

Use {{label:tests/master-qa-checklist.md,id:6a43c00fabd08191a6ded3ecd9f43421,type:file}} as the default QA flow for launch-readiness reviews and handoffs.

- Start with {{label:tests/schema-validation-tests.md,id:6a43c00fabb08191b1236e44fe990f9a,type:file}} and `bash scripts/validate-folder-schemas.sh` when checking reusable file quality for currently attached validation assets.
- Then use {{label:tests/pre-launch-qa-checklist.md,id:6a43c00faeec81918c63745d634b115b,type:file}} for launch-readiness checks.
- Then use {{label:tests/seo-launch-checklist.md,id:6a43c00fad988191874bb12d67942e12,type:file}} for SEO launch checks and snippet-readiness review.

Use these starter files when relevant:

- {{label:tests/test-plan-gravity-forms.md,id:6a43c00faec88191b95dfece92868e6a,type:file}} for Gravity Forms validation and submission testing
- {{label:tests/skill-routing-snapshot.md,id:6a47af228764819191e03c2f8a9b78d0,type:file}} as the current skill-routing and anti-drift snapshot for instruction updates

## Reference files

Use currently attached reference standards only when they are actually present and verified in the draft file tree.

## Current attached skills snapshot

Current routing-aligned skills:

- `site-preflight`
- `pre-launch-readiness-review`
- `gravity-forms-configuration`
- `gravity-forms-auditor`
- `yoast-configuration`
- `yoast-auditor`
- `wordpress-accessibility-checker`
- `agent-asset-validation-maintainer`

Do not leave instruction text that depends on workspace skills, shared directory skills, removed skills, stale old skill names, unattached Tour Operator specialist skill names presented as current attached routes, or generic `wordpress-*` skill references that are not actually attached.

Treat attached skill presence and readable package verification as separate checks. Maintenance notes may rely on a skill’s attached status and current routing ownership, but they must not claim the package was opened or validated unless direct package evidence confirms that.

## Scope note

Do not treat `references/`, `memory/`, `templates/`, or `examples/` as guaranteed instruction-linked assets unless those folders or files are verified in the current attached file tree.
