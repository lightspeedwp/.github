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

describe("shared-phrase parity", () => {
  function withConsistency(sharedPhrases, files = {}) {
    const dir = tmpAgent(["claude", "openai"], {
      providerDirs: ["claude", "openai"],
    });
    for (const [relative, content] of Object.entries(files)) {
      const target = path.join(dir, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content);
    }
    fs.writeFileSync(
      path.join(dir, "consistency.json"),
      JSON.stringify({ sharedPhrases }, null, 2),
    );
    return dir;
  }

  const TAXONOMY = "functional flow, content rule, performance rule";

  test("no consistency.json is a no-op — unaffected agents still pass", () => {
    const dir = tmpAgent(["claude", "openai"], {
      providerDirs: ["claude", "openai"],
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
    expect(hook.checkSharedPhrases(dir).errors).toEqual([]);
  });

  test("phrase present in every declared file passes", () => {
    const dir = withConsistency(
      [{ name: "taxonomy", text: TAXONOMY, files: ["a.md", "b.md"] }],
      { "a.md": `intro ${TAXONOMY} outro`, "b.md": `# b\n\n${TAXONOMY}\n` },
    );
    expect(hook.validate(dir).valid).toBe(true);
  });

  test("phrase missing from one file fails and names that file", () => {
    const dir = withConsistency(
      [{ name: "taxonomy", text: TAXONOMY, files: ["a.md", "b.md"] }],
      {
        "a.md": TAXONOMY,
        "b.md": "functional flow, content rule",
      },
    );
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/taxonomy.*out of sync.*b\.md/);
  });

  test("differing line-wrapping still matches", () => {
    const wrapped = "functional flow, content rule,\n   performance rule";
    const dir = withConsistency(
      [{ name: "taxonomy", text: TAXONOMY, files: ["a.md", "b.md"] }],
      { "a.md": TAXONOMY, "b.md": `- classify as: ${wrapped}\n` },
    );
    expect(hook.validate(dir).valid).toBe(true);
  });

  test("a declared file that does not exist fails", () => {
    const dir = withConsistency(
      [{ name: "taxonomy", text: TAXONOMY, files: ["a.md", "gone.md"] }],
      { "a.md": TAXONOMY },
    );
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/missing gone\.md/);
  });

  test("malformed entry fails rather than silently passing", () => {
    const dir = withConsistency([{ name: "taxonomy", files: ["a.md"] }], {
      "a.md": TAXONOMY,
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/at least two 'files'/);
  });

  test("invalid JSON fails loudly", () => {
    const dir = tmpAgent(["claude", "openai"], {
      providerDirs: ["claude", "openai"],
    });
    fs.writeFileSync(path.join(dir, "consistency.json"), "{ not json");
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/not valid JSON/);
  });

  test("empty sharedPhrases warns but does not fail", () => {
    const dir = withConsistency([]);
    const result = hook.validate(dir);
    expect(result.valid).toBe(true);
    expect(result.warnings.join(" ")).toMatch(/declares no sharedPhrases/);
  });

  test("the real playwright-testing-agent invariants hold", () => {
    const real = path.join(
      __dirname,
      "../../../agents/playwright-testing-agent",
    );
    if (!fs.existsSync(path.join(real, "consistency.json"))) return;
    expect(hook.checkSharedPhrases(real).errors).toEqual([]);
  });
});
