# Scripts Directory

This folder contains all automation and utility scripts for the LightSpeed WP automation project. All scripts are now grouped under the `utility` folder to support modularity, maintainability, and testability.

## Structure

- **utility/**: All Node.js and shell scripts for label management, reporting, workflow automation, versioning, and maintenance tasks (including former maintenance scripts).
  - Example scripts: `label-lookup.js`, `label-utils.js`, `lint-shell.sh`, `utility-functions.sh`, `manage-labels.sh`, `manage-issue-types.sh`, `sync-version.js`, etc.
- **includes/**: Shared code or configuration for scripts (if present).

## Usage

- All scripts in `utility/` are referenced by automated tests in `/tests/utility/`.
- Shell scripts use strict mode and are linted with ShellCheck.
- Node.js scripts are tested for CLI usage and integration.

## Best Practices

- Keep scripts modular and well-documented.
  - Use descriptive names and clear argument parsing.
  - Ensure every script has a corresponding test in `/tests/utility/`.
  - Follow LightSpeed and WordPress coding standards for shell and JS.

See the `/tests/` folder for test coverage and usage examples.
