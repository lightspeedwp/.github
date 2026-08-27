---
name: agent_standards_deliverables
description: Complete standardisation initiative deliverables - prompts, audit, and implementation guides
metadata:
  type: reference
---

# Agent Standardization Initiative — Complete Deliverables

**Date:** 2026-07-22  
**Status:** ✅ Ready for Phase 1 Execution  
**Location:** `/private/tmp/claude-501/-Users-ash-Studio-LightSpeedWP-Agency--github--claude-worktrees-issue-1039-security-packages-c4443e/scratchpad/`  

## 📦 Package Contents

### 5 Complete Documents (Ready in Scratchpad)

1. **README.md**
   - Quick navigation guide
   - File descriptions
   - Quick start by role
   - Learning path

2. **IMPLEMENTATION_SUMMARY.md**
   - Executive overview
   - Complete roadmap
   - Timeline & effort (12-18h Phase 1, 2-4h per agent)
   - Success criteria
   - Start here for understanding

3. **AGENT_STANDARDIZATION_AUDIT.md**
   - Current state analysis
   - 16 ChatGPT agents identified
   - Standardization framework
   - Folder structure specifications
   - Naming conventions
   - Schema additions (4 needed)
   - Hook additions (4 needed)
   - Instruction additions (4 needed)

4. **PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md** (PRIMARY PROMPT)
   - Complete orchestration prompt for Phase 1
   - Playwright testing agent pilot rewrite
   - Repository audit & framework creation
   - 7 detailed phases with task breakdowns
   - Schemas, hooks, instructions
   - Use this to execute Phase 1 (12-18 hours)

5. **PROMPT_2_GENERIC_AGENT_REWRITE.md** (REUSABLE TEMPLATE)
   - Generic template for remaining 15 agents
   - Parameterized for any agent
   - 8 detailed phases
   - 2-4 hours per agent
   - Use this for Phases 2-3

## 🎯 Quick Start

### For Immediate Use (Phase 1)

1. Copy all 5 documents from scratchpad to working directory
2. Read README.md (5 min)
3. Read IMPLEMENTATION_SUMMARY.md (30 min)
4. Read AGENT_STANDARDIZATION_AUDIT.md Part 2 (30 min)
5. Execute PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md (12-18 hours)

### Agents to Convert (Phase 2-3)

- Total: 16 ChatGPT agent exports
- First: playwright-testing-agent (Phase 1 pilot)
- Remaining: 15 agents (2-4 hours each via PROMPT_2)
- Estimated total: 50-100 hours over 2-3 months

## 📋 Key Standardization Items

### Folder Structure (Agent)

```
.github/agents/{agent-slug}-agent/
├── AGENT.md (with YAML frontmatter)
├── .github/ (INSTALL.md, MANIFEST.json, security-policy.md)
├── claude/ (agent.md, tools.json)
├── copilot/ (agent.md, copilot-plugin.json, skills.yaml)
├── openai/ (agent.md, tools.json)
├── shared/ (core-prompt.md, tools/, memory/, hooks/)
├── skills/ (from ChatGPT export)
├── manifests/ (from ChatGPT export)
└── checksums.sha256
```

### Naming Conventions

- Agent files: `{domain}-{focus}.agent.md`
- Agent folders: `{domain}-{function}-agent`
- Plugin folders: `lightspeed-{domain}-{focus}`

### New Artifacts to Create (Phase 1)

**Schemas (4):**

- multi-provider-agent.schema.json
- agent-plugin-binding.schema.json
- provider-config.schema.json
- agent-capability-manifest.schema.json

**Hooks (4):**

- agent-spec-validator.js
- multi-provider-consistency-checker.js
- plugin-integrity-checker.js
- agent-security-auditor.js

**Instructions (4):**

- agent-creation-workflow.instructions.md
- multi-provider-compatibility.instructions.md
- plugin-architecture.instructions.md
- (+ cookbook entry: playwright-agent-creation-guide.md)

## ✅ Success Criteria

### Phase 1 Complete When

- Playwright agent restructured
- Claude, Copilot, OpenAI configs created
- Plugin created & functional
- All schemas & hooks working
- All instruction files created
- Tests passing
- PR merged to develop

### Full Project Complete When

- 16 agents converted
- 6-8 plugins organized
- Schemas & hooks enforcing standards
- Team trained on standards

## 🚀 How to Use These Deliverables

1. **PROMPT_1** — Execute for Phase 1 (playwright agent)
   - Full orchestration prompt with 7 phases
   - Follow tasks systematically
   - Validates at each phase
   - Creates complete framework

2. **PROMPT_2** — Execute for Phase 2 (remaining agents)
   - Generic reusable template
   - Parameterize for each agent
   - 2-4 hours per agent
   - Follows same structure as Phase 1

3. **Reference Documents** — Use for understanding
   - AUDIT: Learn about current state & standards
   - SUMMARY: Understand timeline & roadmap
   - README: Navigate quickly

## 🔗 Related Memory Files

- [[project_agent_standardization_initiative]] — Project context
- [[coding-standards]] — Coding practices

## 📍 Location & Access

All documents are in scratchpad:

```
/private/tmp/claude-501/-Users-ash-Studio-LightSpeedWP-Agency--github--claude-worktrees-issue-1039-security-packages-c4443e/scratchpad/

├── README.md
├── IMPLEMENTATION_SUMMARY.md
├── AGENT_STANDARDIZATION_AUDIT.md
├── PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md
└── PROMPT_2_GENERIC_AGENT_REWRITE.md
```

Copy to your working directory before starting Phase 1.

## ⏱️ Time Estimates

- **Phase 1:** 12-18 hours (1-2 days focused work)
- **Phase 2:** 2-4 hours × 15 agents = 30-60 hours
- **Phase 3:** 4-8 hours (consolidation)
- **Total:** 50-100 hours over 2-3 months

## 🎓 Training Path

1. Read IMPLEMENTATION_SUMMARY.md (understand scope)
2. Read AGENT_STANDARDIZATION_AUDIT.md Part 2 (learn standards)
3. Execute PROMPT_1 step-by-step (learn by doing)
4. Use PROMPT_2 for remaining agents (apply learning)

## ✨ What This Enables

- ✅ Multi-provider agent support (Claude, Copilot, OpenAI)
- ✅ Unified plugin architecture
- ✅ Automated validation via hooks
- ✅ Scalable agent creation process
- ✅ Complete documentation
- ✅ Team training materials

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
