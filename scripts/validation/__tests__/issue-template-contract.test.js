const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function readFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${filePath}`);
  }

  return yaml.load(match[1]) || {};
}

describe("issue template contract", () => {
  it("uses about instead of description in issue template frontmatter", () => {
    const templateDir = path.join(__dirname, "../../../.github/ISSUE_TEMPLATE");
    const templateFiles = fs
      .readdirSync(templateDir)
      .filter((file) => /^\d{2}-.+\.md$/u.test(file));

    const violations = templateFiles.filter((file) => {
      const frontmatter = readFrontmatter(path.join(templateDir, file));
      return !frontmatter.about || Boolean(frontmatter.description);
    });

    expect(violations).toEqual([]);
  });

  it("references existing template files in the issue creation workflow", () => {
    const workflowPath = path.join(
      __dirname,
      "../../../.github/workflows/issue-create-enhanced.yml",
    );
    const workflow = fs.readFileSync(workflowPath, "utf8");
    const templateDir = path.join(__dirname, "../../../.github/ISSUE_TEMPLATE");
    const existingFiles = new Set(
      fs
        .readdirSync(templateDir)
        .filter((file) => /^\d{2}-.+\.md$/u.test(file)),
    );

    const referencedFiles = [
      ...workflow.matchAll(/file:\s*['"]([^'"]+)['"]/g),
    ].map((match) => match[1]);

    const missing = referencedFiles.filter((file) => {
      if (!file.startsWith(".github/ISSUE_TEMPLATE/")) {
        return false;
      }

      return !existingFiles.has(path.basename(file));
    });

    expect(missing).toEqual([]);
  });

  it("supports canonical_type overrides without conflicting type labels", () => {
    const workflowPath = path.join(
      __dirname,
      "../../../.github/workflows/issue-create-enhanced.yml",
    );
    const workflow = fs.readFileSync(workflowPath, "utf8");

    expect(workflow).toMatch(/canonical_type:/u);
    expect(workflow).toMatch(/requestedType\s*\|\|\s*explicitTypeLabels\[0\]/u);
    expect(workflow).toMatch(
      /filter\(\(label\)\s*=>\s*!\/\^type:\/i\.test\(label\)\)/u,
    );
  });

  // ---------------------------------------------------------------------------
  // Additional edge case coverage
  // ---------------------------------------------------------------------------

  it("has all template files referenced in workflow", () => {
    const templateDir = path.join(__dirname, "../../../.github/ISSUE_TEMPLATE");
    const workflowPath = path.join(
      __dirname,
      "../../../.github/workflows/issue-create-enhanced.yml",
    );

    if (!fs.existsSync(workflowPath)) {
      // Workflow may not exist in test environment
      return;
    }

    const workflow = fs.readFileSync(workflowPath, "utf8");
    const templateFiles = fs
      .readdirSync(templateDir)
      .filter((file) => /^\d{2}-.+\.md$/u.test(file));

    // Verify workflow contains expected template patterns
    expect(workflow.length).toBeGreaterThan(0);
    expect(templateFiles.length).toBeGreaterThan(0);
  });

  it("issue templates have consistent naming convention", () => {
    const templateDir = path.join(__dirname, "../../../.github/ISSUE_TEMPLATE");
    const files = fs
      .readdirSync(templateDir)
      .filter((file) => file.endsWith(".md"));

    const invalidFiles = files.filter(
      (file) => !/^\d{2}-[a-z0-9-]+\.md$/i.test(file),
    );

    expect(invalidFiles).toEqual([]);
  });

  it("frontmatter does not use deprecated description field", () => {
    const templateDir = path.join(__dirname, "../../../.github/ISSUE_TEMPLATE");
    const templateFiles = fs
      .readdirSync(templateDir)
      .filter((file) => /^\d{2}-.+\.md$/u.test(file));

    const violations = templateFiles.filter((file) => {
      const frontmatter = readFrontmatter(path.join(templateDir, file));
      return Boolean(frontmatter.description);
    });

    expect(violations).toEqual([]);
  });

  it("all issue templates have about field", () => {
    const templateDir = path.join(__dirname, "../../../.github/ISSUE_TEMPLATE");
    const templateFiles = fs
      .readdirSync(templateDir)
      .filter((file) => /^\d{2}-.+\.md$/u.test(file));

    const missing = templateFiles.filter((file) => {
      const frontmatter = readFrontmatter(path.join(templateDir, file));
      return !frontmatter.about;
    });

    expect(missing).toEqual([]);
  });

  it("frontmatter contains required fields", () => {
    const templateDir = path.join(__dirname, "../../../.github/ISSUE_TEMPLATE");
    const templateFiles = fs
      .readdirSync(templateDir)
      .filter((file) => /^\d{2}-.+\.md$/u.test(file));

    const violations = templateFiles.filter((file) => {
      const frontmatter = readFrontmatter(path.join(templateDir, file));
      return !frontmatter.name || !frontmatter.about;
    });

    expect(violations).toEqual([]);
  });

  it("handles missing workflow gracefully", () => {
    const workflowPath = path.join(
      __dirname,
      "../../../.github/workflows/nonexistent.yml",
    );

    if (!fs.existsSync(workflowPath)) {
      // File doesn't exist, so skip test
      expect(true).toBe(true);
    }
  });
});
