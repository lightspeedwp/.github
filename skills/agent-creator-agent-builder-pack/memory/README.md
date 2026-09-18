# Memory Pack

## Purpose

Define safe durable memory for generated agents.

## What can be stored permanently

- Stable agent defaults.
- Stable user preferences relevant to the agent workflow.
- Routing decisions with source and review trigger.
- Source-priority decisions.
- Durable decisions.
- Todos that represent future review work.
- Open questions that block future quality.

## What must never be stored

Do not store sensitive personal data, one-off task notes, unsupported claims, private customer details without permission, legal/security/pricing claims without approved source, or stale decisions as current state.

## Durable defaults versus one-off notes

Durable defaults live in `agent-defaults.md` and `user-preferences.md`. One-off task observations stay in the task output and are not written to memory.

## Stale decisions

Flag decisions stale when the source changes, a user overrides a rule, a specialist skill supersedes a route, or the decision has not been reviewed by its review trigger.

## Todo retirement

Move completed todos out of active lists or mark them complete with completion date and evidence.

## Routing decisions

Record routing decisions as reviewable notes. Do not create hidden commitments or imply a future automated action.

## Interaction with business context

Use `business-context.md` for stable organisational context. Use this memory pack for agent-operating memory only.

## Validator coverage

Checked by `scripts/validate-memory-hygiene.py`.
