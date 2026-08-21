---
name: agent-asset-validation-maintainer
description: Use when the request is to audit, tighten, document, or maintain this agent’s own files, prompts, schemas, routing, validation scripts, or test coverage. Use it for self-audits, asset consistency reviews, validation-gap analysis, and follow-through on internal maintenance findings.
---

# Agent Asset Validation Maintainer

## Overview

Use this skill when the user wants maintenance work on the agent's own assets rather than on an external WordPress site.

This skill is for:

- auditing attached files, prompts, schemas, scripts, and tests
- checking whether the current instructions still match the attached asset tree
- reviewing routing references to attached skills, apps, and files
- verifying that validation coverage is real, current, and proportionate to the agent's actual responsibilities
- producing a tight maintenance report or a prioritised cleanup plan

Do not use this skill for routine site audits, normal tour-operator delivery work, or general WordPress consulting unless the request is specifically about the agent's own internal assets.

## Trigger Conditions

Use this skill when requests sound like:

- "audit this agent's own files, prompts, schemas, and tests"
- "check whether the validation pack is still aligned with the instructions"
- "review routing coverage and stale references"
- "tighten the maintenance docs and identify missing validation"
- "work out what files, prompts, scripts, or tests should be added, removed, merged, or refreshed"

## Core Responsibilities

1. Inspect the current attached asset tree before making confident claims.
2. Separate verified coverage from assumed coverage.
3. Check whether the instructions, prompts, scripts, schemas, and tests still describe the same operating model.
4. Surface stale, duplicated, thin, or missing assets.
5. Recommend the smallest coherent cleanup set instead of a broad wishlist.
6. Keep the agent's main business role unchanged unless the user explicitly asks for a broader rewrite.

## Primary Sources

Treat these attached assets as the first places to verify the internal maintenance picture:

- {{label:prompts/README.md,id:6a47b95473bc81918d3601a26964b04c,type:file}}
- {{label:prompts/validation-pack-tightening-prompt.md,id:6a47b90093e08191992cb0b0a8a4738a,type:file}}
- {{label:prompts/readme-refresh-prompt.md,id:6a47b8c52ef88191b5fc5f248ec63086,type:file}}
- {{label:prompts/routing-audit-prompt.md,id:6a47b89c046081919940f2db626ab7b9,type:file}}
- {{label:prompts/routing-validation-cleanup-prompt.md,id:6a47b2faeb7c81919c8e6d198b5192a3,type:file}}
- {{label:prompts/readme-recurring-cleanup-prompt.md,id:6a47b1e7e9948191aaf9a8c4ff9f5b9c,type:file}}
- {{label:tests/README.md,id:6a43c00fb1dc81919f42fb863cacaa13,type:file}}
- {{label:tests/master-qa-checklist.md,id:6a43c00fabd08191a6ded3ecd9f43421,type:file}}
- {{label:tests/schema-validation-tests.md,id:6a43c00fabb08191b1236e44fe990f9a,type:file}}
- {{label:tests/skill-routing-snapshot.md,id:6a47af228764819191e03c2f8a9b78d0,type:file}}
- {{label:scripts/run-master-validation.sh,id:6a43c00faad08191b422ba7e9e48e4c3,type:file}}
- {{label:scripts/validate-agent-structure.py,id:6a441c499efc8191b870c7dc1c714bde,type:file}}
- {{label:scripts/validate-instruction-file-consistency.py,id:6a43c00faaf88191aaa828881096243e,type:file}}
- {{label:scripts/validate-app-usage-consistency.py,id:6a43c00faa488191a3d80912be740909,type:file}}
- {{label:scripts/validate-starter-prompts.py,id:6a43c00fa9b48191b0e683498ea0a39b,type:file}}
- {{label:scripts/validate-short-description-consistency.py,id:6a43c00fa97881918ed17bbea465f861,type:file}}
- {{label:scripts/file-schema-validator.py,id:6a43c00fac148191b3e1cca55050a849,type:file}}
- {{label:scripts/validate-folder-schemas.sh,id:6a43c00fab8c8191a29cb4255083dfc5,type:file}}
- {{label:schemas/README.md,id:6a43c00fb12c8191adc6cbbaa18b8530,type:file}}
- {{label:schemas/memory-file-validation-schema.json,id:6a43c00fac5481919d5aa3c94a348a23,type:file}}

If the needed file is not verified in the attached file tree, say so and treat it as unknown instead of assuming it exists.

## Workflow

### 1. Classify the maintenance request

Identify which of these job shapes best matches the request:

- asset inventory and drift check
- routing and reference audit
- validation coverage audit
- documentation refresh planning
- cleanup and consolidation plan
- post-change verification

If the user asked for only one of those, stay narrow.

### 2. Inspect before concluding

Read the specific attached files that matter for the request before giving recommendations.

Use this inspection order unless the user clearly narrows it:

1. prompt and readme files that define maintenance intent
2. test and checklist files that claim validation coverage
3. scripts that enforce consistency or structure
4. schemas that define expected structured outputs
5. current instructions only when you need to verify instruction-to-asset alignment

Do not infer actual coverage from filenames alone.

### 3. Evaluate in five dimensions

For each relevant area, assess:

1. **Coverage** — what is actually covered by prompts, scripts, schemas, and tests
2. **Consistency** — whether files point to the same behaviour, entities, and standards
3. **Freshness** — whether references, snapshots, and expectations look stale
4. **Specificity** — whether the asset gives actionable guidance or only vague placeholders
5. **Maintenance value** — whether the asset earns its keep or should be merged, rewritten, or removed

### 4. Use strict evidence labels

Label findings as:

- `verified` when directly supported by inspected files
- `likely` when strongly implied by inspected files but not fully confirmed
- `not verified` when the asset or claim was not confirmed

Do not collapse those labels together.

### 5. Recommend the smallest coherent cleanup set

Prefer:

- one merged prompt instead of several overlapping prompts
- one validation path per important claim when possible
- one clear routing source of truth instead of duplicated wording
- updating stale snapshots and readmes before proposing new files

Only recommend new assets when an important gap cannot be covered by improving existing ones.

## Output Contract

Unless the user asks for a different format, return these exact sections in this order:

### Maintenance Scope

State what asset area you reviewed.

### Verified Coverage

List the coverage you confirmed from inspected files.

### Gaps And Drift

List stale references, missing coverage, duplication, thin guidance, or mismatches.

### Priority Fixes

Group actions as:

- `high priority`
- `useful next`
- `optional cleanup`

### Recommended Next Step

State the smallest next maintenance action that would improve the agent most.

## Decision Rules

- If prompts and scripts overlap, prefer the more deterministic enforcement path and simplify the prompt layer.
- If a snapshot file appears stale, recommend refreshing it before expanding routing logic around it.
- If a validator exists without a matching test or documented source file, flag the maintenance gap.
- If tests assert behaviour that the instructions no longer promise, flag that drift explicitly.
- If the request is about the agent's own maintenance assets, do not drift into external site strategy.
- If the evidence is partial because the visible file tree is incomplete, say the review is partial rather than overclaiming completeness.

## Example Request Shapes

### Example 1

Request: "Audit this agent's prompts, scripts, and tests so I know what should be consolidated."

Success looks like:

- prompt overlap identified
- real validation coverage separated from nominal coverage
- a short consolidation plan with priorities

### Example 2

Request: "Check whether routing references and validation coverage are still aligned after recent changes."

Success looks like:

- routing references inspected from the current assets
- stale or unsupported references flagged
- missing validation for changed behaviour called out clearly

### Example 3

Request: "Review the maintenance pack and tell me what is missing for long-term upkeep."

Success looks like:

- documentation, scripts, schemas, and tests assessed together
- durable maintenance gaps identified
- only the highest-value additions recommended

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
