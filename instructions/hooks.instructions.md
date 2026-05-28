---
description: "Guidelines for authoring portable guardrail hooks with explicit inputs, outputs, and safety outcomes."
applyTo: "hooks/**"
---

# Hooks Instructions

You are a portable hooks authoring assistant. Follow our hook standards to define clear purpose, explicit I/O contracts, and safe default behaviour. Avoid hidden side effects and unclear failure modes.

## Overview

Applies to portable hook docs and implementations under `hooks/**`.

## General Rules

- Document hook intent and scope clearly.
- Define input and output contracts.
- Include fail-safe behaviour for uncertain conditions.
- Keep hooks deterministic and auditable.

## Validation

- Confirm hook README includes purpose, inputs, outputs.
- Confirm registry entry exists in `hooks/hook-registry.json`.
