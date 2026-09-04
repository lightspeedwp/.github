---
file_type: "prompt"
title: "Evaluate Open Issues and Milestone Allocation"
description: "Allocate open issues to milestones by priority, dependencies, and time estimates. Spread grouped work across multiple version milestones (v1.0, v1.1, v1.2, etc.)."
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["milestones", "planning", "release-management", "issue-allocation"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt: Evaluate Open Issues and Milestone Allocation

## PROMPT: Allocate open issues to milestones, spreading work across releases

This prompt systematically allocates open GitHub issues to milestones based on priority, dependencies, and effort estimates, ensuring sustainable release planning.

### Context

Milestones represent release versions (v1.0, v1.1, v1.2, etc.). A good milestone allocation:

- **Balances effort** across releases (no milestone > 90% capacity)
- **Respects dependencies** (required work ships earlier)
- **Groups related work** together (features in same milestone)
- **Reserves buffer** (20-30% for unexpected work)
- **Aligns with deadlines** (dates set on milestone)

**Current milestone structure:**
- v1.0: Foundation (critical features, essential fixes)
- v1.1: Enhancements (phase 2 features)
- v1.2: Polish (refinements, optional features)
- v1.3+: Advanced work

### Task

Execute these steps IN ORDER:

---

## STEP 1: List All Open Issues

```bash
# Get all open issues
gh issue list --state open --limit 200 --json number,title,labels,milestone,body

# Filter by:
# - Priority (critical, high, medium, low)
# - Type (bug, feature, task, docs)
# - Area (specific team/subsystem)
```

**Create baseline inventory:**

```markdown
## Open Issues Inventory

Total: 47 open issues

| Priority | Count | Assigned | Unassigned | With Milestone | Without Milestone |
|----------|-------|----------|------------|----------------|--------------------|
| Critical | 5 | 4 | 1 | 3 | 2 |
| High | 12 | 8 | 4 | 7 | 5 |
| Medium | 18 | 10 | 8 | 5 | 13 |
| Low | 12 | 6 | 6 | 2 | 10 |

**Analysis:**
- 15 critical/high priority issues
- 23 issues without milestone (need allocation)
- Good assignment coverage
```

---

## STEP 2: Categorize Issues by Type & Dependencies

For each open issue, identify:

- **Type:** bug, feature, task, documentation
- **Priority:** critical (0), high (1), medium (2), low (3)
- **Effort:** S=1h, M=4h, L=8h, XL=16h+
- **Dependencies:** Any issues that must ship first

**Create categorization table:**

```markdown
## Issues by Category & Dependencies

### Critical Bugs (Must fix before v1.0 release)

| Issue | Title | Effort | Depends On | Blocks |
|-------|-------|--------|-----------|--------|
| #100 | Auth timeout under load | L | None | Features using auth |
| #101 | Cache invalidation issue | XL | None | Caching features |

### High-Priority Features (v1.0-1.1)

| Issue | Title | Effort | Depends On | Blocks |
|-------|-------|--------|-----------|--------|
| #110 | User preferences panel | L | Design decision | #111 (settings integration) |
| #111 | Settings API endpoint | M | #110 (design) | Deployment configs |

### Medium-Priority Enhancements (v1.1-1.2)

| Issue | Title | Effort | Depends On | Blocks |
|-------|-------|--------|-----------|--------|
| #120 | Analytics dashboard | L | None | Reports feature |
| #121 | Reports export | M | #120 (analytics) | None |

### Low-Priority / Backlog (v1.3+)

| Issue | Title | Effort | Depends On | Blocks |
|-------|-------|--------|-----------|--------|
| #130 | Custom themes | XL | #120 (analytics data) | None |
```

**Key insight:** Issue #111 depends on #110, so #110 must ship first (v1.0), then #111 (v1.1).

---

## STEP 3: Calculate Milestone Capacity

For each milestone, establish capacity:

```markdown
## Milestone Capacity Planning

### v1.0 (Foundation) — Target: Sept 30
- Duration: 4 weeks
- Team capacity: 160 hours (4 people × 40h/week)
- Planned capacity: 128 hours (80%)
- Buffer: 32 hours (20% for unexpected)

### v1.1 (Enhancements) — Target: Oct 31
- Duration: 4 weeks
- Team capacity: 160 hours
- Planned capacity: 144 hours (90%)
- Buffer: 16 hours (10% for unexpected)

### v1.2 (Polish) — Target: Nov 30
- Duration: 4 weeks
- Team capacity: 160 hours
- Planned capacity: 120 hours (75%)
- Buffer: 40 hours (25% for unexpected)

### v1.3+ (Advanced) — Target: Dec 31+
- Backlog for non-critical work
- No hard deadline
```

**Rule:** No milestone > 90% of capacity (except emergencies)

---

## STEP 4: Allocate Issues to Milestones

Using priority, effort, and dependencies:

**Allocation Algorithm:**

1. **Critical issues first** → v1.0 (must ship first)
2. **High-priority issues** → v1.0 until capacity reached, then v1.1
3. **Medium-priority issues** → v1.1 until capacity reached, then v1.2
4. **Low-priority issues** → v1.2 or v1.3+ (backlog)
5. **Respect dependencies** → Prerequisites ship in earlier milestone

**Create allocation spreadsheet:**

```markdown
## Issue Allocation to Milestones

### v1.0 (Sept 30) — Critical + Essential Work

| Issue | Title | Type | Priority | Effort | Total Hours |
|-------|-------|------|----------|--------|-------------|
| #100 | Auth timeout fix | bug | Critical | L | 8 |
| #101 | Cache invalidation | bug | Critical | XL | 16 |
| #110 | User prefs panel | feature | High | L | 8 |
| #112 | API documentation | docs | High | M | 4 |
| **v1.0 TOTAL** | | | | | **36 hours** |

### v1.1 (Oct 31) — High-Priority Features

| Issue | Title | Type | Priority | Effort | Total Hours |
|-------|-------|------|----------|--------|-------------|
| #111 | Settings API | feature | High | M | 4 |
| #113 | Search implementation | feature | High | L | 8 |
| #114 | Performance optimization | task | High | L | 8 |
| #120 | Analytics dashboard | feature | Medium | L | 8 |
| **v1.1 TOTAL** | | | | | **28 hours** |

### v1.2 (Nov 30) — Polish & Optional Features

| Issue | Title | Type | Priority | Effort | Total Hours |
|-------|-------|------|----------|--------|-------------|
| #121 | Reports export | feature | Medium | M | 4 |
| #122 | UI refinements | task | Medium | M | 4 |
| #123 | Mobile responsiveness | bug | Medium | L | 8 |
| #124 | Documentation updates | docs | Medium | M | 4 |
| **v1.2 TOTAL** | | | | | **20 hours** |

### v1.3+ (Backlog) — Nice-to-Have

| Issue | Title | Type | Priority | Effort | Total Hours |
|-------|-------|------|----------|--------|-------------|
| #130 | Custom themes | feature | Low | XL | 16 |
| #131 | Dark mode | feature | Low | M | 4 |
| #132 | Social sharing | feature | Low | M | 4 |
| **BACKLOG TOTAL** | | | | | **24 hours** |

---

## Capacity Check

| Milestone | Allocated | Capacity | Usage | Buffer | Status |
|-----------|-----------|----------|-------|--------|--------|
| v1.0 | 36h | 128h | 28% | 92h | ✅ GREEN |
| v1.1 | 28h | 144h | 19% | 116h | ✅ GREEN |
| v1.2 | 20h | 120h | 17% | 100h | ✅ GREEN |
| TOTAL | 84h | 392h | 21% | 308h | ✅ HEALTHY |

**Result:** Good distribution. Room for 80+ more hours of work.
```

---

## STEP 5: Validate Allocation Against Constraints

```markdown
## Allocation Validation Checklist

- [x] No milestone > 90% capacity
- [x] 20-30% buffer reserved per milestone
- [x] Critical issues in v1.0
- [x] High-priority issues in v1.0/v1.1
- [x] Dependencies respected (prerequisites earlier)
- [x] Related features grouped together
- [x] No duplicate assignments
- [x] All critical/high issues assigned (no >5 in backlog)

**Status: ✅ VALID ALLOCATION**
```

---

## STEP 6: Update GitHub Milestones

For each issue, assign milestone:

```bash
# Assign issue #100 to v1.0 milestone
gh issue edit 100 --milestone "v1.0"

# Bulk assign (if supported)
# For each issue in spreadsheet:
#   gh issue edit {issue} --milestone "{milestone}"
```

**Verification:**

```bash
# List issues by milestone
gh issue list --state open --milestone "v1.0" --json number,title

# Verify all high-priority assigned
gh issue list --state open --search "label:priority:critical" --json milestone

# Count unassigned
gh issue list --state open --json milestone | grep "null" | wc -l
```

---

## STEP 7: Document Allocation Decision

Create report file for future reference:

```bash
# Save as: .github/reports/milestone-allocation-{date}.md

cat > .github/reports/milestone-allocation-2026-09-04.md << 'EOF'
# Milestone Allocation Report — {Date}

## Summary
- Total Open Issues: 47
- Issues Allocated: 42 (89%)
- Issues Unallocated: 5 (11% — backlog)
- Total Effort Planned: 84 hours
- Total Capacity: 392 hours
- Overall Usage: 21%

## Milestones

### v1.0 (Sept 30) — 36 hours
Critical bugs and essential features

### v1.1 (Oct 31) — 28 hours
High-priority features and enhancements

### v1.2 (Nov 30) — 20 hours
Polish, refinements, optional features

### v1.3+ — 24 hours (Backlog)
Nice-to-have, advanced features

## Key Decisions

1. **Dependency Ordering:** #110 → #111 (both assigned, correct order)
2. **Capacity Reserve:** 20-30% buffer per milestone maintained
3. **Critical Issues:** All 5 critical issues in v1.0
4. **High-Priority:** Split between v1.0 (2) and v1.1 (3)

## Allocation Table
[Full table from STEP 4]

## Validation
[Checklist from STEP 5]

---
Created: {Date}
Reviewed: {Your name}
EOF
```

---

## STEP 8: Communicate Allocation to Team

Share milestone plans:

```markdown
## Team Communication

**To:** Development team  
**Subject:** Milestone allocation for v1.0–v1.3

We've allocated 47 open issues across 4 milestones:

- **v1.0 (Sept 30):** 36 hours — Critical bugs + essential features
- **v1.1 (Oct 31):** 28 hours — Enhancements + high-priority features
- **v1.2 (Nov 30):** 20 hours — Polish + optional features
- **v1.3+ (Backlog):** 24 hours — Nice-to-have features

Each milestone has 20-30% buffer for unexpected work.

**Next Steps:**
- Review your assigned issues
- Flag any blockers or dependencies
- Update effort estimates if different
- Start v1.0 sprint planning

**Allocation Report:** `.github/reports/milestone-allocation-2026-09-04.md`
```

---

## Ongoing Maintenance

### Weekly Milestone Review

```bash
# Check milestone progress
gh issue list --milestone "v1.0" --state open --json number,title

# Update estimates if work takes longer
# Move issues to next milestone if blocked
```

### Rebalancing When Needed

If allocation becomes unbalanced:

1. **If milestone too full (> 90%):**
   - Move lower-priority items to next milestone
   - Split large XL items if possible
   - Review buffer usage

2. **If milestone too empty (< 40%):**
   - Pull items from next milestone
   - Add from backlog
   - Consider scope expansion

3. **If critical issue discovered:**
   - Insert into nearest appropriate milestone
   - Rebalance if needed
   - Communicate change to team

---

## References

- **Milestone Management:** GitHub Issues → Milestones
- **Allocation Strategy:** `docs/MILESTONE_ALLOCATION_STRATEGY.md`
- **Priority Labels:** `.github/labels.yml` (priority:* family)
- **Active Projects:** `.github/projects/active/` (time estimates there)
- **Reports Location:** `.github/reports/`
- **Release Calendar:** Project dashboard or wiki (if maintained)

---

**Effort:** 2–4 hours to allocate all open issues  
**Use When:** Planning release cycle, allocating issues to milestones  
**Output:** Milestone allocations, utilization charts, allocation report  
**Dependencies:** GitHub access, ability to read issue details, team capacity estimates
