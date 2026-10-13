# Changelog

All notable changes to the WordPress DB Migration Agent are documented in this
file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-13

### Added

- Sanitiser skill and tool that make MySQL exports importable into WordPress Studio.
- Pre-flight skill and tool that check Studio exports before staging or live imports.
- URL replacement skill that finds `siteurl`, prompts for the destination and replaces it safely.
