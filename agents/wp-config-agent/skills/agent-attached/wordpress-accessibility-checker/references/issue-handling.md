# Accessibility Checker Issue Handling

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

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
