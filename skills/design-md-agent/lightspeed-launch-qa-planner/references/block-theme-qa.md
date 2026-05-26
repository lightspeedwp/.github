# Block Theme QA

## theme.json

Check:

- settings.color.palette
- settings.typography.fontSizes
- settings.spacing.spacingSizes
- settings.layout.contentSize and wideSize
- styles.elements
- styles.blocks
- custom properties
- duotone, gradients and shadows where relevant
- editor styles and frontend parity

## Templates

Check:

- front page
- page
- single post
- archive
- search
- 404
- header
- footer
- template parts
- WooCommerce templates where relevant

## Editor experience

Check:

- editor styles load
- patterns are discoverable
- locked areas behave correctly
- allowed blocks are appropriate
- content creators can edit intended fields
- block spacing and previews match frontend

## Risks

Common blockers:

- frontend/editor mismatch
- global styles overriding design system
- missing responsive rules
- inaccessible navigation
- broken template parts
- unregistered or duplicate patterns
