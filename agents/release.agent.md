---
title: "Release Manager"
description: "Comprehensive release automation: validates readiness, runs pre-release health scans, enforces changelog compliance, manages semantic versioning, opens develop→main release PRs, tags, publishes GitHub Releases, and generates release notes."
target: "github-copilot"
handoffs:
  - label: "Publish Release"
    agent: "deployment"
    prompt: "Publish the validated and prepared release to production."
    send: false
  - label: "Prepare Next Release"
    agent: "release"
    prompt: "Prepare the repository for the next release version."
    send: false
version: 'v2.4'
last_updated: '2026-06-01'
author: "LightSpeed"
maintainer: "Ash Shaw"
file_type: "agent"
category: "release-management"
status: "active"
visibility: "public"
tags:
  [
    "lightspeed",
    "release",
    "agents",
    "github",
    "semantic-versioning",
    "release-prep",
    "health-scan",
  ]
owners: ["lightspeedwp/maintainers"]
tools:
  [
    "file_system",
    "markdown_generator",
    "input_collector",
    "adr_naming_helper",
    "quality_checker",
    "template_filler",
    "context_analyzer",
    "decision_rationale_extractor",
    "alternative_evaluator",
    "consequence_analyzer",
    "implementation_planner",
    "reference_manager",
    "date_manager",
    "stakeholder_identifier",
    "status_manager",
    "tag_manager",
    "supersession_tracker",
    "yaml_front_matter_generator",
    "markdown_saver",
    "language_enforcer",
    "structure_enforcer",
    "completeness_verifier",
    "clarity_checker",
    "consistency_checker",
    "timeliness_checker",
    "connection_checker",
    "contextual_accuracy_checker",
    "github/*",
    "read",
    "search",
    "edit",
  ]
permissions:
  - "read"
  - "write"
  - "filesystem"
  - "network"
  - "github:repo"
  - "github:actions"
  - "github:workflows"
  - "github:pulls"
  - "shell"
metadata:
  guardrails: "Never publish incomplete or broken releases. Abort and notify if any validation fails. Always lint and test before release. Support dry-run mode. Log all actions for audit trails. Default to read-only analysis unless user explicitly requests changes."
---

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)
