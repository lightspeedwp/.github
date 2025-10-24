# NPM Dependencies Configuration

## 📦 Package Management & Dependency Strategy

## Table of Contents

- [Overview](#overview)
- [Dependency Categories](#dependency-categories)
- [WordPress Dependencies](#wordpress-dependencies)
- [Version Management](#version-management)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**NPM Dependencies** define the packages required for LightSpeed WordPress projects. Our strategy emphasizes WordPress-first packages, security, and maintainable version management.

> **💡 Key Benefits:** WordPress compatibility, security updates, predictable builds, team consistency

## Dependency Categories

### **Production Dependencies**

```json
{
  "dependencies": {
    "@wordpress/i18n": "^4.0.0",
    "@wordpress/blocks": "^12.0.0",
    "@wordpress/block-editor": "^12.0.0",
    "@wordpress/components": "^25.0.0",
    "@wordpress/element": "^5.0.0",
    "@wordpress/data": "^9.0.0"
  }
}
```

### **Development Dependencies**

```json
{
  "devDependencies": {
    "@wordpress/scripts": "^26.0.0",
    "@wordpress/eslint-plugin": "^17.0.0",
    "@wordpress/stylelint-config": "^21.0.0",
    "@wordpress/prettier-config": "^3.0.0",
    "jest": "^29.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### **Peer Dependencies**

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lodash": "^4.17.0"
  }
}
```

## WordPress Dependencies

### **Core WordPress Packages**

| Package | Purpose | Usage |
|---------|---------|-------|
| `@wordpress/scripts` | Build toolchain | Development |
| `@wordpress/blocks` | Block registration | Block development |
| `@wordpress/element` | React wrapper | Component development |
| `@wordpress/components` | UI components | Interface building |
| `@wordpress/data` | State management | Data handling |
| `@wordpress/i18n` | Internationalization | Text translation |

### **Essential WordPress Setup**

```json
{
  "dependencies": {
    "@wordpress/i18n": "^4.0.0",
    "@wordpress/blocks": "^12.0.0",
    "@wordpress/block-editor": "^12.0.0",
    "@wordpress/components": "^25.0.0",
    "@wordpress/element": "^5.0.0",
    "@wordpress/data": "^9.0.0",
    "@wordpress/api-fetch": "^6.0.0",
    "@wordpress/url": "^3.0.0"
  },
  "devDependencies": {
    "@wordpress/scripts": "^26.0.0",
    "@wordpress/env": "^8.0.0",
    "@wordpress/eslint-plugin": "^17.0.0",
    "@wordpress/stylelint-config": "^21.0.0",
    "@wordpress/prettier-config": "^3.0.0",
    "@wordpress/babel-preset-default": "^7.0.0",
    "@wordpress/browserslist-config": "^5.0.0"
  }
}
```

### **Testing & Quality Assurance**

```json
{
  "devDependencies": {
    "@wordpress/jest-preset-default": "^11.0.0",
    "@wordpress/jest-console": "^7.0.0",
    "@wordpress/e2e-test-utils-playwright": "^1.32.0",
    "jest": "^29.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.0.0",
    "stylelint": "^14.16.0",
    "markdownlint-cli": "^0.37.0"
  }
}
```

## Version Management

### **Version Pinning Strategy**

```json
{
  "dependencies": {
    "@wordpress/scripts": "26.19.0",
    "react": "^18.2.0",
    "lodash": "~4.17.21"
  }
}
```

**Version Ranges:**

- **Exact (`26.19.0`)**: Critical packages, WordPress Scripts
- **Caret (`^18.2.0`)**: Minor updates allowed, React ecosystem
- **Tilde (`~4.17.21`)**: Patch updates only, utilities

### **Security & Updates**

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "outdated": "npm outdated",
    "update:check": "ncu",
    "update:interactive": "ncu -i"
  },
  "devDependencies": {
    "npm-check-updates": "^16.0.0"
  }
}
```

### **Lock File Management**

```bash
# Use npm ci for reproducible installs
npm ci

# Update lock file
npm install

# Check for security issues
npm audit

# Fix security vulnerabilities
npm audit fix
```

## Usage

### **Installation Commands**

```bash
# Install all dependencies
npm install

# Install production only
npm ci --production

# Add new dependency
npm install @wordpress/api-fetch

# Add dev dependency
npm install --save-dev @playwright/test

# Update specific package
npm update @wordpress/scripts
```

### **Dependency Analysis**

```bash
# List installed packages
npm list

# Check for outdated packages
npm outdated

# Analyze bundle size
npx webpack-bundle-analyzer build/static/js/*.js

# Check for duplicate packages
npx npm-check-duplicates
```

### **Package.json Maintenance**

```bash
# Sort dependencies alphabetically
npx sort-package-json

# Clean unused dependencies
npx depcheck

# Interactive dependency updates
npx npm-check -u
```

## Integration

**Related Configuration:**

- **[Package.json Configuration](./npm-package-json.md)** - Main package configuration file  
- **[NPM Scripts](./npm-scripts.md)** - Build and development commands  
- **[VS Code Settings](./vscode-settings.md)** - Editor package management  
- **[Husky Configuration](./workflow-husky.md)** - Dependency validation hooks  

---

> **Next Steps:** Update the main README with all new configuration files → [README.md](./README.md)
