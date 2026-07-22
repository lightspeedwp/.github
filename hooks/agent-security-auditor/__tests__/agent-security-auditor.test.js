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
    expect(hook.validate(dir).valid).toBe(true);
  });

  test("quoted hardcoded password is an error", () => {
    const dir = tmpDir({ "config.json": '{ "password": "hunter2secret" }' });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/credential/i);
  });

  test("unquoted YAML api_key is an error", () => {
    const dir = tmpDir({ "config.yaml": "api_key: sk_live_abc123def456\n" });
    expect(hook.validate(dir).valid).toBe(false);
  });

  test("unquoted env-style assignment is an error", () => {
    const dir = tmpDir({
      "config.md":
        "API_KEY=example-not-caught\nsecret=realLongSecretValue123\n",
    });
    expect(hook.validate(dir).valid).toBe(false);
  });

  test(".env files are scanned", () => {
    const dir = tmpDir({
      ".env": "AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMIK7MDENGbPxRfiCYEXAMPLEKEY2\n",
    });
    expect(hook.validate(dir).valid).toBe(false);
  });

  test("env-var references are not flagged", () => {
    const dir = tmpDir({
      "copilot/agent.md":
        "BASE_URL: ${{ secrets.STAGING_BASE_URL }}\napi_key: process.env.API_KEY\ntoken: ${VAULT_TOKEN}\n",
    });
    expect(hook.validate(dir).valid).toBe(true);
  });

  test("placeholder values are not flagged", () => {
    const dir = tmpDir({
      "example.md":
        "password: changeme\napi_key: your-key-here\nsecret: <redacted>\n",
    });
    expect(hook.validate(dir).valid).toBe(true);
  });

  test("SKIP directive suppresses findings but surfaces a warning", () => {
    const dir = tmpDir({
      "fixture.md":
        '<!-- SKIP:agent-security-auditor -->\napi_key = "AKIAEXAMPLE12345"\n',
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
    expect(result.warnings.join(" ")).toMatch(/skipped/i);
  });

  test("private key block is an error", () => {
    const dir = tmpDir({
      "key.md": "-----BEGIN RSA PRIVATE KEY-----\nMIIabc\n",
    });
    expect(hook.validate(dir).valid).toBe(false);
  });
});
