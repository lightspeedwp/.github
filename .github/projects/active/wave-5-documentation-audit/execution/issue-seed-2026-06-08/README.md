---
file_type: documentation
title: "Wave 5 Issue Seed (2026-06-08)"
description: "Ready-to-paste parent and child issue body files plus one-run gh creation script"
version: "1.1.0"
created_date: "2026-06-08"
last_updated: "2026-06-08"
status: active
---

# Wave 5 Issue Seed (2026-06-08)

This folder contains a full parent/child issue seed pack generated from the refined documentation audit prompt.

## Contents

- `bodies/parents/` - 5 parent issue body files
- `bodies/children/` - 20 child issue body files
- `create-wave5-issues.sh` - one-run script to create all issues with `gh issue create`

## Run

```bash
cd .github/projects/active/wave-5-documentation-audit/execution/issue-seed-2026-06-08

# Dry run (prints gh commands, creates nothing)
DRY_RUN=true bash create-wave5-issues.sh

# Real run
bash create-wave5-issues.sh
```

## Optional Variables

- `REPO` (default: `lightspeedwp/.github`)
- `MILESTONE` (example: `Documentation Audit Sprint`)
- `DRY_RUN` (`true` or `false`)

Example:

```bash
REPO=lightspeedwp/.github MILESTONE="Documentation Audit Sprint" bash create-wave5-issues.sh
```

## Output

On a real run, the script saves a TSV summary in this folder:

- `created-issues-YYYYMMDD-HHMMSS.tsv`

The summary includes issue number, title, and URL.

## Created Issues (Run Completed 2026-06-08)

### Parent Issues

- [#902](https://github.com/lightspeedwp/.github/issues/902): <https://github.com/lightspeedwp/.github/issues/902>
- [#903](https://github.com/lightspeedwp/.github/issues/903): <https://github.com/lightspeedwp/.github/issues/903>
- [#904](https://github.com/lightspeedwp/.github/issues/904): <https://github.com/lightspeedwp/.github/issues/904>
- [#905](https://github.com/lightspeedwp/.github/issues/905): <https://github.com/lightspeedwp/.github/issues/905>
- [#906](https://github.com/lightspeedwp/.github/issues/906): <https://github.com/lightspeedwp/.github/issues/906>

### Child Issues

- [#907](https://github.com/lightspeedwp/.github/issues/907): <https://github.com/lightspeedwp/.github/issues/907>
- [#908](https://github.com/lightspeedwp/.github/issues/908): <https://github.com/lightspeedwp/.github/issues/908>
- [#909](https://github.com/lightspeedwp/.github/issues/909): <https://github.com/lightspeedwp/.github/issues/909>
- [#910](https://github.com/lightspeedwp/.github/issues/910): <https://github.com/lightspeedwp/.github/issues/910>
- [#911](https://github.com/lightspeedwp/.github/issues/911): <https://github.com/lightspeedwp/.github/issues/911>
- [#912](https://github.com/lightspeedwp/.github/issues/912): <https://github.com/lightspeedwp/.github/issues/912>
- [#913](https://github.com/lightspeedwp/.github/issues/913): <https://github.com/lightspeedwp/.github/issues/913>
- [#914](https://github.com/lightspeedwp/.github/issues/914): <https://github.com/lightspeedwp/.github/issues/914>
- [#916](https://github.com/lightspeedwp/.github/issues/916): <https://github.com/lightspeedwp/.github/issues/916>
- [#917](https://github.com/lightspeedwp/.github/issues/917): <https://github.com/lightspeedwp/.github/issues/917>
- [#918](https://github.com/lightspeedwp/.github/issues/918): <https://github.com/lightspeedwp/.github/issues/918>
- [#919](https://github.com/lightspeedwp/.github/issues/919): <https://github.com/lightspeedwp/.github/issues/919>
- [#920](https://github.com/lightspeedwp/.github/issues/920): <https://github.com/lightspeedwp/.github/issues/920>
- [#921](https://github.com/lightspeedwp/.github/issues/921): <https://github.com/lightspeedwp/.github/issues/921>
- [#922](https://github.com/lightspeedwp/.github/issues/922): <https://github.com/lightspeedwp/.github/issues/922>
- [#923](https://github.com/lightspeedwp/.github/issues/923): <https://github.com/lightspeedwp/.github/issues/923>
- [#924](https://github.com/lightspeedwp/.github/issues/924): <https://github.com/lightspeedwp/.github/issues/924>
- [#925](https://github.com/lightspeedwp/.github/issues/925): <https://github.com/lightspeedwp/.github/issues/925>
- [#926](https://github.com/lightspeedwp/.github/issues/926): <https://github.com/lightspeedwp/.github/issues/926>
- [#927](https://github.com/lightspeedwp/.github/issues/927): <https://github.com/lightspeedwp/.github/issues/927>

### Notes

- Issue [#915](https://github.com/lightspeedwp/.github/issues/915) is an expected sequence gap from concurrent issue creation activity.
