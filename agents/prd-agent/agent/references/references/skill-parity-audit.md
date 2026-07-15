# Skill parity audit

## Current audit result

The current attached skill layer is internally consistent after the recent LightSpeed promotion, routing updates, and documentation repair pass.

This agent is currently routed through attached uploaded Builder skills, not through the older workspace-shared exact-name skill set described by previous parity documents.

## Current attached skill layer

### Attached LightSpeed lifecycle suite

- `lightspeed-prd-agent-orchestrator`
- `lightspeed-project-intake`
- `lightspeed-project-research`
- `lightspeed-prd-writer`
- `lightspeed-estimation-planner`
- `lightspeed-delivery-planner`
- `lightspeed-prd-reviewer`
- `lightspeed-change-control`
- `lightspeed-approval-gate-manager`
- `lightspeed-project-status-reporter`
- `lightspeed-qa-planner`
- `lightspeed-qa-triage`
- `lightspeed-release-handoff-generator`
- `lightspeed-project-pack-exporter`
- `lightspeed-project-memory-manager`

### Attached legacy helper suite still present

- `intake-routing`
- `evidence-locking`
- `prd-generation`
- `implementation-planning`
- `review-qa`
- `memory-management`
- `validation-support`
- `launch-handoff-support`
- `issue-drafting`
- `technical-brief-deep-dive`

### Uploaded but unattached support-layer drafts

- `wordpress-plugin-packaging-review`
- `content-file-validator`
- `markdown-content-validator`
- `design-context-synthesis`
- `design-qa-readiness`

## What was drifted before this repair pass

- `references/SKILL_INVENTORY.md` described an older exact-name shared-skill layer as if it were the current attached layer.
- `prompts/README.md` did not list the current skills-routing, directory, and support-layer promotion prompts.
- the documentation layer did not clearly distinguish attached skills from uploaded-but-unattached support drafts.
- earlier repair and validation notes no longer matched the actual repaired scaffold state.

## What is repaired now

- the skill inventory now reflects the actual attached uploaded Builder skill layer.
- the prompt index now reflects the current prompt library.
- the routing spec now distinguishes the attached lifecycle suite, the still-attached helper layer, and the uploaded-but-unattached support drafts.
- the validation and parity notes now match the repaired inventory interpretation.

## Current parity interpretation

- The current agent is operationally consistent around the attached uploaded Builder skill layer.
- Uploaded-but-unattached support drafts are not treated as active routes.
- Exact shared-skill parity is not claimed.
- Older exact-name shared-skill parity notes should be treated as a separate historical parity track, not as the description of the current attached state.

## Preserved historical parity questions

The older manual-resolution track for these exact-name parity targets is still preserved and unresolved unless re-audited deliberately:

- `lightspeed-figma-wordpress-technical-brief`
- `evidence-locker`
- `lightspeed-intake-onboarding`
- `lightspeed-launch-task-router`

These should remain in the manual-resolution checklist if exact shared-skill parity is still a future requirement.

## Remaining unresolved items

### Not a blocker for the current attached routing layer

- The older exact shared-skill parity target has not been revalidated against the newer attached uploaded LightSpeed suite.
- The legacy helper skills still overlap with parts of the newer LightSpeed suite and may deserve a later boundary-cleanup pass.
- The five uploaded support-layer drafts are still not attached and therefore are not yet part of the active routing layer.

### Would require a later parity or product decision

- whether exact shared-skill parity still matters for this agent after the local LightSpeed suite promotion
- whether overlapping legacy helper skills should remain attached long term
- whether the four preserved historical parity targets are still active requirements or should be retired deliberately
- whether the five uploaded support-layer drafts should be attached later or remain uploaded-only support assets

## Recommended next actions

1. Use `references/SKILL_INVENTORY.md` and `references/skill-routing-spec.md` as the source of truth for the current attached layer.
2. Run `prompts/skills-routing-and-directory-validation-prompt.md` after future attachment or detachment changes.
3. Use `prompts/skills-routing-and-directory-repair-prompt.md` after future validation findings.
4. Reopen `rollout/skill-parity-manual-resolution-checklist.md` only if exact shared-skill parity is still a deliberate requirement.
