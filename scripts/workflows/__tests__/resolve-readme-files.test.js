import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const resolver = require("../resolve-readme-files.cjs");

const {
  resolveReadmeFiles,
} = resolver;

/**
 * Regression coverage for the README regeneration bot staging
 * `.github/workflows/README.md`.
 *
 * GitHub treats ANY path under `.github/workflows/` -- including a plain
 * Markdown file -- as a workflow definition, and refuses the push unless the
 * pushing token carries the `workflows` permission:
 *
 *   refusing to allow a GitHub App to create or update workflow
 *   '.github/workflows/README.md' without 'workflows' permission
 *
 * The App token in documentation.yml is deliberately minted with least
 * privilege (`permission-contents: write`, `permission-pull-requests: write`),
 * so every regeneration run whose changed-file list touched a workflow file
 * failed at the push. Two develop pushes reproduced it: run 36567389709
 * (d7e98f3, #3682 merge) and run 36519808147 (759dbb8, #3683 merge).
 *
 * The resolver must therefore never emit a README that lives under
 * `.github/workflows/`, whatever shape the changed-file list takes.
 */

const WORKFLOWS_README = ".github/workflows/README.md";

// Fixture roots and the cwd they displaced, drained by the afterEach below so
// a test that chdirs cannot leak its working directory into the next one.
const fixtureDirs = [];
const cwdStack = [];

/**
 * Build a throwaway repository fixture and chdir into it.
 *
 * `resolveReadmeFiles` probes the filesystem with `fs.existsSync` against
 * relative paths, so the fixture root has to be the process cwd for the test
 * to observe a realistic tree. Each fixture is torn down by `afterEach`, which
 * restores the cwd before the next test builds its own.
 *
 * @param {Record<string, string>} files Relative path to file contents; missing
 *   parent directories are created, and an omitted value becomes a placeholder.
 * @returns {string} Absolute path to the fixture root, which is also the cwd.
 */
function withFixture(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "resolve-readme-"));
  const previousCwd = process.cwd();

  for (const [relative, contents] of Object.entries(files)) {
    const target = path.join(dir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents ?? "# placeholder\n");
  }

  fixtureDirs.push(dir);
  cwdStack.push(previousCwd);
  process.chdir(dir);

  return dir;
}

afterEach(() => {
  while (cwdStack.length > 0) {
    process.chdir(cwdStack.pop());
  }
  while (fixtureDirs.length > 0) {
    fs.rmSync(fixtureDirs.pop(), { recursive: true, force: true });
  }
});

describe("resolveReadmeFiles", () => {
  describe("excludes .github/workflows/ (the push-refusal regression)", () => {
    it("does not return the workflows README for a changed workflow file", () => {
      withFixture({
        "README.md": "# root\n",
        "docs/README.md": "# docs\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows/documentation.yml": "name: test\n",
      });

      const result = resolveReadmeFiles([".github/workflows/documentation.yml"]);

      expect(result).not.toContain(WORKFLOWS_README);
    });

    it("reproduces the real failing input from run 36567389709 (d7e98f3)", () => {
      // `git diff --name-only d7e98f3^ d7e98f3`. Before the fix this list
      // contained '.github/workflows/README.md', which is the file the push was
      // refused on. The fixture mirrors every directory that diff touched, so
      // the expected survivors below are the real ones, not a convenient subset.
      withFixture({
        "README.md": "# root\n",
        "docs/README.md": "# docs\n",
        "scripts/README.md": "# scripts\n",
        "scripts/agents/includes/README.md": "# includes\n",
        "scripts/agents/includes/__tests__/README.md": "# includes tests\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows/documentation.yml": "name: test\n",
      });

      const result = resolveReadmeFiles([
        ".github/workflows/documentation.yml",
        "CHANGELOG.md",
        "docs/FOOTER_REMEDIATION_GUIDE.md",
        "package.json",
        "scripts/__tests__/dedupe-footers.test.js",
        "scripts/__tests__/measure-footer-shape.test.js",
        "scripts/agents/includes/__tests__/footer-shape.test.js",
        "scripts/agents/includes/footer-shape.js",
        "scripts/dedupe-footers.js",
        "scripts/measure-footer-shape.js",
      ]);

      expect(result).not.toContain(WORKFLOWS_README);
      // Everything else must survive, or the bot silently stops regenerating.
      expect(result).toEqual([
        "README.md",
        "docs/README.md",
        "scripts/README.md",
        "scripts/agents/includes/README.md",
        "scripts/agents/includes/__tests__/README.md",
      ]);
    });

    it("reproduces the real failing input from run 36519808147 (759dbb8)", () => {
      withFixture({
        "README.md": "# root\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows/changelog-unified.yml": "name: test\n",
      });

      const result = resolveReadmeFiles([
        ".github/workflows/changelog-unified.yml",
        "CHANGELOG.md",
        "tests/js/bot-author-exemptions.test.js",
      ]);

      expect(result).not.toContain(WORKFLOWS_README);
      expect(result).toContain("README.md");
    });

    it("still returns the workflows README's siblings from a mixed list", () => {
      withFixture({
        "README.md": "# root\n",
        "docs/README.md": "# docs\n",
        "agents/README.md": "# agents\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows/changelog-unified.yml": "name: test\n",
        "docs/INDEX.md": "# index\n",
      });

      const result = resolveReadmeFiles([
        ".github/workflows/changelog-unified.yml",
        "docs/INDEX.md",
        "agents/foo.js",
      ]);

      expect(result).not.toContain(WORKFLOWS_README);
      expect(result).toEqual(["README.md", "agents/README.md", "docs/README.md"]);
    });

    it("excludes a README in a nested subdirectory of .github/workflows/", () => {
      withFixture({
        "README.md": "# root\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows/nested/README.md": "# nested\n",
        ".github/workflows/nested/thing.yml": "name: nested\n",
      });

      const result = resolveReadmeFiles([
        ".github/workflows/nested/thing.yml",
      ]);

      expect(result).not.toContain(WORKFLOWS_README);
      expect(result).not.toContain(".github/workflows/nested/README.md");
      expect(result).toEqual(["README.md"]);
    });

    it("excludes when the changed path carries a ./ prefix", () => {
      withFixture({
        "README.md": "# root\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows/documentation.yml": "name: test\n",
      });

      const result = resolveReadmeFiles(["./.github/workflows/documentation.yml"]);

      expect(result).not.toContain(WORKFLOWS_README);
    });

    it("excludes when the changed path uses Windows separators", () => {
      withFixture({
        "README.md": "# root\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows/documentation.yml": "name: test\n",
      });

      // A Windows-style separator must not smuggle the workflows README back in.
      // This asserts the exact list rather than "does not contain", because the
      // pre-fix resolver also produced ["README.md"] here -- `path.dirname` treats
      // a backslash as an ordinary character, so the whole string looked like a
      // root-level filename. Pinning the exact value is what makes the test
      // meaningful instead of passing on unfixed code for the wrong reason.
      const result = resolveReadmeFiles([
        ".github\\workflows\\documentation.yml",
      ]);

      expect(result).toEqual(["README.md"]);
    });

    it("does not treat a similarly named sibling directory as excluded", () => {
      // `.github/workflows-old/` is not under `.github/workflows/`, so a README
      // there is a legitimate regeneration target.
      withFixture({
        "README.md": "# root\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows-old/README.md": "# old\n",
        ".github/workflows-old/thing.yml": "name: old\n",
      });

      const result = resolveReadmeFiles([".github/workflows-old/thing.yml"]);

      expect(result).toContain(".github/workflows-old/README.md");
      expect(result).not.toContain(WORKFLOWS_README);
    });
  });

  describe("emits platform-independent POSIX output", () => {
    it("emits forward-slash paths, matching the git paths it derives from", () => {
      // The output is written to GITHUB_OUTPUT and consumed by meta.agent.js, so
      // it must be spelled the same way on every platform. `path.join` produces
      // backslashes on Windows, and a backslash would be the one place the list
      // stopped matching the forward-slash paths `git diff --name-only` reports.
      //
      // The exact-list assertion below is what catches this on Windows; the
      // backslash assertion is belt-and-braces. Neither can fail on Linux,
      // because `path.join` is already POSIX there -- this test protects
      // Windows runs, it does not add Linux CI coverage.
      withFixture({
        "README.md": "# root\n",
        "docs/README.md": "# docs\n",
        "scripts/agents/includes/README.md": "# includes\n",
        ".github/workflows/README.md": "# workflows\n",
        ".github/workflows/documentation.yml": "name: test\n",
      });

      const result = resolveReadmeFiles([
        ".github/workflows/documentation.yml",
        "docs/INDEX.md",
        "scripts/agents/includes/footer-shape.js",
      ]);

      expect(result).toEqual([
        "README.md",
        "docs/README.md",
        "scripts/agents/includes/README.md",
      ]);
      // A backslash anywhere in the output is the bug, whatever the platform.
      expect(result.some((file) => file.includes("\\"))).toBe(false);
    });
  });

  describe("leaves every other directory untouched", () => {
    it("returns the root README when a subdirectory changes", () => {
      withFixture({ "README.md": "# root\n", "docs/README.md": "# docs\n" });

      expect(resolveReadmeFiles(["docs/INDEX.md"])).toEqual([
        "README.md",
        "docs/README.md",
      ]);
    });

    it("omits a directory's README when the directory has none", () => {
      withFixture({ "README.md": "# root\n" });

      expect(resolveReadmeFiles(["docs/INDEX.md"])).toEqual(["README.md"]);
    });

    it("still returns the root README for a root-level change", () => {
      // Baseline behaviour, pinned deliberately: `path.dirname("CHANGELOG.md")`
      // is ".", so the root README is a legitimate regeneration target and the
      // root-README gate is not the thing that must change here.
      withFixture({ "README.md": "# root\n" });

      expect(resolveReadmeFiles(["CHANGELOG.md"])).toEqual(["README.md"]);
    });

    it("deduplicates and sorts the result", () => {
      withFixture({
        "README.md": "# root\n",
        "docs/README.md": "# docs\n",
        "agents/README.md": "# agents\n",
      });

      const result = resolveReadmeFiles([
        "docs/one.md",
        "agents/two.md",
        "docs/three.md",
      ]);

      expect(result).toEqual(["README.md", "agents/README.md", "docs/README.md"]);
    });

    it("returns an empty list for no changed files", () => {
      withFixture({ "README.md": "# root\n" });

      expect(resolveReadmeFiles([])).toEqual([]);
    });
  });
});
