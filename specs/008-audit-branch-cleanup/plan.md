# Implementation Plan: Branch Cleanup Infrastructure

**Branch**: `008-audit-branch-cleanup` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-audit-branch-cleanup/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build comprehensive branch cleanup infrastructure to automatically categorise branches as KEEP, DELETE, or DISCUSS using an 8-gate decision tree. Collect metadata via Git and GitHub API integration, support flexible exclusion patterns, provide safe deletion with dry-run mode, and generate comprehensive reports in Markdown and JSON formats.

## Technical Context

**Language/Version**: Node.js 22+ (ES modules)

**Primary Dependencies**: git CLI, GitHub API (gh CLI), no external npm dependencies required

**Storage**: N/A (report output to filesystem, no database)

**Testing**: Node.js built-in test runner or Jest/Vitest

**Target Platform**: Linux/macOS (git operations environment, organisation `.github` repository)

**Project Type**: CLI tool + reusable library

**Performance Goals**: Process 100+ branches in <10 seconds; GitHub API calls optimised with efficient querying

**Constraints**: <50 MB memory footprint; must handle rate limiting gracefully

**Scale/Scope**: Support repositories with 50–1000+ branches; organisation-wide reporting

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I – Organisation-Wide Governance Authority**: ✅ PASS  
This feature enhances `.github` repository by providing organisation-wide branch cleanup capabilities that support governance automation. Feature is portable and reusable across all repositories.

**Principle II – Curated Assets with Locked Governance**: ✅ PASS  
Feature does not modify LOCKED files (labels.yml, issue-types.yml, templates). Categorisation rules are internal to feature library and do not impact PR routing or template assignment.

**Principle III – Clear Asset Boundaries**: ✅ PASS  
CLI entry point and reusable library modules placed in `scripts/` (CLI) and `scripts/lib/` (libraries). Reports placed in `.github/reports/`. No duplication of guidance in spec files.

**Principle IV – Technology-Agnostic Guidance**: ✅ PASS  
Feature is technology-neutral: operates on git operations and GitHub API (available across all repositories regardless of tech stack). No framework-specific or language-specific assumptions.

**Principle V – Branch Naming Strategy is Non-Negotiable**: ✅ PASS  
Feature enforces branch name validation: pattern `{type}/{scope}-{title}`, 30+ allowed types, forbidden prefixes (`claude/`, `copilot/`, `openai/`). Supports clean categorisation based on valid branch names.

**Principle VI – UK English, Accessibility, Security Standards**: ✅ PASS  
All documentation uses UK English spelling (optimise, organisation). Error handling follows security-first mindset (no hardcoded secrets, input validation). No accessibility concerns (CLI tool, not UI).

**Overall Constitution Status**: ✅ PASS – Feature aligns with all governance principles.

## Project Structure

### Documentation (this feature)

```text
specs/008-audit-branch-cleanup/
├── spec.md              # Feature specification (user stories, acceptance criteria)
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command) — TBD
├── data-model.md        # Phase 1 output (/speckit-plan command) — TBD
├── quickstart.md        # Phase 1 output (/speckit-plan command) — TBD
├── contracts/           # Phase 1 output (/speckit-plan command) — TBD
└── tasks.md             # Phase 2 output (/speckit-tasks command) — TBD
```

### Source Code (repository root)

```text
.github/
├── scripts/
│   ├── cleanup-branches.js           # CLI entry point
│   ├── lib/
│   │   ├── branch-categorization.js  # 8-gate decision tree
│   │   ├── age-calculator.js         # Age calculation utilities
│   │   ├── git-merge-utils.js        # Git merge detection
│   │   ├── github-pr-utils.js        # GitHub PR detection
│   │   ├── exclusion-patterns.js     # Regex exclusion patterns
│   │   ├── report-formatter.js       # Report generation
│   │   └── constants.js              # Shared constants
│   └── tests/
│       ├── unit/                     # Unit tests for each library module
│       ├── integration/              # Integration tests (git + GitHub)
│       └── fixtures/                 # Test data and mock responses
├── reports/
│   └── branch-cleanup/               # Generated cleanup reports (Markdown & JSON)
└── workflows/
    └── branch-cleanup.yml            # (Optional) Scheduled cleanup workflow
```

**Structure Decision**: Modular library architecture with CLI entry point. CLI script orchestrates library modules for categorisation, metadata collection, deletion, and reporting. Reports saved to `.github/reports/branch-cleanup/` with timestamp naming. All modules use ES modules (Node.js 22+) with zero external dependencies required.

