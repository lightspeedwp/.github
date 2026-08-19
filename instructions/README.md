---
file_type: "documentation"
title: "Portable Instructions & Standards"
description: "Ownership index for portable instruction files covering standards, best practices, and governance across LightSpeed projects."
version: "v0.3.2"
last_updated: "2026-08-19"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team"]
tags: ["instructions", "standards", "documentation", "governance"]
domain: "governance"
stability: "stable"
license: "GPL-3.0"
---

# Portable Instructions & Standards

This folder contains reusable instruction files, standards documents, and best-practice guides designed to be portable across all LightSpeed projects and repositories.

## Overview

Portable instructions define:

- **Coding Standards** – Language-specific and general code quality guidelines
- **Documentation Formats** – How to write and structure documentation
- **Community Standards** – Contribution and community guidelines
- **Quality Assurance** – Testing, linting, and validation standards
- **Automation Standards** – Automation governance and safe-by-default practices

All instruction files follow a consistent format: frontmatter + role declaration + structured guidance sections.

## Available Instructions

| File | Purpose |
|------|---------|
| [coding-standards.instructions.md](./coding-standards.instructions.md) | Language-specific and general coding standards |
| [languages.instructions.md](./languages.instructions.md) | Language-specific tooling and conventions |
| [documentation-formats.instructions.md](./documentation-formats.instructions.md) | Markdown, YAML, Mermaid, and documentation standards |
| [community-standards.instructions.md](./community-standards.instructions.md) | Contributing, conduct, and community guidelines |
| [a11y.instructions.md](./a11y.instructions.md) | WCAG 2.2 AA accessibility standards |
| [linting.instructions.md](./linting.instructions.md) | Linting standards and quality gates |
| [issues.instructions.md](./issues.instructions.md) | Issue creation, labeling, and triage standards |
| [pr-automation-review.instructions.md](./pr-automation-review.instructions.md) | PR creation, automation, review, and merge standards |

## Using Instructions

### In Claude Code

Reference instructions in your project's `.claude/settings.json`:

```json
{
  "instructions": {
    "coding": "lightspeedwp/.github/instructions/coding-standards.instructions.md",
    "documentation": "lightspeedwp/.github/instructions/documentation-formats.instructions.md",
    "community": "lightspeedwp/.github/instructions/community-standards.instructions.md"
  }
}
```

### In Project Files

Link instructions from project documentation:

```markdown
See [Coding Standards](../instructions/coding-standards.instructions.md) for code quality guidelines.

See [Documentation Format Guide](../instructions/documentation-formats.instructions.md) for how to structure docs.
```

### In Copilot Configuration

Reference in `.github/custom-instructions.md`:

```markdown
# Coding Standards

See [Portable Coding Standards](../instructions/coding-standards.instructions.md) for complete guidelines.

## Key Points

- Follow WordPress Coding Standards for PHP
- Use ESLint + Prettier for JavaScript
- Write meaningful commit messages
```

## Instruction Format

All portable instructions follow this structure:

```markdown
---
# YAML Frontmatter
title: "Instruction Title"
description: "What this instruction covers"
authors: ["Author Name"]
version: "v1.0"
last_updated: "2026-05-29"
domain: "governance"
---

# Role Declaration

> This instruction applies to: [target audience]

## Overview

[2-3 sentence overview]

## Key Principles

- Principle 1
- Principle 2

## Detailed Guidance

[Comprehensive guidance sections]

## Examples

[Real-world examples]

## Validation

[How to verify compliance]

## References

[Links to related documentation]
```

## Instruction Categories

### Quality & Standards

- **Coding Standards** – Code style, structure, and best practices
- **Documentation** – How to write and format docs
- **Quality Assurance** – Testing and validation standards
- **Accessibility** – WCAG 2.2 AA compliance

### Contribution & Community

- **Community Standards** – Code of conduct and community guidelines
- **Issues Standards** – How to create and manage issues
- **Pull Request Standards** – PR creation and review process

### Operations & Automation

- **Automation Standards** – Safe automation practices
- **Language Standards** – Language-specific tooling and conventions

## Creating New Instructions

To create a new instruction file:

1. Use the instruction format above
2. Define the scope and audience clearly
3. Include at least 3 real-world examples
4. Cover both happy paths and edge cases
5. Provide validation or self-check guidance
6. Add to this README's inventory
7. Submit PR for review

## Migrating Instructions

When moving instructions between locations:

1. Create migration issue documenting source and target paths
2. Update all references in the repository
3. Leave a redirect or archive note in the old location
4. Verify all links still work
5. Test with consumers of the instruction

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) – Repo-local project instructions
- [AGENTS.md](../AGENTS.md) – Global AI rules
- [.github/instructions/](../.github/instructions/) – Repo-specific instruction overrides
- [.github/custom-instructions.md](../.github/custom-instructions.md) – Copilot configuration

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines. Key points:

- Use UK English throughout
- Follow the instruction format strictly
- Include real examples
- Get peer review
- Update references when moving files

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
