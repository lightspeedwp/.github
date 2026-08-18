/**
 * Task Researcher Agent — Core Prompt Validation Tests
 * Validates provider-agnostic core prompt structure
 */

const fs = require("fs");
const path = require("path");

const corePath = path.join(__dirname, "../shared/core-prompt.md");

describe("Task Researcher Agent — Core Prompt Structure", () => {
  it("should exist and be readable", () => {
    expect(fs.existsSync(corePath)).toBe(true);
  });

  it("should contain required sections", () => {
    const content = fs.readFileSync(corePath, "utf8");

    const requiredSections = [
      "# Task Researcher Agent",
      "## Role",
      "## Core Responsibilities",
      "## Input Format",
      "## Output Format",
      "## Key Behaviors",
      "## Success Criteria",
    ];

    requiredSections.forEach((section) => {
      expect(content).toContain(section);
    });
  });

  it("should define all core responsibilities", () => {
    const content = fs.readFileSync(corePath, "utf8");

    const responsibilities = [
      "Requirement Discovery",
      "Constraint Extraction",
      "Context Mapping",
      "Research Synthesis",
    ];

    responsibilities.forEach((resp) => {
      expect(content).toContain(resp);
    });
  });

  it("should include JSON output format example", () => {
    const content = fs.readFileSync(corePath, "utf8");

    expect(content).toContain("```json");
    expect(content).toContain("research_timestamp");
    expect(content).toContain("requirements");
    expect(content).toContain("constraints");
    expect(content).toContain("context");
  });

  it("should define success criteria", () => {
    const content = fs.readFileSync(corePath, "utf8");

    expect(content).toContain("Success Criteria");
    expect(content).toContain("✅");
  });
});
