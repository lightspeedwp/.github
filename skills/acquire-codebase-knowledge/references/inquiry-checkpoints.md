# Inquiry Checkpoints

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Per-template investigation questions for Phase 2 of the acquire-codebase-knowledge workflow. For each template area, look for answers in the scan output first, then read source files to fill gaps.

---

## 1. STACK.md — Tech Stack

- What is the primary language and exact version? (check `.nvmrc`, `go.mod`, `pyproject.toml`, Docker `FROM` line)
- What package manager is used? (`npm`, `yarn`, `pnpm`, `go mod`, `pip`, `uv`)
- What are the core runtime frameworks? (web server, ORM, DI container)
- What do `dependencies` (production) vs `devDependencies` (dev tooling) contain?
- Is there a Docker image and what base image does it use?
- What are the key scripts in `package.json` / `Makefile` / `pyproject.toml`?

## 2. STRUCTURE.md — Directory Layout

- Where does source code live? (usually `src/`, `lib/`, or project root for Go)
- What are the entry points? (check `main` in `package.json`, `scripts.start`, `cmd/main.go`, `app.py`)
- What is the stated purpose of each top-level directory?
- Are there non-obvious directories (e.g., `eng/`, `platform/`, `infra/`)?
- Are there hidden config directories (`.github/`, `.vscode/`, `.husky/`)?
- What naming conventions do directories follow? (camelCase, kebab-case, domain-based vs layer-based)

## 3. ARCHITECTURE.md — Patterns

- Is the code organized by layer (controllers → services → repos) or by feature?
- What is the primary data flow? Trace one request or command from entry to data store.
- Are there singletons, dependency injection patterns, or explicit initialization order requirements?
- Are there background workers, queues, or event-driven components?
- What design patterns appear repeatedly? (Factory, Repository, Decorator, Strategy)

## 4. CONVENTIONS.md — Coding Standards

- What is the file naming convention? (check 10+ files — camelCase, kebab-case, PascalCase)
- What is the function and variable naming convention?
- Are private methods/fields prefixed (e.g., `_methodName`, `#field`)?
- What linter and formatter are configured? (check `.eslintrc`, `.prettierrc`, `golangci.yml`)
- What are the TypeScript strictness settings? (`strict`, `noImplicitAny`, etc.)
- How are errors handled at each layer? (throw vs. return structured error)
- What logging library is used and what is the log message format?
- How are imports organized? (barrel exports, path aliases, grouping rules)

## 5. INTEGRATIONS.md — External Services

- What external APIs are called? (search for `axios.`, `fetch(`, `http.Get(`, base URLs in constants)
- How are credentials stored and accessed? (`.env`, secrets manager, env vars)
- What databases are connected? (check manifest for `pg`, `mongoose`, `prisma`, `typeorm`, `sqlalchemy`)
- Is there an API gateway, service mesh, or proxy between the app and external services?
- What monitoring or observability tools are used? (APM, Prometheus, logging pipeline)
- Are there message queues or event buses? (Kafka, RabbitMQ, SQS, Pub/Sub)

## 6. TESTING.md — Test Setup

- What test runner is configured? (check `scripts.test` in `package.json`, `pytest.ini`, `go test`)
- Where are test files located? (alongside source, in `tests/`, in `__tests__/`)
- What assertion library is used? (Jest expect, Chai, pytest assert)
- How are external dependencies mocked? (jest.mock, dependency injection, fixtures)
- Are there integration tests that hit real services vs. unit tests with mocks?
- Is there a coverage threshold enforced? (check `jest.config.js`, `.nycrc`, `pyproject.toml`)

## 7. CONCERNS.md — Known Issues

- How many TODOs/FIXMEs/HACKs are in production code? (see scan output)
- Which files have the highest git churn in the last 90 days? (see scan output)
- Are there any files over 500 lines that mix multiple responsibilities?
- Do any services make sequential calls that could be parallelized?
- Are there hardcoded values (URLs, IDs, magic numbers) that should be config?
- What security risks exist? (missing input validation, raw error messages exposed to clients, missing auth checks)
- Are there performance patterns that don't scale? (N+1 queries, in-memory caches in multi-instance setups)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)
