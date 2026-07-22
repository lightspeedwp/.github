# Detach overlap-heavy helpers and attach support skills prompt

Use this prompt to free up attachment capacity and reduce routing overlap before retrying the five support-layer local skill attachments.

## Prompt

Run a focused detach-and-attach pass on the current agent draft.

### Objective

Detach the overlap-heavy older helper set, then retry attaching the five support-layer local skills in smaller groups, and verify the final attachment state.

### Detach first

Detach exactly these overlap-heavy older helper skills:

- `prd-generation`
- `implementation-planning`
- `review-qa`
- `memory-management`
- `launch-handoff-support`
- `issue-drafting`
- `intake-routing`

### Why these are the first detach candidates

- `prd-generation` overlaps with `lightspeed-prd-writer`
- `implementation-planning` overlaps with `lightspeed-delivery-planner`
- `review-qa` overlaps with `lightspeed-prd-reviewer`
- `memory-management` overlaps with `lightspeed-project-memory-manager`
- `launch-handoff-support` overlaps with `lightspeed-release-handoff-generator`
- `issue-drafting` overlaps with the issue-drafting path inside `lightspeed-delivery-planner`
- `intake-routing` overlaps with `lightspeed-prd-agent-orchestrator` and `lightspeed-project-intake`

### Do not detach in this pass

Do not detach these unless a separate grounded issue requires it:

- `technical-brief-deep-dive`
- `validation-support`
- `evidence-locking`
- any attached `lightspeed-*` lifecycle skill from the newer suite

### Retry attachment target

After the detach step, retry attaching exactly these five local support-layer skills:

- `wordpress-plugin-packaging-review`
- `content-file-validator`
- `markdown-content-validator`
- `design-context-synthesis`
- `design-qa-readiness`

### Retry strategy

- retry the five support-layer attachments in smaller groups first
- if a grouped attach fails, retry in narrower groups or one by one
- verify the actual attached result after each retry rather than assuming success
- stop only when either:
  - all five support-layer skills are attached, or
  - the editor still refuses attachment and the remaining failure is clearly not resolved by this detach set

### Validation checks

1. confirm which helper skills detached successfully
2. confirm whether any detach failed
3. confirm which support-layer skills attached successfully
4. confirm whether any support-layer skills still failed to attach
5. note whether the attach behavior improved after the helper-detach step

### Constraints

- do not widen this into a general skill pruning pass
- do not update system instructions yet in this prompt
- do not claim the support layer is live until the five support skills are actually attached
- do not detach helper skills outside the exact list above unless a concrete, grounded blocker appears

### Output standard

Return:

- helper skills detached successfully
- helper skills that failed to detach
- support-layer skills attached successfully
- support-layer skills still not attached
- whether this resolved the earlier attach instability
- whether it is now safe to proceed to the instructions-alignment prompt

## When to use it

- when the new support-layer local skills uploaded but repeatedly failed to attach
- when the current draft already has a large helper-skill layer
- before updating instructions to reference the new support-layer skills

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
