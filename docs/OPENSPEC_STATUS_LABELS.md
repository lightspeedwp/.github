---
title: OpenSpec Status Labels — Specification & Implementation Lifecycle
description: Comprehensive guide to the 6 OpenSpec status labels for tracking specification and implementation phases across projects
file_type: documentation
version: v1.0.0
created_date: '2026-08-18'
last_updated: '2026-08-18'
authors:
  - Claude Code
  - LightSpeed Team
maintainer: LightSpeed Team
owners:
  - lightspeedwp/maintainers
license: GPL-3.0
tags:
  - labels
  - openspec
  - specification
  - implementation
  - lifecycle-tracking
  - status
domain: governance
status: active
stability: stable
---

# OpenSpec Status Labels — Specification & Implementation Lifecycle

**Version**: v1.0.0  
**Created**: 2026-08-18  
**Owner**: LightSpeed Team  
**Reference Config**: `.github/labels.yml`

---

## Executive Summary

The OpenSpec status labels provide a standardized way to track the lifecycle of work items through two key phases: **specification** and **implementation**. These labels enable clear visibility into project maturity, cross-project coordination, and automated workflows based on specification/implementation status.

**Key Benefits**:

- ✅ **Explicit Phase Tracking** — Know exactly where each project stands (specification vs implementation)
- ✅ **Color-Coded Progression** — Blue (pending) → Yellow (in-progress) → Green (complete)
- ✅ **Cross-Project Coordination** — Identify which projects are ready for integration
- ✅ **Automation Support** — Enable workflows based on specification completion
- ✅ **Parallel Tracking** — Issues can have both specification AND implementation labels

---

## 1. Label Overview

### 1.1 The Six OpenSpec Labels

| Label | Color | Phase | Status | Purpose |
|-------|-------|-------|--------|---------|
| `openspec:specification-pending` | Blue | Specification | Pending | OpenSpec specification needed |
| `openspec:specification-in-progress` | Yellow | Specification | Active | OpenSpec specification being written |
| `openspec:specification-complete` | Green | Specification | Done | OpenSpec specification complete and approved |
| `openspec:implementation-pending` | Blue | Implementation | Pending | Implementation pending (spec complete) |
| `openspec:implementation-in-progress` | Yellow | Implementation | Active | Implementation in progress |
| `openspec:implementation-complete` | Green | Implementation | Done | Implementation complete and tested |

### 1.2 Color Scheme: Progression Metaphor

The OpenSpec labels follow a **Blue → Yellow → Green** lifecycle progression:

- 🔵 **Blue (#C5DEF5)** — Pending / Not yet started
- 🟡 **Yellow (#F2D06D)** — In Progress / Active work
- 🟢 **Green (#1A7F37)** — Complete / Ready for next phase

This colour scheme is consistent across both specification and implementation phases.

---

## 2. Lifecycle & Phase Definitions

### 2.1 Specification Phase

**Purpose**: Define what needs to be built

| Status | Label | Meaning | What It Means |
|--------|-------|---------|---------------|
| **Pending** | `openspec:specification-pending` | Specification needed | Work hasn't started; no OpenSpec yet. Could be: new initiative, upcoming phase, deferred from backlog. |
| **In Progress** | `openspec:specification-in-progress` | Specification being written | Active work on OpenSpec; design/planning underway. May involve: mockups, architecture docs, requirements gathering. |
| **Complete** | `openspec:specification-complete` | Specification done | OpenSpec is approved and ready for implementation; implementation can begin. |

**Specification Activities** (non-exhaustive):

- 📋 Requirements gathering
- 📐 Architecture & design planning
- 🎨 UI/UX mockups (Figma designs)
- 📝 API specifications
- ✅ Acceptance criteria definition
- 🔍 Review & approval cycle

### 2.2 Implementation Phase

**Purpose**: Build what was specified

| Status | Label | Meaning | What It Means |
|--------|-------|---------|---------------|
| **Pending** | `openspec:implementation-pending` | Implementation pending | Specification is complete; implementation hasn't started yet. Could be: waiting for resources, sequenced after other work, scheduled for later. |
| **In Progress** | `openspec:implementation-in-progress` | Implementation active | Active development/engineering work. Code is being written, integrated, tested. |
| **Complete** | `openspec:implementation-complete` | Implementation done | Feature/component is built, tested, and production-ready. |

**Implementation Activities** (non-exhaustive):

- 💻 Code development
- 🧪 Unit & integration testing
- 📚 Technical documentation
- 🔍 Code review cycles
- 🚀 Integration with existing systems
- ✅ QA & user acceptance testing

---

## 3. Assignment Rules & Guidelines

### 3.1 Core Rules

1. **One per phase** — An issue can have BOTH a specification label AND an implementation label
   - ✅ Both: `openspec:specification-complete` + `openspec:implementation-in-progress`
   - ✅ Both: `openspec:specification-pending` + `openspec:implementation-pending`
   - ❌ Multiple of same phase: `openspec:specification-pending` + `openspec:specification-in-progress`

2. **Specification before implementation** — Follow the natural progression
   - 🔵 Pending → 🟡 In-progress → 🟢 Complete (spec)
   - Then: 🔵 Pending → 🟡 In-progress → 🟢 Complete (impl)

3. **Not mutually exclusive with other labels** — OpenSpec labels work alongside Type, Status, Priority
   - ✅ `type:feature` + `status:in-progress` + `openspec:implementation-in-progress`
   - ✅ `priority:critical` + `openspec:specification-pending`

4. **Remove when no longer applicable** — Retire labels if direction changes
   - If work is cancelled: remove all OpenSpec labels
   - If deprioritized: move back (e.g., `in-progress` → `pending`)

### 3.2 When to Apply

**Apply `specification-pending` when**:
- New initiative/feature is approved for work
- Initiative is backlog-prioritized
- Work is transitioning from idea to detailed planning

**Apply `specification-in-progress` when**:
- Actively writing/designing the specification
- Gathering requirements & feedback
- Creating mockups, architecture docs, acceptance criteria

**Apply `specification-complete` when**:
- OpenSpec document is finished and approved
- Acceptance criteria are finalized
- Ready for development team to begin implementation

**Apply `implementation-pending` when**:
- Specification is done
- Not yet started development
- Scheduled for a future sprint/phase

**Apply `implementation-in-progress` when**:
- Code development is active
- Feature is being built, integrated, tested
- Pull requests are open

**Apply `implementation-complete` when**:
- Feature is fully built and tested
- Code is merged to production/main branch
- Feature is live or ready for release

---

## 4. Practical Examples

### 4.1 Example 1: Standard Feature Flow

**Feature: "Add user authentication system"**

Timeline:
- **Week 1**: Created with `type:feature` + `openspec:specification-pending`
- **Week 2-3**: Spec writing begins → Add `openspec:specification-in-progress`
- **Week 4**: Spec approved → Replace with `openspec:specification-complete`
- **Week 5**: Dev starts → Add `openspec:implementation-pending` → `openspec:implementation-in-progress`
- **Week 8**: Feature complete → Replace with `openspec:implementation-complete`

**Final state**: `type:feature` + `status:done` + `openspec:implementation-complete`

### 4.2 Example 2: Parallel Specification & Implementation

**Feature: "Payment processing integration"**

Scenario: While specification continues, some implementation prep happens (e.g., infrastructure setup)

- Week 1: `openspec:specification-pending` + `openspec:implementation-pending`
- Week 2-3: Spec in progress → `openspec:specification-in-progress` + `openspec:implementation-pending`
- Week 3: Infra ready, dev starts prep work → `openspec:specification-in-progress` + `openspec:implementation-in-progress`
- Week 4: Spec done → `openspec:specification-complete` + `openspec:implementation-in-progress`
- Week 7: Dev complete → `openspec:specification-complete` + `openspec:implementation-complete`

### 4.3 Example 3: Specification-Only Work

**Issue: "Architecture decision record for microservices migration"**

- Issue created: `type:documentation` + `openspec:specification-pending`
- ADR writing: `openspec:specification-in-progress`
- ADR approved: `openspec:specification-complete`

*Note: No implementation phase — this is pure specification work.*

### 4.4 Example 4: Deferred Implementation

**Feature: "Advanced search filters"**

- Week 1-2: Specification → `openspec:specification-complete`
- Then: `openspec:implementation-pending` (deferred to Q4 due to resource constraints)
- Q4 Week 1: Development starts → `openspec:implementation-in-progress`

---

## 5. Automation & Integration

### 5.1 Recommended Workflows

**Auto-transition on PR close** (potential future automation):

```
IF: PR merged AND issue has `openspec:implementation-in-progress`
THEN: Consider auto-applying `openspec:implementation-complete`
NOTE: Manual review recommended before automation
```

**Slack notifications** (potential integration):

```
Channel: #feature-releases
"🟢 Feature "Auth System" implementation complete! 
 Status: openspec:implementation-complete
 Link: [issue #1234]"
```

**Release readiness check**:

```
Can we release?
✅ All features with `type:feature` have `openspec:implementation-complete`
```

### 5.2 Query Examples

**Find all specification work in progress**:

```bash
gh issue list --repo lightspeedwp/project --label openspec:specification-in-progress
```

**Find all work ready for implementation** (spec complete, impl pending):

```bash
gh issue list --repo lightspeedwp/project \
  --label openspec:specification-complete \
  --label openspec:implementation-pending
```

**Find implementation blockers** (spec incomplete, but impl started):

```bash
gh issue list --repo lightspeedwp/project \
  --label openspec:specification-pending \
  --label openspec:implementation-in-progress
```

---

## 6. Common Scenarios & Troubleshooting

### 6.1 "Should I use both specification labels?"

❌ **No.** Only one per phase.

```
❌ openspec:specification-pending + openspec:specification-in-progress
✅ openspec:specification-in-progress (just this one)
```

### 6.2 "What if specification changes during implementation?"

**Option A: Keep both** (if changes are minor)
- Keep `openspec:implementation-in-progress`
- Remove `openspec:specification-complete`
- Add `openspec:specification-in-progress`

**Option B: Defer & restart** (if changes are major)
- Remove implementation labels
- Go back to specification phase
- Restart both phases once spec is re-approved

### 6.3 "What if we cancel the work?"

Remove all OpenSpec labels. The issue can remain as documentation but won't signal active specification/implementation status.

### 6.4 "Can I have implementation without specification?"

Generally **no** — specification should precede implementation. However:

- 🟡 **Spike/POC work** might skip formal spec → Use `type:research` + `openspec:implementation-pending`
- 🟡 **Bug fixes** might not need spec → Don't use OpenSpec labels; use `type:bug` instead

---

## 7. Integration with Other Labels

### 7.1 Complementary Labels

| Label Type | Examples | Relationship |
|------------|----------|--------------|
| **Status** | `status:in-progress`, `status:blocked` | Orthogonal; both can be applied |
| **Priority** | `priority:critical`, `priority:normal` | Independent; use together |
| **Type** | `type:feature`, `type:bug`, `type:documentation` | Always include one Type label |
| **Area** | `area:security`, `area:documentation` | Include if domain-specific |

**Example full label set**:

```
Issue: "Implement 2FA authentication"

Labels:
- type:feature (REQUIRED: work classification)
- priority:important (REQUIRED: urgency)
- status:in-progress (RECOMMENDED: workflow state)
- openspec:specification-complete (OpenSpec spec done)
- openspec:implementation-in-progress (OpenSpec impl active)
- area:security (RECOMMENDED: domain)
- lang:php (OPTIONAL: primary language)
```

### 7.2 Anti-patterns (Avoid)

❌ **Issue has no Type label but has OpenSpec label**
- OpenSpec should supplement, not replace, Type labels
- ✅ Add both: `type:feature` + `openspec:specification-pending`

❌ **Issue has OpenSpec label but no Status label**
- OpenSpec tracks phases; Status tracks workflow
- ✅ Add both: `status:in-progress` + `openspec:specification-in-progress`

---

## 8. Migration & Adoption

### 8.1 Applying to Existing Issues

**Spreadsheet approach**:

1. Export current issues/PRs
2. Identify specification & implementation status
3. Batch-apply appropriate OpenSpec labels via automation script

**Manual approach**:

1. Start with new issues going forward
2. Gradually backfill high-priority issues
3. Leave historical issues unlabeled (unless actively worked)

### 8.2 Automated Labeling

The `scripts/automation/auto-update-all.js` script can auto-detect and apply OpenSpec labels based on issue title keywords:

```bash
npm run auto-update -- --batch 50
```

Detected patterns:

- `spec:`, `specification:`, `planning:`, `design:` → `openspec:specification-in-progress`
- `impl:`, `implementation:`, `build:`, `code:` → `openspec:implementation-in-progress`

---

## 9. Best Practices & Recommendations

### 9.1 Best Practices

✅ **DO:**

- Use OpenSpec labels from issue creation
- Update labels as work progresses through phases
- Combine with Status labels for workflow clarity
- Document reason when applying/removing OpenSpec labels
- Review OpenSpec labels during sprint planning

❌ **DON'T:**

- Apply multiple of same-phase labels
- Use OpenSpec labels on documentation/chore issues (unless specification work)
- Leave labels stale (update when status changes)
- Use OpenSpec labels to replace Type/Status labels

### 9.2 Team Coordination

**Recommended practices for teams**:

1. **Sprint planning** — Review `openspec:specification-pending` items to prioritize spec writing
2. **Standup** — Call out items transitioning between phases (spec→impl)
3. **Release planning** — Filter for `openspec:implementation-complete` features only
4. **Retrospective** — Review phase transitions; identify bottlenecks

---

## 10. Related Documentation

- **[LABEL_STRATEGY.md](./LABEL_STRATEGY.md)** — Overall label governance
- **[LABEL_INVENTORY.md](./LABEL_INVENTORY.md)** — Complete label reference (includes OpenSpec)
- **[LABELING.md](./LABELING.md)** — Labeling standards & conventions
- **[ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md)** — Creating issues with proper labels

---

## 11. Changelog

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2026-08-18 | Initial OpenSpec status labels documentation |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
