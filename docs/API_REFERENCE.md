# Agent Specification API Reference

Complete technical reference for the agent specification system, including all frontmatter fields, validation rules, and constraints.

## Overview

An agent specification is a Markdown file with YAML frontmatter that defines an AI agent's metadata, capabilities, and configuration. All agent specifications must follow this format:

```markdown
---
[frontmatter fields here]
---

[markdown content here]
```

## Frontmatter Fields

### Required Fields

#### `name`

- **Type:** String
- **Format:** Title case, 2-50 characters
- **Example:** `Content Moderator`
- **Description:** The agent's display name. Must be unique within the organization.
- **Validation:**
  - Must not be empty
  - Must use title case
  - Must be 2-50 characters long
  - May contain spaces and hyphens

#### `description`

- **Type:** String (multi-line supported)
- **Format:** 2-500 characters
- **Example:** Automated content moderation agent that analyzes user-generated content...
- **Description:** Clear explanation of what the agent does, who uses it, and key capabilities.
- **Validation:**
  - Must not be empty
  - Must be at least 2 characters
  - Recommend 50-200 characters for clarity
  - Use YAML multiline syntax (> or |) for longer descriptions

#### `file_type`

- **Type:** String
- **Format:** `.agent.md` (constant)
- **Example:** `.agent.md`
- **Description:** Must always be `.agent.md` to indicate this is an agent specification.
- **Validation:**
  - Must be exactly `.agent.md`
  - This is a required constant, never change this value

#### `category`

- **Type:** String (enum)
- **Valid Values:**
  - `governance` - Policy enforcement, compliance, moderation
  - `analysis` - Data analysis, insights, reporting
  - `generation` - Content creation, document generation
  - `automation` - Workflow automation, task execution
  - `integration` - External system integration, API management
  - `security` - Security operations, threat detection
  - `documentation` - Documentation generation and maintenance
- **Example:** `governance`
- **Description:** Classification of the agent's primary purpose.
- **Validation:** Must be one of the valid enum values above

#### `status`

- **Type:** String (enum)
- **Valid Values:**
  - `active` - Ready for production use
  - `draft` - Under development, not ready for use
  - `deprecated` - Superseded by newer version
  - `archived` - Historical reference only
- **Example:** `active`
- **Description:** Current lifecycle status of the agent.
- **Validation:** Must be one of the valid enum values above

#### `version`

- **Type:** String (semantic versioning)
- **Format:** `MAJOR.MINOR.PATCH` (e.g., `1.0.0`, `2.1.3`)
- **Example:** `1.0.0`
- **Description:** Semantic version indicating agent maturity and compatibility.
- **Rules:**
  - MAJOR: Breaking changes to interfaces or behavior
  - MINOR: New features without breaking changes
  - PATCH: Bug fixes and patches
- **Validation:**
  - Must match pattern `\d+\.\d+\.\d+`
  - Do not use 'v' prefix (v1.0.0 is invalid)

#### `created_date`

- **Type:** Date (ISO 8601)
- **Format:** `YYYY-MM-DD`
- **Example:** `2026-09-01`
- **Description:** When the agent specification was first created.
- **Validation:**
  - Must be valid ISO 8601 date
  - Must not be in the future (relative to file commit)

#### `updated_date`

- **Type:** Date (ISO 8601)
- **Format:** `YYYY-MM-DD`
- **Example:** `2026-09-03`
- **Description:** When the agent specification was last updated.
- **Validation:**
  - Must be valid ISO 8601 date
  - Must be >= created_date
  - Should be updated whenever the spec changes

#### `created_by`

- **Type:** String (email or identifier)
- **Format:** Email format preferred (`user@domain.com`)
- **Example:** `claude@lightspeedwp.agency`
- **Description:** The person or system that created the specification.
- **Validation:**
  - Must not be empty
  - Email format strongly recommended

#### `last_updated_by`

- **Type:** String (email or identifier)
- **Format:** Email format preferred
- **Example:** `claude@lightspeedwp.agency`
- **Description:** The person or system that last updated the specification.
- **Validation:**
  - Must not be empty
  - Email format strongly recommended

#### `approval_status`

- **Type:** String (enum)
- **Valid Values:**
  - `pending` - Awaiting approval
  - `approved` - Approved by required stakeholders
  - `rejected` - Not approved, revisions needed
  - `superseded` - Replaced by newer version
- **Example:** `approved`
- **Description:** Approval workflow status of the specification.
- **Validation:** Must be one of the valid enum values above

#### `implementation_reference`

- **Type:** String (path)
- **Format:** Relative path to implementation directory
- **Example:** `agents/my-agent/`
- **Description:** Path to the directory containing the agent's implementation.
- **Validation:**
  - Must be a valid relative path
  - Directory should exist (validated by some tools)
  - Path should end with `/`

#### `supported_platforms`

- **Type:** Array of strings
- **Format:** Lowercase, hyphenated platform names
- **Example:** `[slack, web, api, discord]`
- **Common Platforms:**
  - `slack` - Slack bot/app
  - `web` - Web application
  - `api` - REST API or webhooks
  - `discord` - Discord bot
  - `email` - Email interface
  - `jupyter` - Jupyter notebook
  - `aws`, `gcp`, `azure` - Cloud platforms
  - `kubernetes` - Kubernetes clusters
  - `on-premise` - On-premises deployment
- **Validation:**
  - Must be an array of strings
  - Each platform must be valid/documented

#### `required_capabilities`

- **Type:** Array of strings
- **Format:** Lowercase, underscore-separated capability names
- **Example:** `[text_analysis, image_analysis, policy_matching]`
- **Common Capabilities:**
  - Text: `text_analysis`, `nlp_processing`, `sentiment_analysis`
  - Data: `data_processing`, `sql_execution`, `statistical_analysis`
  - Security: `vulnerability_scanning`, `compliance_checking`
  - Content: `image_analysis`, `video_analysis`, `content_moderation`
- **Validation:**
  - Must be an array of strings
  - Each capability should be clearly defined

#### `tags`

- **Type:** Array of strings
- **Format:** Lowercase, hyphenated keywords
- **Example:** `[moderation, safety, content-control, enforcement]`
- **Rules:**
  - Use lowercase only
  - Use hyphens to separate words (not underscores or spaces)
  - Maximum 10-15 tags recommended
  - Use for discoverability and categorization
- **Validation:**
  - Must be an array of strings
  - Each tag should follow format

### Optional Fields

#### `aliases`

- **Type:** Array of strings
- **Example:** `[ContentMod, Moderator]`
- **Description:** Alternative names for the agent.
- **Validation:** Array of strings

#### `related_agents`

- **Type:** Array of strings
- **Example:** `[security-auditor, documentation-generator]`
- **Description:** Names of related or dependent agents.
- **Validation:** Array of valid agent names

#### `documentation_url`

- **Type:** String (URL)
- **Example:** `https://docs.example.com/agents/content-moderator`
- **Description:** URL to external documentation.
- **Validation:** Must be valid URL

#### `maintainers`

- **Type:** Array of strings (emails)
- **Example:** `[claude@lightspeedwp.agency, team@example.com]`
- **Description:** Primary maintainers responsible for the agent.
- **Validation:** Array of email addresses

## Validation Rules

### Format Validation

**Date Fields:** Must be ISO 8601 format (YYYY-MM-DD)

```yaml
✅ created_date: 2026-09-01
❌ created_date: 09/01/2026
❌ created_date: 2026-9-1
```

**Version Field:** Must follow semantic versioning

```yaml
✅ version: 1.0.0
✅ version: 2.1.3
❌ version: 1.0
❌ version: v1.0.0
```

**Enums:** Must use exact values (case-sensitive)

```yaml
✅ category: governance
✅ status: active
❌ category: Governance    # Wrong case
❌ status: Active          # Wrong case
```

### Presence Validation

All required fields must be present. Missing fields will cause validation failure.

```
Required:
- name
- description
- file_type
- category
- status
- version
- created_date
- updated_date
- created_by
- last_updated_by
- approval_status
- implementation_reference
- supported_platforms
- required_capabilities
- tags
```

### Value Constraints

**Field Lengths:**

- `name`: 2-50 characters
- `description`: 2-500 characters
- Email fields: Valid email format
- Version: Semantic versioning (X.Y.Z)

**Array Fields:**

- `supported_platforms`: Non-empty, valid platform names
- `required_capabilities`: Non-empty, descriptive names
- `tags`: Non-empty, lowercase hyphenated format

## File Structure

```
lightspeedwp/.github/
├── agents/
│   ├── agent-name-1.agent.md           # Agent specification
│   ├── agent-name-2.agent.md
│   ├── agent-name-1/
│   │   ├── SKILL.md                    # Technical documentation
│   │   ├── README.md                   # User guide
│   │   ├── src/                        # Source code
│   │   │   └── index.js
│   │   └── tests/
│   │       └── index.test.js
│   └── agent-name-2/
│       ├── SKILL.md
│       ├── README.md
│       ├── src/
│       └── tests/
```

## Naming Conventions

### Agent Names

- **Format:** Title case with spaces
- **Examples:** Content Moderator, Data Analyst, Security Auditor
- **Regex:** `^[A-Z][a-z]+( [A-Z][a-z]+)*$`

### File Names

- **Format:** Lowercase with hyphens, `.agent.md` extension
- **Examples:** `content-moderator.agent.md`, `data-analyst.agent.md`
- **Regex:** `^[a-z][a-z0-9]*(-[a-z0-9]+)*\.agent\.md$`

### Directory Names

- **Format:** Lowercase with hyphens
- **Examples:** `agents/content-moderator/`, `agents/data-analyst/`
- **Regex:** `^agents/[a-z][a-z0-9]*(-[a-z0-9]+)*/$`

## Content Structure

After frontmatter, the Markdown content should include:

### Recommended Sections

```markdown
## Overview
Brief description and key capabilities

## Implementation Requirements
- Directory structure
- Dependencies
- Configuration

## Usage Examples
- Example 1: Use case with input/process/output
- Example 2: Another scenario
- Example 3: Edge case or advanced usage

## Validation Rules
Special validation rules for this agent

## Error Handling
How the agent handles errors

## Performance Considerations
Timing, resource requirements, scaling

## Security Considerations
Data protection, access control, audit logging

## Monitoring & Logging
What gets logged, how to monitor

## Related Specifications
Links to related agents or documentation
```

## Validation Errors Reference

### Error: `Missing required field '{field}'`

One or more required fields are not present in frontmatter.

**Fix:** Add all required fields.

### Error: `Invalid {field} value: {value}`

Field value doesn't match expected format or enum values.

**Fix:** Check valid values for that field and correct.

### Error: `{field} date must be YYYY-MM-DD`

Date field is not in ISO 8601 format.

**Fix:** Convert date to YYYY-MM-DD format.

### Error: `{field} version must match X.Y.Z`

Version doesn't follow semantic versioning.

**Fix:** Use format MAJOR.MINOR.PATCH with all three components.

### Error: `{field} is not a valid email`

Email field doesn't look like valid email address.

**Fix:** Use format <user@domain.com>

## Extension Points

The specification system supports extension through:

1. **Custom tags** - Add domain-specific tags for discovery
2. **Optional fields** - Additional metadata beyond required fields
3. **Markdown content** - Detailed documentation and examples
4. **Implementation files** - Source code, tests, documentation in `agents/{name}/`

---

**Last Updated:** 2026-09-03
**Status:** Active
**Related:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md), [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
