# Research: Branch Cleanup Infrastructure

**Phase**: 0 (Outline & Research) | **Date**: 2026-09-16 | **Status**: Complete

## Overview

Research phase confirms no NEEDS CLARIFICATION items in the technical context. All key decisions have been validated through existing library implementation and architecture.

## Technology Decisions

### Decision: Node.js 22+ with ES Modules

**Choice**: Node.js 22+ with native ES modules (no transpilation, no external build step)

**Rationale**:
- Aligns with existing `.github` repository stack (Node.js 22+)
- Native ES modules support in Node.js 20+ (LTS) and 22+
- Zero external dependencies required (git CLI, gh CLI are system dependencies)
- Simple, maintainable, and performant for CLI tools

**Alternatives Considered**:
- TypeScript with tsc: Added compilation step, slower development iteration
- CommonJS: Older, less maintainable, requires transpilation for modern syntax
- Deno: Out-of-scope ecosystem for this organisation

**Validation**: ✅ Confirmed in existing `cleanup-branches.js` and library modules

---

### Decision: 8-Gate Categorisation Decision Tree

**Choice**: Sequential evaluation gates in strict order: (1) protected, (2) excluded pattern, (3) open PR, (4) invalid name, (5) unmerged stale, (6) age threshold, (7) policy violations, (8) unclear

**Rationale**:
- Deterministic outcome: every branch reaches exactly one category
- No ambiguity: gates are evaluated in fixed order with no backtracking
- Unambiguous reporting: categorisation reasons are clear and auditable
- Prevents false positives: protected/active branches evaluated first

**Alternatives Considered**:
- Weighted scoring system: Would introduce ambiguity, harder to reason about decisions
- Machine learning model: Overkill for rule-based logic, black-box decision making
- Single-pass evaluation: Would lose determinism if gates overlap

**Validation**: ✅ Confirmed in `scripts/lib/branch-categorization.js` implementation

---

### Decision: Git Merge Detection via `git merge-base --is-ancestor`

**Choice**: Use `git merge-base --is-ancestor BASE BRANCH` to detect if branch is merged to base branches (develop, main)

**Rationale**:
- Standard git command available on all systems
- Accurate: detects both direct merges and rebased commits
- Performant: single command per branch
- No external dependencies

**Alternatives Considered**:
- GitHub API merge detection: Would require API calls (rate limiting, latency)
- Git log parsing: More complex, error-prone with rebased branches
- Branch comparison: Less reliable than merge-base

**Validation**: ✅ Confirmed in `scripts/lib/git-merge-utils.js` implementation

---

### Decision: GitHub PR Detection via `gh pr list`

**Choice**: Use GitHub CLI (`gh`) to query open PRs by branch head

**Rationale**:
- Official GitHub integration
- Handles authentication and rate limiting transparently
- Efficient: single query for all open PRs
- Error handling built-in

**Alternatives Considered**:
- Octokit.js: External dependency, adds npm footprint
- GraphQL API directly: Requires auth token management
- Manual git operations: Cannot detect PRs without API

**Validation**: ✅ Confirmed in `scripts/lib/github-pr-utils.js` implementation

---

### Decision: Flexible Exclusion Patterns with Regex

**Choice**: User-defined regex patterns with default `release/.*` and `hotfix/.*`

**Rationale**:
- Flexible: supports any naming pattern (not just release/hotfix)
- Default safety: preserves release and hotfix branches by policy
- User-friendly: piped or comma-separated patterns
- Regex is standard across Unix tools

**Alternatives Considered**:
- Hardcoded list: Not flexible, requires code changes for new patterns
- Glob patterns: Less expressive than regex, would need conversion layer
- Simple prefix matching: Insufficient for complex patterns

**Validation**: ✅ Confirmed in `scripts/lib/exclusion-patterns.js` implementation

---

### Decision: Markdown and JSON Report Formats

**Choice**: Two report formats: Markdown (human-readable) and JSON (automation-friendly)

**Rationale**:
- Markdown: Readable in GitHub, suitable for human review and PRs
- JSON: Machine-parseable for downstream automation (CI/CD, metrics)
- Dual-format enables both operator awareness and programmatic integration

**Alternatives Considered**:
- Markdown only: Not suitable for automation
- JSON only: Not human-friendly for review
- CSV: Less structured than JSON, harder to extend

**Validation**: ✅ Confirmed in `scripts/lib/report-formatter.js` implementation

---

## Performance & Constraints

**Performance Testing** (from spec):
- Target: Process 100+ branches in <10 seconds
- Constraint: <50 MB memory footprint
- Justification: Large organisations may have 500+ branches across regions

**GitHub API Rate Limiting**:
- Default: 5,000 requests/hour per user
- Optimisation: Single `gh pr list` query for all PRs (not per-branch)
- Fallback: Graceful degradation if API unavailable

## Summary

All key decisions have been validated through existing implementation. No blockers identified. Feature is ready to proceed to Phase 1 design (data model, contracts, quickstart).

---

**Phase Status**: ✅ COMPLETE – No NEEDS CLARIFICATION items | All decisions validated
