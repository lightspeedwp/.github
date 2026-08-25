# Preview Validation Example Contexts Index

---

## Purpose

Use this index as the starting point for repeatable preview tests. It lists the reusable example-context files currently attached to the agent and helps future runs choose the right grounded test source quickly.

This index supports two distinct test modes:

- **context-only QA** for controlled, repeatable runs grounded only in the attached example-context file
- **multi-source validation** for broader runs that are allowed to verify or enrich against accessible live and connected sources named in the example-context file

The example files themselves now include their own test-mode guidance, source boundaries, and context-specific prompt seeds. Use this index to choose the right file first, then rely on the selected example file and the prompt library together.

---

## How To Choose A Test Mode

### Use context-only QA when

- you want strict repeatability across reruns
- you want the output to stay inside the attached example-context file
- you want to test evidence discipline, uncertainty labeling, formatting, delivery behavior, and QA checklist compliance
- you do not want the run to expand into live-site checks, repo reads, Drive lookups, or Figma verification

### Use multi-source validation when

- you want the agent to verify, enrich, or challenge the attached context against broader accessible evidence
- you want to compare named sources such as live site, dev site, repos, Drive, or Figma against each other
- you want a richer discovery output that includes live or connected-source findings
- you accept that the run may be less strictly repeatable because external evidence can change over time

---

## Available Example Contexts

### LightSpeedWP.Agency

**File:** `docs/preview-validation/lightspeedwp-agency-example.md`

Use for:

- agency-site discovery tests
- multi-source validation across live, prototype, dev, GitHub, Drive, and Figma
- formatting and delivery checks with a rich reference set

**Best mode choices:**

- **Context-only QA:** use this file when you want a rich but tightly bounded repeatable test based only on the attached LightSpeedWP.Agency reference file.
- **Multi-source validation:** use this file when you want the agent to verify or enrich against the live site, prototype site, dev site, GitHub repos, Drive materials, and Figma references named in the file.

### TourOperator.solutions

**File:** `docs/preview-validation/touroperator-solutions-example.md`

Use for:

- product-site discovery tests
- comparisons across live, demo, and dev references
- tourism and operator-oriented discovery examples

**Best mode choices:**

- **Context-only QA:** use this file when you want a repeatable tourism-oriented test that stays inside the attached TourOperator.solutions reference file.
- **Multi-source validation:** use this file when you want the agent to compare or enrich against the live site, demo site, dev site, repo, Drive material, and Figma design system named in the file.

### LSX Design System

**File:** `docs/preview-validation/lsx-design-system-example.md`

Use for:

- design-system discovery tests
- repo, Drive, live/demo, and Figma evidence checks
- structured design-reference and system-governance examples

**Best mode choices:**

- **Context-only QA:** use this file when you want a design-system-led repeatable test grounded only in the attached LSX reference file.
- **Multi-source validation:** use this file when you want the agent to verify or enrich against the live site, demo site, repo, Drive material, and Figma design system named in the file.

---

## Companion Prompt Library

**File:** `docs/preview-validation/repeatable-preview-test-prompts.md`

Use this companion file when you want ready-made kickoff prompts for both test modes above:

- **context-only QA prompts** for controlled, file-bounded runs
- **multi-source validation prompts** for broader evidence verification and enrichment

The prompt library is best used after selecting a specific example file from this index.

---

## Companion QA Checklist

**File:** `docs/preview-validation/master-preview-qa-checklist.md`

Use this master checklist when you want one place to review test setup, validation criteria, failure conditions, and the full review workflow.

---

## Run Comparison Guide

**File:** `docs/preview-validation/run-comparison-guide.md`

Use this guide when you want to compare a context-only QA run and a multi-source validation run side by side to confirm that prompt mode is controlling evidence scope, formatting, delivery behavior, and repeatability as intended.

---

## One-Page File Inventory

**File:** `docs/preview-validation/file-inventory-summary.md`

Use this one-page summary when you want the fastest overview of the whole preview-validation file set, including the example contexts, shared index, prompt library, QA checklist, and recommended reading order.

---

## Suggested Selection Rules

- Choose **LightSpeedWP.Agency** when you want the broadest cross-source test case.
- Choose **TourOperator.solutions** when you want a product and tourism-oriented example.
- Choose **LSX Design System** when the test is design-system-led or component-library-led.
- Use the selected **example file** for project-specific boundaries, known limits, and context-specific seeds.
- Use the **repeatable preview test prompts** file when you want a reusable kickoff prompt rather than writing one from scratch.
- Use **context-only QA** when you want controlled evidence scope and strict repeatability.
- Use **multi-source validation** when you want broader verification against accessible external or connected sources.
- Use the **master QA checklist** when you want a single validation standard for review and rerun decisions.
- Use the **run comparison guide** when you want to compare both test modes side by side.
- Use the **file inventory summary** when you want a one-page overview before choosing a context or prompt.

---

## Example Prompt Seeds

### Context-only QA seed

Use one of the example context files in `docs/preview-validation/` as the grounded source for this preview. Build a structured internal discovery pack from that file only. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts. Do not broaden the evidence scope in this run.

### Multi-source validation seed

Use one of the example context files in `docs/preview-validation/` as the starting context for this preview. Build a structured internal discovery pack from the sources named in that file. Where accessible, verify or enrich against live pages, repository evidence, connected documents, and design references. Separate confirmed facts, assumptions, inferred observations, open questions, and internal notes. Do not invent missing facts.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
