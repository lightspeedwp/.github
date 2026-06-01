---
title: "Portable AI Plugin Restructure Issue Drafts"
description: "Local parent and child GitHub issue drafts for the portable AI plugin restructure programme."
version: "v0.2.0"
last_updated: "2026-05-14"
file_type: "project"
maintainer: "LightSpeed Team"
authors: ["LightSpeed Team", "Codex"]
license: "GPL-3.0"
tags: ["issues", "planning", "ai-ops", "plugin", "restructure"]
domain: "governance"
stability: "active"
---

# Portable AI Plugin Restructure Issue Drafts

These files are the local source drafts for the GitHub issues now posted to
`lightspeedwp/.github`. They use the repository issue templates from
`.github/ISSUE_TEMPLATE/` and now include live GitHub issue URLs in their
frontmatter.

## Parent Epics

| Issue | Draft | Scope |
| --- | --- | --- |
| [#282](https://github.com/lightspeedwp/.github/issues/282) | `parents/01-epic-planning-control-and-skeleton.md` | [Epic] Portable AI plugin restructure: planning control and target skeleton |
| [#283](https://github.com/lightspeedwp/.github/issues/283) | `parents/02-epic-portable-source-migration.md` | [Epic] Portable AI plugin restructure: source asset migration |
| [#284](https://github.com/lightspeedwp/.github/issues/284) | `parents/03-epic-core-plugin-and-tool-compatibility.md` | [Epic] Portable AI plugin restructure: core plugin and compatibility |
| [#285](https://github.com/lightspeedwp/.github/issues/285) | `parents/04-epic-validation-docs-and-rollout.md` | [Epic] Portable AI plugin restructure: validation, docs, pilot, and release |

## Child Issue Batches

| Batch | Folder | Purpose | Issues |
| --- | --- | --- | --- |
| 00 | `children/batch-00-planning-control/` | Foundation/planning | [#286](https://github.com/lightspeedwp/.github/issues/286), [#287](https://github.com/lightspeedwp/.github/issues/287), [#288](https://github.com/lightspeedwp/.github/issues/288) |
| 01 | `children/batch-01-skeleton-boundary/` | Target skeleton and .github boundary | [#289](https://github.com/lightspeedwp/.github/issues/289), [#290](https://github.com/lightspeedwp/.github/issues/290), [#291](https://github.com/lightspeedwp/.github/issues/291), [#292](https://github.com/lightspeedwp/.github/issues/292) |
| 02 | `children/batch-02-portable-migration/` | Portable source migration | [#293](https://github.com/lightspeedwp/.github/issues/293), [#294](https://github.com/lightspeedwp/.github/issues/294), [#295](https://github.com/lightspeedwp/.github/issues/295), [#296](https://github.com/lightspeedwp/.github/issues/296), [#297](https://github.com/lightspeedwp/.github/issues/297), [#298](https://github.com/lightspeedwp/.github/issues/298) |
| 03 | `children/batch-03-skills-cookbook/` | Skills and cookbook | [#299](https://github.com/lightspeedwp/.github/issues/299), [#300](https://github.com/lightspeedwp/.github/issues/300), [#301](https://github.com/lightspeedwp/.github/issues/301), [#302](https://github.com/lightspeedwp/.github/issues/302), [#303](https://github.com/lightspeedwp/.github/issues/303), [#304](https://github.com/lightspeedwp/.github/issues/304) |
| 04 | `children/batch-04-pilot-plugin/` | Pilot plugin package | [#305](https://github.com/lightspeedwp/.github/issues/305), [#306](https://github.com/lightspeedwp/.github/issues/306), [#307](https://github.com/lightspeedwp/.github/issues/307), [#308](https://github.com/lightspeedwp/.github/issues/308), [#309](https://github.com/lightspeedwp/.github/issues/309), [#310](https://github.com/lightspeedwp/.github/issues/310) |
| 05 | `children/batch-05-validation-reset/` | Validation reset | [#311](https://github.com/lightspeedwp/.github/issues/311), [#312](https://github.com/lightspeedwp/.github/issues/312), [#313](https://github.com/lightspeedwp/.github/issues/313), [#314](https://github.com/lightspeedwp/.github/issues/314), [#315](https://github.com/lightspeedwp/.github/issues/315), [#316](https://github.com/lightspeedwp/.github/issues/316) |
| 06 | `children/batch-06-pilot-release/` | Pilot, future packs, and release | [#317](https://github.com/lightspeedwp/.github/issues/317), [#318](https://github.com/lightspeedwp/.github/issues/318), [#319](https://github.com/lightspeedwp/.github/issues/319), [#320](https://github.com/lightspeedwp/.github/issues/320), [#321](https://github.com/lightspeedwp/.github/issues/321) |

## Parent Mapping

- #282 owns batches 00 and 01.
- #283 owns batches 02 and 03.
- #284 owns batch 04, with #317 cross-linked for compatibility smoke testing.
- #285 owns batches 05 and 06.

## Labels And Branch Prefixes

- Parent epics use `status:needs-planning`, `priority:important`, `type:epic`, and relevant non-type labels such as `area:*` or `ai-ops:*`.
- AI operations work uses relevant `ai-ops:*` labels and branch prefix `ai/`.
- Refactor work uses branch prefix `refactor/`.
- Documentation work uses branch prefix `docs/`.
- Build and validation work uses branch prefix `ci/` or `build/`.
- Maintenance work uses branch prefix `maintenance/` or `chore/`.
