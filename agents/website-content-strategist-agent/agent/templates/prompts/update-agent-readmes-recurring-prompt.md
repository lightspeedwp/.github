# Recurring prompt: update agent README files

Use this prompt whenever the agent's file tree changes and the README files may need to be refreshed.

## Prompt

Audit all attached `README.md` files in the current draft and update them so they reference the latest grounded file and folder structures only.

Requirements:

- Treat the current grounded draft and attached file tree as the source of truth.
- Review every attached `README.md` file before editing.
- Keep each README focused on its folder's actual purpose, naming rules, and current file outline.
- Remove references to files or folders that are not currently attached.
- Add references for newly attached files or folders when they belong in that README's canonical outline.
- Do not invent missing files, folders, validators, tests, examples, defaults, or supporting assets.
- Prefer updating an existing README over creating overlapping inventory files.
- If a folder has no README yet but clearly needs one, flag that as a recommendation instead of inventing extra structure unless explicitly asked to create it.

Output expectations:

- Start with a short audit summary.
- List which README files were confirmed as accurate, which were updated, and which still have unresolved gaps.
- If changes are needed, update the README files directly in the current draft.
- Keep all wording in UK English.

Validation rules:

- Only reference grounded attached files.
- Keep folder names, file names, and purposes aligned with the visible file tree.
- If the file list is incomplete or truncated, say what could not be fully verified.
- Prefer a smaller accurate inventory over a larger speculative one.
