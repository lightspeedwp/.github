---
openspec_version: "1.0"
type: "issue"
issue_type: "feature"
title: "feat/docs: Create team onboarding and training documentation"
labels: ["type:feat", "area:docs", "area:automation", "priority:high"]
milestone: "v1.2"
assignee: null
linked_issue: null
---

# Create Team Onboarding and Training Documentation

## Problem

Phase 3 governance rules are well-documented in `.github/` repository, but training materials for **team onboarding and skill-building are missing**:

- No quick reference guide for branch naming
- No frequently asked questions (FAQs)
- No troubleshooting guides for common errors
- No rollout schedule or enforcement timeline
- Limited documentation accessible to all teams

**Impact:** Teams struggle with governance rules. Support requests increase. Adoption lags. Teams resort to manual workarounds.

## Solution

Create comprehensive onboarding and training documentation by:

1. **Create `DEVELOPER_ONBOARDING.md`** — Step-by-step guide for new developers:
   - Introduction to governance and why it matters (1 paragraph)
   - Quick start: Creating your first properly-named branch (5 steps)
   - Common branch naming mistakes and fixes (5-7 examples)
   - How to validate your branch name (command: `npm run validate:branch-name`)
   - What to do if validation fails (troubleshooting steps)
   - Where to find help (links to docs, FAQs, support)
   - Checklist to verify setup is correct

2. **Create `BRANCH_NAMING_QUICK_REFERENCE.md`** — One-page cheat sheet:
   - Branch naming pattern: `{type}/{scope}-{title}`
   - All 34 allowed types in table format (type | purpose | example)
   - Forbidden prefixes (claude/, copilot/, openai/) with reasons
   - Common mistakes and corrections
   - Links to full documentation

3. **Create `GOVERNANCE_FAQs.md`** — Answers to common questions:
   - **Q: Why can't I use `claude/` prefix?**
     - A: Explains PR template routing, validation workflows, governance rules
   - **Q: What if I need to break the rules?**
     - A: Exception request process, when exceptions are appropriate
   - **Q: How do I fix an already-created branch with the wrong name?**
     - A: Steps to delete branch, recreate with correct name, recreate PR
   - **Q: Can I use different naming on different repos?**
     - A: No, all repos use same rules; contact leadership for exceptions
   - **Q: What happens if validation fails?**
     - A: Workflow comments with recommendation; you must fix and push
   - **Q: How do I know which branch type to use?**
     - A: Decision tree or flowchart (feat vs fix vs refactor, etc.)
   - **Q: Is governance enforced now or still optional?**
     - A: Reference enforcement timeline from ORG_GOVERNANCE_POLICY.md
   - (Add 5-7 more common questions)

4. **Create troubleshooting guide** — `GOVERNANCE_TROUBLESHOOTING.md`:
   - **Error: Branch name doesn't match pattern**
     - Explanation and fix steps
   - **Error: PR template routing failed**
     - Explanation and manual fix steps
   - **Error: Title normalization didn't run**
     - Explanation and manual fix steps
   - **Error: Cannot merge PR due to validation workflow**
     - Explanation and bypass procedures (if applicable)
   - (Add error scenarios for all governance workflows)

5. **Create rollout schedule** — `GOVERNANCE_ROLLOUT_SCHEDULE.md`:
   - **Phase A (Week 1):** Policy published; new repos use governance
   - **Phase B (Week 2-3):** Existing repos migrated; team training begins
   - **Phase C (Week 4):** Full enforcement; exceptions require approval
   - Timeline visualization (Gantt chart or ASCII table)
   - Team responsibilities at each phase
   - Enforcement timeline clearly stated

6. **Create training checklists:**
   - **Individual developer checklist** (for self-training)
   - **Team lead checklist** (for team onboarding)
   - **Repository maintainer checklist** (for repo governance setup)

7. **Create visual aids** (if possible):
   - Decision tree for choosing branch type
   - Common mistakes/fixes illustrated
   - Error resolution flowchart
   - Timeline visualization

## Implementation Notes

- All documents should link to each other (internal cross-references)
- Use simple, clear language (avoid jargon)
- Provide command examples where applicable
- Include references back to `.github/instructions/branch-naming.instructions.md` for detailed info
- Consider creating a "Governance Guide Hub" (index page linking all docs)
- Ensure all docs are accessible to all team members (in docs/ or top-level repo)

## Definition of Done

- [ ] `DEVELOPER_ONBOARDING.md` created with 5+ sections
- [ ] `BRANCH_NAMING_QUICK_REFERENCE.md` created (one-page format)
- [ ] `GOVERNANCE_FAQs.md` created with 8+ Q&As
- [ ] `GOVERNANCE_TROUBLESHOOTING.md` created with 5+ error scenarios
- [ ] `GOVERNANCE_ROLLOUT_SCHEDULE.md` created with timeline
- [ ] Training checklists created (developer, team lead, maintainer)
- [ ] Visual aids created (decision trees, flowcharts)
- [ ] All docs linked and cross-referenced
- [ ] Grammar and spelling checked
- [ ] Links verified and working
- [ ] Team members notified of training materials
- [ ] PR merged

## Test Scenarios

1. **New developer reads DEVELOPER_ONBOARDING.md:**
   - Can create first properly-named branch
   - Can validate branch name
   - Understands what to do if validation fails

2. **Developer consults QUICK_REFERENCE when confused:**
   - Can quickly find their needed branch type
   - Can see example immediately
   - Time to answer is <1 minute

3. **Developer searches FAQs for their question:**
   - Finds answer in <2 minutes
   - Answer is clear and actionable
   - Knows where to find more help

4. **Developer encounters error:**
   - Finds error in TROUBLESHOOTING.md
   - Follows resolution steps
   - Issue is resolved without support request

## Related Issues

- Issue 4.2 — Establish org-wide policy (dependency: policy drives training content)
- Issue 4.4 — Compliance reporting (dependency: training improves compliance)
- Issue 4.1 — Migrate governance rules (depends on training for adoption)

## Related Documentation

- `docs/ORG_GOVERNANCE_POLICY.md` — Policy and enforcement timeline
- `docs/BRANCHING_STRATEGY.md` — Detailed branching rules
- `.github/instructions/branch-naming.instructions.md` — Technical implementation details
- `CLAUDE.md` — Repository rules and conventions

## Success Criteria

- ✅ >90% developer adoption within 2 weeks of rollout
- ✅ >95% documentation completeness (all sections present)
- ✅ <5 support requests about basic governance rules (per week)
- ✅ All team members have received training notification
- ✅ Training materials continuously updated based on feedback

## Effort Estimate

**3-4 hours** — Documentation creation, review, and publication

## Timeline

**Week 1-2 of Phase 4** — Depends on Issue 4.2 (Policy), parallel to Issue 4.1 (Migration)

---

**OpenSpec Document Version:** 1.0  
**Created:** 2026-09-03  
**Phase:** 4 (Governance Deployment)  
**Status:** Draft  
**Critical Path:** YES — Gates organization-wide rollout
