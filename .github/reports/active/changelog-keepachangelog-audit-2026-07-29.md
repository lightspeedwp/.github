---
title: "CHANGELOG.md — Keep a Changelog 1.1.0 conformance audit"
description: "Divergences between CHANGELOG.md and Keep a Changelog 1.1.0, what was fixed mechanically, and what needs a human decision."
file_type: "documentation"
created_date: "2026-07-29"
last_updated: "2026-07-29"
owners:
  - LightSpeed Team
tags:
  - changelog
  - audit
  - documentation
status: active
stability: stable
domain: governance
language: en
---

# CHANGELOG.md — Keep a Changelog 1.1.0 conformance audit

**Date:** 2026-07-29
**Spec:** [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
**Scope:** the repository's single `CHANGELOG.md`. The other changelog-named files are tooling, guidelines or fixtures, not changelogs.

## Already conformant before this audit

- ISO 8601 dates on version headings (`## [0.6.0] - 2026-06-19`)
- Latest version first, `[Unreleased]` at the top
- Semantic Versioning stated in the header

## Divergences found

| # | Divergence | Spec basis | Status |
|---|---|---|---|
| D1 | Type sections not in canonical order in any version | defined order `Added, Changed, Deprecated, Removed, Fixed, Security` | **Fixed** |
| D2 | Duplicate type sections within one version — `0.6.0` had `Added`×3 and `Fixed`×4; `0.5.0` had `Fixed`×3 and `Documentation`×2 | "The same types of changes should be grouped." | **Fixed** |
| D3 | Non-standard types `Documentation` (×4) and `Performance` (×1) | only six types are defined | **Deferred** — needs reclassification |
| D4 | Empty sections carrying filler — `(none identified)`×2, `- [placeholder]`×3 | "Remove empty sections from CHANGELOG, they occupy too much space and create too much noise in the file." | **Fixed** |
| D5 | **Zero link definitions.** Every `[0.6.0]`-style heading rendered as literal text | "Versions and sections should be linkable." | **Partly fixed** |
| D6 | `## Contributors` sat *between* `[Unreleased]` and `[0.6.0]`, inside the version list | version-per-section model | **Fixed** |
| D7 | That placement also broke `extract-pr-entries.cjs` | — | **Fixed** as a consequence of D6 |
| D8 | PR references carried no titles | requested internally, not a spec item | **Fixed** |
| D9 | Four tagged releases have **no changelog entry**: `v0.2.1`, `v0.5.1`, `v0.7.0`, `v1.0.0` | "There should be an entry for every single version." | **Deferred** — needs release history |
| D10 | Two documented versions were **never tagged**: `0.6.0`, `0.1.0`; and two dates disagree with their tags | "The release date of each version is displayed." | **Deferred** — needs a decision |
| D11 | Five references used `/pull/N` URLs for numbers that are **issues** (`#1093`, `#1096`, `#1099`, `#1100`, `#1126`), and `#1145` was cited both ways | accuracy | **Fixed** |

### D7 in detail — the automation consequence

`scripts/workflows/changelog/extract-pr-entries.cjs:78` ends the `[Unreleased]` section at the next `^##\s+\[` heading — a *bracketed* one. `## Contributors` is not bracketed, so the extractor ran straight past it and swallowed the Contributors prose into the extracted entries. Reproduced before the fix (143 lines extracted, including the `PR Range:` paragraph); after moving the section below the version list, extraction is clean at 127 lines.

## What was fixed, and how it was verified

Applied as two scripted passes rather than hand edits, each with an invariant check:

1. **Structural** — merged duplicate type sections, ordered canonically, dropped empty/placeholder sections, moved non-version `##` sections below the version list.
   *Invariant:* all 462 non-placeholder items preserved. Total list items went 465 → 462, exactly the three `- [placeholder]` items removed intentionally. The two `(none identified)` lines were not list items.
2. **References** — injected 160 PR titles, corrected 6 mislabelled issue URLs, appended 5 version link definitions.

**Entry format for PR references** is now:

```markdown
([PR #1392](https://github.com/lightspeedwp/.github/pull/1392) — *feat(...): …*, [#1393](…/issues/1393))
```

The title sits **outside** the link, deliberately. Putting it inside the link text (`[PR #1392 — title](url)`) broke `scripts/validation/changelog-rules.cjs:66`, whose rule is `/\(\[PR #(\d+)\]/` — it requires the bracket to close directly after the digits. That mistake took the validator from 1 error to 59; moving the title out satisfies both the rule and readability. Six titles containing literal `*` or `_` are escaped, so `research/*` no longer terminates the emphasis early.

### D5 — partly fixed, and why

Link definitions were added only where a corresponding tag exists:

```
[Unreleased], [0.5.0], [0.4.0], [0.3.0], [0.2.0]
```

`[0.6.0]` and `[0.1.0]` are **omitted on purpose** — neither has a tag, so any compare range would be fabricated. They stay unlinkable until D9/D10 is resolved.

Because `v0.2.1` and `v0.5.1` are undocumented (D9), the `[0.3.0]` compare range spans `v0.2.1`'s commits. Documented predecessors were used so the ranges match the document's own narrative; this resolves once D9 does.

## Deferred — these need a human decision

### D3 — non-standard change types

`### Documentation` appears in `0.5.0`, `0.4.0`, `0.2.0`, `0.1.0`; `### Performance` in `0.2.0`. The spec defines only six types. Reclassifying is per-entry judgement — new docs are `Added`, doc revisions are `Changed` — so it was not done mechanically. Options: reclassify entry by entry, or record a deliberate house extension to the spec.

### D9 / D10 — the version history does not reconcile with the tags

| | |
|---|---|
| Tagged, no entry | `v0.2.1` (2025-12-18), `v0.5.1` (2026-06-08), `v0.7.0` (2026-06-03), `v1.0.0` (2026-06-03) |
| Entry, never tagged | `0.6.0` (2026-06-19), `0.1.0` (2025-09-25) |
| Date disagreement | `v0.4.0` tag 2026-05-26 vs entry 2026-05-27; `v0.2.0` tag 2025-12-15 vs entry 2025-12-18 |

`v0.7.0` and `v1.0.0` are both tagged 2026-06-03 — the same day as `v0.5.0` — while `0.6.0` is documented as 2026-06-19, *after* both. The version history itself is tangled, not merely its changelog. Writing entries for the four undocumented releases requires knowing what shipped in each; that cannot be inferred safely and was not guessed.

### Two outstanding validator errors

`npm run validate:changelog` reports 2 errors (from 1 before, warnings unchanged at 34):

- **Pre-existing** — the *GitHub Workflows Consolidation Initiative — Phase 1A* entry opens `([Epic #1227](…)`, so the required `([PR #` token never appears. Unchanged by this audit.
- **Newly revealed, not caused** — the *GitHub Actions workflow hardening* entry cited `#1093`, `#1096`, `#1099`, `#1100` as PRs. All four are **issues**, and all four are "rewrite X Agent for multi-provider support" — unrelated to workflow hardening. Correcting the URLs (D11) removed the only `[PR #` token, exposing that the entry references no PR at all and that its description and references do not match each other. The single candidate PR by title, `#413 fix: command-gate release workflow and harden permissions`, is not plausible given the issue numbers. **Needs whoever wrote it to supply the real reference.**

Also note the validator is not wired into CI — `checks.yml` runs `npm run test`, which does not include `validate:changelog`. Worth adding once the two errors are resolved, or it will keep drifting.

## Suggested next steps

1. Decide D3 — reclassify, or document the extension.
2. Reconcile D9/D10 with whoever owns releases; then add the two missing link definitions.
3. Supply the real PR reference for the *workflow hardening* entry, and restructure the *Phase 1A* entry to lead with its PR.
4. Add `validate:changelog` to CI once green.

## Reproducing

```bash
npm run validate:changelog          # repo rules (title/description limits, PR link)
npx markdownlint-cli2 CHANGELOG.md  # markdown lint
git tag --list                      # compare against documented versions
```
