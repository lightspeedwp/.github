---
title: "Issue Templates Directory"
description: "Standardized issue templates for the LightSpeedWP organization"
version: "v1.0"
last_updated: "2025-10-24"
maintainer: "LightSpeed Engineering"
tags: ["templates", "issues", "governance", "automation"]
type: "templates"
---

## 📋 Issue Templates Directory

![Template Badge](https://img.shields.io/badge/templates-standardized-brightgreen?style=flat-square)
![Automation Badge](https://img.shields.io/badge/automation-enabled-blue?style=flat-square)

This directory contains standardized issue templates used across all LightSpeedWP repositories to ensure consistent issue creation and proper automation triggering.

## 📊 Issue Template Workflow

```mermaid
flowchart TD
    A[User Creates Issue] --> B{Select Template}
    B -->|Bug Report| C[Bug Template]
    B -->|Feature Request| D[Feature Template]
    B -->|Documentation| E[Docs Template]
    B -->|Custom| F[Blank Template]
    
    C --> G[Auto-populate Fields]
    D --> G
    E --> G
    F --> G
    
    G --> H[Issue Creation]
    H --> I[Agent Processing]
    
    I --> J[Auto-labeling]
    I --> K[Issue Type Assignment]
    I --> L[Project Board Assignment]
    I --> M[Notification Routing]
    
    N[Template Sync] --> O[All Org Repos]
    P[Automation Agents] --> I
    Q[Label System] --> J
    R[Project Management] --> L
    
    style A fill:#e1f5fe
    style I fill:#f3e5f5
    style N fill:#e8f5e8
```

## 📁 Available Templates

The issue templates in this directory are automatically synchronized across all organization repositories and work in conjunction with our automation agents.

### 🔗 Template Integration

These templates integrate with:

- **[Issue Types](../ISSUE_TYPES.md)** - Canonical issue type definitions
- **[Issue Labels](../ISSUE_LABELS.md)** - Automated labeling system
- **[Automation Governance](../AUTOMATION_GOVERNANCE.md)** - Agent-driven workflows
- **[Branching Strategy](../BRANCHING_STRATEGY.md)** - Branch naming conventions

## 🤖 Automation Features

- **Auto-labeling**: Templates trigger automatic label assignment
- **Type Detection**: Issues are automatically typed based on template
- **Agent Assignment**: Specific agents are triggered based on issue type
- **Project Sync**: Issues are automatically added to relevant projects

## 📚 Related Documentation

- [**Instructions Index**](../instructions/README.md) - All instruction files
- [**Agents Directory**](../agents/README.md) - Automation agents
- [**Saved Replies**](../SAVED_REPLIES/README.md) - Response templates
- [**Workflows**](../workflows/README.md) - GitHub Actions automation

## 💡 Usage Guidelines

1. **Template Selection**: Choose the most specific template for your issue
2. **Required Fields**: Fill in all required template fields
3. **Labels**: Let automation handle labeling - don't manually add labels
4. **Type Assignment**: Templates automatically set the correct issue type

---

_This directory is part of the LightSpeedWP automation ecosystem. See [Automation Governance](../AUTOMATION_GOVERNANCE.md) for complete automation standards._

---

<!-- RANDOM FOOTER: 🚀 Consistent templates, efficient workflows! -->
