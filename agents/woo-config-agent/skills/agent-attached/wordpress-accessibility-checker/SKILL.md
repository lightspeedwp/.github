---
name: wordpress-accessibility-checker
description: audit and remediate wordpress accessibility issues reported by the accessibility checker plugin or exported audit evidence. use when inspecting accessibility checker feedback, normalising issue exports, prioritising wcag-oriented fixes, creating client or developer reports, preparing mcp-safe wordpress content edits, or applying supported fixes such as alt text, link text, heading order, captions, labels, table headers, media metadata, and content structure while avoiding unsafe theme, plugin, javascript, css, aria, checkout, or production bulk changes.
---

# WordPress Accessibility Checker

## Core Rule

Use Accessibility Checker findings as evidence to verify, not as automatic truth. Confirm the affected content, user impact, editable source, and safe fix path before recommending or changing anything.

Default to report mode. Apply fixes only when the user explicitly asks for changes and the WordPress MCP app exposes a clear, supported edit path.

## Resource Map

Load only the supporting file needed for the task:

- `references/issue-handling.md`: triage findings, choose severity, and decide whether a fix is safe.
- `references/mcp-access-patterns.md`: inspect or edit WordPress data through an MCP app.
- `references/remediation-boundaries.md`: separate content fixes from developer/theme/plugin work.
- `references/manual-qa-checklist.md`: define keyboard, screen reader, contrast, form, media, and PDF follow-ups.
- `profiles/*.yml`: choose a guarded operating profile for report-only, staging fixes, or production work.
- `templates/*.md`: produce audit reports, client summaries, developer handoffs, and fix logs.
- `schemas/*.json`: shape structured findings, audit reports, and fix plans.
- `examples/*.md`: mirror expected outputs and workflows.
- `scripts/normalize_findings.py`: normalise CSV or JSON issue exports before analysis.
- `scripts/summarize_findings.py`: create a quick markdown summary from normalised findings.
- `scripts/validate_audit_report.py`: sanity-check markdown or JSON reports before delivery.
- `memory/README.md`: decide which durable site preferences can be remembered and which run-specific findings must not be stored.

## Workflow

### 1. Confirm the run profile

Classify the request as one of these modes:

- Report mode: inspect, group, prioritise, and recommend. Do not change WordPress content.
- Fix-plan mode: inspect and produce exact proposed edits, but do not apply them.
- Fix mode: inspect first, apply only approved safe content edits, then verify the changed items.
- QA mode: review an existing report, fix log, or handoff for evidence gaps and unsupported claims.

Use the closest profile from `profiles/` when the user's risk tolerance or environment is unclear.

### 2. Scope the evidence

Capture:

- Site/environment: local, staging, or production.
- Source: plugin issue list, export, screenshot, pasted findings, direct content inspection, or manual page check.
- Content scope: all public content, priority pages, one page/post, templates, media library, forms, documents, or a specific issue list.
- Desired output: report, fix plan, client summary, developer handoff, direct remediation, or QA review.

If issue data is exported as CSV or JSON, run `scripts/normalize_findings.py` and use the normalised JSON as the working register.

### 3. Inspect before deciding

When using a WordPress MCP app, read before writing:

- Plugin status and available Accessibility Checker records, if exposed.
- Affected posts, pages, media, reusable blocks, navigation, post meta, forms, comments, and custom fields when available.
- URLs, titles, post types, statuses, IDs, modified dates, and editable source areas.

If the MCP app cannot expose plugin issue records, state the limitation and use the safest available fallback: exported report, pasted findings, direct content inspection, read-only database access if available, or exact admin review steps.

### 4. Triage and deduplicate

Use `references/issue-handling.md` for the priority model. Group findings by:

- Issue type.
- Affected URL/content item.
- Editable source area.
- User impact.
- Likely owner: content, developer/theme, plugin/vendor, design, or manual QA.
- Repeated root cause, such as a template, reusable block, shortcode, widget, menu, form, or component.

Do not inflate counts with repeated template-level findings. Report both affected examples and likely source cause when supported by evidence.

### 5. Recommend or apply only safe fixes

Safe content-level fixes usually include:

- Informative image alt text when image purpose is clear.
- Empty alt text for decorative images when the editor supports it.
- Meaningful link or button text.
- Editable heading hierarchy fixes that preserve structure and meaning.
- Captions, transcript links, table headers, form labels, helper text, validation copy, and consent wording when the relevant editor supports them.

Escalate instead of editing when the issue involves theme templates, CSS, JavaScript, ARIA behaviour, focus state, keyboard traps, modals, menus, sliders, checkout, embedded widgets, PDFs, legal statements, or broad production bulk changes.

When applying fixes:

1. Re-read the source content.
2. Apply the smallest safe batch.
3. Re-read the changed content.
4. Record the exact change and verification result in the fix log.
5. Stop and report if the edit path is ambiguous, destructive, or unsupported.

### 6. Verify honestly

Never claim WCAG compliance or full accessibility from plugin feedback alone. Say exactly what was checked and what remains unverified.

Verification may include:

- Plugin issue removed or reduced, if a rescan is supported.
- Updated WordPress content still matches meaning, SEO intent, brand tone, and conversion path.
- No obvious broken markup introduced.
- Manual QA items listed for keyboard navigation, screen reader behaviour, focus order, colour contrast, forms, media, PDFs, checkout, and dynamic components.

### 7. Deliver the right output

Use templates for consistency:

- Audit or fix report: `templates/audit-report.md`.
- Client-safe summary: `templates/client-summary.md`.
- Developer handoff: `templates/developer-handoff.md`.
- Applied-fix log: `templates/fix-log.md`.

For client-facing summaries, stay practical and non-alarmist. For developer handoff, include exact selectors, template names, block names, post IDs, URLs, reproduction notes, and evidence confidence when available.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
