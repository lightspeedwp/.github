# LightSpeed AI Service Templates Overview

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

This folder contains a structured collection of reusable Markdown templates for LightSpeed’s AI service packages. These files are organised by category to support assessments, chatbot planning, governance work, implementation discovery, QA, approvals, and delivery handover.

## Directory Structure

```text
service-templates/
├── shared/
├── readiness/
├── chatbot/
└── implementation/
```

## What This Adds To The Current Agent

The current file library already covers package routing, commercial rules, memory schemas, skill routing, and estimate logic.

This template library adds the reusable delivery artefacts that were mostly missing from the current setup:

- shared project registers and logs
- chatbot discovery and governance templates
- readiness audit and roadmap templates
- implementation, security, privacy, integration, and data-mapping templates

## How To Use This Library

- Start here when a task needs a reusable workshop, assessment, governance, implementation, QA, or handover document.
- Choose the narrowest template that matches the requested deliverable.
- Use the current package files, commercial rules, and approved sources to populate the templates.
- Do not invent values for placeholders. Replace them only with confirmed project information or clearly labelled assumptions.
- Use the shared registers to keep evidence, risks, decisions, commercial assumptions, and source approval aligned across the engagement.

## Folder Summary

### `shared/`

Reusable cross-project registers and logs:

- source-of-truth register
- claim register
- commercial assumptions sheet
- risk and review log
- decision log

### `readiness/`

Reusable readiness assessment outputs:

- AI readiness audit checklist
- AI readiness roadmap

### `chatbot/`

Reusable chatbot planning and governance outputs:

- chatbot discovery questionnaire
- chatbot recommendation memo
- source suitability checklist
- boundaries and escalation worksheet
- launch readiness checklist

### `implementation/`

Reusable delivery and solution-planning outputs:

- security and privacy review checklist
- data and source mapping sheet
- integration requirements template
- detailed solution discovery document

## Selection Rule

Use the template that is closest to the user’s requested outcome. If the task is still package scoping or estimate routing, use the package and commercial files first. Use these service templates when the user needs a reusable document, register, checklist, worksheet, memo, or implementation artefact

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
