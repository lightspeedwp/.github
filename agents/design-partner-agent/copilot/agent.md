# Design Partner Agent — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation leverages Copilot Chat within GitHub to provide design consultation integrated directly into GitHub workflows, issues, pull requests, and GitHub Projects.

## Available Skills

### 1. Design System Analysis Skill

Analyze design system structure, token organization, and component hierarchy from Figma.

```yaml
skill_id: design-system-analysis
name: "Design System Analysis"
description: "Analyze design system structure and provide recommendations"
trigger:
  - "analyze design system"
  - "review design tokens"
  - "check design system"
commands:
  - "@design-partner analyze design system in [figma_file_url]"
  - "@design-partner check design token organization"
```

**Integration:**

- GitHub Issues: Create design system audit issues
- GitHub Projects: Track design system improvements
- Pull Requests: Review design changes
- Discussions: Design system guidance

### 2. Accessibility Audit Skill

Perform WCAG 2.2 AA compliance checks on design files with actionable remediation.

```yaml
skill_id: accessibility-audit
name: "Accessibility Audit"
description: "WCAG 2.2 AA compliance assessment"
trigger:
  - "audit accessibility"
  - "check wcag compliance"
  - "accessibility review"
commands:
  - "@design-partner audit accessibility in [figma_file_url]"
  - "@design-partner check WCAG AA compliance"
```

**Integration:**

- GitHub Issues: File accessibility issues automatically
- Labels: Apply `a11y-compliance` label to issues
- Automated workflow: Run accessibility audits on schedule
- Pull request checks: Verify design changes are accessible

### 3. Component Documentation Skill

Generate component specifications, usage guides, and code examples.

```yaml
skill_id: component-documentation
name: "Component Documentation"
description: "Generate component specs and usage guides"
trigger:
  - "document component"
  - "generate component spec"
  - "create usage guide"
commands:
  - "@design-partner document [component_name] component"
  - "@design-partner generate spec for Button component"
```

**Integration:**

- GitHub wiki: Publish component documentation
- GitHub Pages: Generate design system docs site
- Pull requests: Attach documentation to component PRs
- GitHub Discussions: Link docs in design discussions

### 4. Design Token Management Skill

Extract, validate, and manage design tokens with export to code formats.

```yaml
skill_id: token-management
name: "Design Token Management"
description: "Extract and manage design tokens"
trigger:
  - "extract design tokens"
  - "validate tokens"
  - "export tokens"
commands:
  - "@design-partner extract tokens from [figma_file_url]"
  - "@design-partner validate design tokens"
  - "@design-partner export tokens as JSON/CSS/JavaScript"
```

**Integration:**

- GitHub artifacts: Store token exports
- Pull requests: Attach token files to PRs
- Workflows: Automated token extraction and validation
- Releases: Include token updates in release notes

### 5. Figma Sync Skill

Synchronize design metadata between Figma and GitHub.

```yaml
skill_id: figma-sync
name: "Figma Sync"
description: "Synchronize design with GitHub"
trigger:
  - "sync figma design"
  - "update design metadata"
  - "reflect design changes"
commands:
  - "@design-partner sync design from [figma_file_url]"
  - "@design-partner reflect design changes in GitHub"
```

**Integration:**

- GitHub Projects: Sync design status to project board
- Issues: Link design changes to GitHub issues
- Pull requests: Reference design files in PRs
- Workflows: Automated design-code sync

### 6. Design Review Skill

Conduct structured design reviews with specific feedback and recommendations.

```yaml
skill_id: design-review
name: "Design Review"
description: "Conduct structured design reviews"
trigger:
  - "review design"
  - "design feedback"
  - "design quality check"
commands:
  - "@design-partner review this design"
  - "@design-partner provide design feedback"
```

**Integration:**

- Pull request reviews: Add design feedback as comments
- Issues: Create review checklist items
- GitHub Discussions: Design review feedback
- Status checks: Design quality validation

## Copilot Chat Commands

### Basic Usage

```github-copilot
@design-partner help

@design-partner analyze design system in https://figma.com/file/abc123

@design-partner audit accessibility

@design-partner document Button component

@design-partner extract tokens from figma

@design-partner sync design changes

@design-partner review this design for quality
```

### Design System Commands

```github-copilot
@design-partner
Check our design system consistency.
Focus on:
- Component variant naming
- Design token organization
- Color palette consistency

Output results as GitHub issue with labels.
```

### Accessibility Commands

```github-copilot
@design-partner
Audit this design for WCAG 2.2 AA compliance:
[paste design URL]

Create GitHub issues for:
- Critical violations (severity: critical)
- High issues (severity: high)
- Include remediation guidance
```

### Documentation Commands

```github-copilot
@design-partner
Generate documentation for Button component:
- Component specification
- Usage guidelines
- Code examples (React)
- Accessibility requirements

Publish to GitHub wiki.
```

## GitHub Projects Integration

Design Partner integrates with GitHub Projects for design system management:

```yaml
project_template: design-system-board

columns:
  - Design Review (GitHub Issues with label: design-review)
  - Accessibility Audit (Issues with label: a11y-compliance)
  - Documentation (Issues with label: documentation)
  - Component Implementation (Pull requests)
  - Released (Closed issues/PRs)

automation:
  - When issue created → Add to Design Review column
  - When PR ready for review → Add Code Owner notification
  - When merged → Update component documentation
  - When closed → Archive to Released column
```

## Automated Workflows

### Design System Audit Workflow

```yaml
name: Design System Audit
on:
  schedule:
    - cron: '0 0 * * MON'  # Weekly Monday
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: lightspeedwp/.github/actions/design-partner-audit@v1
        with:
          figma-file-url: ${{ secrets.DESIGN_SYSTEM_FIGMA_URL }}
          
      - name: Create GitHub Issue
        uses: lightspeedwp/.github/actions/create-issue@v1
        with:
          title: "Weekly Design System Audit"
          body: ${{ steps.audit.outputs.report }}
          labels: design-audit, a11y-compliance
```

### Accessibility Check Workflow

```yaml
name: Accessibility Check
on:
  pull_request:
    paths:
      - '.design/**'
      - 'src/components/**'

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: lightspeedwp/.github/actions/design-partner-a11y@v1
        with:
          figma-file-url: ${{ github.event.pull_request.body }}
          wcag-level: AA
```

## Response Format

Copilot skill responses are structured as:

```markdown
## Design Partner Analysis

### Finding 1: [Title]
**Severity:** [Critical/High/Medium/Low]  
**Description:** [Details]  
**Recommendation:** [Action item]

[Additional findings...]

### Summary
- ✅ Passed checks: X
- ❌ Failed checks: Y
- 📋 Action items: Z

### Next Steps
1. [Action 1]
2. [Action 2]
3. [Action 3]
```

## Configuration

```yaml
# .github/copilot-design-partner.yml
agent:
  slug: design-partner
  name: Design Partner Agent
  description: AI design consultant for Figma and design systems
  
skills:
  enabled:
    - design-system-analysis
    - accessibility-audit
    - component-documentation
    - token-management
    - figma-sync
    - design-review

integrations:
  figma:
    api_endpoint: https://api.figma.com/v1
    project_files: []  # Auto-discover or list specific files
    
  github:
    projects: design-system-board
    labels:
      - design-review
      - a11y-compliance
      - design-audit
      - component-documentation
      
  workflows:
    enabled: true
    schedule:
      audit: "0 0 * * MON"
      accessibility: "on pull_request"
      token_sync: "on demand"

response_format:
  - markdown
  - github_issue
  - github_discussion
  - project_update
```

## Usage Examples

### Example 1: Design System Audit in GitHub Copilot

```github-copilot
User: @design-partner analyze our design system
      figma.com/file/abc123/design-system

Design Partner:
## Design System Analysis Report

### Finding 1: Inconsistent Button Naming
**Severity:** High
**Description:** Button variants use inconsistent naming 
(btn-primary vs primary_button vs ButtonPrimary)
**Recommendation:** Standardize to kebab-case (btn-primary, btn-secondary)

### Finding 2: Missing Accessibility States
**Severity:** Critical
**Description:** Disabled state missing for interactive components
**Recommendation:** Add disabled state to all interactive components

### Summary
- ✅ 18 components documented
- ❌ 5 naming inconsistencies
- 📋 3 accessibility gaps

### Next Steps
1. Review naming conventions
2. Add missing states to components
3. Document accessibility requirements

[Create GitHub Issue] [Open in Figma]
```

### Example 2: Create Design Task from Copilot

```github-copilot
User: @design-partner create task for button documentation

Design Partner:
✅ Created GitHub Issue #234: "Document Button Component"

Labels: design-review, component-documentation
Assignee: @design-team
Project: Design System Board

Next steps:
- Review component variants
- Create usage guidelines
- Add code examples
- Update GitHub Pages
```

## Best Practices

1. **Use @mentions** – Always mention @design-partner to activate agent
2. **Provide Figma URLs** – Include direct links for file-specific analysis
3. **Specify scope** – Clarify what needs to be reviewed or documented
4. **Link issues** – Connect design reviews to GitHub issues for traceability
5. **Publish documentation** – Use GitHub wiki or Pages for design docs
6. **Automate checks** – Set up workflows for regular design audits
7. **Track metrics** – Use GitHub Projects to monitor design system health

## Related Documentation

- [AGENT.md](../AGENT.md) – Complete agent specification
- [../claude/agent.md](../claude/agent.md) – Claude implementation
- [skills.yaml](./skills.yaml) – Skill definitions
- [../openai/agent.md](../openai/agent.md) – OpenAI implementation
- [../shared/core-prompt.md](../shared/core-prompt.md) – Core methodology

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
