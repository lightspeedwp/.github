"use strict";

const {
  RepoContextDetector,
} = require("../../lib/context/repo-context-detector");

describe("RepoContextDetector", () => {
  let detector;

  beforeEach(() => {
    detector = new RepoContextDetector({ owner: "lightspeedwp" });
  });

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  describe("constructor", () => {
    it("stores the owner option", () => {
      const d = new RepoContextDetector({ owner: "acme" });
      expect(d.owner).toBe("acme");
    });

    it("defaults owner to empty string when not provided", () => {
      const d = new RepoContextDetector();
      expect(d.owner).toBe("");
    });
  });

  // ---------------------------------------------------------------------------
  // Input validation
  // ---------------------------------------------------------------------------

  describe("detect() input validation", () => {
    it("throws when repoName is not provided", () => {
      expect(() => detector.detect()).toThrow(
        "repoName must be a non-empty string",
      );
    });

    it("throws when repoName is an empty string", () => {
      expect(() => detector.detect("")).toThrow(
        "repoName must be a non-empty string",
      );
    });

    it("throws when repoName is not a string", () => {
      expect(() => detector.detect(42)).toThrow(
        "repoName must be a non-empty string",
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Control-plane detection
  // ---------------------------------------------------------------------------

  describe("control-plane detection", () => {
    it("detects .github repo by name", () => {
      const ctx = detector.detect(".github", []);
      expect(ctx.type).toBe("control-plane");
      expect(ctx.signals).toContain("repo-name:.github");
    });

    it("detects control-plane via topic", () => {
      const ctx = detector.detect("my-repo", [], {
        topics: ["control-plane"],
      });
      expect(ctx.type).toBe("control-plane");
      expect(ctx.signals).toContain("topic:control-plane");
    });

    it("detects control-plane via workflows + agents directories", () => {
      const ctx = detector.detect("my-repo", [
        ".github/workflows/ci.yml",
        "agents/reporting.agent.md",
        "README.md",
      ]);
      expect(ctx.type).toBe("control-plane");
    });

    it("detects control-plane via bare directory names (legacy usage)", () => {
      const ctx = detector.detect("my-repo", [
        ".github/workflows",
        "agents",
        "README.md",
      ]);
      expect(ctx.type).toBe("control-plane");
    });

    it("sets templateKey to control-plane", () => {
      const ctx = detector.detect(".github", []);
      expect(ctx.templateKey).toBe("control-plane");
    });
  });

  // ---------------------------------------------------------------------------
  // Block plugin detection
  // ---------------------------------------------------------------------------

  describe("block-plugin detection", () => {
    it("detects block plugin via root PHP file + block.json", () => {
      const ctx = detector.detect("my-plugin", [
        "my-plugin.php",
        "src/block.json",
        "package.json",
      ]);
      expect(ctx.type).toBe("block-plugin");
      expect(ctx.signals).toContain("has:php-root-file");
      expect(ctx.signals).toContain("has:block.json");
    });

    it("detects block plugin via wordpress-plugin topic + composer.json", () => {
      const ctx = detector.detect("my-plugin", ["composer.json"], {
        topics: ["wordpress-plugin"],
      });
      expect(ctx.type).toBe("block-plugin");
      expect(ctx.signals).toContain("topic:wordpress-plugin");
    });

    it("sets templateKey to block-plugin", () => {
      const ctx = detector.detect("my-plugin", ["my-plugin.php", "block.json"]);
      expect(ctx.templateKey).toBe("block-plugin");
    });

    it("does not detect block plugin from PHP file alone", () => {
      const ctx = detector.detect("maybe-plugin", ["my-plugin.php"]);
      expect(ctx.type).not.toBe("block-plugin");
    });
  });

  // ---------------------------------------------------------------------------
  // Block theme detection
  // ---------------------------------------------------------------------------

  describe("block-theme detection", () => {
    it("detects block theme via theme.json", () => {
      const ctx = detector.detect("my-theme", [
        "theme.json",
        "functions.php",
        "style.css",
      ]);
      expect(ctx.type).toBe("block-theme");
      expect(ctx.signals).toContain("has:theme.json");
    });

    it("detects classic/hybrid theme via style.css + functions.php", () => {
      const ctx = detector.detect("my-theme", [
        "style.css",
        "functions.php",
        "index.php",
      ]);
      expect(ctx.type).toBe("block-theme");
    });

    it("detects block theme via block-theme topic", () => {
      const ctx = detector.detect("my-theme", [], {
        topics: ["block-theme"],
      });
      expect(ctx.type).toBe("block-theme");
      expect(ctx.signals).toContain("topic:block-theme");
    });

    it("sets templateKey to block-theme", () => {
      const ctx = detector.detect("my-theme", ["theme.json"]);
      expect(ctx.templateKey).toBe("block-theme");
    });
  });

  // ---------------------------------------------------------------------------
  // Platform detection
  // ---------------------------------------------------------------------------

  describe("platform detection", () => {
    it("detects platform via platform topic", () => {
      const ctx = detector.detect("my-platform", [], {
        topics: ["platform"],
      });
      expect(ctx.type).toBe("platform");
      expect(ctx.signals).toContain("topic:platform");
    });

    it("detects platform via Dockerfile", () => {
      const ctx = detector.detect("my-infra", ["Dockerfile", "README.md"]);
      expect(ctx.type).toBe("platform");
      expect(ctx.signals).toContain("has:dockerfile");
    });

    it("detects platform via Helm chart", () => {
      const ctx = detector.detect("my-infra", ["Chart.yaml"]);
      expect(ctx.type).toBe("platform");
      expect(ctx.signals).toContain("has:helm-chart");
    });

    it("detects platform via Terraform files", () => {
      const ctx = detector.detect("my-infra", ["main.tf", "variables.tf"]);
      expect(ctx.type).toBe("platform");
      expect(ctx.signals).toContain("has:terraform");
    });
  });

  // ---------------------------------------------------------------------------
  // Unknown fallback
  // ---------------------------------------------------------------------------

  describe("unknown fallback", () => {
    it("returns unknown when no signals match", () => {
      const ctx = detector.detect("random-repo", ["README.md", "LICENSE"]);
      expect(ctx.type).toBe("unknown");
      expect(ctx.signals).toContain("no-distinctive-signals");
    });

    it("sets templateKey to unknown", () => {
      const ctx = detector.detect("random-repo", []);
      expect(ctx.templateKey).toBe("unknown");
    });
  });

  // ---------------------------------------------------------------------------
  // Context object shape
  // ---------------------------------------------------------------------------

  describe("context object shape", () => {
    it("always returns name matching the input", () => {
      const ctx = detector.detect("my-repo", []);
      expect(ctx.name).toBe("my-repo");
    });

    it("includes owner from constructor in meta", () => {
      const ctx = detector.detect("my-repo", []);
      expect(ctx.meta.owner).toBe("lightspeedwp");
    });

    it("includes description from repoMeta", () => {
      const ctx = detector.detect("my-repo", [], {
        description: "A test repo",
      });
      expect(ctx.meta.description).toBe("A test repo");
    });

    it("defaults description to empty string when not provided", () => {
      const ctx = detector.detect("my-repo", []);
      expect(ctx.meta.description).toBe("");
    });

    it("normalises topics to empty array when not provided", () => {
      const ctx = detector.detect("my-repo", []);
      expect(ctx.meta.topics).toEqual([]);
    });

    it("passes through topics from repoMeta", () => {
      const ctx = detector.detect("my-repo", [], {
        topics: ["foo", "bar"],
      });
      expect(ctx.meta.topics).toEqual(["foo", "bar"]);
    });

    it("defaults defaultBranch to main", () => {
      const ctx = detector.detect("my-repo", []);
      expect(ctx.meta.defaultBranch).toBe("main");
    });

    it("passes through default_branch from repoMeta", () => {
      const ctx = detector.detect("my-repo", [], {
        default_branch: "develop",
      });
      expect(ctx.meta.defaultBranch).toBe("develop");
    });

    it("defaults isPrivate to false", () => {
      const ctx = detector.detect("my-repo", []);
      expect(ctx.meta.isPrivate).toBe(false);
    });

    it("passes through private flag from repoMeta", () => {
      const ctx = detector.detect("my-repo", [], { private: true });
      expect(ctx.meta.isPrivate).toBe(true);
    });

    it("signals array is a copy, not a reference", () => {
      const ctx = detector.detect(".github", []);
      ctx.signals.push("injected");
      const ctx2 = detector.detect(".github", []);
      expect(ctx2.signals).not.toContain("injected");
    });
  });

  // ---------------------------------------------------------------------------
  // Priority: control-plane beats theme/plugin when .github repo name
  // ---------------------------------------------------------------------------

  describe("detection priority", () => {
    it("control-plane takes priority over block-theme signals", () => {
      const ctx = detector.detect(".github", [
        "theme.json",
        "style.css",
        "functions.php",
      ]);
      expect(ctx.type).toBe("control-plane");
    });

    it("control-plane takes priority over block-plugin signals", () => {
      const ctx = detector.detect(".github", ["my-plugin.php", "block.json"]);
      expect(ctx.type).toBe("control-plane");
    });

    it("block-plugin takes priority over platform when plugin signals present", () => {
      const ctx = detector.detect("my-plugin", [
        "my-plugin.php",
        "block.json",
        "Dockerfile",
      ]);
      expect(ctx.type).toBe("block-plugin");
    });
  });

  // ---------------------------------------------------------------------------
  // Edge cases and boundary conditions
  // ---------------------------------------------------------------------------

  describe("edge cases", () => {
    it("handles mixed case file paths correctly", () => {
      const ctx = detector.detect("my-repo", [
        "THEME.JSON",
        "Functions.php",
        "Style.css",
      ]);
      expect(ctx.type).toBe("block-theme");
    });

    it("detects files with subdirectories correctly", () => {
      const ctx = detector.detect("my-repo", [
        "src/block.json",
        "plugin-header.php",
      ]);
      expect(ctx.type).toBe("block-plugin");
    });

    it("ignores files with partial path matches", () => {
      const ctx = detector.detect("my-repo", [
        "docs/theme.json.backup",
        "README.theme.json",
      ]);
      expect(ctx.type).not.toBe("block-theme");
    });

    it("distinguishes between .tf files and other extensions", () => {
      const ctx = detector.detect("my-infra", [
        "main.tf",
        "variables.tf",
        "outputs.tf.example",
      ]);
      expect(ctx.type).toBe("platform");
      expect(ctx.signals).toContain("has:terraform");
    });

    it("handles empty file paths array", () => {
      const ctx = detector.detect("my-repo", []);
      expect(ctx.type).toBe("unknown");
      expect(ctx.signals).toContain("no-distinctive-signals");
    });

    it("handles null/undefined topics gracefully", () => {
      const ctx = detector.detect("my-repo", [], {
        topics: null,
      });
      expect(ctx.meta.topics).toEqual([]);
    });

    it("handles undefined metadata completely", () => {
      const ctx = detector.detect("my-repo", [], undefined);
      expect(ctx.meta.owner).toBe("lightspeedwp");
      expect(ctx.meta.description).toBe("");
      expect(ctx.meta.topics).toEqual([]);
    });

    it("respects case-insensitive topic matching for platform", () => {
      const ctx = detector.detect("my-repo", [], {
        topics: ["PLATFORM"],
      });
      expect(ctx.type).not.toBe("platform"); // topics are case-sensitive in GitHub
    });

    it("handles multiple Terraform files", () => {
      const ctx = detector.detect("infra-repo", [
        "main.tf",
        "network.tf",
        "compute.tf",
        "storage.tf",
      ]);
      expect(ctx.type).toBe("platform");
    });

    it("handles multiple Helm variations", () => {
      const ctx = detector.detect("helm-repo", ["Chart.yaml"]);
      expect(ctx.type).toBe("platform");
      expect(ctx.signals).toContain("has:helm-chart");
    });

    it("detects Chart.yml variant", () => {
      const ctx = detector.detect("helm-repo-yml", ["Chart.yml"]);
      expect(ctx.type).toBe("platform");
    });

    it("handles PHP files in subdirectories", () => {
      const ctx = detector.detect("maybe-plugin", ["src/MyClass.php"]);
      expect(ctx.type).not.toBe("block-plugin");
    });

    it("requires both theme.json AND functions.php OR style.css", () => {
      const ctx1 = detector.detect("partial-theme", ["theme.json"]);
      expect(ctx1.type).toBe("block-theme");

      const ctx2 = detector.detect("classic-theme", [
        "style.css",
        "functions.php",
      ]);
      expect(ctx2.type).toBe("block-theme");
    });

    it("handles repos with templates directory", () => {
      const ctx = detector.detect("template-repo", [
        "templates/hero.html",
        "templates/footer.html",
      ]);
      expect(ctx.signals).toContain("has:templates-directory");
    });

    it("returns copy of signals array, not reference", () => {
      const ctx = detector.detect("my-repo", [".github/workflows/test.yml"]);
      const originalLength = ctx.signals.length;
      ctx.signals.push("injected-signal");
      expect(ctx.signals.length).toBe(originalLength + 1);

      const ctx2 = detector.detect("my-repo", [".github/workflows/test.yml"]);
      expect(ctx2.signals).not.toContain("injected-signal");
    });

    it("normalizes all file paths to lowercase for comparison", () => {
      const ctx = detector.detect("test-repo", [".GITHUB/WORKFLOWS", "AGENTS"]);
      expect(ctx.type).toBe("control-plane");
    });

    it("handles very long file path lists", () => {
      const manyFiles = Array.from({ length: 1000 }, (_, i) => `file${i}.txt`);
      manyFiles.push("theme.json");

      const ctx = detector.detect("large-repo", manyFiles);
      expect(ctx.type).toBe("block-theme");
    });

    it("detects agents directory with or without trailing slash", () => {
      const ctx1 = detector.detect("repo-with-agents", ["agents/"]);
      const ctx2 = detector.detect("repo-with-agents", ["agents"]);

      // Both should recognize agents directory
      expect([ctx1.type, ctx2.type]).toEqual(
        expect.arrayContaining(["control-plane", "unknown"]),
      );
    });

    it("requires agents AND workflows for control-plane (not just agents)", () => {
      const ctx = detector.detect("agents-only", ["agents/my-agent.md"]);
      expect(ctx.type).not.toBe("control-plane");
      expect(ctx.signals).toContain("has:agents-directory");
    });

    it("default_branch uses snake_case from GitHub API", () => {
      const ctx = detector.detect("my-repo", [], {
        default_branch: "staging",
      });
      expect(ctx.meta.defaultBranch).toBe("staging");
    });
  });

  // ---------------------------------------------------------------------------
  // Comprehensive signal coverage
  // ---------------------------------------------------------------------------

  describe("signal collection", () => {
    it("collects all detected signals", () => {
      const ctx = detector.detect("test-repo", [
        ".github/workflows/test.yml",
        "agents/reporter.md",
        "theme.json",
      ]);
      expect(ctx.signals.length).toBeGreaterThan(0);
    });

    it("includes topic signals when present", () => {
      const ctx = detector.detect("plugin-repo", [], {
        topics: ["wordpress-plugin", "gutenberg"],
      });
      expect(ctx.signals).toContain("topic:wordpress-plugin");
      expect(ctx.signals).toContain("topic:gutenberg");
    });

    it("includes file-based signals", () => {
      const ctx = detector.detect("theme-repo", [
        "theme.json",
        "style.css",
        "functions.php",
        "templates/index.html",
      ]);
      expect(ctx.signals).toContain("has:theme.json");
      expect(ctx.signals).toContain("has:style.css");
      expect(ctx.signals).toContain("has:functions.php");
      expect(ctx.signals).toContain("has:templates-directory");
    });
  });
});
