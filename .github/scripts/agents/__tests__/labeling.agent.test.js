/**
 * Jest suite verifying the exported behaviour of `labeling.agent.js`.
 * @see ../labeling.agent.js
 */

let agent;

beforeAll(async () => {
  agent = await import("../labeling.agent.js");
});

describe("labeling.agent", () => {
  it("exports the helper surface used by the workflow", () => {
    expect(agent).toEqual(
      expect.objectContaining({
        detectIssueTypeFromContent: expect.any(Function),
        detectTypeFromBranch: expect.any(Function),
        loadCanonicalLabels: expect.any(Function),
        loadAliasMap: expect.any(Function),
        runLabelingAgent: expect.any(Function),
      }),
    );
  });

  it("maps branch prefixes to canonical type labels", () => {
    expect(agent.detectTypeFromBranch("feat/metadata-governance")).toBe(
      "type:feature",
    );
    expect(agent.detectTypeFromBranch("docs/update-issue-guide")).toBe(
      "type:documentation",
    );
    expect(agent.detectTypeFromBranch("hotfix/release-blocker")).toBe(
      "type:bug",
    );
  });

  it("detects type from content keywords", () => {
    expect(
      agent.detectIssueTypeFromContent(
        "Document the new metadata governance flow",
        "",
      ),
    ).toBe("type:documentation");
    expect(
      agent.detectIssueTypeFromContent("Fix workflow regression", ""),
    ).toBe("type:bug");
  });

  it("returns a no-op report when no issue or PR is in context", async () => {
    const result = await agent.runLabelingAgent({
      context: {
        repo: {
          owner: "lightspeedwp",
          repo: ".github",
        },
        payload: {},
      },
      github: {
        rest: {
          issues: {
            addLabels: jest.fn(),
            removeLabel: jest.fn(),
          },
        },
      },
      dryRun: true,
    });

    expect(result).toMatchObject({
      success: true,
      added: [],
      removed: [],
      migrated: [],
      errors: [],
    });
  });
});
