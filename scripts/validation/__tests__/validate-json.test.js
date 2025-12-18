/**
 * @jest-environment jsdom
 */
// Test for validate-json.js
const path = require("path");
const { execSync } = require("child_process");

describe("JSON Validation", () => {
  it("should run the JSON validation script and output placeholder message", () => {
    const scriptPath = path.join(__dirname, "../validate-json.js");
    let output = "";
    try {
      output = execSync(`node ${scriptPath} --help`, { encoding: "utf8" });
    } catch (err) {
      output = err.stdout || err.message;
    }
    expect(output).toMatch(/JSON Linting & Validation Tool/);
  });
});
