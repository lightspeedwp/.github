---
name: chatbot-intake-onboarding
description: Collect first-run chatbot intake defaults needed for planning and estimating, persist them in Memory, and resume the user's original request.
---

# Chatbot Intake Onboarding

## When to use this skill

Use this skill only when the current request is asking for chatbot planning, source review, discovery, or estimation work and the minimum project intake defaults listed in `references/onboarding-contract.yaml` are missing.

Do not use this skill when the current request can be completed from the current message, existing Memory state, attached context, and available evidence alone.

Do not turn every run into onboarding. This is a task-triggered preflight for missing intake defaults only.

## Memory state

Use Memory as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys in a single compact state file named `chatbot-intake-defaults.yaml`.

Store state in two layers:

- `active_project` for the current project the user is working on
- `projects.<project_key>` for reusable project-specific defaults that may matter in later runs

Read the Memory state file before asking the user to restate defaults.

Do not use Memory as a general transcript or scratchpad. Store only durable defaults and confirmed intake facts that are likely to be reused across future runs.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read `chatbot-intake-defaults.yaml` from Memory if it exists.
3. Compare the current request and available persisted state against the contract's `trigger_when` and `required_state` fields.
4. If no trigger matches, skip this skill and continue the user's original request.
5. If the current request already provides any contract-defined defaults that are missing from Memory, persist those values first using the contract's `store_as` keys.
6. Re-check `required_state` after persisting request-supplied values. If all required state is now present, skip user questions and continue the user's original request.
7. If required state is still missing, ask the current user only for the missing required field or fields.

## Onboarding workflow

1. Ask one concise question at a time.
2. Block only on required fields from `required_state`.
3. Use safe defaults for optional preferences from `optional_state` when the user does not provide them.
4. When a project already exists in Memory and the current request appears to match it, reuse that project state instead of asking the user to restate it.
5. When the user names a new client or project, create or update a project entry under `projects.<project_key>` and set `active_project` to that entry.
6. Persist only confirmed values.
7. After `completion_requires` is satisfied, stop onboarding immediately and resume the user's original request.

## Smart defaults

Apply these defaults unless the current request or the user overrides them:

- default the working audience to `internal` when the user has not asked for a client-ready deliverable
- default the estimate posture to `provisional-only` when evidence is partial or unclear
- default source status to `unconfirmed` until approved sources are clearly identified
- default output format to the agent's standard structured Markdown estimate or discovery format

Treat these as runtime defaults, not facts. If the request provides better evidence, use that instead.

## What to persist

Persist only reusable intake state such as:

- client or project label
- primary website or domain
- preferred output audience when it recurs across runs
- reusable source-pack notes when they are confirmed and project-specific

Do not persist:

- one-off task instructions
- speculative scope ideas
- rough assumptions not confirmed by the user
- temporary blockers that belong only to the current run unless they remain active follow-ups

## Output

Do not summarize onboarding for its own sake. Confirm only the defaults that matter for the current task, then continue the original request.
