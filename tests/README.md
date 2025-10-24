---
title: "LightSpeedWP Testing Framework"
version: "v2.1"
last_updated: "2025-01-14"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Comprehensive testing framework for LightSpeed WP automation project. Organized test suites covering Bats shell testing, Jest JavaScript testing, and comprehensive coverage reporting."
type: "testing"
status: "production"
tags: ["testing", "bats", "jest", "automation", "coverage", "shell", "javascript", "ci-cd"]
license: "GPL-3.0"
repository: "https://github.com/lightspeedwp/.github"
ai_references:
  - "Use for test automation and coverage validation workflows"
  - "Reference for testing patterns and best practices"
  - "Comprehensive test structure with shell and JavaScript testing"
  - "Test coverage reporting and quality assurance metrics"
related_files:
  - "scripts/"
  - "jest.config.js"
  - "run-all-tests.sh"
  - ".github/workflows/tests.yml"
---

## 🧪 LightSpeedWP Testing Framework

![Testing Badge](https://img.shields.io/badge/testing-comprehensive-brightgreen?style=flat-square)
![Coverage Badge](https://img.shields.io/badge/coverage-tracked-blue?style=flat-square)
![Bats Badge](https://img.shields.io/badge/bats-shell--testing-orange?style=flat-square)
![Jest Badge](https://img.shields.io/badge/jest-js--testing-success?style=flat-square)

This folder contains all automated tests for the LightSpeed WP automation project. All tests are now organised by script type and feature area, with a single `utility` subfolder for all script tests, and a dedicated folder for Jest (JavaScript) tests.

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

- **utility/**: Bats and Jest tests for all scripts in `/scripts/utility/` (including all former maintenance scripts).
  - `.bats` files: Shell/CLI tests for Node.js and shell scripts.
  - `.test.js` files: Jest unit tests for Node.js modules.
- **jest/**: Jest tests for agent modules and advanced JS logic.
- `test-helper.bash`: Shared Bats test helpers for setup/teardown and environment isolation.
- `tests-run-all-tests.bats`: Bats test for the test runner script.
- `TEST_COVERAGE_SUMMARY.md`: Detailed documentation of test coverage, structure, and best practices.

## Usage

- Run all Bats tests: `bats tests/`
- Run all tests with the runner: `./run-all-tests.sh`
- Run Jest tests: `npm test` or `npx jest`

## Best Practices

- Every script in `/scripts/utility/` should have a corresponding test here.
- Use `test-helper.bash` for consistent setup and teardown.
- Expand tests to cover both success and failure scenarios.
- Keep test names and descriptions clear and maintainable.

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

See `TEST_COVERAGE_SUMMARY.md` for full coverage details and examples.

---

## 📚 References

### 🔗 Documentation Links

- [Test Coverage Summary](./TEST_COVERAGE_SUMMARY.md)
- [Jest Configuration](../jest.config.js)
- [Test Runner Script](../run-all-tests.sh)
- [LightSpeedWP Testing Guidelines](../.github/instructions/tests.instructions.md)

### 🛠️ Development Resources

- [Bats Testing Framework](https://github.com/bats-core/bats-core)
- [Jest Testing Documentation](https://jestjs.io/docs/getting-started)
- [Shared Test Helpers](./test-helper.bash)
- [GitHub Actions Tests Workflow](../.github/workflows/tests.yml)

### 🎯 AI & Automation

- [Custom Instructions](../.github/custom-instructions.md)
- [Agents Documentation](../.github/agents/agent.md)
- [Scripts Directory](../scripts/)
- [Contributing Guidelines](../CONTRIBUTING.md)

---

_🧪 Ensuring quality through comprehensive testing and continuous coverage validation._
