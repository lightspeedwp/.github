# Quickstart Validation Guide: Agent Restructuring

**Phase**: 1 Design | **Status**: Ready for Phase 2 Implementation

This guide documents end-to-end validation scenarios that prove the agent restructuring feature works as specified. Each scenario is independently testable and covers one user story.

---

## Scenario 1: Audit & Remediate Broken References (User Story 1)

**Prerequisite State**

- Repository with agents that have been renamed/moved (simulates the branch state)
- Scripts and workflows referencing old agent paths

**Validation Steps**

1. **Run broken reference audit**

   ```bash
   npm run audit:agents -- --broken-references --report-format json
   ```

   Expected: Audit completes; generates `agents/reports/audit-broken-references.json`

2. **Verify audit identifies broken references**
   - Check report contains entries for each broken reference
   - Verify each entry has: file_path, line_number, reference_type, severity, suggested_fix
   - Example entry:

     ```json
     {
       "file_path": "scripts/agents/prd-agent/generate.js",
       "line_number": 45,
       "reference_type": "javascript_import",
       "broken_reference": "agents/prd-agent-old/config",
       "severity": "critical",
       "suggested_fix": "Update to agents/prd-agent/config"
     }
     ```

3. **Remediate one broken reference**
   - Manually fix the broken import path in one script
   - Re-run audit on just that file: `npm run audit:agents -- --file scripts/agents/prd-agent/generate.js`
   - Verify the broken reference no longer appears in audit results

4. **Run integration test**
   - Execute a script that was previously broken: `node scripts/agents/prd-agent/generate.js`
   - Verify it runs without import/path errors
   - Test passes if script executes successfully without resolution errors

**Success Criteria**

- ✅ Audit identifies all broken references with locations and line numbers
- ✅ Remediation removes broken reference from audit report
- ✅ Previously broken scripts execute successfully after remediation
- ✅ Audit report is machine-parseable JSON

---

## Scenario 2: Standardize Agent Folder Structure (User Story 2)

**Prerequisite State**

- ~50 agents in `agents/` folder with varying folder structures
- Some agents already standardized (prd-agent, changelog-agent)
- Some agents with non-standard organization

**Validation Steps**

1. **Run structure audit**

   ```bash
   npm run audit:agents -- --structure-check --report-format json
   ```

   Expected: Generates `agents/reports/structure-audit.json`

2. **Identify deviations**
   - Review report for agents NOT matching standardized structure
   - Verify report shows what's missing/wrong: "skills folder missing", "config folder not found", etc.
   - Example:

     ```json
     {
       "agent_id": "old-agent",
       "status": "non-compliant",
       "missing_folders": ["skills", "tests"],
       "unexpected_files": ["legacy-skills.json"],
       "remediation_steps": [
         "Create agents/old-agent/skills/ folder",
         "Move skill files to agents/old-agent/skills/",
         "Create agents/old-agent/tests/ folder"
       ]
     }
     ```

3. **Remediate one agent to standardized structure**
   - Pick one non-compliant agent (e.g., "old-agent")
   - Create required folders: `mkdir -p agents/old-agent/{skills,tests,config}`
   - Move skill files to `agents/old-agent/skills/`
   - Move tests to `agents/old-agent/tests/`
   - Verify folder structure matches reference (prd-agent)

4. **Re-run structure audit**
   - Run structure check again focusing on remediated agent
   - Verify agent is now marked "compliant"
   - Verify no deviations reported for that agent

5. **Compare multiple agents**
   - Run full structure audit across all agents
   - Verify all agents now follow identical structural pattern
   - Generate compliance percentage: "48/50 agents compliant (96%)"

**Success Criteria**

- ✅ Audit identifies agents with non-standard structures
- ✅ Remediation creates standardized folder layout
- ✅ Re-audit shows agent as compliant
- ✅ All agents follow identical structural pattern
- ✅ Structure comparison audit produces compliance percentage

---

## Scenario 3: Consolidate & Deduplicate Skills (User Story 3)

**Prerequisite State**

- Multiple agents with duplicate skill implementations
- ~1000 skills across `agents/*/skills/` + root `skills/` folder
- Some skills are exact duplicates; some are near-duplicates

**Validation Steps**

1. **Run deduplication audit**

   ```bash
   npm run audit:agents -- --dedup-skills --report-format json
   ```

   Expected: Generates `agents/reports/skill-deduplication.json`

2. **Review deduplication report**
   - Verify report categorizes skills as "exact_match" or "near_duplicate"
   - Example entry:

     ```json
     {
       "skill_id": "analyze-prompt",
       "exact_matches": [
         { "location": "agents/prd-agent/skills/analyze-prompt", "hash": "abc123..." },
         { "location": "agents/prompt-engineer-agent/skills/analyze-prompt", "hash": "abc123..." }
       ],
       "deduplication_recommendation": "consolidate_to_root",
       "consolidation_impact": "Removes 2 duplicate implementations; agents reference root version"
     }
     ```

3. **Consolidate one duplicate skill**
   - Identify one exact-match duplicate from report
   - Move primary implementation to root: `cp agents/prd-agent/skills/analyze-prompt.md skills/`
   - Update both agents to reference root skill
   - Remove local duplicate copies from agent folders

4. **Verify consolidation**
   - Check both agents' skill configurations reference `skills/analyze-prompt`
   - Verify no duplicate files remain
   - Run deduplication audit again; verify duplicate no longer appears

5. **Consolidation plan generation**
   - Run full deduplication analysis
   - Generate consolidation plan: `npm run consolidation:plan`
   - Verify plan specifies: which skills to consolidate, target location, affected agents

**Success Criteria**

- ✅ Deduplication audit identifies exact and near-duplicate skills
- ✅ Similarity scores provided for near-duplicates
- ✅ Consolidation removes duplicate files
- ✅ Agents updated to reference consolidated skill
- ✅ Re-audit shows zero true duplicates
- ✅ Consolidation plan covers all duplicates found

---

## Scenario 4: Generate & Validate Registries (User Story 4–5)

**Prerequisite State**

- Agents in standardized structure (from Scenario 2)
- Skills consolidated (from Scenario 3)
- All skills pass or are documented for agentskills.io compliance

**Validation Steps**

1. **Generate agent registry**

   ```bash
   npm run registry:generate -- agents
   ```

   Expected: Creates `agents/registry.json` and `agents/{agent}/registry.json` files

2. **Verify agent registry structure**
   - Check `agents/registry.json` contains all agents
   - Verify each entry has required fields: id, name, version, status, skills, dependencies
   - Example:

     ```json
     {
       "timestamp": "2026-09-18T12:00:00Z",
       "generated_from_commit": "abc123def456",
       "total_agents": 50,
       "agents": [
         {
           "id": "prd-agent",
           "name": "PRD Agent",
           "version": "1.2.3",
           "status": "active",
           "skills": ["prd-template-loader", "prd-outline-generator"],
           "depends_on": [],
           "validation_errors": []
         }
       ]
     }
     ```

3. **Generate skills registry**

   ```bash
   npm run registry:generate -- skills
   ```

   Expected: Creates `skills/registry.json`

4. **Verify skills registry structure**
   - Check registry contains all skills (root + agent-specific)
   - Verify deduplication metadata included: content_hash, similarity_score, duplicate_of
   - Verify compliance status included: agentskills_compliant, violations

5. **Validate registries**

   ```bash
   npm run registry:validate
   ```

   Expected: Validation report for both registries

6. **Review compliance validation report**
   - Check report lists all skills with compliance status
   - Identify violations: missing fields, invalid values
   - Example:

     ```json
     {
       "skill_id": "old-util-skill",
       "compliance": "failed",
       "violations": [
         { "field": "description", "issue": "missing required field" },
         { "field": "type", "issue": "invalid value 'unknown'; must be one of [action, query, transform...]" }
       ],
       "blocking": true,
       "remediation": "Add description and fix type field"
     }
     ```

7. **Address compliance violations**
   - For each blocking violation, apply fix (add missing field, correct invalid value)
   - Re-run compliance validation; verify violations resolved

**Success Criteria**

- ✅ Agent registry generated with all required metadata
- ✅ Skills registry generated with compliance + deduplication metadata
- ✅ Registries are valid JSON, machine-parseable
- ✅ Registries can be auto-generated from filesystem state
- ✅ Compliance validation identifies all violations
- ✅ Violations can be remediated; re-validation passes
- ✅ 100% of skills pass compliance or have documented exceptions

---

## Scenario 5: Dependency Analysis (User Story 5–6)

**Prerequisite State**

- Agents and skills in standardized structure
- Registries generated and validated
- Agent dependencies documented

**Validation Steps**

1. **Generate dependency graph**

   ```bash
   npm run audit:agents -- --dependency-graph --format json
   ```

   Expected: Generates `agents/reports/dependency-graph.json`

2. **Analyze graph for circular dependencies**
   - Review report for circular references (agent A depends on B, B depends on A)
   - Verify report format includes: agent_id, depends_on (array), circular_dependencies (array if found)
   - Example:

     ```json
     {
       "agent": "prd-agent",
       "depends_on": ["prd-factory-planner-agent"],
       "circular_dependencies": [],
       "dependency_depth": 1
     }
     ```

3. **Identify shared skills**
   - From registries, find skills used by multiple agents
   - Verify shared skills are in root `skills/` folder (not agent-specific duplicates)
   - Generate summary: "45 skills shared across 2+ agents"

4. **Validate no duplicate instances of shared skills**
   - Check that agents using shared skill all reference same root location
   - Verify no agent has local copy of shared skill (unless version-pinned)
   - Example validation:

     ```
     Skill: analyze-prompt (shared)
     Used by: [prd-agent, prompt-engineer-agent, prd-factory-planner-agent]
     All reference: skills/analyze-prompt ✓
     No local copies: ✓
     ```

5. **Generate restructuring plan**
   - Consolidate all dependency and consolidation information
   - Generate per-agent restructuring tasks with priorities
   - Assign to Phases 1–4 based on complexity and dependencies

**Success Criteria**

- ✅ Dependency graph identifies all agent relationships
- ✅ No circular dependencies found (or documented with rationale)
- ✅ Shared skills identified and verified in root folder
- ✅ No unintended duplicates of shared skills in agent folders
- ✅ Restructuring plan generated with clear phases and priorities

---

## End-to-End Flow Summary

```
1. Scenario 1: Fix broken references
   ↓
2. Scenario 2: Standardize agent structure
   ↓
3. Scenario 3: Consolidate duplicate skills
   ↓
4. Scenario 4: Generate and validate registries
   ↓
5. Scenario 5: Analyze dependencies and plan restructuring
```

**All scenarios passing** = Feature ready for production deployment

---

**Quickstart Validation Complete**: Ready for Phase 2 Task Decomposition
