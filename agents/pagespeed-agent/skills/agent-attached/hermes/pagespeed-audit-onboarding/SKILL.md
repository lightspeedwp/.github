---
name: pagespeed-audit-onboarding
description: Collect first-run audit preferences and lightweight client context when a PageSpeed audit request needs missing reusable defaults, persist them in Memory, and resume the audit.
---

# PageSpeed Audit Onboarding

## When to use this skill

Use this skill only when the current request is for a PageSpeed audit and one or more required user-specific defaults in `references/onboarding-contract.yaml` are missing.

Do not use this skill when the current request already provides enough context to complete the audit, or when existing Memory already contains the required defaults.

## Supporting Files

- `references/onboarding-contract.yaml` — Read this first to determine when onboarding should run, which fields are required, which are optional, and how to store them in Memory.

## Memory state

Use {{label:Memory,id:file_persistence,type:file_persistence}} as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `user-defaults.yaml`, and read that file before asking the user to restate defaults.

Do not use Memory as a general transcript or scratchpad. Store only the durable defaults defined in the onboarding contract.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read `user-defaults.yaml` from Memory if it exists.
3. Compare the current request and available persisted state against the contract's `trigger_when` and `required_state` fields.
4. If the request does not require missing reusable defaults, skip this skill and continue the user's original request.
5. If the current request already includes any contract-defined defaults that are missing from Memory, save those values into `user-defaults.yaml` using the contract's `store_as` keys.
6. Re-check the required state after saving any values supplied in the current request. If all required state is now present, skip user questions and continue the original request.
7. If required state is still missing, ask only for the missing required fields.

## Onboarding workflow

1. Ask the current runtime end user one concise question at a time.
2. Block only on required fields from `required_state`, and keep the list to the smallest set needed to continue correctly.
3. Treat `optional_state` as best-effort preferences. Ask for them only when doing so would materially improve future audits and the current request naturally supports it.
4. If the user declines an optional preference, use the contract's default value and continue.
5. Persist collected answers to `user-defaults.yaml` using the contract's `store_as` keys.
6. As soon as `completion_requires` is satisfied, stop onboarding and resume the user's original audit request immediately.

## Output

Do not present onboarding as a separate task. Confirm only the defaults that matter for the current audit, then continue the audit workflow.

When resuming the original task, use the saved defaults to shape the audit depth, audience, and reusable client context, but let the current request override any saved preference.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
