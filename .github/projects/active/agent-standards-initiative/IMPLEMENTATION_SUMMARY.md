# Agent & Plugin Standardization Initiative — Complete Implementation Summary

**Created:** 2026-07-22  
**Prepared For:** LightSpeed WordPress Agency  
**Project Status:** Ready for Phase 1 Implementation  

---

## Overview

This document summarizes the complete standardization initiative for converting 16 ChatGPT agent exports into a unified, multi-provider agent architecture supporting **Claude, GitHub Copilot, and OpenAI Codex**.

### What You're About to Do

1. **Playwright Testing Agent (Pilot)** — Full rewrite with repo standardization
2. **Repository Framework** — Create schemas, hooks, and instruction files
3. **Generic Template** — Reusable prompt for remaining 15 agents
4. **Complete Ecosystem** — Unified plugin architecture, validated by hooks

### Timeline & Effort

- **Phase 1 (Playwright):** 12-18 hours
- **Phases 2-3 (Remaining agents):** 2-4 hours per agent (15 agents = 30-60 hours total)
- **Phase 4 (Governance):** 4-8 hours
- **Total Project:** ~50-100 hours over 2-3 months

---

## Deliverables Summary

### Part A: Audit & Planning Documents

| Document | Purpose | Location |
| --- | --- | --- |
| **AGENT_STANDARDIZATION_AUDIT.md** | Comprehensive audit of current state + standardization framework | Scratchpad |
| **IMPLEMENTATION_SUMMARY.md** | This document — executive summary | Scratchpad |
| **Memory: project_agent_standardization_initiative.md** | Session memory for future reference | `.github/memory/` |

### Part B: Execution Prompts (Ready to Use)

| Prompt | Use Case | Location |
| --- | --- | --- |
| **PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md** | Complete playwright-testing-agent rewrite + repo audit | Scratchpad |
| **PROMPT_2_GENERIC_AGENT_REWRITE.md** | Reusable template for remaining 15 agents | Scratchpad |

### Part C: New Standardization Artifacts (To Be Created)

#### Folder Structure Standards

**Agent Export Format:**

```
.github/agents/{agent-slug}-agent/
├── AGENT.md                   # Agent spec with YAML frontmatter
├── README.md                  # Export summary
├── .github/                   # Agent-level config
│   ├── INSTALL.md
│   ├── MANIFEST.json
│   └── security-policy.md
├── claude/                    # Claude-specific instructions
│   ├── agent.md
│   └── tools.json
├── copilot/                   # GitHub Copilot instructions
│   ├── agent.md
│   ├── copilot-plugin.json
│   └── skills.yaml
├── openai/                    # OpenAI instructions
│   ├── agent.md
│   └── tools.json
├── shared/                    # Provider-agnostic content
│   ├── core-prompt.md
│   ├── tools/
│   ├── memory/
│   └── hooks/
├── skills/                    # From ChatGPT export
├── manifests/                 # From ChatGPT export
└── checksums.sha256           # From ChatGPT export
```

**Plugin Format:**

```
.github/plugins/lightspeed-{DOMAIN}-{FOCUS}/
├── plugin.json                # Master plugin manifest
├── README.md
├── INSTALL.md
├── .claude-plugin/            # Claude plugin config
├── .codex-plugin/             # GitHub Copilot config
├── .gemini-plugin/            # Google Gemini config
├── agents/                    # Multiple agents grouped
│   ├── {agent-1}/
│   ├── {agent-2}/
│   └── ...
├── skills/                    # Shared skills
├── hooks/                     # Shared hooks
├── .schemas/                    # Plugin-specific schema
└── cookbook/                  # Integration recipes
```

#### Naming Conventions

**Agents:**

- Agent spec files: `{domain}-{focus}.agent.md`
- Agent export folders: `{domain}-{function}-agent`
- Agent inside plugin: `agents/{domain}-{focus}/`

**Plugins:**

- Plugin folders: `lightspeed-{domain}-{focus}`
- Plugin manifest: `{plugin-name}/copilot-plugin.json`
- Provider subdirs: `.{provider}-plugin/`

#### New Instruction Files (4)

1. **`agent-creation-workflow.instructions.md`**
   - Step-by-step guide for agent conversion
   - Provider-specific patterns
   - Testing & validation

2. **`multi-provider-compatibility.instructions.md`**
   - How to write provider-agnostic prompts
   - Provider customization patterns
   - Tool mapping across providers

3. **`plugin-architecture.instructions.md`**
   - Plugin structure & organization
   - Agent-plugin binding patterns
   - Hook integration

#### New Schema Files (4)

1. **`multi-provider-agent.schema.json`** — Multi-provider agent validation
2. **`agent-plugin-binding.schema.json`** — Agent-plugin relationships
3. **`provider-config.schema.json`** — Per-provider configuration
4. **`agent-capability-manifest.schema.json`** — Agent capabilities

#### New Hooks (4)

1. **`agent-spec-validator.js`** — Validates agent YAML frontmatter
2. **`multi-provider-consistency-checker.js`** — Detects provider divergences
3. **`plugin-integrity-checker.js`** — Validates plugin manifests
4. **`agent-security-auditor.js`** — Scans for security violations

---

## Standardization Framework

### Core Principles

1. **Separation of Concerns**
   - Shared (provider-agnostic) content in `shared/`
   - Provider-specific content in `{provider}/` folders
   - No duplication of core logic

2. **Single Source of Truth**
   - Core prompts defined once
   - Provider-specific customizations layered on top
   - Consistency checks via hooks

3. **Multi-Provider Parity**
   - Same capabilities across Claude, Copilot, OpenAI
   - Tool mapping validated automatically
   - Provider divergences detected and reported

4. **Scalable Plugin Architecture**
   - Group related agents in plugins
   - Share skills & hooks across agents
   - Domain-based organization

### Decision Tree: Plugin Grouping

```
Is this agent part of an existing domain/category?
├─ YES: Does lightspeed-{DOMAIN}-* plugin exist?
│   ├─ YES: Add agent to existing plugin
│   └─ NO: Create new plugin for this domain
└─ NO: Is this a standalone, unique agent?
    ├─ YES: Create single-agent plugin
    └─ NO: Group with closest domain plugin
```

**Examples:**

- `linear-advisor-agent` → `lightspeed-project-management-linear`
- `design-partner-agent` → `lightspeed-design-partner` or `lightspeed-design`
- `zendesk-support-agent` → `lightspeed-support-zendesk`
- `wordpress-config-agent` → `lightspeed-wordpress-governance`

---

## Implementation Roadmap

### Phase 1: Playwright Testing Agent (Pilot)

**Branch:** `feat/agent-standards-playwright-testing`  
**Effort:** 12-18 hours  
**Status:** Ready to Execute

**Deliverables:**

1. ✅ Rewrite `playwright-testing-agent/` with new structure
2. ✅ Create Claude, Copilot, OpenAI provider configs
3. ✅ Create `lightspeed-playwright-testing` plugin
4. ✅ Create 4 new schemas
5. ✅ Create 4 new hooks
6. ✅ Create 4 new instruction files
7. ✅ Create cookbook entry
8. ✅ All tests passing
9. ✅ Merge to develop

**Use This:** `PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md`

**Success Criteria:**

- Agent folder restructured
- All provider configs created & validated
- Plugin functional across all providers
- Hooks enforcing standards
- Documentation complete
- Tests passing

---

### Phase 2: Generic Agent Conversion (Remaining 15 Agents)

**Agents to Convert:**

1. ai-readiness-estimator-agent → `lightspeed-planning-readiness`
2. client-website-discovery-assistant-agent → `lightspeed-discovery-client-websites`
3. design-partner-agent → `lightspeed-design-partner`
4. harvest-analytical-agent → `lightspeed-time-tracking-harvest`
5. linear-advisor-agent → `lightspeed-project-management-linear`
6. pagespeed-agent → `lightspeed-performance-pagespeed`
7. prd-agent → `lightspeed-planning-prd` (may merge with existing)
8. prd-factory-planner-agent → `lightspeed-planning-prd-factory`
9. proposal-desk-agent → `lightspeed-proposals`
10. tour-operator-config-agent → `lightspeed-tour-operator`
11. website-content-strategist-agent → `lightspeed-content-strategy`
12. website-scope-estimator-agent → `lightspeed-estimation-scope`
13. woo-config-agent → `lightspeed-ecommerce-woo`
14. wp-config-agent → `lightspeed-wordpress-governance`
15. zendesk-support-agent → `lightspeed-support-zendesk`

**Effort:** 2-4 hours per agent (30-60 hours total)  
**Batching Strategy:** 2-3 agents per session, grouped by domain

**Use This:** `PROMPT_2_GENERIC_AGENT_REWRITE.md` (parameterized for each agent)

---

### Phase 3: Repository-Wide Governance

**Deliverables:**

1. Merge all schemas into canonical registry
2. Deploy hooks as org-wide enforcement
3. Update instruction file index
4. Consolidate memory schema
5. Create unified AI config

**Effort:** 4-8 hours  
**Status:** Dependent on Phase 1 & 2

---

## How to Execute

### Immediate Next Steps

1. **Review This Documentation**
   - Read AGENT_STANDARDIZATION_AUDIT.md
   - Understand naming conventions
   - Approve folder structure

2. **Execute Phase 1 (Playwright Agent)**
   - Create branch: `feat/agent-standards-playwright-testing`
   - Use: `PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md`
   - Follow 7 phases systematically
   - Validate at each phase
   - Create PR and merge

3. **Execute Phase 2 (First 3-5 Agents)**
   - Create branch: `feat/agent-standards-batch-1`
   - Use: `PROMPT_2_GENERIC_AGENT_REWRITE.md`
   - Apply to each agent (2-3 hours each)
   - Batch similar agents
   - Create grouped PR

4. **Iterate Phases 2-3**
   - Continue converting agents in batches
   - Refine generic prompt based on learnings
   - Update standards as needed

### Detailed Execution Guide (Phase 1)

**Step 1: Audit & Plan (2-3 hours)**

- Review current agent export (Task 1.1 in PROMPT_1)
- Audit repository files (Tasks 1.2-1.5)
- Create framework documentation (Task 2.1)

**Step 2: Restructure Agent (1-2 hours)**

- Create new folder structure (Task 2.2)
- Move existing files (Task 3.2)
- Initialize template files

**Step 3: Create Specifications (2-3 hours)**

- Write AGENT.md with YAML frontmatter (Task 3.3)
- Create core prompt (Task 3.4.A)
- Create provider-specific configs (Tasks 3.4.B-D)

**Step 4: Define Tools (1-2 hours)**

- Claude tools.json (Task 4.1)
- Copilot skills.yaml (Task 4.2)
- OpenAI functions (Task 4.3)

**Step 5: Create Plugin (2-3 hours)**

- Plugin structure (Task 5.1)
- Manifests (Tasks 5.2-5.3)
- Documentation (Tasks 6.1-6.3)

**Step 6: Schemas & Hooks (2-3 hours)**

- Create 4 new schemas (Task 4.1)
- Create 4 new hooks (Task 4.2)
- Register & test

**Step 7: Validation & Testing (1-2 hours)**

- Schema validation
- Hook validation
- Provider config testing
- Documentation checks

**Step 8: Git & Merge (0.5-1 hour)**

- Create feature branch
- Commit changes
- Create PR
- Merge to develop

---

## Key Success Factors

### 1. Standards Adherence

- Follow naming conventions strictly
- Use provided templates
- Validate against schemas
- Run hooks before commit

### 2. Documentation Quality

- Clear README files
- Complete INSTALL guides
- Practical examples in agent specs
- Links verified

### 3. Testing Coverage

- Schema validation passing
- Hook validation passing
- Provider configs loading
- Manual functionality testing

### 4. Iterative Refinement

- First agent (playwright) will define pattern
- Use learnings to refine generic prompt
- Update documentation as you learn
- Share patterns with team

---

## Risk Mitigation

| Risk | Mitigation |
| --- | --- |
| Provider API changes break compatibility | Version-pin configs; maintain provider version matrix in AI folder |
| Large PR scope causes merge conflicts | Phase into separate PRs per agent; use feature branches |
| Tool/skill mismatch across providers | Comprehensive testing suite; consistency hook enforcement |
| Agent behavior diverges across providers | Test each provider independently; use multi-provider consistency hook |
| Memory/state inconsistency | Unified schema for memory persistence; shared memory models |
| Documentation falls out of sync | Automated doc validation; link checking in CI/CD |

---

## Tools & Resources

### Available Resources

- **LightSpeed CLAUDE.md** — Repository governance rules
- **AGENTS.md** — Global AI rules
- **.github/instructions/** — Existing instruction files
- **.github/.schemas/** — Existing schemas
- **.github/hooks/** — Existing hook patterns
- **.github/plugins/lightspeed-*/** — Reference plugin implementations

### New Resources (To Be Created)

- Schemas (4 files)
- Hooks (4 files)
- Instructions (4 files)
- Cookbook entry (1 file)

---

## Branch Naming & Git Workflow

### Branch Names

**Phase 1 (Playwright):**

- `feat/agent-standards-playwright-testing`

**Phase 2 (Batch Agent Conversions):**

- `feat/agent-standards-batch-1` (agents 1-3)
- `feat/agent-standards-batch-2` (agents 4-6)
- etc.

**Phase 3 (Governance):**

- `ci/agent-governance-consolidation`

### Merge Strategy

- Squash merge to develop (never main)
- Delete branch after merge
- Update CHANGELOG.md
- Tag release after Phase 2

---

## Long-Term Maintenance

### Ongoing Updates

1. **New Agents** — Use generic prompt (Phase 2 template)
2. **Provider Updates** — Update provider-config.schema.json
3. **Skill Sharing** — Add new skills to shared skills folders
4. **Hook Updates** — Enhance validation as standards evolve

### Quarterly Reviews

- Audit agent parity across providers
- Update capability matrix
- Review and update instruction files
- Assess hook effectiveness

---

## Success Criteria (Final)

### By End of Phase 1

✅ Playwright agent restructured  
✅ All 3 providers (Claude, Copilot, OpenAI) supported  
✅ Plugin created and functional  
✅ 4 new schemas created & validated  
✅ 4 new hooks created & working  
✅ 4 instruction files created  
✅ Cookbook entry added  
✅ Tests passing  
✅ Documentation complete  

### By End of Phase 2

✅ 15 agents converted (total 16)  
✅ 6 plugins created/updated  
✅ 2 domain groupings finalized  
✅ Hook enforcement active repo-wide  

### By End of Phase 3

✅ Schemas merged into canonical registry  
✅ AI configs unified  
✅ Instruction files consolidated  
✅ Memory schema updated  
✅ Complete multi-provider ecosystem operational  

---

## Questions & Contact

**Documentation Questions:**

- Review AGENT_STANDARDIZATION_AUDIT.md
- Check instruction files in `.github/instructions/`

**Implementation Questions:**

- Follow PROMPT_1 or PROMPT_2 step-by-step
- Refer to playwright-testing-agent (pilot) as reference
- Check schema files for validation rules

**Technical Support:**

- Contact: <contact@lightspeedwp.agency>
- Slack: #engineering (if available)

---

## Next Action

### You Are Here ➜

1. ✅ Read all 3 summary documents (this one + audit + both prompts)
2. ⬜ Approve standardization framework
3. ⬜ Execute PROMPT_1 (playwright agent pilot)
4. ⬜ Validate Phase 1 success
5. ⬜ Begin Phase 2 (generic agent conversions)

### Immediate Steps

1. **Download These Documents**
   - Save from scratchpad to your working directory
   - Reference during implementation

2. **Create Initial Branch**

   ```bash
   git checkout -b feat/agent-standards-playwright-testing
   ```

3. **Begin Phase 1**
   - Use PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md
   - Start with Task 1.1 (Audit Instruction Files)
   - Work systematically through all tasks

4. **Report Progress**
   - Update memory after each major phase
   - Document any deviations from standard
   - Flag blockers early

---

## Version History

| Version | Date | Changes |
| --- | --- | --- |
| 1.0 | 2026-07-22 | Initial creation |

---

**Prepared by:** Claude Code  
**For:** LightSpeed WordPress Agency  
**Status:** Ready for Phase 1 Execution  

✨ **Good luck! This is going to standardize your entire agent ecosystem.** ✨
