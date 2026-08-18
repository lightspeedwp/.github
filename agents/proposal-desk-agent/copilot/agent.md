---
provider: copilot
agent_slug: proposal-desk
agent_name: Proposal Desk Agent (GitHub Copilot)
status: production
version: 1.0.2
created_date: '2026-07-22'
last_updated: '2026-08-18'
platform: github
integration: copilot-chat
---

# Proposal Desk Agent — GitHub Copilot Implementation

## Overview

The GitHub Copilot implementation of the Proposal Desk Agent integrates directly into GitHub's native development experience, providing intelligent proposal, quote, and scope assistance within the code editor, pull requests, and GitHub Projects.

Copilot excels at:
- **GitHub Projects integration** – Link proposals to project issues, track deliverables, manage milestones
- **Requirements capture** – Convert GitHub issues into proposal scope and deliverables
- **Timeline visualization** – Map project phases to GitHub milestones
- **Pull request context** – Access proposal details from PR discussions
- **Workflow automation** – Trigger GitHub Actions for proposal generation, distribution, approval

## Core Capabilities

**@proposal-generate** – Create a new proposal from GitHub issue requirements
**@quote-create** – Generate itemized quote from project scope
**@scope-extract** – Extract project scope from GitHub issue templates
**@timeline-sync** – Map proposal timeline to GitHub milestones
**@deliverable-track** – Track in-scope deliverables against GitHub project status

## GitHub Integration Patterns

### Pattern 1: Requirements → Proposal

User files GitHub issue with project requirements → Copilot extracts scope → Generates proposal document → Posts draft as PR comment → Team reviews in PR → Proposal is finalized and sent.

### Pattern 2: Project-Based Quotes

User creates GitHub Project with features and epic breakdown → Copilot estimates effort per epic → Generates itemized quote → Posts to project discussions → PM reviews and approves → Quote is sent.

### Pattern 3: Milestone Tracking

User creates proposal and links to GitHub issue → Copilot maps proposal phases to milestones → Tracks completion against proposal timeline → Posts status updates to PR or discussion → Flags timeline risks early.

## Available Skills

Skills are invoked using @ mentions in Copilot Chat:

1. **@proposal-generate** – Create complete proposal from issue requirements
2. **@quote-create** – Generate itemized quote with pricing breakdown
3. **@scope-extract** – Extract scope from issue templates and convert to proposal format
4. **@timeline-sync** – Map proposal timeline to GitHub milestones
5. **@deliverable-track** – Track in-scope deliverables against project board status
6. **@feedback-collect** – Gather client feedback from GitHub discussions or PR comments
7. **@approval-route** – Route proposal for manager/legal approval within GitHub
8. **@status-update** – Generate proposal status updates for stakeholders

## GitHub Projects Workflow

**Step 1: Create Issue**
- User creates GitHub issue with project requirements
- Issue includes: client name, budget, timeline, key deliverables

**Step 2: Generate Proposal**
- User invokes `@proposal-generate` in Copilot Chat
- Copilot extracts requirements from linked issue
- Generates proposal outline as markdown
- Posts draft as PR comment or discussion

**Step 3: Team Review**
- Team reviews proposal in context of GitHub issue
- Adds comments, suggestions, edits
- PM approves or requests changes

**Step 4: Finalize & Send**
- Proposal is finalized in markdown or PDF
- System sends to client email
- Issue is linked for tracking

## Response Format

Copilot provides responses optimized for GitHub Copilot Chat:
- **Markdown formatting** – Full formatting support for bold, tables, links
- **Code blocks** – JSON, YAML, or structured data
- **GitHub references** – Links to related issues, milestones, projects
- **Mentions** – @username for team collaboration
- **Buttons** – "Create PR", "Link to Issue", "Send Proposal" action buttons
- **Inline previews** – Proposals render in Copilot Chat for quick review

## Command Examples

```
@proposal-generate
Create a proposal for the Website Redesign project (Issue #1150).
Client: Acme Corp | Budget: $30k | Timeline: 12 weeks

@quote-create
Generate a quote for the services in Issue #1151.
Include design (80 hours), development (120 hours), testing (40 hours).

@scope-extract
Extract scope from the GitHub issue template and convert to proposal format.

@timeline-sync
Map the proposal timeline (Issue #1150) to the project milestones.
```

## GitHub Actions Automation

**Proposal Auto-Generation Workflow:**
```yaml
name: Generate Proposal
on:
  issues:
    types: [labeled]

jobs:
  generate:
    if: contains(github.event.issue.labels.*.name, 'proposal:needed')
    runs-on: ubuntu-latest
    steps:
      - name: Extract requirements
        id: extract
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.issue;
            // Extract client, budget, timeline, scope from issue
      
      - name: Call Proposal Desk Agent
        uses: actions/github-script@v7
        with:
          script: |
            // Call Claude API to generate proposal
            // Post result as PR comment
```

**Proposal Review & Approval Workflow:**
```yaml
name: Proposal Review
on:
  pull_request:
    paths:
      - 'proposals/**'

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Validate proposal format
        run: npm run validate:proposal
      
      - name: Check pricing compliance
        run: npm run check:pricing
      
      - name: Route for approval
        uses: actions/github-script@v7
        with:
          script: |
            // Route to PM for approval
            // Add reviewers, set labels
```

## Error Handling

**Missing Requirements:**
- Flag missing fields (client name, budget, timeline)
- Request clarification in Copilot Chat
- Proceed with assumptions clearly noted

**GitHub API Failures:**
- Continue work offline
- Sync to GitHub manually when connection restored

**Ambiguous Scope:**
- Generate multiple scope options
- Post as discussion in GitHub issue
- Team votes on preferred option

## Advanced Patterns

**Multi-Phase Proposal:**
- Break large projects into phases
- Create separate milestones for each phase
- Link proposals to epic issues
- Track completion per phase in project board

**Retainer Estimation:**
- Link to recurring work items
- Calculate monthly/annual cost
- Track utilization against retainer budget
- Flag if usage exceeds allocation

**Competitive Quotes:**
- Generate 3 proposal variations (basic/standard/premium)
- Post all variations as discussion options
- Team selects preferred approach
- Copilot generates final proposal from selection

## Related Documentation

- [core-prompt.md](../shared/core-prompt.md) – Core methodology (provider-agnostic)
- [skills.yaml](./skills.yaml) – Detailed skill definitions and parameters
- [AGENT.md](../AGENT.md) – Full agent specification

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
