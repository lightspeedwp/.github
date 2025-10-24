---
description: 'Tagging and frontmatter conventions for Copilot assets (instructions, prompts, chat modes, collections)'
applyTo: '**/*.md'
license: 'GPL-3.0'
---

# Tagging & Frontmatter Conventions

These conventions standardise metadata across instructions (`*.instructions.md`), prompts (`*.prompt.md`), chat modes (`*.chatmode.md`), and collection manifests (`*.collection.yml`). They enable automated catalog generation, filtering, deprecation handling, and future taxonomy-driven tooling. Code and docs were produced with accessibility in mind but should still be manually reviewed.

## Required Frontmatter Fields

| Field          | Type                                                                                                  | Applies To          | Purpose                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------- |
| `description`  | string                                                                                                | all asset markdown  | Human-readable summary (single sentence preferred)                  |
| `mode`         | enum(`agent`,`ask`)                                                                                   | prompts, chat modes | Execution style (contextual agent vs single-turn ask)               |
| `applyTo`      | glob string                                                                                           | instructions        | Scope selectors for auto-application                                |
| `deprecated`   | boolean                                                                                               | all                 | Signals exclusion from generated tables (generator skips when true) |
| `replacement`  | string (path)                                                                                         | deprecated assets   | Points to canonical successor file                                  |
| `stability`    | enum(`stable`,`experimental`,`incubating`)                                                            | all                 | Communicates maturity expectation                                   |
| `tags`         | array[string]                                                                                         | all                 | Taxonomy for discovery/filtering                                    |
| `domain`       | enum(`wp-core`,`block-theme`,`plugin-hardening`,`perf`,`a11y`,`i18n`,`security`,`headless`,`generic`) | all                 | Primary classification (choose one)                                 |
| `extraDomains` | array[string]                                                                                         | optional            | Secondary classifications if needed                                 |

## Tag Taxonomy

Base domain tags (choose one for `domain`):

`wp-core`, `block-theme`, `plugin-hardening`, `perf`, `a11y`, `i18n`, `security`, `headless`, `generic`.

Supplemental tags (examples): `testing`, `lint`, `ci`, `ux`, `editor`, `api`, `rest`, `graphql`, `data`, `design-tokens`, `theme-json`, `docs`, `automation`.

Rules:

1. Limit total `tags` to <= 8 for signal clarity.
2. Use lowercase kebab-case. No spaces, no uppercase.
3. Avoid duplicating the chosen `domain` inside `tags` (it is implicit).
4. Prefer existing tags; introduce new ones only with clear cross-asset reuse potential.

## Deprecation Workflow

1. Mark legacy file with `deprecated: true` and add `replacement: 'relative/path/to/new-file.ext'`.
2. Keep content minimal: brief rationale + migration pointer.
3. Generator excludes deprecated assets from tables automatically (implemented in `update-readme.js`).
4. After one release cycle (or zero inbound references in link audit), remove the deprecated file.

## Stability Lifecycle

| Stability      | Intent                         | Change Expectations                       |
| -------------- | ------------------------------ | ----------------------------------------- |
| `experimental` | Early exploration              | Breaking changes likely                   |
| `incubating`   | Maturing, seeking feedback     | Minor structural tweaks possible          |
| `stable`       | Adopted, versioned conventions | Backward compatibility strongly preferred |

## Prompt / Chat Mode Specific

Prompts & chat modes MUST include `mode:` and SHOULD include `model:` plus any supported `tools:` list when specialised.

Example:

```markdown
---
description: 'Generate performance remediation checklist for a WordPress site'
mode: ask
model: gpt-4o
tags: [perf, audit, wp-core]
domain: perf
stability: stable
---
```

## Instruction File Example

```markdown
---
description: 'Secure coding guardrails for custom WP REST endpoints'
applyTo: 'includes/api/**/*.php'
tags: [security, rest, plugin-hardening]
domain: security
stability: incubating
---
```

## Collection Manifest Additions (`.collection.yml`)

Collections already use `tags:`. Add optional `stability:` and `domain:` keys aligned with above. Validation tooling may be extended to enforce.

## Validation & Automation

Planned enhancements:

1. Extend `validate-collections.js` to warn on unknown tags or missing `domain`.
2. Extend `update-readme.js` to surface domain and stability columns (future iteration).
3. Add CI step to reject assets missing required fields.

## Authoring Checklist

-   [ ] Includes required frontmatter fields
-   [ ] Chooses exactly one `domain`
-   [ ] Uses <= 8 meaningful tags
-   [ ] Description concise (<= 120 chars)
-   [ ] Stability reflects readiness
-   [ ] No deprecated file references (unless itself deprecated)

---

Produced with accessibility and inclusivity in mind; please manually test (e.g., using Accessibility Insights) to validate.
