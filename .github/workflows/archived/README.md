# Workflows Directory

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)
This directory contains reusable GitHub Actions workflows for the LightSpeed WP organization.

## Usage

These workflows can be called from other repositories using the `workflow_call` trigger:

```yaml
jobs:
    call-reusable-workflow:
        uses: lightspeedwp/lightspeedwp-automation/.github/workflows/workflow-name.yml@main
        with:
            input-parameter: value
        secrets:
            secret-name: ${{ secrets.SECRET_NAME }}
```

## Workflow Categories

### CI/CD Workflows

- Continuous integration pipelines
- Automated testing workflows
- Build and deployment processes

### Release Management

- Version tagging and release creation
- Changelog generation
- Package publishing

### Code Quality

- Linting and formatting
- Security scanning
- Dependency updates

## Naming Convention

- Use kebab-case for workflow filenames (e.g., `deploy-wordpress-site.yml`)
- Include `.yml` extension
- Use descriptive names that indicate the workflow's purpose

## Workflow Template

```yaml
name: Reusable Workflow Name

on:
    workflow_call:
        inputs:
            input-name:
                description: 'Description of input parameter'
                required: true
                type: string
        secrets:
            SECRET_NAME:
                description: 'Description of required secret'
                required: true

jobs:
    job-name:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            # Add your workflow steps here
```

## Best Practices

1. Make workflows reusable with proper input parameters
2. Use semantic versioning for workflow tags
3. Document all inputs and secrets clearly
4. Include error handling and logging
5. Test workflows thoroughly before tagging

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
