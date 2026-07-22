# Manual QA Checklist

Automated checks and plugin reports cannot prove full accessibility. Use this checklist for handoff after automated or MCP-supported work.

## Keyboard

- Can reach all interactive controls with keyboard only.
- Focus order follows visible reading order.
- Focus indicator is visible in normal, hover, active, and dark states.
- Menus, accordions, tabs, modals, filters, forms, and checkout steps can be opened, used, and closed by keyboard.
- No keyboard trap is present.

## Screen Reader

- Page title, headings, landmarks, forms, buttons, and links are announced usefully.
- Dynamic updates are announced where necessary.
- Decorative images are skipped and informative images are described.
- Error messages and validation hints are connected to fields.

## Visual and Contrast

- Text, controls, icons, and focus indicators meet the intended contrast target in all relevant states.
- Text remains usable when zoomed and on mobile breakpoints.
- Content does not depend on colour alone.

## Forms and Transactions

- Labels are visible or programmatically clear.
- Required fields, errors, success messages, consent wording, and privacy links are understandable.
- Checkout, enquiry, account, login, newsletter, and payment flows are tested manually.

## Media and Documents

- Video has captions or an equivalent transcript.
- Audio has transcript or equivalent text.
- PDFs and downloads are either accessible or have an accessible HTML alternative.

## WordPress-Specific Checks

- Reusable blocks, patterns, template parts, navigation, widgets, and shortcodes are tested at the source.
- Editor changes do not remove SEO-critical copy, CTA intent, tracking attributes, or internal links.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
