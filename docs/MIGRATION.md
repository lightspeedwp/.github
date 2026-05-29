---
title: Migration Notes & Guides
description: Central migration map, version guides, and contributor guidance for repository-wide changes including naming, labels, file relocations, and breaking changes.
version: v0.3.0
last_updated: '2026-05-29'
file_type: documentation
maintainer: LightSpeed Team
authors:
- LightSpeed Team
license: GPL-3.0
tags:
- migration
- versioning
- labels
- governance
domain: governance
stability: stable
---

# Migration Notes & Guides

This document centralises migration guides, version updates, and breaking changes across the LightSpeed ecosystem. Refer to this guide when upgrading components, moving files, or implementing breaking changes.

## Instructions Migration

When moving instructions between locations:

1. **Create migration issue** documenting source and target paths
2. **Update all references** in the repository
3. **Leave a redirect** or archive note in the old location
4. **Verify all links** still work
5. **Test with consumers** of the instruction

For portable instruction files, see [instructions/README.md](../instructions/README.md#migrating-instructions) for detailed migration procedures.

## Hooks & Tools Migration

When updating hooks or tool adapters:

1. **Version carefully** using semantic versioning
2. **Document breaking changes** in release notes
3. **Provide migration path** for users
4. **Maintain backward compatibility** where possible
5. **Update registry** with new version metadata

For version migration guides, refer to individual hook documentation in [hooks/README.md](../hooks/README.md).

## Skills & Workflows Migration

When restructuring skills or workflows:

1. **Announce deprecation** well in advance
2. **Provide replacement** or upgrade path
3. **Maintain both versions** during transition period
4. **Update documentation** to point to new location
5. **Remove old version** after deprecation period

## Version Numbering

All components use semantic versioning:

- **Major** (v1 → v2) – Breaking changes to inputs or outputs
- **Minor** (v1.0 → v1.1) – New optional features
- **Patch** (v1.0.0 → v1.0.1) – Bug fixes and clarifications

## Breaking Changes Policy

Breaking changes require:

1. **Advance notice** (at least 2 releases or 1 month notice)
2. **Deprecation warnings** in documentation
3. **Migration guide** in this file
4. **Major version bump** when released
5. **Clear communication** to all stakeholders

## Related Resources

- [CONTRIBUTING.md](../CONTRIBUTING.md) – Contribution guidelines
- [instructions/README.md](../instructions/README.md) – Instruction standards
- [hooks/README.md](../hooks/README.md) – Hook stability and versioning
- [skills/README.md](../skills/README.md) – Skill development
- [workflows/README.md](../workflows/README.md) – Workflow management
- [VERSIONING.md](./VERSIONING.md) – Version management strategy

---

*Made with 💚 by LightSpeedWP – keep things smooth during transitions!*
[Migrations](https://github.com/lightspeedwp/.github/blob/develop/docs/MIGRATION.md)
