# INLINE-YAML.md

LightSpeedWP **YAML** documentation standards (GitHub Actions, configs).

## Principles
- YAML supports comments with `#` – document intent for non-obvious steps.
- Prefer explicit values over implicit truthy/falsey.
- Use anchors/aliases for repeated blocks when helpful.

## GitHub Actions example
```yaml
name: CI
on:
  pull_request:
    paths: [ "**/*.php", "**/*.js" ]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      # Install and run lint
      - run: npm ci && npm run lint
```
