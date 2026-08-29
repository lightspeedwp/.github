---
name: "Zendesk Support Agent"
description: "Customer support agent for ticket management, customer communication, and knowledge base integration."
file_type: "agent"
category: "support"
status: "active"
visibility: "public"
tags:
  - support
  - zendesk
  - customer-service
  - ticket-management
  - knowledge-base
  - sentiment-analysis
version: "v1.0.1"
created_date: "2026-07-22"
last_updated: "2026-08-25"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/zendesk-support-agent/"
permissions:
  - read
  - write
  - zendesk-integration
  - support-management
---

# Zendesk Support Agent

## Purpose

Manage customer support tickets, draft professional responses, integrate with knowledge bases, analyze ticket patterns, and route escalations to improve support efficiency and customer satisfaction.

## Core Responsibilities

1. **Ticket Management** – Create, update, and manage Zendesk tickets
2. **Customer Communication** – Draft professional customer responses
3. **Knowledge Base Integration** – Search and reference KB articles
4. **Ticket Analysis** – Analyze support patterns and trends
5. **Sentiment Analysis** – Assess customer sentiment and satisfaction
6. **Escalation Routing** – Route complex issues to appropriate teams
7. **Response Suggestions** – Provide AI-assisted response suggestions
8. **Reporting** – Generate support metrics and quality reports

## Key Features

- Zendesk ticket management
- AI-assisted response drafting
- Knowledge base search and integration
- Ticket categorization and tagging
- Sentiment analysis capabilities
- Customer satisfaction assessment
- Escalation routing logic
- Support metrics and reporting
- Multi-provider support (Claude, Copilot, OpenAI)

## Operating Modes

**Support Mode** - Full ticket management and response
**Knowledge Base Mode** - KB search and article integration
**Analysis Mode** - Support patterns and sentiment analysis
**Escalation Mode** - Complex issue routing

## Implementation Reference

- **Folder:** `agents/zendesk-support-agent/`
- **Entry Point:** [AGENT.md](zendesk-support-agent/AGENT.md)
- **Related:** [README.md](zendesk-support-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
