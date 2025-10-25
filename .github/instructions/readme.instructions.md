---
description: "Comprehensive requirements and guidance for all README.md and Markdown documentation files across the repository, including expanded fields/sections by file/folder type."
applyTo: "README.md, *.md"
---

# README Documentation Standards & Update Tasks

## Universal Required Sections (for all README.md)
- **Frontmatter:**
  - `description`: What is this file/folder for?
  - `references`: Related docs, schemas, instructions (AI cross-linking).
  - `last_updated`: For critical or compliance docs.
- **Header:** Title, emoji (if relevant), required badges.
- **Overview/Purpose:** What does this file/folder do?
- **Usage/Quickstart:** How do you use it?
- **Footer:** Consistent references for human readers.

## Strongly Recommended Sections
- **Owners/Maintainers:** Who is responsible for updates?
- **Version:** For scripts, schemas, configs, or agents.
- **Status/Badges:** Coverage, build, lint, security, etc.
- **Structure/Contents:** List or diagram of subfolders/files (for folders).
- **Contribution/Development:** How to contribute, coding style, links to contributing docs.
- **Parameters/Inputs:** For scripts, configs, or agents.
- **Examples:** Usage, test cases, sample output.
- **Mermaid Diagrams:** For process flows, architecture, relationships.
- **Change Log/History:** For critical or frequently updated files.
- **Security/Compliance:** For security-related folders/files.
- **Validation/Testing:** How to validate or test the file/folder.

## Optional Sections (add if relevant)
- **FAQ/Troubleshooting:** Common issues and solutions.
- **Limitations/Notes:** Known issues, future improvements.
- **Related Projects/Links:** Other relevant projects or resources.
- **Contact/Support:** How to get help.
- **License:** For open source or shared folders/files.
- **Environment/Dependencies:** For scripts, configs, or agents.
- **Localization/Language:** If the file/folder supports multiple languages.
- **Accessibility:** Notes on accessibility features or limitations.
- **Integration:** How the file/folder integrates with other systems or workflows.
- **Custom Metadata:** Any custom fields relevant to your organization (e.g., compliance tags, audit status).
- **Audit/Review Status:** For compliance or regulated files.
- **Deprecation Notice:** If the file/folder is deprecated or superseded.

## Expanded Guidance by Type
- **Test Folders:** Coverage badge, test matrix, how to run, test dependencies, test data location, test environment.
- **Scripts/Utilities:** Supported platforms, dependencies, input/output, error handling, logging, performance notes.
- **Schemas/Configs:** Schema version, validation instructions, example config, compatibility notes, migration instructions.
- **Agents/AI Files:** Model/version, tools used, input/output, limitations, security notes, integration, maintainers, ethical considerations.
- **Documentation Folders:** Navigation index, cross-references, update policy, translation status, accessibility notes, documentation standards.
- **Compliance/Security Folders:** Audit status, compliance tags, last reviewed, responsible owner, security notes, incident history.

## Example Minimum README Template

```markdown
---
description: Brief summary of folder/file purpose.
references:
  - ../docs/CONTRIBUTING.md
  - ../docs/ARCHITECTURE.md
last_updated: 2025-10-25
---

# Folder/File Name

## Overview
Short description of what this folder/file is for.

## Usage
How to use or run this folder/file.

---
## References
- [CONTRIBUTING.md](../docs/CONTRIBUTING.md)
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md)
```

## Additional Guidance
- Use Mermaid diagrams for any process, workflow, or architecture that benefits from visualization.
- Add badges for status, coverage, lint, or other relevant metrics.
- Use emoji in headers only when it enhances clarity, accessibility, or engagement (see header-footer instructions).
- Ensure all references in frontmatter are valid relative paths.
- Keep README files concise but comprehensive; use optional sections only when they add value.
- For folders with many files, include a structure diagram and navigation index.
- For scripts/utilities, document all parameters, dependencies, and error handling.
- For agents/AI files, document model, tools, limitations, and integration points.
- For documentation folders, provide update policy, translation status, and accessibility notes.
- For compliance/security folders, include audit status, responsible owner, and incident history.

---
For further guidance, see referenced instructions files above.
