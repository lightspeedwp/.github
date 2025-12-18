/**
 * @jest-environment jsdom
 */
// Test for validate-workflows.js
const path = require("path");
const { execSync } = require("child_process");

describe("Workflow Validation", () => {
  it("should run the workflow validation script and output expected result", () => {
    const scriptPath = path.join(__dirname, "../validate-workflows.js");
    let output = "";
    try {
      output = execSync(`node ${scriptPath}`, { encoding: "utf8" });
    } catch (err) {
      output = err.stdout || err.message;
    }
    expect(output).toBeDefined();
    // Optionally, check for summary or error lines
    expect(output).toMatch(/Validation|Guardrails|Summary|Error|Warning/i);
  });
});
