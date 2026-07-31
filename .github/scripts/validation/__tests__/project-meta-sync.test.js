/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

describe("project-meta-sync workflow contract", () => {
  const workflowPath = path.join(
    __dirname,
    "../../../.github/workflows/project-meta-sync.yml",
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
