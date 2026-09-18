# Audit Scope Router

Use this file when the requested Yoast audit scope is ambiguous.

## Scope choices

| User request | Audit scope | Supporting files |
|---|---|---|
| Quick check, first pass, rough review | Fast audit mode | `intake/audit-intake.md` |
| Review titles and descriptions | Content metadata audit | `templates/page-metadata-review.md` |
| Review destinations or travel styles | Tour and destination archive audit | `templates/taxonomy-archive-review.md` |
| Check tours linked to destinations/accommodation | Travel relationship audit | `references/tour-relationship-reference.md`, `templates/tour-relationship-audit-report.md` |
| Check schema graph or rich result output | Schema audit | `references/schema-audit-reference.md`, `templates/schema-qa-report.md` |
| Check sitemap, robots, canonicals or indexation | Sitemap and crawlability audit | `references/evidence-map.md` |
| Prepare for rebuild or URL changes | Migration readiness audit | `intake/migration-audit-intake.md`, `templates/migration-readiness-report.md` |
| Check pre-launch risk | Launch QA | `templates/launch-qa-report.md` |
| Turn findings into implementation notes | Developer handoff | `intake/developer-handoff-intake.md`, `templates/developer-handoff.md` |

## Routing rules

- Use the smallest useful scope that matches the evidence.
- Do not expand a sample review into a full-site score.
- Route first-time setup and reusable defaults to `tour-operator-yoast-configuration`.
- Route code-level output conflicts to developer handoff.
