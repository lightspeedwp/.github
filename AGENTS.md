# LightSpeed – Global AI Rules (AGENTS.md)

- Use UK English; optimise for clarity, scalability, maintainability and profitable outcomes.
- Prefer minimal, modular solutions; justify heavier tools with return on investment and maintenance cost.
- Follow WordPress Coding Standards (CSS, HTML, JavaScript, PHP) and inline‑documentation standards at all times.
- All code changes must include lint fixes, relevant tests and a short rationale summarising the change.
- Never output secrets. Treat production and customer data as sensitive. Follow the OWASP top 10 for web security.
- Accessibility and performance are non‑negotiable; highlight potential issues during reviews.
- Prefer `theme.json` and block components over bespoke code when feasible to avoid vendor lock‑in.
- When unsure, propose safe defaults and ask **one** focused question to clarify requirements.

## Agent Directory

- See [Main Agent Index](.github/agents/agent.md) for all agent implementations and specs.
- Each agent must have both a code file (`.js`, `.py`, etc.) and a spec (`.md`) following the template.
- All contributors must follow the org [Coding Standards](.github/instructions/coding-standards.instructions.md).

## Global Principles & Agent Rules

| Principle / Rule                   | Guidance / Details                                                                                  |
|------------------------------------|-----------------------------------------------------------------------------------------------------|
| **Language**                       | Use UK English; optimise for clarity, scalability, maintainability, and profitable outcomes.         |
| **Modularity**                     | Prefer minimal, modular solutions; justify heavier tools with ROI and maintenance cost.              |
| **Coding Standards**               | Follow [Coding Standards Instructions](.github/instructions/coding-standards.instructions.md) and [Linting Instructions](.github/instructions/linting.instructions.md) for all code (CSS, HTML, JS, PHP, etc.). |
| **Code Changes**                   | All code changes must include lint fixes, relevant tests, and a short rationale summarising the change.|
| **Security**                       | Never output secrets. Treat production and customer data as sensitive. Follow OWASP top 10.          |
| **Accessibility & Performance**    | Non-negotiable; highlight potential issues during reviews.                                           |
| **WordPress Block Usage**          | Prefer `theme.json` and block components over bespoke code to avoid vendor lock-in.                  |
| **Safe Defaults & Questions**      | When unsure, propose safe defaults and ask one focused question to clarify requirements.             |

---

## Contribution Guidelines & Indexes

| Area                      | File Reference                                                                               | Notes / Usage                           |
|---------------------------|----------------------------------------------------------------------------------------------|-----------------------------------------|
| **Coding Standards**      | [.github/instructions/coding-standards.instructions.md](.github/instructions/coding-standards.instructions.md)         | Unified standards for all code          |
| **Linting Standards**     | [.github/instructions/linting.instructions.md](.github/instructions/linting.instructions.md)                           | Main index for all linting rules        |
| **HTML Templates**        | [.github/instructions/html-template.instructions.md](.github/instructions/html-template.instructions.md)                | Markup standards                        |
| **Pattern Development**   | [.github/instructions/pattern-development.instructions.md](.github/instructions/pattern-development.instructions.md)     | Block patterns for WordPress            |
| **PHP Block Instructions**| [.github/instructions/php-block.instructions.md](.github/instructions/php-block.instructions.md)                       | PHP block usage                         |
| **Theme JSON**            | [.github/instructions/theme-json.instructions.md](.github/instructions/theme-json.instructions.md)                     | Theme configuration standards           |

**Other Key Indexes:**

- **Linting Index:** [.github/instructions/linting.instructions.md](.github/instructions/linting.instructions.md)
- **Coding Standards Index:** [.github/instructions/coding-standards.instructions.md](.github/instructions/coding-standards.instructions.md)

---

## PR Templates

- Use the default PR template: [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
- Additional PR templates are available in: [.github/PULL_REQUEST_TEMPLATES/](.github/PULL_REQUEST_TEMPLATES/)
  - Use the template most relevant to your change (e.g. feature, fix, documentation, etc.)

---

## Core Index Instructions

Start here for all key standards:

- [Coding Standards Index](.github/instructions/coding-standards.instructions.md): Unified standards, best practices, and documentation for all LightSpeed projects.
- [Linting Instructions Index](.github/instructions/linting.instructions.md): Primary index and guidance for all linting rules, tools, and file-type-specific standards.

---

## Cross-References & Discoverability

| Resource Name           | Reference                                                               | Purpose / Notes                                          |
|------------------------|-------------------------------------------------------------------------|---------------------------------------------------------|
| **Custom Instructions** | [.github/custom-instructions.md](.github/custom-instructions.md)        | Central Copilot/org instructions, prompts, and standards |
| **Main Agent Index**    | [.github/agents/agent.md](.github/agents/agent.md)                      | Directory of agent specs, stubs, usage, implementation   |
| **Chat Modes Index**    | [.github/chatmodes/chatmodes.md](.github/chatmodes/chatmodes.md)        | List and guidance for all chat modes                     |
| **Prompts Index**       | [.github/prompts/prompts.md](.github/prompts/prompts.md)                | Master prompt index and authoring conventions            |

---

## Instruction Indexes (Recommended Reference Pattern)

Reference main index files directly in your workflow or documentation:

- `@lightspeedwp/.github/files/.github/instructions/coding-standards.instructions.md`
- `@lightspeedwp/.github/files/.github/instructions/linting.instructions.md`
- For file-type or topic-specific instructions, see all files in `.github/instructions/`.

---

> For up-to-date standards, always reference the index instruction files above.
> See also: [.github/custom-instructions.md](.github/custom-instructions.md) for central org-wide Copilot and agent guidance.
