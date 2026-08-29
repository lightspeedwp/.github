---
file_type: report
title: Agent Specification Audit Report
description: Comprehensive audit of agent specs and implementation folder coverage
date: "2026-08-29"
status: "complete"
category: "agent-audit"
---

# Agent Specification Audit Report

## Overview

This report documents a comprehensive audit of agent specification files (`.agent.md`) versus their implementation folders in the `.github/agents/` directory.

**Key Finding:** 28 agent implementation folders exist, but only 8 have corresponding spec files (28% coverage). Additionally, 11 spec files have no corresponding implementation folder.

## Reports in This Audit

### 1. [AGENT_SPEC_AUDIT_REPORT.md](./AGENT_SPEC_AUDIT_REPORT.md)

**Detailed Findings & Analysis**

- Complete coverage statistics
- List of all 20 agents missing specs
- List of all 11 orphaned specs
- Cross-referencing issues
- Naming inconsistencies
- Implementation status table
- Architectural recommendations

**Use this for:** Understanding the full scope of the gap and architectural decisions needed.

### 2. [AGENT_SPEC_ACTION_PLAN.md](./AGENT_SPEC_ACTION_PLAN.md)

**Prioritized Implementation Plan**

- 5-phase action plan:
  1. **Phase 1:** Clarify architecture (immediate)
  2. **Phase 2:** Create 20 missing specs (priority)
  3. **Phase 3:** Add cross-references
  4. **Phase 4:** Setup validation
  5. **Phase 5:** Update documentation
  
- Task breakdown with effort estimates
- Success criteria
- Timeline summary

**Use this for:** Implementing the recommendations and tracking progress.

### 3. [AGENT_NAMING_CONVENTIONS.md](./AGENT_NAMING_CONVENTIONS.md)

**Naming Standards & Guidelines**

- Spec file naming rules: `{name}.agent.md`
- Implementation folder patterns
- File organization standards within agent folders
- Frontmatter conventions
- Consistency checklist
- Migration guidance for existing agents

**Use this for:** Creating new agents and ensuring naming consistency.

## Quick Statistics

```
Total Agent Folders:             28
├─ With Specs:                   8 (28%)
└─ Missing Specs:               20 (72%)

Total Spec Files:               19
├─ With Implementation:          8 (42%)
└─ Orphaned:                    11 (58%)

Cross-Reference Coverage:         0% (None found)
```

## Recommendations Summary

### Immediate (Phase 1)

- [ ] Decide on architecture (Spec+Impl, Spec-Only, Hybrid)
- [ ] Classify orphaned specs (mode specs, utilities, deprecated)
- [ ] Create `.github/agents/README.md` clarifying organization

### High Priority (Phase 2-3)

- [ ] Create 20 missing spec files (2-3 hours)
- [ ] Add cross-references to all 28 specs and folders (3-4 hours)

### Follow-up (Phase 4-5)

- [ ] Setup validation scripts
- [ ] Update contributing guidelines

## Architecture Decision Needed

**Question:** What is the intended structure?

```
OPTION A: Every Agent Gets a Spec
├─ All 28 agents have both spec + implementation

OPTION B: Mode Specs vs Implementation Specs  
├─ Mode specs (like mode-thinking) are spec-only
├─ Full agents have both spec + implementation

OPTION C: Portable vs GitHub-Native Split
├─ Move portable agents to root-level agents/ folder
├─ Keep GitHub-native agents in .github/agents/
```

Per `CLAUDE.md` line 36: "Do **not** place reusable assets under `.github/`" — this suggests eventually all agent specs should move to top-level `agents/` folder.

**Recommendation:** Confirm architecture before proceeding with Phase 2.

## Next Steps

1. **Read the audit report** → Understand the gap
2. **Review action plan** → Plan implementation
3. **Make architecture decision** → Choose Option A, B, or C
4. **Execute Phase 1** → Clarify and organize
5. **Execute Phases 2-5** → Implement specs and cross-references

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) — Project guidelines and structure
- [AGENTS.md](../../AGENTS.md) — Global AI rules
- [.github/agents/README.md](../../agents/README.md) — Agent directory (to be created)
- [Contributing Guide](../../CONTRIBUTING.md) — Developer guidelines (to be updated)

## Report Metadata

- **Audit Date:** 2026-08-29
- **Auditor:** Claude Code
- **Repository:** lightspeedwp/.github
- **Branch:** audit/agent-spec-documentation-coverage
- **Status:** ✓ Complete
- **Next Review:** After Phase 1 architecture decision

---

**Recommendation:** Create all missing specs and add cross-references to achieve 100% coverage.

For questions or follow-up, review the detailed audit report or action plan.
