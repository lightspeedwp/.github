# Implementation Plan: Changelog Quality Audit

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Branch**: `claude/changelog-quality-audit-phase-3-2x807l` | **Date**: 2026-09-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-changelog-quality-audit/spec.md`

## Summary

Build a comprehensive changelog quality audit and validation system for LightSpeed .github organisation. The system will validate all changelog entries against a ruleset covering formatting, structure, terminology, and content quality; automatically detect and link PR/issue references; reject entries containing implementation details; collect metrics for trend analysis; provide audit reports for release managers; and integrate with CI/CD pipelines to block non-compliant entries.

**Primary Requirement**: FR-1 Entry Quality Assessment with automated validation ruleset and actionable remediation guidance.

**Technical Approach**:

- Node.js/JavaScript CLI tool for validation logic (runs on contributor machines and CI)
- Validation rule engine (pattern matching + custom logic for semantic checks)
- GitHub Actions workflow integration for PR-level validation
- Persistent metrics storage using GitHub release metadata and status checks
- Release audit command for comprehensive compliance reporting

## Technical Context

**Language/Version**: JavaScript (Node.js 18+), YAML configuration

**Primary Dependencies**:

- Octokit (GitHub API client) for PR/issue linking and status checks
- Regex-based pattern engine for formatting/content validation
- Node.js test framework (Jest or similar)

**Storage**:

- File-based: Changelog YAML/Markdown files in repository
- GitHub-native: Release metadata, commit statuses, PR comments for metrics
- Optional: JSON report files for audit trails

**Testing**: Node.js test framework (Jest), integration tests with GitHub API mocking

**Target Platform**: GitHub Cloud (SaaS), compatible with both local dev machines and GitHub Actions CI/CD

**Project Type**: CLI tool + GitHub Actions workflow + validation rule engine

**Performance Goals**:

- Single entry validation: <100ms
- Full audit (100 entries): <5 minutes including GitHub API calls
- CI/CD check completion: <2 minutes for PR with 5-10 entries

**Constraints**:

- GitHub API rate limits (5000 req/hour standard, 15000 authenticated)
- Must not modify existing changelog format (backward compatible)
- CI/CD integration must fail fast on first non-compliant entry
- All validation feedback must be actionable and specific

**Scale/Scope**:

- Support 50+ active releases per year
- Handle 1000+ changelog entries per year
- Track 20+ validation rule categories
- Support multiple release tracks (stable, beta, rc)

## Constitution Check

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

### Principles Validation

| Principle | Status | Justification |
|-----------|--------|---------------|
| Organisation-Wide Governance Authority | ✓ PASS | Centralised validation rules live in .github; all consuming repos follow same standards |
| Curated Assets with Locked Governance | ✓ PASS | Validation rule definitions in `.github/changelog-rules.yml` will be LOCKED; changes require approval |
| Clear Asset Boundaries | ✓ PASS | CLI tool lives in `agents/changelog/`, workflows in `.github/workflows/`, rules in `.github/` |
| Technology-Agnostic Guidance | ✓ PASS | Validation rules focus on user-clarity, not implementation details—universal across all projects |
| Branch Naming Strategy Non-Negotiable | ✓ PASS | Feature uses existing branch naming validation; no new exceptions introduced |
| UK English, Accessibility, Security | ✓ PASS | All output uses UK English, validation rules documented for non-technical contributors |

**Constitution Status**: ✅ PASS - Feature aligns with all six core principles. No violations or complexity justifications needed.

## Project Structure

### Documentation (this feature)

```text
specs/003-changelog-quality-audit/
├── plan.md                  # This file (current)
├── research.md              # Phase 0 - Research findings (todo)
├── data-model.md            # Phase 1 - Entity definitions (todo)
├── quickstart.md            # Phase 1 - Validation scenarios (todo)
├── contracts/
│   ├── validation-rule.contract.md       # Phase 1 - Rule contract
│   └── metrics-api.contract.md           # Phase 1 - Metrics API contract
└── tasks.md                 # Phase 2 - Implementation tasks (created by /speckit-tasks)
```

### Source Code (repository root)

```text
# Existing Structure (Foundation)
.github/
├── workflows/
│   └── changelog-validation.yml          # NEW: CI/CD integration workflow
└── changelog-rules.yml                   # NEW: Canonical validation rules (LOCKED)

agents/changelog/
├── includes/
│   ├── changelogValidator.cjs            # ENHANCED: Add quality audit logic
│   ├── changelogFormatter.cjs             # EXISTING: Reuse/enhance
│   └── changelogLinter.cjs               # NEW: Compliance checking
├── changelog.agent.js                    # ENHANCED: Add audit command
├── changelog.agent.md                    # EXISTING: Update docs
└── tests/
    ├── unit/
    │   ├── validator.test.js             # NEW
    │   ├── formatter.test.js              # NEW
    │   └── linter.test.js                 # NEW
    └── integration/
        └── github-integration.test.js     # NEW

docs/
├── CHANGELOG_QUALITY_AUDIT.md            # NEW: User-facing documentation
└── CHANGELOG_RULES.md                    # NEW: Rule catalogue and examples
```

**Structure Decision**: Single-repository approach leveraging existing `agents/changelog/` structure. CLI tool and validation engine coexist in JavaScript/Node.js. GitHub Actions workflow in `.github/workflows/` provides CI/CD integration. Validation rules stored as YAML in `.github/` for org-wide visibility and governance.

## Key Design Decisions

### 1. Validation Engine Architecture

**Decision**: Multi-layer validation (format → structure → content → reference)

- **Layer 1 (Format)**: Regex-based checks (structure, required fields, encoding)
- **Layer 2 (Structure)**: Schema validation (entries conform to changelog format)
- **Layer 3 (Content)**: Semantic checks (no implementation details, clear language)
- **Layer 4 (Reference)**: GitHub API validation (PR/issue links exist and accessible)

**Rationale**: Layered approach allows early exit on format failures (fast), semantic checks last (more expensive). Enables fine-grained reporting ("entry is well-formed but contains API references").

### 2. Rule Versioning Strategy

**Decision**: Rules are versioned; historical entries validated against the rule set in effect when they were created

- Rules stored in `.github/changelog-rules.yml` with semantic versioning
- Each entry has `validated_rule_version` metadata
- New rules can be added without retroactively invalidating old entries
- Audit reports show which rule version was applied

**Rationale**: Prevents "breaking" old entries when rules evolve. Allows continuous rule improvement without false positives on historical data.

### 3. GitHub API Integration

**Decision**: Lazy-load PR/issue details; cache for performance

- Fetch PR/issue details only when entry references them
- Cache results for 1 hour to stay within rate limits
- Graceful degradation if GitHub API unavailable (warn, don't fail)
- Pre-release entries don't require valid PR links (release audits can be more strict)

**Rationale**: GitHub API rate limits are tight. Caching prevents thrashing. Graceful degradation keeps local dev workflow functional even with network issues.

### 4. Metrics Persistence

**Decision**: Use GitHub commit metadata + optional JSON report files

- Store compliance snapshot as JSON in `.github/reports/changelog-metrics/` (daily)
- Use GitHub release description metadata to track per-release compliance
- Generate audit reports on-demand (no persistent database needed)
- Support exporting metrics to CSV for external analysis

**Rationale**: No external database dependency. Leverages existing GitHub storage. Audit trail is git-committed and immutable. Reports are reproducible from stored metadata.

## Phase 0: Research & Decisions

*Resolved NEEDS CLARIFICATION items from specification process:*

### Q1: Which changelog format does LightSpeed currently use?

**Decision**: Existing YAML format in `CHANGELOG.yml` (observed in repo)
**Rationale**: Maintain backward compatibility; don't force reformatting

### Q2: What validation rules are already in use?

**Decision**: Define 20 new core rules, build on existing `changelogValidator.cjs` patterns
**Alternatives Considered**:

- Import rules from Keep a Changelog spec (too generic for LightSpeed)
- Define 50+ rules (too complex for v1)
**Chosen**: 20 focused rules targeting the 6 FRs

### Q3: How to handle validation rule overrides?

**Decision**: Release managers can override with explicit `--force` flag; logged for audit trail
**Rationale**: Flexibility for urgent hotfixes; auditability for compliance

### Q4: Multi-branch validation strategy?

**Decision**: Validate against main release track by default; support `--branch` flag for feature branches
**Rationale**: Most entries go to main; feature branches can opt-in to strict validation

## Phase 1: Design & Contracts

### 1. Data Model

**ChangelogEntry** (YAML schema)

```yaml
version: "1.0.0"
date: 2026-09-12
category: feature  # feature|fix|improvement|breaking-change
title: "Changelog Quality Audit System"
description: "Automated validation of changelog entries..."
pr_references: [#2906]
issue_references: [#1234]
components: [ci, automation]  # optional
validation_score: 95
compliance_status: passing  # passing|warning|failing
validation_details:
  - rule: no_implementation_details
    status: passing
  - rule: has_pr_reference
    status: passing
```

**ValidationRule** (YAML schema)

```yaml
id: rule_001
name: no_implementation_details
rule_type: content  # format|content|reference|structure
severity: error  # error|warning
description: "Entry must not contain implementation details (API names, code patterns, internal terminology)"
patterns:
  - regex: '\b(API|method|class|function|interface|const|let|var|async|await|promise)\b'
    context: "code reference detected"
remediation_guidance: |
  Remove technical jargon. Use user-facing language.
  Example: "Fixed API response handling" → "Improved error handling for network issues"
enabled: true
version: "1.0"
```

**MetricsSnapshot** (JSON format)

```json
{
  "snapshot_date": "2026-09-12T00:00:00Z",
  "total_entries": 247,
  "compliant_entries": 235,
  "compliance_percentage": 95.1,
  "most_common_violations": [
    "missing_pr_reference",
    "implementation_details_detected"
  ],
  "average_quality_score": 92.3,
  "entries_by_category": {
    "feature": 120,
    "fix": 100,
    "improvement": 20,
    "breaking_change": 7
  }
}
```

**ValidationReport** (JSON format)

```json
{
  "report_date": "2026-09-12T14:30:00Z",
  "scope": "release:v1.2.0",
  "total_entries_audited": 45,
  "passed_count": 42,
  "failed_count": 3,
  "compliance_percentage": 93.3,
  "issues_by_category": {
    "implementation_details": 2,
    "missing_pr_reference": 1
  },
  "failing_entries": [
    {
      "version": "1.2.0",
      "title": "Added webhook API support",
      "issues": ["Contains 'API' (code reference)", "Missing PR reference"],
      "remediation": "Remove 'API', add PR link"
    }
  ],
  "generated_by": "changelog-validator v0.1.0"
}
```

### 2. Validation Rule Contracts

**20 Core Validation Rules**:

| Rule ID | Rule Name | Type | Severity | Purpose |
|---------|-----------|------|----------|---------|
| R001 | no_implementation_details | content | error | Reject code patterns, API names, framework references |
| R002 | has_category | structure | error | Entry must specify category (feature/fix/etc) |
| R003 | has_title | structure | error | Entry must have descriptive title (3-50 chars) |
| R004 | has_description | structure | error | Entry must have user-facing description |
| R005 | clear_language | content | warning | Avoid jargon; use simple, active voice |
| R006 | proper_formatting | format | error | Valid YAML/Markdown syntax |
| R007 | no_backticks | content | error | No code blocks or inline code in description |
| R008 | no_internal_terminology | content | error | Reject internal project terms (e.g., "backend", "service mesh") |
| R009 | has_pr_reference | reference | warning | Should reference a PR or issue |
| R010 | valid_pr_reference | reference | error | PR references must exist and be accessible |
| R011 | meaningful_description | content | warning | Description should be substantive (20+ chars) |
| R012 | user_focused | content | warning | Describe user benefit, not implementation |
| R013 | no_emoji | content | warning | Avoid emoji in formal changelog |
| R014 | consistent_tense | content | warning | Use consistent past/present tense |
| R015 | proper_dates | format | error | Dates must be ISO 8601 format |
| R016 | no_todos | content | error | No TODO or FIXME in final entries |
| R017 | appropriate_length | content | warning | Description should be 1-3 sentences |
| R018 | no_personal_pronouns | content | warning | Avoid "I", "we", "you"; use passive voice |
| R019 | no_marketing_hype | content | warning | Avoid superlatives ("amazing", "revolutionary") |
| R020 | valid_category | structure | error | Category must be in allowed list |

### 3. Public Contracts (for consumers)

**ValidationRule Contract** (`contracts/validation-rule.contract.md`):

- Input: ChangelogEntry YAML
- Process: Apply rule engine to entry
- Output: ValidationResult { rule_id, status, message, remediation_guidance }
- Error Handling: Rule application failures logged; validation continues with other rules
- Rate Limits: N/A (local processing)

**MetricsAPI Contract** (`contracts/metrics-api.contract.md`):

- Endpoint: GitHub release metadata API
- Input: Repository, release tag
- Output: MetricsSnapshot with compliance data
- Error Handling: Graceful degradation if GitHub API unavailable
- Rate Limits: GitHub API standard limits apply (5000 req/hour)

### 4. Quickstart Scenarios

**Scenario 1: Validate a Single Changelog Entry (Local Development)**

```bash
# Run validator on an entry
changelog-validator validate --entry path/to/entry.yml
# Expected: Pass/fail with specific feedback

# Test against implementation detail patterns
echo "title: Fixed webhook API response" | \
  changelog-validator validate --input -
# Expected: Fail - contains "API" code reference
```

**Scenario 2: Run Full Release Audit (Release Manager)**

```bash
# Audit all entries for a release
changelog-validator audit --release v1.2.0
# Expected: Report with compliance %, issue breakdown, remediation list

# Generate compliance certificate
changelog-validator audit --release v1.2.0 --certificate
# Expected: JSON report ready for external communications
```

**Scenario 3: CI/CD Integration (GitHub Actions)**

```bash
# Workflow checks entries on PR
changelog-validator check-pr --pr 2906
# Expected: Pass PR check if all entries compliant; fail with comment if not

# Override non-compliance (release manager only)
changelog-validator check-pr --pr 2906 --force
# Expected: Check passes; logged for audit trail
```

**Scenario 4: Metrics & Trending (Analytics)**

```bash
# Collect daily metrics
changelog-validator metrics snapshot
# Expected: JSON stored in .github/reports/changelog-metrics/

# Export to CSV for external analysis
changelog-validator metrics export --format csv --output report.csv
# Expected: CSV with trend data
```

## Timeline & Effort

**Total Effort**: 58-73 hours over 7 weeks

### Phase Breakdown

| Phase | Duration | Effort | Deliverables |
|-------|----------|--------|--------------|
| Phase 1: Setup & Validation Engine | Week 1 | 12-15h | Core validator, test framework, rule engine |
| Phase 2: Content Analysis & Detection | Week 1-2 | 10-12h | Implementation detail patterns, semantic checks |
| Phase 3: GitHub Integration | Week 2 | 8-10h | PR/issue linking, API caching, status checks |
| Phase 4: Audit & Reporting | Week 3 | 10-12h | Audit command, report generation, metrics |
| Phase 5: CI/CD Integration | Week 4 | 8-10h | GitHub Actions workflow, overrides, logging |
| Phase 6: Metrics & Analytics | Week 4-5 | 6-8h | Snapshot collection, export, trending |
| Phase 7: Documentation & Polish | Week 5-6 | 4-6h | User docs, rule catalogue, edge case handling |

**Staffing**: 1-2 developers; CI/CD environment; 1-2 hours/week for code review

## Next Steps

1. ✅ **Phase 0 Complete**: Research and technical decisions documented above
2. ✅ **Phase 1 In Progress**: Data model, contracts, quickstart scenarios defined
3. ⏭️ **Next**: Run `/speckit-tasks` to generate 83 implementation tasks across 7 phases
4. ⏭️ **Then**: Begin Phase 3 implementation (Entry Quality Assessment, 12 tasks)

---

**Ready for Phase 2 task breakdown?** Run `/speckit-tasks` to generate the implementation task list.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
