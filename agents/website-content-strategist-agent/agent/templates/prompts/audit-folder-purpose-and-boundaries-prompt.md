# Audit Folder Purpose And Boundaries Prompt

Use this prompt to check whether the visible folders still have clear, non-overlapping purposes and whether files appear to live in the right place.

## Prompt

Audit the purpose boundaries of this agent's grounded folders.

Your job is to review whether the visible folders have clear roles, whether those roles overlap confusingly, and whether the current file placement appears consistent with those roles.

Focus on the following:

1. Review visible folders such as prompts, references, scripts, tests, schemas, templates, examples, and memory.
2. Identify where folder purposes are clearly defined and where they overlap or blur together.
3. Flag files whose placement appears inconsistent with the folder's stated role.
4. Check whether README and reference guidance about folder roles matches the visible file layout.
5. Keep the review conservative and grounded in the visible file tree only.

## Output requirements

Use this structure:

## Grounded Folders Reviewed

- ...

## Clear Folder Roles

- ...

## Boundary Issues

### Overlapping Folder Purposes

- ...

### File Placement Concerns

- ...

### Guidance Drift

- ...

## Recommended Fixes

### Immediate

- ...

### Structural

- ...

### Optional Cleanup

- ...

## Best Next Step

- State the single best folder-boundary fix to apply first.

## Guardrails

- Use only grounded visible folders and files.
- Do not invent missing folders or files.
- Prefer minimal organisational change unless the overlap is clearly harmful.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
