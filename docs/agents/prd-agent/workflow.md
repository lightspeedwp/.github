---
title: PRD Creation Workflow
description: Step-by-step process for generating effective Product Requirements Documents
created: 2026-09-17
---

# PRD Creation Workflow

This guide walks you through the complete process of creating a Product Requirements Document (PRD) using the PRD agent.

## Overview

The PRD creation workflow is designed to produce structured, actionable documents that are:

- **Clear** — Anyone can understand what's being built and why
- **Complete** — All necessary details are covered
- **Estimable** — Engineers can break it into tasks and estimate effort
- **Testable** — Acceptance criteria are verifiable, not vague
- **Integrable** — Structured for handoff to downstream tools (Figma, Linear, etc.)

## Phase 1: Preparation (15–30 minutes)

Before you talk to the agent, gather your thoughts:

### 1.1 Define the Problem

**Ask yourself**:

- What problem are we solving?
- Who has the problem? (user personas)
- Why is it worth solving now?
- What's the impact if we don't solve it?

**Output**: 2–3 sentence problem statement

Example:
> Our design teams spend 3 hours per week manually creating design specs from PRDs in Figma. This is error-prone and delays handoff to development. We need an automated spec generation workflow.

### 1.2 Outline User Needs

**Ask yourself**:

- Who will use this feature? (list 2–3 user types)
- What do they need to do? (1–2 key tasks per user)
- What's their current workflow? (today)
- What should their workflow be? (after we build this)

**Output**: Bulleted list of user types and their key needs

Example:

- **Design Lead**: Needs to convert PRD requirements into Figma design specs in < 30 min
- **Product Manager**: Needs validation that designs match the original PRD
- **Developer**: Needs clear acceptance criteria for each design component

### 1.3 List Known Constraints

**Ask yourself**:

- Are there technical limitations? (API constraints, platform limits, etc.)
- Are there timeline constraints? (this quarter? this month?)
- Are there resource constraints? (team size, budget, tools)
- Are there compliance/security constraints? (data privacy, access control, etc.)

**Output**: Bulleted list of constraints

Example:

- Must integrate with Figma API (< 100 calls/min per Figma limits)
- Must complete by Q4 2026
- Team of 2 engineers + 1 product person
- Must handle sensitive user data per GDPR requirements

## Phase 2: Initial Request (5 minutes)

Open your agent and make an initial request:

### 2.1 Craft Your Opening Message

Use this template:

```
I need a PRD for [feature name].

Context:
- Problem: [2-3 sentences on the problem]
- Users: [list user personas and what they need]
- Constraints: [key timeline, resource, or technical constraints]
- Success: [how we'll know this succeeded]
```

### 2.2 Example Message

```
I need a PRD for an automated design spec generator.

Context:
- Problem: Design teams manually create design specs in Figma based on PRDs, taking 3 hours/week and causing delays.
- Users: 
  - Design Leads need to generate specs in <30 min
  - Product Managers need to verify design completeness
  - Developers need clear component acceptance criteria
- Constraints: Must integrate with Figma API; team of 3 people; complete by Q4
- Success: Design-to-dev handoff time reduced from 3 days to 1 day
```

### 2.3 Send & Listen

Send your message and let the agent ask clarifying questions. Be patient and thorough in your answers — this investment saves rework later.

## Phase 3: Clarification Q&A (15–30 minutes)

The agent will ask follow-up questions. Common questions:

| Question | Why It Matters | How to Answer |
|----------|---|---|
| "What data should the spec include?" | Defines scope and completeness | List specific design attributes: colors, typography, spacing, components |
| "How will designs be validated?" | Defines acceptance criteria | Name your validation process (peer review, automated testing, etc.) |
| "What's the MVP vs. nice-to-have?" | Prioritises work | Separate core features (MVP) from future enhancements |
| "Are there integrations needed?" | Defines technical dependencies | List tools (Figma, Linear, CI/CD, etc.) and integration points |

**Best practices for answers**:

- Be specific, not vague ("Users need to see a dashboard" → "Users need a dashboard showing 5 KPIs with real-time updates")
- Give examples ("Like Figma's auto-layout system" or "Similar to how Notion handles property templates")
- Ask back if something is unclear ("Do you mean synchronous updates or batch sync?")

## Phase 4: Draft Review (30 minutes)

The agent produces an initial PRD draft. Review it:

### 4.1 Check Completeness

Does it include:

- ✓ Executive summary (1–2 sentences)
- ✓ User stories (3–5) with acceptance criteria
- ✓ Functional requirements (clear, specific)
- ✓ Non-functional requirements (performance, scalability, etc.)
- ✓ Data model / entities (if applicable)
- ✓ Success metrics (measurable)
- ✓ Assumptions & dependencies
- ✓ Risks & mitigations
- ✓ Out-of-scope statement (what we're NOT doing)

### 4.2 Check Quality

For each section:

- Is it clear and unambiguous?
- Can an engineer estimate effort from this?
- Can QA write tests based on this?
- Does it match your original problem statement?

### 4.3 Provide Feedback

Tell the agent what needs revision:

```
Good start. A few refinements:
1. The performance requirement (< 1s load time) seems aggressive — can you add context on why that's critical?
2. The data model shows a one-to-many relationship for Designs → Components, but doesn't mention versioning. Should we track design history?
3. The "Risks" section is thin. Can you expand on what happens if the Figma API rate limits hit?
```

## Phase 5: Iteration (as needed)

The agent will update the PRD based on your feedback. Repeat Phase 4-5 until you're satisfied.

**Red flags** (stop iterating, escalate):

- Requirements contradict each other (e.g., "< 1s load time" AND "process 1M records")
- Team is genuinely unsure about priorities (e.g., MVP vs. phase 2 is blurry)
- Critical stakeholder input is missing (e.g., you haven't talked to engineering about feasibility)

## Phase 6: Stakeholder Review (optional, 1–2 hours)

Before finalizing, share the draft PRD with key stakeholders:

- **Engineering Lead**: Is it estimable? Are there technical concerns?
- **Design Lead**: Does it cover design requirements?
- **Product Manager**: Does it align with business goals?
- **Security/Compliance**: Any data or compliance implications?

**How to gather feedback**:

- Email a draft (save as PDF or document)
- Schedule 30-min sync to discuss
- Add comments in shared doc
- Ask specific questions: "Is this MVP-viable?" "What timeline is realistic?"

**Incorporate feedback** into the PRD. Update the agent:

```
Got stakeholder feedback:
- Engineering says the Figma API integration is complex; they want to scope phase 1 to just basic color extraction
- Design wants versioning history for design specs
- Security flagged that user data in designs needs encryption at rest

Can you update the PRD to reflect these changes?
```

## Phase 7: Finalization (15–30 minutes)

Once you're satisfied:

### 7.1 Export the PRD

Most agents can export to:

- **Markdown** (for Git repositories, GitHub issues, documentation)
- **PDF** (for email, sharing, archival)
- **Google Doc** (for collaborative editing, commenting)
- **Linear issue** (if using Linear project management)

Ask the agent: "Can you save this as Markdown / export as PDF / create a Linear issue from this?"

### 7.2 Validate Structure

Quickly check:

- No TODOs or placeholders remain
- All user stories have acceptance criteria
- All requirements are specific and measurable
- Links to related documents are valid
- Version number is set (e.g., v1.0)

### 7.3 Sign-Off

Document who approved the PRD:

```markdown
## Sign-Off

- **Product Manager**: [Name] - [Date]
- **Engineering Lead**: [Name] - [Date]
- **Design Lead**: [Name] - [Date]
```

## Phase 8: Handoff (30 minutes)

Once approved, hand off to the next phase:

### 8.1 Create Implementation Tickets

Feed the PRD into your project management tool:

```
Linear: "Create epics for each user story; create tasks for each acceptance criterion"
GitHub Issues: "Create issues from PRD requirements; tag with labels and milestones"
Jira: "Create stories and sub-tasks in the sprint backlog"
```

See [Integration Guide](./integration-guide.md) for detailed handoff steps.

### 8.2 Share with the Team

- **Engineers**: Share the PRD; they use it for estimation and task breakdown
- **Designers**: Share the PRD; they use it for design specifications (see [Integration Guide](./integration-guide.md) for Figma integration)
- **QA**: Share the PRD; they extract acceptance criteria for test cases
- **Stakeholders**: Share a summary or the full doc, depending on detail level needed

### 8.3 Schedule Kickoff

Once everyone has reviewed:

- 30-min team sync to discuss the PRD and ask clarifying questions
- Walk through user stories and acceptance criteria
- Confirm timeline and resource commitment
- Identify any open blockers

## Workflow Timeline

| Phase | Duration | Owner |
|-------|----------|-------|
| Phase 1: Preparation | 15–30 min | Product Manager |
| Phase 2: Initial Request | 5 min | Product Manager + Agent |
| Phase 3: Clarification | 15–30 min | Product Manager + Agent |
| Phase 4: Draft Review | 30 min | Product Manager |
| Phase 5: Iteration | As needed | Product Manager + Agent |
| Phase 6: Stakeholder Review | 1–2 hours | Product Manager + Stakeholders |
| Phase 7: Finalization | 15–30 min | Product Manager |
| Phase 8: Handoff | 30 min | Product Manager + Team |
| **Total** | **2–4 hours** | |

Typical PRDs are completed in 2–4 hours from start to team kickoff.

## Common Pitfalls

| Pitfall | How to Avoid |
|---------|--------------|
| Vague requirements ("User needs a dashboard") | Be specific: list the 5 KPIs, the target audience, success metrics |
| Missing acceptance criteria | Every user story should have ≥2 acceptance criteria; they should be testable |
| No non-functional requirements | Don't forget performance, scalability, security, compliance constraints |
| Scope creep | Define MVP clearly; list nice-to-haves separately; say "not in scope" explicitly |
| No stakeholder alignment | Share early drafts; incorporate feedback before finalizing |
| Unmeasurable success metrics | Instead of "fast", say "< 1 second load time on 50Mbps connection" |

## Tips for Better PRDs

- **Use examples**: "Like Figma's auto-layout system" is clearer than abstract descriptions
- **Name specific constraints**: "Must integrate with Figma API (max 100 calls/min)" beats "API integration"
- **Define acceptance before building**: "PR must increase test coverage by 10%" is better than "improve test coverage"
- **Include non-obvious requirements**: Security, compliance, performance, operations (logging, monitoring, etc.)
- **Document assumptions**: "Assumes user has 1Mbps+ connection", "Assumes team is trained on the tool"
- **List what we're NOT doing**: "Out of scope: mobile app, offline mode, real-time collaboration"

## Next Steps

- **Share your PRD**: Send to stakeholders for review (Phase 6)
- **Create tickets**: Feed your PRD into Linear/GitHub/Jira (see [Integration Guide](./integration-guide.md))
- **Start planning**: Use the PRD for estimation and task breakdown
- **Kick off the team**: Schedule a sync to walk through the requirements

---

**Last Updated**: 2026-09-17  
**Typical Duration**: 2–4 hours per PRD  
**Questions?** See [FAQ](./faq.md)

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
