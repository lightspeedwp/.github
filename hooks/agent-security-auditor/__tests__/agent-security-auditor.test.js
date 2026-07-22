const fs = require("fs");
const os = require("os");
const path = require("path");
const hook = require("../index.js");

function tmpDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "asa-"));
  for (const [name, content] of Object.entries(files)) {
    const full = path.join(dir, name);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return dir;
}

describe("agent-security-auditor", () => {
  test("clean directory passes", () => {
    const dir = tmpDir({
      "AGENT.md": "# clean\nUse env vars for BASE_URL.\n",
      "claude/tools.json": '{"provider":"claude"}',
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
  });

  test("hardcoded password is an error", () => {
    const dir = tmpDir({ "config.json": '{ "password": "hunter2secret" }' });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/password/i);
  });

  test("SKIP directive suppresses findings", () => {
    const dir = tmpDir({
      "fixture.md":
        '<!-- SKIP:agent-security-auditor -->\napi_key = "AKIAEXAMPLE12345"\n',
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
  });

  test("bearer token is a warning, not an error", () => {
    const dir = tmpDir({
      "notes.md": "Authorization: bearer abcdef1234567890\n",
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
    expect(result.warnings.join(" ")).toMatch(/Bearer token/);
  });
});
