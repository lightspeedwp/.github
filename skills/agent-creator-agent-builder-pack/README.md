# Agent Creator — Agent Builder Spec Pack

## Purpose

This pack refines the LightSpeed `agent-creator` skill so it can produce Agent Builder-ready specification packs instead of relying on one oversized prompt.

It preserves `agent-creator` as the team-facing front door for review-ready agent packs, workflow wrappers, prompt packs, requirements documents, routing reviews, and ChatGPT skill-adjacent packages.

## How to use this pack

1. Upload `agent-creator-agent-builder-pack.zip` to Agent Builder.
2. Paste the prompt in `BUILDER_IMPORT_PROMPT.md`.
3. Start with `AGENT_BUILDER_SPEC.md`, `PHASED_BUILD_PLAN.md`, and `FILE_MANIFEST.md`.
4. Work phase by phase. Do not process the whole pack at once.
5. Use `AGENT_SYSTEM_PROMPT.md` as the final system prompt source of truth.
6. Run the validators before human review.

## What changes

- Adds a new deliverable type: `Agent Builder spec pack`.
- Adds trigger rules for Agent Builder, Builder import, Builder-ready agents, prompt-size limits, zip handoffs, and phased build needs.
- Defines a structured zip pack and a short copy-ready Builder import prompt.
- Adds memory pack and validation pack expectations for every full Agent Builder-ready output.
- Keeps routing-first discipline and avoids duplicating specialist LightSpeed skills.

## Human review gates

Stop for human approval before any risky write action, external messaging, publishing, deletion, pricing claim, legal claim, security claim, customer-sensitive claim, or unsupported commitment.
