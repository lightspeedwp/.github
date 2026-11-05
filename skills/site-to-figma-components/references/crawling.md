# Crawling the live site

## Choosing pages

Pick pages that between them show every template the rebuild needs, and two of each repeated type so patterns can be told from one-offs:

- the home page
- two singles of each custom post type (tours, destinations, accommodation)
- each archive and taxonomy page, the blog index and two posts
- two plain pages, such as About and Contact
- a search results URL (`/?s=word`) and a missing URL for the 404 template

Take URLs from the sitemap (`/sitemap_index.xml` or `/wp-sitemap.xml`). Quote the page list in the shell, because `?` is a glob character in zsh.

Use the **live** site. Avoid account, cart, checkout and admin pages; the crawler refuses common ones. The default limit is 15 pages (`--max-pages`).

## What is recorded

At each viewport (390px and 1440px), after fixed overlays such as cookie banners and chat widgets are hidden:

| Hint | Found as |
| --- | --- |
| `header`, `footer` | `<header>`, `<footer>` or ids and classes such as `masthead`, `footer-widgets` and `colophon`, full width and outside `main`. A footer can have several pieces |
| `sidebar` | `#secondary`, `.sidebar` or an `<aside>` of widgets, narrower than 45% of the page |
| `section` | The stacked children of `main` (through single wrappers), at least 60% of the content column wide, plus full-width bands outside `main` such as page banners |
| `button`, `input`, `link`, `nav-item` | Buttons and links styled as buttons; text inputs and selects; links in running text; links in navigation |
| `card` | Repeated siblings with an image, a heading and a link |
| `badge`, `breadcrumbs`, `pagination`, `accordion`, `tabs`, `slider`, `form` | Small labelled pills; ARIA labels, roles and common class names; `<details>`; `<form>` |

For each one it keeps a unique selector, a label (`tag#id.class`), the region it sits in, its box, a **shape signature** (the tag tree to depth 3, with repeats collapsed: `ul(li*)`), the number of columns its children form, computed styles, and real content: up to three headings, button labels and images.

## States

- **From CSS:** same-origin `:hover`, `:focus`, `:focus-visible`, `:active` and `:disabled` rules whose selector names a class, id or attribute. Bare element rules such as `a:hover` are ignored.
- **In the browser:** one example of each distinct interactive element is hovered and focused (`--states`, default 30 per page), and what changed replaces the CSS guess.
- **From markup:** `disabled`, `aria-disabled`, `open` and `aria-expanded="true"`.

Nothing is clicked or typed, so open menus, modals and submitted form states are not captured. Note them for the reviewer if the design needs them.

## Redirects and failures

Each capture records its final URL. Pages that redirect to a page already crawled are left out and listed in the report. TSP redirects its tour, accommodation and review archives to the home page, for example. A page that times out is skipped, listed in the report and in the command output, and the crawl continues.

## Screenshots

`--shots` saves a full-page screenshot per page and viewport. After proposing, `--shoot inventory.json` saves one element screenshot per item (`<item-id>-1440.png`), which the report embeds.

## Politeness

One page at a time with a 1.5 second pause (`--delay`), only on the `--url` origin. Puppeteer downloads its browser on first install; if the launch fails, run `npx puppeteer browsers install chrome`.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
