/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

describe("project-meta-sync workflow contract", () => {
  // project-meta-sync.yml was archived on 2026-09-11 to
  // .github/workflows/archived/2026-09-11/utilities/project/ per
  // ARCHIVED_WORKFLOWS_MANIFEST.md, which claims its duties moved to
  // project-management.yml. They did not: that workflow has neither an
  // "add-and-sync" job nor a "collect-labels" step. A third instance of
  // the same broken-consolidation pattern found elsewhere in #3309 (see
  // the flagged audit of ARCHIVED_WORKFLOWS_MANIFEST.md). Reading the
  // archived source so this still catches regressions in it -- though
  // even the archived version doesn't match this test's contract: it
  // still triggers on push (test 1) and derives labels via a bash
  // step using `gh issue/pr view` + grep, not a "collect-labels"
  // actions/github-script step reading context.payload directly
  // (test 2). This test describes a redesign that appears to have
  // never been implemented, archived or otherwise -- part of the
  // same flagged audit, not something to guess a fix for here.
  const workflowPath = path.join(
    __dirname,
    "../../../.github/workflows/archived/2026-09-11/utilities/project/project-meta-sync.yml",
  );

  test("runs on issue and PR label churn instead of push", () => {
    const workflow = yaml.load(fs.readFileSync(workflowPath, "utf8"));

    expect(workflow.on.push).toBeUndefined();
    expect(workflow.on.issues.types).toEqual(
      expect.arrayContaining(["opened", "edited", "labeled", "unlabeled"]),
    );
    expect(workflow.on.pull_request.types).toEqual(
      expect.arrayContaining([
        "opened",
        "edited",
        "reopened",
        "labeled",
        "unlabeled",
        "ready_for_review",
        "closed",
      ]),
    );
  });

  test("collects labels from the event payload", () => {
    const workflow = yaml.load(fs.readFileSync(workflowPath, "utf8"));
    const collectStep = workflow.jobs["add-and-sync"].steps.find(
      (step) => step.id === "collect-labels",
    );

    expect(collectStep).toBeDefined();
    expect(collectStep.uses).toBe("actions/github-script@v7");
    expect(collectStep.with.script).toContain("context.payload.issue?.labels");
    expect(collectStep.with.script).toContain(
      "context.payload.pull_request?.labels",
    );
  });
});
