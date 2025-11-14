---
title: "Husky Pre-commit Hooks"
description: "Using Husky to enforce quality gates (linting/tests) before commits"
last_updated: "2025-11-14"
version: "1.0"
maintainers: ["LightSpeed DevOps"]
tags: ["husky", "pre-commit", "automation", "linting"]
---

# Husky Pre-commit Hooks

**`docs/HUSKY-PRECOMMITS.md`** – *Pre-commit Hook as Quality Gate*

We use **Husky** to run linting and formatting checks locally before code is committed, serving as a "first line" quality gate. This ensures that by the time code reaches CI, it has already passed basic standards.

## Status and Rationale

**Status:** *Implemented in develop (pending merge to main).* Previously, Husky was not set up in this repo, meaning developers could commit code that failed our style/test checks. We've now added a Husky *pre-commit* hook to mirror the checks that run in CI, closing this gap.

**Why Husky:** Running checks locally speeds up feedback. It prevents "easy" issues (like code style or obvious test failures) from ever reaching the repo, which reduces CI failures and iteration time. This aligns with our goal that *"files are linted properly and tests pass"* before pushing.

## Installation

Husky is managed as a dev dependency. To install and enable Husky in a fresh clone:

1. After running `npm install` (or `npm ci`), activate Husky hooks:

```bash
npx husky install
```

This installs Git hooks into the local repo's `.husky/` directory (already present in source).

2. Verify that a `.husky/pre-commit` file exists with our hook. It should have been created in the repo (or by the install command).

If Husky isn't working, ensure Git isn't bypassing hooks (no `--no-verify` flag used) and that you have the correct Node version. We specify Node version in `.nvmrc` to avoid incompatibilities (our CI uses the same Node version).

## Pre-commit Hook Behavior

Our pre-commit hook is defined in **`.husky/pre-commit`**. It runs our formatting and linting checks before allowing a commit. In summary, it will:

- **Format code** (auto-fix) by running **`npm run format`**.
- **Run linters and tests** by running **`npm run check`** (a composite script that runs all linters and unit tests).

If *either* of those steps fails, the commit is aborted. You must fix the issues and try again. This prevents committing code that would fail CI.

Below is the content of our `.husky/pre-commit` file for reference:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run format && npm run check
```

This uses Husky's shell script shim and then runs our tasks. The `&&` ensures that if formatting fails or leaves changes, or if any check fails, the process halts with a non-zero exit (blocking the commit).

## Adding Husky to an Existing Clone

If you already have the repo and just pulled the updated config, run `npm install` (to get Husky) and then `npx husky install` to set up the hooks. This is a one-time step per clone. After that, Git will trigger the hook on commits automatically.

## Ignoring Specific Files or Bypassing

Our goal is to run the hook on all source changes. However, large binary files or documentation-only changes shouldn't block a commit on lint rules:

- Husky will only lint the files you're committing (through our `npm run ...` scripts configuration). For instance, if you edit only Markdown, JS lint won't run, etc.
- If absolutely necessary (e.g. an urgent hotfix), you can bypass hooks with `git commit --no-verify`. **Use this sparingly.** Bypassing means CI will catch any issues later.

We intentionally do not run lengthy end-to-end tests on pre-commit (those run in CI), to keep commits fast. The pre-commit focuses on quick checks (formatting, linters, unit tests). This strikes a balance between safety and speed.

## CI Integration

The pre-commit hook runs the same `npm run check` that CI does. In our GitHub Actions CI, we also execute the full test suite on push. The idea is "fail fast, locally":

- By the time CI runs, code should already be formatted and pass linting. CI then mainly validates integration (and runs heavier tests).
- If a contributor bypasses Husky (or Husky wasn't installed), the CI will still fail on the same `npm run check` script in our workflow, acting as a safety net.

Having duplicate checks may seem redundant, but it's intentional. It virtually eliminates trivial CI failures (saving time) and acts as a double-insurance policy.

## Setup Commands (for reference)

For maintainers, these were the steps used to set up Husky in this repo:

```bash
npm install --save-dev husky   # Add Husky to devDependencies
npx husky install             # Install Git hooks (creates .husky/ folder)
npx husky add .husky/pre-commit "npm run format && npm run check"
```

This added the pre-commit file with the content shown above. Our `package.json` already had the necessary `format` and `check` scripts defined (mapping to Prettier/ESLint and our test runner).

*(No changes are needed to developers' workflows aside from running `npm install` and having Node per `.nvmrc`. Commits are now gated, improving code quality upstream.)*

## Related Files & Further Reading

- [docs/LINTING.md](./LINTING.md) — Linting tools and configuration
- [docs/METRICS.md](./METRICS.md) — Metrics and telemetry
- [docs/config/workflow-husky.md](./config/workflow-husky.md) — Detailed Husky configuration
- [package.json](../package.json) — NPM scripts run by hooks
- [.husky/](../.husky/) — Actual hook scripts

---

### Last Updated

2025-11-14
