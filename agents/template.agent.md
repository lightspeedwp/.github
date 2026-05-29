---
title: "Template: Agent Specification"
description: "Standard specification for defining a LightSpeed Copilot Agent: role, behaviours, tooling, schemas, and safety constraints."
version: "v1.1"
last_updated: "2025-12-11"
owners: ["LightSpeedWP Engineering"]
tags: ["agent", "spec", "template", "copilot"]
status: "draft"
apply_to: ["agents/*.agent.md"]
file_type: "template"
tools: ["Copilot Agents"]
examples:
  - "agents/adr.agent.md"
metadata:
  guardrails: "Agents must never perform destructive or irreversible actions without explicit confirmation."
---
