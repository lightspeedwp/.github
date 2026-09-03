---
file_type: github-issue
title: "Phase 7: Agent Integration"
type: feature
area: [ai-ops, automation, agent-framework]
priority: high
effort: 4-6h
status: ready
milestone: v1.1
---

# Phase 7: Agent Integration

## Overview

Wire up Issue Type Allocator Skill to all 5 agents and validate behavior with skill decision tree.

**Duration:** 4-6 hours  
**Effort:** 4-6 hours  
**Depends On:** Phase 6 (Label Standardization) Complete + Skill Created ✅  
**Unblocks:** Phase 8 (Testing & Validation)

## Problem Statement

Currently, agents lack a unified issue type selection framework:
- Each agent has its own type detection logic (inconsistent)
- No common decision tree for type selection
- No shared skill reference
- Type selections vary by agent, causing inconsistency

The Issue Type Allocator Skill (created in Phase 3) provides a centralized, tested decision tree that all agents should reference.

## Solution

### 1. Release Agent Integration

**Current Behavior:**
- Creates Release issues with fixed type
- No flexibility for type variants
- Manual label assignment

**Target Behavior:**
- References Issue Type Allocator Skill decision tree
- Identifies correct Release issue type
- Auto-applies correct labels and color

**Integration Points:**
- `.github/agents/release-agent/AGENT.md` - Update instructions
- `.github/agents/release-agent/instructions.md` - Add skill reference
- Agent creation logic: check skill before assignment

**Changes:**
```markdown
# Release Agent Integration

## Issue Type Selection

When creating Release issues, use the **Issue Type Allocator Skill** to select the correct type:

1. **Identify work:** Is this a Release, Version bump, Changelog, or Deployment?
2. **Consult decision tree:** See `skills/issue-type-allocator/SKILL.md` → Decision Tree
3. **Apply type:** Use primary type (Release) + secondary labels (status, priority)

## Skill Reference

- **Skill Path:** `skills/issue-type-allocator/SKILL.md`
- **Section:** "Integration Guide for Agents" → "Release Agent"
- **Primary Types:** Release, Chore, Documentation
- **Auto-assign:** Release coordinator (from CODEOWNERS)
- **Link to:** Release milestone

## Example

**Bad (old way):**
```
Type: Release (hardcoded)
Labels: [release] (bare label - invalid)
```

**Good (new way - using skill):**
```
Decision Tree: "Large, coordinated work?" → "Release coordination?" → Type:Release
Type: Release
Labels: [type:release, status:needs-review, priority:critical, area:release]
Milestone: v2.1.0
```
```

### 2. Issues Agent Integration

**Current Behavior:**
- Triages issues without consistent type assignment
- Auto-label based on body keywords
- Type assignment is heuristic-based

**Target Behavior:**
- References skill decision tree for every untyped issue
- Applies correct type based on work characteristics
- Suggests consolidation if multiple types match

**Integration Points:**
- `.github/agents/issues-agent/AGENT.md` - Update instructions
- `.github/agents/issues-agent/instructions.md` - Add skill decision tree
- Triage workflow: use skill before labeling

**Changes:**
```markdown
# Issues Agent Integration

## Automatic Issue Type Assignment

When triaging untyped issues, use the **Issue Type Allocator Skill** decision tree:

1. **Check issue:** Is it missing a `type:` label?
2. **Consult skill:** Use decision tree from `skills/issue-type-allocator/SKILL.md`
3. **Answer questions:**
   - Something broken? → Bug
   - New capability? → Feature
   - Make existing better? → Enhancement
   - Small task? → Task
   - Housekeeping? → Chore
4. **Apply type:** Assign matching type label
5. **Auto-label:** Add area, priority, status labels

## Skill Reference

- **Skill Path:** `skills/issue-type-allocator/SKILL.md`
- **Section:** "Decision Tree"
- **Common Cases:** See "Common Type Distinctions" table

## Ambiguous Cases

If multiple types could fit:
1. Identify PRIMARY reason issue exists
2. Use that type
3. Comment with rationale: "Choosing Type:X because..."

## Example

**Bad (old way):**
```
Issue: "Button doesn't work"
Auto-labels: [broken, ui, frontend]
Type: NOT SET (manual review needed)
```

**Good (new way - using skill):**
```
Issue: "Button doesn't work"
Decision Tree: "Something broken?" → "Yes" → Type:Bug
Type: type:bug
Labels: [type:bug, area:ui, priority:normal, status:needs-triage]
```
```

### 3. PR Agent Integration

**Current Behavior:**
- Infers issue type from PR title/body
- No consistent detection method
- Type mismatches possible

**Target Behavior:**
- References skill decision tree to infer issue type
- Applies correct type label to PR
- Validates against linked issue type

**Integration Points:**
- `.github/agents/pr-agent/AGENT.md` - Update instructions
- `.github/workflows/pr-labeling.yml` - Use skill patterns
- PR creation: check skill for type inference

**Changes:**
```markdown
# PR Agent Integration

## PR Type Label Assignment

When a PR is created, infer and apply the correct `type:` label using the **Issue Type Allocator Skill**:

1. **Analyze PR:** Title, description, files changed
2. **Consult skill:** Use decision tree from `skills/issue-type-allocator/SKILL.md`
3. **Infer type:**
   - Files in tests/ → type:test
   - Fixes docs → type:documentation
   - Adds feature → type:feature
   - Changes code → type:refactor or type:enhancement
   - Fixes bug → type:bug
4. **Apply label:** PR gets matching type label
5. **Validate:** Check against linked issue (if any)

## Skill Reference

- **Skill Path:** `skills/issue-type-allocator/SKILL.md`
- **Section:** "Integration Guide for Agents" → "PR Agent"
- **Rules:** If PR "fixes #123", check issue type and apply same to PR

## Example

**Bad (old way):**
```
PR: "Add dark mode toggle"
No type label (manual review needed)
```

**Good (new way - using skill):**
```
PR: "Add dark mode toggle"
Decision Tree: "New capability?" → "Yes" → Type:Feature
Type: type:feature
Labels: [type:feature, area:ui, status:needs-review]
Linked Issue: #456 (also type:feature)
```
```

### 4. Changelog Agent Integration

**Current Behavior:**
- Groups changelog entries by issue type
- Fixed categories (Features, Bug Fixes, Security, etc.)
- No flexibility for new types

**Target Behavior:**
- References skill to understand type mapping
- Dynamically groups by issue type
- Handles all 29 types correctly

**Integration Points:**
- `.github/agents/changelog-agent/AGENT.md` - Update instructions
- `.github/workflows/changelog.yml` - Use skill mappings
- Changelog generation: use skill type→section mapping

**Changes:**
```markdown
# Changelog Agent Integration

## Changelog Entry Organization

When generating changelog, use the **Issue Type Allocator Skill** to map issue types to changelog sections:

**Section Mapping (from skill):**
- **Features** ← type:feature, type:enhancement
- **Bug Fixes** ← type:bug, type:security (security first)
- **Accessibility** ← type:a11y
- **Technical** ← type:refactor, type:performance
- **Documentation** ← type:documentation
- **Other** ← everything else

**Skip in changelog:**
- type:chore, type:task, type:research, type:maintenance

## Skill Reference

- **Skill Path:** `skills/issue-type-allocator/SKILL.md`
- **Section:** "Integration Guide for Agents" → "Changelog Agent"
- **Mapping:** See "Changelog Agent" subsection for section rules

## Example

**Bad (old way):**
```
# Changelog - v2.0

- Added dark mode
- Fixed button bug
- (no organization by type)
```

**Good (new way - using skill):**
```
# Changelog - v2.0

## Features
- Added dark mode toggle (#456, type:feature)
- Search filtering added (#457, type:enhancement)

## Bug Fixes
- Fixed button unresponsive on Safari (#458, type:bug)
- XSS vulnerability patched (#459, type:security)

## Accessibility
- ARIA labels added to form fields (#460, type:a11y)

## Documentation
- API endpoint documentation updated (#461, type:documentation)
```
```

### 5. Automation Agent Integration

**Current Behavior:**
- Detects automation opportunities ad-hoc
- No consistent framework for type assignment
- Auto-created issues need manual review

**Target Behavior:**
- References skill when creating automation issues
- Assigns correct type (type:automation, type:ai-ops)
- Follows pattern from other agents

**Integration Points:**
- `.github/agents/automation-agent/AGENT.md` - Update instructions
- `.github/agents/automation-agent/instructions.md` - Add skill reference
- Auto-creation: use skill for type selection

**Changes:**
```markdown
# Automation Agent Integration

## Automation Issue Type Selection

When creating automation or AI Ops issues, use the **Issue Type Allocator Skill** decision tree:

1. **Identify work:** Is this Automation, AI Ops, Build/CI, or something else?
2. **Consult skill:** See decision tree from `skills/issue-type-allocator/SKILL.md`
3. **Choose type:**
   - General process automation → type:automation
   - AI agent configuration → type:ai-ops
   - GitHub Actions/workflow → type:build or type:ci
4. **Apply labels:** Use correct type + area labels
5. **Link workflow:** Reference related GitHub Actions file

## Skill Reference

- **Skill Path:** `skills/issue-type-allocator/SKILL.md`
- **Section:** "Integration Guide for Agents" → "Automation Agent"
- **Primary Types:** Automation, AI Ops, Build/CI

## Example

**Bad (old way):**
```
Auto-created issue: "Auto-label issues when created"
Type: NOT SET (no skill reference)
Labels: [automation] (bare label - invalid)
```

**Good (new way - using skill):**
```
Auto-created issue: "Auto-label issues when created"
Decision Tree: "Automate process?" → "Yes" → Type:Automation
Type: type:automation
Labels: [type:automation, area:ci, area:automation, status:ready]
Linked: .github/workflows/labeling.yml
```
```

### 6. Testing & Validation

**Integration test checklist:**

Agent | Test Case | Expected | Status
------|-----------|----------|--------
Release Agent | Create Release issue | Correct type + labels + milestone | ⏳ Test Phase 8
Issues Agent | Triage untyped issue | Correct type via skill decision tree | ⏳ Test Phase 8
PR Agent | Create PR for feature | Inferred type from skill | ⏳ Test Phase 8
Changelog Agent | Generate changelog | Entries grouped by type mapping | ⏳ Test Phase 8
Automation Agent | Create automation issue | Correct type + AI Ops label | ⏳ Test Phase 8

**Validation:**
```bash
# Verify skill is accessible
ls -1 skills/issue-type-allocator/SKILL.md

# Check agent instructions reference skill
grep -l "Issue Type Allocator" .github/agents/*/AGENT.md
grep -l "Issue Type Allocator" .github/agents/*/instructions.md

# Validate skill decision tree
npm run validate:skills
```

## Success Criteria

✅ Phase 7 is complete when:

1. **All 5 agents updated**
   - Release Agent ✅
   - Issues Agent ✅
   - PR Agent ✅
   - Changelog Agent ✅
   - Automation Agent ✅

2. **Skill integration verified**
   - Each agent references skill
   - Decision tree referenced in instructions
   - Patterns match skill examples

3. **No regressions**
   - Existing agent behavior unchanged (except for type assignment)
   - All agent tests still pass
   - Skill usage doesn't break workflows

4. **Documentation complete**
   - Agent instructions updated
   - Skill reference clear in each agent
   - Examples show before/after

5. **CI checks pass**
   - Agent validation ✅
   - Skill validation ✅
   - No merge conflicts

## Implementation Checklist

- [ ] Create feature branch from develop
- [ ] Update Release Agent instructions + skill reference
- [ ] Update Issues Agent instructions + skill reference
- [ ] Update PR Agent instructions + skill reference
- [ ] Update Changelog Agent instructions + skill reference
- [ ] Update Automation Agent instructions + skill reference
- [ ] Add examples to each agent
- [ ] Run validation checks locally
- [ ] Verify no regressions in agent behavior
- [ ] Commit changes with clear message
- [ ] Create PR to develop
- [ ] Address any CI failures
- [ ] Merge to develop when green
- [ ] Verify merged state on develop

## Related Issues

- Phase 6: Label Standardization (⏳ Blocked until complete)
- Phase 8: Testing & Validation (⏳ Blocked on this phase)
- Phase 3: Issue Type Allocator Skill (✅ Complete - PR #2686 merged)

---

**Type:** Feature  
**Priority:** High  
**Effort:** 4-6 hours  
**Status:** Ready  
**Milestone:** v1.1  
**Area:** AI Ops, Automation, Agent Framework  
**Related:** #1733, #1592
