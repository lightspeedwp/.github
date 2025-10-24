---
title: "LightSpeedWP JSON Schemas Collection"
version: "v2.3"
last_updated: "2025-01-14"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "JSON Schema files for validation, documentation, and tooling support across the LightSpeedWP organization. Comprehensive schema validation for frontmatter, configurations, and third-party integrations."
type: "schemas"
status: "production"
tags: ["json-schema", "validation", "frontmatter", "configuration", "automation", "vscode"]
license: "GPL-3.0"
repository: "https://github.com/lightspeedwp/.github"
ai_references:
  - "Use for JSON/YAML validation and schema compliance"
  - "Frontmatter schema ensures consistent documentation metadata"
  - "VS Code integration provides real-time validation and IntelliSense"
  - "CI/CD integration for automated validation workflows"
related_files:
  - ".vscode/settings.json"
  - "scripts/json-validation/"
  - ".github/workflows/"
  - ".github/instructions/"
---

## 📋 LightSpeedWP JSON Schemas Collection

![Schema Badge](https://img.shields.io/badge/schemas-validated-brightgreen?style=flat-square)
![JSON Schema](https://img.shields.io/badge/json--schema-draft--7-blue?style=flat-square)
![VS Code](https://img.shields.io/badge/vscode-integrated-orange?style=flat-square)
![Validation Badge](https://img.shields.io/badge/validation-automated-success?style=flat-square)

This folder contains JSON Schema files used for validation, documentation, and tooling support across the LightSpeedWP organization.

## 📊 Schema Architecture

```mermaid
graph TB
    A[JSON Schemas] --> B[LightSpeedWP Custom]
    A --> C[Third-Party Schemas]
    A --> D[Validation Framework]
    A --> E[IDE Integration]
    
    B --> F[frontmatter.schema.json]
    B --> G[collection.schema.json]
    B --> H[header-footer.schema.json]
    B --> I[header.schema.json]
    B --> J[footer.schema.json]
    
    C --> K[coderabbit-overrides.v2.json]
    C --> L[External Tool Schemas]
    
    D --> M[Real-time Validation]
    D --> N[CI/CD Integration]
    D --> O[CLI Validation]
    
    E --> P[VS Code IntelliSense]
    E --> Q[Error Highlighting]
    E --> R[Auto-completion]
    
    S[Documentation Files] --> F
    T[Collection Manifests] --> G
    U[Configuration Files] --> K
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
```

---

## Schema Categories

### LightSpeedWP Custom Schemas

These schemas have been developed specifically for LightSpeedWP projects and governance:

- **frontmatter.schema.json**  
  Standardized frontmatter schema for governance, documentation, and configuration files. Defines required fields for agents, instructions, prompts, chatmodes, and other organizational documentation.

- **collection.schema.json**  
  Schema for awesome-copilot collection manifest files, defining the structure for organizing and cataloging Copilot resources.

- **header.schema.json**  
  Schema for header configuration and templating across LightSpeedWP projects.

- **footer.schema.json**  
  Schema for footer configuration and templating across LightSpeedWP projects.

- **header-footer.schema.json**  
  Combined schema for header and footer configuration management.

### Third-Party Schemas

These schemas are downloaded and maintained for specific software integrations:

- **coderabbit-overrides.v2.json**  
  Schema for CodeRabbit AI code review tool configuration overrides, defining review settings, path filters, and automation preferences.

---

## Usage

### VS Code Integration

These schemas are automatically mapped in VS Code workspace settings (`.vscode/settings.json`) to provide:

- IntelliSense and autocompletion for configuration files
- Real-time validation and error highlighting
- Documentation tooltips for schema properties

### File Validation

Schemas are used to validate:

- YAML frontmatter in documentation files
- Configuration files for tools and automation
- Manifest files for collections and resources
- Template configurations for headers and footers

### CI/CD Integration

Some schemas may be used in GitHub Actions workflows for:

- Automated validation of configuration changes
- Ensuring documentation standards compliance
- Validating collection manifests and metadata

---

## Schema Development

### Creating New Schemas

When adding new schemas:

1. Follow JSON Schema Draft 7 specification
2. Include comprehensive `title` and `description` fields
3. Use clear property names and descriptions
4. Add examples where helpful
5. Update VS Code workspace settings to map file patterns

### Updating Existing Schemas

- Maintain backward compatibility when possible
- Update version numbers for breaking changes
- Document changes in commit messages
- Test validation against existing files

### Third-Party Schema Updates

- Check for updates periodically from upstream sources
- Document the source and version when updating
- Test compatibility with existing configurations

---

## File Mapping

Current schema-to-file mappings (see `.vscode/settings.json`):

```json
"yaml.schemas": {
  "./schemas/frontmatter.schema.json": [
    "AGENTS.md",
    ".github/agents/*.agent.md",
    ".github/instructions/*.instructions.md",
    ".github/prompts/*.prompt.md",
    ".github/chatmodes/*.chatmode.md"
  ]
}
```

---

## Validation Tools

- **VS Code**: Automatic validation with YAML/JSON extensions
- **CLI**: Use tools like `ajv-cli` for command-line validation
- **CI**: Automated validation in GitHub Actions workflows

---

## 🔄 Schema Validation Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant VSCode as VS Code
    participant Schema as JSON Schema
    participant CI as CI Pipeline
    participant Validator as Schema Validator
    
    Dev->>VSCode: Edit YAML/JSON file
    VSCode->>Schema: Load schema mapping
    Schema->>VSCode: Provide validation rules
    VSCode->>Dev: Real-time validation & IntelliSense
    Dev->>CI: Commit & push changes
    CI->>Validator: Run schema validation
    Validator->>Schema: Validate against schemas
    Schema->>CI: Return validation results
    CI->>Dev: Report validation status
    
    Note over Dev,CI: Continuous validation pipeline
```

## 🎯 Schema Relationship Map

```mermaid
graph LR
    A[frontmatter.schema.json] --> B[Documentation Files]
    A --> C[Instruction Files]
    A --> D[Agent Files]
    
    E[collection.schema.json] --> F[Collection Manifests]
    E --> G[Awesome Copilot Resources]
    
    H[header-footer.schema.json] --> I[Template Configurations]
    H --> J[Header Configs]
    H --> K[Footer Configs]
    
    L[coderabbit-overrides.v2.json] --> M[CodeRabbit Configs]
    L --> N[Review Automation]
    
    O[VS Code Settings] --> A
    O --> E
    O --> H
    O --> L
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style H fill:#e8f5e8
    style L fill:#fff3e0
```

---

## 📚 References

### 🔗 Documentation Links

- [JSON Schema Specification](https://json-schema.org/specification.html)
- [VS Code JSON Schema Integration](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings)
- [LightSpeedWP Frontmatter Conventions](../.github/instructions/frontmatter.instructions.md)
- [Schema Validation Scripts](../scripts/json-validation/)

### 🛠️ Development Resources

- [AJV JSON Schema Validator](https://ajv.js.org/)
- [JSON Schema Lint](https://jsonschemalint.com/)
- [Schema Store](https://schemastore.org/json/)
- [VS Code Workspace Settings](../.vscode/settings.json)

### 🎯 AI & Automation

- [Custom Instructions](../.github/custom-instructions.md)
- [Validation Workflows](../.github/workflows/)
- [JSON Validation Scripts](../scripts/json-validation/)
- [Schema Testing Guidelines](../.github/instructions/tests.instructions.md)

---

_📋 Ensuring data integrity through comprehensive schema validation and automated compliance._
