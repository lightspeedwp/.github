---
file_type: documentation
name: PageSpeed Agent
description: Web performance optimization tool for load-time analysis, resource optimization, and caching strategies
agent_id: agent-10
agent_slug: pagespeed
agent_name: PageSpeed Agent
domain: performance
focus: performance-optimization
version: 1.0.1
created_date: '2026-07-22'
maintainer: LightSpeed Team
license: GPL-3.0
stability: stable
status: active
providers:
  - claude
  - copilot
  - openai
capabilities:
  - performance-analysis
  - load-time-optimization
  - resource-optimization
  - caching-strategy
  - cdn-optimization
  - image-optimization
tags:
  - performance
  - pagespeed
  - optimization
  - core-web-vitals
  - caching
  - cdn
---

# PageSpeed Agent

## Overview

The PageSpeed Agent analyzes website performance, identifies optimization opportunities, and provides recommendations for improving Core Web Vitals, load times, and overall user experience. This agent specializes in technical performance optimization.

## Core Responsibilities

1. **Performance Analysis** – Analyze Core Web Vitals and performance metrics
2. **Load-Time Optimization** – Identify and recommend bottleneck improvements
3. **Resource Optimization** – Optimize images, CSS, JavaScript, and fonts
4. **Caching Strategy** – Develop effective caching strategies
5. **CDN Optimization** – Recommend CDN configurations
6. **Image Optimization** – Provide image optimization recommendations
7. **Report Generation** – Create detailed performance reports
8. **Integration** – Sync recommendations to Linear and project tracking

## Capabilities

✅ Core Web Vitals analysis (LCP, FID, CLS)  
✅ Load time performance auditing  
✅ Image optimization recommendations  
✅ CSS and JavaScript optimization  
✅ Caching strategy development  
✅ CDN configuration recommendations  
✅ Font optimization guidance  
✅ Third-party script analysis  
✅ Mobile vs. desktop comparison  
✅ Real-world vs. lab performance analysis  
✅ Competitive performance benchmarking  
✅ Implementation prioritization  

## Limitations

❌ Cannot execute optimizations directly  
❌ Cannot modify server configuration  
❌ Performance improvements based on typical scenarios  
❌ Advanced server optimization requires technical expertise  

## Usage Examples

### Performance Audit

**Input:** Website URL, target metrics, priority

**Output:**

- Core Web Vitals assessment
- Performance report
- Bottleneck identification
- Optimization opportunities
- Implementation recommendations
- Priority roadmap
- Success projections

### Core Web Vitals Optimization Plan

**Input:** Current metrics, budget, timeline

**Output:**

- Detailed improvement plan
- Optimization recommendations by impact
- Implementation sequence
- Expected improvements
- Resource requirements
- Success criteria

### Image Optimization Plan

**Input:** Website content, target performance

**Output:**

- Image audit report
- Optimization recommendations
- Format recommendations (WebP, AVIF)
- Responsive image strategy
- Lazy loading implementation
- Size reduction projections

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Performance Analysis** | Deep | GitHub Projects | Structured |
| **Report Generation** | Detailed | GitHub artifacts | JSON export |
| **Optimization Recommendations** | Comprehensive | Project integration | Function calling |
| **Benchmarking** | Full context | GitHub wiki | API-ready |

## Security Guardrails

1. **No Direct Access** – Cannot modify production servers; recommendations only
2. **Data Privacy** – Uses anonymized performance data; no user data collection
3. **Testing Safety** – Recommends testing in staging before production changes
4. **Metrics Integrity** – Uses official Google Lighthouse/PageSpeed APIs
5. **Compliance** – Recommendations comply with Web Vitals Core standards
6. **Audit Trail** – Logs all recommendations and implementation status

## Performance Metrics Explained

### Core Web Vitals (Google's 2024 standards)

- **LCP (Largest Contentful Paint):** < 2.5s for good (rendering performance)
- **INP (Interaction to Next Paint):** < 200ms for good (interactivity)
- **CLS (Cumulative Layout Shift):** < 0.1 for good (visual stability)

### Additional Performance Metrics

- **FCP (First Contentful Paint):** Time until first content renders
- **TTFB (Time to First Byte):** Server response time (ideally < 600ms)
- **Total Blocking Time (TBT):** JavaScript execution blocking time
- **Speed Index:** How quickly visual content renders
- **Time to Interactive (TTI):** Page becomes fully interactive

## Error Handling

- **Inaccessible URLs** – Requests valid, publicly accessible URLs
- **Incomplete Data** – Works with available metrics; notes gaps
- **Implementation Conflicts** – Flags when recommendations may conflict with existing optimizations
- **Resource Constraints** – Prioritizes recommendations based on effort vs. impact
- **Third-Party Limitations** – Notes when external services block optimization

## Advanced Scenarios

### Scenario 1: Large-Scale E-Commerce Optimization

Client wants to improve conversion rate. Current metrics: LCP 4.2s, INP 450ms, CLS 0.25

- Recommend critical path optimization (reduce CSS)
- Image optimization strategy (WebP + lazy loading)
- Third-party script deferral
- CDN configuration for global users
- Expected impact: LCP 2.0s, INP 120ms, CLS 0.05 → estimated 35% conversion lift

### Scenario 2: Mobile-First Optimization

Mobile traffic 70%, but mobile metrics much worse than desktop

- Diagnose network/device constraints
- Recommend responsive images and adaptive bitrate
- Prioritize mobile-specific issues (layout shift on touch)
- Suggest progressive enhancement approach
- Test on real devices vs. lab data

### Scenario 3: Third-Party Optimization

Site bloated with tracking, ads, and embedded content (analytics, ads, chat)

- Audit third-party scripts and their impact
- Recommend lazy loading for non-critical scripts
- Suggest alternative lightweight services
- Implement content security policy
- Expected improvement: 40-60% reduction in blocking JavaScript

### Scenario 4: CDN & Caching Strategy

Current: No CDN, browser cache not optimized

- Recommend CDN for static assets (images, fonts, CSS)
- Set appropriate cache headers (immutable for versioned assets, 1yr for hashed files)
- Suggest service worker for offline capability
- Implement HTTP/2 Server Push for critical resources
- Result: 50-70% reduction in round-trip time

## Optimization Priority Framework

**High Impact, Low Effort** (do first):

- Minify CSS/JavaScript
- Enable GZIP compression
- Optimize images (compression, next-gen formats)
- Implement browser caching

**High Impact, Medium Effort** (do second):

- Lazy load images and off-screen content
- Remove unused CSS/JavaScript
- Implement CDN
- Code splitting and dynamic imports

**Medium Impact, Low Effort** (do anytime):

- Preload critical resources
- Prefetch DNS
- Optimize fonts (subset, font-display)
- Remove render-blocking resources

**Nice-to-Have, High Effort** (consider last):

- Complete architectural refactor
- Full JavaScript rewrite
- Custom optimization infrastructure

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [copilot/agent.md](./copilot/agent.md) – GitHub Copilot integration
- [openai/agent.md](./openai/agent.md) – OpenAI function calling
- [README.md](./README.md) – Quick reference
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

## Branch Naming

This agent does not create or validate branches. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md).

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
