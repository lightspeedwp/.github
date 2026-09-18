# Frontend Layout and Theme Styling

Use this reference when Gravity Forms work affects visual presentation, block-editor styles, field layout, form themes, custom classes, legacy markup, or frontend CSS. Keep this work configuration-first and route code/theme changes to the appropriate WordPress or design-system workflow unless the MCP connector exposes safe style operations and the user has approved them.

## Source posture

Primary sources:

- Gravity Forms: Form Themes and Style Settings — <https://docs.gravityforms.com/form-themes-and-style-settings/>
- Gravity Forms: Modifying Field Layout with CSS Ready Classes — <https://docs.gravityforms.com/css-ready-classes/>
- Gravity Forms: Migrating Your Forms from Ready Classes — <https://docs.gravityforms.com/migrating-your-forms-from-ready-classes/>
- Gravity Forms: Creating Columns in the Form Editor — <https://docs.gravityforms.com/working-with-columns/>
- Gravity Forms: CSS Selectors category — <https://docs.gravityforms.com/category/user-guides/design-and-layout/css-selectors/>
- Gravity Forms: Changes to markup in Gravity Forms 2.5 — <https://docs.gravityforms.com/changes-to-markup-in-gravity-forms-2-5/>

## When to load this reference

Load this file for:

- form theme, Orbital, or Gravity Forms 2.5 theme questions;
- block-editor style settings or copy/paste style JSON;
- CSS Ready Class audits or migration plans;
- field columns, row spans, inline layout, or layout regressions;
- custom CSS class review;
- markup/legacy-markup compatibility checks;
- frontend QA for mobile, responsive, focus, contrast, errors, and confirmations;
- WordPress block theme or design-system handoff notes related to form presentation.

## Safe defaults

- Prefer Form Editor layout controls and Gravity Forms block style settings over legacy Ready Classes for new work.
- Preserve existing live form styling until the current theme, Gravity Forms version, markup mode, embed method, and page context are understood.
- Treat global default theme changes as production-impacting because they can affect many forms.
- Treat per-block style changes as lower risk than global changes, but still validate on the actual page where the form is embedded.
- Use custom CSS classes only when native layout/style controls cannot achieve the result or when a project design system requires reusable class hooks.
- Do not invent CSS selectors. Use official selector docs or inspect actual rendered markup.
- Do not recommend disabling labels or hiding required indicators for visual preference.

## Gravity Forms theme/style model

Gravity Forms themes were introduced in 2.7. The Orbital theme can be applied globally or per form embed through the Gravity Forms block or shortcode. Existing installations may remain on the Gravity Forms 2.5 theme unless changed, while newer installations may apply Orbital globally depending on install history and version.

Before recommending theme/style changes, capture:

- Gravity Forms version;
- current global default form theme if visible;
- form-level embed method: block, shortcode, classic editor, theme hook, template code;
- current block theme/style settings if the form is embedded with the block;
- shortcode `theme` and `styles` parameters if shortcode is used;
- custom CSS class names at form and field level;
- legacy markup state if visible;
- page/template context and theme/CSS overrides.

## Global versus local style decisions

| Scope | Risk | Use when | Guardrail |
|---|---:|---|---|
| Global default form theme | High | A site-wide design refresh has been approved | Inventory affected forms first and test representative form types. |
| Per-block Form Styles | Medium | One embedded form needs styling within the block editor | Validate page preview and live frontend; export/copy style JSON if useful. |
| Shortcode `theme`/`styles` | Medium | Legacy content uses shortcodes but needs modern theme settings | Validate shortcode parameters and cache/rendering behaviour. |
| Form/field custom CSS classes | Medium | A reusable project class or theme stylesheet target is needed | Use stable class naming; avoid brittle generated IDs where possible. |
| Theme CSS edits | High | Native controls cannot achieve the design | Route to WordPress/theme workflow unless the connector safely supports style edits. |

## Ready Classes and layout migration

Gravity Forms Ready Classes are legacy layout helpers. Many layout classes are deprecated in favour of Form Editor columns introduced in Gravity Forms 2.5, and Gravity Forms documentation warns that legacy markup support is planned for removal in Gravity Forms 4.0.

When auditing forms with classes such as `gf_left_half`, `gf_right_half`, `gf_left_third`, `gf_middle_third`, `gf_right_third`, quarter classes, or `gf_inline`:

1. Record the current class and field order.
2. Check whether the form is using legacy markup or modern markup.
3. Prefer Form Editor columns/row spans where available.
4. Preserve the visual intent in a migration plan rather than deleting classes casually.
5. Test desktop, tablet, mobile, validation errors, conditional logic branches, and confirmation state.

## Layout controls and field ordering

Before changing field layout:

- Confirm whether the fields are adjacent and whether conditional logic can hide one of a row pair/group.
- Avoid multi-column layouts for very long labels, long consent text, address-heavy sections, or high-friction mobile flows.
- Keep required/error states legible when fields wrap on smaller screens.
- Test multi-page forms after layout changes; page breaks and progress indicators can change perceived flow.
- Do not use layout-only classes to hide fields containing meaningful content. Use field visibility and conditional logic intentionally.

## CSS selector safety

Use selector tiers:

1. **Preferred:** form/field custom classes that LightSpeed controls.
2. **Acceptable:** documented Gravity Forms selectors for form components or field types.
3. **Use with caution:** generated form IDs or input IDs when targeting a single form and documented in the handoff.
4. **Avoid:** fragile deep selectors, broad `.gform_wrapper input` overrides, `!important` without justification, CSS that hides labels/errors/required indicators, and CSS that changes checkbox/radio semantics.

## Markup and version risk

Gravity Forms 2.5 introduced markup changes including field wrappers moving from list items to `div` or `fieldset`, `legend` use for some multi-input field labels, list-field accessibility changes, and deferred scripts. Existing forms may retain legacy markup. This means selector and layout advice must be version-aware.

Treat these as approval-sensitive:

- disabling legacy markup on existing production forms;
- changing global default theme from 2.5 to Orbital;
- replacing Ready Classes across many forms;
- adding broad CSS that affects all forms;
- moving production payment, CAPTCHA, or multi-page forms to a new visual system.

## Frontend validation checklist

For visual/style changes, validate:

- form loads on the intended live/staging page;
- labels, descriptions, required markers, placeholders, errors, and confirmations remain visible;
- keyboard focus is visible and follows a logical order;
- submit button styles and disabled/loading states are legible;
- conditional branches do not leave broken rows or orphan labels;
- mobile layout does not create cramped columns;
- AJAX/non-AJAX confirmation behaviour is acceptable;
- CAPTCHA/spam widget is visible and not clipped;
- payment/total fields remain clear if present;
- no console errors caused by style/script interactions;
- block-editor preview differences are documented if preview and frontend differ.

## Output guidance

Use `templates/frontend-style-audit.md` for existing form presentation audits.
Use `templates/layout-regression-check.md` when a change has been made or planned and needs page/device validation.
