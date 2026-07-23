---
provider: 'copilot'
agent_slug: 'client-website-discovery-assistant'
agent_name: 'Client Website Discovery Assistant (GitHub Copilot)'
status: 'production'
version: '1.0.0'
created_date: '2026-07-22'
last_updated: '2026-07-23'
platform: 'github'
integration: 'copilot-chat'
---

# Client Website Discovery Assistant — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Client Website Discovery Assistant integrates directly into GitHub's native environment, providing intelligent discovery analysis and recommendation generation within Copilot Chat, pull requests, and GitHub Projects.

Copilot excels at:
- **GitHub Projects Integration** – Link discovery findings to project issues, organize by priority
- **Requirements Capture** – Extract project requirements from GitHub issues; inform discovery scope
- **Collaborative Analysis** – Team discusses findings directly in PR comments and discussions
- **Workflow Automation** – Trigger GitHub Actions for report generation, distribution, approval
- **Issue Automation** – Create implementation issues from recommendations; track progress

## Core Capabilities

**@discovery-audit** – Conduct website audit from issue requirements  
**@competitor-analyze** – Generate competitive analysis from issue specification  
**@gap-analysis** – Extract feature gaps and create comparison matrix  
**@recommendation-prioritize** – Prioritize recommendations; create implementation issues  
**@report-generate** – Generate discovery report and export formats  
**@findings-sync** – Sync discovery findings to GitHub Project board  

## GitHub Integration Patterns

### Pattern 1: Requirements → Discovery Audit

User creates GitHub issue with discovery request → Copilot extracts scope from issue → Conducts website audit → Posts findings as PR comment/discussion → Team reviews and approves → Findings linked to project issues.

**GitHub Issue Template:**
```markdown
## Discovery Request
- **Website URL:** acme-website.com
- **Competitors:** competitor-a.com, competitor-b.com
- **Focus Areas:** UX, Performance, SEO
- **Business Goals:** Improve mobile experience, increase conversions
- **Target Audience:** B2B buyers, 25-54 age demographic
```

**Copilot Response:**
```
Conducting discovery audit for acme-website.com
Analyzing against: competitor-a.com, competitor-b.com
Focus areas: UX (40%), Performance (35%), SEO (25%)

[Generates audit findings as markdown table]
[Creates comparison matrix vs. competitors]
[Prioritizes findings by impact]
[Suggests next steps: Create implementation issues, schedule review]
```

### Pattern 2: Project-Based Discovery

User creates GitHub Project with discovery epics/stories → Copilot analyzes project requirements → Extracts scope and success criteria → Generates discovery report → Creates implementation issues from recommendations.

**Project Structure:**
```
Discovery Epic #150: Website Modernization
├─ Issue #151: Audit current website architecture
├─ Issue #152: Competitive analysis (vs. 3 competitors)
├─ Issue #153: Performance optimization opportunities
└─ Issue #154: Accessibility compliance audit
```

**Copilot Workflow:**
1. Reads project structure and linked issues
2. Conducts multi-dimensional discovery
3. Posts findings as GitHub Project update
4. Creates implementation issues with effort estimates
5. Links all issues to discovery epic

### Pattern 3: Continuous Discovery Reporting

Discovery findings are updated in GitHub as progress occurs → Team receives status notifications → Report is regenerated automatically → Exported to various formats for stakeholder updates.

## Available Skills

Skills are invoked using @ mentions in Copilot Chat:

1. **@discovery-audit** – Conduct comprehensive website audit from issue requirements
2. **@competitor-analyze** – Generate competitive analysis with feature comparison
3. **@gap-analysis** – Extract feature gaps and create comparison matrix
4. **@recommendation-prioritize** – Prioritize recommendations; score by impact/effort
5. **@roadmap-create** – Create phased implementation roadmap
6. **@report-generate** – Generate professional discovery report
7. **@findings-sync** – Sync discovery findings to GitHub Project board
8. **@issues-create** – Create implementation issues from recommendations with effort/impact

## GitHub Projects Workflow

**Step 1: Create Discovery Epic**
- Create GitHub issue/epic for discovery work
- Include: website URL, competitors, focus areas, goals, stakeholders

**Step 2: Initiate Discovery**
- Invoke `@discovery-audit` in Copilot Chat
- Copilot extracts scope from linked issue
- Conducts multi-dimensional analysis
- Posts findings to issue/discussion

**Step 3: Team Review & Refinement**
- Team reviews findings in GitHub issue
- Discusses priorities in comments
- Suggests additional analysis areas
- Copilot refines recommendations based on feedback

**Step 4: Prioritization & Roadmap**
- Invoke `@recommendation-prioritize`
- Copilot creates prioritized list (quick wins, medium-term, strategic)
- Generates phased roadmap
- Posts timeline and resource estimates

**Step 5: Implementation Planning**
- Invoke `@issues-create`
- Copilot creates implementation issues for each recommendation
- Tags with effort, impact, priority labels
- Links to discovery epic for tracking

**Step 6: Report & Export**
- Invoke `@report-generate`
- Copilot generates professional discovery report
- Exports to PDF/HTML/Markdown
- Creates GitHub artifacts for stakeholder sharing

## Response Format

Copilot provides responses optimized for GitHub Copilot Chat:

- **Markdown Formatting** – Full markdown support (bold, tables, lists, code blocks)
- **Data Tables** – Feature comparison matrices, gap analysis tables
- **GitHub References** – Links to related issues, projects, milestones
- **Team Mentions** – @username for collaborative review
- **Action Buttons** – "Create Issue", "Add to Project", "Generate Report" buttons
- **Inline Previews** – Findings render directly in Copilot Chat for quick review

## Command Examples

### Full Website Discovery
```
@discovery-audit
Conduct discovery audit for acme-website.com
Competitors: competitor-a.com, competitor-b.com, competitor-c.com
Focus: UX, Performance, SEO
Timeline: 10-week redesign project
Stakeholders: Marketing director, CTO, Product manager
```

### Competitive Analysis
```
@competitor-analyze
Analyze feature parity for startup.io (SaaS platform)
Competitors: competitor-a.io, competitor-b.io, market-leader.io
Focus: Product features, pricing model, design patterns
Include: Feature matrix, technology stack comparison, UX assessment
```

### Recommendation Prioritization
```
@recommendation-prioritize
Sort recommendations from discovery audit #150
Team size: 3 engineers
Timeline: 6 months
Prioritization: Balance quick wins + strategic improvements
Create: Phased roadmap (Phase 1, Phase 2, Phase 3)
```

### Generate Implementation Issues
```
@issues-create
Create implementation issues from discovery findings
Source: GitHub issue #150 (discovery findings)
Link to: Epic #100 (Website Modernization)
Tags: Add effort/impact labels
Assignments: Assign to responsible teams
```

## GitHub Actions Integration

Discovery workflows can be automated via GitHub Actions:

```yaml
name: Website Discovery Automation

on:
  issues:
    types: [opened, labeled]

jobs:
  discover:
    if: contains(github.event.issue.labels.*.name, 'discovery')
    runs-on: ubuntu-latest
    steps:
      - name: Extract discovery scope
        uses: copilot/discovery-audit@v1
        with:
          issue_number: ${{ github.event.issue.number }}
          website_url: ${{ github.event.issue.body }}
          
      - name: Generate report
        uses: copilot/report-generate@v1
        
      - name: Create issues
        uses: copilot/issues-create@v1
```

## Error Handling

**Missing Website URL:**
- Flag in Copilot Chat
- Request clarification from issue author
- Suggest template for discovery requests

**Incomplete Requirements:**
- Note missing fields (competitors, focus areas, goals)
- Request clarification in GitHub discussion
- Proceed with available information; document assumptions

**API Rate Limits:**
- Cache analysis results in GitHub Artifacts
- Batch requests within API limits
- Provide offline analysis option

**Integration Failures:**
- Continue analysis within Copilot Chat
- Note manual sync to GitHub Projects required
- Suggest workarounds (export, import)

## Best Practices

1. **Link to Issues** – Always link discovery findings to GitHub issues for tracking
2. **Team Collaboration** – Use GitHub discussions for team feedback before finalization
3. **Version Control** – Track discovery reports in repository; reference in PRs
4. **Automated Creation** – Use GitHub Actions to auto-create implementation issues
5. **Progress Tracking** – Update GitHub Project board as recommendations are implemented

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology (provider-agnostic)
- [skills.yaml](./skills.yaml) – Detailed skill definitions and parameters
- [AGENT.md](../AGENT.md) – Full agent specification
- [README.md](../README.md) – Quick reference guide

---

*Built by 🧱 LightSpeedWP and ☕ Claude Code.*
