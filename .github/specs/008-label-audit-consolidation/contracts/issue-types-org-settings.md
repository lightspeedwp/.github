# Issue Types: Names, Descriptions and Colours

The single list used to update `.github/issue-types.yml`, the `type:*` labels in `.github/labels.yml`, and the organisation's native issue types (spec FR-019, FR-020; tasks T040b and T040c).

Colours come from [`docs/LABEL_COLOR_STRATEGY.md`](../../../../docs/LABEL_COLOR_STRATEGY.md). GitHub's native issue types accept only eight named colours (gray, blue, green, yellow, orange, red, pink, purple), so each hex colour also has a **native colour**: the strategy family's name, with Teal (which has no native equivalent) mapped to green.

**Rule source** says whether the strategy doc names the type explicitly (**explicit**) or the colour was taken from the closest family because the doc has no rule for it (**inferred**).

## The 25 issue types

| # | Issue type | Label | Hex | Family | Native colour | Rule source | Org action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Task | `type:task` | `0969DA` | Blue | blue | inferred (planned work) | Keep |
| 2 | Bug | `type:bug` | `B91C1C` | Red | red | explicit (bug labels) | Keep |
| 3 | Feature | `type:feature` | `2A7A3B` | Green | green | explicit (feature/enhancement) | Keep |
| 4 | Design | `type:design` | `8957E5` | Purple | purple | explicit | Keep |
| 5 | Epic | `type:epic` | `3467D3` | Blue | blue | inferred (planning) | Keep |
| 6 | Decision | `type:decision` | `3467D3` | Blue | blue | explicit (discussion/question) | **Add** |
| 7 | Improvement | `type:improve` | `2A7A3B` | Green | green | explicit (enhancement) | Keep |
| 8 | Chore | `type:chore` | `57606A` | Gray | gray | explicit | Keep |
| 9 | CI | `type:ci` | `C5DEF5` | Blue | blue | explicit (CI is Blue family) | **Rename** from "Build & CI" |
| 10 | Automation | `type:automation` | `D0D7DE` | Gray | gray | explicit (automation supporting) | Keep |
| 11 | Test Coverage | `type:test` | `D29922` | Yellow | yellow | explicit (testing) | Keep |
| 12 | Performance | `type:performance` | `F2D06D` | Yellow | yellow | explicit | Keep |
| 13 | Accessibility | `type:a11y` | `8957E5` | Purple | purple | explicit | **Rename** from "A11y" |
| 14 | Security | `type:security` | `CF222E` | Red | red | explicit | Keep |
| 15 | Compatibility | `type:compat` | `0D7F6F` | Teal | green | inferred (platform/vendor) | Keep |
| 16 | Refactor | `type:refactor` | `B1BAC4` | Gray | gray | inferred (internal/process) | **Rename** from "Code Refactor" |
| 17 | Release | `type:release` | `1A7F37` | Green | green | inferred (completion) | Keep |
| 18 | Dependency Update | `type:dependency` | `007580` | Teal | green | explicit | **Add** |
| 19 | Documentation | `type:docs` | `3467D3` | Blue | blue | explicit | Keep |
| 20 | Research | `type:research` | `C5DEF5` | Blue | blue | inferred (planning/discussion) | Keep |
| 21 | Audit | `type:audit` | `D29922` | Yellow | yellow | explicit | Keep |
| 22 | Review | `type:review` | `0969DA` | Blue | blue | explicit (code review) | **Rename** from "Code Review" |
| 23 | AI Ops | `type:aiops` | `B1BAC4` | Gray | gray | inferred (automation/meta) | Keep |
| 24 | Content Modelling | `type:content-modelling` | `B4A7E8` | Purple | purple | inferred (design-adjacent) | Keep |
| 25 | Build | `type:build` | `C5DEF5` | Blue | blue | inferred (paired with CI) | **Add** |

## Descriptions (for the organisation settings page and `issue-types.yml`)

Existing organisation descriptions are kept where the type already exists, with Accessibility updated to WCAG 2.2 AA (constitution Principle VI) and the split of "Build & CI" into CI and Build.

| Issue type | Description |
| --- | --- |
| Task | Small, well‑scoped unit of work (e.g., configure theme.json tokens, tweak template parts, set up redirects, write a snippet). Executable without major design/discovery and typically completed within a day or two. |
| Bug | Broken or incorrect behaviour: PHP errors/notices, block render issues, styling regressions, JS console errors, REST problems, Woo checkout breakage. Provide steps to reproduce, expected/actual results, and environment. |
| Feature | Net‑new value: new block, pattern library, settings screen, CPT integration, gateway, or content model. Shippable outcome with clear AC, user impact, and non‑functional criteria (a11y, performance, security). |
| Design | Design artefacts/decisions: UX flows, wireframes, hi‑fi Figma, block/pattern specs, theme.json tokens, component states, microcopy, a11y checks, and handoff notes for dev. |
| Epic | Parent issue grouping stories/tasks across repos to achieve a larger outcome. Defines scope, success metrics, and timebox. Tracks progress via child issues converted from task lists. |
| Decision | Record a decision: context, options considered, the outcome and who decided, and its consequences. Links the follow-up work; decisions that change files go through a docs/ branch. |
| Improvement | Improve existing behaviour: UX polish, editor controls, copy tone, schema updates, minor UI/logic tweaks—no net‑new feature but noticeable quality uplift. |
| Chore | Small housekeeping tasks: label hygiene, repo/settings tweaks, file moves, minor non‑functional clean‑ups that don't fit refactor/maintenance buckets. |
| CI | CI pipelines and checks: GitHub Actions workflows, required checks, linting and test gates, CI reliability and speed. |
| Automation | Workflow automation: Actions/bots for labelling, changelog generation, preview builds, backports, scheduled chores—reduce toil and tighten feedback loops. |
| Test Coverage | Add/expand tests: PHPUnit, Playwright/E2E, visual regression, or manual QA plans for key templates/blocks—raise confidence and prevent regressions. |
| Performance | Improve speed/efficiency: asset budgets, code splitting, images, query tuning, caching, block render performance, Core Web Vitals (LCP/INP/CLS) targets with before/after metrics. |
| Accessibility | Accessibility to WCAG 2.2 AA: semantics, keyboard nav, focus management, ARIA, contrast, visible labels in editor/front‑end; include assistive technology notes. |
| Security | Hardening & fixes: sanitisation/escaping, nonces, capability checks, CSRF/XSS, secure uploads, dependency vulnerabilities; include threat model notes where relevant. |
| Compatibility | Version/ecosystem support: WordPress core, PHP min/tested‑up‑to, Gutenberg packages, WooCommerce, Multisite, RTL; ensure parity across the support matrix. |
| Refactor | Internal restructuring without behaviour change: split components, modernise hooks/filters, adopt block supports, reduce tech debt, improve readability/testability. |
| Release | Prepare and ship: semver, changelog, "tested up to", WordPress.org deploy, migrations/deprecations, rollback and comms plan. |
| Dependency Update | Dependency upgrades and management: npm/Composer bumps, Dependabot updates, lockfile refreshes, deprecations and breaking-change migrations. |
| Documentation | Create/update docs: READMEs, inline docs, hook references, examples, contributor guides, deployment runbooks, saved replies, and user‑facing content where needed. |
| Research | Time‑boxed investigation/PoC to answer a question (e.g., Block Bindings feasibility, pattern variations, new API). Must deliver a decision and next steps. |
| Audit | Structured review of a codebase or site: dependency/license risk, a11y/perf/security audit, content or SEO audit with findings and recommendations. |
| Review | Focused request for peer (or design) review. Link PR(s), list areas of concern, and define acceptance criteria for approval. |
| AI Ops | Manage AI assets/workflows: Copilot prompts and instructions, saved replies, code‑assist guardrails, evaluations; ensure safe, consistent automation across repos. |
| Content Modelling | Define and document content structure: IA, post types/CPTs, taxonomies, fields (core/ACF), relationships, slugs/URLs, templates & patterns, governance, migration needs. Produces a schema and mapping for design, authoring and development. |
| Build | Build pipeline & tooling: wp-scripts, webpack/esbuild, PostCSS, PHPCS, release automation, artefact optimisation, cache strategy. |

## Native types to remove

| Native type | Move its issues to | Also add label |
| --- | --- | --- |
| Maintenance | Chore (`type:chore`) | `area:maintenance` |
| Story | Feature (`type:feature`) | none |
| Integration | Feature (`type:feature`) | `area:integration` |

## Order on the organisation settings page (Settings → Planning → Issue types)

The organisation is limited to 25 issue types, so work in this order:

1. **Rename** A11y → Accessibility, Code Refactor → Refactor, Code Review → Review, Build & CI → CI.
2. **Update** every type's description and colour to the tables above.
3. **Move** every issue on Maintenance, Story and Integration to its target type (T041a gives the counts), then **delete** those three types.
4. **Add** Decision, Dependency Update and Build with the descriptions and colours above.
5. **Check** the settings page shows exactly the 25 names in the first table.

## Validation

- `issue-types.yml` and `labels.yml` use the same hex for each type label.
- Every hex is from `docs/LABEL_COLOR_STRATEGY.md`.
- The organisation settings page shows the same 25 names, descriptions and native colours as this document.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
