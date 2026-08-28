# PHASE 2 BATCH PROMPT: PRD Combined Agent (prd-agent + prd-factory-planner-agent)

**Agents:** prd-agent + prd-factory-planner-agent (COMBINED)  
**Domain:** planning  
**Focus:** product-requirements  
**Purpose:** Create and manage product requirement documents and PRD specifications  
**Effort:** 4-6 hours (combining 2 agents into 1)  
**Reference:** PROMPT_2_GENERIC_AGENT_REWRITE.md + special merge instructions below

---

## SPECIAL INSTRUCTIONS: AGENT MERGE

This prompt combines TWO separate ChatGPT agents into ONE unified agent:

- `.github/agents/prd-agent/`
- `.github/agents/prd-factory-planner-agent/`

### Merge Strategy

1. **Analyze both** agent folders
2. **Identify overlaps** in capabilities
3. **Merge capabilities** into single agent
4. **Create unified** AGENT.md specification
5. **Consolidate** tools/skills
6. **Create one plugin** (lightspeed-planning-prd)

### Result

Single agent: `.github/agents/prd-agent/` (enhanced)  

- Archive: `prd-factory-planner-agent-merged-into-prd-agent` (backup)

---

## PARAMETER MAP

| Parameter | Value |
| --- | --- |
| {AGENT_NAME} | PRD Agent (Combined) |
| {agent-slug} | prd |
| {DOMAIN} | planning |
| {FOCUS} | product-requirements |
| {Agent Purpose} | Create comprehensive product requirement documents, PRDs, specifications, and planning artifacts for product development |

---

## AGENT SPECIFICATION

```yaml
name: prd
title: PRD Agent (Product Requirements)
description: >
  Create and manage product requirement documents, PRDs, technical
  specifications, feature definitions, and planning artifacts for
  product development and feature implementation.

version: '2.0.0'
category: planning
providers: [claude, copilot, openai]

capabilities:
  - prd-creation
  - specification-writing
  - requirement-analysis
  - feature-definition
  - user-story-generation
  - acceptance-criteria-definition
  - technical-specification
  - planning-artifact-generation

requirements:
  - Access to project requirements
  - Stakeholder input/approval process
  - Clear product vision
  - Target audience definition

constraints:
  - PRDs are drafts requiring stakeholder approval
  - User research informs specifications
  - Technical feasibility assessment required
  - Clear success metrics needed

security:
  rules:
    - No confidential product roadmaps leaked
    - Customer data anonymized in examples
    - NDA compliance for partner integrations
    - Version control for all artifacts
```

---

## MERGED CAPABILITIES

**From prd-agent:**

- PRD creation and formatting
- Executive summary generation
- Requirements documentation
- Success metrics definition

**From prd-factory-planner-agent:**

- Feature planning and prioritization
- Sprint planning integration
- Release planning
- Roadmap generation
- Timeline and milestone planning

**Combined:**

- End-to-end product planning (requirements → execution)
- PRD creation + planning artifact generation
- Feature definition + prioritization
- Timeline + roadmap generation
- Integration with planning workflows

---

## CORE RESPONSIBILITIES

1. **Create PRDs** (Product Requirement Documents) with all sections
2. **Define features** with clear acceptance criteria
3. **Generate user stories** from requirements
4. **Plan releases** and timelines
5. **Prioritize features** based on impact/effort
6. **Create roadmaps** with milestones
7. **Assess feasibility** and identify risks
8. **Generate planning artifacts** (specs, timelines, etc.)

---

## KEY TOOLS/CAPABILITIES

**Claude Tools:**

- prd-create
- prd-validate
- feature-prioritizer
- user-story-generator
- timeline-planner
- roadmap-generator
- risk-assessor

**Copilot Skills:**

- prd-writing
- feature-planning
- sprint-planning
- roadmap-creation
- timeline-estimation

**OpenAI Functions:**

- create_prd
- generate_feature_spec
- prioritize_features
- create_timeline
- generate_roadmap

---

## MERGE EXECUTION STEPS

1. **Analyze both agents** — Examine prd-agent and prd-factory-planner-agent folders
2. **Document capabilities** — List all tools, skills, outputs from each
3. **Identify overlaps** — Find duplicate functionality
4. **Create unified spec** — Single AGENT.md with all merged capabilities
5. **Consolidate tools** — Merge tool definitions
6. **Create enhanced agent** — Enhanced prd-agent with all merged capabilities
7. **Archive second** — Rename prd-factory-planner-agent as backup
8. **Create plugin** — Single plugin containing merged agent
9. **Validate** — Test merged functionality

---

## ESTIMATED EFFORT: 4-6 hours

- Analyze both agents: 1 hour
- Plan merge strategy: 30 min
- Create unified AGENT.md: 1 hour
- Consolidate tools/configs: 1 hour
- Create plugin: 30-45 min
- Testing & validation: 45-60 min

---

## SUCCESS CRITERIA

✅ Both agents analyzed  
✅ Capabilities documented & merged  
✅ Unified AGENT.md created  
✅ All tools/capabilities included  
✅ Plugin created with merged agent  
✅ Original prd-factory-planner-agent archived  
✅ All validation passing  
✅ Documentation complete  
✅ PR merged to develop  

---

## NOTES

- Merged agent is MORE capable than either original
- Eliminates duplication (single source of truth)
- Unified plugin for multi-agent grouping (planning domain)
- User can do PRD + planning in single agent

---

**Reference PROMPT_2_GENERIC_AGENT_REWRITE.md for 8-phase process, adapted for merge scenario.**
