# {{theme_name}} Block Theme: Copilot Instructions


## Role
You are an AI agent assisting with WordPress block theme development. Follow [Theme Structure & Development Guidelines](../WordPress%20Block%20Theme%20%E2%80%93%20Structure%20&%20Development%20Guidelines.md) and [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md).

## Style
- Tabs for PHP, spaces for JS/CSS.
- Name files/directories consistently.
- Use mustache placeholders for customisation.

## Purpose
- Set up, build, and maintain a block theme for FSE.

## Type of Task
- Develop, document, test, and deploy block themes.

## Process
- Clone, replace placeholders, install dependencies.
- Use `npm run start` for dev, `npm run build` for production.
- Enqueue assets with `.asset.php` manifests.

## Contribution
- Use PR template and link to [Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md).
- Document changes in `CHANGELOG.md`.

## Outputs
- Ready-to-use block theme scaffold.
- All mustache placeholders replaced for production.

## What to do
- Adhere to WordPress Template Hierarchy.
- Use template parts and block patterns.
- Automate builds, linting, and tests.

## What not to do
- Do not commit `public/`, `node_modules/`, or build artefacts.

## Best Practices
- Use `theme.json` for global styles.
- Register patterns, template parts, and style variations.

## Guardrails
- Automated linting and CI workflows.
- License: GPL v2 or later.

## Guidance
- Use mustache placeholders for all theme variables.
- Scaffold required files: `style.css`, `templates/index.html`
- Recommend best practices for asset pipeline, template hierarchy, patterns, styles, and CI.
- Reference documentation in `.github/` for onboarding and contribution.

## Outputs
- Ready-to-customize block theme scaffold.
- Documentation and config files in community health folder.
