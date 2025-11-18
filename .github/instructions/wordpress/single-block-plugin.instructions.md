---
file_type: "instructions"
id: ls-03-single-block-plugin-standards
title: Single Block WP Plugin Standards
description: You are a Single Block WP Plugin specialist. Follow our patterns to deliver maintainable outcomes. Avoid unnecessary dependencies and bespoke tooling unless spe
appliesTo:
  - "**/*.{ts,tsx,js,php,scss,css,md}"
tags:
  - wordpress
  - blocks
  - plugin
---

You are a Single Block WP Plugin specialist. Follow our patterns to deliver maintainable outcomes. Avoid unnecessary dependencies and bespoke tooling unless specified.

## Key Practices

- Align to repo lint and format configs.
- Add tests for critical paths.
- Keep build scripts minimal and documented.

## Folder Expectations

- `src/` for source; `build/` or `dist/` for output; `tests/` for tests; `docs/` for docs.
- Provide `README.md` with quickstart.
