# Measuring live and local

## The selectors file

One JSON object. Each key is a name you choose; the value is a CSS selector, or a live and a local selector when the old and new markup differ. The diff matches live and local by name.

```json
{
  "header logo": "header .site-branding img",
  "menu link": { "live": ".menu-item > a", "local": ".wp-block-navigation-item__content" },
  "hero heading": { "live": ".hero h1", "local": ".wp-block-cover h1" },
  "card title": {
    "live": ".lsx-to-widget-item-wrap h3",
    "local": ".wp-block-post-template .wp-block-post-title"
  },
  "footer": "footer"
}
```

- The first element that matches is measured; the output records how many matched, so check that `count` is what you expect.
- Name the element, not the selector (`card title`, not `h3`), so the report reads well in a pull request.
- A name with only a `live` selector is skipped on the local side, and the reverse. Add the other selector once it exists.
- For quick checks, pass `--selector <css>` one or more times instead of a file.

## Options

| Option     | Default               | Notes                                                                   |
| ---------- | --------------------- | ----------------------------------------------------------------------- |
| `--url`    | required              | One page. Run once per page. `wp-admin` and `wp-login.php` are refused. |
| `--side`   | `live`                | `live` or `local`: picks the selector and names the screenshots.        |
| `--widths` | `390,768,1440`        | Mobile, tablet and desktop. Add a width where live changes layout.      |
| `--states` | `default,hover,focus` | Hover and focus entries hold only the properties that changed.          |
| `--props`  | the default list      | A comma-separated list of computed properties, to narrow the output.    |
| `--shots`  | none                  | Folder for full-page screenshots, named `<side>-<page>-<width>.png`.    |
| `--delay`  | `1500`                | Pause in ms between widths, to be gentle with live.                     |

The default properties cover type, colour, spacing (longhands), borders, radius, shadow, outline (focus rings), layout (display, flex, grid columns, max width), images (aspect ratio, object fit), opacity and transition duration.

## What the scripts can't see

Record these by hand, from the screenshots or the page:

- Image crops and focal points, and which image size live serves.
- Link targets, `rel` values and which links open new tabs.
- Sticky headers, scroll-triggered animation, carousels and anything that changes after load.
- Content that only appears at one width (a mobile menu, a hidden column).
- Hover and focus on elements that are covered or off-screen when measured (the script skips them).

## Reading the reports

- `tokens.md` (map-to-tokens) lists live values by element, width and state with their token. "Needs a decision" comes first.
- Fluid tokens are evaluated at each width, so the same token can match 18px at 390 and 20px at 1440.
- Delta is the token minus the live value: `-2px` means the token is 2px smaller than live.
- Border and outline colours are skipped when their width is 0 or style is `none`.
- `diff.md` (diff-measurements) lists every live and local difference. Lengths within `--tolerance` px (default 1) and colours within a distance of 2 count as equal; box sizes also allow 2%.
