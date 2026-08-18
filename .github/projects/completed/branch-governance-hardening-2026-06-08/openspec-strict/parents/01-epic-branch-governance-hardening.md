---
title: "Branch Governance Hardening Epic"
description: "Epic proposal for enforcing branch lifecycle rules, GitHub rulesets, and AI branch-selection guardrails."
file_type: "documentation"
version: "1.0.0"
last_updated: "2026-06-08"
created_date: "2026-06-03"
authors: ["LightSpeed Team"]
maintainer: "LightSpeed Team"
license: "GPL-3.0"
tags: ["epic", "branching", "governance", "rulesets"]
domain: "governance"
stability: "experimental"
status: archived
---

# Branch Governance Hardening Epic

## Problem

The repo already documents branch naming, merge discipline, and deletion
expectations. That guidance does not stop an AI or a human from reusing a work
branch, skipping the intended branch type, or continuing a new batch on an old
branch. The policy needs to be enforced where the repo can actually check it.

## Goal

Convert branch policy from prose into enforceable controls:

- GitHub rulesets and branch protections
- workflow checks that validate branch state
- AI branch-selection guardrails that require explicit intent
- tests and rollout controls that keep the policy from drifting

## Non-goals

- redesigning the branching model from scratch
- removing `develop` from the delivery flow
- changing the team's preferred merge strategy

## Acceptance Criteria

- branch protection and ruleset coverage is defined for the protected branches
- the workflow layer blocks invalid branch names and reused batch branches
- AI-facing instructions require explicit branch choice and current-state checks
- tests prove the rules fire before a bad branch can be used
- the rollout plan explains how to extend the guardrails to later batches

## Child Issues

1. GitHub rulesets and branch protection
2. Workflow branch validation and reuse prevention
3. AI branch-selection guardrails
4. Validation tests and rollout controls
