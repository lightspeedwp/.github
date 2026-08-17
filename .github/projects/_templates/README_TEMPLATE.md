---
file_type: readme
title: "PROJECT_TITLE — Project Overview"
description: "Quick-start guide and status overview for the PROJECT_TITLE project"
version: 1.0.0
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
authors:
  - Author Name
owner: Owner Name/Team
maintainer: Maintainer Name
tags:
  - project
  - overview
  - status
domain: "domain-name"
stability: "stable|beta|experimental"
status: "planning|active|blocked|paused|complete"
---

# PROJECT_TITLE

**Status:** 🟡 Active | **Owner:** Owner Name | **Last Updated:** YYYY-MM-DD

Quick overview of the PROJECT_TITLE project.

---

## Quick Facts

| Fact | Value |
|------|-------|
| **Status** | 🟡 Active |
| **Phase** | Phase X of Y |
| **Owner** | Owner Name |
| **Duration** | Estimated X weeks |
| **Start Date** | YYYY-MM-DD |
| **Target Completion** | YYYY-MM-DD |
| **Team Size** | X people |
| **Master Epic** | [#XXXX](../../../issues/XXXX) |

---

## What is This Project?

One sentence description of what this project does.

### Problem Being Solved

Brief description of the problem or opportunity this project addresses.

### Solution Overview

Brief overview of the solution being implemented.

### Expected Outcomes

List 3-5 key outcomes:

1. **Outcome 1** — What will be delivered
2. **Outcome 2** — What will be delivered
3. **Outcome 3** — What will be delivered

---

## Getting Started

### For Project Owners

1. **Read the Planning Document:** [PLANNING.md](./PLANNING.md)
   - Objectives, phases, timeline, team structure
   - GitHub issue references
   - Risks and dependencies

2. **Review Technical Spec:** [OPENSPEC.md](./OPENSPEC.md) (if applicable)
   - Architecture and design decisions
   - Component specifications
   - Testing requirements

3. **Check Current Status:**
   - Phase currently executing: [Phase X]
   - Latest updates: See [PLANNING.md — Status Updates](./PLANNING.md#status-updates)

4. **Track Issues:** [Master Epic #XXXX](../../../issues/XXXX)
   - All project work tracked here
   - Child issues per phase
   - Real-time status updates

### For Developers

1. **Understand the Scope:** Read [PLANNING.md — Scope & Objectives](./PLANNING.md#scope--objectives)

2. **Get Your Task:** Find your assigned issue in [Master Epic #XXXX](../../../issues/XXXX)

3. **Follow the Spec:** Reference [OPENSPEC.md](./OPENSPEC.md) for detailed technical requirements

4. **Execute the Phase:** Use phase-specific documents (e.g., `PHASE_1_DETAILS.md`)

5. **Run Tests:** See [OPENSPEC.md — Testing Requirements](./OPENSPEC.md#testing-requirements)

### For Team Members

1. **Check Status:** See [Project Status](#project-status) section below

2. **Ask Questions:** Comment on [Master Epic #XXXX](../../../issues/XXXX)

3. **Report Blockers:** Create issue with `blocker` label linking to this project

4. **Review Progress:** Check [PLANNING.md — Status Updates](./PLANNING.md#status-updates)

---

## Project Status

### Current Phase

**Phase X: [Phase Name]** — [Description]

- **Status:** 🟡 Active
- **Duration:** [X weeks, Weeks Y-Z of total]
- **Start Date:** YYYY-MM-DD
- **Target Completion:** YYYY-MM-DD
- **Owner:** Owner Name
- **Progress:** X% complete (Y of Z deliverables)

### Phase Progress

```
Phase 1    ████████░░░░░░░░░░░░░░░░░░░░░  (100% complete)
Phase 2    ░░░░░░░░████████░░░░░░░░░░░░░░  (40% complete — CURRENT)
Phase 3    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (0% planned)
```

### Key Milestones

| Milestone | Date | Status |
|-----------|------|--------|
| Phase 1 Complete | YYYY-MM-DD | ✅ Done |
| Phase 2 Start | YYYY-MM-DD | ✅ In Progress |
| Phase 2 Complete | YYYY-MM-DD | ⏳ On Track |
| Final Delivery | YYYY-MM-DD | ⏳ Scheduled |

### Recent Updates

**Last 7 Days:**

- [Update 1] — Completed [deliverable]
- [Update 2] — Resolved [blocker]
- [Update 3] — Started [next phase]

**Next Steps:**

- [Action 1] — Due: YYYY-MM-DD
- [Action 2] — Due: YYYY-MM-DD
- [Action 3] — Due: YYYY-MM-DD

---

## Project Structure

### Directory Layout

```
.github/projects/active/[project-slug]/
├── README.md                           # This file
├── PLANNING.md                         # Planning & timeline
├── OPENSPEC.md                         # Technical specification
├── PHASE_1_DETAILS.md                  # Phase 1 execution guide
├── PHASE_2_DETAILS.md                  # Phase 2 execution guide
├── deliverables/
│   ├── deliverable-1.md                # Completed deliverable
│   ├── deliverable-2.md                # In progress
│   └── [other deliverables]
├── reports/
│   ├── audit-findings-2026-08-12.md    # Audit results
│   ├── progress-report-2026-08-12.md   # Status updates
│   └── [other reports]
└── issues/
    ├── related-issues.md               # Linked issues reference
    └── [other issue tracking]
```

### Key Documents

| Document | Purpose | Read When |
|----------|---------|-----------|
| [README.md](./README.md) | Overview & quick start | Getting oriented |
| [PLANNING.md](./PLANNING.md) | Objectives, phases, timeline | Planning/managing |
| [OPENSPEC.md](./OPENSPEC.md) | Technical specification | Implementing/designing |
| [PHASE_1_DETAILS.md](./PHASE_1_DETAILS.md) | Phase 1 execution guide | Executing Phase 1 |
| [PHASE_2_DETAILS.md](./PHASE_2_DETAILS.md) | Phase 2 execution guide | Executing Phase 2 |

---

## GitHub Issues & Tracking

### Master Epic

All project work is tracked under the master epic:

**[#XXXX — PROJECT_TITLE — Master Epic](../../../issues/XXXX)**

### Issue Hierarchy

```
Epic #XXXX — PROJECT_TITLE (master)
├── Phase 1 Epic #XXXX
│   ├── Task 1.1 #XXXX
│   ├── Task 1.2 #XXXX
│   └── Task 1.3 #XXXX
├── Phase 2 Epic #XXXX
│   ├── Task 2.1 #XXXX
│   └── Task 2.2 #XXXX
└── Phase 3 Epic #XXXX
```

### Issue Reference

| Phase | Issue | Type | Status | Notes |
|-------|-------|------|--------|-------|
| Phase 1 | [#XXXX](../../../issues/XXXX) | epic | ✅ Closed | Phase complete |
| — | [#XXXX](../../../issues/XXXX) | task | ✅ Closed | Task 1.1 |
| Phase 2 | [#XXXX](../../../issues/XXXX) | epic | 🟢 Open | Phase in progress |
| — | [#XXXX](../../../issues/XXXX) | task | 🟢 Open | Task 2.1 (assigned) |
| Phase 3 | [#XXXX](../../../issues/XXXX) | epic | ⏳ Planned | Phase starts date |

### Contributing

To contribute to this project:

1. **Pick an Issue:** Find an unassigned task in [Master Epic #XXXX](../../../issues/XXXX)
2. **Assign Yourself:** Add yourself as assignee
3. **Read the Spec:** Reference [PLANNING.md](./PLANNING.md) and [OPENSPEC.md](./OPENSPEC.md)
4. **Execute:** Follow phase-specific documents
5. **Test:** Run tests per [OPENSPEC.md — Testing](./OPENSPEC.md#testing-requirements)
6. **Submit PR:** Link to issue with "Resolves #XXXX"
7. **Get Review:** Wait for approval before merge

---

## Team & Contacts

### Project Team

| Role | Name | Contact | Hours/Week |
|------|------|---------|-----------|
| Project Owner | Owner Name | @owner | 15 |
| Technical Lead | Tech Lead Name | @techlead | 20 |
| Developer | Dev Name | @dev | 40 |
| QA/Reviewer | QA Name | @qa | 20 |

### How to Reach Us

- **Questions about Project:** Comment on [Master Epic #XXXX](../../../issues/XXXX)
- **Technical Questions:** @TechLeadName in Slack #project-name
- **Blockers/Escalation:** @OwnerName in Slack #project-name
- **Bug Reports:** Create issue with `type:bug` label

---

## Related Documentation

### Project Documents

- [PLANNING.md](./PLANNING.md) — Full project plan and timeline
- [OPENSPEC.md](./OPENSPEC.md) — Technical specification
- [PHASE_1_DETAILS.md](./PHASE_1_DETAILS.md) — Phase 1 execution
- [PHASE_2_DETAILS.md](./PHASE_2_DETAILS.md) — Phase 2 execution

### Repository References

- [CLAUDE.md](../../../CLAUDE.md) — Repository governance
- [AGENTS.md](../../../AGENTS.md) — AI operations standards
- [BRANCHING_STRATEGY.md](../../../docs/BRANCHING_STRATEGY.md) — Git workflow
- [Project Templates](../_templates/) — Templates for new projects

### External Links

- [GitHub Issues — Master Epic](../../../issues/XXXX) — Issue tracking
- [GitHub Discussions](../../../discussions) — Q&A
- [Related Documentation](../../../docs/) — Additional context

---

## FAQ

### General Questions

**Q: What is the goal of this project?**

A: [One sentence answer]. See [PLANNING.md — Objectives](./PLANNING.md#primary-objectives) for details.

**Q: When will this be done?**

A: [Target date]. See [PLANNING.md — Timeline](./PLANNING.md#overall-schedule) for detailed schedule.

**Q: Who is working on this?**

A: See [Team & Contacts](#team--contacts) section above.

### Technical Questions

**Q: Where is the technical specification?**

A: See [OPENSPEC.md](./OPENSPEC.md) for detailed technical specs.

**Q: How do I implement [component]?**

A: See [OPENSPEC.md — Phase X](./OPENSPEC.md) and [PHASE_X_DETAILS.md](./PHASE_1_DETAILS.md).

**Q: What are the testing requirements?**

A: See [OPENSPEC.md — Testing](./OPENSPEC.md#testing-requirements).

### Contribution Questions

**Q: How do I contribute?**

A: See [Contributing](#contributing) section above.

**Q: Can I pick my own task?**

A: Yes! Find unassigned issues in [Master Epic #XXXX](../../../issues/XXXX).

**Q: Who reviews my code?**

A: The QA/Reviewer (see [Team & Contacts](#team--contacts)).

---

## Troubleshooting

### Common Issues

**Issue: I don't understand the requirements**

- Read [PLANNING.md](./PLANNING.md) for high-level overview
- Read [OPENSPEC.md](./OPENSPEC.md) for technical details
- Comment on issue asking for clarification

**Issue: I'm blocked on something**

- Post blocker comment on your issue
- @mention the project owner
- If critical, create new issue with `blocker` label

**Issue: Tests are failing**

- Check test output for error messages
- Review [OPENSPEC.md — Testing](./OPENSPEC.md#testing-requirements)
- Ask QA/Reviewer for help

---

## Success Criteria

This project is successful when:

✅ All deliverables completed per [PLANNING.md](./PLANNING.md)  
✅ All tests passing (> [X]% coverage)  
✅ Code review approved  
✅ Documentation complete  
✅ Team sign-off obtained  
✅ [Custom success metric]

---

## Archive & Completion

**When Complete:**

1. Mark all issues as closed
2. Create completion summary
3. Move project to `.github/projects/completed/`
4. Document lessons learned

---

**Project Status:** 🟡 Active  
**Owner:** Owner Name  
**Last Updated:** YYYY-MM-DD  
**Next Review:** YYYY-MM-DD
