# Workflow

## Purpose

This reference expands the section-style generation sequence.

## Standard Sequence

1. Identify the section role and reuse scope.
2. Normalize the style name and related class naming.
3. Choose the lightest fitting implementation path.
4. Generate section-scoped CSS or `theme.json` guidance.
5. Add usage notes for patterns, wrappers, or section containers.
6. Return assumptions and validation notes.

## Implementation Preference

Prefer this order:

1. theme presets and settings
2. scoped section-level CSS
3. custom classes only where needed

## Things To Avoid

- collapsing a single-block style request into section-style work
- turning section-style work into full template composition
- relying on hardcoded values when presets would work
