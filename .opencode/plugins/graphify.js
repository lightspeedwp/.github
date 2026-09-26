// graphify OpenCode plugin, adapted from `graphify opencode install`.
//
// Appends a one-time knowledge-graph reminder to the output of the first bash call in each
// session. The command itself is never modified, so the plugin behaves the same under any shell
// OpenCode uses (bash, zsh, Windows PowerShell 5.1, PowerShell 7) and cannot change what runs.
// Rerunning `graphify opencode install` restores upstream's command-prefixing version; keep this one.
import { existsSync } from "fs";
import { join } from "path";

// Give the path as one literal shell argument that means the same in every shell OpenCode may
// use (bash, zsh, Git Bash, PowerShell). Single quotes stop $, backtick and backslash handling in
// all of them, but an embedded single quote is escaped differently in POSIX shells and PowerShell,
// and the plugin cannot tell which shell runs the command. A path containing one is therefore not
// quoted at all: the reminder gives the worktree-relative path instead. On Windows the separators
// become forward slashes, which every Windows shell accepts; on POSIX a backslash is a filename
// character, so the path is left alone.
const graphArg = (graph) => {
  if (graph.includes("'")) return null;
  return `'${process.platform === "win32" ? graph.replace(/\\/g, "/") : graph}'`;
};

const reminder = (graph) => {
  const arg = graphArg(graph);
  const query = arg
    ? `graphify query "<question>" --graph ${arg}`
    : 'graphify query "<question>" --graph graphify-out/graph.json from the directory containing graphify-out';
  return (
    `[graphify] knowledge graph at ${graph}. For focused questions, run ${query} (scoped subgraph, ` +
    "usually much smaller than GRAPH_REPORT.md) instead of grepping raw files. Read GRAPH_REPORT.md " +
    "next to it only for broad architecture context."
  );
};

export const GraphifyPlugin = async ({ directory, worktree }) => {
  const reminded = new Set();
  // Sessions can start below the repository root, so prefer the worktree root's graph, and give
  // the agent its absolute path where possible so the suggested command works from any working directory.
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
