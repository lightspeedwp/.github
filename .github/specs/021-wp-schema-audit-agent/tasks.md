# Tasks: WordPress Schema Audit Agent

**Input**: Design documents from `.github/specs/021-wp-schema-audit-agent/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/schema-tool-cli.md](./contracts/schema-tool-cli.md),
[quickstart.md](./quickstart.md)

**Tests**: Required. FR-042 asks for automated tests of every deterministic check.

**Organisation**: Tasks are grouped by user story so each story can be built and tested alone.

Paths below are relative to the repository root; `AGENT` means `agents/wp-schema-audit-agent`.

## Phase 1: Setup

- [x] T001 Create the agent folder skeleton `AGENT/{lib,skills,tests/unit,tests/fixtures}` per plan.md
- [x] T002 [P] Create `AGENT/package.json` (name `@lightspeedwp/wp-schema-audit-agent`, version `1.0.0`, private, scripts `test` and `schema-tool`, no runtime dependencies)
- [x] T003 [P] Create `AGENT/CHANGELOG.md` in Keep a Changelog 1.1.0 format with a `1.0.0` entry

---

## Phase 2: Foundational (blocks all stories)

- [x] T004 Implement the HTTP client in `AGENT/lib/schema-tool.cjs`: GET only, redirect chain recorded, 20 MB / 30 s / five-redirect caps, TLS relaxed only for local development hosts (FR-001, FR-002)
- [x] T005 Implement the CLI dispatcher (`urls | validate | vocab`, options and exit codes per contracts/schema-tool-cli.md) with Markdown and JSON renderers
- [x] T006 [P] Create the vocabulary fixture `AGENT/tests/fixtures/vocab-mini.jsonld` in the release file's format (classes, data types, enumeration members, a pending type, a superseded property)
- [x] T007 [P] Create `AGENT/tests/unit/helpers.cjs` with a fetch stub so no test touches the network

**Checkpoint**: the CLI runs and reports usage errors with exit 2.

---

## Phase 3: User Story 1 - Pick the URLs to test (P1)

**Goal**: One URL per post type, archive, taxonomy, key page, author and search.

**Independent test**: `schema-tool urls https://beta.local/` lists every archive and public type.

- [x] T010 [US1] Tests in `AGENT/tests/unit/audit.test.js` for discovery: internal types excluded, non-public types skipped with reasons, redirect notes, archives found by redirect and in place, `?rest_route=` fallback, unreachable REST API
- [x] T011 [US1] Implement `discoverUrls()` in `AGENT/lib/schema-tool.cjs` (FR-005 to FR-008)
- [x] T012 [US1] Write `AGENT/skills/schema-test-urls/SKILL.md`

---

## Phase 4: User Story 2 - Validate the structured data (P1)

**Goal**: Exact checks against the schema.org release plus dated rich-result rules.

**Independent test**: the validation tests pass and a run against beta.local reproduces the
findings recorded by hand (SC-003).

- [x] T020 [P] [US2] Tests in `AGENT/tests/unit/vocabulary.test.js`: inheritance, data types, enumeration members, pending and superseded terms, latest-release download and cache, cached fallback, refusal to cache non-JSON, explicit `--vocab`
- [x] T021 [P] [US2] Tests in `AGENT/tests/unit/validate.test.js`: extraction, generators, unknown terms, domain, range, enumeration values, Action annotations, references across blocks, duplicate `@id`, dates, entities, rich-result rules, expired offers
- [x] T022 [US2] Implement `buildVocabulary()` and `resolveVocabulary()` (FR-010 to FR-013)
- [x] T023 [US2] Implement `extractJsonLd()`, `detectGenerators()`, `validateBlocks()` and `auditPage()` (FR-020 to FR-028)
- [x] T024 [US2] Write `AGENT/skills/schema-markup-validation/SKILL.md`

---

## Phase 5: User Story 3 - Turn findings into fixes (P2)

**Goal**: Site-wide causes first, an owner per fix, honest rich-result expectations.

- [x] T030 [US3] Write `AGENT/skills/schema-audit-report/SKILL.md` (FR-030 to FR-032), including the patterns from the background: inactive SEO plugin, redirected singles, per-content-type SEO settings, site-wide empty values, duplicate entities, self-serving reviews, personal data

---

## Phase 6: Agent packaging and polish

- [x] T040 Write `AGENT/wp-schema-audit.agent.md`, `AGENT/AGENT.md` and `AGENT/README.md`
- [x] T041 Register the agent in `scripts/agents/generate-agent-defs.cjs`, extend its test, and generate `.claude/agents/wp-schema-audit-agent.md` (FR-040)
- [x] T042 [P] Add the agent to `agents/README.md`, the spec to `.github/specs/CATALOG.md`, and an entry to `CHANGELOG.md`
- [x] T043 Run the quickstart validators (FR-043) and an end-to-end run against beta.local and the development site

## Phase 7: User Story 4 - Give the client a report (P2)

**Goal**: A Markdown report and a CSV from one command, in plain English, with no HTML.

**Independent test**: `schema-tool audit https://beta.local/ --format report --out report.md --csv
findings.csv` writes both files with the same pages and findings.

- [x] T050 [US4] Tests in `AGENT/tests/unit/report-formats.test.js`: every check has plain wording, priority counts, page table, issue sections, the every-page callout, CSV rows and quoting, formula neutralising, `--out`/`--csv` writing, refusal to overwrite, unknown formats
- [x] T051 [US4] Implement `AGENT/lib/report-formats.cjs` (`CHECK_GUIDE`, `renderClientReport()`, `renderCsv()`) (FR-033 to FR-035)
- [x] T052 [US4] Add the `audit` command and `--format`, `--out`, `--csv`, `--client`, `--force` to `AGENT/lib/schema-tool.cjs` (FR-036)
- [x] T053 [US4] Document the deliverables in the report skill, validation skill, README, agent specification, contract and data model

---

## Dependencies & Execution Order

- Phase 2 blocks every story. Stories 1 and 2 are independent of each other; Stories 3 and 4 read
  Story 2's output. Phase 6 runs after the stories it documents.

## Implementation Strategy

Build Story 2's vocabulary checks first (they are the exact part and carry most of the tests), then
discovery, then the report skill, then packaging.
