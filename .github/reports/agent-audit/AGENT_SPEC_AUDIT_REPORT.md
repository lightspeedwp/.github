---
file_type: audit-report
title: Agent Specification Audit Report
description: Comprehensive audit of agent spec files and their corresponding implementations
date: "2026-08-29"
audit_version: "v1.0"
status: "complete"
---

# Agent Specification Audit Report

## Executive Summary

This audit reviews the completeness and cross-referencing of agent specification files (`.agent.md`) against their implementation folders in the `.github/agents/` directory. The findings reveal significant gaps:

- **28 agent implementation folders** exist
- **19 agent spec files** exist  
- **Only 8 agents (28%)** have corresponding spec files
- **11 spec files (58%)** have no matching implementation folder
- **Spec files lack cross-references** to their implementation folders

## Key Findings

### 1. Coverage Gap: Missing Specs (72%)

Twenty agent folders exist without corresponding `.agent.md` spec files:

| Agent Folder | Status | Recommendation |
|---|---|---|
| `ai-readiness-estimator-agent` | Missing spec | Create `ai-readiness-estimator.agent.md` |
| `changelog` | Missing spec | Create `changelog.agent.md` |
| `chat-closure-agent` | Missing spec | Create `chat-closure.agent.md` |
| `client-website-discovery-assistant-agent` | Missing spec | Create `client-website-discovery.agent.md` |
| `design-partner-agent` | Missing spec | Create `design-partner.agent.md` |
| `harvest-analytical-agent` | Missing spec | Create `harvest-analytical.agent.md` |
| `linear-advisor-agent` | Missing spec | Create `linear-advisor.agent.md` |
| `metadata-agent` | Missing spec | Create `metadata.agent.md` |
| `pagespeed-agent` | Missing spec | Create `pagespeed.agent.md` |
| `pr-creation-agent` | Missing spec | Create `pr-creation.agent.md` |
| `prd-agent` | Missing spec | Create `prd.agent.md` |
| `prd-factory-planner-agent` | Missing spec | Create `prd-factory-planner.agent.md` |
| `proposal-desk-agent` | Missing spec | Create `proposal-desk.agent.md` |
| `tour-operator-config-agent` | Missing spec | Create `tour-operator-config.agent.md` |
| `website-content-strategist-agent` | Missing spec | Create `website-content-strategist.agent.md` |
| `website-scope-estimator-agent` | Missing spec | Create `website-scope-estimator.agent.md` |
| `woo-config-agent` | Missing spec | Create `woo-config.agent.md` |
| `wordpress` | Missing spec | Create `wordpress.agent.md` |
| `wp-config-agent` | Missing spec | Create `wp-config.agent.md` |
| `zendesk-support-agent` | Missing spec | Create `zendesk-support.agent.md` |

### 2. Orphaned Specs (58%)

Eleven spec files exist without corresponding implementation folders:

| Spec File | Status | Resolution |
|---|---|---|
| `issues.agent.md` | Orphaned | Verify intent - is this spec-only or should implementation folder exist? |
| `labeling.agent.md` | Orphaned | Verify intent - is this spec-only or should implementation folder exist? |
| `metrics.agent.md` | Orphaned | Verify intent - is this spec-only or should implementation folder exist? |
| `mode-demonstrate-understanding.agent.md` | Orphaned | Verify intent - this appears to be a mode spec, not implementation |
| `mode-document-reviewer.agent.md` | Orphaned | Verify intent - this appears to be a mode spec, not implementation |
| `mode-prd.agent.md` | Orphaned | Verify intent - this appears to be a mode spec, not implementation |
| `mode-thinking.agent.md` | Orphaned | Verify intent - this appears to be a mode spec, not implementation |
| `project-meta-sync.agent.md` | Orphaned | Verify intent - is this spec-only or should implementation folder exist? |
| `reporting.agent.md` | Orphaned | Verify intent - is this spec-only or should implementation folder exist? |
| `reviewer.agent.md` | Orphaned | Verify intent - is this spec-only or should implementation folder exist? |
| `template.agent.md` | Orphaned | Verify intent - is this spec-only or should implementation folder exist? |

### 3. Cross-Referencing Issues

**Finding:** Spec files do NOT reference their corresponding implementation folders.

**Example - `adr.agent.md`:**

- Spec location: `.github/agents/adr.agent.md`
- Implementation folder: `.github/agents/adr-generator/`
- Cross-reference: ❌ None found

**Current state:**

- Spec files document agent purpose, inputs, outputs, and guidelines
- Implementation folders contain SKILL.md or AGENT.md with technical details
- **NO LINKS** between spec files and implementation folders
- Users cannot easily discover implementation details from spec files

**Impact:**

- Discoveryability is poor - users see spec but can't find implementation
- Maintenance is difficult - changes to implementation aren't linked from spec
- Navigation requires manual exploration

### 4. Naming Inconsistencies

One notable inconsistency in naming patterns:

| Folder | Spec File | Pattern |
|---|---|---|
| `adr-generator` | `adr.agent.md` | ❌ Generic name (spec doesn't reflect folder name) |
| `linting-agent` | `linting.agent.md` | ✓ Consistent (suffix removed) |
| `task-planner-agent` | `task-planner.agent.md` | ✓ Consistent (suffix removed) |
| `task-researcher-agent` | `task-researcher.agent.md` | ✓ Consistent (suffix removed) |

**Pattern established:** Agent spec file names should match the folder name with `-agent` suffix removed.

**Violating this pattern:**

- `adr-generator/` → `adr.agent.md` ✓ (correct after removing `-generator`)
- Remaining missing specs should follow same pattern

## Audit Statistics

```
Total Agent Folders:           28
  With Specs:                   8 (28%)
  Missing Specs:               20 (72%)

Total Spec Files:             19
  With Implementation:          8 (42%)
  Orphaned:                    11 (58%)

Cross-Reference Coverage:       0% (No spec files reference implementations)
```

## Recommendations

### Priority 1: Establish Clear Architecture (NOW)

**Decision Required:** What is the intended architecture?

**Option A: Spec + Implementation Model**

- Every agent implementation folder should have a corresponding `.agent.md` spec file
- Spec files should cross-reference their implementation folders
- Implementation folders should reference their spec files

**Option B: Spec-Only Model**

- Some agents are spec-only (like `mode-*.agent.md` files for operating modes)
- These should be clearly marked and organized separately
- Implementation folders only exist for full-featured agents

**Option C: Hybrid Model**

- Most agents follow Spec + Implementation model
- Some agents (modes, utilities) are spec-only
- Organization should make this distinction clear

### Priority 2: Add Cross-References

Once architecture is decided, update all spec files to include:

```markdown
## Implementation Reference

- **Folder:** `agents/{folder-name}/`
- **Entry Point:** `SKILL.md` or `AGENT.md`
- **Configuration:** `config/` subdirectory
- **Examples:** `examples/` subdirectory
- **Tests:** `tests/` subdirectory

[View Implementation](../path/to/implementation/README.md)
```

### Priority 3: Create Missing Specs

For each of the 20 agents without specs, create a `.agent.md` file based on:

1. **Read the agent's AGENT.md or SKILL.md** in the implementation folder
2. **Extract:** Name, description, purpose, key features
3. **Document:** Agent responsibilities, input/output, operating modes
4. **Add:** Reference links to implementation, examples, and documentation
5. **Include:** Frontmatter metadata (name, description, tags, category)

**Template to use:** Review existing specs like `task-planner.agent.md` as a reference

### Priority 4: Resolve Orphaned Specs

For each of the 11 spec files without implementations:

1. **Classify:**
   - Mode specs: `mode-*.agent.md` (operating modes, not standalone agents)
   - Utility specs: Core behaviors that don't have standalone folders
   - Deprecated: Specs for agents that no longer exist

2. **Organize:**
   - Move mode specs to a `modes/` subdirectory
   - Document utility specs' relationship to other agents
   - Archive or delete deprecated specs

3. **Document:** Create `.github/agents/README.md` clarifying the organization

### Priority 5: Implement Validation

Add to `npm run validate:frontmatter`:

```javascript
// For each .agent.md file:
1. Check if implementation folder exists (if not mode/utility spec)
2. Verify frontmatter completeness
3. Check for cross-reference links to implementation
4. Validate naming convention matches folder name
```

## Detailed Findings

### Example: ADR Agent (adr.agent.md)

**File location:** `.github/agents/adr.agent.md`
**Implementation folder:** `.github/agents/adr-generator/`

**Current Spec:**

- ✓ Clear purpose and workflow
- ✓ Detailed ADR template structure
- ✓ Quality checklist
- ❌ No reference to implementation folder
- ❌ No link to SKILL.md
- ❌ No reference to templates/ or config/
- ❌ No examples from examples/ directory

**Recommendation:** Add section:

```markdown
## Implementation Details

This agent is implemented in [`agents/adr-generator/`](../adr-generator/).

### Key Files
- **Skill Definition:** [SKILL.md](../adr-generator/SKILL.md)
- **Templates:** [templates/](../adr-generator/templates/)
- **Configuration Schema:** [config/adr-config.schema.json](../adr-generator/config/adr-config.schema.json)
- **Examples:** [examples/](../adr-generator/examples/)
```

### Example: Task Planner Spec (task-planner.agent.md)

**Status:** Good example of comprehensive spec

- ✓ Clear operating modes documented
- ✓ Detailed workflow descriptions
- ✓ Input/output specifications
- ✓ References related agents (line 300)
- ✓ References documentation (line 306)
- ❌ No direct reference to `agents/task-planner-agent/` folder
- ❌ No link to AGENT.md implementation file

**Enhancement needed:**

```markdown
## Implementation

**Folder:** [`agents/task-planner-agent/`](../task-planner-agent/)
**Entry Point:** [AGENT.md](../task-planner-agent/AGENT.md)
```

## Implementation Status: Agents with Specs

| Folder | Spec File | Has SKILL.md | Has AGENT.md | Status |
|---|---|---|---|---|
| `adr-generator` | ✓ adr.agent.md | ✓ | | Implemented |
| `linting-agent` | ✓ linting.agent.md | ? | ✓ | Implemented |
| `meta-agent` | ✓ meta.agent.md | ? | ✓ | Implemented |
| `prompt-engineer` | ✓ prompt-engineer.agent.md | ? | | To verify |
| `release` | ✓ release.agent.md | ? | ✓ | Implemented |
| `task-planner-agent` | ✓ task-planner.agent.md | ? | ✓ | Implemented |
| `task-researcher-agent` | ✓ task-researcher.agent.md | ? | ✓ | Implemented |
| `testing-agent` | ✓ testing.agent.md | ? | ✓ | Implemented |

## Next Steps

### Phase 1: Decision & Classification (1-2 hours)

- [ ] Decide on architecture (Spec+Impl, Spec-only, or Hybrid)
- [ ] Classify the 11 orphaned specs (mode, utility, deprecated)
- [ ] Confirm naming convention across all specs

### Phase 2: Create Missing Specs (4-6 hours)

- [ ] Create spec files for 20 agents without specs
- [ ] Use `task-planner.agent.md` as template
- [ ] Ensure consistent frontmatter and structure

### Phase 3: Add Cross-References (2-3 hours)

- [ ] Update all 28 spec files with implementation references
- [ ] Add "Implementation Details" sections with folder/file links
- [ ] Link to relevant documentation in implementation folders

### Phase 4: Organize Specs (1-2 hours)

- [ ] Create `.github/agents/README.md` explaining organization
- [ ] Create `.github/agents/modes/` directory if applicable
- [ ] Document any special cases or deprecated specs

### Phase 5: Validation (1-2 hours)

- [ ] Add validation rules to npm scripts
- [ ] Test against all spec files
- [ ] Document validation in CONTRIBUTING.md

## Related Standards

Per `CLAUDE.md`:
> Do **not** place reusable assets under `.github/`—use the matching top-level folder instead.

**Note:** Current implementation has all agents in `.github/agents/`. Consider whether portable agents should be moved to top-level `agents/` folder as documented in CLAUDE.md.

## Appendix: Complete File Listing

### Spec Files (.agent.md) - 19 total

1. adr.agent.md
2. issues.agent.md
3. labeling.agent.md
4. linting.agent.md
5. meta.agent.md
6. metrics.agent.md
7. mode-demonstrate-understanding.agent.md
8. mode-document-reviewer.agent.md
9. mode-prd.agent.md
10. mode-thinking.agent.md
11. project-meta-sync.agent.md
12. prompt-engineer.agent.md
13. release.agent.md
14. reporting.agent.md
15. reviewer.agent.md
16. task-planner.agent.md
17. task-researcher.agent.md
18. template.agent.md
19. testing.agent.md

### Implementation Folders - 28 total

1. adr-generator
2. ai-readiness-estimator-agent
3. changelog
4. chat-closure-agent
5. client-website-discovery-assistant-agent
6. design-partner-agent
7. harvest-analytical-agent
8. linear-advisor-agent
9. linting-agent
10. meta-agent
11. metadata-agent
12. pagespeed-agent
13. pr-creation-agent
14. prd-agent
15. prd-factory-planner-agent
16. prompt-engineer
17. proposal-desk-agent
18. release
19. task-planner-agent
20. task-researcher-agent
21. testing-agent
22. tour-operator-config-agent
23. website-content-strategist-agent
24. website-scope-estimator-agent
25. woo-config-agent
26. wordpress
27. wp-config-agent
28. zendesk-support-agent

---

**Audit Date:** 2026-08-29  
**Auditor:** Claude  
**Status:** ✓ Complete  
**Recommendation:** Create all missing specs and add cross-references
