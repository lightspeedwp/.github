# Research Phase: Branch Cleanup Audit & Refactoring

**Feature**: Audit and Refactor Branch Cleanup Infrastructure  
**Date**: 2026-09-14  
**Status**: Complete

## Research Questions & Decisions

### 1. Git Merge Detection Strategy

**Question**: How to reliably determine if a branch is fully merged to base branches?

**Decision**: Use `git merge-base` + commit history analysis

**Rationale**:

- Standard git approach used by merge-conflict detection
- Handles rebase and merge-commit workflows correctly
- Available in all git environments without external tools
- Existing `scripts/cleanup-branches.js` already implements this via `execSync('git merge-base --is-ancestor ...')`

**Implementation Details**:

- For each candidate branch, check: `git merge-base --is-ancestor {branch} develop`
- If true: branch is fully merged to develop → safe to delete
- Also check against `main` for consistency (respects most permissive state)
- Handles edge case of branches merged to develop but not main

**Alternatives Considered**:

- GitHub API `GET /repos/{owner}/{repo}/branches/{branch}` has `merged` field but only for PRs
- Direct commit log parsing (more fragile, subject to history rewrites)

---

### 2. Open PR Detection

**Question**: How to identify branches with open pull requests without false positives?

**Decision**: Use GitHub CLI (`gh pr list`) with branch filtering

**Rationale**:

- Existing `scripts/cleanup-branches.js` already uses `gh pr list --state open`
- Filters by `headRefName` to match branch names
- Authoritative source (GitHub-hosted state)
- Fast execution even with large PR counts

**Implementation Details**:

```bash
gh pr list --state open --json number,headRefName --repo owner/repo \
  | jq '.[] | select(.headRefName == "branch-name")'
```

**Alternatives Considered**:

- GitHub REST API directly (slower for large result sets)
- Local git reflog parsing (misses closed PRs, unreliable)
- Webhooks (overkill for maintenance script)

---

### 3. Branch Categorisation Logic

**Question**: How to reliably categorise branches into KEEP/DELETE/DISCUSS?

**Decision**: Multi-gate decision tree with early exits

**Rationale**:

- Spec defines clear categorisation criteria (FR-001)
- Gates are ordered by safety (never delete protected, always preserve open PRs)
- DISCUSS category captures ambiguous cases for human review

**Implementation Logic** (in order):

```
IF branch IN protected_set (main, develop, production, release/*, hotfix/*)
  → KEEP (protected)
ELSE IF branch has open PR
  → KEEP (active)
ELSE IF branch matches exclusion pattern (dependabot/*, renovate/*)
  → KEEP or DISCUSS (policy decision)
ELSE IF branch NOT merged to develop or main
  → DISCUSS (unmerged work, unclear intent)
ELSE IF age < 30 days
  → KEEP (recent, may still be useful)
ELSE IF has naming violation (claude/*, copilot/*, openai/*)
  → DISCUSS (naming violation, determine if rename or delete)
ELSE
  → DELETE (merged, stale, no PR, valid name)
```

**Alternatives Considered**:

- Simpler 2-category (KEEP/DELETE) — too aggressive, no DISCUSS for edge cases
- Single-pass evaluation — risk of deleting protected branches

---

### 4. Report Formats

**Question**: What report formats best serve audit needs?

**Decision**: Dual-format output — Markdown (human) + JSON (machine)

**Rationale**:

- Markdown: Human-readable summary, category breakdowns, actionable recommendations
- JSON: Machine-parseable for automation, GitHub Actions artifact ingestion, issue/PR generation
- Supports both manual review (developer reads .md) and automation (CI parses .json)
- Existing script already supports both via `--reportFormat` option

**Markdown Format**:

- Summary section (counts by category)
- Tables for each category (KEEP, DELETE, DISCUSS)
- Columns: branch name, type, age, merge status, last commit, author, associated PR

**JSON Format**:

- Structure matches `contracts/audit-report.schema.json`: `{ timestamp, repository, branch_count, summary: { keep_count, delete_count, discuss_count }, categories: { keep, delete, discuss } }`
- `categories.keep`/`delete`/`discuss` group branches by reason (e.g. `categories.keep.protected`, `categories.delete[]`), each entry carrying the relevant subset of `{ name, type, age_days, merged_to, last_commit_date, author, pr_number, reason }`
- Machine-parseable for follow-up automation

**Alternatives Considered**:

- CSV (too flat for nested data)
- HTML (harder to version control and diff)
- YAML (reasonable but less standardised for reports)

---

### 5. Deletion Safety Mechanisms

**Question**: What safeguards prevent accidental data loss during deletion?

**Decision**: Multi-layer safety approach

**Rationale**:

- Spec requires 100% merge verification before deletion (FR-010)
- Dry-run mode is the default (FR-011)
- Aligns with project governance (never skip safety checks)

**Implementation Safeguards**:

1. **Pre-deletion verification** (executed before each deletion):

   ```
   - Verify branch exists on remote
   - Verify branch is fully merged to develop or main
   - Verify no open PR targets this branch
   - Verify branch not in protected set
   - Verify branch not in exclusion patterns
   - Verify age > threshold
   ```

2. **Dry-run mode** (default `--dryRun=true`):
   - Lists branches to delete but does not execute deletions
   - Generates audit report for review
   - User must explicitly set `--dryRun=false` to delete

3. **Git error handling**:
   - Catch and report deletion failures (e.g., "branch already deleted by another process")
   - Do not fail entire script on single branch failure
   - Log all failures for audit trail

4. **Recovery strategy**:
   - Deleted commits remain in git reflog for ~30–90 days
   - Document recovery process in troubleshooting guide

**Alternatives Considered**:

- Interactive confirmation for each branch (too slow for 100+ branches)
- Undo log (overkill for maintenance script)

---

### 6. Performance Targets

**Question**: What performance is acceptable for audit scripts?

**Decision**: <5 seconds for 500+ branches (SC-004)

**Rationale**:

- Modern developer machines and CI runners achieve this with optimised queries
- Existing script already meets this for typical repositories
- Allows integration into CI workflows without timeout issues

**Optimisation Strategy**:

- Batch PR queries (single `gh pr list` call, not per-branch)
- Cache merge-base results if running multiple times
- Parallelise git operations where safe (multiple branch checks)
- Avoid N+1 API calls (batch queries over single-item loops)

**Measurement**:

- Profile script with `time node scripts/cleanup-branches.js --reportFormat=json`
- Compare before/after refactoring
- Validate against .github repository (300+ branches)

---

### 7. Branch Naming Validation Alignment

**Question**: How to ensure branch naming validation is consistent across tools?

**Decision**: Centralise validation rules, reference from cleanup script

**Rationale**:

- Spec requires alignment with CLAUDE.md branch naming (FR-015)
- Current `scripts/validation/validate-branch-name.js` is the authoritative validator
- Cleanup script should use same validation, not duplicate logic

**Implementation**:

- Cleanup script imports validation module: `const { validateBranchName } = require('./validation/validate-branch-name.js')`
- Any branch failing validation → flagged in DISCUSS category with reason "naming violation"
- Keeps validation logic centralised, avoids duplication

**Alternatives Considered**:

- Duplicate validation in cleanup script (maintenance burden, inconsistency risk)
- External validation service (overkill, adds latency)

---

### 8. Exclusion Pattern Customisation

**Question**: How to support custom branch exclusion rules?

**Decision**: Regex-based `--excludePatterns` option (already in script)

**Rationale**:

- Different repositories may have project-specific exclusion needs
- Regex is flexible and well-known
- Existing script already supports this via CLI option (FR-007)
- Example use cases:
  - Preserve all prototype branches: `proto/.*`
  - Preserve research branches: `research/.*`
  - Preserve WIP branches: `wip/.*`

**Implementation**:

```bash
node scripts/cleanup-branches.js --excludePatterns="release/.*|hotfix/.*|proto/.*|research/.*"
```

**Alternatives Considered**:

- Configuration file (adds complexity, file management)
- GitHub branch protection rules (read-only, doesn't inform cleanup)

---

## Design Decisions Summary

| Area | Decision | Rationale |
|------|----------|-----------|
| Merge detection | `git merge-base` + history analysis | Standard, reliable, no external deps |
| PR detection | `gh pr list` with filtering | Authoritative, fast, already in use |
| Categorisation | Multi-gate decision tree | Clear safety hierarchy, unambiguous |
| Report format | Markdown + JSON dual output | Serves humans and automation equally |
| Deletion safety | 3-layer verification + dry-run default | 100% safety, zero data loss risk |
| Performance | <5 seconds for 500+ branches | CI-friendly, developer-friendly |
| Naming validation | Centralised, imported module | Single source of truth, no duplication |
| Exclusions | Regex-based CLI option | Flexible, project-specific needs |

---

## Remaining Open Questions

None — all technical decisions resolved through specification requirements and existing codebase patterns.

## Next Phase: Phase 1 Design

- Proceed to `data-model.md` — entity definitions and categorisation logic
- Generate `contracts/` — audit report and deletion candidate format specs
- Generate `quickstart.md` — validation guide with runnable examples
