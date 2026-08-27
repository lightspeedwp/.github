# Agent Skills Audit Report

**Generated:** 2026-07-23  
**Branch:** chore/agents-finalize-incomplete-agents  
**Issue:** #1197

## Audit Scope

- **Agents Analyzed:** 16 (all agent subfolders)
- **Skills Analyzed:** 368 skill directories
- **Total Files:** 10,332 skill files
- **Manifests:** 32 (skills.md + skills.csv per agent)

## Key Findings

### ✅ Positive Findings

- All 16 agents have top-level `skills/` directories
- No nested `agent/skills/` structures (already refactored)
- All agents have `manifests/skills.md` and `manifests/skills.csv`
- All 16 agents have skill entrypoints (SKILL.md files)

### ⚠️ Issues Identified

#### 1. Manifest Accuracy Discrepancies

- **prd-agent:** 102 SKILL.md files vs. 57 CSV entries (+45)
- **woo-config-agent:** 31 SKILL.md files vs. 30 CSV entries (+1)
- **wp-config-agent:** 31 SKILL.md files vs. 37 CSV entries (-6)
- **Root Cause:** Manifests not regenerated after skill changes

#### 2. Absolute Path References

- All manifests use absolute paths (`/root/.codex/skills/...`)
- **Impact:** Paths not portable across environments
- **Needed:** Convert to relative paths (`./skills/agent-attached/...`)

#### 3. Skill Category Inconsistencies

- Some agents: 5 categories (agent-attached, local, plugin-provided, platform-managed, directory-installed)
- Other agents: 2 categories (only agent-attached, local)
- **Standard needed:** Define canonical category list

#### 4. Duplicate Skills Across Agents

- Skills like `documents`, `github`, `google-drive` appear in multiple agents
- **Opportunity:** Consolidate to shared `skills/` location
- **Estimate:** ~10-15 candidate skills for consolidation

### Skills Distribution

| Category | Count | Files | Avg per Agent |
|----------|-------|-------|---------------|
| agent-attached | 178 | 3,777 | 11.1 |
| local | 80 | 3,134 | 5.0 |
| plugin-provided | 69 | 1,860 | 4.3 |
| platform-managed | 26 | 497 | 1.6 |
| directory-installed | 15 | 1,064 | 0.9 |
| **TOTAL** | **368** | **10,332** | **23.0** |

---

## Detailed Per-Agent Breakdown

### Agents by Skill Count

| Agent | SKILL.md | agent-attached | local | total files |
|-------|----------|-----------------|-------|------------|
| prd-agent | 102 | 25 | 13 | 1,360 |
| tour-operator-config-agent | 30 | 10 | 20 | 1,066 |
| woo-config-agent | 31 | 10 | 1 | 942 |
| wp-config-agent | 31 | 11 | 1 | 929 |
| website-content-strategist-agent | 67 | 28 | 1 | 928 |
| prd-factory-planner-agent | 57 | 24 | 10 | 918 |
| ai-readiness-estimator-agent | 51 | 19 | 1 | 855 |
| client-website-discovery-assistant-agent | 67 | 1 | 3 | 759 |
| zendesk-support-agent | 37 | 17 | 3 | 757 |
| prd-agent | 102 | 25 | 13 | 724 |
| design-partner-agent | 47 | 1 | 1 | 700 |
| linear-advisor-agent | 42 | 16 | 10 | 618 |
| proposal-desk-agent | 50 | 6 | 3 | 610 |
| website-scope-estimator-agent | 49 | 5 | 10 | 577 |
| playwright-testing-agent | 21 | 2 | 2 | 458 |
| harvest-analytical-agent | 20 | 0 | 1 | 429 |
| pagespeed-agent | 25 | 3 | 0 | 393 |

---

## Refactoring Roadmap

**8-Phase Plan** (4-5 weeks, ~50 hours):

### Phase 1: Inventory & Validation (Week 1)

- Generate accurate skill registry
- Validate SKILL.md entrypoints
- Extract metadata from all skills
- Identify duplicates and gaps

### Phase 2: Create Missing SKILL.md Files (Week 1-2)

- Create entrypoints for undocumented skills
- Extract descriptions and metadata
- Validate 100% coverage

### Phase 3: Normalize Skill Paths (Week 2)

- Convert absolute paths → relative paths
- Regenerate manifests with portable paths
- Validate path accuracy

### Phase 4: Consolidate Duplicate Skills (Week 2-3)

- Identify shared skills across agents
- Move to top-level `skills/` location
- Update manifests to reference consolidated skills

### Phase 5: Standardize Skill Categorization (Week 3)

- Define canonical category list
- Reclassify skills
- Update documentation

### Phase 6: Update Agent Metadata (Week 3-4)

- Sync AGENT.md files with actual skills
- Update provider configs (claude, copilot, openai)
- Validate all references

### Phase 7: Validation & Testing (Week 4)

- Verify skill discoverability
- Test manifest accuracy
- Validate paths and references

### Phase 8: CI/CD Integration (Week 4)

- Create manifest regeneration script
- Add to lint workflow
- Add pre-commit hooks

---

## Success Criteria

- [ ] All 368 skill directories have valid SKILL.md entrypoints
- [ ] All manifests (skills.md + skills.csv) are 100% accurate
- [ ] All skill paths are relative, portable, and working
- [ ] Duplicate skills consolidated (10-15 shared skills)
- [ ] Skill categorization standardized (5 categories)
- [ ] All agent AGENT.md files updated with skill references
- [ ] CI/CD validates manifests on every commit
- [ ] 100% of agents pass skill discovery validation

---

## Estimated Effort

- **Duration:** 4-5 weeks
- **Effort:** 40-60 hours (1 FTE)
- **Risk:** Low (refactoring, non-user-facing)
- **Dependencies:** None

---

## Related Issues & PRs

- **Epic:** #1079 — Agent Standards Phase 2
- **PR:** #1140 — tour-operator-config agent standardization
- **PR:** #1141 — woo-config agent standardization
- **Issue:** #1197 — Agent Skills Refactoring (this initiative)

---

## Next Steps

1. ✅ Audit complete
2. → Review GitHub issue #1197
3. → Approve refactoring plan
4. → Break down into sub-issues per phase
5. → Assign to team members
6. → Track in Project #33 (LightSpeed Milestones)

---

*Audit Report | Generated 2026-07-23*
