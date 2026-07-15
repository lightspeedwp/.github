# Repo Analysis Example

## Scenario
A LightSpeed team needs a Playwright rollout plan for a custom WordPress theme with WooCommerce templates and GitHub Actions.

## Inputs
- GitHub repo structure for a theme and companion plugin
- Existing package manager and Playwright config files
- Branch convention requiring pull requests into `develop`
- Existing helper utilities for seeded WooCommerce data

## Output
The agent documents repository name, project type, package manager, existing test setup, existing Playwright files, theme and plugin structure, relevant routes, test ID conventions, fixtures, CI workflows, risks, and recommended file changes.

## Why This Works
This example keeps repo analysis grounded in actual project structure before any write-back is proposed.

## Related Schema
`schemas/repo-analysis.schema.json`
