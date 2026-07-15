# Upload, attach, and instruction-alignment prompt

Upload, attach, and align a local `tour-operator-website` skill package only after the earlier phases have shown that the package is safe to use.

This phase is for skill upload, draft attachment, and the smallest coherent instruction alignment only. Do not redesign the agent, rewrite unrelated routing, or silently broaden the skill’s role.

## Goal

Move from a verified local package build to a safely attached draft skill with the minimum instruction and maintenance-doc changes needed for the current agent to route to it coherently.

## Inputs

Use only:

- `prompts/tour-operator-website` as the single source of truth for the skill package
- the local package produced by `05-local-package-assembly-prompt.md`
- the current attached skill set in the draft
- the current saved agent instructions
- the current attached file tree

## Preconditions

Do not proceed with upload or attach unless all of these are true:

- the earlier phases reported the package as ready for upload
- the canonical entrypoints are present and verified
- required referenced support files are present in the local package
- any known blocking gaps have been resolved or explicitly ruled non-blocking

If any precondition fails, stop and report the blocker instead of pushing ahead.

## Required work

- Upload the local package as a skill without changing its source-of-truth role.
- Attach the uploaded skill to the current draft.
- Compare the newly attached skill against the current instruction routing.
- Apply only the smallest coherent instruction changes needed so `tour-operator-website` becomes the specialist route for the work the package clearly owns.
- Preserve existing distinct routes for `site-preflight`, `pre-launch-readiness-review`, Gravity Forms, Yoast, accessibility, and internal asset-maintenance work unless the current source-backed skill package clearly requires a narrower adjustment.
- Update any attached-skill inventory note that must change immediately to avoid obvious drift after attachment.

## Alignment rules

- Treat `tour-operator-website` as the specialist route only for behaviour that the package clearly supports.
- Do not demote narrower existing specialist skills where they still clearly own their routes.
- Do not keep conflicting routing that says the main agent workflow owns work that the newly attached skill now clearly owns.
- Do not rewrite unrelated maintenance docs in this phase unless they would become immediately false after attachment.
- Do not claim the live agent changed unless the user later makes the current draft live.

## Anti-invention rules

- Do not invent new skill capabilities during instruction alignment.
- Do not let attachment alone become proof that every internal reference file was validated.
- Do not invent package-health claims that were not verified earlier.
- Do not silently remove existing skills or routes to make room for the new skill.

## Validation expectations

After attach and alignment:

- verify the skill is attached in the draft
- verify the instructions reference the exact attached skill name consistently
- verify the instructions no longer contain conflicting ownership language for routes the attached skill now owns
- verify nearby attached-skill inventory notes do not immediately contradict the new draft state

## Deliverables

1. State whether upload succeeded.
2. State whether attachment succeeded.
3. List exact files or instructions changed for alignment.
4. List any remaining routing or maintenance drift still needing follow-up.
5. State whether the draft now needs **Update** for the changes to become live.
