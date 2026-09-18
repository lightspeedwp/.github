const fs = require("fs");
const path = require("path");
const os = require("os");
const { ADRDiscovery } = require("../skills/adr-discovery");

describe("ADR Discovery", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "adr-discovery-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe("Sequential Numbering", () => {
    test("should start at 0001 for empty directory", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "sequential",
        zeropadded: true,
        width: 4,
      });

      const next = discovery.findNextNumber();
      expect(next).toBe("0001");
    });

    test("should increment sequential numbers correctly", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "sequential",
        zeropadded: true,
        width: 4,
      });

      // Create some ADR files
      fs.writeFileSync(path.join(tempDir, "0001-test.md"), "# Test");
      fs.writeFileSync(path.join(tempDir, "0002-test.md"), "# Test");
      fs.writeFileSync(path.join(tempDir, "0003-test.md"), "# Test");

      const next = discovery.findNextNumber();
      expect(next).toBe("0004");
    });

    test("should handle non-zero-padded numbers", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "sequential",
        zeropadded: false,
      });

      const next = discovery.findNextNumber();
      expect(next).toBe("1");
    });

    test("should respect custom width for padding", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "sequential",
        zeropadded: true,
        width: 6,
      });

      fs.writeFileSync(path.join(tempDir, "000001-test.md"), "# Test");

      const next = discovery.findNextNumber();
      expect(next).toBe("000002");
    });

    test("should find next number with gaps in sequence", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "sequential",
        zeropadded: true,
        width: 4,
      });

      fs.writeFileSync(path.join(tempDir, "0001-test.md"), "# Test");
      fs.writeFileSync(path.join(tempDir, "0005-test.md"), "# Test"); // Gap

      const next = discovery.findNextNumber();
      expect(next).toBe("0006");
    });
  });

  describe("Date-Based Numbering", () => {
    test("should return today's date for empty directory", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "date-based",
      });

      const next = discovery.findNextNumber();
      expect(next).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test("should add counter suffix for multiple ADRs on same day", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "date-based",
      });

      const today = discovery.getDateString();
      fs.writeFileSync(path.join(tempDir, `${today}-test.md`), "# Test");

      const next = discovery.findNextNumber();
      expect(next).toBe(`${today}-1`);
    });

    test("should increment counter for multiple ADRs same day", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "date-based",
      });

      const today = discovery.getDateString();
      fs.writeFileSync(path.join(tempDir, `${today}-1.md`), "# Test");
      fs.writeFileSync(path.join(tempDir, `${today}-2.md`), "# Test");

      const next = discovery.findNextNumber();
      expect(next).toBe(`${today}-3`);
    });

    test("should handle ADRs from different dates", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "date-based",
      });

      fs.writeFileSync(path.join(tempDir, "2026-08-17-test.md"), "# Test");
      fs.writeFileSync(path.join(tempDir, "2026-08-17-test-2.md"), "# Test");

      const next = discovery.findNextNumber();
      // Should return today's date if no today's ADRs, or with counter if exists
      expect(next).toMatch(/^\d{4}-\d{2}-\d{2}(-\d+)?$/);
    });
  });

  describe("Title to Slug Conversion", () => {
    test("should convert simple title to slug", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("Use TypeScript for Type Safety");
      expect(slug).toBe("use-typescript-for-type-safety");
    });

    test("should handle multiple spaces", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("Use    Multiple    Spaces");
      expect(slug).toBe("use-multiple-spaces");
    });

    test("should remove special characters", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("API v2 → v3: Migration!");
      expect(slug).toBe("api-v2-v3-migration");
    });

    test("should handle leading and trailing spaces", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("  Adopt Docker  ");
      expect(slug).toBe("adopt-docker");
    });

    test("should convert uppercase to lowercase", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("IMPLEMENT HTTPS EVERYWHERE");
      expect(slug).toBe("implement-https-everywhere");
    });

    test("should handle hyphens correctly", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("Database---Migration--Plan");
      expect(slug).toBe("database-migration-plan");
    });

    test("should handle titles with only special characters", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("!@#$%^&*()");
      expect(slug).toBe("");
    });
  });

  describe("Generate Filename", () => {
    test("should generate correct filename format", () => {
      const discovery = new ADRDiscovery(tempDir);

      const filename = discovery.generateFilename(
        "0001",
        "Use TypeScript for Type Safety",
      );
      expect(filename).toBe("0001-use-typescript-for-type-safety.md");
    });

    test("should handle date-based numbers in filename", () => {
      const discovery = new ADRDiscovery(tempDir);

      const filename = discovery.generateFilename(
        "2026-08-18",
        "Adopt Docker for Deployment",
      );
      expect(filename).toBe("2026-08-18-adopt-docker-for-deployment.md");
    });

    test("should handle complex titles in filenames", () => {
      const discovery = new ADRDiscovery(tempDir);

      const filename = discovery.generateFilename(
        "0005",
        "API v2 → v3: Complete Migration Plan!",
      );
      expect(filename).toBe("0005-api-v2-v3-complete-migration-plan.md");
    });
  });

  describe("Get Next ADR Info", () => {
    test("should return complete ADR info", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "sequential",
        zeropadded: true,
        width: 4,
      });

      const info = discovery.getNextAdrInfo("Use Docker for Deployment");

      expect(info).toMatchObject({
        number: "0001",
        filename: "0001-use-docker-for-deployment.md",
        filepath: path.join(tempDir, "0001-use-docker-for-deployment.md"),
        slug: "use-docker-for-deployment",
      });
    });

    test("should increment number in getNextAdrInfo", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "sequential",
        zeropadded: true,
        width: 4,
      });

      fs.writeFileSync(path.join(tempDir, "0001-test.md"), "# Test");

      const info = discovery.getNextAdrInfo("Adopt TypeScript");

      expect(info.number).toBe("0002");
      expect(info.filename).toBe("0002-adopt-typescript.md");
    });
  });

  describe("Collision Detection", () => {
    test("should detect existing ADR files", () => {
      const discovery = new ADRDiscovery(tempDir);

      const filename = "0001-use-docker.md";
      fs.writeFileSync(path.join(tempDir, filename), "# Test");

      expect(discovery.adrExists(filename)).toBe(true);
    });

    test("should return false for non-existent files", () => {
      const discovery = new ADRDiscovery(tempDir);

      expect(discovery.adrExists("0001-non-existent.md")).toBe(false);
    });
  });

  describe("Get Existing ADRs", () => {
    test("should return empty array for empty directory", () => {
      const discovery = new ADRDiscovery(tempDir);

      const existing = discovery.getExistingAdrs();
      expect(existing).toEqual([]);
    });

    test("should list existing ADR files in sorted order", () => {
      const discovery = new ADRDiscovery(tempDir);

      fs.writeFileSync(path.join(tempDir, "0003-test.md"), "# Test");
      fs.writeFileSync(path.join(tempDir, "0001-test.md"), "# Test");
      fs.writeFileSync(path.join(tempDir, "0002-test.md"), "# Test");

      const existing = discovery.getExistingAdrs();
      expect(existing).toEqual([
        "0001-test.md",
        "0002-test.md",
        "0003-test.md",
      ]);
    });

    test("should filter out non-ADR files", () => {
      const discovery = new ADRDiscovery(tempDir);

      fs.writeFileSync(path.join(tempDir, "0001-test.md"), "# Test");
      fs.writeFileSync(path.join(tempDir, "README.md"), "# Readme");
      fs.writeFileSync(path.join(tempDir, "INDEX.md"), "# Index");

      const existing = discovery.getExistingAdrs();
      expect(existing).toEqual(["0001-test.md"]);
    });

    test("should handle date-based ADR files", () => {
      const discovery = new ADRDiscovery(tempDir, {
        style: "date-based",
      });

      fs.writeFileSync(path.join(tempDir, "2026-08-18-test.md"), "# Test");
      fs.writeFileSync(path.join(tempDir, "2026-08-17-test.md"), "# Test");

      const existing = discovery.getExistingAdrs();
      expect(existing.length).toBe(2);
    });
  });

  describe("Edge Cases", () => {
    test("should handle non-existent directory gracefully", () => {
      const discovery = new ADRDiscovery("/path/that/does/not/exist");

      const existing = discovery.getExistingAdrs();
      expect(existing).toEqual([]);
    });

    test("should handle directory with special characters", () => {
      const specialDir = path.join(tempDir, "adr-dir with spaces & special!");
      fs.mkdirSync(specialDir);

      const discovery = new ADRDiscovery(specialDir);

      expect(discovery.findNextNumber()).toBe("0001");
    });

    test("should handle very long titles", () => {
      const discovery = new ADRDiscovery(tempDir);

      const longTitle =
        "Use TypeScript with strict null checks and complete type safety across all microservices";
      const slug = discovery.titleToSlug(longTitle);

      expect(slug.length).toBeGreaterThan(0);
      expect(slug).not.toMatch(/[^a-z0-9-]/);
    });

    test("should handle titles with numbers", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("Use Node.js 18+ for compatibility");
      expect(slug).toContain("nodejs");
    });

    test("should handle empty title", () => {
      const discovery = new ADRDiscovery(tempDir);

      const slug = discovery.titleToSlug("");
      expect(slug).toBe("");
    });
  });

  describe("Date String Generation", () => {
    test("should return properly formatted date string", () => {
      const discovery = new ADRDiscovery(tempDir);

      const dateStr = discovery.getDateString();
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test("should use current date", () => {
      const discovery = new ADRDiscovery(tempDir);

      const dateStr = discovery.getDateString();
      const today = new Date();

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      expect(dateStr).toBe(`${year}-${month}-${day}`);
    });
  });
});
