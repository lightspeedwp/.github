---
file_type: documentation
title: GitHub Branch Rulesets Configuration
description: Overview and instructions for importing/updating the repository branch rulesets.
last_updated: '2026-06-18'
owners:
  - LightSpeed Team
version: v1.1
status: active
stability: stable
domain: governance
tags:
  - branching
  - rulesets
  - governance
  - github
language: en
---

# GitHub Branch Rulesets Configuration

This directory contains version-controlled JSON definitions of the GitHub repository rulesets applied to the main protected branches: `main` and `develop`.

## Rulesets Overview

### 1. `develop` Branch Ruleset ([develop.ruleset.json](./develop.ruleset.json))

- **Target Ref:** `refs/heads/develop`
- **Enforcement:** Active
- **Key Rules:**
  - Deletion blocked
  - Non-fast-forward merges (force pushes) blocked
  - Pull request required before merging (1 approval, dismiss stale approvals, resolve conversations, respect Code Owners)
  - Required status checks:
    - `Validate PR Template / validate-pr-template`
    - `CI • Unified Checks (Lint, Test, Validate) / All Checks Passed`

### 2. `main` Branch Ruleset ([main.ruleset.json](./main.ruleset.json))

- **Target Ref:** `refs/heads/main`
- **Enforcement:** Active
- **Key Rules:**
  - Deletion blocked
  - Non-fast-forward merges (force pushes) blocked
  - Pull request required before merging (1 approval, dismiss stale approvals, resolve conversations, respect Code Owners)
  - Required status check: `validate-release-branch` (enforcing only release/hotfix merges)

## Importing and Applying Rulesets

Since GitHub rulesets are configured via the GitHub platform settings, these JSON files serve as version-controlled declarations.

To apply or update rulesets:

1. Navigating to the repository settings page on GitHub.
2. Select **Rules** -> **Rulesets** from the sidebar.
3. Import the ruleset definition using these JSON files, or configure them to match.

## Visual Workflow

```mermaid
flowchart TD
  accTitle: flowchart diagram
  accDescr: flowchart flowchart
  A[Start Here] --> B[Read Scope and Prerequisites]
  B --> C[Run the Documented Workflow]
  C --> D[Validate with Repo Tooling]
  D --> E[Open PR or Hand-off]

  classDef start fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20;
  classDef prep fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,color:#0D47A1;
  classDef run fill:#FFF3E0,stroke:#EF6C00,stroke-width:2px,color:#E65100;
  classDef gate fill:#F3E5F5,stroke:#6A1B9A,stroke-width:2px,color:#4A148C;
  classDef done fill:#E0F2F1,stroke:#00695C,stroke-width:2px,color:#004D40;

  class A start;
  class B prep;
  class C run;
  class D gate;
  class E done;
```
