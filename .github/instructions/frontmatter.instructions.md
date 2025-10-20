---
applyTo: ['**/*.md', '**/*.instructions.md', '**/*.prompt.md']
description: "Unified guidance for Copilot template configuration and YAML frontmatter usage across docs, prompts, and instructions."
last_updated: "2025-10-20"
version: "v1.1"
owners: ["LightSpeed Engineering"]
---

# Mission
Define a consistent schema for Copilot template configuration and YAML frontmatter across all LightSpeed documentation, instructions, and prompts to ensure traceability, machine readability, and contributor clarity.

---

# YAML Frontmatter Schema

## Required Fields
- `version`: Semantic version of the file (e.g., `"v1.0"`). Increment when material changes occur.
- `last_updated`: ISO date of last material update (e.g., `"2025-10-20"`).
- `owners`: List of teams or individuals responsible for maintaining the file.

## Optional Fields
- **Instructions**: `applyTo` (glob patterns), `description` (short description).
- **Prompts**: `description` (purpose), `mode` (e.g., `edit`, `ask`), `model` (e.g., `GPT-4`), `tools` (specific tools required).
- **Documentation**: `status` (draft, stable, deprecated), `links` (related docs), `tags` (categorization).

## Best Practices
- Use kebab-case for all frontmatter keys.
- Values should be machine-friendly (ISO dates, semantic versions).
- Avoid sensitive data.

## Example
```yaml
---
version: "v1.2"
last_updated: "2025-10-20"
owners: ["LightSpeed Engineering"]
applyTo: ['**/*.php']
description: "Apply WordPress PHP standards."
---
```

---

# Copilot Template Configuration Options

## Top-level Configuration

### Required Fields
- **name** (`String`): Unique template name (across all templates, including Markdown).
- **about** (`String`): Description of template purpose (shown in issue template chooser).

### Optional Fields
- **assignees** (`Array` or `String`): Automatically assign the issue to these users.
- **labels** (`Array` or `String`): Apply these labels on issue creation.
- **title** (`String`): Default title for issue form.
- **type** (`String`): Issue type (defined at org level).
- **body** (`Array`): Definition of user inputs.

---

# Input Type Configuration

## Markdown
Blocks for maintainer context/guidance. Markdown formatting supported.

**Required:**  
- `value` (`String`): Markdown text to render.

**Tips:**  
- Use quotes for Markdown headers (`#`) due to YAML comment parsing.
- Use pipe operator for multi-line text.

**Example:**
```yaml
body:
  - type: markdown
    attributes:
      value: "## Welcome!"
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug! If you need real-time help, join us on Discord.
```

---

## Input
Single-line form input fields. Markdown formatting supported.

**Required:**  
- `label` (`String`): Brief description.

**Optional:**  
- `description`, `placeholder`, `value` (defaults)
- `id` (`String`): Unique identifier (alphanumeric, `-`, `_`)
- `required` (`Boolean`): Validation.

**Example:**
```yaml
body:
  - type: input
    id: prevalence
    attributes:
      label: Bug prevalence
      description: "How often do you or others encounter this bug?"
      placeholder: "Whenever I visit the user account page (1-2 times a week)"
    validations:
      required: true
```

---

## Textarea
Multi-line input fields.

**Required:**  
- `label` (`String`)

**Optional:**  
- `description`, `placeholder`, `value`, `render` (code block formatting)
- `id`, `required`

**Example:**
```yaml
body:
  - type: textarea
    id: repro
    attributes:
      label: Reproduction steps
      description: "How do you trigger this bug? Please walk us through it step by step."
      value: |
        1.
        2.
        3.
      render: bash
    validations:
      required: true
```

---

## Dropdown
Selectable options.

**Required:**  
- `label` (`String`)
- `options` (`Array`): Distinct values.

**Optional:**  
- `description`, `multiple` (Boolean), `id`, `required`

**Example:**
```yaml
body:
  - type: dropdown
    id: download
    attributes:
      label: How did you download the software?
      options:
        - Homebrew
        - MacPorts
        - apt-get
        - Built from source
    validations:
      required: true
```

---

## Checkboxes
Multiple selections.

**Required:**  
- `options` (`Array`): Each item must have a `label`.

**Optional:**  
- `label`, `description`, `id`

**Example:**
```yaml
body:
  - type: checkboxes
    id: cat-preferences
    attributes:
      label: What kinds of cats do you like?
      description: You may select more than one.
      options:
        - label: Orange cat (required. Everyone likes orange cats.)
          required: true
        - label: "**Black cat**"
```

---

# References
- [LightSpeed YAML Frontmatter Cheat Sheet for GitHub Templates and AI Agent Configurations (internal)]
- [LightSpeed YAML Frontmatter Schemas (internal)]
