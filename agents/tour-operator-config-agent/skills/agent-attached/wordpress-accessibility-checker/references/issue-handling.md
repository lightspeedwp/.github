# Accessibility Checker Issue Handling

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

Use this reference when converting Accessibility Checker feedback into recommendations, fixes, or handoff notes.

## Priority Model

- Blocker: prevents core navigation, enquiry, checkout, or content comprehension for keyboard or screen reader users.
- Serious: materially harms access to priority content, conversion paths, account flows, or transactional steps.
- Moderate: creates friction but has a clear workaround or affects lower-priority content.
- Minor: low-impact quality issue, usually editorial, metadata, or consistency cleanup.
- Needs review: automated signal requires human judgement before changing content.

## Common Finding Map

| Finding pattern | Typical user impact | Preferred fix | Safe through MCP? | Evidence to check |
| --- | --- | --- | --- | --- |
| Missing image alt text | Screen reader users lose meaningful visual information | Add concise alt text for informative images; use empty alt for decorative images when supported | Yes, when purpose is clear | Image context, link destination, surrounding copy |
| Suspicious or redundant alt text | Image description may be noisy, duplicated, or misleading | Replace filename-like, keyword-stuffed, or repeated alt text with purposeful text | Yes, when context is clear | Existing alt, image use, page intent |
| Empty link or button text | Screen reader and voice-control users cannot identify the control | Add clear accessible text or update linked image alt text | Yes for editable content; developer fix for template controls | Link target, block markup, template source |
| Vague link text | Users cannot understand destination out of context | Replace "click here", "read more", or bare URLs with destination-specific text | Yes | Link destination and conversion intent |
| Heading order issue | Page structure is harder to navigate | Adjust editable headings into a logical outline without using headings for visual size | Yes for content; developer fix for templates | Full page outline and reusable blocks |
| Missing form label | Screen reader users cannot identify field purpose | Add visible label or supported accessible label; verify required and validation messaging | Sometimes | Forms plugin, field config, validation copy |
| Low contrast | Text or controls may be unreadable | Adjust design tokens, theme styles, or block colours after visual check | Usually manual/developer | Rendered state, hover/focus state, tokens |
| Missing table header | Data relationships are unclear | Add header row/column markup or replace layout table with simpler content | Yes only when table structure is clear | Table purpose and first row/column semantics |
| Video/audio missing captions or transcript | Deaf or hard-of-hearing users lose content | Add captions, transcript, or equivalent text summary | Manual unless media fields are exposed | Media source, transcript availability |
| PDF/document issue | Download may be inaccessible | Replace with accessible HTML page or remediate source document/PDF | Usually manual | Document purpose, source file, alternative page |
| ARIA warning | Assistive tech may receive incorrect semantics | Verify rendered behaviour before changing ARIA | Developer/manual | DOM behaviour, keyboard flow, component source |
| Repeated template issue | Same issue appears across many pages | Fix source template/block/component once | Developer/manual unless template editing is supported | Affected examples and common source |

## Fix Writing Rules

- Preserve the page's business goal and conversion intent.
- Use natural language, not keyword stuffing.
- Keep alt text concise. Describe function for linked images and meaning for informative images.
- Mark decorative images as decorative or use empty alt text when supported. Do not invent descriptions for decoration.
- Do not fix heading order by choosing headings for visual size. Use styles for appearance and headings for structure.
- Make link text meaningful without nearby text.
- For forms, include required state, validation behaviour, consent language, and privacy links when relevant.
- For repeated issues, recommend fixing the reusable source before editing each affected page individually.

## Verification Checklist

After fixes, verify as much as the available tools allow:

- Affected content still renders and keeps intended meaning.
- Plugin feedback is removed or reduced if re-scan is supported.
- No new SEO, conversion, or content problem was introduced.
- Priority pages still have a clear enquiry, contact, checkout, or account path.
- Remaining keyboard, screen reader, visual, form, media, and document QA is listed.

## Manual Admin Paths

Use these paths when direct MCP support is missing:

- Plugin report: `Accessibility Checker > Open Issues` or the plugin issue list for the affected content.
- Page content: `Pages > All Pages > [Page] > Edit`.
- Post content: `Posts > All Posts > [Post] > Edit`.
- Media alt text: `Media > Library > [Image] > Alt Text`.
- Navigation labels: `Appearance > Menus` or `Appearance > Editor > Navigation`, depending on the theme.
- Forms: the active forms plugin menu, such as `Forms > Forms > [Form] > Edit`.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
