---
applyTo: ['**/*.sh', '**/*.bash']
description: "Shellcheck with strict mode; portable sh where possible."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Provide guidelines for writing shell scripts and linting them to catch common mistakes.

# Linter
- Use **shellcheck**. Install via your package manager or as a GitHub Action.

# Setup
1. Ensure shell scripts start with a shebang (e.g. `#!/usr/bin/env sh` for POSIX sh or `#!/usr/bin/env bash`).
2. Add a `lint:shell` script: `"lint:shell": "shellcheck scripts/*.sh"`.

# Rules & Practices
- Enable strict mode: include `set -euo pipefail` near the top of your scripts to stop on errors, unset variables and pipeline failures.
- Prefer POSIX‑compliant `sh` unless you need Bash‑specific features. If you use Bash, declare it explicitly in the shebang.
- Quote variables to prevent word splitting and globbing.

# Running & Fixing
- Run `shellcheck` on each script. Follow the suggestions to fix issues such as unquoted variables and unchecked command statuses.

# References
- ShellCheck manual: https://github.com/koalaman/shellcheck/wiki
