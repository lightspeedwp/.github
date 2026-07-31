const {
  mapCommitTypeToSection,
  mapLabelToSection,
  determineSection,
  getAllSections,
  isValidSection,
  TYPE_TO_SECTION,
  LABEL_TO_SECTION,
} = require("../../agents/includes/categoryMapper");

describe("categoryMapper", () => {
  describe("mapCommitTypeToSection", () => {
    it("maps feat to added", () => {
      expect(mapCommitTypeToSection("feat")).toBe("added");
    });

    it("maps fix to fixed", () => {
      expect(mapCommitTypeToSection("fix")).toBe("fixed");
    });

    it("maps docs to documentation", () => {
      expect(mapCommitTypeToSection("docs")).toBe("documentation");
    });

    it("maps perf to performance", () => {
      expect(mapCommitTypeToSection("perf")).toBe("performance");
    });

    it("maps style, refactor, test, chore to changed", () => {
      ["style", "refactor", "test", "chore"].forEach((type) => {
        expect(mapCommitTypeToSection(type)).toBe("changed");
      });
    });

    it("returns null for unknown type", () => {
      expect(mapCommitTypeToSection("unknown")).toBeNull();
    });

    it("handles case insensitive input", () => {
      expect(mapCommitTypeToSection("FEAT")).toBe("added");
      expect(mapCommitTypeToSection("FIX")).toBe("fixed");
    });
  });

  describe("mapLabelToSection", () => {
    it("maps PR labels to sections", () => {
      expect(mapLabelToSection("type: feature")).toBe("added");
      expect(mapLabelToSection("type: bugfix")).toBe("fixed");
      expect(mapLabelToSection("type: security")).toBe("security");
    });

    it("handles case insensitive labels", () => {
      expect(mapLabelToSection("TYPE: FEATURE")).toBe("added");
    });

    it("returns null for unknown label", () => {
      expect(mapLabelToSection("unknown: label")).toBeNull();
    });
  });

  describe("determineSection", () => {
    it("prioritizes labels over type", () => {
      const section = determineSection("fix", ["type: feature"]);
      expect(section).toBe("added");
    });

    it("uses type when no labels provided", () => {
      const section = determineSection("feat", []);
      expect(section).toBe("added");
    });

    it("uses first matching label", () => {
      const section = determineSection("fix", [
        "unknown: label",
        "type: bugfix",
      ]);
      expect(section).toBe("fixed");
    });

    it("returns null when no match found", () => {
      const section = determineSection("invalid", []);
      expect(section).toBeNull();
    });
  });

  describe("getAllSections", () => {
    it("returns all valid sections", () => {
      const sections = getAllSections();

      expect(sections).toContain("added");
      expect(sections).toContain("changed");
      expect(sections).toContain("deprecated");
      expect(sections).toContain("removed");
      expect(sections).toContain("fixed");
      expect(sections).toContain("security");
      expect(sections).toContain("documentation");
      expect(sections).toContain("performance");
    });
  });

  describe("isValidSection", () => {
    it("validates valid sections", () => {
      getAllSections().forEach((section) => {
        expect(isValidSection(section)).toBe(true);
      });
    });

    it("rejects invalid sections", () => {
      expect(isValidSection("invalid")).toBe(false);
      expect(isValidSection("todo")).toBe(false);
    });

    it("handles case insensitive input", () => {
      expect(isValidSection("ADDED")).toBe(true);
      expect(isValidSection("FIXED")).toBe(true);
    });
  });

  describe("TYPE_TO_SECTION", () => {
    it("contains all conventional commit types", () => {
      const types = [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
      ];
      types.forEach((type) => {
        expect(TYPE_TO_SECTION).toHaveProperty(type);
      });
    });
  });

  describe("LABEL_TO_SECTION", () => {
    it("contains GitHub label mappings", () => {
      expect(LABEL_TO_SECTION["type: feature"]).toBe("added");
      expect(LABEL_TO_SECTION["type: bugfix"]).toBe("fixed");
      expect(LABEL_TO_SECTION["type: security"]).toBe("security");
    });
  });
});
