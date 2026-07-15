# Routing Boundaries

Use this reference when deciding what `zendesk-create-knowledge` should handle directly, when it should hand off to a closely related specialist skill, when it should use an explicit canonical route-away boundary, and when it should return to `zendesk-router-skill`.

## Core rule

`zendesk-router-skill` owns the wider Zendesk skill network.

`zendesk-create-knowledge` should know only:

- its own drafting boundary
- the few handoffs needed to make a knowledge draft safe and useful
- explicit canonical route-away boundaries for backlog/trend and duplicate/pattern work
- when the request has moved outside knowledge drafting and should return to `zendesk-router-skill`

Do not turn this specialist skill into a second router. Do not list or choose among the full Zendesk skill network from this skill. Use only the direct handoffs and explicit route-away boundaries named here.

## This skill owns

Stay in `zendesk-create-knowledge` when the user needs a review-ready knowledge draft and the documentation basis is already clear.

Owned outputs include:

- public help-centre article draft
- internal support knowledge draft
- FAQ draft
- troubleshooting article draft
- known-issue article draft
- article update brief
- structured JSON version of a knowledge draft, when requested

## Direct handoffs this skill may recommend

Recommend only one primary handoff unless the user explicitly asks for options.

Use these direct handoffs when they are clearly needed for the knowledge draft:

- `zendesk-knowledge-candidate-review` — documentation value, audience, stability, or public/internal visibility is unclear
- `zendesk-evidence-collector` — the source case, resolution, workaround, or ticket evidence is missing or not anchored in Zendesk
- `zendesk-case-readiness-check` — the source case may not be stable enough to document yet
- `zendesk-evidence-quality-review` — the finished draft needs claims, evidence, tone, boundary, or publication-readiness QA
- `zendesk-draft-response` — the user also needs a customer-facing reply that points to or reuses the article content
- `zendesk-customer-research` — customer/account context materially changes article scope, terminology, risk, or support posture

## Explicit route-away boundaries

Use these canonical route-away names only when the request clearly matches the category. Do not treat them as local drafting handoffs.

- `zendesk-backlog-trend-analysis` — for backlog, queue, SLA, ageing, volume, theme, or trend reporting.
- `zendesk-duplicate-pattern-review` — for duplicate, related-case, repeated-pain, or incident-pattern classification.

## Return to the router

Return to `zendesk-router-skill` when the next step is not clearly one of the direct handoffs above.

Return to the router for:

- broad Zendesk workflow selection
- unclear support next step
- escalation decisions beyond knowledge drafting
- requests mixing multiple Zendesk outcomes where the primary workflow is unclear
- duplicate, related-case, repeated-pain, or incident-pattern requests that do not clearly fit `zendesk-duplicate-pattern-review`
- backlog, queue, SLA, ageing, volume, theme, or trend requests that do not clearly fit `zendesk-backlog-trend-analysis`
- requests that start from a vague support issue rather than a documentation-ready case
- any situation where the agent would otherwise need to compare many Zendesk specialist skills

Use this fallback wording:

> This has moved outside the create-knowledge boundary. Return to `zendesk-router-skill` to select the right Zendesk workflow.

## Handoff output style

When recommending a handoff, keep it short:

```md
Recommended next route: `<canonical-zendesk-skill-name>` — <one-sentence reason tied to the knowledge draft or explicit route-away boundary>
```

Do not include a long routing matrix in normal outputs. Keep the article draft as the main deliverable. Do not introduce Linear, GitHub, Asana, product, or project routing unless the user explicitly asks for a downstream artefact after the knowledge draft is complete.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
