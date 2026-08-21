---
file_type: documentation
title: "Website Content Strategist Agent"
description: "README for agents/website-content-strategist-agent/README.md."
status: active
stability: stable
domain: governance
last_updated: "2026-08-19"
---

# Website Content Strategist Agent

<!-- BADGES-START -->
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
<!-- BADGES-END -->

**Version:** 1.0.0 | **Status:** Production | **Domain:** Content Strategy

## Overview

The Website Content Strategist is a multi-provider AI agent that helps organizations develop comprehensive, data-driven content strategies. It specializes in content strategy development, content auditing, gap analysis, SEO optimization, and content planning.

### Key Features

- **Content Strategy Development** – Create aligned, audience-focused content strategies
- **Content Auditing** – Comprehensive quality and performance analysis of existing content
- **Gap Analysis** – Identify missing topics, keywords, and content opportunities
- **SEO Optimization** – Data-driven recommendations for search visibility
- **Keyword Research** – Discover and map high-value keyword opportunities
- **Content Planning** – Generate editorial calendars and publishing schedules
- **User Journey Mapping** – Align content to audience needs across journey stages
- **Competitive Analysis** – Benchmark against competitor content strategies

## Supported Providers

| Provider | Status | Features |
|----------|--------|----------|
| **Claude** | Production | Full capabilities, streaming, extended context |
| **GitHub Copilot** | Production | GitHub Projects integration, issue creation |
| **OpenAI** | Production | Function calling, batch processing, webhooks |

## Quick Start

### Using Claude

```
I need to develop a content strategy for our SaaS product. 
Our target audience is marketing managers. 
We currently have 30 blog posts and want to grow organic traffic.
```

Claude will analyze your input and provide:

- Content strategy framework
- Topic clusters and keyword mapping
- Audience segment strategies
- Content calendar for the next 3 months
- Success metrics framework

### Using GitHub Copilot

```
@skill-strategy-analyzer Our business goal is lead generation. 
Target audience: B2B marketing professionals. 
We want to focus on content marketing best practices.
```

Copilot will:

- Create issues for each content piece
- Set up GitHub Projects board
- Generate content briefs
- Create PR with strategy document

### Using OpenAI

```python
from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{
        "role": "user",
        "content": "Develop content strategy for our website..."
    }],
    functions=functions,
    function_call="auto"
)
```

## 6-Phase Methodology

The agent follows a proven 6-phase process:

### 1. Intake & Discovery

Understand business goals, audience, market, and resources

### 2. Content Audit

Analyze existing content quality, relevance, and performance

### 3. Gap Analysis

Identify missing topics, keywords, and content opportunities

### 4. Strategy Development

Create comprehensive strategy framework and topic clusters

### 5. Planning & Calendar

Generate editorial calendar and publishing schedule

### 6. Success Measurement

Define metrics and monitoring framework

## Getting Started

### Prerequisites

- Access to Claude, GitHub Copilot, or OpenAI API
- Website URL or content overview
- Business goals and target audience definition
- Timeline and resource information

### Installation

This agent is available through:

1. **Claude Code** – Use directly in Claude interface
2. **GitHub Copilot** – Available in Copilot Chat (GitHub Enterprise)
3. **OpenAI API** – Via Python SDK or REST API

### Configuration

#### For Claude

- No additional setup required
- Available in default Claude interface
- Supports extended context (200k tokens)

#### For GitHub Copilot

- Configure in `.github/copilot-config.yaml`
- Enable GitHub Projects integration
- Set up issue templates

#### For OpenAI

- Set `OPENAI_API_KEY` environment variable
- Configure model and temperature settings
- Enable function calling

## Usage Examples

### Example 1: Content Strategy Development

**Input:**

```
Business Goal: Increase organic traffic for marketing agency
Target Audience: CMOs and marketing directors
Current Content: 50 blog posts, mainly case studies
Competitors: HubSpot, Marketo, Hootsuite
Timeline: 12 months
Budget: 50K/year for content
```

**Output:**

- 10-pillar content strategy
- 5 topic clusters with 30+ content pieces
- Keyword mapping (100+ keywords identified)
- 12-month content calendar
- Expected organic traffic increase: 150-200%

### Example 2: Content Audit

**Input:**

```
Website: www.example.com
Focus Areas: Quality, SEO, engagement
Benchmark Against: Top 3 competitors
```

**Output:**

- Content inventory (350+ pages audited)
- Quality scores by page type
- SEO recommendations (100+ quick wins identified)
- Top performing content analysis
- Priority improvements (Top 20 improvements prioritized)

### Example 3: Content Gap Analysis

**Input:**

```
Current Topics: WordPress, web design, performance
Target Keywords: 200+ identified from research
Audience Segments: Enterprise, SMB, Freelance
```

**Output:**

- Gap analysis matrix (50 gaps identified)
- Opportunity ranking by effort/impact
- Recommended content formats
- Topic cluster mapping
- 6-month implementation roadmap

## Architecture

```
Website Content Strategist Agent
├── Claude Implementation
│   ├── System prompt (core-prompt.md)
│   ├── Tools (6 tools with typed schemas)
│   └── Integration patterns
├── GitHub Copilot Implementation
│   ├── Skills (@skill-* commands)
│   ├── GitHub Projects integration
│   └── Issue automation
└── OpenAI Implementation
    ├── Function calling
    ├── Batch processing
    └── Error handling
```

## Capabilities & Limitations

### What It Can Do

✅ Analyze content quality and performance  
✅ Identify high-value keyword opportunities  
✅ Develop comprehensive strategies  
✅ Create content calendars and schedules  
✅ Provide SEO recommendations  
✅ Map user journey content needs  
✅ Benchmark against competitors  
✅ Generate actionable recommendations  

### What It Cannot Do

❌ Create content directly  
❌ Manage publishing systems  
❌ Guarantee rankings or traffic  
❌ Modify your website  
❌ Access password-protected content  
❌ Predict market changes  
❌ Execute campaigns automatically  

## Configuration Files

- `AGENT.md` – Agent specification and capabilities
- `claude/agent.md` – Claude implementation details
- `claude/tools.json` – Tool definitions with schemas
- `copilot/agent.md` – GitHub Copilot integration
- `openai/agent.md` – OpenAI implementation
- `shared/core-prompt.md` – Core methodology and 6-phase process

## Performance Metrics

### Typical Use Case Performance

| Task | Time | Quality | Cost |
|------|------|---------|------|
| Content Strategy | 10-15 min | Comprehensive | $0.10-0.50 |
| Content Audit | 15-30 min | Detailed | $0.30-1.00 |
| Gap Analysis | 5-10 min | Clear | $0.05-0.20 |
| SEO Optimization | 5-10 min | Actionable | $0.05-0.15 |

## Best Practices

1. **Provide Context** – Include business goals, audience, and competitors
2. **Be Specific** – Describe your situation clearly
3. **Use Sequentially** – Audit → Gap → Strategy → Calendar
4. **Iterate** – Refine recommendations based on feedback
5. **Document Assumptions** – Understand what was assumed
6. **Track Results** – Monitor actual performance vs. projections

## Support & Documentation

- **AGENT.md** – Full agent specification
- **claude/agent.md** – Claude-specific setup and features
- **openai/agent.md** – OpenAI API integration guide
- **shared/core-prompt.md** – Detailed 6-phase methodology
- **GitHub Issues** – Report issues or request features

## Related Agents

- **Client Website Discovery Assistant** – Website audit and competitor analysis
- **Website Scope Estimator** – Project estimation and scoping
- **PageSpeed Agent** – Performance optimization
- **Linear Advisor** – Project management integration

## Contributing

To contribute improvements:

1. Create an issue describing the enhancement
2. Submit a PR with changes
3. Reference the issue in your commit
4. Ensure all tests pass

## License

GPL-3.0 | Built by LightSpeedWP

## Version History

**1.0.0** (2026-07-22)

- Initial multi-provider release
- Claude, GitHub Copilot, OpenAI support
- 6-phase methodology
- Full documentation

---

**Generated:** 2026-07-23  
**Status:** Production | **Stability:** Stable | **Last Updated:** 2026-07-23

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

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
    style D fill:#f57f17,color:#000
    style E fill:#00695c,color:#fff
```
