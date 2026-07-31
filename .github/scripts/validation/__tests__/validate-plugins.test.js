const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const scriptPath = path.join(__dirname, "../validate-plugins.js");

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

test("fails when manifest references missing files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "plugins-validate-"));
  const pluginRoot = path.join(root, "plugins", "lightspeed-github-ops");
  writeJson(path.join(pluginRoot, ".codex-plugin", "plugin.json"), {
    skills: ["skills/missing/SKILL.md"],
  });
  writeJson(path.join(pluginRoot, ".claude-plugin", "plugin.json"), {});
  writeJson(path.join(pluginRoot, "copilot-plugin.json"), {});
  expect(() =>
    execFileSync(process.execPath, [scriptPath], {
      cwd: root,
      encoding: "utf8",
      stdio: "pipe",
    }),
  ).toThrow();
});
