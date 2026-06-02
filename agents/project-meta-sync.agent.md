---
title: Project Meta Sync
description: Syncs GitHub Project board meta fields (Status, Priority, Type) from
  issue/PR labels and branch names, automating project management and triage workflows.
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
  guardrails: Only update fields based on canonical label mappings. Notify maintainers
    on mapping conflicts. Support rollback and audit logging. Never remove items from
    project without warning.
---
