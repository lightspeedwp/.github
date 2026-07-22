# Audit Instructions And Files Alignment Prompt

Use this prompt to audit whether the agent’s current instructions still align with the grounded attached files, reference guides, validation assets, and visible folder structure.

## Prompt

Audit this agent’s instructions against the currently attached files.

Your job is to identify drift, stale references, missing grounded support, duplicated guidance, and places where the instructions no longer match the current attached file tree.

Focus on the following:

1. Review the current instructions for references to files, guides, prompts, scripts, schemas, templates, examples, tests, memory files, and operating rules.
2. Check whether each referenced asset is actually grounded in the current attached files.
3. Flag instructions that rely on missing files, stale names, duplicated sources of truth, or outdated folder assumptions.
4. Identify grounded files that now appear important to the agent’s behaviour but are missing from the instructions.
5. Distinguish between:
   - confirmed alignment
   - stale references
   - unsupported assumptions
   - missing instruction coverage
6. Recommend the smallest high-value fixes first.

## Output requirements

Use this structure:

## Confirmed Grounded Files

- ...

## Confirmed Instruction Coverage

- ...

## Drift Findings

### Stale Or Missing References

- ...

### Unsupported File Assumptions

- ...

### Missing Instruction Coverage

- ...

## Recommended Fixes

### Immediate

- ...

### Structural

- ...

### Optional Cleanup

- ...

## Best Next Step

- State the single best instruction-or-file alignment fix.

## Guardrails

- Use only grounded attached files and the current instructions.
- Treat missing references as drift, not hidden context.
- Do not invent files, folders, or scripts.
- Keep conclusions conservative if the visible file list is partial.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
