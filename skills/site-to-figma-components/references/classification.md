# Classification, naming and WordPress mapping

`propose-inventory.ts` uses the 1440px captures to cluster and name items, and the 390px captures to decide what changes on mobile.

## Kinds

| Kind | Rule | Figma name |
| --- | --- | --- |
| Template part | `header` or `footer` on at least 60% of pages; a `sidebar` on two or more | `Template Parts/<Name>` |
| Pattern | A section shape found more than once. A shape found once is flagged as a one-off | `Patterns/<Name>` |
| Component | A repeated single element. Families (buttons, inputs, links, navigation and so on) form one set each; cards are grouped by their most distinctive shared class, forms by search or not | `Components/<Group>/<Name>` |
| Template | One per page type, from WordPress body classes: `{post_type}-template-default` gives `single-<type>`, then `post-type-archive-*`, `tax-*`, `page-template-*`, `home`, `blog`, `search`, `error404` | `Templates/<Name>` |

Pages that share a template are grouped. Its composition (parts and patterns, top to bottom) comes from the first page of the group.

## Pattern names

From the section's content, in order: `Section Heading`, `Hero` (first section with media and a heading), `Testimonials`, `Card Grid` (two or more cards inside), `Form Section`, `Gallery`, `Banner`, `Media and Text` (two columns with an image), `Feature Row` (three or more columns), `Call to Action` (buttons in a short section), else `Content Section`. Repeated names get a number. The reviewer renames them.

## Variant properties

Named as in the TSP file. Only properties with more than one value are kept.

| Property | Values | Used for |
| --- | --- | --- |
| `Style` | `Fill`, `Outline`, `Text` (inputs: `Bordered`, `Filled`, `Plain`) | buttons, badges, inputs |
| `Size` | `Small`, `Medium`, `Large`, by height | buttons |
| `Icon`, `Has Text` | `True`, `False` | buttons, badges |
| `Type` | `Text`, `Select`, `Textarea` | inputs |
| `Mode` | `Light`, `Dark`, `Transparent`, `Image` | sections, parts, navigation |
| `Region` | `Header`, `Footer` | navigation items outside the content |
| `Layout` | `A`, `B` … | cards whose inner structure differs |
| `State` | `Default`, `Hover`, `Focus`, `Active`, `Open`, `Disabled` | anything with states |
| `Breakpoint` | `Desktop`, `Mobile` | items whose 390px size or columns differ |

## WordPress targets

| Item | Target |
| --- | --- |
| Button | `core/button`; non-default styles become block styles (`styles/blocks/button/<slug>.json`) |
| Text link | `styles.elements.link` in `theme.json` |
| Navigation item, pagination | `core/navigation-link`, `core/query-pagination` |
| Accordion | `core/details` (or `core/accordion` where available) |
| Badge | block style on `core/post-terms` |
| Search form | `core/search` |
| Card | an `Inserter: false` pattern used inside `core/post-template` |
| Form, input, breadcrumbs, tabs, slider | plugin or custom block; noted for the reviewer |
| Template part | `parts/<slug>.html`, area `header`, `footer` or `uncategorized` |
| Pattern | `patterns/<slug>.php`, slug `<theme>/<slug>`, main block (`core/cover`, `core/query`, `core/media-text` …) |
| Template | `templates/<slug>.html` |

These names are what `figma-to-block-theme` Pattern mode expects.

## Token binding

Every styled value of each variant (fill, text, stroke, font family and size, radius, padding, gap, shadow) is matched against the variables export:

- **Colours:** semantic tokens first. Buttons prefer `action/*`; everything else prefers `text/*`, `surface/*` and `border/*`. A match within a small distance is `exact` or `near`. A colour that only matches a primitive is `primitive`. Prototype collections (`Proto - …`) are ignored.
- **Sizes:** the `Max` mode of the spacing, radius and type size collections, within 2px or 8%.
- **Shadows:** the first layer, against drop shadow effect styles.

Anything `none` or `primitive` is listed in the report with a **proposal** for the reviewer, following the LightSpeed rules:

| Value | Proposal |
| --- | --- |
| A font with no family variable | Fonts always match the live site: add a family variable (`Font-Families/Alternate`, slug `alternate`) |
| A colour | Fit it into a colour ramp (it replaces the nearest step when it fits, as in `site-to-design-tokens`) or match it to the nearest existing colour, then bind the semantic token for its role. Theme `contrast` matches the live text colour |
| A size (radius, spacing, type size) | Add a step to the ramp, in order, with valid naming; renumber slugs if needed (TSP added Radius Huge at `600` and moved Round to `700`) |
| A true one-off | A semantically named custom variable in the semantic collection (`custom/social-twitter`, `custom/scroll-arrow-size`), as `theme.json` `settings.custom` would hold it |

Nothing is added until the reviewer approves. Then add the variables before the build (see [figma-build.md](figma-build.md)).

## Near duplicates and one-offs

Items whose shape signatures share at least 75% of their tokens (50% for items with the same base name) are grouped as look-alikes for the reviewer to merge. Items found once are flagged as one-offs: cut them, or keep them with `promote`.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
