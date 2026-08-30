---
name: "PageSpeed Agent"
description: "Web performance optimization tool for load-time analysis, resource optimization, and caching strategies."
file_type: "agent"
category: "performance"
status: "active"
visibility: "public"
tags:
  - performance
  - pagespeed
  - optimization
  - core-web-vitals
  - caching
  - cdn
  - performance-analysis
version: "v1.0.1"
created_date: "2026-07-22"
last_updated: "2026-08-25"
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp/maintainers"]
language: "en"
implementation: "agents/pagespeed-agent/"
permissions:
  - read
  - analysis
  - performance-monitoring
---

# PageSpeed Agent

## Purpose

Analyze website performance, identify optimization opportunities, and provide recommendations for improving Core Web Vitals, load times, and overall user experience.

## Core Responsibilities

1. **Performance Analysis** – Analyze Core Web Vitals and performance metrics
2. **Load-Time Optimization** – Identify and recommend bottleneck improvements
3. **Resource Optimization** – Optimize images, CSS, JavaScript, and fonts
4. **Caching Strategy** – Develop effective caching strategies
5. **CDN Optimization** – Recommend CDN configurations
6. **Image Optimization** – Provide image optimization recommendations
7. **Report Generation** – Create detailed performance reports
8. **Integration** – Sync recommendations to Linear and project tracking

## Key Features

- Core Web Vitals analysis (LCP, FID, CLS)
- Load time performance auditing
- Image optimization recommendations
- CSS and JavaScript optimization
- Caching strategy development
- CDN configuration recommendations
- Detailed performance reports
- Integration with Linear for issue tracking

## Operating Modes

**Full Performance Audit** - Comprehensive Core Web Vitals analysis
**Optimization Focus** - Resource optimization recommendations
**Report Generation** - Detailed performance analysis reports

## Implementation Reference

- **Folder:** `agents/pagespeed-agent/`
- **Entry Point:** [AGENT.md](pagespeed-agent/AGENT.md)
- **Related:** [README.md](pagespeed-agent/README.md)

---

*Generated during Phase 2 Agent Specification Audit*
