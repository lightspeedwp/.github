---
file_type: "instructions"
title: "README Instructions"
description: "Standards for creating and maintaining README files, including required sections, structure, and accessibility expectations"
scope: "repo-local"
version: "v1.0"
last_updated: "2026-05-29"
owners: ["LightSpeed Team"]
tags: ["readme", "documentation", "structure", "onboarding", "a11y"]
applyTo: ["**/README.md", "README.md"]
status: "active"
---

# README Instructions

README files are the front door to a repository. Create clear, accessible, and comprehensive README files that support onboarding and discoverability.

## README Structure (Standard Order)

1. **Title & Description** — What is this repository?
2. **Table of Contents** — Navigation for longer READMEs
3. **Installation/Setup** — How to get started
4. **Usage** — How to use this project
5. **Configuration** — Config options and environment variables
6. **Development** — How to contribute or develop locally
7. **Testing** — How to run tests
8. **Troubleshooting** — Common issues and solutions
9. **Contributing** — Link to CONTRIBUTING.md
10. **License** — License information
11. **Related** — Links to related resources

## Required Sections

Every README must include:

- **Description** — What the project does in 1-2 sentences
- **Quick Start** — Minimal steps to get it running
- **Installation** — Full setup instructions
- **Related Files** — Links to key documentation

## Writing Guidelines

- Use clear, simple language
- Write for the first-time user, not experts
- Include code examples where helpful
- Use headings consistently (ATX style: `#`, `##`, `###`)
- Keep paragraphs short (3-4 sentences max)
- Link to detailed docs for in-depth topics

## Accessibility Requirements

- Use descriptive heading hierarchy (no skipped levels)
- Alt text for all images
- Sufficient color contrast in code examples
- Avoid color-only information emphasis
- Proper list formatting

## Diagrams and Visuals

Use Mermaid diagrams for architecture and workflows:

- Keep diagrams simple and focused
- Test rendering in GitHub markdown
- Provide text alternatives for complex diagrams

---

## Related Files

- [documentation-formats.instructions.md](./documentation-formats.instructions.md) — Markdown and frontmatter standards
- [community-standards.instructions.md](./community-standards.instructions.md) — Naming and file placement conventions

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
