---
title: Phase 6 Team Briefing Schedule (T073)
created: 2026-09-14
task: T073
status: In Progress
owner: Ash Shaw
---

# Phase 6 Team Briefing Schedule (T073)

**Task**: Schedule and conduct team briefings (minimum 5 teams per spec.md US6/AC1) on consolidated agent capabilities, benefits over pre-consolidation version, and integration steps per FR-602

**Status**: 🟡 IN PROGRESS | **Timeline**: Weeks 2-3 post-rollout (target completion: 2026-09-21)

---

## Briefing Overview

**Objective**: Introduce ≥5 teams to the consolidated PRD agent, its capabilities, and integration steps for their workflows

**Duration**: 30-45 minutes per team  
**Format**: Synchronous video briefing + Q&A  
**Materials**: 
- Briefing slides (consolidated capabilities overview)
- Demo environment access (sandbox agent instance)
- Integration guide (provider-specific: Claude Code, GitHub Copilot, OpenAI)
- FAQ reference (`agents/prd-agent/FAQ.md`)

**Success Criteria** (per spec.md US6/AC1):
- ✅ Minimum 5 teams have scheduled and attended briefings
- ✅ Each team receives provider-specific integration guidance
- ✅ Q&A session captures blockers and questions for T075a interim checkpoint
- ✅ Attendance recorded; attendee feedback collected via post-briefing survey

---

## Scheduled Briefings (Weeks 2-3 Post-Rollout: 2026-09-17–2026-09-21)

| # | Team | Scheduled | Time (UTC) | Attendees | Status | Notes |
|---|------|-----------|------------|-----------|--------|-------|
| 1 | Product Team A | 2026-09-17 | 14:00 | TBD | ⏳ PENDING | Primary PRD generation team |
| 2 | Product Team B | 2026-09-18 | 15:00 | TBD | ⏳ PENDING | Secondary PRD generation team |
| 3 | Engineering Planning | 2026-09-19 | 14:00 | TBD | ⏳ PENDING | Uses PRD for sprint planning |
| 4 | Design Team | 2026-09-19 | 15:30 | TBD | ⏳ PENDING | Consumes PRD outputs for design briefs |
| 5 | QA/Testing Team | 2026-09-20 | 14:00 | TBD | ⏳ PENDING | Uses PRD for test case generation |
| 6 | Operations (Optional) | 2026-09-21 | 14:00 | TBD | ⏳ PENDING | May use agent for operations documentation |

---

## Pre-Briefing Checklist

**1 week before each briefing:**

- [ ] Confirm team lead attendance and send calendar invite
- [ ] Provide demo environment credentials (sandbox agent instance)
- [ ] Share briefing slides and integration guide in advance
- [ ] Set up Zoom/Teams meeting room with screen-share capability
- [ ] Record briefing (with permission) for teams that can't attend live

**During briefing:**

- [ ] Intro: Welcome, PRD agent consolidation context (5 min)
- [ ] Demo: Live walkthrough of consolidated agent capabilities (15 min)
  - Show all 28 skills and routing logic
  - Demonstrate provider-specific loading (Claude Code vs. Copilot vs. OpenAI)
  - Compare output quality vs. pre-consolidation version
- [ ] Integration: Provider-specific setup for attendees (10 min)
  - Claude Code: Copy `agents/prd-agent/claude/agent.md` to `.claude/agents/`
  - Copilot: Copy `agents/prd-agent/copilot/agent.md` to `.github/agents/`
  - OpenAI: Use agent definition from `agents/prd-agent/openai/`
- [ ] Q&A: Open forum for questions, blockers, integration friction (10-15 min)
- [ ] Feedback: Brief satisfaction survey (2-3 questions)
- [ ] Next Steps: Point to FAQ, support channel, scheduled check-ins

**After briefing:**

- [ ] Record attendee names and email addresses
- [ ] Capture Q&A notes and categorize blockers (for T075a interim checkpoint)
- [ ] Collect post-briefing survey responses
- [ ] Update this schedule with attendance status
- [ ] Send thank-you message with follow-up support contact info

---

## Briefing Slide Outline

**File**: `agents/prd-agent/briefing-slides.md` (to be created)

```
Slide 1: Title
- PRD Agent Consolidation: Phase 6 Rollout
- Date: 2026-09-14 onwards
- Presenter: Ash Shaw

Slide 2: Why Consolidation Matters
- Single canonical agent (28 skills, no duplication)
- Consistent prompt architecture across providers
- Unified skill routing and memory registry
- Improved testing and validation (100% pass rate, Phase 5)

Slide 3: Consolidated vs. Pre-Consolidation
- Before: 43+ skill folders, duplication, dead links, placeholder agent definitions
- After: 28 canonical skills, real agent definitions, unified documentation
- Result: Faster setup, fewer integration issues, better maintainability

Slide 4: The 28 Consolidated Skills
- Show skill categories (PRD drafting, review, change management, etc.)
- Highlight common use cases (PRD generation, review, delivery planning)
- Point to `agents/prd-agent/README.md` for full list

Slide 5: Provider Support
- Claude Code: Load via `.claude/agents/prd-agent/claude/agent.md`
- GitHub Copilot: Load via `.github/agents/prd-agent/copilot/agent.md`
- OpenAI: Load via agent definition (coming soon)

Slide 6: Live Demo
- Demo the consolidated agent generating a PRD for a sample project
- Show skill routing in action
- Compare output to pre-consolidation baseline

Slide 7: Integration Steps
- [Per-provider walkthrough]
- FAQ reference for common issues

Slide 8: Metrics & Success
- Target: ≥5 teams actively using the agent
- 42-day evaluation window (through 2026-10-24)
- Success criteria: ≥4.0/5.0 satisfaction, no critical blockers

Slide 9: Support & Next Steps
- Slack channel: #prd-agent-rollout (monitor for questions)
- FAQ: `agents/prd-agent/FAQ.md`
- Scheduled check-in: Week 4 (2026-10-01)
- Final evaluation: Week 6 (2026-10-24)

Slide 10: Questions?
```

---

## Team Contact List

| Team | Lead | Email | Preferred Channel | Time Zone |
|------|------|-------|-------------------|-----------|
| Product Team A | [Name] | [email] | Slack / Email | UTC+0 |
| Product Team B | [Name] | [email] | Slack / Email | UTC+0 |
| Engineering Planning | [Name] | [email] | Slack / Email | UTC+0 |
| Design Team | [Name] | [email] | Slack / Email | UTC+0 |
| QA/Testing Team | [Name] | [email] | Slack / Email | UTC+0 |
| Operations | [Name] | [email] | Email | UTC+0 |

*To be populated by Ash Shaw before briefings begin.*

---

## Post-Briefing Blocker Tracking

**Template for T075a (30-day interim checkpoint):**

| Team | Date | Attendees | Q&A Topics | Blockers Identified | Satisfaction (1-5) | Follow-up Needed |
|------|------|-----------|------------|--------------------|--------------------|------------------|
| Product Team A | 2026-09-17 | [Names] | [Topics] | [Blockers] | [Score] | [ ] |
| Product Team B | 2026-09-18 | [Names] | [Topics] | [Blockers] | [Score] | [ ] |
| Engineering Planning | 2026-09-19 | [Names] | [Topics] | [Blockers] | [Score] | [ ] |
| Design Team | 2026-09-19 | [Names] | [Topics] | [Blockers] | [Score] | [ ] |
| QA/Testing Team | 2026-09-20 | [Names] | [Topics] | [Blockers] | [Score] | [ ] |
| Operations | 2026-09-21 | [Names] | [Topics] | [Blockers] | [Score] | [ ] |

*To be completed during/after each briefing; summarized in T075a final report.*

---

## Execution Timeline

- **2026-09-15**: Finalize team contacts and confirm attendance (Ash Shaw)
- **2026-09-16**: Send calendar invites and demo credentials to all teams
- **2026-09-17–2026-09-21**: Conduct 6 team briefings (one per team)
- **2026-09-24**: Summarize blocker feedback and satisfaction scores for T075a interim checkpoint
- **2026-10-01**: Mid-point check-in with teams (Week 4 metrics review)

---

**Owner**: Ash Shaw  
**Last Updated**: 2026-09-14  
**Next Update**: After first briefing (2026-09-17)

