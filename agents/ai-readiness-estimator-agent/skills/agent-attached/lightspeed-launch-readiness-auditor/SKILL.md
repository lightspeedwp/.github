---
name: lightspeed-launch-readiness-auditor
description: final pre-launch qa for lightspeed wordpress, woocommerce, publishing, tourism, ai-readiness and lead-generation websites. use when the user asks for a launch checklist, page-by-page qa table, broken link checklist, form testing checklist, accessibility testing checklist, lighthouse or pagespeed notes, mobile or responsive qa, analytics or tagging checks, redirect verification, seo launch checks or go/no-go launch summary.
---

# LightSpeed Launch Readiness Auditor

## Purpose

Run final pre-launch QA for WordPress websites and produce practical launch-readiness outputs for LightSpeed projects.

Use this skill near the end of a website build, redesign, migration or strategic repositioning project, especially when a staging/dev site will replace a live WordPress site.

## Core rule

Do not mark a site ready to launch when unresolved blockers exist in redirects, forms, accessibility, privacy, analytics, indexing, broken links, critical content, security or checkout/payment flows.

If implementation evidence is missing, mark the item as `Pending` rather than assuming it passed.

## Inputs to accept

Accept any combination of:

- live site URL
- dev/staging URL
- sitemap or URL inventory
- redirect map
- page list or navigation map
- content approval notes
- Lighthouse/PageSpeed exports
- accessibility audit notes
- broken link reports
- form testing notes
- GA4/GTM tracking plans
- Search Console notes
- Figma parity reports
- claim register
- policy page drafts
- launch checklist exports

## Workflow

1. Confirm launch context: live URL, staging URL, project type, launch date if known and launch risk level.
2. Identify the evidence supplied and mark missing evidence as `Pending`.
3. Build a launch checklist grouped by content, design, development, SEO, redirects, analytics, accessibility, forms, performance, security and governance.
4. Create a page-by-page QA table for priority pages.
5. Create dedicated checklists for broken links, forms, accessibility, performance, mobile/responsive and analytics/tagging.
6. Flag launch blockers, high-risk issues and post-launch follow-up tasks.
7. Produce a go/no-go summary using the severity rules.
8. Recommend launch-day and post-launch monitoring actions.

## Required outputs

When running a full audit, include:

- Executive launch summary
- Evidence reviewed
- Evidence pending
- Launch checklist
- Page-by-page QA table
- Broken link checklist
- Form testing checklist
- Accessibility testing checklist
- Lighthouse/PageSpeed notes
- Mobile/responsive QA
- Analytics/tagging checks
- Redirect and SEO checks when relevant
- Policy/governance checks when relevant
- Issue register with severity
- Go/no-go launch summary
- Launch-day checklist
- Post-launch monitoring checklist
- Internal LightSpeed notes

## Status labels

Use:

- Pass
- Fail
- Pending
- Needs Review
- Not Applicable
- Launch Blocker
- Post-Launch

## Severity labels

Use:

- Blocker: must be fixed before launch
- High: should be fixed before launch unless explicitly accepted
- Medium: acceptable only with owner and post-launch plan
- Low: minor polish or monitoring item

## Go/no-go rules

- `Go`: no blockers, no unresolved high-risk launch-critical items, forms and analytics tested, redirects/indexing checked.
- `Conditional Go`: no blockers, but medium/high non-critical items have named owners and dates.
- `No-Go`: one or more blockers remain, or critical evidence is missing for redirects, forms, accessibility, privacy, indexing or checkout/payment flows.

## Reference loading

Use these references as needed:

- `references/launch-readiness-workflow.md` for the full audit process.
- `references/qa-checklists.md` for detailed checklist items.
- `references/go-no-go-rules.md` for launch decisions.
- `references/issue-severity-model.md` for severity classification.
- `references/wordpress-launch-notes.md` for WordPress-specific launch risks.
- `references/report-templates.md` for output structure.

Use the assets as copy-ready Markdown templates when the user asks for downloadable or reusable checklists.

## Quality standard

Be practical, specific and non-alarmist. Separate launch blockers from post-launch improvements. Do not overstate readiness when audit evidence is missing.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
