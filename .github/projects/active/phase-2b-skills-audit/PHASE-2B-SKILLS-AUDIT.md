---
file_type: documentation
title: Phase 2B Skills Architecture Audit
description: Comprehensive analysis of agent skills organisation, reusability, and architectural patterns
created: 2026-07-24
status: active
related_issues: '#1079'
related_branches:
  - feat/agents-phase-2b-skills-audit
  - feat/phase-2b-agent-skills-batch-1
---

# Phase 2B Skills Architecture Audit

## Objective

Audit all 16 agents' skills to establish a clear taxonomy and architecture for skill organisation. Determine:

1. **Which skills are truly shared** (same implementation across multiple agents)
2. **Which skills are agent-specific variations** (similar purpose, agent-customised implementation)
3. **Which skills are unique to a single agent** (agent-specific only)
4. **Where each skill type should be stored** (`skills/`, agent-local, or shared)
5. **How to define and enforce the taxonomy** going forward

## Current Skills Organization

### Completed Batch 1 Skills Inventory

#### ai-readiness-estimator-agent (25 skills)

- **Agent-Attached (19):** ai-capability-evaluator, use-case-identifier, business-impact-analyzer, feasibility-assessor, opportunity-scorer, infrastructure-evaluator, data-quality-analyzer, workflow-analyzer, technology-auditor, scalability-assessor, team-readiness-assessor, organisational-readiness-analyzer, skill-gap-analyzer, change-capacity-evaluator, roadmap-generator, risk-assessor, roi-calculator, timeline-estimator, budget-planner
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

### Completed Batch 2-3 Skills Inventory

#### design-partner-agent (8 skills)

- **Agent-Attached (1):** hermes (grouped design skills)
- **Directory-Installed (2):** builtins, system
- **Local (1):** frontend-skill
- **Plugin-Provided (4):** figma, github, google-drive, linear

#### harvest-analytical-agent (8 skills)

- **Directory-Installed (4):** documents, pdf, presentations, spreadsheets
- **Local (1):** frontend-skill
- **Plugin-Provided (3):** github, google-drive, linear

#### linear-advisor-agent (42 skills)

- **Agent-Attached (16):** linear-app-skill-creator, linear-decision-logger, linear-duplicate-management-playbook, linear-gap-analyzer, linear-memory-maintenance, linear-momentum-auditor, linear-project-pulse, linear-skill-intake-onboarding, linear-sub-issue-splitter, linear-the-architect, linear-triage-router, linear-triage-rules-designer, linear-triage-sop-builder, linear-unplanned-work-intake-audit, linear-voice-of-customer, markdown-output-formatter
- **Local (10):** Presentations, Spreadsheets, documents, frontend-skill, imagegen, openai-docs, pdf, plugin-creator, skill-creator, skill-installer
- **Plugin-Provided (16):** github (4: gh-address-comments, gh-fix-ci, github, yeet), google-drive (5: google-docs, google-drive, google-drive-comments, google-sheets, google-slides), linear (1), slack (5: slack, slack-channel-summarization, slack-daily-digest, slack-notification-triage, slack-outgoing-message, slack-reply-drafting)

#### pagespeed-agent (6 skills)

- **Agent-Attached (3):** builtins, frontend-skill, hermes
- **Plugin-Provided (1):** google-drive

#### playwright-testing-agent (4 skills)

- **Agent-Attached (2):** frontend-skill, hermes
- **Local (2):** platform-managed, plugin-provided

#### prd-agent (43 skills)

- **Agent-Attached (25):** content-file-validator, evidence-locker, hermes, lightspeed-acceptance-test-planner, lightspeed-approval-gate-manager, lightspeed-change-request-router, lightspeed-figma-wordpress-technical-brief, lightspeed-github-issue-drafter, lightspeed-implementation-plan-generator, lightspeed-intake-onboarding, lightspeed-launch-task-router, lightspeed-prd-generator, lightspeed-prd-task-manager, lightspeed-prd-task-pack-exporter, lightspeed-prd-task-reviewer, lightspeed-project-intake-router, lightspeed-project-memory-manager, lightspeed-project-researcher, lightspeed-project-status-reporter, lightspeed-qa-findings-router, lightspeed-release-handoff-generator, lightspeed-requirements-traceability-mapper, lightspeed-task-breakdown-planner, markdown-content-validator, wordpress-plugin-packaging-review
- **Local (13):** directory-installed, documents, frontend-skill, imagegen, openai-docs, pdf, platform-managed, plugin-creator, plugin-provided, presentations, skill-creator, skill-installer, spreadsheets
- **Plugin-Provided (5):** figma, github, gmail, google-drive, linear

#### prd-factory-planner-agent (39 skills)

- **Agent-Attached (24):** content-file-validator, evidence-locker, lightspeed-acceptance-test-planner, lightspeed-approval-gate-manager, lightspeed-change-request-router, lightspeed-figma-wordpress-technical-brief, lightspeed-github-issue-drafter, lightspeed-implementation-plan-generator, lightspeed-intake-onboarding, lightspeed-launch-task-router, lightspeed-prd-generator, lightspeed-prd-task-manager, lightspeed-prd-task-pack-exporter, lightspeed-prd-task-reviewer, lightspeed-project-intake-router, lightspeed-project-memory-manager, lightspeed-project-researcher, lightspeed-project-status-reporter, lightspeed-qa-findings-router, lightspeed-release-handoff-generator, lightspeed-requirements-traceability-mapper, lightspeed-task-breakdown-planner, markdown-content-validator, wordpress-plugin-packaging-review
- **Local (10):** documents, frontend-skill, imagegen, openai-docs, pdf, plugin-creator, presentations, skill-creator, skill-installer, spreadsheets
- **Plugin-Provided (5):** figma, github, gmail, google-drive, linear
- **NOTE:** Nearly identical to prd-agent minus 'hermes' and some local utilities

#### proposal-desk-agent (16 skills)

- **Agent-Attached (6):** evidence-claims-check, markdown-format-validator, proposal-defaults-onboarding, proposal-intake, rfp-response, wordpress-plugin-packaging-review
- **Local (3):** builtins, frontend-skill, system
- **Plugin-Provided (7):** figma, github, gmail, google-calendar, google-drive, linear, slack

#### tour-operator-config-agent (30 skills)

- **Agent-Attached (10):** agent-asset-validation-maintainer, pre-launch-readiness-review, site-preflight, tour-operator-agent-instructions, tour-operator-gravity-forms-auditor, tour-operator-gravity-forms-configuration, tour-operator-website, tour-operator-yoast-auditor, tour-operator-yoast-configuration, wordpress-accessibility-checker
- **Local (20):** Documents, Presentations, Spreadsheets, documents, frontend-skill, github-*, google-drive-*, imagegen, openai-docs, pdf, plugin-creator, skill-creator, skill-installer
- **Plugin-Provided (0):** All integrated as local GitHub + Google Drive + Linear + Slack skills

#### woo-config-agent (15 skills)

- **Agent-Attached (10):** woocommerce-audit-orchestrator, woocommerce-gravity-forms-auditor, woocommerce-gravity-forms-configuration, woocommerce-implementation-planner, woocommerce-project-onboarding, woocommerce-remediation-triage, woocommerce-site-discovery, woocommerce-yoast-auditor, woocommerce-yoast-configuration, wordpress-accessibility-checker
- **Directory-Installed (4):** documents, pdf, presentations, spreadsheets
- **Local (1):** frontend-skill
- **Plugin-Provided (1):** openai-marketplace (generic)

#### wp-config-agent (21 skills)

- **Agent-Attached (11):** gravity-forms-auditor, gravity-forms-configuration, wordpress-accessibility-checker, wordpress-audit-reporting, wordpress-inspection-preflight, wordpress-launch-readiness, wordpress-remediation-planner, wordpress-request-router, wordpress-site-onboarding, yoast-auditor, yoast-configuration
- **Local (1):** frontend-skill
- **Plugin-Provided (10):** github (4: gh-address-comments, gh-fix-ci, github, yeet), google-drive (5: google-docs, google-drive, google-drive-comments, google-sheets, google-slides), linear (1)

---

## Batch 2-3 Conflict & Reusability Analysis

### Audit Methodology Note

**Skill Count Clarification:** The inventory counts top-level skill *categories* (directories/bundles), not individual entrypoints. Actual implementation entrypoints (individual skill files) are higher; this count reflects reusable skill *units* for consolidation planning. Platform-managed utilities (sourced from `/root/.codex/skills/.system/`) are included for visibility but are not consolidation targets (they're system-level, not repository-owned).

---

### Identified High-Severity Conflicts

#### 1. **wordpress-accessibility-checker** — Identical shared implementation

| Agent | Type | Implementation | Status |
|-------|------|-----------------|--------|
| tour-operator-config-agent | agent-attached | ✅ Identical | SHARED |
| woo-config-agent | agent-attached | ✅ Identical | SHARED |
| wp-config-agent | agent-attached | ✅ Identical | SHARED |

**Status:** ✅ **IDENTICAL SHARED IMPLEMENTATION** - Same Git tree object across all three agents; no domain-specific customisation exists.

**Resolution:** Consolidate to root `skills/wordpress-accessibility-checker/` with single source of truth (no per-domain overlays needed)

---

#### 2. **documents** — Ubiquitous across agents

| Agent | Category | Count |
|-------|----------|-------|
| harvest-analytical-agent | directory-installed | ✅ |
| linear-advisor-agent | local | ✅ |
| prd-agent | local | ✅ |
| prd-factory-planner-agent | local | ✅ |
| tour-operator-config-agent | local | ✅ |
| woo-config-agent | directory-installed | ✅ |
| **Total:** | Multiple types | 6 agents |

**Status:** HIGH REUSABILITY - `documents` appears in 6/11 Batch 2-3 agents; already in root but also replicated locally

**Resolution:** ✅ **MOVE TO ROOT** — Consolidate to `skills/documents/` if not already there; remove local copies

---

#### 3. **pdf, presentations, spreadsheets** — Tied to directory-installed

| Skill | Agents | Count |
|-------|--------|-------|
| pdf | harvest-analytical-agent, linear-advisor-agent, prd-agent, prd-factory-planner-agent, tour-operator-config-agent, woo-config-agent | 6 |
| presentations | harvest-analytical-agent, linear-advisor-agent, prd-agent, prd-factory-planner-agent, tour-operator-config-agent | 5 |
| spreadsheets | harvest-analytical-agent, linear-advisor-agent, prd-agent, prd-factory-planner-agent, tour-operator-config-agent | 5 |

**Status:** HIGH REUSABILITY - These are directory-installed (system tools), already in root, but replicated in agent-local

**Resolution:** ✅ **CONSOLIDATE** — Point agents to root `skills/pdf/`, `skills/presentations/`, `skills/spreadsheets/` instead of local copies

---

#### 4. **Frontend Skill** — UNIVERSAL across ALL agents

| Agent | Found In | Count |
|--------|----------|-------|
| design-partner-agent | local | ✅ |
| harvest-analytical-agent | local | ✅ |
| linear-advisor-agent | local | ✅ |
| pagespeed-agent | agent-attached | ✅ |
| playwright-testing-agent | agent-attached | ✅ |
| prd-agent | local | ✅ |
| prd-factory-planner-agent | local | ✅ |
| proposal-desk-agent | local | ✅ |
| tour-operator-config-agent | local | ✅ |
| woo-config-agent | local | ✅ |
| wp-config-agent | local | ✅ |
| **Total:** | 11/11 agents | ALL |

**Status:** CRITICAL REUSABILITY - `frontend-skill` appears in EVERY agent; needs centralisation

**Resolution:** ✅ **IMMEDIATE ACTION** — Create `skills/frontend-skill/` as canonical root; update all agents to reference it

---

#### 5. **Lightspeed Agency Skills** — Duplication between prd-agent & prd-factory-planner-agent

| Skill | prd-agent | prd-factory-planner-agent | Notes |
|-------|-----------|---------------------------|-------|
| lightspeed-prd-generator | ✅ | ✅ | Identical? |
| lightspeed-prd-task-manager | ✅ | ✅ | Identical? |
| lightspeed-implementation-plan-generator | ✅ | ✅ | Identical? |
| lightspeed-project-researcher | ✅ | ✅ | Identical? |
| lightspeed-github-issue-drafter | ✅ | ✅ | Identical? |
| markdown-content-validator | ✅ | ✅ | Identical? |
| content-file-validator | ✅ | ✅ | Identical? |
| evidence-locker | ✅ | ✅ | Identical? |
| wordpress-plugin-packaging-review | ✅ | ✅ | Identical? |

**Status:** CRITICAL CONFLICT - 23/24 prd-agent skills duplicated in prd-factory-planner-agent (nearly identical agents); only difference is `hermes` in prd-agent

**Resolution:** ⚠️ **CONSOLIDATE AGENTS** — These should share a common skill base; see PR #1196 (feat/prd-combined-agent) for possible consolidation

---

#### 6. **Plugin-Provided Skills** — Inconsistent naming patterns

| Agent | Pattern | Count |
|-------|---------|-------|
| linear-advisor-agent | `github__gh-fix-ci` (double underscore) | 4 |
| tour-operator-config-agent | `github-gh-fix-ci` (single dash) | 4 |
| wp-config-agent | `github__gh-fix-ci` (double underscore) | 4 |

**Status:** MEDIUM CONFLICT - Inconsistent separator naming for plugin skills (double underscore vs single dash)

**Resolution:** ⚠️ **STANDARDISE** — Adopt single naming convention across all agents (recommend: `plugin__provider__skill`)

---

#### 7. **Hermes Design Skills** — Used by multiple design-focused agents

| Agent | Has 'hermes'? | Location |
|-------|---------------|----------|
| design-partner-agent | ✅ Yes | agent-attached |
| pagespeed-agent | ✅ Yes | agent-attached |
| playwright-testing-agent | ✅ Yes | agent-attached |
| prd-agent | ✅ Yes | agent-attached |
| **Total:** | 4 agents | Scattered |

**Status:** MEDIUM REUSABILITY - `hermes` appears in 4/11 Batch 2-3 agents; may indicate shared design/UX workflow

**Resolution:** ⚠️ **AUDIT NEEDED** — Determine if `hermes` is a framework or agent-specific bundle; consider promoting to root if truly shared

---

### Root Skills Classification (Tier 0-3) — Batch 2-3 Agents

#### **Tier 0: Generic Utilities (Keep in root, reference from all agents)**

**Note:** Platform-managed utilities (sourced from `/root/.codex/skills/.system/`) are excluded from consolidation; they are system-level exports, not repository-owned implementations.

| Skill | Reuse | Source | Status | Action |
|-------|-------|--------|--------|--------|
| frontend-skill | 11/11 agents | Repository-owned | ✅ CRITICAL | MOVE to root immediately |
| documents | 6+ agents | Repository-owned (some local copies) | ✅ Stable | CONSOLIDATE to root |
| pdf | 4 agents (repo-owned) | Mix: directory-installed (repo) + local copies | ✅ Stable | CONSOLIDATE repo-owned to root |
| presentations | 4 agents (repo-owned) | Mix: directory-installed (repo) + local copies | ✅ Stable | CONSOLIDATE repo-owned to root |
| spreadsheets | 4 agents (repo-owned) | Mix: directory-installed (repo) + local copies | ✅ Stable | CONSOLIDATE repo-owned to root |
| plugin-creator | 3 agents (local) | Repository-owned | ✅ Stable | CONSOLIDATE to root |
| skill-creator | 3 agents (local) | Repository-owned | ✅ Stable | CONSOLIDATE to root |
| skill-installer | 3 agents (local) | Repository-owned | ✅ Stable | CONSOLIDATE to root |

**Platform-Managed (DO NOT CONSOLIDATE):**

- imagegen, openai-docs, builtins, system (sourced from `/root/.codex/skills/.system/`) — system-level utilities, not consolidation targets

---

#### **Tier 1: Domain-Specific Reusable (2+ agents, consolidate if used by 3+)**

| Skill | Agents | Status | Action |
|-------|--------|--------|--------|
| wordpress-accessibility-checker | 3 agents (tour-ops, woo, wp) | ⚠️ Customised | CONSOLIDATE + create per-domain configs |
| hermes | 4 agents (design-focused) | ⚠️ Mixed | AUDIT—is it shared base or agent-customised? |
| openai-docs | 3 agents (local) | ✅ Stable | CONSOLIDATE to root |
| imagegen | 3 agents (local) | ✅ Stable | CONSOLIDATE to root |

---

#### **Tier 2: Agent-Specific High-Value Skills (1 agent, domain-critical)**

| Skill Family | Agents | Example | Status |
|--------------|--------|---------|--------|
| **linear-*** | linear-advisor-agent | linear-triage-router, linear-decision-logger, etc. (16 skills) | ✅ Agent-specific; keep local |
| **lightspeed-*** | prd-agent, prd-factory-planner-agent | lightspeed-prd-generator, lightspeed-implementation-plan-generator, etc. (23 shared, 1 unique) | ⚠️ **CONFLICT** — duplicate implementations |
| **woocommerce-*** | woo-config-agent | woocommerce-audit-orchestrator, woocommerce-gravity-forms-configuration, etc. (10 skills) | ✅ Agent-specific; keep local |
| **wordpress-*** | wp-config-agent, tour-operator-config-agent | wordpress-launch-readiness, yoast-auditor, gravity-forms-configuration, etc. (11+ skills) | ✅ Agent-specific; some shared (e.g., accessibility-checker) |
| **tour-operator-*** | tour-operator-config-agent | tour-operator-gravity-forms-auditor, tour-operator-yoast-auditor, etc. (7 skills) | ✅ Agent-specific; keep local |
| **proposal-*** | proposal-desk-agent | proposal-intake, rfp-response, evidence-claims-check (6 skills) | ✅ Agent-specific; keep local |

---

#### **Tier 3: Agency/Niche Skills (Candidates for archival or consolidation)**

| Skill | Agent | Status | Action |
|-------|-------|--------|--------|
| evidence-claims-check | proposal-desk-agent | ✅ Proposal-specific | KEEP LOCAL |
| evidence-locker | prd-agent, prd-factory-planner-agent | ✅ Shared (2 agents) | CONSOLIDATE to root or agent-shared folder |
| content-file-validator | prd-agent, prd-factory-planner-agent | ✅ Shared (2 agents) | CONSOLIDATE to root or agent-shared folder |
| markdown-content-validator | prd-agent, prd-factory-planner-agent | ✅ Shared (2 agents) | CONSOLIDATE to root or agent-shared folder |

---

## Root `skills/` Directory vs. Agent Skills: Deep Analysis

### Executive Summary of Current State

**Problem Identified:** The repository has 123 items in `skills/` directory, but agent standardisation is happening independently. This creates:

- **Duplicate Implementations:** Same skills may be defined in root AND in agent folders
- **Version Conflicts:** Root skills may be outdated compared to agent-specific versions
- **Unclear Ownership:** No clear governance on which is "source of truth"
- **Scaling Risk:** Each new agent repeats the wheel instead of reusing centralised utilities

### Root `skills/` Directory Detailed Catalog

**Tier Classification of Existing Root Skills:**

#### **Tier 0: Generic Cross-Cutting Utilities (Should be referenced by ALL agents)**

✅ These ARE portable and should be reused:

| Skill | Status | Used By | Notes |
|-------|--------|---------|-------|
| `documents/` | ✅ Stable | ALL agents | Document generation (Markdown, PDF) |
| `pdfs/` | ✅ Stable | Design agents | PDF manipulation |
| `docx/` | ✅ Stable | Some agents | DOCX generation |
| `slides/` | ✅ Stable | Presentation agents | Slide generation |
| `spreadsheets/` | ✅ Stable | Data agents | Excel/CSV utilities |
| `web-artifacts-builder/` | ✅ Stable | Web agents | Web page builders |
| `linear/` | ✅ Stable | Project agents | Linear integration (plugin) |

**Action:** ✅ **KEEP IN ROOT** — These are truly portable and reusable

---

#### **Tier 1: Domain-Specific But Reusable (Should be moved to root IF used by 2+ agents)**

⚠️ These are reusable but may have outdated versions:

| Skill | Status | Current Root Version | Agent Versions | Conflict Level |
|-------|--------|---------------------|-----------------|--------|
| `figma-use/` | ⚠️ Mixed | 2023-09 | design-partner-agent (2026-07) | HIGH - Agent version newer |
| `figma-code-connect/` | ⚠️ Archived | .zip only | design-partner-agent (2026-07) | HIGH - Root archived |
| `figma-generate-design/` | ⚠️ Mixed | Root + .zip | design-partner-agent (2026-07) | MEDIUM - Dual versions |
| `figma-generate-library/` | ⚠️ Mixed | Root + .zip | design-partner-agent (2026-07) | MEDIUM - Dual versions |
| `audit-design-system/` | ⚠️ Mixed | Root | design-partner-agent (2026-07) | MEDIUM - Agent variant exists |
| `apply-design-system/` | ⚠️ Mixed | Root | design-partner-agent (2026-07) | MEDIUM - Agent variant exists |
| `sync-figma-token/` | ⚠️ Mixed | Root + .zip | design-partner-agent (2026-07) | HIGH - Dual versions |

**Action:** ⚠️ **REQUIRES AUDIT** — Determine which version is current, consolidate into root

---

#### **Tier 2: LightSpeed Agency-Specific Skills (May be obsolete or superseded)**

🔴 These are specialized for agency workflow, NOT portable to agents:

| Skill | Status | Purpose | Agent Compatibility | Action |
|-------|--------|---------|-------------------|--------|
| `lightspeed-ai-readiness/` | ? | Agency AI assessment | Conflict? | AUDIT |
| `lightspeed-prd-generator/` | ? | Agency PRD workflow | vs. prd-factory-planner-agent? | AUDIT |
| `lightspeed-project-researcher/` | ❓ | Agency research | Reusable? | EVALUATE |
| `lightspeed-launch-readiness-auditor/` | ❓ | Launch process | Agency-specific | ARCHIVE |
| 25+ other lightspeed-* skills | ❓ | Various | Mostly agency-specific | EVALUATE |

**Action:** 🔴 **REQUIRES CLASSIFICATION** — Determine if these should be agent-embedded or archived

---

#### **Tier 3: WordPress-Specific Skills (Niche, but portable)**

🟡 These serve WordPress block/theme development. Question: Do agents use these?

| Skill | Status | Current Usage | Portability |
|-------|--------|---------------|------------|
| `wordpress-block-theme-router/` | ✅ | WordPress agents? | HIGH if used |
| `wordpress-template-generator/` | ✅ | WordPress agents? | HIGH if used |
| `wordpress-pattern-generator/` | ✅ | WordPress agents? | HIGH if used |
| `wordpress-plugin-packaging-review/` | ✅ | WordPress audit? | MEDIUM |
| `wp-db-override-reconciliation/` | ✅ | WP-specific ops | LOW (ops tool) |

**Action:** 🟡 **REQUIRES AGENT MAPPING** — Verify which agents use these

---

### Skills Conflicts & Duplications

**Identified Conflicts (Require Resolution):**

1. **Figma Skills Conflict**

   ```
   ROOT: skills/figma-use/ (2023 vintage, archived as .zip)
   AGENT: design-partner-agentskills/figma-integration (2026-07, active)
   ISSUE: Dual implementations, root is outdated
   RESOLUTION: Promote agent version to root; archive old root version
   ```

2. **AI Readiness Skill**

   ```
   ROOT: skills/ai-readiness-assessor/ (generic agency skill)
   AGENT: ai-readiness-estimator-agent (25 skills, specialized)
   ISSUE: Root skill may be superseded by agent-specific version
   RESOLUTION: Audit for overlap; consolidate if possible
   ```

3. **Design System Audit Conflict**

   ```
   ROOT: skills/audit-design-system/ (generic)
   AGENT: design-partner-agentskills/design-system-audit (agent-customised)
   ISSUE: Two versions for same domain
   RESOLUTION: Create shared `audit-design-system` with agent-specific config
   ```

---

## Completed Batch 2-3 Skills Inventory

### design-partner-agent (8 skills)

- **Agent-Attached (1):** hermes
- **Directory-Installed (2):** builtins, system
- **Local (1):** frontend-skill
- **Plugin-Provided (4):** figma, github, google-drive, linear
- **Total:** 8 skills
- **Key Conflicts:** figma-related skills (HIGH priority — root versions outdated vs. agent 2026-07 implementations)

### harvest-analytical-agent (13 skills)

- **Directory-Installed (4):** documents, pdf, presentations, spreadsheets
- **Local (1):** frontend-skill
- **Platform-Managed (5):** imagegen, openai-docs, plugin-creator, skill-creator, skill-installer
- **Plugin-Provided (3):** github, google-drive, linear
- **Total:** 13 skills
- **Key Patterns:** Heavy use of built-in utilities (Tier 0); all directory-installed items are reusable

### linear-advisor-agent (42 skills)

- **Agent-Attached (16):** linear-app-skill-creator, linear-decision-logger, linear-duplicate-management-playbook, linear-gap-analyzer, linear-memory-maintenance, linear-momentum-auditor, linear-project-pulse, linear-skill-intake-onboarding, linear-sub-issue-splitter, linear-the-architect, linear-triage-router, linear-triage-rules-designer, linear-triage-sop-builder, linear-unplanned-work-intake-audit, linear-voice-of-customer, markdown-output-formatter
- **Local (10):** Presentations, Spreadsheets, documents, frontend-skill, imagegen, openai-docs, pdf, plugin-creator, skill-creator, skill-installer
- **Plugin-Provided (16):** github__gh-address-comments, github__gh-fix-ci, github__github, github__yeet, google-drive__google-docs, google-drive__google-drive, google-drive__google-drive-comments, google-drive__google-sheets, google-drive__google-slides, linear__linear, slack__slack, slack__slack-channel-summarization, slack__slack-daily-digest, slack__slack-notification-triage, slack__slack-outgoing-message, slack__slack-reply-drafting
- **Total:** 42 skills (LARGEST agent in Batch 2-3)
- **Key Patterns:** Extensive Linear-specific customization; high reuse of local utilities

### pagespeed-agent (5 skills)

- **Agent-Attached (3):** builtins, frontend-skill, hermes
- **Platform-Managed (1):** system
- **Plugin-Provided (1):** google-drive
- **Total:** 5 skills (smallest agent)
- **Key Patterns:** Minimal skill footprint; focused scope

### playwright-testing-agent (4 skills)

- **Agent-Attached (2):** frontend-skill, hermes
- **Local (2):** platform-managed, plugin-provided
- **Total:** 4 skills
- **Key Patterns:** Very minimal; focused on testing domain

### prd-agent (43 skills)

- **Agent-Attached (25):** content-file-validator, evidence-locker, hermes, lightspeed-acceptance-test-planner, lightspeed-approval-gate-manager, lightspeed-change-request-router, lightspeed-figma-wordpress-technical-brief, lightspeed-github-issue-drafter, lightspeed-implementation-plan-generator, lightspeed-intake-onboarding, lightspeed-launch-task-router, lightspeed-prd-generator, lightspeed-prd-task-manager, lightspeed-prd-task-pack-exporter, lightspeed-prd-task-reviewer, lightspeed-project-intake-router, lightspeed-project-memory-manager, lightspeed-project-researcher, lightspeed-project-status-reporter, lightspeed-qa-findings-router, lightspeed-release-handoff-generator, lightspeed-requirements-traceability-mapper, lightspeed-task-breakdown-planner, markdown-content-validator, wordpress-plugin-packaging-review
- **Local (13):** directory-installed, documents, frontend-skill, imagegen, openai-docs, pdf, platform-managed, plugin-creator, plugin-provided, presentations, skill-creator, skill-installer, spreadsheets
- **Plugin-Provided (5):** figma, github, gmail, google-drive, linear
- **Total:** 43 skills
- **Key Conflicts:** Potential overlap with prd-factory-planner-agent (both PRD-focused)

### prd-factory-planner-agent (39 skills)

- **Agent-Attached (24):** content-file-validator, evidence-locker, lightspeed-acceptance-test-planner, lightspeed-approval-gate-manager, lightspeed-change-request-router, lightspeed-figma-wordpress-technical-brief, lightspeed-github-issue-drafter, lightspeed-implementation-plan-generator, lightspeed-intake-onboarding, lightspeed-launch-task-router, lightspeed-prd-generator, lightspeed-prd-task-manager, lightspeed-prd-task-pack-exporter, lightspeed-prd-task-reviewer, lightspeed-project-intake-router, lightspeed-project-memory-manager, lightspeed-project-researcher, lightspeed-project-status-reporter, lightspeed-qa-findings-router, lightspeed-release-handoff-generator, lightspeed-requirements-traceability-mapper, lightspeed-task-breakdown-planner, markdown-content-validator, wordpress-plugin-packaging-review
- **Local (10):** documents, frontend-skill, imagegen, openai-docs, pdf, plugin-creator, presentations, skill-creator, skill-installer, spreadsheets
- **Plugin-Provided (5):** figma, github, gmail, google-drive, linear
- **Total:** 39 skills
- **Key Conflicts:** Overlap with prd-agent — requires reconciliation (MEDIUM-HIGH severity)

### proposal-desk-agent (16 skills)

- **Agent-Attached (6):** evidence-claims-check, markdown-format-validator, proposal-defaults-onboarding, proposal-intake, rfp-response, wordpress-plugin-packaging-review
- **Local (3):** builtins, frontend-skill, system
- **Plugin-Provided (7):** figma, github, gmail, google-calendar, google-drive, linear, slack
- **Total:** 16 skills
- **Key Patterns:** Moderate skill reuse; balanced between custom and external

### tour-operator-config-agent (30 skills)

- **Agent-Attached (10):** agent-asset-validation-maintainer, pre-launch-readiness-review, site-preflight, tour-operator-agent-instructions, tour-operator-gravity-forms-auditor, tour-operator-gravity-forms-configuration, tour-operator-website, tour-operator-yoast-auditor, tour-operator-yoast-configuration, wordpress-accessibility-checker
- **Local (20):** Presentations, Spreadsheets, documents, frontend-skill, github-gh-address-comments, github-gh-fix-ci, github-github, github-yeet, google-drive-google-docs, google-drive-google-drive, google-drive-google-drive-comments, google-drive-google-sheets, google-drive-google-slides, imagegen, linear-linear, openai-docs, pdf, plugin-creator, skill-creator, skill-installer
- **Total:** 30 skills (high local reuse)
- **Key Patterns:** Heavy reliance on local utilities; potential for consolidation to Tier 0

### woo-config-agent (21 skills)

- **Agent-Attached (10):** woocommerce-audit-orchestrator, woocommerce-gravity-forms-auditor, woocommerce-gravity-forms-configuration, woocommerce-implementation-planner, woocommerce-project-onboarding, woocommerce-remediation-triage, woocommerce-site-discovery, woocommerce-yoast-auditor, woocommerce-yoast-configuration, wordpress-accessibility-checker
- **Directory-Installed (4):** documents, pdf, presentations, spreadsheets
- **Local (1):** frontend-skill
- **Platform-Managed (5):** imagegen, openai-docs, plugin-creator, skill-creator, skill-installer
- **Plugin-Provided (1):** openai-marketplace
- **Total:** 21 skills
- **Key Patterns:** WordPress/WooCommerce specialization; mixed integration patterns

### wp-config-agent (31 skills)

- **Agent-Attached (11):** gravity-forms-auditor, gravity-forms-configuration, wordpress-accessibility-checker, wordpress-audit-reporting, wordpress-inspection-preflight, wordpress-launch-readiness, wordpress-remediation-planner, wordpress-request-router, wordpress-site-onboarding, yoast-auditor, yoast-configuration
- **Local (1):** frontend-skill
- **Platform-Managed (9):** Presentations, Spreadsheets, documents, imagegen, openai-docs, pdf, plugin-creator, skill-creator, skill-installer
- **Plugin-Provided (10):** github__gh-address-comments, github__gh-fix-ci, github__github, github__yeet, google-drive__google-docs, google-drive__google-drive, google-drive__google-drive-comments, google-drive__google-sheets, google-drive__google-slides, linear__linear
- **Total:** 31 skills
- **Key Patterns:** Heavy platform integration; WordPress specialization

---

## Batch 2-3 Analysis Summary

### Total Skills by Category

| Category | Count | Notes |
|----------|-------|-------|
| **Agent-Attached** | 108 | Domain-specific custom skills across all agents |
| **Local** | 62 | Reusable utilities (documents, reports, export-tools, etc.) |
| **Plugin-Provided** | 52 | External service integrations (github, linear, google-drive, figma, etc.) |
| **Directory-Installed** | 10 | Pre-built modules (builtins, system, documents, pdf, presentations, spreadsheets) |
| **Platform-Managed** | 20 | Platform capabilities (imagegen, openai-docs, plugin-creator, skill-creator, skill-installer, etc.) |
| **BATCH 2-3 TOTAL** | **252 skills** | 11 agents, significant consolidation opportunity |

### Batch 1 vs. Batch 2-3 Comparison

| Metric | Batch 1 (5 agents) | Batch 2-3 (11 agents) | Total (16 agents) |
|--------|------------------|----------------------|------------------|
| **Total Skills** | 125 | 252 | 377 |
| **Agent-Attached** | 84 | 108 | 192 |
| **Local** | 16 | 62 | 78 |
| **Plugin-Provided** | 20 | 52 | 72 |
| **Avg Skills/Agent** | 25 | 23 | 23.6 |

### Key Observations

1. **Consistency:** Batch 2-3 agents have similar skill distribution to Batch 1 (avg 26 vs 25 skills)
2. **High Local Reuse:** 65 local utilities across 11 agents suggests strong consolidation potential
3. **Plugin Diversity:** 65 plugin-provided skills; most common integrations: github, linear, google-drive, figma
4. **Large Agents:** linear-advisor-agent (42), prd-factory-planner-agent (39), prd-agent (43), tour-operator-config-agent (30)
5. **Minimal Agents:** pagespeed-agent (5), playwright-testing-agent (4)

---

## Batch 2-3 Conflict Identification

### HIGH SEVERITY CONFLICTS

#### 1. PRD Agent Duplication (prd-agent vs. prd-factory-planner-agent)

```
CONFLICT: Both agents handle PRD creation but with different approaches
ROOT CAUSE: prd-agent (25 skills) and prd-factory-planner-agent (24 skills) 
            appear to have overlapping functionality

AFFECTED AGENTS:
- prd-agent (43 skills, 25 agent-attached)
- prd-factory-planner-agent (39 skills, 24 agent-attached)

SEVERITY: HIGH — Direct functional duplication suggests split responsibilities
          that need clarification

RESOLUTION OPTIONS:
A) Consolidate: Merge both agents' skills into one canonical PRD agent
B) Specialize: Clearly divide responsibilities (e.g., prd-agent = design review,
                prd-factory = generation)
C) Separate: Keep both, but extract common utilities to Tier 0

RECOMMENDATION: Option B — Specialize based on phase of PRD lifecycle
STATUS: Requires investigation and stakeholder alignment
```

#### 2. Figma Skills (design-partner-agent)

```
CONFLICT: Multiple figma implementations across versions
ROOT CAUSE: Root skills/ have 2023-09 versions; design-partner-agent has
            2026-07 active implementations

AFFECTED AGENTS: design-partner-agent (4 plugin-provided figma-related skills)

SKILLS INVOLVED:
- figma-use (root: 2023-09 archived; agent: 2026-07 active)
- figma-code-connect (root: archived .zip; agent: 2026-07 active)
- figma-generate-design (root: mixed; agent: 2026-07)
- figma-generate-library (root: mixed; agent: 2026-07)

SEVERITY: HIGH — Root versions are outdated; agent versions are current

RESOLUTION: Promote agent versions to root; archive old root versions
STATUS: Requires validation that agent implementations are production-ready
```

### MEDIUM SEVERITY CONFLICTS

#### 3. WordPress Configuration Skills (woo-config-agent, wp-config-agent)

```
CONFLICT: Potential overlap between WooCommerce and WordPress config agents
ROOT CAUSE: Both handle WordPress-related configuration

AFFECTED AGENTS:
- woo-config-agent (21 skills, 10 agent-attached)
- wp-config-agent (31 skills, 11 agent-attached)

SEVERITY: MEDIUM — May be intentional specialization (WooCommerce vs. core WP)

RESOLUTION: Clarify division of responsibilities; consolidate shared utilities
STATUS: Requires business logic review
```

#### 4. Local Utilities Consolidation Opportunity

```
OBSERVATION: 65 local utilities across 11 agents (vs. 19 in Batch 1)
PATTERN: Repeated items:
- documents, reports, export-tools, matrices, templates (tour-operator, others)
- frontend-skill (design-partner, harvest-analytical)
- Presentations, Spreadsheets (linear-advisor, harvest-analytical)

SEVERITY: MEDIUM — Consolidation would eliminate duplication

RESOLUTION: Extract common local utilities to Tier 0 root skills
POTENTIAL IMPACT: ~15-20 root skills could be established from local reuse
STATUS: Ready for implementation
```

### LOW SEVERITY CONFLICTS

#### 5. Platform-Managed Integration Patterns

```
OBSERVATION: Platform-managed skills used inconsistently:
- harvest-analytical-agent: 5 platform-managed (imagegen, openai-docs, etc.)
- wp-config-agent: 9 platform-managed
- woo-config-agent: 5 platform-managed

SEVERITY: LOW — Pattern variation is acceptable; likely intentional per domain

RESOLUTION: Document platform-managed integration patterns in governance
STATUS: Informational only
```

---

## Analysis Questions (Batch 2-3 Focus)

### 1. PRD Agent Specialization

**Question:** Are prd-agent and prd-factory-planner-agent serving different phases?

- [ ] **Hypothesis A:** prd-agent = design/review phase; prd-factory = generation/planning
- [ ] **Hypothesis B:** Duplicate implementations (consolidation needed)
- [ ] **Hypothesis C:** Different client needs (keep separate)

**Investigation Required:** Compare agent-attached skills for semantic overlap

### 2. WordPress Configuration Split

**Question:** Is wp-config-agent vs. woo-config-agent intentional specialization?

- [ ] **Hypothesis A:** wp-config = core WordPress; woo-config = WooCommerce-specific
- [ ] **Hypothesis B:** Functional overlap (consolidation candidate)

**Investigation Required:** Analyze skill purposes; clarify business logic

### 3. Local Utilities Consolidation

**Question:** Which of the 65 local utilities should move to Tier 0 root?

**Candidates for Consolidation:**

- **documents** (appears in: linear-advisor, harvest-analytical, tour-operator)
- **reports** (appears in: linear-advisor, tour-operator)
- **export-tools** (appears in: tour-operator)
- **Spreadsheets, Presentations** (appear in: linear-advisor, harvest-analytical)
- **templates, matrices** (appear in: tour-operator)

**Action:** Extract these to root `skills/` directory; update agent references

### 4. Plugin-Provided Integration Standardisation

**Question:** Should plugin-provided skills follow a naming convention?

**Current Pattern:** Some agents use namespaced format (e.g., `github__gh-fix-ci`)

**Recommendation:** Standardize to `{plugin-name}__{skill-name}` across all agents

---

## Analysis Questions

### 1. Skill Reusability Patterns

**Across the 5 completed agents, identify:**

- [ ] **Exact Duplicates:** Skills with identical names (e.g., `sentiment-analyzer` in zendesk-support-agent, analyzer needed elsewhere?)
- [ ] **Semantic Duplicates:** Skills that do the same thing but are named differently (e.g., `content-auditor` vs `website-auditor` — both audit things)
- [ ] **Partial Overlaps:** Skills that share 60-80% functionality but need agent-specific customisation
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

### Tier 2: Agent-Attached Customized Skills (`agents/{agent}skills/` directory)

**Definition:** Skills that are **derived from shared skills** but have agent-specific customisation OR serve a specific agent's unique domain.

**Examples:**

```
agents/zendesk-support-agentskills/
├── response-drafting/       # Customized for support tone/empathy
├── ticket-management/       # Zendesk-specific workflow
└── quality-scoring/         # Support-specific quality metrics

agents/ai-readiness-estimator-agentskills/
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
- C) **Dual-storage** — Shared skill in `skills/` + agent override in `agents/{agent}skills/`
- D) **Agent-local only** — Each agent maintains its own copy; no shared skills

**Recommendation:** Option C. Shared skills live in `skills/` with clear interface; agents can extend/override in `agents/{agent}skills/` directory with custom configuration.

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

**Option A: `agents/{agent}skills/` (Recommended)**

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
    └── response-optimisation/
        ├── SKILL.md
        └── config.yaml
```

**Option B: Nested in provider directories**

```
agents/zendesk-support-agent/claude/
├── agent.md
└── skills/                              # Provider-specific skill implementation
    ├── ticket-management/
    └── response-optimisation/
```

**Recommendation:** Option A (agent-level skills directory). Allows skills to be provider-agnostic at the definition level; provider-specific implementations go in provider directories if needed.

## Detailed Remediation Plan: Shared Skills Restructuring

### Strategy: Three-Phase Consolidation

#### **PHASE A: Root Skills Evaluation** (This Quarter)

**Objective:** Classify every skill in `/skills` directory as Keep/Consolidate/Archive

**Step 1: Categorize All 70 Active Skills**

For each skill in `/skills`, assign to one of these categories:

| Category | Action | Deadline | Owner |
|----------|--------|----------|-------|
| **Tier 0: Generic Utilities** | ✅ KEEP IN ROOT | Week 1 | Agent Audit |
| **Tier 1: Reusable Domain Skills** | ⚠️ AUDIT FOR CONSOLIDATION | Week 2 | Agent Audit |
| **Tier 2: Agency-Specific** | 🔴 EVALUATE FOR ARCHIVAL | Week 3 | Agent Audit |
| **Tier 3: WordPress/Niche** | 🟡 MAP TO AGENTS | Week 2 | Agent Audit |

**Deliverable:** `SKILLS_CATEGORIZATION_REPORT.md` with all 70 skills classified

---

**Step 2: Identify Version Conflicts**

For each skill that appears in BOTH root and agent folders:

```yaml
# Example: CONFLICT_MATRIX.yaml
conflicts:
  figma-use:
    root_version: "2023-09-15"
    agent_version: "design-partner-agent: 2026-07-01"
    status: "ROOT OUTDATED"
    action: "CONSOLIDATE - Promote agent version to root"
    effort: "1-2 hours"
  
  ai-readiness-assessor:
    root_version: "2024-03-20"
    agent_version: "ai-readiness-estimator-agent: 2026-07-24 (25 skills)"
    status: "SUPERSEDED - Agent has comprehensive version"
    action: "CONSOLIDATE - Move to root, retire old version"
    effort: "2-3 hours"
    
  audit-design-system:
    root_version: "2025-11-10"
    agent_version: "design-partner-agent: 2026-07-01 (agent-customised)"
    status: "DUAL VERSIONS - Different purposes"
    action: "REFACTOR - Create shared base + agent override"
    effort: "3-4 hours"
```

**Deliverable:** `CONFLICT_MATRIX.yaml` identifying all dual implementations

---

#### **PHASE B: Agent Skills Inventory** (This Quarter)

**Objective:** Catalog all skills in all 16 agents; identify candidates for root promotion

**Step 1: Complete Agent Skills Audit (Batch 2 & 3)**

Currently we have audited **5 agents**. Need to audit remaining **11 agents**:

```
Batch 2 (5 agents):
  - design-partner-agent         [ ] Extract all skills
  - harvest-analytical-agent     [ ] Extract all skills
  - linear-advisor-agent         [ ] Extract all skills
  - pagespeed-agent              [ ] Extract all skills
  - playwright-testing-agent     [ ] Extract all skills

Batch 3 (6 agents):
  - prd-agent                    [ ] Extract all skills
  - proposal-desk-agent          [ ] Extract all skills
  - tour-operator-config-agent   [ ] Extract all skills
  - woo-config-agent             [ ] Extract all skills
  - wp-config-agent              [ ] Extract all skills
  - [1 more to identify]         [ ] Extract all skills
```

**For each agent, capture:**

- Agent-attached skills (names, descriptions, when added)
- Local skills (reusable or agent-specific?)
- Plugin dependencies
- Version dates (when last updated)

**Deliverable:** Complete `AGENT_SKILLS_INVENTORY.md` for all 16 agents

---

**Step 2: Skills Reuse Analysis**

Create a **Skills Popularity Matrix** showing how many agents use each skill:

```
SKILL NAME                 | USED BY (Agents) | CURRENT LOCATION    | RECOMMENDATION
documents                  | 5 agents         | agent-local (each)  | MOVE TO ROOT
reports                    | 4 agents         | agent-local (each)  | MOVE TO ROOT
export-tools               | 4 agents         | agent-local (each)  | MOVE TO ROOT
gap-analysis               | 3 agents         | agent-local (each)  | MOVE TO ROOT
seo-audit                  | 3 agents         | agent-local (each)  | MOVE TO ROOT
sentiment-analyzer         | 2 agents         | agent-local (each)  | CONSOLIDATE (threshold: 2+)
risk-assessment            | 2 agents         | agent-local (each)  | CONSOLIDATE
response-drafting          | 1 agent          | zendesk-support     | KEEP LOCAL
ticket-management          | 1 agent          | zendesk-support     | KEEP LOCAL
[continue for all shared]  |                  |                     |
```

**Deliverable:** `SKILLS_POPULARITY_MATRIX.csv` showing reuse patterns

---

#### **PHASE C: Consolidation & Restructuring** (Next Quarter)

**Objective:** Physically move, refactor, and consolidate skills according to taxonomy

**Step 1: Create Consolidated Shared Skills**

For each skill identified for promotion to root:

```
ACTION ITEM TEMPLATE:
─────────────────────────────────────────
Title: Consolidate [SKILL] from agents to root
Effort: X hours
Locations Affected: skills/[skill], agents/[agent1]/skills, agents/[agent2]/skills

Steps:
1. Read all versions from:
   - skills/[skill]/SKILL.md
   - agents/[agent1]skills/[skill]/SKILL.md
   - agents/[agent2]skills/[skill]/SKILL.md

2. Compare implementations:
   - Identify common logic vs. agent-specific customisations
   - Document variations

3. Create consolidated version:
   - Write skills/[skill]/SKILL.md (root version)
   - Extract agent-specific config to skills/[skill]/[agent].config.json

4. Update agent references:
   - Change agents/[agent]/AGENT.md to reference root skill
   - Create agents/[agent]skills/[skill].override.md if needed

5. Archive old agent versions:
   - Move to agents/[agent]/.archive/[skill].old/
   - Document migration in commit message

6. Test:
   - Verify agent can still invoke skill
   - Check skill resolution logic
```

**Deliverable:** 10-15 consolidated skills moved to root with proper versioning

---

**Step 2: Archive Outdated Root Skills**

For skills marked "ARCHIVE":

```bash
# Example: Archive unused agency skill
mkdir -p skills/.archive/2026-Q3/
mv skills/lightspeed-ai-readiness/ skills/.archive/2026-Q3/
mv skills/lightspeed-ai-readiness.zip skills/.archive/2026-Q3/

# Update SKILL_REGISTRY.json to mark as archived
# Document in ARCHIVE_LOG.md why and when
```

**Deliverable:** Cleaned root `skills/` directory with archived versions documented

---

**Step 3: Create Agent Override System**

For skills with both shared AND agent-specific versions:

```yaml
# skills/audit-design-system/SKILL.md (shared)
name: audit-design-system
scope: shared
used_by: [design-partner-agent, potentially-others]
agent_overrides:
  design-partner-agent: configs/design-partner-agent.override.yaml
```

```yaml
# skills/audit-design-system/configs/design-partner-agent.override.yaml
agent: design-partner-agent
applies_to_methods:
  - audit_color_contrast
  - audit_typography
custom_checks:
  - figma_integration_validation
  - wordpress_parity_check
```

**Deliverable:** Override system documented in SKILLS_GOVERNANCE.md

---

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
- [ ] **Create `agents/{agent}skills/` directories** for agent-specific skills
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

- Epic #1079: Agent standardisation Phase 2B
- PR #1199: Phase 2A (prd-factory-planner-agent, 12-phase pattern established)
- PR (pending): Phase 2B Batch 1 (5 agents, skills documentation)

## Concrete Implementation Timeline

### IMMEDIATE (This Week)

- [ ] **Task 1:** Create `SKILLS_CATEGORIZATION_REPORT.md`
  - Go through all 70 active skills in `/skills`
  - Classify each as Tier 0/1/2/3
  - Effort: 2-3 hours
  - Owner: Audit Lead

- [ ] **Task 2:** Create `CONFLICT_MATRIX.yaml`
  - Identify all skills appearing in BOTH root AND agent folders
  - Document version dates and current status
  - Effort: 1-2 hours
  - Owner: Audit Lead

- [ ] **Task 3:** Create `AGENT_SKILLS_INVENTORY.md` (Batch 1 COMPLETE, start Batch 2-3)
  - Extract all skills from remaining 11 agents
  - Capture skill names, descriptions, dates, locations
  - Effort: 3-4 hours
  - Owner: Agent Standardization Team

### THIS MONTH (Consolidation Sprint)

- [ ] **Consolidate Tier 1 Skills** (10-15 skills)
  - `documents`, `reports`, `export-tools`, `gap-analysis`, `seo-audit`
  - Create merged versions in root
  - Update all agent references
  - Archive agent-local duplicates
  - Effort: 10-12 hours (1-2 days)

- [ ] **Archive Tier 2/3 Skills**
  - Move unused agency/WordPress skills to `.archive/`
  - Document why and when archived
  - Update SKILL_REGISTRY.json
  - Effort: 2-3 hours

- [ ] **Create Agent Override System**
  - Document in `SKILLS_GOVERNANCE.md`
  - Set up directory structure: `skills/[skill]/configs/[agent].override.yaml`
  - Create first few overrides for conflict skills
  - Effort: 3-4 hours

- [ ] **Update SKILL_REGISTRY.json**
  - Comprehensive registry of all shared + agent-specific skills
  - Include version dates, agent references, status
  - Make it machine-readable (JSON Schema)
  - Effort: 2-3 hours

### NEXT QUARTER (Rollout & Governance)

- [ ] Apply restructured skills to remaining agents (Batch 2-3)
- [ ] Update all 16 agents to reference root skills where applicable
- [ ] Create SKILL_LOOKUP_GUIDE.md (how to find, create, override skills)
- [ ] Implement linting rules to enforce skill governance
- [ ] Update AGENTS.md with skill organisation standards

---

## Success Metrics for Phase 2B Completion

When this audit is complete, you should be able to answer:

- ✅ **Clarity:** I can list all 60+ root skills and their current status (active/archived/conflicting)
- ✅ **Inventory:** I can map which agents use which skills, with version dates
- ✅ **Ownership:** Each skill has a clear "source of truth" location (root shared OR agent-specific)
- ✅ **Conflicts:** All dual implementations are documented with a remediation plan
- ✅ **Governance:** Clear rules exist for when a skill should be shared vs. agent-local
- ✅ **Scalability:** New agents can easily discover and reuse existing skills without duplication

---

## Related Issues & PRs

- **Epic:** #1079 (Agent Standardization Phase 2B)
- **Current PR:** #1198 (chore/agents-finalize-incomplete-agents)
- **Related PRs:** #1199 (Phase 2A complete), #1196 (PRD agent consolidated)
- **Audit Branch:** `feat/agents-phase-2b-skills-audit`
- **Implementation Branches:** `feat/phase-2b-agent-skills-batch-1` (active), `feat/phase-2b-agent-skills-batch-2` (pending)

---

## Next Steps

1. **Run deep audit** to populate skills inventory matrix
2. **Stakeholder alignment** on architectural decisions (Decisions 1-4)
3. **Create `skills/` directory** structure and SKILL_REGISTRY.yaml
4. **Refactor Batch 1 agents** to use shared skills where applicable
5. **Apply pattern to remaining 11 agents** in Batch 2 & 3

---

---

<<<<<<<< HEAD:projects/active/phase-2b-skills-audit/PHASE-2B-SKILLS-AUDIT.md

## Phase B: Planning & Architecture (Next Steps)

Phase B (Weeks 3-4) focuses on translating audit findings into an implementation roadmap. Three core deliverables:

### Phase B Deliverable 1: Skill Dependency Map

**Timeline:** Week 3 (3-4 hours)

**Scope:**

- Create dependency matrix showing skill usage across 16 agents
- Identify Tier 1 consolidation candidates (used by 2+ agents)
- Visualize override patterns and shared skill usage

**Key Inputs (from Phase A):**

- 65 local utilities identified for consolidation
- Plugin-provided patterns across agents
- Agent-specific skill customizations documented

**Key Outputs:**

- Skill usage graph (agent → skill → tier mapping)
- Consolidation candidate list (15-20 skills)
- Override pattern documentation

### Phase B Deliverable 2: Architecture Plan

**Timeline:** Week 3-4 (3-4 hours)

**Scope:**

- Define override system interface (how agents reference vs customize skills)
- Document agent-local vs shared skill contract
- Establish governance rules and enforcement mechanisms

**Key Inputs:**

- Conflict resolution matrix from Phase A
- Skill categorization (Tier 0-3)
- Agent specialization patterns

**Key Outputs:**

- Override system specification
- Skill governance rules document
- CI/CD validation requirements

### Phase B Deliverable 3: Implementation Roadmap

**Timeline:** Week 4 (4-6 hours)

**Scope:**

- Create per-phase consolidation tasks (Phase C rollout)
- Estimate effort per consolidation candidate
- Plan risk mitigation and testing strategy

**Key Inputs:**

- High/medium-severity conflicts identified
- Consolidation candidate list
- Agent dependency patterns

**Key Outputs:**

- Phase C task breakdown (per skill, per agent)
- Effort estimates (Tier 0, Tier 1, Tier 2-3)
- Risk and testing plan

---

**Audit Status:** Phase A Complete ✅  
**Branch:** `audit/phase-2b-batch-2-3-skills`  
**PR:** #1283  
**Last Updated:** 2026-07-24

### Summary: Batch 2-3 Audit Results

### Key Findings

**Total Skills Audited (Batch 2-3):** 258 skills across 11 agents

| Metric | Batch 1 | Batch 2-3 | Total |
|--------|---------|-----------|-------|
| Agents | 5 | 11 | 16 |
| Total Skills | 123 | 258 | 381 |
| Avg Skills/Agent | 24.6 | 23.5 | 23.8 |
| Tier 0 Candidates (Utility) | 7 | 8 | 15 |
| Tier 1 Conflicts | 3 | 7 | 10 |
| Tier 2 Agent-Specific | N/A | 40+ | 40+ |
| Tier 3 Agency-Specific | N/A | 15+ | 15+ |

### Critical Issues Identified (BATCH 2-3)

**🔴 CRITICAL — Requires Immediate Action:**

1. **frontend-skill** is replicated across ALL 11 Batch 2-3 agents — needs root consolidation
2. **prd-agent ↔ prd-factory-planner-agent duplication** — 23/24 shared skills (see PR #1196 for consolidation)
3. **Plugin-provided skills naming inconsistency** — double underscore vs single dash (e.g., `github__` vs `github-`)

**🟠 HIGH — Consolidation Recommended:**

1. **Tier 0 utilities** (documents, pdf, presentations, spreadsheets, plugin-creator, skill-creator) — appears across 3-6 agents in multiple locations
2. **wordpress-accessibility-checker** — used by 3 agents (tour-ops, woo, wp) with likely customisations per domain
3. **hermes** — appears in 4 agents (design, pagespeed, playwright, prd); needs clarity on whether it's a shared base or framework

**⚠️ MEDIUM — Audit Needed:**

1. **Plugin-provided skills** — Linear-advisor-agent declares 16 plugin skills; need to verify if all are used or if some are inherited
2. **Local vs. agent-attached categorisation** — inconsistent; some agents use "local" for plugin skills, others use "agent-attached"

---

### Reusability Opportunities (Ranked by Impact)

#### HIGH IMPACT — Move to Root Immediately

```
EFFORT: 4-6 hours
IMPACT: Reduce duplication across 6-11 agents (repository-owned only)

☐ frontend-skill             (11/11 agents) → skills/frontend-skill/ [repository-owned]
☐ documents                  (6+ agents)    → skills/documents/ [if not already; consolidate local copies]
☐ pdf (repo-owned)           (4 agents)     → skills/pdf/ [consolidate repo-owned copies; exclude platform-managed]
☐ presentations (repo-owned) (4 agents)     → skills/presentations/ [consolidate repo-owned copies; exclude platform-managed]
☐ spreadsheets (repo-owned)  (4 agents)     → skills/spreadsheets/ [consolidate repo-owned copies; exclude platform-managed]
```

**DO NOT CONSOLIDATE (platform-managed):**

- imagegen, openai-docs (sourced from `/root/.codex/skills/.system/`) — these are system-level utilities

#### MEDIUM IMPACT — Consolidate (No Per-Domain Configs Needed)

```
EFFORT: 4-6 hours
IMPACT: Single source of truth for shared implementations

☐ wordpress-accessibility-checker (3 agents: wp-config, woo-config, tour-operator)  
  → skills/wordpress-accessibility-checker/ [IDENTICAL implementation; no variants]

☐ plugin-creator               (3 agents)     → skills/plugin-creator/ [consolidate]
☐ skill-creator                (3 agents)     → skills/skill-creator/ [consolidate]
☐ skill-installer              (3 agents)     → skills/skill-installer/ [consolidate]
```

#### LOWER PRIORITY — Resolve Design Skills Framework

```
EFFORT: 2-4 hours
IMPACT: Clarify hermes framework; reduce design-agent drift

☐ hermes (4 agents) — Audit implementations in:
   - design-partner-agent
   - pagespeed-agent
   - playwright-testing-agent
   - prd-agent
   → Determine: shared base + customisations OR agent-specific implementations?
   → If shared: Create skills/hermes/ with per-agent configs
   → If agent-specific: Keep local, but document why they can't be consolidated
```

---

### Critical Action Items (Next Steps)

#### PHASE B-1: Standardisation (This Week)

- [ ] **Task B1.1:** Adopt consistent plugin-skill naming convention
  - Standardise on `{provider}__{skill}` or `{provider}-{skill}` across all agents
  - Effort: 1-2 hours (simple find-replace + validation)
  
- [ ] **Task B1.2:** Move frontend-skill to root
  - Create canonical `skills/frontend-skill/SKILL.md`
  - Update all 11 agents to reference root version
  - Archive local copies
  - Effort: 2-3 hours

- [ ] **Task B1.3:** Consolidate Tier 0 utilities
  - Verify documents, pdf, presentations, spreadsheets exist in root `skills/`
  - Update agent references (local → root)
  - Remove duplicate definitions
  - Effort: 3-4 hours

#### PHASE B-2: Conflict Resolution (Next Week)

- [ ] **Task B2.1:** Resolve prd-agent ↔ prd-factory-planner-agent duplication
  - Audit implementation of shared 23 skills
  - Consolidate to shared base (either in root or shared agent-specific folder)
  - Link to PR #1196 (feat/prd-combined-agent)
  - Effort: 3-4 hours

- [ ] **Task B2.2:** Create wordpress-accessibility-checker with per-domain configs
  - Extract implementations from wp-config, woo-config, tour-operator agents
  - Create shared base in `skills/wordpress-accessibility-checker/`
  - Define config overlays for tour-ops, woo, wp domains
  - Effort: 3-4 hours

- [ ] **Task B2.3:** Audit and clarify hermes framework
  - Read SKILL.md files in all 4 agents using hermes
  - Determine if implementations are identical or agent-customised
  - Create consolidated or framework-based structure
  - Effort: 2-3 hours

#### PHASE B-3: Governance & Documentation (Following Week)

- [ ] **Task B3.1:** Update SKILL_REGISTRY.yaml for Batch 2-3
  - Add all Batch 2-3 skills with version dates, reuse counts
  - Mark conflicts and consolidation status
  - Effort: 2-3 hours

- [ ] **Task B3.2:** Create AGENT_SKILLS_CONSOLIDATION_PLAN.md
  - Document all consolidation actions taken in B1 & B2
  - Create migration checklist for each agent
  - Effort: 2-3 hours

- [ ] **Task B3.3:** Update AGENTS.md with consolidated skill references
  - Ensure all agents reference consolidated skills correctly
  - Validate that agent functionality is unchanged
  - Effort: 2-3 hours

---

### Success Criteria for Batch 2-3 Completion

- ✅ **Clarity:** Every Batch 2-3 agent's skills location is documented (root/local/agent-attached)
- ✅ **Consolidation:** Tier 0 utilities moved to root; Tier 1 conflicts resolved
- ✅ **Standardisation:** Plugin-provided skills follow consistent naming convention
- ✅ **Governance:** SKILL_REGISTRY.yaml includes all Batch 2-3 skills
- ✅ **Documentation:** Consolidation plan complete with migration checklist
- ✅ **Validation:** All 11 agents functional after consolidation; CI tests passing

---

## Master Audit Summary (All Batches)

| Metric | Batch 1 | Batch 2-3 | Total |
|--------|---------|-----------|-------|
| **Agents** | 5 | 11 | **16** |
| **Total Skills** | 123 | 258 | **381** |
| **Tier 0 Candidates** | 7 | 8 | **15** |
| **Critical Conflicts** | 3 | 3 | **6** |
| **High Conflicts** | N/A | 7 | **7+** |
| **Agent-Specific Skills** | N/A | 40+ | **40+** |
| **% Skills to Consolidate** | ~20% | ~25% | ~22% |

**Audit Status:** ✅ **BATCH 2-3 COMPLETE** — Phase B inventory and conflict identification complete  
**Branch:** `audit/skills-standards-batch-2-3`  
**Last Updated:** 2026-07-24  
**Next Phase:** Phase B-1 Standardisation (recommended start date: 2026-07-25)  
**Estimated Total Effort:** 20-30 hours (phases B-1 through B-3)

---

*Audit generated by the LightSpeedWP Automation Team*
>>>>>>>> origin/develop:.github/projects/active/agent-skills-standards-comprehensive/PHASE-2B-SKILLS-AUDIT.md
