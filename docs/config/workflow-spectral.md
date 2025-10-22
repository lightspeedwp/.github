# Spectral Configuration

Documentation for YAML and GitHub workflow validation using Spectral.

## Table of Contents

- [Files](#files)
- [Usage](#usage)
- [Rules](#rules)
- [Integration](#integration)
- [VS Code Integration](#vs-code-integration)

## Overview

This directory contains Spectral configuration files for validating YAML and GitHub workflows.

## Files

- **`.spectral.yaml`**: Base Spectral configuration extending recommended rules
- **`.spectral-workflows.yaml`**: GitHub Actions-specific validation rules

## Usage

### Install dependencies

```bash
npm install
```

### Lint YAML files

```bash
npm run lint:yaml
```

### Lint GitHub workflows

```bash
npm run lint:workflows
```

### Lint everything

```bash
npm run lint:all
```

## Rules

### Base Rules (`.spectral.yaml`)

- `document-defined: true` - Ensures documents have proper structure
- `no-empty-keys: true` - Prevents empty key values
- `no-unused-variables: false` - Allows GitHub Actions matrix expressions

### Workflow Rules (`.spectral-workflows.yaml`)

- `github-action-mandatory-name` - Ensures all workflows have a `name` field

## Integration

Spectral is integrated into the npm scripts:

- `lint:yaml` - Validates all YAML files using base rules
- `lint:workflows` - Validates GitHub workflows using workflow-specific rules
- `lint:all` - Runs all linting including Spectral validation

## VS Code Integration

For real-time validation in VS Code, install the [Spectral VS Code extension](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral).
