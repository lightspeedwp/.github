---
name: estimator-onboarding
description: Collect first-run user defaults needed for recurring website estimate and proposal work, persist them in Memory, and resume the user's original request.
---

# Estimator Onboarding

## When to use this skill

Use this skill only when the current request requires missing user-specific defaults listed in `references/onboarding-contract.yaml`.

Do not use this skill when the current request can be completed from the current message, existing Memory state, and attached context alone.

## Memory state

Use Memory as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `estimator-user-defaults.yaml`, and read that file before asking the user to restate defaults.

Do not use Memory as a general transcript or scratchpad. Store only durable defaults that the contract says should be reused across future runs for that same runtime end user.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read the Memory state file named by the contract's `memory_state_file` field if it exists.
3. Compare the current request and available persisted state against the contract's `trigger_when` and `required_state` fields.
4. If no trigger matches, skip this skill and continue the user's original request.
5. If the current request already provides any contract-defined defaults that are missing from Memory, persist those values to the Memory state file using the contract's `store_as` keys.
6. Re-check `required_state` after persisting request-supplied values. If all required state is now present, skip user questions and continue the user's original request.
7. If required state is still missing, ask the current runtime end user for only the missing required fields.

## Onboarding workflow

1. Ask the current runtime end user one concise question at a time.
2. Block only on required fields from `required_state`, and keep that list to the smallest set needed to safely continue the current task.
3. Use safe defaults for optional preferences from `optional_state` when the user does not provide them.
4. Persist that user's collected answers to the Memory state file named by `memory_state_file`, using the contract's `store_as` keys.
5. After `completion_requires` is satisfied, stop onboarding and resume the user's original request immediately.

## Working rules

- Treat onboarding as a reusable-defaults step, not as project intake.
- Collect only standing preferences that should carry across future estimate and proposal runs for the same user.
- Do not use onboarding to gather project-specific scope facts such as platform, page counts, migration volume, integrations, languages, or package requirements. That belongs in the intake workflow.
- If the request already contains enough context to do useful work, continue the work first and collect optional defaults later only if they would materially improve future runs.
- If the user gives a default in passing during normal work, save it without forcing a separate onboarding exchange.
- When a saved default conflicts with the current request, follow the current request and update Memory only if the user indicates the new choice should become the default.

## Separation from intake

Use onboarding for reusable defaults such as:

- how to handle incomplete scope when a user wants an estimate quickly
- whether ambiguous requests should default to an estimate, a proposal, or both
- whether the user usually wants a concise or detailed first-pass deliverable

Use intake for project-specific discovery such as:

- website type and business goal
- platform and CMS details
- page, template, and content counts
- ecommerce, booking, multilingual, migration, or integration scope
- the missing values that affect package routing, pricing, or custom-scope escalation for the current project

If the user is asking about one project and the missing information is about that project, use intake rather than onboarding.

## Output

Do not summarize onboarding for its own sake. Confirm only the defaults that matter for the current task, then continue the original request.

## Supporting Files

- `references/onboarding-contract.yaml` — read this first to determine when onboarding should run, which defaults are required vs optional, how they should be stored in Memory, and when onboarding must be skipped.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
