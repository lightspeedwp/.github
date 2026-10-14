# Changelog

All notable changes to the WordPress DB Migration Agent are documented in this
file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-14

### Added

- `sql-tool sanitise --prefix <prefix>` renames an export's tables, plus the `<prefix>user_roles` option and `<prefix>*` usermeta keys, to match the Studio site's table prefix. ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))

- Sanitiser leaves out Wordfence's tables by default, because the plugin is not run on local sites; `--keep-wordfence` keeps them. ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))

- `--studio-site <path>` on `sanitise` and `site-urls` reads the Studio site's `$table_prefix` and warns when it differs from the export's; the agent now asks the user which prefix to use before sanitising. ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))

- `sql-tool sanitise --keep-users` leaves out the export's users and usermeta tables so the Studio site keeps its own accounts; the agent asks whether to keep them. ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))

### Fixed

- Reports no longer count plugin tables such as `<prefix>wpb2d_options` as a second WordPress table prefix. ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))
- Sanitiser rewrites MariaDB 11+ binary defaults written as ``DEFAULT x AS `<hex>` `` (Wordfence tables), which made Studio imports fail on `CREATE TABLE`. ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))
- Sanitiser adds `DROP TABLE IF EXISTS` before any `CREATE TABLE` without one, so phpMyAdmin exports import into Studio sites that already have the same tables (`Could not execute statement: CREATE TABLE wp_commentmeta`). ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))
- Sanitiser refuses files already converted to SQLite's own dialect, and pre-flight fails them, because Studio's importer only accepts MySQL syntax (`Could not execute statement: PRAGMA foreign_keys=OFF`). ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))
- The sanitiser skill and agent now forbid hand-made native SQLite conversions for Studio. ([PR #3961](https://github.com/lightspeedwp/.github/pull/3961))

## [1.0.0] - 2026-10-13

### Added

- Sanitiser skill and tool that make MySQL exports importable into WordPress Studio.
- Pre-flight skill and tool that check Studio exports before staging or live imports.
- URL replacement skill that finds `siteurl`, prompts for the destination and replaces it safely.
