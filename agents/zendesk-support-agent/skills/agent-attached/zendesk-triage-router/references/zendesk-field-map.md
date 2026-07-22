# Zendesk field map

Use this reference when Zendesk fields, tags, queue data, status, SLA state, account details, or custom fields materially affect first-pass triage or routing. The map is intentionally generic and shared-agent safe. It contains no real ticket data or workspace-private field values.

## Field interpretation principles

- Treat Zendesk fields as evidence signals, not automatic decisions.
- Do not assume a tag, status, group, or priority means impact is confirmed unless the ticket content supports it.
- Keep severity, priority, owner/team, status, and duplicate risk separate.
- If a field is unfamiliar or undocumented, list it in `Unknowns` instead of inventing its meaning.
- Prefer the customer message, public replies, internal notes, SLA state, and related-ticket context over isolated tags.

## Common Zendesk fields and routing value

| Field or signal | Use it for | Do not assume |
|---|---|---|
| Requester | Identify affected person and whether more customer context is needed | That the requester is the impacted end user |
| Organisation / account | Estimate customer importance, support history, and escalation sensitivity | That every organisation-level issue is broad impact |
| Status | Understand queue state and next action timing | That solved/closed means the issue is safe to document |
| Priority | Compare existing queue urgency with current evidence | That existing priority is correct |
| Group | Identify current support ownership | That current group is the right next owner |
| Assignee | Identify current responsible person | That handoff is unnecessary |
| SLA state | Detect response breach, ageing risk, and urgency | That SLA pressure changes technical severity |
| Tags | Identify product area, workflow, known issue hints, duplicate hints, or routing labels | That a tag proves root cause or duplicate status |
| Form / ticket type | Identify support category | That form selection is accurate |
| Custom fields | Capture product area, environment, plan, region, impact, or integration | Meaning without workspace documentation |
| Side conversations | Find specialist context or pending asks | That the answer has been actioned publicly |
| Attachments | Support reproduction, screenshots, logs, or proof | That screenshots alone confirm root cause |
| Related tickets / linked problem | Assess duplicate or pattern risk | That related automatically means duplicate |
| Help Centre links / macros used | Identify known guidance and possible documentation gaps | That macro use means the issue is resolved |

## Normalising into embedded triage

### Issue type

Use ticket content first, then field signals:

- login, permissions, password, seat, role, SSO -> `Account / Access`
- invoice, quote, plan, renewal, payment, contract -> `Billing / Contract`
- API, webhook, third-party connection, sync -> `Integration / API`
- missing or desired capability -> `Feature request`
- import, export, migration, missing records -> `Data / Import / Export`
- slow, timeout, intermittent error, outage wording -> `Performance / Reliability`
- data exposure, consent, security, privacy, legal risk -> `Security / Privacy / Compliance`
- broken expected behaviour with reproduction or direct symptom -> `Bug`
- setup, configuration, training, usage confusion -> `How-to / Configuration`

### Severity

Use impact and scope, not queue pressure alone:

- `Critical`: broad outage, severe data integrity risk, security exposure, or no workaround for a core workflow.
- `High`: major workflow blocked for an important customer or team, no strong workaround, or severe business impact.
- `Medium`: confirmed issue with contained scope, partial workaround, or moderate operational impact.
- `Low`: cosmetic, minor inconvenience, routine request, or clearly limited impact.
- `Unknown`: impact, scope, or symptoms are too thin or contradictory.

### Recommended priority

Use urgency and response pace:

- `Urgent`: active outage, security concern, hard deadline, executive escalation, SLA breach risk, or repeated same-day pattern.
- `High`: meaningful customer pain or blocked work that should move quickly.
- `Normal`: needs action and ownership but does not require interruption.
- `Low`: normal queue flow is acceptable.
- `Unknown`: not enough evidence to choose pace responsibly.

### Owner/team

Use the smallest capable owner:

- `Frontline support`: known answer, configuration guidance, routine clarification, account update that support can complete.
- `Senior / technical support`: reproduction needed, complex configuration, ambiguous product behaviour, logs/screenshots to interpret.
- `Engineering`: confirmed defect, data integrity concern, backend failure, no support-side workaround.
- `Product`: feature request, product decision, expected-behaviour ambiguity, prioritisation question.
- `Security / compliance`: privacy, security, legal, data exposure, access-control risk.
- `Billing / finance / operations`: contract, invoice, payment, renewal, subscription, operational process.

## Duplicate and pattern signals

Treat these as first-pass signals only:

- exact same symptom, same product area, same recent change, same workaround, or linked problem ticket -> higher duplicate risk.
- similar customer pain but different environment, product area, or trigger -> related issue, not proven duplicate.
- multiple reports across customers in a short period -> pattern / emerging incident risk.
- one old tag or loose mention of a known issue -> insufficient duplicate evidence.

Lack of a related-ticket link is not proof of low duplicate risk.

## Unknowns to name

When relevant, explicitly name missing fields such as:

- affected user or organisation
- product area or environment
- direct error message
- timestamp and timezone
- scope or number of affected users
- current workaround
- SLA state
- related-ticket or known-issue link
- whether the customer is blocked
- whether the issue is reproducible

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
