---
file_type: architecture
title: ADR Generator — Architecture & Design
description: System design, component interactions, and technical decisions
version: 1.0.0
created_date: 2026-08-18
last_updated: 2026-08-18
---

# ADR Generator Architecture

System design, component overview, and technical decisions behind the ADR Generator.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADR Generator Agent                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              CLI / User Interface                        │ │
│  │  create | validate | list | init | supersede            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           Configuration Loader (Skill)                  │ │
│  │  Load & merge .adr-config.json                          │ │
│  │  Validate against schema                                │ │
│  │  Handle inheritance (org + repo)                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│          ↓                  ↓                  ↓                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Template   │  │  Discovery   │  │  Validators  │        │
│  │   Loader     │  │   Skill      │  │   Skill      │        │
│  │              │  │              │  │              │        │
│  │ Load chosen  │  │ Find next    │  │ Validate:    │        │
│  │ template &   │  │ ADR number   │  │ - Unique     │        │
│  │ variants     │  │ Generate     │  │   titles     │        │
│  │              │  │ filename     │  │ - References │        │
│  │              │  │              │  │ - Format     │        │
│  │              │  │              │  │ - Metadata   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│          ↓                  ↓                  ↓                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         File System Operations                          │  │
│  │  Read ADR files | Write new ADRs | Query metadata      │  │
│  └─────────────────────────────────────────────────────────┘  │
│          ↓                                                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              ADR Files (Markdown)                       │  │
│  │  docs/adr/0001-decision.md                             │  │
│  │  docs/adr/0002-decision.md                             │  │
│  │  ...                                                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Configuration Loader

**File:** `adr-config-loader.js`

Loads and validates `.adr-config.json`:

```javascript
{
  // Load from repo root
  const config = loadConfig();
  
  // Validate against schema
  validateSchema(config);
  
  // Merge with defaults
  const merged = mergeDefaults(config);
  
  return merged;
}
```

**Responsibilities:**
- Parse `.adr-config.json`
- Validate against JSON schema
- Apply default values
- Handle configuration inheritance
- Error reporting

**Tests:** 32 test cases, 100% coverage

### 2. Template Loader

**File:** `adr-template-loader.js`

Loads and processes ADR templates:

```javascript
{
  // Load requested template
  const template = loadTemplate(templateName);
  
  // Substitute variables (date, organization, etc.)
  const substituted = substituteVariables(template, context);
  
  // Apply custom metadata fields
  const final = applyCustomFields(substituted, customFields);
  
  return final;
}
```

**Features:**
- Load 4 template variants
- Template variable substitution
- Custom field injection
- Context-aware defaults

**Templates:**
- `standard.md` — Full-featured (context, decision, consequences, alternatives)
- `lightweight.md` — Minimal (context, decision)
- `security.md` — Security-focused (threat analysis, compliance)
- `infrastructure.md` — Infrastructure (deployment, scaling, DR)

**Tests:** 18 test cases, 100% coverage

### 3. Discovery Skill

**File:** `adr-discovery.js`

Finds next ADR number and generates filenames:

```javascript
{
  // Scan existing ADR files
  const existing = scanDirectory(adrDir);
  
  // Extract numbering pattern
  const numbers = extractNumbers(existing);
  
  // Calculate next number
  const next = calculateNext(numbers, scheme);
  
  // Generate filename from title
  const slug = titleToSlug(title);
  
  return `${prefix}-${next}-${slug}.md`;
}
```

**Supports:**
- Sequential: 0001, 0002, 0003...
- Date-based: 2026-08-18, 2026-08-18-1...
- Custom patterns (future)

**Tests:** 14 test cases, 100% coverage

### 4. Validators

**File:** `adr-validators.js`

Validates ADR files against rules:

```javascript
const validators = {
  enforceUniqueTitle: (adrs) => {
    // Check no duplicate titles
  },
  enforceValidReferences: (adr) => {
    // Check relates_to, supersedes, superseded_by link to real ADRs
  },
  enforceValidStatus: (adr) => {
    // Check status in allowed values
  },
  enforceValidFormat: (content) => {
    // Check YAML and markdown syntax
  },
  enforceFilenameFormat: (filename, pattern) => {
    // Check filename matches numbering scheme
  },
  enforceRequiredMetadata: (adr, required) => {
    // Check required fields present
  }
}
```

**Rules:**

| Rule | Checks | Configurable |
|------|--------|--------------|
| `enforceUniqueTitle` | No duplicate titles | Yes |
| `enforceValidReferences` | Links to real ADRs | Yes |
| `enforceValidStatus` | Valid status values | Yes |
| `enforceValidFormat` | YAML/markdown syntax | Yes |
| `enforceFilenameFormat` | Filename matches pattern | Yes |
| `enforceRequiredMetadata` | Required fields present | Yes |

**Tests:** 24 test cases, 100% coverage

## Data Flow

### Creating an ADR

```
User Input
    ↓
┌─────────────────────────────────────────┐
│ 1. Load Configuration                   │
│    (adr-config-loader)                  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 2. Discover Next Number                 │
│    (adr-discovery)                      │
│    Scan existing ADRs                   │
│    Calculate next in sequence           │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 3. Load Template                        │
│    (adr-template-loader)                │
│    Apply variable substitutions         │
│    Inject custom fields                 │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 4. Create ADR File                      │
│    Write to filesystem                  │
│    With generated content               │
└─────────────────────────────────────────┘
    ↓
New ADR File Ready
```

### Validating ADRs

```
User Command: validate
    ↓
┌─────────────────────────────────────────┐
│ 1. Load Configuration                   │
│    (adr-config-loader)                  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 2. Scan ADR Directory                   │
│    Read all *.md files                  │
│    Parse YAML frontmatter               │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 3. Run All Validators                   │
│    (adr-validators)                     │
│    Configured rules executed            │
│    Failures collected                   │
└─────────────────────────────────────────┘
    ↓
Validation Report
(Errors | Success)
```

## Configuration Schema

Complete JSON schema at `config/adr-config.schema.json`:

```json
{
  "type": "object",
  "required": ["organization"],
  "properties": {
    "organization": {
      "type": "string",
      "description": "Organization or team name"
    },
    "adr_directory": {
      "type": "string",
      "default": "docs/adr"
    },
    "numbering_scheme": {
      "enum": ["sequential", "date-based", "custom"],
      "default": "sequential"
    },
    "prefix": {
      "type": "string",
      "default": "adr",
      "pattern": "^[a-z][a-z0-9-]*$"
    },
    "templates": {
      "type": "object",
      "properties": {
        "default": {
          "enum": ["standard", "lightweight", "security", "infrastructure"]
        },
        "variants": {
          "type": "array",
          "items": {
            "enum": ["standard", "lightweight", "security", "infrastructure"]
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "required_fields": { "type": "array" },
        "optional_fields": { "type": "array" },
        "custom_fields": { "type": "object" }
      }
    },
    "validation": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean" },
        "rules": { "type": "array" }
      }
    }
  }
}
```

## File Format

ADR files use YAML frontmatter + Markdown:

```markdown
---
status: Accepted
date: 2026-08-18
authors: [author1, author2]
relates_to: [adr-0001, adr-0005]
supersedes: null
superseded_by: null
custom_field: value
---

# ADR-0001: Brief title

## Context

Problem description...

## Decision

Solution chosen...

## Consequences

Results and impacts...

## Alternatives

Other options considered...
```

**YAML Frontmatter:**
- `status`: Proposed | Accepted | Deprecated | Superseded
- `date`: YYYY-MM-DD format
- `authors`: Array of author names
- `relates_to`: Array of ADR numbers or filenames
- `supersedes`: ADR this replaces (null if none)
- `superseded_by`: ADR that replaces this (null if none)
- Custom fields: User-defined metadata

## Numbering Schemes

### Sequential

```
0001, 0002, 0003, ..., 0999, 1000
```

Filenames: `adr-0001-slug.md`, `adr-0002-slug.md`

**Use when:** Stable, long-lived decisions

### Date-Based

```
2026-08-18, 2026-08-18-1, 2026-08-18-2, 2026-08-19, ...
```

Filenames: `adr-2026-08-18-slug.md`, `adr-2026-08-18-1-slug.md`

**Use when:** Rapid iterations or daily decisions

### Custom (Future)

Extensible pattern system for organization-specific numbering.

## Test Coverage

```
Component              Tests   Coverage
────────────────────────────────────────
Config Loader            32      100%
Template Loader          18      100%
Validators               24      100%
Discovery                14      100%
────────────────────────────────────────
Total                    88     ~100%
```

All core components have comprehensive test coverage.

## Integration Points

### GitHub Actions

Can be integrated into CI/CD workflows:

```yaml
name: Validate ADRs
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm run adr:validate
```

### Pre-commit Hooks

Validate ADRs before commit:

```bash
npm run adr:validate || exit 1
```

### Development Tools

IDE plugins and tools (future):
- VSCode extension for ADR creation
- ADR preview in markdown editors
- Auto-completion for custom fields

## Performance Considerations

### File Scanning

- **Linear scan** of ADR directory
- Average O(n) for n ADRs
- Typical directories have <1000 ADRs
- Negligible impact on most workflows

### Validation

- Independent validator rules run sequentially
- Can be parallelized in future versions
- Typical validation <1 second for <500 ADRs

### Configuration Loading

- Single JSON schema validation
- Merged with defaults
- No I/O after initial load
- Configuration cached in memory

## Security Considerations

### YAML Parsing

- Uses safe YAML parsing (no arbitrary code execution)
- Input validation on all fields
- Schema validation prevents injection

### File Operations

- No symbolic link following
- Restricted to configured ADR directory
- Read-only for validation operations

### Custom Fields

- User-defined fields validated as strings
- No code execution in custom fields
- Escaped when rendered in templates

## Future Extensions

### Phase 2: Runtime Agent

- CLI command implementation
- GitHub Actions integration
- PR automation

### Phase 3: Advanced Features

- Jira integration for issue linking
- Linear integration for roadmap alignment
- Custom approval workflows
- Metrics and reporting dashboards

### Phase 4: Developer Experience

- VSCode/IDE extensions
- Web UI for ADR management
- Slack/Teams integration
- ADR analytics and insights

## Design Decisions

### Configuration Over Hardcoding

**Decision:** All behavior driven by `.adr-config.json`  
**Rationale:** Enables portability across contexts without code changes

### Composable Validators

**Decision:** Independent validator rules  
**Rationale:** Teams can enable/disable rules based on their needs

### Template Variants

**Decision:** 4 predefined templates instead of one-size-fits-all  
**Rationale:** Different decision types need different structures

### No Approval Workflow (Built-in)

**Decision:** Validation, not enforcement  
**Rationale:** Integrates with existing review processes (GitHub, linear, etc.)

## See Also

- [Installation Guide](INSTALLATION.md) — Setup instructions
- [Configuration Reference](CONFIGURATION_REFERENCE.md) — All options
- [Best Practices](BEST_PRACTICES.md) — When and how to write ADRs
