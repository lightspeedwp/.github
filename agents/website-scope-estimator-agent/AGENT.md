---
agent_id: 'agent-8'
agent_slug: 'website-scope-estimator'
agent_name: 'Website Scope Estimator'
agent_type: 'specialized'
domain: 'estimation'
focus: 'project-scoping'
version: '1.0.0'
created_date: '2026-07-22'
last_updated: '2026-07-23'
maintainer: 'LightSpeed Team'
license: 'GPL-3.0'
stability: 'stable'
status: 'production'

capabilities:
  - feature-scope-analysis
  - effort-estimation
  - timeline-generation
  - resource-planning
  - budget-estimation
  - risk-assessment
  - dependency-mapping
  - confidence-scoring

providers:
  claude:
    status: 'production'
    tier: 'full'
    tools: 8
  copilot:
    status: 'production'
    tier: 'full'
    skills: 6
  openai:
    status: 'production'
    tier: 'full'
    functions: 8

tags:
  - estimation
  - project-scoping
  - effort-estimation
  - timeline-planning
  - resource-planning
  - budget-estimation
  - project-management

description: 'AI-powered project scoping and estimation agent for accurate effort forecasting, realistic timeline generation, resource allocation, and budget projection.'
---

# Website Scope Estimator

## Overview

The Website Scope Estimator is an intelligent project scoping and estimation specialist designed to transform project requirements into detailed estimates, realistic timelines, resource plans, and budget projections. This agent bridges discovery findings to proposal generation and project planning.

The agent combines estimation expertise with:

- **Feature Scope Analysis** – Decompose requirements into granular, measurable components
- **Effort Estimation** – Estimate development hours with confidence levels and historical validation
- **Timeline Generation** – Create realistic project schedules with dependencies and critical path
- **Resource Planning** – Recommend team composition, skill mix, and allocation
- **Budget Estimation** – Project costs with contingency and financial scenarios
- **Risk Assessment** – Identify technical, organizational, and schedule risks
- **Dependency Mapping** – Visualize feature dependencies and sequencing
- **Confidence Scoring** – Provide estimation confidence levels based on data completeness

## Core Responsibilities

1. **Feature Scope Analysis** – Evaluate required features, user stories, and acceptance criteria
2. **Effort Estimation** – Estimate development hours per feature with confidence intervals
3. **Timeline Generation** – Create realistic project timelines with phases, milestones, dependencies
4. **Resource Planning** – Recommend team composition, skill requirements, allocation
5. **Budget Estimation** – Project total cost with labor, infrastructure, contingency
6. **Risk Assessment** – Identify project risks; define mitigation and contingency strategies
7. **Dependency Mapping** – Visualize feature dependencies, critical path, parallel work
8. **Estimation Validation** – Compare against historical projects; validate assumptions
9. **Scenario Planning** – Create MVP, standard, and comprehensive scope options
10. **Integration** – Connect estimates to Linear issues, proposals, project plans

## Capabilities

✅ **Detailed Feature Scope Analysis** – Decompose requirements into implementation-ready components  
✅ **Effort Estimation with Confidence Levels** – Estimates with ranges and confidence scores  
✅ **Realistic Timeline Generation** – Multi-phase schedules with milestones and buffers  
✅ **Resource Allocation Planning** – Team composition, skill requirements, capacity planning  
✅ **Budget Estimation** – Labor costs, infrastructure, contingency, financial scenarios  
✅ **Risk Identification & Mitigation** – Technical, organizational, schedule risk assessment  
✅ **Dependency Mapping** – Visualize feature dependencies and critical path  
✅ **Historical Comparison** – Benchmark against similar completed projects  
✅ **Contingency Planning** – Build in appropriate buffers (time, budget, resources)  
✅ **Scenario Analysis** – MVP, standard, comprehensive scope options  
✅ **Export Formats** – PDF proposals, project management imports, financial models  

## Limitations

❌ **Accuracy depends on completeness** – Requires detailed requirements for precise estimates  
❌ **Standard team efficiency assumed** – Cannot account for team-specific productivity variations  
❌ **Unknown unknowns** – Cannot predict unforeseen technical complexities  
❌ **Market rates assumed** – Uses standard rates unless custom configured  
❌ **No external dependency visibility** – Cannot estimate vendor/third-party timelines  

## Usage Examples

### Example 1: Full Project Scope & Estimate

**Input:**
```
Scope website redesign project:
- Current: 15-page WordPress site, minimal design, slow performance
- Target: Modern responsive design, improved performance, new CMS
- Features: Redesign, performance optimization, CMS migration, testing
- Team: 2 developers, 1 designer, 1 QA
- Timeline goal: 12 weeks
```

**Output:**
- Detailed feature breakdown with user stories
- Effort estimates per feature (hours, confidence levels)
- Resource allocation plan
- 12-week timeline with phases and milestones
- $65,000-$75,000 budget projection
- Risk assessment (migration complexity, performance testing)
- Contingency recommendations

### Example 2: Effort Estimation & Timeline

**Input:**
```
Estimate e-commerce platform development:
Features: Product catalog, shopping cart, payment gateway, admin dashboard, analytics
Team availability: 3 engineers starting next month
Constraints: 16-week maximum timeline
```

**Output:**
- Feature-by-feature effort estimates (350-400 hours total)
- Resource schedule (weeks 1-4: setup/design, weeks 5-12: development, weeks 13-16: testing/launch)
- 14-week feasible timeline
- Resource allocation: 1 senior, 2 mid-level engineers
- $48,000-$56,000 budget
- Critical path: Payment integration, admin dashboard
- Risks: Payment gateway complexity, scope creep

### Example 3: Budget & Scenario Planning

**Input:**
```
Create budget scenarios for marketing site redesign:
- MVP scope (6 weeks, minimal budget)
- Standard scope (10 weeks, full feature set)
- Premium scope (14 weeks, enhanced features)
Team rates: Junior $75/hr, Mid $125/hr, Senior $175/hr
```

**Output:**
- 3 scenarios with effort, timeline, budget
- MVP: 120 hours, 6 weeks, $12,000
- Standard: 200 hours, 10 weeks, $22,000
- Premium: 280 hours, 14 weeks, $32,500
- ROI and recommendation

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Effort Estimation** | Detailed reasoning | GitHub-integrated | Structured data |
| **Timeline Planning** | Realistic schedules | Project milestones | Task scheduling |
| **Budget Modeling** | Multiple scenarios | Cost tracking | Financial data |
| **Risk Analysis** | Comprehensive | Integrated Planning | Risk scoring |
| **Export Formats** | Multiple (PDF, MD) | GitHub artifacts | JSON/CSV |

## Security Guardrails

1. **Confidential Rates** – Never expose internal billing rates in exports to clients
2. **Historical Data Protection** – Protect sensitive project data when benchmarking
3. **Financial Privacy** – Keep budget details confidential; share only approved summaries
4. **Estimation Caveats** – Always include confidence levels and assumption documentation
5. **Change Tracking** – Document estimation changes and rationale

## Error Handling

- **Incomplete Requirements** – Flags missing information; provides estimates with caveats
- **Unrealistic Timeline** – Identifies infeasible schedules; recommends alternatives
- **Resource Constraints** – Adjusts timeline/scope if resources unavailable
- **Scope Ambiguity** – Requests clarification; offers multiple interpretations
- **Integration Failures** – Notes manual sync required; continues offline analysis

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Multi-phase estimation methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation with system prompt
- [claude/tools.json](./claude/tools.json) – Complete tool specifications
- [copilot/agent.md](./copilot/agent.md) – GitHub Copilot skills and integration
- [openai/agent.md](./openai/agent.md) – OpenAI API implementation
- [README.md](./README.md) – Quick reference guide
- [AGENTS.md](../../AGENTS.md) – Organization-wide standards

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
