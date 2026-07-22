---
title: Project Meta Sync
description: Deprecated compatibility spec for the legacy project meta sync entrypoint.
  The active automation now lives in the project-meta-sync and metadata-governance
  workflows plus their helper scripts.
target: github-copilot
handoffs:
- label: Update Project Fields
  agent: project-updater
  prompt: Now apply the field updates to the GitHub Project board based on the analysis
    above.
  send: false
version: v1.1
last_updated: '2026-06-01'
author: LightSpeed
maintainer: Ash Shaw
file_type: agent
category: automation
status: active
visibility: public
tags:
- lightspeed
- project-management
- automation
- github
- labels
language: en
owners:
- lightspeedwp/maintainers
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
- filesystem
- network
- github:repo
- github:issues
metadata:
  guardrails: Compatibility only. Do not treat this spec as the active contract;
    use the workflow and helper scripts referenced above. The live contract keeps
    issue labels, issue types, and project fields in sync via project-meta sync.
---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
