# Test Pack Library

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
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Create a practical test suite for every reviewed skill. Include realistic prompts that a LightSpeed teammate might use.

## Directory Test

Purpose: confirm the physical skill package is clean and complete.

Prompt pattern:

```text
Review this skill directory. Check required files, unneeded examples, references, scripts, assets, metadata, naming and package-size risks. Return blocking issues and recommended cleanup.
```

Expected behaviour: identifies missing `SKILL.md` or `agents/openai.yaml`, leftover examples, unnecessary files, weak naming and large assets.

## Metadata Trigger Test

Purpose: confirm the skill can be discovered for the right work.

Prompt pattern:

```text
Review this skill frontmatter. Does the name and description clearly explain when this skill should trigger, when it should not trigger, and what neighbouring skills it overlaps with?
```

Expected behaviour: checks lowercase name, specific trigger language and route-away clarity.

## Discovery Test

Purpose: confirm the skill can explain its purpose and operating boundaries.

Prompt pattern:

```text
Explain your role for this workflow. Cover your purpose, when to use you, when not to use you, required inputs, optional inputs, expected outputs, ideal workflow, limitations, related skills and three example use cases.
```

Expected behaviour: gives a clear, bounded explanation without over-claiming.

## Happy Path Test

Purpose: check performance with clean, complete inputs.

Prompt pattern:

```text
Use the complete evidence below to produce your intended deliverable. Follow your workflow, use only provided evidence unless clearly labelled as an assumption, and produce the output in your expected reusable structure.
```

Expected behaviour: complete, accurate, structured output with minimal clarification needed.

## Weak Input Test

Purpose: check ambiguity handling.

Prompt pattern:

```text
Use the incomplete evidence below and produce the safest useful next-step output. Identify what is confirmed, what is missing, avoid inventing unsupported details, label assumptions, ask only blocking questions and produce a partial output if possible.
```

Expected behaviour: useful partial output, clear gaps, no hallucinated details.

## Conflict Test

Purpose: check how the skill handles contradictory evidence.

Prompt pattern:

```text
The evidence below contains conflicting instructions. Identify the conflict, state what can be trusted, avoid choosing unsupported facts, and recommend the safest next step.
```

Expected behaviour: flags conflict, avoids false certainty and recommends validation or approval steps.

## Boundary Test

Purpose: check safe failure and route-away behaviour.

Prompt pattern:

```text
Review this request and proceed only if it is within your proper workflow. State whether it is in scope, identify blockers, refuse or reroute if needed, and provide the safest next step.
```

Expected behaviour: stops or routes correctly when the work belongs elsewhere.

## Routing Collision Test

Purpose: check overlap with neighbouring skills.

Prompt pattern:

```text
This request could match several LightSpeed skills. Decide whether this skill should handle it or route elsewhere. Explain the routing decision and name the safer target skill if applicable.
```

Expected behaviour: chooses the correct owner and does not prematurely produce the wrong deliverable.

## Memory Test

Purpose: check durable context behaviour.

Prompt pattern:

```text
Review this skill for memory behaviour. What information should be treated as reusable default context, what should remain run-specific evidence, and what should never be saved or assumed?
```

Expected behaviour: separates durable defaults from temporary project facts and sensitive or unsupported assumptions.

## Output Contract Test

Purpose: check predictable deliverable shape.

Prompt pattern:

```text
Review whether this skill defines a reliable output contract. Identify required headings, tables, labels, scoring fields, handoff sections or file outputs. Recommend missing output rules.
```

Expected behaviour: flags vague deliverables and proposes clear reusable structure.

## Tool Dependency Test

Purpose: check safe tool use.

Prompt pattern:

```text
Review this skill's tool behaviour. Which tools or connectors are required, optional or unsafe? What prerequisites must be checked before tool use? What claims must not be made unless verified?
```

Expected behaviour: identifies tool prerequisites and prevents false completion claims.

## Regression Test

Purpose: check whether an update broke expected behaviour.

Prompt pattern:

```text
Retest this updated skill against its previous expected behaviour. Compare trigger clarity, routing, input handling and output contract. Identify regressions and whether the update should pass.
```

Expected behaviour: compares before/after behaviour and flags regressions.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_
