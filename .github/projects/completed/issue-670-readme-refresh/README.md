---
file_type: "documentation"
title: "Issue [#670](https://github.com/lightspeedwp/.github/issues/670) — Update & Refresh README Files"
description: "Systematic refresh of all 57 README.md files with current information, broken link fixes, and consistent formatting"
version: "1.0.0"
status: completed
last_updated: "2026-05-31"
author: "Claude Code"
owners:
  - Claude Code
tags: ["readme", "documentation", "maintenance", "issue-670"]
category: "project"
priority: "high"
related_issues:
  - "[#667](https://github.com/lightspeedwp/.github/issues/667)"
  - "[#668](https://github.com/lightspeedwp/.github/issues/668)"
  - "[#669](https://github.com/lightspeedwp/.github/issues/669)"
---
related_issues:

- "[#668](https://github.com/lightspeedwp/.github/issues/668)"
- "[#669](https://github.com/lightspeedwp/.github/issues/669)"
- "[#667](https://github.com/lightspeedwp/.github/issues/667)"

---

# Issue [#670](https://github.com/lightspeedwp/.github/issues/670): Update & Refresh README Files

## Overview

Comprehensive refresh of all 57 README.md files discovered in the Wave 5 audit. This includes:

- Updating stale information and outdated links
- Fixing broken cross-references
- Ensuring consistent formatting and structure
- Adding/updating frontmatter where missing
- Validating all inline links

## Implementation Strategy

### Phase 1: Root & Critical Files (6 files)

Priority: **🔴 HIGH**

1. **`README.md`** (Root)
   - [ ] Update repository overview
   - [ ] Verify all links (7 Mermaid diagrams present)
   - [ ] Check installation/setup instructions

2. **`.github/README.md`** (Control plane)
   - [ ] Update control plane documentation
   - [ ] Verify workflow references
   - [ ] Check templating docs (4 Mermaid diagrams)

3. **`profile/README.md`** (GitHub profile)
   - [ ] Update profile information
   - [ ] Verify social links
   - [ ] Check donation/sponsor info (4 Mermaid diagrams)

4. **`docs/README.md`** (Documentation index)
   - [ ] Verify all doc links
   - [ ] Check organisation of documentation

5. **`.github/projects/README.md`** (Project templates)
   - [ ] Update project structure docs
   - [ ] Verify naming conventions (1 Mermaid diagram - recently fixed)

6. **`.vscode/README.md`** (VS Code settings)
   - [ ] Update editor configuration docs
   - [ ] Verify extension recommendations (1 Mermaid diagram)

### Phase 2: Feature & Major Folders (12 files)

Priority: **🟡 MEDIUM**

- `agents/README.md`
- `instructions/README.md`
- `plugins/README.md`
- `skills/README.md`
- `workflows/README.md`
- `scripts/README.md` (3 Mermaid diagrams)
- `tests/README.md` (3 Mermaid diagrams)
- `cookbook/README.md`
- `hooks/README.md`
- `.github/workflows/README.md`
- `.github/agents/README.md`
- `.github/instructions/README.md`

### Phase 3: Plugin Sub-folders (7 files)

Priority: **🟢 LOW**

All plugin README files under `plugins/lightspeed-*/README.md`

### Phase 4: Supporting Folders (17 files)

Priority: **🟢 LOW**

- Hooks sub-folders (3 files)
- Workflow sub-folders (1 file)
- Template & workflow docs (5 files)
- Schema & config (3 files)
- Tools & infrastructure (3 files)
- Instructions & archive (1 file)

### Phase 5: Archive & Special (11 files)

Priority: **🟢 LOW**

- Archive & completed projects (7 files)
- Special folders (4 files)

## Link Validation Strategy

1. **Internal Links**: Verify `.github/`, `plugins/`, `skills/`, etc. cross-references
2. **External Links**: Check GitHub URLs, documentation links
3. **Relative Paths**: Ensure correct path navigation
4. **Asset Links**: Verify diagram and image references

## Formatting Standards

All README files should follow:

- ✅ UK English spelling (optimise, organisation, colour)
- ✅ Consistent frontmatter with required fields
- ✅ H2 headers for main sections
- ✅ Code blocks with language specifiers
- ✅ Accessible link text (not "click here")
- ✅ Proper Markdown formatting

## Validation Checklist

For each file updated:

- [ ] Frontmatter present and valid
- [ ] All internal links resolve
- [ ] No broken external links
- [ ] Consistent heading hierarchy
- [ ] Code blocks properly formatted
- [ ] Mermaid diagrams validated (if present)
- [ ] UK English spelling verified
- [ ] No trailing whitespace

## Progress Tracking

### Completed (Phase 1 - Critical)

- [ ] Root documentation
- [ ] .github control plane
- [ ] GitHub profile
- [ ] Documentation index
- [ ] Project templates
- [ ] VS Code settings

### In Progress

- *Current phase: Planning*

### Pending

- Phase 2: Feature folders
- Phase 3: Plugin sub-folders
- Phase 4: Supporting folders
- Phase 5: Archive & special

## Related Issues

- **[#667](https://github.com/lightspeedwp/.github/issues/667)** — Wave 5 README Discovery & Audit
- **[#668](https://github.com/lightspeedwp/.github/issues/668)** — Mermaid Syntax Validation
- **[#669](https://github.com/lightspeedwp/.github/issues/669)** — Mermaid Accessibility Compliance (COMPLETED ✅)
- **[#670](https://github.com/lightspeedwp/.github/issues/670)** — Update & Refresh README Files (THIS ISSUE)

## Success Criteria

✅ All 57 README files reviewed and updated
✅ No broken links in any file
✅ Consistent formatting across all files
✅ All frontmatter fields present and valid
✅ Mermaid diagrams fully validated (Issue [#669](https://github.com/lightspeedwp/.github/issues/669) compliance)
✅ UK English spelling throughout
✅ Accessibility compliance verified

---

**Started**: 2026-05-31
**Target Completion**: 2026-06-07
**Last Updated**: 2026-05-31
