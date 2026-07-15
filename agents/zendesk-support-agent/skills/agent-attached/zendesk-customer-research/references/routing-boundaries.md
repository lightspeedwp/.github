# Zendesk Customer Research Routing Boundaries

Use this reference when deciding whether `zendesk-customer-research` should continue, hand off to a common next skill, or return to `zendesk-router-skill`.

## Network ownership rule

- `zendesk-router-skill` owns the full Zendesk skill network and broad workflow routing.
- `zendesk-customer-research` owns customer/account research only.
- This skill should know its own boundaries, a few common handoffs, and when to return to the router.
- Do not duplicate the complete Zendesk routing table inside this specialist skill.

## Stay in this skill

Stay in `zendesk-customer-research` when the user needs one of these outputs:

- recent support-health context for one customer or account
- customer/account background before a reply or escalation decision
- prior support commitments made to a customer
- open risks, unresolved support issues, or escalation signals for one customer
- a Zendesk-first support pulse using recent and still-open tickets
- a compact internal brief that helps a teammate understand what matters next

## Common direct handoffs

Use a direct handoff only when the next step follows clearly from the research evidence.

| Next need | Common handoff | Boundary note |
|---|---|---|
| Customer-facing reply wording | `zendesk-draft-response` | Use the research brief as input; do not draft the reply here. |
| Confirmed or likely customer-impact escalation | `zendesk-customer-escalation` | Use only when evidence shows meaningful impact, pressure, unclear ownership, or intervention need. |
| Evidence is insufficient, contradictory, stale, or missing live Zendesk confirmation | `zendesk-case-readiness-check` or `zendesk-evidence-collector` | Prefer readiness when deciding if a next artefact is safe; prefer evidence collection when more proof or timeline detail is needed. |
| Internal handoff from support research findings | `zendesk-handoff-prep` | Use when another team or specialist needs a concise evidence-backed handoff. |

## Return to the router

Return to `zendesk-router-skill` instead of choosing a specialist when:

- the user asks which Zendesk skill or workflow should own the work
- the request spans multiple possible Zendesk workflows and there is no obvious next step from the research brief
- the user needs documentation, backlog, duplicate review, pattern review, evidence-quality review, or another specialist path not listed as a common direct handoff
- the request starts as general support routing rather than customer/account research
- the next action depends on workspace policy, queue ownership, permissions, or team operating model rather than the evidence in the current brief

## Output wording

Use wording like:

- `Recommended handoff: zendesk-draft-response, because the research brief is complete and the user now needs customer-facing wording.`
- `Recommended handoff: zendesk-router-skill, because the evidence could become documentation review, backlog analysis, duplicate or pattern review, or another wider-network workflow and this specialist should not choose across the wider network.`
- `Recommended handoff: none. The customer-research brief answers the current request.`

Avoid wording like:

- `This should go to [specialist]` when the route is outside the common handoffs above.
- exposing a full Zendesk skill-network list inside this specialist skill.
- broad Zendesk workflow routing that belongs to `zendesk-router-skill`.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
