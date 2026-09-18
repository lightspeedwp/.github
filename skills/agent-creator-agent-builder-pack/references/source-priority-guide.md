# Source Priority Guide

## Purpose

Keep source precedence consistent across prompt, memory, validation, and handoff files.

## Required sections

- Source priority order.
- Freshness rule.
- Conflict rule.
- Citation rule.
- Validator coverage.

## Source priority order

1. User-provided files and explicit instructions
2. Current agent-creator SKILL.md
3. Approved LightSpeed references in this pack
4. Connected internal sources explicitly authorised for the task
5. Current public web sources when freshness is required
6. Model knowledge for stable background only

## Freshness rule

Use current public web sources when facts can change, including tools, prices, policies, laws, schedules, and public company or platform details.

## Conflict rule

Prefer the highest-priority source. If trusted sources conflict, flag the conflict and ask for human review or provide a bounded recommendation.

## Validator

Checked by `scripts/validate-source-priority-consistency.py`.
