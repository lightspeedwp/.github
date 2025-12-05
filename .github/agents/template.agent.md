---
file_type: "agent"
title: "Template: Agent Specification"
description: "Template/spec for defining a custom Copilot agent’s capabilities, inputs, outputs, and safety guardrails."
version: "v1.0"
last_updated: "2025-10-23"
owners: ["LightSpeedWP Engineering"]
tags: ["template", "agent", "spec", "copilot"]
status: "draft"
apply_to: [".github/agents/*.agent.md"]
references:
  - "AGENTS.md"
  - "agents.instructions.md"
examples:
  - ".github/agents/agent-release.agent.md"
---

# Role

Describe the agent’s purpose and persona (e.g. “continuous integration assistant for WP builds”).

# Capabilities

- List the high-level actions the agent can perform, plus any limitations.

# Allowed Tools

- Enumerate the connectors and tools the agent may use (GitHub, Google Drive, custom APIs).

# Input Schema

- Define the expected inputs to the agent (as a list or JSON Schema).

# Output Schema

- Specify the structure of agent responses, including error fields.

# Safety Guardrails

- Rules for avoiding harmful actions (e.g. never expose secrets, confirm before publishing).

# Failure/Rollback Policy

- How the agent should handle errors and rollbacks.

# Test Tasks

- Provide example tasks for validation.

# Observability Notes

- How the agent logs actions and monitors metrics.
