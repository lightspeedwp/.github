# Maintenance and Release Guide

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

Use this guide when updating, reviewing, or sharing the router skill in a shared workspace agent.

## Release Discipline

- Treat every shared-agent package as a full replacement, not a patch.
- Keep the package filename as `skill.zip` when sharing the finished bundle.
- Update `references/changelog.md` for every behavioural, validation, fixture, or deployment change.
- Keep examples and fixture data anonymised.
- Keep `references/companion-skill-manifest.json` and `references/companion-skill-manifest.schema.json` aligned whenever supported downstream skills, connector assumptions, or fallback behaviours change.
- Prefer small, auditable edits over broad rewrites.
- Preserve the router boundary: route to the right workflow; do not perform downstream triage, investigation, drafting, escalation, or trend analysis.

## Before Editing

1. Identify the reason for the change: routing coverage, shared-agent safety, connector fallback, output consistency, validation, or documentation clarity.
2. Check whether the change belongs in `SKILL.md` or a reference file.
3. Keep `SKILL.md` compact and move detailed support material into `references/`.
4. Avoid adding assets or scripts unless they materially improve repeatability or validation.

## Edit Checklist

- Keep the frontmatter name as `zendesk-router-skill`.
- Keep the frontmatter description lowercase and trigger-focused.
- Mention new reference files in the Bundled References section of `SKILL.md`.
- Add or update anonymised examples when routing behaviour changes.
- Keep `references/router-test-fixtures.json` aligned with `references/test-cases.md`.
- Keep `references/companion-skill-manifest.json` aligned with the routing matrix, deployment checklist, and supported downstream skill list.
- Review `references/companion-interoperability-audit.md` when companion skill route names or parent-agent invocation rules change.
- Update `scripts/validate_router_pack.py` if a new required file, phrase, or portability rule is introduced.
- Do not include real ticket IDs, customer names, email addresses, account IDs, private queue/view names, or individual user assumptions.

## Validation Checklist

Run this from the skill root when code execution is available:

```bash
python3 scripts/validate_router_pack.py
```

The validation should confirm:

- Required files are present.
- Frontmatter is valid and shared-agent aware.
- Output contract fields are present.
- All supported `zendesk-` workflow skills have routing coverage.
- Reference links are mentioned from `SKILL.md`.
- Fixture data is valid JSON and has required fields.
- Shared-agent portability markers are absent.
- Deployment and maintenance references are present.
- Companion-skill manifest entries exist for every supported `zendesk-` workflow skill.
- Companion interoperability guidance is present for shared-agent skill-selection and canonical `zendesk-` route names.
- Manifest policy keeps router use independent of live Zendesk access while documenting which downstream workflows need Zendesk evidence.

## Packaging Checklist

- Remove temporary files, drafts, caches, and local notes before zipping.
- Confirm the package is well below the 25 MB upload limit.
- Confirm the zip contains the skill folder and not only loose files.
- Confirm `skill.zip` opens successfully and includes `SKILL.md`, `agents/openai.yaml`, `references/`, and `scripts/`.

## Shared-Agent Review Prompt

Use this prompt after installing the package in a shared agent:

```text
Route this Zendesk support request. The shared agent may not have Zendesk access, and the user has only pasted a short issue summary.
```

Expected behaviour: recommend a support workflow or ask for the smallest useful pasted evidence extract without assuming private connector access.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
