---
title: "Issue Triage & Routing Slide Deck Prompt"
description: "NotebookLM and design prompt for issue intake and automation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Issue Triage & Routing Slide Deck Prompt

## System Overview

The **Issue Triage & Routing System** automates intake, classification, and routing of GitHub issues. It applies contextual labels (type, priority, area), detects issue templates, validates issue quality, and routes to appropriate teams based on content and patterns.

**Operational scope**: Issue intake, automatic labeling, template enforcement, priority assessment, team assignment, escalation routing.

**Owned by**: LightSpeed ops & engineering teams

## Key Capabilities

1. **Template Detection** - Identify which issue template was used
2. **Content Analysis** - Parse issue title, description, and metadata
3. **Label Application** - Apply type, priority, area labels automatically
4. **Priority Assessment** - Determine urgency based on content signals
5. **Team Routing** - Route to appropriate team based on area/type
6. **Quality Validation** - Ensure issue meets quality standards before processing

## Integration Points

- **Labeling Agent**: Applies labels based on issue content
- **Router Agent**: Routes issues to appropriate workflows
- **Team Assignment**: Auto-assigns based on area/priority
- **Escalation Workflows**: Critical issues trigger special handling
- **Metrics Reporting**: Track issue intake volume and patterns

## Use Cases & Examples

### Use Case 1: Bug Report Intake

User submits bug report; system triages and routes automatically.

**Triage flow:**

1. Issue created using bug-report template
2. Labeling agent parses title and description
3. Detects: `type:bug`, determines priority from keywords
4. Identifies area from component mentioned
5. Auto-assigns to area owner
6. Adds status:needs-triage label
7. Posts welcome comment with next steps
8. Routes to bug-fixing queue

### Use Case 2: Feature Request Handling

User submits feature request; queued for roadmap review.

**Triage flow:**

1. Issue created using feature-request template
2. Labeling agent applies: type:feature, priority:low (default)
3. Identifies area from feature description
4. Adds status:backlog label
5. Posts: "Thanks for the request! Team will review in next planning cycle"
6. Routes to planning queue for prioritization

### Use Case 3: Critical Security Issue

Security vulnerability reported; escalated immediately.

**Triage flow:**

1. Issue created with security keywords in title
2. Labeling agent detects: type:security, priority:urgent
3. Applies security:triage label
4. Immediately escalates to security team (GitHub team assignment)
5. Sets as blocked until assessed
6. Routes to emergency response workflow

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Issue intake manual, inconsistent classification, unclear priorities
- Stakes: Important issues lost, duplicates not caught, team assignment confusion

**Slide 02** - Triage System Overview

- Automated intake processing
- Template detection and validation
- Intelligent label application
- Priority assessment
- Team routing and assignment
- Quality enforcement

**Slide 03** - Template System

- 5-7 issue templates: bug-report, feature-request, question, documentation, security
- Templates guide users to provide required information
- Template detection: labeling agent identifies which template used
- Template validation: checks for required fields completion

**Slide 04** - Content Analysis Pipeline

- Parse issue title for keywords (bug, crash, fails, exploit, etc.)
- Extract area/component from description
- Identify priority signals (urgent, critical, blocking, P0, etc.)
- Detect duplication patterns (title similarity scan)
- Extract reproducibility info (steps, environment, logs)

**Slide 05** - Automatic Label Application

- **Type labels** (bug, feature, question, docs, security)
- **Priority labels** (urgent, high, medium, low)
- **Area labels** (core, ci, plugins, wordpress, etc.)
- **Status labels** (needs-triage, needs-info, blocked, wontfix)
- Confidence scores: high/medium/low (bot-assigned)

**Slide 06** - Priority Assessment

- Keywords: "urgent", "blocking", "critical", "P0", "blocking release"
- Bug type: crasher (high priority) vs. minor (low priority)
- Scope: widespread issue (high) vs. edge case (low)
- User impact: "many users affected" vs. "single user issue"
- Default: features=low, questions=low, bugs=medium, security=urgent

**Slide 07** - Team Routing & Assignment

- Area → Team mapping:
  - `area:core` → backend team
  - `area:wordpress` → wordpress team
  - `area:ci` → devops team
  - `area:docs` → documentation team
- Auto-assigns issue to area owner
- Escalation: urgent issues to team lead

**Slide 08** - Duplicate Detection

- Title similarity comparison (fuzzy matching)
- Recent issues (last 30 days) checked first
- If duplicate detected: post "duplicate of #123" comment
- Link to original issue, close duplicate
- Merge comments/info if useful

**Slide 09** - Quality Validation Gates

- Checks:
  - Minimum description length (50+ chars)
  - At least one reproduction step for bugs
  - Environment info provided (OS, version)
  - Expected vs. actual behavior stated
- If quality low: post "please provide more info" comment
- Blocks assignment until quality requirements met

**Slide 10** - Special Issue Handling

- **Security Reports**: Route to security team, confidential mode
- **Bug Crashes**: Immediate escalation, high priority default
- **Performance Issues**: Route to performance team
- **Documentation Issues**: Route to docs team
- **Questions**: Triage to discussions if applicable

**Slide 11** - Workflow Integration

- Issues workflow triggers on issue open/edit
- Invokes labeling.agent.js and routing.agent.js
- Agents run in parallel: label + route simultaneously
- Results posted as labels + assignment
- Comments from bot provide feedback to issue creator

**Slide 12** - Best Practices for Issue Creators

- Use issue templates (provides better context)
- Provide clear reproduction steps for bugs
- Include environment info (OS, version, logs)
- Search for duplicates before creating
- Be specific: "button crashes" vs. "stuff doesn't work"
- For security: use private vulnerability report form

**Slide 13** - Metrics & Reporting

- Issues triaged per day
- Label accuracy (user corrections track bot accuracy)
- Team assignment fairness (load balancing)
- Time-to-triage (created to labeled)
- Duplicate detection rate
- Quality gate pass rate

**Slide 14** - Troubleshooting

- **Wrong labels applied**: Comment, bot updates
- **Assigned to wrong team**: Reassign, update routing rules
- **Duplicate not detected**: Link to original, close manually
- **Quality gate blocking**: Provide more info per bot feedback

**Slide 15** - Close & Next Actions

- Triage system ensures quality intake and routing
- Contribute: Submit issues with context
- Questions & feedback

## Evidence Anchors

- `.github/scripts/agents/issues.agent.js` - Issue processing logic
- `.github/.github/workflows/issues.yml` - Issue workflow
- `.github/.github/ISSUE_TEMPLATE/` - Issue templates directory
- `.github/config/triage-config.yaml` - Routing rules (if exists)
- `.github/scripts/agents/includes/labeler-utils.js` - Label matching

## Design Notes

- **Visual theme**: Intake and routing (funnels, pipelines, team assignment)
- **Color palette**: Use team/area colors for routing visualization
- **Key visuals**: Triage pipeline diagram, template examples, label hierarchy, routing decision tree
- **Accessibility**: Clear process flow; high contrast for team colors
- **Animations**: Consider issue flowing through triage pipeline

## Quality Bar

- Show real examples of issues and how they're triaged
- Include examples of correct vs. incorrect label application
- Show team routing logic with examples
- Validate against actual issue templates and labeling rules
- Ensure all evidence references point to current develop branch
