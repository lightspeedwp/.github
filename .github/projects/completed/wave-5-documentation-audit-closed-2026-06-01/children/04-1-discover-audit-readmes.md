---
issue_number: 667
file_type: documentation
description: "Discover and inventory all README.md files"
parent_issue: 652
title: "[Child of [#652](https://github.com/lightspeedwp/.github/issues/652)] Audit: Discover All 44 README.md Files - Inventory"
type: "type:audit"
area: "area:documentation"
priority: "priority:normal"
status: completed
effort: "M"
---

## Overview

Discover, inventory, and audit all README.md files across the repository to create a comprehensive baseline for subsequent audits and improvements.

## Scope

- Use script or manual inspection to find all README.md files
- Create inventory spreadsheet with metadata for each
- Categorize by: Root/Core, Feature folders, Sub-folders, Test/Config
- Check each README for broken links, outdated content
- Identify which ones have Mermaid diagrams
- Note file sizes and last update dates

## Audit Checklist

- [ ] Find all README.md files in repo
- [ ] Create spreadsheet with columns: Path | Size | Last Updated | Has Mermaid | Issues Found
- [ ] Categorize each README by folder type
- [ ] Check for broken links in each README
- [ ] Check for outdated content indicators
- [ ] Note presence and count of Mermaid diagrams
- [ ] Document any immediate issues found

## Deliverables

- Complete README inventory spreadsheet/CSV
- List of READMEs by category (with counts)
- Initial issues log (broken links, outdated content)
- Mermaid diagram inventory (which READMEs have diagrams, how many)

## Related Files

- All README.md files across repository
- `.github/` folder and subfolders
- `docs/` folder and subfolders
- `agents/`, `scripts/`, `workflows/`, `instructions/` folders

## Related Documentation

- [Documentation Index](https://github.com/lightspeedwp/.github/blob/develop/docs/index.md)
- [Related Issues: [#512](https://github.com/lightspeedwp/.github/issues/512) & [#513](https://github.com/lightspeedwp/.github/issues/513)](<https://github.com/lightspeedwp/.github/issues/512>)
