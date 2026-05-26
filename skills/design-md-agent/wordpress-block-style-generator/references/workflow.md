# Workflow

## Purpose

This reference expands the block-style generation sequence.

## Standard Sequence

1. Identify the target block and style goal.
2. Normalize the style slug and label.
3. Choose the lightest fitting implementation path.
4. Generate registration guidance.
5. Generate scoped CSS or `theme.json` guidance.
6. Return assumptions and validation notes.

## Implementation Preference

Prefer this order:

1. native block-style handling
2. preset-driven CSS
3. custom classes only where needed

## Things To Avoid

- turning section-level design into a block-style request
- using hardcoded styling values when theme presets are available
- producing styles that are not scoped to the named block style
