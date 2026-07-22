---
name: lightspeed-intake-onboarding
description: Collect first-run user defaults needed for LightSpeed planning intake, persist them in Memory, and resume the user's original request.
---

# LightSpeed Intake Onboarding

## When to use this skill

Use this skill only when the current planning request would benefit from missing user-specific defaults listed in `references/onboarding-contract.yaml`.

Do not use this skill when the current request can be completed from the current message, existing Memory state, and attached context alone.

Do not turn every run into a setup interview. Most project facts are request-specific and should be handled in the current run without saving them as durable defaults.

## Memory state

Use Memory as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `user-defaults.yaml`, and read that file before asking the user to restate defaults.

Do not use Memory as a general transcript or scratchpad. Store only durable defaults that the contract says should be reused across future runs for that same runtime end user.

Project-specific facts such as client name, repo URL, Figma file, launch date, and scope details are not reusable defaults unless the user explicitly says they should become standing defaults.

## Preflight

1. Read `references/onboarding-contract.yaml`.
2. Read `user-defaults.yaml` from Memory if it exists.
3. Compare the current request and available persisted state against the contract's `trigger_when` and `required_state` fields.
4. If no trigger matches, skip this skill and continue the user's original request.
5. If the current request already provides any contract-defined defaults that are missing from Memory, persist those values to `user-defaults.yaml` using the contract's `store_as` keys.
6. Re-check `required_state` after persisting request-supplied values. If all required state is now present, skip user questions and continue the user's original request.
7. If required state is still missing, ask the current runtime end user for only the missing required fields.

## Onboarding workflow

1. Ask the current runtime end user one concise question at a time.
2. Block only on required fields from `required_state`, and keep that list as small as possible.
3. Use safe defaults for optional preferences from `optional_state` when the user does not provide them.
4. Persist that user's collected answers to `user-defaults.yaml` using the contract's `store_as` keys.
5. After `completion_requires` is satisfied, stop onboarding and resume the user's original request immediately.

## Intake guidance

When this skill runs, guide the intake process intelligently:

- first infer what you can from the user's current request
- separate reusable defaults from one-off project facts
- ask for one-off project facts only if they are needed to complete the current task correctly
- do not save one-off project facts to `user-defaults.yaml` unless the user explicitly wants them treated as durable defaults
- if the user gives enough context to proceed, do the planning work instead of extending onboarding

Use onboarding to learn how this user generally wants planning work to begin, not to collect every detail about every project.

## Smart defaults

If the user has not set preferences, use these defaults without blocking the run:

- start with the smallest useful planning artefact
- prefer an intake summary when the brief is incomplete or ambiguous
- maintain project memory for active multi-step planning work
- use the agent's standard Markdown deliverable rules for substantial outputs

## Output

Do not summarize onboarding for its own sake. Confirm only the defaults that matter for the current task, then continue the original request.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
