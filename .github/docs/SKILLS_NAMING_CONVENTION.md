# Skills Naming Convention

Per the [Agent Skills specification](https://agentskills.io/specification), a
skill's `name` must match its own directory name and may contain only lowercase
letters, digits, and hyphens — no underscores, and no leading, trailing, or
consecutive hyphens.

**Format**: `skills/<category>/<provider>/<skill>/SKILL.md`

## Examples

- `skills/local/plugin-provided/github/gh-address-comments/SKILL.md`
- `skills/local/plugin-provided/google-drive/google-sheets/SKILL.md`
- `skills/validation/changelog-format-check/SKILL.md`

## Layout

- `<category>` groups skills functionally
- `<provider>` groups skills by the plugin that supplies them (optional)
- `<skill>` is the directory name and **must** equal the frontmatter `name`

Skills with no provider grouping use `skills/<category>/<skill>/`.

## Categories

- validation - Skills that validate content or structure
- audit - Skills that audit and report on system state
- reporting - Skills that generate reports and summaries
- registry - Skills that build and manage registries
- utilities - Shared utility skills
- integration - Skills for cross-system integration
- migration - Skills for data and schema migrations

## Guidelines

- Use kebab-case for skill names (`[a-z0-9-]+`)
- Keep the directory name and frontmatter `name` identical
- Avoid underscores: `github__github` is invalid, use `github/github`
- Avoid generic names (helper, util, etc.)
- Document purpose in the file header

## Rationale

This convention ensures:

- Skills are discoverable by category and provider
- Purpose is clear from the naming
- Naming is consistent across all agents
- Registries validate against the 014 `generatedSkill` contract
