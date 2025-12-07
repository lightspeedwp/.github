const { buildLabelingReport } = require("../build-labeling-report");
const { labelsToMarkdownTable, diffLabels } = require("../label-utils");

// Mock the label-utils module
jest.mock("../label-utils");

describe("build-labeling-report.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    labelsToMarkdownTable.mockImplementation((labels) => {
      if (labels.length === 0) return "No labels\n";
      return labels.map((label) => `- ${label}`).join("\n") + "\n";
    });

    diffLabels.mockImplementation((current, canonical) => {
      const missing = canonical.filter((label) => !current.includes(label));
      const extra = current.filter((label) => !canonical.includes(label));
      return { missing, extra };
    });
  });

  describe("buildLabelingReport", () => {
    it("should generate report with matching labels", () => {
      const currentLabels = ["bug", "enhancement"];
      const canonicalLabels = ["bug", "enhancement"];

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("## Label Audit Report");
      expect(result).toContain("**Current Labels:**");
      expect(result).toContain("**Expected Canonical Labels:**");
      expect(result).toContain("- bug");
      expect(result).toContain("- enhancement");
      expect(result).not.toContain("**Missing Canonical Labels:**");
      expect(result).not.toContain("**Extra (Non-canonical) Labels:**");
    });

    it("should show missing labels in report", () => {
      const currentLabels = ["bug"];
      const canonicalLabels = ["bug", "enhancement", "documentation"];

      diffLabels.mockReturnValue({
        missing: ["enhancement", "documentation"],
        extra: [],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("**Missing Canonical Labels:**");
      expect(result).toContain("- enhancement");
      expect(result).toContain("- documentation");
      expect(result).not.toContain("**Extra (Non-canonical) Labels:**");
    });

    it("should show extra labels in report", () => {
      const currentLabels = ["bug", "wontfix", "invalid"];
      const canonicalLabels = ["bug"];

      diffLabels.mockReturnValue({
        missing: [],
        extra: ["wontfix", "invalid"],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("**Extra (Non-canonical) Labels:**");
      expect(result).toContain("- wontfix");
      expect(result).toContain("- invalid");
      expect(result).not.toContain("**Missing Canonical Labels:**");
    });

    it("should show both missing and extra labels", () => {
      const currentLabels = ["bug", "wontfix"];
      const canonicalLabels = ["bug", "enhancement"];

      diffLabels.mockReturnValue({
        missing: ["enhancement"],
        extra: ["wontfix"],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("**Missing Canonical Labels:**");
      expect(result).toContain("- enhancement");
      expect(result).toContain("**Extra (Non-canonical) Labels:**");
      expect(result).toContain("- wontfix");
    });

    it("should handle empty current labels", () => {
      const currentLabels = [];
      const canonicalLabels = ["bug", "enhancement"];

      labelsToMarkdownTable.mockImplementation((labels) => {
        if (labels.length === 0) return "No labels\n";
        return labels.map((label) => `- ${label}`).join("\n") + "\n";
      });

      diffLabels.mockReturnValue({
        missing: ["bug", "enhancement"],
        extra: [],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("**Current Labels:**");
      expect(result).toContain("No labels");
      expect(result).toContain("**Missing Canonical Labels:**");
      expect(result).toContain("- bug");
      expect(result).toContain("- enhancement");
    });

    it("should handle empty canonical labels", () => {
      const currentLabels = ["bug", "enhancement"];
      const canonicalLabels = [];

      diffLabels.mockReturnValue({
        missing: [],
        extra: ["bug", "enhancement"],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("**Expected Canonical Labels:**");
      expect(result).toContain("**Extra (Non-canonical) Labels:**");
      expect(result).toContain("- bug");
      expect(result).toContain("- enhancement");
    });

    it("should handle both empty arrays", () => {
      const currentLabels = [];
      const canonicalLabels = [];

      labelsToMarkdownTable.mockReturnValue("No labels\n");
      diffLabels.mockReturnValue({
        missing: [],
        extra: [],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("## Label Audit Report");
      expect(result).toContain("**Current Labels:**");
      expect(result).toContain("**Expected Canonical Labels:**");
      expect(result).not.toContain("**Missing Canonical Labels:**");
      expect(result).not.toContain("**Extra (Non-canonical) Labels:**");
    });

    it("should call labelsToMarkdownTable for current labels", () => {
      const currentLabels = ["bug", "enhancement"];
      const canonicalLabels = ["bug", "enhancement"];

      buildLabelingReport(currentLabels, canonicalLabels);

      expect(labelsToMarkdownTable).toHaveBeenCalledWith(currentLabels);
    });

    it("should call labelsToMarkdownTable for canonical labels", () => {
      const currentLabels = ["bug"];
      const canonicalLabels = ["bug", "enhancement"];

      buildLabelingReport(currentLabels, canonicalLabels);

      expect(labelsToMarkdownTable).toHaveBeenCalledWith(canonicalLabels);
    });

    it("should call labelsToMarkdownTable for missing labels", () => {
      const currentLabels = ["bug"];
      const canonicalLabels = ["bug", "enhancement"];

      diffLabels.mockReturnValue({
        missing: ["enhancement"],
        extra: [],
      });

      buildLabelingReport(currentLabels, canonicalLabels);

      expect(labelsToMarkdownTable).toHaveBeenCalledWith(["enhancement"]);
    });

    it("should call labelsToMarkdownTable for extra labels", () => {
      const currentLabels = ["bug", "wontfix"];
      const canonicalLabels = ["bug"];

      diffLabels.mockReturnValue({
        missing: [],
        extra: ["wontfix"],
      });

      buildLabelingReport(currentLabels, canonicalLabels);

      expect(labelsToMarkdownTable).toHaveBeenCalledWith(["wontfix"]);
    });

    it("should call diffLabels with correct arguments", () => {
      const currentLabels = ["bug", "enhancement"];
      const canonicalLabels = ["bug", "documentation"];

      buildLabelingReport(currentLabels, canonicalLabels);

      expect(diffLabels).toHaveBeenCalledWith(currentLabels, canonicalLabels);
    });

    it("should handle labels with special characters", () => {
      const currentLabels = ["Type: Bug", "Priority: High"];
      const canonicalLabels = ["Type: Bug", "Priority: High"];

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("- Type: Bug");
      expect(result).toContain("- Priority: High");
    });

    it("should handle case-sensitive labels", () => {
      const currentLabels = ["Bug", "bug"];
      const canonicalLabels = ["bug"];

      diffLabels.mockReturnValue({
        missing: [],
        extra: ["Bug"],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("**Extra (Non-canonical) Labels:**");
      expect(labelsToMarkdownTable).toHaveBeenCalledWith(["Bug"]);
    });

    it("should handle large number of labels", () => {
      const currentLabels = Array.from({ length: 50 }, (_, i) => `label-${i}`);
      const canonicalLabels = Array.from(
        { length: 50 },
        (_, i) => `canonical-${i}`,
      );

      diffLabels.mockReturnValue({
        missing: canonicalLabels,
        extra: currentLabels,
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("**Missing Canonical Labels:**");
      expect(result).toContain("**Extra (Non-canonical) Labels:**");
      expect(labelsToMarkdownTable).toHaveBeenCalledTimes(4);
    });

    it("should generate proper Markdown structure", () => {
      const currentLabels = ["bug"];
      const canonicalLabels = ["bug", "enhancement"];

      diffLabels.mockReturnValue({
        missing: ["enhancement"],
        extra: [],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      // Check for proper Markdown headings
      expect(result).toMatch(/^## Label Audit Report/m);
      expect(result).toMatch(/\*\*Current Labels:\*\*/);
      expect(result).toMatch(/\*\*Expected Canonical Labels:\*\*/);
      expect(result).toMatch(/\*\*Missing Canonical Labels:\*\*/);
    });

    it("should maintain proper section order in report", () => {
      const currentLabels = ["bug", "wontfix"];
      const canonicalLabels = ["bug", "enhancement"];

      diffLabels.mockReturnValue({
        missing: ["enhancement"],
        extra: ["wontfix"],
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      const currentIndex = result.indexOf("**Current Labels:**");
      const canonicalIndex = result.indexOf("**Expected Canonical Labels:**");
      const missingIndex = result.indexOf("**Missing Canonical Labels:**");
      const extraIndex = result.indexOf("**Extra (Non-canonical) Labels:**");

      expect(currentIndex).toBeLessThan(canonicalIndex);
      expect(canonicalIndex).toBeLessThan(missingIndex);
      expect(missingIndex).toBeLessThan(extraIndex);
    });

    it("should handle labels with emojis", () => {
      const currentLabels = ["🐛 bug", "✨ enhancement"];
      const canonicalLabels = ["🐛 bug", "✨ enhancement"];

      labelsToMarkdownTable.mockImplementation((labels) => {
        return labels.map((label) => `- ${label}`).join("\n") + "\n";
      });

      const result = buildLabelingReport(currentLabels, canonicalLabels);

      expect(result).toContain("- 🐛 bug");
      expect(result).toContain("- ✨ enhancement");
    });

    it("should return string type", () => {
      const result = buildLabelingReport([], []);

      expect(typeof result).toBe("string");
    });

    it("should not modify input arrays", () => {
      const currentLabels = ["bug", "enhancement"];
      const canonicalLabels = ["bug", "documentation"];
      const currentCopy = [...currentLabels];
      const canonicalCopy = [...canonicalLabels];

      buildLabelingReport(currentLabels, canonicalLabels);

      expect(currentLabels).toEqual(currentCopy);
      expect(canonicalLabels).toEqual(canonicalCopy);
    });
  });
});
