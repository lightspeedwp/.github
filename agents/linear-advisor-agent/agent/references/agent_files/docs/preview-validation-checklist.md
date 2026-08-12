---
title: Preview Validation Checklist
document_type: validation_checklist
purpose: Evaluate preview runs against the current Linear Workflow Skill Factory instructions
status: active
---

# Preview Validation Checklist

---

## 1. Human-Readable UAT Guide

This guide is for LightSpeed testers who need a simple way to validate whether the agent is ready for pilot onboarding.

### What you are testing

You are checking whether the agent:

- stays focused on **Linear** as the main source of truth;
- pushes toward **reusable Linear skills** instead of stopping at generic advice;
- gives outputs that are clear, practical, and ready to use; and
- avoids broken formatting, internal leakage, and confusing routing.

### How to run a test

For each preview run:

1. Copy the exact prompt for that run.
2. Start the preview.
3. Let the run finish fully.
4. Read the whole answer, not just the opening lines.
5. Decide whether the result is a **pass**, **partial**, or **fail**.
6. Record the main issue if anything felt wrong.

### How to score it

Use these definitions:

- **Pass**: The answer is clearly useful, stays Linear-first, follows the right path, and is clean enough for real team use.
- **Partial**: The answer is mostly useful, but an important weakness still needs fixing before rollout.
- **Fail**: The agent chose the wrong path, gave the wrong kind of answer, drifted away from its role, or produced something the team should not rely on.

### What should count as an automatic fail

Mark the run as an automatic fail if any of these happen:

- it shows `/workspace/...`;
- it shows any other internal or local path;
- it prints wrapper, payload, or transport-style output before the real answer;
- it gives generic workflow advice when it should have produced a **Linear skill direction**;
- it drifts away from **Linear-first** behavior; or
- it makes claims about app evidence that are not actually supported.

### What good output looks like

A strong result usually:

- gets to the point quickly;
- chooses the right output shape;
- explains recommendations in plain language;
- separates confirmed facts from assumptions;
- produces reusable skill direction where appropriate; and
- looks clean enough that a teammate could use it without extra coaching.

### What bad output looks like

A weak result usually:

- wanders into broad consulting advice;
- asks too many questions before doing useful work;
- stops at issue mapping when a skill should come next;
- feels too abstract or too vague to act on; or
- contains formatting or internal-output mistakes.

### What notes testers should write down

Keep notes short. For each run, capture:

- whether it passed, partially passed, or failed;
- the single biggest weakness;
- whether that weakness blocks pilot onboarding; and
- the smallest useful fix.

---

## 2. How To Use This Checklist

Use this checklist when reviewing a preview run for the Linear Workflow Skill Factory.

The goal is to validate whether the run followed the current instructions, chose the right routing path, stayed Linear-first, and produced the right output shape without unnecessary intake or drift.

---

## 3. Routing Validation

Check all that apply:

- [ ] The run chose the **narrowest useful path**.
- [ ] It stayed a **direct answer** when no specialist skill was needed.
- [ ] It used **onboarding only when reusable defaults were materially missing**.
- [ ] It used **one specialist skill** instead of escalating too quickly to broader packaging.
- [ ] It used the **creator** path only when the request was broader than a single specialist boundary.
- [ ] It used the **formatter** only as a presentation pass.

### Specialist boundary checks

- [ ] **Client Brief Converter** was used only for client-facing briefing, questionnaire, or discovery conversion work.
- [ ] **Architect** was used only for rewriting rough internal work into a clearer issue or task.
- [ ] **Gap Analyzer** was used only when the main job was missing-context diagnosis.
- [ ] **Sub-Issue Splitter** was used only when the work should become multiple tasks.
- [ ] **Triage Rules Designer** was used for reusable triage design rather than one-off routing.

---

## 4. Intake Discipline Validation

- [ ] The run did **not** turn into a full intake interview unnecessarily.
- [ ] It asked follow-up questions only for **blocker-level** missing information.
- [ ] It used safe assumptions when a useful draft could still be produced.
- [ ] It did not dump questionnaire contents into chat.
- [ ] It treated questionnaire files as selective reference material, not mandatory scripts.

---

## 5. Evidence Handling Validation

- [ ] The run clearly separated **confirmed facts** from **inferred details**.
- [ ] It did not present defaults or assumptions as confirmed truth.
- [ ] It used only the minimum relevant source material.
- [ ] It stayed grounded in the request and relevant files.
- [ ] It flagged blocker-level missing information when necessary.

### Questionnaire-backed work checks

- [ ] Only relevant questionnaire files appear to have been used.
- [ ] Irrelevant questionnaire files appear to have been ignored.
- [ ] The output reflects selective intake-to-Linear conversion rather than raw questionnaire playback.

---

## 6. Output Shape Validation

Choose the intended output shape and validate it:

- [ ] Direct answer
- [ ] Structured intake response
- [ ] Single Linear-ready issue
- [ ] Parent issue plus sub-issues
- [ ] Internal handoff pack
- [ ] Reusable template or pack

Then check:

- [ ] The chosen output shape matched the request.
- [ ] The output was not broader than necessary.
- [ ] The output was not narrower than necessary.

---

## 7. Formatting Validation

For substantial structured outputs:

- [ ] YAML frontmatter is present.
- [ ] There is exactly **one blank line** after the closing frontmatter fence.
- [ ] A top-level `#` title appears immediately after that blank line.
- [ ] Main sections use `##` headings.
- [ ] `---` divider lines appear between main `##` sections.
- [ ] A final `---` divider line appears after the last paragraph or list.
- [ ] The page is easy to scan.
- [ ] The output avoids walls of text.
- [ ] Bold sub-labels are used when they improve readability.

---

## 8. Linear-Readiness Validation

For internal Linear-ready outputs, check whether the run included the right elements when relevant:

- [ ] Priority guidance
- [ ] Suggested labels
- [ ] Owner guidance
- [ ] Suggested acceptance criteria
- [ ] Dependencies or risks
- [ ] Blocker-level open questions

### Acceptance-criteria quality

- [ ] Acceptance criteria are outcome-focused.
- [ ] Acceptance criteria are specific enough to review.
- [ ] Acceptance criteria are not vague rewrites of the title.
- [ ] Acceptance criteria are limited to the issue scope.

---

## 9. Role Alignment Validation

- [ ] The run stayed **Linear-first**.
- [ ] Supporting apps did not displace Linear as the main context.
- [ ] The run did not drift into generic consulting or broad business-assistant behavior.
- [ ] The run did not become a generic questionnaire bot.
- [ ] The result stayed aligned with LightSpeed’s internal workflow-factory role.

---

## 10. Common Failure Modes To Watch

Mark any that occurred:

- [ ] Used the wrong specialist boundary
- [ ] Escalated to creator unnecessarily
- [ ] Asked too many intake questions
- [ ] Overused questionnaire material
- [ ] Failed to separate confirmed vs inferred
- [ ] Chose the wrong output shape
- [ ] Missed required formatting structure
- [ ] Omitted Linear-ready fields that should have been included
- [ ] Drifted away from Linear-first behavior
- [ ] Produced a result that was too vague to implement

---

## 11. Review Verdict Template

Use this short review format after each preview:

**Routing choice:** correct / partly correct / incorrect  
**Instruction compliance:** strong / mixed / weak  
**Formatting compliance:** strong / mixed / weak  
**Linear-readiness:** strong / mixed / weak  
**Main issue exposed:** `<one sentence>`  
**Next recommended fix or test:** `<one sentence>`

---

## 12. 12-Run Acceptance Matrix

Use this matrix as the pilot acceptance gate for LightSpeed onboarding.

### Pass rule

The agent is **pilot-ready** only if:

- all **12 runs** are completed;
- all **6 starter-prompt runs** pass;
- at least **10 of 12 total runs** pass; and
- **no automatic-fail condition** appears in any run.

### Automatic-fail conditions

Any one of these is an immediate failure:

- `/workspace/...` appears in user-facing output;
- another internal or local file path is exposed;
- wrapper or payload-style output appears before the real answer;
- the agent stops at generic workflow advice when a **Linear skill** should have been the result;
- the run drifts away from **Linear-first** behavior; or
- the run makes unsupported claims about app-grounded evidence.

### Acceptance matrix

| Run | Scenario | Prompt source | Must pass | Fail if |
|---|---|---|---|---|
| 1 | **Linear instructions** | Starter prompt 1 | Reviews Linear first, separates verified patterns from assumptions, and produces useful personalized instruction direction | Assumes instead of checking Linear, gives vague advice, or stops short of actionable personalization |
| 2 | **Review Linear setup** | Starter prompt 2 | Recommends durable instruction changes grounded in actual Linear patterns | Gives generic recommendations, weak grounding, or non-durable tweaks |
| 3 | **Linear skill ideas** | Starter prompt 3 | Recommends real skill opportunities based on Linear workflow patterns and distinguishes skills from simple instruction fixes | Suggests random skills, misses priority, or confuses skills with small prompt edits |
| 4 | **First-run onboarding** | Starter prompt 4 | Designs a minimal onboarding flow that returns the user to the original task | Overcomplicates onboarding, asks for too much, or never returns to task continuation |
| 5 | **Lean onboarding** | Starter prompt 5 | Limits onboarding to blocker-level defaults only | Includes optional intake fluff, too many questions, or generic setup ceremony |
| 6 | **Memory-first onboarding** | Starter prompt 6 | Correctly distinguishes what should and should not go into Memory | Stores one-off info, misuses Memory, or slows first use too much |
| 7 | **Questionnaire -> first Linear skill** | Recommended scenario | Uses a questionnaire as source material and ends at a **skill definition**, not just mapping | Stops at issue mapping, template suggestion, or generic commentary |
| 8 | **Messy workflow request -> first skill recommendation** | Recommended scenario | Identifies the bottleneck and recommends the first reusable Linear skill | Gives broad advice only or avoids committing to a skill direction |
| 9 | **Linear workspace review -> highest-value improvement** | Recommended scenario | Uses workspace evidence to recommend the highest-value durable improvement | Overclaims from limited evidence or recommends weak or temporary changes |
| 10 | **Output hygiene stress test** | Recommended scenario | Returns a clean answer or deliverable with no internal leakage | Any wrapper output, payload echo, or internal path leak |
| 11 | **Boundary test** | Recommended scenario | Stays Linear-first even when the ask is broad and multi-tool | Becomes a generic ops consultant or broad agency assistant |
| 12 | **Real LightSpeed mixed request** | Recommended scenario | Handles a realistic mixed request cleanly, with good routing and useful output | Loses focus, over-routes, or produces something a teammate would not actually use |

---

## 13. Recommended Prompts For Runs 7-12

Use these prompts unless the team decides to replace them with stricter real-world variants.

### Run 7

"Use the Website briefing questionnaire and determine the first Linear skill that should be created from it. Do not stop at issue mapping."

### Run 8

"Our team keeps getting messy requests into Linear. What reusable Linear skill should we create first?"

### Run 9

"Review my Linear workspace and recommend the highest-value durable improvement for this agent."

### Run 10

"Generate a document and tell me how to access it."

### Run 11

"Help me redesign our whole operations workflow across every tool we use."

### Run 12

"Review how we currently work in Linear and recommend the first reusable skill or instruction change that would most improve developer and designer handoffs."

---

## 14. Acceptance Summary

Use this summary after all 12 runs are complete.

- **Starter prompt runs passed:** ___ / 6
- **Additional scenario runs passed:** ___ / 6
- **Total passes:** ___ / 12
- **Any automatic fail:** yes / no
- **Pilot-ready verdict:** yes / no

If any starter-prompt run fails, if total passes are below **10 / 12**, or if any automatic fail appears, the agent is **not ready** for pilot onboarding.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
