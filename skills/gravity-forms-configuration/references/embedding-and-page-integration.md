# Embedding and page integration

Use this reference when Gravity Forms work touches page embeds, WordPress blocks, shortcodes, duplicate placements, AJAX behaviour, modal/tab/slider embeds, page-block updates, or production publication.

## Operating stance

- Prefer the Gravity Forms block or Embed Form workflow for block-editor sites.
- Treat production embeds as write operations that can affect conversions, accessibility, caching, analytics, and spam behaviour.
- Read the target page/post before modifying blocks or shortcodes.
- Preserve existing layout blocks, tracking wrappers, headings, helper copy, and accessibility landmarks unless the user explicitly approves a wider page edit.
- Never assume a form is embedded only once; inspect page content, reusable blocks, patterns, widgets, shortcodes, theme templates, and modal/tab/slider content where the connector exposes them.

## Preflight additions for embedding work

Capture:

- Target page/post URL, title, status, and editor type.
- Existing form embed method: Gravity Forms block, shortcode, classic editor, theme function, widget, reusable block/pattern, modal, tab, accordion, or slider.
- Form ID and form title at each placement.
- Whether the same form appears more than once on the same HTML document.
- AJAX setting and whether JavaScript errors, cache, CDN, or script optimisation are suspected.
- Whether title and description display settings match the page context.
- Whether field defaults or dynamic population are passed through a shortcode/block setting.
- Whether embed changes affect a live conversion path, payment flow, user registration flow, or support intake.

## Safe embed decision rules

| Situation | Recommended action |
|---|---|
| New block-theme page | Use the Gravity Forms block when available. |
| Existing shortcode in legacy content | Preserve shortcode unless there is a clear reason to convert; validate shortcode parameters. |
| Same form appears twice on one rendered page | Do not keep both placements. Duplicate the form or redesign the layout after approval. |
| Form in modal/tab/accordion/slider | Treat as higher risk; test focus, validation, CAPTCHA/spam fields, AJAX, and submission. |
| Payment, registration, or upload form | Require explicit approval and live-page QA before publication. |
| Dynamic field values | Verify field parameter names and values; test prefill and state validation. |
| Cached page/CDN | Confirm cache exclusions or purge plan before and after changes. |

## Block-editor guidance

When an MCP app exposes block update actions:

1. Read the current page/post content.
2. Locate the intended insertion point by heading, block index, pattern name, or existing placeholder copy.
3. Insert or update only the Gravity Forms block unless the user approved adjacent copy/layout edits.
4. Record the form ID, display title/description settings, AJAX setting if exposed, and any field-value defaults.
5. Preview or test the page if the MCP app supports it; otherwise provide manual preview steps.
6. Run a test submission and confirm entry, confirmation, notification, spam status, and feed behaviour.

## Shortcode guidance

Validate shortcode parameters before publishing:

- `id` must match an existing active form.
- `title` and `description` must match the page context.
- `ajax` needs JavaScript/cache testing.
- `field_values` requires exact parameter names and safe input handling.
- `theme` and `styles` should be treated as visual/styling changes; validate JSON where styles are used.
- Avoid custom `tabindex` unless there is a strong accessibility reason.

## Duplicate embed rule

A single Gravity Forms form should not be embedded multiple times in the same rendered page. Duplicate placements can break submission, submit the wrong instance, trap keyboard focus, or affect payment/CAPTCHA behaviour. If the same experience is needed in multiple page areas, duplicate the form and embed each unique form once, or redesign the page flow.

## Production embed validation checklist

- Page renders without JavaScript console errors.
- The intended form appears once on the rendered page.
- Labels, descriptions, required indicators, and confirmation messages are visible and accessible.
- Conditional logic and page breaks behave correctly.
- Dynamic defaults populate correctly and do not expose sensitive values.
- Spam protection works with the embed context.
- AJAX, if enabled, submits reliably on cached/CDN-served pages.
- Admin and user notifications trigger as expected.
- Payment, user registration, marketing, or CRM feeds run only after approved test submissions.
- Handoff records the page URL, form ID, embed method, and validation result.

## Manual fallback

If the connector cannot edit page blocks, output `templates/manual-implementation-plan.md` with exact manual steps for WordPress admin users. Include the form ID, recommended block/shortcode, page target, settings, validation checklist, and rollback plan.
