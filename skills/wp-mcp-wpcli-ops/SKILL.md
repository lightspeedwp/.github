---
name: wp-mcp-wpcli-ops
description: Operate a live or local WordPress site through a WordPress MCP server plus WP-CLI safely. Use when creating/updating content, deploying theme or plugin files, running data migrations, or debugging "the write didn't take" over an MCP server that runs inside WordPress. Covers the MCP-vs-WP-CLI division of labour, multi-file plugin deploy ordering (fatal-lockout avoidance), MCP write-response quirks, persistent-object-cache eviction, and verification discipline.
compatibility: Targets WordPress 6.9+ (PHP 7.2.24+). Requires a WordPress MCP server and/or WP-CLI access to the target site. Some guidance assumes a persistent object cache (Redis/Memcached) and/or a page cache (e.g. WP Rocket); re-probe per site.
---

# WP MCP + WP-CLI Ops

## Overview

WordPress MCP servers (AI-Engine, `wp mcp-adapter serve`, Abilities-API bridges) are convenient but they are **not a general-purpose admin API**. The one fact that explains almost every surprise: **an MCP server exposed by a WordPress plugin runs *inside* a normal WordPress request.** So it inherits WordPress's capability model, its plugin-load order, and its caching — and a fatal in any active plugin takes the MCP endpoint down with the site. This skill is the operating playbook for writing content, deploying files, and migrating data over MCP + WP-CLI without locking yourself out or trusting a write that didn't land.

Written to be portable across WordPress projects. Concrete project details appear as **examples** (labelled); re-probe each site before relying on any specific tool name, path, or limit.

## When to use

- Creating/updating posts, pages, CPT items, meta, or featured images on a site you reach only through an MCP server and/or WP-CLI.
- Deploying theme or plugin file changes over an MCP file-write tool (`wp_theme_put_file`, `wp_plugin_put_file`, or equivalents).
- Running content/term/product data migrations whose results don't show up.
- Debugging "the MCP said it failed / the badge is stale / the page didn't change."

## Inputs required

- Access to the target site's **MCP server** (run its discover/list-tools call first — never assume the tool surface) and/or **WP-CLI**.
- Knowledge of the site's **caching**: persistent object cache? page cache? (If unknown, assume yes and verify against the DB.)
- For deploys: an **out-of-band recovery path** (SFTP / host file manager) in case a bad push fatals the site.

## Procedure

1. **Probe the surface.** Call the MCP server's discover/list-tools first. Confirm which content types, meta, and file operations it actually exposes.
2. **Route each operation** using the division-of-labour table below — don't force an MCP ability that lacks the field you need; drop to WP-CLI.
3. **For multi-file deploys, order by dependency** — required files first, the file that `require`s them last. See `references/deploy-ordering.md`.
4. **After every write, verify against the DB** (see Verification) — trust neither the success string nor the error string.
5. **For cache-sensitive changes, bust the right cache** and re-check on the actual worker/front end. See `references/caching.md`.

### Division of labour — MCP vs WP-CLI vs raw SQL

| Operation | Prefer | Why / caveat |
|---|---|---|
| Create/update **blog posts, pages** (title, content, status, slug, parent, excerpt) | MCP content abilities | Usually the happy path. |
| Create **CPT items**, set **post meta**, set **featured image**, assign a **page template** (`_wp_page_template`) | **WP-CLI** (`wp eval` / `wp eval-file`) | MCP content abilities commonly lack `post_type`, meta, thumbnail, and template fields. |
| Deploy **theme/plugin files** | MCP file tools *or* SFTP | Order matters and a bad push can brick the endpoint — see `references/deploy-ordering.md`. |
| **Bulk data migration** (terms, product↔term relationships, counts) | WP-CLI / `wp eval-file` via the WP/WC data layer; raw SQL only when needed | Prefer CRUD APIs so hooks/recounts fire — see `references/caching.md`. |
| **Reads for verification** | Direct DB query (`wp_db_query` / `wp eval`) | Cached read tools (`wp_get_terms`, etc.) can report stale values. |

**Reading data off another site to migrate in:** public read APIs are often the cleanest source — e.g. the WooCommerce **Store API** (`/wp-json/wc/store/v1/...`) exposes prices (minor units), SKUs, categories, and images that MCP `get`-item abilities may omit. Read from the API, write with the local data layer.

## Verification

- **After any write, read it back from the DB** with a compact query — never rely on the tool's reported result alone:

  ```sql
  SELECT CHAR_LENGTH(post_content), LEFT(post_content, 60) FROM wp_posts WHERE ID = <id>;
  ```

- **After cache-sensitive changes**, bust the relevant cache (real save, `wp cache flush`, or a cache-busting query string `/path/?v=1`) and re-check on the front end / REST worker.
- **Verify counts and content with a direct DB query, not a cached read tool.** The DB is the source of truth.
- **On a slow site, wait and re-check** before concluding something is broken (see `references/local-env.md`).

## Failure modes

- **Multi-file deploy fatals the site *and* the MCP endpoint** → you can't self-recover. Prevent with dependency ordering; recover out-of-band. → `references/deploy-ordering.md`
- **A write returns a .schemas/serialisation error but actually succeeded** → verify against the DB; **do not blindly retry** a destructive content replace. → `references/mcp-write-quirks.md`
- **A correct write stays invisible** (stale counts/options/badges) → the MCP process's cache backend differs from the web workers'; evict via a real hook-firing mutation. → `references/caching.md`
- **WP-CLI won't run / raw SQL fails / new patterns don't register** → memory limit, missing `mysql` client, version-keyed pattern-cache transient. → `references/local-env.md`
- **Repo working dir isn't a runnable site** → placeholder DB creds; offline you can only lint. → `references/local-env.md`

## Escalation

- If a deploy has bricked the site, **stop trying over MCP** (every call dies at the same fatal) and ask the user to fix it out-of-band (delete the offending `require` line or rename the plugin folder via host file manager), then resume in dependency order.
- If cache eviction can't be triggered from your process, ask the user to run `wp cache flush` or perform a real save.
- Tool names, ability sets, and limits differ per server — this skill describes *patterns and traps*, not a fixed API. When the surface doesn't match, re-probe rather than assume.

## Related

- `wp-db-override-reconciliation` — pages that render from DB template/page overrides rather than theme files.
- `wp-wpcli-and-ops` (upstream) — general WP-CLI reference.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
