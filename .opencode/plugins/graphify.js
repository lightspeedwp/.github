// graphify OpenCode plugin, adapted from `graphify opencode install`.
//
// Appends a one-time knowledge-graph reminder to the output of the first bash call in each
// session. The command itself is never modified, so the plugin behaves the same under any shell
// OpenCode uses (bash, zsh, Windows PowerShell 5.1, PowerShell 7) and cannot change what runs.
// Rerunning `graphify opencode install` restores upstream's command-prefixing version; keep this one.
import { existsSync } from "fs";
import { join } from "path";

// Quote the path as one literal shell argument. Most graph paths are plain
// absolute paths that no shell will split or interpret, so emit those bare: that
// is correct in bash, zsh and every PowerShell, and it removes the need to guess
// which shell OpenCode will run. Only a path containing a shell metacharacter
// needs quoting, and for that case no single form is valid in both POSIX shells
// and PowerShell (`''` versus `'\''`), while the plugin API reports no shell, so
// the platform is the only remaining signal.
const SHELL_SAFE_PATH = /^[A-Za-z0-9_@+=:,./-]+$/;

const shellQuote = (path) => {
  if (SHELL_SAFE_PATH.test(path)) return path;
  return process.platform === "win32"
    ? `'${path.replace(/\\/g, "/").replace(/'/g, "''")}'`
    : `'${path.replace(/'/g, "'\\''")}'`;
};

const reminder = (graph) =>
  `[graphify] knowledge graph at ${graph}. For focused questions, run ` +
  `graphify query "<question>" --graph ${shellQuote(graph)} (scoped subgraph, usually much smaller than ` +
  "GRAPH_REPORT.md) instead of grepping raw files. Read GRAPH_REPORT.md next to it only for " +
  "broad architecture context.";

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
