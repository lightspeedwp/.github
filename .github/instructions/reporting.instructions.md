---
applyTo: "**"
description: "Standards for creating, updating, and organising reports in .github/reports/, including daily and weekly progress tracking."
---

# Reporting Standards & Conventions

## Purpose

Provide a single source of truth for creating, formatting, and storing reports, with specific guidance for daily updates and weekly summaries on long-running projects.

## Scope

Applies to all report-like outputs (Markdown, JSON, CSV, HTML) created by contributors or agents. These rules sit alongside file-output-organization and community standards.

## Locations

- **Canonical path:** `.github/reports/{category}/`
- **Progress tracking:** use `.github/reports/progress/` for multi-day or multi-week project updates.
- **Never** place reports in repository root, `docs/`, or `/tmp/` (except transient processing).

## Categories (quick reference)

- analysis, audits, implementation, migration, validation
- agents, coverage, frontmatter, issue-metrics, labeling, linting, meta, metrics, optimisation
- **progress** (new): daily updates and weekly summaries for long-running efforts

## Naming

- Kebab-case filenames; avoid spaces and uppercase.
- Prefer descriptive names with ISO dates for time-bound updates.
- Progress examples:
  - `.github/reports/progress/daily-update-2025-12-11.md`
  - `.github/reports/progress/weekly-summary-2025-w50.md`

## Frontmatter (Markdown reports)

Include at minimum:

```yaml
---
title: "Concise report title"
description: "1–2 sentence summary"
file_type: "report"
category: "progress" # or other category
created_date: "YYYY-MM-DD"
version: "v1.0.0"
authors: ["name or automation"]
tags: ["progress", "weekly-summary"]
references:
  - path: ".github/projects/{related-file}.md"
    description: "Related project tracker"
---
```

## Progress Tracking Templates

### Daily Update (per day)

```
## Date: YYYY-MM-DD
**Work Completed**:
- Task X.Y completed
- N tests added to file.test.js
- Coverage increased from X% to Y%
```

Guidance:

- One file per day when detail matters, or append to a weekly summary file for brevity.
- Keep bullets action-focused; quantify changes (tests, coverage, tickets closed).

### Weekly Summary (week ending or ISO week)

```
## Week of YYYY-MM-DD
**Summary**:
- Phase X completed
- Coverage: X% → Y% (Δ+Z%)
- Tests added: N

**Key Achievements**:
- [List achievements]

**Challenges**:
- [List challenges]

**Blockers**:
- None / [describe blocker]

**Next Steps**:
- Continue with Task X.Y+1
```

Guidance:

- Use one file per week per project (e.g., `weekly-summary-2025-w50.md`).
- Link back to related project trackers in `.github/projects/`.
- Capture blockers clearly; propose mitigation if known.

## Folder Rules

- Create `.github/reports/progress/` if absent; keep daily and weekly files here.
- Do not mix progress reports into `metrics/` or `implementation/`; use `progress/` for chronological updates.
- Update `.github/reports/README.md` when adding new categories or conventions.

## Quality & Review

- Ensure accessibility (clear headings, meaningful link text) and performance (avoid oversized embeds).
- Run lint/format for Markdown if configured; fix frontmatter schema issues.
- If coverage or test counts change, note whether metrics are project-wide or scoped.

## Checklist (before committing)

- [ ] Stored under `.github/reports/{category}/` with kebab-case filename.
- [ ] Frontmatter present and valid; category set to `progress` for updates.
- [ ] Daily/weekly template followed; metrics and blockers captured.
- [ ] Related project/report indexes updated if structure changed.

## References

- `.github/reports/README.md` — directory map and examples
- `.github/agents/reporting.agent.md` — conversation flow and guardrails
- `.github/instructions/file-output-organization.instructions.md` — canonical locations
