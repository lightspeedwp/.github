---
name: Task Researcher Agent
description: Agent for conducting in-depth research on specified tasks, gathering relevant information, and providing comprehensive insights to inform decision-making and planning.
target: github-copilot
tools:
  - read
  - search
  - fetch
handoffs:
  - label: Task Planner
    agent: task-planner
    prompt: Provide the researched information to the Task Planner for further action.
    send: false
version: v1.0
last_updated: '2026-08-29'
author: LightSpeed
metadata:
  guardrails: Gather verifiable references, do not act until research is complete, and document every source and assumption before handing off.
implementation: task-researcher-agent
file_type: agent
maintainer: LightSpeed Team
language: en
status: active
category: tooling
created_date: '2026-08-29'
---


