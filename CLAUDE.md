---
title: "LightSpeed .github — Claude Instructions"
description: "Claude-specific project instructions for the LightSpeed .github repository."
version: "v1.0"
last_updated: "2026-05-20"
file_type: "agents-index"
maintainer: "LightSpeed Team"
---

# CLAUDE.md — LightSpeed .github

> Full organisation-wide AI rules, coding standards, and contribution guidelines live in [AGENTS.md](./AGENTS.md). Read that file first.

## ⚠️ Branch Naming — CRITICAL (Read First)

**You MUST use this pattern for ALL branches:** `{type}/{scope}-{title}`

Examples:
- ✅ `feat/governance-audit-implementation`
- ✅ `fix/pr-template-routing-bug`
- ✅ `docs/branching-strategy-guide`
- ❌ `claude/governance-audit-implementation` — FORBIDDEN
- ❌ `copilot/fix-something` — FORBIDDEN
- ❌ `feature/my-feature` — WRONG (should be `feat/`)

### Allowed Type Values (Use Exactly)

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat/user-preferences-panel` |
| `fix` | Bug fix | `fix/authentication-timeout` |
| `hotfix` | Urgent production fix | `hotfix/critical-security-patch` |
| `release` | Release branch | `release/v1.0.0` |
| `refactor` | Code refactoring | `refactor/api-response-structure` |
| `chore` | Maintenance, no code changes | `chore/dependency-updates` |
| `docs` | Documentation | `docs/branching-strategy-guide` |
| `test` | Tests, test infrastructure | `test/integration-test-suite` |
| `perf` | Performance improvements | `perf/query-optimization` |
| `ci` | CI/CD, pipelines | `ci/github-actions-workflow` |
| `build` | Build system, package changes | `build/webpack-config-update` |
| `deps` | Dependency updates | `deps/upgrade-npm-packages` |
| `security` | Security fixes | `security/xss-vulnerability-fix` |
| `design` | Design system, UI | `design/button-component-update` |
| `a11y` | Accessibility | `a11y/wcag-compliance-audit` |
| `ux` | User experience | `ux/form-validation-feedback` |
| `i18n` | Internationalization | `i18n/german-translation-pack` |
| `ops` | Operations, deployment | `ops/database-migration-script` |
| `proto` | Prototype, experimental | `proto/new-caching-strategy` |
| `ds` | Design system | `ds/component-library-update` |
| `api` | API changes | `api/rest-endpoint-versioning` |
| `schema` | Data schema | `schema/user-model-changes` |
| `telemetry` | Analytics, monitoring | `telemetry/event-tracking-setup` |
| `content` | Content changes | `content/blog-post-updates` |
| `seo` | SEO optimizations | `seo/meta-tag-improvements` |
| `config` | Configuration | `config/environment-variables` |
| `migrate` | Data/schema migrations | `migrate/user-table-migration` |
| `qa` | QA processes | `qa/test-automation-framework` |
| `uat` | User acceptance testing | `uat/staging-validation-suite` |
| `audit` | Audit, compliance, review | `audit/security-code-review` |
| `codex` | Code generation, AI-assisted | `codex/auto-documentation-tool` |
| `revert` | Revert previous commit | `revert/pr-2345-bad-merge` |
| `research` | Research, investigation | `research/performance-benchmarks` |

### FORBIDDEN Prefixes

**These prefixes are NEVER allowed:**

- ❌ `claude/` — Reserved for Claude Code internal sessions
- ❌ `copilot/` — Reserved for GitHub Copilot integration
- ❌ `openai/` — Reserved for OpenAI integration

**Why?** These break PR template assignment and GitHub Actions workflows that depend on branch prefixes.

### Why This Matters

Incorrect branch names cause:

1. **PR template assignment failures** — PR templates route by branch prefix. Wrong prefix = wrong template
2. **GitHub Actions workflow failures** — Workflows validate and act on branch names
3. **Validation check failures** — Branch name validation rejects invalid prefixes
4. **Downstream automation breaks** — Labeling, metrics, and release workflows depend on correct prefixes
5. **Wasted time** — Humans must manually fix branches, reassign templates, and re-run workflows

**Example failure chain:**
- You create branch `claude/my-feature` (wrong!)
- PR template routing fails → uses default `pr_feature.md` (wrong template)
- Validation workflow comments that branch is invalid
- You must delete PR, fix branch, recreate PR
- **Result:** ~5 minutes wasted, plus CI re-run credits spent

### Before You Push

Always validate your branch name:

```bash
npm run validate:branch-name -- --branch <your-branch>
```

Expected output:
```
Branch '{your-branch}' matches the repository branching strategy.
```

### More Information

- **Full rules:** [.github/instructions/branch-naming.instructions.md](./.github/instructions/branch-naming.instructions.md)
- **Strategy guide:** [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md)
- **PR creation process:** [docs/PR_CREATION_PROCESS.md](./docs/PR_CREATION_PROCESS.md)
- **Copilot-specific rules:** [.github/custom-instructions.md](./.github/custom-instructions.md)

---

## What This Repository Is

This is the **LightSpeed organisation `.github` control plane**. It owns:

- GitHub community-health files (issue templates, PR templates, discussion templates, saved replies, code of conduct, security policy).
- Organisation-wide labels, labeler rules, and issue types.
- GitHub Actions workflows for labeling, metrics, releases, and validation.
- Repo-local Copilot and agent instructions (`.github/instructions/`, `.github/custom-instructions.md`).
- Reports, project artefacts, and active planning documents.

It also hosts **portable AI operations assets** in top-level source folders that are intended to be reusable outside this repository:

| Folder | Purpose |
| --- | --- |
| `agents/` | Portable agent specifications |
| `cookbook/` | Recipes, playbooks, and implementation guides |
| `hooks/` | Portable hooks and guardrails |
| `instructions/` | Portable instruction files (no `.github` assumptions) |
| `plugins/` | Installable plugin bundles |
| `skills/` | Self-contained skills with `SKILL.md` entrypoints |
| `workflows/` | Portable agentic workflows |

Do **not** place reusable assets under `.github/`—use the matching top-level folder instead.

## Git Workflow

**Important:** All development must start from the `develop` branch (see [Branch Naming](#-branch-naming--critical-read-first) above for the required pattern).

- `main` — production releases only. Never commit feature work directly to `main`.
- `develop` — active development integration branch. All feature branches must be based on `develop`.

When starting work on an issue, follow the Branch Naming rules above and run:

```bash
git fetch origin develop
git checkout -B {type}/{scope}-{title} origin/develop
```

This ensures your branch includes all latest development work and integrates cleanly without merge conflicts from diverged histories.

## Development Commands

```bash
# Install dependencies
npm ci

# Run all tests
npm test

# Lint Markdown files
npm run lint:md

# Lint JS/TS files
npm run lint:js

# Format files
npm run format

# Validate frontmatter
npm run validate:frontmatter
```

## Key Conventions

- **Language:** UK English throughout (optimise, organisation, colour, behaviour).
- **Coding Standards:** Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/) for PHP, plus ESLint/Prettier for JS/TS and PHPCS/WPCS for PHP.
- **Security:** Validate all input, escape all output, use nonces, never commit secrets.
- **Accessibility:** WCAG 2.2 AA minimum; semantic HTML, keyboard support, sufficient contrast.
- **Performance:** Avoid unnecessary JS, defer/lazy-load where possible, prefer native blocks.
- **No `references` frontmatter field:** Use inline links or footer sections instead.
- **Instruction files:** Follow the pattern in `.github/instructions/instructions.instructions.md`—frontmatter + role declaration + Overview + General Rules + Detailed Guidance + Examples + Validation + References.

## Label Creation Rules (CRITICAL)

When creating issues or PRs programmatically (via CLI, API, or workflow), **ALL labels MUST be from the canonical set in `.github/labels.yml` with their required family prefix**. Never apply bare labels without prefixes.

### Valid Label Examples (Prefixed)

- `type:bug`, `type:feature`, `type:task`, `type:documentation`, `type:security`, `type:design`
- `status:needs-triage`, `status:in-progress`, `status:done`, `status:blocked`
- `priority:critical`, `priority:high`, `priority:normal`, `priority:low`
- `area:ci`, `area:docs`, `area:labels`, `area:security`, `area:testing`, `area:automation`
- `meta:needs-changelog`, `meta:has-pr`, `meta:duplicate`, `meta:needs-audit`

### INVALID Label Examples (Bare — DO NOT USE)

- ❌ `bug` — use `type:bug`
- ❌ `feature` — use `type:feature`
- ❌ `urgent` — use `priority:critical`
- ❌ `ci` — use `area:ci`
- ❌ `duplicate` — use `meta:duplicate`

### References

- Source of truth: `.github/labels.yml` (158 canonical labels)
- Label taxonomy: `docs/LABEL_STRATEGY.md`
- Labeling guide: `docs/LABELING.md`
- Root cause analysis: `.github/projects/active/label-prefix-audit-2026-08-05/`
- Related issue: [#1592](https://github.com/lightspeedwp/.github/issues/1592) — Label Prefix Governance Enforcement

## Repository Boundaries

| Asset Type | Belongs In |
| --- | --- |
| GitHub-native governance (templates, labels, workflows) | `.github/` |
| Repo-local Copilot/agent instructions | `.github/instructions/` or `.github/custom-instructions.md` |
| Reports, audits, metrics | `.github/reports/{category}/` |
| Active project artefacts | `.github/projects/active/{slug}/` |
| Temporary scratch files | `.github/tmp/` (clean up before PR) |
| Portable reusable AI assets | top-level source folders above |
| Permanent human documentation | `docs/` |

## What Not to Do

- Do not add WordPress plugin or theme project-specific code to `.github/`.
- Do not place reports or task trackers in `docs/` or the repo root.
- Do not create instruction files with a `references` frontmatter field.
- Do not move existing agents, instructions, or schemas without a migration issue that records source path, target path, and validation plan.
- Do not enqueue editor-only WordPress assets on the front end (and vice versa).
- Do not commit `node_modules/`, `build/`, or other generated artefacts.

## Related Files

- [AGENTS.md](./AGENTS.md) — full global AI rules
- [docs/WORKFLOWS.md](./docs/WORKFLOWS.md) — workflow organisation and distribution strategy
- [.github/custom-instructions.md](./.github/custom-instructions.md) — Copilot-specific repo instructions
- [.github/instructions/coding-standards.instructions.md](./.github/instructions/coding-standards.instructions.md) — unified coding standards
- [.github/instructions/file-organisation.instructions.md](./.github/instructions/file-organisation.instructions.md) — canonical file placement rules
- [.github/instructions/plugin-structure.instructions.md](./.github/instructions/plugin-structure.instructions.md) — WordPress block plugin structure
