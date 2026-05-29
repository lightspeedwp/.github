---
title: "Labelling Agent Slide Deck Prompt"
description: "NotebookLM and design prompt for generating Labelling Agent presentation slides"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Labelling Agent Slide Deck Prompt

## Agent Overview

The **Labelling Agent** automates issue and PR label assignment based on content analysis. It applies governance labels (type, priority, area, status), enforces label consistency, prevents invalid label combinations, and maintains a canonical label taxonomy across all repositories.

**Operational scope**: Repository-wide label governance, issue/PR triage automation, label consistency enforcement, taxonomy maintenance.

**Owned by**: LightSpeedWP ops & product teams

## Key Capabilities

1. **Content-Based Labeling** - Analyze title/description to suggest or auto-assign labels (type, area, priority)
2. **Governance Enforcement** - Prevent invalid label combinations (e.g., both needs-changelog and no-changelog)
3. **Taxonomy Management** - Maintain canonical label definitions (color, description, usage rules)
4. **Bulk Remediation** - Fix labeling hygiene across repository (remove deprecated labels, add missing required labels)
5. **Label Suggestions** - Recommend labels to human reviewers with confidence scores
6. **Metrics & Health** - Track label compliance, usage patterns, missing labels

## Integration Points

- **Upstream**: None (can run independently)
- **Downstream**: Planner Agent (organizes issues by labels), Reviewer Agent (filters by label)
- **Governance**: `.github/labels.yml` (canonical taxonomy), `.github/labeling.yml` (triage rules)

## Use Cases & Examples

### Use Case 1: Issue Triage Automation

New issue submitted: "Button on homepage doesn't respond to clicks"

**Labelling Agent workflow:**

1. Analyze title/description: mentions UI, interaction problem
2. Auto-suggest: type:bug, area:frontend, priority:high (issue unresolved in main)
3. Apply labels automatically (or with human confirmation for edge cases)
4. Result: Issue properly triaged without manual effort

### Use Case 2: PR Label Enforcement

PR submitted with changelog + no-changelog labels (conflicting).

**Labelling Agent workflow:**

1. Detect conflicting labels (both cannot be true)
2. Alert: "PR cannot have both meta:needs-changelog and meta:no-changelog"
3. Prevent merge until conflict resolved
4. Suggest fix: "Remove one or update PR description to clarify"

### Use Case 3: Bulk Label Hygiene

Deprecate old label type; migrate all issues to new label.

**Labelling Agent workflow:**

1. Scan repository: find all issues with deprecated label
2. Auto-apply new label to matching issues
3. Remove deprecated label
4. Generate report: "Migrated 45 issues from type:improvement to type:feature"

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Issues/PRs arrive unlabeled or mislabeled; manual triage time-consuming, inconsistent
- Stakes: Poor discoverability; wrong priorities; triaging delays; confused stakeholders

**Slide 02** - Labelling Agent Role

- Automates issue/PR triage with intelligent content analysis
- Maintains canonical label taxonomy across repositories
- Enforces governance rules: valid combinations, consistency

**Slide 03** - Label Taxonomy

- **Type**: bug, feature, enhancement, performance, security, documentation, chore
- **Priority**: critical, high, medium, low (or none for unprioritzed)
- **Area**: frontend, backend, infrastructure, documentation, automation, etc.
- **Status**: in-progress, blocked, needs-review, ready-to-merge
- **Meta**: needs-changelog, no-changelog, breaking-change, etc.

**Slide 04** - Content-Based Labeling

- Title analysis: Keywords like "fix", "add", "improve", "error", "crash" hint at label
- Description analysis: Longer context reveals area, priority, type
- Code analysis: Which files changed → area label
- Examples: "Button doesn't work" → type:bug, area:frontend

**Slide 05** - Priority Determination

- Critical: Affects production, security risk, widespread outage
- High: Impacts multiple users, feature blocker
- Medium: Affects subset of users, nice-to-have feature
- Low: Edge cases, minor improvements
- Confidence scoring: High confidence on clear signals, low on ambiguous

**Slide 06** - Label Governance Rules

- Type + Priority: Must have both for issues (issues without are incomplete)
- Meta:needs-changelog + Meta:no-changelog: Mutually exclusive
- Type:hotfix + Priority:low: Invalid combination (hotfixes are urgent)
- Status labels: Can have at most one status at a time

**Slide 07** - Conflict Detection & Prevention

- Invalid combinations: Agent detects and alerts
- Deprecated labels: Automatically migrate or remove
- Stale status: Warn if status hasn't changed in X days (stuck)
- Missing required labels: Block merge if required labels missing

**Slide 08** - Bulk Remediation

- Organization-wide label updates: "Rename all type:task to type:chore"
- Migration workflows: "Copy area:plugin to area:plugin-pack for affected issues"
- Cleanup: "Remove deprecated labels used by < 5 issues"
- Validation: Ensure all changes maintain label constraints

**Slide 09** - Integration with Planner Agent

- Planner uses labels to organize backlog by priority/area
- Planner creates milestones with label-based issue membership
- Feedback: Planner suggests missing labels if issue doesn't fit categories

**Slide 10** - Integration with Reviewer Agent

- Reviewer can filter findings by issue label (e.g., "Ignore style issues on type:documentation")
- Reviewer suggests label changes if issue classification changes

**Slide 11** - Label Suggestions with Confidence

- Agent suggests labels with confidence scores
- High confidence (>90%): Auto-apply
- Medium confidence (70-90%): Suggest to human with explanation
- Low confidence (<70%): Report but require human decision
- User feedback: "This suggestion was wrong" trains agent for next time

**Slide 12** - Adoption & Metrics

- Label compliance: % of issues with required labels
- Type/Priority coverage: % of issues with both
- Governance violation rate: % of invalid label combinations
- Suggestion accuracy: % of automated suggestions correct
- User satisfaction: % of suggestions developers accept

**Slide 13** - Lessons & Challenges (optional)

- Lesson: Clear label taxonomy prevents confusion
- Lesson: Automated enforcement prevents violations at source
- Challenge: Ambiguous issues may not fit neatly into categories
- Best practice: Provide label documentation for edge cases

**Slide 14** - Roadmap (optional)

- Current: Content-based labeling, governance enforcement
- Near-term: ML-based label suggestions with training feedback
- Future: Cross-repository label taxonomy harmonization

**Slide 15** - Close & Next Actions

- Labelling Agent keeps issues organized and discoverable
- Contribute: Help Labelling Agent learn from your feedback
- Questions & feedback

## Evidence Anchors

- `.github/labels.yml` - Canonical label taxonomy with definitions and colors
- `.github/labeling.yml` - Triage rules and auto-labeling logic
- `.github/workflows/labeling.yml` - Label automation workflow
- `AGENTS.md` - Labelling Agent responsibility specification
- Sample issue/PR with labels (from actual repository)

## Design Notes

- **Visual theme**: Organization & automation (tags, filters, folders)
- **Color palette**: Use label colors from `.github/labels.yml` directly
- **Key visuals**: Label taxonomy diagram, conflict detection example, confidence score visualization
- **Accessibility**: Clear label descriptions; color + text for distinction (not color alone)
- **Animations**: Consider label suggestion reveal, confidence score animation

## Quality Bar

- Show actual label colors from `.github/labels.yml`
- Include examples of valid and invalid label combinations
- Explain confidence scoring for suggestions
- Validate against actual issue/PR labeling patterns
- Be honest about limitations (ambiguous issues, edge cases)
