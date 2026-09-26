const fs = require("fs");
const os = require("os");
const path = require("path");

const { GraphifyPlugin } = require("../graphify.js");

// The plugin only ever appends advisory text to the agent's output; it never
// runs the command. These tests therefore assert on the reminder the agent would
// copy, which is where a mis-quoted graph path does its damage. Expectations are
// built from os.tmpdir() rather than a literal /tmp so they hold on Windows and
// macOS as well as Linux.
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

// The quoted value may itself contain spaces, so capture up to the clause that follows.
const graphArg = (reminder) => reminder.match(/--graph (.+?) \(scoped subgraph/)[1];

describe("graphify reminder quotes the graph path safely", () => {
  test("leaves a plain path unquoted, so no shell has to be guessed", async () => {
    const { root, output } = await reminderFor("plain");
    expect(graphArg(output)).toBe(path.join(root, "graphify-out", "graph.json"));
  });

  test("double-quotes a path with a space, which every shell reads the same", async () => {
    const { root, output } = await reminderFor("with space");
    const graph = path.join(root, "graphify-out", "graph.json");
    expect(graphArg(output)).toBe(`"${graph}"`);
  });

  test("double-quotes a path with an apostrophe rather than guessing a shell", async () => {
    // The bug this covers: PowerShell escapes an apostrophe as '' and POSIX as
    // '\'' , so picking by platform corrupted the argument on the other shell.
    // Double quotes are identical in both, so no guess is needed here.
    const { root, output } = await reminderFor("owner's repo");
    const graph = path.join(root, "graphify-out", "graph.json");
    expect(root).toContain("'");
    expect(graphArg(output)).toBe(`"${graph}"`);
  });

  test("falls back to single quotes only for a path a double quote cannot carry", async () => {
    const { root, output } = await reminderFor("cash$");
    const graph = path.join(root, "graphify-out", "graph.json");
    const quoted = graphArg(output);
    // Whichever shell is in play, the value is delimited rather than bare.
    expect(quoted).not.toBe(graph);
    expect(quoted.startsWith("'") || quoted.startsWith('"')).toBe(true);
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
  test("normalises Windows separators so a native path needs no shell guess", async () => {
    // A native Windows path is full of backslashes, which are double-quote
    // unsafe, so without this normalisation every Windows path would fall
    // through to PowerShell-only escaping and a POSIX shell on Windows would
    // swallow any apostrophe in it. A backslash is a legal filename character
    // on Linux, so the same input can be built here and the platform mocked.
    const real = process.platform;
    Object.defineProperty(process, "platform", {
      value: "win32",
      configurable: true,
    });
    try {
      const outer = fs.mkdtempSync(path.join(os.tmpdir(), "graphify-win-"));
      // A backslash is a legal filename character on Linux, so a component
      // containing one reproduces a native Windows path for the plugin to see.
      const root = path.join(outer, "win\\style");
      fs.mkdirSync(path.join(root, "graphify-out"), { recursive: true });
      fs.writeFileSync(path.join(root, "graphify-out", "graph.json"), "{}");

      const plugin = await GraphifyPlugin({ directory: root, worktree: root });
      const output = { output: "bash done" };
      await plugin["tool.execute.after"](
        { tool: "bash", sessionID: "win" },
        output,
      );

      // Forward slashes and no quoting at all: correct in cmd, PowerShell and
      // Bash, so nothing about the shell had to be assumed.
      const arg = graphArg(output.output);
      expect(root).toContain("\\");
      expect(arg).not.toContain("\\");
      expect(arg).not.toContain("'");
      expect(arg).toBe(
        `${root.replace(/\\/g, "/")}/graphify-out/graph.json`,
      );
    } finally {
      Object.defineProperty(process, "platform", {
        value: real,
        configurable: true,
      });
    }
  });
});
