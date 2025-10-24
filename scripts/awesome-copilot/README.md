---
title: "Awesome Copilot Scripts & Utilities"
version: "v1.8"
last_updated: "2025-01-14"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Core utilities for managing, validating, and maintaining the Awesome Copilot prompt and collection system. Automated YAML processing, validation, and documentation generation."
type: "automation-utility"
status: "production"
tags: ["awesome-copilot", "collections", "prompts", "validation", "yaml", "nodejs", "automation"]
license: "GPL-3.0"
repository: "https://github.com/lightspeedwp/.github"
ai_references:
  - "Use for prompt collection management and validation workflows"
  - "YAML frontmatter processing and schema validation"
  - "Cross-platform line ending normalization utilities"
  - "README generation for collections and documentation"
related_files:
  - "schemas/collection.schema.json"
  - ".github/prompts/awesome-copilot/"
  - "scripts/includes/"
  - "scripts/utility/"
---

## 🎯 Awesome Copilot Scripts & Utilities

![Collection Management](https://img.shields.io/badge/collections-managed-brightgreen?style=flat-square)
![YAML Processing](https://img.shields.io/badge/yaml-validated-blue?style=flat-square)
![Cross Platform](https://img.shields.io/badge/platform-agnostic-orange?style=flat-square)
![Automation](https://img.shields.io/badge/automation-complete-success?style=flat-square)

This directory contains core utilities for managing, validating, and maintaining the Awesome Copilot prompt and collection system in the LightSpeedWP .github repository.

## 📊 Script Dependencies & Flow

```mermaid
graph TB
    A[Collection Management] --> B[create-collection.js]
    A --> C[validate-collections.js]
    A --> D[update-readme.js]
    A --> E[yaml-parser.js]
    A --> F[fix-line-endings.sh]
    
    G[Schema Validation] --> H[collection.schema.json]
    G --> C
    
    I[YAML Processing] --> E
    I --> C
    I --> B
    
    J[Documentation] --> D
    J --> K[README Generation]
    
    L[Cross-Platform] --> F
    L --> M[Line Ending Normalization]
    
    N[CI/CD Pipeline] --> C
    N --> F
    O[Pre-commit Hooks] --> C
    O --> F
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style I fill:#e8f5e8
    style J fill:#fff3e0
```

## Main Scripts

- **`create-collection.js`**
  - Creates new prompt collection files from templates or user input.
  - Used by: Maintainers when adding new prompt collections.

- **`fix-line-endings.sh`**
  - Normalises line endings in all prompt and collection files for cross-platform consistency.
  - Used by: All scripts that read/write prompt or collection files (pre-commit, CI, manual runs).

- **`update-readme.js`**
  - Generates or updates README files for Awesome Copilot collections and script folders.
  - Used by: Maintainers to keep documentation up to date; called by other scripts after changes.

- **`validate-collections.js`**
  - Validates the structure and schema of all prompt collection files against `schemas/collection.schema.json`.
  - Used by: CI, pre-commit hooks, and maintainers before merging changes.

- **`yaml-parser.js`**
  - Utility for parsing and validating YAML frontmatter in prompt and collection files.
  - Used by: `validate-collections.js`, `create-collection.js`, and any script that processes YAML frontmatter.

## How These Scripts Work Together

- `validate-collections.js` and `create-collection.js` both depend on `yaml-parser.js` for robust YAML handling.
- `fix-line-endings.sh` should be run before validation or collection creation to avoid cross-platform issues.
- `update-readme.js` is used to keep documentation current after any structural or content changes in collections or scripts.
- All scripts are designed to be modular and reusable in CI, pre-commit hooks, or manual workflows.

## Related Script Folders

- **`includes/`** — Shared shell and Bats helpers for test automation. Used by maintenance, utility, and validation scripts across the repo.
- **`utility/`** — General-purpose shell and Node.js utilities for label management, logging, and validation. Some label and logging scripts are used by Copilot and maintenance scripts.
- **`maintenance/`** — Automation for updating, validating, and generating `README.md` and `CHANGELOG.md` files. Scripts here often call or are called by `awesome-copilot` scripts for documentation consistency.
- **`json-validation/`** — Scripts for validating JSON and YAML files, used by `validate-collections.js` and other schema-related tools.

## Subfolders

If present, subfolders may contain:

- Additional prompt collections (see `collections/`)
- Test data or fixtures for validation
- Extended utilities for prompt management

Each subfolder should include its own `README.md` describing its contents and relationship to the main scripts above.

## Contribution & Standards

- All scripts must follow the [LightSpeedWP Coding Standards](../../.github/instructions/coding-standards.instructions.md).
- See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.
- For prompt and collection schema, see [`schemas/collection.schema.json`](../../schemas/collection.schema.json).

## 🔄 Collection Validation Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant LE as Line Endings Fix
    participant YP as YAML Parser
    participant Val as Validator
    participant Schema as Schema Check
    participant Readme as README Update
    
    Dev->>LE: fix-line-endings.sh
    LE->>YP: Process YAML files
    YP->>Val: validate-collections.js
    Val->>Schema: Check against schema
    Schema->>Val: Return validation results
    Val->>Readme: update-readme.js
    Readme->>Dev: Documentation updated
    
    Note over Dev,Readme: All steps automated in CI/CD
```

---

## 📚 References

### 🔗 Documentation Links

- [Awesome Copilot Collections](../../.github/prompts/awesome-copilot/)
- [Collection Schema Definition](../../schemas/collection.schema.json)
- [LightSpeedWP Coding Standards](../../.github/instructions/coding-standards.instructions.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)

### 🛠️ Development Resources

- [Shared Includes Directory](../includes/)
- [Utility Scripts](../utility/)
- [Maintenance Scripts](../maintenance/)
- [JSON Validation](../json-validation/)

### 🎯 AI & Automation

- [Custom Instructions](../../.github/custom-instructions.md)
- [Prompts Library](../../.github/prompts/prompts.md)
- [Agents Documentation](../../.github/agents/agent.md)
- [Chatmodes Index](../../.github/chatmodes/chatmodes.md)

## License

GPL v3. See [LICENSE](../../LICENSE).

---

_🤖 Streamlining prompt collection management through intelligent automation._
