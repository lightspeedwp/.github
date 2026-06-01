---
name: design-md-user-defaults-onboarding
description: Collect first-run user defaults needed for DESIGN.md work, persist them, and resume the user's original request.
---

# DESIGN.md User Defaults Onboarding

## When to use this skill

Use this skill only when the current request requires missing user-specific defaults listed in `references/onboarding-contract.yaml`.

Do not use this skill when the current request can be completed from the current message, existing Memory state, and attached context alone.

## Memory state

Use Memory as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `user-defaults.yaml`, and read that file before asking the user to restate defaults.

Do not use Memory as a general transcript or scratchpad. Store only durable defaults that the contract says should be reused across future runs for that same runtime end user.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read `user-defaults.yaml` from Memory if it exists.
3. Compare the current request and available persisted state against the contract's `trigger_when` and `required_state` fields.
4. If no trigger matches, skip this skill and continue the user's original request.
5. If the current request already provides any contract-defined defaults that are missing from Memory, persist those values to `user-defaults.yaml` using the contract's `store_as` keys.
6. Re-check `required_state` after persisting request-supplied values. If all required state is now present, skip user questions and continue the user's original request.
7. If required state is still missing, ask the current runtime end user for only the missing required fields.
8. Do not ask for any `optional_state` values during this blocking first-run step.

## Onboarding workflow

1. Ask one concise question at a time.
2. Block only on required fields from `required_state`, and keep that list to the smallest set needed to continue the current task safely.
3. During the initial onboarding turn, ask only for missing required fields and do not bundle in optional defaults.
4. After `completion_requires` is satisfied, stop onboarding and resume the user's original request immediately.
5. Ask about `optional_state` later only if the resumed task becomes genuinely blocked on one of those values.
6. When an optional value becomes necessary later, ask only for that one missing value, persist it, and continue the task.
7. Otherwise use the contract's defaults for optional preferences.
8. Persist collected answers to `user-defaults.yaml` using the contract's `store_as` keys.

## Output

Do not summarize onboarding for its own sake. Confirm only the defaults that matter for the current task, then continue the original request.

## Supporting Files

- `references/onboarding-contract.yaml` — the trigger rules, required fields, optional fields, and completion criteria for onboarding.
