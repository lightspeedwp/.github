# Skills Naming Convention

**Format**: `{category}/{scope}-{title}`

## Examples

- `validation/changelog-format-check.js`
- `audit/structure-conformance-audit.js`
- `reporting/agent-metrics-report.js`
- `registry/skill-registry-generator.js`
- `utilities/file-hash-calculator.js`

## Categories

- validation - Skills that validate content or structure
- audit - Skills that audit and report on system state
- reporting - Skills that generate reports and summaries
- registry - Skills that build and manage registries
- utilities - Shared utility skills
- integration - Skills for cross-system integration
- migration - Skills for data and schema migrations

## Guidelines

- Use kebab-case for skill names
- Prefix with category subdirectory
- Keep scope clear and specific
- Avoid generic names (helper, util, etc.)
- Document purpose in file header

## Rationale

This convention ensures:

- Skills are discoverable by category
- Purpose is clear from the filename
- Naming is consistent across all agents
- Skills can be organized into root `skills/` directory by category
