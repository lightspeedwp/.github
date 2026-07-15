# Parent-agent routing contract

Use this reference when the router runs inside a shared workspace agent, when a canonical Zendesk-prefixed companion workflow may be unavailable, or when the route needs a plain-language fallback.

## Purpose

The router has two separate decisions:

1. **Canonical intent**: the Zendesk-first workflow that should own the next support action.
2. **Executable route**: the canonical workflow that is actually attached to the parent agent and can be invoked in the current run.

Keep those separate. Do not claim a workflow is executable unless it is attached to the parent agent.

## Resolution order

For every routing result:

1. Decide the canonical Zendesk-prefixed workflow from the support job and requested deliverable.
2. Check whether that canonical workflow is attached.
3. If the canonical workflow is attached, recommend it as the primary workflow.
4. If the canonical workflow is not attached, do not emit a legacy non-prefixed route. Describe the needed support action in plain language.
5. Never route to deprecated `ticket-triage` as an active workflow; first-pass triage is embedded in `zendesk-triage-router`.
6. Never route to Linear, GitHub, Asana, or project planning by default just because no support workflow is attached.

Use `workflow-namespace-map.yaml` to verify canonical Zendesk-prefixed names.

## Output pattern when canonical workflow is attached

```md
## Recommended route

- Primary workflow: `zendesk-draft-response`
- Optional supporting workflow: `none`

## Why this route fits

The requested deliverable is a customer-facing reply based on confirmed support facts.

## Next deliverable

Draft the customer update with confirmed facts, unknowns, and safe next steps.
```

## Output pattern when no matching workflow is attached

```md
## Recommended route

- Primary workflow: plain-language support action
- Optional supporting workflow: none

## Availability note

No attached workflow is available for the canonical `zendesk-draft-response` route, so do not claim that a skill can be invoked or use a legacy non-prefixed route.

## Why this route fits

The requested deliverable is still a customer-facing support reply, but this shared agent does not appear to have the reply-drafting workflow attached.

## Next deliverable

Draft a customer-facing support response from confirmed facts, separating knowns, unknowns, and any requested customer action.
```

## Shared-agent guardrails

- Treat the parent agent's actual attached skill directory as the source of truth.
- Do not infer skill availability from this package's reference files.
- Do not use the user who packaged the skill as the assumed permission baseline.
- If connector evidence is unavailable, continue from pasted evidence and state the limitation.
- Prefer a safe plain-language next action over a confident but unavailable route.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
