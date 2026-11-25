---
name: schema-test-urls
description: Build a list of URLs to test a WordPress site's structured data against, with one page per public post type, post type archive, taxonomy in use, key page (home, about, contact, privacy, terms), author archive and search results. Use before a schema audit, or when someone asks which pages to test schema on. Reads the WordPress REST API; never changes the site.
---

# Schema Test URLs

Pick the smallest set of URLs that exercises every kind of page a WordPress
site renders, so a structured data audit covers each template once.

## When to use this skill

- Before validating a site's schema, when the user has not given a URL list.
- When someone asks "which pages should I test the schema on?".
- After a new post type, taxonomy or template is added, to refresh the list.

## Procedure

### 1. Confirm the site

Ask for the site's home URL if it is not known, and which environment it is
(local, development, staging or live). Local sites with self-signed
certificates (`*.local`, `*.test`, `localhost`) work without extra steps.

### 2. Run discovery

In a clone of `lightspeedwp/.github` (Node.js 20+):

```bash
node agents/wp-schema-audit-agent/lib/schema-tool.cjs urls <site-url>
```

The tool reads the REST API (`/wp-json/`, or `?rest_route=` when pretty
permalinks are off) and returns a table of URLs, plus the types and
taxonomies it skipped and why. Use `--list` for a plain list to save as a
file, or `--json` for the full result.

| Kind      | How it is chosen                                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `home`    | The site URL.                                                                                                                          |
| `single`  | The newest item of each public post type, kept only if it answers HTTP 200. Internal types (menus, templates, blocks, fonts) are left out. |
| `archive` | Each post type's archive, whether WordPress redirects `?post_type=<type>` to it or renders it in place.                              |
| `term`    | The most-used term of each taxonomy that has terms in use.                                                                             |
| `page`    | Pages whose slug marks them as key pages: about, contact, privacy, terms, FAQ, team, blog, news, careers, booking, enquiry.          |
| `author`  | The first author archive, when the users endpoint is public.                                                                           |
| `search`  | A search results page.                                                                                                                 |

### 3. Review the list with the user

- **Notes such as `redirects to …`**: a single that redirects (for example a
  special sent to its archive) has no schema of its own. Point this out; it
  usually comes from a plugin setting, and it decides where that type's
  schema has to live.
- **Skipped items**: `HTTP 404` usually means a post type that is not public
  (pop-ups, presets); `no published items` and `no terms in use` mean there is
  nothing to test yet. Ask whether test content should be published first.
- **Key pages**: ask whether any other page matters, such as a landing page
  with its own template, and add it.
- **Variants worth adding by hand**: a second item of a type when items differ
  (for example a special with and without a linked tour), a parent and a
  child term in a hierarchical taxonomy, and the posts page.

Save the agreed list, one URL per line (`#` comments allowed), for the
[`schema-markup-validation`](../schema-markup-validation/SKILL.md) skill.

## Without the tool

Read the site's sitemap index (`/sitemap_index.xml` for Yoast SEO,
`/wp-sitemap.xml` for core) and take the first entry of each sub-sitemap.
The first entry of a post type sitemap is often its archive. Then add the
key pages and a search URL by hand.

## Rules

- GET requests only; never log in, and never fetch more than one sample per
  type or taxonomy without asking.
- If the REST API is blocked, say so and fall back to the sitemap; do not try
  to work around the block.

---

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
