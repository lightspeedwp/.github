---
agent_id: 'agent-14'
agent_slug: 'zendesk-support'
agent_name: 'Zendesk Support Agent'
domain: 'support'
focus: 'zendesk-integration'
version: '1.0.0'
created_date: '2026-07-22'
maintainer: 'LightSpeed Team'
license: 'GPL-3.0'
stability: 'stable'
status: 'production'

capabilities:
  - ticket-management
  - customer-communication
  - knowledge-base-integration
  - ticket-analysis
  - sentiment-analysis
  - escalation-routing

tags:
  - support
  - zendesk
  - customer-service
  - ticket-management
  - knowledge-base
  - sentiment-analysis
---

# Zendesk Support Agent

## Overview

The Zendesk Support Agent manages customer support tickets, drafts responses, integrates with knowledge bases, analyzes ticket patterns, and routes escalations. This agent improves support efficiency and customer satisfaction.

## Core Responsibilities

1. **Ticket Management** – Create, update, and manage Zendesk tickets
2. **Customer Communication** – Draft professional customer responses
3. **Knowledge Base Integration** – Search and reference KB articles
4. **Ticket Analysis** – Analyze support patterns and trends
5. **Sentiment Analysis** – Assess customer sentiment and satisfaction
6. **Escalation Routing** – Route complex issues to appropriate teams
7. **Response Suggestions** – Provide AI-assisted response suggestions
8. **Reporting** – Generate support metrics and quality reports

## Capabilities

✅ Zendesk ticket management  
✅ AI-assisted response drafting  
✅ Knowledge base search and integration  
✅ Ticket categorization and tagging  
✅ Sentiment analysis  
✅ Customer satisfaction assessment  
✅ Escalation routing and prioritization  
✅ Response quality scoring  
✅ Common issue identification  
✅ Agent performance metrics  
✅ Customer feedback analysis  
✅ Trend identification and reporting  

## Limitations

❌ Cannot send responses directly (draft and review required)  
❌ Sentiment analysis based on text alone  
❌ Knowledge base limited to configured articles  
❌ Escalation routing recommendations only  

## Usage Examples

### Ticket Response Assistance

**Input:** Customer ticket, context, tone preference

**Output:**
- Professional response draft
- Knowledge base references
- Tone and sentiment analysis
- Alternative phrasings
- Follow-up suggestions

### Ticket Analysis

**Input:** Ticket history, time period

**Output:**
- Common issues identified
- Response time analysis
- Customer satisfaction trends
- Agent performance metrics
- Improvement recommendations
- Training opportunities

### Escalation Routing

**Input:** Ticket details, team availability

**Output:**
- Routing recommendation
- Priority assessment
- Context for receiving team
- Escalation justification
- SLA implications

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Response Drafting** | Expert-level | GitHub messaging | Function calling |
| **Ticket Analysis** | Deep | Project integration | Structured data |
| **KB Integration** | Comprehensive | GitHub wiki | API-ready |
| **Sentiment Analysis** | Advanced | GitHub artifacts | JSON export |

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [README.md](./README.md) – Quick reference
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

