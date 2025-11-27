---
title: "Canonical Configuration Files"
description: "Organization-wide canonical label, type, and configuration definitions"
version: "v1.0"
last_updated: "2025-11-24"
file_type: "documentation"
---

# 📋 Canonical Automation Configuration

This directory contains the **canonical, authoritative** definitions for organization-wide automation configurations. These files are the single source of truth for labels, issue types, and related settings used across all LightSpeed repositories.

## 📂 Configuration Files

### `labels.yml`

**Purpose**: Canonical label definitions with colors, descriptions, and aliases  
**Scope**: Organization-wide; used by all repositories  
**Authority**: Platform Team (requires 2 approvals for changes)

**Structure**:

```yaml
- name: status:needs-triage
  color: "888888"
  description: "Waiting for triage and prioritization"
  aliases: ["needs-triage", "triage"]

- name: type:feature
  color: "1d76db"
  description: "New feature or enhancement"
  aliases: ["enhancement", "feature-request"]
```

**Label Families**:

- `status:*` - Workflow progression (one per issue/PR)
- `priority:*` - Urgency level (one per issue/PR)
- `type:*` - Nature of work (one per issue/PR)
- `area:*` - Codebase area
- `meta:*` - Process and release hygiene
- `contrib:*` - Community contributor labels

---

### `repository-categories.yml`

**Purpose**: Categorize repositories by type and purpose  
**Scope**: Organization-wide repository taxonomy  
**Authority**: Platform Team

**Structure**:

```yaml
categories:
  core:
    description: "Core infrastructure and shared utilities"
    repos:
      - ".github"
      - "php-mcp-development"

  features:
    description: "Feature-specific projects"
    repos:
      - "lsx-demo-theme"
```

---

### `repository-names.yml`

**Purpose**: Canonical repository naming conventions  
**Scope**: Guidelines for new repositories  
**Authority**: Platform Team

**Structure**:

```yaml
naming_conventions:
  packages: "lsx-{feature}-{type}"
  themes: "lsx-{name}-theme"
  plugins: "lsx-{feature}-plugin"
  tools: "lightspeed-{tool-name}"
```

---

## 🔄 How Changes Are Made

### Change Process

1. **Propose Change**: Create issue describing the label/category addition or modification
2. **Discussion**: Community feedback and use cases
3. **Create PR**: Update the relevant YAML file
4. **Review**: Requires 2 approvals from Platform Team
5. **Merge**: Change goes to `develop` branch
6. **Deploy**: Org-wide sync via `label-sync.yml` workflow
7. **Validation**: Verify changes in all member repositories

### Example: Adding a New Label

1. **Create Issue**: "Add new label: `type:performance`"
2. **PR Changes**:

   ```yaml
   - name: type:performance
     color: "fbca04"
     description: "Performance improvement or optimization"
     aliases: ["perf", "performance-optimization"]
   ```

3. **Review & Approve**: 2 Platform Team members
4. **Merge**: To `develop`
5. **Auto-Deploy**: Label appears in all repositories within hours

### Example: Modifying a Label

1. **Create Issue**: "Update `priority:critical` description"
2. **PR Changes**: Update color or description only (name is stable)
3. **Review & Approve**: 2 Platform Team members
4. **Merge**: To `develop`
5. **Auto-Deploy**: Changes propagate org-wide

### Deprecating Labels

1. **Create Issue**: "Deprecate `status:wip` label"
2. **Add to Deprecation List**:

   ```yaml
   - name: status:in-progress
     aliases: ["in progress", "wip", "status:wip"]
     # Previous aliases automatically migrated to canonical label
   ```

3. **Migration Grace Period**: 30 days for existing issues/PRs to be updated
4. **Auto-Migration**: Script migrates old labels to canonical form
5. **Removal**: After 30 days, deprecated label can be deleted

## 🎯 Usage in Member Repositories

### Auto-Sync Workflow

Member repositories should reference these canonical files:

```yaml
# .github/workflows/label-sync.yml in member repository
name: Label Sync
on:
  schedule:
    - cron: "0 9 * * 1" # Weekly
  workflow_dispatch:
jobs:
  sync:
    uses: lightspeedwp/.github/.github/workflows/label-sync.yml@develop
    with:
      labels_source: "lightspeedwp/.github/.github/automation/canonical/labels.yml"
    secrets: inherit
```

### Manual Reference

Developers can reference these files directly:

```bash
# View canonical labels
curl https://raw.githubusercontent.com/lightspeedwp/.github/develop/.github/automation/canonical/labels.yml

# Validate local labels against canonical
node scripts/validate-against-canonical.js
```

## 📊 Statistics & Maintenance

### Current Counts

- **Labels**: See `labels.yml`
- **Label Aliases**: See `labels.yml`
- **Repository Categories**: See `repository-categories.yml`
- **Naming Conventions**: See `repository-names.yml`

### Regular Maintenance Tasks

| Task                         | Frequency | Owner            |
| ---------------------------- | --------- | ---------------- |
| Review unused labels         | Quarterly | Platform Team    |
| Update repository categories | Annually  | Platform Team    |
| Audit label coverage         | Monthly   | Automation Agent |
| Migrate deprecated labels    | As-needed | Automation Agent |

## 🔐 Access Control

| Operation | Permission | Notes                              |
| --------- | ---------- | ---------------------------------- |
| View      | Public     | Anyone can read                    |
| Propose   | Issues     | Open to all contributors           |
| Modify    | PR Review  | 2 Platform Team approvals required |
| Merge     | Admin      | Platform Team only                 |
| Deploy    | Workflow   | Automated on merge to develop      |

## 🚀 Deployment

### Automatic Deployment

Changes automatically deploy via:

- **Workflow**: `.github/workflows/label-sync.yml`
- **Trigger**: Push to `develop` branch
- **Scope**: All LightSpeed repositories
- **Timing**: Runs hourly, on-demand via `workflow_dispatch`

### Manual Deployment (Emergency)

```bash
# Trigger label sync immediately
gh workflow run label-sync.yml -R lightspeedwp/.github

# Monitor deployment
gh run list -R lightspeedwp/.github -w label-sync.yml --limit 1
```

## 📚 Related Documentation

- [Automation Governance](.github/AUTOMATION_GOVERNANCE.md) - Governance policies
- [Label Strategy](docs/LABEL_STRATEGY.md) - Labeling taxonomy and usage
- [Labels Schema](schemas/README.md) - Label schema validation
- [Custom Instructions](.github/custom-instructions.md) - Organization standards

## 📞 Questions or Issues?

- **Propose Changes**: [Open an issue](../../issues/new)
- **Discuss**: [Start a discussion](../../discussions/new)
- **Contribute**: Follow the change process above
- **Contact**: Platform Team in Slack #platform-team

---

**Maintained by**: LightSpeed Platform Team  
**Last Updated**: 2025-11-24  
**Version**: v1.0  
**Authority**: Single source of truth for org-wide automation configuration
