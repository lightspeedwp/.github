---
file_type: guide
title: ""Project Template Guide — Creating New Active Projects""
description: ""Step-by-step guide for creating new active projects with proper documentation structure, OpenSpec integration, and GitHub issue tracking""
created_date: 2026-08-12
last_updated: "2026-08-25"
status: active
tags:- templates
  - guide
  - project-creation
  - documentation
---

# Project Template Guide — Creating New Active Projects

This guide explains how to create a new active project using the templates in this directory, with emphasis on OpenSpec documentation and GitHub issue integration.

---

## Quick Start (5 Minutes)

### Step 1: Create Project Folder

```bash
# Create project folder in active/
mkdir -p .github/projects/active/[project-slug-YYYY-MM-DD]
cd .github/projects/active/[project-slug-YYYY-MM-DD]
```

**Naming Convention:**

```
{descriptive-slug}-{YYYY-MM-DD}

Examples:
- release-agent-phase-2-2026-08-12
- testing-framework-upgrade-2026-08-15
- documentation-audit-2026-08-20
```

### Step 2: Copy Template Files

```bash
# Copy templates from _templates folder
cp ../_templates/PLANNING_TEMPLATE.md ./PLANNING.md
cp ../_templates/OPENSPEC_TEMPLATE.md ./OPENSPEC.md
cp ../_templates/README_TEMPLATE.md ./README.md
```

### Step 3: Customize Metadata

Edit all three files:

1. **README.md** — Update:
   - Title, description, date
   - Status, owner, duration
   - Quick facts table

2. **PLANNING.md** — Update:
   - Project title and objectives
   - Phases and timeline
   - Team members
   - Related issues section

3. **OPENSPEC.md** — Update:
   - Technical overview
   - Architecture diagrams
   - Component specifications
   - (Leave detailed specs blank if not needed yet)

### Step 4: Create GitHub Issues

Create the master epic and phase epics:

```bash
# Create master epic
gh issue create \
  --title "PROJECT_TITLE — Master Epic" \
  --label "type:epic,area:planning" \
  --body "See .github/projects/active/[project-slug]/ for details"

# Note the issue number (e.g., #1234)
# Update PLANNING.md with this issue number
```

### Step 5: Update Main Index

Update `.github/projects/active/README.md`:

```markdown
#### N. Project Name (YYYY-MM-DD)

**Directory:** [`project-slug-date/`](./project-slug-date/)  
**Status:** 🟡 Active | 🔴 Critical | 🟢 Complete  
**Owner:** Owner Name  
**Master Epic:** [#XXXX](../../../issues/XXXX)  
**Focus:** One-sentence description of what project does
```

---

## Deep Dive: Using the Templates

### Understanding the Three Documents

Your project needs **three core documents**, each serving a distinct purpose:

#### 1. README.md — Project Overview

**Purpose:** Quick navigation and status dashboard

**Use When:**

- Someone needs to understand what the project is
- You need a quick status check
- You're onboarding new team members

**Contains:**

- Quick facts and status
- Current phase progress
- GitHub issue references
- Team contacts
- FAQ and troubleshooting

**When to Update:**

- Status changes
- New phase begins
- Blockers arise
- Team changes

#### 2. PLANNING.md — Project Strategy

**Purpose:** Project objectives, timeline, team structure, and coordination

**Use When:**

- You need to understand the overall plan
- You're managing the project timeline
- You're tracking deliverables
- You need to reference GitHub issues

**Contains:**

- Objectives and scope
- Phase descriptions and timelines
- Team roles and responsibilities
- GitHub issue references
- Risks and dependencies
- Success metrics

**When to Update:**

- New phase begins
- Timeline changes
- Team changes
- Risks identified
- Milestones reached

#### 3. OPENSPEC.md — Technical Specification

**Purpose:** Detailed technical architecture, component specs, testing requirements, implementation details

**Use When:**

- You're implementing technical components
- You need detailed architecture decisions
- You're writing tests
- You need to understand data models or APIs

**Contains:**

- Architecture and design
- Component specifications
- Data models and schemas
- API specifications
- Testing requirements
- Performance targets
- Security considerations

**When to Update:**

- Architecture decisions made
- Design changes needed
- Testing strategy refined
- New APIs defined

---

## OpenSpec Integration: When to Use It

### ✅ Use OPENSPEC.md When

**Complex Technical Project**

- Multiple components or systems
- Detailed architecture decisions
- Custom data models or schemas
- API specifications needed

**Long-Running Project**

- Multiple phases requiring detailed specs
- Technical guidance needed for independent execution
- Portability or reusability important

**High-Risk Project**

- Security-critical components
- Performance-sensitive operations
- Data integrity concerns
- Compliance requirements

### ❌ Don't Need Full OPENSPEC.md When

**Simple/Small Project**

- Single feature or minor change
- Clear requirements already defined
- No complex architecture
- Can fit in PLANNING.md

**In that case:**

- Keep OPENSPEC.md as a stub with: "See PLANNING.md for specifications"
- Put all specs in PLANNING.md section "Phase-Specific Details"
- Still maintain file structure for consistency

### How to Decide: Decision Tree

```
Is this project technically complex?
├─ YES → Use full OPENSPEC.md
│  ├─ Create full architecture spec
│  ├─ Define all components
│  └─ Specify tests and configs
└─ NO → Keep OPENSPEC.md as stub
   ├─ Create one-line stub
   └─ Put details in PLANNING.md
```

---

## GitHub Issue Integration: Critical for All Projects

**Every project MUST have:**

✅ A master epic linking to project documentation  
✅ Phase epics (if multi-phase)  
✅ Task issues for each deliverable  
✅ All issue numbers referenced in PLANNING.md  

**Why this matters:**

- Single source of truth for status
- Team knows what to work on
- Progress is transparent
- Blockers are visible

**Issue Hierarchy:**

```
Epic #XXXX — PROJECT_TITLE — Master Epic
├── Epic #XXXX — Phase 1: [Phase Name]
│   ├── Task #XXXX — Task 1.1
│   ├── Task #XXXX — Task 1.2
│   └── Task #XXXX — Task 1.3
├── Epic #XXXX — Phase 2: [Phase Name]
│   ├── Task #XXXX — Task 2.1
│   └── Task #XXXX — Task 2.2
└── Epic #XXXX — Phase 3: [Phase Name]
```

---

## Template Files in This Directory

| File | Purpose | Use When Creating |
|------|---------|------------------|
| `PLANNING_TEMPLATE.md` | Project plan template | Copy and customize for new projects |
| `OPENSPEC_TEMPLATE.md` | Technical spec template | Copy for complex/long-running projects |
| `README_TEMPLATE.md` | Project overview template | Copy and customize for new projects |
| `example-project/` | Complete reference example | Study how to fill in templates |

---

## Example Project Reference

See the `example-project/` folder in this directory for a **complete working example**:

- [example-project/README.md](./example-project/README.md)
- [example-project/PLANNING.md](./example-project/PLANNING.md)
- [example-project/OPENSPEC.md](./example-project/OPENSPEC.md)

This example shows:

✅ Properly filled-in templates  
✅ Real-looking project structure  
✅ GitHub issue references  
✅ OpenSpec integration  
✅ Phase breakdown  

**Use this as your reference model** when creating new projects.

---

## Checklist: Creating a New Project

Use this checklist when creating a new active project:

### Initial Setup

- [ ] Create project folder: `.github/projects/active/[slug-YYYY-MM-DD]/`
- [ ] Copy templates: README.md, PLANNING.md, OPENSPEC.md
- [ ] Customize README.md with project details
- [ ] Customize PLANNING.md with phases and timeline
- [ ] Decide: Use full OPENSPEC.md or keep as stub?
- [ ] If full OpenSpec needed: Fill in architecture and specs

### GitHub Issues (CRITICAL)

- [ ] Create master epic with real issue #
- [ ] Create phase epics (if multi-phase)
- [ ] Create task issues for each deliverable
- [ ] Update PLANNING.md with all issue #s
- [ ] Update README.md with issue links

### Documentation

- [ ] Add project to `.github/projects/active/README.md` index
- [ ] Add to project status table
- [ ] Link master epic in index
- [ ] Ensure all document dates are current
- [ ] Review for typos and clarity

### Ready to Start

- [ ] All team members can find project docs
- [ ] All GitHub issues created and assigned
- [ ] README.md has clear status and next steps
- [ ] Owner confirmed and available
- [ ] First phase deliverables clearly defined

---

## Tips for Success

### Tip 1: Start with README.md

Your README.md is the front door. Make it clear and complete:

- One-sentence project description
- Current status and phase
- How to contribute
- Team contacts

### Tip 2: Keep PLANNING.md in Sync

Update PLANNING.md weekly:

- Progress on current phase
- Any timeline changes
- New risks or blockers
- Upcoming milestones

### Tip 3: Use GitHub Issues for Real-Time Tracking

Issues are your single source of truth for status:

- What's done: Closed issues
- What's in progress: Assigned open issues
- What's planned: Open unassigned issues
- What's blocked: Issues with `blocker` label

### Tip 4: Link OPENSPEC.md in PLANNING.md

If you use OPENSPEC.md, reference it liberally:

```markdown
See [OPENSPEC.md — Phase 1 Architecture](./OPENSPEC.md#phase-1-architecture-overview) for detailed design.
```

---

## Common Mistakes to Avoid

❌ **No GitHub Issues**

- Why: Work isn't tracked, status unclear
- Fix: Create master epic first, before writing docs

❌ **Planning.md without Issue Numbers**

- Why: Requirements don't link to tracking
- Fix: Add issue # to every phase and deliverable

❌ **Missing README.md**

- Why: New team members don't know where to start
- Fix: Always create README.md first

❌ **OPENSPEC.md Never Updated**

- Why: Developers follow outdated specs
- Fix: Keep OpenSpec in sync with PLANNING.md

❌ **No Clear Ownership**

- Why: Questions go unanswered, decisions delayed
- Fix: Always state owner and team contacts clearly

---

**Template Suite Version:** 1.0.0  
**Last Updated:** 2026-08-12  
**Maintained By:** LightSpeed Team
