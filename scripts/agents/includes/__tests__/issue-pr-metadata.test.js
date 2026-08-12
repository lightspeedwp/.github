const {
  extractIssueRefs,
  formatRelationshipComment,
  getItemFromEvent,
  parseRelationshipHints,
  syncItemMetadata,
} = require("../issue-pr-metadata.cjs");

describe("issue-pr-metadata helpers", () => {
  test("extracts linked issue references from PR wording", () => {
    expect(extractIssueRefs("Fixes #965\nRelated to #42")).toEqual([965, 42]);
  });

  test("parses relationship hints from issue body sections", () => {
    const hints = parseRelationshipHints(
      [
        "Fixes #11",
        "Parent issue: #12",
        "Child issues: #13, #14",
        "Blocks #15",
        "Blocked by #16",
        "Security alert: GHSA-ABCD-1234-ABCD",
      ].join("\n"),
    );

    expect(hints).toEqual({
      linkedRefs: [11],
      parentRefs: [12],
      childRefs: [13, 14],
      blocksRefs: [15],
      blockedByRefs: [16],
      securityRefs: ["GHSA-ABCD-1234-ABCD"],
      hasBidirectionalBlocking: true,
    });
  });

  test("builds a readable relationship comment", () => {
    const comment = formatRelationshipComment(
      { number: 99, author: "ashleyshaw" },
      {
        linkedRefs: [11],
        parentRefs: [12],
        childRefs: [13, 14],
        blocksRefs: [15],
        blockedByRefs: [16],
        securityRefs: ["GHSA-ABCD-1234-ABCD"],
      },
      "Release v0.6.0",
    );

    expect(comment).toContain("<!-- metadata-governance -->");
    expect(comment).toContain("Linked issues/PRs: #11");
    expect(comment).toContain("Parent issue: #12");
    expect(comment).toContain("Child issues: #13, #14");
    expect(comment).toContain("Security linkage: GHSA-ABCD-1234-ABCD");
  });

  test("reads the live issue flow payload shape", () => {
    const item = getItemFromEvent({
      issue: {
        number: 968,
        node_id: "MDU6SXNzdWU5Njg=",
        title:
          "Release v0.6.0 — Community Health, Governance Docs, and Meta Agent Foundations",
        body: "## Release Summary",
        labels: [],
        milestone: null,
        user: { login: "ashleyshaw" },
      },
    });

    expect(item).toMatchObject({
      kind: "issue",
      number: 968,
      author: "ashleyshaw",
    });
  });

  test("reads the live PR flow payload shape", () => {
    const item = getItemFromEvent({
      pull_request: {
        number: 966,
        node_id: "MDExOlB1bGxSZXF1ZXN0",
        title:
          "fix(issue-templates): add `about` field, align with 25 org issue types, and polish",
        body: "Fixes #965",
        labels: [],
        milestone: null,
        user: { login: "ashleyshaw" },
      },
    });

    expect(item).toMatchObject({
      kind: "pull_request",
      number: 966,
      author: "ashleyshaw",
    });
    expect(extractIssueRefs(item.body)).toEqual([965]);
  });

  test("syncs issue metadata with requester assignee and leaves milestone unset when no grouped milestone exists", async () => {
    const updatedIssues = [];
    const addedAssignees = [];
    const createdComments = [];

    const github = {
      paginate: jest.fn().mockResolvedValue([]),
      graphql: jest.fn().mockResolvedValue({
        repository: {
          issue: {
            id: "ISSUE-ID",
          },
        },
      }),
      rest: {
        issues: {
          listMilestones: jest.fn(),
          addAssignees: jest.fn().mockImplementation(async (args) => {
            addedAssignees.push(args);
          }),
          update: jest.fn().mockImplementation(async (args) => {
            updatedIssues.push(args);
          }),
          listComments: jest.fn().mockResolvedValue([]),
          createComment: jest.fn().mockImplementation(async (args) => {
            createdComments.push(args);
          }),
          updateComment: jest.fn(),
          get: jest.fn().mockResolvedValue({
            data: { milestone: null },
          }),
        },
      },
    };

    const result = await syncItemMetadata({
      github,
      owner: "lightspeedwp",
      repo: ".github",
      event: {
        issue: {
          number: 968,
          node_id: "MDU6SXNzdWU5Njg=",
          title:
            "Release v0.6.0 — Community Health, Governance Docs, and Meta Agent Foundations",
          body: "Fixes #965",
          labels: [],
          milestone: null,
          user: { login: "ashleyshaw" },
        },
      },
      config: {
        defaults: {
          issue: {
            assignee: "ashleyshaw",
          },
        },
      },
    });

    expect(result).toMatchObject({
      assignee: "ashleyshaw",
      milestone: "",
    });
    expect(addedAssignees).toHaveLength(1);
    expect(addedAssignees[0]).toMatchObject({
      issue_number: 968,
      assignees: ["ashleyshaw"],
    });
    expect(updatedIssues).toHaveLength(0);
    expect(createdComments).toHaveLength(1);
    expect(createdComments[0].body).toContain("Linked issues/PRs: #965");
  });

  test("skips milestone assignment for Dependabot pull requests", async () => {
    const updatedIssues = [];

    const github = {
      paginate: jest.fn().mockResolvedValue([]),
      graphql: jest.fn().mockResolvedValue({
        repository: {
          issue: {
            id: "ISSUE-ID",
          },
        },
      }),
      rest: {
        issues: {
          listMilestones: jest.fn(),
          addAssignees: jest.fn(),
          update: jest.fn().mockImplementation(async (args) => {
            updatedIssues.push(args);
          }),
          listComments: jest.fn().mockResolvedValue([]),
          createComment: jest.fn(),
          updateComment: jest.fn(),
          get: jest.fn().mockResolvedValue({
            data: { milestone: null },
          }),
        },
      },
    };

    const result = await syncItemMetadata({
      github,
      owner: "lightspeedwp",
      repo: ".github",
      event: {
        pull_request: {
          number: 101,
          node_id: "MDExOlB1bGxSZXF1ZXN0",
          title: "Bump lodash from 4.17.20 to 4.17.21",
          body: "",
          labels: [],
          milestone: null,
          user: { login: "dependabot[bot]" },
        },
      },
      config: {
        defaults: {
          issue: {
            assignee: "ashleyshaw",
          },
        },
      },
    });

    expect(result).toMatchObject({
      assignee: "dependabot[bot]",
      milestone: "",
    });
    expect(updatedIssues).toHaveLength(0);
  });

  test("syncs pull request metadata and inherits milestone from linked issue", async () => {
    const updatedIssues = [];
    const createdComments = [];

    const github = {
      paginate: jest.fn().mockResolvedValue([]),
      graphql: jest.fn().mockResolvedValue({
        repository: {
          issue: {
            id: "ISSUE-ID",
          },
        },
      }),
      rest: {
        issues: {
          listMilestones: jest.fn(),
          createMilestone: jest.fn().mockResolvedValue({
            data: {
              number: 101,
              title: "Release v0.6.0",
            },
          }),
          addAssignees: jest.fn(),
          update: jest.fn().mockImplementation(async (args) => {
            updatedIssues.push(args);
          }),
          listComments: jest.fn().mockResolvedValue([]),
          createComment: jest.fn().mockImplementation(async (args) => {
            createdComments.push(args);
          }),
          updateComment: jest.fn(),
          get: jest.fn().mockResolvedValue({
            data: {
              milestone: {
                number: 88,
                title: "Release v0.6.0",
              },
            },
          }),
        },
      },
    };

    const result = await syncItemMetadata({
      github,
      owner: "lightspeedwp",
      repo: ".github",
      event: {
        pull_request: {
          number: 966,
          node_id: "MDExOlB1bGxSZXF1ZXN0",
          title:
            "fix(issue-templates): add `about` field, align with 25 org issue types, and polish",
          body: "Fixes #965",
          labels: [],
          milestone: null,
          user: { login: "ashleyshaw" },
        },
      },
      config: {
        defaults: {
          issue: {
            assignee: "ashleyshaw",
          },
        },
      },
    });

    expect(result).toMatchObject({
      assignee: "ashleyshaw",
      milestone: "Release v0.6.0",
      relationships: {
        linkedRefs: [965],
      },
    });
    expect(updatedIssues).toHaveLength(1);
    expect(updatedIssues[0]).toMatchObject({
      issue_number: 966,
      milestone: 88,
    });
    expect(createdComments).toHaveLength(1);
    expect(createdComments[0].body).toContain("Linked issues/PRs: #965");
  });
});
