---
name: proposal-defaults-onboarding
description: Use when the current proposal or review task needs missing user-specific defaults for evidence lookup, deliverable routing, or intake handling; collect the smallest useful set, persist it in Memory, and resume the original request.
---

# Proposal Defaults Onboarding

## When to use this skill

Use this skill only when the current request needs missing user-specific defaults listed in `references/onboarding-contract.yaml`.

Treat this as a lightweight onboarding wizard for proposal work. Run it only when the current task actually needs missing defaults.

Do not use this skill when the current request can be completed well from the current message, existing Memory state, attached files, and the agent's normal defaults alone.

## Memory state

Use {{label:Memory,id:file_persistence,type:file_persistence}} as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `proposal-user-defaults.yaml`, and read that file before asking the user to restate defaults.

Store only durable defaults that improve future proposal and review work, such as preferred source scope, default deliverable routing, and recurring intake conventions.

Do not use Memory as a transcript, scratchpad, or dumping ground for one-off project details.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read `proposal-user-defaults.yaml` from Memory if it exists.
3. Compare the current request and available persisted state against the contract's `trigger_when`, `required_state`, `optional_state`, and `skip_when` rules.
4. If no trigger matches, skip onboarding and continue the user's original request.
5. If the current request already provides any contract-defined defaults that are missing from Memory, persist those values using the contract's `store_as` keys.
6. Re-check required state after persisting request-supplied values. If all required state is present, skip questions and continue the user's original request.
7. If required state is still missing, ask only for the smallest missing required item.

## Onboarding wizard workflow

1. Ask concise, natural questions one at a time.
2. Block only on the minimum required field or fields needed for the current task.
3. Use smart defaults for optional preferences when the user does not provide them.
4. Persist collected answers to `proposal-user-defaults.yaml` using the contract's `store_as` keys.
5. After `completion_requires` is satisfied, stop onboarding immediately and resume the original request.
6. If the user gives a new standing preference that replaces an older one, update the stored value instead of keeping both.

## Smart defaults

Use these principles when optional preferences are missing:

- default to the uploaded artefact and attached files before broader source searches
- default to a document-ready deliverable when the task is a substantial pack or formal draft
- default to a chat-first draft only when the task is exploratory or the user is still shaping the work
- default owner labels to function rather than person when no specific owner is known
- default follow-up grouping to the clearest review-friendly structure rather than asking extra questions

## Output

Do not summarise onboarding for its own sake.

Confirm only the defaults that materially affect the current task, then continue the original request.

## Supporting Files

- `references/onboarding-contract.yaml`: Read this first to decide when onboarding should run, which default is required, which preferences are optional, and when to skip onboarding.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
