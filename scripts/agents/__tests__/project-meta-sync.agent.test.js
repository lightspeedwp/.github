/**
 * Jest suite verifying the baseline behaviour of `project-meta-sync.agent.js`.
 * @see ../project-meta-sync.agent.js
 */

import { execFileSync } from "node:child_process";
import path from "node:path";

// project-meta-sync.agent.js is genuine ESM (package.json "type": "module")
// and guards its own auto-run with an `import.meta.url === ...` check --
// the same import.meta usage that blocks Babel from transforming it to
// CommonJS for a plain require()-based test (Jest reports "Must use import
// to load ES Module"). @actions/github v9 is also ESM-only (no "require"
// condition in its package.json "exports" map), so it can't be required
// even indirectly. Spawning a real Node ESM subprocess and dynamically
// import()-ing the module, as release.agent.mcp.test.js already does for
// the same reason, sidesteps both problems entirely.
const repoRoot = path.resolve(__dirname, "../../..");

function runNodeEsm(code) {
  const raw = execFileSync(
    process.execPath,
    ["--input-type=module", "-e", code],
    {
      cwd: repoRoot,
      encoding: "utf8",
    },
  ).trim();

  const lines = raw.split("\n").filter(Boolean);
  return lines[lines.length - 1] || "";
}

describe("project-meta-sync.agent", () => {
  it("exports a callable default function and does not auto-run on import", () => {
    const output = runNodeEsm(`
      const mod = await import('./scripts/agents/project-meta-sync.agent.js');
      console.log(JSON.stringify({
        type: typeof mod.default,
        exitCode: process.exitCode ?? null,
      }));
    `);

    const result = JSON.parse(output);

    expect(result.type).toBe("function");
    // If the module-scope guard is absent, importing the file calls run()
    // immediately, which throws "LS_PROJECT_URL not set" and, via
    // core.setFailed(), sets process.exitCode = 1.
    expect(result.exitCode).not.toBe(1);
  });
});
