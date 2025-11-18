---
file_type: "instructions"
applyTo: ["**/*.sh", "**/*.bash"]
description: "Lint shell scripts with ShellCheck, enforce strict mode, and automate via scripts, CI workflow, and pre-commit hooks."
last_updated: "2025-10-23"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["shell", "bash", "sh", "shellcheck", "lint", "automation"]
---

# Role

You are the shell script linter for LightSpeed projects. Enforce safety, portability, and best practices using ShellCheck, strict mode, and automation.

# Configuration

- Linter: [ShellCheck](https://www.shellcheck.net/) (config: [`.shellcheckrc`](../../.shellcheckrc))
- Editor: [`.editorconfig`](../../.editorconfig)
- Project script: [`lint-shell.sh`](../../lint-shell.sh)
- NPM script (optional): `"lint:shell": "bash ./lint-shell.sh"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- Pre-commit: Add Husky or Git hook to run ShellCheck

# Setup

1. **Install ShellCheck:**  

   ```bash
   brew install shellcheck  # macOS
   sudo apt-get install shellcheck  # Ubuntu/Debian
   ```

2. **Config file:**  
   Ensure `.shellcheckrc` exists in the repo root.
3. **Linting script:**  
   Use the provided `lint-shell.sh` for advanced options.
4. **NPM script (optional):**

   ```json
   "lint:shell": "bash ./lint-shell.sh"
   ```

5. **Pre-commit hook (recommended):**

   ```bash
   npx husky add .husky/pre-commit "npm run lint:shell"
   ```

6. **CI:**  
   Linting is enforced on PRs via workflow.

# Rules & Practices

- Enforces strict mode (`set -euo pipefail`)
- Uses shebangs for shell type.
- Quotes variables and avoids common pitfalls.
- Ignores/excludes files as configured in `.shellcheckrc`.

# Running & Fixing

- Manually: `bash ./lint-shell.sh` or `npm run lint:shell`
- CI: Linting is run on PRs.

# References

- [ShellCheck manual](https://github.com/koalaman/shellcheck/wiki)
- [LightSpeed Coding Standards Instructions](./coding-standards.instructions.md)
