---
name: design-md-standards-validator
description: Use when the task requires validating DESIGN.md, design-md-source-map.md, or design-md-validation-report.md against documented standards for evidence quality, naming consistency, accessibility coverage, WordPress mapping quality, and compliance-oriented design-system completeness.
---

# DESIGN.md Standards Validator

Use this skill when the agent must check whether `DESIGN.md`, `design-md-source-map.md`, and `design-md-validation-report.md` meet the project's documentation and compliance expectations.

This skill is for standards and compliance validation. It should assess whether the documents are safe, evidence-backed, internally consistent, and complete enough for downstream use.

## When to Use

Use this skill when the user asks to:

- validate an existing `DESIGN.md` package
- audit standards compliance before handoff
- flag unsafe assumptions or weak evidence
- review accessibility, naming, or implementation-mapping quality
- produce a validation-ready report for humans or coding agents

Skip this skill when the request is only about drafting from scratch and no validation pass is needed yet.

## Core Responsibilities

1. Check whether conclusions are supported by evidence.
2. Validate whether required design-system areas are covered with enough clarity.
3. Identify standards or compliance risks across the three documents.
4. Produce a clear, prioritized findings summary with remediation guidance.

## Validation Areas

Assess the documents across these areas when the available material supports the check:

### Evidence Sufficiency

- Are major claims backed by evidence from Figma, GitHub, Google Drive, or clearly marked inference?
- Does the source map make traceability possible?
- Are conflicts, weak sources, and unknowns exposed instead of hidden?

### Naming and Taxonomy

- Are token names, component labels, and document labels internally consistent?
- Are primitive, semantic, component, and state concepts kept distinct where the evidence supports that distinction?
- Are naming choices stable enough for implementation and maintenance?

### Documentation Completeness

- Does `DESIGN.md` cover the project's evidenced visual-system areas such as color, typography, spacing, radius, components, and usage constraints?
- Does the source map cover the important sources and normalization logic?
- Does the validation report capture key risks, missing evidence, and next steps?

### Accessibility Coverage

- Are accessibility considerations surfaced where the evidence supports them?
- Are likely contrast, state, semantic-color, or interaction gaps flagged?
- Is uncertainty called out when accessibility coverage cannot be validated confidently?

### WordPress Mapping Quality

- Where relevant, do the documents map design decisions to `theme.json`, style variations, block styles, patterns, CSS variables, or related implementation structures clearly and safely?
- Are hardcoded values, undocumented implementation drift, or broken mappings flagged?
- Are WordPress-native structures preferred when the evidence supports them?

### Compliance and Safety

- Are inferred values clearly labeled?
- Are governance notes, approvals, and project-specific constraints preserved?
- Does any file overstate confidence beyond what the evidence supports?
- Would a coding agent be likely to misuse the document because ambiguity or unsupported certainty remains?

## Severity Model

Use a stable severity model for findings:

- **Critical**: unsafe or misleading for downstream implementation or automation
- **Major**: materially incomplete, inconsistent, or weakly evidenced
- **Minor**: quality issue that should be cleaned up but is not likely to cause serious misuse alone
- **Informational**: useful note, caution, or improvement opportunity

## Validation Workflow

1. Identify which of the three files are present or requested.
2. Check whether each document matches its intended job.
3. Compare claims across documents for internal consistency.
4. Evaluate standards areas only where evidence supports a fair check.
5. Prioritize the findings by risk.
6. Recommend the smallest practical remediation steps.

## Output Contract

When this skill is used, the validation output should usually include:

### Validation Summary

- overall confidence and readiness

### Findings by Severity

- critical
- major
- minor
- informational

### Standards Coverage

- evidence sufficiency
- naming consistency
- documentation completeness
- accessibility coverage
- WordPress mapping quality
- compliance and safety notes

### Remediation Priorities

- the smallest high-value fixes to make next

### Safe-to-Use Statement

- whether the current documents are safe for human review, coding-agent use, or only provisional use

## Guardrails

- Do not invent compliance status from missing evidence.
- Do not treat formatting quality alone as proof of standards compliance.
- Be explicit when a standard could not be checked.
- Prefer precise findings over broad criticism.
- If a document is partially usable, say what it is safe for and what it is not yet safe for.

## Example Triggers

- "Validate this DESIGN.md package for evidence quality, accessibility coverage, and WordPress mapping safety."
- "Run a standards check on DESIGN.md, the source map, and the validation report before I hand this to a coding agent."
- "Audit whether these docs meet our design-system documentation and compliance bar."
