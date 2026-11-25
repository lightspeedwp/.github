# Implementation Plan: WordPress Schema Audit Agent

**Branch**: `aiops/wp-schema-audit-agent` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/023-wp-schema-audit-agent/spec.md`

## Summary

A portable agent with three skills (test URLs, validation, report) and one dependency-free Node.js
tool, `schema-tool.cjs`, that does the deterministic work: REST API discovery, JSON-LD extraction,
and checks against the schema.org release file and a dated table of Google rich-result rules. The
judgement work (causes, owners, what earns a rich result) stays in the report skill.

## Technical Context

**Language/Version**: Node.js 20+ (CommonJS), matching `agents/wp-db-migration-agent/lib/sql-tool.cjs`

**Primary Dependencies**: None at runtime (`node:http`, `node:https`, `node:fs`). Jest for tests,
already a repository dev dependency.

**Storage**: Vocabulary cache in `~/.cache/lightspeedwp/schemaorg/<release>/`, overridable with
`SCHEMA_TOOL_CACHE`.

**Testing**: Jest under the repository configuration, with a fetch stub and a 77-term vocabulary
fixture; no network access.

**Target Platform**: macOS and Linux shells used by the team; any WordPress site reachable over
HTTP or HTTPS.

**Project Type**: Agent with skills and a CLI tool.

**Performance Goals**: Discovery and validation of about twenty pages in under a minute on a local
site; tests under ten seconds.

**Constraints**: GET only; TLS relaxed only for local development hosts; responses capped at 20 MB,
30 seconds and five redirects.

**Scale/Scope**: One site per run; tens of pages, not whole sitemaps.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
| --- | --- | --- |
| I. Organisation-wide governance | Pass | Agent lives in this repository's portable `agents/` tree. |
| II. Locked files | Pass | No change to labels, issue types or templates. |
| III. Asset boundaries | Pass | Agent and skills under `agents/`; spec under `.github/specs/`; generated `.claude/agents/` thin definition uses the location already used by changelog-agent and wp-db-migration-agent. |
| IV. Technology-agnostic central guidance | Pass | WordPress-specific content stays inside a WordPress-specific agent; no central guidance changes. |
| V/VIII. Branch naming | Pass | `aiops/wp-schema-audit-agent`, validated. |
| VI. UK English, security | Pass | UK English throughout; read-only; no credentials; certificate checks relaxed only for local hosts; page content treated as data. |
| VII. Specification quality | Pass | Spec checklist complete, no clarification markers. |

## Project Structure

### Documentation (this feature)

```text
.github/specs/023-wp-schema-audit-agent/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── schema-tool-cli.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
agents/wp-schema-audit-agent/
├── AGENT.md                      # Index card
├── wp-schema-audit.agent.md      # Canonical specification (generator input)
├── README.md
├── CHANGELOG.md
├── package.json
├── lib/
│   ├── schema-tool.cjs           # urls | validate | audit | vocab
│   └── report-formats.cjs        # client Markdown report and findings CSV
├── skills/
│   ├── schema-test-urls/SKILL.md
│   ├── schema-markup-validation/SKILL.md
│   └── schema-audit-report/SKILL.md
└── tests/
    ├── fixtures/vocab-mini.jsonld
    └── unit/{helpers.cjs,vocabulary.test.js,validate.test.js,audit.test.js,report-formats.test.js}

.claude/agents/wp-schema-audit-agent.md     # generated thin definition
scripts/agents/generate-agent-defs.cjs      # registers the agent
```

**Structure Decision**: Mirror the WordPress DB Migration Agent (spec 024): agent-local skills, one
tool in `lib/`, tests beside it.

## Complexity Tracking

No constitution violations to justify.
