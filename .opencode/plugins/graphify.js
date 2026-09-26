// graphify OpenCode plugin, adapted from `graphify opencode install`.
//
// Appends a one-time knowledge-graph reminder to the output of the first bash call in each
// session. The command itself is never modified, so the plugin behaves the same under any shell
// OpenCode uses (bash, zsh, Windows PowerShell 5.1, PowerShell 7) and cannot change what runs.
// Rerunning `graphify opencode install` restores upstream's command-prefixing version; keep this one.
import { existsSync } from "fs";
import { join } from "path";

// Quote the path as one literal shell argument, or return null when no quoting
// is correct everywhere. The plugin API reports only directory and worktree and
// the repository pins no shell, so nothing here may assume one: a Windows host
// can run Bash, a POSIX host can run PowerShell, and cmd.exe does not treat
// single quotes as quoting at all.
//
//  1. On Windows a backslash is a path separator and forward slashes are
//     accepted by every Windows shell, so normalise first. On POSIX a backslash
//     is a legal filename character and must be left alone.
//  2. A path with no shell metacharacter then needs no quoting at all.
//  3. Double quotes group in POSIX shells, PowerShell and cmd.exe alike, and
//     inside them those three agree on every character except " $ ` and \. A
//     path free of those four is therefore safe to double-quote, which covers
//     spaces and apostrophes.
//  4. A path containing one of those four has no portable form: it needs POSIX
//     '\'' or PowerShell '' for an apostrophe, and cmd.exe cannot group it at
//     all. Rather than emit a command that is wrong in some shell, the caller
//     drops the runnable example.
const SHELL_SAFE_PATH = /^[A-Za-z0-9_@+=:,./-]+$/;
const DOUBLE_QUOTE_UNSAFE = /["$`\\]/;

const shellQuote = (path) => {
  const normalised =
    process.platform === "win32" ? path.replace(/\\/g, "/") : path;
  if (SHELL_SAFE_PATH.test(normalised)) return normalised;
  if (!DOUBLE_QUOTE_UNSAFE.test(normalised)) return `"${normalised}"`;
  return null;
};

const reminder = (graph) => {
  const quoted = shellQuote(graph);
  if (!quoted) {
    return (
      `[graphify] knowledge graph at ${graph}. Its path contains a character no ` +
      "shell quotes the same way, so no runnable scoped example is offered here; " +
      "read GRAPH_REPORT.md instead of grepping raw files."
    );
  }
  return (
    `[graphify] knowledge graph at ${graph}. For focused questions, run ` +
    `graphify query "<question>" --graph ${quoted} (scoped subgraph, usually much smaller than ` +
    "GRAPH_REPORT.md) instead of grepping raw files. Read GRAPH_REPORT.md next to it only for " +
    "broad architecture context."
  );
};

export const GraphifyPlugin = async ({ directory, worktree }) => {
  const reminded = new Set();
  // Sessions can start below the repository root, so prefer the worktree root's graph, and give
  // the agent its absolute path so the suggested command works from any working directory.
  const findGraph = () =>
    [worktree, directory]
      .filter(Boolean)
      .map((d) => join(d, "graphify-out", "graph.json"))
      .find((p) => existsSync(p));

  return {
    "tool.execute.after": async (input, output) => {
      if (input.tool !== "bash" || reminded.has(input.sessionID)) return;
      const graph = findGraph();
      if (!graph) return;
      reminded.add(input.sessionID);
      output.output = `${output.output ?? ""}\n\n${reminder(graph)}`;
    },
    event: async ({ event }) => {
      if (event.type === "session.deleted") reminded.delete(event.properties?.info?.id);
    },
  };
};
