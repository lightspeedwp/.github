# Discover and verify the product font

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

This covers both ends of getting the font right: **discovering** which font the product uses (before you build) and **verifying** the rendered output uses it (during validation).

## Discover the product font

The product renders text in a specific typeface. Identify **which font the product uses** from the source before writing any `use_figma` script. Do **not** default to Inter.

`figma.listAvailableFontsAsync()` answers "is font X available in this file?". It does **not** tell you what font the product uses. Use it only *after* you know the family, to resolve the exact style strings.

Search the source for the font, in priority order. The strongest signals are usually CSS and component files, not a standalone token file:

1. **CSS / styling**: `font-family` declarations and custom properties (`--font-*`, `--font-family-*`) in CSS/SCSS, Tailwind config (`theme.fontFamily`), `styled-components`/Emotion themes, global stylesheets.
2. **Component files**: `fontFamily` props/styles on text components, design-token modules, theme objects (`theme.typography.fontFamily`), and platform defaults (e.g. iOS uses SF Pro, Android uses Roboto).
3. **Token JSON**: a `fontFamily` entry in a design-tokens file. This is often **absent**, so do not conclude "no font is specified" just because there is no token JSON.

Inter is a tempting fallback because it is reliably available with predictable styles (Regular/Medium/Semi Bold), but using it when the product uses something else (e.g. SF Pro) produces a wrong-but-runnable result that is easy to miss. Only use Inter if the source genuinely specifies no font.

Once you know the family, resolve it against `listAvailableFontsAsync()`. Real font names are often messy and will not match a clean guess. The product's "SF Pro", for example, can surface in Figma as family `"SF Pro"` with styles like `"Compressed Medium"`, not a tidy `"SF Pro Text"` / `"Regular"`. Match the actual available family plus the style closest to the product's weight, rather than silently substituting Inter because its names are cleaner.

## Verify the font after building

After building, read back the actual font on every text node and compare it against the product's expected families. The script runs without error when the font is wrong, so a mismatch is invisible at a glance — assert it explicitly and treat any mismatch as a failed validation.

```js
// Verify rendered text uses the product font(s) discovered above.
figma.skipInvisibleInstanceChildren = true;
const wrapper = await figma.getNodeByIdAsync("WRAPPER_ID");
// The product font(s) — NOT a default like "Inter". Include every family the
// product legitimately uses (e.g. a primary plus a mono for code).
const EXPECTED_FAMILIES = new Set(["SF Pro", "SF Mono"]);

// Text governed by the design system — inside an instance, or carrying a
// published text style — sets its own family. Flag mismatches there as a
// library gap; don't override them.
const inInstance = (node) => {
  for (let p = node.parent; p; p = p.parent) if (p.type === "INSTANCE") return true;
  return false;
};

const offenders = []; // free-standing text you built — fix these
const dsGaps = [];     // design-system-governed text (instance or text style) — flag, don't override
for (const node of wrapper.findAll(n => n.type === "TEXT")) {
  for (const seg of node.getStyledTextSegments(["fontName", "textStyleId"])) {
    if (EXPECTED_FAMILIES.has(seg.fontName.family)) continue;
    const governed = seg.textStyleId !== "" || inInstance(node);
    (governed ? dsGaps : offenders)
      .push({ id: node.id, name: node.name, family: seg.fontName.family });
  }
}
return { expected: [...EXPECTED_FAMILIES], offenders, dsGaps };
```

If `offenders` is non-empty, free-standing text you built is in the wrong font. Fix those nodes (load the correct family/style, then set `fontName` per the canonical text-edit recipe in [figma-use](../../figma-use/SKILL.md)) before finishing. `dsGaps` is handled differently: text inside a design-system **instance**, or carrying a published **text style**, is governed by the library and may legitimately use a different family (e.g. a mono style for code), so flag those as a design-system gap rather than forcing an override onto them.

If you have a source reference (the running web app, a design mock, or the `generate_figma_design` capture), also compare rendered screenshots:

1. Screenshot the built view and compare typography side by side: letterforms, weight, and metrics.
2. Fix any issues. A visual diff catches subtle substitutions a pass/fail family check misses, such as a near-miss style ("Compressed Medium" vs the intended weight) within the right family.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
