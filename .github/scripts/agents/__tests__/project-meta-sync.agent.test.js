/**
 * Jest suite verifying the deprecated compatibility behaviour of `project-meta-sync.agent.js`.
 * @see ../project-meta-sync.agent.js
 */
const agent = require("../project-meta-sync.agent");

describe("project-meta-sync.agent", () => {
  it("exports a callable compatibility shim", () => {
    expect(typeof agent).toBe("function");
  });

  it("returns the current workflow replacement contract", async () => {
    const result = await agent();

    expect(result).toMatchObject({
      ok: true,
      deprecated: true,
      replacement: {
        workflow: ".github/workflows/project-meta-sync.yml",
        metadata_workflow: ".github/workflows/metadata-governance.yml",
        helper: "scripts/agents/includes/derive-project-fields.cjs",
        metadata_helper: "scripts/agents/includes/issue-pr-metadata.cjs",
      },
    });
  });
});
