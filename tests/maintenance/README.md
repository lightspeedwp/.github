---
file_type: documentation
version: "2.0"
created_date: "2025-10-25"
last_updated: "2025-10-25"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
tags:
  - "maintenance"
  - "bats"
  - "automation"
  - "labels"
  - "readme"
domain: "governance"
stability: "stable"
mode: "information"
deprecated: false
references:
  - path: "../../schemas/frontmatter.schema.json"
    description: "Unified frontmatter schema definition"
  - path: "../../CONTRIBUTING.md"
    description: "Contribution guidelines"
---

# Maintenance Test Suite

This folder contains Bats tests for all maintenance automation scripts in `scripts/maintenance/`. These tests validate label management, README and changelog updates, badge automation, and other maintenance operations.

## Test Files

- `test-find-readmes.bats` — Validates README discovery logic
- `test-prune-labels.bats` — Tests label pruning and protection
- `test-sync-org-labels.bats` — Validates org-wide label sync
- `test-update-badges.bats` — Tests badge update automation
- `test-update-changelog-links.bats` — Validates changelog link updates
- `test-update-readme-and-changelog.bats` — Tests README and changelog update logic
- `tests-folder-and-file-readmes.bats` — Validates folder/file README structure
- `test-run-maintenance-tests.bats` — Batch runner for maintenance tests

## Coverage

- Label management and protection
- README/changelog automation
- Badge updates
- Edge cases and error handling
- Dry-run and CI/CD integration

## Running Tests

```bash
bats .
```

## Maintenance Workflow

```mermaid
graph TD
    A[test-find-readmes.bats] --> B[README Discovery]
    C[test-prune-labels.bats] --> D[Label Pruning]
    E[test-sync-org-labels.bats] --> F[Org Label Sync]
    G[test-update-badges.bats] --> H[Badge Automation]
    I[test-update-changelog-links.bats] --> J[Changelog Link Updates]
    K[test-update-readme-and-changelog.bats] --> L[README/Changelog Updates]
    M[tests-folder-and-file-readmes.bats] --> N[Folder/File README Structure]
    B & D & F & H & J & L & N --> O[Unified Frontmatter Schema]
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## References

- [Unified Frontmatter Schema](../../schemas/frontmatter.schema.json)
- [Contribution Guidelines](../../CONTRIBUTING.md)
