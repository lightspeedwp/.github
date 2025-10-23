---
title: "Agent Instructions Index"
description: "Canonical index for all LightSpeedWP agent specifications and agent-driven automation standards."
version: "1.2"
apply_to: "all repositories"
last_updated: "2025-10-22"
owners: ["LightSpeedWP Automation Team"]
references:
  - "./workflows.instructions.md"
  - "./automation-testing.instructions.md"
  - "./coding-standards.instructions.md"
  - "./tests.instructions.md"
  - "./naming-conventions.instructions.md"
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
---

# Agent Instructions Index

This is the canonical index for all LightSpeedWP agent specifications and related automation governance.

Each agent is:
- Canonically documented in an `agent-*.instructions.md` file in this folder.
- Aligned with one or more GitHub workflows, and mapped to a clear automation purpose.
- Versioned, auditable, and discoverable via this dynamic index.

> All files matching `agent-*.instructions.md` in this folder are dynamically indexed here and are considered canonical for LightSpeedWP automation.

---

## Agent Instructions

- [agent-release.instructions.md](./agents/agent-release.instructions.md)  
  *Release Agent: Drives release automation, changelog, versioning, and publishing.*

- [agent-planner.instructions.md](./agents/agent-planner.instructions.md)  
  *Planner Agent: Manages PR checklists, merge readiness, and process analytics.*

- [agent-reviewer.instructions.md](./agents/agent-reviewer.instructions.md)  
  *Reviewer Agent: Summarizes PR/CI status, review requirements, and reviewer guidance.*

- [agent-labels-issues-prs.instructions.md](./agents/agent-labels-issues-prs.instructions.md)  
  *Labels/Issues/PRs Agent: Automates labeling, status, and changelog management for issues and PRs.*

- [agent-project-meta-sync.instructions.md](./agents/agent-project-meta-sync.instructions.md)  
  *Project Meta Sync Agent: Syncs GitHub Project board fields with issue/PR metadata and labels.*

<!-- Add new agent instruction files here as they are created. -->

---

## Testing & Includes

- **All automation agent and utility tests are located in `.github/agents/tests/` and follow the naming convention `{module}.test.js`.**
- See [automation-testing.instructions.md](./automation-testing.instructions.md) and [tests.instructions.md](./tests.instructions.md) for org-wide test strategy, structure, and naming conventions.
- All shared JS modules/utilities for agents are stored in `.github/agents/includes/`.

---

## Coding Standards & Naming

- All agent and utility code must follow [coding-standards.instructions.md](./coding-standards.instructions.md).
- See [naming-conventions.instructions.md](./naming-conventions.instructions.md) for org-wide rules governing file, folder, function, class, and configuration naming patterns.

---

## Contribution & Reciprocation

- Whenever adding or updating an agent, always create or update its corresponding `agent-*.instructions.md` file and related tests.
- Every agent referenced in a workflow must have a reciprocal agent specification file.
- Review [coding-standards.instructions.md](./coding-standards.instructions.md) and [tests.instructions.md](./tests.instructions.md) before submitting PRs.

---

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_  
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)