const fs = require("fs");
const path = require("path");
const os = require("os");
const validators = require("../skills/adr-validators");

describe("ADR Validators", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "adr-validators-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  const createADR = (filename, content) => {
    fs.writeFileSync(path.join(tempDir, filename), content);
  };

  describe("enforceUniqueTitles", () => {
    test("should pass when all titles are unique", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: First Decision\n---\n# First Decision",
      );
      createADR(
        "0002-second.md",
        "---\ntitle: Second Decision\n---\n# Second Decision",
      );

      const result = validators.enforceUniqueTitles(tempDir);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should fail when titles are duplicated", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: Duplicate Decision\n---\n# Duplicate Decision",
      );
      createADR(
        "0002-second.md",
        "---\ntitle: Duplicate Decision\n---\n# Duplicate Decision",
      );

      const result = validators.enforceUniqueTitles(tempDir);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].title).toBe("Duplicate Decision");
    });
  });

  describe("enforceValidReferences", () => {
    test("should pass when all references are valid", () => {
      createADR("0001-first.md", "---\ntitle: First\n---\n# First");
      createADR(
        "0002-second.md",
        "---\ntitle: Second\nsupersedes: 1\n---\n# Second",
      );

      const result = validators.enforceValidReferences(tempDir);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should fail when reference ADR does not exist", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: First\nsupersedes: 999\n---\n# First",
      );

      const result = validators.enforceValidReferences(tempDir);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("enforceStatusTransitions", () => {
    test("should pass when status is valid", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: First\nstatus: PROPOSED\n---\n# First",
      );
      createADR(
        "0002-second.md",
        "---\ntitle: Second\nstatus: ACCEPTED\n---\n# Second",
      );

      const result = validators.enforceStatusTransitions(tempDir);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should fail when status is invalid", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: First\nstatus: INVALID_STATUS\n---\n# First",
      );

      const result = validators.enforceStatusTransitions(tempDir);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should return valid statuses", () => {
      createADR("0001-first.md", "---\ntitle: First\n---\n# First");

      const result = validators.enforceStatusTransitions(tempDir);
      expect(result.validStatuses).toContain("PROPOSED");
      expect(result.validStatuses).toContain("ACCEPTED");
      expect(result.validStatuses).toContain("SUPERSEDED");
      expect(result.validStatuses).toContain("REJECTED");
    });
  });

  describe("enforceFormat", () => {
    test("should pass for properly formatted ADR", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: First\ndate: 2026-08-17\nstatus: PROPOSED\nauthors: Alice\n---\n# First",
      );

      const result = validators.enforceFormat(tempDir);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should fail when frontmatter is missing", () => {
      createADR("0001-first.md", "# First\nNo frontmatter here");

      const result = validators.enforceFormat(tempDir);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should return required fields", () => {
      createADR("0001-first.md", "---\ntitle: First\n---\n# First");

      const result = validators.enforceFormat(tempDir);
      expect(result.requiredFields).toContain("title");
      expect(result.requiredFields).toContain("date");
      expect(result.requiredFields).toContain("status");
      expect(result.requiredFields).toContain("authors");
    });
  });

  describe("enforceFilenameFormat", () => {
    test("should pass for correctly named files", () => {
      createADR(
        "0001-first-decision.md",
        "---\ntitle: First\n---\n# First",
      );
      createADR(
        "0002-second-decision.md",
        "---\ntitle: Second\n---\n# Second",
      );

      const result = validators.enforceFilenameFormat(tempDir);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should fail for incorrectly named files", () => {
      createADR("first-decision.md", "---\ntitle: First\n---\n# First");

      const result = validators.enforceFilenameFormat(tempDir);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should return filename pattern", () => {
      createADR("0001-first.md", "---\ntitle: First\n---\n# First");

      const result = validators.enforceFilenameFormat(tempDir);
      expect(result.pattern).toBe("NNNN-slug.md or YYYY-MM-DD[-N]-slug.md");
    });
  });

  describe("enforceMetadata", () => {
    test("should pass when all required metadata is present", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: First\ndate: 2026-08-17\nstatus: PROPOSED\nauthors: Alice\n---\n# First",
      );

      const result = validators.enforceMetadata(tempDir, [
        "title",
        "date",
        "status",
        "authors",
      ]);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should fail when required metadata is missing", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: First\ndate: 2026-08-17\n---\n# First",
      );

      const result = validators.enforceMetadata(tempDir, [
        "title",
        "date",
        "status",
        "authors",
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should fail when required metadata is empty", () => {
      createADR(
        "0001-first.md",
        "---\ntitle: \ndate: 2026-08-17\nstatus: PROPOSED\nauthors: Alice\n---\n# First",
      );

      const result = validators.enforceMetadata(tempDir, [
        "title",
        "date",
        "status",
        "authors",
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.emptyFields)).toBe(true);
    });
  });

  describe("Integration", () => {
    test("should validate complete ADR collection", () => {
      createADR(
        "0001-architecture.md",
        "---\ntitle: System Architecture\ndate: 2026-08-17\nstatus: ACCEPTED\nauthors: Alice, Bob\n---\n# System Architecture\n\nWe will use microservices.",
      );
      createADR(
        "0002-database.md",
        "---\ntitle: Database Choice\ndate: 2026-08-18\nstatus: ACCEPTED\nauthors: Alice\nsupersedes: 1\n---\n# Database Choice\n\nWe will use PostgreSQL.",
      );

      const uniqueTitles = validators.enforceUniqueTitles(tempDir);
      const validReferences = validators.enforceValidReferences(tempDir);
      const validStatuses = validators.enforceStatusTransitions(tempDir);
      const validFormat = validators.enforceFormat(tempDir);
      const validFilenames = validators.enforceFilenameFormat(tempDir);
      const validMetadata = validators.enforceMetadata(tempDir);

      expect(uniqueTitles.valid).toBe(true);
      expect(validReferences.valid).toBe(true);
      expect(validStatuses.valid).toBe(true);
      expect(validFormat.valid).toBe(true);
      expect(validFilenames.valid).toBe(true);
      expect(validMetadata.valid).toBe(true);
    });
  });
});
