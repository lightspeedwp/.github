# Shared Agent Deployment Checklist

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

Use this checklist before adding or updating this skill in a shared workspace agent.

## Required Setup

- Confirm the shared agent has access to this skill package through the shared skill directory or workspace agent configuration.
- Confirm whether the shared agent has Zendesk connector access. The router can work without Zendesk access, but evidence-backed downstream workflows may need it.
- Confirm the related `zendesk-` workflow skills are installed in the same shared agent or available in the workspace skill directory. Use `references/companion-skill-manifest.json` as the machine-readable companion-skill source of truth.
- Confirm no personal account, private mailbox, private Slack channel, private Zendesk view, or individual memory is required for the router to function.

## Recommended Companion Skills

Install these with the router when the shared agent is expected to handle support operations end to end. Keep this list aligned with `references/companion-skill-manifest.json`:

- `zendesk-triage-router`
- `zendesk-evidence-collector`
- `zendesk-case-readiness-check`
- `zendesk-draft-response`
- `zendesk-customer-escalation`
- `zendesk-handoff-prep`
- `zendesk-knowledge-candidate-review`
- `zendesk-create-knowledge`
- `zendesk-duplicate-pattern-review`
- `zendesk-backlog-trend-analysis`
- `zendesk-customer-research`
- `zendesk-evidence-quality-review`

## Permission-Safe Router Behaviour Tests

Run these when intentionally invoking `zendesk-router-skill`:

1. "Route this Zendesk ticket, but the shared agent cannot access Zendesk."
   - Expected: request the smallest useful pasted ticket/thread extract unless the user's intended deliverable is already clear.
2. "Package this for engineering."
   - Expected: route to `zendesk-customer-escalation`; add `zendesk-evidence-collector` if evidence has not been assembled.
3. "Review this draft before I send it."
   - Expected: route to `zendesk-evidence-quality-review`.

## Parent-Agent Skill-Selection Tests

Run these in the shared support desk agent, not as forced router-only tests:

1. "Draft a reply to this customer thread."
   - Expected: invoke `zendesk-draft-response` directly when the user is already asking for the downstream deliverable; use `zendesk-case-readiness-check` only when the evidence appears thin or unresolved.
2. "Summarise queue health this week."
   - Expected: invoke `zendesk-backlog-trend-analysis` directly when the user is clearly asking for a report.
3. "Should this workaround become a help article?"
   - Expected: invoke `zendesk-knowledge-candidate-review` directly when the documentation-worthiness question is clear.

## Companion Interoperability Check

- Use `references/companion-interoperability-audit.md` before maintaining or reinstalling the Zendesk skill family.
- Confirm companion skills use canonical `zendesk-` prefixed names in route-away sections, examples, and smoke tests.
- Treat `zendesk-router-skill` as the ambiguity gateway, not as a mandatory wrapper around clear downstream deliverables.

## Do Not Configure

- Do not add personal user names or personal account assumptions to the skill instructions.
- Do not make the router depend on a private Zendesk view, label, queue, macro, brand mapping, or mailbox.
- Do not add real customer tickets or account data to examples, fixtures, or validation files.
- Do not require Linear, GitHub, Asana, Slack, Gmail, or roadmap access for routing Zendesk-first support requests.
- Do not install this router as if every downstream workflow has live Zendesk access; check the companion-skill manifest for connector assumptions and fallback behaviour.

## Maintenance Check

Run this from the skill root before sharing an updated package:

```bash
python3 scripts/validate_router_pack.py
```

The validation should pass before the skill is packaged or uploaded to the shared skill directory.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
