# Entity-Relationship Diagrams

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

Use this reference for **ER diagrams** — data models showing entities (tables), their attributes (columns), and the relationships (foreign keys, cardinalities) between them.

Typical subjects: database schemas, domain models, API resource graphs, data-lake structures, any diagram where the important thing is "these entities relate to each other in these ways, with these fields."

If the subject is a static architecture of services (not data) → architecture flowchart. If it's a state machine → state diagram.

## Contents

1. [When to use an ER diagram](#1-when-to-use-an-er-diagram)
2. [Required skeleton](#2-required-skeleton)
3. [Entities](#3-entities)
4. [Attributes](#4-attributes)
5. [Relationships](#5-relationships)
6. [Direction](#6-direction)
7. [What's NOT supported](#7-whats-not-supported)
8. [Layout (same ELK as flowcharts)](#8-layout-same-elk-as-flowcharts)
9. [Hybrid workflow: `generate_diagram` first, then `use_figma`](#9-hybrid-workflow-generate_diagram-first-then-use_figma)
10. [Best practices](#10-best-practices)
11. [Validation checklist](#11-validation-checklist)
12. [Complete example](#12-complete-example)
13. [Calling generate_diagram](#13-calling-generate_diagram)

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)
