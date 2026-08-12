const fs = require("fs");
const os = require("os");
const path = require("path");
const hook = require("../index.js");

function tmpAgent(frontmatter) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "asv-"));
  fs.writeFileSync(
    path.join(dir, "AGENT.md"),
    `---\n${frontmatter}\n---\n\n# Agent\n`,
  );
  return dir;
}

describe("agent-spec-validator", () => {
  test("valid frontmatter passes", () => {
    const dir = tmpAgent(
      [
        "name: Test Agent",
        "description: A test agent",
        "version: 1.0.0",
        "status: active",
        "providers:\n  - claude\n  - openai",
        "capabilities:\n  - testing",
      ].join("\n"),
    );
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("missing AGENT.md fails", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "asv-empty-"));
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/AGENT.md not found/);
  });

  test("missing required fields fail", () => {
    const dir = tmpAgent("name: Only Name");
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/description/);
    expect(result.errors.join(" ")).toMatch(/providers/);
  });

  test("invalid provider and version fail", () => {
    const dir = tmpAgent(
      [
        "name: Bad",
        "description: bad",
        "version: 2.0",
        "providers:\n  - grok",
        "capabilities:\n  - x",
      ].join("\n"),
    );
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/Invalid providers/);
    expect(result.errors.join(" ")).toMatch(/Invalid version/);
  });
});
