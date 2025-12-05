const { buildLabelingReport } = require("../label-reporting");

// TODO: This test suite may fail due to polluted global state from label-sync.test.js
// Fix label-sync global mock cleanup first (see TODO in label-sync.test.js), then re-validate
// Error manifests as: "Failed to standardize labels: Critical system error"
describe("buildLabelingReport", () => {
  it("generates a markdown report for labels", () => {
    const report = buildLabelingReport(
      ["status:needs-review", "type:feature"],
      ["status:needs-review", "type:feature"],
    );
    expect(report).toMatch(/Label Audit Report/);
    expect(report).toMatch(/status:needs-review/);
  });
});
