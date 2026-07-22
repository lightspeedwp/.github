const fs = require("fs");
const os = require("os");
const path = require("path");
const hook = require("../index.js");

function tmpAgent(providers, { corePrompt = true, providerDirs = [] } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mpcc-"));
  const fm = [
    "name: Test",
    "description: test",
    `providers:\n${providers.map((p) => `  - ${p}`).join("\n")}`,
    "capabilities:\n  - x",
  ].join("\n");
  fs.writeFileSync(path.join(dir, "AGENT.md"), `---\n${fm}\n---\n`);
  if (corePrompt) {
    fs.mkdirSync(path.join(dir, "shared"), { recursive: true });
    fs.writeFileSync(path.join(dir, "shared", "core-prompt.md"), "# core\n");
  }
  for (const p of providerDirs) {
    fs.mkdirSync(path.join(dir, p), { recursive: true });
    fs.writeFileSync(path.join(dir, p, "agent.md"), `# ${p}\n`);
  }
  return dir;
}

describe("multi-provider-consistency-checker", () => {
  test("consistent agent passes", () => {
    const dir = tmpAgent(["claude", "openai"], {
      providerDirs: ["claude", "openai"],
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
  });

  test("missing core-prompt fails", () => {
    const dir = tmpAgent(["claude", "openai"], {
      corePrompt: false,
      providerDirs: ["claude", "openai"],
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/core-prompt/);
  });

  test("declared provider without config fails", () => {
    const dir = tmpAgent(["claude", "openai", "copilot"], {
      providerDirs: ["claude", "openai"],
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/copilot/);
  });

  test("fewer than two providers fails", () => {
    const dir = tmpAgent(["claude"], { providerDirs: ["claude"] });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/Insufficient provider coverage/);
  });
});
