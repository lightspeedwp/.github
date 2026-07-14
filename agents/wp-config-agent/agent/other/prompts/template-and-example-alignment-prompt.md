# Template and Example Alignment Prompt

Review the current `templates/` and `examples/` layers together so reusable output structures, worked examples, and any related schema references remain aligned.

Scope and intent:
- This is a template/example alignment task, not a rewrite of the output model.
- Treat the current templates, examples, schemas, and folder READMEs as the source of truth.
- Focus on structural alignment, paired coverage, inventory accuracy, and maintenance clarity.

Primary goal:
- Ensure reusable templates and worked examples still fit together cleanly and that their surrounding docs describe them accurately.

What to review:
1. `templates/README.md`
2. `examples/README.md`
3. Files in `templates/`
4. Files in `examples/`
5. Related schema assets in `schemas/` where relevant

What to check for:
- examples that no longer match their paired templates
- template or example inventories that drift from the file tree
- missing or stale cross-references to relevant schemas
- folder wording that blurs reusable structures with worked samples
- maintenance notes that no longer match the current file set

Editing rules:
- Make the smallest complete set of edits needed.
- Preserve still-correct output structures and worked examples.
- Do not invent new template/example pairs unless grounded by the current file tree.

Output:
1. Templates and examples reviewed
2. Files updated
3. Any alignment gaps found between templates, examples, and schemas
4. Any remaining non-blocking drift in the output layer
