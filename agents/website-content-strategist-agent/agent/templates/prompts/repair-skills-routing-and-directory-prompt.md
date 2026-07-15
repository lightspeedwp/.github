# Repair Skills Routing And Skills Directory Prompt

Use this prompt after running the skills-routing validation prompt. It is designed to repair grounded issues in the agent’s skills routing, attached-skill references, supporting prompt files, and related directory hygiene without inventing missing assets.

## Prompt

Repair the skills-routing and skills-directory issues identified by the latest validation review.

Your job is to make the smallest grounded changes that improve alignment between the current instructions, attached skills, visible prompt files, visible reference files, and any visible validation assets.

Work conservatively. Do not redesign the whole system unless the validation findings clearly show that a broader rewrite is necessary.

Focus on the following:

1. **Fix instruction-to-skill drift**
   - Remove or rewrite references to skills that are not actually attached.
   - Correct outdated skill names, duplicated skill references, or misleading routing descriptions.
   - Preserve working grounded behaviour wherever possible.

2. **Repair routing logic**
   - Tighten routing language where it is ambiguous, overlapping, stale, or hard to follow.
   - Clarify which skills should be chosen first when multiple related skills exist.
   - Preserve the current routing model unless a specific conflict or gap requires a structural change.

3. **Repair directory and reference hygiene**
   - Update visible prompt, reference, README, test, schema, and validation files only when they are grounded and clearly affected by the routing issues.
   - Remove duplicated or conflicting guidance when a single grounded source of truth should remain.
   - If a visible file should be updated rather than a new file created, prefer updating it.

4. **Handle missing assets conservatively**
   - If the validation findings mention a missing skill, file, guide, or validator that is not actually present, do not invent it.
   - Instead, either remove the stale reference or note that the asset must be created separately.
   - Do not describe unseen directories or hidden files as if they exist.

5. **Preserve grounded setup**
   - Do not detach skills, remove apps, or change delivery behaviour unless the repair task specifically requires it and the issue is grounded.
   - Do not replace broad working routing behaviour with a narrower model unless the current routing is clearly incorrect.

6. **Prioritise the highest-value fixes**
   - Fix issues in this order unless the findings justify a different order:
     1. broken or misleading skill references in instructions
     2. routing conflicts that could cause the wrong skill to be chosen
     3. prompt or reference-file drift
     4. README, test, or validation-asset cleanup
     5. optional naming or organisational cleanup

## Output requirements

Produce the output using this structure:

## Grounded Inputs Used

- List the validation findings, attached skills, and visible files you relied on.

## Repair Plan

### Immediate Repairs

- ...

### File Updates

- ...

### Deferred Items

- ...

## Proposed Changes

### Instruction Repairs

- ...

### Routing Repairs

- ...

### Directory And Reference Repairs

- ...

## Guardrails

- Use only grounded attached skills and grounded attached files.
- Prefer updating existing files over creating overlapping new files.
- Treat missing assets as drift or future work, not hidden context.
- Do not invent validators, directories, or routing layers that are not visible.
- Keep repairs conservative and directly tied to the validated issues.
- Preserve working behaviour unless a grounded issue requires change.

## Best Next Step

- State the single best next repair action to apply first.
