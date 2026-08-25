/**
 * Tests for `.github/projects/active/**` documentation frontmatter changes
 * introduced in this PR:
 *  - `PROJECT_REVIEW_AUDIT_2026-08-21.md`: `file_type` changes from
 *    "audit-report" to "documentation", `status` changes from "complete" to
 *    "active", and the `updated_date` field is replaced by a quoted
 *    `last_updated` field.
 *  - `issue-management-agent-planning-2026-08-12/README.md`: `file_type`
 *    changes from "project-readme" to "readme".
 *  - `issue-metadata-triage-expansion/README.md`: the YAML frontmatter block
 *    is removed entirely.
 *  - `meta-agent-v2-2026-08-12/PHASE-2D-KICKOFF.md`: the YAML frontmatter
 *    block is removed entirely.
 *  - `meta-agent-v2-2026-08-12/README.md`: the YAML frontmatter block is
 *    removed entirely.
 *  - `metrics-agent-phase-3-production-2026-08-26/TASK_3.3_MONITORING_ALERTING.md`:
 *    the YAML frontmatter block is removed entirely.
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const PROJECTS_DIR = path.join(__dirname, "../../../.github/projects/active");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(PROJECTS_DIR, relativePath), "utf8");
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? yaml.load(match[1]) : null;
}

describe(".github/projects/active frontmatter changes (PR)", () => {
  describe("PROJECT_REVIEW_AUDIT_2026-08-21.md", () => {
    let frontmatter;

    beforeAll(() => {
      frontmatter = extractFrontmatter(
        readProjectFile("PROJECT_REVIEW_AUDIT_2026-08-21.md"),
      );
    });

    it("has frontmatter present", () => {
      expect(frontmatter).not.toBeNull();
    });

    it("uses file_type documentation instead of audit-report", () => {
      expect(frontmatter.file_type).toBe("documentation");
    });

    it("has status active instead of complete", () => {
      expect(frontmatter.status).toBe("active");
    });

    it("uses last_updated instead of the removed updated_date field", () => {
      expect(frontmatter.last_updated).toBe("2026-08-21");
      expect(frontmatter.updated_date).toBeUndefined();
    });
  });

  describe("issue-management-agent-planning-2026-08-12/README.md", () => {
    it("uses file_type readme instead of project-readme", () => {
      const frontmatter = extractFrontmatter(
        readProjectFile(
          "issue-management-agent-planning-2026-08-12/README.md",
        ),
      );
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.file_type).toBe("readme");
    });
  });

  describe.each([
    "issue-metadata-triage-expansion/README.md",
    "meta-agent-v2-2026-08-12/PHASE-2D-KICKOFF.md",
    "meta-agent-v2-2026-08-12/README.md",
    "metrics-agent-phase-3-production-2026-08-26/TASK_3.3_MONITORING_ALERTING.md",
  ])("%s", (relativePath) => {
    it("no longer starts with a YAML frontmatter block", () => {
      const content = readProjectFile(relativePath);
      expect(content.startsWith("---\n")).toBe(false);
      expect(extractFrontmatter(content)).toBeNull();
    });

    it("still starts with a level-1 markdown heading", () => {
      const content = readProjectFile(relativePath);
      expect(content.trimStart().startsWith("# ")).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("returns null frontmatter for content with no leading document", () => {
      expect(extractFrontmatter("Just plain text, no frontmatter.")).toBeNull();
    });

    it("throws when a referenced project file does not exist", () => {
      expect(() => readProjectFile("does-not-exist/README.md")).toThrow(
        /ENOENT|no such file/i,
      );
    });
  });
});