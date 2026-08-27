import fs from "fs";
import os from "os";
import path from "path";

let getMetrics;
let writeJsonReport;
let writeMarkdownReport;
let daysSince;
let buildExcludeRegex;
let buildPreserveAuthorRegex;

describe("cleanup-branches report generation", () => {
  const reportDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "cleanup-branches-report-"),
  );

  beforeAll(async () => {
    process.env.CLEANUP_BRANCHES_SKIP_MAIN = "1";
    ({
      getMetrics,
      writeJsonReport,
      writeMarkdownReport,
      daysSince,
      buildExcludeRegex,
      buildPreserveAuthorRegex,
    } = await import("../../cleanup-branches.js"));
  });

  afterAll(() => {
    delete process.env.CLEANUP_BRANCHES_SKIP_MAIN;
    fs.rmSync(reportDir, { recursive: true, force: true });
  });

  it("builds metrics with type breakdown and author list", () => {
    const metrics = getMetrics(
      [
        {
          branch: "feat/old-widget",
          author: "user@example.com",
          commitCount: 3,
          estimatedStorageBytes: 12288,
          type: "feat",
        },
        {
          branch: "fix/stale-bug",
          author: "user@example.com",
          commitCount: 2,
          estimatedStorageBytes: 8192,
          type: "fix",
        },
      ],
      [{ branch: "release/v1.0.0", reason: "protected branch" }],
      [],
      2,
    );

    expect(metrics.candidatesCount).toBe(2);
    expect(metrics.successfulDeletes).toBe(2);
    expect(metrics.failedDeletes).toBe(0);
    expect(metrics.byType).toEqual({ feat: 1, fix: 1 });
    expect(metrics.authorsAffected).toEqual(["user@example.com"]);
    expect(metrics.totalCommits).toBe(5);
    expect(metrics.estimatedStorageHuman).toBe("20.00 KB");
  });

  it("writes markdown and json reports with the requested summary fields", () => {
    const deleted = [
      {
        branch: "feat/old-widget",
        author: "user@example.com",
        lastCommitDate: "2026-05-01T00:00:00Z",
        age: 42,
        hash: "abc1234",
        type: "feat",
        commitCount: 3,
        estimatedStorageBytes: 12288,
        reason: "merged and inactive for 42 days",
        localDeleted: false,
      },
    ];
    const preserved = [{ branch: "main", reason: "protected branch" }];
    const errors = [
      { branch: "feat/problematic", error: "remote deletion failed" },
    ];
    const metrics = getMetrics(deleted, preserved, errors, 1);
    const reportOptions = {
      dryRun: false,
      inactiveDays: 30,
      reportDir,
    };

    const markdownPath = writeMarkdownReport(
      deleted,
      preserved,
      errors,
      metrics,
      reportOptions,
    );
    const jsonPath = writeJsonReport(
      deleted,
      preserved,
      errors,
      metrics,
      reportOptions,
    );

    const markdown = fs.readFileSync(markdownPath, "utf8");
    const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

    expect(markdown).toContain("# Branch Cleanup Report");
    expect(markdown).toContain("| Branches considered for deletion | 1 |");
    expect(markdown).toContain("| Deletion success rate | 50.00% |");
    expect(markdown).toContain("- **feat**: 1");
    expect(markdown).toContain("- user@example.com");
    expect(markdown).toContain("## Errors");
    expect(markdown).toContain("remote deletion failed");

    expect(json.summary.candidates).toBe(1);
    expect(json.summary.deleted).toBe(1);
    expect(json.summary.preserved).toBe(1);
    expect(json.summary.errors).toBe(1);
    expect(json.summary.deletionSuccessRate).toBe("50.00%");
    expect(json.summary.estimatedStorageFreedHuman).toBe("12.00 KB");
    expect(json.metrics.deletedByType).toEqual({ feat: 1 });
    expect(json.metrics.authorsAffected).toEqual(["user@example.com"]);
    expect(json.deleted[0].branch).toBe("feat/old-widget");
  });
});

describe("cleanup-branches edge case handling", () => {
  beforeAll(async () => {
    process.env.CLEANUP_BRANCHES_SKIP_MAIN = "1";
  });

  afterAll(() => {
    delete process.env.CLEANUP_BRANCHES_SKIP_MAIN;
  });

  it("daysSince handles empty/invalid dates safely by treating as recent", () => {
    expect(daysSince("")).toBe(0);
    expect(daysSince(null)).toBe(0);
    expect(daysSince(undefined)).toBe(0);
    expect(daysSince("invalid-date")).toBe(0);
  });

  it("daysSince returns correct age for valid ISO dates", () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const age = daysSince(oneDayAgo.toISOString());
    expect(Math.floor(age)).toBe(1);
  });

  it("buildExcludeRegex handles invalid regex gracefully with fallback", () => {
    const regex = buildExcludeRegex();
    expect(regex).toBeInstanceOf(RegExp);
    expect(() => regex.test("release/v1.0.0")).not.toThrow();
  });

  it("buildPreserveAuthorRegex handles invalid regex gracefully", () => {
    const regex = buildPreserveAuthorRegex();
    if (regex) {
      expect(regex).toBeInstanceOf(RegExp);
    }
    expect(() => buildPreserveAuthorRegex()).not.toThrow();
  });
});
