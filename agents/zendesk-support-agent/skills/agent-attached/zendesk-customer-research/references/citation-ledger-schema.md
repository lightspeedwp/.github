# Citation Ledger Schema

Use this reference when assigning source handles and building the `Source Coverage and Citation Key` section.

The ledger is the trust layer for the brief. It must make it clear what was checked, what was found, what could not be accessed, and which claims each source supports.

## Handle Families

Use these handle prefixes consistently:

| Prefix | Source family | Examples |
|---|---|---|
| `[Z#]` | Zendesk | ticket, organisation search, requester search, tag search, Zendesk export |
| `[E#]` | Email | Gmail thread, shared mailbox thread, pasted email chain |
| `[S#]` | Slack or chat | Slack channel search, thread, pasted internal chat |
| `[D#]` | Docs or knowledge | Google Drive doc, SOP, help-centre article, pasted project notes |
| `[P#]` | Project tools | Asana task, Linear issue, GitHub issue or PR |
| `[O#]` | Other systems | analytics, logs, billing, CMS, supplied external source |

Restart numbering inside each source family. Do not reuse the same handle for unrelated sources.

## Ledger Fields

Each ledger entry should answer these fields, even if the output line stays compact:

- `handle`: source handle, for example `[Z1]`
- `source_type`: Zendesk, email, chat, docs, project tools, or other
- `source_identifier`: ticket ID, search query, thread subject, document title, task ID, or supplied excerpt label
- `time_scope`: exact time window searched or `not time-bound`
- `status`: `relevant`, `no result`, `not relevant`, `unavailable`, or `not checked`
- `why_checked`: reason this source mattered for the research question
- `confidence_impact`: `raises`, `neutral`, `lowers`, or `blocks`
- `claims_supported`: short list of claim IDs or brief sections the source supports
- `limits`: missing access, stale source, partial excerpt, ambiguous identity, or other caveat

## Status Rules

Use `relevant` when the source directly supports at least one claim in the brief.

Use `no result` only when the source was actually searched successfully and returned no matching result.

Use `not relevant` when a source was opened or searched successfully but does not support the current customer, window, or research mode.

Use `unavailable` when the connector, permission, workspace, file, thread, ticket, or account access is missing. Never present unavailable access as a no-result search.

Use `not checked` when a source was intentionally skipped because it was outside scope, unlikely to add evidence, or unnecessary after stronger Zendesk evidence was sufficient.

## Claim Support Rules

Every synthesis claim in these sections needs at least one handle:

- `Current Support State`
- `Weekly View`
- `Key Themes and Trendlines`
- `Open Risks or Escalation Signals`
- `Recommended Reply Context`
- `Recommended Handoff` when the common handoff depends on evidence rather than user intent

Operational facts such as ticket status, owner, severity, queue, last update, SLA pressure, or customer commitment should be backed by Zendesk handles whenever Zendesk is available.

Non-Zendesk handles can support context, but they should not override Zendesk facts without surfacing the contradiction.

## Compact Output Pattern

Use compact output lines like this:

```md
- `[Z1] Zendesk organisation search for <customer>, <date range> - relevant - found 3 recent tickets and 1 still-open older blocker; supports Current Support State, Recent Zendesk Activity, Open Risks.`
- `[E1] Gmail search for <customer domain>, <date range> - unavailable - current user has no mailbox access; lowers confidence for prior commitments.`
- `[D1] Project handover doc - not checked - Zendesk evidence was sufficient and no delivery context was requested.`
```

## Quality Checks

Before final output:

- each handle used in the brief appears in the ledger
- each relevant ledger entry is cited at least once in the brief or is removed
- unavailable sources are not described as no-result searches
- major conclusions do not rely only on chat, docs, or project tools when Zendesk evidence is missing
- low or partial evidence lowers confidence rather than being smoothed over

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
