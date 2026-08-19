# Context Detection Technical Guide

This document provides a technical deep-dive into how the PRD Agent v2.1 automatically detects project types and adapts PRD sections accordingly.

---

## Detection Algorithm

The agent uses a decision tree to identify project type:

```
Repository Scan
    ↓
[Check for plugin.php]
    ├─ Yes → Check for blocks/
    └─ No  → Check for theme.json
    ↓
[Check for blocks/]
    ├─ Yes → PLUGIN DETECTED
    └─ No  → Continue
    ↓
[Check for theme.json]
    ├─ Yes → Check for templates/
    └─ No  → Ask user
    ↓
[Check for templates/]
    ├─ Yes → THEME DETECTED
    └─ No  → Continue
    ↓
[Check for both plugin.php AND theme.json]
    ├─ Yes → HYBRID DETECTED
    └─ No  → Ask for clarification
```

---

## File Markers

### Block Plugin Detection

- ✓ `plugin.php` in root
- ✓ `blocks/` folder with block definitions
- ✓ `blocks/*/block.json` (block registration)
- ✓ `blocks/*/index.js` (block script)

### Block Theme Detection

- ✓ `theme.json` in root (FSE configuration)
- ✓ `templates/` folder with template files
- ✓ `patterns/` folder (optional, block patterns)
- ✓ `functions.php` for theme setup

### Hybrid Project Detection

- ✓ Both `plugin.php` AND `theme.json`
- ✓ Both `blocks/` AND `templates/` folders
- ✓ Plugin + theme functionality present

---

## Validation Questions

Once detected, the agent confirms:

```
I detected a Block Plugin based on:
  ✓ plugin.php found
  ✓ blocks/ folder with definitions

Confirm assumptions:
1. Target WordPress Version: 6.4+ / 6.5+ / 6.6+ ?
2. Minimum PHP Version: 7.4 / 8.0+ ?
3. Key Dependencies?
4. Core Focus?

Proceed with Block Plugin PRD sections?
```

---

## PRD Section Adaptation

### Block Plugin → Includes

- ✓ Block Inventory
- ✓ Block Registration & Settings
- ✓ Hooks & Filters
- ✓ WordPress Compatibility Matrix
- ✗ Theme Settings
- ✗ Template Hierarchy

### Block Theme → Includes

- ✓ Theme Settings & Design Tokens
- ✓ Block Patterns
- ✓ Template System
- ✓ Full Site Editing Support
- ✓ Browser Support Matrix
- ✗ Block Inventory
- ✗ Custom Hooks

### Hybrid → Includes

- ✓ Plugin Section (blocks, hooks, dependencies)
- ✓ Theme Section (settings, patterns, templates)
- ✓ Shared Sections (compatibility matrix, interdependencies, testing)

---

## Related Documentation

- **[README.md](README.md)** — Usage examples for each project type
- **[ORGANIZATION_CONTEXT.md](ORGANIZATION_CONTEXT.md)** — Org-wide portability
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** — GitHub workflows and CI/CD

---

**Built by 🧱 LightSpeedWP for WordPress project context detection**
