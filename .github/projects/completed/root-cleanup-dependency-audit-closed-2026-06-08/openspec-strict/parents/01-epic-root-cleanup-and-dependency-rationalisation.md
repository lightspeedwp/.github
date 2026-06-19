---
issue_number: 770
file_type: documentation
title: "[Epic] Root cleanup and dependency rationalisation"
description: "OpenSpec strict planning artefact"
last_updated: "2026-06-03"
status: active
---

# [Epic] Root cleanup and dependency rationalisation

## template-map

- template_file: .github/ISSUE_TEMPLATE/05-epic.md

## Overview

Consolidate repository dependency usage and root file placement using evidence already collected, while preserving current CI and local developer workflows.

## Goals

1. Finalise package removals to match current implementation usage only.
2. Complete repository root cleanup for documents and generated artefacts.
3. Close out residual legacy root files with explicit keep, move, or remove decisions.

## Acceptance Criteria

- [ ] Dependency set in package.json is aligned with proven runtime/tooling usage.
- [ ] Root documentation and generated reports are placed in canonical directories.
- [ ] Validation passes for lint, tests, and repository-wide checks after each change slice.
- [ ] Remaining root files each have a documented disposition decision.
