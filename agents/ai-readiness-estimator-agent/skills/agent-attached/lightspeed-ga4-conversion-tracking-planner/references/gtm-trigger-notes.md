# GTM Trigger Notes

## Common trigger types

| Trigger | Notes |
|---|---|
| Link click | Use for CTA, mailto, tel and download links |
| Form submit | Use where forms emit reliable submit events |
| Custom event | Prefer for modern forms, AJAX forms and custom components |
| Visibility | Use carefully for thank-you messages or embedded widgets |
| History change | Use for single-page app style interactions if relevant |
| Click text / CSS selector | Use only when stable classes or data attributes exist |

## Implementation recommendations

- Prefer stable `data-*` attributes for CTAs and forms.
- Avoid brittle CSS selectors tied to layout classes.
- Test with GTM Preview mode.
- Validate GA4 DebugView before launch.
- Use consent-aware tag firing where required.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
