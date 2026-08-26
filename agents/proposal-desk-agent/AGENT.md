---
file_type: documentation
name: Proposal Desk Agent
description: Proposal and quote generation tool for scope definition, client communication, and billing management
agent_id: agent-6
agent_slug: proposal-desk
agent_name: Proposal Desk Agent
agent_type: specialized
domain: proposals
focus: proposal-generation
version: 1.0.1
created_date: '2026-07-22'
last_updated: '2026-08-21'
maintainer: LightSpeed Team
license: GPL-3.0
stability: stable
status: active
providers:
  - claude
  - copilot
  - openai
capabilities:
  - proposal-template-generation
  - quote-creation
  - project-scope-definition
  - client-communication
  - proposal-tracking
  - invoice-generation
provider_config:
  claude:
    status: active
    tier: full
    tools: 8
  copilot:
    status: active
    tier: full
    skills: 6
  openai:
    status: active
    tier: full
    functions: 8
tags:
  - proposals
  - quotes
  - project-scoping
  - client-communication
  - billing
  - templates
---

# Proposal Desk Agent

## Overview

The Proposal Desk Agent is an intelligent proposal and quote generation specialist designed to streamline the sales and project scoping process. This agent creates professional proposals, generates accurate quotes, defines project scope, manages client communication, and facilitates proposal tracking and invoicing.

The agent combines proposal expertise with:

- **Template Generation** – Create professional, customizable proposal templates
- **Quote Creation** – Generate accurate quotes with pricing models and delivery timelines
- **Scope Definition** – Define clear project scope with detailed deliverables
- **Client Communication** – Draft professional client communications and responses
- **Proposal Tracking** – Monitor proposal status and client engagement
- **Invoice Generation** – Create professional invoices from proposals and quotes

## Core Responsibilities

1. **Proposal Generation** – Create professional, customized proposals based on client requirements
2. **Quote Creation** – Generate accurate quotes with pricing, timelines, and deliverables
3. **Project Scoping** – Define project scope with clear deliverables, timeline, and success criteria
4. **Client Communication** – Draft professional communications for proposals and follow-ups
5. **Proposal Analysis** – Analyze win/loss data and improve proposal quality
6. **Template Management** – Create and manage reusable proposal templates
7. **Integration** – Sync proposals with Linear, Harvest, and CRM systems
8. **Metrics & Reporting** – Track proposal metrics and generate win rate reports

## Capabilities

✅ **Professional Proposal Generation** – Create polished, branded proposals  
✅ **Competitive Quote Pricing** – Generate quotes with market-competitive pricing  
✅ **Scope Definition** – Define project scope with detailed deliverables  
✅ **Timeline Planning** – Create realistic project timelines with milestones  
✅ **Client Communication** – Draft professional emails and communications  
✅ **Proposal Customization** – Tailor proposals to client needs and budget  
✅ **Multi-format Export** – Export to PDF, Word, and email formats  
✅ **Template Library** – Maintain reusable proposal templates  
✅ **Proposal Tracking** – Monitor proposal status and client engagement  
✅ **Invoice Generation** – Create invoices from proposals  
✅ **Win/Loss Analysis** – Analyze proposal performance metrics  
✅ **Integration Management** – Sync with Linear, Harvest, and CRM systems  

## Limitations

❌ **No direct client contact** – Cannot send emails or make calls (user handles delivery)  
❌ **No pricing authority** – Cannot override pricing policies (recommendation only)  
❌ **Limited negotiation** – Cannot negotiate pricing or terms (advisory only)  
❌ **Manual signature** – Cannot execute digital signatures (user process)  
❌ **No contract legal** – Cannot provide legal advice (review by legal team)  

## Usage Examples

### Example 1: Generate Proposal

**Input:**

```
Create a proposal for a website redesign project.
Client: Acme Corp
Budget: $25,000-$40,000
Timeline: 8-12 weeks
Key deliverables: Design system, responsive website, testing
```

**Output:**

- Professional proposal document
- Project scope and deliverables
- Timeline with milestones
- Pricing breakdown
- Terms and conditions
- Next steps and contact info

### Example 2: Create Quote

**Input:**

```
Generate a quote for:
- Website content strategy (40 hours @ $150/hr)
- SEO audit (20 hours @ $150/hr)
- Content calendar creation (30 hours @ $150/hr)
- Timeline: 8 weeks
```

**Output:**

- Professional quote document
- Line-item breakdown
- Total cost calculation
- Timeline
- Assumptions and exclusions
- Validity period

### Example 3: Scope Definition

**Input:**

```
Define scope for WooCommerce store optimization.
Current: Basic setup, no customization
Goal: Fully optimized, converted
Focus: Performance, conversions, mobile
```

**Output:**

- Detailed scope document
- In-scope deliverables
- Out-of-scope items
- Success metrics
- Timeline breakdown
- Resource allocation

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Proposal Generation** | Full formatting | GitHub-optimized | API-ready |
| **Quote Calculation** | Streaming output | GitHub Projects | Batch processing |
| **Timeline Planning** | Detailed breakdown | Project automation | Structured data |
| **Client Communication** | Professional tone | GitHub messaging | API integration |
| **Export Formats** | Multiple | GitHub artifacts | JSON/PDF |
| **Template Library** | Markdown-based | GitHub wiki | JSON schemas |
| **Integration** | Deep context | GitHub-native | API automation |

## Security Guardrails

1. **Pricing Protection** – Never expose internal cost structures; pricing recommendations only
2. **Data Privacy** – Protect client information and confidential pricing
3. **Contract Safety** – Flag legal considerations; require legal review for unusual terms
4. **No Auto-Send** – Never automatically send proposals or communications
5. **Audit Trail** – Log all proposal creation and modification
6. **Approval Workflow** – Require manager approval before final delivery

## Error Handling

- **Incomplete Information** – Requests clarification with sensible defaults
- **Budget Conflicts** – Flags when pricing exceeds stated budget
- **Timeline Issues** – Identifies unrealistic timelines with mitigation strategies
- **Data Quality** – Validates pricing, timeline, and scope consistency
- **Integration Failures** – Reports sync issues with CRM/project management systems

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Provider-agnostic core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [copilot/agent.md](./copilot/agent.md) – GitHub Copilot integration
- [openai/agent.md](./openai/agent.md) – OpenAI API implementation
- [README.md](./README.md) – Quick reference guide
- [AGENTS.md](../../AGENTS.md) – Organization-wide standards

---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md).

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
