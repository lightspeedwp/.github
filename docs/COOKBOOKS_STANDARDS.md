---
file_type: documentation
title: Cookbook Standards
description: Canonical flat recipe layout, durable examples, verification and accessibility guidance.
version: '2.0.0'
last_updated: '2026-11-27'
---

# Cookbook Standards

The cookbook holds durable recipes, playbooks and worked examples that are useful across projects but are not installable skills. The canonical layout is flat Markdown under `cookbook/`. Rules are marked **enforced** only where a named check rejects a violation. Sources were checked on 2026-11-27.

## Canonical layout

```text
cookbook/
├── README.md                        # Cookbook index
├── <recipe-id>.md                   # One reusable recipe or playbook
└── <topic>/
    └── README.md                    # Optional index for a larger recipe group
```

A recipe that must be discovered and invoked by an agent belongs in the [skill structure](./SKILLS_STANDARDS.md), not in the cookbook. A cookbook file can link to a skill or workflow without loading itself automatically.

## Rules and enforcement

| ID   | Rule                                                                                                                     | Source         | Checked    | Enforcement                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| C-01 | Store one recipe as `cookbook/<recipe-id>.md`; use a topic folder only for an index.                                     | [R-C]          | 2026-11-27 | **guidance** — `validate-structure.js` checks only the top-level folder and index.                              |
| C-02 | Use repository documentation frontmatter with `file_type: documentation`, title, description, version, date and owners.  | [R-F], [R-C]   | 2026-11-27 | **enforced** — local `validate-frontmatter.js`; no active CI job runs it.                                       |
| C-03 | Include Context, Prerequisites, Steps, Verification, Troubleshooting and References where relevant.                      | [R-D], [R-C]   | 2026-11-27 | **guidance** — no recipe-section validator exists.                                                              |
| C-04 | Test commands and examples before publishing; state the expected result and known limitations.                           | [R-D]          | 2026-11-27 | **guidance** — no executable-example gate.                                                                      |
| C-05 | Use placeholders for credentials, tokens and environment values; never copy real secrets.                                | [R-A], [R-D]   | 2026-11-27 | **guidance** — no cookbook-specific secret check.                                                               |
| C-06 | Give Mermaid diagrams a title, description and sufficient contrast; prefer a written explanation for essential meaning.  | [R-D], [R-M]   | 2026-11-27 | **enforced** — local Mermaid syntax/accessibility/contrast validators when run; no required PR job covers them. |
| C-07 | Do not claim that a cookbook file is automatically loaded by Claude Code or GitHub Copilot.                              | [CC-K], [GH-P] | 2026-11-27 | **guidance** — platform loading fact.                                                                           |
| C-08 | Use UK English and link to canonical standards rather than repeating their rules.                                        | [R-A], [R-D]   | 2026-11-27 | **guidance** — no dedicated language or duplication gate.                                                       |
| C-09 | Keep local links relative and verify them for the changed recipe.                                                        | [R-D], [R-L]   | 2026-11-27 | **guidance** — `validate-links.js` does not cover recipes; use a manual scoped check.                           |
| C-10 | Promote a repeated, invokable procedure into a skill through a separate change rather than making the cookbook a loader. | [CC-K], [R-C]  | 2026-11-27 | **guidance** — migration policy.                                                                                |

## Repository example

The real [WordPress Plugin Checklist](../cookbook/wordpress-plugin-checklist.md) is a flat cookbook recipe. The [Project Planning and PRD Playbook](../cookbook/project-planning-and-prd-playbook.md) is a longer flat playbook. The [cookbook index](../cookbook/README.md) owns the canonical layout.

## Validation procedure

```bash
node scripts/validation/validate-frontmatter.js --base origin/develop --head HEAD
node scripts/validation/validate-links.js
npm run validate:mermaid-syntax
npm run validate:mermaid-accessibility
npm run validate:mermaid-contrast
```

Use a scoped local-link check for changed recipes. The general repository link checker covers only `cookbook/README.md`, not every recipe.

## Known gaps

- No validator enforces recipe sections, executable examples, troubleshooting content or cookbook loadability.
- Mermaid validators are local/manual rather than required PR checks.
- Existing recipes are not reorganised into per-recipe folders by this documentation change.
- A cookbook recipe is documentation, not proof that an agent can invoke it.

## Related standards

- [Skill Standards](./SKILLS_STANDARDS.md)
- [Workflow Standards](./WORKFLOWS_STANDARDS.md)
- [Instruction Standards](./INSTRUCTIONS_STANDARDS.md)
- [Plugin Standards](./PLUGINS_STANDARDS.md)

[CC-K]: https://code.claude.com/docs/en/skills
[GH-P]: https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-files
[R-A]: ../AGENTS.md
[R-C]: ../cookbook/README.md
[R-D]: ../instructions/documentation-formats.instructions.md
[R-F]: ../.schemas/frontmatter.schema.json
[R-L]: ../scripts/validation/validate-links.js
[R-M]: https://mermaid.js.org/config/theming.html
