# Development Workflow for {{projectName}}

## Setup

- Install dependencies: `npm install`, `composer install`
- Start dev mode: `npm run start`
- Build assets: `npm run build`
- Lint: `npm run lint`
- Test: `npm test`, `composer test`

## Mustache Placeholders

- All template files use placeholders (`{{slug}}`, etc.).
- See [`PLACEHOLDER-WORKFLOW.md`](./PLACEHOLDER-WORKFLOW.md) for replacement steps.

## VSCode & Tools

- Recommended extensions in `.vscode/extensions.json`
- See [`BUILD-SCRIPTS.md`](./BUILD-SCRIPTS.md) for build/test scripts.

## Git Workflow

- Feature branches, PRs, pre-commit hooks (.husky).
- Reference issues in PRs.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for details.