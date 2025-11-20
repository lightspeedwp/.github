---
file_type: "documentation"
title: "NPM Scripts Configuration"
description: "Standardised build, lint, test, format, release and WordPress environment automation via package.json scripts"
last_updated: "2025-10-24"
tags: ["npm", "scripts", "automation", "linting", "testing", "wordpress"]
---

## Purpose

Central catalogue of `package.json` scripts that implement the LightSpeed workflow: build, lint, format, test, contributors, environment and release utilities. This doc normalises naming, shows categories, and links each group to its related configuration.

## At‑a‑Glance Categories

| Category          | Prefix / Pattern         | Examples                                                                         | Related Docs                                          |
| ----------------- | ------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Build & Dev       | build, start, dev, watch | `build`, `build:production`, `start`                                             | Theme / build tooling (e.g. Babel, Playwright config) |
| Lint (core)       | lint:\*                  | `lint:js`, `lint:css`, `lint:md`, `lint:yaml`, `lint:workflows`, `lint:pkg-json` | LINTING.md, lint-\* config docs                       |
| Format            | format, format:\*        | `format`, `format:js`, `format:css`, `format:md`                                 | Prettier, Stylelint                                   |
| Tests (unit/e2e)  | test:\*                  | `test:js`, `test:e2e`, `test:coverage`, `test:watch`                             | Jest, Playwright                                      |
| Env / WP          | env:*/ wp:*              | `env:start`, `env:stop`, `wp:cli`                                                | WordPress local env                                   |
| Contributors      | contributors:\*          | `contributors:add`, `contributors:generate`                                      | ALL-CONTRIBUTORS.md                                   |
| Version / Release | sync-version             | `sync-version`                                                                   | VERSION, CHANGELOG.md                                 |

## Core Aggregate Scripts

```jsonc
{
  "scripts": {
    "lint": "npm run lint:js && npm run lint:css && npm run lint:yaml && npm run lint:pkg-json",
    "lint:all": "npm run lint && npm run lint:workflows && npm run lint:md",
    "format": "npm run format:js && npm run format:css",
  },
}
```

`lint` is intentionally smaller/faster; `lint:all` adds slower / full‑surface checks (Markdown + workflow specs).

## Detailed Script Groups

### Build & Development

```jsonc
{
  "scripts": {
    "build": "wp-scripts build",
    "build:production": "wp-scripts build --mode=production",
    "start": "wp-scripts start",
    "dev": "npm run start",
    "watch": "npm run start",
    "sync-version": "node scripts/sync-version.js",
  },
}
```

### Linting & Formatting

```jsonc
{
  "scripts": {
    "lint:js": "eslint '**/*.{js,jsx,ts,tsx}' --fix",
    "lint:css": "stylelint '**/*.{css,scss}' --fix",
    "lint:md": "markdownlint '**/*.md' --fix",
    "lint:yaml": "spectral lint '**/*.{yml,yaml}' --ruleset .spectral.yaml",
    "lint:workflows": "spectral lint '.github/workflows/*.{yml,yaml}' --ruleset .spectral-workflows.yaml",
    "lint:pkg-json": "npmPkgJsonLint .",
    "format:js": "prettier '**/*.{js,jsx,ts,tsx,json}' --write && eslint '**/*.{js,jsx,ts,tsx}' --fix",
    "format:css": "prettier '**/*.{css,scss}' --write && stylelint '**/*.{css,scss}' --fix",
    "format:md": "prettier '**/*.md' --write",
  },
}
```

Notes:

- JSON formatting piggybacks on `format:js` to avoid duplicated globs.
- Conflicting / erroneous legacy fragments removed (e.g. stray `stylelint-config-prettier` executions).

### Testing (Unit & E2E)

```jsonc
{
  "scripts": {
    "test": "npm run test:js",
    "test:js": "jest --coverage --forceExit --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
  },
}
```

### WordPress Environment Utilities

```jsonc
{
  "scripts": {
    "env:start": "wp-env start",
    "env:stop": "wp-env stop",
    "env:destroy": "wp-env destroy",
    "env:clean": "wp-env clean",
    "env:reset": "run-s env:destroy env:start",
    "wp:cli": "wp-env run cli wp",
  },
}
```

### Contributor Tooling

```jsonc
{
  "scripts": {
    "contributors:add": "all-contributors add",
    "contributors:generate": "all-contributors generate",
    "contributors:check": "all-contributors check",
  },
}
```

### CI / Pipeline Patterns (Example)

```jsonc
{
  "scripts": {
    "ci": "npm ci && npm run lint:all && npm run test:js",
    "ci:build": "npm run build:production",
    "ci:test": "npm run test:js",
    "ci:e2e": "playwright test --reporter=github",
  },
}
```

## Workflow Recommendations

| Step | Local Action      | Script              | Rationale                 |
| ---- | ----------------- | ------------------- | ------------------------- |
| 1    | Start dev         | `npm run start`     | Fast feedback build       |
| 2    | Stage changes     | git add             | Prepare for gated quality |
| 3    | Pre-commit        | Husky / lint-staged | Fast staged lint/format   |
| 4    | Manual full check | `npm run lint:all`  | Catch slow specs pre-push |
| 5    | Unit tests        | `npm run test:js`   | Coverage + correctness    |
| 6    | E2E tests         | `npm run test:e2e`  | Behaviour validation      |

## Troubleshooting Quick Reference

| Symptom                       | Likely Cause                 | Resolution                                         |
| ----------------------------- | ---------------------------- | -------------------------------------------------- |
| ESLint slow                   | Large glob / missing ignore  | Add ignore patterns / run targeted file            |
| Spectral errors on workflows  | Using general ruleset        | Use `.spectral-workflows.yaml` for workflows       |
| Prettier not applying on save | VS Code formatter conflict   | Ensure default Prettier + disable other formatters |
| Jest hangs                    | Open handles (timers/server) | Use `--detectOpenHandles` / close resources        |

## Integration

**Related Configuration:**

- [LINTING.md](../LINTING.md) — Strategy & overview
- [HUSKY-PRECOMMITS.md](../HUSKY-PRECOMMITS.md) — Pre-commit pipeline
- [lint-eslint.md](./lint-eslint.md) — ESLint config
- [lint-stylelint.md](./lint-stylelint.md) — Stylelint config
- [lint-prettier.md](./lint-prettier.md) — Prettier config
- [workflow-husky.md](./workflow-husky.md) — Husky hooks
- [workflow-lint-staged.md](./workflow-lint-staged.md) — Staged file processing
- [vscode-settings.md](./vscode-settings.md) — Editor integration
- [frontmatter.schema.json](../../schemas/frontmatter.schema.json) — Schema for doc frontmatter
- [CHECKLIST_CROSSLINKING.md](../CHECKLIST_CROSSLINKING.md) — Cross-link governance

## Change Log (Doc Scope)

| Date       | Change                                          | Notes                                    |
| ---------- | ----------------------------------------------- | ---------------------------------------- |
| 2025-10-24 | Normalised structure & removed malformed fences | Replaced duplicated / corrupted sections |
| 2025-10-24 | Added troubleshooting & CI patterns             | Improves quick onboarding                |

---

Document authored with accessibility and consistency in mind; manual review still recommended.
