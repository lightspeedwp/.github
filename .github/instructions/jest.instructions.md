# Jest Test Instructions

Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

For more, see [Jest docs](https://jestjs.io/docs/getting-started).

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
describe("sum", () => {
  it("adds two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

## CI Integration

- Run `npm test` in CI.
- Add coverage reporting for PRs.

## Layers

- **Unit** (PHPUnit/Jest): pure functions, selectors, utils.
- **Integration**: block rendering, REST endpoints, server hooks.
- **E2E** (Playwright): user journeys, editor insert/configure, front-end render.

## A11y

- Add axe checks to Playwright suites; zero serious issues.

## Coverage Targets

- Unit: ≥80% lines; Critical branches: ≥90%.
- E2E: critical paths for each pattern/block.

## CI

- Run lint + unit + e2e on PR.
- Upload artefacts (videos, traces) for failing runs.

---
