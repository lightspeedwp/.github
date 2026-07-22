---
title: Phase 2 Batch Prompts Index
description: Complete index of parameterized prompts for all 14 remaining agents (Phase 2)
version: '1.0.0'
last_updated: '2026-07-22'
---

# Phase 2 Batch Prompts Index

**Phase:** 2 (Remaining agents after Playwright pilot)  
**Total Agents:** 14 (includes 1 combined agent)  
**Estimated Total Effort:** 30-50 hours  
**Timeline:** 8-10 weeks (2-3 agents per week)  

---

## Overview

Phase 2 converts the remaining 14 ChatGPT agent exports into multi-provider format. Each agent gets its own parameterized prompt, but all follow the same 8-phase process from **PROMPT_2_GENERIC_AGENT_REWRITE.md**.

### Key Points

- **14 Batch Prompts:** Individual prompts for each agent (plus combined PRD agent)
- **Generic Template:** All reference PROMPT_2_GENERIC_AGENT_REWRITE.md for detailed guidance
- **Consistent Process:** All follow same 8-phase standardization workflow
- **Sequential Execution:** Can be done 2-3 agents per week

---

## Batch Prompts (14 Total)

### Batch 1: Configuration Agents (3 agents)

These agents manage website/store configuration.

#### 1. **PROMPT_BATCH_2_TOUR_OPERATOR_CONFIG_AGENT.md**
- **Folder:** `.github/agents/tour-operator-config-agent/`
- **Domain:** configuration  
- **Focus:** tour-operator  
- **Purpose:** Configure tour operator website settings
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-configuration-tour-operator`
- **Key Capabilities:** Tour settings, integration setup, deployment config

#### 2. **PROMPT_BATCH_2_WP_CONFIG_AGENT.md**
- **Folder:** `.github/agents/wp-config-agent/`
- **Domain:** wordpress  
- **Focus:** configuration  
- **Purpose:** WordPress core configuration & security
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-wordpress-configuration`
- **Key Capabilities:** WP settings, security hardening, performance optimization

#### 3. **PROMPT_BATCH_2_WOO_CONFIG_AGENT.md**
- **Folder:** `.github/agents/woo-config-agent/`
- **Domain:** ecommerce  
- **Focus:** woocommerce  
- **Purpose:** WooCommerce store configuration
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-ecommerce-woocommerce`
- **Key Capabilities:** Store setup, payment gateways, shipping, products

### Batch 2: Planning Agents (1 combined agent)

#### 4. **PROMPT_BATCH_2_PRD_COMBINED_AGENT.md** ⭐ MERGE OPERATION
- **Folders:** `.github/agents/prd-agent/` + `.github/agents/prd-factory-planner-agent/`
- **Domain:** planning  
- **Focus:** product-requirements  
- **Purpose:** Create PRDs and planning artifacts
- **Effort:** 4-6 hours (combines 2 agents)
- **Plugin:** `lightspeed-planning-product-requirements`
- **Key Capabilities:** PRD creation, feature planning, roadmap generation
- **Special:** Merges 2 agents into 1 enhanced agent

### Batch 3: Design & Proposals (2 agents)

#### 5. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 5)
- **Folder:** `.github/agents/design-partner-agent/`
- **Domain:** design  
- **Focus:** partner-collaboration  
- **Purpose:** Design collaboration and guidance
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-design-partner`
- **Key Capabilities:** Design review, design system, accessibility

#### 6. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 6)
- **Folder:** `.github/agents/proposal-desk-agent/`
- **Domain:** proposals  
- **Focus:** proposal-generation  
- **Purpose:** Create and manage proposals
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-proposals`
- **Key Capabilities:** Proposal creation, quote generation, tracking

### Batch 4: Discovery & Estimation (2 agents)

#### 7. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 7)
- **Folder:** `.github/agents/client-website-discovery-assistant-agent/`
- **Domain:** discovery  
- **Focus:** website-assessment  
- **Purpose:** Analyze client websites
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-discovery-services`
- **Key Capabilities:** Website audit, competitor analysis, recommendations

#### 8. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 8)
- **Folder:** `.github/agents/website-scope-estimator-agent/`
- **Domain:** estimation  
- **Focus:** project-scoping  
- **Purpose:** Estimate project scope & timeline
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-estimation-services`
- **Key Capabilities:** Scope analysis, effort estimation, timeline planning

### Batch 5: Content & Performance (2 agents)

#### 9. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 9)
- **Folder:** `.github/agents/website-content-strategist-agent/`
- **Domain:** content  
- **Focus:** content-strategy  
- **Purpose:** Content strategy and planning
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-content-strategy`
- **Key Capabilities:** Content strategy, audit, SEO optimization

#### 10. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 10)
- **Folder:** `.github/agents/pagespeed-agent/`
- **Domain:** performance  
- **Focus:** performance-optimization  
- **Purpose:** Performance analysis and optimization
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-performance-optimization`
- **Key Capabilities:** Core Web Vitals, load optimization, CDN

### Batch 6: Project Management (1 agent)

#### 11. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 11)
- **Folder:** `.github/agents/linear-advisor-agent/`
- **Domain:** project-management  
- **Focus:** linear-integration  
- **Purpose:** Linear issue & project management
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-project-management-linear`
- **Key Capabilities:** Issue management, sprint planning, workflows

### Batch 7: Analytics & Support (2 agents)

#### 12. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 12)
- **Folder:** `.github/agents/harvest-analytical-agent/`
- **Domain:** analytics  
- **Focus:** time-tracking-analysis  
- **Purpose:** Time tracking analysis and reporting
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-time-tracking-analytics`
- **Key Capabilities:** Time analysis, profitability, reports

#### 13. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 13)
- **Folder:** `.github/agents/zendesk-support-agent/`
- **Domain:** support  
- **Focus:** customer-support  
- **Purpose:** Support ticket management
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-support-zendesk`
- **Key Capabilities:** Ticket management, KB, workflows

### Batch 8: Assessment (1 agent)

#### 14. **PROMPT_BATCH_2_AGENTS_5_14.md** (Agent 14)
- **Folder:** `.github/agents/ai-readiness-estimator-agent/`
- **Domain:** assessment  
- **Focus:** ai-readiness  
- **Purpose:** AI readiness assessment
- **Effort:** 2-4 hours
- **Plugin:** `lightspeed-assessment-ai-readiness`
- **Key Capabilities:** Readiness assessment, roadmap, ROI

---

## How to Use These Prompts

### For Single Agent Execution

1. **Select the appropriate batch prompt** based on agent number
2. **Copy the entire prompt content** to clipboard
3. **Open new Claude Code chat**
4. **Paste the prompt**
5. **Execute the 8 phases** (reference PROMPT_2_GENERIC_AGENT_REWRITE.md for details)
6. **Follow the checklist** to verify completion
7. **Create PR** and merge to develop when complete

### For Batch Execution (Multiple Agents)

1. **Plan your batch** (e.g., agents 1-3 this week)
2. **Execute prompts sequentially** (one agent → one chat session)
3. **Update progress tracker** after each agent
4. **Create PRs per agent** or combined PR per batch
5. **Merge to develop** when batch is complete

---

## Execution Timeline Suggestions

### Week 1: Configuration Agents
- Agent 1: Tour Operator Config (2-4h)
- Agent 2: WordPress Config (2-4h)
- Agent 3: WooCommerce Config (2-4h)
- **Total: 6-12 hours**

### Week 2: Planning & Design
- Agent 4: PRD Combined (4-6h) ⭐
- Agent 5: Design Partner (2-4h)
- **Total: 6-10 hours**

### Week 3: Proposals & Discovery
- Agent 6: Proposal Desk (2-4h)
- Agent 7: Website Discovery (2-4h)
- **Total: 4-8 hours**

### Week 4: Estimation & Content
- Agent 8: Website Scope (2-4h)
- Agent 9: Content Strategist (2-4h)
- **Total: 4-8 hours**

### Week 5: Performance & PM
- Agent 10: PageSpeed (2-4h)
- Agent 11: Linear Advisor (2-4h)
- **Total: 4-8 hours**

### Week 6: Analytics & Support
- Agent 12: Harvest Analytical (2-4h)
- Agent 13: Zendesk Support (2-4h)
- **Total: 4-8 hours**

### Week 7: Assessment
- Agent 14: AI Readiness (2-4h)
- **Total: 2-4 hours**

---

## Summary Stats

| Metric | Count |
| --- | --- |
| **Total Agents** | 14 |
| **Combined Agents** | 1 (PRD merge) |
| **Individual Prompts** | 5 |
| **Batch Prompts** | 1 (covering agents 5-14) |
| **Estimated Hours** | 30-50 |
| **Estimated Weeks** | 8-10 |
| **Hours per Week** | 3-7 |
| **Agents per Week** | 2-3 |
| **Plugins to Create** | 13 |

---

## Key References

**Main Templates:**
- `PROMPT_2_GENERIC_AGENT_REWRITE.md` — Master template (8 phases, detailed)
- `AGENT_STANDARDIZATION_AUDIT.md` — Standardization framework

**Folder Structure Reference:**
- `.github/projects/active/agent-standards-initiative/` — All project files
- `.github/agents/{agent-slug}/` — Agent implementations
- `.github/plugins/lightspeed-*/` — Plugin groupings

**Standards Documentation:**
- `.github/instructions/agent-creation-workflow.instructions.md`
- `.github/instructions/multi-provider-compatibility.instructions.md`
- `.github/instructions/plugin-architecture.instructions.md`

---

## Success Criteria (Per Agent)

When each agent batch prompt is executed, you'll know it's complete when:

✅ Folder structure created  
✅ AGENT.md written with YAML frontmatter  
✅ Core prompt (provider-agnostic) created  
✅ Claude config & tools created  
✅ Copilot config & skills created  
✅ OpenAI config & functions created  
✅ Plugin created with manifests  
✅ All validation passing  
✅ Documentation complete  
✅ PR merged to develop  

---

## Navigation

**Phase 1 (Playwright Pilot):**
- See `STANDALONE_PROMPT_PHASE_1.md`

**Phase 2 (This Phase - 14 Agents):**
- Agents 1-3: Configuration → `PROMPT_BATCH_2_TOUR_OPERATOR_CONFIG_AGENT.md`, etc.
- Agent 4: PRD Combined → `PROMPT_BATCH_2_PRD_COMBINED_AGENT.md`
- Agents 5-14: Quick Ref → `PROMPT_BATCH_2_AGENTS_5_14.md`

**Phase 3 (Governance):**
- See `IMPLEMENTATION_SUMMARY.md` Phase 3 section

---

## Status

**Creation Date:** 2026-07-22  
**Status:** ✅ Ready for Phase 2 Execution  
**Next Step:** Execute Agent 1 (Tour Operator Config Agent)

---

**Use this index to navigate to the correct prompt for each agent. Each prompt follows the same 8-phase process.**
