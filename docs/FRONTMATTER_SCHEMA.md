---
file_type: documentation
title: Frontmatter Schema Documentation
version: v2.3.2
last_updated: '2026-08-21'
author: LightSpeedWP
maintainer: Ash Shaw
description: Comprehensive documentation for the LightSpeedWP Markdown/JSON frontmatter schema, including GitHub templates, AI configurations, and validation guidelines.
tags:
  - lightspeed
  - schema
  - frontmatter
  - governance
  - github
  - copilot
  - claude
  - gemini
stability: stable
domain: governance
---

## Frontmatter Schema Specification

This document describes the structure, fields, and validation rules for the LightSpeedWP frontmatter schema, used across Markdown and JSON files for documentation, agents, prompts, and configuration.

## Purpose

- Ensure consistent metadata for all documentation, agent, and configuration files.
- Power automation, validation, and discoverability in the LightSpeedWP ecosystem.
- Support VS Code, Copilot, and other tools with a single source of truth.

## Location

- **Schema file:** `../.schemas/frontmatter.schema.json`
- **This documentation:** `docs/FRONTMATTER_SCHEMA.md`

## Referencing the Schema

**How to reference in documentation:**

```markdown
**JSON Schema:**
See [`../.schemas/frontmatter.schema.json`](../.schemas/frontmatter.schema.json)
```

**How to reference in frontmatter files (YAML):**

```yaml
$schema: "../.schemas/frontmatter.schema.json"
---
title: "..."
```

## How Schema Validation Works

The LightSpeedWP frontmatter schema uses **Ajv JSON Schema validator** (Draft 07) with a **discriminator pattern** for efficient validation routing.

### Validation Process

1. **Parse YAML Frontmatter**: Extract frontmatter block from Markdown files
2. **Load Schema**: Read `../.schemas/frontmatter.schema.json`
3. **Discriminator Routing**: Use `file_type` field to route to appropriate schema variant
4. **Validate Fields**: Check all required and optional fields against schema rules
5. **Report Errors**: Provide detailed error messages with field paths and validation failures

### Discriminator Pattern

The schema uses the `file_type` field as a discriminator to determine which validation rules apply:

```json
{
  "discriminator": {
    "propertyName": "file_type"
  },
  "oneOf": [
    { "properties": { "file_type": { "const": "agent" } } },
    { "properties": { "file_type": { "const": "instructions" } } },
    { "properties": { "file_type": { "const": "prompt" } } },
    { "properties": { "file_type": { "const": "documentation" } } }
  ]
}
```

This pattern ensures:

- **Type Safety**: Each file type has specific required fields
- **Performance**: Fast validation routing without checking all variants
- **Clarity**: Clear error messages specific to each file type
- **Extensibility**: Easy to add new file types without breaking existing validation

## Typical Fields

| Field        | Type     | Required | Description                                              |
| ------------ | -------- | -------- | -------------------------------------------------------- |
| title        | string   | yes      | Human-readable title                                     |
| description  | string   | yes      | Brief summary of the file's purpose                      |
| version      | string   | yes      | Schema or document version (e.g. v1.0)                   |
| last_updated | string   | yes      | ISO date of last update                                  |
| author       | string   | yes      | Main author or team                                      |
| maintainer   | string   | yes      | Who's responsible for changes                            |
| tags         | string[] | no       | Keywords for search/filtering                            |
| type         | string   | yes      | Type of file (e.g. "agent", "instructions")              |
| references   | string[] | no       | **AI-relevant cross-links** for automation and discovery |

## Dual Reference System

The LightSpeedWP frontmatter schema implements a **dual reference system** to serve both AI automation and human navigation needs:

### 🤖 AI References (Frontmatter)

- **Location**: `references` field in YAML frontmatter
- **Purpose**: Machine-readable cross-links for AI agents, automation, and discovery
- **Audience**: GitHub Copilot, automation agents, search indexing
- **Format**: Relative paths to related files that AI should understand

### 👥 Human References (Footer)

- **Location**: Reference section at the end of the document
- **Purpose**: Human-readable navigation links with context
- **Audience**: Developers, contributors, documentation readers
- **Format**: Markdown links with descriptions and context

## Example Frontmatter Implementation

```yaml
$schema: "../.schemas/frontmatter.schema.json"
---
title: "Labeling Agent Spec"
description: "Automated labeling system for issues and pull requests"
version: "v1.2"
last_updated: "2025-10-24"
author: "LightSpeedWP"
maintainer: "Ash Shaw"
tags: ["lightspeed", "labeling", "agents", "automation"]
type: "agent"
references:
  - "../workflows/labeling.yml"
  - "../prompts/label-issues.prompt.md"
  - "../.github/instructions/automation.instructions.md"
  - "./LABELING.md"
  - "./LABELING.md#issue-labelling"
  - "./LABELING.md#pull-request-labelling"
---

# 🏷️ Labeling Agent Specification

[Document content here...]

## 🔗 Related Documentation

- **[Labeling Workflow](../.github/workflows/labeling.yml)** - GitHub Actions implementation
- **[Issue Labels](./LABELING.md#issue-labelling)** - Complete labeling taxonomy
- **[PR Labels](./LABELING.md#pull-request-labelling)** - Pull request labeling standards

---

*This agent specification ensures consistent issue and PR labeling across the LightSpeedWP organization.*
```

### ✅ Best Practices

1. **AI References** should include:
   - Related workflow files
   - Dependent instruction files
   - Associated prompt files
   - Configuration files
   - Schema files

2. **Human References** should include:
   - Contextual descriptions
   - Navigation aids
   - Related documentation
   - External resources
   - Explanatory links

## 📋 Reference Implementation Guidelines

### 🤖 AI References Examples by File Type

#### Agent Files (`.agent.md`)

```yaml
references:
  - "../workflows/agent-name.yml"
  - "../prompts/agent-prompt.prompt.md"
  - "./agents.instructions.md"
  - "./LABELING.md#issue-labelling"
```

#### Instruction Files (`.instructions.md`)

```yaml
references:
  - "./coding-standards.instructions.md"
  - "../workflows/README.md"
  - "../agents/README.md"
  - "../custom-instructions.md"
```

#### Prompt Files (`.prompt.md`)

```yaml
references:
  - "../instructions/prompts.instructions.md"
  - "../agents/agent.md"
  - "../agents/agent-name.agent.md"
```

#### Workflow Files (`.yml`)

```yaml
references:
  - "../agents/agent-name.agent.md"
  - "../.github/instructions/workflows.instructions.md"
  - "./AUTOMATION.md"
```

### 👥 Human Reference Patterns

Use descriptive markdown links that help humans understand context:

```markdown
## 🔗 Related Documentation

### 📚 Core Resources

- **[Automation Governance](./AUTOMATION.md)** - Organization automation policies
- **[Coding Standards](./instructions/coding-standards.instructions.md)** - Development guidelines

### ⚙️ Implementation Details

- **[Labeling Workflow](../workflows/labeling.yml)** - GitHub Actions automation
- **[Test Configuration](../jest.config.js)** - Testing framework setup

### 🎯 Specialized Guides

- **[WordPress Development](./instructions/wordpress.instructions.md)** - WP-specific practices
- **[Security Guidelines](./instructions/security.instructions.md)** - Security best practices
```

---

## GitHub Issue Template Frontmatter

### Markdown Issue Templates

Markdown issue templates in `.github/ISSUE_TEMPLATE/*.md` use `name` and `about` in front matter. The `about` field is what GitHub shows in the issue picker.

#### Markdown Template Example

```yaml
---
file_type: "issue-template"
name: "🐛 Bug report"
about: "Report a bug to help us improve this project."
version: "1.0.1"
last_updated: "2026-06-18"
category: "github-templates"
---
```

### Issue Forms

Issue forms in `.github/ISSUE_TEMPLATE/*.yml` use `name`, `description`, and `body`.

#### Top-Level Frontmatter Fields

| Field         | Type         | Required | Description                                                              |
| ------------- | ------------ | -------- | ------------------------------------------------------------------------ |
| `name`        | string       | ✅       | Unique name for the template (appears in template picker UI)             |
| `description` | string       | ✅       | Short explanation of the template's purpose (shown in picker UI)         |
| `body`        | array        | ✅       | Array defining the form fields and content blocks for the issue form     |
| `title`       | string       | 📋       | Default title that will pre-fill in the new issue title input            |
| `labels`      | array/string | 📋       | Labels to auto-apply on issue creation (array or comma-separated)        |
| `assignees`   | array/string | 📋       | GitHub usernames to auto-assign the issue to (array or comma-separated)  |
| `projects`    | array/string | 📋       | GitHub Projects to auto-add the issue to (format `"OWNER/PROJECT-NUMBER"`) |
| `type`        | string       | 📋       | Issue type to assign (if your organization uses custom issue types)      |

#### Example Issue Form Template

```yaml
---
name: "Bug Report"
description: "Report a bug in the project."
title: "[Bug]: "
labels: ["bug", "needs-triage"]
assignees: ["octocat"]
projects: ["my-org/42"]
type: bug

body:
  - type: markdown
    attributes:
      value: |
        ## Thank you for reporting a bug!
        Please fill out the sections below.

  - type: input
    id: "contact"
    attributes:
      label: "Contact Details"
      placeholder: "e.g. email@example.com"
    validations:
      required: false

  - type: textarea
    id: "steps"
    attributes:
      label: "Steps to Reproduce"
      placeholder: |
        1. Step one...
        2. Step two...
        3. *Feel free to add more steps as needed...*
    validations:
      required: true

  - type: dropdown
    id: "browser"
    attributes:
      label: "Affected Browser(s)"
      options:
        - "Firefox"
        - "Chrome"
        - "Safari"
        - "Edge"
      multiple: true
    validations:
      required: true

  - type: checkboxes
    id: "agree"
    attributes:
      label: "Code of Conduct Agreement"
      options:
        - label: "I have searched for duplicate issues"
          required: true
        - label: "I agree to follow the project's Code of Conduct"
          required: true
---
```

### Body Field Types

The `body` array supports these input types:

- **`markdown`** — Static text guidance (not included in final issue content)
- **`input`** — Single-line text field with `label`, `description`, `placeholder`, `value`, and `validations`
- **`textarea`** — Multi-line text field, supports `render` to format as code block
- **`dropdown`** — Single or multi-select from options list, supports `multiple: true` and `default` index
- **`checkboxes`** — Group of checkboxes, each with `label` and optional `required: true`

### Best Practices

- Enclose frontmatter between `---` lines at the top of the template file
- Quote strings containing special characters (`:`, `#`) or beginning with `[`
- Use pipe `|` for multiline text to preserve line breaks
- Use `validations: required: true` judiciously — only when necessary
- Assign unique IDs to inputs for programmatic reference
- Keep forms short — only ask for necessary information

---

## GitHub Pull Request Template Frontmatter

Pull request templates are simpler. GitHub **does not currently support form-style PR templates with YAML-defined inputs** for PRs, so any YAML front matter in a PR template is repo-local metadata only.

In this repository, PR templates use `title` and `description` in front matter. Do not mirror the issue-template `about` field into PR templates.

### Example PR Template Frontmatter (Not Parsed)

```yaml
---
title: "feat: <brief description of feature>"
description: "Use this template for pull requests adding a new feature"
labels: enhancement, needs-review
assignees: octocat
---
```

⚠️ **Note**: This frontmatter is currently **not processed** by GitHub for PRs. Many repositories omit YAML frontmatter in PR templates and use plain Markdown with HTML comments for guidance.

### Best Practices for PR Templates

- Use HTML comments (`<!-- ... -->`) for guidance text
- Encourage linking issues (e.g., "Closes #123")
- Include sections for "Linked Issue", "Summary of Changes", "Testing Instructions"
- Use Markdown checklists for reviewer guidance

---

## GitHub Saved Replies

GitHub **saved replies** are canned responses for commenting on issues and PRs. They **do not use file-based YAML frontmatter** — they are created and managed via the GitHub web UI.

Each saved reply has:

- **Title** — Short name for the reply (for your reference in the UI)
- **Body content** — The actual text (supports Markdown) inserted when used

**Usage**: Create/edit via **Settings > Saved replies**. Only the body content gets inserted into comments.

---

## GitHub Copilot Configuration

### Repository-Wide Instructions

Create a file named **`.github/copilot-instructions.md`** at the repository root. This file contains plain Markdown guidance for Copilot — **no YAML frontmatter needed**.

**Example**:

```markdown
# Project Coding Guidelines

- Follow WordPress Coding Standards for PHP, JavaScript, and CSS
- Use semantic HTML and ensure accessibility (WCAG 2.2 AA)
- All code must pass ESLint, PHPCS, and Prettier formatting
- Include comprehensive JSDoc and PHPDoc for all functions
```

### Path-Specific Instructions

Create files in `.github/instructions/` with names like `XYZ.instructions.md`. These **require YAML frontmatter** with `applyTo` patterns.

#### Frontmatter Fields for Instructions

| Field         | Type         | Required | Description                              |
| ------------- | ------------ | -------- | ---------------------------------------- |
| `applyTo`     | string/array | ✅       | Glob pattern(s) of files this applies to |
| `description` | string       | 📋       | Short description (shown in VS Code UI)  |

**Example**:

```yaml
---
applyTo: "**/*.py"
description: "Python code style guidelines for this repo"
---
# Python Coding Guidelines

- Follow PEP 8 style guide (use `black` for formatting)
- Use type hints for all functions and methods
- Prefer list comprehensions for simple loops
- Avoid wildcard `import` statements
```

**Best Practices**:

- Keep instructions concise and natural language
- Use separate files for distinct domains (language, testing, deployment)
- Name files logically (e.g., `python.instructions.md`, `frontend.instructions.md`)
- Use precise `applyTo` glob patterns

### Custom Prompt Files (`.prompt.md`)

Prompt files define reusable prompts for VS Code Copilot Chat with YAML frontmatter.

#### Frontmatter Fields for Prompts

| Field         | Type   | Required | Description                                                      |
| ------------- | ------ | -------- | ---------------------------------------------------------------- |
| `description` | string | ✅       | Short description of what the prompt does                        |
| `mode`        | enum   | 📋       | Execution mode: `"ask"`, `"edit"`, or `"agent"` (default: agent) |
| `model`       | string | 📋       | Preferred AI model (e.g., "gpt-4", "claude-3")                   |
| `tools`       | array  | 📋       | List of tools/capabilities the prompt can use                    |

**Example**:

```yaml
---
description: "Convert a code snippet into a well-documented function"
mode: "edit"
model: "GPT-4"
tools: []
---
# Convert to Documented Function

Take the selected code and refactor it into a self-contained function with a clear name.

- Add a concise docstring explaining purpose, inputs, and output
- Add comments for complex logic
- **Do not** change external behavior
```

**Variables**: Use placeholders like `${selection}`, `${file}`, or `${input:variableName}` in prompt body.

### Custom Agent Files (`.agent.md`)

**⚠️ MIGRATION NOTE**: GitHub has deprecated `.chatmode.md` files in favor of `.agent.md` files. All chatmode references should be migrated to agent format.

Agent files define specialized AI modes for Copilot Chat. Structure mirrors prompt files with expanded capabilities.

#### Frontmatter Fields for Agents

| Field          | Type   | Required | Description                                |
| -------------- | ------ | -------- | ------------------------------------------ | ------------------ | ------------ |
| `name`         | string | ✅       | Human-readable agent name (VS Code native) |
| `description`  | string | ✅       | Brief description of agent purpose         |
| `tools`        | array  | 📋       | Available tools/capabilities               |
| `model`        | string | 📋       | Preferred AI model                         |
| `handoffs`     | array  | 📋       | Handoff definitions for agent chaining     |
| `version`      | string | 📋       | Version string (LightSpeed extended)       |
| `last_updated` | string | 📋       | ISO date                                   |
| `owners`       | array  | 📋       | Responsible teams                          |
| `category`     | string | 📋       | Classification                             |
| `status`       | string | 📋       | `"active"`                                 | `"deprecated"`     | `"draft"`    |
| `target`       | string | 📋       | `"vscode"`                                 | `"github-copilot"` | `"cli"`      |
| `visibility`   | string | 📋       | `"public"`                                 | `"private"`        | `"internal"` |
| `metadata`     | object | 📋       | Additional agent metadata                  |

**Example**:

```yaml
---
name: "security-reviewer"
description: "Security vulnerability assessment and remediation guidance"
tools: ["search", "codebase", "problems"]
model: "gpt-4"
handoffs:
  - label: "Fix Issues"
    agent: "implementation"
    prompt: "Now implement the security fixes identified above."
    send: false
version: "v1.0"
last_updated: "2025-12-04"
owners: ["lightspeedwp/security-team"]
category: "security"
status: "active"
target: "vscode"
visibility: "public"
---
# Security Reviewer Agent

You are a security expert focusing on WordPress vulnerabilities...
```

**Agent Tools**: Values include `codebase`, `search`, `usages`, `editFiles`, `fetchWebpage`, `findTestFiles`, `githubRepo`, `problems`, `runCommands`, `runNotebooks`, `runTasks`, `runTests`, `terminalLastCommand`, `terminalSelection`, `thinking`, `vscodeAPI`, and custom MCP tools.

---

## Unified Multi-Agent Instructions – `AGENTS.md`

The **`AGENTS.md`** file at repository root provides guidelines for *all* AI assistants working on the repository. This convention unifies rules across GitHub Copilot, Claude, Gemini, and other AI tools.

### Format

`AGENTS.md` is plain Markdown — **no YAML frontmatter required**. Content should be universal rules applicable to any AI assistant.

**Example**:

```markdown
# Project AI Guidelines

- All code must follow the style guide in [CONTRIBUTING.md](CONTRIBUTING.md)
- Assume users are familiar with the project domain
- Prioritize security and privacy — never output secrets
- Every generated function _must_ have a docstring
- Follow OWASP security best practices
```

### Scope

- **Broad Application**: Rules apply to all AI actions in the repo
- **Static Guidelines**: Should be relatively stable and universal
- **Cross-Platform**: Works with GitHub Copilot, Claude, Gemini, Continue.dev, etc.

### Best Practices

- Keep high-level (project-wide concerns only)
- Avoid granular/context-specific rules (use `.instructions.md` for those)
- Update as project practices evolve
- Single source of truth for AI behavior

---

## Validation Tooling

### Schema Validation with Ajv

The LightSpeedWP frontmatter schema uses **Ajv JSON Schema validator** with a **discriminator pattern** on the `file_type` field for routing validation rules.

#### Discriminator Pattern

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "discriminator": {
    "propertyName": "file_type"
  },
  "oneOf": [
    { "properties": { "file_type": { "const": "agent" } } },
    { "properties": { "file_type": { "const": "instructions" } } },
    { "properties": { "file_type": { "const": "prompt" } } }
  ]
}
```

The `file_type` field determines which validation rules apply to each file.

#### Validation Workflow

1. **Parse YAML frontmatter** from Markdown files
2. **Extract `file_type` field** to determine schema variant
3. **Route to appropriate schema** using discriminator
4. **Validate all fields** against schema requirements
5. **Report errors** with file path and field details

#### Common Validation Failures

| Error                    | Cause                           | Solution                                        |
| ------------------------ | ------------------------------- | ----------------------------------------------- |
| "Missing required field" | Required field omitted          | Add missing field to frontmatter                |
| "Invalid file_type"      | Typo or unsupported type        | Check spelling, use valid type                  |
| "Duplicate property"     | Same field appears twice        | Remove duplicate (common: `file_type`)          |
| "Invalid enum value"     | Field value not in allowed list | Use valid enum value from schema                |
| "Type mismatch"          | Wrong data type                 | Convert to correct type (e.g., string vs array) |

### VS Code Integration

Configure VS Code to validate frontmatter in real-time:

**`.vscode/settings.json`**:

```json
{
  "yaml.schemas": {
    "../.schemas/frontmatter.schema.json": [".github/**/*.md", "docs/**/*.md"]
  },
  "yaml.validate": true,
  "yaml.format.enable": true
}
```

**Benefits**:

- Real-time validation as you type
- IntelliSense autocomplete for fields
- Inline error messages
- Quick fixes for common issues

### CI/CD Integration

Automated validation in GitHub Actions:

**`.github/workflows/validate-frontmatter.yml`**:

```yaml
name: Validate Frontmatter

on:
  pull_request:
    paths:
      - "**.md"
      - "../.schemas/frontmatter.schema.json"

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run validate:frontmatter
```

**Validation Script** (`scripts/validation/validate-frontmatter.js`):

```javascript
const Ajv = require("ajv");
const yaml = require("js-yaml");
const fs = require("fs");
const glob = require("glob");

const ajv = new Ajv({ discriminator: true, allErrors: true });
const schema = JSON.parse(
  fs.readFileSync("../.schemas/frontmatter.schema.json", "utf8"),
);
const validate = ajv.compile(schema);

const files = glob.sync(".github/**/*.md");
let errors = 0;

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  const match = content.match(/^---\n([\s\S]+?)\n---/);

  if (match) {
    try {
      const frontmatter = yaml.load(match[1]);
      const valid = validate(frontmatter);

      if (!valid) {
        console.error(`\nValidation errors in ${file}:`);
        validate.errors.forEach((err) => {
          console.error(`  - ${err.instancePath}: ${err.message}`);
        });
        errors++;
      }
    } catch (e) {
      console.error(`\nYAML parse error in ${file}:`, e.message);
      errors++;
    }
  }
});

if (errors > 0) {
  console.error(`\n❌ Validation failed: ${errors} file(s) with errors`);
  process.exit(1);
} else {
  console.log("\n✅ All frontmatter is valid");
}
```

### Pre-Commit Hooks

Validate before committing with Husky:

**`.husky/pre-commit`**:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run validate:frontmatter
```

**`package.json`**:

```json
{
  "scripts": {
    "validate:frontmatter": "node scripts/validation/validate-frontmatter.js"
  }
}
```

---

## Field Categories and Specifications

### Universal Required Fields

| Field          | Type          | Required | Description                                               |
| -------------- | ------------- | -------- | --------------------------------------------------------- |
| `file_type`    | string        | ✅       | Discriminator for schema validation (const per file type) |
| `description`  | string        | ✅       | Human-readable summary (single sentence preferred)        |
| `title`        | string        | ✅\*     | Human-readable title (required for governance files)      |
| `version`      | string        | ✅\*     | Version string (e.g., v1.1) for governance tracking       |
| `last_updated` | string        | ✅\*     | ISO date of last update (YYYY-MM-DD format)               |
| `author`       | string        | 📋       | Main author or responsible party                          |
| `maintainer`   | string        | 📋       | Current maintainer                                        |
| `owners`       | array[string] | 📋       | List of owners/maintainers (alternative to maintainer)    |

### Integration Fields (Awesome-Copilot Compatible)

| Field          | Type          | Description                                      |
| -------------- | ------------- | ------------------------------------------------ |
| `mode`         | enum          | Execution style: `agent`, `ask`, `edit`          |
| `applyTo`      | string/array  | Glob patterns for auto-application scope         |
| `model`        | string        | Preferred AI model (e.g., "gpt-4", "claude-3")   |
| `tools`        | array[string] | Available tools/capabilities                     |
| `permissions`  | array[string] | Declared permission scopes (read/write/edit, shell, GitHub subsets) |
| `deprecated`   | boolean       | Signals exclusion from generated tables          |
| `replacement`  | string        | Points to canonical successor file               |
| `stability`    | enum          | Maturity: `stable`, `experimental`, `incubating` |
| `tags`         | array[string] | Taxonomy for discovery/filtering (max 8)         |
| `domain`       | enum          | Primary classification                           |
| `extraDomains` | array[string] | Secondary classifications                        |
| `license`      | string        | License identifier (e.g., "GPL-3.0", "MIT")      |
| `references`   | array[object] | AI-focused references with path and description  |

### Domain Taxonomy

**Primary Domains** (choose exactly one for `domain`):

- `wp-core` — WordPress core functionality, hooks, APIs
- `block-theme` — Block themes, FSE, theme.json, patterns
- `plugin-hardening` — Plugin security, validation, best practices
- `perf` — Performance optimization, caching, speed
- `a11y` — Accessibility, WCAG compliance, inclusive design
- `i18n` — Internationalization, localization, translations
- `security` — Security hardening, sanitization, authentication
- `headless` — Headless WordPress, APIs, decoupled architecture
- `generic` — General purpose, cross-domain, or unclassified

**Supplemental Tags** (use in `tags` array, max 8 total):

- **Development**: `testing`, `lint`, `ci`, `automation`, `docs`, `validation`
- **WordPress**: `rest`, `graphql`, `gutenberg`, `blocks`, `patterns`, `theme-json`
- **Technical**: `api`, `data`, `editor`, `cli`, `deployment`, `logging`
- **UX/Design**: `ux`, `design-tokens`, `accessibility`, `responsive`, `mobile`

### Tagging Rules

1. **Limit**: Max 8 tags total for clarity and performance
2. **Format**: Use lowercase kebab-case only (no spaces, no uppercase)
3. **No Duplication**: Don't repeat `domain` in `tags` (it's implicit)
4. **Consistency**: Prefer existing tags; only create new ones with clear reuse potential
5. **Specificity**: Be specific enough for discovery, general enough for reuse

### Stability Lifecycle

| Stability      | Intent                         | Change Expectations                       |
| -------------- | ------------------------------ | ----------------------------------------- |
| `experimental` | Early exploration              | Breaking changes likely                   |
| `incubating`   | Maturing, seeking feedback     | Minor structural tweaks possible          |
| `stable`       | Adopted, versioned conventions | Backward compatibility strongly preferred |

## Migration Guide

### Updating Existing Files

1. **Add `file_type` field** — Required for schema discrimination
2. **Update field names** — Change `apply_to` → `applyTo` for instructions
3. **Add governance fields** — Include `version`, `last_updated`, `author` for docs
4. **Select domain** — Choose primary domain from approved taxonomy
5. **Limit tags** — Reduce to 8 or fewer, use kebab-case
6. **Add references** — Include AI-focused cross-links in frontmatter

### Common Migration Issues

| Issue                   | Fix                                |
| ----------------------- | ---------------------------------- |
| Duplicate `file_type`   | Remove second instance             |
| Missing required fields | Add `description`, `file_type`     |
| Invalid domain          | Use approved domain from taxonomy  |
| Too many tags           | Reduce to 8, remove redundant ones |
| Uppercase tags          | Convert to lowercase kebab-case    |
| Old field names         | Update `apply_to` → `applyTo`      |

---

---

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
