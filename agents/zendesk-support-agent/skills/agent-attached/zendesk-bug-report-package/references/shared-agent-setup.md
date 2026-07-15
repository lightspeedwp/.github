# Shared agent setup

Use this reference whenever the skill runs inside a shared workspace agent or any agent used by multiple teammates.

## Core rule

Keep the skill portable across users. Do not depend on a specific logged-in person, personal memory, saved views, private inboxes, personal labels, or teammate-specific connector permissions.

## Accepted inputs

Work from whatever the current run can legitimately access:

- Zendesk ticket IDs or URLs available to the current user.
- Pasted customer messages, public replies, internal notes, screenshots, logs, summaries, or investigation notes.
- Help-centre or support-process context available during the current run.
- Secondary evidence from Slack, Gmail, Google Drive, GitHub, Linear, Asana, BugHerd, logs, analytics, repos, or product docs only when supplied, requested, or necessary.

If connector access is incomplete, continue from supplied evidence and mark missing Zendesk facts. Do not fabricate requester, organisation, environment, tags, status, priority, timestamps, assignee, group, linked tickets, SLA state, or ticket history.

## Shared-agent behaviour

1. Treat the current user's permissions as the only permissions available.
2. Keep Zendesk-first case facts separate from notes copied from other systems.
3. Avoid personal phrasing such as "my queue", "your saved filter", or "the usual engineer" unless the user explicitly supplied it for this run.
4. Do not assume LightSpeed-specific or workspace-specific conventions unless they are included in the skill, supplied by the user, stored as approved durable memory, or retrieved from an approved connector during this run.
5. Use stable team roles where possible: support, engineering, product, support manager, account owner, security, operations.
6. Keep sensitive evidence narrow. Prefer a short summary plus a Zendesk link for authorised users over copying raw screenshots, logs, customer data, secrets, billing details, or security details.
7. Make missing evidence visible so another teammate can continue without restarting the whole case.

## Fallback wording

When Zendesk access is missing or incomplete:

```markdown
Zendesk access appears incomplete for this run, so this package is based on the supplied evidence only. Before handoff, confirm the ticket status, requester, organisation, latest customer reply, internal notes, and any linked cases in Zendesk.
```

When the package is partially ready:

```markdown
This is partially ready for engineering/product review. The problem and impact are clear enough to start triage, but the receiving team will still need [missing evidence] before confirming cause or fix path.
```

When the issue should not become a bug package yet:

```markdown
This is not ready for a bug package. The smallest useful next step is to collect [specific reproduction/environment/detail], then re-run the package workflow.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
