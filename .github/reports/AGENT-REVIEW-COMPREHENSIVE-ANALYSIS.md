---
file_type: documentation
title: Agent Frontmatter Review - Comprehensive Analysis
description: Complete audit and update strategy for agent files
version: v1.0
last_updated: 2025-11-20
status: active
tags:
  - agents
  - copilot
  - audit
  - frontmatter
---

# Agent Frontmatter Review - Comprehensive Analysis

## Executive Summary

This document summarizes the comprehensive review of all agent files (`.agent.md`) in the LightSpeed organization. The audit identified significant gaps between current implementations and GitHub Copilot specifications, as well as issues with script references, schema references, and workflow integrations.

**Key Findings**:

- ❌ **13 agent files** require significant updates
- ❌ **Guardrails** missing from most agents
- ❌ **Tools** configuration not specified in frontmatter
- ❌ **Handoffs** between agents not configured
- ⚠️ **Schema references** using inconsistent paths
- ⚠️ **Script files** referenced but not properly documented
- ⚠️ **Workflow integrations** incomplete or missing

## Detailed Findings

### Critical Issues (MUST FIX)

#### 1. Missing Copilot Frontmatter Fields

**Current State**: Most agents lack Copilot-specific frontmatter

**Required Fields** (from Copilot spec):

- `description` ✗ Some missing
- `tools` ✗ Not specified in any agent
- `handoffs` ✗ Not configured
- `target` ✗ Not specified

**Example Missing Config**:

```yaml
---
tools: ["read", "edit", "search", "github/*"]
handoffs:
  - label: After labeling complete
    agent: reviewer
    prompt: "Review the labeled items"
    send: false
target: github-copilot
---
```

#### 2. Guardrails Not Documented

**Current State**: Most agents lack guardrails sections

**Example Issues**:

- `labeling.agent.md`: No tool limitations documented
- `reviewer.agent.md`: No constraints on when/how it operates
- `release.agent.md`: No safety measures specified
- `branding.agent.md`: No limitations on file modifications

**Required For Each Agent**:

```markdown
## Guardrails

**Critical Constraints**:

1. [Operational constraint]
2. [Data constraint]
3. [Scope constraint]

**Tool Limitations**:

- Tool X: [Specific limitation]
- Tool Y: [Specific limitation]

**Safety Measures**:

- [Measure 1]
- [Measure 2]
```

#### 3. Schema References Incorrect

**Current Issues**:

- `branding.agent.md` references: `../../schemas/header-footer-agent/agent-config.schema.json`
  - ❌ Uses relative path `../../`
  - ✅ Should be: `schemas/header-footer-agent/agent-config.schema.json`

- `header-footer.agent.md` references non-existent schemas
  - ❌ References: `../../schemas/header.schema.json` and `../../schemas/footer.schema.json`
  - ✅ Should reference: `schemas/header-footer-agent/agent-config.schema.json`

- Other agents don't reference schemas at all
  - ❌ Should reference: `schemas/agent-frontmatter.schema.json`

**Fix Required**: Update all schema paths to use absolute paths from repo root

#### 4. Script File References Missing/Incorrect

**Current Issues**:

| Agent                   | Script File                          | Status     |
| ----------------------- | ------------------------------------ | ---------- |
| `labeling.agent.md`     | `.github/agents/labeling.agent.js`   | ✓ Exists   |
| `reviewer.agent.md`     | `.github/agents/reviewer.agent.js`   | ✓ Exists   |
| `branding.agent.md`     | `.github/agents/branding.agent.js`   | ✓ Exists   |
| `issue-type.agent.md`   | `.github/agents/issue-type.agent.js` | ✓ Exists   |
| `jsdoc-review.agent.md` | No script reference                  | ❌ Missing |

**Files Not Referenced**:

- `.github/agents/includes/label-lookup.js`
- `.github/agents/includes/status-enforcer.js`
- `.github/agents/includes/label-reporting.js`
- Many other utility modules

#### 5. Workflow Integration Incomplete

**Issues**:

| Agent               | Workflow                         | Status        | Integration            |
| ------------------- | -------------------------------- | ------------- | ---------------------- |
| `labeling.agent.md` | `.github/workflows/labeling.yml` | ✓ File exists | ⚠️ References outdated |
| `reviewer.agent.md` | `.github/workflows/reviewer.yml` | ✓ File exists | ⚠️ No trigger docs     |
| `planner.agent.md`  | `.github/workflows/planner.yml`  | ✓ File exists | ⚠️ No trigger docs     |
| `release.agent.md`  | `.github/workflows/release.yml`  | ✓ File exists | ⚠️ No trigger docs     |
| `branding.agent.md` | `.github/workflows/branding.yml` | ✓ File exists | ⚠️ References outdated |

**Missing Documentation**:

- Trigger events for each workflow
- Required GitHub permissions
- Workflow execution order/dependencies

### Moderate Issues (SHOULD FIX)

#### 6. Frontmatter Fields Inconsistent

**Current State**: LightSpeed-specific fields inconsistently applied

| Field              | Used In    | Status                 |
| ------------------ | ---------- | ---------------------- |
| `file_type: agent` | Some files | ⚠️ Inconsistent        |
| `version`          | Some files | ⚠️ Inconsistent format |
| `last_updated`     | Some files | ⚠️ Inconsistent dates  |
| `owners`           | Most files | ⚠️ Inconsistent format |
| `tags`             | Most files | ⚠️ Inconsistent values |
| `references`       | Some files | ⚠️ Missing from many   |

**Required Standardization**:

```yaml
file_type: agent # Always
version: v1.0 # Semantic versioning
last_updated: 2025-11-20 # ISO format
owners: [team] # Array
tags: [tag1, tag2] # Array of keywords
references: # Array of objects
  - path: ...
    description: ...
```

#### 7. Agent Status Not Clearly Indicated

**Current Issues**:

- `badges.agent.md`: Active but deprecated (consolidated into branding)
- `header-footer.agent.md`: Active but deprecated (consolidated into branding)
- `jsdoc-review.agent.md`: Unclear if active or planning

**Required Additions**:

```yaml
status: active # or deprecated, planning, experimental, archived

# For deprecated agents:
deprecation_note: "Consolidated into branding.agent.md"
deprecation_date: 2025-11-20
migration_path: "See branding.agent.md for unified automation"

# For consolidation agents:
deprecates:
  - badges.agent.md
  - header-footer.agent.md
```

#### 8. Handoffs Not Configured

**Current State**: No agents define handoffs to other agents

**Example Needed**:

```yaml
handoffs:
  - label: Review labeled items
    agent: reviewer
    prompt: "Review the issues/PRs that were just labeled"
    send: false

  - label: Plan PR merge
    agent: planner
    prompt: "Create merge checklist for the PR"
    send: false
```

**Recommended Handoff Chains**:

1. `labeling` → `reviewer` → `planner` → `release`
2. `issue-type` → `labeling` → `reviewer`
3. `branding` → (no handoff needed)

### Minor Issues (NICE TO HAVE)

#### 9. Tool Configuration Not Comprehensive

**Current State**: Agents don't fully specify available tools

**Examples Needed**:

For `labeling.agent.md`:

```yaml
tools:
  - read # Read PR/issue content
  - edit # Modify labels
  - search # Find label definitions
  - github/* # Access GitHub API
```

For `reviewer.agent.md`:

```yaml
tools:
  - read # Analyze PR content
  - search # Find related code
  - github/* # Access GitHub API
```

#### 10. Agent Capabilities Not Fully Documented

**Current Issues**:

- Descriptions are too brief
- Capabilities not itemized
- Limitations not explicit

**Required Additions**:

```markdown
## Capabilities

1. [Capability 1]
2. [Capability 2]
3. [Capability 3]

## Limitations

1. [Limitation 1]
2. [Limitation 2]

## Supported Tools

- `read`: Limited to repository files
- `edit`: Cannot modify protected files
- `github/*`: Scoped to source repository
```

## Audit Summary by Agent

### Priority 1: CRITICAL UPDATES NEEDED

#### labeling.agent.md

- ❌ No tools specified
- ❌ No handoffs configured
- ❌ Guardrails missing
- ⚠️ Schema reference incorrect
- ⚠️ Workflow reference outdated

**Status**: 🔴 CRITICAL

#### reviewer.agent.md

- ❌ No tools specified
- ❌ No handoffs configured
- ❌ Guardrails missing
- ⚠️ Workflow integration incomplete

**Status**: 🔴 CRITICAL

#### planner.agent.md

- ❌ No tools specified
- ❌ No handoffs configured
- ❌ Guardrails missing

**Status**: 🔴 CRITICAL

#### release.agent.md

- ❌ No tools specified
- ❌ No handoffs configured
- ❌ Guardrails missing
- ⚠️ Workflow reference outdated

**Status**: 🔴 CRITICAL

### Priority 2: ESSENTIAL UPDATES NEEDED

#### branding.agent.md

- ✓ Tools specified (good)
- ❌ No handoffs configured
- ⚠️ Schema references incorrect (relative paths)
- ⚠️ Deprecation status not documented
- ⚠️ Should mark consolidated agents as deprecated

**Status**: 🟠 HIGH

#### project-meta-sync.agent.md

- ❌ No tools specified
- ❌ No handoffs configured
- ❌ Guardrails missing
- ⚠️ References incomplete

**Status**: 🟠 HIGH

#### metrics.agent.md

- ❌ No tools specified
- ❌ No handoffs configured
- ❌ Guardrails missing
- ⚠️ Implementation missing

**Status**: 🟠 HIGH

### Priority 3: IMPORTANT UPDATES NEEDED

#### manage-readmes.agent.md

- ❌ No tools specified
- ❌ Guardrails missing
- ⚠️ References incomplete
- ⚠️ Script status unclear

**Status**: 🟡 MEDIUM

#### issue-type.agent.md

- ❌ No tools specified
- ❌ Guardrails missing
- ⚠️ Implementation minimal (stub only)
- ⚠️ References incomplete

**Status**: 🟡 MEDIUM

#### label-standardization.agent.md

- ❌ No tools specified
- ❌ Guardrails missing
- ⚠️ Implementation minimal (stub only)

**Status**: 🟡 MEDIUM

### Priority 4: DEPRECATION/CLEANUP NEEDED

#### badges.agent.md

- ❌ Status not marked as deprecated
- ❌ Migration path not documented
- ⚠️ Should consolidate into branding.agent.md

**Status**: 🟡 DEPRECATED

#### header-footer.agent.md

- ❌ Status not marked as deprecated
- ❌ Migration path not documented
- ⚠️ Should consolidate into branding.agent.md
- ❌ Schema references incorrect

**Status**: 🟡 DEPRECATED

#### jsdoc-review.agent.md

- ❌ Status unclear (active or planning?)
- ❌ No tools specified
- ❌ No implementation
- ⚠️ References incomplete

**Status**: 🟡 PLANNING/STALE

## New Resources Created

### 1. Agent Frontmatter Schema

**File**: `schemas/agent-frontmatter.schema.json`

**Purpose**: Complete JSON schema for agent frontmatter validation

**Includes**:

- ✓ All Copilot required fields
- ✓ All LightSpeed extended fields
- ✓ Tools and handoffs specification
- ✓ MCP server configuration support
- ✓ Validation examples

### 2. Update Implementation Guide

**File**: `.github/reports/AGENT-FRONTMATTER-UPDATE-GUIDE.md`

**Purpose**: Step-by-step guide for updating all agents

**Includes**:

- ✓ Agent update checklist
- ✓ Detailed instructions per agent
- ✓ Common issues and solutions
- ✓ Validation procedures
- ✓ Timeline and responsibilities
- ✓ Completion criteria

### 3. Agent Validation Script

**File**: `scripts/validate-agents.js`

**Purpose**: Automated validation of all agent files

**Features**:

- ✓ Schema validation against agent-frontmatter.schema.json
- ✓ Reference verification (scripts, workflows, schemas)
- ✓ Tool configuration validation
- ✓ Handoff circular dependency detection
- ✓ Workflow existence checking
- ✓ JSON and human-readable output

**Usage**:

```bash
node scripts/validate-agents.js              # Validate all
node scripts/validate-agents.js labeling     # Validate specific agent
node scripts/validate-agents.js --json       # JSON output
node scripts/validate-agents.js --verbose    # Detailed output
```

### 4. Audit Report Notebook

**File**: `.github/reports/agent-frontmatter-audit.ipynb`

**Purpose**: Comprehensive audit findings and status

**Includes**:

- ✓ Current state analysis
- ✓ Gap identification
- ✓ Issue categorization
- ✓ Reference status matrix
- ✓ Update tracking

## Recommended Action Plan

### Phase 1: Preparation (1 day)

- [ ] Review this analysis document
- [ ] Read VS Code Copilot agent documentation
- [ ] Run validation script to establish baseline
- [ ] Review agent-frontmatter.schema.json

### Phase 2: Core Agents (2 days)

- [ ] Update `labeling.agent.md`
- [ ] Update `reviewer.agent.md`
- [ ] Update `planner.agent.md`
- [ ] Update `release.agent.md`

### Phase 3: Essential Agents (1 day)

- [ ] Update `branding.agent.md` (consolidation)
- [ ] Update `project-meta-sync.agent.md`
- [ ] Update `metrics.agent.md`

### Phase 4: Specialized Agents (1 day)

- [ ] Update `manage-readmes.agent.md`
- [ ] Update `issue-type.agent.md`
- [ ] Update `label-standardization.agent.md`

### Phase 5: Deprecation & Validation (1 day)

- [ ] Mark `badges.agent.md` as deprecated
- [ ] Mark `header-footer.agent.md` as deprecated
- [ ] Review `jsdoc-review.agent.md` status
- [ ] Run comprehensive validation
- [ ] Create PR with all changes

**Total Timeline**: ~6 days for complete implementation

## Success Criteria

✅ **Agent Update Complete When**:

- [ ] All 13 agent files reviewed
- [ ] All required Copilot fields added
- [ ] All LightSpeed extended fields verified
- [ ] All schema references corrected
- [ ] All workflow links verified
- [ ] All script files properly documented
- [ ] Guardrails section added to each agent
- [ ] Tools array populated appropriately
- [ ] Handoffs configured (where applicable)
- [ ] Deprecated agents marked with migration path
- [ ] All files pass validation script
- [ ] No broken references
- [ ] No circular handoff dependencies
- [ ] All changes documented in PR

## Next Steps

1. **Review This Document**: Ensure alignment on findings and approach
2. **Run Validation Script**: `node scripts/validate-agents.js --verbose`
3. **Create Implementation Branch**: `git checkout -b feat/update-agent-frontmatter`
4. **Begin Phase 1 Updates**: Start with core agents
5. **Commit Progress**: Commit after each agent update
6. **Create Pull Request**: When all agents updated
7. **Request Review**: From automation team
8. **Merge**: Once approved

## References

- [VS Code Copilot Agent Documentation](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Agent Frontmatter Schema](schemas/agent-frontmatter.schema.json)
- [Update Implementation Guide](.github/reports/AGENT-FRONTMATTER-UPDATE-GUIDE.md)
- [Audit Report Notebook](.github/reports/agent-frontmatter-audit.ipynb)
- [Validation Script](scripts/validate-agents.js)

---

**Document Version**: v1.0  
**Status**: Active - Comprehensive Analysis Complete  
**Last Updated**: 2025-11-20  
**Next Review**: After agent updates completed
