---
provider: 'claude'
agent_slug: 'client-website-discovery-assistant'
agent_name: 'Client Website Discovery Assistant (Claude)'
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

# Client Website Discovery Assistant — Claude Implementation

## Overview

The Claude implementation of the Client Website Discovery Assistant leverages Claude's advanced reasoning and analytical capabilities to provide expert guidance in website-assessment.

Claude excels at:
- **Deep analysis** – Examining complex scenarios in discovery
- **Documentation** – Creating comprehensive specifications and guidance
- **Strategic thinking** – Providing strategic recommendations
- **Integration** – Seamless API integration with external services

## Available Tools

1. **website-analyzer**
2. **seo-auditor**
3. **performance-tester**
4. **ux-assessor**
5. **competitor-analyzer**
6. **recommendation-engine**

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
