# Agent Standards Initiative — Project Index

**Objective:** Convert 16 ChatGPT agent exports into unified, multi-provider agents compatible with Claude, GitHub Copilot, and OpenAI Codex.

**Project Duration:** 3 months (July–October 2026)  
**Total Effort:** ~50–100 hours across 3 phases  
**Status:** 🟢 Active — Ready for Phase 1 Execution  

---

## 📂 Project Files

### 1. **README.md** — Quick Navigation & Overview

- Quick start by role (executive, technical lead, individual contributor)
- File descriptions & usage guide
- Learning path
- References & support contacts

**Read First:** 5 minutes

### 2. **IMPLEMENTATION_SUMMARY.md** — Executive Overview & Roadmap

- Project overview & context
- Timeline & effort estimates (18h Phase 1, 2–4h per agent Phase 2–3)
- Complete roadmap (3 phases)
- Success criteria & validation procedures
- Risk assessment & mitigation

**Read Next:** 30 minutes

### 3. **AGENT_STANDARDIZATION_AUDIT.md** — Detailed Analysis & Framework

- Current state analysis (16 ChatGPT agents identified, 41 total agents)
- Standardization gaps & framework definition
- Folder structure specifications for agents & plugins
- Naming conventions for agents, plugins, providers
- 4 new schemas, 4 new hooks, 4 new instructions needed
- Schema additions required
- Hook additions required

**Read for Understanding:** 30–45 minutes

### 4. **PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md** — Phase 1 Detailed Orchestration (REFERENCE)

- Complete orchestration prompt for playwright-testing-agent pilot
- 7 detailed phases with full task breakdowns
- Repository audit + framework creation
- Agent restructuring instructions
- Provider-specific config creation
- Plugin creation
- Schema & hook implementation
- Documentation & testing

**Reference During Phase 1:** Use alongside STANDALONE_PROMPT_PHASE_1.md

### 5. **PROMPT_2_GENERIC_AGENT_REWRITE.md** — Generic Agent Rewrite Template (REFERENCE)

- Reusable template for remaining 15 agents
- Parameterized for any agent
- 8 detailed phases with task checklists
- 2–4 hours per agent

**Reference for Phase 2–3:** Customize for each agent

### 6. **STANDALONE_PROMPT_PHASE_1.md** — 🚀 THE MAIN EXECUTION PROMPT

- **Use this to start Phase 1 in a fresh Claude Code chat**
- Complete, self-contained prompt (no context needed)
- 26 detailed tasks across 10 phases
- Ready-to-use bash commands, JSON templates, markdown
- Final checklist for Phase 1 completion
- Success criteria

**MAIN PROMPT:** Copy entire contents into new chat and execute

---

## 🚀 Quick Start

### For Executives / Stakeholders

1. Read **IMPLEMENTATION_SUMMARY.md** (30 min)
2. Approve timeline & resource allocation
3. Authorize Phase 1 execution

### For Technical Leads

1. Read **IMPLEMENTATION_SUMMARY.md** (complete) (30 min)
2. Read **AGENT_STANDARDIZATION_AUDIT.md** Part 2 (30 min)
3. Review standards & naming conventions
4. Authorize Phase 1 execution

### For Individual Contributors (Execution)

1. Read **README.md** (5 min)
2. Read **IMPLEMENTATION_SUMMARY.md** (30 min)
3. Copy **STANDALONE_PROMPT_PHASE_1.md** (entire contents)
4. Paste into new Claude Code chat
5. Execute Phase 1 (12–18 hours)

---

## 📋 Project Structure

### Phase 1: Playwright Testing Agent Pilot (12–18 hours)

**Status:** ⏳ Ready to Begin

**Deliverables:**

- ✅ Playwright-testing-agent restructured (claude/, copilot/, openai/, shared/)
- ✅ lightspeed-playwright-testing plugin created
- ✅ 4 new JSON schemas
- ✅ 4 new hooks
- ✅ 4 new instruction files
- ✅ 1 cookbook entry
- ✅ All validation passing
- ✅ PR merged to develop

**Branch:** `feat/agent-standards-playwright-testing`  
**Use:** STANDALONE_PROMPT_PHASE_1.md

### Phase 2: Remaining 14 Agents (30–50 hours)

**Status:** 📅 Planned (After Phase 1) — **Batch Prompts Ready!**

**Agents to Convert (14 total, includes 1 combined agent):**

1. tour-operator-config-agent → `PROMPT_BATCH_2_TOUR_OPERATOR_CONFIG_AGENT.md`
2. wp-config-agent → `PROMPT_BATCH_2_WP_CONFIG_AGENT.md`
3. woo-config-agent → `PROMPT_BATCH_2_WOO_CONFIG_AGENT.md`
4. prd-agent + prd-factory-planner-agent (COMBINED) → `PROMPT_BATCH_2_PRD_COMBINED_AGENT.md`
5-14. design-partner, proposal-desk, client-website-discovery, website-scope-estimator, website-content-strategist, pagespeed, linear-advisor, harvest-analytical, zendesk-support, ai-readiness-estimator → `PROMPT_BATCH_2_AGENTS_5_14.md`

**Effort:** 2–4 hours per agent (4–6 hours for combined PRD)  
**Batching:** 2–3 agents per week  
**Reference:** `PHASE_2_BATCH_PROMPTS_INDEX.md` — Complete index of all 14 batch prompts  
**Master Template:** `PROMPT_2_GENERIC_AGENT_REWRITE.md` (reference for 8-phase process)

### Phase 3: Repository-Wide Governance (4–8 hours)

**Status:** 📅 Planned (After Phase 2)

**Deliverables:**

- Schemas merged into canonical registry
- Hooks deployed as org-wide enforcement
- Instruction files consolidated
- Memory schema updated
- Unified AI config

---

## 🎯 Success Criteria

### Phase 1 ✅

- [ ] Agent restructured
- [ ] All 3 providers (Claude, Copilot, OpenAI) supported
- [ ] Plugin created & functional
- [ ] Schemas & hooks working
- [ ] Instruction files created
- [ ] Tests passing
- [ ] Documentation complete
- [ ] PR merged to develop

### Phase 2 ✅

- [ ] 15 agents converted
- [ ] 6–8 plugins created/organized
- [ ] Hook enforcement active repo-wide

### Phase 3 ✅

- [ ] Complete multi-provider ecosystem operational
- [ ] Team trained on standards

---

## 📊 Effort Breakdown

| Phase | Tasks | Duration | Effort |
| --- | --- | --- | --- |
| 1 Audit | 5 | 2–3h | Repository audit & framework |
| 1 Framework | 1 | 1–2h | Document standards |
| 1 Agent Rewrite | 5 | 3–4h | Playwright restructure |
| 1 Plugin | 3 | 2–3h | Plugin creation |
| 1 Schemas | 2 | 2–3h | Create & register 4 schemas |
| 1 Hooks | 2 | 2–3h | Implement & register 4 hooks |
| 1 Instructions | 1 | 1–2h | Create 4 instruction files |
| 1 Testing | 2 | 1–2h | Validation & testing |
| 1 Git | 2 | 1h | Branch, commit, PR, merge |
| **Phase 1 Total** | **26** | **12–18h** | Complete orchestration |
| Phase 2 (per agent) | 8 | 2–4h | Generic agent conversion |
| Phase 3 | TBD | 4–8h | Governance & consolidation |

---

## 🔗 References & Related

### In This Project

- All files listed above (6 markdown documents)

### In Repository

- `.github/AGENTS.md` — Global AI rules
- `.github/CLAUDE.md` — Repository governance
- `.github/agents/` — Agent specifications (41 total)
- `.github/plugins/` — Plugin implementations (6 existing)
- `.github/instructions/` — Instruction files (42 total)
- `.github/.schemas/` — Schema definitions (16 total)
- `.github/hooks/` — Hook implementations (3 existing)

### External

- [Playwright Documentation](https://playwright.dev)
- [GitHub Copilot API](https://github.com/features/copilot)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Claude API Documentation](https://docs.anthropic.com)

---

## 📞 Contact & Support

**Project Owner:** Ash Shaw (<ashley@lightspeedwp.agency>)

**Questions?**

- See README.md for quick answers by role
- See IMPLEMENTATION_SUMMARY.md for timeline/effort questions
- See AGENT_STANDARDIZATION_AUDIT.md for standards questions
- See STANDALONE_PROMPT_PHASE_1.md for execution questions

---

## 📅 Timeline

**Start:** 2026-07-22  
**Phase 1 Completion Target:** 2026-08-05 (2 weeks)  
**Phase 2 Completion Target:** 2026-09-30 (8 weeks)  
**Phase 3 Completion Target:** 2026-10-22 (3 months)  

---

## 🎓 Key Learnings & Decisions

### Standardization Framework

**Naming:**

- Agent files: `{domain}-{focus}.agent.md`
- Agent folders: `{domain}-{function}-agent`
- Plugins: `lightspeed-{domain}-{focus}`

**Structure:**

- Shared (provider-agnostic): `shared/core-prompt.md`
- Provider-specific: `claude/`, `copilot/`, `openai/` folders
- Plugin-grouped agents: `lightspeed-*` plugins

**Validation:**

- Schemas for multi-provider agent validation
- Hooks for consistency checking
- Instruction files for standardization education

---

## ✅ Project Status

**Overall Status:** 🟢 Active — All planning complete, ready for execution

**Phase 1:** ⏳ Ready to begin (use STANDALONE_PROMPT_PHASE_1.md)  
**Phase 2:** 📅 Planned (use PROMPT_2_GENERIC_AGENT_REWRITE.md)  
**Phase 3:** 📅 Planned (after Phase 2)  

---

## 🚀 Next Action

**Immediate:**

1. Read IMPLEMENTATION_SUMMARY.md (30 min)
2. Copy STANDALONE_PROMPT_PHASE_1.md
3. Open new Claude Code chat
4. Paste the standalone prompt
5. Begin Phase 1 execution

---

**Last Updated:** 2026-07-22  
**Project Created:** 2026-07-22  
**Status:** ✅ Complete & Ready for Execution
