# Agent Memory Pack Guide

## Purpose

Define how generated agents should use durable memory safely.

## Required sections

- What can be stored permanently.
- What must never be stored.
- Durable defaults versus one-off notes.
- Stale decision handling.
- Todo retirement.
- Routing decisions without hidden commitments.
- Interaction with `business-context.md`.
- Validator coverage.

## Permanent memory allowed

Durable defaults, stable user preferences, routing decisions, source priorities, reusable decisions, todos, and open questions.

## Never store

Sensitive personal data, one-off task observations, unsupported customer facts, private customer details without permission, legal/security/pricing claims without approved source, or stale decisions as current state.

## Staleness

Mark decisions stale when source evidence changes, the workflow owner changes, the user overrides a prior rule, or a specialist skill supersedes the route.

## Validator

Checked by `scripts/validate-memory-hygiene.py`.
