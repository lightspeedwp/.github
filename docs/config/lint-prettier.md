# Prettier Configuration

## ✨ Automated Code Formatting for Consistency

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [WordPress Integration](#wordpress-integration)
- [Configuration Rules](#configuration-rules)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**Prettier** automatically formats JavaScript, CSS, Markdown, and JSON files to ensure consistent code style across LightSpeed WordPress projects. Our configuration extends WordPress Prettier standards.

> **💡 Key Benefits:** Zero-config formatting, consistent style, reduced code review discussions, team collaboration

## Installation & Configuration

### **Quick Setup**

```bash
# Install Prettier and WordPress config
npm install --save-dev prettier @wordpress/prettier-config

# Create configuration file
echo '"@wordpress/prettier-config"' > .prettierrc.json
```

### **Configuration File Example**

```javascript
// .prettierrc.js
module.exports = {
  ...require('@wordpress/prettier-config'),
  // Custom overrides
  tabWidth: 4,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
};
```

## WordPress Integration

### **WordPress Prettier Standards**

- ✅ **Tabs:** 4 spaces (matches WordPress PHP standards)
- ✅ **Quotes:** Single quotes for strings
- ✅ **Semicolons:** Required
- ✅ **Trailing commas:** ES5-compatible
- ✅ **Line endings:** LF (Unix-style)

### **Package.json Configuration**

```json
{
  "prettier": "@wordpress/prettier-config",
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,scss,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,css,scss,md}\"",
    "format:js": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\"",
    "format:css": "prettier --write \"src/**/*.{css,scss}\""
  }
}
```

## Configuration Rules

### **File Type Support**

| File Type | Extensions | Purpose |
|-----------|------------|----------|
| JavaScript | `.js`, `.jsx`, `.ts`, `.tsx` | Code formatting |
| Stylesheets | `.css`, `.scss`, `.less` | Style formatting |
| Markup | `.html`, `.vue` | Template formatting |
| Data | `.json`, `.yaml`, `.yml` | Config formatting |
| Documentation | `.md`, `.mdx` | Docs formatting |

### **Custom Rules Example**

```javascript
// .prettierrc.js - Custom WordPress config
module.exports = {
  // WordPress defaults
  tabWidth: 4,
  useTabs: false,
  singleQuote: true,
  
  // Project-specific overrides
  printWidth: 80,
  trailingComma: 'all',
  bracketSameLine: false,
  
  // File-specific overrides
  overrides: [
    {
      files: '*.md',
      options: {
        tabWidth: 2,
        printWidth: 100
      }
    }
  ]
};
```

## Usage

### **Command Line**

```bash
# Format all supported files
npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,scss,md}"

# Check formatting without changing files
npx prettier --check "src/**/*.{js,jsx,ts,tsx,css,scss,md}"

# Format specific file
npx prettier --write src/index.js

# Use ignore file
npx prettier --write . --ignore-path .prettierignore
```

### **VS Code Integration**

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.requireConfig": true
}
```

### **Ignore Files**

```bash
# .prettierignore
node_modules/
build/
dist/
*.min.js
*.min.css
vendor/
.wp-env/
```

## Integration

**Related Configuration:**

- **[ESLint Configuration](./lint-eslint.md)** - JavaScript linting with Prettier integration  
- **[Stylelint Configuration](./lint-stylelint.md)** - CSS linting with Prettier compatibility  
- **[VS Code Settings](./vscode-settings.md)** - Editor formatting setup  
- **[Husky Configuration](./workflow-husky.md)** - Pre-commit formatting hooks  

---

> **Next Steps:** Set up ESLint + Prettier integration → [lint-eslint.md](./lint-eslint.md)
