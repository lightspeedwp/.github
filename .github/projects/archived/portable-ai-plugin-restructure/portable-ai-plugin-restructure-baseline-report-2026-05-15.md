---
title: "Portable AI Plugin Restructure Baseline Validation And Dependency Report"
description: "Issue #287 baseline output for validation, tests, coverage, and dependency audit before portable plugin restructuring."
version: "v0.1.0"
last_updated: "2026-05-15"
file_type: "project-audit"
maintainer: "LightSpeed Team"
authors: ["Codex"]
license: "GPL-3.0"
tags: ["audit", "baseline", "validation", "dependencies", "plugin-restructure"]
domain: "governance"
stability: "draft"
references:
  - path: "portable-ai-plugin-restructure-prd-2026-05-14.md"
    description: "Active PRD defining the phased restructure."
  - path: "issues/children/batch-00-planning-control/00-02-audit-baseline-validation-and-dependency-state.md"
    description: "GitHub issue #287 local source draft."
  - path: "portable-ai-plugin-restructure-baseline-command-output-2026-05-15.txt"
    description: "Raw command output captured during baseline checks."
---

# Portable AI Plugin Restructure Baseline Validation And Dependency Report

Parent epic: #282. Child issue: #287.

## Baseline Summary

| Check | Command | Exit code | Result |
| --- | --- | ---: | --- |
| current branch | `git branch --show-current` | 0 | Branch captured for traceability. |
| current commit | `git rev-parse HEAD` | 0 | Commit captured before restructure work. |
| npm ci | `npm ci` | 0 | Completed, with npm http-proxy and package deprecation warnings; installed 1,720 packages and reported 36 vulnerabilities. |
| validate agents | `npm run validate:agents` | 0 | Passed; 13 files passed and 6 were skipped by file_type. |
| validate workflows | `npm run validate:workflows` | 0 | Passed with 34 warnings about permissions, concurrency, caching, checkout depth, and unnamed run steps. |
| validate json schemas | `npm run validate:json:schemas` | 1 | Failed because `.github/schemas/project-fields.schema.json` contains invalid JSON syntax; command also formatted four files before failing, so schema mutations were reverted after capture. |
| npm test | `npm test` | 0 | Passed 41 suites and 181 tests, but coverage remained 0 percent and test output included noisy import-time side effects. |
| npm audit | `npm audit --audit-level=low` | 1 | Failed at audit-level low with 36 vulnerabilities: 1 low, 17 moderate, 16 high, and 2 critical. |
| git status after baseline | `git status --short` | 0 | Showed schema files modified by the JSON schema validator plus the new audit outputs; schema mutations were reverted because this issue records baseline only. |

## Findings And Risks

- `npm ci` completed successfully, but the install output reports 36 dependency vulnerabilities and several deprecated packages.
- `npm run validate:agents` is currently green, with skipped files that should be reviewed during the agent migration.
- `npm run validate:workflows` is currently green but noisy, with 34 warnings that should feed the workflow hardening backlog.
- `npm run validate:json:schemas` is not safe as a pure validation command because it formats files before validating syntax.
- `npm run validate:json:schemas` currently fails on `.github/schemas/project-fields.schema.json` due to invalid JSON syntax.
- `npm test` passes, but coverage output is 0 percent and at least one test imports code with side effects (`LS_PROJECT_URL not set`).
- `npm audit --audit-level=low` fails with 36 vulnerabilities: 1 low, 17 moderate, 16 high, and 2 critical.

## Remediation Actions

- Use #311 to fix invalid JSON schema syntax.
- Use #312 to split validation from formatting so validation commands are non-mutating by default.
- Use #313 through #315 for smaller structure, plugin/skill, frontmatter, and link validators.
- Use #316 to fix coverage reporting and import side effects.
- Review dependency remediation separately so security fixes do not get mixed into the restructure foundation PR.

## Mutating Command Note

`npm run validate:json:schemas` modified `.github/schemas/frontmatter.schema.json` and `.github/schemas/project-fields.schema.json` during baseline capture. Those changes were reverted after the command output was saved because issue #287 is an audit issue and should not fix findings.

## Raw Output

The raw command output is stored in [`portable-ai-plugin-restructure-baseline-command-output-2026-05-15.txt`](portable-ai-plugin-restructure-baseline-command-output-2026-05-15.txt).

## Acceptance Criteria Status

- [x] Record current branch and commit.
- [x] Run or document `npm ci`.
- [x] Run `npm run validate:agents`.
- [x] Run `npm run validate:workflows`.
- [x] Run `npm run validate:json:schemas`.
- [x] Run `npm test`.
- [x] Run `npm audit` or capture existing vulnerability count.
- [x] Note which commands are mutating or noisy.
