---
title: ADR Generator — Installation & Setup Guide
description: Get started with the ADR Generator agent in your project
---

# ADR Generator Installation Guide

Complete guide for installing and configuring the ADR Generator agent in your repository.

## Quick Start

### 1. Copy Configuration Template

```bash
# Copy the default ADR configuration to your repository root
cp examples/control-plane-config.json .adr-config.json

# For WordPress plugins:
cp examples/wordpress-plugin-config.json .adr-config.json

# For WordPress themes:
cp examples/wordpress-theme-config.json .adr-config.json
```

### 2. Initialize ADR Directory

```bash
# Create the ADR directory (default: docs/adr)
mkdir -p docs/adr

# Verify configuration
cat .adr-config.json
```

### 3. Create Your First ADR

```bash
# Use the agent to create a new ADR
claude adr-generator create "Decision about database choice"

# Verify the file was created
ls docs/adr/0001-decision-about-database-choice.md
```

### 4. Validate ADRs

```bash
# Run validation rules
claude adr-generator validate

# Should output: ✅ All validation rules passed
```

## Configuration Guide

### Basic Configuration

```json
{
  "adr": {
    "directory": "docs/adr",
    "template": "standard",
    "number_format": {
      "style": "sequential",
      "zero_padded": true,
      "width": 4
    }
  }
}
```

### Configuration Inheritance

The agent supports two-level inheritance for shared defaults:

1. **Organization level** — `.adr-config.json` in shared org repo
2. **Repository level** — `.adr-config.json` in current repo (overrides org)

To use org defaults:

```bash
# Agent will load org config, then apply repo overrides
claude adr-generator validate --org-config /path/to/org/.adr-config.json
```

## Advanced Setup

### WordPress Plugin Setup

```json
{
  "adr": {
    "directory": "docs/decisions",
    "template": "standard",
    "custom_fields": {
      "wordpress": {
        "impact_areas": ["performance", "security"],
        "backwards_compatible": true,
        "performance_tier": "medium"
      }
    },
    "validation": {
      "enforce_unique_titles": true,
      "enforce_valid_references": true,
      "minimum_content_length": 150
    }
  }
}
```

### Custom Numbering Scheme

```json
{
  "adr": {
    "number_format": {
      "style": "date-based",
      "pattern": "YYYY-MM-DD"
    }
  }
}
```

### Approval Workflow

```json
{
  "adr": {
    "approval_workflow": {
      "enabled": true,
      "method": "codeowners",
      "required_approvals": 2
    }
  }
}
```

## Project Structure

```
project-root/
├── .adr-config.json              # Configuration file
├── docs/
│   └── adr/
│       ├── 0001-first-decision.md
│       ├── 0002-second-decision.md
│       └── 0003-third-decision.md
└── (other project files)
```

## Validation Rules

The agent enforces 6 validation rules:

| Rule | Purpose | Configurable |
|------|---------|--------------|
| **Unique Titles** | No duplicate decision titles | Yes |
| **Valid References** | All ADR cross-references exist | Yes |
| **Status Transitions** | Valid state changes (PROPOSED → ACCEPTED → SUPERSEDED) | Yes |
| **Format** | Required frontmatter and markdown structure | Yes |
| **Filename Format** | Matches NNNN-slug.md pattern | Yes |
| **Metadata** | Required fields present and non-empty | Yes |

### Disabling Rules

```json
{
  "adr": {
    "validation": {
      "enforce_unique_titles": false,
      "enforce_valid_references": true
    }
  }
}
```

## Troubleshooting

### Configuration File Not Found

```bash
# Verify .adr-config.json exists and is valid
ls -la .adr-config.json

# Validate JSON syntax
cat .adr-config.json | jq .
```

### Validation Failures

```bash
# Run validation with verbose output
claude adr-generator validate --verbose

# Check specific rule
claude adr-generator validate --rule enforce-unique-titles
```

### Permission Issues

```bash
# Ensure ADR directory is writable
chmod 755 docs/adr
ls -la docs/ | grep adr
```

### Template Issues

```bash
# List available templates
claude adr-generator templates list

# Check template content
claude adr-generator templates show standard
```

## Next Steps

1. ✅ Copy configuration template
2. ✅ Create ADR directory
3. ✅ Create first ADR
4. ✅ Validate ADRs
5. 👉 Set up CI/CD integration (see `ARCHITECTURE.md`)
6. 👉 Team training (see `BEST_PRACTICES.md`)

## References

- **Configuration Reference**: `CONFIGURATION_REFERENCE.md`
- **Best Practices**: `BEST_PRACTICES.md`
- **Architecture**: `ARCHITECTURE.md`
- **Main Skill**: `../SKILL.md`
