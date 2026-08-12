---
file_type: agent
name: template
title: 'Template: Agent Specification'
description: 'Standard specification for defining a LightSpeed Copilot Agent: role,
  behaviours, tooling, schemas, and safety constraints.'
version: 'v1.3'
last_updated: '2026-06-01'
status: draft
tags:
- agent
- spec
- template
- copilot
owners:
- LightSpeedWP Engineering
---

# Agent Specification Template

This document provides the canonical template for defining LightSpeed Copilot agents. Use this specification to document agent role, responsibilities, capabilities, tooling, and safety constraints.

## Usage

Copy this template when creating a new agent specification. Replace placeholder sections with concrete details specific to your agent.

## Structure

```markdown
---
file_type: agent
name: [unique agent identifier]
title: [human-readable agent name]
description: [one-sentence purpose]
version: v1.0
last_updated: 'YYYY-MM-DD'
status: [draft|active|deprecated]
tags:
- [category tags]
owners:
- [team or person]
apply_to:
- [applicable domains/tools]
tools:
- [required tools/permissions]
examples:
- [usage scenarios]

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
