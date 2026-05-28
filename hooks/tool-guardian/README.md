---
file_type: "hook"
title: "tool-guardian hook"
description: "Prevents unsafe or disallowed tool operations based on configured guardrails."
version: "v0.1.0"
last_updated: "2026-05-28"
owners: ["LightSpeedWP Team"]
---

# tool-guardian hook

## Purpose

Validate planned tool operations against repository guardrails before execution.

## Inputs

- Tool action metadata
- Path scope
- Operation type

## Outputs

- allow
- warn
- block
