---
name: accessibility-auditor
version: 2.0.0
purpose: WCAG 2.2 AA Accessibility Auditing Agent
maintainer: Brandon
status: active
---

## MCP Dependencies

- none (core workflow — Node.js only for .docx report generation)
- optional: browser/fetch MCP for live URL auditing if configured in .claude/mcp-config.json

## Skills

- skills/01-analyse-input.md
- skills/02-build-criteria.md
- skills/03-evaluate.md
- skills/04-recommendations.md
- skills/05-generate-report.md
- skills/06-reaudit.md

## Trigger Context

Activate this agent when the user wants to audit a UI artefact for WCAG 2.2 AA accessibility compliance. Input can be a screenshot, URL, component description, design spec, or any file with visual/UI content. This agent does not require a Linear MCP connection.

## Design System Context

- Design system: LightSpeed DS v0.1.0
- Token reference: agents/accessibility-auditor/references/ls-ds-tokens.md
- All fix recommendations for LightSpeed projects reference DS token names from that file
- For non-LightSpeed audits, use standard CSS/HTML/ARIA recommendations with WCAG criterion references
