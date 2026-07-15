# Parity Audit Workflow

## 1. Confirm scope

Clarify whether the audit covers:

- entire website
- homepage only
- selected templates
- selected components
- light/dark mode
- pre-launch QA

## 2. Gather evidence

Minimum useful inputs:

- Figma design-system link or export
- Figma prototype or screenshots
- `theme.json`
- WordPress staging URL or screenshots
- block pattern files or template screenshots
- accessibility notes

## 3. Compare tokens

Create separate tables for:

- colour
- typography
- spacing
- radius/borders
- shadows/elevation if used

## 4. Compare components and patterns

Map every high-value Figma component to:

- native WordPress block
- block variation
- custom block
- block pattern
- template part
- theme style variation

## 5. Review states

Check:

- default
- hover
- focus
- active/current
- disabled
- error/success
- empty/loading where relevant

## 6. Review accessibility

Check contrast, keyboard access, visible focus, headings, landmarks, labels, target sizes and reduced motion.

## 7. Report

Classify issues by severity and produce a go/no-go recommendation.
