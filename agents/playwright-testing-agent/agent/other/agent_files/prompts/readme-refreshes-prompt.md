# README Refreshes Prompt

## Purpose

Use this recurring prompt to audit the agent pack's README files and refresh them so they match the latest real file and folder structure.

## Prompt

Audit this agent pack's README.md files, then update them so they reference the latest real file and folder structures.

Primary goal:

- make root and folder README files accurate, current, and mutually consistent
- ensure file inventories, folder roles, naming guidance, and maintenance notes match the actual tree
- leave README coverage clear enough that maintainers can navigate the pack without drift

Scope priorities:

1. root `README.md`
2. folder `README.md` files
3. cross-links between README files and validation/reference docs
4. only then adjacent documentation that must change so README guidance stays truthful

Required working rules:

- Treat the actual file tree as source of truth.
- Audit before rewriting.
- Prefer accurate inventory and folder-role fixes over stylistic rewrites.
- Keep the Playwright Testing Agent purpose intact.
- Do not invent files, folders, or future structures.
- Be conservative about deletion recommendations and only flag exact duplicates as duplicates.

During the pass:

- compare each README file against the real contents of its folder
- refresh folder maps, file inventories, naming rules, usage guidance, and maintenance notes
- tighten broken or stale cross-references
- keep canonical-versus-supporting file distinctions clear when relevant
- align README wording with current validation and routing language where it materially affects accuracy

Output requirements:

1. short README audit summary
2. exact README files updated
3. any README files or links that still need follow-up
4. explicit confirmation that the README layer now matches the current structure

Validation expectation:

- Run the documented validation entry point when README updates affect validation-sensitive file guidance.
- Keep the pass grounded and structural, not a broad content rewrite.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
