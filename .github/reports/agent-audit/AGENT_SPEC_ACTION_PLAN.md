---
file_type: documentation
title: Agent Specification Audit - Action Plan
description: Prioritized action plan to resolve agent spec and implementation gaps
created_date: "2026-08-29"
last_updated: "2026-08-29"
status: "draft"
priority: "high"
domain: "governance"
stability: "stable"
tags: ["agents", "specifications", "action-plan", "implementation"]
owners: ["lightspeedwp/maintainers"]
---

# Agent Specification Audit - Action Plan

## Quick Summary

- **28 agent folders** exist, but **only 8 have specs** (28%)
- **19 spec files** exist, but **11 are orphaned** (no implementation folder)
- **0% of specs** cross-reference their implementations
- Recommendation: **Create specs for all 20 missing agents** and **add cross-references** to all 28 specs

---

## Phase 1: Decision & Cleanup (IMMEDIATE)

### Task 1.1: Clarify Architecture Intent

**Decision needed:** What is the intended structure?

```
OPTION A: Every Agent Gets a Spec
├── agents/
│   ├── adr-generator/
│   │   └── SKILL.md
│   └── adr.agent.md ← spec file

OPTION B: Mode Specs vs Implementation Specs
├── agents/
│   ├── adr-generator/ ← full agent
│   │   └── SKILL.md
│   ├── modes/ ← mode-only specs
│   │   └── mode-thinking.agent.md
│   └── adr.agent.md ← spec file

OPTION C: Move to Top-Level (per CLAUDE.md)
├── agents/ (root-level, portable)
│   ├── adr-generator/
│   └── adr.agent.md
└── .github/agents/ (GitHub-native only)
```

**Action:** Confirm architecture with team

### Task 1.2: Classify Orphaned Specs

**Current orphaned specs (11 total):**

- `issues.agent.md` → Check: spec-only or missing implementation?
- `labeling.agent.md` → Check: spec-only or missing implementation?
- `metrics.agent.md` → Check: spec-only or missing implementation?
- `mode-*.agent.md` (4 files) → Mode specs (not standalone agents)
- `project-meta-sync.agent.md` → Check: spec-only or missing implementation?
- `reporting.agent.md` → Check: spec-only or missing implementation?
- `reviewer.agent.md` → Check: spec-only or missing implementation?
- `template.agent.md` → Check: spec-only or missing implementation?

**Actions:**

- [ ] Verify each one: Is this spec-only? Deprecated? Or missing implementation?
- [ ] Document intent in `.github/agents/README.md`
- [ ] For missing implementations: Schedule creation or mark as deprecated

### Task 1.3: Create `.github/agents/README.md`

**Document:**

- Purpose of `.github/agents/` folder
- Spec file organization and naming convention
- Which specs have implementations (list)
- Which specs are spec-only (list)
- Which implementations are missing specs (list)

**Template:**

```markdown
# Agent Specifications

## Organization

- **Spec files:** `*.agent.md` — Documentation of agent purpose and behavior
- **Implementation folders:** `{name}-agent/` or `{name}/` — Code and resources
- **Relationship:** Each agent should have both a spec file AND implementation folder

## Coverage Status

### Agents with Full Coverage (Spec + Implementation)
- ✓ ADR Generator (`adr.agent.md` + `adr-generator/`)
- [list all 8]

### Agents Missing Specs (20 total)
- ✗ AI Readiness Estimator → Create `ai-readiness-estimator.agent.md`
- [list all 20]

### Specs Without Implementations (11 total)
- ⚠ `issues.agent.md` - Status: [spec-only/deprecated/TBD]
- [list all 11]

### Mode Specs (4 total)
- `mode-thinking.agent.md`
- `mode-prd.agent.md`
- `mode-demonstrate-understanding.agent.md`
- `mode-document-reviewer.agent.md`
```

---

## Phase 2: Create Missing Specs (PRIORITY)

### Task 2.1: Bulk Create Spec Files

**Template source:** Use `task-planner.agent.md` as reference (good example)

**For each of 20 missing agents:**

1. **Read implementation folder**
   - Review `AGENT.md` or `SKILL.md`
   - Check for README or documentation
   - Scan for configuration or examples

2. **Extract key information**
   - Agent name and description
   - Core purpose and responsibilities
   - Key features
   - Input/output patterns
   - Operating modes (if any)

3. **Create spec file with frontmatter**

   ```markdown
   ---
   file_type: agent
   name: "{Agent Name}"
   description: "{One-line description}"
   category: "{category}"
   tags: ["{tag1}", "{tag2}"]
   status: "active"
   implementation: "agents/{folder-name}/"
   ---
   
   # {Agent Name}
   
   ## Purpose
   [From AGENT.md]
   
   ## Key Features
   [From implementation]
   
   ## Operating Modes
   [If applicable]
   
   ## Implementation Reference
   - **Folder:** `agents/{folder-name}/`
   - **Entry Point:** [AGENT.md or SKILL.md]
   ```

4. **Validate**
   - Frontmatter is complete
   - Name/description match implementation
   - Cross-reference link is correct

**Agents to create specs for (20 total):**

| # | Agent Folder | Spec File to Create |
|---|---|---|
| 1 | ai-readiness-estimator-agent | ai-readiness-estimator.agent.md |
| 2 | changelog | changelog.agent.md |
| 3 | chat-closure-agent | chat-closure.agent.md |
| 4 | client-website-discovery-assistant-agent | client-website-discovery.agent.md |
| 5 | design-partner-agent | design-partner.agent.md |
| 6 | harvest-analytical-agent | harvest-analytical.agent.md |
| 7 | linear-advisor-agent | linear-advisor.agent.md |
| 8 | metadata-agent | metadata.agent.md |
| 9 | pagespeed-agent | pagespeed.agent.md |
| 10 | pr-creation-agent | pr-creation.agent.md |
| 11 | prd-agent | prd.agent.md |
| 12 | prd-factory-planner-agent | prd-factory-planner.agent.md |
| 13 | proposal-desk-agent | proposal-desk.agent.md |
| 14 | tour-operator-config-agent | tour-operator-config.agent.md |
| 15 | website-content-strategist-agent | website-content-strategist.agent.md |
| 16 | website-scope-estimator-agent | website-scope-estimator.agent.md |
| 17 | woo-config-agent | woo-config.agent.md |
| 18 | wordpress | wordpress.agent.md |
| 19 | wp-config-agent | wp-config.agent.md |
| 20 | zendesk-support-agent | zendesk-support.agent.md |

**Effort estimate:** ~5-10 min per spec = ~2-3 hours total

---

## Phase 3: Add Cross-References (IMPORTANT)

### Task 3.1: Update All Existing Specs

**For each of 28 agent specs:** Add "Implementation Reference" section

**Add to frontmatter:**

```yaml
---
file_type: agent
implementation: "agents/{folder-name}/"
implementation_entry: "AGENT.md" # or SKILL.md
---
```

**Add to body (after main content):**

```markdown
## Implementation Reference

This agent's implementation is located in [`agents/{folder-name}/`](../{folder-name}/).

### Entry Points
- **Agent Definition:** [{AGENT.md|SKILL.md}](../{folder-name}/{AGENT.md|SKILL.md})
- **Configuration:** [config/](../{folder-name}/config/) (if applicable)
- **Templates:** [templates/](../{folder-name}/templates/) (if applicable)
- **Examples:** [examples/](../{folder-name}/examples/) (if applicable)
- **Tests:** [tests/](../{folder-name}/tests/) (if applicable)

### Quick Links
- View [full implementation folder](../{folder-name}/)
- See [configuration schema](../{folder-name}/config/) (if applicable)
- Check [test coverage](../{folder-name}/tests/) (if applicable)
```

**Effort estimate:** ~2-3 min per spec = ~1-1.5 hours total

### Task 3.2: Update All Implementation Folders

**For each agent folder:** Add cross-reference to spec file

**Create/update `README.md` or `AGENT.md` to include:**

```markdown
## Specification

See the agent specification at [`.github/agents/{name}.agent.md`](../../.github/agents/{name}.agent.md)
for high-level purpose, behavior, and usage documentation.

This folder contains the implementation details (configuration, templates, code, tests).
```

**Effort estimate:** ~2-3 min per folder = ~1-1.5 hours total

---

## Phase 4: Validation Setup (TECHNICAL)

### Task 4.1: Create Validation Script

**Add to `scripts/validate-agents.js`:**

```javascript
const fs = require('fs');
const path = require('path');

// 1. Check each .agent.md spec file
// 2. Verify implementation folder exists
// 3. Check for cross-reference links
// 4. Validate frontmatter completeness

const specs = fs.readdirSync('agents').filter(f => f.endsWith('.agent.md'));
const folders = fs.readdirSync('agents').filter(f => {
  const stats = fs.statSync(path.join('agents', f));
  return stats.isDirectory();
});

// Report coverage
console.log(`Specs: ${specs.length}, Folders: ${folders.length}`);
console.log(`Coverage: ${(specs.length / folders.length * 100).toFixed(1)}%`);
```

**Effort estimate:** 1-2 hours

### Task 4.2: Add to npm Scripts

Update `package.json`:

```json
{
  "scripts": {
    "validate:agents": "node scripts/validate-agents.js",
    "validate": "npm run validate:agents && npm run validate:frontmatter"
  }
}
```

---

## Phase 5: Documentation Updates (FINAL)

### Task 5.1: Update CONTRIBUTING.md

Add section on creating new agents:

```markdown
## Creating a New Agent

1. **Create implementation folder:** `agents/{name}-agent/`
2. **Create agent definition:** `{name}-agent/AGENT.md` or `SKILL.md`
3. **Create spec file:** `.github/agents/{name}.agent.md`
4. **Add cross-references:** Link spec to implementation and vice versa
5. **Run validation:** `npm run validate:agents`
```

### Task 5.2: Update CLAUDE.md (if needed)

Clarify where agents should live (`.github/agents/` vs top-level `agents/`)

Per CLAUDE.md line 36:
> Do **not** place reusable assets under `.github/`—use the matching top-level folder instead.

**Decision needed:** Should agents be moved to top-level `agents/` folder?

---

## Summary Timeline

| Phase | Tasks | Effort | Priority |
|---|---|---|---|
| Phase 1 | Clarify architecture, classify specs | 2-3 hrs | 🔴 IMMEDIATE |
| Phase 2 | Create 20 missing specs | 2-3 hrs | 🟠 HIGH |
| Phase 3 | Add cross-references (28 specs + 28 folders) | 3-4 hrs | 🟠 HIGH |
| Phase 4 | Setup validation | 1-2 hrs | 🟡 MEDIUM |
| Phase 5 | Update documentation | 1-2 hrs | 🟡 MEDIUM |
| **TOTAL** | | **9-14 hrs** | |

---

## Success Criteria

- [ ] All 28 agent folders have corresponding `.agent.md` spec files
- [ ] All 28 spec files reference their implementation folders
- [ ] All 28 implementation folders reference their spec files
- [ ] `.github/agents/README.md` documents the organization
- [ ] Validation script passes all checks
- [ ] CONTRIBUTING.md includes agent creation guidelines
- [ ] 100% coverage: Specs = Folders (28 = 28)

---

**Next Step:** Start with Phase 1 - Get team decision on architecture and spec organization.
