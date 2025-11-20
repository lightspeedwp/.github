# Ignore Files Documentation

Documentation for ignore/exclude files used in LightSpeed projects to control which files are processed by various tools.

## Table of Contents

- [Overview](#overview)
- [Prettier Ignore](#prettier-ignore)
- [Spectral Ignore](#spectral-ignore)
- [ShellCheck Ignore](#shellcheck-ignore)
- [NPM Configuration](#npm-configuration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

### File Types

| File              | Tool       | Purpose                       |
| ----------------- | ---------- | ----------------------------- |
| `.prettierignore` | Prettier   | Skip code formatting          |
| `.spectralignore` | Spectral   | Skip YAML/workflow validation |
| `.shellcheckrc`   | ShellCheck | Shell script linting config   |
| `.npmrc`          | npm        | NPM configuration             |
| `.editorconfig`   | Editors    | Editor behavior               |
| `.gitignore`      | Git        | Source control ignore         |

## Prettier Ignore

### `.prettierignore`

Excludes files from Prettier code formatting.

```
# Dependencies
node_modules/
vendor/

# Build outputs
build/
dist/
coverage/

# Testing
test-results/
playwright-report/

# Logs
logs/
*.log

# Environment
.env
.env.local

# IDE/Editor
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Specific files
*.min.js
*.min.css
CHANGELOG.md
```

### Usage

Prettier automatically respects `.prettierignore`:

```bash
# Format (skips ignored files)
npm run format

# Or directly
prettier --write '**/*.{js,css,md,json}'
```

### Common Patterns

```
# Exclude entire directory
node_modules/

# Exclude file type
*.min.js

# Exclude specific path
.github/workflows/
src/generated/

# Exclude with wildcards
**/__tests__/**

# Include after exclusion
!important-file.js
```

## Spectral Ignore

### `.spectralignore`

Excludes files from Spectral YAML/workflow validation.

```
# Dependencies and tools
node_modules/
.git/
vendor/

# Build and dist
build/
dist/
coverage/

# Logs and temp
logs/
tmp/
*.log

# IDE
.idea/
.vscode/

# Non-configuration files
*.md
*.txt

# Specific directories
scripts/
tests/
```

### Usage

```bash
# Spectral respects .spectralignore
npm run lint:workflows

# Or directly
spectral lint '.github/workflows/**/*.yml'
```

## ShellCheck Ignore

### `.shellcheckrc`

Configuration file for ShellCheck shell script linting.

```bash
# Enable all warnings
enable=all

# Disable specific checks (if needed)
disable=SC2181  # Check exit code directly

# Source directories
source-path=SCRIPTDIR

# Format output
format=gcc
```

### Common ShellCheck Codes

| Code       | Issue              | Solution                    |
| ---------- | ------------------ | --------------------------- | --- | ---------------- |
| **SC2086** | Unquoted variable  | Quote variables: "$var"     |
| **SC2181** | Check exit code    | Use                         |     | and && operators |
| **SC2016** | $ in single quotes | Use double quotes or escape |
| **SC2046** | Quote command sub  | Quote $(command) results    |
| **SC2102** | Ranges in brackets | Use [[]] instead of [ ]     |

### Usage

```bash
# Lint shell scripts
shellcheck scripts/*.sh

# With config
shellcheck --exclude SC2181 scripts/*.sh

# Fix issues
shellcheck -x scripts/setup.sh
```

## NPM Configuration

### `.npmrc`

NPM registry and authentication configuration.

```
# Use exact versions
save-exact=true

# Use legacy peer dependency resolution
legacy-peer-deps=false

# npm registry
registry=https://registry.npmjs.org/

# Authentication (use environment variables)
# //registry.npmjs.org/:_authToken=${NPM_TOKEN}

# Verbosity level
loglevel=warn

# Set package access
access=public
```

### Usage

NPM automatically reads `.npmrc`:

```bash
# Install dependencies (uses .npmrc settings)
npm install

# Verify current settings
npm config list
```

### Security

Never commit auth tokens to `.npmrc`. Use environment variables:

```bash
# In CI/CD
export NPM_TOKEN=your-token
npm install
```

## Best Practices

### File Organization

```
Project Root/
├── .prettierignore       # Formatting exclusions
├── .spectralignore       # YAML validation exclusions
├── .shellcheckrc         # ShellCheck configuration
├── .npmrc                # npm configuration
├── .editorconfig         # Editor behavior
├── .gitignore            # Git exclusions
└── ...
```

### Common Patterns

**Exclude dependencies:**

```
node_modules/
vendor/
```

**Exclude builds:**

```
dist/
build/
coverage/
```

**Exclude environment files:**

```
.env
.env.local
.env.*.local
```

**Exclude logs:**

```
*.log
logs/
```

**Exclude IDE files:**

```
.vscode/
.idea/
*.swp
*.swo
```

## Troubleshooting

### Common Issues

#### "Tool not respecting ignore file"

**Cause:** Ignore file not in project root

**Solution:** Ensure file is in root directory:

```bash
ls -la .prettierignore
ls -la .spectralignore
```

#### "Files being formatted/linted when shouldn't be"

**Cause:** Missing or incorrect ignore pattern

**Solution:** Add pattern to ignore file:

```
# Add to .prettierignore
path/to/file.js
```

#### "npm install ignoring configuration"

**Cause:** `.npmrc` not read (maybe permission issue)

**Solution:**

1. Verify file is readable: `chmod 644 .npmrc`
2. Check for typos: `npm config list`
3. Use environment variables for sensitive data

#### "Spectral validating files that should be ignored"

**Cause:** Wrong `.spectralignore` syntax

**Solution:** Use `.gitignore`-style patterns:

```
# Correct
*.bak
vendor/

# Wrong
*.bak*
vendor
```

#### "ShellCheck not respecting config"

**Cause:** Config file not found or wrong format

**Solution:**

1. Verify `.shellcheckrc` exists and is readable
2. Check format: ini-style configuration
3. Test with command line: `shellcheck -x script.sh`

## Related Documentation

- [EditorConfig](./editorconfig.md) - Editor configuration
- [Prettier Configuration](./lint-prettier.md) - Formatting
- [Spectral Configuration](./workflow-spectral.md) - YAML validation
- [Linting Overview](../LINTING.md) - All tools
- [npm Documentation](https://docs.npmjs.com/cli/v9/configuring-npm/npmrc) - Official npm config
