---
title: Phase 2B Skills Architecture Audit
description: Comprehensive analysis of agent skills organization, reusability, and architectural patterns
created: 2026-07-24
status: in-progress
related_issues: '#1079'
related_branches:
  - feat/agents-phase-2b-skills-audit
  - feat/phase-2b-agent-skills-batch-1
---

# Phase 2B Skills Architecture Audit

## Objective

Audit all 16 agents' skills to establish a clear taxonomy and architecture for skill organization. Determine:

1. **Which skills are truly shared** (same implementation across multiple agents)
2. **Which skills are agent-specific variations** (similar purpose, agent-customized implementation)
3. **Which skills are unique to a single agent** (agent-specific only)
4. **Where each skill type should be stored** (`skills/`, agent-local, or shared)
5. **How to define and enforce the taxonomy** going forward

## Current Skills Organization

### Completed Batch 1 Skills Inventory

#### ai-readiness-estimator-agent (25 skills)

- **Agent-Attached (19):** ai-capability-evaluator, use-case-identifier, business-impact-analyzer, feasibility-assessor, opportunity-scorer, infrastructure-evaluator, data-quality-analyzer, workflow-analyzer, technology-auditor, scalability-assessor, team-readiness-assessor, organizational-readiness-analyzer, skill-gap-analyzer, change-capacity-evaluator, roadmap-generator, risk-assessor, roi-calculator, timeline-estimator, budget-planner
- **Local (1):** documents
- **Plugin-Provided (4):** github, google-drive, linear, gmail
- **Platform-Managed (1):** [extended capabilities]

#### website-content-strategist-agent (24 skills)

- **Agent-Attached (16):** content-strategy-generator, topic-cluster-builder, content-calendar-generator, user-journey-mapper, content-auditor, gap-analyzer, competitor-analyzer, content-performance-predictor, authority-analyzer, seo-auditor, keyword-researcher, seo-optimizer, search-intent-analyzer, content-format-optimizer, content-formatter, schema-markup-generator
- **Local (4):** documents, reports, templates, export-tools
- **Plugin-Provided (4):** github, google-drive, linear, figma
- **Platform-Managed (0)**

#### website-scope-estimator-agent (22 skills)

- **Agent-Attached (14):** scope-analyzer, feature-complexity-analyzer, requirement-validator, effort-estimator, timeline-generator, resource-planner, budget-estimator, scenario-modeler, risk-assessor, contingency-planner, milestone-definer, capacity-planner, cost-optimizer, timeline-optimizer
- **Local (3):** documents, reports, export-tools
- **Plugin-Provided (4):** github, linear, google-drive, figma
- **Platform-Managed (0)**

#### zendesk-support-agent (26 skills)

- **Agent-Attached (17):** response-drafter, response-optimizer, tone-analyzer, personalization-engine, follow-up-suggester, ticket-analyzer, ticket-prioritizer, ticket-router, ticket-tagger, sentiment-analyzer, knowledge-base-matcher, issue-pattern-detector, root-cause-analyzer, quality-scorer, escalation-router, escalation-assessor, resolution-tracker
- **Local (4):** documents, reports, templates, export-tools
- **Plugin-Provided (4):** zendesk, github, google-drive, linear
- **Platform-Managed (0)**

#### client-website-discovery-assistant-agent (28 skills)

- **Agent-Attached (18):** website-auditor, architecture-analyzer, technology-detector, content-analyzer, accessibility-checker, performance-analyzer, competitor-analyzer, feature-gap-analyzer, ux-comparator, best-practice-finder, differentiation-spotter, ux-assessor, seo-auditor, recommendation-generator, impact-estimator, conversion-optimizer, content-strategizer, prioritizer
- **Local (4):** documents, reports, export-tools, matrices
- **Plugin-Provided (4):** github, linear, google-drive, figma
- **Platform-Managed (0)**

## Analysis Questions

### 1. Skill Reusability Patterns

**Across the 5 completed agents, identify:**

- [ ] **Exact Duplicates:** Skills with identical names (e.g., `sentiment-analyzer` in zendesk-support-agent, analyzer needed elsewhere?)
- [ ] **Semantic Duplicates:** Skills that do the same thing but are named differently (e.g., `content-auditor` vs `website-auditor` — both audit things)
- [ ] **Partial Overlaps:** Skills that share 60-80% functionality but need agent-specific customization
- [ ] **Unique-Only Skills:** Skills that appear in only one agent and serve that agent's unique domain

**Key Skills to Investigate:**

- `*-analyzer` family (7 variants: sentiment, feature-gap, ux, seo, competitor, content, technology)
- `*-optimizer` family (4 variants: response, seo, cost, timeline)
- `*-generator` family (7 variants: content-strategy, timeline, roadmap, recommendation, content-calendar, schema-markup, report)
- `*-assessor` family (5 variants: feasibility, scalability, team-readiness, ux, escalation)

### 2. Local Skills Reuse

**Across all agents, the `local` skill category includes:**

Common local skills appearing in multiple agents:

- `documents` — appears in ALL 5 agents
- `reports` — appears in 4/5 agents
- `export-tools` — appears in 4/5 agents
- `templates` — appears in 2/5 agents
- `matrices` — appears in 1/5 agents (client-website-discovery-assistant-agent)

**Question:** Should these be moved to `skills/` as **shared portable skills** with consistent implementations?

### 3. Plugin-Provided Skills

**Consistent across all agents:**

- `github` — 5/5 agents
- `google-drive` — 4/5 agents
- `linear` — 4/5 agents
- `figma` — 3/5 agents (design/content-heavy agents)
- `zendesk` — 1/5 agents (support-specific)
- `gmail` — 1/5 agents (readiness-estimator for email communications)

**Question:** Are plugin skills truly "provided" or should they be explicitly documented as **required dependencies** for each agent?

## Proposed Skills Taxonomy

### Tier 1: Shared Portable Skills (`skills/` directory)

**Definition:** Skills with identical/near-identical implementations across multiple agents or likely to be reused by future agents.

**Candidates:**

```
skills/
├── documents/               # Document generation (Markdown, PDF, export)
├── reports/                 # Report generation and formatting
├── export-tools/            # Multi-format export utilities
├── sentiment-analysis/      # Sentiment and emotion detection
├── gap-analysis/            # Generic gap identification (content, feature, capability)
├── competitor-analysis/     # Competitor research and comparison
├── seo-audit/               # SEO analysis and recommendations
├── timeline-planning/       # Timeline and schedule generation
├── risk-assessment/         # Risk identification and mitigation
└── roadmap-generation/      # Roadmap and implementation planning
```

### Tier 2: Agent-Attached Customized Skills (`agents/{agent}/skills/` directory)

**Definition:** Skills that are **derived from shared skills** but have agent-specific customization OR serve a specific agent's unique domain.

**Examples:**

```
agents/zendesk-support-agent/skills/
├── response-drafting/       # Customized for support tone/empathy
├── ticket-management/       # Zendesk-specific workflow
└── quality-scoring/         # Support-specific quality metrics

agents/ai-readiness-estimator-agent/skills/
├── roi-calculator/          # Customized for AI/ML project ROI
├── workflow-analyzer/       # Customized for AI integration points
└── team-readiness-assessment/  # AI-specific skill evaluation
```

### Tier 3: Plugin-Provided Skills (external integrations)

**Definition:** Third-party platform integrations (github, linear, figma, google-drive, etc.)

**Current Usage:**

- `github` — 5/5 agents (issue linking, project integration)
- `linear` — 4/5 agents (epic creation, task management)
- `figma` — 3/5 agents (design reference, component mapping)
- `google-drive` — 4/5 agents (document collaboration)
- `zendesk` — 1/5 agents (ticket management)
- `gmail` — 1/5 agents (email communication)

**Question:** Should these be explicitly declared as **required provider integrations** in agent metadata?

## Key Architectural Decisions Needed

### Decision 1: Shared Skill Threshold

**Question:** At what reuse threshold should a skill be moved to `skills/` as shared?

**Options:**

- A) **2+ agents** — Any skill used by 2+ agents becomes shared
- B) **3+ agents** — Only skills used by 3+ agents become shared
- C) **Semantic similarity** — Group by function (all analyzers, all generators) rather than name identity
- D) **Future-proofed** — Move commonly-needed skills (documents, reports, export) to shared even if currently 1-2 agents

**Recommendation:** Option D + threshold of 3+ agents. Start with tier-1 candidates and expand as more agents are added.

### Decision 2: Customization Strategy

**Question:** How do we handle agent-specific variants of shared skills?

**Options:**

- A) **Single implementation with config** — One `sentiment-analyzer` skill with agent-specific configuration
- B) **Inheritance model** — Shared skill is a base; agents extend with agent-specific logic
- C) **Dual-storage** — Shared skill in `skills/` + agent override in `agents/{agent}/skills/`
- D) **Agent-local only** — Each agent maintains its own copy; no shared skills

**Recommendation:** Option C. Shared skills live in `skills/` with clear interface; agents can extend/override in `agents/{agent}/skills/` directory with custom configuration.

### Decision 3: Shared Skill Governance

**Question:** How do we define and enforce what is a "shared skill"?

**New File: `skills/SKILL_REGISTRY.yaml`**

```yaml
shared_skills:
  documents:
    category: local-utility
    description: Document generation and formatting
    used_by: [all agents]
    status: stable
    interface:
      inputs: [content, format]
      outputs: [markdown, pdf, html]
    config_schema: SCHEMA.json

  sentiment-analysis:
    category: analysis
    description: Analyze sentiment, emotion, and tone
    used_by: [zendesk-support-agent, potentially-others]
    status: experimental
    specializations:
      - support-empathy (zendesk-support-agent)
    interface:
      inputs: [text, context]
      outputs: [sentiment_score, emotion_labels, confidence]
    config_schema: SCHEMA.json
```

### Decision 4: Agent-Specific Skill Storage

**Question:** Where do agent-specific skills live?

**Option A: `agents/{agent}/skills/` (Recommended)**

```
agents/zendesk-support-agent/
├── AGENT.md
├── claude/
├── copilot/
├── openai/
├── shared/
└── skills/                              # NEW
    ├── ticket-management/
    │   ├── SKILL.md
    │   └── implementation.json
    └── response-optimization/
        ├── SKILL.md
        └── config.yaml
```

**Option B: Nested in provider directories**

```
agents/zendesk-support-agent/claude/
├── agent.md
└── skills/                              # Provider-specific skill implementation
    ├── ticket-management/
    └── response-optimization/
```

**Recommendation:** Option A (agent-level skills directory). Allows skills to be provider-agnostic at the definition level; provider-specific implementations go in provider directories if needed.

## Audit Tasks

### Phase 1: Skill Inventory & Classification

- [ ] **Audit all 16 agents:** Extract complete skills inventory from each agent's AGENT.md
- [ ] **Identify duplicates:** Find exact name matches, semantic duplicates, partial overlaps
- [ ] **Categorize reusability:** Tag each skill as Shared/Customized/Unique
- [ ] **Map dependencies:** Create a skills-to-agents matrix

**Output:** `SKILLS_INVENTORY_DETAILED.md` with matrix and duplication report

### Phase 2: Architectural Design

- [ ] **Validate assumptions:** Are the proposed tiers realistic?
- [ ] **Define governance model:** Create `skills/SKILL_REGISTRY.yaml` structure
- [ ] **Draft shared skill interface contracts:** What does each tier-1 skill expose?
- [ ] **Create migration plan:** How do we move existing agent skills to shared?

**Output:** `PHASE-2B-SKILLS-ARCHITECTURE.md` with governance model & migration plan

### Phase 3: Implementation

- [ ] **Create `skills/` directory structure** with tier-1 candidates
- [ ] **Extract & refactor shared skills** from agent definitions
- [ ] **Create `agents/{agent}/skills/` directories** for agent-specific skills
- [ ] **Update AGENT.md files** with skill references (shared vs. local)
- [ ] **Create SKILL_REGISTRY.yaml** with governance metadata

**Output:** Refactored agents with clear skill ownership & location

### Phase 4: Documentation & Validation

- [ ] **Document skill lookup logic:** How does an agent resolve a skill?
- [ ] **Create skill authoring guide:** For creating new shared vs. agent-specific skills
- [ ] **Lint & validate:** Ensure all agent skills are properly documented
- [ ] **Update architecture.md** with skills taxonomy

**Output:** Complete skills governance documentation & linting rules

## Success Criteria

- [ ] **Clarity:** Every skill's location (shared/agent-specific) is unambiguous
- [ ] **Reusability:** Shared skills have clean interfaces; agent overrides are minimal
- [ ] **Scalability:** New agents can easily discover and reuse existing skills
- [ ] **Governance:** Clear rules for when a skill should be shared vs. agent-local
- [ ] **Documentation:** SKILL_REGISTRY.yaml is the source of truth for skill metadata

## Related Issues & PRs

- Epic #1079: Agent standardization Phase 2B
- PR #1199: Phase 2A (prd-factory-planner-agent, 12-phase pattern established)
- PR (pending): Phase 2B Batch 1 (5 agents, skills documentation)

## Next Steps

1. **Run deep audit** to populate skills inventory matrix
2. **Stakeholder alignment** on architectural decisions (Decisions 1-4)
3. **Create `skills/` directory** structure and SKILL_REGISTRY.yaml
4. **Refactor Batch 1 agents** to use shared skills where applicable
5. **Apply pattern to remaining 11 agents** in Batch 2 & 3

---

**Audit Status:** In Progress  
**Branch:** `feat/agents-phase-2b-skills-audit`  
**Last Updated:** 2026-07-24
