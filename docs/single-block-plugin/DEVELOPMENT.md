# Development Workflow: Single Block Plugin

This guide explains how to set up, develop, and maintain your single-block plugin.

## Setup

- Clone repo
- Install dependencies: `npm install`, `composer install`
- Start dev mode: `npm run start`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test`, `composer test`

## Mustache Placeholders

- All template/config files use mustache-style placeholders (`{{slug}}`, etc.). See README for mapping.

## Internationalisation

- All blocks are i18n-ready. Use `@wordpress/i18n` and mustache for `textdomain`.
- Always wrap strings for translation.

## Contributor Workflow

- Branch, commit, PR via GitHub
- Reference issues in PRs
- Follow [CONTRIBUTING.md](../CONTRIBUTING.md) and coding standards

---
Reference: [repo-template.md](./repo-template.md)