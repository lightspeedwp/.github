# Skill routing specification

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

## Current routing rule

Use the attached LightSpeed lifecycle suite as the primary routing layer for LightSpeed project work. Use the older helper skills only when the request is generic, cross-cutting, clearly outside the newer LightSpeed lifecycle routes, or genuinely better served by a helper fallback.

Do not force every request through every skill.

## Primary LightSpeed routing layer

1. Use `lightspeed-prd-agent-orchestrator` for lifecycle-stage decisions, messy project context, and choosing the next LightSpeed specialist.
2. Use `lightspeed-project-intake` when project inputs are rough, mixed, incomplete, or need a structured intake first.
3. Use `lightspeed-project-research` when source understanding is weak and a grounded research brief should come before drafting, estimating, or change assessment.
4. Use `lightspeed-prd-writer` when requirements are strong enough for PRD drafting or PRD updates.
5. Use `lightspeed-estimation-planner` when the request needs estimate ranges, confidence, exclusions, phasing, or change-impact sizing.
6. Use `lightspeed-delivery-planner` when approved planning needs implementation sequencing, dependencies, task breakdowns, or tracker-ready issue drafts.
7. Use `lightspeed-prd-reviewer` when an existing planning artefact needs readiness review, evidence checking, or quality strengthening.
8. Use `lightspeed-change-control` when a change request affects approved scope, estimates, QA, timing, or approval state.
9. Use `lightspeed-approval-gate-manager` when sign-off checkpoints, go/no-go criteria, or decision-log outputs are the real task.
10. Use `lightspeed-project-status-reporter` for internal or client-safe status updates, blocker summaries, and current-phase reporting.
11. Use `lightspeed-qa-planner` for planned QA coverage, acceptance matrices, launch checks, accessibility coverage, editor checks, or tracking checks.
12. Use `lightspeed-qa-triage` for actual QA findings, severity, launch-blocker analysis, likely owner routing, and retest steps.
13. Use `lightspeed-release-handoff-generator` for release notes, handoff packs, support transition, and post-launch monitoring plans.
14. Use `lightspeed-project-pack-exporter` for markdown project packs, source-note exports, review packs, or ZIP-ready planning archives.
15. Use `lightspeed-project-memory-manager` when durable project state, assumptions, decisions, open loops, or stale-state cleanup should be handled explicitly.

## Legacy helper layer still attached

These skills are still attached and may be used deliberately when they are the better fit, but they should not override a clearer LightSpeed specialist route:

- `intake-routing`
- `evidence-locking`
- `prd-generation`
- `implementation-planning`
- `review-qa`
- `memory-management`
- `validation-support`
- `launch-handoff-support`
- `issue-drafting`
- `technical-brief-deep-dive`

### When the helper layer is still appropriate

- Use `intake-routing` only as a legacy fallback when a narrower LightSpeed intake or orchestration route is unavailable or clearly inferior for the current request.
- Use `evidence-locking` only as a legacy evidence-discipline fallback when the request is more about evidence discipline than a specific LightSpeed lifecycle deliverable.
- Use `prd-generation` only as a legacy fallback outside the preferred `lightspeed-prd-writer` path.
- Use `implementation-planning` only as a legacy fallback outside the preferred `lightspeed-delivery-planner` path.
- Use `technical-brief-deep-dive` for deeper technical-brief work outside the narrower LightSpeed lifecycle routes.
- Use `review-qa` for non-LightSpeed or cross-cutting review work that is not better handled by `lightspeed-prd-reviewer`.
- Use `issue-drafting` for generic issue drafting outside the LightSpeed delivery flow.
- Use `launch-handoff-support` for generic handoff work outside the dedicated LightSpeed release flow.
- Use `memory-management` for generic memory-decision work outside the dedicated LightSpeed project-memory workflow.
- Use `validation-support` for generic validation tasks where the request is about file quality or validation structure rather than a LightSpeed lifecycle stage.

## Uploaded but unattached support-layer drafts

These support-layer skill packages have been drafted and uploaded, but they are not attached and must not be treated as active routes yet:

- `wordpress-plugin-packaging-review`
- `content-file-validator`
- `markdown-content-validator`
- `design-context-synthesis`
- `design-qa-readiness`

## Current documentation rule

- Treat the attached uploaded Builder skill layer as the source of truth for this agent’s current routing.
- Do not describe uploaded-but-unattached support drafts as active routes.
- Do not describe older workspace-shared exact-name parity docs as if those exact shared skills are attached now.
- Do not silently substitute historical parity targets for the current attached routing layer.

## Historical parity note

A previous parity effort tracked a different exact-name workspace-shared skill set. That historical parity target is not the current operative routing layer.

If exact shared-skill parity is still needed later:

- use `references/skill-parity-audit.md` to review the current parity-state note
- use `rollout/skill-parity-manual-resolution-checklist.md` for preserved unresolved manual-resolution paths
- do not claim full parity until that separate target is deliberately re-audited and resolved

## Repair-path references

- `references/SKILL_INVENTORY.md` — current attached skill inventory, helper layer, and uploaded-but-unattached support drafts.
- `references/skill-parity-audit.md` — current parity-state note and known unresolved historical parity questions.
- `references/skills-routing-and-directory-validation-report.md` — latest validation outcome.
- `prompts/skills-routing-and-directory-validation-prompt.md` — validation pass for routing and directory drift.
- `prompts/skills-routing-and-directory-repair-prompt.md` — focused repair pass after validation.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
