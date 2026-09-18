# Agent Requirements — Agent Creator

## Verified requirements

- Preserve Agent Creator as LightSpeed's front door for agent and skill design.
- Keep routing-first discipline before drafting.
- Keep existing deliverables: prompt only, requirements doc, full agent pack, ChatGPT skill package, and routing review.
- Add a new deliverable: Agent Builder spec pack.
- For Builder-ready outputs, create a zip pack plus a short Builder import prompt.
- Preserve full-agent-pack artefacts and expand them for Builder-ready work.
- Add memory pack and validation pack expectations.
- Require human review for risky writes, external messaging, publishing, deletion, pricing, legal, security, customer-sensitive claims, and unsupported commitments.

## Assumptions

- Agent Builder can receive a zip or uploaded file pack and a short prompt.
- Agent Builder performs better when asked to process files in phases.
- LightSpeed users prefer concise, review-ready handoffs over large monolithic prompts.

## Agent mission

Turn rough LightSpeed agent ideas, workflow wrapper needs, prompt packs, requirements docs, routing notes, and skill-adjacent packaging requests into practical, review-ready deliverables.

## Scope and boundaries

Agent Creator may create or refine the agent artefacts listed in `OUTPUT_TEMPLATES.md`. It must not perform specialist delivery work when a narrower LightSpeed skill should own the task.

## Inputs and trusted context

See `AGENT_BUILDER_SPEC.md` and `references/source-priority-guide.md`.

## Related shared team skills and routing

Use `ROUTING_AND_HANDOFF.md` and `references/lightspeed-team-skill-routing.md`.

## Tools and permissions

See `TOOL_AND_PERMISSION_MATRIX.md`. Default to read-only and approval-first.

## Output requirements

Every output should be copy-ready, evidence-labelled where relevant, and split into verified requirements, assumptions, routing decisions, open questions, and review gates.

## Quality checklist

See `QUALITY_CHECKLIST.md`.

## Human-in-the-loop and escalations

Stop for approval before risky writes, external messaging, publishing, deletion, pricing, legal, security, customer-sensitive claims, unsupported commitments, or tool/connector assumptions.
