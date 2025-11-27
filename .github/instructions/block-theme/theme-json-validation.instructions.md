# theme.json Validation Instructions

## Overview

This document provides best practices for validating `theme.json` files in WordPress block themes.

---

## 1. Validation Tools

- Use JSON schema validation tools (e.g., [ajv](https://ajv.js.org/)) to check `theme.json` against the official schema.
- Use Playwright tests to automate validation (see example test below).

---

## 2. Playwright Test Example

```js
// tests/theme-json-validation.test.js
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv();
const schema = require("path-to-theme-json-schema.json");

test("theme.json is valid", () => {
  const themeJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../theme/theme.json"), "utf8"),
  );
  const valid = ajv.validate(schema, themeJson);
  expect(valid).toBe(true);
});
```

---

## 3. Best Practices

- Validate `theme.json` on every build or CI run.
- Document validation steps in your README.
- Reference: [theme-json-validation.instructions.md](https://github.com/lightspeedwp/ai-block-theme-template/blob/develop/.github/instructions/theme-json-validation.instructions.md)
