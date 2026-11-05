# Reviewing the inventory

`inventory.md` is written for the person who approves what gets built. Walk through it in this order.

## Summary

Items per kind, how many are one-offs, and how many styled values bind to a token.

## Decisions for the reviewer

Each line needs an answer before approval:

| Line | Means | Answer with |
| --- | --- | --- |
| **Merge?** | Items that look alike | `merge` the pairs to combine, or leave them separate |
| **Redirected** | A requested page redirected to one already crawled | Choose another page of that type, or accept |
| **Not captured** | A page timed out | Re-run the crawl for it |
| **One-off** | Found once | `cut` it, or `promote` it to keep it |
| **No token** | A live value with no matching variable, with a proposal (new font family, ramp fit, new ramp step or `custom/*` variable) | Approve the proposal or give another; nothing is added without approval |
| **Primitive only** | A colour that only matches a primitive | Point a semantic role at it, or approve a new semantic token |
| **Template not crawled** | A common template with no page in the crawl | Add a page and re-crawl, or confirm it isn't needed |

## Tables

- **Template parts:** how many pages each appears on, its pieces and its variant properties.
- **Components:** Figma name, count, pages, variant properties (including `State`) and WordPress target.
- **Patterns:** name with its first heading, count, source pages, whether the 390px layout changes, and WordPress target.
- **Templates:** each template file with its pages, its frames (1440, and 390 where the layout changes) and its composition.
- **Values with no token:** every value the build can't bind yet, with the items that use it.

Screenshots sit beside each item when `--shoot` has run.

## Recording decisions

Write `decisions.json` and re-run `propose-inventory.ts` with `--decisions decisions.json`. Ids come from the report.

```json
{
  "rename": { "pattern:hero-2": "Tour Summary", "component:card": "Post Card" },
  "merge": [["pattern:media-and-text", "pattern:media-and-text-2"]],
  "cut": ["component:tabs", "pattern:content-section-9"],
  "promote": ["pattern:hero"],
  "build": ["template:front-page", "template:single-tour", "component:button"],
  "approve": true
}
```

Add `"build"` with the templates (and any extra items) to build in Figma. The reviewer must approve this set before any import; templates bring their parts and patterns, and the report lists the resulting **Build scope**.

Merges run first, then cuts, promotions, renames and the build scope. A merged item takes the other's pages, examples and variants, and templates point to it. A cut item stays in the inventory with `status: "cut"`; templates show it as a local section. Set `"approve": true` only when the reviewer has said so. The manifest writer refuses an unapproved inventory.

Post the approved report on the project's Linear issue.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
