---
name: zendesk-case-readiness-check
description: zendesk-first readiness check for lightspeed and shared-agent support cases. use when a zendesk ticket, support case, customer thread, reply candidate, escalation candidate, knowledge candidate, internal handoff, or downstream engineering/product handoff may not have enough evidence for the next concrete deliverable, especially when connector access may vary by teammate. determines whether the case is ready, partially ready, or not ready; identifies the smallest missing evidence; recommends only the smallest local next action or returns unclear zendesk-first intake to zendesk-router-skill without becoming a second router.
---

# Zendesk Case Readiness Check

## What this skill does

Use this skill to decide whether a Zendesk-centred support case has enough evidence for the next concrete step.

This skill:

- checks evidence sufficiency;
- identifies the smallest missing evidence;
- separates ready now from needs one more thing;
- prevents weak customer replies, weak escalations, weak knowledge drafts, and weak downstream handoffs;
- works from Zendesk directly when available, or from pasted ticket evidence when used standalone in GPT;
- keeps the assessment focused on readiness, not full execution.

Assess readiness for:

- customer reply;
- internal escalation;
- knowledge drafting;
- support handoff;
- downstream engineering/product handoff.

This is a readiness gate. Do not write the reply, escalation, article, or downstream artefact inside this skill unless the user separately asks for that output after the readiness decision.

## When to use this skill

Use this skill when evidence sufficiency is unclear before the next support deliverable.

Use it when:

- the user asks whether there is enough evidence to reply or escalate;
- the case feels incomplete;
- the team needs to know what is still missing;
- the agent is about to create a downstream artefact and needs a support readiness check first;
- Zendesk has partial, conflicting, or thin evidence;
- a pasted ticket summary needs a quick readiness decision.

## Do not use this skill for

Do not use this skill for:

- full investigation, root-cause analysis, reproduction, or proof gathering;
- full ticket triage, priority, queue, or ownership assignment;
- customer reply drafting;
- escalation brief drafting;
- broad backlog or trend reporting;
- duplicate/pattern classification;
- documentation-worthiness review when the question is whether something should become documentation.

Return to `zendesk-router-skill` or the parent agent when the requested output is broader than readiness, the intake path is unclear, or another canonical Zendesk specialist clearly owns the work.

## Default frame

Use this frame:

- smallest missing evidence wins;
- do not ask for more than necessary;
- focus on readiness for the next concrete deliverable;
- prefer Zendesk-native evidence first;
- avoid over-investigating when the case is already good enough for the next step;
- do not assume Linear, GitHub, Asana, or product planning is the next destination.

A case does not need perfect certainty. It needs enough evidence for the specific next support action.

## Shared agent portability

This skill must work in a shared workspace agent regardless of which teammate is logged in. Do not rely on a specific user's Memory, private connector access, saved searches, inbox, Slack access, Drive access, or workspace-specific assumptions.

Use Zendesk when available. If Zendesk is not available, assess only the supplied evidence and clearly state which Zendesk detail is missing. Do not persist customer-specific support facts to Memory. Only use durable memory for stable team conventions when explicitly available.

Load `references/shared-agent-safety.md` when configuring, auditing, or running this skill in a shared agent.

Load `references/connector-capability-fallbacks.md` when connector availability, permissions, saved views, or user-specific access may affect evidence collection.

Load `references/shared-agent-integration.md` when attaching this skill to a shared support agent, writing parent-agent routing instructions, or running rollout smoke tests.

Load `references/routing-boundaries.md` when recommending a next step, deciding whether to hand back to the parent agent, or preventing this skill from becoming a second Zendesk router.

## Primary source order

Use sources in this order:

1. Zendesk ticket details and conversation: ticket ID, subject, requester, organisation, form, fields, tags, status, priority, group, assignee, SLA state, public replies, internal notes, side conversations, attachments, screenshots, ticket events, linked tickets, related tickets, macros used, and support commitments.
2. Help Centre or existing support documentation: public articles, internal notes, macros, troubleshooting guides, known issue notes, policy pages, and documented support processes.
3. Pasted user evidence: copied ticket text, screenshots, support summaries, customer messages, developer notes, reproduction notes, or manually supplied context.
4. Secondary systems only if the blocking gap cannot be resolved otherwise: Slack, Gmail, Google Drive, GitHub, Linear, Asana, BugHerd, logs, analytics, repo notes, incident notes, or admin systems.

Standalone rule: if Zendesk or a named follow-on skill is not available in the current GPT, assess from the evidence provided, state the missing Zendesk detail, and describe the next action in plain language instead of inventing unavailable tooling.

## Optional references

Load these only when relevant:

- `references/shared-agent-safety.md` when the skill is used in a shared workspace agent or connector access may vary by user.
- `references/connector-capability-fallbacks.md` when Zendesk or secondary connector access is unavailable, incomplete, or different for each workspace user.
- `references/shared-agent-integration.md` when configuring the parent shared agent, writing routing snippets, or checking rollout behaviour.
- `references/routing-boundaries.md` when recommending the smallest local next action, a canonical companion handoff, or return to `zendesk-router-skill`.
- `references/minimum-evidence-matrix.md` when choosing the minimum evidence threshold for the target deliverable.
- `references/readiness-schema.md` when evidence classification or readiness status consistency matters.
- `references/examples.md` when a borderline case is hard to classify.
- `references/structured-output-guide.md` when another agent, automation, QA check, or downstream tool requires structured output.
- `schemas/readiness-check.schema.json` only when a structured JSON output is explicitly required by another agent, automation, or downstream tool.
- `scripts/validate-readiness-json.py` only when a JSON output has been saved to a file and needs deterministic validation.

## Workflow

1. Identify the target deliverable.
   - Choose customer reply, internal escalation, knowledge drafting, support handoff, or downstream engineering/product handoff.
   - If unclear, infer the target from the user request and state the assumption.

2. Define the minimum evidence needed.
   - Use the decision rules below.
   - Keep the threshold practical for support work.

3. Compare available evidence against that threshold.
   - Separate confirmed facts, customer claims, support assumptions, and missing evidence.
   - Prefer Zendesk facts over interpretation.

4. Mark readiness.
   - Ready: enough evidence exists for the target deliverable now.
   - Partially ready: the direction is clear, but one specific missing item would materially improve safety or usefulness.
   - Not ready: the deliverable would be misleading, unsupported, or likely to cause rework.

5. Identify the smallest missing evidence.
   - Name the single smallest item that unblocks the next step.
   - If more than one gap matters, list the true blocker first.

6. Recommend the next best step without becoming a router.
   - Give one local next action that follows from the readiness decision.
   - Use only canonical companion handoffs when the user already requested that deliverable and the matching Zendesk specialist is attached.
   - Return to `zendesk-router-skill` or the parent agent when the next workflow is broader than readiness, ambiguous, or depends on the wider Zendesk skill network.

## Decision rules

### Customer reply readiness

A case is reply-ready when the agent can safely send a useful customer message without inventing facts.

Minimum evidence:

- current customer question, complaint, or requested outcome is clear;
- relevant ticket context or prior support history has been checked;
- known answer, next action, workaround, limitation, or focused clarification request is supportable;
- urgency and tone are appropriate;
- uncertainty can be framed honestly.

A case can be reply-ready without being root-cause-complete.

Not ready for reply when the actual ask is unclear, the reply would require guessing, or one knowable Zendesk/Help Centre fact is still missing.

### Internal escalation readiness

A case is escalation-ready when another internal owner can understand the impact and take action or make a decision.

Minimum evidence:

- affected customer, organisation, ticket, site, account, or segment is clear;
- impact, urgency, customer risk, SLA risk, or business risk is described;
- what support has already checked or attempted is summarised;
- the escalation ask is specific;
- known unknowns are named.

A case can be escalation-ready without a full diagnosis.

Not ready for escalation when the ask is vague, impact is unknown but knowable, or the receiving team would have to restart basic support discovery.

### Knowledge drafting readiness

A case is knowledge-ready when the issue is stable, resolved or sufficiently understood, and reusable guidance can be documented without misleading customers or agents.

Minimum evidence:

- issue, audience, and repeatability are clear;
- resolution, workaround, policy, or recommended process is confirmed;
- guidance is not likely to change immediately;
- public versus internal boundary is understood;
- article or note scope is clear.

A case is not knowledge-ready if the issue is unstable or unresolved.

### Support handoff readiness

A support handoff is ready when another support owner can continue the case without restarting basic discovery.

Minimum evidence:

- current customer ask, impact, and status are clear;
- confirmed evidence and assumptions are separated;
- support actions already attempted are summarised;
- blocker, next ask, or decision needed is explicit;
- customer commitments, timing, and risk are named when relevant.

Not ready for support handoff when the receiving owner would need to reconstruct the basic case context from scratch.

### Downstream engineering/product handoff readiness

A downstream engineering/product handoff needs clearer confirmed facts than ordinary support triage.

Minimum evidence:

- affected user, site, account, product area, workflow, or environment is identified;
- observed behaviour and expected behaviour are separated;
- reproduction steps, conditions, examples, screenshots, logs, IDs, or timestamps are available where relevant;
- customer impact and urgency are stated;
- support actions already attempted are captured;
- assumptions and unknowns are explicit;
- requested downstream action is clear.

Not ready for downstream handoff when the issue is a vague complaint, expected behaviour is undefined, reproduction context is missing but obtainable, or engineering/product would need to redo basic support investigation.

## Output format

Use this structure:

```markdown
## Readiness check

- Target deliverable: `[customer reply | internal escalation | knowledge drafting | support handoff | downstream engineering/product handoff]`
- Readiness status: `[ready | partially ready | not ready]`

## Confirmed evidence

- [confirmed fact from Zendesk, Help Centre, or supplied evidence]
- [confirmed fact]

## Missing evidence

- Blocker: [smallest missing evidence needed to proceed]
- Optional improvement: [only include if useful, otherwise `none`]

## Next step

[recommended next action or support workflow]
```

For high-risk cases, add:

```markdown
## Risk if skipped

[one short sentence explaining what could go wrong if the team proceeds without the missing evidence]
```

Only use JSON when explicitly requested or required by a downstream tool. When JSON is required, follow `schemas/readiness-check.schema.json`, use `references/structured-output-guide.md`, and keep the same readiness logic. If the JSON output is saved as a file and validation is needed, run `scripts/validate-readiness-json.py` against that file.

## Handoff boundaries

This skill is not the Zendesk router. `zendesk-router-skill` owns the full Zendesk skill network and should choose between specialist workflows when the next path is unclear.

Use `references/routing-boundaries.md` when the next step is unclear, when a companion skill name is needed, or when the skill may be drifting into router behaviour.

Keep recommendations local and canonical:

- Recommend `zendesk-evidence-collector` when material evidence is missing, or when single-case investigation, proof, reproduction, timeline reconstruction, or diagnostic context is needed. It owns minimum evidence collection and embedded single-case investigation/proof/timeline/reconstruction work for the LightSpeed support desk. If that companion is not attached, ask for the single smallest missing item instead of choosing another route.
- If a customer reply is ready and the user already asked for the reply, recommend `zendesk-draft-response`.
- If an internal escalation is ready and the user already asked for an escalation brief, recommend `zendesk-customer-escalation`.
- If a support handoff is ready and the user already asked for a handoff, recommend `zendesk-handoff-prep`.
- If a knowledge draft is ready and the user already asked for article drafting, recommend `zendesk-create-knowledge`. If documentation-worthiness is still unclear, return to `zendesk-router-skill` rather than deciding the knowledge route here.
- If the requested deliverable is not ready, do not draft, escalate, document, or hand off; identify the blocker first.
- If the user needs broad triage (`zendesk-triage-router`), ownership, priority, duplicate/pattern classification (`zendesk-duplicate-pattern-review`), backlog/reporting (`zendesk-backlog-trend-analysis`), customer research (`zendesk-customer-research`), evidence-quality review (`zendesk-evidence-quality-review`), documentation-worthiness (`zendesk-knowledge-candidate-review`), or a choice between multiple Zendesk specialists, return to `zendesk-router-skill`.

Never route to Linear, GitHub, Asana, product planning, or project workflows by default. If the user explicitly asks for a downstream artefact, first state whether Zendesk evidence is ready for that artefact. If the support route is still ambiguous, return to `zendesk-router-skill` instead of choosing a downstream workflow here.

## Quality bar / guardrails

A good readiness check is:

- Zendesk-first;
- focused on the next concrete deliverable;
- explicit about confirmed facts versus assumptions;
- precise about the smallest missing evidence;
- practical about sufficiency rather than perfection;
- clear about ready, partially ready, or not ready.

Avoid:

- vague "needs more detail" statements;
- over-investigating when good enough evidence exists;
- demanding root-cause certainty for every reply;
- escalating without impact and a clear ask;
- drafting knowledge for unstable issues;
- preparing downstream handoffs from ordinary triage evidence.

## LightSpeed Support Agent fit

In the LightSpeed Support Agent, prefer this skill whenever the agent is about to reply, escalate, document, or prepare a downstream handoff but is unsure whether the Zendesk evidence is strong enough. This skill should make the smallest next support move obvious.

## Replacement and demotion note

This skill reduces reliance on:

- `linear-gap-analyzer` for support evidence readiness;
- `linear-triage-router` for support-side next-step ambiguity;
- `linear-the-architect` when evidence sufficiency matters before issue drafting;
- `linear-voice-of-customer` when repeated pain still needs support readiness assessment.

Use Linear-oriented skills only after Zendesk-first readiness confirms a downstream Linear-centred artefact is explicitly needed.

## Recommended parent-agent routing note

Use `zendesk-case-readiness-check` directly for clear readiness checks before customer replies, internal escalations, knowledge drafts, support handoffs, or explicit downstream engineering/product handoffs when evidence sufficiency is uncertain. Return unclear Zendesk-first intake to `zendesk-router-skill`. This skill must identify the smallest missing evidence, recommend only the smallest local next action, use canonical Zendesk companion names when a common adjacent handoff is obvious, and avoid maintaining its own Zendesk skill network.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
