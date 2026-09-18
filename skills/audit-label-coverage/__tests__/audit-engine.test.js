const { AuditEngine } = require("../lib/audit-engine");

describe("AuditEngine", () => {
  let engine;
  const mockGitHubClient = {
    validateLabels: jest.fn(),
  };

  const requiredLabelFamilies = {
    type: { required: true, multiple: false },
    status: { required: true, multiple: false },
    priority: { required: true, multiple: false },
    area: { required: true, multiple: true },
  };

  const optionalLabelFamilies = {
    meta: { required: false, multiple: true },
    release: { required: false, multiple: true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    engine = new AuditEngine(mockGitHubClient, {
      required: requiredLabelFamilies,
      optional: optionalLabelFamilies,
    });
  });

  describe("auditIssue", () => {
    test("detects missing required labels", () => {
      const issue = {
        number: 123,
        title: "Test issue",
        labels: [{ name: "type:bug" }],
      };

      const result = engine.auditIssue(issue);

      expect(result).toEqual({
        number: 123,
        title: "Test issue",
        missing: {
          status: true,
          priority: true,
          area: true,
        },
        coverage: 25, // 1 of 4 required
        labels: { type: ["type:bug"] },
        suggestions: expect.arrayContaining([
          "status:*",
          "priority:*",
          "area:*",
        ]),
      });
    });

    test("detects complete label coverage", () => {
      const issue = {
        number: 124,
        title: "Complete issue",
        labels: [
          { name: "type:bug" },
          { name: "status:in-progress" },
          { name: "priority:normal" },
          { name: "area:ci" },
        ],
      };

      const result = engine.auditIssue(issue);

      expect(result).toEqual({
        number: 124,
        title: "Complete issue",
        missing: {},
        coverage: 100,
        labels: {
          type: ["type:bug"],
          status: ["status:in-progress"],
          priority: ["priority:normal"],
          area: ["area:ci"],
        },
        suggestions: [],
      });
    });

    test("handles multiple area labels correctly", () => {
      const issue = {
        number: 125,
        title: "Multi-area issue",
        labels: [
          { name: "type:bug" },
          { name: "status:in-progress" },
          { name: "priority:normal" },
          { name: "area:ci" },
          { name: "area:testing" },
        ],
      };

      const result = engine.auditIssue(issue);

      expect(result.missing).toEqual({});
      expect(result.labels.area).toEqual(["area:ci", "area:testing"]);
      expect(result.coverage).toBe(100);
    });

    test("ignores invalid labels in grouping", () => {
      const issue = {
        number: 126,
        title: "Issue with extra labels",
        labels: [
          { name: "type:bug" },
          { name: "status:in-progress" },
          { name: "priority:normal" },
          { name: "area:ci" },
          { name: "custom-label" },
        ],
      };

      const result = engine.auditIssue(issue);

      // Custom labels should be grouped by family but ignored if family not recognized
      expect(result.coverage).toBe(100);
      expect(result.missing).toEqual({});
    });

    test("generates contextual suggestions", () => {
      const issue = {
        number: 127,
        title: "Bug in authentication flow",
        labels: [{ name: "type:bug" }],
      };

      const result = engine.auditIssue(issue);

      // Should suggest labels based on context
      expect(result.suggestions).toContainEqual(
        expect.stringMatching(/status:/),
      );
      expect(result.suggestions).toContainEqual(
        expect.stringMatching(/priority:/),
      );
      expect(result.suggestions).toContainEqual(expect.stringMatching(/area:/));
    });
  });

  describe("auditBatch", () => {
    test("audits multiple issues and generates summary", async () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [
            { name: "type:bug" },
            { name: "status:done" },
            { name: "priority:normal" },
            { name: "area:ci" },
          ],
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [{ name: "type:feature" }],
        },
        {
          number: 3,
          title: "Issue 3",
          labels: [{ name: "type:task" }, { name: "status:in-progress" }],
        },
      ];

      const result = await engine.auditBatch(issues);

      expect(result.total).toBe(3);
      expect(result.fullyLabeled).toBe(1);
      expect(result.partiallyLabeled).toBe(2);
      expect(result.unlabeled).toBe(0);
      expect(result.issues).toHaveLength(3);
    });

    test("tracks label family coverage", async () => {
      const issues = [
        {
          number: 1,
          title: "Issue 1",
          labels: [{ name: "type:bug" }],
        },
        {
          number: 2,
          title: "Issue 2",
          labels: [{ name: "type:feature" }, { name: "status:ready" }],
        },
        {
          number: 3,
          title: "Issue 3",
          labels: [
            { name: "type:task" },
            { name: "status:in-progress" },
            { name: "priority:normal" },
            { name: "area:docs" },
          ],
        },
      ];

      const result = await engine.auditBatch(issues);

      expect(result.familyCoverage).toEqual({
        type: { labeled: 3, coverage: 100 },
        status: { labeled: 2, coverage: 67 },
        priority: { labeled: 1, coverage: 33 },
        area: { labeled: 1, coverage: 33 },
      });
    });

    test("identifies common missing labels", async () => {
      const issues = [
        { number: 1, title: "Issue 1", labels: [{ name: "type:bug" }] },
        { number: 2, title: "Issue 2", labels: [{ name: "type:feature" }] },
        { number: 3, title: "Issue 3", labels: [{ name: "type:task" }] },
      ];

      const result = await engine.auditBatch(issues);

      expect(result.topMissingLabels).toContainEqual(
        expect.objectContaining({
          family: "status",
          count: 3,
        }),
      );
      expect(result.topMissingLabels).toContainEqual(
        expect.objectContaining({
          family: "priority",
          count: 3,
        }),
      );
    });
  });

  describe("coverage calculations", () => {
    test("calculates percentage correctly for mixed coverage", () => {
      const issue = {
        number: 1,
        title: "Test",
        labels: [{ name: "type:bug" }, { name: "area:ci" }],
      };

      const result = engine.auditIssue(issue);

      // 2 out of 4 required families
      expect(result.coverage).toBe(50);
    });

    test("handles single required label correctly", () => {
      const singleRequired = {
        required: {
          type: { required: true, multiple: false },
        },
        optional: {},
      };

      const singleEngine = new AuditEngine(mockGitHubClient, singleRequired);
      const issue = {
        number: 1,
        title: "Test",
        labels: [{ name: "type:bug" }],
      };

      const result = singleEngine.auditIssue(issue);

      expect(result.coverage).toBe(100);
    });
  });
});
