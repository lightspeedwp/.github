# Implementation Plan: Changelog Agent Quality & Validation Framework

**Branch**: `refactor/changelog-agent-quality` | **Date**: 2026-09-23 | **Spec**: [./spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/016-changelog-agent-quality/spec.md`

## Summary

Complete the changelog agent around the shipped validation engine at
`.github/validation/changelog/`. Add the repository-root convenience command,
move reusable changelog operations into Agent Skills directories with valid
`SKILL.md` entrypoints, add link-check and merge capabilities, document the
interfaces, and integrate validation status with the existing workflow and
canonical labels. Reuse the current rules and parser instead of introducing a
second validation implementation.

## Technical Context

**Language/Version**: Node.js 24.20.0 from `.nvmrc`; production packages retain
their documented Node.js 18-or-later compatibility where tests prove it.

**Primary Dependencies**: npm 11, yargs 17 in
`.github/validation/changelog/`, Jest 30 and js-yaml 5 in
`agents/changelog-agent/`, and the existing GitHub/Octokit integrations.

**Storage**: Repository files (`CHANGELOG.md`, JSON rules, generated JSON
reports, and short-lived lock/reader metadata). No database is introduced.

**Testing**: Node's test runner for `.github/validation/changelog/`; Jest for
`agents/changelog-agent/` and root validation utilities; shell smoke tests for
the npm entrypoints; workflow syntax and repository validation commands.

**Target Platform**: Linux GitHub Actions runners and local macOS/Linux
developer environments with repository file access.

**Project Type**: Multi-package Node.js command-line and GitHub Actions
automation inside the existing governance repository.

**Performance Goals**: Local validation completes within 5 seconds for normal
repository changelogs; link checking completes within 30 seconds subject to
GitHub API latency; file-lock retries use the specified 5-second bound.

**Constraints**: Preserve the shipped validator's text/JSON interface and
eight rules; use only canonical `meta:` labels; keep reusable skills under
`agents/changelog-agent/skills/`; do not duplicate validation logic; reject
repository-path traversal; preserve concurrent readers while serialising
writes.

**Scale/Scope**: Four changelog skills, one existing validator package, one
root npm alias, the changelog validation/management workflows, agent
documentation, and focused tests for CLI, metadata, locking, paths, and labels.

## Constitution Check

GATE: Passed before implementation; re-check after design and before merge.

| Principle                               | Plan evidence                                                                                                                       | Status |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| I. Governance authority                 | Uses repository rules, canonical workflows, and the canonical label set                                                             | Pass   |
| II. Locked governance                   | No locked labels, issue types, or templates are edited; missing labels require the documented approval process                      | Pass   |
| III. Clear asset boundaries             | Portable skill code stays in `agents/changelog-agent/skills/`; repository-only validation and workflows remain under `.github/`     | Pass   |
| VI. UK English, accessibility, security | Documentation uses UK English; CLI output remains text/JSON; path traversal, token handling, and stale locks are explicitly covered | Pass   |
| VII. Specification quality              | CLI, REST, data model, concurrency, and Agent Skills contracts are concrete and cross-checked                                       | Pass   |
| IX. Changelog compliance                | Reuses the current length, link, format, and clarity rules and keeps failures merge-blocking                                        | Pass   |
| X. Automated validation                 | Adds focused automated tests and preserves workflow reporting and metrics                                                           | Pass   |

Post-design review confirms no locked governance asset or new framework is
required. If canonical labels are absent, implementation stops at a documented
label-change request rather than editing `.github/labels.yml`.

## Project Structure

### Documentation (this feature)

```text
.github/specs/016-changelog-agent-quality/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── spec.md
├── checklists/requirements.md
└── contracts/
    ├── cli-interface.md
    └── rest-api-interface.md
```

### Source Code (repository root)

```text
package.json                                  # root changelog command aliases
.github/validation/changelog/
├── bin/validate.js                           # shipped validation CLI
├── lib/                                      # parser, rules, reports, CI context
├── rules.json
├── package.json
└── test/                                     # validator unit/integration tests
agents/changelog-agent/
├── package.json
├── skills/
│   ├── changelog-validate/
│   │   ├── SKILL.md
│   │   └── scripts/
│   ├── changelog-check-links/
│   │   ├── SKILL.md
│   │   └── scripts/
│   ├── changelog-merge/
│   │   ├── SKILL.md
│   │   └── scripts/
│   └── changelog-format/
│       ├── SKILL.md
│       └── scripts/
└── tests/
    ├── unit/
    ├── integration/
    └── fixtures/
.github/workflows/
├── changelog-validation.yml
└── changelog-management.yml
docs/agents/changelog-agent/
├── README.md
├── SKILLS.md
├── INTEGRATION.md
├── TROUBLESHOOTING.md
└── API.md
```

**Structure Decision**: Keep the existing validator package as the single
validation engine and expose it through the root npm alias and validate skill.
Place new reusable link-check, merge, and format operations beside the existing
agent under skill directories. Workflows orchestrate these commands but do not
contain business logic. The optional REST interface remains design-only until a
consumer justifies a server package.

## Implementation Approach

1. Add `changelog:validate` at the repository root as a transparent wrapper for
   `.github/validation/changelog/bin/validate.js`; preserve `--output text|json`,
   defaults, and exit status.
2. Create or correct the four skill directories. Each `SKILL.md` uses standard
   `name` and `description` frontmatter plus namespaced string values under
   `metadata` for version, triggers, inputs, outputs, and error codes.
3. Make the validate skill call the shipped engine. Extract existing link,
   merge, and format logic into the other skills without copying parser or rule
   implementations.
4. Centralise repository-relative path resolution. Reject absolute, escaping,
   or escaping-symlink paths before reads and writes; bind any future REST write
   to the server-side repository identifier.
5. Implement the reader/writer protocol from `research.md`: reader markers for
   validation, writer intent before draining readers, an exclusive write lock,
   heartbeats, owner tokens, and conservative stale recovery.
6. Update changelog workflows to use the root command, preserve validation exit
   codes, publish actionable status, and apply only existing canonical labels.
7. Complete agent documentation and run the quickstart scenarios against the
   shipped interface.

## Validation and Tests

1. Unit-test CLI argument defaults, text/JSON formats, parse errors, missing
   files, pass/warning/fail gates, and full-entry traversal.
2. Unit-test skill frontmatter discovery and all required standard/project
   metadata fields.
3. Unit-test repository path acceptance and rejection for relative, absolute,
   traversal, Windows-style, and symlink-escape inputs.
4. Exercise concurrent readers, writer intent, merge waiting, active-owner lock
   retention, stale-owner recovery, token-safe release, and timeout behaviour.
5. Integration-test validate, check-links with mocked GitHub responses, merge
   atomic writes, dry runs, backups, and format output.
6. Run the affected Node/Jest suites, targeted ESLint and Markdown lint,
   workflow validation, JSON/schema validation, `git diff --check`, and the
   quickstart shell commands.
7. Re-run the constitution table after implementation and record any approved
   exception before merge.

## Complexity Tracking

No constitution violations or complexity exceptions are planned. The existing
Node/npm packages, file storage, workflows, and validation engine cover the
feature; no database, web server, queue, or second validation framework is
introduced.
