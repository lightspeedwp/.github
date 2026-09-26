const fs = require("fs");
const os = require("os");
const path = require("path");

const { GraphifyPlugin } = require("../graphify.js");

// The plugin only ever appends advisory text to the agent's output; it never
// runs the command. These tests therefore assert on the reminder the agent would
// copy, which is where a mis-quoted graph path does its damage. Expectations are
// built from os.tmpdir() rather than a literal /tmp, and mirror the separator
// handling the plugin applies, so the suite holds on Windows and macOS too.

// shellQuote normalises Windows separators to forward slashes, so the expected
// value has to be normalised the same way or the comparison fails on a native
// Windows runner.
const expectedGraph = (root) => {
  const joined = path.join(root, "graphify-out", "graph.json");
  return process.platform === "win32" ? joined.replace(/\\/g, "/") : joined;
};

async function reminderFor(prefix) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `graphify-${prefix}-`));
  fs.mkdirSync(path.join(root, "graphify-out"));
  fs.writeFileSync(path.join(root, "graphify-out", "graph.json"), "{}");

  const plugin = await GraphifyPlugin({ directory: root, worktree: root });
  const output = { output: "bash done" };
  await plugin["tool.execute.after"](
    { tool: "bash", sessionID: `s-${prefix}` },
    output,
  );
  return { root, output: output.output };
}

// The quoted value may itself contain spaces, so capture up to the clause that
// follows rather than to the next whitespace.
const graphArg = (reminder) => reminder.match(/--graph (.+?) \(scoped subgraph/)?.[1];

describe("graphify reminder quotes the graph path safely", () => {
  test("leaves a plain path unquoted, so no shell has to be guessed", async () => {
    const { root, output } = await reminderFor("plain");
    expect(graphArg(output)).toBe(expectedGraph(root));
  });

  test("double-quotes a path with a space, which every shell groups alike", async () => {
    const { root, output } = await reminderFor("with space");
    expect(graphArg(output)).toBe(`"${expectedGraph(root)}"`);
  });

  test("double-quotes a path with an apostrophe rather than guessing a shell", async () => {
    // PowerShell escapes an apostrophe as '' and POSIX as '\'' , and cmd.exe does
    // not treat single quotes as quoting at all, so picking by platform corrupted
    // the argument on the other shell. Double quotes group in all three.
    const { root, output } = await reminderFor("owner's repo");
    expect(root).toContain("'");
    expect(graphArg(output)).toBe(`"${expectedGraph(root)}"`);
  });

  test("normalises Windows separators so a native path needs no quoting at all", async () => {
    // A native Windows path is full of backslashes, which are double-quote
    // unsafe, so without normalisation every Windows path would drop out of the
    // portable tiers. A backslash is a legal filename character on Linux, so the
    // same input can be built here and the platform mocked.
    const real = process.platform;
    Object.defineProperty(process, "platform", {
      value: "win32",
      configurable: true,
    });
    try {
      const outer = fs.mkdtempSync(path.join(os.tmpdir(), "graphify-win-"));
      const root = path.join(outer, "win\\style");
      fs.mkdirSync(path.join(root, "graphify-out"), { recursive: true });
      fs.writeFileSync(path.join(root, "graphify-out", "graph.json"), "{}");

      const plugin = await GraphifyPlugin({ directory: root, worktree: root });
      const output = { output: "bash done" };
      await plugin["tool.execute.after"](
        { tool: "bash", sessionID: "win" },
        output,
      );

      // Forward slashes and no quoting: correct in cmd, PowerShell and Bash.
      const arg = graphArg(output.output);
      expect(root).toContain("\\");
      expect(arg).not.toContain("\\");
      expect(arg).toBe(expectedGraph(root));
    } finally {
      Object.defineProperty(process, "platform", {
        value: real,
        configurable: true,
      });
    }
  });

  test("offers no runnable example for a path no shell quotes the same way", async () => {
    // A dollar sign, double quote, backtick or backslash has no portable form:
    // it needs POSIX '\'' or PowerShell '' for an apostrophe, and cmd.exe cannot
    // group it at all. Emitting a command that is wrong in some shell is worse
    // than saying so, so the scoped example is dropped.
    const { root, output } = await reminderFor("cash$");
    expect(root).toContain("$");
    expect(graphArg(output)).toBeUndefined();
    expect(output).not.toContain("--graph");
    expect(output).toContain("no runnable scoped example");
    expect(output).toContain("GRAPH_REPORT.md");
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
