# Markdownlint CLI2 Configuration

Documentation for the markdownlint CLI2 tool configuration used in LightSpeed projects for Markdown file validation and linting.

## Table of Contents

- [Configuration Files](#configuration-files)
- [Setup](#setup)
- [Rules & Standards](#rules--standards)
- [Usage](#usage)
- [Integration](#integration)
- [Troubleshooting](#troubleshooting)

## Configuration Files

### `.markdownlint-cli2.config.cjs` (Main Configuration)

**File:** `.markdownlint-cli2.config.cjs`

The CLI2 configuration file controls how markdownlint-cli2 discovers and processes Markdown files.

```javascript
module.exports = {
  globs: ["**/*.md"],
  ignores: [
    "node_modules",
    ".git",
    "vendor",
    "build",
    "dist",
    "coverage",
    "logs",
    "playwright-report",
  ],
  config: {
    extends: "default",
    rules: {
      // Heading rules
      "heading-style": "consistent",
      "no-duplicate-heading": true,
      "heading-increment": true,

      // List rules
      "list-consistency": {
        style: "asterisk",
      },
      "ul-indent": {
        indent: 2,
      },

      // Line length (warning, not error)
      "line-length": {
        line_length: 120,
        heading_line_length: 120,
        headers: true,
        code_blocks: false,
        code_lines: false,
        headers: false,
        uri_schemes: ["http", "https"],
      },

      // Other rules
      "no-trailing-spaces": true,
      "no-trailing-punctuation": false,
      "ol-prefix": { style: "one" },
      "blanks-around-headings": true,
      "blanks-around-lists": true,
      "no-hard-tabs": true,
    },
  },
};
```

### `.markdownlint.jsonc` (IDE Integration)

**File:** `.markdownlint.jsonc`

Separate config file for IDE integration and VS Code extension:

```jsonc
{
  "extends": "default",
  "rules": {
    "line-length": {
      "line_length": 120,
      "heading_line_length": 120,
      "headers": true,
      "code_blocks": false,
    },
    "heading-style": "consistent",
    "list-consistency": {
      "style": "asterisk",
    },
    "ul-indent": {
      "indent": 2,
    },
    "no-trailing-spaces": true,
    "blanks-around-headings": true,
    "blanks-around-lists": true,
  },
  "ignores": ["node_modules", ".git", "vendor", "logs"],
}
```

## Setup

### Installation

```bash
# Install markdownlint-cli2
npm install --save-dev markdownlint-cli2

# Also install markdownlint for IDE support
npm install --save-dev markdownlint
```

### npm Script

```json
{
  "scripts": {
    "lint:md": "markdownlint-cli2 --config .markdownlint-cli2.config.cjs",
    "format:md": "markdownlint-cli2 --config .markdownlint-cli2.config.cjs --fix"
  }
}
```

### VS Code Extension Setup

1. Install **markdownlint** extension (David Anson)
2. VS Code will automatically detect `.markdownlint.jsonc`
3. Warnings appear inline as you edit

## Rules & Standards

### Core LightSpeed Markdown Standards

| Rule                       | Setting             | Purpose                                   |
| -------------------------- | ------------------- | ----------------------------------------- |
| **heading-style**          | consistent          | Uniform heading format (ATX style: #, ##) |
| **line-length**            | 120 chars (warning) | Readable line width                       |
| **list-consistency**       | asterisk (\*)       | Consistent list markers                   |
| **ul-indent**              | 2 spaces            | Proper list indentation                   |
| **no-trailing-spaces**     | enabled             | Clean lines                               |
| **blanks-around-headings** | enabled             | Proper spacing                            |
| **blanks-around-lists**    | enabled             | Separation clarity                        |

### Markdown Best Practices

**Headings:**

```markdown
# Main Title (H1)

## Section (H2)

### Subsection (H3)

# Correct

- Only one H1 per document
- Don't skip levels (H1 → H3 skips H2)
```

**Lists:**

```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested
- Item 3

# Correct format

- Use asterisks (\*)
- Indent nested lists with 2 spaces
- Add blank lines before/after lists
```

**Line Length:**

```markdown
This is a paragraph that should wrap at 120 characters but is okay if
it goes a bit longer for code or important content.

Code blocks and URIs are exempt from line length rules.
```

## Usage

### Run Linting

```bash
# Lint all Markdown files
npm run lint:md

# Or directly with CLI2
markdownlint-cli2 --config .markdownlint-cli2.config.cjs

# Lint specific file
markdownlint-cli2 README.md

# Verbose output
markdownlint-cli2 --verbose
```

### Auto-Fix Issues

```bash
# Fix all fixable issues
npm run format:md

# Or directly
markdownlint-cli2 --config .markdownlint-cli2.config.cjs --fix

# Fix specific file
markdownlint-cli2 --fix README.md
```

## Integration

### GitHub Actions Workflow

```yaml
name: Lint • Markdown

on:
  push:
    paths:
      - "**/*.md"
  pull_request:
    paths:
      - "**/*.md"

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm install
      - run: npm run lint:md
```

### Husky Pre-commit Hook

```bash
npx husky add .husky/pre-commit "npm run lint:md"
```

### Combined Linting

```json
{
  "scripts": {
    "lint": "npm run lint:js && npm run lint:css && npm run lint:yaml && npm run lint:pkg-json",
    "lint:all": "npm run lint && npm run lint:md"
  }
}
```

## Troubleshooting

### Common Issues

#### "heading-level-increment"

**Cause:** Skipping heading levels (H1 → H3)

**Solution:** Use consecutive heading levels:

```markdown
# Wrong

# Heading

### Subheading (skipped H2)

# Correct

# Heading

## Subheading
```

#### "list-consistency"

**Cause:** Using different list markers (-, \*, +)

**Solution:** Use asterisks throughout:

```markdown
# Wrong

- Item 1

* Item 2

- Item 3

# Correct

- Item 1
- Item 2
- Item 3
```

#### "no-hard-tabs"

**Cause:** Using tabs instead of spaces

**Solution:** Use spaces for indentation:

```markdown
# Wrong

- Item (tab used)

# Correct

- Item (spaces used)
```

#### "no-trailing-spaces"

**Cause:** Whitespace at end of lines

**Solution:** Remove trailing whitespace:

```bash
# Auto-fix with format
npm run format:md
```

#### "line-length"

**Cause:** Lines exceed 120 characters

**Solution:** Wrap long lines or break into multiple lines:

```markdown
# Acceptable for URLs and code blocks

[Link to very long URL](https://example.com/very/long/path/to/resource)

# Otherwise break lines

This is a long paragraph that should be
wrapped at a reasonable character limit.
```

### Validation

Test your Markdown:

- [Markdown Lint](https://www.markdownlint.com/)
- [Online Markdown Editor](https://dillinger.io/)

## Related Documentation

- [Prettier Configuration](./lint-prettier.md) - Code formatting
- [Linting Overview](../LINTING.md) - All linting tools
- [npm Scripts](./npm-scripts.md) - Available commands
- [Documentation Formats](../../instructions/documentation-formats.instructions.md) - Markdown/frontmatter/Mermaid guidelines
