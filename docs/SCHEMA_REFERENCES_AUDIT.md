---
title: "Schema References Audit"
description: "Complete audit of all schema file references across the LightSpeed organization to ensure consistency and correctness."
version: "v1.0"
last_updated: "2025-10-24"
author: "LightSpeed Team"
tags: ["schemas", "audit", "references", "documentation"]
---

# Schema References Audit

This document provides a comprehensive audit of all schema file references across the LightSpeed organization to ensure paths are correct and references are consistent.

## 📋 Schema File Inventory

### Root-Level Schemas (`/schemas/`)

- `agent-config.schema.json` - Configuration schema for agents
- `block-6.6.schema.json` - WordPress block configuration
- `changelog.schema.json` - Changelog entry validation
- `collection.schema.json` - Awesome Copilot collection structure
- `footer.schema.json` - Footer configuration schema
- `frontmatter.schema.json` - YAML frontmatter structure
- `header-footer.schema.json` - Combined header/footer schema
- `header.schema.json` - Header configuration schema
- `link-audit.json` - Link audit configuration
- `theme-6.6.schema.json` - WordPress theme.json v6.6 schema
- `version.schema.json` - Version number validation
- `coderabbit-overrides.v2.json` - CodeRabbit configuration overrides

### Subdirectory Schemas

#### `/schemas/frontmatter/`
- Contains frontmatter-related schemas for specialized use cases

#### `/schemas/header-footer-agent/`
- `agent-config.schema.json` - Branding agent configuration
- `footer.schema.json` - Footer schema for agent
- `header-footer.schema.json` - Combined schema for agent
- `header.schema.json` - Header schema for agent
- `README.md` - Documentation for agent schemas

#### `/schemas/wordpress/`
- WordPress-specific schemas and configurations

#### `/schemas/wp/`
- WordPress platform schemas

#### `/schemas/coderabbit/`
- CodeRabbit AI review tool configurations

## 🔍 Agent References Audit

### branding.agent.js
**Path**: `.github/agents/branding.agent.js`
**References**:
- ✅ `../../schemas/header-footer-agent/agent-config.schema.json` (CORRECT)

**Purpose**: Unified branding agent for headers, footers, and badges

### header-footer.agent.js
**Path**: `.github/agents/header-footer.agent.js`
**References**:
- ✅ `../../schemas/header.schema.json` (CORRECT - root level)
- ✅ `../../schemas/footer.schema.json` (CORRECT - root level)

**Purpose**: Deprecated agent for header/footer insertion (superseded by branding.agent.js)

### branding.agent.md
**Path**: `.github/agents/branding.agent.md`
**References**:
- ✅ `../../schemas/header-footer-agent/agent-config.schema.json` (CORRECT)

**Purpose**: Specification for unified branding agent

### header-footer.agent.md
**Path**: `.github/agents/header-footer.agent.md`
**References**:
- ✅ `../../schemas/header.schema.json` (CORRECT)
- ✅ `../../schemas/footer.schema.json` (CORRECT)

**Purpose**: Specification for deprecated header/footer agent

## 📚 Documentation References Audit

### header-footer.prompt.md
**Path**: `.github/prompts/agents/header-footer.prompt.md`
**Updated**: ✅ 2025-10-24
**References**:
- ✅ `../../schemas/header.schema.json` (CORRECT - root level)
- ✅ `../../schemas/footer.schema.json` (CORRECT - root level)
- ✅ `../../schemas/header-footer.schema.json` (CORRECT - root level)
- ✅ `../../schemas/header-footer-agent/agent-config.schema.json` (CORRECT - agent subfolder)

## 📖 Prompt References

### build-agent-and-tests.prompt.md
**Status**: ✅ No schema references found (general prompt)

### awesome-copilot/create-agentsmd.prompt.md
**Status**: ✅ No schema references (documentation generation)

### awesome-copilot/declarative-agents.prompt.md
**Status**: ✅ No schema references (Microsoft 365 Copilot guidance)

### awesome-copilot/finalize-agent-prompt.prompt.md
**Status**: ✅ No schema references (prompt polishing)

## 🤖 Chat Mode References Audit

### software-engineer-agent-v1.chatmode.md
**Status**: ✅ No direct schema references (operational guidance)

### declarative-agents-architect.chatmode.md
**Status**: ✅ No direct schema references (architecture guidance)

### meta-agentic-project-scaffold.chatmode.md
**Status**: ✅ No direct schema references (project setup guidance)

## ✅ Reference Validation Results

| File | Type | Status | Notes |
|------|------|--------|-------|
| branding.agent.js | Agent | ✅ PASS | Uses correct header-footer-agent path |
| header-footer.agent.js | Agent | ✅ PASS | Uses correct root-level schemas |
| branding.agent.md | Spec | ✅ PASS | References match implementation |
| header-footer.agent.md | Spec | ✅ PASS | References match implementation |
| header-footer.prompt.md | Prompt | ✅ PASS | All schema references corrected |

## 🎯 Best Practices for Schema References

### Organizational Patterns

1. **Root-Level Schemas**: General-purpose schemas used across the organization
   - Example: `header.schema.json`, `footer.schema.json`
   - Reference pattern: `../../schemas/filename.schema.json`

2. **Subdirectory Schemas**: Specialized schemas for specific agents or features
   - Example: `header-footer-agent/agent-config.schema.json`
   - Reference pattern: `../../schemas/subfolder/filename.schema.json`

3. **Localized Schemas**: Schemas specific to component/feature areas
   - Example: `frontmatter/`, `wordpress/`, `wp/`
   - Reference pattern: `../../schemas/area/filename.schema.json`

### Naming Conventions

- **Root schemas**: Lowercase, hyphen-separated (e.g., `header-footer.schema.json`)
- **Agent configs**: `agent-config.schema.json` in subdirectories
- **JSON configs**: `*.config.json` for application configurations
- **Overrides**: `*-overrides.v*.json` for tool-specific overrides

### Cross-Reference Guidelines

1. Always include both direct files and subdirectory variants in documentation
2. Use relative paths from the referencing file's location
3. Document the purpose and usage of each schema
4. Include links to both specification and implementation files
5. Update references when schema organization changes

## 📋 Migration Checklist for Future Reorganization

If header-footer schemas are moved in the future:

- [ ] Update all agent imports (`.js` files)
- [ ] Update all agent specifications (`.md` files)
- [ ] Update all prompt references (`.prompt.md` files)
- [ ] Update all documentation links
- [ ] Update this audit document
- [ ] Run linting to verify import paths
- [ ] Test agent functionality with new paths
- [ ] Update CI/CD validation scripts

## 🔗 Related Documentation

- [Schema Consolidation Initiative](./SCHEMA_CONSOLIDATION_INITIATIVE.md)
- [Schema Consolidation Roadmap](./SCHEMA_CONSOLIDATION_ROADMAP.md)
- [Coding Standards](../.github/instructions/coding-standards.instructions.md)
- [JSON Schema Instructions](../.github/instructions/json-schema.instructions.md)

---

**Last Verified**: 2025-10-24  
**Audit Type**: Comprehensive reference validation  
**Status**: ✅ All references valid and consistent
