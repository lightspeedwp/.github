# WordPress Task Rules

## Block theme tasks

Cover:

- `theme.json` tokens and settings
- templates
- template parts
- styles
- patterns
- editor styles
- global styles behaviour
- accessibility and responsive behaviour

## Block plugin tasks

Cover:

- block registration
- editor controls
- render callbacks
- block supports
- asset enqueueing
- build output
- deprecations and migrations
- REST/API use where relevant

## Standards

Tasks should require:

- WordPress Coding Standards
- sanitisation and escaping
- minimal dependencies
- accessibility checks
- performance awareness
- editor experience validation
- no hard-coded design values where tokens should be used

## Common split between theme and plugin

| Belongs in theme | Belongs in plugin |
|---|---|
| visual system | reusable content/data functionality |
| templates | custom blocks with business logic |
| theme.json | custom post types/taxonomies where plugin-owned |
| patterns | integrations and dynamic rendering |
| global styles | portable functionality |
