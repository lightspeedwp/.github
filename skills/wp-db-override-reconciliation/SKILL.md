---
name: wp-db-override-reconciliation
description: Diagnose and reconcile WordPress block-theme pages that render from Site Editor customizations stored in the database (wp_template posts, static front-page overrides) instead of theme files. Use when editing a template/pattern file has no effect on the front end, when deciding whether to fix via CSS / edit the DB / reset the override, when importing DB customizations back into theme files (faithful vs portable), or when planning the deploy cleanup so theme files become the source of truth.
compatibility: Targets WordPress 6.9+ block themes (Site Editor / FSE, theme.json v3). Requires DB read access (WP-CLI or an MCP db query tool) and, to reconcile, write access to the theme files. Some steps assume WP-CLI; a page cache/OPcache may need busting to see changes.
---

# WP DB-Override Reconciliation

## Overview

In a WordPress block theme, the Site Editor saves template and template-part edits as **posts in the database** (`wp_template` / `wp_template_part`), and these **shadow the same-slug files in the theme.** A static front page and individually-edited pages behave the same way. The trap: once a template has been customized in the editor, **editing the theme file (or the pattern it references) changes nothing on the front end** — the DB copy wins, silently.

This skill is how you (1) recognise when a page is DB-driven, (2) locate the override, (3) choose the right fix, (4) import DB customizations back into theme files, and (5) plan the deploy cleanup so the theme becomes the source of truth again.

Portable across projects; project specifics appear as **labelled examples**. Post IDs, term IDs, and paths differ per site — always re-query.

## When to use

- You edited `templates/*.html`, `parts/*.html`, or a referenced `patterns/*.php` and the front end **didn't change**.
- You need to decide **how** to change something that renders on a DB-driven page (CSS vs editing the DB vs resetting the override).
- You're **importing** editor customizations back into theme files, and must choose faithful vs portable.
- You're preparing a **deploy** and need the DB overrides removed and env-specific references re-wired.

## Inputs required

- **DB read access** — WP-CLI (`wp eval` / `wp db query`) or an MCP db query tool — to enumerate `wp_template` posts and the active theme's `wp_theme` term.
- The **active theme's `wp_theme` term id** (overrides are tied to it).
- To reconcile: **write access to the theme files**, and knowledge of which environment's values (image URLs, nav `ref`s, form IDs) are baked into the DB copy.

## Procedure

1. **Confirm the page is DB-driven.** Query for a `wp_template` post whose `post_name` matches the template slug and which is joined to the active theme's `wp_theme` term. If one exists, its `post_content` — not the theme file — is what renders. For the home view, also check `show_on_front` / `page_on_front` (a `front-page` template drives home when `show_on_front=posts`). See `references/detecting-overrides.md`.
2. **Locate and read the override.** Capture its post ID and `post_content`. Note whether markup is **baked inline** or references a pattern (`<!-- wp:pattern {"slug":"…"} /-->`) — inline is common and means the pattern file is irrelevant to this page.
3. **Choose a fix strategy** (see `references/reconciliation-strategies.md`):
   - **CSS** — class-based, in the theme's stylesheet. Applies whether markup comes from DB or file; the safest fix for visual issues.
   - **Edit the DB copy** — `wp eval` + `str_replace` on `post_content`, when block-markup attributes must change and you can't reset.
   - **Reset the override** — delete the DB post so the theme file takes over. Back up its `post_content` first; it can be tens of KB of real work.
4. **If importing DB → theme, decide faithful vs portable** *before* writing files, and keep the two on separate branches — mixing them corrupts both. See `references/reconciliation-strategies.md`.
5. **Record every override in the deploy-cleanup register** and re-wire env-specific refs on deploy. See `references/deploy-cleanup.md`.

## Verification

- After a DB `post_content` edit, **read it back from the DB** (`CHAR_LENGTH`, `LEFT(post_content, …)`) — don't trust the write tool's message. (See `wp-mcp-wpcli-ops`.)
- **Bust caches before judging the front end**: OPcache for PHP/pattern edits (web-SAPI OPcache is separate from CLI — hit an `opcache_reset()` script over HTTP), and the page cache with a query-string buster.
- After a **reset**, confirm the theme file now renders (and that env-specific refs it needs — nav, images — actually resolve in the target environment).

## Failure modes

- **"My template/pattern edit does nothing"** → a DB override is shadowing the file. Detect and reconcile rather than editing harder. → `references/detecting-overrides.md`
- **Inline vs pattern confusion** → the DB copy has markup **baked in** and does not use the `wp:pattern` ref, so editing the pattern file is a no-op. → `references/detecting-overrides.md`
- **Faithful and portable imports mixed** → env-specific values (localhost image URLs, nav `ref`s, form IDs) leak into a theme meant to be portable, or placeholders overwrite a faithful copy. Keep them on separate branches. → `references/reconciliation-strategies.md`
- **Deploy ships with DB overrides still live** → theme files silently don't take effect in the new environment; or a faithful copy points at dev-only nav/image IDs. → `references/deploy-cleanup.md`
- **OPcache/page cache masks the change** → looks like the edit failed; it didn't. → Verification above.

## Escalation

- If an override holds substantial hand-work and the client may still want editor-based edits, **don't unilaterally reset it** — confirm the source-of-truth decision (theme file vs editor) with the user first.
- If deploy requires re-wiring nav menus / image IDs that only exist in one environment, flag the exact refs to the user; these need a human deploy step, not just a file copy.

## Related

- `wp-mcp-wpcli-ops` — DB reads/writes, cache/OPcache eviction, verify-don't-retry.
- `wp-pattern-runtime-pitfalls` — why a referenced pattern may render nothing even when the template *does* reference it.
- `wp-editor-to-theme` (upstream) — the general "pull editor customizations into theme files and reset" workflow.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
