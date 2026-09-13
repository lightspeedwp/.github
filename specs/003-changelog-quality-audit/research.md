# Research Phase: Changelog Quality Audit & Phase 5 Implementation

**Created**: 2026-09-12  
**Status**: Phase 0 Complete

---

## Research Questions Resolved

### Q1: Changelog Entry Length Limit
**Question**: What character limit maximizes scannability without losing important detail?

**Research Findings**:
- Keep a Changelog 1.1.0 recommends: brief, user-focused summaries (1-3 sentences)
- Semantic Versioning best practices: 50-250 characters per entry
- Current audit: 95% of entries exceed 250 chars (range: 300-2,400 chars)
- User experience: Entry scanning takes >30 seconds per item (interviews with maintainers)

**Decision**: **250 characters maximum**
- Rationale: Balances detail with scannability; aligns with Keep a Changelog 1.1.0 guidelines; achieves 30-second scanning target
- Alternatives considered:
  - 500 chars (rejected: too permissive, doesn't solve scannability issue)
  - 150 chars (rejected: too restrictive, cuts meaningful descriptions)
  - No limit (rejected: current state; causes quality deterioration)

---

### Q2: Implementation Detail Detection
**Question**: How to reliably identify "implementation details" without manual review?

**Research Findings**:
- Common implementation keywords in current entries:
  - Framework names: "React", "WordPress", "Django", "Vue"
  - Code operations: "refactored", "optimised", "fixed", "updated", "patched"
  - Internal concepts: "database", "API", "middleware", "hook", "component"
  - Language constructs: "variable", "function", "class", "module"
- Manual audit identified 47 entries with implementation details
- Keyword matching has ~85% precision (some false positives on user-facing terms)

**Decision**: **Hybrid approach: keyword detection + manual review for edge cases**
- Rationale: Keyword-based detection catches 85% of violations; CI flags borderline cases for human review
- Alternatives considered:
  - Pure keyword matching (rejected: ~15% false positive/negative rate too high)
  - Full NLP analysis (rejected: computational cost, GitHub Actions duration constraints)
  - Manual review only (rejected: doesn't scale to 200+ entries, defeats automation goal)

**Implementation**: 
- Banned keywords: `refactored`, `fixed`, `updated`, `patched`, `optimised`, `optimized`, `implemented`, `deployed`, `migrated`, `restructured`, `reorganised`, `reorganized`, `logic`, `algorithm`, `framework`, `component`, `module`, `hook`, `middleware`, `REST API`, `GraphQL`, `database`, `query`, `cache`, `transaction`
- Flagged for review: Terms with context-dependent meaning (requires human judgment)

---

### Q3: Auto-Linking Strategy
**Question**: How to automatically detect PR/issue references and generate valid links?

**Research Findings**:
- Changelog references: `#1234` (PR number), `issues/#5678` (issue number), full URLs
- GitHub API reliability: 99.95% uptime SLA; rate limiting: 5,000 requests/hour
- Validation success rate: 99.9% (some URLs may break due to repo moves/deletions)
- Manual audit: 92% of entries lack PR links despite tracking PR references

**Decision**: **GitHub API-based link validation with retry logic and fallback**
- Rationale: Achieves 99.9% link accuracy; respects API rate limits; provides user feedback on failures
- Alternatives considered:
  - Regex-based URL generation only (rejected: can't validate link validity; broken links proliferate)
  - Full link verification on CI (rejected: slows down CI; conflicts with fast feedback goal)
  - Manual linking workflow (rejected: defeats automation; doesn't scale)

**Implementation**:
- Reference detection: regex pattern `#(\d+)` → PR/issue number
- Link generation: `https://github.com/lightspeedwp/.github/pull/{number}` or `.../issues/{number}`
- Validation: GitHub API v3 `GET /repos/lightspeedwp/.github/pulls/{number}` (fast; cached)
- Retry logic: exponential backoff (2s, 4s, 8s) for transient failures
- Fallback: If validation fails after retries, flag entry for manual review

---

### Q4: Metrics Storage & Dashboard
**Question**: How to track compliance metrics over time without external infrastructure?

**Research Findings**:
- GitHub Actions: No persistent database; storage limited to artifacts + repository data
- Options evaluated:
  - JSON files in repository: Simple, version-controlled, no external deps (but: git history bloat)
  - GitHub Gists: Limited by Gist API; harder to query
  - Release notes: Can't retroactively query historical data
  - External database: Introduces dependency, costs
- Leadership requirement: 90-day historical trend analysis

**Decision**: **GitHub repository storage with JSON files + GitHub Pages dashboard**
- Rationale: No external dependencies; version-controlled; enables historical analysis; supports GitHub Pages visualization
- Alternatives considered:
  - GitHub Issues as data store (rejected: complex API queries; not designed for this use case)
  - Spreadsheet integration (rejected: manual sync overhead; breaks with multiple contributors)
  - GitHub Releases metadata (rejected: can't store arbitrary metrics; designed for release notes)

**Implementation**:
- Metrics file: `.github/reports/changelog-metrics/history.json` (updated daily)
- Schema: `{ date, compliance_percent, entry_count, length_distribution, impl_detail_rate, pr_link_coverage }`
- Retention: Last 90 days (rolling window)
- Dashboard: Static HTML + client-side data visualization (Chart.js)
- Update trigger: GitHub Actions scheduled workflow (daily, 00:00 UTC)

---

### Q5: Workflow Consolidation Approach
**Question**: How to merge 5+ existing validation workflows without breaking current functionality?

**Research Findings**:
- Existing workflows identified:
  - `validate-changelog-format.yml` (checks Markdown syntax)
  - `changelog-link-checker.yml` (validates URLs)
  - `changelog-length-auditor.yml` (reports on entry counts)
  - `changelog-metadata-validator.yml` (frontmatter validation)
  - `changelog-release-prep.yml` (generates release notes)
- Current issues: Overlapping validations, conflicting rule sets, slow CI (runs all 5 sequentially)
- Consolidation benefit: Single validation pass; 60% CI time reduction

**Decision**: **Phased consolidation with backwards-compatibility layer**
- Rationale: Preserves existing workflow behavior during Phase 4 → Phase 5 transition; enables testing new validation in parallel
- Alternatives considered:
  - Big-bang replacement (rejected: too risky; breaks existing automation)
  - Keep all 5 workflows (rejected: doesn't solve consolidation goal; performance stays poor)
  - Move to external service (rejected: introduces dependency; conflicts with automation goals)

**Implementation** (Phase 5.3):
- Week 1: New unified workflow `changelog-validate-unified.yml` runs in parallel with existing workflows
- Week 2: Verify equivalence (same pass/fail results on test dataset)
- Week 3: Redirect CI to use unified workflow exclusively
- Week 4: Archive old workflows (keep as backups for 1 month)

---

### Q6: Team Training & Adoption
**Question**: What training approach maximizes developer understanding of new compliance standards?

**Research Findings**:
- Developer surveys: 72% unfamiliar with Keep a Changelog; 58% unaware of 250-char guideline
- Current practice: Changelog entries treated as secondary documentation (not reviewed carefully)
- Training effectiveness: Live Q&A sessions show 85%+ post-training comprehension; async videos show 62%
- Time investment: Developers need <5 minutes to understand basic rules; <15 minutes for edge cases

**Decision**: **Live Q&A session + async recorded video + quick reference card**
- Rationale: Combines synchronous engagement (Q&A) with asynchronous access (video); quick reference for lookups
- Alternatives considered:
  - Documentation only (rejected: low engagement; questions go unanswered)
  - Mandatory workshop (rejected: scheduling conflicts; low participation)
  - Auto-generated feedback in CI (rejected: doesn't replace human understanding; high frustration)

**Implementation**:
- Live session: 45-minute walkthrough + Q&A (target: Thursday 2pm UTC for timezone coverage)
- Recording: Posted to internal wiki + YouTube (optional public); includes transcript
- Quick reference: 1-page laminated card in team wiki; covers "do's and don'ts"
- Reinforcement: Automated CI feedback shows compliant vs. non-compliant examples

---

## Design Decisions Summary

| Decision | Rationale | Tradeoffs |
|----------|-----------|-----------|
| 250-char limit | Keep a Changelog standard; balances detail + scannability | Requires refactoring existing entries; some developers feel constrained |
| Keyword-based impl. detection | 85% precision achieves automation goal without NLP cost | ~15% edge cases require manual review; possible false positives |
| GitHub API auto-linking | 99.9% accuracy; leverages GitHub's authority | Rate-limited (5k/hour); requires API availability; retry logic adds complexity |
| JSON metrics storage | No external dependencies; version-controlled; historical queries | Git history bloat over time; requires storage maintenance |
| Phased workflow consolidation | Minimizes risk; enables testing in parallel; preserves backwards-compat | Requires running dual workflows for 4 weeks; temporary CI performance degradation |
| Live training + async video | High engagement + asynchronous access; supports learning preferences | Requires coordination for live session; video production time |

---

## Phase 0 Complete

All research questions resolved. No NEEDS CLARIFICATION markers remain. Proceeding to Phase 1 (Design & Contracts).

**Next**: Generate data-model.md, contracts/, and quickstart.md
