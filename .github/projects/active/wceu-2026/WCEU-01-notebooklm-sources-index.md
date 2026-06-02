---
title: "[WCEU-01] Create NotebookLM sources index"
description: "Create NotebookLM sources index for WCEU 2026 talk"
created_date: "2026-05-29"
file_type: documentation
---

# [WCEU-01] Create NotebookLM sources index

**Title**: Create NotebookLM sources index (`notebooklm/sources-index.md`)
**Priority**: Critical (NOW — next 6 hours)
**Status**: TODO
**Due**: May 29, 2026 (today, ASAP)
**Assignee**: Claude
**Parent**: WCEU 2026 Talk Preparation

---

## Overview

Create a comprehensive index of all develop-branch URLs to be used with NotebookLM for generating slide briefs. This file will be formatted as **one URL per line** (NotebookLM requires this format) and can be directly pasted into a NotebookLM session.

---

## Deliverable

**File**: `wceu-2026/notebooklm/sources-index.md`

**Format**:

```
# NotebookLM Sources Index for WCEU 2026 Talk

## Foundation & Governance
https://github.com/lightspeedwp/.github/blob/develop/README.md
https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md
... (one URL per line)

## Architecture & Design
... more URLs

## Plugin Pack & Adoption
... more URLs

## Talk-Specific Assets
... more URLs

## WordPress Agent-Skills (Future Integration)
... WordPress repo reference

```

**Key Requirements**:

- [ ] All URLs must use `https://github.com/lightspeedwp/.github/blob/develop/` (develop branch only)
- [ ] One URL per line (NotebookLM format)
- [ ] Organized by category (Foundation, Architecture, Plugins, Talk-Specific)
- [ ] Up to 400 URLs maximum (NotebookLM limit)
- [ ] Includes references to key docs, agents, instructions, hooks, workflows, schemas
- [ ] All URLs are verified and active

---

## Sources to Include

### Foundation & Governance (5-8 URLs)

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.github/ISSUE_TEMPLATE/` folder
- `.github/PULL_REQUEST_TEMPLATE.md`
- `instructions/` folder

### Architecture & Design (5-8 URLs)

- `docs/ARCHITECTURE.md` (if exists)
- `docs/AUTOMATION_GOVERNANCE.md` (if exists)
- `docs/PLUGIN_PACK_ROADMAP.md` (if exists)
- Plugin pack related docs
- Agent specifications (if separate files)

### Plugin Pack & Adoption (8-12 URLs)

- `plugins/README.md`
- `plugins/PLUGIN_MANIFEST.json` (or similar)
- `docs/PLUGIN_INSTALLATION_GUIDE.md` (if exists)
- Hook definitions and examples
- Workflow examples
- Template examples
- Instruction file examples

### AI-Ops & Agents (8-10 URLs)

- Release agent spec/instructions
- Branding agent spec/instructions
- Meta agent spec/instructions
- Reviewer agent spec/instructions
- Linting agent spec/instructions
- Labeling agent spec/instructions
- Planner agent spec/instructions

### Talk-Specific Assets (4-6 URLs)

- `wceu-2026/talk-outline-25min.md`
- `wceu-2026/SLIDES_GENERATION_PROMPT.md`
- `wceu-2026/references/` (if exists)
- `wceu-2026/PLANNING.md`
- `wceu-2026/WORDPRESS_INTEGRATION_ROADMAP.md`

### WordPress Integration (1-2 URLs)

- Reference to WordPress repo (external, for context)
- Integration roadmap

---

## Acceptance Criteria

- [ ] `sources-index.md` created in `wceu-2026/notebooklm/`
- [ ] All URLs verified (link to active, content-rich pages)
- [ ] File formatted as one URL per line
- [ ] Organized by category with clear headers
- [ ] Total URLs under 400 (NotebookLM limit)
- [ ] Ready to paste directly into NotebookLM session
- [ ] File includes brief comment explaining purpose and NotebookLM usage

---

## Usage

Once complete, this file will be used in [WCEU-03]:

1. Copy all URLs from this file
2. Paste into new NotebookLM session
3. Add the `SLIDES_GENERATION_PROMPT.md` as the main brief
4. Run NotebookLM to generate slide briefs

---

## Related Tasks

- **Next**: [WCEU-02] Commit profile photo to assets
- **Depends on**: None
- **Blocks**: [WCEU-03] Run NotebookLM session

---

**Status**: TODO
**Effort**: 2 hours
**Created**: 2026-05-29
