const fs = require("fs");
const os = require("os");
const path = require("path");
const yaml = require("js-yaml");
const {
  deriveProjectFieldValues,
  inferTypeFromContext,
  run,
} = require("../derive-project-fields.cjs");

const issueFieldsConfigPath = path.resolve(
  __dirname,
  "../../../../.github/issue-fields.yml",
);

const issueFieldsConfig = yaml.load(
  fs.readFileSync(issueFieldsConfigPath, "utf8"),
);

describe("derive-project-fields.cjs", () => {
  test("keeps kickoff dates empty until ready or in-progress", () => {
    const result = deriveProjectFieldValues({
      cfg: issueFieldsConfig,
      labels: ["status:needs-triage", "priority:normal", "type:task"],
      eventName: "issues",
      eventAction: "opened",
      itemCreatedAt: "2026-06-18T10:15:00Z",
      milestoneDueOn: "2026-07-18T00:00:00Z",
    });

    expect(result).toMatchObject({
      status: "Triage",
      priority: "Normal",
      type: "Task",
      startDate: "",
      targetDate: "",
    });
  });

  test("populates kickoff dates when the item is ready to start", () => {
    const result = deriveProjectFieldValues({
      cfg: issueFieldsConfig,
      labels: ["status:ready", "priority:important", "type:feature"],
      eventName: "issues",
      eventAction: "edited",
      itemCreatedAt: "2026-06-18T10:15:00Z",
      milestoneDueOn: "2026-07-18T00:00:00Z",
    });

    expect(result).toMatchObject({
      status: "Ready",
      priority: "Important",
      type: "Feature",
      startDate: "2026-06-18",
      targetDate: "2026-07-18",
    });
  });

  test("falls back to PR defaults when labels are missing", () => {
    const result = deriveProjectFieldValues({
      cfg: issueFieldsConfig,
      labels: [],
      eventName: "pull_request",
      eventAction: "opened",
      title: "Refine metadata sync behaviour",
      body: "Improve how project metadata is allocated.",
    });

    expect(result).toMatchObject({
      status: "In review",
      priority: "Normal",
      type: "Chore",
      startDate: "",
      targetDate: "",
    });
  });

  test("infers type and priority from content when labels are missing", () => {
    const result = deriveProjectFieldValues({
      cfg: issueFieldsConfig,
      labels: [],
      eventName: "pull_request",
      eventAction: "opened",
      title: "Urgent bug: project metadata stays blank",
      body: "This bug blocks release and should be fixed immediately.",
      headRef: "fix/metadata-governance-sync",
    });

    expect(result).toMatchObject({
      status: "In review",
      priority: "Critical",
      type: "Bug",
    });
  });

  test("writes derived values to GITHUB_OUTPUT when run as a script", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "derive-project-fields-"),
    );
    const outputPath = path.join(tmpDir, "github-output.txt");
    const originalEnv = {
      ISSUE_FIELDS_CONFIG: process.env.ISSUE_FIELDS_CONFIG,
      EVENT_NAME: process.env.EVENT_NAME,
      EVENT_ACTION: process.env.EVENT_ACTION,
      LABELS: process.env.LABELS,
      ITEM_TITLE: process.env.ITEM_TITLE,
      ITEM_BODY: process.env.ITEM_BODY,
      PR_HEAD_REF: process.env.PR_HEAD_REF,
      GITHUB_OUTPUT: process.env.GITHUB_OUTPUT,
    };

    try {
      process.env.ISSUE_FIELDS_CONFIG = issueFieldsConfigPath;
      process.env.EVENT_NAME = "pull_request";
      process.env.EVENT_ACTION = "opened";
      process.env.LABELS = "";
      process.env.ITEM_TITLE = "Urgent bug: project metadata stays blank";
      process.env.ITEM_BODY =
        "This bug blocks release and should be fixed immediately.";
      process.env.PR_HEAD_REF = "fix/metadata-governance-sync";
      process.env.GITHUB_OUTPUT = outputPath;

      run();
    } finally {
      for (const [key, value] of Object.entries(originalEnv)) {
        if (typeof value === "undefined") delete process.env[key];
        else process.env[key] = value;
      }
    }

    const output = fs.readFileSync(outputPath, "utf8");
    expect(output).toContain("status=In review");
    expect(output).toContain("priority=Critical");
    expect(output).toContain("type=Bug");
  });
});

describe("issue-type inference uses canonical Type labels", () => {
  const mappings = issueFieldsConfig.project_field_mappings || {};

  function infer(overrides) {
    return inferTypeFromContext({ mappings, ...overrides });
  }

  function deriveType(overrides) {
    return deriveProjectFieldValues({
      cfg: issueFieldsConfig,
      labels: [],
      eventName: "pull_request",
      eventAction: "opened",
      ...overrides,
    }).type;
  }

  // Regression coverage for the retired type:documentation and
  // type:integration rules. Those labels are absent from
  // project_field_mappings.Type, so every match resolved to an empty string and
  // silently fell through to the generic default.
  test.each([
    ["documentation", "Documentation"],
    ["docs", "Documentation"],
    ["readme", "Documentation"],
    ["guide", "Documentation"],
    ["integration", "Compatibility"],
    ["compatibility", "Compatibility"],
    ["interop", "Compatibility"],
    ["interoperability", "Compatibility"],
    ["dependency", "Dependency Update"],
    ["dependencies", "Dependency Update"],
  ])("infers %s content as %s", (keyword, expected) => {
    expect(infer({ title: `Update the ${keyword} surface` })).toBe(expected);
  });

  test.each([
    ["documentation", "Documentation"],
    ["guide", "Documentation"],
  ])("infers %s from the body when the title has no signal", (keyword, expected) => {
    expect(infer({ title: "Misc", body: `Rewrite the ${keyword} pages` })).toBe(
      expected,
    );
  });

  test.each(["docs/readme-cleanup", "doc/fix-typos"])(
    "infers Documentation from the %s branch prefix",
    (headRef) => {
      expect(infer({ headRef })).toBe("Documentation");
    },
  );

  test.each([
    ["docs/readme-cleanup", "Documentation"],
    ["docs/plugin-advisories", "Documentation"],
    ["fix/widget-rendering", "Bug"],
    ["feat/new-endpoint", "Feature"],
  ])("derives the canonical Type for a %s pull request", (headRef, expected) => {
    expect(deriveType({ headRef })).toBe(expected);
  });

  test("keeps an explicit label ahead of any content inference", () => {
    expect(
      infer({ labels: ["type:bug"], title: "Update the documentation" }),
    ).toBe("Bug");
  });

  test("an unmapped rule no longer swallows a later matching rule", () => {
    // If a rule label is missing from the config the match must be skipped so a
    // later, mapped rule can still classify the content.
    const partialMappings = { Type: { "type:feature": "Feature" } };

    expect(
      inferTypeFromContext({
        mappings: partialMappings,
        title: "Improve the documentation and add a feature flag",
      }),
    ).toBe("Feature");
  });

  test("returns the generic default when nothing matches", () => {
    expect(infer({ title: "Misc" })).toBe("");
  });
});
