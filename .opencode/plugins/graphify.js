// graphify OpenCode plugin, adapted from `graphify opencode install`.
//
// Appends a one-time knowledge-graph reminder to the output of the first bash call in each
// session. The command itself is never modified, so the plugin behaves the same under any shell
// OpenCode uses (bash, zsh, Windows PowerShell 5.1, PowerShell 7) and cannot change what runs.
// Rerunning `graphify opencode install` restores upstream's command-prefixing version; keep this one.
import { existsSync } from "fs";
import { join } from "path";

// Quote the path as one literal shell argument. Single quotes stop $, backtick and backslash
// handling in both POSIX shells and PowerShell; only an embedded single quote needs escaping, and
// PowerShell and POSIX shells spell that differently. On Windows the separators become forward
// slashes, which every Windows shell accepts; on POSIX a backslash is a filename character, so
// the path is left alone.
const shellQuote = (path) =>
  process.platform === "win32"
    ? `'${path.replace(/\\/g, "/").replace(/'/g, "''")}'`
    : `'${path.replace(/'/g, "'\\''")}'`;

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
