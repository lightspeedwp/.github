---
title: "Jest Test Instructions"
description: "How to set up, configure, and write tests with Jest for JavaScript/TypeScript projects."
version: "1.0.0"
apply_to: "JavaScript/TypeScript projects"
last_updated: "2025-10-22"
owners: ["LightSpeed Engineering"]
references:
  - "../tests.instructions.md"
  - "https://docs.github.com/en/copilot/customizing-copilot/adding-organization-custom-instructions-for-github-copilot"
---

# Jest Test Instructions

Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

See [Tests Index](../tests.instructions.md) for all test standards.

---

## Directory & Setup

- Place Jest tests alongside source files or in a `/tests/jest/` directory.
- Install Jest via npm: `npm install --save-dev jest`
- Add a `"test"` script to your `package.json`:

  ```json
  "scripts": {
    "test": "jest"
  }
  ```

- Create a `jest.config.js` for custom config.

## Best Practices

- Use descriptive `describe` and `it/test` blocks.
- Prefer isolated, deterministic tests.
- Use [jest.mock](https://jestjs.io/docs/mock-functions) for dependencies.
- Assert expected outputs and side effects.
- Use `--coverage` to check test coverage.

## Example

```js
describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

## CI Integration

- Run `npm test` in CI.
- Add coverage reporting for PRs.

---

For more, see [Jest docs](https://jestjs.io/docs/getting-started).
