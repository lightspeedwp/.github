---
title: "Unified Branding Agent — Parent Specification (Issue [#33](https://github.com/lightspeedwp/.github/issues/33))"
description: "Complete parent specification for unified branding agent defining category taxonomy, header/footer requirements, badge system, and .schemas/config approach"
file_type: "documentation"
created_date: "2026-05-28"
last_updated: "2026-05-28"
version: "v1.0.0"
owners: ["Ash Shaw"]
tags: ["branding", "governance", "automation", "specification"]
---

# Unified Branding Agent — Parent Specification

**Issue**: [#33](https://github.com/lightspeedwp/.github/issues/33)
**Related Issues**: [#46](https://github.com/lightspeedwp/.github/issues/46) (template design), [#49](https://github.com/lightspeedwp/.github/issues/49) (.schemas/config), [#48](https://github.com/lightspeedwp/.github/issues/48) (agent implementation)
**Status**: Specification Phase
**Effort**: 12–16 hours (planning complete)
**Timeline**: Week 1–2 implementation

---

## 1. Initiative Overview

### Problem Statement

The LightSpeed `.github` repository currently has **fragmented branding logic** spread across:

- Multiple `.md` files with inconsistent headers and footers
- Separate agent and instruction files for branding concerns
- No centralized category taxonomy or validation schema
- Hard-coded logic instead of config-driven rules
- Risk of inconsistent output across document types

### Opportunity

Create a **unified branding agent** that:

- Automates category-aware Markdown headers, footers, and badges
- Uses frontmatter and path-based defaults for intelligent template selection
- Centralizes all branding logic into schema-driven configuration
- Maintains consistency and readability across all document types
- Enables low-friction maintenance and extension

### Scope (In-Scope Paths)

- `docs/` — Documentation
- `instructions/` — Coding standards and guidelines
- `prompts/` — Prompt templates
- `agents/` — Agent specifications
- `awesome-copilot/` — Awesome Copilot resources
- `.schemas/` — Data validation schemas
- `.github/projects/active/` — Planning documents
- `wceu-2026/` — Talk planning and assets
- Root-level `.md` files — `README.md`, `CHANGELOG.md`, etc.

### Out of Scope

- Non-Markdown branding (images, layouts, CSS)
- Large repository restructuring
- Unrelated instruction audits
- Moving assets outside `.github` boundaries

---

## 2. Document Category Taxonomy

The branding agent supports **16 document categories**, each with distinct purpose, audience, header/footer behavior, and badge conventions.

### 2.1 Category Definitions

#### Category: `issue-template`

**Purpose**: GitHub issue template files
**Audience**: Repository contributors opening issues
**File Patterns**: `.github/ISSUE_TEMPLATE/*.md`
**Frontmatter Required**: `title`, `description`, `file_type: "issue-template"`
**Header Behavior**: Optional (most templates omit headers)
**Footer Behavior**: Minimal or omitted; if present, link to contributing guide
**Badge Conventions**: `[issue-template]` label only
**Fallback Rules**: No footer if frontmatter missing; use default category badge

---

#### Category: `pull-request-template`

**Purpose**: GitHub pull request template files
**Audience**: Repository contributors opening pull requests
**File Patterns**: `.github/PULL_REQUEST_TEMPLATE/*.md`
**Frontmatter Required**: `title`, `description`, `file_type: "pr-template"`
**Header Behavior**: Optional
**Footer Behavior**: Link to CI/CD status, review guide, or merge criteria
**Badge Conventions**: `[pull-request]` label; automation status badges if applicable
**Fallback Rules**: Use default footer if frontmatter missing

---

#### Category: `docs`

**Purpose**: Repository documentation and guides
**Audience**: End users, maintainers, integrators
**File Patterns**: `docs/**/*.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `owners: [...]`
**Header Behavior**: Required; includes category badge, version, status
**Footer Behavior**: Attribution footer with maintainer info, last-updated date, link to GitHub edit
**Badge Conventions**: `[docs]`, `[status]`, `[version]`, `[owners]`
**Fallback Rules**: Use README-style defaults if category not specified; infer from filename

---

#### Category: `ai-ops`

**Purpose**: AI operations, automation, and governance documentation
**Audience**: Maintainers, automation engineers, governance stakeholders
**File Patterns**: `docs/**/*governance*.md`, `docs/**/*automation*.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `category: "ai-ops"`
**Header Behavior**: Required; includes AI Ops badge, governance level, decision status
**Footer Behavior**: Links to related governance docs, approval chain, review status
**Badge Conventions**: `[AI Ops]`, `[governance]`, `[automation]`, `[decision]`
**Fallback Rules**: Infer from path if `category` not in frontmatter

---

#### Category: `agents`

**Purpose**: Agent specifications, behavior definitions, and documentation
**Audience**: Developers integrating agents, framework maintainers
**File Patterns**: `agents/**/*.md`, `agents/**/*.agent.md`
**Frontmatter Required**: `title`, `description`, `file_type: "agent"`, `owners: [...]`
**Header Behavior**: Required; includes agent name, capabilities badge, status
**Footer Behavior**: Signature footer with agent identity, version, last-updated, links to implementation
**Badge Conventions**: `[agent]`, `[capabilities]`, `[status]`, `[version]`
**Fallback Rules**: Default to agent category if not specified

---

#### Category: `instructions`

**Purpose**: Coding standards, guidelines, and best practices
**Audience**: Developers, code reviewers, automation systems
**File Patterns**: `instructions/**/*.md`, `*.instructions.md`
**Frontmatter Required**: `title`, `description`, `file_type: "instructions"`, `owners: [...]`
**Header Behavior**: Required; includes compliance level, applicability scope
**Footer Behavior**: Links to enforcement mechanisms, related guidelines, approval status
**Badge Conventions**: `[instructions]`, `[compliance-level]`, `[scope]`
**Fallback Rules**: Use default instructions footer if not specified

---

#### Category: `prompts`

**Purpose**: Prompt templates for AI tools, ChatMode, and automation
**Audience**: Prompt engineers, AI tool integrators, LLM users
**File Patterns**: `prompts/**/*.md`, `*.prompt.md`, `wceu-2026/**/*.md`
**Frontmatter Required**: `title`, `description`, `file_type: "prompt"`, `owners: [...]`
**Header Behavior**: Optional; may include version and tool compatibility
**Footer Behavior**: Tool compatibility footer, version info, last-updated, prompt engineering notes
**Badge Conventions**: `[prompt]`, `[tools]`, `[version]`, `[ai-model]`
**Fallback Rules**: Generic prompt footer if not specified

---

#### Category: `schema`

**Purpose**: Data schema definitions, validation rules, and format specifications
**Audience**: Developers consuming schema, API users, automation engineers
**File Patterns**: `.schemas/**/*.md`, `schemas/**/*.md`, `*.schema.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `category: "schema"`
**Header Behavior**: Required; includes schema version, validation tool, status
**Footer Behavior**: Links to schema implementation, validation results, related schemas
**Badge Conventions**: `[schema]`, `[version]`, `[validation]`, `[status]`
**Fallback Rules**: Default to docs category if not specified

---

#### Category: `readme`

**Purpose**: Repository, project, or module overview documents
**Audience**: New contributors, integrators, project stakeholders
**File Patterns**: `README.md`, `*/README.md`, `plugins/*/README.md`
**Frontmatter Required**: Optional; if present, include `title`, `description`, `file_type: "documentation"`
**Header Behavior**: Usually omitted (file name is self-documenting)
**Footer Behavior**: Standard footer with repository info, contribution guide link, license
**Badge Conventions**: `[repository]`, `[license]`, `[contributors]`
**Fallback Rules**: Use standard repository footer if no frontmatter

---

#### Category: `test`

**Purpose**: Test documentation, testing guidelines, and test specifications
**Audience**: QA engineers, developers, CI/CD automation
**File Patterns**: `test/**/*.md`, `*test*.md`, `**/*-test.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `category: "test"`
**Header Behavior**: Optional; may include test coverage status
**Footer Behavior**: Links to test results, CI/CD status, related test docs
**Badge Conventions**: `[test]`, `[coverage]`, `[status]`
**Fallback Rules**: Generic documentation footer

---

#### Category: `utility`

**Purpose**: Utility scripts, helper tools, and automation utilities
**Audience**: Developers, DevOps, automation engineers
**File Patterns**: `scripts/**/*.md`, `utils/**/*.md`, `*.utility.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `category: "utility"`
**Header Behavior**: Optional; may include usage/requirements
**Footer Behavior**: Links to source code, usage examples, maintenance info
**Badge Conventions**: `[utility]`, `[language]`, `[status]`
**Fallback Rules**: Generic utility footer

---

#### Category: `awesome-copilot`

**Purpose**: Awesome Copilot resources, extensions, and integrations
**Audience**: Copilot users, extension developers, integration teams
**File Patterns**: `awesome-copilot/**/*.md`, `**/*awesome*.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `category: "awesome-copilot"`
**Header Behavior**: Required; includes resource type, compatibility badges
**Footer Behavior**: Links to Copilot docs, integration guides, related resources
**Badge Conventions**: `[awesome-copilot]`, `[copilot-version]`, `[type]`
**Fallback Rules**: Generic awesome-copilot footer

---

#### Category: `research`

**Purpose**: Research documents, findings, and investigation results
**Audience**: Decision makers, researchers, stakeholders
**File Patterns**: `research/**/*.md`, `*research*.md`, `*.research.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `owners: [...]`
**Header Behavior**: Required; includes research scope, methodology, date
**Footer Behavior**: Attribution, sources, related research, update status
**Badge Conventions**: `[research]`, `[status]`, `[date]`
**Fallback Rules**: Default research footer

---

#### Category: `audit`

**Purpose**: Audit reports, compliance documentation, and assessment results
**Audience**: Compliance officers, auditors, decision makers
**File Patterns**: `audit/**/*.md`, `*audit*.md`, `*.audit.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `owners: [...]`
**Header Behavior**: Required; includes audit type, scope, date, findings summary
**Footer Behavior**: Audit authority, remediation status, next review date
**Badge Conventions**: `[audit]`, `[compliance]`, `[status]`, `[date]`
**Fallback Rules**: Default audit footer

---

#### Category: `workflow`

**Purpose**: Workflow definitions, CI/CD documentation, and automation rules
**Audience**: DevOps engineers, CI/CD maintainers, automation engineers
**File Patterns**: `.github/workflows/**/*.md`, `docs/**/*workflow*.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `category: "workflow"`
**Header Behavior**: Required; includes trigger events, execution context
**Footer Behavior**: Links to workflow implementation, status page, related workflows
**Badge Conventions**: `[workflow]`, `[trigger]`, `[status]`
**Fallback Rules**: Default workflow footer

---

#### Category: `governance`

**Purpose**: Governance policies, decision records, and organizational rules
**Audience**: Maintainers, decision makers, governance stakeholders
**File Patterns**: `docs/**/*governance*.md`, `governance/**/*.md`
**Frontmatter Required**: `title`, `description`, `file_type: "documentation"`, `category: "governance"`, `owners: [...]`
**Header Behavior**: Required; includes policy scope, decision status, approval chain
**Footer Behavior**: Policy authority, review cycle, effective date, next review date
**Badge Conventions**: `[governance]`, `[decision]`, `[approval]`, `[effective]`
**Fallback Rules**: Default governance footer

---

## 3. Header Requirements

### Header Structure Per Category

Headers provide context and metadata at the top of documents. The branding agent inserts standardized headers based on category.

| Category | Header Required? | Required Fields | Optional Fields |
| --- | --- | --- | --- |
| `issue-template` | No | — | — |
| `pull-request-template` | No | — | — |
| `docs` | Yes | Category, Title | Version, Status |
| `ai-ops` | Yes | Category, Title, Governance Level | Decision Status |
| `agents` | Yes | Agent Name, Capabilities | Version, Status |
| `instructions` | Yes | Category, Compliance Level | Scope, Approval |
| `prompts` | Optional | Prompt Type | Tool Compatibility |
| `schema` | Yes | Schema Name, Version | Validation Tool |
| `readme` | No | — | — |
| `test` | Optional | Test Type | Coverage |
| `utility` | Optional | Utility Name | Language |
| `awesome-copilot` | Yes | Resource Type | Compatibility |
| `research` | Yes | Research Scope | Methodology |
| `audit` | Yes | Audit Type, Scope | Findings Summary |
| `workflow` | Yes | Trigger Events | Execution Context |
| `governance` | Yes | Policy Scope | Approval Chain |

### Header Format

```markdown
---
<frontmatter>
---

# Document Title

**Category**: [`category-badge`]
**Status**: Active | Draft | Deprecated
**Version**: vX.Y.Z
**Owners**: [@owner1, @owner2]
**Last Updated**: YYYY-MM-DD

---

## Content begins here...
```

---

## 4. Footer Requirements

### Footer Behavior Per Category

Footers provide attribution, maintenance status, and relevant links.

**Requirements**:

- One footer per document (enforced by schema)
- Category-aware template selection
- Frontmatter-driven but path-aware fallback
- Readable and low-noise (max 3–4 lines)
- Include "last updated" and attribution where applicable
- Provide link to edit/contribute path

### Footer Examples by Category

#### `docs` Category — 5 Footer Variants

**Variant 1** (Standard Docs Footer):

```
---
**Documentation maintained by the LightSpeed team.**
[Edit this doc](https://github.com/lightspeedwp/.github/edit/develop/docs/FILENAME.md) |
[Report issue](https://github.com/lightspeedwp/.github/issues/new)
```

**Variant 2** (With Version & Status):

```
---
**Status**: Active | **Version**: v2.1.0
**Last Updated**: 2026-05-28 by @maintainer
[Edit](https://github.com/lightspeedwp/.github/edit/develop/docs/FILENAME.md)
```

**Variant 3** (With Related Docs):

```
---
📚 **Related**: [AUTOMATION_GOVERNANCE.md](./AUTOMATION_GOVERNANCE.md) | [PLUGIN_PACK_ROADMAP.md](./PLUGIN_PACK_ROADMAP.md)
Maintained with ❤️ by the LightSpeed automation team.
```

**Variant 4** (With Review Status):

```
---
✅ **Reviewed & Approved** | Last approved: 2026-05-01
[Suggest changes](https://github.com/lightspeedwp/.github/pulls/new) |
[View history](https://github.com/lightspeedwp/.github/commits/develop/docs/FILENAME.md)
```

**Variant 5** (Minimal Docs Footer):

```
---
Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!
[Learn more](https://lightspeedwp.agency)
```

---

#### `agents` Category — 5 Footer Variants

**Variant 1** (Standard Agent Footer):

```
---
🤖 **Agent**: Unified Labeling Agent
**Version**: v1.2.3 | **Status**: Active
[Implementation](./agent.js) | [Edit spec](https://github.com/lightspeedwp/.github/edit/develop/agents/AGENT_NAME.agent.md)
```

**Variant 2** (With Capabilities):

```
---
**Capabilities**: Labeling, Issue Triage, PR Analysis
**Maintained by**: @automation-team
[View capabilities](./capabilities.md) | [Report issue](https://github.com/lightspeedwp/.github/issues/new?labels=agent)
```

**Variant 3** (With Integration Links):

```
---
🤖 **Copilot for LightSpeedWP** — Always fresh, always compliant!
**Integration Guide**: [Setup](./INTEGRATION.md) | **Docs**: [Agent Spec](./AGENT_SPEC.md)
```

**Variant 4** (Agent Maintenance Footer):

```
---
**Last Updated**: 2026-05-28 | **Maintained by**: @automation-team
[Current Issues](https://github.com/lightspeedwp/.github/issues?q=label:agent) |
[Changelog](https://github.com/lightspeedwp/.github/blob/develop/CHANGELOG.md)
```

**Variant 5** (Minimal Agent Footer):

```
---
**🤖 Agent Spec** | Part of LightSpeed automation infrastructure
[Learn more about agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md)
```

---

#### `instructions` Category — 5 Footer Variants

**Variant 1** (Standard Instructions Footer):

```
---
**Compliance Level**: Required | **Scope**: All repositories
[Enforcement](./ENFORCEMENT.md) | [Exceptions](./EXCEPTIONS.md) | [Report violation](https://github.com/lightspeedwp/.github/issues/new?labels=compliance)
```

**Variant 2** (With Approval Status):

```
---
✅ **Approved** by @architecture-team on 2026-05-01
[View approvals](./APPROVALS.md) | [Suggest update](https://github.com/lightspeedwp/.github/pulls/new)
```

**Variant 3** (With Related Guidelines):

```
---
📋 **Part of Coding Standards** — [Main Guidelines](./CODING_STANDARDS.md)
Related: [PHP Standards](./PHP_STANDARDS.md) | [JS Standards](./JS_STANDARDS.md)
```

**Variant 4** (Enforcement Footer):

```
---
**Enforcement**: Automated by GitHub Actions
**Status**: Active | **Last Review**: 2026-05-15
[Automation Details](./ENFORCEMENT.md)
```

**Variant 5** (Minimal Instructions Footer):

```
---
🎯 **Required Coding Standards**
[Contribute](https://github.com/lightspeedwp/.github/blob/develop/CONTRIBUTING.md)
```

---

#### `schema` Category — 5 Footer Variants

**Variant 1** (Standard Schema Footer):

```
---
**Schema Version**: v2.0 | **Validation Tool**: JSON Schema v7
[JSON File](./../schemas/SCHEMA_NAME.schema.json) | [Edit spec](https://github.com/lightspeedwp/.github/edit/develop/.schemas/SCHEMA_NAME.schema.md)
```

**Variant 2** (With Validation Status):

```
---
✅ **Validation**: All tests passing | **Coverage**: 100%
[Test results](./TEST_RESULTS.md) | [Validate](./VALIDATE.md)
```

**Variant 3** (With Version & Changelog):

```
---
📐 **Schema validated by LightSpeedWP** — Always compliant!
**Version**: 2.1.0 | [Changelog](./CHANGELOG.md) | [Breaking Changes](./BREAKING_CHANGES.md)
```

**Variant 4** (Minimal Schema Footer):

```
---
JSON Schema v7 | **Version**: v2.0
[Learn more](https://json-schema.org)
```

**Variant 5** (With Related Schemas):

```
---
**Part of**: [Unified Frontmatter Schema](./frontmatter.schema.md)
**Related**: [Footer Config](./footer-config.schema.md) | [Label Schema](./labels.schema.md)
```

---

#### `prompts` Category — 5 Footer Variants

**Variant 1** (Standard Prompt Footer):

```
---
**Tools**: Figma, Canva, PowerPoint, reveal.js
**Version**: v1.0 | **Last Updated**: 2026-05-28
[Generate slides](https://figma.com/...) | [Edit prompt](https://github.com/lightspeedwp/.github/edit/develop/wceu-2026/SLIDES_GENERATION_PROMPT.md)
```

**Variant 2** (With Usage Notes):

```
---
💬 **Prompt Engineering Notes**: Best with GPT-4, Claude Opus
**Format**: Markdown | **Length**: ~2,000 tokens
[Template](./TEMPLATE.md) | [Examples](./EXAMPLES.md)
```

**Variant 3** (Tool-Specific Footer):

```
---
✨ **Prompt magic by 🦄 LightSpeedWP Automation Unicorns.**
[Adobe Firefly](./ADOBE_VERSION.md) | [Midjourney](./MIDJOURNEY_VERSION.md) | [DALL-E](./DALLE_VERSION.md)
```

**Variant 4** (Version & Status Footer):

```
---
**Status**: Production | **Version**: v1.2.3
**Maintained by**: @prompt-engineering-team
[Issues](https://github.com/lightspeedwp/.github/issues?labels=prompt) | [Suggestions](https://github.com/lightspeedwp/.github/discussions)
```

**Variant 5** (Minimal Prompt Footer):

```
---
🚀 Ready to generate. [Start here](./README.md)
```

---

#### `governance` Category — 5 Footer Variants

**Variant 1** (Standard Governance Footer):

```
---
**Policy Authority**: @architecture-team | **Effective**: 2026-05-01
**Next Review**: 2026-08-01 | **Status**: Active
[Decision Record](./DECISION_RECORD.md) | [Report exception](https://github.com/lightspeedwp/.github/issues/new?labels=governance)
```

**Variant 2** (With Approval Chain):

```
---
✅ **Approved by**:
- @architecture-team (2026-05-01)
- @security-team (2026-05-02)

[Approval Details](./APPROVALS.md)
```

**Variant 3** (Executive Summary Footer):

```
---
📋 **Governance Decision** — [Full Record](./ADR_0042.md)
**Scope**: All repositories | **Owner**: @governance-lead
[Effective Date](./TIMELINE.md) | [Transition Plan](./TRANSITION.md)
```

**Variant 4** (Minimal Governance Footer):

```
---
🎯 **Policy Effective**: 2026-05-01
[Decisions](./DECISIONS.md) | [History](https://github.com/lightspeedwp/.github/commits/develop/docs/GOVERNANCE.md)
```

**Variant 5** (With Compliance Checklist):

```
---
**Compliance Checklist**: [Requirements](./CHECKLIST.md)
**Status**: All org repos ✅ | **Non-compliance**: 0
[Audit Results](./AUDIT.md) | [Next Review](./REVIEW_SCHEDULE.md)
```

---

## 5. Badge Requirements

Badges provide quick visual identification and status indicators.

### Badge Types

| Badge Type | Purpose | Typical Values | Categories |
| --- | --- | --- | --- |
| `[status]` | Document status | Active, Draft, Deprecated | All |
| `[version]` | Version identifier | v1.0.0, v2.1.3 | agents, schema, docs |
| `[category]` | Document category | docs, agents, governance | All |
| `[compliance]` | Compliance status | Required, Optional, Deprecated | instructions, governance |
| `[approval]` | Approval status | Approved, Pending, Rejected | governance, instructions |
| `[tools]` | Tool compatibility | Figma, Canva, PowerPoint | prompts, awesome-copilot |
| `[language]` | Programming language | PHP, JavaScript, Python | utility, instructions |
| `[owners]` | Maintainers | @owner1, @owner2 | agents, docs, instructions |

### Badge Placement

- **In Headers**: Status, version, category badges
- **In Frontmatter**: Tags and metadata (not visual badges)
- **In Footers**: Cross-references, approval status, version, tools

### Badge Format

```markdown
**[badge-type]**: value

# Examples:
**[status]**: Active
**[version]**: v2.1.0
**[category]**: [agents]
**[compliance]**: Required
**[tools]**: Figma, Canva
```

---

## 6. Schema/Config Approach

### Recommended Direction: YAML Authoring + JSON Schema Validation

**Rationale**:

- **YAML**: Human-friendly, low syntax noise, easy to author and maintain
- **JSON Schema**: Strict validation, tooling support, comprehensive constraint expression
- **Combination**: Best of both — easy to write, impossible to break

### Configuration Structure

#### Categories Config (`config/categories.yaml`)

```yaml
categories:
  docs:
    name: "Documentation"
    purpose: "Repository documentation and guides"
    audience: "End users, maintainers, integrators"
    default_footer: "docs-standard"
    default_header: "docs-standard"
    permitted_badges:
      - status
      - version
      - owners
    requirements:
      frontmatter:
        required:
          - title
          - description
          - file_type
          - owners
        optional:
          - version
          - status
      header: required
      footer: required

  agents:
    name: "Agents"
    purpose: "Agent specifications and behavior definitions"
    audience: "Developers, integrators, automation engineers"
    default_footer: "agent-standard"
    default_header: "agent-standard"
    permitted_badges:
      - status
      - version
      - capabilities
      - owners
    requirements:
      frontmatter:
        required:
          - title
          - description
          - file_type
          - owners
        optional:
          - version
          - capabilities
      header: required
      footer: required

  # ... additional categories ...
```

#### Templates Config (`config/templates.yaml`)

```yaml
templates:
  headers:
    docs-standard:
      template: "# ${title}\n\n**Category**: [docs]\n**Status**: ${status}\n**Version**: ${version}\n**Owners**: ${owners}\n\n---"
      variables:
        - title (required)
        - status (optional, default: "Active")
        - version (optional, default: "v1.0.0")
        - owners (optional, default: from frontmatter)

  footers:
    docs-standard:
      variants:
        - "default"
        - "with-version"
        - "with-related"
        - "with-approval"
        - "minimal"
      default: "default"
      template: |
        ---
        **Documentation maintained by the LightSpeed team.**
        [Edit this doc](${edit_link}) | [Report issue](${issue_link})
      variables:
        - edit_link (auto-generated from file path)
        - issue_link (auto-generated)

    docs-with-version:
      template: |
        ---
        **Status**: ${status} | **Version**: ${version}
        **Last Updated**: ${last_updated} by ${updated_by}
        [Edit](${edit_link})
      variables:
        - status (from frontmatter)
        - version (from frontmatter)
        - last_updated (auto, from git)
        - updated_by (auto, from git)
        - edit_link (auto)
```

#### Badges Config (`config/badges.yaml`)

```yaml
badges:
  status:
    values:
      - Active
      - Draft
      - Deprecated
    colors:
      Active: "green"
      Draft: "yellow"
      Deprecated: "red"
    usage: "frontmatter | header | footer"

  version:
    format: "v\\d+\\.\\d+\\.\\d+"
    usage: "frontmatter | header | footer"
    auto_increment: false

  compliance:
    values:
      - Required
      - Optional
      - Deprecated
    colors:
      Required: "red"
      Optional: "blue"
      Deprecated: "gray"
    usage: "header | footer"
```

### Validation Schema (`schemas/branding-config.schema.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Branding Configuration Schema",
  "type": "object",
  "properties": {
    "categories": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["name", "purpose", "audience"],
        "properties": {
          "name": { "type": "string" },
          "purpose": { "type": "string" },
          "audience": { "type": "string" },
          "default_footer": { "type": "string" },
          "default_header": { "type": "string" },
          "permitted_badges": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    },
    "templates": {
      "type": "object",
      "properties": {
        "headers": { "type": "object" },
        "footers": { "type": "object" }
      }
    },
    "badges": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["values"],
        "properties": {
          "values": { "type": "array", "items": { "type": "string" } },
          "colors": { "type": "object" },
          "usage": { "type": "string" }
        }
      }
    }
  },
  "required": ["categories", "templates", "badges"]
}
```

### Frontmatter-Driven Selection

The branding agent uses this priority order:

1. **Frontmatter `category` field** — If present, use specified category
2. **Path-based inference** — If path matches known pattern (e.g., `docs/`), infer category
3. **Filename pattern matching** — If filename matches known pattern (e.g., `*.agent.md`), infer category
4. **Fallback to `documentation`** — Default category for unrecognized files

### Configuration Inheritance & Overrides

```yaml
# Default footer for all "docs" files:
categories:
  docs:
    default_footer: "docs-standard"

# File-level frontmatter override:
---
title: "Special Document"
file_type: "documentation"
category: "docs"
footer_variant: "docs-with-approval"  # Override default
---
```

---

## 7. Frontmatter & Path-Based Defaults

### Frontmatter Fields (Category-Aware)

All eligible files should include:

```yaml
---
title: "Document Title"
description: "Brief description"
file_type: "documentation"  # or "agent", "instruction", "prompt", etc.
category: "docs"  # Optional; inferred from path if omitted
owners: ["@maintainer1", "@maintainer2"]
version: "v1.0.0"  # Optional
status: "active"
last_updated: "2026-05-28"
tags: ["governance", "automation"]  # Optional; max 8
---
```

### Path-Based Category Inference

| Path Pattern | Inferred Category |
| --- | --- |
| `docs/**/*.md` | `docs` |
| `instructions/**/*.md` | `instructions` |
| `agents/**/*.md` | `agents` |
| `prompts/**/*.md` | `prompts` |
| `.schemas/**/*.md` | `schema` |
| `awesome-copilot/**/*.md` | `awesome-copilot` |
| `research/**/*.md` | `research` |
| `.github/workflows/**/*.md` | `workflow` |
| `.github/ISSUE_TEMPLATE/**/*.md` | `issue-template` |
| `.github/PULL_REQUEST_TEMPLATE/**/*.md` | `pull-request-template` |
| `*.agent.md` | `agents` |
| `*.instructions.md` | `instructions` |
| `*.prompt.md` | `prompts` |
| `README.md` (any level) | `readme` |

### Fallback Rules

If neither frontmatter nor path provides category:

1. Check filename for category clue (e.g., `governance.md` → `governance`)
2. Check file content for heuristics (e.g., "## Workflow" → `workflow`)
3. Default to `documentation`

---

## 8. Accessibility & Readability Constraints

### Accessibility Requirements

- **Text Contrast**: Footer and header text must meet WCAG AA (4.5:1) minimum contrast
- **No Pure Color Coding**: Badges must combine color with text/icons
- **Alt Text**: Any embedded images or icons must have descriptive alt text
- **Semantic HTML**: Use proper Markdown syntax (not `<span>` workarounds)
- **Screen Reader Safe**: Avoid decorative elements; use meaningful punctuation

### Readability Requirements

- **Header/Footer Size**: Max 4–6 lines each
- **Line Length**: Prefer ≤80 characters for readability
- **Font Size**: Assume rendering in code editors (not browsers)
- **Whitespace**: Use blank lines to separate sections
- **Emoji Usage**: Limit to 1–2 per header/footer; ensure they add meaning
- **Link Density**: Max 3 links per footer

### Low-Noise Principle

Footers should feel like metadata, not content. Example of high-noise:

```markdown
---
📚 **Welcome to our comprehensive documentation library!** We're constantly
updating this to serve you better. If you have questions, suggestions, or would
like to contribute, please don't hesitate to reach out! [Contact us](...)
```

Example of appropriate-noise:

```markdown
---
**Documentation maintained by the LightSpeed team.**
[Edit](url) | [Report issue](url)
```

---

## 9. Implementation Relationship to Child Issues

### Issue [#46](https://github.com/lightspeedwp/.github/issues/46) — Template Design

**Scope**: Define implementation-ready footer, header, and badge templates
**Deliverables**:

- 5 footer variants per key category (6 categories minimum)
- Header template specifications
- Badge placement and styling guide
- Frontmatter-to-template mapping rules
- Fallback template behavior

**Dependencies**: Issue [#33](https://github.com/lightspeedwp/.github/issues/33) (this spec)
**Unblocks**: Issue [#48](https://github.com/lightspeedwp/.github/issues/48) (agent implementation)

### Issue [#49](https://github.com/lightspeedwp/.github/issues/49) — Schema/Config Model

**Scope**: Define JSON Schema validation and YAML config structure
**Deliverables**:

- `schemas/branding-config.schema.json` (JSON Schema v7)
- `config/categories.yaml` (category definitions)
- `config/templates.yaml` (template library)
- `config/badges.yaml` (badge definitions)
- Validation rules and error messages
- Maintainer guidance for extending config

**Dependencies**: Issues [#33](https://github.com/lightspeedwp/.github/issues/33) (this spec), [#46](https://github.com/lightspeedwp/.github/issues/46) (template designs)
**Unblocks**: Issue [#48](https://github.com/lightspeedwp/.github/issues/48) (agent implementation)

### Issue [#48](https://github.com/lightspeedwp/.github/issues/48) — Agent Implementation & Documentation

**Scope**: Implement branding agent using config from [#49](https://github.com/lightspeedwp/.github/issues/49) and templates from [#46](https://github.com/lightspeedwp/.github/issues/46)
**Deliverables**:

- `.github/agents/branding.agent.md` — Agent specification
- Branding agent logic (Node.js script or GitHub Action)
- Integration examples and usage guide
- Remediation script for existing files
- CI integration for ongoing validation

**Dependencies**: Issues [#33](https://github.com/lightspeedwp/.github/issues/33) (spec), [#46](https://github.com/lightspeedwp/.github/issues/46) (templates), [#49](https://github.com/lightspeedwp/.github/issues/49) (config)
**Blocks**: Remediation and validation phase

---

## 10. Delivery Plan

### Phase 1: Specification (1–2 weeks)

**Week 1**:

- ✅ Complete Issue [#33](https://github.com/lightspeedwp/.github/issues/33) (parent spec) — *This document*
- Complete Issue [#46](https://github.com/lightspeedwp/.github/issues/46) (template design)
- Complete Issue [#49](https://github.com/lightspeedwp/.github/issues/49) (.schemas/config model)

**Deliverables**: 3 merged specification issues ready for implementation

### Phase 2: Configuration & Validation (1–2 weeks)

- Implement config files (`categories.yaml`, `templates.yaml`, `badges.yaml`)
- Implement `schemas/branding-config.schema.json`
- Create validation script to test config
- Document configuration maintenance process

**Deliverables**: Validated, extensible config ready for agent integration

### Phase 3: Agent Implementation (1–2 weeks)

- Implement branding agent core logic
- Create remediation script for existing files
- Integrate with CI/CD validation
- Write agent documentation

**Deliverables**: Functional agent + remediation for 664 files

### Phase 4: Rollout & Validation (1 week)

- Run remediation script on repository
- Validate all 664 files fixed
- Enable CI enforcement
- Monitor for edge cases

**Deliverables**: 100% footer remediation + active validation

---

## 11. Acceptance Criteria

- [x] Parent scope clearly defined
- [x] All 16 document categories explicitly listed with purpose/audience/requirements
- [x] Header requirements documented per category (required vs. optional, field list)
- [x] Footer requirements documented per category (5 variants minimum per key category)
- [x] Badge types and usage conventions documented
- [x] Schema/config approach documented and justified (YAML + JSON Schema recommended)
- [x] Frontmatter and path-based fallback behavior defined
- [x] Accessibility and readability constraints documented
- [x] Clear relationship to child issues [#46](https://github.com/lightspeedwp/.github/issues/46) and [#49](https://github.com/lightspeedwp/.github/issues/49)
- [x] Delivery plan with milestones documented
- [x] Implementation is broken into small, reviewable steps

---

## 12. References

**Related Issues**:

- [#46](https://github.com/lightspeedwp/.github/issues/46) — Design footer/header/badge templates for unified branding agent
- [#49](https://github.com/lightspeedwp/.github/issues/49) — Schema update for unified branding agent (category, tags, badges)
- [#48](https://github.com/lightspeedwp/.github/issues/48) — Agent implementation and documentation

**Related Files**:

- `footer-header-style.instructions.md`
- `header-footer.agent.md`
- `badges.agent.md`
- `a11y.instructions.md`
- `README.md`
- `CHANGELOG.md`

---

## Document History

| Version | Date | Author | Status |
| --- | --- | --- | --- |
| v1.0.0 | 2026-05-28 | Claude | Complete |

---

**Created**: 2026-05-28
**By**: Claude
**For**: LightSpeed Team
**Related Work**: Issues [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49)
