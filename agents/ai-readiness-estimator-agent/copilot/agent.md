---
file_type: documentation
title: "Agent"
description: "Project documentation"
created_date: '2026-07-22'
last_updated: "2026-08-25"
status: active
---

# AI Readiness Estimator — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the AI Readiness Estimator integrates directly with GitHub's development environment, enabling intelligent AI readiness assessment and planning within the team's natural workflow.

Copilot excels at:

- **GitHub Projects integration** – Manage readiness assessments as GitHub Projects
- **Issue-driven workflow** – Create and track assessment tasks
- **Collaborative discussion** – GitHub Discussions for team alignment
- **Documentation generation** – Auto-generate assessment markdown
- **Workflow automation** – Trigger GitHub Actions for data collection
- **Pull request-driven recommendations** – Review PRs with AI readiness in mind

## Available Skills

Skills are triggered using @ mentions in Copilot Chat:

### Assessment Skills

1. **@skill-assess-capability** – Analyze organization's AI capability potential
   - Identify use case opportunities
   - Assess business impact
   - Evaluate technical feasibility
   - Create use case prioritization matrix

2. **@skill-assess-readiness** – Conduct organizational readiness assessment
   - Team skill evaluation
   - Infrastructure assessment
   - Data readiness check
   - Leadership alignment assessment

3. **@skill-analyze-workflow** – Analyze business workflows for AI integration
   - Process mapping
   - Identify automation points
   - Assess optimization potential
   - Calculate efficiency gains

### Planning Skills

1. **@skill-create-plan** – Create implementation plan and roadmap
   - Phase definition
   - Timeline and milestones
   - Resource allocation
   - Budget breakdown

2. **@skill-identify-risks** – Identify and assess implementation risks
   - Risk categorization
   - Risk scoring
   - Mitigation strategies
   - Contingency planning

3. **@skill-calculate-roi** – Project financial impact and ROI
   - Revenue projections
   - Cost savings calculation
   - Implementation cost estimation
   - Payback period analysis

### Collaboration Skills

1. **@skill-sync-projects** – Sync assessment results to GitHub Projects
   - Create project items
   - Organize by phase
   - Assign team members
   - Track progress

2. **@skill-document** – Generate comprehensive assessment documentation
   - Executive summary
   - Detailed findings
   - Recommendations
   - Action items

3. **@skill-review** – Review assessment completeness and quality
   - Validate assumptions
   - Check for gaps
   - Suggest improvements
   - Confirm alignment with goals

## GitHub Integration Patterns

### GitHub Projects Integration

Assessment results automatically populate GitHub Projects:

```yaml
Project: AI Readiness Assessment
├── Initiative 1: Use Case Opportunities
│   ├── Use Case UC001: Predictive Analytics
│   ├── Use Case UC002: Process Automation
│   └── Use Case UC003: Customer Insights
├── Initiative 2: Infrastructure Improvements
│   ├── Task: Data Pipeline Setup
│   ├── Task: Cloud Migration
│   └── Task: Security Enhancement
└── Initiative 3: Team Development
    ├── Task: Hire Data Scientists
    ├── Task: ML Engineering Training
    └── Task: Build Center of Excellence
```

### GitHub Issues for Assessment Tasks

Create and track assessment tasks as GitHub Issues:

```markdown
## AI Readiness Assessment: Data Infrastructure

**Assignees:** @data-eng-lead  
**Labels:** assessment, data-infrastructure, priority-high  
**Due:** 2026-08-30  

### Checklist
- [ ] Inventory all data sources
- [ ] Assess data quality
- [ ] Evaluate accessibility
- [ ] Document governance policies
- [ ] Identify gaps

### Success Criteria
- Complete data inventory
- Data quality assessment complete
- Governance framework defined
```

### GitHub Discussions for Stakeholder Alignment

Enable team discussions on readiness assessment:

```markdown
## Discussion: AI Strategy Alignment

**Category:** Ideas  
**Started by:** CTO  

### Topics
- Strategic use cases for our business
- Resource allocation and team needs
- Timeline and phasing
- Risk and mitigation strategies
```

## Response Format

Copilot provides responses optimized for GitHub:

### In-Chat Responses

- Markdown-formatted explanations
- Code and configuration examples
- Links to related GitHub issues and discussions
- Suggested next steps and action items

### Generated Artifacts

- Assessment markdown documents
- GitHub Project templates
- Issue templates for implementation tasks
- Discussion prompts for team alignment

### Recommendations

- Prioritized action items
- Estimated effort and timeline
- Resource requirements
- Success metrics and KPIs

## Workflow Examples

### Workflow 1: Quick Readiness Check

```
@skill-assess-readiness with organization context
→ Initial readiness score
→ Key gaps identified
→ Create issues for further investigation
→ @skill-sync-projects to update team tracking
```

### Workflow 2: Comprehensive Assessment

```
@skill-assess-capability → Use case opportunities
@skill-assess-readiness → Organizational readiness
@skill-analyze-workflow → Process optimization
@skill-identify-risks → Risk assessment
@skill-calculate-roi → Financial projections
@skill-create-plan → Implementation roadmap
@skill-document → Generate comprehensive report
@skill-sync-projects → Track execution
```

### Workflow 3: Phased Implementation Planning

```
@skill-create-plan with priorities and budget
→ Phased roadmap with milestones
→ Create GitHub Project with phases
→ Generate issues for Phase 1
→ @skill-sync-projects to assign to team
→ Create GitHub Discussion for team alignment
```

## GitHub Actions Integration

Automated workflows for data collection and updates:

### Workflow: Weekly Readiness Data Refresh

```yaml
name: AI Readiness Data Refresh
on:
  schedule:
    - cron: '0 9 * * MON'
jobs:
  refresh-assessment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Collect infrastructure data
        uses: ./actions/collect-infra-data
      - name: Gather team metrics
        uses: ./actions/gather-team-metrics
      - name: Update assessment results
        uses: ./actions/update-assessment
      - name: Create PR with updates
        uses: ./actions/create-assessment-pr
```

### Workflow: Assessment Review on PR

```yaml
name: Assess AI Readiness Impact
on:
  pull_request:
    paths:
      - '.github/assessment/**'
jobs:
  review-assessment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run readiness validation
        uses: ./actions/validate-assessment
      - name: Comment with recommendations
        uses: ./actions/add-assessment-comment
```

## Best Practices for Copilot Usage

### Effective Skill Chaining

- Use specific context when invoking skills
- Chain skills for comprehensive assessment
- Reference GitHub issues and projects for continuity
- Use discussions for stakeholder alignment

### Project Management

- Keep GitHub Projects synchronized
- Create issues for all action items
- Assign ownership and due dates
- Use labels consistently
- Close issues as tasks complete

### Team Collaboration

- Use GitHub Discussions for alignment
- Link assessment documents to issues
- Reference assessment results in PRs
- Enable team to collaborate in familiar interface

### Documentation

- Generate markdown assessment documents
- Maintain in `.github/assessment/` directory
- Keep GitHub Projects updated
- Create runbooks for common workflows

## Available Templates

### Assessment Document Template

```markdown
# AI Readiness Assessment — {Organization Name}

## Executive Summary
- Readiness Score: X/100
- Key Opportunities: 
- Critical Gaps:
- Recommended Actions:

## Detailed Findings
### Capability Assessment
### Infrastructure Assessment
### Team Readiness
### Financial Projections

## Recommendations & Roadmap
### Phase 1: Foundation
### Phase 2: Quick Wins
### Phase 3: Scaling
### Phase 4: Center of Excellence

## Success Metrics
```

### Implementation Roadmap Template

```markdown
# AI Implementation Roadmap — {Organization Name}

## Timeline
### Phase 1: Foundation (Months 1-2)
### Phase 2: Quick Wins (Months 3-4)
### Phase 3: Scaling (Months 5-8)
### Phase 4: Center of Excellence (Months 9+)

## Resource Requirements
## Budget Allocation
## Risk Assessment
## Success Metrics
```

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [skills.yaml](./skills.yaml) – Detailed skill definitions
- [AGENT.md](../AGENT.md) – Agent specification
- [README.md](../README.md) – Quick reference guide

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
