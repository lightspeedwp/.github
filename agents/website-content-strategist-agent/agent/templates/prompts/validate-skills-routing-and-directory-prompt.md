# Validate Skills Routing And Skills Directory Prompt

Use this prompt when you want a comprehensive audit of the agent’s skill-routing logic, attached skill coverage, skill references, and any drift between the instructions and the actual attached skills.

## Prompt

Audit this agent’s skills routing and skills directory comprehensively.

Your job is to validate whether the agent’s current instructions, attached skills, and any grounded skill-routing references are aligned, usable, and low-drift.

Focus on the following:

1. **Attached skills inventory**
   - List the skills that are actually attached to the current draft.
   - Separate uploaded skills from shared ChatGPT skill references if that distinction is visible.
   - Do not claim a skill exists unless it is grounded in the current attached skills.

2. **Instruction-to-skill alignment**
   - Review the routing sections and any other instruction blocks that mention skills.
   - Check whether each referenced skill is actually attached.
   - Flag any skill mentioned in the instructions that is missing, renamed, duplicated in purpose, stale, or inconsistent with the current attached skill set.
   - Flag any attached skill that appears important but is missing from the routing logic.

3. **Routing quality**
   - Assess whether the routing order is coherent, practical, and easy to follow.
   - Identify overlaps, conflicts, vague boundaries, missing upstream/downstream transitions, or cases where multiple skills appear to cover the same task without a clear rule.
   - Check whether the agent is likely to choose the most upstream blocking workflow first when appropriate.
   - Identify places where routing language is too broad, too ambiguous, too rigid, or too dependent on inferred file or skill state.

4. **Skills directory and reference hygiene**
   - Review grounded references to skill-routing guides, READMEs, prompt files, and related validation assets when they are attached.
   - Check whether the visible file structure for prompts, references, examples, tests, and scripts appears consistent with the current skill-routing system.
   - Flag missing supporting assets, duplicated guidance, outdated names, or files whose purpose appears to overlap confusingly.
   - Do not invent missing directories, files, or scripts.

5. **Validation and drift risks**
   - Identify the highest-risk drift between:
     - the current instructions
     - the attached skills
     - visible prompt files
     - visible reference files
     - visible validation scripts or tests
   - Call out anything that could cause incorrect routing, invalid assumptions about skill availability, or maintenance confusion.

6. **Recommendations**
   - Recommend the smallest high-value fixes first.
   - Distinguish between:
     - immediate fixes
     - structural improvements
     - optional cleanup
   - Prefer conservative recommendations that preserve grounded working behaviour unless a stronger change is clearly justified.

## Output requirements

Produce the output using this structure:

## Confirmed Attached Skills

- List the grounded attached skills and their apparent role in the agent.

## Confirmed Routing References

- List the grounded instruction sections or attached files that govern skills routing.

## Findings

### Alignment Issues

- ...

### Routing Issues

- ...

### Directory And Reference Hygiene Issues

- ...

### Drift Risks

- ...

## Recommended Fixes

### Immediate

- ...

### Structural

- ...

### Optional Cleanup

- ...

## Best Next Step

- State the single best next maintenance step.

## Guardrails

- Use only grounded attached skills and grounded attached files.
- Treat missing skill references as drift, not hidden context.
- Do not invent skill capabilities from the skill name alone when the routing or file evidence is weak.
- Do not describe unseen directories or files as if they exist.
- Prefer concise, plain editorial language over internal status labels.
- If evidence is incomplete because the visible file list is partial, say so explicitly and keep conclusions conservative.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
