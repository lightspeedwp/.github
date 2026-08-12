const fs = require("fs");
const os = require("os");
const path = require("path");
const hook = require("../index.js");

function manifest(dir, rel, data) {
  const full = path.join(dir, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data, null, 2));
}

function tmpPlugin({ withAgent = true, manifests = true } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pic-"));
  if (withAgent) {
    fs.mkdirSync(path.join(dir, "agents"), { recursive: true });
    fs.writeFileSync(path.join(dir, "agents", "x.agent.md"), "# x\n");
  }
  fs.writeFileSync(path.join(dir, "README.md"), "# plugin\n");
  if (manifests) {
    const body = {
      name: "p",
      version: "1.0.0",
      agents: ["agents/x.agent.md"],
      skills: [],
    };
    manifest(dir, "copilot-plugin.json", {
      ...body,
      includes: { agents: ["agents/x.agent.md"], skills: [] },
    });
    manifest(dir, ".claude-plugin/plugin.json", body);
    manifest(dir, ".codex-plugin/plugin.json", body);
    manifest(dir, ".gemini-plugin/plugin.json", body);
  }
  return dir;
}

describe("plugin-integrity-checker", () => {
  test("well-formed plugin passes", () => {
    const dir = tmpPlugin();
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
  });

  test("missing manifests fail", () => {
    const dir = tmpPlugin({ manifests: false });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/Missing plugin manifest/);
  });

  test("missing referenced agent fails", () => {
    const dir = tmpPlugin({ withAgent: false });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/Missing referenced file/);
  });

  test("validates the real lightspeed-playwright-testing plugin", () => {
    const pluginPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "plugins",
      "lightspeed-playwright-testing",
    );
    const result = hook.validate(pluginPath);
    expect(result.valid).toBe(true);
  });
});
