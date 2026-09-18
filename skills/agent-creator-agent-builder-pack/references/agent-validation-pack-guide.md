# Agent Validation Pack Guide

## Purpose

Define required validation coverage for Agent Builder spec packs.

## Required sections

- Validator list.
- Priority order.
- Files checked.
- Failure conditions.
- Test fixture coverage.

## Priority validators

1. Memory hygiene.
2. Source-priority consistency.
3. Schema-to-template alignment.

These come first because they reduce the highest-risk drift: bad memory, inconsistent source precedence, and outputs that cannot satisfy their schema.

## Validator

Checked by `scripts/validate-links-and-references.py` and `scripts/validate-all.py`.
