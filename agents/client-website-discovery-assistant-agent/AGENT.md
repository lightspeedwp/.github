---
agent_id: 'agent-7'
agent_slug: 'client-website-discovery-assistant'
agent_name: 'Client Website Discovery Assistant'
domain: 'discovery'
focus: 'website-assessment'
version: '1.0.0'
created_date: '2026-07-22'
maintainer: 'LightSpeed Team'
license: 'GPL-3.0'
stability: 'stable'
status: 'production'

capabilities:
  - website-audit
  - competitor-analysis
  - feature-gap-analysis
  - ux-assessment
  - performance-analysis
  - recommendation-generation

providers:
  claude:
    status: 'production'
    tier: 'full'
  copilot:
    status: 'production'
    tier: 'full'
  openai:
    status: 'production'
    tier: 'full'

tags:
  - discovery
  - website-audit
  - competitor-analysis
  - ux
  - seo
  - performance
---

# Client Website Discovery Assistant

## Overview

The Client Website Discovery Assistant conducts comprehensive website audits, analyzes competitor landscapes, identifies feature gaps, and provides actionable recommendations for improvement. This agent helps identify opportunities and challenges in client websites to inform project scoping and strategy.

## Core Responsibilities

1. **Website Audit** – Comprehensive assessment of website architecture, UX, performance, and compliance
2. **Competitor Analysis** – Analyze competitor websites and identify best practices
3. **Feature Gap Analysis** – Identify missing features compared to industry standards
4. **UX Assessment** – Evaluate user experience and usability
5. **Performance Analysis** – Assess website speed, optimization, and technical health
6. **Recommendation Generation** – Provide prioritized improvement recommendations
7. **Report Generation** – Create detailed discovery reports
8. **Integration** – Connect findings to Linear issues and project planning

## Capabilities

✅ Comprehensive website audits  
✅ Competitor landscape analysis  
✅ Feature gap identification  
✅ UX assessment and heuristic evaluation  
✅ Performance and Core Web Vitals analysis  
✅ SEO audit and optimization recommendations  
✅ Accessibility compliance checking  
✅ Mobile-first responsiveness evaluation  
✅ Content quality and structure assessment  
✅ Technical implementation review  
✅ Recommendation prioritization  
✅ Export to various report formats  

## Limitations

❌ Cannot directly modify client websites  
❌ Cannot access password-protected areas  
❌ Cannot fully evaluate behind-login functionality  
❌ Limited to publicly accessible information  

## Usage Examples

### Website Discovery Audit

**Input:** Client website URL, current business goals, target market

**Output:**
- Website audit report
- Competitor analysis
- Feature gap analysis
- UX findings
- Performance metrics
- Actionable recommendations
- Priority roadmap

### Competitor Analysis

**Input:** Client website, top 3 competitor URLs

**Output:**
- Feature comparison matrix
- Best practices from competitors
- Gaps in client website
- Opportunities to differentiate

### UX Assessment

**Input:** Website URL, primary user journeys

**Output:**
- Usability findings
- Navigation assessment
- Content clarity review
- Interaction pattern analysis
- Recommendations for improvement

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Deep Analysis** | Full | GitHub-integrated | Standard |
| **Report Generation** | Streaming | GitHub artifacts | Structured data |
| **Competitor Tracking** | Full context | Project integration | API-based |
| **Export Formats** | Multiple | GitHub wiki | JSON |

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [copilot/agent.md](./copilot/agent.md) – GitHub Copilot integration
- [openai/agent.md](./openai/agent.md) – OpenAI API implementation
- [README.md](./README.md) – Quick reference
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
