---
title: "Agent Task: Implement Markdown Linting Workflow"
description: "Repeatable agent task for setting up markdownlint-cli2 with GitHub rules"
version: "1.0.0"
tags: ["agent", "task", "markdown", "linting", "automation"]
author: "LightSpeedWP"
---

# Agent Task: Implement Markdown Linting Workflow

## Objective

Add a consistent Markdown linting workflow to a repository using:

- **markdownlint** (engine)
- **markdownlint-cli2** (CLI)
- **@github/markdownlint-github** (opinionated rules)
- **VS Code** configuration for local parity
- **GitHub Actions** for CI
- **Pre-commit** via Husky + lint-staged (optional but recommended)
- **Chatmode + prompts** for an in-repo LLM assistant

The agent must create/update files, scripts, and CI so contributors get the same results locally and in CI. Keep
changes minimal and idempotent.

---

## Inputs and Conventions

- **Repository root:** Current working directory
- **Package manager:**
  - If `pnpm-lock.yaml` exists → `pnpm`
  - Else if `yarn.lock` exists → `yarn`
  - Else → `npm`
- **Node:** Use existing `.nvmrc` or `engines` if present; otherwise assume Node ≥ 18
- **Do not overwrite existing files:** Merge where noted

---

## Plan (High Level)

1. **Dependencies:** Add dev dependencies and convenient scripts
2. **Configurations:** Add `.markdownlint-cli2.mjs` (primary), optional `.markdownlint.jsonc`
3. **VS Code:** Add/update `.vscode/settings.json` for editor parity
4. **CI:** Add `.github/workflows/markdownlint.yml`
5. **Hooks (optional):** Set up Husky + lint-staged for pre-commit
6. **Documentation:** Add contributor documentation and chatmode prompt
7. **Sanity check:** Run lint, fix sample violations, re-run
8. **Open PR:** Include summary, test steps, and rollback note

---

## File Operations

### 1. `package.json` (merge)

Add/merge the following:

```jsonc
{
  "devDependencies": {
    "markdownlint-cli2": "^0.15.0",
    "@github/markdownlint-github": "^0.8.0",
    "markdownlint-cli2-formatter-pretty": "^0.0.6",
    "lint-staged": "^15.0.0",
    "husky": "^9.0.0",
  },
  "scripts": {
    "lint:md": "markdownlint-cli2 \"**/*.{md,mdx}\" \"!node_modules\"",
    "lint:md:fix": "markdownlint-cli2 --fix \"**/*.{md,mdx}\" \"!node_modules\"",
    "prepare": "husky install",
  },
  "lint-staged": {
    "*.{md,mdx}": "markdownlint-cli2",
  },
}
```

### 2. `.markdownlint-cli2.mjs` (new)

```javascript
import markdownIt from "markdown-it";
import { init } from "@github/markdownlint-github";

const markdownItFactory = () => markdownIt({ html: true });

const options = {
  config: init({
    // Safe defaults; adjust per repository
    MD013: { line_length: 120, code_blocks: false, tables: false },
    MD024: { siblings_only: true },
  }),
  customRules: ["@github/markdownlint-github"],
  markdownItFactory,
  outputFormatters: [
    ["markdownlint-cli2-formatter-pretty", { appendLink: true }],
  ],
};

export default options;
```

### 3. `.markdownlint.jsonc` (optional override; new if needed)

```json
{
  // Example: enforce ATX headings; rely on MD013 configured in cli2.mjs
  "MD003": { "style": "atx" }
}
```

### 4. `.github/workflows/markdownlint.yml` (new)

```yaml
name: markdownlint
on:
  pull_request:
    branches: [main, master, develop]
  push:
    branches: [main, master, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: markdownlint-cli2
        uses: DavidAnson/markdownlint-cli2-action@v16
        with:
          globs: "**/*.{md,mdx}"
```

### 5. `.vscode/settings.json` (merge or new)

```jsonc
{
  // Use VS Code + markdownlint for local parity
  "editor.rulers": [120],
  "markdownlint.config": {
    "MD003": { "style": "atx" },
    "MD013": { "line_length": 120, "code_blocks": false, "tables": false },
  },
  "files.eol": "\n",
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
}
```

### 6. Husky Hook (optional but preferred)

Run once after dependencies install:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

Create `.husky/pre-commit` with:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
npx lint-staged
```

Make executable: `chmod +x .husky/pre-commit`

### 7. `docs/linting/markdown.md` (new)

Create comprehensive documentation explaining:

- What markdownlint is and why it's used
- Available commands (`npm run lint:md`, `npm run lint:md:fix`)
- Configuration precedence
- CI integration
- Pre-commit hooks
- VS Code integration
- Common issues and fixes
- Troubleshooting

### 8. `prompts/chatmode-markdown-linting.md` (new)

Create a chatmode prompt file that powers an in-repository LLM assistant for Markdown linting.

### 9. `prompts/agent-task-markdown-linting.md` (new)

A copy of this very task prompt for repeatable runs.

### 10. Optional Helper Script `scripts/setup-markdownlint.sh` (new)

```bash
#!/usr/bin/env bash
set -euo pipefail

PM="npm"
[ -f pnpm-lock.yaml ] && PM="pnpm"
[ -f yarn.lock ] && PM="yarn"

if [ "$PM" = "pnpm" ]; then
  pnpm add -D markdownlint-cli2 @github/markdownlint-github markdownlint-cli2-formatter-pretty lint-staged husky
elif [ "$PM" = "yarn" ]; then
  yarn add -D markdownlint-cli2 @github/markdownlint-github markdownlint-cli2-formatter-pretty lint-staged husky
else
  npm i -D markdownlint-cli2 @github/markdownlint-github markdownlint-cli2-formatter-pretty lint-staged husky
fi

npm run prepare || pnpm run prepare || yarn run prepare || true
npx husky add .husky/pre-commit "npx lint-staged" || true

echo "Setup complete. Run '${PM} run lint:md' to test."
```

---

## Verification

### Local

1. Run: `npm run lint:md` (or `pnpm` / `yarn`)
2. Introduce a small violation (e.g., trailing spaces), confirm it's reported
3. Run: `npm run lint:md:fix` and confirm it's corrected
4. Open a `.md` file in VS Code and verify inline warnings match CLI

### CI

- Push a branch; ensure the **markdownlint** workflow runs and passes
- Open a PR with a known violation; confirm the check blocks merging

---

## Acceptance Criteria

- Scripts `lint:md` and `lint:md:fix` work with the detected package manager
- CI job exists and fails on violations, passes when fixed
- VS Code shows consistent diagnostics with CLI
- (If enabled) Pre-commit prevents committing violating Markdown
- Documentation and prompts exist and are discoverable:
  - `docs/linting/markdown.md`
  - `prompts/chatmode-markdown-linting.md`
  - `prompts/agent-task-markdown-linting.md`

---

## Git Hygiene

- **Create branch:** `chore/markdownlint-setup` or similar
- **Suggested commits:**
  - `chore(markdown): add markdownlint config and scripts`
  - `ci(markdown): add markdownlint GitHub Action`
  - `docs(markdown): contributor guide + chatmode prompt`
  - `chore(git): optional husky + lint-staged`
- **PR title:** Add Markdown Linting (markdownlint-cli2 + GitHub rules)
- **PR body:** Include "Verification" steps and screenshots of passing CI

---

## Rollback

- Revert the PR; delete `.github/workflows/markdownlint.yml`
- Remove devDeps and scripts; delete lint configuration files
- Remove Husky hook if created; `git rm -r .husky` if unwanted

---

**Version:** 1.0.0
**Last updated:** 2025-11-18
