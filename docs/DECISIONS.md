---
_Note: This file follows LightSpeedWP governance, frontmatter, naming, and versioning conventions as described in [docs/VERSIONING.md](VERSIONING.md) and [.github/FRONTMATTER-SCHEMA.md](../.github/FRONTMATTER-SCHEMA.md)._
---

# Architectural Decisions

This document tracks key architectural and technical decisions made in LightSpeed projects. Each decision includes a short summary, rationale, and a link to a detailed ADR (Architecture Decision Record) in `docs/ADR/` where available.

Use this record to understand "why" major choices were made, avoid redundant debates, and onboard new contributors quickly.  
For new decisions, add a summary here and create a corresponding ADR file with full context.

---

## Table of Contents

- [Purpose](#purpose)
- [How to Use This File](#how-to-use-this-file)
- [Decision Format](#decision-format)
- [Current Decisions](#current-decisions)
- [How to Add a New Decision](#how-to-add-a-new-decision)
- [References](#references)

---

## Purpose

- Document architectural and workflow decisions for transparency and historical record.
- Provide context for contributors, reviewers, and stakeholders.
- Link to detailed ADRs for deep technical rationale and alternatives considered.
- Align with org-wide standards, but record justified deviations or project-specific choices.

---

## How to Use This File

- **When starting a new initiative or making a significant change**, check this file for prior decisions.
- **When reviewing PRs or troubleshooting**, reference this file to understand context.
- **When onboarding**, use this file to help new team members ramp up on “why” things work as they do.
- **When proposing a major technical or process change**, summarize the decision here and create/extend the relevant ADR.

---

## Decision Format

Each entry should include:

- **Decision N:** Clear one-line summary ([ADR-00N](ADR/ADR-00N-topic.md))
    - **Status:** Proposed | Accepted | Deprecated | Superseded
    - **Date:** YYYY-MM-DD
    - **Context:** Brief summary of why this decision was made, what alternatives were considered, and what it impacts.
    - **Consequences:** What this changes, who is affected, migration steps if any.

Example:
```markdown
- **Decision 6:** Switch CSS linter from stylelint to custom WordPress-tailored stylelint config ([ADR-006](ADR/ADR-006-stylelint.md))
    - **Status:** Accepted
    - **Date:** 2025-10-20
    - **Context:** Needed stricter enforcement of WordPress CSS naming and specificity rules; considered using Prettier only.
    - **Consequences:** All contributors must update their local configs. CI scripts updated, docs revised.
```

---

## Current Decisions

- **Decision 1:** Adopted native WordPress block patterns for all new theme development ([ADR-001](ADR/ADR-001-block-patterns.md))
    - **Status:** Accepted
    - **Date:** 2025-10-12
    - **Context:** Aligns with WordPress core, improves maintainability, reduces custom code.
    - **Consequences:** All new themes must use block patterns; legacy support documented in ADR.

- **Decision 2:** Standardized on PHP 8.2 for all CI and production environments ([ADR-002](ADR/ADR-002-php-version.md))
    - **Status:** Accepted
    - **Date:** 2025-10-13
    - **Context:** Needed features and performance from PHP 8.2. Dropped support for older versions.
    - **Consequences:** CI updated, composer.json set to >=8.2, migration steps in ADR.

- **Decision 3:** Use Playwright for E2E and accessibility testing ([ADR-003](ADR/ADR-003-playwright-testing.md))
    - **Status:** Accepted
    - **Date:** 2025-10-14
    - **Context:** Playwright supports multi-browser E2E and a11y checks. Considered Cypress, Selenium.
    - **Consequences:** New E2E tests in Playwright, contributors must install Playwright, CI setup described in ADR.

- **Decision 4:** All custom post types registered via `theme.json` wherever possible ([ADR-004](ADR/ADR-004-cpt-in-theme-json.md))
    - **Status:** Accepted
    - **Date:** 2025-10-15
    - **Context:** Unifies CPTs across themes and plugins, simplifies migrations.
    - **Consequences:** CPT registration functions deprecated, docs and onboarding updated.

- **Decision 5:** All client-facing code must pass Lighthouse a11y checks in CI ([ADR-005](ADR/ADR-005-accessibility-audit.md))
    - **Status:** Accepted
    - **Date:** 2025-10-16
    - **Context:** Accessibility is a core requirement; automating checks avoids regressions.
    - **Consequences:** PRs failing a11y in Lighthouse cannot be merged; CI config in ADR.

---

## How to Add a New Decision

1. **Summarize** the decision in this file, following the format above.
2. **Create a detailed ADR** in `docs/ADR/ADR-00N-topic.md`:
    - Include: context, options considered, rationale, impacts, migration steps.
3. **Link** the ADR from this file.
4. **Update status** if the decision is later superseded, deprecated, or revised.

---

## References

- [Coding Standards](../.github/instructions/coding-standards.instructions.md)
- [Pattern Development](../.github/instructions/pattern-development.instructions.md)
- [Theme JSON](../.github/instructions/theme-json.instructions.md)
- [Playwright Testing](../.github/instructions/playwright-tests.instructions.md)
- [Org Governance](../GOVERNANCE.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Architecture Decision Records (ADR Pattern)](https://adr.github.io/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

---

*For questions about a decision, open a discussion or propose a revision via pull request.*