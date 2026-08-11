---
title: "OpenSpec Coordination Implementation Plan"
description: "Step-by-step plan for implementing OpenSpec specification coordination with GitHub issues"
type: "implementation-plan"
created_date: "2026-08-11"
---

# OpenSpec Coordination Implementation Plan

## Overview

This plan details how to implement the coordination model described in [RFC.md](./RFC.md), establishing bidirectional linking between OpenSpec specifications and GitHub issues.

---

## Phase 1: Immediate Actions (This Session)

### 1.1 Create GitHub Issues for agent-tool-permission-alignment Spec

**Master Epic Issue:**

```
Title: Agent-Tool Permission Contract — Canonical Tool/Permission Alignment
Type: Epic
Labels: type:epic, area:agents, priority:important

Body:

## Overview

Establish canonical contract for agent tool access and permissions across
the repository. This epic tracks the specification and implementation of
unified tool/permission governance.

## Problem

Agent specifications are currently inconsistent in tool declarations and
permissions, causing unpredictable execution behavior and weakening MCP
security posture. We need a single enforceable contract.

## Related OpenSpec

This epic implements the agent-tool-permission-alignment specification.

**Specification Documents:**
- Proposal: [proposal.md](openspec/changes/agent-tool-permission-alignment/proposal.md)
- Design: [design.md](openspec/changes/agent-tool-permission-alignment/design.md)
- Tasks: [tasks.md](openspec/changes/agent-tool-permission-alignment/tasks.md)
- Formal Spec: [spec.md](openspec/changes/agent-tool-permission-alignment/specs/agent-tool-permission-contract/spec.md)

## What's Changing

- Define canonical tool/permission contract for agent frontmatter
- Introduce profile tiers (standard, reviewer-only, planning-only, etc.)
- Add automated validation for all agent specs
- Add CI enforcement before merge

## Scope

Affected files: All `agents/*.agent.md`, `plugins/**/agents/*.agent.md`

## Sub-Issues

See phase issues below (Phase 1-4).

---
```

**Phase Issue #1: Audit Existing Agent Specs**

```
Title: Phase 1: Audit Existing Agent Specs — agent-tool-permission-alignment
Type: Task
Parent Epic: [Master Epic #]
Labels: type:task, area:agents

Body:

## Overview

Audit all existing agent specifications to understand current state
of tool declarations and permissions.

## Related Spec

Parent epic: [Master Epic]
Specification: openspec/changes/agent-tool-permission-alignment/

## Tasks

- [ ] Inventory all `agents/*.agent.md` files
- [ ] Document current tool/permission patterns
- [ ] Identify non-compliant agents
- [ ] Create remediation list
- [ ] Document findings in audit report

## Definition of Done

- [ ] Audit report completed
- [ ] Non-compliant agents identified
- [ ] Pattern analysis documented
- [ ] Findings shared with team

---
```

**Phase Issue #2: Design Tool/Permission Contract**

```
Title: Phase 2: Design Tool/Permission Contract — agent-tool-permission-alignment
Type: Task
Parent Epic: [Master Epic #]
Labels: type:task, area:agents

Body:

## Overview

Design the canonical tool/permission contract and profile tiers
based on audit findings and baseline agent model.

## Related Spec

Parent epic: [Master Epic]
Specification: openspec/changes/agent-tool-permission-alignment/
Design doc: [design.md](openspec/changes/agent-tool-permission-alignment/design.md)

## Tasks

- [ ] Define baseline profile (based on release agent)
- [ ] Define profile tiers (standard, reviewer-only, planning-only, etc.)
- [ ] Document required/optional tool scopes per tier
- [ ] Create remediation mapping for legacy agents
- [ ] Write formal specification

## Definition of Done

- [ ] Contract specification completed
- [ ] Profile tiers defined
- [ ] Mapping for legacy agents documented
- [ ] Design reviewed by architecture

---
```

**Phase Issue #3: Implement Validation & CI Enforcement**

```
Title: Phase 3: Implement Validation & CI Enforcement — agent-tool-permission-alignment
Type: Task
Parent Epic: [Master Epic #]
Labels: type:task, area:agents, area:ci

Body:

## Overview

Implement automated validation and CI enforcement for the tool/permission contract.

## Related Spec

Parent epic: [Master Epic]
Specification: openspec/changes/agent-tool-permission-alignment/

## Tasks

- [ ] Create validation script (`scripts/validate-agent-contract.js` or similar)
- [ ] Define validation rules for required keys and allowed values
- [ ] Implement CI workflow to validate all agent specs
- [ ] Add remediation guidance for non-compliant specs
- [ ] Document validation process

## Definition of Done

- [ ] Validation script working
- [ ] CI workflow validates on PR
- [ ] Non-compliant agents flagged before merge
- [ ] Remediation guidance available

---
```

**Phase Issue #4: Review & Approve All Agent Specs**

```
Title: Phase 4: Review & Approve All Agent Specs — agent-tool-permission-alignment
Type: Task
Parent Epic: [Master Epic #]
Labels: type:task, area:agents

Body:

## Overview

Review and remediate all existing agent specifications to comply with
the new tool/permission contract.

## Related Spec

Parent epic: [Master Epic]
Specification: openspec/changes/agent-tool-permission-alignment/

## Tasks

- [ ] Review all non-compliant agents from audit
- [ ] Apply contract to each agent spec
- [ ] Update agent frontmatter per contract
- [ ] Validate all specs with CI enforcement
- [ ] Get sign-off from architecture

## Definition of Done

- [ ] All agent specs compliant with contract
- [ ] CI validation passes for all specs
- [ ] No agent specs blocked by validation
- [ ] Architecture sign-off obtained

---
```

### 1.2 Create GitHub Issues for test-coverage-implementation Spec

**Master Epic Issue:**

```
Title: Test Coverage Expansion — 80%+ Coverage with 62-Task Programme
Type: Epic
Labels: type:epic, area:testing, priority:important

Body:

## Overview

Expand test coverage across the repository from current baseline to 80%+
coverage with a structured 62-task programme across 6 phases.

## Problem

Current test coverage is below target. We need a systematic programme to
expand coverage with tracked, phased implementation.

## Related OpenSpec

This epic implements the test-coverage-implementation specification.

**Specification Documents:**
- Project README: [.github/projects/active/test-coverage-implementation/README.md]
- Proposal: [proposal.md](openspec/changes/test-coverage-implementation/proposal.md)
- Design: [design.md](openspec/changes/test-coverage-implementation/design.md)
- Tasks: [tasks.md](openspec/changes/test-coverage-implementation/tasks.md)
- Formal Spec: [spec.md](openspec/changes/test-coverage-implementation/specs/coverage-programme-issue-chain/spec.md)

## Coverage Target

**Target:** 80%+ coverage  
**Current:** [TBD - to be measured]  
**Programme:** 6 phases, 62 tasks  

## Scope

Full test coverage across:
- Unit tests
- Integration tests
- Workflow validation
- Agent testing
- Script testing

## Sub-Issues

See phase issues below (Phase 1-6).

---
```

**Phase Issues #5-10 (One per Phase):**

Create 6 identical-template issues (Phase 1-6):

```
Title: Phase [N]: [Phase Description] — test-coverage-implementation
Type: Task
Parent Epic: [Master Epic #]
Labels: type:task, area:testing

Body:

## Overview

Implement [Phase N] of the 62-task test coverage expansion programme.

## Related Spec

Parent epic: [Master Epic]
Specification: openspec/changes/test-coverage-implementation/
OpenSpec input file: [coverage-programme-issue-chain strict inputs]

## Phase Description

[Based on test-coverage-implementation/tasks.md Phase [N] description]

## Tasks

- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]
... (per phase)

## Coverage Metrics

Before: [Current coverage %]
Target: [Target coverage %]
After: [Measured after completion]

## Definition of Done

- [ ] All [Phase N] tasks completed
- [ ] Coverage metrics updated
- [ ] Tests passing in CI
- [ ] Code reviewed

---
```

---

## Implementation Workflow

### Step 1: Create All GitHub Issues

Using the templates above, create **11 GitHub issues total:**

- 1 Master Epic (agent-tool-permission-alignment)
- 4 Phase Issues (Phases 1-4)
- 1 Master Epic (test-coverage-implementation)
- 6 Phase Issues (Phases 1-6)

**Command reference:**
```bash
# Create issue via GitHub CLI
gh issue create --title "..." --body "..." --type epic --label ...
```

### Step 2: Update proposal.md Files with Issue Links

After creating issues, edit both specs' proposal.md to add "GitHub Coordination" section:

**openspec/changes/agent-tool-permission-alignment/proposal.md:**

Add at top:

```markdown
## GitHub Coordination

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#XXXX](../../../issues/XXXX) | epic | Coordinate agent-tool permission contract | 🟢 Open |
| [#XXXX](../../../issues/XXXX) | task | Phase 1: Audit existing specs | 🟢 Open |
| [#XXXX](../../../issues/XXXX) | task | Phase 2: Design contract & tiers | ⏳ Planned |
| [#XXXX](../../../issues/XXXX) | task | Phase 3: Implement validation | ⏳ Planned |
| [#XXXX](../../../issues/XXXX) | task | Phase 4: Review & approve all specs | ⏳ Planned |
```

**openspec/changes/test-coverage-implementation/proposal.md:**

Add at top:

```markdown
## GitHub Coordination

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#XXXX](../../../issues/XXXX) | epic | Test coverage expansion to 80%+ | 🟢 Open |
| [#XXXX](../../../issues/XXXX) | task | Phase 1: [Description] | 🟢 Open |
| [#XXXX](../../../issues/XXXX) | task | Phase 2: [Description] | ⏳ Planned |
| [#XXXX](../../../issues/XXXX) | task | Phase 3: [Description] | ⏳ Planned |
| [#XXXX](../../../issues/XXXX) | task | Phase 4: [Description] | ⏳ Planned |
| [#XXXX](../../../issues/XXXX) | task | Phase 5: [Description] | ⏳ Planned |
| [#XXXX](../../../issues/XXXX) | task | Phase 6: [Description] | ⏳ Planned |
```

### Step 3: Commit and Create PR

1. Add symlink to openspec root (if not already done)
2. Commit RFC.md, COORDINATION_PLAN.md, updated proposal.md files
3. Create PR with proper template

---

## Timeline

| Activity | Date | Owner |
|----------|------|-------|
| Create GitHub issues | 2026-08-12 | Ash |
| Update proposal.md files | 2026-08-12 | Ash |
| Review RFC with team | 2026-08-14 | Ash |
| Approve RFC | 2026-08-15 | Team |
| Begin Phase 1 implementation (agent-tool) | 2026-08-16 | [TBD] |
| Begin Phase 1 implementation (test-coverage) | 2026-08-16 | [TBD] |

---

## Success Criteria

✅ All 11 GitHub issues created  
✅ Bidirectional linking established (spec ↔ issue)  
✅ proposal.md files updated with issue links  
✅ OpenSpec README updated with coordination standard  
✅ Team understands OpenSpec coordination model  
✅ RFC approved by team  
✅ PR with OpenSpec docs merged to develop  

---

## Related Documents

- [RFC.md](./RFC.md) — Request for Comments & rationale
- [README.md](./README.md) — Operational notes
- Active Specs:
  - `openspec/changes/agent-tool-permission-alignment/`
  - `openspec/changes/test-coverage-implementation/`

---

**Plan Status:** 📝 Ready to implement  
**Target Start:** 2026-08-12  
**Target Completion:** 2026-08-15
