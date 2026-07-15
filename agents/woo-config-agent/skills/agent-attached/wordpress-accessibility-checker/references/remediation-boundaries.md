# Remediation Boundaries

Use this reference to decide whether to fix, recommend, or escalate.

## Usually Safe Content Fixes

- Image alt text when purpose is clear.
- Decorative image handling when supported by the editor.
- Link text and button text in editable content.
- Headings in editable page content.
- Captions and transcript links when content exists.
- Table headers when the table structure is genuinely tabular.
- Form label, helper text, confirmation, and consent wording when the forms tool exposes safe editing.
- Media titles and descriptions when they affect the accessibility issue.

## Usually Developer or Manual Fixes

- Colour contrast in theme styles, tokens, hover states, and focus states.
- Keyboard traps, focus order, skip links, modals, menus, accordions, tabs, sliders, maps, embedded widgets, and checkout.
- ARIA roles, live regions, widget semantics, and dynamic state announcements.
- Repeated issues from templates, shortcodes, blocks, plugins, or theme components.
- PDF remediation and document accessibility.
- Legal conformance statements and accessibility policy wording.

## Production Editing Boundary

For production sites, require a narrower scope:

- Prefer report mode or fix-plan mode.
- Apply only low-risk content fixes with clear approval.
- Avoid bulk edits unless there is a backup and rollback path.
- Batch changes by priority page or issue type.
- Report exact changes and unresolved risks after every batch.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
