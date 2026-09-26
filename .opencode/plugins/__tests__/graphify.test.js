const fs = require("fs");
const os = require("os");
const path = require("path");

const { GraphifyPlugin } = require("../graphify.js");

// The plugin only ever appends advisory text to the agent's output; it never
// runs the command. These tests therefore assert on the reminder text the agent
// would copy, which is where a mis-quoted graph path does its damage.
async function reminderFor(repoName) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `graphify-${repoName}-`));
  fs.mkdirSync(path.join(root, "graphify-out"));
  fs.writeFileSync(path.join(root, "graphify-out", "graph.json"), "{}");

  const plugin = await GraphifyPlugin({ directory: root, worktree: root });
  const output = { output: "bash done" };
  await plugin["tool.execute.after"](
    { tool: "bash", sessionID: `s-${repoName}` },
    output,
  );
  return output.output;
}

describe("graphify reminder quotes the graph path safely", () => {
  test("leaves a plain absolute path unquoted, so no shell has to be guessed", async () => {
    const output = await reminderFor("plain");
    expect(output).toContain("--graph ");
    // The path is emitted bare: correct in bash, zsh and every PowerShell.
    expect(output).toMatch(/--graph \/tmp\/graphify-plain-[^\s']+\/graphify-out\/graph\.json/);
  });

  test("single-quotes a path containing a space so it stays one argument", async () => {
    const output = await reminderFor("with space");
    expect(output).toMatch(
      /--graph '\/tmp\/graphify-with space-[^']+\/graphify-out\/graph\.json'/,
    );
  });

  test("does not re-add the reminder for a second bash call in the same session", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "graphify-once-"));
    fs.mkdirSync(path.join(root, "graphify-out"));
    fs.writeFileSync(path.join(root, "graphify-out", "graph.json"), "{}");

    const plugin = await GraphifyPlugin({ directory: root, worktree: root });
    const first = { output: "one" };
    await plugin["tool.execute.after"](
      { tool: "bash", sessionID: "same" },
      first,
    );
    const second = { output: "two" };
    await plugin["tool.execute.after"](
      { tool: "bash", sessionID: "same" },
      second,
    );

    expect(first.output).toContain("graphify");
    expect(second.output).toBe("two");
  });

  test("stays silent when the repository has no graph", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "graphify-none-"));
    const plugin = await GraphifyPlugin({ directory: root, worktree: root });
    const output = { output: "bash done" };
    await plugin["tool.execute.after"](
      { tool: "bash", sessionID: "none" },
      output,
    );
    expect(output.output).toBe("bash done");
  });
});
