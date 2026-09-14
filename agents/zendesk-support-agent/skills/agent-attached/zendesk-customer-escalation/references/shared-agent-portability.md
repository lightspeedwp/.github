# Shared Agent Portability

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
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Use this reference when configuring, testing, or using this skill inside a workspace-shared agent where different teammates may be logged in with different connector permissions.

## Portability goal

The skill must produce a safe Zendesk-first escalation brief even when optional connectors are missing, renamed, or unavailable to the current logged-in user.

The skill should never depend on:

- personal connector IDs or workspace URLs
- a specific user's Zendesk, Slack, Asana, CRM, or Drive permissions
- personal memory about customers, tickets, incidents, accounts, or prior escalations
- private channel names, project IDs, group IDs, or owner names hardcoded inside the skill

## Shared agent contract

The shared agent should provide an agent-level `CONNECTORS.md` file or equivalent workspace instruction that maps neutral aliases to the connectors available in that agent.

Required neutral alias:

- `zendesk`

Optional neutral aliases:

- `crm`
- `slack`
- `asana`
- `support_docs`

For each alias, the agent-level map should identify:

- the connector or tool name the shared agent should use
- any workspace-safe search constraints, such as allowed Zendesk groups or approved support-doc locations
- whether the source is required or optional
- what to do when access is unavailable

Keep the skill package generic. Put workspace-specific names, IDs, URLs, channels, folders, projects, and permission details in the shared agent, not in this skill.

## Runtime resolution flow

1. Resolve the `zendesk` alias first.
2. If Zendesk is unavailable, do not fabricate case facts. Ask for a pasted ticket thread or state that the escalation cannot be properly grounded without Zendesk evidence.
3. Use optional connectors only when they are available and relevant to the escalation ask.
4. Treat access denial, empty search results, and unavailable connectors as different outcomes.
5. Preserve source availability in the escalation brief so another teammate can see what was and was not checked.

## Source availability language

Use direct wording like this:

- `Checked: Zendesk ticket history and internal notes.`
- `Checked: Zendesk and approved support docs.`
- `Unavailable: CRM connector was not available in this shared-agent run.`
- `Access gap: Slack incident context may exist, but the logged-in user did not have access to the mapped Slack source.`
- `Not found: No related Zendesk tickets were found using the searched customer/account terms.`

Do not write `no Slack discussion exists`, `no CRM risk exists`, or `no related account history exists` when the real issue is missing access or an unavailable connector.

## Memory rules for shared agents

Do not use memory for case facts.

Allowed durable memory, only when explicitly configured by the team:

- stable routing preferences, such as which support team usually owns a lane
- shared formatting preferences for escalation briefs
- durable connector-alias conventions
- general support-process rules that are not customer-specific

Do not store or rely on durable memory for:

- Zendesk ticket contents
- customer-specific commitments
- customer commercial status
- incident details
- security or privacy facts
- named owners for a specific case
- account health or relationship risk

Retrieve those facts from Zendesk or approved shared connectors for each run.

## Permission-safe fallback

If only Zendesk is available, continue with an evidence-limited escalation brief when escalation is still justified.

Include:

- the Zendesk evidence that supports escalation
- optional sources that were unavailable
- how missing sources affect confidence, ownership, severity, or urgency
- the smallest next evidence request needed before the owner acts

If Zendesk itself is unavailable, return a readiness gap instead of an escalation brief unless the user provides the ticket text directly.

## Shared-agent setup checklist

Before adding this skill to a shared workspace agent, confirm:

- the agent-level connector map uses neutral aliases from `references/CONNECTORS.example.md`
- Zendesk is available to all intended users or the fallback path is documented
- optional connectors are marked optional and have clear access-gap wording
- no personal connector IDs, private URLs, user names, or channel IDs are stored in the skill
- the escalation output includes source availability when optional context is relevant or unavailable
- customer-specific memory is disabled or explicitly avoided for this workflow
- a teammate with limited permissions has tested the skill on a safe sample ticket

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
