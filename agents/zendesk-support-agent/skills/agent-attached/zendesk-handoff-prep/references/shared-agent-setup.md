# Shared agent setup

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when `zendesk-handoff-prep` runs inside a shared workspace agent or any agent that may be used by multiple teammates.

## Core rule

Keep the skill portable across users. Do not depend on the logged-in user, personal memory, personal saved views, private connector permissions, or person-specific defaults.

## Connector expectations

Prefer Zendesk evidence when available, but do not assume every teammate has the same Zendesk access.

Accept these inputs:

- Zendesk ticket IDs or URLs the current user can access.
- Pasted ticket conversation, internal notes, screenshots, customer messages, or summaries.
- Help Centre or support-process context available to the current user.
- Secondary system evidence only when explicitly supplied, requested, or required for the receiving team to act.

If Zendesk access is unavailable or partial, continue from the supplied evidence and clearly mark missing Zendesk fields. Do not fabricate requester, organisation, tags, status, priority, timestamps, assignee, group, related tickets, SLA state, or ticket history.

## Shared-agent behaviour

When used by a shared agent:

1. Treat the current user's connector permissions as the only available permissions.
2. Avoid assuming any individual teammate's account, labels, saved searches, Zendesk views, Gmail, Slack, Google Drive, Linear, GitHub, Asana, or workspace memory.
3. Use company-wide conventions only when they are present in the skill package, supplied by the user, or retrieved from an approved connected source during the current run.
4. Separate confirmed facts from assumptions and missing evidence.
5. Keep Zendesk as the source of truth for support case facts whenever available.
6. Keep the output support-first unless the user explicitly asks for a downstream artefact.
7. Do not route to Linear, GitHub, Asana, BugHerd, product planning, or project planning by default.
8. Do not include credentials, secrets, unnecessary personal data, raw logs, billing details, or security-sensitive details in broad internal channels.

## Fallback wording

Use wording like this when connector access is incomplete:

```markdown
Zendesk access appears incomplete for this run, so this handoff is based on the supplied evidence only. Before acting, confirm the ticket status, requester, organisation, priority, latest customer reply, and any internal notes in Zendesk.
```

Use wording like this when the ticket is accessible but evidence is thin:

```markdown
The handoff is partially ready. The confirmed evidence is enough to identify the next owner and ask, but the receiving team may still need [missing evidence] before they can resolve the issue.
```

## Do not persist run-specific facts

Do not save or assume reusable memory from individual cases unless the user explicitly asks to update a durable team convention and the fact is stable, non-sensitive, and useful across future runs.

Examples of facts that should not become durable skill or agent defaults:

- customer names and account details;
- ticket IDs, screenshots, logs, or errors from one case;
- a teammate's temporary availability;
- Zendesk queue state or SLA state;
- a workaround that has not been validated as stable;
- a routing decision that applies only to one customer or incident.

Examples of facts that may be suitable for future skill updates, after approval:

- a stable support handoff template;
- a team-wide routing rule;
- an approved sensitivity/redaction rule;
- a standard list of evidence minimums;
- a public or internal documentation boundary rule.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
