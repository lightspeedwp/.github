---
name: 'Website Scope Estimator'
description: 'Project estimation tool for feature scoping, effort estimation, and budget planning'
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
status: 'active'
providers:
  - claude
  - copilot
  - openai

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

## Estimation Framework

### Feature Complexity Scoring

**Low** (1-2 days): Simple feature, well-defined, no dependencies  
**Medium** (3-5 days): Standard feature, some integration, moderate complexity  
**High** (1-2 weeks): Complex feature, multiple integrations, significant testing  
**Very High** (2-4 weeks): Highly complex, many dependencies, custom solutions  

### Effort Estimation Components

- **Analysis & Design** – 10-15% of total
- **Development** – 50-60% of total
- **Testing & QA** – 15-25% of total
- **Review & Revision** – 10-15% of total
- **Deployment & Support** – 5-10% of total

### Resource Allocation Models

**Small Project (< 4 weeks):**

- 1 Full-stack Developer
- 0.5 QA Engineer (shared)
- 0.25 PM (oversight)

**Medium Project (4-12 weeks):**

- 1-2 Developers
- 1 QA Engineer
- 1 PM (part-time)
- 0.5 Designer (as needed)

**Large Project (12+ weeks):**

- 2-4 Developers (by specialty)
- 1-2 QA Engineers
- 1 PM (full-time)
- 1 Designer (full-time)
- 0.5 Architect (as needed)

## Advanced Scenarios

### Scenario 1: E-Commerce Site Redesign

**Scope:** Complete redesign, new features, migration
**Features:**

- Design system (120h)
- Homepage (40h)
- Product pages (60h)
- Shopping cart (80h)
- Checkout (100h)
- Admin panel (120h)
- Testing & QA (160h)
**Estimate:** 680 hours | 4 weeks | $68,000 (@ $100/hr) | Team: 2 devs + 1 QA

### Scenario 2: SaaS Product Launch

**Scope:** Full product build from scratch
**Features:**

- Authentication (80h)
- User dashboard (100h)
- Core product (200h)
- API (80h)
- Analytics (60h)
- Admin panel (80h)
- Testing (120h)
**Estimate:** 720 hours | 5 weeks | $72,000 | Team: 2 devs + 1 QA

### Scenario 3: Content Website Build

**Scope:** Content-heavy site with custom features
**Features:**

- Static pages (40h)
- Blog system (80h)
- Search (60h)
- Comments (40h)
- Analytics (40h)
- SEO optimization (40h)
**Estimate:** 300 hours | 2.5 weeks | $30,000 | Team: 1 dev + shared QA

## Risk Assessment Framework

### Technical Risks

- **Architecture complexity** – Unknown system design
- **Technology choices** – Unfamiliar tech stack
- **Integration challenges** – Third-party system integration
- **Performance requirements** – Demanding performance needs
- **Security requirements** – Complex security needs

### Team Risks

- **Skill gaps** – Team lacks required expertise
- **Resource availability** – People unavailable when needed
- **Communication** – Poor communication across team
- **Turnover** – Key people leaving mid-project

### Project Risks

- **Scope creep** – Requirements expanding
- **Unclear requirements** – Ambiguous specifications
- **Stakeholder involvement** – Low engagement from client
- **External dependencies** – Blocked by third parties
- **Timeline pressure** – Aggressive deadlines

## Mitigation Strategies

**For Technical Risks:**

- Conduct proof-of-concept for new technologies
- Allocate extra time for integration work
- Plan architecture review sessions
- Budget for performance optimization

**For Team Risks:**

- Cross-train team members
- Document all decisions and processes
- Schedule regular sync meetings
- Plan for contingency resources

**For Project Risks:**

- Define scope clearly in writing
- Get stakeholder sign-off early
- Build in contingency buffer (15-25%)
- Establish change control process
- Plan regular status reviews

## Timeline Templates

### 2-4 Week Project

- Week 1: Analysis, design, setup
- Week 2: Core development
- Week 3: Feature completion, testing
- Week 4: Bug fixes, deployment

### 4-8 Week Project

- Week 1-2: Analysis, architecture, design
- Week 3-5: Development (phased)
- Week 6: Integration, testing
- Week 7-8: QA, revision, deployment

### 8+ Week Project

- Phase 1: Requirements, design, architecture
- Phase 2: Core development
- Phase 3: Additional features
- Phase 4: Integration, optimization
- Phase 5: Testing, deployment

## Budget Estimation Models

### Fixed-Price Model

- Full estimation upfront
- 25-30% contingency built in
- Clear scope definition required
- Higher risk on developer side

### Time & Materials Model

- Hourly rates defined upfront
- Flexible scope
- Regular billing
- Lower risk on developer side

### Retainer Model

- Fixed monthly cost
- Capped hours included
- Additional hours billed separately
- Ongoing support included

## Related Documentation

- [core-prompt.md](./shared/core-prompt.md) – Core methodology
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [copilot/agent.md](./copilot/agent.md) – GitHub Copilot integration
- [openai/agent.md](./openai/agent.md) – OpenAI API implementation
- [README.md](./README.md) – Quick reference guide
- [AGENTS.md](../../AGENTS.md) – Organization standards

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
