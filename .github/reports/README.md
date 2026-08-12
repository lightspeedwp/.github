# Reports Directory

This directory organises operational reports, audits, and analysis documents across their lifecycle.

## Folder Structure

### `active/`

Current, referenced reports being actively used in planning, decision-making, or open initiatives.

**Characteristics:**

- Recently created or frequently referenced
- Linked to open GitHub issues or active projects
- Inform ongoing work or active decisions
- Typically updated or validated in recent sprints

**When to Archive:**

- Report is superseded by a newer version
- Referenced initiative/issue is closed
- Information is historical and no longer actionable
- Over 90 days old AND no recent references

### `archive/`

Completed, historical, or reference reports organized by category.

#### `archive/weekly-summaries/`

Automated weekly status summaries and standup reports (no longer active, kept for reference).

#### `archive/deprecated-audits/`

Stub files, incomplete audits, test reports, and other incomplete work products.

#### `archive/workflow-artifacts/`

Release notes, changelogs, and CI/CD workflow outputs (preserved for historical record).

#### `archive/a11y-completed/`

Accessibility (WCAG 2.2 AA) audit reports and remediation documentation from completed initiatives.

#### `archive/historical/`

Pre-restructuring guides, legacy documentation, and organizational reference materials.

### `archived/`

Legacy folder for reports migrated during Phase 2 (maintained for backward compatibility during transition).

### `audits/`

Audit reports and assessment documents (may be consolidated into `archive/` in future phases).

## Report Lifecycle Policy

### Creating a Report

1. **Determine lifecycle:** Will this be actively used for >2 months? If yes, place in `active/`. If not, place directly in appropriate `archive/` subfolder.
2. **Use descriptive naming:** `{category}-{descriptor}-{date}.md` (kebab-case, ISO date format)
3. **Link to issues:** If report informs a decision, link to the related GitHub issue in the report header
4. **Link to projects:** If report documents an active project, add to project README "Related Reports" section

### Archiving a Report

**When to archive:**

- Initiative/issue is closed
- Report is superseded by newer information
- Report hasn't been referenced in 90+ days
- Report is complete and no longer requires updates

**How to archive:**

```bash
# Move report to appropriate archive subfolder
git mv .github/reports/active/report-name.md .github/reports/archive/{category}/report-name.md

# Create a commit
git commit -m "archive: Move {report-name} to archive/{category}"
```

See [ARCHIVE_WORKFLOW_GUIDE.md](../..)/.github/ARCHIVE_WORKFLOW_GUIDE.md) for the complete archival process.

## Quick Navigation

| Folder | Purpose | Use For |
|--------|---------|---------|
| `active/` | Current, referenced reports | Decision-making, active planning |
| `archive/weekly-summaries/` | Historical status summaries | Reference, historical context |
| `archive/deprecated-audits/` | Incomplete/stub reports | (Archive only, don't create) |
| `archive/workflow-artifacts/` | Releases, changelogs | Release notes, historical records |
| `archive/a11y-completed/` | WCAG 2.2 AA audit results | Accessibility compliance history |
| `archive/historical/` | Pre-restructuring guides | Legacy reference, organizational context |

## Maintenance

**Monthly:** Review `active/` folder for reports ready to archive (no activity in 90+ days)

**Quarterly:** Audit cross-references between reports and GitHub issues to identify orphaned reports

**Annual:** Review archival categories for consolidation opportunities

## Related Documentation

- **[.github/ARCHIVE_WORKFLOW_GUIDE.md](../..)/.github/ARCHIVE_WORKFLOW_GUIDE.md)** — Project archival process
- **[CLAUDE.md](../../)** — Reports folder structure reference (section: Reports & Projects Restructuring)
- **[.github/projects/active/reports-projects-restructuring-2026-08-11/](../projects/active/reports-projects-restructuring-2026-08-11/)** — Initiative details

---

**Last Updated:** 2026-08-12  
**Restructuring Status:** ✅ Phase 4 Complete
