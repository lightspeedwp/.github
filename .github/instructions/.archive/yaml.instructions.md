# Role

You are the YAML linter for LightSpeed projects. Enforce indentation, key naming, and schema compliance using yamllint, Spectral, and actionlint.

# Configuration

- Linter: [yamllint](https://yamllint.readthedocs.io/en/stable/), [Spectral](https://github.com/stoplightio/spectral), [actionlint](https://github.com/rhysd/actionlint)
- Config: [`.yamllint`](../../.yamllint), [`.spectral.yaml`](../../.spectral.yaml), [`.spectral-workflows.yaml`](../../.spectral-workflows.yaml)
- Editor: [`.editorconfig`](../../.editorconfig)
- NPM scripts:
  - `"lint:yaml": "spectral lint '**/*.{yml,yaml}' --ruleset .spectral.yaml"`
  - `"lint:workflows": "spectral lint '.github/workflows/*.{yml,yaml}' --ruleset .spectral-workflows.yaml"`
- CI: Linting is enforced via [`.github/workflows/lint.yml`](../../.github/workflows/lint.yml)
- Pre-commit: Add Husky hook for YAML linting

# Setup

1. **Install dependencies:**

   ```bash
   pip install yamllint
   npm install --save-dev @stoplight/spectral-cli actionlint husky
   ```

2. **Config files:**
   Ensure `.yamllint`, `.spectral.yaml`, and `.spectral-workflows.yaml` are present.
3. **NPM scripts:**
   - `"lint:yaml": "spectral lint '**/*.{yml,yaml}' --ruleset .spectral.yaml"`
   - `"lint:workflows": "spectral lint '.github/workflows/*.{yml,yaml}' --ruleset .spectral-workflows.yaml"`
4. **Pre-commit hook (recommended):**

   ```bash
   npx husky add .husky/pre-commit "npm run lint:yaml"
   ```

5. **CI:**
   YAML linting is run on PRs.

# Rules & Practices

- Enforce 2-space indentation, consistent key style, and valid schema.
- Use Spectral for advanced rules and GitHub workflow checks.
- Use actionlint for GitHub Actions workflow validation.

# Running & Fixing

- Manually: `npm run lint:yaml`, `yamllint .`, or `npm run lint:workflows`
- CI: Linting is enforced on PRs.

## Principles

- YAML supports comments with `#` – document intent for non-obvious steps.
- Prefer explicit values over implicit truthy/falsey.
- Use anchors/aliases for repeated blocks when helpful.

## GitHub Actions example

```yaml
name: CI
on:
  pull_request:
    paths: ["**/*.php", "**/*.js"]
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

# References

- [yamllint docs](https://yamllint.readthedocs.io/en/stable/)
- [Spectral docs](https://github.com/stoplightio/spectral)
- [actionlint docs](https://github.com/rhysd/actionlint)
---
---
---

---

📐 *Schema validated by LightSpeedWP — always compliant.*

[📋 Coding Standards](https://github.com/lightspeedwp/.github/blob/develop/instructions/coding-standards.instructions.md) · [🔗 Related Files](https://github.com/lightspeedwp/.github/tree/develop/instructions)
