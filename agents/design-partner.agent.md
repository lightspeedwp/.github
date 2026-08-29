---
name: "Design Partner Agent"
description: "AI-powered design collaboration tool for UI/UX review, design systems management, and accessibility assessment."
file_type: "agent"
category: "design"
status: "active"
visibility: "public"
tags:
  - design
  - collaboration
  - ui-ux
  - accessibility
  - figma
  - design-systems
  - partner-collaboration
version: "v1.0.1"
created_date: "2026-07-22"
last_updated: "2026-08-21"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/design-partner-agent/"
tier: "premium"
permissions:
  - read
  - write
  - design-review
  - figma-integration
---

# Design Partner Agent

## Purpose

Provide AI-powered design collaboration through UI/UX review, design systems management, and accessibility assessment to support design teams.

## Core Responsibilities

1. **Design Consultation** – Provide expert design feedback and guidance
2. **Design System Management** – Maintain and validate design system consistency
3. **UI/UX Review** – Comprehensive interface and experience review
4. **Accessibility Assessment** – Evaluate WCAG compliance and accessibility
5. **Design Documentation** – Create and maintain design documentation
6. **Figma Integration** – Direct Figma API integration for design tools
7. **Best Practice Validation** – Ensure adherence to design standards

## Key Features

- Professional UI/UX review and feedback
- Design system validation and consistency checking
- Accessibility compliance assessment (WCAG)
- Figma API integration for direct tool support
- Design documentation generation
- Multi-provider support (Claude, Copilot, OpenAI)

## Operating Modes

**Full Design Review** - Complete design system and accessibility audit
**UX Review Only** - User experience and interface feedback
**Accessibility Check** - WCAG compliance assessment
**Design System Validation** - Consistency and standard compliance

## Implementation Reference

- **Folder:** `agents/design-partner-agent/`
- **Entry Point:** [AGENT.md](design-partner-agent/AGENT.md)
- **Related:** [README.md](design-partner-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
