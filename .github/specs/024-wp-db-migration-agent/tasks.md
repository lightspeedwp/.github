# Tasks: WordPress DB Migration Agent

**Input**: Design documents from `.github/specs/024-wp-db-migration-agent/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/sql-tool-cli.md](./contracts/sql-tool-cli.md),
[quickstart.md](./quickstart.md)

**Tests**: Required. FR-042 asks for automated tests of every deterministic transformation.

**Organisation**: Tasks are grouped by user story so each story can be built and tested alone.

Paths below are relative to the repository root; `AGENT` means `agents/wp-db-migration-agent`.

## Phase 1: Setup

- [x] T001 Create the agent folder skeleton `AGENT/{lib,skills,tests/unit,tests/fixtures}` per plan.md
- [x] T002 [P] Create `AGENT/package.json` (name `@lightspeedwp/wp-db-migration-agent`, version `1.0.0`, private, scripts `test` and `sql-tool`, no runtime dependencies)
- [x] T003 [P] Create `AGENT/CHANGELOG.md` in Keep a Changelog 1.1.0 format with a `1.0.0` entry

---

## Phase 2: Foundational (blocks all stories)

- [x] T004 Implement byte-safe primitives in `AGENT/lib/sql-tool.cjs`: read the input as a Buffer, split statements by line, count `CREATE TABLE` and `INSERT INTO`, list table names, refuse when the output path equals the input path, never write when `status` is `error` (data-model "Result envelope")
- [x] T005 Implement the CLI dispatcher and result envelope in `AGENT/lib/sql-tool.cjs` (`sanitise | preflight | site-urls`, `--out`, `--force`, `--target`, `--prefix`, `--json`; exit codes 0/1/2 per contracts/sql-tool-cli.md) with Markdown and JSON renderers
- [x] T006 [P] Create synthetic fixtures in `AGENT/tests/fixtures/` (no real data): `mysql-risky.sql` (DEFINER, trigger, CREATE DATABASE/USE), `studio-export.sql` (`_wp_sqlite_*` tables, `utf8mb4_0900_ai_ci`, `.local` URLs, `wp_` prefix), `multisite-prefix.sql` (`wp123_options`, `wp123_2_options`)

The GTID/binary dump is built in `AGENT/tests/unit/sanitise.test.js` instead of a fixture file, so it
can hold exact bytes (escapes and a non-UTF-8 byte) without editors or formatters altering them.

**Checkpoint**: CLI runs and reports counts for any SQL file.

---

## Phase 3: User Story 1 - Prepare a live/staging export for Studio (P1, MVP)

**Goal**: A failing MySQL export becomes a Studio-importable copy with every edit listed.

**Independent test**: `sql-tool sanitise` on `mysql-gtid-binary.sql` writes `*-sqlite.sql`, the
input hash is unchanged, and the edit list matches the fixture.

### Tests for User Story 1

- [x] T007 [P] [US1] Unit tests in `AGENT/tests/unit/sanitise.test.js`: GTID line and comment removed; three `SQL_LOG_BIN` lines removed; `_binary` literals become `X'<hex>'` with exact bytes for `\0 \b \n \r \t \Z \\ \' \"`; length guard fails with exit 2 and no output for a `binary(16)` value that decodes to 15 bytes; non-UTF-8 bytes pass through; input bytes unchanged; "output.createTables MUST equal input.createTables and output.inserts MUST equal input.inserts"
- [x] T008 [P] [US1] Unit tests in `AGENT/tests/unit/scan.test.js`: risky statements (DEFINER, trigger, CREATE DATABASE, USE, DELIMITER, other `@@GLOBAL`) reported as findings and left unchanged

### Implementation for User Story 1

- [x] T009 [US1] Implement the statement-removal rules (`gtid-purged`, `gtid-comment`, `sql-log-bin`) in `AGENT/lib/sql-tool.cjs`
- [x] T010 [US1] Implement the `binary-literal` rule with MySQL escape decoding and the fixed-length column guard in `AGENT/lib/sql-tool.cjs`
- [x] T011 [US1] Implement the risk scan (FR-013) and the post-import facts (`siteurl`/`home`, users table present, FR-015) in `AGENT/lib/sql-tool.cjs`
- [x] T012 [US1] Write skill 1 `AGENT/skills/mysql-to-studio-sanitiser/SKILL.md` from the proven prompt: run the tool when available, manual byte-safe fallback otherwise, edit table, post-import checks, Studio log troubleshooting loop (FR-016)

**Checkpoint**: Story 1 is usable on its own (MVP).

---

## Phase 4: User Story 2 - Check a Studio export before staging or live (P2)

**Goal**: A pass/warn/fail report for a Studio phpMyAdmin export, with no writes.

**Independent test**: `sql-tool preflight` on `studio-export.sql --target mysql-5.7 --prefix wp_`
flags internal tables (fail), `0900` collation (fail for 5.7), `.local` URLs (warn) and exits 1.

- [x] T013 [P] [US2] Unit tests in `AGENT/tests/unit/preflight.test.js` covering each check's pass and fail fixture (SC-004)
- [x] T014 [US2] Implement preflight checks in `AGENT/lib/sql-tool.cjs`: `internal-table` (`_wp_sqlite_*`, `_mysql_data_types_cache`, `sqlite_*`), `collation-0900` by `--target`, `legacy-charset`, `create-database`, `drop-table`, `prefix-mismatch` by `--prefix`, `local-url`, plus the risky-statement scan
- [x] T015 [US2] Write skill 2 `AGENT/skills/studio-export-preflight/SKILL.md`: ask target version and prefix, run preflight, explain each finding, offer fixes on request, hand off to skill 3, backup-first import checklist; never import into staging or live

---

## Phase 5: User Story 3 - Replace the site URL safely (P2)

**Goal**: Source URLs found and shown, destination confirmed, serialisation-safe replacement
previewed then applied.

**Independent test**: `sql-tool site-urls` on `multisite-prefix.sql` reports both options tables
and their URLs; the skill's dry-run command matches research R6.

- [x] T016 [P] [US3] Unit tests in `AGENT/tests/unit/site-urls.test.js`: any prefix, multisite tables, `siteurl` ≠ `home`, no options table, and no false match on `'siteurl'` inside serialised values in other tables
- [x] T017 [US3] Implement `site-urls` in `AGENT/lib/sql-tool.cjs` by parsing `INSERT` value tuples of `*_options` tables only
- [x] T018 [US3] Write skill 3 `AGENT/skills/wp-url-replacement/SKILL.md`: read URLs, prompt for destinations and extra pairs, `studio wp search-replace --dry-run --report-changed-only` then real run (to-Studio) or `--export=<file>` (to-remote), refuse non-serialisation-aware replacement

---

## Phase 6: Agent packaging and polish

- [x] T019 [P] Write the canonical specification `AGENT/wp-db-migration.agent.md` (agent frontmatter as changelog-agent; role, workflow routing between the three skills, guardrails FR-001 to FR-006, failure handling, test tasks)
- [x] T020 [P] Write `AGENT/AGENT.md` (entry point) and `AGENT/README.md` (team-facing usage)
- [x] T021 Register the agent in `scripts/agents/generate-agent-defs.cjs` and generate `.claude/agents/wp-db-migration-agent.md`
- [x] T022 [P] Add the agent to the index in `agents/README.md`
- [x] T023 [P] Add an `[Unreleased]` entry to `CHANGELOG.md`
- [x] T024 Run quickstart.md sections 1, 2 and 5; fix any findings
- [x] T025 Update spec status and `.github/specs/CATALOG.md` phase

---

## Dependencies & Execution Order

- Setup (T001-T003) → Foundational (T004-T006) → stories.
- US1, US2 and US3 depend only on Foundational; they touch the same `sql-tool.cjs`, so their
  implementation tasks run in sequence, while their tests and skills can be written in parallel.
- Packaging (T019-T023) can start once the skill names are fixed; T024-T025 run last.

## Parallel Example: User Story 1

```text
T007 sanitise.test.js   |  T008 scan.test.js   |  T012 SKILL.md draft
```

## Implementation Strategy

1. MVP: Phases 1-3 deliver the sanitiser that fixed the 2026-10-13 import.
2. Add Story 2 (pre-flight) and Story 3 (URL replacement); each is independently testable.
3. Package, validate and open a draft PR against `develop`.
