# Implementation Plan: Portable Changelog and WordPress Release Preparation Agents

**Branch**: `docs/portable-changelog-release-agents` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/020-portable-changelog-release-agents/spec.md`, plus the planning note that Linear is the primary issue-planning system and epic GIT-1293 with its children is central to spec 020.

## Summary

Deliver two manually invoked agents by hardening what already exists: the release agent (`agents/release-agent/`) becomes a read-only-by-default readiness and approved-preparation agent that honours an explicit repository root, and the changelog agent (`agents/changelog-agent/`) becomes a standalone inspect/draft/validate/prepare agent that reuses the shipped validation engine. The WordPress utilities (`agents/wordpress-release-utilities-agent/`) are absorbed as release adapter functionality after their callers and tests are migrated. A fail-closed verification handoff joins the two. This plan is design only: no runtime, package or workflow change is made by this specification PR.

The code audit in [research.md](./research.md) found concrete gaps between today's code and the spec, which the implementation slices must close (explicit root propagation, dirty tree as a hard stop, control-plane misdetection, ESM/CJS boundary, remote-effect operations in the preparation path).

## Linear and issue-tracking context

Linear is where issue planning happens, so epic [GIT-1293](https://linear.app/lightspeedwp/issue/GIT-1293/epic-portable-agents-deliver-the-essential-first-wave) and its children are authoritative for ownership, status and sequencing. They were read on 2026-10-09 (the Linear connector became available mid-session); the GitHub mirror is [lightspeedwp/.github#1546](https://github.com/lightspeedwp/.github/issues/1546).

**GIT-1293**: status Tracking, assignee Ash Shaw, 18 children (3 Done: GIT-1306, GIT-1308, GIT-1314). The epic description still carries the broad release-redesign scope and states that its older phase status and "no blockers" claims are historical, not verified.

**Spec 020 slices as they exist in Linear**:

| Linear | GitHub | Title in Linear | Status | Assignee | Parent |
|--------|--------|-----------------|--------|----------|--------|
| GIT-1302 | #1555 | aiops: release-agent - Specify portable multi-repo support | In Progress | Ash Shaw | GIT-1293 |
| GIT-1303 | #1556 | aiops: changelog-agent - Define the changelog agent specification | Backlog | Ash Shaw | GIT-1293 |
| GIT-1300 / 1301 / 1304 | #1553 / #1554 / #1557 | requirements, architecture, WordPress versioning design | Backlog / Todo / Todo | Ash Shaw | GIT-1293 |
| GIT-1312 / 1313 | #1565 / #1566 | WordPress plugin and theme version handling | Todo | Ash Shaw | GIT-1293 |
| GIT-1310 | #1563 | aiops: release-agent - Build portable agent | In Progress | Ash Shaw | none |
| GIT-1744 | #2653 | aiops: changelog-automation - Create portable shared skill | Todo | Chris | none |
| GIT-2623 | #3880 / PR #3881 | aiops: release agents - Consolidate release and changelog agent guidance | In Review | Zared | none |
| GIT-2624 | #3470 | docs: changelog-agent - Document specification decisions | Todo | Ash Shaw | GIT-1293 |
| GIT-2617 | #3873 | aiops: developer-onboarding - Define agent configuration | Todo | Warwick | GIT-2614 |

**Consequences for this plan**:

- The release MVP (GIT-1310), the changelog MVP (GIT-1744) and the consolidation (GIT-2623) are not children of GIT-1293. Linking them is a planning decision for the owner; this plan does not reparent anything.
- Titles in Linear differ from the titles the source brief proposed (for example GIT-1310 is "Build portable agent", GIT-1744 is "Create portable shared skill"). Title and scope changes belong in `issue-map.md` as previews requiring approval.
- GIT-1744's owner is Chris and GIT-2623's is Zared; ownership is preserved.
- GIT-1303 is in Backlog (the brief assumed a reopened or Done state); its labels contain legacy `migrate:` values and a `type:bug` label that do not match its aiops title. Cleanup is a proposal, not an action.
- GIT-1297 (authorisation gating failure) is related to the epic and is out of spec 020 scope.

Children of the epic outside spec 020 (GIT-701 pr-agent, GIT-106 issue-agent, GIT-1305 and GIT-1315 to GIT-1317 documentation, GIT-1307 and GIT-1309 workflows) are roadmap or later slices, per the spec's scope boundaries. No Linear record has been changed.

## Technical Context

**Language/Version**: Node.js with CommonJS (`.cjs`) for the release and changelog agent modules, matching existing agents; no incidental migration to ESM or TypeScript. `wordpress.agent.js` is currently ESM and needs an explicit interop boundary (research R-04).

**Primary Dependencies**: none new. Existing: the shipped changelog validation engine at `.github/validation/changelog/` (ESM package, `bin/validate.js`), Node built-ins, `git`. No Python, no new test framework.

**Storage**: files only (version fields, `CHANGELOG.md`); no database. Handoff evidence is a structured JSON document passed between agents.

**Testing**: Jest 30.x via `.jest.config.cjs` for JavaScript (`scripts/__tests__/` or `scripts/adapters/__tests__/` per agent); Bash/Bats under agent-root `tests/` with fixtures. Existing Node-test, PHP and Playwright tests stay where they are. Discovery and package commands must be verified before any test moves.

**Target Platform**: local CLI and Claude (local and cloud) discovery; macOS paths use `~/` or `/Users/<username>`. Other providers are unverified and out of MVP claims (FR-020).

**Project Type**: portable agent packages (Markdown definition plus Node scripts and skills), not an application.

**Performance Goals**: none specified; correctness and zero-write dry runs outrank speed. No numeric targets are invented.

**Constraints**: explicit `repoRoot` on every filesystem and git call; dry run by default; fail closed; no broad staging, auto-stash, remote effects, tag creation or publication during preparation; no locked governance edits.

**Scale/Scope**: two user-facing agents, one absorbed utilities module, one handoff contract, fixtures for the cases listed in FR-022.

## Constitution Check

*GATE: passed before research; re-checked after design (below).*

| Principle | Assessment |
|-----------|------------|
| I Governance authority | Pass. Spec lives in `.github/specs/`; no override of org rules. |
| II Locked governance | Pass. No label, issue-type, template or routing edits; the `pr_docs.md` / `pr_aiops.md` label conflict is surfaced, not changed. |
| III Asset boundaries | Pass. Portable agents stay in top-level `agents/`; only the specification is under `.github/`. |
| IV Technology-agnostic guidance | Pass with note. WordPress-specific behaviour lives in the release adapter and agent docs, not in central guidance. |
| V and VIII Branch naming | Pass. `docs/portable-changelog-release-agents`; later slices use `aiops/` per the delivery profiles. |
| VI UK English, accessibility, security | Pass. Path-safety and no-secrets requirements are explicit (FR-006, FR-019). |
| VII Specification quality | Pass for the spec checklist; three open decisions remain and are carried into research as provisional, not closed. |
| IX Changelog compliance | Pass. Entries must stay within the length rule and link to PRs/issues; the agent validates using the shipped engine. |
| X Metrics-driven governance | Pass. No new dashboards; reuses existing validation output. |

**Gate risk (not a violation)**: the Specification Validation check on the spec PR currently fails on the 019 numbering gap (reserved Qodo spec). Resolution is owner-decided; see the PR comment and [research.md](./research.md) R-11.

**Post-design re-check**: no new violations. The Complexity Tracking table is not needed.

## Project Structure

### Documentation (this feature)

```text
.github/specs/020-portable-changelog-release-agents/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: decisions, code audit, open items
├── data-model.md        # Phase 1: entities and states
├── quickstart.md        # Phase 1: validation scenarios
├── contracts/
│   ├── readiness-report.md
│   ├── verification-handoff.md
│   └── agent-package-layout.md
├── checklists/
│   └── requirements.md
├── issue-map.md         # Pending: needs live GitHub and Linear reads and approval
├── delivery-plan.md     # Pending: depends on issue-map.md
└── tasks.md             # Phase 2: created by /speckit-tasks, not by this command
```

### Source Code (repository root)

Target layout for the implementation slices (not created by this PR). Paths follow the approved package shape in FR-017; the exact reconciliation with the in-flight consolidation (#3880 / PR #3881) is a prerequisite recorded in research R-02.

```text
agents/release-agent/
├── AGENT.md                      # one canonical definition
├── README.md
├── CHANGELOG.md                  # agent changelog
├── package.json                  # and lockfile only where convention requires
├── scripts/
│   ├── release.agent.cjs         # orchestration: readiness, approved preparation
│   ├── adapters/                 # absorbed WordPress plugin/theme/readme adapters
│   │   └── __tests__/
│   └── __tests__/
├── skills/<capability>/SKILL.md  # namespaced skills
├── claude/                       # small Claude adapter
└── tests/                        # Bats plus fixtures

agents/changelog-agent/
├── AGENT.md
├── README.md
├── CHANGELOG.md
├── package.json
├── scripts/
│   └── __tests__/
├── skills/<capability>/SKILL.md  # five-operation shared-skill obligations preserved
├── claude/
└── tests/

.github/validation/changelog/     # shipped engine: reused, not copied or forked
```

**Structure Decision**: extend the two existing agent packages in place and fold `wordpress-release-utilities-agent` into the release agent's adapters after a caller, export and test inventory. No third orchestration agent, no gratuitous `includes/`, `gates/`, `shared/`, `results/` or `manifest/` trees, and no fake empty skills. Whether the adapter lands as one module or two reviewed slices is open decision 3 (research R-06).

## Phase 0 and Phase 1 Outputs

- Phase 0: [research.md](./research.md)
- Phase 1: [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

## Complexity Tracking

No constitution violations to justify.
