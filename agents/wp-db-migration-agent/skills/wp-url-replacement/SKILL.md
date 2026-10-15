---
name: wp-url-replacement
description: Replace a WordPress site's URL in its database safely when moving between a WordPress Studio local site and a staging or live site. Reads the current siteurl from the export's options table, asks the user for the destination URL, previews the changes and only then applies a serialisation-safe replacement with WP-CLI. Use after importing a live database into Studio, or before sending a Studio database to staging or live.
---

# WordPress URL Replacement

Replace the source site's URL with the destination's everywhere in a WordPress
database, without breaking serialised data. Always preview first and apply
only after the user confirms.

## Why not find-and-replace in the SQL file

WordPress stores many options and meta values as PHP-serialised strings, which
record each string's length (`s:18:"https://beta.local"`). A plain text
replacement changes the text but not the length, and WordPress then discards
the whole value: widgets, theme settings and plugin options silently reset.
WP-CLI `search-replace` unserialises, replaces and re-serialises each value.
**Never use `sed` or an editor's find-and-replace on a database dump**; if
WP-CLI is unavailable, stop and tell the user.

## Procedure

### 1. Find the current URL

From an export file (works for any table prefix and for multisite):

```bash
node agents/wp-db-migration-agent/lib/sql-tool.cjs site-urls <export.sql>
```

Add `--studio-site ~/Studio/<site>` to also get the Studio site's own URL
and a ready-made preview command (see step 3).

Or from a running Studio site:

```bash
studio wp --path ~/Studio/<site> option get siteurl
studio wp --path ~/Studio/<site> option get home
```

Report every `siteurl` and `home` value with its options table. If they
differ, or the export is multisite (several `*_options` tables), treat each
value as a separate source URL. If no value is found, ask the user for the
source URL; do not guess.

### 2. Ask for the destination

Show the user what was found and ask where it should point. Offer the likely
answer for the direction of travel:

- **Live or staging → Studio**: the Studio site's custom URL. `site-urls
--studio-site` reads it from Studio's site list (`~/.studio/cli.json`:
  `https://<customDomain>`, or `http://localhost:<port>` without one), and
  `studio status --path ~/Studio/<site> --format json` reports it as
  `siteUrl`. Do not use `siteurl` from the imported database for this: it is
  the source's until Studio or this skill changes it.
- **Studio → staging or live**: the target site's public URL; ask, there is no
  safe default.

Also ask whether any other hosts need replacing, such as a CDN, a media domain
or an old domain still in content. Confirm the final list of pairs back to the
user before continuing.

### 3. Preview

Use one regex per source host, so `http://`, `https://`, `www.` and the
JSON-escaped form block markup stores (`https:\/\/`) are all caught in a
single pass while keeping each value's escaping. `site-urls --studio-site`
prints this command ready to run, with the match count from the export.
Otherwise build it by hand. The pattern matches either source scheme; the
replacement sets the destination's. Replace `<scheme>` with the scheme of the
destination URL the user confirmed (`https` or `http`):

```bash
studio wp --path ~/Studio/<site> search-replace \
  'https?:(\\?/)(\\?/)(?:www\.)?old\.example\.com(?!\.?[\w-])' '<scheme>:${1}${2}new.example.com' \
  --regex --all-tables-with-prefix --dry-run --report-changed-only
```

Escape the dots in the source host (`\.`). `(?:www\.)?` catches both forms of
the host, and `(?!\.?[\w-])` stops at the end of the host, so
`old.example.com.evil.net` and `old.example.com-backup.net` are left alone.
Subdomains such as `shop.old.example.com` and email addresses do not match;
ask the user whether they need their own pairs. Show the user the per-table counts.
Regex mode checks every row in PHP, so it can take several minutes on a large
site; tell the user before starting.

### 4. Apply, after the user confirms

**Destination is the Studio site** (the database is already imported locally):
run the same command without `--dry-run`, then flush caches. Studio serves
every site over `https`, so the scheme here is always `https`:

```bash
studio wp --path ~/Studio/<site> search-replace \
  'https?:(\\?/)(\\?/)(?:www\.)?old\.example\.com(?!\.?[\w-])' 'https:${1}${2}<site>.local' \
  --regex --all-tables-with-prefix
studio wp --path ~/Studio/<site> cache flush
```

**Destination is staging or live**: do not touch the remote database. Use
`--export` so WP-CLI writes a new SQL file with the replacements applied and
leaves the local Studio database unchanged:

```bash
studio wp --path ~/Studio/<site> search-replace \
  'https?:(\\?/)(\\?/)<site>\.local' '<scheme>:${1}${2}staging.example.com' \
  --regex --all-tables-with-prefix --export=<site>-staging.sql
```

`--export` applies one pattern per run. If the user needs more than one source
host replaced, either combine them into one regex with a non-capturing group,
so `${1}` and `${2}` still refer to the slashes
(`https?:(\\?/)(\\?/)(?:<site>\.local|cdn\.old\.example)`, same destination
only), or give the user
the extra commands to run with WP-CLI on the target after import.

### 5. Verify

- To Studio: `studio wp --path ~/Studio/<site> search-replace '<old host>' 'x' --all-tables-with-prefix --dry-run`
  reports 0 replacements, and the site loads with working media.
- To staging or live: run the `studio-export-preflight` skill on the exported
  file; its `local-url` check must pass before the user imports it.

## Rules

- Never replace URLs with a tool that is not serialisation-aware.
- Always preview with `--dry-run`, and apply only after the user confirms the
  pairs and counts.
- Never connect to or change a staging or live database; produce a file and
  instructions for the user.
- Do not include the scheme alone in a pattern (for example `http://` →
  `https://`): it would rewrite every external link in the content.

---

_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_
[Contributors](https://github.com/lightspeedwp/.github/graphs/contributors)
