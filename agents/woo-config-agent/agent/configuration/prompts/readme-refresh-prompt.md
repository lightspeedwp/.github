# README Refresh Prompt

Use this recurring prompt when you want to refresh the attached README files so they accurately document the current folder structure, file inventories, and maintenance boundaries.

## Recommended prompt

```text
Refresh this WooCommerce Configuration Agent's README files so they accurately match the current attached file and folder structure, then implement the README updates directly.

Goals:
1. Keep the documentation practical and maintenance-friendly.
2. Use the current attached file tree as source of truth.
3. Keep the agent WooCommerce-first.
4. Avoid inventing folders, files, workflows, or assets that are not actually attached.

Scope:
1. Review the current attached maintenance folders and their README files.
2. Update each visible README so it clearly states:
   - the folder purpose
   - where the folder sits in the current maintenance structure
   - naming conventions for that folder
   - the grounded file inventory
   - any important canonical-role rules
3. Focus especially on README files in attached folders such as:
   - `references/README.md`
   - `schemas/README.md`
   - `scripts/README.md`
   - `tests/README.md`
   - `memory/README.md` when a local memory folder is actually attached
   - any other attached README files in the current file tree
4. Ensure README wording stays aligned with the current structure boundaries:
   - `references/` is the durable guidance layer
   - `schemas/` contains structured validation and output contracts
   - `scripts/` contains runnable validators and helpers
   - `tests/` contains QA, scenario, regression, and validation-support materials
   - local memory guidance only governs memory structure when it is actually attached
5. Remove stale references to missing folders or assumed repo structure.
6. Be conservative and precise.

Deliverables:
1. Audit summary
   - which README files were outdated
   - which folder or inventory descriptions needed correction
2. Implementation summary
   - exact README files updated
   - exact structure notes or inventories corrected
3. Validation result
   - whether the README layer now matches the current attached file tree
   - any remaining non-blocking documentation gap

Acceptance criteria:
- README inventories match the actual attached file tree.
- Folder-purpose wording is consistent across the README set.
- No README assumes unattached folders or files exist.
- The README layer remains useful for future maintenance work.
```

## Use notes

- Treat the current attached file tree as canonical.
- Prefer correcting stale inventories over expanding scope.
- Do not add new README files unless the folder is actually attached and a README is genuinely needed.
