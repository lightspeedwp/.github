# Zendesk Customer Research Health Rubric

This rubric is intentionally conservative and only scores recent Zendesk-led support-operational health.

## Stable

Use `Stable` when most of the following are true:

- no active SEV or active high-severity issue in the window
- recent Zendesk tickets are low-severity or already resolved
- ownership is clear
- no repeated theme suggests a worsening pattern
- team notes do not flag acute customer-risk concerns

## Watch

Use `Watch` when any of the following are true:

- multiple recent Zendesk tickets point to related friction or repeated confusion
- there is at least one unresolved issue, but not clearly a severe blocker
- ownership has changed recently or handoff quality looks shaky
- chat or notes suggest rising concern without a current incident

## At Risk

Use `At Risk` when any of the following are true:

- an active SEV or incident affects the customer
- a recent high-severity ticket remains unresolved
- repeated Zendesk tickets show the same blocker or degraded core workflow
- escalation activity is rising and ownership or next steps are unclear
- team notes explicitly flag acute customer risk, churn risk, or a major relationship issue tied to support quality

## Unknown

Use `Unknown` when:

- the customer could not be resolved confidently
- the time window produced too little evidence to score safely
- source coverage is too partial or contradictory to call the signal

## Guardrails

- Do not use ticket count alone as a negative signal.
- Do not convert sparse evidence into `Stable`.
- If the strongest evidence is old, lower confidence and say so explicitly.
- If support-operational health and commercial account health point in different directions, only score the support-operational side here.
- Use one overall support-health signal by default. Do not create multi-dimension health scorecards unless the user explicitly asks for them.
- Active incidents, severe workflow failures, or support-trust issues should outweigh generic positive account signals when choosing the support-health value.

## Confidence

Use confidence as a separate judgment from the health value.

- `High`: Zendesk, chat, and at least one other recent source line up cleanly and there are few important contradictions.
- `Med`: the picture is directionally clear, but some important details still depend on partial notes, stale updates, or missing examples.
- `Low`: source coverage is thin, conflicting, or old enough that the current state may have shifted.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
