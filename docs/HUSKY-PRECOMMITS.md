# Husky Pre-Commit Hooks Documentation

This document explains the Husky pre-commit setup, usage, and best practices for this repository. It is designed to be used alongside [LINTING.md](./LINTING.md), which details the linting tools and configuration.

---

## Linting & Quality Checks

Husky is tightly integrated with our linting workflow. For a full list of linting tools, configuration files, and what is checked before each commit, see [LINTING.md](./LINTING.md). This ensures that all code meets our standards before it is committed.

---

## Overview

Husky is used to enforce code quality and consistency by running automated checks (such as linting and tests) before code is committed. This helps prevent errors and maintain standards across the codebase.

## .husky Folder Structure

- `.husky/` — Contains all Husky hook scripts
    - `pre-commit` — Main pre-commit hook script (runs linting, tests, etc.)
    - `commit-msg` — Validates commit message format (if present)
    - Other hooks as needed (e.g., `pre-push`)

## How Pre-Commit Works

When you run `git commit`, Husky automatically executes the scripts in `.husky/pre-commit` before the commit is finalized. If any check fails, the commit is aborted.

## Bypassing Pre-Commit Hooks

To bypass Husky pre-commit hooks (not recommended except for emergencies):

```sh
git commit --no-verify
```

> **Note:** Use this only if you have a valid reason. All skipped checks must be run manually before pushing.

## Suppression Storage & Management

- Husky does not store suppressions by default. If you bypass a hook, it is not recorded.
- If you want to re-enable hooks, simply commit as normal (without `--no-verify`).
- To update or remove a hook, edit or delete the relevant script in `.husky/`.

## Recommended Commands

- **Install Husky hooks:**

    ```sh
    npx husky install

    ```

- **Add a new hook:**

    ```sh
    npx husky add .husky/pre-commit "npm run lint:js && npm run lint:css && npm run lint:md && npm test"

    ```

- **Bypass hooks:**

    ```sh
    git commit --no-verify
    ```

## Getting Started

1. Run `npm install` to install dependencies (including Husky).
2. Run `npx husky install` to set up hooks (usually done automatically on install).
3. Commit as usual — Husky will run checks before each commit.

## Best Practices

- Do not bypass hooks unless absolutely necessary.
- Keep hook scripts up to date with project standards.
- Review and update hooks as new linting or test scripts are added.
- See [docs/LINTING.md](./LINTING.md) for details on what is checked by each hook.

## Related Files & Further Reading

- [docs/LINTING.md](./LINTING.md) — Linting tools and configuration
- [docs/HUSKY-LINITING-TASKS.md](./HUSKY-LINITING-TASKS.md) — Task list for Husky and linting documentation
- [package.json](../package.json) — NPM scripts run by hooks
- [.husky/](../../.husky/) — Actual hook scripts

---

### Last updated

24 October 2025
