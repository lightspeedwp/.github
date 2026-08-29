# Active Projects Status Update — Comprehensive Execution Prompt

## Overview

Update the status and linking for all active projects in `.github/projects/active/` to ensure:

1. **Project Status Fields**: All projects have current status, priority, type, and effort fields
2. **Two-Way Issue Linking**: Projects link to related issues, and issues link back to projects
3. **HEAD Links to Develop**: All links point to the `develop` branch (live project files)
4. **Bidirectional References**: Each project-issue relationship is documented in both places

---

## Phase 1: Project Discovery & Status Audit

### Task 1.1: Scan All Active Projects

```bash
cd .github/projects/active
ls -1d */ | while read dir; do
  project_name="${dir%/}"
  echo "=== $project_name ==="
  [ -f "$dir/README.md" ] && echo "✓ README.md exists" || echo "✗ README missing"
  [ -f "$dir/PLANNING.md" ] && echo "✓ PLANNING.md exists" || echo "✗ PLANNING missing"
  [ -f "$dir/OPENSPEC.md" ] && echo "✓ OPENSPEC.md exists" || echo "✗ OPENSPEC missing"
  echo ""
done
```

### Task 1.2: Check Current Status Fields in Each Project

For each project's README.md, verify it contains:

```markdown
---
file_type: project
title: [Project Name]
status: [active|pending|review|blocked|at_risk]
priority: [critical|high|medium|low]
type: [feature|infrastructure|maintenance|documentation]
effort: [hours estimate]
---
```

---

## Phase 2: Establish Two-Way Linking Structure

### Task 2.1: Define HEAD Links Format

All links to active projects must use this format:

**Project Files in Issues:**

```markdown
[Project Name](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{project-slug}/README.md)
[Full Project Spec](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{project-slug}/PLANNING.md)
```

**Issue References in Projects:**

```markdown
[Issue #XXXX](https://github.com/lightspeedwp/.github/issues/XXXX) - Issue title
[Related PR #XXXX](https://github.com/lightspeedwp/.github/pull/XXXX) - PR title
```

### Task 2.2: Create Related Issues Section in README.md

Each project's README.md should have:

```markdown
## Related Issues & PRs

| Issue/PR | Type | Status | Purpose |
|----------|------|--------|---------|
| [#XXXX](https://github.com/lightspeedwp/.github/issues/XXXX) | Issue | Open | Core feature tracking |
| [#YYYY](https://github.com/lightspeedwp/.github/issues/YYYY) | Issue | Closed | Phase 1 completion |
| [PR #ZZZZ](https://github.com/lightspeedwp/.github/pull/ZZZZ) | PR | Merged | Implementation |

See [Full Project Definition](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{project-slug}/PLANNING.md)
```

---

## Phase 3: Update Project Status Fields

### Task 3.1: Audit Status Field for Each Project

Review each project and determine:

- **Status**: Is this project active, pending review, blocked, or at risk?
  - `active` - In progress, making forward momentum
  - `pending` - Waiting for approval/resources
  - `review` - In code review or design review
  - `blocked` - Blocked by external dependency
  - `at_risk` - SLA breach or critical blocker

- **Priority**: How critical is this?
  - `critical` - Blocking releases or production issues
  - `high` - Important for this quarter
  - `medium` - Planned but lower priority
  - `low` - Nice-to-have or future work

- **Type**: What kind of work?
  - `feature` - New feature or capability
  - `infrastructure` - Platform/tooling/automation
  - `maintenance` - Cleanup, tech debt, updates
  - `documentation` - Docs, guides, training
  - `testing` - Test coverage, QA, validation

- **Effort**: Time estimate
  - Format: `"16h"` to `"80h"` or `"5d"` notation
  - Based on Phase scope in PLANNING.md

### Task 3.2: Update Frontmatter in Each README.md

```yaml
---
file_type: project
title: "Project Name"
description: "One-line description"
status: active|pending|review|blocked|at_risk
priority: critical|high|medium|low
type: feature|infrastructure|maintenance|documentation
effort: "24h"
created_date: YYYY-MM-DD
last_updated: YYYY-MM-DD
maintained_by: "Team or person"
---
```

---

## Phase 4: Link Related Issues (Two-Way)

### Task 4.1: For Each Project, Identify Related Issues

Search for issues related to the project by:

1. Searching issue titles and labels for project name keywords
2. Checking milestone assignments
3. Reviewing labels: `project:*`, `phase:*`
4. Checking linked PRs in recent commits

### Task 4.2: Update Project README with Issue Links

For each related issue, add to the "Related Issues & PRs" table:

```markdown
| [#1234](https://github.com/lightspeedwp/.github/issues/1234) | Issue | Open | Phase 2 tracking |
```

### Task 4.3: Update Issue with Backlink to Project

Add to each issue's body (in a dedicated section):

```markdown
## 📋 Project Reference

**Related Project:** [Project Name](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{project-slug}/README.md)

See [Project PLANNING](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{project-slug}/PLANNING.md) for full specification.

**Project Status:** Active | Priority: High | Effort: 24h
```

---

## Phase 5: Validation & Verification

### Task 5.1: Run Project Linking Validation

```bash
npm test -- scripts/automation/__tests__/validate-project-linking.test.js
```

### Task 5.2: Check Two-Way Links

For each project-issue pair:

- ✅ Project README contains link to issue
- ✅ Issue contains link back to project file
- ✅ All links use HEAD (develop branch) URLs
- ✅ Link format is: `[Text](https://github.com/lightspeedwp/.github/blob/develop/path)`

### Task 5.3: Validate Status Fields

```bash
for project in .github/projects/active/*/; do
  if grep -q "^status:" "$project/README.md"; then
    echo "✅ $(basename $project): has status field"
  else
    echo "❌ $(basename $project): missing status field"
  fi
done
```

---

## Phase 6: Documentation & Communication

### Task 6.1: Document Changes in Git Commits

Use commits like:

```
feat: Update active projects status and linking

- Updated status fields for all 40+ active projects
- Added Related Issues sections to project READMEs
- Created two-way links between projects and tracking issues
- All links now point to develop branch HEAD
- Addresses: Linking Standard validation

Projects updated:
- Project A (active → high priority)
- Project B (pending → active)
- ...

This ensures:
1. Each project has current status, priority, type, effort
2. Each project links to tracking issues
3. Each tracking issue links back to project files
4. All links are live (develop branch) and navigable
```

### Task 6.2: Update LINKING_STANDARD.md

Ensure the linking standard document includes:

```markdown
# Project-Issue Linking Standard

## Format Requirements

### In Project README.md (frontmatter)
- `status`: One of active|pending|review|blocked|at_risk
- `priority`: One of critical|high|medium|low
- `type`: One of feature|infrastructure|maintenance|documentation
- `effort`: Estimated hours (e.g., "24h")

### In Project README.md (Related Issues section)
Links use HEAD format:
\`\`\`markdown
[#1234](https://github.com/lightspeedwp/.github/blob/develop/path) - Description
\`\`\`

### In Issue Body
Add project backlink in dedicated "Project Reference" section:
\`\`\`markdown
## 📋 Project Reference
**Related Project:** [Name](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{slug}/README.md)
\`\`\`
```

---

## Execution Checklist

- [ ] **Phase 1**: Scan all active projects, identify missing documentation
- [ ] **Phase 2**: Define HEAD link format, document in LINKING_STANDARD.md
- [ ] **Phase 3**: Update status/priority/type/effort in all project READMEs
- [ ] **Phase 4.1**: Identify related issues for each project
- [ ] **Phase 4.2**: Add issue links to project README "Related Issues" tables
- [ ] **Phase 4.3**: Add project backlinks to each issue
- [ ] **Phase 5.1-5.3**: Run validation, verify two-way linking
- [ ] **Phase 6**: Document changes, update linking standard
- [ ] **Final**: Create PR with all updates, ensure CI passes

---

## Key Points

1. **HEAD Links Only**: All links point to `develop` branch
   - Pattern: `https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/{slug}/README.md`

2. **Two-Way Links**: Every project-issue relationship documented both ways
   - Project README → Related Issues section links to issues
   - Issue body → Project Reference section links back to project

3. **Status Fields**: Complete frontmatter in each README
   - status, priority, type, effort REQUIRED
   - created_date, last_updated, maintained_by RECOMMENDED

4. **Validation**: Use provided validation scripts
   - Ensures all projects have Related Issues section
   - Validates issue number format
   - Checks for orphaned projects

5. **Bidirectional**: Both directions properly maintained
   - Project knows which issues track it
   - Issues know which project they track
   - No orphaned relationships

---

## Success Criteria

✅ All active projects have complete status/priority/type/effort fields  
✅ All projects have "Related Issues & PRs" section with HEAD links  
✅ All related issues have "Project Reference" backlink section  
✅ All links use `blob/develop/` (HEAD) format  
✅ validate-project-linking workflow passes  
✅ No orphaned projects (all have at least one tracking issue)  
✅ Changes documented in clear, dated commits  
