# WordPress MCP Access Patterns

Use this reference when the skill has direct WordPress MCP access.

## Read-First Order

1. Confirm environment: local, staging, or production.
2. Check whether Accessibility Checker is installed and active if plugin inspection is available.
3. Inspect issue records only through supported read actions.
4. Inspect affected content directly before recommending or editing.
5. Collect stable identifiers: post ID, URL, title, post type, status, modified date, media ID, term ID, form ID, template name, reusable block ID, selector, or block name.

## Useful Content Sources

- Posts and pages.
- Custom post types.
- Media records and metadata.
- Navigation menus and Navigation blocks.
- Reusable blocks and synced patterns.
- Template parts and block theme templates when exposed safely.
- Form plugin configuration when exposed safely.
- Terms, custom fields, and post meta that control displayed content.
- Comments only if the reported issue appears in user-generated content.

## Fallbacks When Plugin Issue Data Is Not Exposed

Use one or more of these, and label the limitation:

- Ask for or process an exported Accessibility Checker report.
- Use pasted findings or screenshots as issue evidence.
- Inspect affected pages/posts directly.
- Query available database tables only if safe read-only database tools exist.
- Provide manual admin steps to verify the plugin issue list.

## Write Guardrails

Only write when the user has asked to apply fixes.

Allowed write pattern:

1. Quote or summarise the current value.
2. Explain the proposed smallest safe edit.
3. Apply the edit through the supported WordPress action.
4. Re-read the updated object.
5. Record the before, after, and verification in `templates/fix-log.md` format.

Stop before writing when:

- The source of the rendered issue is unclear.
- The edit could affect many pages.
- The issue belongs to theme/plugin code.
- The fix changes legal, policy, pricing, checkout, or consent meaning.
- The action is production bulk editing without approval, backup, and rollback path.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
