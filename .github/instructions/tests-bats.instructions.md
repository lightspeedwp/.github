---
file_type: "instructions"
title: "Bats Test Instructions"
description: "Guidelines for shell script/unit testing using Bats at LightSpeed."
version: "1.0.0"
apply_to: "shell/Bash scripts"
last_updated: "2025-12-04"
owners: ["LightSpeed Engineering"]
references:
  - "../tests.instructions.md"
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
---

# Bats Test Instructions

These are the standards for shell script/unit testing using [bats-core](https://github.com/bats-core/bats-core).

See [Tests Index](../tests.instructions.md) for all test standards.

---

## Directory & Setup

- Place Bats tests in `/tests/bats/` (or similar) in your project.
- Install bats-core locally or use via Docker/GitHub Actions.

## Best Practices

- Keep tests idempotent and independent.
- Use `shellcheck` to lint scripts and spot anti-patterns.
- Prefer explicit assertions; avoid brittle tests.
- Use temporary files/directories for test isolation.

---

## Example

```bash
@test "prints hello" {
  run ./hello.sh
  [ "$status" -eq 0 ]
  [ "$output" = "hello world" ]
}
```

## CI Integration

- Add bats to your workflow for shell testing.
- Combine with shellcheck for lint + test coverage.

---

For more, see [bats-core docs](https://github.com/bats-core/bats-core).
