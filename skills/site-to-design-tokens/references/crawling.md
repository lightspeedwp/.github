# Crawling the live site

## Choosing pages

Pick 5 to 10 pages that between them show every template and component the rebuild must match:

- the home page
- a listing or archive (tours, products, posts)
- a single item
- a long text page, for body type and in-text links
- the contact page, for form inputs
- store, booking or enquiry pages that are public

Avoid account, cart, checkout and admin pages. One page gives a useful first pass, but values that appear only once are easy to over-weight.

## What is recorded

At each viewport (390px and 1440px by default) the crawler reads computed styles, so it sees the values the browser actually uses, including those set by page builders and inline styles. Each element gets a role:

| Role                    | Elements                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `h1` to `h6`            | Headings                                                                                                  |
| `body`                  | Paragraphs, list items, captions, table cells and labels with their own text                              |
| `link`                  | Links inside running text                                                                                 |
| `nav`                   | Other links, such as menus and footers                                                                    |
| `button`                | Buttons, submit inputs, and links styled as buttons (a fill or border plus padding)                       |
| `input`                 | Text inputs, selects and text areas                                                                       |
| `section` and `surface` | Elements with a background (sections are at least half the viewport wide), and padded or centred wrappers |

For each element it keeps the text colour, background, border colour, font family, size, weight and line height, padding, bottom margin, gap, radius, shadow, and centred container width. It also records the widths in the site's same-origin `@media` rules. A DOM path key pairs the same element across the two viewports, which gives the mobile (Min) value for each desktop (Max) value.

## Politeness and limits

- One page at a time, with a 1.5 second pause between requests (`--delay`), and at most 10 pages (`--max-pages`).
- Only pages on the `--url` origin.
- Cookie banners and pop-ups are measured like any other element. If one dominates the results, list the affected values for the reviewer.
- Cross-origin stylesheets can't be read, so breakpoints from them are missed and the defaults (376px, 768px and 1240px) fill the gaps.
- Puppeteer downloads its own browser the first time it's installed. If the launch fails, run `npx puppeteer browsers install chrome`.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
