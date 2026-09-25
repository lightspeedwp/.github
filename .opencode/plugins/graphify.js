// graphify OpenCode plugin, adapted from `graphify opencode install`.
//
// Appends a one-time knowledge-graph reminder to the output of the first bash call in each
// session. The command itself is never modified, so the plugin behaves the same under any shell
// OpenCode uses (bash, zsh, Windows PowerShell 5.1, PowerShell 7) and cannot change what runs.
// Rerunning `graphify opencode install` restores upstream's command-prefixing version; keep this one.
import { existsSync } from "fs";
import { join } from "path";

const REMINDER =
  "[graphify] knowledge graph at graphify-out/. For focused questions, run graphify query with " +
  "your question (scoped subgraph, usually much smaller than GRAPH_REPORT.md) instead of " +
  "grepping raw files. Read GRAPH_REPORT.md only for broad architecture context.";

export const GraphifyPlugin = async ({ directory, worktree }) => {
  const reminded = new Set();
  // Sessions can start below the repository root, so look at the worktree root first.
  const hasGraph = () =>
    [worktree, directory].some((d) => d && existsSync(join(d, "graphify-out", "graph.json")));

  return {
    "tool.execute.after": async (input, output) => {
      if (input.tool !== "bash" || reminded.has(input.sessionID) || !hasGraph()) return;
      reminded.add(input.sessionID);
      output.output = `${output.output ?? ""}\n\n${REMINDER}`;
    },
    event: async ({ event }) => {
      if (event.type === "session.deleted") reminded.delete(event.properties?.info?.id);
    },
  };
};
