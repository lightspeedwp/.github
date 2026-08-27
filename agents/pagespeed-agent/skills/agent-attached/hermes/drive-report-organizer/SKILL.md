---
name: drive-report-organizer
description: apply consistent google drive naming and folder conventions for pagespeed audit reports, lighthouse reports, re-audits, comparison docs, raw exports, client folders, and related performance files. use when organising, naming, creating, moving, or suggesting storage locations for google drive audit documents; when shared-drive context is available; or when avoiding duplicate or inconsistent client/site/report naming patterns.
---

# Drive Report Organizer

## Core behaviour

Use this skill to standardise Google Drive names and storage recommendations for PageSpeed audit work. Prefer readable, stable names that sort chronologically and avoid creating parallel naming systems.

When Drive context is available, inspect existing shared-drive, client, or folder patterns before suggesting or creating new folders. If an existing stable convention differs slightly, preserve it and make the smallest compatible recommendation instead of inventing a new structure.

Do not create, rename, move, or delete Drive files unless the user explicitly asks for that action. If only asked for guidance, return recommended titles, folder names, and paths.

## Naming conventions

Use ISO dates at the start of report document titles: `YYYY-MM-DD`. This keeps files sortable by date in Google Drive.

Use title case for client, site, and report descriptors. Keep names human-readable; avoid internal shorthand unless it is the confirmed client or project name.

Primary document title patterns:

- Initial audit: `YYYY-MM-DD - <Client Name> - <Site Name> - PageSpeed Audit`
- Re-audit: `YYYY-MM-DD - <Client Name> - <Site Name> - PageSpeed Re-Audit`
- Before/after comparison: `YYYY-MM-DD - <Client Name> - <Site Name> - PageSpeed Audit Comparison`
- Developer handoff: `YYYY-MM-DD - <Client Name> - <Site Name> - PageSpeed Developer Handoff`
- Raw Lighthouse export: `YYYY-MM-DD - <Client Name> - <Site Name> - Lighthouse Export - <Scope>`
- Raw PageSpeed Insights export: `YYYY-MM-DD - <Client Name> - <Site Name> - PageSpeed Insights Export - <Scope>`

Use `<Scope>` only when it prevents ambiguity, for example `Homepage - Mobile`, `Homepage - Desktop`, `Product Page - Mobile`, or `Sitewide`.

Avoid these inconsistent patterns:

- Dates at the end of the title.
- Mixed date formats such as `24-06-2026`, `June 2026`, or `2026 June 24`.
- Multiple names for the same report type, such as `PSI Audit`, `Speed Report`, and `Page Speed Review`.
- Extra version labels when the date already identifies the report. Add `v2` only when two same-day files have the same client, site, report type, and scope.

## Folder conventions

Prefer one reusable client/site folder pattern:

`<Client Name> - <Site Name>`

Use this folder for all audit-related docs for that client site. When a client has multiple websites, create one folder per site instead of mixing reports together.

Recommended nested structure:

```text
<Shared Drive or Client Root>/
└── <Client Name> - <Site Name>/
    └── Reports/
        └── PageSpeed Audits/
            └── <YYYY>/
```

If the shared drive already has an approved client folder, place the report under the closest matching `Reports`, `Audits`, `Performance`, or `PageSpeed Audits` folder. Do not create a second `PageSpeed Audits` folder if an equivalent folder already exists.

When shared-drive context is not available, suggest a path rather than asserting the folder exists:

`Suggested path: <Client Name> - <Site Name>/Reports/PageSpeed Audits/<YYYY>/`

## Examples

Initial audit for African Safaris New Zealand:

- Folder: `African Safaris - africansafaris.co.nz`
- Document title: `2026-06-24 - African Safaris - africansafaris.co.nz - PageSpeed Audit`
- Suggested path: `African Safaris - africansafaris.co.nz/Reports/PageSpeed Audits/2026/`

Re-audit for the same site:

- Document title: `2026-07-08 - African Safaris - africansafaris.co.nz - PageSpeed Re-Audit`

Comparison report after remediation:

- Document title: `2026-07-08 - African Safaris - africansafaris.co.nz - PageSpeed Audit Comparison`

Mobile Lighthouse export for a homepage:

- Document title: `2026-06-24 - African Safaris - africansafaris.co.nz - Lighthouse Export - Homepage - Mobile`

Client with multiple sites:

```text
Novus Media - PE Express/
Novus Media - George Herald/
Novus Media - Knysna-Plett Herald/
```

## Edge-case handling

Missing client name:

- Use the confirmed site name or domain in the site position.
- Use `Unknown Client` only as an interim label when a folder or title must still be proposed.
- Prefer asking for the client name before creating a new Drive folder.
- Suggested title pattern: `YYYY-MM-DD - Unknown Client - <Site Name> - PageSpeed Audit`

Missing site name but URL is available:

- Derive the site name from the canonical domain.
- Strip protocol, paths, tracking parameters, and trailing slashes.
- Example: `https://www.example.co.za/services/?utm_source=x` becomes `example.co.za`.

Missing both client and site name:

- Do not invent a brand name.
- Use a temporary holding folder only if needed: `Unassigned - PageSpeed Audits`.
- Suggested title pattern: `YYYY-MM-DD - Unassigned - Website - PageSpeed Audit`.

Client name and site name are the same:

- Avoid duplicate titles like `Example - Example`.
- Use the client or brand once, then the domain if available: `Example - example.com`.
- If no domain is available, use `Example - Website`.

Multiple pages in one audit:

- Use the site-level report title for the main document.
- Put page-level details inside the report, not in the title.
- Only include page names in file titles for raw exports or page-specific supporting files.

Duplicate existing files or folders:

- Treat the newest matching report as a candidate, not automatically canonical.
- Prefer the file with the clearest title, strongest evidence, and correct shared-drive location.
- Recommend consolidation or renaming rather than creating another duplicate.

Conflicting existing folder conventions:

- Preserve the broader workspace convention if it is obvious and consistent.
- Recommend the closest compatible folder name.
- Note any mismatch clearly under assumptions.

Same-day repeated audits:

- If the scope differs, add the scope rather than a version number.
- If the scope is identical, append `- v2`, `- v3`, etc. only as a last resort.

## Output guidance

When asked to name or organise audit files, return this format:

```markdown
**Document title:** `YYYY-MM-DD - <Client Name> - <Site Name> - PageSpeed Audit`
**Folder name:** `<Client Name> - <Site Name>`
**Suggested path:** `<Shared Drive or Client Root>/<Client Name> - <Site Name>/Reports/PageSpeed Audits/<YYYY>/`
**Related files:** `<optional supporting export or screenshot names>`
**Assumptions:** `<missing or inferred client/site/date/shared-drive details>`
```

When asked to create a report document, use the chosen document title exactly. When asked to create or locate a folder, use the chosen folder name exactly. When uncertain, prioritise stability and readability over cleverness.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
