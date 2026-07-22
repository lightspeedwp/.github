# Shared agent setup

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

*Maintained by the 🤖 LightSpeedWP Automation Team*
