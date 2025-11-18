---
title: "PHPUnit Test Instructions"
description: "How to set up and write PHPUnit tests for PHP and WordPress projects."
version: "1.0.0"
apply_to: "PHP/WordPress projects"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "../tests.instructions.md"
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
---

# PHPUnit Test Instructions

These are the standards for unit and integration testing in PHP/WordPress projects using [PHPUnit](https://phpunit.de/).

See [Tests Index](../tests.instructions.md) for all test standards.

---

## Directory & Setup

- Place PHPUnit tests in `/tests/phpunit/` or appropriate location.
- Use Composer to install PHPUnit.
- Configure `phpunit.xml` in project root.

## Best Practices

- Prefer small, focused tests (unit vs integration).
- Use test doubles/mocks for dependencies.
- Follow WordPress test suite conventions for WP projects.

## Resources

- [PHPUnit Docs](https://phpunit.de/documentation.html)
- [WP PHPUnit Reference](https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/)

---
