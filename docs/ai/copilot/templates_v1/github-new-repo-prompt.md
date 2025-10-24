---
title: "GitHub New Repository Prompt Template"
description: "Template and guidance for creating a new GitHub repository using Copilot."
last_updated: "2025-10-17"
version: "v1.0"
owners: ["LightSpeed Engineering"]
---

# Overview

When creating a new repository, you’ll provide three key pieces of information: **repository name**, **description** (max 350 characters), and a **Copilot prompt** (max 500 characters). The Copilot prompt instructs the AI how to scaffold the repo and apply LightSpeed standards.

# Fields

## Repository name

- Use a short, descriptive name in kebab‑case (lowercase words separated by hyphens), e.g. `travel-booking-plugin`.
- Avoid generic names; reflect the project purpose.

## Repository description (≤350 characters)

- Provide a concise summary of the project’s goal and functionality.
- Mention the target audience or use‑case.
- Avoid jargon and internal acronyms.

## Copilot prompt (≤500 characters)

- Describe what Copilot should do when generating the repository scaffolding.
- Mention the technology stack (e.g. WordPress plugin, React app) and any required folders or files.
- Reference any relevant Copilot instruction files (e.g. `wordpress.instructions.md`).
- Specify any immediate tasks (e.g. “create README with installation steps” or “initialise with MIT licence”).

# Example

- **Repository name**: `tour-operator-api`
- **Description**: `REST API server for the Tour Operator platform, providing endpoints for tours, bookings, and customer management. Built with Fastify and TypeScript for performance and type safety.`
- **Copilot prompt**:
  `Create a new TypeScript project for a Tour Operator REST API using Fastify. Include a README with setup instructions, an MIT licence, basic folder structure (src, test, scripts), and ESLint/Prettier configuration. Apply the LightSpeed Node.js instructions.`

# Prompt Template

```
Repository name: [kebab-case project name]

Repository description (≤350 characters): [concise summary of purpose, audience and tech]

Copilot prompt (≤500 characters): [instructions for scaffolding the project, including tech stack, required files/folders, reference to instruction files, and any immediate tasks]
```

# Notes

- Ensure the Copilot prompt references any existing instruction files relevant to the tech stack (e.g. `wordpress.instructions.md`, `typescript-mcp-server.instructions.md`).
- After creation, review the generated files, update metadata (e.g. author, licence year) and add project‑specific documentation.

---
