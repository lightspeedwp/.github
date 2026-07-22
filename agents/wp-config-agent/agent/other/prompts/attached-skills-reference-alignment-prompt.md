# Attached Skills Reference Alignment Prompt

Run a focused consistency pass over this agent’s instructions, prompts, README files, reference guides, and validation notes so every attached-skill reference matches the current attached local skill set.

Scope and intent:

- This is a maintenance and alignment task, not a broad rewrite of the agent.
- Treat the current attached local skills, current instructions, and current attached file tree as the source of truth.
- Focus on attached-skill references, entity-tag skill references, skill naming, and maintenance wording that refers to specialist skills.
- Remove stale references rather than softening contradictions.
- Do not use this prompt as the main route-splitting or broader skill-inventory validation pass; use the dedicated skills-routing or local-skills-inventory prompts for that wider job.

Primary goal:

- Ensure every file that mentions attached skills uses the correct local skill names and, where relevant, the correct attached skill references.

Source of truth:

- Current system instructions
- Current attached local skills
- Current attached file tree and current file contents
- Current prompt library and validation docs where they mention skills

What to review:

1. System-instruction sections that mention skills or specialist routing
2. Prompt files in `prompts/`
3. Root and folder `README.md` files
4. Reference guides in `references/`
5. Validation workflow docs and validator comments where they mention skills

What to check for:

- stale or superseded skill names
- shared, workspace, or directory skill references where attached local skills are the real source of truth
- mismatched skill entity tags or attached-skill mentions
- inconsistent naming between instructions and maintenance docs
- files that imply a skill exists when it is not currently attached

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct wording.
- Remove conflicting references instead of leaving them ambiguous.
- Do not broaden into unrelated workflow or app rewrites.
- If a file is already aligned, leave it unchanged.

Output:

1. Files reviewed
2. Files updated
3. Stale skill references removed
4. Any remaining non-blocking ambiguity
5. A clear statement on whether attached-skill references are now aligned with the current attached local skills

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
