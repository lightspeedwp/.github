/**
 * Tests for `.github/agents/*.agent.md` frontmatter changes introduced in this PR.
 *
 * This PR:
 *  - Adds a `name` field (VS Code required agent field) to agent specs that
 *    previously lacked one (issues, labeling, linting, meta, metrics,
 *    project-meta-sync, release, reporting, reviewer, task-planner).
 *  - Removes a stray duplicate blank line separating the "does not create or
 *    validate branches" boilerplate from the following body content.
 *  - Promotes `linting.agent.md` from `status: phase-2-implementation` to
 *    `status: active` and drops the `wordpress` tag.
 *  - Removes retired tags (`phase-5a`, `agentic-workflows`) from
 *    `release.agent.md` and relocates `file_type`/adds `name`.
 *  - Fixes an invalid `permissions` entry in `project-meta-sync.agent.md`:
 *    `github:projects` is not part of the canonical permissions enum in
 *    `.schemas/frontmatter.schema.json`, so it is replaced with `github:pulls`.
 *
 * @see .schemas/frontmatter.schema.json
 * @see scripts/validation/validate-agent-frontmatter.js
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const AGENTS_DIR = path.join(__dirname, "../../../.github/agents");

// Canonical permission scopes allowed by the agent frontmatter schema
// (.schemas/frontmatter.schema.json, "Agent Specification" branch).
const ALLOWED_PERMISSIONS = [
  "read",
  "write",
  "execute",
  "shell",
  "filesystem",
  "network",
  "github:repo",
  "github:issues",
  "github:pulls",
  "github:workflows",
  "github:checks",
  "github:actions",
];

/** Agent files where this PR newly introduced the `name:` frontmatter field. */
const NAME_ADDED_FILES = [
  "issues.agent.md",
  "labeling.agent.md",
  "linting.agent.md",
  "meta.agent.md",
  "metrics.agent.md",
  "project-meta-sync.agent.md",
  "release.agent.md",
  "reporting.agent.md",
  "reviewer.agent.md",
  "task-planner.agent.md",
];

/** Agent files where this PR only removed a stray blank line before body content. */
const BLANK_LINE_CLEANUP_FILES = [
  "mode-demonstrate-understanding.agent.md",
  "mode-document-reviewer.agent.md",
  "mode-prd.agent.md",
  "mode-thinking.agent.md",
  "prompt-engineer.agent.md",
  "task-researcher.agent.md",
  "template.agent.md",
  "testing.agent.md",
];

const ALL_CHANGED_AGENT_FILES = [
  ...NAME_ADDED_FILES,
  ...BLANK_LINE_CLEANUP_FILES,
];

// release.agent.md documents its own branch-creation behaviour instead of the
// generic "does not create or validate branches" boilerplate, so it is
// excluded from the blank-line-cleanup assertions below.
const BRANCH_NOTICE_FILES = ALL_CHANGED_AGENT_FILES.filter(
  (filename) => filename !== "release.agent.md",
);

function readAgentFile(filename) {
  const filePath = path.join(AGENTS_DIR, filename);
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`No frontmatter block found in ${filename}`);
  }
  return { content, frontmatter: yaml.load(match[1]) };
}

describe(".github/agents/*.agent.md frontmatter (PR changes)", () => {
  describe("name field presence", () => {
    it.each(ALL_CHANGED_AGENT_FILES)(
      "%s declares a non-empty `name` field",
      (filename) => {
        const { frontmatter } = readAgentFile(filename);
        expect(typeof frontmatter.name).toBe("string");
        expect(frontmatter.name.trim().length).toBeGreaterThan(0);
      },
    );
  });

  describe("blank line cleanup before body content", () => {
    const BRANCH_NOTICE =
      "This agent does not create or validate branches.";

    it.each(BRANCH_NOTICE_FILES)(
      "%s has exactly one blank line after the branch-naming boilerplate",
      (filename) => {
        const { content } = readAgentFile(filename);
        const idx = content.indexOf(BRANCH_NOTICE);
        expect(idx).toBeGreaterThan(-1);

        const afterNotice = content.slice(idx);
        const lineEnd = afterNotice.indexOf("\n");
        const rest = afterNotice.slice(lineEnd + 1);

        // Exactly one blank line, then non-blank content (no double blank line).
        expect(rest.startsWith("\n\n")).toBe(false);
        expect(/^\n[^\n]/.test(rest)).toBe(true);
      },
    );

    it("release.agent.md does not contain the generic branch-naming boilerplate", () => {
      const { content } = readAgentFile("release.agent.md");
      expect(content).not.toContain(BRANCH_NOTICE);
    });
  });

  describe("linting.agent.md", () => {
    it("has status active (previously phase-2-implementation)", () => {
      const { frontmatter } = readAgentFile("linting.agent.md");
      expect(frontmatter.status).toBe("active");
    });

    it("no longer includes the wordpress tag", () => {
      const { frontmatter } = readAgentFile("linting.agent.md");
      expect(Array.isArray(frontmatter.tags)).toBe(true);
      expect(frontmatter.tags).not.toContain("wordpress");
      // Sanity check the tag list wasn't emptied out entirely.
      expect(frontmatter.tags).toEqual(
        expect.arrayContaining(["linting", "quality", "automation"]),
      );
    });
  });

  describe("release.agent.md", () => {
    it("declares file_type agent with a matching name/title", () => {
      const { frontmatter } = readAgentFile("release.agent.md");
      expect(frontmatter.file_type).toBe("agent");
      expect(frontmatter.name).toBe("Release Manager");
      expect(frontmatter.title).toBe("Release Manager");
    });

    it("no longer references retired phase/workflow tags", () => {
      const { frontmatter } = readAgentFile("release.agent.md");
      expect(frontmatter.tags).not.toContain("phase-5a");
      expect(frontmatter.tags).not.toContain("agentic-workflows");
    });
  });

  describe("project-meta-sync.agent.md", () => {
    it("replaces the invalid github:projects permission with github:pulls", () => {
      const { frontmatter } = readAgentFile("project-meta-sync.agent.md");
      expect(frontmatter.permissions).toContain("github:pulls");
      expect(frontmatter.permissions).not.toContain("github:projects");
    });
  });

  describe("permission scopes across all changed agent files", () => {
    it.each(ALL_CHANGED_AGENT_FILES)(
      "%s only declares canonical permission scopes",
      (filename) => {
        const { frontmatter } = readAgentFile(filename);
        if (!frontmatter.permissions) {
          return;
        }
        expect(Array.isArray(frontmatter.permissions)).toBe(true);
        frontmatter.permissions.forEach((permission) => {
          expect(ALLOWED_PERMISSIONS).toContain(permission);
        });
      },
    );
  });

  describe("edge cases", () => {
    it("throws a clear error when reading a non-existent agent file", () => {
      expect(() => readAgentFile("does-not-exist.agent.md")).toThrow(
        /ENOENT|no such file/i,
      );
    });

    it("throws when a frontmatter block is missing entirely", () => {
      const tmpFile = path.join(AGENTS_DIR, "__tmp_no_frontmatter.agent.md");
      fs.writeFileSync(tmpFile, "# No frontmatter here\n");
      try {
        expect(() => readAgentFile("__tmp_no_frontmatter.agent.md")).toThrow(
          /No frontmatter block found/,
        );
      } finally {
        fs.unlinkSync(tmpFile);
      }
    });
  });
});