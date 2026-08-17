---
provider: 'copilot'
agent_slug: 'client-website-discovery-assistant'
agent_name: 'Client Website Discovery Assistant (GitHub Copilot)'
status: 'production'
version: '1.0.1'
created_date: '2026-07-22'
last_updated: '2026-08-05'
platform: 'github'
integration: 'copilot-chat'
---

# Client Website Discovery Assistant — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Client Website Discovery Assistant integrates directly with GitHub's development environment, providing intelligent assistance within code editors and pull requests.

Copilot excels at:

- **GitHub Projects integration** – Manage issues and projects
- **Code analysis** – Review and improve code
- **Workflow automation** – Trigger GitHub Actions
- **Pull request assistance** – Review and comment on PRs

## Available Skills

Skills are triggered using @ mentions in Copilot Chat:

1. **@skill-analyze** – Analyze requirements
2. **@skill-plan** – Create implementation plan
3. **@skill-review** – Review outputs
4. **@skill-document** – Generate documentation
5. **@skill-validate** – Validate results
6. **@skill-sync** – Sync with project tools

## Response Format

Copilot provides responses optimized for GitHub:

- Markdown-formatted explanations
- Code snippets with syntax highlighting
- Links to related GitHub issues and discussions
- Action buttons for common tasks

## Available Skills

Discovery-specific skills triggered with @ mentions:

| Skill | Purpose | Usage |
|-------|---------|-------|
| **@discovery-analyze** | Conduct website analysis | `@discovery-analyze example.com` |
| **@competitor-compare** | Analyze competitors | `@competitor-compare site1.com vs site2.com` |
| **@ux-review** | Assess user experience | `@ux-review example.com primary-journey` |
| **@seo-audit** | SEO analysis | `@seo-audit example.com keywords` |
| **@recommendations** | Generate recommendations | `@recommendations based on findings` |
| **@report-generate** | Create discovery report | `@report-generate format:pdf` |

## GitHub Integration

Works with:

- **GitHub Projects** – Track discovery tasks and findings
- **GitHub Discussions** – Share findings and get feedback
- **Pull Requests** – Link analysis to code changes
- **GitHub Actions** – Automate discovery workflows
- **GitHub Wiki** – Document best practices and findings

## Discovery Workflow Patterns

### Pattern 1: Issue-Based Discovery

```
1. Create GitHub issue: "Website Discovery Audit for Client X"
2. Add issue description with website URL and goals
3. @discovery-analyze extracts requirements
4. Agent posts analysis findings as issue comments
5. Team discusses in comment thread
6. Create epic for recommendations
7. Generate tasks for implementation
```

### Pattern 2: Project-Based Tracking

```
1. Create GitHub Project for discovery initiative
2. Create columns: Discovery → Analysis → Recommendations → Implementation
3. Create issues for each analysis dimension
4. @discovery-analyze runs on each issue
5. Move issues through project board
6. Final report generated at end
```

### Pattern 3: Competitor Analysis Tracking

```
1. Create issue: "Competitive Analysis: Our Site vs Competitors"
2. @competitor-compare analyzes multiple sites
3. Generate feature comparison matrix
4. Post findings as GitHub discussion
5. Team reviews and identifies opportunities
6. Create action items from findings
```

### Pattern 4: Continuous Monitoring

```
1. Set up GitHub Actions workflow
2. Scheduled discovery audits (monthly/quarterly)
3. Compare metrics over time
4. Flag significant changes
5. Post alerts to discussions
6. Track improvements over time
```

## Command Examples

```
@discovery-analyze
Conduct full website audit for https://example.com
Focus on UX, accessibility, and performance

@competitor-compare
Compare https://example.com against:
- https://competitor1.com
- https://competitor2.com
- https://competitor3.com

@ux-review
Assess user experience for the checkout flow on example.com

@seo-audit
Analyze SEO for example.com targeting keywords: "services", "solutions"

@report-generate
Create comprehensive discovery report
Format: PDF
Include: Executive Summary, Detailed Findings, Recommendations
```

## GitHub Actions Integration

**Automated Discovery Audit on Issue Creation:**

```yaml
name: Auto-Discovery Audit
on:
  issues:
    types: [opened]

jobs:
  discover:
    if: contains(github.event.issue.labels.*.name, 'discovery-audit')
    runs-on: ubuntu-latest
    steps:
      - name: Extract website URL
        id: extract
        uses: actions/github-script@v7
        with:
          script: |
            const url = context.issue.body.match(/URL: (.*)/)[1];
            core.setOutput('url', url);
      
      - name: Run discovery analysis
        id: analysis
        run: |
          # Call discovery agent
          
      - name: Post findings as comment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '${{ steps.analysis.outputs.findings }}'
            })
```

**Weekly Competitive Analysis Report:**

```yaml
name: Weekly Competitor Check
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9 AM

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Run competitor analysis
        run: npm run discover:competitors
      
      - name: Create discussion post
        uses: actions/github-script@v7
        with:
          script: |
            # Post findings to discussion
```

## Response Format

Copilot provides GitHub-optimized responses:

```markdown
## Discovery Findings for example.com

### Summary
- Overall quality score: 7.5/10
- Top strengths: Clear navigation, good performance
- Main gaps: Accessibility issues, SEO optimization

### Key Findings

| Dimension | Score | Status | Notes |
|-----------|-------|--------|-------|
| Architecture | 8/10 | Good | Well-structured navigation |
| UX Design | 6/10 | Needs Work | Mobile UX could improve |
| Performance | 8/10 | Good | Good Core Web Vitals |
| Accessibility | 5/10 | Critical | WCAG compliance issues |
| SEO | 6/10 | Needs Work | Limited optimization |

### Recommendations

1. **Quick Wins** (implement in 2 weeks)
   - [ ] Fix accessibility issues
   - [ ] Improve mobile menu

2. **Medium Priority** (implement in 1-2 months)
   - [ ] Enhance SEO implementation
   - [ ] Add case studies section

### Competitive Analysis
[Feature comparison table with competitors]

### Next Steps
- [ ] Create epic for recommendations
- [ ] Assign priority to each task
- [ ] Estimate effort for implementation
```

## Error Handling

**Missing URL:**

- Request URL format clarification
- Suggest checking issue description
- Offer to analyze existing project websites

**Rate Limiting:**

- Queue analysis for later
- Suggest scheduling regular audits
- Provide interim manual checklist

**Incomplete Findings:**

- Note limitations in analysis
- Suggest additional manual review
- Flag areas needing expert input

## Best Practices

1. **Always reference** GitHub issue numbers in findings
2. **Use project board** to track discovery progress
3. **Link discussions** between discoveries and implementation
4. **Automate reporting** using GitHub Actions
5. **Create tasks** from findings immediately
6. **Document decisions** for future reference

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology
- [skills.yaml](./skills.yaml) – Skill definitions
- [AGENT.md](../AGENT.md) – Agent specification
- [README.md](../README.md) – Quick reference

---

*Built by LightSpeedWP with open-source spirit!*
