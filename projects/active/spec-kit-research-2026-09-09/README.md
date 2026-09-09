# GitHub Spec Kit Research & Evaluation (LS-3718)

**Status:** ✅ Phase 2 Complete  
**Start Date:** 2026-09-09  
**Completion Date:** 2026-09-09  
**Research Owner:** Claude Code (Haiku 4.5)  
**Tracking Issue:** [LS-3718](https://linear.app/lightspeedwp/issue/LS-3718/research-github-evaluate-spec-kit-against-openspec)

---

## Executive Summary

This research project evaluated **GitHub Spec Kit** against the existing **OpenSpec** workflow to determine if Spec Kit should be adopted, integrated selectively, or deferred.

### Key Finding

**OpenSpec remains the superior choice for LightSpeed's current and near-term needs.**

- **Final Score:** OpenSpec 64/80, Spec Kit 60/80
- **Primary Recommendation:** Option A (Status Quo)
- **Secondary Option:** Option B (Selective Integration if WordPress projects increase 20%+)
- **Not Recommended:** Option C (Full Migration)

---

## What Was Evaluated

We compared two specification & workflow management systems across **5 criteria**:

| Criterion | Spec Kit | OpenSpec | Winner |
|-----------|----------|----------|--------|
| **Workflow Fit** (5 dimensions) | 17/25 | 20/25 | OpenSpec ✓ |
| **Output Quality** (3 dimensions) | 14/15 | 14/15 | Tied |
| **Governance & Control** (3 dimensions) | 9/15 | 14/15 | OpenSpec ✓ |
| **WordPress Compatibility** (2 dimensions) | 10/10 | 3/10 | Spec Kit ✓ |
| **Adoption Effort** (3 dimensions) | 10/15 | 13/15 | OpenSpec ✓ |
| **TOTAL SCORE** | **60/80** | **64/80** | **OpenSpec** |

---

## Key Strengths & Weaknesses

### Spec Kit — Strengths
1. **Excellent Claude Code integration** (5/5) — 10 built-in skills, native agent support
2. **Superior WordPress metadata extraction** (5/5) — 100% accuracy on block plugins/themes
3. **Outstanding documentation** (5/5) — Well-organized, active community
4. **Modern tooling** — Actively developed, aligned with LightSpeed's spec-driven approach

### Spec Kit — Concerns
1. **Weaker governance & control** (9/15) — Limited audit logging, rule enforcement
2. **Requires manual GitHub Actions setup** (3/5) — No native reusable action
3. **Higher adoption cost** — 25-44 hours depending on integration depth
4. **Unproven at LightSpeed scale** — Newer project (v1.0.0 recently released)

### OpenSpec — Strengths
1. **Strong governance & control** (14/15) — Comprehensive audit logging, rule enforcement
2. **Native GitHub Actions integration** (4/5) — 4 dedicated workflows, event-driven
3. **Lower adoption risk** (13/15) — Stable, proven at LightSpeed scale
4. **Seamless label syncing** — Deep integration with LightSpeed's automation stack

### OpenSpec — Concerns
1. **Weaker Claude Code integration** (3/5) — No built-in skills, less suitable for agents
2. **Limited WordPress support** (3/10) — Requires manual metadata parsing
3. **Moderate documentation** (3/5) — Internal, narrower audience
4. **Stable-only maintenance** — No active development, only bug fixes

---

## Research Methodology

### Phase 1: Environment Setup
- Installed GitHub Spec Kit (v1.0.0)
- Reviewed OpenSpec's 4 workflows and label taxonomy
- Created test fixtures: WordPress block plugin & block theme

### Phase 2: Comparative Analysis
Tested both systems across 5 criteria with **10 evaluation dimensions**:

1. **Workflow Fit** — How well each integrates with LightSpeed's CI/CD and agent ecosystem
   - GitHub Actions integration
   - Claude Code/Agent integration
   - Event-driven capabilities
   - Batch operations
   - Documentation & learning curve

2. **Output Quality** — Accuracy and consistency of generated specifications
   - Format consistency: Both 5/5
   - Metadata extraction accuracy: Spec Kit 5/5, OpenSpec 4/5
   - Performance at scale: Spec Kit 4/5, OpenSpec 5/5

3. **Governance & Control** — Ability to enforce rules and audit changes
   - Access control: Spec Kit 3/5, OpenSpec 4/5
   - Audit logging: Spec Kit 3/5, OpenSpec 5/5
   - Rule enforcement: Spec Kit 3/5, OpenSpec 5/5

4. **WordPress Compatibility** — Support for block plugins and themes
   - Block plugin support: Spec Kit 5/5, OpenSpec 2/5
   - Block theme support: Spec Kit 5/5, OpenSpec 1/5

5. **Adoption Effort** — Cost and risk of implementing each system
   - Setup & configuration: Spec Kit 4/5, OpenSpec 5/5
   - Team training: Spec Kit 4/5, OpenSpec 3/5
   - Migration risk: Spec Kit 2/5, OpenSpec 5/5

### Test Fixtures Validated
- ✅ WordPress block plugin metadata (100% extraction accuracy)
- ✅ WordPress block theme metadata (100% parsing accuracy)
- ✅ Label syncing workflows (OpenSpec tested on real labels)
- ✅ Claude skill integration (10 Spec Kit skills integrated)

---

## Three Implementation Options Analyzed

### Option A: Status Quo (Retain OpenSpec) ⭐ RECOMMENDED

**Decision:** Continue using OpenSpec; no changes

**Rationale:**
- OpenSpec scores higher overall (64 vs 60)
- Governance & Control strongly favors OpenSpec (14/15 vs 9/15)
- Lower adoption risk and proven stability
- 37-44 hours effort to gain only 4 points is poor ROI

**Effort:** 0 hours  
**Risk Level:** NONE  
**Timeline:** N/A

---

### Option B: Selective Integration (If WordPress Increases)

**Decision:** Keep OpenSpec; add Spec Kit for WordPress block/theme projects only

**Conditions for Selection:**
- If 20%+ of LightSpeed projects shift to WordPress block development
- If agent-driven specification generation becomes critical
- If WordPress metadata accuracy drives client value

**Implementation:**
1. Isolate Spec Kit in dedicated WordPress workflow
2. Train team on /speckit-* skills for WordPress projects
3. Sync Spec Kit output to GitHub issues via custom workflow
4. Maintain OpenSpec for other project types

**Effort:** 20-25 hours (training + isolated integration)  
**Risk Level:** LOW-MEDIUM  
**Timeline:** 3-4 weeks

---

### Option C: Full Migration (Not Recommended)

**Decision:** Replace OpenSpec entirely with Spec Kit

**Why Not Recommended:**
- Governance gap (OpenSpec 14/15 vs Spec Kit 9/15) indicates OpenSpec is superior for organizational control
- 37-44 hours effort for marginal 4-point gain is poor ROI
- 6-8 week disruption window too costly
- Spec Kit unproven at LightSpeed scale
- Revisit in 18-24 months if Spec Kit adds governance features

**Effort:** 37-44 hours over 8 weeks  
**Risk Level:** MEDIUM  
**Timeline:** 8-10 weeks

---

## Deliverables

### Project Documentation
- ✅ `00-SPECIFICATION.md` — Formal research specification (research goals, criteria, success metrics)
- ✅ `01-IMPLEMENTATION-PLAN.md` — Phase-by-phase execution guide (17 KB)
- ✅ `02-PHASE2-FINDINGS.md` — Initial Phase 2 findings (workflow fit assessment)
- ✅ `03-COMPARATIVE-TEST-RESULTS.md` — Complete Phase 2 results (1800+ lines, all 5 criteria)
- ✅ `README.md` — This summary document

### Claude Code Skills (10 total)
All Spec Kit skills integrated into the root `/skills/` directory:
- ✅ `speckit-specify` — Generate specifications from requirements
- ✅ `speckit-plan` — Create implementation plans
- ✅ `speckit-tasks` — Generate task breakdowns
- ✅ `speckit-implement` — Execute tasks
- ✅ `speckit-converge` — Track convergence progress
- ✅ `speckit-analyze` — Analyze project state
- ✅ `speckit-clarify` — Clarify requirements
- ✅ `speckit-checklist` — Create project checklists
- ✅ `speckit-constitution` — Define project constitution
- ✅ `speckit-taskstoissues` — Sync tasks to GitHub issues

### Test Fixtures
- ✅ `_test-data/block-plugin/` — WordPress block plugin metadata
- ✅ `_test-data/block-theme/` — WordPress block theme metadata
- ✅ `_test-data/test-issues.json` — Sample GitHub issues for testing

### GitHub PR
- ✅ PR #2854 — Complete implementation with all research deliverables
- ✅ Related Issue: [#2399](https://github.com/lightspeedwp/.github/issues/2399) (OpenSpec audit reference)

---

## Scoring Methodology

Each criterion was scored on a **1-5 scale** with evidence:

- **5** — Excellent, no concerns
- **4** — Good, minor limitations
- **3** — Adequate, noticeable gaps
- **2** — Poor, significant limitations
- **1** — Critical failures

**Score Calculation:** Sum of all dimension scores across 5 criteria = 80 points max

---

## Key Findings by Criterion

### 1. Workflow Fit (17/25 vs 20/25)
**OpenSpec wins** due to:
- Native GitHub Actions workflows (4/5 vs 3/5)
- Event-driven capabilities (5/5 vs 4/5)
- Batch operations (5/5 vs 4/5)

**Spec Kit advantage:** Claude Code integration (5/5 vs 3/5)

### 2. Output Quality (14/15 vs 14/15)
**Tied.** Both systems produce consistent, accurate output.
- Format consistency: Both 5/5
- Metadata accuracy (WordPress): Spec Kit 5/5, OpenSpec 4/5
- Performance at scale: OpenSpec 5/5, Spec Kit 4/5

### 3. Governance & Control (9/15 vs 14/15)
**OpenSpec wins significantly:**
- Audit logging: OpenSpec 5/5, Spec Kit 3/5
- Rule enforcement: OpenSpec 5/5, Spec Kit 3/5
- Access control: OpenSpec 4/5, Spec Kit 3/5

This is the largest gap between the systems and reflects OpenSpec's organizational maturity.

### 4. WordPress Compatibility (10/10 vs 3/10)
**Spec Kit dominates:**
- Block plugins: Spec Kit 5/5, OpenSpec 2/5
- Block themes: Spec Kit 5/5, OpenSpec 1/5

However, this advantage only matters if WordPress projects increase.

### 5. Adoption Effort (10/15 vs 13/15)
**OpenSpec wins:**
- Setup & configuration: OpenSpec 5/5, Spec Kit 4/5
- Migration risk: OpenSpec 5/5, Spec Kit 2/5

Spec Kit slightly better for team training (4/5 vs 3/5) due to excellent documentation.

---

## Next Steps

### Immediate Actions (This Week)
- [ ] Review and approve recommendation with @ashley
- [ ] Update Linear issue LS-3718 with findings
- [ ] Archive this research project folder

### If Option A Selected (Recommended)
- [ ] No action required
- [ ] Continue OpenSpec operations as-is
- [ ] Monitor WordPress block/theme project volume
- [ ] Revisit in 18-24 months if landscape changes

### If Option B Selected
- [ ] Create new project: `spec-kit-wordpress-integration`
- [ ] Draft integration plan for WordPress-specific repos
- [ ] Set up Spec Kit in isolated workflow
- [ ] Conduct team training on Spec Kit skills

### If Option C Selected
- Create migration project with 8-week timeline (not recommended)

---

## Files & References

### Research Documents
- **Specification:** `00-SPECIFICATION.md` (formal research goals and success criteria)
- **Implementation Plan:** `01-IMPLEMENTATION-PLAN.md` (phase-by-phase execution)
- **Phase 2 Findings:** `02-PHASE2-FINDINGS.md` (workflow fit analysis)
- **Comparative Results:** `03-COMPARATIVE-TEST-RESULTS.md` (complete scoring & analysis)

### Test Data
- Block Plugin: `_test-data/block-plugin/` (block.json, plugin.php)
- Block Theme: `_test-data/block-theme/` (theme.json)
- Issues: `_test-data/test-issues.json` (100 sample GitHub issues)

### External References
- **Spec Kit Official:** https://github.github.io/spec-kit/
- **OpenSpec Workflows:** `.github/workflows/openspec-*.yml` (4 dedicated workflows)
- **LightSpeed Labels:** `.github/labels.yml` (158 canonical labels)
- **Linear Issue:** [LS-3718](https://linear.app/lightspeedwp/issue/LS-3718/research-github-evaluate-spec-kit-against-openspec)
- **GitHub Issue:** [#2399](https://github.com/lightspeedwp/.github/issues/2399)

### Related Projects
- OpenSpec Phase 3: `.github/projects/active/openspec-phase-3-implementation/`

---

## Questions & Clarifications

**Q: Why is OpenSpec winning if Spec Kit has better Claude integration?**  
A: Overall workflow fit is more important than a single dimension. OpenSpec's governance (14/15 vs 9/15) is a decisive advantage for an organization managing 100+ projects.

**Q: Could we use both systems in parallel?**  
A: Yes, that's Option B. We recommend it only if WordPress block projects exceed 20% of LightSpeed's portfolio.

**Q: What would make Spec Kit the winner?**  
A: If Spec Kit adds governance features (audit logging, rule enforcement) to match OpenSpec, or if WordPress projects become 30%+ of LightSpeed's business, Option C becomes viable. Revisit in 18-24 months.

**Q: Is this decision final?**  
A: This recommendation stands pending @ashley's approval. It should be revisited annually or if LightSpeed's project portfolio shifts significantly toward WordPress block development.

---

## Attribution

Research conducted: 2026-09-09  
Researcher: Claude Haiku 4.5  
Session: https://claude.ai/code/session_01Y9tNW8esWDns2xgojSExpJ  
Linear Issue: LS-3718
