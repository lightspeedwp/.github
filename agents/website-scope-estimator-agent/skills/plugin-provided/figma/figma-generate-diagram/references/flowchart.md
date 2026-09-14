# Flowcharts (non-architecture)

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

Use this reference for **generic flowcharts** — decision trees, process flows, pipelines, dependency graphs, user journeys, anything that is not a software architecture diagram (those go to [architecture.md](./architecture.md)).

These diagrams render via ELK (Eclipse Layout Kernel) with an orthogonal, layered layout. The rules below are tuned to produce diagrams that read well, use FigJam's shape vocabulary, and avoid the layout traps ELK struggles with.

## Contents

1. [Direction: pick once, up front](#1-direction-pick-once-up-front)
2. [Shapes: use the vocabulary, don't over-decorate](#2-shapes-use-the-vocabulary-dont-over-decorate)
3. [Edges: strokes, end caps, labels](#3-edges-strokes-end-caps-labels)
4. [Subgraphs: group related nodes](#4-subgraphs-group-related-nodes)
5. [ELK survival guide](#5-elk-survival-guide)
6. [Colors: use sparingly, semantically](#6-colors-use-sparingly-semantically)
7. [Text quality](#7-text-quality)
8. [Density and when to split](#8-density-and-when-to-split)
9. [Validation checklist (before calling the tool)](#9-validation-checklist-before-calling-the-tool)
10. [Complete example](#10-complete-example)
11. [When a flowchart is NOT the right choice](#11-when-a-flowchart-is-not-the-right-choice)
12. [Calling generate_diagram](#12-calling-generate_diagram)

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)

_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_
[Contact](https://lightspeedwp.agency/contact)
