# Reference Guides Consistency Prompt

Run a consistency pass across the reference guides in `references/` so their scope, terminology, and maintenance guidance stay aligned with the current agent instructions, apps, skills, and validation layer.

Scope and intent:

- This is a reference-guides consistency task, not a rewrite of the main instruction system.
- Treat the current attached files, current instructions, current attached apps, and current attached skills as the source of truth.
- Focus on standing guidance in `references/`, especially where it affects routing, reporting, validation, or app usage.

Primary goal:

- Ensure the `references/` folder remains a stable, accurate source of standing guidance without stale assumptions or conflicting maintenance wording.

What to review:

1. `references/README.md`
2. `references/CONNECTORS.md`
3. `references/audit-docs-validation-workflow.md`
4. Any other reference guides in `references/`

What to check for:

- stale app, file, validator, or skill references
- maintenance guidance that no longer matches the current file tree
- reporting or validation wording that conflicts with the current instructions
- cross-reference drift between the guides inside `references/`
- guidance that should be narrowed because the current attached setup is more specific

Editing rules:

- Make the smallest complete set of edits needed.
- Preserve still-correct standing guidance.
- Remove soft contradictions instead of leaving conflicting wording behind.
- Do not broaden scope into unrelated business-domain or workflow rewrites.

Output:

1. Reference guides reviewed
2. Reference guides updated
3. Any stale references removed
4. Any remaining non-blocking ambiguity in the standing guidance layer

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
