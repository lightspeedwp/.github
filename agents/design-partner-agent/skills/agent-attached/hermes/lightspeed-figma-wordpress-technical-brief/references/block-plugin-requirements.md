# Block Plugin Requirements

## Use a block plugin when

- UI is data-driven.
- Behaviour is reusable across themes.
- Custom editor controls are needed.
- Server-side rendering is needed.
- CPT, taxonomy or custom field declarations belong outside the theme.
- Functionality should survive theme changes.

## LightSpeed expected structure

```text
/wp-content/plugins/client-blocks/
├── languages/
├── docs/
├── inc/
├── plugin/
├── scf-json/
├── templates/
├── src/
├── src/blocks/
├── build/
├── plugin-name.php
└── functions.php
```

## Block requirements table

| Block | Purpose | Source component | Attributes/data | Render method | Editor controls | QA notes |
|---|---|---|---|---|---|---|

## Technical notes

- Use `block.json` registration where practical.
- Keep frontend/editor assets scoped.
- Document dependencies.
- Include accessibility labels and keyboard behaviour.
- Define deprecation/migration notes for block changes.
