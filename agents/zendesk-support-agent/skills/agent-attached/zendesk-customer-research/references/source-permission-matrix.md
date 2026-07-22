# Source Permission Matrix

Use this matrix when running the skill inside a shared workspace agent where different teammates may have different connector permissions.

Do not treat a connector access failure, missing integration, or permission error as a no-result search. Mark it as `unavailable`, explain the confidence impact, and continue only with sources that can responsibly support the requested brief.

## Source Roles

| Source | Preferred access | Use for | Can prove | Cannot prove | If unavailable |
|---|---|---|---|---|---|
| Zendesk | Shared support workspace or support-agent account | Ticket timeline, current status, priority/severity, owner/queue, public replies, internal notes, SLA pressure, tags, linked problems, explicit support commitments | What support has recorded, said, assigned, tagged, escalated, or left unresolved in Zendesk | Commercial account health, unrecorded customer sentiment, delivery status outside support unless linked | Use pasted Zendesk export, ticket excerpts, or user-provided support notes; mark Zendesk as `unavailable`; downgrade confidence when current status cannot be verified |
| Gmail | User mailbox, shared support mailbox, or pasted thread | Email commitments, follow-ups, customer-side context, sales/support handover context | What was said in email threads available to the current agent session | Full support state, Zendesk ticket status, hidden threads in another teammate's mailbox | Mark as `unavailable`; do not imply no email exists; use Zendesk and pasted emails if available |
| Google Drive | Shared Drive or explicitly provided docs | Handover notes, SOPs, project briefs, implementation context, governance decisions | What a document states, when sufficiently current and relevant | Live ticket state, whether support has acted, whether a customer has replied since the document was written | Mark as `unavailable`; rely on Zendesk or user-provided docs; lower confidence if the missing docs are likely material |
| Slack or chat | Shared internal channels or pasted snippets | Recent ownership signals, escalation discussion, operational colour, informal blockers | That a teammate discussed, suspected, or proposed something | Customer-facing facts, final decisions, ticket resolution, SLA state unless backed by Zendesk | Mark as `unavailable`; do not treat unavailable chat as no concern found |
| Asana, Linear, GitHub, or project tools | Shared workspace/project access or supplied task/issue links | Delivery work that directly affects support response, bug status, implementation blockers, engineering handoff context | What a task, issue, pull request, or project item says about delivery work | Customer-facing support truth unless the item links back to Zendesk or support evidence | Mark as `unavailable`; avoid project-status claims unless supplied by the user or backed by Zendesk |
| Pasted notes or exports | User-provided bounded evidence | Fallback evidence when live connectors are unavailable; narrow review of supplied material | What is present in the supplied material | Current system state outside the supplied material | Label the brief as based on supplied evidence only; lower confidence if live Zendesk confirmation is needed |
| Public web or vendor docs | Public web search or user-supplied public links | Product/vendor context, known external incidents, public docs that explain a behaviour | Publicly documented behaviour or status | LightSpeed support state, customer-specific commitments, private ticket facts | Use only as supporting context; never replace Zendesk/customer evidence |

## Coverage Status Values

Use these statuses consistently in the source coverage ledger.

- `relevant`: source was checked and supports one or more claims in the brief.
- `no result`: source was accessible and the search returned no matching result.
- `not relevant`: source was accessible but results did not materially support the requested brief.
- `unavailable`: source could not be accessed by the current shared agent/user, connector, or permission context.
- `not checked`: source was intentionally skipped because it was outside scope, unlikely to add value, or would be a poor authority for the question.

## Authority Rules

- Treat Zendesk as the primary source for support facts when available.
- Treat Gmail, Drive, Slack, Asana, Linear, GitHub, and public web evidence as supporting context unless the user explicitly supplied them as the only evidence base.
- Do not infer `Stable` from quietness in non-Zendesk sources.
- Do not infer `no ticket exists` from unavailable Zendesk access.
- Do not infer `no commitment exists` from unavailable Gmail access.
- Do not infer `no internal concern exists` from unavailable Slack access.
- Do not turn project-tool status into customer-facing support status unless directly linked to Zendesk or explicit support notes.

## Confidence Impact

Use this guidance when deciding confidence.

- Keep confidence higher when Zendesk is current and the requested brief only needs support-record facts.
- Lower confidence when Zendesk is unavailable and the brief relies on pasted notes or secondary tools.
- Lower confidence when the most relevant source is stale, informal, or not customer-facing.
- Use `Unknown` for the health signal when available evidence is too thin or too secondary to score support-operational health.

## Shared-Agent Wording

Use precise wording when permissions affect the result.

Good wording:

- `Zendesk was unavailable to this shared agent, so this brief is based on the supplied export and confidence is Low.`
- `Gmail was not checked because the Zendesk record already contained the relevant customer-facing commitments.`
- `Slack access was unavailable, so internal discussion coverage is incomplete.`
- `No relevant Zendesk tickets were found in the accessible Zendesk search.`

Avoid wording:

- `There are no Zendesk tickets.` when Zendesk was unavailable.
- `There are no email commitments.` when Gmail was unavailable or only one mailbox was checked.
- `The team is not concerned.` when Slack/chat was unavailable or not checked.
- `The issue is resolved.` when only a project task is closed and Zendesk is still open or unchecked.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
