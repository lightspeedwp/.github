---
file_type: documentation
name: Filesystem Tests
folder: includes/filesystem
last_updated: 2025-10-25
description: |
  Tests for filesystem operations and file management utilities. Validates file creation, directory management, permissions, and backup/restore for LightSpeed WP.
domain: tests
version: 2.0
owners:
  - lightspeedwp
references:
  - ../../README.md
  - ../../../README.md
  - ../../../schemas/frontmatter.schema.json
  - ../../../docs/YAML.md
  - ../../../docs/FRONTMATTER-SCHEMA.md
---

# Filesystem Tests

This directory contains tests for filesystem operations and file management utilities.

```mermaid
graph TD
    A[test-file-operations.bats] --> B[File System Operations]
    B --> C[Directory Management]
    B --> D[File Permission Handling]
    B --> E[Backup & Restore]
    C & D & E --> F[Unified Frontmatter Schema]
```

## Test Files

- `test-file-operations.bats`: Bats tests for file system operations, file manipulation, and directory management

## Purpose

These tests validate:

- File creation, modification, and deletion operations
- Directory structure management
- File permission handling
- Path resolution and validation
- File system safety checks and error handling
- Backup and restore operations

## Running Tests

```bash
# Run filesystem tests specifically
bats tests/includes/filesystem/

# Run all includes tests
bats tests/includes/
```

## Dependencies

- Bats testing framework
- Standard filesystem utilities (cp, mv, rm, mkdir, etc.)
- Test helpers from parent includes directory
- Temporary directory support for isolated testing

---

## References

- [Main Includes README](../README.md)
- [Root README](../../README.md)
- [Frontmatter Schema](../../../schemas/frontmatter.schema.json)
- [YAML Documentation](../../../docs/YAML.md)
- [Frontmatter Schema Documentation](../../../docs/FRONTMATTER-SCHEMA.md)
