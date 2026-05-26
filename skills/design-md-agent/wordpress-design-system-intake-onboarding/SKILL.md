---
name: wordpress-design-system-intake-onboarding
description: Collect first-run user defaults needed for WordPress design-system audit and validation work, persist them, and resume the user's original request.
---

# WordPress Design-System Intake Onboarding

## When to use this skill

Use this skill only when the current request requires missing user-specific defaults listed in `references/onboarding-contract.yaml`.

Do not use this skill when the current request can be completed from the current message, existing Memory state, attached files, and connected sources alone.

This skill is a task-triggered preflight for WordPress design-system work. It is not a generic greeting, welcome flow, or full discovery interview.

## Memory state

Use Memory as the backing store for the onboarding keys in `references/onboarding-contract.yaml`.

Persist those keys for the current runtime end user in a single compact state file named `user-defaults.yaml`, and read that file before asking the user to restate defaults.

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

## Intake rules

- Treat `default_repo` as the main required project anchor when the task depends on repository inspection, implementation drift analysis, package updates, or WordPress mapping work.
- If the current request already names a repo, repo URL, or clearly scoped project source, persist it and do not ask again.
- Treat `project_scope` as optional unless the agent cannot tell whether the work is package-wide, theme-specific, plugin-extension-specific, or mixed.
- Treat `parent_theme_context` as optional unless parent-theme inheritance is likely to materially affect the audit.
- Treat `design_source_priority` as optional unless the task depends on recurring source ordering that differs from the agent's normal defaults.
- When the request is one-off and self-contained, skip onboarding even if Memory has no saved state.
- When the user gives a new repo or updated scope later, update Memory and continue without replaying the full intake flow.

## Output

Do not summarize onboarding for its own sake. Confirm only the defaults that matter for the current task, then continue the original request.
