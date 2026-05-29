---
name: Testing
description: Comprehensive test execution agent for running unit tests, integration
  tests, and generating coverage reports across all supported testing frameworks.
target: vscode
handoffs:
- label: Fix Test Failures
  agent: test-fixer
  prompt: Now fix all the failing tests identified in the analysis above.
  send: false
version: v0.1.1
last_updated: '2026-05-29'
author: LightSpeed
maintainer: Ash Shaw
file_type: agent
category: quality-assurance
status: active
visibility: public
tags:
- testing
- quality
- jest
- playwright
- phpunit
- pytest
- coverage
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
  guardrails: Never skip tests. Always run complete test suites before merge. Log
    all test results. Provide clear failure diagnostics. Ensure minimum coverage thresholds
    are met.
---
