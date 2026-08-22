---
title: "Projects Directory — Active, Archived & Completed"
description: "Central hub for all LightSpeed project planning, documentation, and tracking. Includes active projects, completed archives, and reusable templates."
file_type: documentation
version: 2.1.0
last_updated: "2026-08-21"
created_date: "2025-12-08"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["projects", "planning", "tracking", "governance", "templates"]
domain: "governance"
stability: "stable"
---

# Projects Directory

Central hub for all LightSpeed project planning, documentation, and tracking.

---

## Directory Structure

```
.github/projects/
├── _templates/                 # TEMPLATES FOR NEW PROJECTS
│   ├── TEMPLATE_GUIDE.md       # How to create a new project ← START HERE
│   ├── PLANNING_TEMPLATE.md    # Copy to create PLANNING.md
│   ├── OPENSPEC_TEMPLATE.md    # Copy to create OPENSPEC.md
│   ├── README_TEMPLATE.md      # Copy to create README.md
│   └── example-project/        # Complete reference example
│       ├── README.md           # Realistic, filled-in example
│       └── [other files]
│
├── active/                     # ACTIVE PROJECTS IN PROGRESS
│   ├── README.md               # Index of all active projects
│   ├── project-1-slug-date/    # Each project is self-contained
│   ├── project-2-slug-date/    # With README, PLANNING, OPENSPEC
│   └── [40+ active projects]
│
├── archived/                   # LEGACY PROJECTS (for reference)
│   ├── README.md               # Index of archived projects
│   └── [few reference projects]
│
├── completed/                  # COMPLETED PROJECTS (with completion docs)
│   ├── README.md               # Index of completed projects
│   └── [30+ completed projects with summary docs]
│
└── README.md                   # This file
```

---

## Quick Navigation

### 👤 For Project Owners

**Creating a new project?**

1. Read: [_templates/TEMPLATE_GUIDE.md](./_templates/TEMPLATE_GUIDE.md)
2. Copy templates from: `_templates/`
3. Reference example: `_templates/example-project/`
4. Follow checklist in TEMPLATE_GUIDE.md

**Managing an active project?**

1. Go to: [active/README.md](./active/README.md)
2. Find your project in the index
3. Update status regularly
4. Link GitHub issues to tracking

**Completing a project?**

1. Document completion in project folder
2. Move folder to `completed/` with summary
3. Update `.archive-status.md`
4. Close related GitHub issues

### 🛠️ For Developers

**Finding work to do?**

1. Check: [active/README.md](./active/README.md)
2. Find your project
3. Open: that project's `README.md`
4. Pick an issue from the GitHub issue tracker

**Understanding a project?**

1. Read: Project `README.md` (overview)
2. Read: `PLANNING.md` (objectives & timeline)
3. Read: `OPENSPEC.md` (technical specs, if present)

**Executing a phase?**

1. Find: `PHASE_X_DETAILS.md` in project folder
2. Follow: Step-by-step execution guide
3. Reference: `OPENSPEC.md` for technical details
4. Run: Tests per OPENSPEC.md

---

## Folder Purposes

### _templates/ — Reusable Templates

**Purpose:** Templates and examples for creating new projects

**When to use:**

- Creating a NEW active project
- Need a reference example
- Looking for best practices

**Contents:**

| File | Purpose |
|------|---------|
| `TEMPLATE_GUIDE.md` | Step-by-step guide for creating projects |
| `PLANNING_TEMPLATE.md` | Copy to create PLANNING.md for new projects |
| `OPENSPEC_TEMPLATE.md` | Copy to create OPENSPEC.md for complex projects |
| `README_TEMPLATE.md` | Copy to create README.md for new projects |
| `example-project/` | Complete realistic example (study this!) |

**Key Points:**

- ✅ Always start with `TEMPLATE_GUIDE.md`
- ✅ Copy templates into your new project folder
- ✅ Customize with your project-specific details
- ✅ Reference `example-project/` if you need guidance
- ✅ Follow the template structure for consistency

---

### active/ — In-Progress Projects

**Purpose:** Projects currently in active development or planning

**Status:** Work in progress, regularly updated

**Structure:**

- Each project in its own folder: `{descriptive-slug}-{YYYY-MM-DD}/`
- Minimum files: `README.md`, `PLANNING.md`
- Optional: `OPENSPEC.md`, `PHASE_*.md`, `deliverables/`, `reports/`

**Index:** See [active/README.md](./active/README.md)

**Key Standards:**

- ✅ Every project MUST have README.md
- ✅ Every project MUST have PLANNING.md
- ✅ Every project SHOULD have OPENSPEC.md (except simple projects)
- ✅ Every project MUST link to GitHub issues
- ✅ All projects updated weekly or more frequently

**When a project is complete:**

Move folder to `completed/` with completion summary.

---

### archived/ — Legacy Projects

**Purpose:** Reference projects, legacy documentation (rarely used)

**Status:** Complete but kept for historical reference

**Contents:**

- Old project documentation
- Reference implementations
- Historical context for decisions

**Key Point:** Very few projects here; mostly reference only.

**When to review:** Only if you need historical context for decisions made in that project.

---

### completed/ — Completed Projects

**Purpose:** Finished projects with completion documentation and summaries

**Status:** Complete, with lessons learned and deliverables documented

**Structure:**

- Each project folder contains final deliverables
- Includes `.archive-status.md` with completion summary
- Documents lessons learned
- Shows what was delivered

**Index:** See [completed/README.md](./completed/README.md)

**Key Points:**

- ✅ Projects move here when COMPLETE
- ✅ Includes completion summary and date
- ✅ Provides reference for future similar projects
- ✅ Shows what was learned
- ✅ Helps avoid repeating past mistakes

---

## Project Document Standards

### Every Active Project Needs

**Required Files:**

1. **README.md**
   - Quick overview and status
   - Who to contact
   - How to contribute
   - Current phase progress
   - GitHub issue references

2. **PLANNING.md**
   - Objectives and scope
   - Phases and timeline
   - Team structure
   - GitHub issue references (CRITICAL)
   - Risks and dependencies

3. **OPENSPEC.md** (for complex/technical projects)
   - Architecture and design
   - Component specifications
   - Testing requirements
   - For simple projects: can be a one-line stub

**Optional Files:**

- `PHASE_X_DETAILS.md` — Per-phase execution guides
- `deliverables/` — Completed work outputs
- `reports/` — Audit findings, progress reports

---

## OpenSpec Requirement

### When OpenSpec is REQUIRED

Projects MUST have OpenSpec if:

✅ **Technically Complex** — Multiple components, custom architecture  
✅ **Long-Running** — Multiple phases needing detailed specs  
✅ **High-Risk** — Security-critical, performance-sensitive  
✅ **Portable** — Reusable across repositories  

### When OpenSpec is OPTIONAL

Projects CAN use stub OPENSPEC.md if:

❌ **Simple/Small** — Single feature, clear requirements  
❌ **Fits in PLANNING.md** — Specifications fit in one document  

**If stub:** Write one line: "See PLANNING.md for specifications"

### OpenSpec Complement to PLANNING

**PLANNING.md** covers:

- Project objectives and timeline
- Team and responsibilities
- GitHub issue tracking
- Risks and dependencies

**OPENSPEC.md** covers:

- Technical architecture and design
- Component specifications
- Data models and schemas
- Testing requirements
- Implementation details

**Both are important:** PLANNING is strategic, OPENSPEC is tactical.

---

## GitHub Issue Integration (CRITICAL)

### Every Project MUST Have

✅ **Master Epic** — Tracks all project work  
✅ **Phase Epics** — One per phase (if multi-phase)  
✅ **Task Issues** — One per deliverable  
✅ **Issue References** — In PLANNING.md and README.md  

### Issue Linking

Every project PLANNING.md must have a "GitHub Issues & Tracking" section:

```markdown
### Master Epic

**[#XXXX — PROJECT_TITLE — Master Epic](../../../issues/XXXX)**

All project work tracked here.

### Issue Reference Table

| Phase | Issue | Type | Status |
|-------|-------|------|--------|
| Phase 1 | [#1234](../../../issues/1234) | epic | 🟢 Open |
| — | [#1235](../../../issues/1235) | task | 🟢 Open |
```

### Creating Issues

If issues don't exist for your project:

1. Create master epic first
2. Create phase epics
3. Create task issues
4. Add issue numbers to PLANNING.md
5. Reference in README.md

See `_templates/TEMPLATE_GUIDE.md` for detailed instructions.

---

## Project Status Indicators

| Indicator | Meaning |
|-----------|---------|
| 🟢 Complete | Project done, all deliverables shipped |
| 🟡 Active | Project in progress, regular updates |
| 🔴 Critical | Blocker or high-risk issue identified |
| 🟠 Blocked | Waiting on external dependency |
| ⏳ Planned | Not yet started, scheduled for future |
| ⚪ On Pause | Temporarily paused, to resume later |

---

## Maintenance

### Weekly Tasks

- [ ] Update active project README with status
- [ ] Update PLANNING.md with progress
- [ ] Close completed phase epics
- [ ] Create next phase issues (if needed)

### When Timeline Changes

- [ ] Update PLANNING.md dates
- [ ] Post comment on Master Epic
- [ ] Update README.md "Recent Updates"
- [ ] Notify stakeholders

### When Project Completes

- [ ] Mark all issues closed
- [ ] Create completion summary
- [ ] Move folder to `completed/`
- [ ] Create `.archive-status.md`
- [ ] Document lessons learned

---

## Related Documentation

### Repository Governance

- [CLAUDE.md](../CLAUDE.md) — Repository organization and rules
- [AGENTS.md](../AGENTS.md) — AI operations and agent standards
- [BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md) — Git workflow

### Project Management

- [PROJECT_TEMPLATE_GUIDE.md](./_templates/TEMPLATE_GUIDE.md) — Creating new projects
- [active/README.md](./active/README.md) — Index of active projects
- [completed/README.md](./completed/README.md) — Index of completed projects
- [archived/README.md](./archived/README.md) — Index of archived projects

### Instructions

- [instructions/file-organisation.md](../instructions/file-organisation.instructions.md) — Where files go
- [instructions/documentation-formats.md](../instructions/documentation-formats.instructions.md) — Markdown standards

---

## FAQ

**Q: How do I create a new project?**

A: Read [_templates/TEMPLATE_GUIDE.md](./_templates/TEMPLATE_GUIDE.md). Takes 5 minutes.

**Q: Do I need OPENSPEC.md?**

A: See "OpenSpec Requirement" section above. Simple projects can use stub.

**Q: Where do I find a project?**

A: Check [active/README.md](./active/README.md) for index of all projects.

**Q: How do I complete a project?**

A: Move folder to `completed/` with `.archive-status.md`. See section above.

**Q: What if a project is missing issues?**

A: Create them using GitHub `gh issue create` command. Reference `TEMPLATE_GUIDE.md`.

**Q: Can I use a different structure?**

A: No. Use the standard structure for consistency. See templates for guidance.

---

## Success Metrics

Projects are well-maintained when:

✅ All active projects have README.md  
✅ All active projects have PLANNING.md  
✅ All active projects have GitHub issue master epic  
✅ All PLANNING.md docs reference issues  
✅ Projects updated at least weekly  
✅ Completed projects moved to `completed/` folder  
✅ Completed projects have `.archive-status.md`  

---

## Support

**For help creating a project:**

- Read: `_templates/TEMPLATE_GUIDE.md`
- Study: `_templates/example-project/README.md`
- Ask: Comment on your project's Master Epic

**For template suggestions:**

- Create issue: `type:suggestion` + `area:documentation`
- Describe: What template needs clarification
- We'll update: Templates for all future projects

---

**Projects Directory**  
**Version:** 2.0.0  
**Last Updated:** 2026-08-12  
**Maintained By:** LightSpeed Team
