# Connector parity specification

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

## Purpose

Document the app and tool coverage that another user must recreate to rebuild this agent with functional parity.

## Memory is essential

Memory is a core part of the design, not optional polish. The rebuilt agent should have Memory enabled before parity verification begins. Memory supports durable planning continuity, reusable defaults, active project state, approved decisions, source-of-truth references, and recurring output defaults.

## Target app coverage

The rebuild should mirror this planning-evidence coverage:

- Google Drive
- GitHub
- Figma
- Linear
- Harvest
- Any additional planning-evidence apps attached in the source agent that materially support evidence gathering or planning decisions

## App parity table

### Google Drive

- Best evidence for: briefs, PRDs, planning docs, spreadsheets, decks, shared source material, and attached planning references.
- When to use it: when the planning source of truth lives in docs, sheets, slides, or shared files.
- Access pattern: mainly read-only evidence in the current setup.
- Risks and ambiguities: stale docs, overlapping versions, unapproved drafts, and conflicting narrative vs spreadsheet evidence.
- If unavailable for the new user: require manual reconnection or use uploaded files until parity is restored.

### GitHub

- Best evidence for: repos, issues, pull requests, implementation context, code-adjacent constraints, and delivery status signals.
- When to use it: when planning depends on repository structure, issue history, implementation details, or engineering workflow context.
- Access pattern: mainly read-only evidence in the current setup.
- Risks and ambiguities: implementation detail may not equal approved product intent; issue state can lag real delivery status.
- If unavailable for the new user: reconnect GitHub or treat engineering context as incomplete and document the gap.

### Figma

- Best evidence for: design intent, UI structure, component behaviour, screen-level flows, and visual decision context.
- When to use it: when product or UX planning depends on design artefacts.
- Access pattern: expected as planning evidence; whether the rebuilt agent uses it read-only or with broader actions depends on the new user's connection.
- Risks and ambiguities: design files can contain exploratory work, stale frames, or unapproved directions.
- If unavailable for the new user: document Figma as a missing source and use screenshots or exported design files as an interim fallback.

### Linear

- Best evidence for: task state, project context, initiatives, issue history, and planning records.
- When to use it: when planning should align with active delivery records or existing work items.
- Access pattern: mainly read-only evidence in the current setup.
- Risks and ambiguities: tracker state can be incomplete, stale, or ahead of product approval.
- If unavailable for the new user: reconnect Linear or treat tracker-backed planning continuity as partial.

### Harvest

- Best evidence for: time evidence, project budgets, assignment context, and estimation calibration.
- When to use it: when estimates or delivery planning benefit from historical effort or budget evidence.
- Access pattern: mainly read-only evidence in the current setup.
- Risks and ambiguities: logged time is evidence, not a direct future estimate; historical time can reflect process noise or legacy scope.
- If unavailable for the new user: estimation must proceed with reduced confidence and explicitly note that Harvest parity is missing.

### Gmail

- Best evidence for: email-based context, stakeholder requests, approvals, threads, and source material shared through inbox conversations.
- When to use it: when planning evidence lives in email threads or approvals are documented there.
- Access pattern: mainly read-only evidence in the current setup.
- Risks and ambiguities: email threads often mix approved decisions, speculation, and stale context.
- If unavailable for the new user: use forwarded or exported email evidence temporarily, but note reduced source fidelity.

## Other relevant planning-evidence apps

If the source agent later adds other planning-evidence apps, include them in parity only when they materially support evidence gathering, planning decisions, or estimation quality.

## Manual rebuild requirements

The following must be manually reattached under another user:

- app connections
- account modes
- any app-specific permissions
- any app unavailable in the new workspace

## App parity verification

To verify app parity in a rebuild:

1. Confirm each required app is attached.
2. Confirm the intended access mode matches the source setup.
3. Confirm the agent can read the expected evidence surfaces.
4. Confirm missing apps are documented as known parity gaps.
5. Confirm estimation-sensitive apps such as Harvest are available before calling the rebuild estimate-ready.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
