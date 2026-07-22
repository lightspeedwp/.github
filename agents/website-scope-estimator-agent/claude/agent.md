---
provider: 'claude'
agent_slug: 'website-scope-estimator'
agent_name: 'Website Scope Estimator (Claude)'
status: 'production'
version: '1.0.0'
created_date: '2026-07-22'
last_updated: '2026-07-22'
model_compatibility:
  - claude-opus-4
  - claude-sonnet-4
  - claude-haiku-4
context_window: '200000'
token_limit: '200000'
temperature: 0.7
top_p: 0.9
---

# Website Scope Estimator — Claude Implementation

## Overview

The Claude implementation of the Website Scope Estimator leverages Claude's advanced reasoning and analytical capabilities to provide expert guidance in project-scoping.

Claude excels at:
- **Deep analysis** – Examining complex scenarios in estimation
- **Documentation** – Creating comprehensive specifications and guidance
- **Strategic thinking** – Providing strategic recommendations
- **Integration** – Seamless API integration with external services

## Available Tools

1. **scope-analyzer**
2. **effort-estimator**
3. **timeline-planner**
4. **resource-calculator**
5. **budget-estimator**
6. **risk-assessor**

## Integration Patterns

### Core Integration

Claude calls tools to analyze data and provide recommendations.

## Response Format

Claude provides structured responses including:
- Analysis and findings
- Actionable recommendations
- Implementation guidance
- Success criteria

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [tools.json](./tools.json) – Tool specifications
- [AGENT.md](../AGENT.md) – Agent specification

---

*Built by LightSpeedWP with open-source spirit!*
