---
title: Integration Guide
description: Feed approved PRDs into Figma, Linear, Claude Code, and other tools
created: 2026-09-17
---

# PRD Integration Guide

This guide shows you how to take a completed PRD and feed it into downstream tools — design systems, project management, code generation, and automation.

## Overview

Once a PRD is approved, the next step is **handoff**: getting the requirements into the systems where your team actually works.

This guide covers:

- **Design Integration**: Figma specs from PRD requirements
- **Project Management**: Linear/GitHub Issues from PRD user stories
- **Development**: Claude Code workflows triggered by PRDs
- **Automation**: CI/CD pipelines informed by PRD requirements
- **Custom Integrations**: Adapting PRDs for your own tools

## Design Integration: Figma

### Goal

Convert PRD requirements (user stories, UI needs, acceptance criteria) into Figma design specs that designers can iterate on.

### Process

#### Step 1: Extract Design Requirements from PRD

Review the PRD and note:

- **User roles**: Who uses this feature? (extract from user stories)
- **Pages/screens**: How many screens does the feature require? (from user stories and acceptance criteria)
- **Interactions**: What happens when user does X? (from acceptance criteria)
- **Data elements**: What information needs to be displayed? (from data model and user stories)
- **Constraints**: Color palette, typography, spacing, component library (from design system)

**Example**:

```
PRD: Automated Design Spec Generator

Extract:
- Users: Design Lead, Developer
- Screens needed:
  1. PRD upload/selection screen
  2. Spec generation progress screen
  3. Generated spec preview screen
  4. Error handling screen
- Interactions:
  - Click "Generate Specs" → show progress (0–100%)
  - Generation completes → show Figma file link
  - Click link → open Figma with specs
- Data elements:
  - PRD title, date, version
  - Spec status (pending, generating, complete, error)
  - Figma file link
  - Error message (if failed)
```

#### Step 2: Create Figma Frames from PRD Screens

In Figma:

1. Create a new board for the feature (e.g., "Design Spec Generator v1")
2. Add a frame for each screen (e.g., "Upload Screen", "Progress Screen")
3. Apply your design system (colors, typography, components)
4. Add placeholder content based on the data elements extracted in Step 1

#### Step 3: Link Figma Specs to PRD User Stories

For each Figma screen, document which PRD user story it satisfies:

**In Figma frame name or description**:

```
Upload Screen
Related PRD: US1/AC1 "User opens a PRD in the UI and clicks 'Generate Specs'"
Design ownership: [Designer name]
Status: Ready for dev handoff
```

#### Step 4: Acceptance Testing in Figma

Designers and PMs verify:

- ✓ All screens from PRD are designed
- ✓ All user stories are covered by design
- ✓ All acceptance criteria are met (e.g., "progress indicator visible" ✓, "error messages shown" ✓)
- ✓ Design system applied consistently
- ✓ Accessibility standards met (contrast, keyboard nav)

**Figma comment template**:

```
✓ Acceptance Criteria Met
- AC1: Upload button visible and clickable
- AC2: Progress bar shows 0–100%
- AC3: Figma link shown on completion
- AC4: Error message displayed if generation fails
- AC5: All elements keyboard-accessible
```

#### Step 5: Handoff to Engineering

Once approved in Figma:

1. Create a Figma handoff link (right-click frame → "Copy link")
2. Paste into Linear/GitHub issues for engineers to reference
3. Add design specs as an attachment or link in task description

**Example Linear issue**:

```
Title: Implement design spec generator UI

Description:
- [ ] Implement upload screen (see Figma: [link])
- [ ] Implement progress indicator (see Figma: [link])
- [ ] Implement success screen with Figma file link (see Figma: [link])
- [ ] Implement error screen with error messaging (see Figma: [link])

PRD Reference: [link to PRD]
Design: [link to Figma board]
```

### Figma Integration Checklist

- [ ] Design requirements extracted from PRD
- [ ] Figma frames created for all screens/pages
- [ ] Design system applied (colors, typography, components)
- [ ] Frames linked to PRD user stories/acceptance criteria
- [ ] Design reviewed and accepted by stakeholders
- [ ] Accessibility review completed (WCAG 2.2 AA)
- [ ] Figma handoff links created for engineering

## Project Management: Linear & GitHub Issues

### Goal

Convert PRD requirements into Linear issues/GitHub issues that engineering can estimate, assign, and track.

### Process

#### Step 1: Create an Epic in Linear/GitHub

Create one epic per PRD:

**Linear**:

```
Epic: Automated Design Spec Generator

Description:
Link to PRD: [PRD URL]
Status: Ready for sprint
Target completion: [date]
Team: Product + Design + Engineering
```

**GitHub**:

```
Issue Title: [Epic] Automated Design Spec Generator
Description:
PRD: [link to PRD]
Status: In Progress
Milestone: [sprint/release]
Labels: feature, epic, p1
```

#### Step 2: Create Issues from User Stories

Each user story in the PRD becomes one or more issues:

**Linear issue from PRD user story**:

```
Title: [US1] Design Lead can generate design specs from PRD

Description:
Related PRD: [link]
User Story:
  As a Design Lead, I want to generate design specs from a PRD with one click,
  so that I can hand off to developers 2 days faster.

Acceptance Criteria:
1. User opens a PRD → system displays "Generate Specs" button
2. User clicks button → system processes PRD and outputs Figma file within 2 min
3. Generated specs include colors, typography, spacing, components
4. On error → user sees actionable error message

Design: [Figma link]
Estimate: 8 points
Status: Not started
Assignee: [Engineer]
```

**GitHub issue from PRD user story**:

```
Title: Generate design specs from PRD

Description:
**Related PRD**: [link]

**User Story**:
As a Design Lead, I want to generate design specs from a PRD with one click,
so that I can hand off to developers 2 days faster.

**Acceptance Criteria**:
- [ ] User opens PRD → "Generate Specs" button visible
- [ ] Click button → Figma file generated within 2 min
- [ ] File includes colors, typography, spacing, components
- [ ] Error messages shown if generation fails

**Design**: [Figma link]

Labels: feature, us-1
Points: 8
Assignees: [Engineer]
```

#### Step 3: Create Technical Tasks

For each issue, add sub-tasks for the actual work:

**Linear sub-tasks**:

```
Parent: [US1] Design Lead can generate design specs

Sub-tasks:
1. [ ] Implement PRD parsing (extract text, colors, typography) [3 days]
2. [ ] Integrate Figma API (file creation, component setup) [4 days]
3. [ ] Map PRD requirements to Figma specs [3 days]
4. [ ] Error handling & user feedback [2 days]
5. [ ] Testing: unit, integration, e2e [3 days]
```

**GitHub issues with labels**:

```
Title: Implement PRD parsing
Parent: #123 (Generate design specs from PRD)
Description: Extract text, colors, typography from PRD for spec generation
Estimate: 3 days
Labels: task, us-1

---

Title: Integrate Figma API
Parent: #123
Description: Set up Figma API for file creation and component setup
Estimate: 4 days
Labels: task, us-1, api-integration
```

#### Step 4: Link Issues to PRD Acceptance Criteria

Each issue should map to a specific acceptance criterion:

**Mapping example**:

```
PRD Acceptance Criterion:
  "User clicks button → Figma file generated within 2 min"

Linear Issue:
  Title: "Implement PRD processing pipeline"
  Link to criterion: [PRD section AC#2]
  Why: This issue implements the core logic that generates the file
```

#### Step 5: Track Progress Against PRD

As engineering completes issues, update the epic progress:

**Linear epic progress**:

```
Epic: Automated Design Spec Generator

Progress:
- [x] AC1: Button visible (issue #101)
- [x] AC2: File generation (issue #102, #103)
- [ ] AC3: Content completeness (issue #104)
- [ ] AC4: Error handling (issue #105)

Completion: 50% (2 of 4 acceptance criteria met)
```

### Linear/GitHub Integration Checklist

- [ ] Epic created with link to PRD
- [ ] One issue per user story (with acceptance criteria)
- [ ] Technical sub-tasks created and estimated
- [ ] Each issue/task links to PRD requirement
- [ ] Design links added (Figma, mockups, etc.)
- [ ] Team assigned and estimated
- [ ] Sprint/milestone set

## Code Integration: Claude Code Workflows

### Goal

Feed PRD requirements into Claude Code agent workflows for automated code generation, testing, and documentation.

### Process

#### Step 1: Prepare PRD for Agent Input

Claude Code agents work best with well-structured PRDs. Ensure your PRD includes:

- Clear requirements (not vague)
- Specific acceptance criteria (testable)
- Data model (if applicable)
- API/integration specs
- Non-functional requirements (performance, security, etc.)

#### Step 2: Reference PRD in Claude Code Session

When coding, include the PRD in your Claude Code context:

```
/claude-code

I'm implementing a new feature. Here's the PRD:

[Paste PRD or link to PRD]

Can you:
1. Review the requirements
2. Propose a technical approach
3. Generate the initial code skeleton
4. Write unit tests
```

#### Step 3: Use PRD for Test Generation

Claude Code can generate tests directly from PRD acceptance criteria:

```
/claude-code

Based on this PRD, generate test cases for each acceptance criterion:

PRD Acceptance Criteria:
1. User can upload a PRD file → system validates file format
2. System extracts text → returns structured data
3. [etc.]

Generate: Jest test suite covering all criteria
```

#### Step 4: Validate Code Against PRD

Before submitting code, verify it satisfies the PRD:

```
/claude-code

Check this code against the PRD requirements:

PRD: [paste or link]
Code: [files to review]

Verify:
- [ ] All acceptance criteria are implemented
- [ ] No requirements are missing
- [ ] Non-functional requirements are met (performance, error handling)
```

### Claude Code Integration Checklist

- [ ] PRD included in session context (linked or pasted)
- [ ] Code reviewed against PRD acceptance criteria
- [ ] Tests generated from acceptance criteria
- [ ] All requirements implemented
- [ ] Code changes documented and committed

## Automation: CI/CD & Scripts

### Goal

Automate PR checks, testing, and deployments based on PRD requirements.

### Example: Automated Testing from PRD

Create a CI/CD job that validates code against PRD acceptance criteria:

```bash
#!/bin/bash
# Script: validate-prd.sh

# Extract acceptance criteria from PRD
PRD_FILE="prd.md"
TESTS=$(grep -A1 "Acceptance Criteria:" $PRD_FILE | grep "^- " | wc -l)

# Run test suite
npm test

# Check test results against criteria count
if [ $TESTS_PASSED -eq $TESTS ]; then
  echo "✓ All PRD acceptance criteria met"
  exit 0
else
  echo "✗ Missing $((TESTS - TESTS_PASSED)) test cases for PRD criteria"
  exit 1
fi
```

### Example: PR Template from PRD

Create a PR template that maps to PRD sections:

```markdown
## PR Template: Tied to PRD

**Related PRD**: [Link to PRD]

### Changes Made
List the PRD requirements your changes address:
- [ ] Acceptance Criterion 1: [description]
- [ ] Acceptance Criterion 2: [description]

### Testing
How did you test each acceptance criterion?
- AC1: [test method]
- AC2: [test method]

### Risk Assessment
Any PRD requirements not yet met?
- [ ] All acceptance criteria implemented
- [ ] All non-functional requirements (performance, security) met
```

## Custom Integrations

### Slack Notifications

Post PRD updates to Slack:

```python
import requests
import json

prd_title = "Automated Design Spec Generator"
prd_status = "Approved"
team = "Product + Design + Engineering"

slack_message = {
    "text": f"✓ PRD Approved: {prd_title}",
    "blocks": [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*{prd_title}* is ready for estimation\n\nTeam: {team}\nStatus: {prd_status}"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "[View PRD](#) | [Create Issues](#) | [Open Figma Board](#)"
            }
        }
    ]
}

requests.post("https://hooks.slack.com/services/YOUR/WEBHOOK/URL", json=slack_message)
```

### Database Integration

Store PRD metadata for tracking and reporting:

```sql
INSERT INTO prd_registry (title, created_by, status, url, team, estimated_effort)
VALUES (
  'Automated Design Spec Generator',
  'Product Manager Name',
  'approved',
  'https://github.com/.../prd.md',
  'engineering-team-1',
  '20-30'
);
```

## Troubleshooting

### PRD is Incomplete / Can't Hand Off

**Problem**: Team can't create issues because PRD is missing details.

**Solutions**:

1. Review [best practices](./best-practices.md) for completeness
2. Use the [quality checklist](./best-practices.md#quality-checklist) to identify gaps
3. Revise PRD before handoff
4. Re-share with stakeholders for final approval

### Issues Don't Map Cleanly to PRD

**Problem**: One issue doesn't cleanly map to one user story (or vice versa).

**Solutions**:

1. Large user story → split into multiple issues (one per acceptance criterion)
2. Multiple small stories → combine into one epic with linked issues
3. Document the mapping in issue descriptions (e.g., "Addresses US2/AC3 and US3/AC1")

### Figma Board Diverges from Implementation

**Problem**: As engineers build, they discover Figma specs don't match the actual PRD requirements.

**Solutions**:

1. Root cause: Design didn't fully review PRD. Update Figma to match PRD.
2. Root cause: PRD was ambiguous. Update PRD, then update Figma.
3. Root cause: Better solution discovered. Update PRD + Figma + issues together (don't proceed with old design).

---

**Last Updated**: 2026-09-17  
**Integration Scope**: Figma, Linear, GitHub Issues, Claude Code, Slack, Custom  
**Questions?** See [FAQ](./faq.md)
