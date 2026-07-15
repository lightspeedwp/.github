# Severity Matrix

Use this reference when the impact, urgency, or escalation severity is ambiguous. Severity should reflect evidence-backed customer impact and risk, not customer tone alone.

## Severity levels

| Severity | Use when | Do not use when | Default internal posture |
| --- | --- | --- | --- |
| Critical | There is a severe outage, broad severe customer impact, credible security/privacy/compliance exposure, major data integrity risk, or high-trust relationship exposure requiring immediate senior ownership. | The customer is frustrated but impact is unconfirmed, the issue has a safe workaround, or only one low-risk workflow is affected. | Escalate immediately with the clearest owner, known evidence, active gaps, and next checkpoint. |
| High | The customer has a major blocker, repeated failure, strong business pressure, SLA/launch/renewal risk, stalled support path, or meaningful escalation risk requiring timely owner action. | The case is progressing normally, the problem is minor or contained, or support can resolve it with documented guidance. | Escalate with a specific decision or action request and evidence-backed urgency. |
| Medium | Escalation is justified, but impact appears contained and there is no confirmed emergency pressure, broad impact, or severe risk. | The task is a routine handoff, first-pass triage, ordinary how-to guidance, or a known workaround can resolve the case. | Escalate only if a cross-functional answer, decision, or owner action is needed. |

## Impact dimensions

Assess severity by combining these dimensions:

- Breadth: number of customers, users, teams, sites, publications, stores, integrations, or workflows affected.
- Depth: full blocker, major degradation, repeat failure, contained inconvenience, or cosmetic issue.
- Duration: active time window, whether the issue is worsening, and whether support has stalled.
- Business pressure: launch, renewal, revenue, SLA, contractual, executive, advertiser, publishing, or public-visibility pressure.
- Risk: relationship, compliance, security, privacy, data integrity, reputational, or operational exposure.
- Confidence: confirmed evidence, likely but unconfirmed evidence, thin evidence, or missing source context.

## Evidence-confidence wording

Use precise confidence language:

- Confirmed: supported by ticket history, reproduction, logs, screenshots, known-issue docs, or repeated Zendesk cases.
- Likely: evidence points in one direction but root cause is not proven.
- Possible: plausible from context, but evidence is incomplete.
- Unknown: required evidence is missing or connector access is unavailable.

Do not write that a root cause, outage, data loss, breach, or product defect is confirmed unless the available evidence supports that level of certainty.

## Severity anti-patterns

Avoid these mistakes:

- Escalating as Critical only because the customer is angry.
- Downgrading severity because only one customer reported it when the customer has high business exposure or launch pressure.
- Treating missing evidence as low risk. Mark it as an evidence gap instead.
- Combining routine handoff, customer reply drafting, and escalation into one unclear deliverable.
- Hiding uncertainty to make the brief sound stronger.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
