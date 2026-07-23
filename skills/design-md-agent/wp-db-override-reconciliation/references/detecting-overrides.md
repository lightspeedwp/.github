# Detecting a DB override

The Site Editor stores template/part customizations as posts in `wp_posts` with post types `wp_template` / `wp_template_part`, joined to the active theme via the `wp_theme` taxonomy. These **shadow same-slug theme files**.

## Enumerate overrides for the active theme

Get the active theme's `wp_theme` term, then list the customized templates tied to it:

```sql
SELECT p.ID, p.post_name, p.post_type, p.post_status, CHAR_LENGTH(p.post_content) AS len
FROM wp_posts p
JOIN wp_term_relationships tr ON tr.object_id = p.ID
JOIN wp_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
JOIN wp_terms t ON t.term_id = tt.term_id
WHERE p.post_type IN ('wp_template','wp_template_part')
  AND tt.taxonomy = 'wp_theme'
  AND t.name = '<theme-slug>'         -- e.g. kwv-theme-2026
ORDER BY p.post_type, p.post_name;
```

Any row here is a template whose **`post_content` renders instead of the theme file** of the same `post_name`.

> Example (labelled): a single-product page rendered from `wp_template` post **182630** (`post_name = single-product`, `wp_theme` term **247**), shadowing `templates/single-product.html`. Editing the theme file changed nothing on the front end until the DB post was removed.

## The home view is special

The front page may be driven by a `front-page` **template**, not a static page. Check:

```sql
SELECT option_name, option_value FROM wp_options
WHERE option_name IN ('show_on_front','page_on_front','page_for_posts');
```

- `show_on_front = posts` and `page_on_front = 0` → the `front-page` **template** drives home; look for a `front-page` `wp_template` override.
- `show_on_front = page` → the assigned page's own content/template drives home; the page row itself may be customized.

> Example (labelled): a homepage rendered from `wp_template` `front-page` (post 254) with the entire hero + transparent-header markup **baked inline** — it did **not** use `<!-- wp:pattern {"slug":"kwv/home-hero"} /-->`, so editing `patterns/home-hero.php` was a no-op.

## Inline markup vs pattern reference — check which

Read the override's content and look at how it's composed:

```php
wp eval 'echo get_post( <id> )->post_content;'
```

- If you see the **full block markup baked in**, the referenced pattern/part files are irrelevant to this page — edit the DB or reset it.
- If you see a **`wp:pattern` / `wp:template-part` reference**, the file *is* in play (but see `wp-pattern-runtime-pitfalls` for cases where a referenced pattern still renders nothing).

## Individually-customized pages

A single page edited in the editor stores its markup in its own `wp_posts` row (`post_type = page`); there's no separate template post. Confirm by reading the page's `post_content` and its `_wp_page_template` meta.
