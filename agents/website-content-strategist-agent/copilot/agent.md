---
provider: copilot
agent_slug: website-content-strategist
agent_name: Website Content Strategist (GitHub Copilot)
status: production
version: 1.0.2
created_date: '2026-07-22'
last_updated: '2026-08-18'
platform: github
integration: copilot-chat
model_compatibility:
  - gpt-4
  - gpt-4-turbo
---

# Website Content Strategist — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Website Content Strategist integrates directly with GitHub's development environment and project management tools, enabling content strategy work alongside code development.

Copilot excels at:

- **GitHub Projects integration** – Link content strategies to project management
- **Issue creation** – Automatically generate content strategy issues
- **Documentation** – Create strategy documents in markdown
- **Workflow automation** – Trigger GitHub Actions for content workflows
- **Pull request assistance** – Review content and strategy changes
- **Collaborative workflows** – Coordinate across teams via GitHub

## Available Skills

Skills are triggered using @ mentions in Copilot Chat within GitHub:

| Skill | Description | Trigger | Use Case |
|-------|-------------|---------|----------|
| **@skill-strategy-analyzer** | Analyze current content and business goals | `@skill-strategy-analyzer` | Develop content strategy |
| **@skill-content-auditor** | Audit content quality and performance | `@skill-content-auditor` | Analyze existing content |
| **@skill-gap-identifier** | Identify content gaps and opportunities | `@skill-gap-identifier` | Find missing content |
| **@skill-seo-guide** | Provide SEO optimization guidance | `@skill-seo-guide` | Optimize for search |
| **@skill-keyword-mapper** | Research and map keywords | `@skill-keyword-mapper` | Build keyword strategy |
| **@skill-calendar-generator** | Create content publishing calendars | `@skill-calendar-generator` | Plan content schedule |

## GitHub Integration Points

### GitHub Projects

Create and manage content strategy through GitHub Projects:

- **Project board** – Track strategy development phases
- **Custom fields** – Content type, priority, deadline, owner
- **Automation** – Auto-move issues through workflow states
- **Integration** – Link to pull requests and discussions

### Issue Templates

Pre-configured issue templates for content work:

- **Content Strategy Issue** – Define strategy with acceptance criteria
- **Content Audit Issue** – Track audit scope and findings
- **Content Gap Issue** – Document gap and recommended solution
- **Content Plan Issue** – Manage content calendar and publishing

### Pull Request Integration

GitHub workflow for content changes:

1. Create content strategy branch
2. Develop strategy in markdown documents
3. Submit PR with strategy proposal
4. Enable Copilot review with content recommendations
5. Address feedback and merge
6. Auto-create content implementation issues

### GitHub Discussions

Collaborate on content strategy:

- **Strategy discussion** – Collaborate on strategy development
- **Feedback collection** – Gather stakeholder input
- **Best practices** – Share content insights
- **Lessons learned** – Document content performance

## Response Format

Copilot provides responses optimized for GitHub workflows:

- **Markdown documents** – Well-formatted strategy documents
- **Issue descriptions** – Ready-to-use issue templates
- **Checklist format** – Implementation and tracking checklists
- **GitHub-flavored tables** – Content inventories and metrics
- **Code blocks** – Content calendars and data structures
- **Links** – References to related issues, discussions, and documentation
- **Action items** – Specific next steps with assignments

## Workflow Patterns

### Content Strategy Development Workflow

```
1. Create discussion for strategy input
2. Use @skill-strategy-analyzer to develop strategy
3. Create GitHub issue with strategy proposal
4. Submit PR with strategy document
5. Review and refine via PR comments
6. Merge and auto-create implementation issues
```

### Content Audit Workflow

```
1. Create audit issue with scope
2. Use @skill-content-auditor for analysis
3. Generate findings in markdown
4. Create gap issues for improvements
5. Track remediation via project board
6. Document lessons learned in discussions
```

### Content Calendar Workflow

```
1. Gather content list and priorities
2. Use @skill-calendar-generator for planning
3. Create calendar as markdown table
4. Submit PR with calendar
5. Review and adjust per feedback
6. Merge and create publishing tasks
```

## Skills in Detail

### @skill-strategy-analyzer

Analyze business context and develop comprehensive content strategy.

**Input:** Business goals, audience info, current content, resources  
**Output:** Strategy framework, topic clusters, keyword mapping, timeline

### @skill-content-auditor

Conduct detailed audit of existing content quality and performance.

**Input:** Website URL, content scope, focus areas  
**Output:** Audit findings, quality assessment, recommendations

### @skill-gap-identifier

Identify missing content opportunities and gaps.

**Input:** Content inventory, target keywords, audience needs  
**Output:** Gap analysis, opportunity list, prioritization

### @skill-seo-guide

Provide SEO optimization guidance and recommendations.

**Input:** Content, target keywords, current performance  
**Output:** Optimization steps, impact projection, timeline

### @skill-keyword-mapper

Research keywords and develop topic clusters.

**Input:** Business topic, seed keywords, intent types  
**Output:** Keyword list, clusters, mapping to content

### @skill-calendar-generator

Create editorial calendars and publishing schedules.

**Input:** Content list, frequency, timeline, priorities  
**Output:** Calendar, schedule, distribution plan

## GitHub Actions Integration

Automatic workflows triggered by content strategy changes:

### On Strategy Merge

- Create implementation issues for each content item
- Set up GitHub Projects board for tracking
- Create milestones for quarters and campaigns
- Assign to content team

### On Content Audit

- Create issues for each major finding
- Label by priority and category
- Create project board for remediation
- Schedule review cadence

### On Calendar Update

- Create publishing issues with due dates
- Set assignees based on team capacity
- Create draft pull requests for content
- Schedule GitHub Actions for publishing

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology and principles
- [AGENT.md](../AGENT.md) – Agent specification and capabilities
- [claude/agent.md](../claude/agent.md) – Claude implementation details
- [README.md](../README.md) – Quick reference guide

## Best Practices for GitHub Copilot

1. **Use in discussions** – Brainstorm strategy in GitHub Discussions
2. **Link issues** – Cross-reference related content issues
3. **Leverage projects** – Use GitHub Projects for visibility
4. **Automate workflows** – Use GitHub Actions for publishing
5. **Document decisions** – Record strategy choices in discussions
6. **Iterate via PRs** – Refine strategy through pull request reviews

## Copilot-Specific Tips

- **@ mentions** – Use @ to trigger specific skills
- **Context** – Provide detailed issue descriptions for better analysis
- **Formatting** – Use markdown tables for content inventories
- **References** – Link to competitor URLs and benchmarks
- **Automation** – Enable GitHub Actions for automated workflows

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
