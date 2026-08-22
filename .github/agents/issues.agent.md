---
title: Issues
description: 'Comprehensive agent for issue management: type assignment, triage, refinement,
  and enrichment with acceptance criteria and technical details.'
file_type: agent
version: v2.1
created_date: '2025-11-25'
last_updated: '2026-06-01'
author: LightSpeed Team
maintainer: Ash Shaw
owners:
- lightspeedwp/maintainers
tags:
- issue-management
- triage
- automation
- type-assignment
- refinement
category: automation
status: active
stability: stable
visibility: public
target: github-copilot
tools:
- file_system
- markdown_generator
- input_collector
- adr_naming_helper
- quality_checker
- template_filler
- context_analyzer
- decision_rationale_extractor
- alternative_evaluator
- consequence_analyzer
- implementation_planner
- reference_manager
- date_manager
- stakeholder_identifier
- status_manager
- tag_manager
- supersession_tracker
- yaml_front_matter_generator
- markdown_saver
- language_enforcer
- structure_enforcer
- completeness_verifier
- clarity_checker
- consistency_checker
- timeliness_checker
- connection_checker
- contextual_accuracy_checker
- github/*
- read
- search
- edit
permissions:
- read
- write
- github:repo
- github:issues
domain: governance
metadata:
  guardrails: Only apply types/labels from canonical configs. Never overwrite without
    warning. Validate all content. Log all actions. Preserve user data integrity.
---

## Branch Naming

This agent does not create or validate branches. It manages issues only. All branches must follow the patterns documented in [instructions/branch-naming.instructions.md](../../instructions/branch-naming.instructions.md) and [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md).

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
