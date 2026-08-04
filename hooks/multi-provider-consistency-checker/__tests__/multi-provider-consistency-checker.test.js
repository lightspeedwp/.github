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

  test("entry missing 'text' fails rather than silently passing", () => {
    const dir = withConsistency([{ name: "taxonomy", files: ["a.md"] }], {
      "a.md": TAXONOMY,
    });
    const result = hook.validate(dir);
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(
      /needs non-empty string 'name' and 'text'/,
    );
  });

  test("a single-file entry fails — parity needs at least two", () => {
    const dir = withConsistency(
      [{ name: "taxonomy", text: TAXONOMY, files: ["a.md"] }],
      { "a.md": TAXONOMY },
    );
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

describe("shared-phrase config hardening", () => {
  function withRawConfig(raw) {
    const dir = tmpAgent(["claude", "openai"], {
      providerDirs: ["claude", "openai"],
    });
    fs.writeFileSync(path.join(dir, "consistency.json"), raw);
    return dir;
  }

  // Each of these previously threw an uncaught TypeError instead of reporting
  // an error, so a malformed config crashed the hook rather than failing it.
  test.each([
    ["JSON null root", "null", /must contain a JSON object at the root/],
    ["string root", '"nope"', /must contain a JSON object at the root/],
    ["array root", "[]", /must contain a JSON object at the root/],
    [
      "sharedPhrases not an array",
      '{"sharedPhrases":{}}',
      /'sharedPhrases' must be an array/,
    ],
    [
      "null phrase entry",
      '{"sharedPhrases":[null]}',
      /sharedPhrases\[0\] must be an object/,
    ],
    [
      "non-string text",
      '{"sharedPhrases":[{"name":"n","text":123,"files":["a.md","b.md"]}]}',
      /needs non-empty string 'name' and 'text'/,
    ],
    [
      "empty-string name",
      '{"sharedPhrases":[{"name":"  ","text":"t","files":["a.md","b.md"]}]}',
      /needs non-empty string 'name' and 'text'/,
    ],
    [
      "non-string files entry",
      '{"sharedPhrases":[{"name":"n","text":"t","files":[42,"b.md"]}]}',
      /non-string entry in 'files'/,
    ],
  ])("%s reports an error without throwing", (_label, raw, expected) => {
    const dir = withRawConfig(raw);
    let result;
    expect(() => {
      result = hook.validate(dir);
    }).not.toThrow();
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(expected);
  });
});

describe("declared paths cannot escape the agent directory", () => {
  function agentWithSecretSibling(files) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "mpcc-esc-"));
    fs.writeFileSync(path.join(root, "outside-secret.txt"), "TOKEN=abc123\n");
    const dir = path.join(root, "agent");
    fs.mkdirSync(dir);
    fs.writeFileSync(
      path.join(dir, "AGENT.md"),
      "---\nname: t\ndescription: t\nproviders:\n  - claude\n  - openai\ncapabilities:\n  - x\n---\n",
    );
    fs.mkdirSync(path.join(dir, "shared"));
    fs.writeFileSync(path.join(dir, "shared", "core-prompt.md"), "# core\n");
    for (const p of ["claude", "openai"]) {
      fs.mkdirSync(path.join(dir, p));
      fs.writeFileSync(path.join(dir, p, "agent.md"), `# ${p}\n`);
    }
    fs.writeFileSync(
      path.join(dir, "consistency.json"),
      JSON.stringify({
        sharedPhrases: [{ name: "probe", text: "TOKEN=abc123", files }],
      }),
    );
    return { root, dir };
  }

  test("a ../ traversal is rejected, not read", () => {
    const { dir } = agentWithSecretSibling([
      "../outside-secret.txt",
      "shared/core-prompt.md",
    ]);
    const errors = hook.checkSharedPhrases(dir).errors.join(" ");
    expect(errors).toMatch(/resolves outside the agent directory/);
    // Must not leak whether the guess matched — no silent pass for that file.
    expect(errors).not.toMatch(/out of sync: \.\.\/outside-secret\.txt/);
  });

  test("an absolute path is rejected", () => {
    const { root, dir } = agentWithSecretSibling(["shared/core-prompt.md"]);
    // Rewrite the config now that the absolute path is known.
    fs.writeFileSync(
      path.join(dir, "consistency.json"),
      JSON.stringify({
        sharedPhrases: [
          {
            name: "probe",
            text: "TOKEN=abc123",
            files: [
              path.join(root, "outside-secret.txt"),
              "shared/core-prompt.md",
            ],
          },
        ],
      }),
    );
    expect(hook.checkSharedPhrases(dir).errors.join(" ")).toMatch(
      /resolves outside the agent directory/,
    );
  });

  test("a symlink pointing outside is rejected after resolution", () => {
    const { root, dir } = agentWithSecretSibling([
      "sneaky.txt",
      "shared/core-prompt.md",
    ]);
    fs.symlinkSync(
      path.join(root, "outside-secret.txt"),
      path.join(dir, "sneaky.txt"),
    );
    expect(hook.checkSharedPhrases(dir).errors.join(" ")).toMatch(
      /resolves outside the agent directory/,
    );
  });

  test("a directory target is rejected rather than read", () => {
    const { dir } = agentWithSecretSibling(["shared", "shared/core-prompt.md"]);
    expect(hook.checkSharedPhrases(dir).errors.join(" ")).toMatch(
      /is not a regular file/,
    );
  });

  test("legitimate nested paths still resolve", () => {
    const dir = tmpAgent(["claude", "openai"], {
      providerDirs: ["claude", "openai"],
    });
    fs.writeFileSync(path.join(dir, "claude", "agent.md"), "shared text\n");
    fs.writeFileSync(
      path.join(dir, "shared", "core-prompt.md"),
      "shared text\n",
    );
    fs.writeFileSync(
      path.join(dir, "consistency.json"),
      JSON.stringify({
        sharedPhrases: [
          {
            name: "nested",
            text: "shared text",
            files: ["claude/agent.md", "shared/core-prompt.md"],
          },
        ],
      }),
    );
    expect(hook.checkSharedPhrases(dir).errors).toEqual([]);
  });
});
