---
file_type: "instructions"
title: "Instruction File Template"
description: "Generic instruction file skeleton and best practices for creating LightSpeedWP instruction files"
scope: "repo-local"
version: "v1.0"
last_updated: "2026-05-29"
owners: ["LightSpeed Team"]
tags: ["template", "instructions", "copilot", "guidance", "authoring"]
applyTo: ["instructions/*.instructions.md"]
status: "active"
---

# Instruction File Template

Use this template when creating new instruction files. Instruction files guide AI assistants and developers on LightSpeed standards and workflows.

## When to Create an Instruction File

Create an instruction file when you need to:

- Document repeatable guidance or standards
- Provide context-specific rules for AI assistants
- Establish governance or best practices
- Create organization-wide or repo-local standards

## Frontmatter Requirements

All instruction files must include:

```yaml
---
file_type: "instructions"
title: "Descriptive Title"
description: "One-sentence summary"
scope: "organization-wide" or "repo-local"
version: "v1.0"
last_updated: "YYYY-MM-DD"
owners: ["Team Name"]
tags: ["keyword1", "keyword2"]
applyTo: ["path/pattern/**"]
status: "active" or "draft"
---
```

## File Structure

1. **Title** (H1) — Same as frontmatter title
2. **Introductory sentence** — What this file teaches
3. **Overview** — High-level context and scope
4. **General Rules** — Foundational principles
5. **Detailed Guidance** — Section-by-section instructions
6. **Examples** — Realistic examples
7. **Related Files** — Cross-links to other instruction files
8. **Changelog** (Optional) — Version history for major files

## Writing Guidelines

- Use UK English spelling (organisation, optimise, colour)
- Write in active voice
- Keep sentences concise
- Use bullet points for lists
- Include examples and counter-examples
- Link to related files and standards
- Avoid assumptions about reader knowledge

## Scope Classification

- **organization-wide**: Applicable to all LightSpeedWP projects; portable across repos
- **repo-local**: Specific to this `.github` control plane or single repository

---

## Related Files

- [instructions.instructions.md](./instructions.instructions.md) — Detailed authoring guidance
- [documentation-formats.instructions.md](./documentation-formats.instructions.md) — Markdown and frontmatter standards
- [coding-standards.instructions.md](./coding-standards.instructions.md) — Code examples and conventions

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
