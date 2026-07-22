# WordPress Audit Checklist

## Purpose

Use this checklist when the audited site appears to be WordPress.

## Theme and Plugin Asset Checks

- Identify plugins or theme files likely enqueueing unused CSS
- Identify plugins or theme files likely enqueueing unused JavaScript
- Check whether assets load globally when only needed on some pages
- Look for slider, form, chat, analytics, popup, and page-builder assets

## Media and Rendering Checks

- Review hero images and background media for size and format issues
- Check whether fonts or icon libraries are blocking rendering
- Check whether critical CSS is delayed by theme or plugin bundles

## Third-Party Script Checks

- Review chat widgets, tag managers, heatmaps, A/B tools, and embeds
- Call out non-critical scripts that could be delayed or conditionally loaded

## Theme and Builder Checks

- Consider heavy builders, theme frameworks, and shortcode systems as likely sources of CSS and JS bloat
- Note when template-level cleanup may be more effective than page-level cleanup

## Recommended Tools

- Chrome DevTools coverage for unused CSS and JS
- PageSpeed Insights or Lighthouse evidence when available
- Theme or plugin-specific asset loading controls when relevant

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
