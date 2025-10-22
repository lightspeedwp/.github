# Stylelint Configuration

## 🎨 CSS & SCSS Linting for WordPress Standards

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [WordPress Integration](#wordpress-integration)
- [Configuration Files](#configuration-files)
- [Usage](#usage)
- [Integration](#integration)

## Overview

**Stylelint** enforces consistent CSS and SCSS coding standards across LightSpeed WordPress projects. Our configuration extends **WordPress Stylelint Config** to ensure compliance with official WordPress CSS coding standards.

> **💡 Key Benefits:** Consistent styling, automatic error detection, WordPress compliance, team collaboration

## Installation & Configuration

### **Quick Setup**

```bash
# Install Stylelint and WordPress config
npm install --save-dev stylelint @wordpress/stylelint-config

# Create configuration file
echo 'module.exports = { extends: ["@wordpress/stylelint-config"] };' > stylelint.config.js
```

### **Configuration File Example**

```javascript
// stylelint.config.js
module.exports = {
  extends: ['@wordpress/stylelint-config'],
  rules: {
    // Custom rules can override WordPress defaults
    'selector-class-pattern': '^[a-z]([a-z0-9-]+)?(__[a-z0-9-]+)?(--[a-z0-9-]+)?$',
    'max-nesting-depth': 3,
  },
};
```

## WordPress Integration

### **WordPress CSS Standards**

- ✅ **Class naming:** Use lowercase with hyphens (`.my-class`)
- ✅ **Indentation:** 4 spaces (matches WordPress PHP standards)
- ✅ **Property order:** Alphabetical within logical groups
- ✅ **Vendor prefixes:** Auto-handled by PostCSS Autoprefixer

### **Package.json Scripts**

```json
{
  "scripts": {
    "lint:css": "stylelint 'src/**/*.{css,scss}'",
    "lint:css:fix": "stylelint 'src/**/*.{css,scss}' --fix",
    "format:css": "stylelint 'src/**/*.{css,scss}' --fix"
  }
}
```

## Configuration Files

### **Primary Configuration**

| File | Purpose | Location |
|------|---------|----------|
| `stylelint.config.js` | Main configuration | Project root |
| `.stylelintignore` | Files to ignore | Project root |
| `package.json` | Scripts and dependencies | Project root |

### **Dependencies**

```json
{
  "devDependencies": {
    "stylelint": "^14.16.0",
    "@wordpress/stylelint-config": "^21.0.0",
    "stylelint-config-prettier": "^9.0.0"
  }
}
```

## Usage

### **Command Line**

```bash
# Lint all CSS/SCSS files
npx stylelint "src/**/*.{css,scss}"

# Auto-fix issues
npx stylelint "src/**/*.{css,scss}" --fix

# Check specific file
npx stylelint src/style.css
```

### **VS Code Integration**

```json
// .vscode/settings.json
{
  "stylelint.validate": ["css", "scss"],
  "css.validate": false,
  "scss.validate": false
}
```

## Integration

**Related Configuration:**

- **[ESLint Configuration](./lint-eslint.md)** - JavaScript linting setup  
- **[Prettier Configuration](./lint-prettier.md)** - Code formatting rules  
- **[PostCSS Configuration](./project-postcss.md)** - CSS processing pipeline  
- **[Package.json Scripts](./npm-scripts.md)** - Build and lint commands  

---

> **Next Steps:** Set up PostCSS for autoprefixing and CSS optimization → [project-postcss.md](./project-postcss.md)
