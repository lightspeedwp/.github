# Debug Preview Run Failure Prompt

Use this prompt when a preview run fails with a generic error such as `Something went wrong, please try again later.` and you want a grounded audit of likely causes before changing the agent.

## Prompt

Audit this failed preview run and diagnose the most likely grounded causes of the failure.

The preview ended with a generic error message rather than a successful user-facing result. Your job is to review the grounded run evidence, current instructions, attached skills, attached files, and configured tools to identify what most likely caused the failure and what should be fixed next.

Focus on the following:

1. **Run evidence first**
   - Start with the grounded preview transcript and any visible preview metadata.
   - Identify the last confirmed behaviour before the failure.
   - Separate confirmed evidence from inference.
   - If the only grounded evidence is a generic preview error, say so explicitly.

2. **Failure classification**
   - Assess whether the failure looks most consistent with:
     - output-format failure
     - over-claiming missing files or assets
     - instruction overload or conflict
     - grounded-file drift
     - attached-skill routing conflict
     - tool or app dependency mismatch
     - partial file visibility causing an overconfident audit
     - transient preview or runtime failure with weak evidence of a content issue
   - If several are plausible, rank them by likelihood.
   - If evidence is weak, keep the ranking short and conservative.

3. **Instruction and routing review**
   - Check whether the current instructions may be causing the agent to overreach, over-specify, invent assets, or produce a malformed response.
   - Check whether routing rules or maintenance rules create conflicting obligations.
   - Do not expand into a broad full-agent audit unless the run evidence clearly justifies it.

4. **Grounded asset review**
   - Review only grounded attached files, prompts, references, scripts, tests, schemas, and attached skills.
   - Flag any place where the current setup could tempt the agent to cite or depend on assets that are not actually visible.
   - If the visible file list is partial, say so and keep file-based conclusions conservative.

5. **Repair guidance**
   - Recommend the smallest high-value fixes first.
   - Distinguish between:
     - likely prompt-only fixes
     - likely instruction fixes
     - likely file or reference fixes
     - cases where the failure may need a rerun before making changes
   - Prefer a rerun recommendation over speculative deep fixes when the evidence is weak.

## Output requirements

Use this structure:

## Confirmed Run Evidence
- ...

## Most Likely Failure Causes
1. ...
2. ...
3. ...

## Contributing Drift Or Conflict
### Instruction Issues
- ...

### Skill Or Routing Issues
- ...

### File And Reference Issues
- ...

## Recommended Fixes
### Immediate
- ...

### If The Next Rerun Still Fails
- ...

### Optional Cleanup
- ...

## Best Next Step
- State the single best next debugging action.

## Guardrails
- Use only grounded preview evidence, grounded attached files, grounded attached skills, and grounded configured tools.
- Do not invent hidden runtime traces, missing files, or unseen validator results.
- If the preview error is too generic to prove a root cause, say so explicitly and keep the diagnosis conservative.
- Prefer a rerun recommendation over speculative deep fixes when evidence is weak.
