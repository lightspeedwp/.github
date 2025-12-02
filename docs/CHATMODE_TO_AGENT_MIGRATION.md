---
file_type: "documentation"
title: "Chatmode to Agent Migration Plan"
description: "Migration plan to align chatmode files with VS Code v1.106+ agent terminology and file format standards"
version: "v1.0"
created_date: "2025-12-01"
last_updated: "2025-12-01"
author: "LightSpeedWP Team"
maintainer: "LightSpeedWP Team"
tags: ["migration", "chatmode", "agent", "vscode", "copilot"]
status: "active"
references:
  - path: "schemas/frontmatter.schema.json"
    description: "Updated frontmatter schema with agent support"
  - path: "scripts/migrate-chatmodes.mjs"
    description: "Automated migration script"
  - path: ".github/agents/agent.md"
    description: "Target agent index"
---

# Chatmode to Agent Migration Plan

## Executive Summary

This document outlines the migration plan to convert `.chatmode.md` files to `.agent.md` format, aligning with VS Code's terminology change introduced in version 1.106 (June 2025). This migration ensures compatibility with VS Code's native agent features while maintaining backward compatibility during the transition period.

## Background

### VS Code Terminology Change

Starting with VS Code 1.106, custom chat modes were renamed to "chat agents" to align with GitHub Copilot's terminology:

- **Old Format**: `.chatmode.md` files in `.github/chatmodes/` or `.vscode/`
- **New Format**: `.agent.md` files in `.github/agents/` or `.vscode/`

### Key Differences

| Aspect | Old (Chatmode) | New (Agent) |
|--------|----------------|-------------|
| File Extension | `.chatmode.md` | `.agent.md` |
| Folder Location | `.github/chatmodes/` | `.github/agents/` |
| file_type | `"chatmode"` | `"agent"` |
| Required Fields | `description` | `description` |
| Name Field | `title` or `id` | `name` |
| Tools Field | Optional | Standardized list |

---

## Migration Scope

### Source Files

```
.github/chatmodes/
├── chatmodes.md                    # Main index
├── code-quality-guru.chatmode.md   # LightSpeed modes
├── devops-helper.chatmode.md
├── ls-block-expert.chatmode.md
└── awesome-copilot/                # Awesome Copilot collection
    ├── index.chatmodes.md
    └── [89 chatmode files]
```

### Target Structure

```
.github/agents/
├── agent.md                        # Main index (existing, update required)
├── code-quality-guru.agent.md      # Migrated LightSpeed agents
├── devops-helper.agent.md
├── ls-block-expert.agent.md
└── awesome-copilot/                # Migrated collection
    ├── index.agent.md
    └── [89 agent files]
```

---

## Detailed File Mappings

### LightSpeed Core Files

| Source | Target | Notes |
|--------|--------|-------|
| `.github/chatmodes/chatmodes.md` | `.github/agents/agent.md` | Merge with existing index |
| `.github/chatmodes/code-quality-guru.chatmode.md` | `.github/agents/code-quality-guru.agent.md` | Convert frontmatter |
| `.github/chatmodes/devops-helper.chatmode.md` | `.github/agents/devops-helper.agent.md` | Convert frontmatter |
| `.github/chatmodes/ls-block-expert.chatmode.md` | `.github/agents/ls-block-expert.agent.md` | Convert frontmatter |

### Awesome Copilot Collection

| Source | Target | Notes |
|--------|--------|-------|
| `awesome-copilot/index.chatmodes.md` | `awesome-copilot/index.agent.md` | Update index references |
| `awesome-copilot/accessibility-review.chatmode.md` | `awesome-copilot/accessibility-review.agent.md` | |
| `awesome-copilot/code-review.chatmode.md` | `awesome-copilot/code-review.agent.md` | |
| `awesome-copilot/refactoring.chatmode.md` | `awesome-copilot/refactoring.agent.md` | |
| ... | ... | 86 additional files |

---

## Frontmatter Transformation

### Before (Chatmode)

```yaml
---
file_type: chatmode
id: code-quality-guru
title: "Code Quality Guru"
description: "A pragmatic reviewer focused on maintainability"
version: "2.0"
tools:
  - browser
  - codebase
---
```

### After (Agent)

```yaml
---
file_type: "agent"
name: "Code Quality Guru"
description: "A pragmatic reviewer focused on maintainability"
version: "2.0"
tools:
  - codebase
  - search
  - editFiles
  - problems
  - runTests
# Legacy fields preserved for backward compatibility
title: "Code Quality Guru"
---
```

### Field Mapping Rules

| Old Field | New Field | Transformation |
|-----------|-----------|----------------|
| `file_type: chatmode` | `file_type: "agent"` | Direct replacement |
| `id: value` | `name: "value"` | Renamed, quoted |
| `title: value` | `name: "value"` | Use as name if no id |
| `description` | `description` | Keep as-is |
| `tools` | `tools` | Map to VS Code tool names |

### Tools Mapping

Old tool names to new VS Code standard tool names:

| Old Tool | New Tool | Description |
|----------|----------|-------------|
| `browser` | `fetchWebpage` | Fetch web content |
| `codebase` | `codebase` | Codebase context |
| `search` | `search` | Search workspace |
| `terminal` | `runCommands` | Run terminal commands |
| `tests` | `runTests` | Run tests |
| `files` | `editFiles` | Edit files |
| `problems` | `problems` | Problems panel |
| `usages` | `usages` | Find usages |

---

## Migration Phases

### Phase 1: Schema Update ✅

**Status**: Complete

- [x] Update `schemas/frontmatter.schema.json` to support both formats
- [x] Add `file_type: ["agent", "chatmode"]` union type
- [x] Add VS Code native agent fields (`name`, `tools`, `handoffs`)
- [x] Mark legacy fields as deprecated

### Phase 2: Migration Script ✅

**Status**: Complete

- [x] Create `scripts/migrate-chatmodes.mjs`
- [x] Support `--dry-run` mode for preview
- [x] Support `--verbose` mode for debugging
- [x] Handle file transformations
- [x] Generate migration report

### Phase 3: Execute Migration

**Status**: Pending

```bash
# Preview changes
node scripts/migrate-chatmodes.mjs --dry-run --verbose

# Execute migration
node scripts/migrate-chatmodes.mjs

# Force overwrite existing files
node scripts/migrate-chatmodes.mjs --force
```

### Phase 4: Post-Migration Cleanup

**Status**: Pending

1. Update agent.md index with migrated files
2. Update cross-references in documentation
3. Delete empty chatmodes/ folder
4. Update VS Code settings.json file associations
5. Commit and push changes

---

## Execution Commands

### Step 1: Preview Migration

```bash
cd /Users/ash/Studio/.github
node scripts/migrate-chatmodes.mjs --dry-run --verbose
```

### Step 2: Execute Migration

```bash
node scripts/migrate-chatmodes.mjs
```

### Step 3: Verify Migration

```bash
# Check migrated files
ls -la .github/agents/

# Check awesome-copilot subfolder
ls -la .github/agents/awesome-copilot/

# Validate frontmatter
npm run validate:agents
```

### Step 4: Cleanup

```bash
# Verify chatmodes folder is empty
ls -la .github/chatmodes/

# Remove if empty
rm -rf .github/chatmodes/
```

---

## Reference Updates Required

### Files to Update After Migration

| File | Update Required |
|------|-----------------|
| `.github/agents/agent.md` | Add migrated files to index |
| `.github/custom-instructions.md` | Update chatmodes references to agents |
| `README.md` | Update documentation links |
| `.vscode/settings.json` | Update file associations |
| `AGENTS.md` | Update cross-references |
| `docs/CHATMODE-FRONTMATTER.md` | Mark as deprecated |

### VS Code Settings Update

```json
{
  "files.associations": {
    "*.chatmode.md": "markdown",  // Keep for backward compat
    "*.agent.md": "markdown"       // Add new format
  }
}
```

---

## Rollback Plan

If issues arise during migration:

1. **Restore from backup** (migration script creates backups)

2. **Revert schema changes** via git:

   ```bash
   git checkout HEAD~1 -- schemas/frontmatter.schema.json
   ```

3. **Recreate chatmodes folder**:

   ```bash
   git checkout HEAD~1 -- .github/chatmodes/
   ```

---

## Success Criteria

- [ ] All `.chatmode.md` files migrated to `.agent.md`
- [ ] All frontmatter converted to new format
- [ ] Agent index updated with migrated files
- [ ] No broken cross-references
- [ ] chatmodes/ folder removed
- [ ] Documentation updated
- [ ] VS Code recognizes new agent files

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Schema Update | 1 hour | ✅ Complete |
| Migration Script | 2 hours | ✅ Complete |
| Execute Migration | 30 minutes | ⏳ Pending |
| Post-Migration Cleanup | 1 hour | ⏳ Pending |
| Documentation Update | 1 hour | ⏳ Pending |

**Total Estimated Time**: 5.5 hours

---

## Related Documentation

- [VS Code Chat Agents Documentation](https://code.visualstudio.com/docs/copilot/customization/custom-chat-modes)
- [Agent Index](.github/agents/agent.md)
- [Frontmatter Schema](schemas/frontmatter.schema.json)
- [Chatmode Frontmatter (Deprecated)](docs/CHATMODE-FRONTMATTER.md)

---

*This migration plan ensures a smooth transition from the legacy chatmode format to the new VS Code agent standard while maintaining backward compatibility.*
