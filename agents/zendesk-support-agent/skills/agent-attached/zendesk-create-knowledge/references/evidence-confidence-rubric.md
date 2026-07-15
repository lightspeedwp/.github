# Evidence Confidence Rubric

Use this reference when assigning evidence confidence in Publishing Notes.

Evidence confidence describes how safe it is to rely on the source material for a knowledge draft. It is not a quality score for the writing.

## High Confidence

Use `high` when the article is strongly supported by confirmed evidence.

Typical signals:

- resolution is confirmed in Zendesk or approved source material
- customer problem, affected audience, and article purpose are clear
- workaround, fix, limitation, or known-issue status is stable
- public/internal boundary is clear
- existing article overlap has been checked
- no unsupported root-cause, timeline, legal, security, or commercial claims are included
- reviewer needs, if any, are specific and non-blocking

Recommended publishing note:

```md
- Evidence confidence: high — Resolution and article scope are confirmed by the available source material. Public/internal boundary is clear.
```

## Medium Confidence

Use `medium` when the draft is useful but needs review before publishing.

Typical signals:

- source evidence supports the article, but one or two details need confirmation
- workaround appears stable but has limited examples
- audience is likely but not fully confirmed
- existing article overlap has not been fully checked
- public/internal boundary is mostly clear but should be reviewed
- product limitation or known-issue wording needs product/support review
- the article can be drafted, but should not be published without review

Recommended publishing note:

```md
- Evidence confidence: medium — The available evidence supports a draft, but <specific detail> should be confirmed before publishing.
```

## Low Confidence

Use `low` when the source material is incomplete, unstable, or not safe for publication.

Typical signals:

- Zendesk evidence is unavailable or incomplete
- source resolution is not confirmed
- issue may still be changing
- workaround is untested or temporary
- affected audience is unclear
- public visibility is uncertain
- root cause is speculative
- customer/account context may affect the wording
- article overlap has not been checked
- reviewer or next route is required before drafting can be considered publish-ready

Recommended publishing note:

```md
- Evidence confidence: low — The available material is not enough for a publish-ready article. Route to <evidence collection/readiness/candidate review> before publishing.
```

## Confidence by Article Type

### How-To

High confidence requires confirmed steps, prerequisites, and success state.

Use medium or low if the steps were inferred, copied from an unconfirmed support reply, or depend on permissions that have not been checked.

### Troubleshooting

High confidence requires confirmed symptoms and supported fixes or decision points.

Use medium or low if causes are likely but not proven, or if the fallback path is unclear.

### FAQ

High confidence requires a direct answer backed by approved source material.

Use medium or low if the answer includes exceptions, policy wording, pricing, legal, privacy, or product roadmap implications.

### Known Issue

High confidence requires confirmed status, affected audience, and workaround or mitigation.

Use medium or low if product status is changing, the workaround is temporary, or the affected audience is not fully known.

### Internal Note

High confidence requires clear support use case, confirmed diagnostic steps, and safe customer-facing wording.

Use medium or low if escalation triggers, internal boundaries, or approved wording need review.

## Required Next-Route Guidance

For medium or low confidence, include a recommended next route.

Examples:

- `zendesk-evidence-collector` — source evidence is missing or not anchored in Zendesk
- `zendesk-case-readiness-check` — resolution, workaround, product status, or audience may be unstable
- `zendesk-knowledge-candidate-review` — documentation value, audience, visibility, or stability is unclear
- `zendesk-evidence-quality-review` — draft needs evidence, claims, boundary, or wording QA before sharing
- `zendesk-customer-research` — customer/account context may change article scope or risk

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
