# README Recurring Cleanup Prompt

Audit the current agent file tree and update attached `README.md` files so they accurately reflect the latest file and folder structure.

Scope and intent:

- This is a recurring maintenance and consistency task, not a broad rewrite of the agent.
- Treat the current attached file tree and current file contents as the source of truth.
- Preserve the current routing and validation slice unless a README or directly related maintenance note is now inconsistent with it.
- Nothing in the already-updated routing and validation slice is blocking; keep it that way.

Primary goal:

- Keep folder-level documentation accurate, practical, and easy to maintain as the file structure evolves.

Source of truth:

- Current attached agent file tree
- Current contents of all attached files under review
- Current system instructions only where they materially clarify folder roles or validation responsibilities
- Current attached local skills, apps, and reporting rules only where a README or maintenance note refers to them directly

Required review scope:

1. Review every attached `README.md` file, including root-level and folder-level READMEs if present.
2. For each README, verify that it correctly describes:
   - the folder’s current purpose
   - the files currently inside it
   - any relevant subfolders, if present
   - how that folder relates to the rest of the current file structure
3. Remove references to files, folders, workflows, or paths that no longer exist.
4. Add references to files or folders that now exist but are missing from the README.
5. If a maintained folder exists without a `README.md` and the documentation gap is obvious, create a concise folder README that matches the current structure.

Editing rules:

- Make the smallest complete set of edits needed.
- Rewrite a README cleanly when its current wording is contradictory, stale, or structurally misleading.
- Do not invent files, folders, responsibilities, or workflows that are not grounded in the current file tree and file contents.
- Preserve still-correct guidance that does not conflict with the current structure.
- If two files have different roles, do not collapse them as duplicates.
- If a README is already accurate, leave it unchanged.
- Keep wording practical, concise, and maintenance-friendly.

Optional broader pass:

- If you notice nearby maintenance notes, fixtures, profiles, examples, templates, schemas, scripts, or prompt files that directly describe the same file structure or validation responsibilities, you may tighten them too.
- Only do this when the cleanup is clearly adjacent to the README work and helps keep the validation layer aligned with the current routing language.
- Do not reopen settled routing decisions or broaden into unrelated app, Memory, business-domain, or workflow rewrites.

Consistency checks:

- Folder inventories should match the current attached file tree.
- Folder-purpose wording should match actual current usage.
- Cross-folder relationship notes should match the current structure.
- Validation-layer wording should still align with the current routing language and specialist-skill split where directly referenced.
- Shared, workspace, directory, or superseded skill references should not remain in maintenance documentation if the current attached local skills are the source of truth.

Output:

1. README files reviewed
2. README files updated
3. Any new README files created
4. Exact revised content for each updated or newly created README
5. Any nearby maintenance or validation notes also updated
6. Any remaining structural ambiguities or missing documentation still worth addressing

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
