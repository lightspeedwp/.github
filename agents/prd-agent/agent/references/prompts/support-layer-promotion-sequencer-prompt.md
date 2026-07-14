# Support-layer promotion sequencer prompt

Use this prompt when the agent already has a large attached skill set, the five new support-layer local skills have uploaded successfully but failed to attach, and the best next move is to detach the overlap-heavy older helper layer first, retry the support-skill attachment, and then update instructions only after the new support layer is attached.

## Prompt

Run the support-layer promotion sequence for this agent.

### Goal
Detach the overlap-heavy older helper skills first, then retry attaching the five support-layer local skills, then update the agent instructions so the attached routing layer reflects the final support-skill state.

### Exact support-layer local skills to attach
- `wordpress-plugin-packaging-review`
- `content-file-validator`
- `markdown-content-validator`
- `design-context-synthesis`
- `design-qa-readiness`

### Exact overlap-heavy helper skills to detach first
Detach these older helper skills before retrying the support-layer attachments:
- `prd-generation`
- `implementation-planning`
- `review-qa`
- `memory-management`
- `launch-handoff-support`
- `issue-drafting`
- `intake-routing`

### Sequence
1. Read and follow `prompts/detach-overlap-heavy-helpers-and-attach-support-skills-prompt.md`.
2. If all five support-layer skills attach successfully, then read and follow `prompts/support-layer-instructions-alignment-prompt.md`.
3. If attachment still fails after the helper-detach step, stop and report:
   - what detached successfully
   - which support skills still failed to attach
   - whether the failure still looks like an editor-side constraint
   - the safest next recovery option

### Validation expectations
- verify that the overlap-heavy helper set is actually detached before retrying the support-layer attachments
- verify which of the five support-layer skills attached successfully
- do not claim success for instruction updates unless the support-layer attachment actually succeeded
- preserve the still-useful non-overlap helpers unless a concrete issue requires broader cleanup

### Constraints
- do not detach LightSpeed lifecycle skills from the newer attached suite
- do not detach `technical-brief-deep-dive` or `validation-support` in this flow unless a separate grounded reason appears
- do not update instructions as if the five support-layer skills are attached unless that is actually true after retry
- do not silently widen this into a broader skill cleanup or parity redesign pass

### Output standard
Return:
- detached helper skills
- attached support-layer skills
- any support-layer skills that still failed
- instruction changes made, if any
- remaining risks or follow-up work

## When to use it
- when support-layer skills uploaded successfully but failed to attach
- when the draft already has a large helper-skill layer
- when you want the smallest reliable path to make the new support skills live in the current agent draft
