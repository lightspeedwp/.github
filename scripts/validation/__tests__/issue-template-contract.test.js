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
});
