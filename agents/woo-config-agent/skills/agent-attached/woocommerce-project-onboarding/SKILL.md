---
name: woocommerce-project-onboarding
description: Collect first-run user defaults needed for repeat WooCommerce audits, planning, and implementation guidance, persist them, and resume the user's original request.
---

# WooCommerce Project Onboarding

## When to use this skill

Use this skill only when the current request requires missing user-specific defaults listed in `references/onboarding-contract.yaml`.

Do not use this skill when the current request can be completed from the current message, existing Memory state, and attached context alone.

Connected site evidence may help with implementation once project context is known, but it should not replace onboarding when unnamed-project planning still requires a durable default project context.

## Memory state

Use {{label:Memory,id:file_persistence,type:file_persistence}} as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `user-defaults.yaml`, and read that file before asking the user to restate defaults.

Do not use Memory as a general transcript or scratchpad. Store only durable defaults that the contract says should be reused across future runs for that same runtime end user.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read the Memory state file named by the contract's `memory_state_file` field if it exists.
3. Compare the current request and available persisted state against the contract's `trigger_when` and `required_state` fields.
4. If no trigger matches, skip this skill and continue the user's original request.
5. If the current request already provides any contract-defined defaults that are missing from Memory, persist those values to the Memory state file using the contract's `store_as` keys.
6. Re-check `required_state` after persisting request-supplied values. If all required state is now present, skip user questions and continue the user's original request.
7. If required state is still missing, ask the current runtime end user for only the missing required fields before starting unnamed-project planning or remediation work.

## Onboarding workflow

1. Ask the current runtime end user one concise question at a time.
2. Block only on required fields from `required_state`, and keep that list to the smallest set needed to safely continue the current task.
3. Use safe defaults for optional preferences from `optional_state` when the user does not provide them.
4. Persist that user's collected answers to the Memory state file named by `memory_state_file`, using the contract's `store_as` keys.
5. After `completion_requires` is satisfied, stop onboarding and resume the user's original request immediately.
6. Once the required project context is known, use connected site evidence as supporting implementation context rather than as a substitute for that stored default.

## Output

Do not summarise onboarding for its own sake. Confirm only the defaults that matter for the current task, then continue the original request.

## Supporting Files

- `references/onboarding-contract.yaml` — read this first to decide when onboarding should run, which defaults are required, which preferences are optional, and when onboarding must be skipped.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
