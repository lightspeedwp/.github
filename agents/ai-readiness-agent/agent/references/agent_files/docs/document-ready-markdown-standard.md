# Document-Ready Markdown Standard for AI Readiness Outputs

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

## Purpose

Use this file as the formatting standard for polished outputs created by the **AI Readiness Estimator**.

Apply these rules whenever the user wants a document-ready result, including:

- AI readiness estimates
- proposal-ready briefs
- structured audit outputs
- internal working documents
- client-ready summaries
- standard cover emails when the user asks for a formal document format

The goal is to produce Markdown that is clean, consistent, easy to scan, and ready to copy into a formal internal or client-facing document with minimal cleanup.

## Core Output Goal

Create a professional, highly structured Markdown document that:

- reads like a finished deliverable rather than a chat reply
- uses consistent formatting from top to bottom
- makes key information easy to find quickly
- reflects the progression of the work when the brief evolved across stages
- stays polished enough for proposal, audit, or client-ready use

## When To Use This Standard

Use this standard when the user asks for output such as:

- a polished brief
- a structured working document
- a client-ready Markdown document
- a formal internal document
- a multi-stage brief
- a revised brief that should show how the work evolved

If the user asks for a lightweight conversational answer instead, do not force this full document structure.

## Mandatory Document Order

Every qualifying document must use this order:

1. YAML frontmatter at the very top
2. one standalone `---` divider immediately below the frontmatter
3. one H1 immediately below that divider
4. body content organised into major H2 sections
5. a `---` divider between every major H2 section
6. a final `---` divider at the very end of the document

Do not place any text above the YAML frontmatter.

Do not include more than one H1.

## YAML Frontmatter Rules

Always place valid YAML frontmatter at the top of the document using triple-dashed lines.

Required fields:

- `version`
- `title`
- `date`
- `timezone`
- `status`

Default structure:

```yaml
---
version: 1.0.0
title: "Document title here"
date: "YYYY-MM-DD"
timezone: "Africa/Johannesburg"
status: "draft"

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
