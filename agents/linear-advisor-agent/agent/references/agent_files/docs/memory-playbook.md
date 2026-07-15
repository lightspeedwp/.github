# Memory Playbook

## Purpose

Use Memory to preserve **durable workflow defaults** that make future Linear workflow-design runs faster, more consistent, and less repetitive.

This agent should use Memory as a **small operating context layer**, not as a dumping ground for notes.

## What Memory is for

Use Memory for information that is:

- stable across future runs;
- useful for packaging, routing, validation, or approval decisions; and
- unlikely to change from request to request.

Good examples:

- preferred package shape;
- preferred validation level;
- durable routing preferences;
- source-of-truth order;
- approval posture for high-risk tools;
- lasting naming conventions;
- standing LightSpeed workflow conventions; and
- reusable decisions that should affect future outputs.

## What Memory is not for

Do not save:

- one-off project notes;
- temporary client facts;
- disposable draft content;
- stale intermediate reasoning;
- personal or sensitive details that do not improve future workflow design; or
- anything the user has not clearly implied should persist.

## Default Memory Files

### `skill-intake-state.yaml`

Use for reusable workflow defaults that affect first-pass packaging.

Store:

- default workflow type;
- packaging preference; and
- last confirmed date.

### `skill-factory-preferences.yaml`

Use for durable output and packaging preferences.

Store:

- default package shape;
- preferred validation level;
- markdown output profile; and
- whether examples or copy-paste sections are usually preferred.

### `decisions-log.yaml`

Use for durable rules and decisions that should remain visible across runs.

Store:

- routing decisions;
- naming decisions;
- policy decisions;
- workflow conventions; and
- whether a previous rule has been superseded.

### `assumptions-open-questions.yaml`

Use only for unresolved assumptions or open questions that may matter later.

Store:

- durable assumptions worth tracking; and
- open questions that future work should not accidentally ignore.

Do not use this file for ordinary temporary uncertainty.

### `source-of-truth-register.yaml`

Use for stable evidence priorities.

Store:

- preferred source order;
- what each source is used for; and
- any durable notes about source reliability.

### `skill-routing-notes.yaml`

Use for routing preferences that should persist across runs.

Store:

- which skill to prefer in recurring edge cases;
- when to avoid a skill; and
- what the fallback should be.

### `tool-permission-preferences.yaml`

Use for durable approval preferences in higher-risk tool scenarios.

Store:

- tool family;
- default posture; and
- whether approval is always required.

## Memory update rules

Only update Memory when one of these is true:

- the user explicitly states a lasting preference;
- the user confirms a standing rule;
- a decision is clearly meant to apply in future runs; or
- a stable pattern has appeared often enough to be worth preserving.

If none of those are true, do not save it.

## Memory write discipline

Before saving anything, ask:

1. Will this still help on a future run?
2. Is it specific enough to be actionable?
3. Is it safe to persist?
4. Does it belong in Memory rather than the current response or a one-off file?

If the answer to any of these is no, do not save it.

## Memory read discipline

At the start of a relevant request:

- check for durable preferences before re-asking the same workflow questions;
- prefer Memory only when it is still relevant to the current task; and
- ignore stale or weakly related entries rather than forcing them into the output.

Memory should guide the work, not overrule the user’s current request.

## Validation rules

- Prefer structured YAML for durable state.
- Validate against the schema files in `memory-schemas/`.
- Reject unknown keys unless the schema is intentionally extended.
- Remove or supersede outdated values instead of keeping conflicting defaults.
- Use ISO-style `YYYY-MM-DD` dates.

## Lightweight operating policy

Use this practical default:

- save few things;
- save only durable things;
- prefer structured things;
- label assumptions clearly; and
- keep Memory easier to trust than to fill.

## Suggested save order

If Memory is being set up from scratch, save in this order:

1. `skill-factory-preferences.yaml`
2. `skill-intake-state.yaml`
3. `source-of-truth-register.yaml`
4. `skill-routing-notes.yaml`
5. `tool-permission-preferences.yaml`
6. `decisions-log.yaml`
7. `assumptions-open-questions.yaml`

## Example minimal setup

```yaml
# skill-factory-preferences.yaml
default_package_shape: full-skill-package
preferred_validation_level: production-ready
markdown_output_profile: standard-factory
include_examples: true
include_copy_paste_sections: true
last_updated_at: '2026-05-15'
```

```yaml
# skill-intake-state.yaml
default_workflow_type: full-skill
packaging_preference: production-ready
last_confirmed_at: '2026-05-15'
notes: Default to reusable packaging when the request is clearly recurring.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
