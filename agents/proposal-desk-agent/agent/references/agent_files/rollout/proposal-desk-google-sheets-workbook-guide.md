# Proposal Desk Google Sheets Tester Workbook Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this guide alongside the Google Sheets Canvas prompt to create and run a tester workbook for Proposal Desk.

## Purpose

This workbook is meant to help LightSpeed teammates test Proposal Desk consistently without needing to understand the editor setup.

It should give testers:

- a plain-English explanation of the agent
- the agent's main capabilities and limits
- starter prompts and when to use them
- realistic test cases
- a clear scoring rubric
- a structured feedback log
- a simple materials-use policy

## What the workbook should achieve

A good workbook should help a tester:

1. understand what Proposal Desk is for
2. know what kinds of tasks are in scope
3. know what materials are allowed during the pilot
4. run realistic prompts with the right context
5. judge whether the output is useful, grounded, and safe
6. log failures and improvement ideas consistently

## Required workbook tabs

### Overview

Must explain:

- what Proposal Desk does
- what it is best at
- what it should not do
- the pilot scope
- the read-only rule
- the approved vs excluded materials policy
- quick test-start steps

### Starter Prompts

Must help testers use the agent's existing starter prompts correctly.

Include:

- prompt title
- use case
- when to use it
- input type
- example prompt text
- what good output looks like

### How To Test

Must show:

- how to write a good prompt
- what supporting context to provide
- what to attach or paste
- how to check output quality
- how to spot weak evidence use
- when to fail a test
- when to escalate to Ash

### Test Cases

Should include realistic scenarios for:

- intake review
- evidence gathering
- executive-summary drafting
- gap tracking
- review-risk spotting
- missing-context handling
- approval-boundary handling
- excluded-material handling

### Testing Criteria

Must act as the tester rubric.
It should score output on:

- task understanding
- evidence use
- handling of gaps
- claim safety
- structure and clarity
- actionability
- boundary handling
- materials-policy handling
- overall usefulness

### Feedback Log

Should capture:

- what was tested
- what was expected
- what happened
- pass/fail
- score
- severity
- follow-up needs
- retest status

### Approved Materials

Should separate:

- approved by default
- excluded unless Ash explicitly approves

## Practical guidance for Ash

When using the workbook:

- give each tester 2 to 4 scenarios first
- start with approved, low-risk materials
- keep all testing read-only
- review failures for repeated patterns before changing rollout scope
- use the same scoring model across testers where possible

## Recommended success signs

The workbook is doing its job if testers can:

- understand the agent quickly
- choose the right starter prompt
- run tests with enough context
- log clear feedback
- identify whether the problem is prompting, evidence quality, or agent behaviour

## Recommended warning signs

The workbook needs improvement if testers:

- still do not understand what the agent is for
- use excluded materials by mistake
- run vague prompts repeatedly
- score inconsistently
- log feedback too loosely to act on

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
