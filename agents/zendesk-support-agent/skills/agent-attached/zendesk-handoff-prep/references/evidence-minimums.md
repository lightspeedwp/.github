# Evidence minimums for Zendesk handoffs

Use this reference when a handoff may be too thin, when the target team is unclear, or when the handoff could otherwise become a weak FYI. The goal is to decide whether to proceed, proceed with caveats, or route to `zendesk-evidence-collector` or `zendesk-case-readiness-check` first.

## Readiness levels

### Ready
Proceed with the handoff when the brief includes:

- the customer-facing problem in plain language;
- the affected customer, account, site, workflow, product area, or environment when known;
- confirmed evidence separated from assumptions;
- attempted support steps or a clear note that none are known;
- the blocker or decision needed;
- one exact ask for the receiving teammate or team;
- urgency or risk with evidence, not guesswork.

### Partially ready
Prepare the handoff only if it is useful to unblock the case, and label gaps clearly. Use when some evidence is missing but the receiver can still act on a narrow ask.

Required handling:

- include `Missing evidence:` in the handoff;
- avoid root-cause claims;
- ask for one specific check or decision, not broad investigation;
- do not convert to Linear, GitHub, Asana, or BugHerd unless explicitly requested and the missing evidence is not blocking that conversion.

### Not ready
Do not prepare a full handoff when the receiver would have to rediscover the case from scratch.

Route to `zendesk-evidence-collector` when a handoff lacks reliable case evidence or needs investigation, reproduction, proof, or root-cause context first. Route to `zendesk-case-readiness-check` when the main question is whether the case is ready for a handoff. Use `zendesk-router-skill` when the right next workflow is unclear.

Route away before handoff preparation when:

- the customer problem is unclear;
- the impact is unknown and materially affects urgency;
- the evidence is only a second-hand summary with no ticket/customer details;
- no exact ask can be stated;
- reproduction, timeline, logs, screenshots, or prior replies are required before anyone can act;
- security, privacy, billing, or access-control risk is suspected but unverified.

## Minimums by handoff target

| Target | Minimum evidence before handoff |
|---|---|
| Specialist support | latest customer ask, current ticket state, last support promise, attempted steps, what not to repeat, next safe customer-facing step |
| Engineering | observed versus expected behaviour, affected site/account/environment/product area, reproduction status, error/log/timestamp/screenshot if available, attempted support checks, exact technical ask |
| Product | customer problem, expected versus current behaviour, known workaround or limitation, evidence of frequency if claimed, product decision needed |
| Operations/admin | affected customer/account, operational process or ownership issue, current state, deadline/SLA/customer risk, exact operational action needed |
| Security | confirmed security-relevant facts only, affected account/system, exposure or access-control concern, containment need if any, approved audience, sensitive details omitted |
| Account/customer owner | customer context, relationship or commercial risk, latest customer ask, support state, decision or communication needed |
| Support manager | SLA/queue/status risk, customer impact, ownership blocker, attempted support actions, decision or prioritisation needed |

## Evidence confidence labels

Use these labels inside the handoff when helpful:

- `Confirmed:` directly supported by Zendesk, Help Centre, supplied screenshots, logs, or pasted source material.
- `Customer-reported:` stated by the customer but not yet independently verified.
- `Support-observed:` checked or reproduced by support.
- `Assumption:` inferred but not confirmed.
- `Missing:` needed to complete the handoff safely.

## Smallest missing evidence rule

When evidence is incomplete, identify the smallest missing item that would change the handoff. Avoid long discovery lists.

Good examples:

- `Missing: timestamp of the failed import so engineering can check logs.`
- `Missing: confirmation whether the workaround was tried by the customer.`
- `Missing: screenshot of the permission error with the affected user role.`

Poor examples:

- `Need more details.`
- `Engineering should investigate.`
- `Can someone look into this?`
