/**
 * @jest-environment jsdom
 */
// Test for validate-agent-frontmatter.js
const path = require("path");
const { execSync } = require("child_process");

describe("Agent Frontmatter Validation", () => {
  it("should validate all agent spec files and report errors for invalid frontmatter", () => {
    const scriptPath = path.join(__dirname, "../validate-agent-frontmatter.js");
    let output = "";
    try {
      output = execSync(`node ${scriptPath}`, { encoding: "utf8" });
    } catch (err) {
      output = err.stdout || err.message;
    }
    expect(output).toMatch(/Validation Summary:/);
    expect(output).toMatch(/Total files:/);
  });
});
