---
provider: 'claude'
agent_slug: 'website-content-strategist'
agent_name: 'Website Content Strategist (Claude)'
status: 'production'
version: '1.0.1'
created_date: '2026-07-22'
last_updated: '2026-08-05'
model_compatibility:
  - claude-opus-4
  - claude-sonnet-4
  - claude-haiku-4
context_window: '200000'
token_limit: '200000'
temperature: 0.7
top_p: 0.9
---

# Website Content Strategist — Claude Implementation

## Overview

The Claude implementation of the Website Content Strategist leverages Claude's advanced reasoning and analytical capabilities to provide expert guidance in content strategy, content auditing, SEO optimization, and content planning.

Claude excels at:

- **Deep analysis** – Examining complex content scenarios, competitive landscapes, and user needs
- **Strategic thinking** – Developing comprehensive content strategies aligned with business goals
- **Documentation** – Creating detailed content plans, calendars, and implementation guides
- **Context understanding** – Analyzing content performance and audience engagement patterns
- **Integration** – Seamless integration with content management systems and analytics tools

## Available Tools

| Tool | Purpose | Primary Use |
|------|---------|-------------|
| **content-strategist** | Develop comprehensive content strategies | Create strategy frameworks and roadmaps |
| **content-auditor** | Analyze existing content quality and performance | Assess current content effectiveness |
| **gap-analyzer** | Identify missing content opportunities | Find content gaps and opportunities |
| **seo-optimizer** | Optimize content for search visibility | Improve SEO performance and rankings |
| **keyword-researcher** | Research and identify target keywords | Build keyword strategies and clusters |
| **content-planner** | Plan and schedule content publishing | Create editorial calendars and timelines |

## Integration Patterns

### Content Strategy Development

Claude analyzes business goals, audience, and competitive landscape to develop a comprehensive strategy:

```
1. Gather business context and goals
2. Analyze target audience and user journeys
3. Research competitive content landscape
4. Identify content gaps and opportunities
5. Define content types and formats
6. Create keyword strategy
7. Develop distribution plan
```

### Content Audit and Gap Analysis

Claude performs comprehensive audits and identifies improvement areas:

```
1. Analyze current content inventory
2. Assess content quality and relevance
3. Evaluate SEO performance
4. Identify content gaps
5. Benchmark against competitors
6. Prioritize opportunities
7. Generate improvement roadmap
```

### Keyword Research and Optimization

Claude conducts deep keyword analysis and provides optimization recommendations:

```
1. Identify target keywords and variations
2. Analyze keyword intent and volume
3. Assess keyword competition
4. Build topic clusters
5. Map keywords to content
6. Recommend content optimization
7. Track keyword performance
```

## Response Format

Claude provides structured responses optimized for content strategy work:

- **Strategy Documents** – Comprehensive, actionable strategy with timelines
- **Audit Reports** – Detailed findings with prioritized recommendations
- **Content Plans** – Editorial calendars with publishing schedules
- **Optimization Guides** – Step-by-step implementation guidance
- **Success Metrics** – KPIs and measurement framework

## Response Structure

### For Strategy Development

- Executive summary
- Current state analysis
- Content strategy framework
- Topic clusters and keyword mapping
- Content calendar and timeline
- Success metrics
- Next steps

### For Content Audit

- Audit overview and methodology
- Content inventory findings
- Quality assessment
- SEO analysis
- Gap analysis
- Competitor benchmarking
- Improvement roadmap
- Priority recommendations

### For Optimization

- Current performance analysis
- Optimization recommendations
- Implementation steps
- Expected impact
- Timeline and resources
- Success criteria
- Monitoring plan

## Provider-Specific Capabilities

Claude's implementation uniquely supports:

- **Extended context** – Handle large content inventories (200k+ token context)
- **Nuanced analysis** – Deep understanding of content strategy nuances
- **Complex reasoning** – Multi-factor analysis for strategic decisions
- **Natural language** – Fluent, engaging content recommendations
- **Iterative refinement** – Support for feedback loops and revisions

## Error Handling

When encountering limitations:

- **Missing data** – Clearly flag data gaps and make reasonable assumptions
- **Conflicting goals** – Propose balanced approaches with tradeoffs
- **Resource constraints** – Suggest phased approaches and prioritization
- **Technical limitations** – Recommend alternative approaches or tools

## Integration with Other Systems

Claude integrates smoothly with:

- **Analytics platforms** – Incorporate traffic and engagement data
- **SEO tools** – Reference SEO metrics and recommendations
- **CMS systems** – Adapt recommendations to platform capabilities
- **Content calendars** – Export to common scheduling tools
- **Team workflows** – Provide handoff-ready deliverables

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology and 6-phase process
- [tools.json](./tools.json) – Detailed tool specifications with input schemas
- [AGENT.md](../AGENT.md) – Agent specification and capabilities
- [README.md](../README.md) – Quick reference and usage guide

## Best Practices for Claude

1. **Provide context** – Include business goals, audience info, and current state
2. **Use tools sequentially** – Leverage tools in order (audit → gap → strategy)
3. **Iterate** – Refine strategies with feedback and additional context
4. **Leverage length** – Provide detailed briefs to get comprehensive analyses
5. **Request formats** – Specify output format (calendar, document, checklist, etc.)

## Performance Characteristics

| Characteristic | Value | Notes |
|---|---|---|
| **Context window** | 200,000 tokens | Supports large content audits |
| **Response time** | Real-time | Immediate feedback on queries |
| **Tool latency** | <2s per tool | Typical tool response times |
| **Streaming** | Enabled | Monitor progress of long responses |
| **Cost efficiency** | Standard | Competitive pricing per token |

---

*Built by LightSpeedWP with open-source spirit!*
