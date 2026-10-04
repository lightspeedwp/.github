# package.json Requirements for Agents

**Applies to**: `{agent}/package.json` in all agents

**Validation**: checked by `PackageJsonValidator`, which runs only when you invoke
`node scripts/validation/phase-4-structure-audit.js` directly. No npm script or
workflow calls it, and there is no `validate:package-json` script. The
`audit:structure` script runs a different program that does not use this
validator, so this is a manual check rather than a CI gate.

---

## Required Fields

### Core Metadata

```json
{
  "name": "@lightspeedwp/{agent-name}",
  "version": "1.0.0",
  "description": "Brief one-line description of the agent",
  "main": "index.js",
  "type": "module",
  "license": "GPL-3.0-or-later"
}
```

**Constraints**:

- **name**: MUST be `<scope>/{agent-name}`, where `<scope>` is the scope of the repository root `package.json` (currently `@lightspeedwp`)
  - Matches folder name: `agents/prd-agent/` → `"name": "@lightspeedwp/prd-agent"`
  - Used for npm scoping and imports

- **version**: MUST match latest entry in CHANGELOG.md
  - Format: Semantic versioning (MAJOR.MINOR.PATCH)
  - Examples: `1.0.0`, `2.1.3`, `0.1.0`

- **description**: Brief summary (50-100 characters)
  - Appears in agent registry
  - Example: `"Generates product requirements documents using templates"`

- **main**: Entry point file
  - Typically `index.js` or `src/index.js`
  - MUST be resolvable from package root

- **type**: MUST be `"module"` (ES modules)
  - Required for modern Node.js
  - Enables `import` statements

- **license**: MUST match the repository root `package.json` licence (currently `"GPL-3.0-or-later"`)
  - Consistent across all agents

### Engine Requirements

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Constraint**: Node.js >= 18.0.0 (LTS minimum)

### Scripts

```json
{
  "scripts": {
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

**Required scripts**:

- **test**: Run test suite (typically `jest`)
  - Runs all tests in `tests/` folder
  - MUST exit 0 on pass, non-zero on failure
  - Example: `"test": "jest --coverage"`

- **lint**: Lint code (typically `eslint`)
  - MUST check syntax and style
  - Example: `"lint": "eslint . --max-warnings 0"`

**Optional scripts** (if applicable):

- **build**: Compile/transpile code
- **start**: Run the agent standalone
- **pretest**: Setup before tests
- **posttest**: Cleanup after tests

### Dependencies

```json
{
  "dependencies": {
    "dep-name": "^1.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

**Rules**:

- **No production dependencies** on other agents
  - Agents must be independently deployable
  - Use shared `skills/` folder for shared functionality

- **devDependencies** for testing, linting, formatting
  - Must include: `jest`, `eslint`, `prettier`
  - Versions should be recent but stable

- **Version constraints**: Prefer caret (`^1.0.0`) for flexibility
  - Allows patch/minor updates automatically
  - Prevents major breaking changes

---

## Optional Fields

```json
{
  "keywords": ["agent", "lightspeedwp", "prd"],
  "author": "LightSpeedWP",
  "repository": {
    "type": "git",
    "url": "https://github.com/lightspeedwp/.github"
  },
  "bugs": {
    "url": "https://github.com/lightspeedwp/.github/issues"
  }
}
```

---

## Validation Rules

Reported as an `error`, so they fail the run:

1. ✅ Valid JSON syntax
2. ✅ `name` matches the agent folder name
3. ✅ `version` is valid semver
4. ✅ `main` file exists. Existence only; the validator does not resolve or load it.
5. ✅ `type` is `"module"`
6. ✅ `license` matches the organisation licence in the root `package.json`
7. ✅ `test` and `lint` scripts are declared. **Presence only** — the validator
   never executes them, so a declared script that fails is not caught here.
8. ✅ `dependencies` do not reference another agent

Reported as a `warning`, so they do not fail the run:

- `engines.node` is a valid range resolving to 18 or later.
- `devDependencies` do not reference another agent.

**Not implemented.** No check covers any of the following:

- `version` matching CHANGELOG.md.
- `test` or `lint` being executed and passing.

Required fields are `name`, `version`, `description`, `main`, `type` and `license`.

---

## Common Issues & Fixes

### Issue: Name mismatch

**Problem**: Folder is `agents/prd-agent/` but `package.json` has `"name": "prd-agent"`

**Fix**: Change to `"name": "@lightspeedwp/prd-agent"`

### Issue: Version mismatch

**Problem**: `package.json` has `"version": "1.0.0"` but CHANGELOG.md latest is `2.0.0`

**Fix**: Update `package.json` to match CHANGELOG.md, or vice versa

### Issue: Missing scripts

**Problem**: `package.json` missing `test` or `lint` scripts

**Fix**: Add to scripts section:

```json
{
  "scripts": {
    "test": "jest",
    "lint": "eslint ."
  }
}
```

### Issue: Circular dependency on another agent

**Problem**: `dependencies` includes `agents-other-agent`

**Fix**: Move shared code to `skills/` folder, import as skill instead

---

## Template

See [agent-structure-template/package.json](../templates/agent-structure-template/package.json)

---

## Related

- [Agent Folder Structure](AGENT_FOLDER_STRUCTURE.md)
- [CHANGELOG Format](CHANGELOG_FORMAT.md)
- [npm package.json documentation](https://docs.npmjs.com/cli/configuring-npm/package-json)
- [Semantic Versioning](https://semver.org/)
