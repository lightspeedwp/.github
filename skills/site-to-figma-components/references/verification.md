# Verifying the build

## Compare with the live site

For each template, at 1440px and at 390px where it has a mobile frame:

1. Take one screenshot of the Figma frame (`get_screenshot`).
2. Open the crawl's full-page screenshot of a source page (`shots/<page>-1440.png`, `-390.png`).
3. Compare section by section, and list every difference in a table: section, what differs, why (out of scope, no token, content), and whether to fix now.

Fix defects with targeted `use_figma` edits: clipped or overlapping text, wrong variants, placeholder text, missing images, headings that don't wrap at 390px. Then take one more screenshot. Differences that are out of scope or need a decision go in the list for the reviewer.

## Design system audit

Run `audit-design-system` on the build page, or this read-only scan through `use_figma` across the build sections. Skip nodes inside instances (their main components are checked at the source) and the logo artwork.

| Check | Clean when |
| --- | --- |
| Solid fills and strokes | Each has `boundVariables.color` (ignore hidden paints, or remove them) |
| Auto Layout padding and gaps | Each non-zero value has a bound variable |
| Corner radius | Each non-zero radius is bound (component set containers set to 0) |
| Text | Every text node has a `textStyleId`; no mixed styles |
| Effects | Every effect uses an effect style |
| Detached instances | No frame carries a component's name; every template instance has a `mainComponent` |
| Templates | Every direct child of a template frame is an instance |

Fix findings with `fix-design-system-finding`, or in a small `use_figma` pass, and re-run the scan until every count is zero. Report anything that comes from the file's existing components (outside the build) rather than overriding it locally.

## Report

Post the differences table and the audit counts on the project's Linear issue with `manifest.md`.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
