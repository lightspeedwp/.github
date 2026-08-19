const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  validateDesignMd,
  isDesignMdCliRepo,
  findDesignMdCliCmd,
} = require("../validateDesignMd.js");

describe("validateDesignMd", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "validate-design-md-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe("isDesignMdCliRepo", () => {
    it("should return false for non-existent directory", () => {
      const result = isDesignMdCliRepo("/nonexistent/path");
      expect(result).toBe(false);
    });

    it("should return false if package.json is missing", () => {
      const testDir = path.join(tempDir, "test-repo");
      fs.mkdirSync(testDir, { recursive: true });
      fs.mkdirSync(path.join(testDir, "src"));
      fs.writeFileSync(path.join(testDir, "src/index.ts"), "");

      const result = isDesignMdCliRepo(testDir);
      expect(result).toBe(false);
    });

    it("should return false if src/index.ts is missing", () => {
      const testDir = path.join(tempDir, "test-repo");
      fs.mkdirSync(testDir, { recursive: true });
      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify({ name: "@google/design.md" }),
      );

      const result = isDesignMdCliRepo(testDir);
      expect(result).toBe(false);
    });

    it("should return false if package name does not match", () => {
      const testDir = path.join(tempDir, "test-repo");
      fs.mkdirSync(testDir, { recursive: true });
      fs.mkdirSync(path.join(testDir, "src"));
      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify({ name: "@other/package" }),
      );
      fs.writeFileSync(path.join(testDir, "src/index.ts"), "");

      const result = isDesignMdCliRepo(testDir);
      expect(result).toBe(false);
    });

    it("should return true for valid design.md repo", () => {
      const testDir = path.join(tempDir, "test-repo");
      fs.mkdirSync(testDir, { recursive: true });
      fs.mkdirSync(path.join(testDir, "src"));
      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify({ name: "@google/design.md" }),
      );
      fs.writeFileSync(path.join(testDir, "src/index.ts"), "");

      const result = isDesignMdCliRepo(testDir);
      expect(result).toBe(true);
    });
  });

  describe("validateDesignMd", () => {
    it("should throw error if DESIGN.md does not exist", () => {
      const nonexistentPath = path.join(tempDir, "DESIGN.md");
      expect(() => validateDesignMd(nonexistentPath)).toThrow("not found");
    });

    it("should generate report for valid DESIGN.md", () => {
      const designMdPath = path.join(tempDir, "DESIGN.md");
      const reportPath = path.join(tempDir, "report.md");

      const validDesignMd = `---
title: Design System
---

## Overview
Basic overview section

## Colors
Color definitions

## Typography
Typography rules

## Layout & Spacing
Spacing rules

## Elevation & Depth
Depth rules

## Shapes
Shape definitions

## Components
Component library

## Do's and Don'ts
Best practices
`;

      fs.writeFileSync(designMdPath, validDesignMd);

      const result = validateDesignMd(designMdPath, reportPath);

      expect(result).toHaveProperty("report");
      expect(result.report).toContain("# DESIGN.md Validation Report");
      expect(result.report).toContain("## Summary");
      expect(result.report).toContain("## Manual checks");
      expect(fs.existsSync(reportPath)).toBe(true);

      const reportContent = fs.readFileSync(reportPath, "utf8");
      expect(reportContent).toContain("# DESIGN.md Validation Report");
      expect(reportContent).toContain("- File name is DESIGN.md: yes");
    });

    it("should detect missing frontmatter", () => {
      const designMdPath = path.join(tempDir, "DESIGN.md");
      const reportPath = path.join(tempDir, "report.md");

      const invalidDesignMd = `# No frontmatter

## Overview
Section without frontmatter
`;

      fs.writeFileSync(designMdPath, invalidDesignMd);
      const result = validateDesignMd(designMdPath, reportPath);

      expect(result.report).toContain("- Front matter delimiter present: no");
    });

    it("should detect missing required headings", () => {
      const designMdPath = path.join(tempDir, "DESIGN.md");
      const reportPath = path.join(tempDir, "report.md");

      const designMd = `---
title: Incomplete Design System
---

## Overview
Only has overview section
`;

      fs.writeFileSync(designMdPath, designMd);
      const result = validateDesignMd(designMdPath, reportPath);

      expect(result.report).toContain("- Heading missing: Colors");
      expect(result.report).toContain("- Heading missing: Typography");
    });

    it("should not require report path", () => {
      const designMdPath = path.join(tempDir, "DESIGN.md");

      const designMd = `---
title: Design System
---

## Overview
Overview section

## Colors
Colors

## Typography
Typography

## Layout & Spacing
Spacing

## Elevation & Depth
Elevation

## Shapes
Shapes

## Components
Components

## Do's and Don'ts
Guidelines
`;

      fs.writeFileSync(designMdPath, designMd);
      const result = validateDesignMd(designMdPath);

      expect(result).toHaveProperty("report");
      expect(result.report).toBeTruthy();
    });

    it("should accept alternative heading variants", () => {
      const designMdPath = path.join(tempDir, "DESIGN.md");
      const reportPath = path.join(tempDir, "report.md");

      const designMd = `---
title: Design System
---

## Brand & Style
Brand definitions instead of Overview

## Colors
Colors

## Typography
Typography

## Layout
Layout instead of Layout & Spacing

## Elevation
Elevation instead of Elevation & Depth

## Shapes
Shapes

## Components
Components

## Do's and Don'ts
Guidelines
`;

      fs.writeFileSync(designMdPath, designMd);
      const result = validateDesignMd(designMdPath, reportPath);

      expect(result.report).toContain(
        "- Heading present: Overview or Brand & Style",
      );
      expect(result.report).toContain(
        "- Heading present: Layout or Layout & Spacing",
      );
      expect(result.report).toContain(
        "- Heading present: Elevation & Depth or Elevation",
      );
    });

    it("should create report directory if it does not exist", () => {
      const designMdPath = path.join(tempDir, "DESIGN.md");
      const reportPath = path.join(tempDir, "reports", "subdir", "report.md");

      const designMd = `---
title: Design System
---

## Overview
Overview
`;

      fs.writeFileSync(designMdPath, designMd);
      validateDesignMd(designMdPath, reportPath);

      expect(fs.existsSync(reportPath)).toBe(true);
    });

    it("should detect incorrect filename", () => {
      const designMdPath = path.join(tempDir, "design.md");
      const reportPath = path.join(tempDir, "report.md");

      const designMd = `---
title: Design System
---

## Overview
Overview
`;

      fs.writeFileSync(designMdPath, designMd);
      const result = validateDesignMd(designMdPath, reportPath);

      expect(result.report).toContain("- File name is DESIGN.md: no");
    });
  });

  describe("findDesignMdCliCmd", () => {
    it("should return cmd and source in result object", () => {
      const result = findDesignMdCliCmd(null);
      expect(result).toHaveProperty("cmd");
      expect(result).toHaveProperty("source");
    });

    it("should prefer env variable if set", () => {
      const originalEnv = process.env.DESIGNMD_CLI_CMD;
      process.env.DESIGNMD_CLI_CMD = "custom-cmd";

      const result = findDesignMdCliCmd(null);
      expect(result.cmd).toBe("custom-cmd");

      process.env.DESIGNMD_CLI_CMD = originalEnv;
    });
  });
});
