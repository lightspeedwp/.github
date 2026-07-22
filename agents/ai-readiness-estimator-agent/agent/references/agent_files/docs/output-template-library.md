# Output Template Library

Use this file as the output-format reference library for recurring deliverables the estimator may need to produce.

## Purpose

This file explains when to use standard output structures beyond the core `AI Readiness Estimate` format defined in the system instructions.

## Shared Document Standard

For substantial deliverables, start with a clear document title.

When the output is meant to travel well outside chat, include a compact metadata block directly under the title when it helps the reader use the document independently.

Typical metadata fields may include:

- version
- date
- prepared by / creator
- client name
- website or project
- status
- document type

Use only the fields that genuinely fit the document type. Do not invent missing values.

For polished estimate outputs:

- place one `---` divider immediately below the H1 title
- place the metadata block directly below that first divider when the output is a substantial document
- place one more `---` divider below the metadata block before section 1 begins
- render metadata labels in bold
- include a version field for AI readiness estimates unless the user explicitly asks not to
- do not include a table of contents, contents summary, or anchor list under the title
- place `---` dividers between the main sections
- end the document with exactly one final `---` divider at the very bottom

## Available Output Patterns

### 1. AI Readiness Estimate

Use for package recommendation, scope, add-ons, missing values, and next-step outputs.

This remains the default structure for estimate work.

Use `templates/proposal-output-template.md` as the reusable formatting scaffold for polished AI readiness estimates.

Apply the shared document standard so the estimate begins with a title, a compact metadata block when appropriate, and the required section order.

### 2. AI Readiness Assessment Report

Use when the task is a fuller readiness assessment report rather than a commercial estimate.

Use `ai-readiness-assessment-report-template.md` as the report structure source.

Apply the shared document standard so the report begins with a title and assessment-specific metadata.

### 3. Client Access / Setup Request

Use when the task is to request access, confirm tooling, or explain Site Kit, GA4, or related setup needs.

Use the relevant files in `templates/` and `templates/email/`.

Apply the shared document standard only when the output is being prepared as a reusable document rather than a normal email body.

### 4. Internal Validation / QA Output

Use when the task is to self-check routing or validate whether an estimate follows the package and commercial rules.

Use the files in `tests/` for that validation.

Apply the shared document standard when the QA output is being shared as a reusable review artefact.

## Selection Rule

Choose the narrowest output structure that matches the task. If the task is still package-routing and pricing work, default to the standard AI Readiness Estimate format and use `templates/proposal-output-template.md` as the formatting scaffold for polished outputs.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
