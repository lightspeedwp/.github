---
title: "Planner Agent Slide Deck Prompt"
description: "NotebookLM and design prompt for generating Planner Agent presentation slides"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Planner Agent Slide Deck Prompt

## Agent Overview

The **Planner Agent** orchestrates strategic roadmaps, project planning, and issue prioritization across the lightspeedwp/.github ecosystem. It synthesizes health metrics from Meta Agent, prioritizes work based on impact, coordinates release timing with Release Agent, and maintains visibility into progress through dashboards and status updates.

**Operational scope**: Repository-wide roadmap and project planning, issue prioritization, milestone coordination, strategic alignment.

**Owned by**: LightSpeedWP product & engineering leadership

## Key Capabilities

1. **Roadmap Planning** - Create multi-quarter roadmaps with themes, milestones, and dependencies
2. **Issue Prioritization** - Assess impact and effort; rank work by value
3. **Dependency Management** - Identify blocking relationships; surface critical paths
4. **Milestone Coordination** - Align releases with feature readiness, platform parity
5. **Progress Tracking** - Dashboards showing actual vs. planned progress
6. **Capacity Planning** - Balance roadmap against team capacity and competing priorities

## Integration Points

- **Upstream**: Meta Agent (health metrics inform priorities), Labelling Agent (organize by labels)
- **Downstream**: Release Agent (inform timing), all agents (consume roadmap for daily work)
- **Governance**: `docs/ROADMAP.md` (published roadmap), `.github/projects/` (active initiatives)

## Use Cases & Examples

### Use Case 1: Quarterly Planning

Q3 planning session: team decides priorities for next 13 weeks.

**Planner Agent workflow:**

1. Gather inputs: Meta Agent health report (gaps), team capacity, customer feedback
2. Score initiatives: Impact (reach, value), Effort (weeks), Risk, Strategic alignment
3. Propose roadmap: 3-4 big initiatives per quarter, balanced by risk/value
4. Create milestones: Break initiatives into 2-3 week sprints
5. Publish roadmap: Share with stakeholders, show progress dashboard
6. Track: Weekly updates, bubble up blockers or scope changes

### Use Case 2: Work Assignment

Developer asks: "What should I work on this sprint?"

**Planner Agent workflow:**

1. Consult roadmap: Which initiatives are active this sprint?
2. Query backlog: Which issues are highest priority and unassigned?
3. Consider capacity: Is developer specialized (frontend) or generalist?
4. Recommend: "Here are 3 high-impact issues in your area; start with X"
5. Track: Measure progress toward sprint goals

### Use Case 3: Blocker Identification

Release target is in jeopardy; need to understand dependencies.

**Planner Agent workflow:**

1. Analyze dependency graph: Which tasks are blocking release?
2. Critical path: What's the shortest path to release readiness?
3. Identify risks: Are any blockers high-risk or dependent on external teams?
4. Recommend mitigation: Parallel work, scope reduction, timeline adjustment
5. Escalate: Surface top 3 blockers to leadership

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Roadmap unclear; priorities conflicting; work unfocused; progress invisible
- Stakes: Missed milestones; wasted effort on low-impact work; low team morale

**Slide 02** - Planner Agent Role

- Orchestrates strategic roadmap and issue prioritization
- Balances impact vs. effort; surfaces dependencies and risks
- Maintains visibility: Progress dashboards, blockers, capacity constraints

**Slide 03** - Roadmap Structure

- **Themes**: Quarterly focus areas (platform stability, performance, AI governance, etc.)
- **Initiatives**: Multi-sprint projects that advance themes (4-8 weeks typical)
- **Milestones**: 2-3 week sprints; measurable outcomes
- **Dependencies**: Initiative X blocks Initiative Y (visualized in critical path)

**Slide 04** - Impact & Effort Scoring

- **Impact**: Reach (how many users/systems affected?), Value (what problem solved?), Alignment (strategic fit?)
- **Effort**: Weeks of engineering time, complexity risk, external dependencies
- **Scoring**: Simple model (1-5 scale) helps compare across initiatives
- **Trade-offs**: High-impact, low-effort initiatives prioritized; high-impact, high-effort deferred or scoped

**Slide 05** - Prioritization Framework

- ICE model: Impact × Confidence × Ease
- MoSCoW: Must have, Should have, Could have, Won't have
- Weighted scoring: Combine multiple factors with team-agreed weights
- Transparency: Show how priorities are calculated, allow teams to contest

**Slide 06** - Backlog Management

- Backlog grooming: Issues well-described, labeled, estimated
- Story pointing: Effort estimates (Fibonacci sequence: 1, 2, 3, 5, 8, 13)
- Capacity planning: Team velocity (points per sprint) informs commitment
- Sprint goal: Selected issues tied to current milestone objective

**Slide 07** - Critical Path & Dependencies

- Visualization: Which initiatives are on critical path to release?
- Blockers: Which issues/initiatives prevent others from starting?
- Parallel opportunities: Which work can happen in parallel vs. sequentially?
- Risk: High-risk items moved earlier to surface issues sooner

**Slide 08** - Integration with Meta Agent

- Meta Agent provides health baseline: document staleness, broken links, test coverage
- Planner uses to inform priorities: "High linting violations → assign Linting Agent improvement"
- Example: "50% of docs stale → invest in documentation refresh initiative"

**Slide 09** - Integration with Release Agent

- Planner sets release milestones
- Release Agent executes against schedule
- Feedback: Actual release dates vs. planned inform future estimates

**Slide 10** - Integration with All Other Agents

- Planner roadmap informs daily work for Release, Reviewer, Linting, Labelling, Meta, Branding agents
- Status updates: Agents report progress toward roadmap milestones
- Adjustment loop: If pace changes, roadmap adjusted accordingly

**Slide 11** - Progress Tracking & Dashboards

- **Burndown chart**: Issues resolved per sprint
- **Velocity trend**: Story points completed per sprint (is team getting faster/slower?)
- **Initiative health**: % complete, at-risk indicators, blockers
- **Capacity utilization**: How much of team capacity allocated vs. available?

**Slide 12** - Adoption & Transparency

- Roadmap published and visible to all stakeholders
- Monthly updates: Progress reports, milestone changes, blocker escalations
- Open backlog: Anyone can see what's planned, propose new initiatives
- Feedback loop: Team input shapes roadmap adjustments

**Slide 13** - Metrics & Success (optional)

- On-time delivery: % of milestones hit on schedule
- Scope adherence: Impact delivered vs. planned
- Team velocity: Points/sprint trending up (efficiency improving)
- Stakeholder satisfaction: Are priorities aligned with business goals?

**Slide 14** - Lessons & Flexibility (optional)

- Lesson: Clear priorities prevent thrashing and re-prioritization
- Lesson: Critical path identification prevents surprise delays
- Flexibility: Roadmap is guide, not constraint; adjust as context changes
- Best practice: Visible metrics build trust and accountability

**Slide 15** - Close & Next Actions

- Planner Agent keeps teams focused and coordinated
- Contribute: Provide feedback on priorities; communicate blockers early
- Questions & feedback

## Evidence Anchors

- `docs/ROADMAP.md` - Published product roadmap
- `.github/projects/` - Active initiatives and milestones
- `.github/workflows/planner.yml` - Planner Agent workflow (if automated)
- `AGENTS.md` - Planner Agent responsibility specification
- Sample issue/PR with milestone assignment
- Sample dashboard screenshot (burndown, velocity, initiative health)

## Design Notes

- **Visual theme**: Strategy & planning (roadmaps, milestones, critical path)
- **Color palette**: Use roadmap/planning colors (blues, greens for progress)
- **Key visuals**: Roadmap Gantt chart, critical path diagram, burndown chart, initiative health dashboard
- **Accessibility**: Clear legend for charts; data tables with proper headers
- **Animations**: Consider Gantt chart reveal, progress bar animation, dependency line animation

## Quality Bar

- Distinguish published roadmap vs. internal planning (what's public vs. confidential?)
- Include realistic timelines (avoid overly optimistic promises)
- Show trade-offs: What gets deferred due to capacity constraints?
- Validate examples against actual `.github/projects/` and `docs/ROADMAP.md`
- Be honest about limitations (Planner can't predict all risks or effort accurately)
