---
version: v0.1.1
last_updated: '2026-08-21'
owners:
  - lightspeedwp
file_type: documentation
description: Configuration reference for tools, standards, and automation
---

# Configuration Reference

## Project Configuration Files

### `.editorconfig`

Ensures consistent coding style across all editors and IDEs.

**Key Settings**:

- Indent style: spaces (2 spaces)
- End of line: LF
- Charset: UTF-8
- Trim trailing whitespace
- Insert final newline

### `.gitignore`

Excludes files from version control.

**Common Entries**:

- `node_modules/`
- `.env` and `.env.local`
- `build/` and `dist/`
- `.DS_Store`
- `*.log`

### `package.json`

NPM package configuration and scripts.

**Key Scripts**:

- `npm test`: Run test suite
- `npm run lint:md`: Lint Markdown files
- `npm run lint:js`: Lint JavaScript/TypeScript
- `npm run format`: Format code with Prettier

### `.npmrc` or `composer.json`

Package manager configuration.

**Settings**:

- Registry configuration
- Authentication tokens (in `.npmrc`)
- Version constraints
- Dependency specifications

## GitHub Configuration

### Branch Protection Rules

- Require status checks to pass
- Require code review (1 approver minimum)
- Require up-to-date branches
- Include administrators

### Labels

Organization-wide label taxonomy:

- **Type**: bug, feature, docs, refactor
- **Priority**: critical, high, medium, low
- **Status**: backlog, in-progress, review, done
- **Component**: Component-specific labels

### Code Owners

Specifies required reviewers for files:

```
* @default-owner
src/core/ @core-team
docs/ @docs-team
```

## CI/CD Configuration

### GitHub Actions

- Workflow files in `.github/workflows/`
- Trigger on: push, pull_request, schedule
- Matrix strategy for multiple environments
- Caching for dependencies

### Status Checks

Required checks for all PRs:

- Unit tests pass
- Linting passes
- Coverage maintained
- Type checking passes
- Security scanning passed

## Tool Configuration Files

### ESLint (`.eslintrc.js`)

JavaScript/TypeScript linting.

**Rules**:

- Enforce consistent code style
- Detect potential errors
- Require accessibility best practices
- No console statements in production

### Prettier (`.prettierrc`)

Code formatting.

**Settings**:

- Print width: 100
- Tab width: 2
- Use spaces (not tabs)
- Trailing commas: es5
- JSX single quotes

### PHPCS (`.phpcs.xml.dist`)

PHP code quality.

**Standards**:

- WordPress Coding Standards (WPCS)
- Custom rule sets
- Exclude test files and vendor
- Auto-fixable violations

### TypeScript (`tsconfig.json`)

Type checking configuration.

**Compiler Options**:

- Strict mode enabled
- Target: ES2020
- Module: ESNext
- Strict null checks

## Documentation Configuration

### Front Matter Schema

All documentation files use YAML front matter with:

- `file_type`: Document type (instruction, documentation, etc.)
- `title`: Human-readable title
- `description`: Brief description
- `version`: Semantic version
- `last_updated`: Last modification date
- `owners`: Team responsible for content

### Markdown Standards

- Headings: h1-h6 only (proper hierarchy)
- Code blocks: language specified
- Links: inline markdown format
- Lists: 2-space indentation
- Tables: markdown format

## Automation Configuration

### Labeling Rules

Automated labels based on:

- File changes (e.g., `.github/` → governance)
- Content matching (keywords trigger labels)
- Type detection (PR vs issue)
- Assignee based routing

### Release Configuration

- Version management: Semantic Versioning
- Changelog format: Keep a Changelog
- Release notes: GitHub releases
- Tag format: `v{major}.{minor}.{patch}`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*
