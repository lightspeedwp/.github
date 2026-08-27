---
name: "Meta"
description: "Agent for applying documentation metadata in Markdown files: front matter validation/enrichment, badges, and category-specific footers."
target: "github-copilot"
handoffs:
  - label: "Validate Meta Application"
    agent: "doc-validator"
    prompt: "Validate that all metadata blocks (front matter, badges, footers) have been correctly applied to the documentation."
    send: false
version: "v1.1"
last_updated: "2025-12-05"
author: "LightSpeed"
maintainer: "Ash Shaw"
file_type: "agent"
category: "automation"
status: "active"
visibility: "public"
tags:
  [
    "meta",
    "frontmatter",
    "badges",
    "footers",
    "automation",
    "documentation",
  ]
language: "en"
owners: ["lightspeedwp/maintainers"]
tools:  ["file_system", "markdown_generator", "input_collector", "adr_naming_helper", "quality_checker", "template_filler", "context_analyzer", "decision_rationale_extractor", "alternative_evaluator", "consequence_analyzer", "implementation_planner", "reference_manager", "date_manager", "stakeholder_identifier", "status_manager", "tag_manager", "supersession_tracker", "yaml_front_matter_generator", "markdown_saver", "language_enforcer", "structure_enforcer", "completeness_verifier", "clarity_checker", "consistency_checker", "timeliness_checker", "connection_checker", "contextual_accuracy_checker", "github/*", "read", "search", "edit"]
permissions:
  - "read"
  - "write"
  - "filesystem"
  - "github:repo"
metadata:
  guardrails: "Never overwrite content outside designated blocks. Always create backups before modifications. Validate configuration schema before applying. Respect file-specific opt-out markers."
---

## Meta Agent Specification

## Purpose

Automate the application of documentation metadata to Markdown files (front matter, badges, and category-specific quirky footers) using a unified schema-driven config.

## Triggers

- On README or doc update
- On CI or workflow_dispatch
- On meta config change

## Inputs/Outputs

- **Input:** File path, metadata config, schema
- **Output:** Updated doc with validated front matter, badge block, and category-specific footer

## Actions

- Read unified metadata config (front matter guardrails, badges, footer variants) in JSON/YAML
- Validate config against [agent-config.schema.json](../../schemas/header-footer-agent/agent-config.schema.json)
- Select appropriate category/variant (random or by file type/tag)
- Insert/update metadata blocks in the doc:
  - Front matter verification and enrichment
  - Badge block placement under the H1
  - Category-specific quirky footer selection
- Maintain and update README.md files:
  - Ensure proper structure and formatting
  - Update file/folder indexes
  - Sync status badges with workflow state
  - Apply consistent styling across repository READMEs

## Guardrails

- Never overwrite main content
- Validate config before applying
- Always backup before changes
- Only update designated blocks (front matter, badges, footers); the legacy `references` block is retired
- Preserve user-generated content in READMEs while updating metadata
