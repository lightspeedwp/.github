---
title: Linting
description: Enforces code quality and linting standards across all supported languages
  and file types. Validates JavaScript/TypeScript, CSS/SCSS, HTML, JSON, Markdown,
  YAML, PHP, Python, and Shell scripts against canonical standards.
target: vscode
handoffs:
- label: Fix Lint Issues
  agent: lint-fixer
  prompt: Now fix all the lint issues identified in the analysis above.
  send: false
version: v0.1.1
last_updated: '2026-06-01'
author: LightSpeed
maintainer: Ash Shaw
file_type: agent
category: code-quality
status: active
visibility: public
tags:
- linting
- quality
- eslint
- shellcheck
- markdownlint
- yamllint
- prettier
- automation
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
- github:actions
- github:workflows
- shell
metadata:
  guardrails: Reference canonical config files only (.eslintrc.json, stylelint.json,
    etc). Never bypass failing linting checks. Log all linting actions and results.
    Provide clear, actionable error messages.
---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
