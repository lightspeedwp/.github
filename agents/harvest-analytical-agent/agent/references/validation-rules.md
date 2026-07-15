# Validation Rules

## Link and Reference Validation
Check that referenced files exist, paths are correct, and stale references are removed.

## Markdown Structure Validation
Check required headings, heading order, table structure, and placeholder text.

## Template and Schema Alignment
Check that each required schema field has a place in the paired template.

## Example and Template Alignment
Check that each example follows the current paired template structure and intent.

## Memory Hygiene
Check that memory files avoid sensitive Harvest data and only store durable or explicitly approved content.

## Source Priority Consistency
Check that source ordering stays consistent across instructions and reference files.

## Business Context Completeness
Check that business context contains all required sections and meaningful content.

## Starter Prompt Quality
Check that exactly six prompts exist, are specific, and do not imply unsafe actions.

## Validation Severity Levels
- Error: must fix before release.
- Warning: should review before release.
- Notice: useful improvement.
- Pass: no issue found.

## Validation Report Format
Validation outputs should follow `schemas/validation-report.schema.json` and `templates/validation-report.template.md`.
