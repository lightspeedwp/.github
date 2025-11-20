# All Contributors Configuration

Documentation for managing contributors across LightSpeed organization repositories.

## Table of Contents

- [Configuration Options](#configuration-options)
- [Basic Project Information](#basic-project-information)
- [Display Settings](#display-settings)
- [Git Integration](#git-integration)
- [Contributors Management](#contributors-management)
- [Contributors Management](#contributors-management)
- [Usage](#usage)
- [Integration](#integration)

## Overview

This document explains the configuration options used in `.all-contributorsrc` for this project.

## Configuration Options

### Basic Project Information

- `projectName`: Name of the project/repository
- `projectOwner`: GitHub organization/user that owns the repository
- `repoType`: Type of version control system (github)
- `repoHost`: Base URL for the repository host
- `projectDescription`: Brief description of the project
- `projectWebsite`: Official project website URL
- `license`: Project license identifier (GPL-3.0-or-later)

### Display Settings

- `files`: Array of files where contributor information will be displayed (README.md)
- `imageSize`: Size of contributor avatar images in pixels (100)
- `contributorsPerLine`: Number of contributors to display per line in the README (7)
- `linkToUsage`: Whether to include a link to all-contributors usage information (true)

### Git Integration

- `commit`: Whether to automatically commit changes (false for manual control)
- `commitConvention`: Commit message convention to follow (conventional)

### Contributors Array

Each contributor object contains:

- `login`: GitHub username/handle
- `name`: Display name for the contributor
- `avatar_url`: GitHub profile avatar image URL
- `profile`: Link to contributor's GitHub profile
- `contributions`: Array of contribution types

## Contribution Types Used in This Project

### Available Contribution Types

- `code`: Wrote code for the project
- `design`: Created design elements and UI/UX
- `doc`: Wrote or improved documentation
- `ideas`: Contributed ideas and feedback
- `infra`: Set up and maintained infrastructure
- `maintenance`: Ongoing project maintenance
- `projectManagement`: Managed project activities
- `test`: Wrote tests and performed testing
- `business`: Handled business aspects and strategy
- `fundingFinding`: Helped find funding for the project

## Contributors Management

### Adding Contributors

```bash
# Add a contributor
npm run contributors:add

# Generate contributor section
npm run contributors:generate

# Check for missing contributors
npm run contributors:check
```

### Current Contributors

Based on the `.all-contributorsrc` configuration:

- **LightSpeedWP Organization**: Primary maintainer with contributions across all areas

## Usage

### Setup

1. Install All Contributors CLI: `npm install --save-dev all-contributors-cli`
2. Configure `.all-contributorsrc` with project details
3. Add npm scripts for contributor management
4. Initialize contributor section in README.md

### Adding New Contributors

```bash
# Interactive mode
npx all-contributors add ashleyshaw doc,code

# Or via npm script
npm run contributors:add ashleyshaw doc,code
```

### Updating README

After adding contributors, regenerate the contributor section:

```bash
npm run contributors:generate
```

## Integration

This configuration integrates with:

- [Package.json Configuration](./package-json.md) for npm scripts and dependencies
- [GitHub Actions](./github-actions.md) for automated contributor recognition
- [VS Code Configuration](./vscode.md) for development workflow
