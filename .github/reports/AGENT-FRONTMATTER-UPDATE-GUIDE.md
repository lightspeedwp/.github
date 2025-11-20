---
file_type: documentation
title: Agent Frontmatter Update Implementation Guide
description: Step-by-step guide for updating all agent files to meet Copilot specifications
version: v1.0
last_updated: 2025-11-20
authors:
  - GitHub Copilot Audit
status: active
tags:
  - agents
  - copilot
  - frontmatter
  - implementation
---

# Agent Frontmatter Update Implementation Guide

## Overview

This guide provides step-by-step instructions to update all `.agent.md` files in the LightSpeed organization to meet GitHub Copilot specifications and LightSpeed standards.

**Audit Report**: See `agent-frontmatter-audit.ipynb` for comprehensive analysis

## Prerequisites

1. Review the audit notebook: `.github/reports/agent-frontmatter-audit.ipynb`
2. Understand Copilot agent structure from [VS Code Documentation](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
3. Familiarize yourself with tool aliases and handoffs concepts
4. Have access to all agent files in `.github/agents/`

## File List to Update

### Priority 1: Core Agents (CRITICAL)

- [ ] `labeling.agent.md` - **Unified labeling system**
- [ ] `reviewer.agent.md` - **PR review automation**
- [ ] `planner.agent.md` - **PR checklist management**
- [ ] `release.agent.md` - **Release automation**

### Priority 2: Essential Agents

- [ ] `project-meta-sync.agent.md` - Project synchronization
- [ ] `branding.agent.md` - Header/footer/badge automation (CONSOLIDATION)
- [ ] `metrics.agent.md` - Metrics collection

### Priority 3: Specialized Agents

- [ ] `manage-readmes.agent.md` - README automation
- [ ] `issue-type.agent.md` - Issue type assignment
- [ ] `label-standardization.agent.md` - Label migration

### Deprecated (Update Status Only)

- [ ] `badges.agent.md` - Mark as deprecated (consolidated into branding)
- [ ] `header-footer.agent.md` - Mark as deprecated (consolidated into branding)
- [ ] `jsdoc-review.agent.md` - Complete planning or mark deprecated

## Update Process

### Step 1: Backup Existing Files

```bash
cd .github/agents
for file in *.agent.md; do
  cp "$file" "$file.backup-$(date +%Y%m%d)"
done
```

### Step 2: For Each Agent File

#### A. Update Frontmatter

1. **Add Required Copilot Fields** (if missing):

   ```yaml
   tools: [list of applicable tools]
   handoffs: [if applicable, define next agents]
   ```

2. **Add/Verify LightSpeed Extended Fields**:

   ```yaml
   file_type: agent
   version: v1.0 # or increment from current
   last_updated: "2025-11-20"
   references:
     - path: [path to script, workflow, schema]
       description: [what this reference is]
   ```

3. **Correct Schema References**:
   - Update relative paths to use absolute paths from repo root
   - For branding-related agents: `schemas/header-footer-agent/agent-config.schema.json`
   - For others: `schemas/frontmatter.schema.json`

#### B. Update Agent Body

1. **Add/Enhance Guardrails Section**:

   ```markdown
   ## Guardrails

   **Critical Constraints**:

   1. [First constraint]
   2. [Second constraint]

   **Tool Limitations**:

   - Tool X: [specific limitation]

   **Safety Measures**:

   - [Measure 1]
   - [Measure 2]
   ```

2. **Update Workflow Integration Section**:
   - Verify workflow file name and path
   - Document trigger events
   - List required permissions

3. **Document Tool Configuration**:
   - List each tool and its purpose in this agent
   - Document any limitations
   - Note MCP server requirements if any

### Step 3: Validation

#### A. Schema Validation

```bash
# Validate frontmatter against schema
node scripts/validate-frontmatter.js .github/agents/{agent-name}.agent.md
```

#### B. Reference Verification

- [ ] Script file exists: `.github/agents/{agent-name}.agent.js`
- [ ] Workflow file exists: `.github/workflows/{workflow-name}.yml`
- [ ] All schema references point to existing files
- [ ] No broken relative paths

#### C. Consistency Check

- [ ] Agent name matches filename (without `.agent.md`)
- [ ] Description is clear and concise
- [ ] Tools list uses only valid aliases
- [ ] Handoffs reference existing agents (no cycles)
- [ ] All references have descriptions

### Step 4: Testing

```bash
# Local testing (if agent is runnable)
node .github/agents/{agent-name}.agent.js --dry-run

# Validate against schema
npm run validate:schemas
```

## Detailed Agent Updates

### labeling.agent.md

**Current State**: Active, needs significant updates

**Tools to Add**:

```yaml
tools:
  - read # Examine issue/PR content
  - edit # Modify labels
  - search # Find label definitions
  - github/* # Access GitHub API
```

**Handoffs**:

```yaml
handoffs:
  - label: After labeling
    agent: reviewer
    prompt: "Review the labeled items"
    send: false
```

**References to Add/Update**:

```yaml
references:
  - path: .github/agents/labeling.agent.js
    description: Main agent implementation
  - path: .github/agents/includes/label-lookup.js
    description: Label lookup utilities
  - path: .github/agents/includes/status-enforcer.js
    description: Status/priority/type enforcement
  - path: .github/workflows/labeling.yml
    description: Labeling workflow trigger
  - path: .github/automation/labels.yml
    description: Canonical label definitions
  - path: .github/automation/labeler.yml
    description: File-based labeling rules
  - path: schemas/frontmatter.schema.json
    description: Frontmatter validation
```

**Guardrails to Add**:

```markdown
## Guardrails

**Critical Constraints**:

1. Only apply labels from canonical labels.yml
2. Enforce one-hot constraint: exactly one label per family (status, priority, type)
3. Never remove labels without proper migration
4. Verify all operations via GitHub API

**Tool Limitations**:

- read: Limited to repository files
- edit: Cannot modify protected files
- search: Searches only within repository
- github/\*: Scoped to source repository

**Safety Measures**:

- All operations are logged for audit trail
- Support dry-run mode for testing
- Validate configuration before any changes
- Automatic rollback on critical errors
```

### reviewer.agent.md

**Tools to Add**:

```yaml
tools:
  - read # Analyze PR content
  - search # Find related code
  - github/* # Access GitHub API
```

**Handoffs**:

```yaml
handoffs:
  - label: After review
    agent: planner
    prompt: "Update the PR planning checklist"
    send: false
```

**Guardrails**:

```markdown
## Guardrails

**Critical Constraints**:

1. Never block merges without explicit configuration
2. Only post one comment per PR (update, don't duplicate)
3. Never output secrets or sensitive information
4. Always validate CI status before reporting

**Safety Measures**:

- Log all analysis results
- Support dry-run mode
- Handle API errors gracefully
- Rate limit API calls
```

### branding.agent.md

**Current State**: Active but consolidates deprecated agents

**Special Handling**:

```yaml
deprecates:
  - badges.agent.md # Consolidated into branding
  - header-footer.agent.md # Consolidated into branding
```

**Tools**:

```yaml
tools:
  - read # Examine documentation files
  - edit # Update headers/footers/badges
  - shell # Execute badge scripts
```

**Update badges.agent.md Status**:

```yaml
status: deprecated
deprecation_note: "Consolidated into branding.agent.md"
deprecation_date: "2025-11-20"
migration_path: "See branding.agent.md for unified automation"
```

**Update header-footer.agent.md Status**:

```yaml
status: deprecated
deprecation_note: "Consolidated into branding.agent.md"
deprecation_date: "2025-11-20"
migration_path: "See branding.agent.md for unified automation"
```

## Post-Update Verification

### Checklist

- [ ] All 13 agent files reviewed
- [ ] All required Copilot fields added
- [ ] All LightSpeed extended fields verified
- [ ] All schema references corrected
- [ ] All workflow links verified
- [ ] All script files exist
- [ ] Guardrails sections added
- [ ] Tools arrays populated
- [ ] Handoffs configured (where applicable)
- [ ] Deprecated agents marked
- [ ] All files validate against schema
- [ ] No broken references
- [ ] No circular handoff dependencies

### Validation Commands

```bash
# Comprehensive validation
npm run lint:all

# Schema validation
node scripts/validate-frontmatter.js .github/agents/**/*.agent.md

# Reference checking
grep -r "\.agent\.md" .github/agents/ | grep -v ".backup"
```

## Common Issues & Solutions

### Issue: Schema reference fails

**Solution**: Use absolute paths from repo root, e.g., `schemas/frontmatter.schema.json` not `../../schemas/`

### Issue: Script file not found

**Solution**: Verify script exists with exact name matching agent filename (minus `.agent.md`)

### Issue: Workflow reference broken

**Solution**: Check `.github/workflows/` for exact filename, update `.yml` extension if needed

### Issue: Circular handoff dependency

**Solution**: Ensure agents don't have handoffs pointing back to themselves

### Issue: Tool alias not recognized

**Solution**: Use only these aliases: shell, read, edit, search, custom-agent, web, todo

## Timeline & Responsibilities

### Phase 1: Core Agents (Days 1-2)

- labeling.agent.md
- reviewer.agent.md
- planner.agent.md
- release.agent.md

### Phase 2: Essential Agents (Days 3-4)

- branding.agent.md (consolidation)
- project-meta-sync.agent.md
- metrics.agent.md

### Phase 3: Specialized Agents (Days 5)

- manage-readmes.agent.md
- issue-type.agent.md
- label-standardization.agent.md

### Phase 4: Deprecation & Validation (Day 6)

- Mark deprecated agents
- Run comprehensive validation
- Update documentation
- Create PR with all changes

## Documentation Updates

After updating agent files, also update:

1. `.github/AGENTS.md` - Add references to updated agents
2. `.github/custom-instructions.md` - Update agent instructions
3. `docs/AGENTS.md` - Update public documentation
4. Workflow docs - Link to updated agents

## Questions & Support

For questions about specific agent updates, refer to:

- VS Code Copilot Agent Documentation: <https://code.visualstudio.com/docs/copilot/customization/custom-agents>
- LightSpeed AGENTS.md: `.github/AGENTS.md`
- Audit Report: `.github/reports/agent-frontmatter-audit.ipynb`

## Completion Criteria

✅ **Agent Update Complete When**:

- All required frontmatter fields present
- All optional fields verified
- Schema references corrected
- Workflow links verified
- Guardrails section added
- Tools array populated appropriately
- Handoffs configured (if applicable)
- Files validate against schema
- No broken references
- All changes documented in PR

---

**Document Version**: v1.0  
**Last Updated**: 2025-11-20  
**Status**: Active - Implementation Guide
