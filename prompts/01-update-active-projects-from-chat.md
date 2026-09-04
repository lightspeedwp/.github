---
file_type: "prompt"
title: "Update Active Projects From Chat Work"
description: "Systematically document session work in active project files, create enhancement tasks, regenerate openspec, and create/link GitHub issues."
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["active-projects", "documentation", "automation", "workflow"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt: Update Active Projects From Chat Work

## PROMPT: Based on the work done in this chat, update the related active project documentation files

### Context

When you complete feature work, bug fixes, or enhancements in a Claude Code chat session that relates to an active project (under `.github/projects/active/{project-slug}/`), the project documentation needs to be updated to reflect:

- Work completed in this session
- Outstanding gaps and next steps
- New enhancement tasks created
- Updated progress metrics
- Links to GitHub issues created

This prompt systematically walks through updating project files, creating new issues, and regenerating OpenSpec documentation.

### Task

Execute these steps IN ORDER for the active project(s) related to this chat:

#### STEP 1: Identify Related Active Projects
- List all active projects in `.github/projects/active/`
- Identify which project(s) this chat's work relates to
- If unclear, describe what work was done and I'll identify the project

#### STEP 2: Review Current Project Status
- Read the project's `README.md` (main overview)
- Read the project's `STATUS.md` (progress tracking)
- Identify the current phase (Phase 1, 2, 3, etc.)
- Note any blocked or in-progress work

#### STEP 3: Document Session Work
- Create a dated section in `STATUS.md` with format: `## Session {date} — {brief title}`
- Document:
  - What was accomplished in this chat
  - Files created/modified
  - Tests added/updated
  - Dependencies or outstanding blockers
  - Completion percentage (estimated)

#### STEP 4: Create Enhancement Tasks
- Identify optional enhancements discovered during implementation
- Create a new `ENHANCEMENTS-{date}.md` file (if not already existing)
- Document:
  - Enhancement title and description
  - Why it's valuable
  - Estimated effort (S/M/L/XL)
  - Priority (High/Medium/Low)
  - Dependency chain (if any)
- Example: `ENHANCEMENTS-2026-09-04.md` with 3-5 enhancement items

#### STEP 5: Regenerate OpenSpec Documentation
- If `openspec.json` exists in the project folder:
  ```bash
  npm run generate:openspec -- --project {project-slug}
  ```
- Or manually update `openspec.json` with:
  - New issues needed (based on work done)
  - Updated effort estimates
  - Issue descriptions and acceptance criteria
- Validate JSON schema: `npm run validate:openspec`

#### STEP 6: Create GitHub Issues From OpenSpec
- For each issue spec in `openspec.json`:
  - Create a new GitHub issue with:
    - Title from spec
    - Description from spec (include project link)
    - Labels: `type:task`, `area:{related-area}` (e.g., `area:automation`)
    - Milestone: Identify target milestone from `docs/MILESTONE_ALLOCATION_STRATEGY.md`
    - Link to active project: Add comment "Related to active project: [link to .github/projects/active/{slug}/]"
- Document issue #s created in project `STATUS.md`

#### STEP 7: Update Project Index Files
- Update `.github/projects/active/README.md`:
  - Add entry for this active project in the index table
  - Link to project folder and key documents
  - Update completion percentage
- Update `.github/projects/active/{slug}/README.md`:
  - Update "Phase X Status" section with completion state
  - Add links to related issues created
  - Update "Quick Links" section

#### STEP 8: Commit All Changes
- Stage files: `git add .github/projects/active/{slug}/ .github/reports/`
- Commit with message:
  ```
  docs: Update active project '{project-name}' after session work

  - Document session accomplishments in STATUS.md
  - Create enhancement tasks (ENHANCEMENTS-{date}.md)
  - Regenerate OpenSpec and create GitHub issues
  - Update project index and README files

  Session: {date}
  Issues Created: #{issue1}, #{issue2}, ...
  Related PR: (if applicable)

  Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
  ```
- Push directly to `develop` branch

### Constraints

- All commits go directly to `develop` branch (no feature branches)
- Keep descriptions in project files clear and concise
- Use existing frontmatter and section format (don't create new ad-hoc formats)
- Reference beneficial files:
  - `.github/projects/active/` (active project structure)
  - `scripts/openspec.js` (openspec generation)
  - `.github/labels.yml` (label prefixes)
  - `docs/MILESTONE_ALLOCATION_STRATEGY.md` (milestone guidance)
  - `.github/reports/` (reports output location)
  - `instructions/` (portable instruction files)
  - `skills/` (available skills)
  - `agents/` (available agents)
  - `workflows/` (portable workflows)
- Do NOT create new project folders without explicit request
- Do NOT modify issues or PR templates without checking current standards

### Acceptance Criteria

- [ ] Active project identified and current status reviewed
- [ ] Session work documented in `STATUS.md` with dated section
- [ ] Enhancement tasks documented in `ENHANCEMENTS-{date}.md`
- [ ] OpenSpec regenerated (if applicable) and validated
- [ ] GitHub issues created from OpenSpec specs with:
  - [ ] Correct title and description
  - [ ] Proper labels (family:value format)
  - [ ] Target milestone assigned
  - [ ] Link back to active project folder
- [ ] `.github/projects/active/README.md` updated with project entry
- [ ] `.github/projects/active/{slug}/README.md` updated with phase status
- [ ] All changes committed to `develop` with clear commit message
- [ ] Markdown files pass linting: `npm run lint:md`

### References

- **Active Projects:** `.github/projects/active/`
- **Project Template:** `.github/projects/active/*/README.md` (use as reference)
- **OpenSpec Script:** `scripts/openspec.js`
- **Label Standards:** `.github/labels.yml` and `docs/LABELING.md`
- **Milestone Strategy:** `docs/MILESTONE_ALLOCATION_STRATEGY.md`
- **Reports Location:** `.github/reports/`
- **Portable Assets:**
  - `agents/` (agent specifications)
  - `instructions/` (portable instruction files)
  - `skills/` (reusable skills)
  - `workflows/` (agentic workflows)
  - `scripts/` (utility scripts)
- **Governance:** CLAUDE.md, AGENTS.md

---

**Effort:** 1–2 hours  
**Use When:** Completed work session that relates to an active project  
**Output:** Updated project documentation, GitHub issues, merged commits to develop  
**Dependencies:** `npm`, `git`, GitHub API access
