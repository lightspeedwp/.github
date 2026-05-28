# 🧪 LightSpeedWP Testing Framework

<!-- BADGES-START -->
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
<!-- BADGES-END -->

## Metadata

| Field          | Value                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Description    | Unified testing framework for LightSpeedWP automation: shell (Bats), JavaScript (Jest), Python validation, and coverage quality gates.                                                                                                                                                                                                     |
| Version        | 2.2.0                                                                                                                                                                                                                                                                                                                                      |
| Last Updated   | 2025-10-25                                                                                                                                                                                                                                                                                                                                 |
| Owners         | Ash Shaw; LightSpeedWP QA                                                                                                                                                                                                                                                                                                                  |
| Key References | [`scripts/README.md`](../scripts/README.md), [`docs/TESTING.md`](../docs/TESTING.md), [`test-helpers.js`](./test-helpers.js), [`test-template-labels.js`](./test-template-labels.js), [`../.schemas/README.md`](../.schemas/README.md), [`testing workflow`](../.github/workflows/testing.yml) |

![Testing Badge](https://img.shields.io/badge/testing-comprehensive-brightgreen?style=flat-square)
![Coverage Badge](https://img.shields.io/badge/coverage-tracked-blue?style=flat-square)
![Bats Badge](https://img.shields.io/badge/bats-shell--testing-orange?style=flat-square)
![Jest Badge](https://img.shields.io/badge/jest-js--testing-success?style=flat-square)
![Automation Badge](https://img.shields.io/badge/automation-validated-purple?style=flat-square)
![CI/CD Badge](https://img.shields.io/badge/ci%2Fcd-integrated-informational?style=flat-square)

Comprehensive automated tests for the LightSpeedWP automation project. Suites span shell (Bats), JavaScript (Jest), Python-based doc/schema validation, plus centralized coverage and quality gates. Test layout mirrors script and schema responsibilities for traceability.

> Single source of truth for automation quality: fast feedback locally (Bats/Jest) + full pipeline validation (coverage, lint, schema checks).

## 📊 Testing Architecture

```mermaid
graph TB
    A[Testing Framework] --> B[Bats Testing]
    A --> C[Jest Testing]
    A --> D[Coverage Reporting]
    A --> E[Test Helpers]

    B --> F[Shell Script Tests]
    B --> G[CLI Interface Tests]
    B --> H[Integration Tests]

    C --> I[JavaScript Unit Tests]
    C --> J[Agent Module Tests]
    C --> K[Advanced Logic Tests]

    D --> L[Coverage Reports]
    D --> M[Quality Metrics]
    D --> N[Test Summary]

    E --> O[Shared Helpers]
    E --> P[Setup/Teardown]
    E --> Q[Environment Isolation]

    R[CI/CD Pipeline] --> A
    S[Pre-commit Hooks] --> A
    T[Manual Testing] --> A

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
```

## Structure

### 📁 Test Directory Organization

Current test assets in this folder:

- **[`bash/`](./bash/)** — Bats shell test suites
- **[`js/`](./js/)** — Jest test suites
- **[`test-helpers.js`](./test-helpers.js)** — Shared JS test helpers
- **[`test-template-labels.js`](./test-template-labels.js)** — Label-template test utility

### 📄 Core Test Files

- **[`bash/`](./bash/)** — Bats tests for shell-based workflows
- **[`js/`](./js/)** — Jest tests for Node and automation logic
- **[`../docs/TESTING.md`](../docs/TESTING.md)** — Coverage and testing guidance

## Usage & Quickstart

Run the entire test stack locally (shell + JS + Python) or target specific layers for faster iteration.

Typical commands:

- Run all tests (orchestrated shell + jest): `./run-all-tests.sh`
- Run Bats only: `bats tests/` (or `bats tests/utility` for a subset)
- Run Jest unit tests: `npm test` (alias for `npx jest`)
- Run Python doc/schema validations: `pytest tests/pytests`
- Show coverage summary (after Jest): `npx jest --coverage` and review the generated terminal report

Minimal smoke check (fast):

```bash
./run-all-tests.sh --fast
```

CI calls the same runner during pull requests; failures block merges when thresholds are not met.

## Validation & Testing

| Layer              | Tooling                          | Purpose                         | Trigger         |
| ------------------ | -------------------------------- | ------------------------------- | --------------- |
| Shell scripts      | Bats + custom `test-helper.bash` | Functional + CLI behavior       | Manual / Runner |
| JavaScript modules | Jest + built-in mocks            | Logic, edge cases, agents       | Manual / Runner |
| Python validations | Pytest                           | Docs + changelog + schema links | Manual / Runner |
| Coverage           | Jest (istanbul/nyc) + lcov       | Quality gate & trend tracking   | Runner / CI     |
| Lint (markdown)    | markdownlint                     | Structural doc compliance       | Pre-commit / CI |
| Lint (shell)       | ShellCheck                       | Script robustness               | Pre-commit / CI |
| Lint (js)          | ESLint                           | Code quality/style              | Pre-commit / CI |
| Schema validation  | Node + AJV (planned)             | JSON schema integrity           | CI (upcoming)   |

Quality gates (indicative targets):

- Overall line coverage >= 80%
- Critical scripts (utility) >= 90% branch coverage
- Zero high-severity ShellCheck warnings
- No markdownlint structural violations

Add new tests by placing `.bats` or `.test.js` files following existing naming patterns; keep fixtures isolated in `projects/fixtures`.

## Best Practices

1. Parity: Every executable script in `scripts/utility/` must have at least one test (happy + failure path).
2. Isolation: Use `test-helper.bash` for environment setup/teardown—avoid mutating global state.
3. Determinism: Mock network/filesystem where possible; prefer fixtures over ad-hoc inline data.
4. Coverage Improvement: Focus on untested branches before adding new features.
5. Documentation: When adding complex test helpers, update this README or `../docs/TESTING.md`.
6. Fast Feedback: Keep critical path tests lean (< 2s) to optimize pre-commit runs.

## 🔄 Test Execution Workflow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Runner as Test Runner
    participant Bats as Bats Framework
    participant Jest as Jest Framework
    participant Coverage as Coverage Reporter
    participant CI as CI/CD Pipeline

    Dev->>Runner: Execute run-all-tests.sh
    Runner->>Bats: Run shell script tests
    Bats->>Bats: Execute .bats files
    Bats->>Runner: Return Bats results
    Runner->>Jest: Run JavaScript tests
    Jest->>Jest: Execute .test.js files
    Jest->>Runner: Return Jest results
    Runner->>Coverage: Generate coverage reports
    Coverage->>CI: Upload coverage data
    CI->>Dev: Test results & coverage

    Note over Dev,CI: Comprehensive test automation
```

## 🎯 Test Coverage Flow

```mermaid
flowchart TD
    A[Test Execution] --> B{Test Type}
    B -->|Shell Scripts| C[Bats Testing]
    B -->|JavaScript| D[Jest Testing]

    C --> E[CLI Tests]
    C --> F[Integration Tests]
    C --> G[Shell Function Tests]

    D --> H[Unit Tests]
    D --> I[Module Tests]
    D --> J[Agent Tests]

    E --> K[Coverage Collection]
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K

    K --> L[Coverage Analysis]
    L --> M{Coverage Threshold}
    M -->|Pass| N[Success Report]
    M -->|Fail| O[Coverage Warning]

    N --> P[CI/CD Success]
    O --> Q[Quality Gate Failure]

    style A fill:#e1f5fe
    style K fill:#f3e5f5
    style N fill:#c8e6c9
    style Q fill:#ffcdd2
```

See `../docs/TESTING.md` for coverage details and examples.

---

## Change Log / History

| Date    | Change                                                 | Notes                             |
| ------- | ------------------------------------------------------ | --------------------------------- |
| 2025-01 | Added Python doc/schema validation tests               | Extended multi-language assurance |
| 2025-06 | Coverage thresholds enforced in CI                     | Blocking merges below 80%         |
| 2025-09 | Restructured folders for clarity (includes/, utility/) | Improved discoverability          |
| 2025-10 | Unified README format & owners/references fields       | Cross-project consistency         |

See repository commit history for granular diffs.

## FAQ / Troubleshooting

| Issue                             | Cause                             | Fix                                      |
| --------------------------------- | --------------------------------- | ---------------------------------------- |
| `bats: command not found`         | Bats not installed                | `brew install bats-core`                 |
| Jest tests hang                   | Open handles (unclosed timers/fs) | Use `--detectOpenHandles` locally        |
| Coverage below threshold          | Missing branch/edge tests         | Add tests for conditional paths          |
| ShellCheck failures in CI         | New script patterns flagged       | Run `shellcheck <file>` & refactor       |
| Pytest path errors                | Virtualenv / path misconfig       | Activate env or adjust `PYTHONPATH`      |
| Permissions denied running runner | Script not executable             | `chmod +x run-all-tests.sh`              |
| Flaky integration test            | External dependency drift         | Mock network/services or freeze fixtures |

## Limitations & Notes

- Integration tests for multi-service workflows are partially stubbed; expand planned.
- Schema validation (AJV) is documented but not fully automated yet.
- Some legacy scripts lack failure-path assertions—backlog item to close gaps.
- Python tests focus on docs/link integrity; functional Python modules (if added) need new test harness.
- Performance benchmarking tests are out-of-scope for current CI pipeline.

## Environment & Dependencies

| Component        | Required Version | Notes                                   |
| ---------------- | ---------------- | --------------------------------------- |
| Node.js          | >= 18.x          | Align with runtime in scripts directory |
| Bash             | >= 5.x           | macOS ships with compatible version     |
| Bats Core        | latest stable    | Install via Homebrew                    |
| Jest             | ^29.x            | Provides coverage instrumentation       |
| Pytest           | ^8.x             | For schema/doc validation tests         |
| ShellCheck       | latest           | Static analysis for shell scripts       |
| markdownlint-cli | latest           | Documentation linting                   |
| ESLint           | project config   | JS style and static analysis            |

Optional local setup acceleration:

```bash
brew install bats-core shellcheck
pip install -r requirements-dev.txt  # if present
npm ci
```

## References

### 🔗 Documentation Links

#### Core Testing Documentation

- [Testing Guide](../docs/TESTING.md) — Testing and coverage guidance
- [Jest Configuration](../.jest.config.cjs) — JavaScript testing framework configuration
- [Testing Workflow](../.github/workflows/testing.yml) — Automated test workflow
- [Quality Assurance](../instructions/quality-assurance.instructions.md) — Testing standards and best practices

#### Test Folder Documentation

- [Bats Test Suites](./bash/) — Shell-based tests
- [Jest Test Suites](./js/) — JavaScript/TypeScript tests
- [Shared Test Helpers](./test-helpers.js) — Common helper functions
- [Template Label Tests](./test-template-labels.js) — Template-label validation helper

### 🛠️ Development Resources

#### Testing Frameworks & Tools

- [Bats Testing Framework](https://github.com/bats-core/bats-core) — Bash Automated Testing System
- [Jest Testing Documentation](https://jestjs.io/docs/getting-started) — JavaScript testing framework
- [Shared Test Helpers](./test-helpers.js) — Common testing utilities
- [GitHub Actions Testing Workflow](../.github/workflows/testing.yml) — CI/CD testing automation

#### Related Project Documentation

- [Scripts Directory](../scripts/README.md) — Main automation scripts documentation
- [Schema Validation](../.schemas/README.md) — JSON schema validation and configuration
- [Testing Documentation](../docs/TESTING.md) — Test coverage reporting and analysis guidance

#### 🎯 AI & Automation

- [Custom Instructions](../.github/custom-instructions.md)
- [Agents Documentation](../agents/agent.md)
- [Prompts Library](../.github/prompts/prompts.md)
- [Scripts Directory](../scripts/)
- [Contributing Guidelines](../CONTRIBUTING.md)

---

*🧪 Ensuring quality through comprehensive testing and continuous coverage validation.*

<!-- RANDOM FOOTER: 🧪 Docs signed by Copilot for LightSpeedWP -->

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
