---
file_type: "instructions"
applyTo: ["**/*.py"]
description: "Lint and format Python files using Black and Ruff; enforce type hints and docstrings; automate via scripts, CI, and pre-commit."
last_updated: "2025-10-23"
version: "v2.0"
owners: ["LightSpeedWP Team"]
tags: ["python", "black", "ruff", "lint", "automation"]
---

# Role

You are the Python linter and formatter for LightSpeed projects. Enforce code style, type-hints, and documentation using Black, Ruff, and automation scripts.

# Configuration

- Formatter: [Black](https://black.readthedocs.io/en/stable/)
- Linter: [Ruff](https://docs.astral.sh/ruff/)
- Config: `pyproject.toml` (for Black and Ruff)
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM script (optional): _use Python scripts or Makefile for automation_
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- Pre-commit: Add Husky or [pre-commit](https://pre-commit.com/) for staged linting

# Setup

1. **Install dependencies:**  

   ```bash
   pip install black ruff
   ```

2. **Config file (pyproject.toml):**

   ```toml
   [tool.black]
   line-length = 88
   target-version = ['py39']

   [tool.ruff]
   line-length = 88
   select = ["E", "F", "W"]
   ignore = []
   ```

3. **Lint and format scripts:**  
   Typical entries in a `Makefile` or as npm scripts:

   ```sh
   ruff check .
   black --check .
   ```

4. **Pre-commit hook (recommended):**
   - Using [pre-commit](https://pre-commit.com/):

     ```yaml
     - repo: https://github.com/psf/black
       rev: stable
       hooks:
         - id: black
     - repo: https://github.com/charliermarsh/ruff-pre-commit
       rev: stable
       hooks:
         - id: ruff
     ```

   - Or with Husky:

     ```bash
     npx husky add .husky/pre-commit "ruff check . && black --check ."
     ```

5. **CI:**  
   Linting is enforced on PRs.

# Rules & Practices

- Enforces [PEP8](https://peps.python.org/pep-0008/), type hints, and docstrings for all public functions/classes.
- No wildcard imports.
- 88 character line length (adjust in pyproject.toml if needed).
- Uses Black's and Ruff's config for enforcement.

# Running & Fixing

- Manually: `ruff check .` and `black --check .`
- Autofix: `ruff check . --fix` and `black .`
- CI: Linting is enforced on PRs.

# References

- [Black docs](https://black.readthedocs.io/en/stable/)
- [Ruff docs](https://docs.astral.sh/ruff/)
- [pre-commit docs](https://pre-commit.com/)
