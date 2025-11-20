---
title: "GitHub Projects Management Scripts"
version: "v1.2"
last_updated: "2025-01-14"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Scripts for managing GitHub Projects, including creation, updates, and field management. Centralized project management with type-specific wrappers for Client Delivery and Product Development workflows."
type: "project-management"
status: "production"
tags:
  [
    "github-projects",
    "project-management",
    "automation",
    "client-delivery",
    "product-development",
    "fields",
  ]
license: "GPL-3.0"
repository: "https://github.com/lightspeedwp/.github"
ai_references:
  - "Use for GitHub Projects automation and management workflows"
  - "Type-specific project creation for Client Delivery and Product Development"
  - "Centralized project field management and updates"
  - "Wrapper architecture for simplified project type handling"
related_files:
  - "scripts/includes/"
  - ".github/workflows/"
  - ".github/PROJECT_TEMPLATE/"
---

## 📋 GitHub Projects Management Scripts

![Projects Badge](https://img.shields.io/badge/projects-automated-brightgreen?style=flat-square)
![Client Delivery](https://img.shields.io/badge/client--delivery-supported-blue?style=flat-square)
![Product Dev](https://img.shields.io/badge/product--dev-supported-orange?style=flat-square)
![Field Management](https://img.shields.io/badge/fields-managed-success?style=flat-square)

This directory contains scripts for managing GitHub Projects, including creation, updates, and field management.

## 📊 Project Management Architecture

```mermaid
graph TB
    A[Project Management] --> B[Client Delivery]
    A --> C[Product Development]
    A --> D[Core Engine]
    A --> E[Field Management]

    B --> F[client-delivery-project.sh]
    C --> G[product-dev-project.sh]
    D --> H[update-projects.sh]
    E --> I[Project Fields API]

    F --> H
    G --> H
    H --> J[GitHub Projects API]
    H --> K[Project Creation]
    H --> L[Project Updates]

    M[CLI Interface] --> F
    M --> G
    N[CI/CD Workflows] --> H
    O[Manual Management] --> H

    style A fill:#e1f5fe
    style D fill:#f3e5f5
    style J fill:#e8f5e8
```

## Scripts

| Script                                                                         | Description                                                                       |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| [`client-delivery-project.sh`](./client-delivery-project.sh)                   | A wrapper script to create or update a "Client Delivery" type GitHub project.     |
| [`product-dev-project.sh`](./product-dev-project.sh)                           | A wrapper script to create or update a "Product Development" type GitHub project. |
| [`update-projects.sh`](./update-projects.sh)                                   | The core engine for managing GitHub projects, sourced by the wrapper scripts.     |
| [`README.client-delivery-project.md`](./README.client-delivery-project.md)     | Detailed documentation for the `client-delivery-project.sh` script.               |
| [`README.product-dev-project.md`](./README.product-dev-project.md)             | Detailed documentation for the `product-dev-project.sh` script.                   |
| [`README.update-projects.md`](./README.update-projects.md)                     | Detailed documentation for the core `update-projects.sh` script.                  |
| [`README.test-create-project-field.sh`](./README.test-create-project-field.sh) | Documentation related to the test script for creating project fields.             |

## Architecture

The primary scripts, `client-delivery-project.sh` and `product-dev-project.sh`, are lightweight wrappers that execute the core `update-projects.sh` script. They pass a project-type string ("Client Delivery" or "Product Development") as the first argument, followed by any other arguments they receive.

This architecture centralizes the complex logic in `update-projects.sh` while providing simple, purpose-specific command-line entry points for different project types.

## 🔄 Project Management Workflow

```mermaid
sequenceDiagram
    participant User as User/CLI
    participant Wrapper as Wrapper Script
    participant Core as Core Engine
    participant API as GitHub API
    participant Fields as Field Manager
    participant Project as GitHub Project

    User->>Wrapper: Execute project script
    Wrapper->>Core: Pass project type + args
    Core->>API: Authenticate & validate
    API->>Core: Return auth status
    Core->>Fields: Manage project fields
    Fields->>API: Update field definitions
    API->>Project: Create/update project
    Project->>Core: Return project details
    Core->>User: Report completion

    Note over User,Project: Centralized project management
```

For detailed usage and technical information, please refer to the individual `README.<script-name>.md` files.

---

## 📚 References

### 🔗 Documentation Links

- [Client Delivery Project Documentation](./README.client-delivery-project.md)
- [Product Development Project Documentation](./README.product-dev-project.md)
- [Core Update Projects Documentation](./README.update-projects.md)
- [GitHub Projects API Documentation](https://docs.github.com/en/rest/projects)

### 🛠️ Development Resources

- [Shared Includes Directory](../includes/)
- [GitHub Actions Workflows](../../.github/workflows/)
- [Project Templates](../../.github/PROJECT_TEMPLATE/)
- [Contributing Guidelines](../../CONTRIBUTING.md)

### 🎯 AI & Automation

- [Custom Instructions](../../.github/custom-instructions.md)
- [Agents Documentation](../../.github/agents/agent.md)
- [Coding Standards](../../.github/instructions/coding-standards.instructions.md)
- [Testing Guidelines](../../.github/instructions/tests.instructions.md)

---

*📋 Streamlining project management through automated GitHub Projects integration.*
