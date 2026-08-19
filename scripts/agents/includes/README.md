---
title: Agent Includes Directory
description: Shared utility modules for LightSpeedWP automation agents
version: '1.3'
last_updated: "2026-08-19"
file_type: documentation
---

# Agent Includes Directory

This directory contains **shared utility modules** used by multiple automation agents across the LightSpeedWP organization. These are NOT standalone agents themselves, but reusable libraries that provide common functionality.

## Purpose

- **Modularity**: Reusable code shared across multiple agents
- **Maintainability**: Single source of truth for common operations
- **Testability**: Centralized testing of shared functionality
- **Consistency**: Standardized approaches to common tasks

## Key Principle: Agents vs Utilities

### ❌ NOT Agents (Don't add `.agent.js` suffix)

Files in this directory are **utilities/libraries**, not standalone agents. They should:

- Be named descriptively (e.g., `report-writer.js`, `label-utils.js`)
- Export functions that other modules can import
- Have corresponding test files in `__tests__/`
- Be documented with JSDoc comments

### ✅ Are Agents (Use `.agent.js` suffix)

Files in the parent `agents/` directory are **executable agents** that:

- Have a main execution function
- Can be run directly via workflows
- Orchestrate multiple utilities from this includes folder
- Have corresponding `.agent.md` specification files

## Available Utilities

| Utility              | Purpose                                     | Used By                        |
| -------------------- | ------------------------------------------- | ------------------------------ |
| `report-writer.js`   | Generate Markdown reports for labeling runs | `labeling.agent.js`, workflows |
| `label-utils.js`     | Label manipulation and validation           | Multiple labeling agents       |
| `label-lookup.js`    | Label alias resolution and canonicalization | `labeling.agent.js`            |
| `label-reporting.js` | Label analytics and reporting               | Labeling workflows             |
| `status-enforcer.js` | One-hot label enforcement                   | `labeling.agent.js`            |
| `readmeUtils.js`     | README file discovery and updates           | `manage-readmes.agent.js`      |
| `badgeUtils.js`      | Badge generation and management             | `meta.agent.js`                |
| `footerUtils.js`     | Footer generation and insertion             | `meta.agent.js`                |
| `yaml-parser.js`     | YAML configuration parsing                  | Multiple agents                |
| `yaml-validator.js`  | Schema validation for YAML files            | Validation workflows           |

## Usage Example

```javascript
// In an agent file: ../my-agent.agent.js
const { generateReport } = require("./includes/report-writer.js");
const { findReadmeFiles } = require("./includes/readmeUtils.js");

async function run() {
  const readmes = findReadmeFiles(".");
  // ... process readmes
  const report = generateReport(telemetryData);
  console.log(report);
}
```

## Testing

Each utility should have comprehensive tests in `__tests__/`:

```bash
# Run all utility tests
npm run test:js

# Run specific utility tests
jest includes/__tests__/report-writer.test.js
```

## Adding New Utilities

When creating a new shared utility:

1. **Name it descriptively** without `.agent.js` suffix
2. **Add JSDoc** documentation for all exported functions
3. **Create tests** in `__tests__/[name].test.js`
4. **Update this README** with the new utility
5. **Export functions** using CommonJS or ES modules consistently

## File Organization

```
includes/
├── __tests__/               # Test files for utilities
│   ├── report-writer.test.js
│   ├── label-utils.test.js
│   └── ...
├── report-writer.js         # Report generation utilities
├── label-utils.js           # Label manipulation utilities
├── readmeUtils.js           # README file utilities
├── badgeUtils.js            # Badge generation utilities
└── README.md               # This file
```

## References

- [Agent Directory](../../../agents/agent.md) - Main agent index
- [Coding Standards](../../../instructions/coding-standards.instructions.md)
- [Quality Assurance](../../../instructions/quality-assurance.instructions.md)
- [Automation & Workflows](../../../docs/AUTOMATION.md)

---

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

## Repository Flow

```mermaid
graph LR
    A["Scope"] --> B["Inputs"]
    B --> C["Process"]
    C --> D["Validation"]
    D --> E["Outputs"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```
