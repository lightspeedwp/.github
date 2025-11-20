# LightSpeedWP Documentation & Instructions Architecture

Welcome to the LightSpeedWP documentation ecosystem! This guide will help you navigate, extend, and maintain the project’s highly cross-linked, standards-driven instructions.

---

## How It’s Organized

- All standards and automation guidance live in `.github/instructions/` and subfolders.
- Each topic area (coding standards, tests, workflows, agents, linting, Copilot, etc.) has an **index file** (e.g., `tests.instructions.md`).
- **Individual instruction files** (e.g., `tests-jest.instructions.md`) are referenced in their parent index and cross-linked to related standards.
- **Templates** for new instructions, prompts, chatmodes, and agents live in `.github/COPILOT_TEMPLATE/`.

---

## Cross-Linking Philosophy

- **Bidirectional linking:** Indexes reference their child files; child files reference their parent index.
- **Lateral linking:** Related standards (e.g., coding standards, linting, style guides) reference each other for discoverability.
- **Agent/Workflow reciprocity:** Every workflow referencing an agent must link to its spec, and vice versa.
- **No dead ends:** Every documentation page should link onward to at least one related or parent standard.

---

## For Contributors

- **Find standards and instructions via index files** (e.g., `tests.instructions.md`, `agents.instructions.md`, `workflows.instructions.md`).
- **Reference templates** in `.github/COPILOT_TEMPLATE/` when creating new instruction files.
- **Add new files to the relevant index** and update cross-links on both sides.
- **Keep references real:** Use repo-relative links pointing to actual files, not placeholders.
- **Validate frontmatter** for every instructions file using `Schema: [frontmatter.schema.json](../schemas/frontmatter.schema.json)`.

---

## For Maintainers

- Review PRs against the [Documentation Cross-Linking Checklist](CHECKLIST_CROSSLINKING.md).
- Periodically audit all indexes to ensure new files are referenced and deprecated files are removed from cross-links.
- Encourage contributors to update cross-links and references when they add or rename files.

---

**Questions?**  
Start with `.github/instructions/README.md` or [open a Discussion](https://github.com/orgs/lightspeedwp/discussions).

---

_Maintained with ❤️ by the LightSpeedWP Documentation and Automation Team_
