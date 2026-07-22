---
agent_id: 'agent-8'
agent_slug: 'website-scope-estimator'
agent_name: 'Website Scope Estimator'
domain: 'estimation'
focus: 'project-scoping'
version: '1.0.0'
created_date: '2026-07-22'
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

tags:
  - estimation
  - project-scoping
  - effort-estimation
  - timeline-planning
  - resource-planning
  - budget-estimation
---

# Website Scope Estimator

## Overview

The Website Scope Estimator analyzes project requirements and provides accurate effort estimates, realistic timelines, resource allocation recommendations, and budget projections. This agent bridges discovery findings to proposal generation and project planning.

## Core Responsibilities

1. **Feature Scope Analysis** – Evaluate required features and functionality
2. **Effort Estimation** – Estimate development hours for each component
3. **Timeline Generation** – Create realistic project timelines with milestones
4. **Resource Planning** – Recommend team composition and resource allocation
5. **Budget Estimation** – Project costs based on effort and market rates
6. **Risk Assessment** – Identify project risks and mitigation strategies
7. **Integration** – Connect estimates to Linear issues and Proposal Desk Agent

## Capabilities

✅ Detailed feature scope analysis  
✅ Effort estimation with confidence levels  
✅ Realistic timeline generation  
✅ Resource allocation planning  
✅ Budget estimation with scenarios  
✅ Risk identification and mitigation  
✅ Effort breakdown by component  
✅ Historical comparison  
✅ Contingency planning  
✅ Export to proposal formats  

## Limitations

❌ Cannot guarantee accuracy without complete requirements  
❌ Estimates based on standard team efficiency  
❌ Cannot account for unknown unknowns  
❌ Market rates assumed unless configured  

## Usage Examples

### Scope and Estimate Project

**Input:** Website requirements, features, current state, target timeline

**Output:**
- Detailed scope breakdown
- Effort estimates by feature
- Resource recommendations
- Timeline with milestones
- Budget projection
- Risk assessment
- Confidence levels

### Timeline Planning

**Input:** Features, team size, current capacity

**Output:**
- Realistic project timeline
- Phase breakdown
- Milestone definitions
- Resource schedule
- Buffer recommendations
- Critical path analysis

### Risk Assessment

**Input:** Project complexity, team experience, constraints

**Output:**
- Risk identification
- Impact assessment
- Probability estimates
- Mitigation strategies
- Contingency planning
- Success probability

## Provider Configuration Matrix

| Feature | Claude | Copilot | OpenAI |
|---------|--------|---------|--------|
| **Deep Analysis** | Full | GitHub Projects | Structured |
| **Timeline Visualization** | Detailed | GitHub workflow | JSON data |
| **Budget Modeling** | Multi-scenario | GitHub artifacts | API-ready |
| **Integration** | Full context | Project management | Function calling |

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [README.md](./README.md) – Quick reference guide
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
