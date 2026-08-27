---
name: wordpress-site-onboarding
description: Collect first-run WordPress site defaults needed for audits, connected inspection, implementation support, and recurring reporting, persist them in Memory, and resume the user's original request.
---

# WordPress Site Onboarding

## When to use this skill

Use this skill only when the current request requires missing user-specific defaults listed in `references/onboarding-contract.yaml`.

Do not use this skill when the current request can be completed from the current message, existing Memory state, and attached context alone.

## Memory state

Use Memory as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `wordpress-user-defaults.yaml`, and read that file before asking the user to restate defaults.

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

## WordPress-specific rules

- Treat the selected site as the durable default only for future requests from the same runtime end user. Do not assume the same site for other users.
- If the user asks for direct inspection or implementation and the stored site context conflicts with the current request, trust the current request, update Memory, and continue.
- When the user gives only a partial site reference, such as a client name or shorthand label, save it only if it is specific enough to avoid mixing multiple sites.
- For general WordPress advice that does not depend on a particular site, skip onboarding entirely.
- If the user gives a one-off request about a different site than the stored default, use the current request for that run and update Memory only if the user clearly signals that the new site should become the default.
- Treat `site_environment` as a durable default that improves future audits and implementation safety, but do not block the current task on it unless the task clearly depends on staging-versus-production context.
- Treat `preferred_work_mode` as a routing aid only. It should influence whether the agent defaults to consultative guidance or connected inspection when both are viable, but it must not override a direct user instruction in the current run.

## Output

Do not summarize onboarding for its own sake. Confirm only the defaults that matter for the current task, then continue the original request.

## Supporting Files

- `references/onboarding-contract.yaml` — use this as the source of truth for trigger conditions, required state, optional state, and completion rules.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
