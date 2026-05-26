# Validation Checklist

## Ordered Pass

1. Confirm which files are in scope.
2. Confirm which approved sources are in scope.
3. Inspect `theme-utils.mjs` or equivalent helper files if they exist.
4. Inventory `theme.json`, style variations, block styles, section styles, and related style files.
5. Identify token-like values, custom properties, preset references, and hardcoded values.
6. Map each meaningful value back to the strongest approved source available.
7. Classify each gap or mismatch as Verified, Inferred, Drift, Legacy, or Conflict.
8. Summarize the highest-impact implementation risks first.

## High-Risk Findings

Prioritize these findings in the final output:

- undeclared raw colors or spacing values
- mismatches between `theme.json` and style variations
- duplicated token systems across theme surfaces
- block or section styles overriding shared tokens without approval
- values that appear generated but do not match `theme-utils` conventions
- values that cannot be traced to Figma, `DESIGN.md`, or parent-theme inheritance

## Classification Rules

### Verified

Directly supported by implementation plus approved design evidence.

### Inferred

Reasonable mapping, but one link in the chain is missing.

### Drift

Implementation no longer matches approved design evidence or token rules.

### Legacy

Pre-existing implementation that may be intentional but is outside the current preferred system.

### Conflict

Two or more approved sources disagree and the correct implementation is not yet settled.
