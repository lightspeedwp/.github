# Implementation Plan: Governance Audit Implementation Workflow

**Branch**: `audit/governance-audit-implementation` | **Date**: 2026-09-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `.github/specs/006-governance-audit/spec.md`

**Note**: This plan describes the technical architecture for systematic governance auditing, validation, and remediation guidance.

## Summary

Implement a comprehensive governance audit system that systematically validates LOCKED governance files (labels.yml, issue-types.yml, PR templates, issue templates) against constitutional principles and governance standards. The system provides three integrated capabilities:

1. **P1 Audit Capability** — Scan governance files, detect violations, generate compliance reports
2. **P2 Validation Capability** — Pre-commit validation that prevents inconsistencies from being introduced
3. **P3 Remediation Capability** — Generate actionable remediation plans with impact assessment and rollback guidance

## Technical Context

**Language/Version**: Node.js 18+ (JavaScript/TypeScript) — chosen for scripting simplicity, YAML/JSON parsing libraries, and CI/CD integration

**Primary Dependencies**: 
- `js-yaml` (YAML parsing and validation)
- `ajv` (JSON Schema validation for governance contracts)
- `chalk` (colored terminal output for reports)
- Built-in `fs`, `path`, `glob` modules for file operations

**Storage**: File-based (reads from `.github/` directory; reports written as JSON and Markdown files in `.github/reports/`)

**Testing**: Node.js test framework (`jest` or `tap`) for unit tests; sample governance files for integration testing

**Target Platform**: Linux/macOS command-line; runs in GitHub Actions CI/CD environment

**Project Type**: CLI tool / governance automation framework (not a traditional application)

**Performance Goals**: 
- Audit completion: <30 seconds for all LOCKED files in this repository
- Validation: <2 seconds per file on pre-commit
- Report generation: <5 seconds for full compliance report

**Constraints**: 
- Must run in GitHub Actions with no external dependencies (no network calls to external services)
- Must respect `.github/` file structure without modifications during audit
- Audit must be read-only (never modifies governance files)

**Scale/Scope**: 
- ~160 labels across 5+ label families
- ~24 issue types
- ~26 issue templates + ~19 PR templates
- Audit 50+ repositories for cross-repo consistency (Phase 2+)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Constitution Alignment — ALL PASS**:

1. **Section I (Organisation-Wide Governance Authority)**: Audit system enforces `.github/` as authoritative source of truth — COMPLIANT
2. **Section II (Curated Assets with Locked Governance)**: Audit validates LOCKED files and detects drift from curated state — COMPLIANT
3. **Section III (Clear Asset Boundaries)**: Audit system lives in `.specify/scripts/bash/audit-governance.sh` (portable asset) and `.github/scripts/validate-governance.cjs` (repo-local validation) — COMPLIANT
4. **Section IV (Technology-Agnostic Guidance)**: Audit validates governance principles universally applicable across all org tech stacks — COMPLIANT
5. **Section V (Branch Naming Strategy)**: Audit validates branch naming compliance per constitution Section VIII (34 authorized types) — COMPLIANT
6. **Section VII (Specification Quality Standards)**: Audit itself validates specifications meet 8 quality dimensions — COMPLIANT
7. **Section VIII (Branch Strategy Compliance)**: Audit verifies PR template routing and branch type mappings — COMPLIANT
8. **Section IX (Requirements-Driven Quality)**: Audit validates changelog compliance and requirement quality standards — COMPLIANT
9. **Section X (Automated Validation & Metrics-Driven Governance)**: Audit system generates compliance metrics dashboard — COMPLIANT

✅ **No Constitution Violations** — Design aligns with all 10 core principles

## Project Structure

### Documentation (this feature)

```text
.github/specs/006-governance-audit/
├── spec.md                          # User-facing feature specification
├── plan.md                          # This file (implementation plan)
├── research.md                      # Phase 0: Research findings (if NEEDS CLARIFICATION exists)
├── data-model.md                    # Phase 1: Governance data model & validation rules
├── quickstart.md                    # Phase 1: Running audits & validating output
├── contracts/                       # Phase 1: Interface specifications
│   ├── audit-rule.contract.md       # Audit rule validation contract
│   ├── audit-report.contract.md     # Audit report output contract
│   └── remediation.contract.md      # Remediation guidance contract
├── checklists/
│   └── requirements.md              # Quality validation checklist
└── tasks.md                         # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
.specify/scripts/bash/
├── audit-governance.sh              # Main audit entrypoint (portable)
└── generate-remediation.sh          # Remediation plan generator (portable)

.github/scripts/
├── validate-governance.cjs          # Pre-commit validation hook (repo-local)
└── governance-rules.json            # Audit rules configuration

.github/reports/
├── governance-audit-[DATE].json     # Audit report (machine-readable)
├── governance-audit-[DATE].md       # Audit report (human-readable)
├── governance-compliance-[DATE].json # Compliance metrics (daily)
└── remediation-plan-[ID].md         # Generated remediation guidance
```

**Structure Decision**: Two-tier approach — Portable governance audit scripts in `.specify/scripts/bash/` (discoverable, reusable across repos) combined with repo-local validation hooks in `.github/scripts/` (GitHub Actions integration). Reports generated in `.github/reports/` for archival and compliance tracking.

## Complexity Tracking

> **No Constitution violations to justify — design is fully compliant**

All design decisions align with constitution principles. No workarounds, exceptions, or trade-offs required.
