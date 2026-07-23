---
provider: 'claude'
agent_slug: 'pagespeed'
agent_name: 'PageSpeed Agent (Claude)'
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

# PageSpeed Agent — Claude Implementation

## Overview

The Claude implementation of the PageSpeed Agent leverages Claude's advanced reasoning capabilities to analyze website performance, identify bottlenecks, and provide expert optimization recommendations focused on Core Web Vitals and user experience.

Claude excels at:
- **Performance analysis** – Deep analysis of Core Web Vitals and loading metrics
- **Strategic thinking** – Developing comprehensive optimization strategies
- **Technical documentation** – Creating implementation guides and best practices
- **Complex reasoning** – Understanding trade-offs between optimization approaches

## Available Tools

| Tool | Purpose | Primary Use |
|------|---------|-------------|
| **pagespeed-analyzer** | Analyze performance metrics and Core Web Vitals | Assess website performance |
| **bottleneck-detector** | Identify performance bottlenecks | Find slow components and resources |
| **optimization-recommender** | Generate optimization recommendations | Get prioritized improvement steps |
| **caching-strategist** | Develop caching strategies | Plan cache implementation |
| **cdn-optimizer** | Optimize CDN configuration | Improve content delivery |
| **image-optimizer** | Recommend image optimization | Reduce image file sizes |

## Integration Patterns

### Performance Analysis Flow

```
1. Analyze Core Web Vitals and metrics
2. Identify top bottlenecks
3. Prioritize optimizations by impact
4. Develop implementation strategy
5. Generate monitoring plan
```

### Optimization Workflow

```
1. Assess current state (metrics, architecture, stack)
2. Detect bottlenecks (JS, images, rendering, etc.)
3. Generate recommendations (with effort/impact)
4. Plan caching strategy (browser, server, CDN)
5. Create implementation roadmap
6. Set performance budgets
```

## Response Format

Claude provides structured responses including:

- **Performance Summary** – Key metrics and current state
- **Bottleneck Analysis** – Top 5-10 performance issues
- **Prioritized Recommendations** – Actionable steps with effort/impact
- **Implementation Guide** – Step-by-step optimization instructions
- **Monitoring Plan** – KPIs and continuous measurement framework
- **Success Criteria** – Expected improvements and targets

## Core Capabilities

- **Core Web Vitals Analysis** – LCP, FID/INP, CLS assessment
- **Performance Metrics** – First Paint, TTFB, Total Blocking Time
- **Resource Analysis** – JavaScript, CSS, image optimization
- **Caching Strategies** – Browser cache, server cache, CDN optimization
- **Load Testing** – Simulated and real user performance data
- **Progressive Enhancement** – Graceful degradation and fallbacks

## Error Handling

When encountering limitations:
- **Missing data** – Flag data gaps and provide analysis with available data
- **Complex optimizations** – Suggest phased approaches
- **Trade-offs** – Document performance vs. functionality trade-offs
- **Technical constraints** – Recommend alternative approaches

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology and 6-phase process
- [tools.json](./tools.json) – Tool specifications with input schemas
- [AGENT.md](../AGENT.md) – Agent specification and capabilities
- [README.md](../README.md) – Quick reference guide

---

*Built by LightSpeedWP with open-source spirit!*
