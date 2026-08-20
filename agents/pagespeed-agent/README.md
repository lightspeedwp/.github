---
file_type: documentation
title: "PageSpeed Agent — Performance Optimization Specialist"
description: "README for agents/pagespeed-agent/README.md."
status: active
stability: stable
domain: governance
last_updated: "2026-08-19"
---

# PageSpeed Agent — Performance Optimization Specialist

The PageSpeed Agent is an intelligent performance optimization assistant that analyzes website performance, identifies bottlenecks, and provides data-driven recommendations for improving Core Web Vitals, load times, and user experience.

## Quick Start

### Analyze Website Performance

**Claude:**
```
You: Analyze the performance of example.com
Agent: Provides detailed performance analysis with Core Web Vitals, bottlenecks, and recommendations
```

**OpenAI API:**
```python
import openai

response = openai.ChatCompletion.create(
  model="gpt-4-turbo",
  messages=[{"role": "user", "content": "Analyze example.com performance"}],
  functions=[...],
  function_call="auto"
)
```

**GitHub Copilot:**
```
@pagespeed-analyze
Analyze performance for example.com
```

### Get Optimization Recommendations

Receive prioritized optimization recommendations with impact estimates, effort levels, and implementation guides.

### Set Up Performance Monitoring

Configure continuous performance monitoring with alerts for regressions and automated reporting.

## Features

### Performance Analysis
- **Core Web Vitals Assessment** – LCP, INP, CLS measurement and analysis
- **Load Time Auditing** – TTFB, FCP, Speed Index tracking
- **Bottleneck Detection** – Identify performance bottlenecks by type
- **Competitive Benchmarking** – Compare against industry standards
- **Device-Specific Analysis** – Mobile vs. desktop performance differences

### Optimization Recommendations
- **Prioritized Actions** – Organized by impact/effort ratio
- **Implementation Guides** – Step-by-step optimization instructions
- **Impact Estimates** – Expected performance improvements
- **Timeline Planning** – Realistic implementation schedule
- **Risk Mitigation** – Potential side effects and mitigation strategies

### Caching & Delivery Optimization
- **Caching Strategy Development** – Browser, server, CDN caching plans
- **CDN Configuration** – Optimization recommendations for edge delivery
- **Service Worker Implementation** – Offline support and prefetching
- **Cache Invalidation** – Smart cache busting strategies

### Performance Monitoring
- **Continuous Monitoring** – Real-time performance tracking
- **Alert Configuration** – Automatic alerts for regressions
- **Dashboard Setup** – Visibility into performance metrics
- **Reporting** – Regular performance reports and insights

## Usage Scenarios

### Scenario 1: Performance Audit
Client wants to understand current performance and improvement opportunities.
```
Agent analyzes → Identifies bottlenecks → Provides recommendations → Creates roadmap
```

### Scenario 2: Optimization Implementation
Team wants to improve Core Web Vitals for SEO and user experience.
```
Agent prioritizes → Provides step-by-step guides → Monitors progress → Validates improvements
```

### Scenario 3: Caching Strategy
Organization needs better caching strategy for global users.
```
Agent analyzes delivery → Recommends CDN strategy → Plans cache configuration → Monitors effectiveness
```

### Scenario 4: Third-Party Optimization
Website has too many third-party scripts impacting performance.
```
Agent audits scripts → Identifies impact → Recommends alternatives → Tracks improvements
```

## Integration with LightSpeed Tools

### Linear (Project Management)
- Create optimization tasks from recommendations
- Link performance issues to project milestones
- Track implementation progress
- Validate improvements against targets

### Harvest (Time Tracking)
- Estimate effort for optimization tasks
- Track actual time spent on improvements
- Correlate performance gains with resource investment
- Measure ROI of optimization efforts

### GitHub
- File performance issues as GitHub issues
- Automate performance checks in CI/CD
- Track progress in GitHub Projects
- Integrate with code review workflow

## Core Web Vitals Explained

| Metric | Target | Impact |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Perceived load speed |
| **INP** (Interaction to Next Paint) | < 200ms | Interactivity responsiveness |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability |

## Optimization Priority Framework

### 1. Quick Wins (1-2 weeks)
- Image optimization and compression
- Minify CSS and JavaScript
- Enable GZIP compression
- Browser cache configuration
- **Expected Impact:** 30-50% improvement

### 2. Medium Priority (2-8 weeks)
- Code splitting and lazy loading
- Caching strategy implementation
- Font optimization
- CDN setup and configuration
- **Expected Impact:** 50-70% improvement

### 3. Long-Term (8+ weeks)
- Architecture refactoring
- Full JavaScript rewrite
- Service Worker implementation
- Advanced performance monitoring
- **Expected Impact:** 70%+ improvement

## Best Practices

1. **Measure First** – Always establish baseline before optimizing
2. **Prioritize by Impact** – Focus on optimizations with highest ROI
3. **Test Thoroughly** – Validate improvements in staging
4. **Monitor Continuously** – Track performance over time
5. **Iterate Regularly** – Optimize based on real user data

## Provider Implementations

### Claude Implementation
Best for: Strategic analysis, comprehensive recommendations, detailed guidance
- Deep reasoning about performance trade-offs
- Detailed optimization strategies
- Long-form implementation guides
- Complex bottleneck analysis

### OpenAI Implementation
Best for: API integration, batch processing, automation
- Function calling for structured analysis
- Batch API for bulk site analysis
- Cost-effective for high volume
- Webhook integration

### GitHub Copilot Implementation
Best for: Developer workflow, integrated optimization
- Performance checks in IDE
- Pull request performance impact analysis
- GitHub Actions automation
- Knowledge base integration

## Resources

- **AGENT.md** – Full agent specification and capabilities
- **claude/agent.md** – Claude-specific implementation details
- **openai/agent.md** – OpenAI API integration guide
- **copilot/agent.md** – GitHub Copilot workflow patterns
- **shared/core-prompt.md** – Core methodology and process

## Support & Documentation

For detailed information on:
- **Performance metrics** – See AGENT.md
- **Implementation guides** – See claude/agent.md
- **API integration** – See openai/agent.md
- **GitHub workflows** – See copilot/agent.md
- **Optimization methodology** – See shared/core-prompt.md

---

**Built by LightSpeedWP with open-source spirit!**

## Repository Flow

```mermaid
graph LR
  accTitle: graph diagram
  accDescr: graph flowchart
    A["Scope"] --> B["Inputs"]
    B --> C["Process"]
    C --> D["Validation"]
    D --> E["Outputs"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```
