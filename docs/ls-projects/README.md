---
title: 'LightSpeed Projects Documentation'
description: 'GitHub Projects templates, automation, and field specifications for LightSpeed workflows'
version: '1.0'
last_updated: '2025-11-12'
maintainer: 'LightSpeed Team'
tags: ['github-projects', 'automation', 'templates', 'workflows', 'project-management']
---

# LightSpeed Projects Documentation

This directory contains GitHub Projects (Beta) templates, automation configurations, and field specifications for both client delivery and product development workflows.

## Purpose

Standardizes GitHub Projects configuration across LightSpeed repositories to ensure:

- Consistent project board layouts and custom fields
- Automated issue/PR routing and status updates
- Tailored workflows for client delivery vs. product development
- Integration with branch prefixes, labels, and changelog automation

## Contents

### Client Delivery Workflow Files

- **branch-prefixes-client-delivery-v1-1.md** – Branch naming conventions for client projects
- **changelog-release-automation-client-delivery-v1-1.md** – Changelog automation for client delivery
- **client-delivery-automations-v1-1.md** – Automated workflow rules for client projects
- **client-delivery-branch-prefixes-v1.md** – Detailed branch prefix documentation
- **client-delivery-cadence-v1-1.md** – Release cadence and sprint planning for client projects
- **client-delivery-changelog-release-automation-v1.md** – Comprehensive changelog automation
- **client-delivery-field-specs-v1-1.md** – Custom field definitions for client project boards
- **client-delivery-project-template-v1-6.md** – Complete project board template configuration
- **client-delivery-views-v1-1.md** – Pre-configured project board views

### Product Development Workflow Files

- **branch-prefixes-product-development-v1-1.md** – Branch naming conventions for product development
- **changelog-release-automation-product-development-v1-1.md** – Changelog automation for products
- **product-development-automations-v1-1.md** – Automated workflow rules for product repos
- **product-development-branch-prefixes-v1.md** – Detailed branch prefix documentation
- **product-development-cadence-v1-1.md** – Release cadence and roadmap planning
- **product-development-changelog-release-automation-v1.md** – Comprehensive changelog automation
- **product-development-field-specs-v1-1.md** – Custom field definitions for product boards
- **product-development-project-template-v1-6.md** – Complete project board template configuration
- **product-development-views-v1-1.md** – Pre-configured project board views

### Legacy Templates

- **project-template-client-delivery-v1-5.md** – Previous version of client delivery template
- **project-template-product-development-v1-5.md** – Previous version of product development template

## Inputs

- Issues and PRs created in LightSpeed repositories
- Branch names matching defined prefixes
- Label applications and milestone assignments
- Manual project field updates

## Outputs

- Automatically configured GitHub project boards
- Issues/PRs routed to appropriate project views
- Custom fields populated based on labels and metadata
- Automated status transitions during PR lifecycle
- Integrated changelog and release tracking

## Usage Examples

### Example 1: Client Delivery Project Setup

```bash
# Apply client delivery project template
# Includes custom fields: Client, Sprint, Priority, Status, Estimate
# Automated views: Backlog, Current Sprint, Blocked, Ready for Review
```

### Example 2: Product Development Board

```bash
# Apply product development project template
# Includes custom fields: Epic, Release, Component, Priority, Size
# Automated views: Roadmap, In Progress, Ready to Ship, Backlog
```

### Example 3: Automated Field Population

```yaml
# PR created from branch: feat/checkout-flow
Automatically populates:
  - Type: Feature
  - Component: Frontend
  - Status: In Progress

# Issue labeled: prio:critical, milestone:v2.0
Automatically populates:
  - Priority: Critical
  - Release: v2.0
  - Status: Triage
```

## Project Types

| Type | Use Case | Cadence | Automation |
|------|----------|---------|------------|
| **Client Delivery** | Client projects, agency work | Sprint-based (1-2 weeks) | Label→Status, Sprint planning |
| **Product Development** | Internal products, SaaS | Milestone-based (monthly/quarterly) | Epic tracking, Roadmap planning |

## Custom Fields

### Client Delivery Fields

- **Client** – Client name (single select)
- **Sprint** – Sprint identifier (text)
- **Priority** – Priority level (single select)
- **Status** – Workflow status (single select)
- **Estimate** – Story points (number)

### Product Development Fields

- **Epic** – Epic tracking (single select)
- **Release** – Target release (single select)
- **Component** – System component (single select)
- **Priority** – Priority level (single select)
- **Size** – T-shirt sizing (single select)

See field specification files for complete definitions and automation mappings.

## Related Documentation

- [Automation Governance](../../.github/automation/AUTOMATION_GOVERNANCE.md) – Org-wide automation strategy
- [Branching Strategy](../../.github/automation/BRANCHING_STRATEGY.md) – Branch naming and workflow
- [Label Automation](../label-automation/README.md) – Label-to-field mapping
- [Git Workflow](../git-workflow/README.md) – Version control integration

---

**Maintained by LightSpeed Team** • For updates or questions, see [CONTRIBUTING.md](../../CONTRIBUTING.md)
