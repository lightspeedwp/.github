/**
 * @jest-environment jsdom
 */

const { WorkflowValidator, GUARDRAILS } = require("../validate-workflows.js");

describe("Workflow Validation", () => {
  it("flags explicit shell:bash for run steps", () => {
    const validator = new WorkflowValidator(GUARDRAILS);

    const workflow = `
name: test
jobs:
  sample:
    runs-on: ubuntu-latest
    steps:
      - name: bad bash
        shell: bash
        run: node scripts/example.js
`;

    const valid = validator.validate("test.yml", workflow);
    expect(valid).toBe(false);
    expect(
      validator.results.errors.some((entry) =>
        entry.message.includes("explicit shell:bash is not allowed"),
      ),
    ).toBe(true);
  });

  it("flags multiline shell control-flow in run blocks", () => {
    const validator = new WorkflowValidator(GUARDRAILS);

    const workflow = `
name: test
jobs:
  sample:
    runs-on: ubuntu-latest
    steps:
      - name: inline control flow
        run: |
          if [ -z "$FOO" ]; then
            echo "missing"
          fi
`;

    const valid = validator.validate("test.yml", workflow);
    expect(valid).toBe(false);
    expect(
      validator.results.errors.some((entry) =>
        entry.message.includes("multiline shell control-flow is not allowed"),
      ),
    ).toBe(true);
  });

  it("accepts node-based single-line run steps without bash shell", () => {
    const validator = new WorkflowValidator(GUARDRAILS);

    const workflow = `
name: test
permissions:
  contents: read
jobs:
  sample:
    runs-on: ubuntu-latest
    steps:
      - name: safe node call
        run: node scripts/workflows/release/trigger-telemetry.cjs
`;

    const valid = validator.validate("test.yml", workflow);
    expect(valid).toBe(true);
  });
});
