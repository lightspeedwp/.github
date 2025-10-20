---
applyTo: ['**/*.py']
description: "Black + Ruff; type hints required."
last_updated: "2025-10-19"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Mission
Standardise Python code format and catch common errors using modern linters.

# Linter & Formatter
- Use **Black** for code formatting. Install via `pip install black`.
- Use **Ruff** for linting. Install via `pip install ruff`.

# Setup
1. Add a `pyproject.toml` specifying Black’s settings (e.g. line length, target Python version).
2. Configure Ruff by adding a `[tool.ruff]` section specifying the desired rule sets.
3. Add a `lint:py` script to `pyproject.toml` or `Makefile`: `ruff check .`.

# Rules & Practices
- Use type hints for all function signatures and data structures.
- Avoid wildcard imports; import only what you need.
- Keep line lengths ≤ 120 characters for readability.
- Document public functions and classes with docstrings following PEP 257.

# Running & Fixing
- Run `ruff check .` to identify issues. Use `ruff fix .` for auto‑fixes where safe.
- Format code with `black .` before committing changes.

# References
- https://black.readthedocs.io/en/stable/
- https://docs.astral.sh/ruff/
