# Markdownlint Configuration

## 📝 Markdown Linting & Documentation Standards

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [Configuration Rules](#configuration-rules)
- [WordPress Integration](#wordpress-integration)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**Markdownlint** ensures consistent markdown formatting across documentation, README files, and project docs. Our configuration enforces LightSpeed documentation standards while maintaining readability and GitHub compatibility.

> **💡 Key Benefits:** Consistent docs, improved readability, automated formatting, team collaboration

## Installation & Configuration

### **Quick Setup**

```bash
# Install markdownlint CLI
npm install --save-dev markdownlint-cli

# Create configuration
echo '{ "extends": "markdownlint/style/prettier" }' > .markdownlint.json
```

### **Configuration File Example**

```json
// .markdownlint.json
{
  "extends": "markdownlint/style/prettier",
  "MD013": { "line_length": 100 },
  "MD033": { "allowed_elements": ["details", "summary", "br"] },
  "MD041": false
}
```

## Configuration Rules

### **Key Rules Enabled**

| Rule | Description | Why Important |
|------|-------------|---------------|
| `MD001` | Heading levels increment by one | Logical document structure |
| `MD022` | Headings surrounded by blank lines | Visual separation |
| `MD025` | Single top-level heading | Clear document hierarchy |
| `MD032` | Lists surrounded by blank lines | Improved readability |
| `MD036` | No emphasis as heading | Semantic correctness |

### **Customized Rules**

```json
{
  "MD013": { "line_length": 100, "code_blocks": false },
  "MD033": { "allowed_elements": ["details", "summary", "br", "kbd"] },
  "MD041": false,
  "MD046": { "style": "fenced" }
}
```

## WordPress Integration

### **Documentation Standards**

- ✅ **File naming:** Use lowercase with hyphens (`my-guide.md`)
- ✅ **Heading structure:** Start with `#` (h1), increment logically
- ✅ **Code blocks:** Use fenced blocks with language specification
- ✅ **Links:** Use reference-style for external links

### **Package.json Scripts**

```json
{
  "scripts": {
    "lint:md": "markdownlint '**/*.md' --ignore node_modules",
    "lint:md:fix": "markdownlint '**/*.md' --ignore node_modules --fix",
    "format:md": "markdownlint '**/*.md' --ignore node_modules --fix"
  }
}
```

## Usage

### **Command Line**

```bash
# Lint all markdown files
npx markdownlint "**/*.md" --ignore node_modules

# Auto-fix issues
npx markdownlint "**/*.md" --ignore node_modules --fix

# Check specific file
npx markdownlint README.md

# Check with config
npx markdownlint --config .markdownlint.json *.md
```

### **VS Code Integration**

```json
// .vscode/settings.json
{
  "markdownlint.config": {
    "extends": ".markdownlint.json"
  },
  "[markdown]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "DavidAnson.vscode-markdownlint"
  }
}
```

## Integration

**Related Configuration:**

- **[ESLint Configuration](./lint-eslint.md)** - JavaScript linting setup  
- **[Prettier Configuration](./lint-prettier.md)** - Code formatting consistency  
- **[VS Code Settings](./vscode-settings.md)** - Editor integration  
- **[Husky Configuration](./workflow-husky.md)** - Pre-commit hooks  

---

> **Next Steps:** Set up pre-commit hooks for automatic linting → [workflow-husky.md](./workflow-husky.md)
