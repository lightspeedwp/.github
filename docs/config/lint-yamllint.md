# YAML Linting Configuration (yamllint)

Documentation for YAML file linting and validation used in LightSpeed projects, including GitHub workflows, GitHub Actions configurations, and other YAML files.

## Table of Contents

- [Configuration Files](#configuration-files)
- [Setup](#setup)
- [Rules & Standards](#rules--standards)
- [Usage](#usage)
- [Integration](#integration)
- [Troubleshooting](#troubleshooting)

## Configuration Files

### `.yamllint.config.cjs` (Main Configuration)

**File:** `.yamllint.config.cjs`

The main yamllint configuration file controls all YAML linting behavior across the project.

```javascript
module.exports = {
  extends: 'default',
  rules: {
    // Indentation: 2 spaces for YAML
    indentation: {
      spaces: 2,
      indent-sequences: true,
      check-multi-line-strings: false,
    },
    // Line length: Maximum 120 characters
    line-length: {
      max: 120,
      level: 'warning',
    },
    // Comments: Proper spacing required
    comments: {
      min-spaces-from-content: 2,
    },
    // No trailing spaces
    trailing-spaces: 'enable',
    // Properly formatted key-value pairs
    key-duplicates: 'enable',
    // Require proper document start
    document-start: 'disable',
    // No multiple documents in single file
    document-end: 'disable',
  },
};
```

### `.spectralignore`

Files and patterns to exclude from yamllint processing:

```
node_modules/
.git/
vendor/
build/
dist/
coverage/
```

## Setup

### Installation

```bash
# Install yamllint via npm
npm install --save-dev yamllint

# Or install via Homebrew (system-wide)
brew install yamllint
```

### npm Script

```json
{
  "scripts": {
    "lint:yaml": "yamllint '.github/workflows/**/*.yml' '**/*.yaml' --config-file .yamllint.config.cjs"
  }
}
```

## Rules & Standards

### Core Rules

| Rule                | Setting                          | Purpose                    |
| ------------------- | -------------------------------- | -------------------------- |
| **indentation**     | 2 spaces, indent-sequences: true | Consistent YAML formatting |
| **line-length**     | max: 120 chars (warning)         | Readable file length       |
| **comments**        | min 2 spaces from content        | Proper comment spacing     |
| **trailing-spaces** | enabled                          | Clean file endings         |
| **key-duplicates**  | enabled                          | Prevent duplicate keys     |
| **document-start**  | disabled                         | Allow files without `---`  |
| **document-end**    | disabled                         | Allow files without `...`  |

### WordPress-Specific YAML Standards

GitHub Workflows (.github/workflows/\*.yml):

```yaml
# Correct indentation and structure
name: Lint • Discussions, Issues & PRs

on:
  pull_request:
    branches: [develop]
  push:
    branches: [develop]

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
```

## Usage

### Run Linting

```bash
# Lint all YAML files in workflows
npm run lint:yaml

# Or directly with yamllint
yamllint .github/workflows/*.yml

# Lint specific file
yamllint .github/workflows/lint.yml

# Verbose output
yamllint -d {extends: default, rules: {line-length: {max: 120}}} .github/workflows/
```

### Fix Issues

Most yamllint issues can be auto-fixed with formatting tools:

```bash
# Use Prettier to format YAML
npm run format:yaml

# Or manually edit files to match indentation standards
```

### Integration with Spectral

For GitHub Actions workflow validation, also use Spectral:

```bash
npm run lint:workflows
```

## Integration

### GitHub Actions Workflow

Add yamllint check to CI/CD pipeline:

```yaml
name: Lint • YAML

on:
  push:
    paths:
      - "**/*.yml"
      - "**/*.yaml"
      - ".yamllint.config.cjs"
  pull_request:
    paths:
      - "**/*.yml"
      - "**/*.yaml"

jobs:
  yamllint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint YAML
        run: npm run lint:yaml
```

### VS Code Integration

Install the **YAML** extension and configure:

```json
{
  "[yaml]": {
    "editor.defaultFormatter": "redhat.vscode-yaml",
    "editor.formatOnSave": true,
    "editor.tabSize": 2
  },
  "yaml.schemas": {
    "https://json.schemastore.org/github-workflow.json": ".github/workflows/*.yml"
  }
}
```

### Husky Pre-commit Hook

Add YAML linting to pre-commit:

```bash
npx husky add .husky/pre-commit "npm run lint:yaml"
```

## Troubleshooting

### Common Issues

#### "too many spaces after colon"

**Cause:** Incorrect spacing after colons in YAML

**Solution:** Use single space after colons:

```yaml
# Wrong
key  :  value

# Correct
key: value
```

#### "wrong indentation: expected 2 but found 4"

**Cause:** Using 4 spaces instead of 2 spaces

**Solution:** Use 2-space indentation throughout:

```yaml
# Wrong
jobs:
    lint:
        runs-on: ubuntu-latest

# Correct
jobs:
  lint:
    runs-on: ubuntu-latest
```

#### "line too long"

**Cause:** Line exceeds 120 character limit

**Solution:** Break long strings:

```yaml
# Wrong
- run: npm run lint:js && npm run lint:css && npm run lint:yaml

# Correct
- run: |
    npm run lint:js
    npm run lint:css
    npm run lint:yaml
```

#### "missing document start"

**Cause:** File doesn't start with `---`

**Solution:** This is disabled in LightSpeed config, but if needed:

```yaml
---
name: Workflow Name
```

### Validation

Validate your YAML syntax online:

- [YAML Validator](http://www.yamllint.com/)
- [JSON Schema Store](https://www.schemastore.org/) for GitHub workflow schemas

## Related Documentation

- [Spectral Configuration](./workflow-spectral.md) - Advanced YAML/workflow validation
- [Linting Overview](../LINTING.md) - All linting tools and standards
- [npm Scripts](./npm-scripts.md) - Available npm commands
- [GitHub Workflows](../WORKFLOWS.md) - Workflow best practices
