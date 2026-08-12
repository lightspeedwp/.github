---
name: wordpress-pagespeed-diagnosis
description: diagnose wordpress-specific causes behind pagespeed, lighthouse, core web vitals, or web performance audit findings. use when the user provides pagespeed results, lighthouse diagnostics, devtools traces, waterfall notes, asset urls, screenshots, audit exports, or asks why a wordpress site is slow. focus on plugin and theme asset bloat, unused css, unused javascript, render-blocking assets, fonts, images, and third-party scripts. recommend practical wordpress remediation paths while separating observed evidence from likely causes and avoiding universal claims.
---

# WordPress PageSpeed Diagnosis

## Purpose

Diagnose WordPress-specific performance causes during a PageSpeed, Lighthouse, Core Web Vitals, or waterfall-based audit. Use this skill to add a WordPress layer to the audit, not to replace general performance analysis.

## When to Use the Skill

Use this skill when the task involves a WordPress site and any of these inputs are available:

- PageSpeed Insights, Lighthouse, WebPageTest, GTmetrix, Chrome DevTools, or waterfall evidence.
- Asset URLs from `/wp-content/plugins/`, `/wp-content/themes/`, `/wp-includes/`, uploads, CDN paths, or third-party domains.
- Diagnostics about unused CSS, unused JavaScript, render-blocking resources, fonts, images, LCP, CLS, INP, TBT, TTFB, or third-party impact.
- A user asking which WordPress plugin, theme, block, page builder, WooCommerce feature, tracking script, or content pattern is likely causing a performance issue.

Do not use this skill for generic non-WordPress performance advice unless the user asks for a WordPress-specific interpretation.

## Core Workflow

1. Identify the measured performance issue from the evidence provided.
2. Separate the evidence into asset, page, runtime, image, font, third-party, and server categories.
3. Map evidence to likely WordPress sources only when the evidence supports that mapping.
4. State confidence clearly: high, medium, or low.
5. Recommend a practical WordPress remediation path with a validation step.
6. Avoid claiming that a WordPress cause is universal, guaranteed, or proven unless the audit evidence directly proves it.

## Common WordPress Performance Patterns

### Plugin and Theme Asset Bloat

Look for:

- Many CSS or JS files loaded from `/wp-content/plugins/` or `/wp-content/themes/`.
- Assets from plugins that do not appear to be needed on the audited page.
- Large theme bundles loaded across every page.
- Page builder, slider, form, ecommerce, analytics, social sharing, booking, or chatbot assets on pages where the related feature is absent.

Possible WordPress causes:

- Plugins enqueue assets globally instead of conditionally.
- A theme loads one large compiled bundle for all templates.
- A block, shortcode, widget, or pattern triggers assets site-wide.
- WooCommerce or extension assets load outside shop, product, cart, checkout, or account contexts.

Recommended paths:

- Audit plugin necessity and remove or replace low-value plugins.
- Load assets conditionally by template, post type, route, block presence, or feature use.
- Split theme bundles into smaller route-specific or block-specific files.
- Dequeue plugin assets carefully only after confirming the page does not need them.

### Unused CSS

Look for:

- Lighthouse unused CSS diagnostics.
- Chrome DevTools Coverage showing large unused percentages on the specific route.
- Large CSS files from theme, page builder, block library, forms, sliders, or ecommerce plugins.
- Global style sheets that support many components not present on the page.

Possible WordPress causes:

- Block library, theme, plugin, or page builder styles loading globally.
- Pattern or component styles bundled into one site-wide CSS file.
- Legacy CSS kept after a redesign, migration, or page builder cleanup.

Recommended paths:

- Prefer conditional loading and smaller CSS bundles over blind purging.
- Remove legacy CSS after checking template and block usage.
- Consider critical CSS for above-the-fold content when render-blocking CSS affects LCP.
- Use Chrome DevTools Coverage when the audit needs route-specific proof of unused bytes.

### Unused JavaScript

Look for:

- Lighthouse unused JavaScript diagnostics.
- Long main-thread tasks, high TBT, or INP concerns tied to specific scripts.
- Plugin scripts loaded from features not visible on the page.
- Page builder, slider, ecommerce, tracking, chat, map, video, or social embed scripts.

Possible WordPress causes:

- Plugins loading front-end scripts globally.
- Theme JavaScript bundling every component into one file.
- jQuery-dependent plugins loading jQuery, jQuery Migrate, or extension scripts unnecessarily.
- Third-party widgets injected by plugins or header/footer code managers.

Recommended paths:

- Defer or delay non-critical JavaScript when it does not affect first interaction or above-the-fold rendering.
- Split theme scripts by interaction or template.
- Remove or replace plugin features that create heavy JavaScript for low business value.
- Validate checkout, forms, menus, search, galleries, and consent flows after unloading or delaying scripts.

### Render-Blocking Assets

Look for:

- CSS or synchronous JavaScript in the document head.
- Google Fonts or external font stylesheets blocking render.
- Plugin CSS files blocking first paint.
- jQuery or plugin scripts loaded before visible content without a clear need.

Possible WordPress causes:

- WordPress, theme, or plugins enqueuing assets in the head by default.
- A theme relying on synchronous scripts for navigation, sliders, modals, or layout behaviour.
- External font stylesheets loaded before critical CSS.

Recommended paths:

- Keep critical CSS small and load non-critical CSS later where safe.
- Add `defer` or `async` only when dependency order and functionality allow it.
- Move non-critical plugin assets later in the page lifecycle.
- Preload only truly critical assets, such as the LCP image or primary above-the-fold font file.

### Fonts

Look for:

- Multiple font families, many weights, icon fonts, or duplicate font providers.
- Google Fonts CSS requests, font files from theme assets, or plugin-loaded icon libraries.
- Font requests contributing to render delay, layout shift, or LCP delay.

Possible WordPress causes:

- Theme typography settings loading more weights than used.
- Page builders, design system plugins, icon plugins, or form plugins adding extra font files.
- Duplicate local and remote font loading after a theme migration.

Recommended paths:

- Reduce font families, weights, and styles to the minimum needed.
- Prefer local hosting where it improves control and privacy requirements.
- Use `font-display: swap` where appropriate.
- Preload only the primary above-the-fold font files used by visible text.
- Replace heavy icon fonts with inline SVGs or a smaller icon set where practical.

### Images

Look for:

- LCP image too large, lazy-loaded, missing dimensions, or not preloaded when needed.
- Oversized images served from `/wp-content/uploads/`.
- Missing modern formats, poor compression, or incorrect thumbnail sizes.
- Background images that bypass responsive image handling.

Possible WordPress causes:

- Original uploaded images used instead of generated image sizes.
- Theme templates not requesting appropriate image sizes.
- CSS background images used for hero images without responsive variants.
- Image optimisation plugin not configured or not processing all media.

Recommended paths:

- Serve correctly sized thumbnails through WordPress image functions where possible.
- Compress and convert images to modern formats when supported by the stack.
- Do not lazy-load the primary LCP image.
- Set explicit width and height to reduce layout shift.
- Preload the LCP image when it is discoverable late or delayed by CSS or JavaScript.

### Third-Party Scripts

Look for:

- Analytics, tag manager, chat, heatmap, advertising, video, map, review, booking, social, CRM, or consent scripts.
- Third-party domains causing blocking, long tasks, network delays, or duplicate tracking.
- Plugins injecting scripts on every page.

Possible WordPress causes:

- Header/footer script managers or tracking plugins injecting scripts globally.
- Consent tools, marketing plugins, embedded widgets, or page builder embeds loading unnecessary scripts.
- Duplicate tracking added in both a plugin and theme or tag manager.

Recommended paths:

- Confirm business need before removing third-party scripts.
- Load scripts only on pages where the feature is required.
- Delay non-essential scripts until consent, interaction, or after initial render where appropriate.
- Remove duplicate tags and document the source of each tracking script.
- Validate analytics, consent, lead forms, ecommerce events, and chatbot handoff after changes.

## Evidence Rules

Always separate:

- Observed evidence: the metric, diagnostic, URL, file path, waterfall entry, coverage result, or screenshot detail.
- WordPress interpretation: the likely plugin, theme, core, content, media, or third-party source.
- Confidence: how strongly the evidence supports the WordPress interpretation.
- Missing evidence: what would be needed to confirm the cause.

Use high confidence only when the evidence directly names or clearly identifies the source, such as a plugin path, theme path, script handle, third-party domain, coverage result, or waterfall entry.

Use medium confidence when the source is strongly implied but not confirmed, such as a large page-builder bundle on a page with visible builder markup.

Use low confidence when the issue is plausible but not proven, such as assuming a plugin causes unused CSS without asset paths or coverage data.

Do not:

- Blame a plugin, theme, page builder, host, or WordPress core without evidence.
- Treat WordPress-specific explanations as universal facts.
- Invent PageSpeed scores, byte sizes, timings, URLs, script handles, or plugin names.
- Recommend removing a feature before considering business value and validation risk.
- Suggest aggressive unload, delay, or minify changes without naming the functionality that must be retested.

## Remediation Guidance

Prioritise fixes in this order when evidence allows:

1. High-impact, low-risk changes: image sizing/compression, duplicate script removal, font weight reduction, obvious unused feature assets, plugin cleanup.
2. Conditional loading: route, template, post type, block presence, WooCommerce context, or interaction-based loading.
3. Render path improvements: critical CSS, defer non-critical JavaScript, reduce blocking font requests, preload only critical assets.
4. Structural theme or plugin work: bundle splitting, component-level assets, replacing heavy plugins, removing page-builder dependency, refactoring templates.
5. Infrastructure changes: caching, CDN, object cache, PHP or database tuning only when TTFB, backend timing, or server evidence supports it.

For each recommendation, include a validation step. Examples:

- Re-run Lighthouse or PageSpeed on the same URL after the change.
- Check Chrome DevTools Coverage on the same template before and after.
- Inspect the Network waterfall to confirm removed, deferred, or reduced assets.
- Test key user journeys such as menu, search, form submit, cart, checkout, account login, gallery, modal, consent banner, tracking, and chatbot.

## Output Format for WordPress-Specific Findings

Use this structure when producing WordPress-specific findings:

```markdown
## WordPress Performance Diagnosis

### Summary
- Main issue:
- Most likely WordPress source:
- Confidence:
- Highest-value next step:

### Findings

#### 1. [Finding title]
- Evidence observed: [specific metric, diagnostic, URL, file path, coverage result, or waterfall signal]
- WordPress interpretation: [plugin/theme/core/content/media/third-party explanation, phrased as likely unless proven]
- Confidence: [High / Medium / Low]
- Likely source: [plugin, theme, WordPress core, media library, third-party, content/editor pattern, unknown]
- Remediation path: [practical WordPress-specific action]
- Validation step: [how to prove the change worked and did not break key flows]
- Risk/notes: [what to retest or what remains unconfirmed]

### Evidence Gaps
- [missing evidence needed to confirm low-confidence items]

### Recommended Fix Order
1. [quick win]
2. [medium effort]
3. [larger engineering/theme/plugin work]
```

Keep the wording client-safe when the output is for a stakeholder. Use technical wording when the output is for developers.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
