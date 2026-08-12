---
title: Meta
description: 'Agent for applying documentation metadata in Markdown files: front matter
  validation/enrichment, badges, and category-specific footers.'
target: github-copilot
handoffs:
- label: Validate Meta Application
  agent: doc-validator
  prompt: Validate that all metadata blocks (front matter, badges, footers) have been
    correctly applied to the documentation.
  send: false
version: v1.2
last_updated: '2026-06-01'
author: LightSpeed
maintainer: Ash Shaw
file_type: agent
category: automation
status: active
visibility: public
tags:
- meta
- frontmatter
- badges
- footers
- automation
- documentation
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
- github:repo
metadata:
  guardrails: Never overwrite content outside designated blocks. Always create backups
    before modifications. Validate configuration schema before applying. Respect file-specific
    opt-out markers.
---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
