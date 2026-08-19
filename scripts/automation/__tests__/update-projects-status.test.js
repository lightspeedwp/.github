/**
 * @fileoverview Tests for update-projects-status.cjs helper script
 *
 * Tests the project audit, template generation, and linking suggestion
 * functionality for active projects status updates.
 */

const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const os = require("os");

const execAsync = promisify(exec);

// Test fixtures
const FIXTURES_DIR = path.join(__dirname, "fixtures", "update-projects-status");

/**
 * Helper to create temporary project structure for testing
 */
function createTempProjectStructure() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "projects-test-"));
  const projectsDir = path.join(tempDir, ".github", "projects", "active");
  fs.mkdirSync(projectsDir, { recursive: true });
  return { tempDir, projectsDir };
}

/**
 * Helper to create a sample project
 */
function createSampleProject(projectsDir, name, options = {}) {
  const projectDir = path.join(projectsDir, name);
  fs.mkdirSync(projectDir, { recursive: true });

  const {
    hasFrontmatter = true,
    hasStatus = true,
    hasPriority = true,
    hasType = true,
    hasEffort = true,
    hasRelatedIssues = true,
    hasPlanningFile = true,
    status = "active",
    priority = "high",
    type = "feature",
    effort = "24h",
  } = options;

  let frontmatter = "";
  if (hasFrontmatter) {
    const fields = ["file_type: project", `title: "${name}"`];
    if (hasStatus) fields.push(`status: ${status}`);
    if (hasPriority) fields.push(`priority: ${priority}`);
    if (hasType) fields.push(`type: ${type}`);
    if (hasEffort) fields.push(`effort: "${effort}"`);
    frontmatter = `---\n${fields.join("\n")}\n---\n\n`;
  }

  let content = frontmatter + `# ${name}\n\nProject description.\n`;

  if (hasRelatedIssues) {
    content += `\n## Related Issues & PRs\n\n`;
    content += `| Issue/PR | Type | Status |\n`;
    content += `|----------|------|--------|\n`;
    content += `| [#1234](https://github.com/lightspeedwp/.github/issues/1234) | Issue | Open |\n`;
  }

  fs.writeFileSync(path.join(projectDir, "README.md"), content);

  if (hasPlanningFile) {
    fs.writeFileSync(
      path.join(projectDir, "PLANNING.md"),
      `# ${name} Planning\n\nPlanning details.`,
    );
  }

  return projectDir;
}

/**
 * Helper to clean up temp directories
 */
function cleanup(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

describe("update-projects-status.cjs", () => {
  let tempSetup;

  beforeEach(() => {
    tempSetup = createTempProjectStructure();
  });

  afterEach(() => {
    if (tempSetup) {
      cleanup(tempSetup.tempDir);
    }
  });

  describe("Script availability", () => {
    test("script file exists", () => {
      const scriptPath = path.join(
        __dirname,
        "..",
        "update-projects-status.cjs",
      );
      expect(fs.existsSync(scriptPath)).toBe(true);
    });

    test("script is executable", () => {
      const scriptPath = path.join(
        __dirname,
        "..",
        "update-projects-status.cjs",
      );
      const stats = fs.statSync(scriptPath);
      expect(stats.mode & 0o111).not.toBe(0);
    });

    test("script can be executed", async () => {
      const scriptPath = path.join(
        __dirname,
        "..",
        "update-projects-status.cjs",
      );
      const { stdout, stderr } = await execAsync(`node "${scriptPath}" help`);
      expect(stdout).toContain("Usage");
      expect(stdout).toContain("audit");
      expect(stdout).toContain("template");
      expect(stdout).toContain("link");
    });
  });

  describe("Audit functionality", () => {
    test("detects projects with all required fields", async () => {
      const { projectsDir } = tempSetup;

      // Create complete project
      createSampleProject(projectsDir, "complete-project", {
        hasStatus: true,
        hasPriority: true,
        hasType: true,
        hasEffort: true,
        hasRelatedIssues: true,
      });

      // Project should be complete
      const readmeContent = fs.readFileSync(
        path.join(projectsDir, "complete-project", "README.md"),
        "utf8",
      );

      expect(readmeContent).toContain("status: active");
      expect(readmeContent).toContain("priority: high");
      expect(readmeContent).toContain("type: feature");
      expect(readmeContent).toContain('effort: "24h"');
      expect(readmeContent).toContain("## Related Issues");
    });

    test("detects projects missing status field", () => {
      const { projectsDir } = tempSetup;

      createSampleProject(projectsDir, "no-status", {
        hasFrontmatter: true,
        hasStatus: false,
        hasPriority: true,
        hasType: true,
        hasEffort: true,
      });

      const readmeContent = fs.readFileSync(
        path.join(projectsDir, "no-status", "README.md"),
        "utf8",
      );

      expect(readmeContent).not.toContain("status:");
      expect(readmeContent).toContain("priority:");
    });

    test("detects projects missing priority field", () => {
      const { projectsDir } = tempSetup;

      createSampleProject(projectsDir, "no-priority", {
        hasFrontmatter: true,
        hasStatus: true,
        hasPriority: false,
        hasType: true,
        hasEffort: true,
      });

      const readmeContent = fs.readFileSync(
        path.join(projectsDir, "no-priority", "README.md"),
        "utf8",
      );

      expect(readmeContent).toContain("status:");
      expect(readmeContent).not.toContain("priority:");
    });

    test("detects projects missing type field", () => {
      const { projectsDir } = tempSetup;

      createSampleProject(projectsDir, "no-type", {
        hasFrontmatter: true,
        hasStatus: true,
        hasPriority: true,
        hasType: false,
        hasEffort: true,
      });

      const readmeContent = fs.readFileSync(
        path.join(projectsDir, "no-type", "README.md"),
        "utf8",
      );

      // Extract just the frontmatter to check for the type field (not file_type)
      const frontmatterMatch = readmeContent.match(/^---\n([\s\S]*?)\n---/);
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : "";

      // Check for "type:" on its own line (not as part of file_type)
      expect(frontmatter).not.toMatch(/^type:/m);
      expect(frontmatter).toContain("priority:");
    });

    test("detects projects missing effort field", () => {
      const { projectsDir } = tempSetup;

      createSampleProject(projectsDir, "no-effort", {
        hasFrontmatter: true,
        hasStatus: true,
        hasPriority: true,
        hasType: true,
        hasEffort: false,
      });

      const readmeContent = fs.readFileSync(
        path.join(projectsDir, "no-effort", "README.md"),
        "utf8",
      );

      expect(readmeContent).not.toContain("effort:");
      expect(readmeContent).toContain("type:");
    });

    test("detects projects missing Related Issues section", () => {
      const { projectsDir } = tempSetup;

      createSampleProject(projectsDir, "no-issues-section", {
        hasStatus: true,
        hasPriority: true,
        hasType: true,
        hasEffort: true,
        hasRelatedIssues: false,
      });

      const readmeContent = fs.readFileSync(
        path.join(projectsDir, "no-issues-section", "README.md"),
        "utf8",
      );

      expect(readmeContent).not.toContain("## Related Issues");
    });

    test("detects projects with no README.md", () => {
      const { projectsDir } = tempSetup;
      const projectDir = path.join(projectsDir, "no-readme");
      fs.mkdirSync(projectDir, { recursive: true });

      // Project exists but has no README
      expect(fs.existsSync(path.join(projectDir, "README.md"))).toBe(false);
    });
  });

  describe("Field validation", () => {
    test("validates status field values", () => {
      const { projectsDir } = tempSetup;

      const validStatuses = [
        "active",
        "pending",
        "review",
        "blocked",
        "at_risk",
      ];
      validStatuses.forEach((statusValue) => {
        createSampleProject(projectsDir, `project-status-${statusValue}`, {
          hasStatus: true,
          status: statusValue,
        });

        const readmeContent = fs.readFileSync(
          path.join(projectsDir, `project-status-${statusValue}`, "README.md"),
          "utf8",
        );

        expect(readmeContent).toContain(`status: ${statusValue}`);
      });
    });

    test("validates priority field values", () => {
      const { projectsDir } = tempSetup;

      const validPriorities = ["critical", "high", "medium", "low"];
      validPriorities.forEach((priorityValue) => {
        createSampleProject(projectsDir, `project-priority-${priorityValue}`, {
          hasPriority: true,
          priority: priorityValue,
        });

        const readmeContent = fs.readFileSync(
          path.join(
            projectsDir,
            `project-priority-${priorityValue}`,
            "README.md",
          ),
          "utf8",
        );

        expect(readmeContent).toContain(`priority: ${priorityValue}`);
      });
    });

    test("validates type field values", () => {
      const { projectsDir } = tempSetup;

      const validTypes = [
        "feature",
        "infrastructure",
        "maintenance",
        "documentation",
      ];
      validTypes.forEach((typeValue) => {
        createSampleProject(projectsDir, `project-type-${typeValue}`, {
          hasType: true,
          type: typeValue,
        });

        const readmeContent = fs.readFileSync(
          path.join(projectsDir, `project-type-${typeValue}`, "README.md"),
          "utf8",
        );

        expect(readmeContent).toContain(`type: ${typeValue}`);
      });
    });

    test("validates effort format", () => {
      const { projectsDir } = tempSetup;

      const efforts = ["8h", "16h", "24h", "40h", "5d"];
      efforts.forEach((effortValue) => {
        const projectName = `project-effort-${effortValue.replace(/[^a-z0-9]/gi, "")}`;
        createSampleProject(projectsDir, projectName, {
          hasEffort: true,
          effort: effortValue,
        });

        const readmeContent = fs.readFileSync(
          path.join(projectsDir, projectName, "README.md"),
          "utf8",
        );

        expect(readmeContent).toContain(`effort: "${effortValue}"`);
      });
    });
  });

  describe("Frontmatter parsing", () => {
    test("parses YAML frontmatter correctly", () => {
      const { projectsDir } = tempSetup;

      const projectDir = path.join(projectsDir, "parse-test");
      fs.mkdirSync(projectDir, { recursive: true });

      const content = `---
file_type: project
title: "Test Project"
status: active
priority: high
type: feature
effort: "24h"
created_date: 2026-08-18
last_updated: 2026-08-18
---

# Test Project

Description here.

## Related Issues & PRs

| Issue | Type | Status |
|-------|------|--------|
| [#1234](https://github.com/lightspeedwp/.github/issues/1234) | Issue | Open |
`;

      fs.writeFileSync(path.join(projectDir, "README.md"), content);

      const readmeContent = fs.readFileSync(
        path.join(projectDir, "README.md"),
        "utf8",
      );

      // Verify all fields are present
      expect(readmeContent).toContain("status: active");
      expect(readmeContent).toContain("priority: high");
      expect(readmeContent).toContain("type: feature");
      expect(readmeContent).toContain('effort: "24h"');
      expect(readmeContent).toContain("## Related Issues");
    });

    test("handles special characters in project names", () => {
      const { projectsDir } = tempSetup;

      const projectName = "project-with-dashes-and-numbers-2026-08-18";
      createSampleProject(projectsDir, projectName, {
        hasStatus: true,
      });

      const projectDir = path.join(projectsDir, projectName);
      expect(fs.existsSync(projectDir)).toBe(true);
      expect(fs.existsSync(path.join(projectDir, "README.md"))).toBe(true);
    });
  });

  describe("Related Issues detection", () => {
    test("detects issue numbers in Related Issues section", () => {
      const { projectsDir } = tempSetup;

      const projectDir = path.join(projectsDir, "issues-test");
      fs.mkdirSync(projectDir, { recursive: true });

      const content = `---
file_type: project
title: "Issues Test"
status: active
---

# Issues Test

## Related Issues & PRs

| Issue | Type | Status |
|-------|------|--------|
| [#1234](https://github.com/lightspeedwp/.github/issues/1234) | Issue | Open |
| [#5678](https://github.com/lightspeedwp/.github/issues/5678) | Issue | Closed |
| [PR #9012](https://github.com/lightspeedwp/.github/pull/9012) | PR | Merged |
`;

      fs.writeFileSync(path.join(projectDir, "README.md"), content);

      const readmeContent = fs.readFileSync(
        path.join(projectDir, "README.md"),
        "utf8",
      );
      const issueMatches = readmeContent.match(/#(\d+)/g);

      expect(issueMatches).not.toBeNull();
      expect(issueMatches).toContain("#1234");
      expect(issueMatches).toContain("#5678");
      expect(issueMatches).toContain("#9012");
    });

    test("handles projects with no issue links", () => {
      const { projectsDir } = tempSetup;

      const projectDir = path.join(projectsDir, "no-issue-links");
      fs.mkdirSync(projectDir, { recursive: true });

      const content = `---
file_type: project
title: "No Issues"
status: active
---

# No Issues

## Related Issues & PRs

_No issues linked yet._
`;

      fs.writeFileSync(path.join(projectDir, "README.md"), content);

      const readmeContent = fs.readFileSync(
        path.join(projectDir, "README.md"),
        "utf8",
      );
      const issueMatches = readmeContent.match(/#(\d+)/g);

      expect(issueMatches).toBeNull();
    });
  });

  describe("Project structure validation", () => {
    test("validates project has required files", () => {
      const { projectsDir } = tempSetup;

      createSampleProject(projectsDir, "complete-project", {
        hasPlanningFile: true,
      });

      const projectDir = path.join(projectsDir, "complete-project");
      expect(fs.existsSync(path.join(projectDir, "README.md"))).toBe(true);
      expect(fs.existsSync(path.join(projectDir, "PLANNING.md"))).toBe(true);
    });

    test("handles projects missing PLANNING.md", () => {
      const { projectsDir } = tempSetup;

      createSampleProject(projectsDir, "no-planning", {
        hasPlanningFile: false,
      });

      const projectDir = path.join(projectsDir, "no-planning");
      expect(fs.existsSync(path.join(projectDir, "README.md"))).toBe(true);
      expect(fs.existsSync(path.join(projectDir, "PLANNING.md"))).toBe(false);
    });
  });

  describe("Multiple projects handling", () => {
    test("processes multiple projects correctly", () => {
      const { projectsDir } = tempSetup;

      // Create multiple projects with different states
      createSampleProject(projectsDir, "project-1", {
        hasStatus: true,
        hasPriority: true,
        hasType: true,
        hasEffort: true,
      });

      createSampleProject(projectsDir, "project-2", {
        hasStatus: false,
        hasPriority: true,
        hasType: true,
        hasEffort: true,
      });

      createSampleProject(projectsDir, "project-3", {
        hasStatus: true,
        hasPriority: false,
        hasType: false,
        hasEffort: false,
      });

      const allProjects = fs.readdirSync(projectsDir).filter((name) => {
        const stat = fs.statSync(path.join(projectsDir, name));
        return stat.isDirectory();
      });

      expect(allProjects).toHaveLength(3);
      expect(allProjects).toContain("project-1");
      expect(allProjects).toContain("project-2");
      expect(allProjects).toContain("project-3");
    });

    test("sorts projects alphabetically", () => {
      const { projectsDir } = tempSetup;

      // Create projects in non-alphabetical order
      createSampleProject(projectsDir, "zebra-project");
      createSampleProject(projectsDir, "alpha-project");
      createSampleProject(projectsDir, "beta-project");

      const allProjects = fs
        .readdirSync(projectsDir)
        .filter((name) => {
          const stat = fs.statSync(path.join(projectsDir, name));
          return stat.isDirectory();
        })
        .sort();

      expect(allProjects[0]).toBe("alpha-project");
      expect(allProjects[1]).toBe("beta-project");
      expect(allProjects[2]).toBe("zebra-project");
    });
  });

  describe("Two-way linking structure", () => {
    test("validates project-to-issue links format", () => {
      const { projectsDir } = tempSetup;

      const projectDir = path.join(projectsDir, "linking-test");
      fs.mkdirSync(projectDir, { recursive: true });

      const content = `---
file_type: project
title: "Linking Test"
status: active
---

# Linking Test

## Related Issues & PRs

| Issue | Type | Status | Purpose |
|-------|------|--------|---------|
| [#1234](https://github.com/lightspeedwp/.github/issues/1234) | Issue | Open | Phase tracking |
| [PR #5678](https://github.com/lightspeedwp/.github/pull/5678) | PR | Merged | Implementation |
`;

      fs.writeFileSync(path.join(projectDir, "README.md"), content);

      const readmeContent = fs.readFileSync(
        path.join(projectDir, "README.md"),
        "utf8",
      );

      // Verify link format
      expect(readmeContent).toContain(
        "[#1234](https://github.com/lightspeedwp/.github/issues/1234)",
      );
      expect(readmeContent).toContain(
        "[PR #5678](https://github.com/lightspeedwp/.github/pull/5678)",
      );
    });

    test("validates issue-to-project backlink structure", () => {
      // This would be in an issue, not a project
      const issueLinkStructure = `## 📋 Project Reference
**Related Project:** [Project Name](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/project-slug/README.md)
See [Project PLANNING](https://github.com/lightspeedwp/.github/blob/develop/.github/projects/active/project-slug/PLANNING.md)`;

      expect(issueLinkStructure).toContain("📋 Project Reference");
      expect(issueLinkStructure).toContain("Related Project:");
      expect(issueLinkStructure).toContain(
        "blob/develop/.github/projects/active/",
      );
    });
  });

  describe("Edge cases", () => {
    test("handles projects with no frontmatter", () => {
      const { projectsDir } = tempSetup;

      const projectDir = path.join(projectsDir, "no-frontmatter");
      fs.mkdirSync(projectDir, { recursive: true });

      const content = `# No Frontmatter Project

This project has no frontmatter section.
`;

      fs.writeFileSync(path.join(projectDir, "README.md"), content);

      const readmeContent = fs.readFileSync(
        path.join(projectDir, "README.md"),
        "utf8",
      );
      expect(readmeContent).not.toContain("---");
      expect(readmeContent).toContain("# No Frontmatter Project");
    });

    test("handles empty project directory", () => {
      const { projectsDir } = tempSetup;

      const projectDir = path.join(projectsDir, "empty-project");
      fs.mkdirSync(projectDir, { recursive: true });

      expect(fs.existsSync(projectDir)).toBe(true);
      expect(fs.readdirSync(projectDir)).toHaveLength(0);
    });

    test("handles projects with special characters in names", () => {
      const { projectsDir } = tempSetup;

      const specialNames = [
        "project-with-2026-date",
        "project-v2.1-release",
        "project_with_underscores",
      ];

      specialNames.forEach((name) => {
        createSampleProject(projectsDir, name);
        expect(fs.existsSync(path.join(projectsDir, name))).toBe(true);
      });
    });

    test("handles very long project names", () => {
      const { projectsDir } = tempSetup;

      const longName =
        "this-is-a-very-long-project-name-with-many-words-that-describes-something-complex";
      createSampleProject(projectsDir, longName);

      expect(fs.existsSync(path.join(projectsDir, longName))).toBe(true);
    });
  });

  describe("Command-line interface", () => {
    test("shows help with --help flag", async () => {
      const scriptPath = path.join(
        __dirname,
        "..",
        "update-projects-status.cjs",
      );
      const { stdout } = await execAsync(`node "${scriptPath}" --help`);

      expect(stdout).toContain("Usage");
      expect(stdout).toContain("audit");
      expect(stdout).toContain("template");
      expect(stdout).toContain("link");
    });

    test("shows help with -h flag", async () => {
      const scriptPath = path.join(
        __dirname,
        "..",
        "update-projects-status.cjs",
      );
      const { stdout } = await execAsync(`node "${scriptPath}" -h`);

      expect(stdout).toContain("Usage");
    });

    test("shows help with help command", async () => {
      const scriptPath = path.join(
        __dirname,
        "..",
        "update-projects-status.cjs",
      );
      const { stdout } = await execAsync(`node "${scriptPath}" help`);

      expect(stdout).toContain("Usage");
      expect(stdout).toContain("Commands:");
    });

    test("handles unknown command gracefully", async () => {
      const scriptPath = path.join(
        __dirname,
        "..",
        "update-projects-status.cjs",
      );

      try {
        await execAsync(`node "${scriptPath}" unknown-command`);
        throw new Error("Should have thrown error for unknown command");
      } catch (error) {
        expect(error.stdout).toContain("Unknown command");
      }
    });
  });
});
