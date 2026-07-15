# Shared Agent Connector Matrix

Use this matrix before making access-dependent duplicate, related-case, repeated-pain, incident-pattern, merge, escalation, or reporting recommendations in a shared workspace agent.

## Purpose

Shared agents may be used by teammates with different Zendesk and secondary connector permissions. This reference helps the skill state what it could see, choose an appropriate confidence level, and avoid overclaiming that all relevant ticket evidence was checked.

## Access-state matrix

| Access state | What the skill can do | Default confidence posture | Safe handling posture | Safe wording |
| --- | --- | --- | --- | --- |
| Full Zendesk access | Compare visible ticket history, metadata, public replies, internal notes, linked tickets, problem records, and related search results. | Medium to high, depending on evidence quality. | Recommend link, merge, escalation, or reporting only when evidence supports it. | "Based on the visible Zendesk ticket evidence..." |
| Partial Zendesk access | Compare only visible fields, snippets, summaries, or tickets the current user can access. | Low to medium. | Prefer link, monitor, or investigate before merge/escalation where unseen history may matter. | "From the Zendesk evidence visible here..." |
| Supplied evidence only | Classify from pasted ticket text, screenshots, summaries, exports, or manually grouped notes. | Low to medium. | Do not recommend final merge unless the supplied evidence clearly proves a low-risk duplicate. Name the smallest Zendesk detail needed. | "Based on the supplied evidence only..." |
| Secondary connector evidence | Use Slack, Gmail, Drive, Linear, GitHub, Asana, Bugherd, logs, analytics, or repo notes only to clarify Zendesk-first support evidence. | Medium only when the secondary source directly supports the relationship; otherwise low. | Keep the classification Zendesk-first. Do not let product or project evidence override missing support evidence. | "Secondary evidence suggests..., but Zendesk confirmation is still needed for..." |
| Unknown access | Treat source visibility as incomplete. | Low. | Avoid merge, incident, or reporting conclusions. Ask for or identify the smallest missing ticket evidence. | "I cannot confirm full Zendesk history from the available evidence..." |

## Required output behaviour

Include an `Access context` line when access is partial, supplied-only, secondary-led, unknown, or otherwise materially affects confidence.

Use one of these values:

- `full Zendesk access`
- `partial Zendesk access`
- `supplied evidence only`
- `secondary connector evidence`
- `unknown access`

If the access context is clear and complete, include it only when useful. If access is limited or unclear, include it every time.

## Confidence calibration

Lower confidence when any of these are missing or unavailable:

- full ticket thread;
- requester, organisation, site, workspace, or affected account;
- internal notes and side conversations;
- ticket events, linked tickets, or problem/incident links;
- timing and cluster window;
- prior resolution path or attempted handling;
- known-issue indicators;
- evidence that similar wording means the same cause.

Do not use high confidence from pasted summaries alone unless the duplicate is narrow, low-risk, and the supplied evidence contains the same customer context, same symptom, same workflow, same timing, and same resolution path.

## Action guardrails by access state

### Merge recommendations

Recommend merge only when:

- Zendesk evidence is visible enough to confirm same support case or same resolution path;
- no unique customer impact, SLA, promise, attachment, escalation, or internal note would be lost;
- support policy allows merging this case type.

If access is partial, supplied-only, or unknown, prefer:

- `Merge: not yet`
- `Link tickets: maybe/yes`
- `Treat separately: yes until missing evidence is confirmed`

### Incident-pattern recommendations

Classify as broader incident pattern only when timing, spread, and shared operational surface are supported. If tickets are clustered but the shared cause is not visible, classify as inconclusive or possible incident pattern with low/medium confidence and route to investigation or escalation only if active impact justifies it.

### Reporting recommendations

Include in reporting when repeated pain, related cases, or incident signals are visible, but avoid claiming volume, trend strength, or all affected customers unless the data source supports that claim.

## Smallest missing evidence prompts

Use one precise missing-evidence line rather than a long questionnaire. Examples:

- "Smallest missing evidence: whether both tickets have the same requester/account, same affected workflow, and same resolution path in Zendesk."
- "Smallest missing evidence: the cluster window and whether Zendesk shows additional tickets with the same symptom."
- "Smallest missing evidence: internal notes or linked problem-ticket status confirming whether support is already treating this as one incident."
- "Smallest missing evidence: whether the two tickets contain unique customer commitments or attachments that would be lost by merging."
