/**
 * Task Planner Agent — Metadata Validation Tests
 * Validates AGENT.md frontmatter structure and provider implementations
 */

const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

const agentRoot = path.join(__dirname, "..");

describe("Task Planner Agent — Metadata Validation", () => {
  it("should have valid AGENT.md frontmatter", () => {
    const agentPath = path.join(agentRoot, "AGENT.md");
    const content = fs.readFileSync(agentPath, "utf8");

    // Extract frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    expect(match).toBeDefined();

    const frontmatter = yaml.load(match[1]);

    // Validate required fields
    expect(frontmatter.file_type).toBe("agent");
    expect(frontmatter.name).toBe("task-planner");
    expect(frontmatter.title).toBeDefined();
    expect(frontmatter.description).toBeDefined();
    expect(frontmatter.version).toBeDefined();
    expect(frontmatter.status).toBe("in-development");
  });

  it("should have all provider implementations", () => {
    const providers = ["claude", "copilot", "openai"];
    providers.forEach((provider) => {
      const agentPath = path.join(agentRoot, `${provider}/agent.md`);
      expect(fs.existsSync(agentPath)).toBe(true);
    });
  });

  it("should have shared core-prompt.md", () => {
    const corePath = path.join(agentRoot, "shared/core-prompt.md");
    expect(fs.existsSync(corePath)).toBe(true);

    const content = fs.readFileSync(corePath, "utf8");
    expect(content).toContain("Task Planner Agent");
    expect(content).toContain("Core Responsibilities");
  });

  it("should list all providers in metadata", () => {
    const agentPath = path.join(agentRoot, "AGENT.md");
    const content = fs.readFileSync(agentPath, "utf8");

    const match = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = yaml.load(match[1]);

    expect(frontmatter.providers).toEqual(["claude", "copilot", "openai"]);
  });

  it("should have required capabilities listed", () => {
    const agentPath = path.join(agentRoot, "AGENT.md");
    const content = fs.readFileSync(agentPath, "utf8");

    const match = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = yaml.load(match[1]);

    const requiredCapabilities = [
      "requirement-validation",
      "approach-synthesis",
      "task-breakdown",
      "dependency-mapping",
      "milestone-estimation",
    ];

    requiredCapabilities.forEach((cap) => {
      expect(frontmatter.capabilities).toContain(cap);
    });
  });
});

describe("Task Planner Agent — Provider Implementations", () => {
  const providers = ["claude", "copilot", "openai"];

  providers.forEach((provider) => {
    describe(`${provider} provider`, () => {
      it(`should have valid ${provider}/agent.md`, () => {
        const agentPath = path.join(agentRoot, `${provider}/agent.md`);
        const content = fs.readFileSync(agentPath, "utf8");

        expect(content).toContain("Provider Configuration");
        expect(content).toContain("Model:");
      });

      it(`should document ${provider}-specific optimizations`, () => {
        const agentPath = path.join(agentRoot, `${provider}/agent.md`);
        const content = fs.readFileSync(agentPath, "utf8");

        expect(content).toContain("Optimizations");
        expect(content).toContain("Implementation Notes");
      });

      it(`should include testing guidance for ${provider}`, () => {
        const agentPath = path.join(agentRoot, `${provider}/agent.md`);
        const content = fs.readFileSync(agentPath, "utf8");

        expect(content).toContain("Testing");
      });
    });
  });
});
