const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { deriveProjectFieldValues } = require("../derive-project-fields.cjs");

const issueFieldsConfig = yaml.load(
  fs.readFileSync(
    path.join(__dirname, "../../../../.github/issue-fields.yml"),
    "utf8",
  ),
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
});
