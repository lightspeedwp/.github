# Changelog

All notable changes to the WordPress Schema Audit Agent are documented in this
file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-14

### Added

- Test URL skill and tool that pick one page per post type, archive, taxonomy, key page, author and search.
- Validation skill and tool that check each page's structured data against the schema.org vocabulary and Google's rich-result rules.
- Report skill that turns findings into prioritised fixes, each naming the plugin or setting that owns it.
- Client deliverables: a plain-English Markdown report and a CSV of findings, written by a single audit command.
