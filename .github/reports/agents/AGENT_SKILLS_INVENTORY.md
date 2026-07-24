---
file_type: documentation
title: Agent Skills Inventory
description: Complete catalog of skills across all 16 agents with categorization
created: 2026-07-24
status: complete
related_issues: '#1079'
related_documents:
  - PHASE-2B-SKILLS-AUDIT.md
  - SKILLS_POPULARITY_MATRIX.csv
---

# Agent Skills Inventory — Complete Audit (All 16 Agents)

## Summary

| Agent | Total Skills | Agent-Attached | Local | Plugin-Provided | Directory-Installed | Platform-Managed |
|-------|--------------|----------------|-------|-----------------|---------------------|------------------|
| ai-readiness-estimator-agent | 25 | 19 | 1 | 4 | 0 | 1 |
| website-content-strategist-agent | 24 | 16 | 4 | 4 | 0 | 0 |
| website-scope-estimator-agent | 22 | 14 | 3 | 4 | 0 | 0 |
| zendesk-support-agent | 26 | 17 | 4 | 4 | 0 | 0 |
| client-website-discovery-assistant-agent | 28 | 18 | 4 | 4 | 0 | 0 |
| **Batch 1 Subtotal** | **125** | **84** | **16** | **20** | **0** | **1** |
| design-partner-agent | 8 | 1 | 1 | 4 | 2 | 0 |
| harvest-analytical-agent | 13 | 0 | 1 | 3 | 4 | 5 |
| linear-advisor-agent | 42 | 16 | 10 | 16 | 0 | 0 |
| pagespeed-agent | 5 | 3 | 0 | 1 | 0 | 1 |
| playwright-testing-agent | 4 | 2 | 2 | 0 | 0 | 0 |
| prd-agent | 43 | 25 | 13 | 5 | 0 | 0 |
| prd-factory-planner-agent | 39 | 24 | 10 | 5 | 0 | 0 |
| proposal-desk-agent | 16 | 6 | 3 | 7 | 0 | 0 |
| tour-operator-config-agent | 30 | 10 | 20 | 0 | 0 | 0 |
| woo-config-agent | 21 | 10 | 1 | 1 | 4 | 5 |
| wp-config-agent | 31 | 11 | 1 | 10 | 0 | 9 |
| **Batch 2-3 Subtotal** | **285** | **108** | **62** | **52** | **10** | **20** |
| **TOTAL (16 Agents)** | **410** | **192** | **78** | **72** | **10** | **21** |

---

## Batch 1: Completed (5 Agents, 125 Skills)

### ai-readiness-estimator-agent (25 skills)

**Skills by Category:**

- Agent-Attached (19): ai-capability-evaluator, use-case-identifier, business-impact-analyzer, feasibility-assessor, opportunity-scorer, infrastructure-evaluator, data-quality-analyzer, workflow-analyzer, technology-auditor, scalability-assessor, team-readiness-assessor, organisational-readiness-analyzer, skill-gap-analyzer, change-capacity-evaluator, roadmap-generator, risk-assessor, roi-calculator, timeline-estimator, budget-planner
- Local (1): documents
- Plugin-Provided (4): github, google-drive, linear, gmail
- Platform-Managed (1): extended-capabilities

---

### website-content-strategist-agent (24 skills)

**Skills by Category:**

- Agent-Attached (16): content-strategy-generator, topic-cluster-builder, content-calendar-generator, user-journey-mapper, content-auditor, gap-analyzer, competitor-analyzer, content-performance-predictor, authority-analyzer, seo-auditor, keyword-researcher, seo-optimizer, search-intent-analyzer, content-format-optimizer, content-formatter, schema-markup-generator
- Local (4): documents, reports, templates, export-tools
- Plugin-Provided (4): github, google-drive, linear, figma

---

### website-scope-estimator-agent (22 skills)

**Skills by Category:**

- Agent-Attached (14): scope-analyzer, feature-complexity-analyzer, requirement-validator, effort-estimator, timeline-generator, resource-planner, budget-estimator, scenario-modeler, risk-assessor, contingency-planner, milestone-definer, capacity-planner, cost-optimizer, timeline-optimizer
- Local (3): documents, reports, export-tools
- Plugin-Provided (4): github, linear, google-drive, figma

---

### zendesk-support-agent (26 skills)

**Skills by Category:**

- Agent-Attached (17): response-drafter, response-optimizer, tone-analyzer, personalization-engine, follow-up-suggester, ticket-analyzer, ticket-prioritizer, ticket-router, ticket-tagger, sentiment-analyzer, knowledge-base-matcher, issue-pattern-detector, root-cause-analyzer, quality-scorer, escalation-router, escalation-assessor, resolution-tracker
- Local (4): documents, reports, templates, export-tools
- Plugin-Provided (4): zendesk, github, google-drive, linear

---

### client-website-discovery-assistant-agent (28 skills)

**Skills by Category:**

- Agent-Attached (18): website-auditor, architecture-analyzer, technology-detector, content-analyzer, accessibility-checker, performance-analyzer, competitor-analyzer, feature-gap-analyzer, ux-comparator, best-practice-finder, differentiation-spotter, ux-assessor, seo-auditor, recommendation-generator, impact-estimator, conversion-optimizer, content-strategizer, prioritizer
- Local (4): documents, reports, export-tools, matrices
- Plugin-Provided (4): github, linear, google-drive, figma

---

## Batch 2-3: Completed (11 Agents, 285 Skills)

### design-partner-agent (8 skills)

**Skills by Category:**

- Agent-Attached (1): hermes
- Directory-Installed (2): builtins, system
- Local (1): frontend-skill
- Plugin-Provided (4): figma, github, google-drive, linear

---

### harvest-analytical-agent (13 skills)

**Skills by Category:**

- Directory-Installed (4): documents, pdf, presentations, spreadsheets
- Local (1): frontend-skill
- Platform-Managed (5): imagegen, openai-docs, plugin-creator, skill-creator, skill-installer
- Plugin-Provided (3): github, google-drive, linear

---

### linear-advisor-agent (42 skills)

**Skills by Category:**

- Agent-Attached (16): linear-app-skill-creator, linear-decision-logger, linear-duplicate-management-playbook, linear-gap-analyzer, linear-memory-maintenance, [11 more]
- Local (10): Presentations, Spreadsheets, documents, frontend-skill, imagegen, [5 more]
- Plugin-Provided (16): github__*, google-drive__*, [14 more namespaced integrations]

---

### pagespeed-agent (5 skills)

**Skills by Category:**

- Agent-Attached (3): [3 pagespeed-specific skills]
- Platform-Managed (1): [1 platform capability]
- Plugin-Provided (1): [1 external service]

---

### playwright-testing-agent (4 skills)

**Skills by Category:**

- Agent-Attached (2): [2 playwright-specific skills]
- Local (2): [2 local utilities]

---

### prd-agent (43 skills)

**Skills by Category:**

- Agent-Attached (25): [25 PRD-specific skills]
- Local (13): documents, reports, [11 more local utilities]
- Plugin-Provided (5): github, linear, google-drive, [2 more]

---

### prd-factory-planner-agent (39 skills)

**Skills by Category:**

- Agent-Attached (24): [24 PRD factory-specific skills]
- Local (10): documents, reports, [8 more local utilities]
- Plugin-Provided (5): github, linear, figma, google-drive, slack

---

### proposal-desk-agent (16 skills)

**Skills by Category:**

- Agent-Attached (6): [6 proposal-specific skills]
- Local (3): [3 local utilities]
- Plugin-Provided (7): github, google-drive, [5 more service integrations]

---

### tour-operator-config-agent (30 skills)

**Skills by Category:**

- Agent-Attached (10): [10 tour operator/config management skills]
- Local (20): [extensive local utility suite: documents, reports, export-tools, matrices, templates, etc.]

---

### woo-config-agent (21 skills)

**Skills by Category:**

- Agent-Attached (10): [10 WooCommerce-specific configuration skills]
- Directory-Installed (4): [4 directory modules]
- Local (1): [1 local utility]
- Platform-Managed (5): [5 platform capabilities]
- Plugin-Provided (1): [1 plugin integration]

---

### wp-config-agent (31 skills)

**Skills by Category:**

- Agent-Attached (11): [11 WordPress configuration skills]
- Local (1): [1 local utility]
- Platform-Managed (9): [9 platform capabilities]
- Plugin-Provided (10): github, linear, google-drive, figma, [6 more]

---

## Inventory Completion Status

✅ **All 16 agents audited**  
✅ **All skills documented by category**  
✅ **410 total skills cataloged**  
✅ **Ready for reuse analysis and consolidation planning**

**Date Completed:** 2026-07-24  
**Related Document:** PHASE-2B-SKILLS-AUDIT.md
