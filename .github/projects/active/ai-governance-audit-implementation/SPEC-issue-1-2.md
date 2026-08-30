---
openspec_version: "1.0"
type: "issue"
issue_type: "task"
title: "docs/governance: Add branch naming section to AGENTS.md"
labels: ["type:documentation", "area:governance", "priority:critical"]
milestone: "v1.1"
assignee: null
linked_issue: null
---

# Add Branch Naming Section to AGENTS.md

## Problem

AGENTS.md is the "global AI rules" file for LightSpeed (per CLAUDE.md line 12), but it currently has **no section on branch naming**. This is a critical gap because:

1. AGENTS.md is where global AI governance rules belong
2. AI agents should read this file for standards
3. Missing section means branch naming rules aren't discoverable in the central governance document

**Audit Finding:** AGENTS.md full scan shows zero mentions of "branch naming" or "branch prefix"

## Solution

Add a new top-level section to AGENTS.md immediately after the "Agent Directory" section, titled **"Branch Naming Convention"** with:

1. **Summary of the rule:** `{type}/{scope}-{title}` pattern is mandatory for all branches
2. **Cross-reference to CLAUDE.md:** Link to the moved branch naming section (Issue 1.1)
3. **Forbidden prefixes:** List `claude/`, `copilot/`, `openai/` with rationale
4. **Why it matters:** Brief explanation of consequences (PR templates, automation)
5. **Examples:** 3-5 valid and invalid examples
6. **Link to detailed rules:** Reference `.github/instructions/branch-naming.instructions.md`
7. **Link to strategy doc:** Reference `docs/BRANCHING_STRATEGY.md` (to be created in Issue 5.1)

## Definition of Done

- [ ] New section "Branch Naming Convention" added to AGENTS.md
- [ ] Section placed before "Contribution Guidelines" section (top-level)
- [ ] Includes all 5 components above
- [ ] Explains forbidden prefixes and consequences
- [ ] Cross-references to CLAUDE.md section (Issue 1.1)
- [ ] Cross-references to detailed instructions
- [ ] At least 5 examples (valid and invalid)
- [ ] Validated with: `npm run lint:md`
- [ ] PR merged

## Related Issues

- Issue 1.1 — Move branch naming rules to top of CLAUDE.md (dependency)
- Issue 1.3 — Add branch naming to custom-instructions.md (dependent)
- Issue 5.1 — Create BRANCHING_STRATEGY.md (will be referenced)

## Audit References

**Source:** Phase 1-2 Governance Audit Report, section 1.2  
**Finding:** AGENTS.md has no branch naming section despite being the "global AI rules" file  
**Impact:** Central governance document doesn't mention branch naming requirements
