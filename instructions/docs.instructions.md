---
file_type: "instructions"
title: "Documentation Instructions"
description: "Universal documentation standards for Markdown files in this repository unless overridden by more specific guidance."
scope: "repo-local"
applyTo: "**/*.md"
---

# Documentation Instructions

You are a documentation standards curator. Follow our documentation frameworks to structure, cross-reference, and validate Markdown content. Avoid project-specific architecture decisions or ambiguous links that break `/blob/HEAD/` conventions.

## Overview

Applies to all Markdown in this repository unless a more specific instruction file overrides it. Covers frontmatter, structure, clarity, accessibility, cross-references, and validation. Excludes project-specific architecture rules; refer to project instructions when provided.

## General Rules

- Use clear, direct, UK English in imperative form.
- Keep one H1 per file and maintain logical heading order.
- Always include complete frontmatter and `/blob/HEAD/` links for repo references.
- Prefer concise bullets over long paragraphs; avoid ambiguous wording.

## Detailed Guidance

### Scope & Cross-References

This file provides universal documentation standards for all Markdown files in the repository, except where more specific standards apply (see below).

- For README-specific standards, see [readme.instructions.md](./readme.instructions.md).
- For accessibility, see [a11y.instructions.md](./a11y.instructions.md).

All documentation must comply with the standards below and respect cross-linking conventions for every document created or updated. Every `.md` file in `docs/` and its subfolders must include YAML frontmatter, clear structure, accessibility, and cross-references as described. The `references` frontmatter property has been retired; cite supporting resources inline or via approved footers instead.

## Structure

All cross-references and file links must be universal. Avoid branch-specific links unless necessary for historical context. Use `/blob/HEAD/` for repo-local files.

---

### Universal Documentation Standards for `.md` Files

#### 1. Frontmatter

Every documentation file should start with YAML frontmatter including:

- `title`: Document title (required)
- `description`: Brief summary of the file’s purpose (required)
- `last_updated`: Date of last meaningful update (required)
- `owners`: Responsible maintainers or teams (required)

> The `references` field is retired; cite supporting resources inline or through approved footers instead.

## 2. Structure & Headings

- Use clear, hierarchical headings (`#`, `##`, `###`) for logical organization.
- Include a Table of Contents for files longer than ~100 lines.
- Start with an **Overview** or **Purpose** section.

## 3. Clarity & Language

- Use plain, concise language.
- Avoid jargon unless defined.
- Prefer UK English (per org standards).

## 4. Navigation & Cross-References

- Reference parent indexes and related docs (see `CHECKLIST_CROSSLINKING.md`).
- Ensure bidirectional and lateral links—no dead ends.
- All inline links must be respected and validated for every document.
- Use `/blob/HEAD/` for repo-local files and relative links for files within the same repo.

## 5. Formatting & Accessibility

- Follow [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) and a11y.instructions.md.
- Use lists, tables, and code blocks for clarity.
- Add alt text to images and diagrams.
- Ensure headings and lists are properly spaced for readability.
- Use badges for status, coverage, or compliance where relevant.
- Run markdownlint and Prettier for formatting compliance.

## 6. Diagrams & Visuals

- Use Mermaid diagrams for workflows, architecture, or processes.
- Include screenshots or illustrations where helpful.

## 7. Examples & Usage

- Provide code examples, sample commands, or usage scenarios.
- For configuration or scripts, show input/output and expected results.

## 8. Validation & Testing

- Document how to validate, test, or review the content (e.g., linting, schema checks).
- Validate all links after every edit (the `references` frontmatter field is retired).

## 9. Change Log & Versioning

- For critical or frequently updated docs, include a change log or version history.
- Update `last_updated` and `version` fields on changes.
- Document significant changes in commit messages and changelogs.

## 10. Contribution & Review

- State how to propose changes or report issues.
- Reference contributing guidelines.
- Schedule regular audits and integrate checks into CI/CD.

## 11. Compliance & Security

- For compliance/security docs, include audit status, responsible owner, and incident history.

## 12. Accessibility & Inclusion

- Ensure documentation is accessible to all users (screen reader compatibility, keyboard navigation, etc.).
- Use people-first, bias-aware language.

## 13. Footer

- Add a consistent footer with contact info and license; the `references` block is retired.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
