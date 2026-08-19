/**
 * Jest suite for release.agent.js.
 *
 * release.agent.js is a native ESM module that uses import.meta, so it cannot
 * be directly require()'d or statically imported through babel-jest.  All tests
 * that exercise the module's exported functions run the code as a Node.js ESM
 * child process (the same pattern used in release.agent.mcp.test.js) and parse
 * the JSON result from stdout.  File-system–dependent tests write temp fixtures
 * and pass the paths into the subprocess.
 *
 * @see ../release.agent.js
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../../..");

function runNodeEsm(code) {
  const raw = execFileSync(
    process.execPath,
    ["--input-type=module", "-e", code],
    { cwd: repoRoot, encoding: "utf8" },
  ).trim();
  const lines = raw.split("\n").filter(Boolean);
  return lines[lines.length - 1] || "";
}

function writeTempChangelog(content) {
  const file = path.join(
    os.tmpdir(),
    `ra-test-${Date.now()}-${Math.random().toString(36).slice(2)}.md`,
  );
  fs.writeFileSync(file, content, "utf8");
  return file;
}

const MINIMAL_CHANGELOG = `# Changelog

## [Unreleased]

### Added

- First unreleased feature

## [0.1.0] - 2025-01-01

### Added

- Initial release
`;

// ---------------------------------------------------------------------------
// determineNextVersion
// ---------------------------------------------------------------------------

describe("determineNextVersion", () => {
  function nextVersion(current, scope) {
    return JSON.parse(
      runNodeEsm(`
        const { determineNextVersion } = await import('./scripts/agents/release.agent.js');
        console.log(JSON.stringify(determineNextVersion(${JSON.stringify(current)}, ${JSON.stringify(scope)})));
      `),
    );
  }

  test("bumps patch", () =>
    expect(nextVersion("1.2.3", "patch")).toBe("1.2.4"));
  test("bumps minor and resets patch", () =>
    expect(nextVersion("1.2.3", "minor")).toBe("1.3.0"));
  test("bumps major and resets minor + patch", () =>
    expect(nextVersion("1.2.3", "major")).toBe("2.0.0"));
  test("defaults to patch when scope omitted", () =>
    expect(nextVersion("0.5.0", undefined)).toBe("0.5.1"));
  test("handles 0.x versions", () =>
    expect(nextVersion("0.1.0", "minor")).toBe("0.2.0"));

  test("throws on invalid current version", () => {
    expect(() =>
      runNodeEsm(`
        const { determineNextVersion } = await import('./scripts/agents/release.agent.js');
        determineNextVersion('not-a-version', 'patch');
      `),
    ).toThrow();
  });
});

// ---------------------------------------------------------------------------
// compareVersions
// ---------------------------------------------------------------------------

describe("compareVersions", () => {
  function compare(a, b) {
    return JSON.parse(
      runNodeEsm(`
        const { compareVersions } = await import('./scripts/agents/release.agent.js');
        console.log(JSON.stringify(compareVersions(${JSON.stringify(a)}, ${JSON.stringify(b)})));
      `),
    );
  }

  test("returns 0 for equal", () => expect(compare("1.2.3", "1.2.3")).toBe(0));
  test("returns 1 when left greater", () =>
    expect(compare("2.0.0", "1.9.9")).toBe(1));
  test("returns -1 when left lesser", () =>
    expect(compare("1.0.0", "2.0.0")).toBe(-1));
  test("compares minor correctly", () =>
    expect(compare("1.3.0", "1.2.9")).toBe(1));
  test("compares patch correctly", () =>
    expect(compare("1.2.3", "1.2.4")).toBe(-1));
});

// ---------------------------------------------------------------------------
// isValidGitRef
// ---------------------------------------------------------------------------

describe("isValidGitRef", () => {
  function valid(ref) {
    return JSON.parse(
      runNodeEsm(`
        const { isValidGitRef } = await import('./scripts/agents/release.agent.js');
        console.log(JSON.stringify(isValidGitRef(${JSON.stringify(ref)})));
      `),
    );
  }

  test("accepts version tags", () => expect(valid("v1.2.3")).toBe(true));
  test("accepts branch names", () => expect(valid("develop")).toBe(true));
  test("accepts release branch paths", () =>
    expect(valid("release/v1.2.3")).toBe(true));
  test("accepts HEAD", () => expect(valid("HEAD")).toBe(true));
  test("accepts short SHAs", () => expect(valid("abc1234")).toBe(true));
  test("rejects refs with whitespace", () =>
    expect(valid("my branch")).toBe(false));
  test("rejects refs starting with -", () => expect(valid("-bad")).toBe(false));
  test("rejects caret operator", () => expect(valid("HEAD^")).toBe(false));
  test("rejects tilde operator", () => expect(valid("v1.0.0~1")).toBe(false));
  test("rejects empty string", () => expect(valid("")).toBe(false));
  test("rejects null", () => expect(valid(null)).toBe(false));
});

// ---------------------------------------------------------------------------
// buildReleasePRBody — must satisfy main-branch-guard required sections
// ---------------------------------------------------------------------------

describe("buildReleasePRBody", () => {
  function getBody(version) {
    return JSON.parse(
      runNodeEsm(`
        const { buildReleasePRBody } = await import('./scripts/agents/release.agent.js');
        console.log(JSON.stringify(buildReleasePRBody(${JSON.stringify(version)})));
      `),
    );
  }

  test("contains ## Linked issues & merged PRs section", () => {
    expect(getBody("1.2.3")).toMatch(/^## Linked issues\s*&\s*merged PRs$/im);
  });

  test("contains ## Changelog section", () => {
    expect(getBody("1.2.3")).toMatch(/^## Changelog$/im);
  });

  test("contains ### Checklist (Global DoD / PR) section", () => {
    expect(getBody("1.2.3")).toMatch(
      /^### Checklist\s+\(Global DoD\s*\/\s*PR\)$/im,
    );
  });

  test("embeds the version number", () => {
    expect(getBody("0.6.0")).toContain("0.6.0");
  });

  test("documents develop as origin branch", () => {
    expect(getBody("1.0.0")).toContain("develop");
  });

  test("includes today's ISO date", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(getBody("1.0.0")).toContain(today);
  });
});

// ---------------------------------------------------------------------------
// detectBreakingChanges
// ---------------------------------------------------------------------------

describe("detectBreakingChanges", () => {
  function detect(releases, version) {
    return JSON.parse(
      runNodeEsm(`
        const { detectBreakingChanges } = await import('./scripts/agents/release.agent.js');
        console.log(JSON.stringify(detectBreakingChanges({ releases: ${JSON.stringify(releases)} }, ${JSON.stringify(version)})));
      `),
    );
  }

  test("detects 'breaking' keyword in changed section", () => {
    const releases = [
      {
        version: "2.0.0",
        sections: { changed: ["Breaking: old API removed"] },
      },
    ];
    expect(detect(releases, "2.0.0").length).toBeGreaterThan(0);
  });

  test("flags removed section items as breaking", () => {
    const releases = [
      { version: "2.0.0", sections: { removed: ["Legacy plugin support"] } },
    ];
    const result = detect(releases, "2.0.0");
    expect(result.some((bc) => bc.section === "removed")).toBe(true);
  });

  test("returns empty array for non-breaking release", () => {
    const releases = [
      { version: "1.0.0", sections: { added: ["New feature"] } },
    ];
    expect(detect(releases, "1.0.0")).toHaveLength(0);
  });

  test("returns empty array for unknown version", () => {
    const releases = [
      { version: "1.0.0", sections: { added: ["New feature"] } },
    ];
    expect(detect(releases, "9.9.9")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// generateHighlights
// ---------------------------------------------------------------------------

describe("generateHighlights", () => {
  function highlights(releases, version) {
    return JSON.parse(
      runNodeEsm(`
        const { generateHighlights } = await import('./scripts/agents/release.agent.js');
        console.log(JSON.stringify(generateHighlights({ releases: ${JSON.stringify(releases)} }, ${JSON.stringify(version)})));
      `),
    );
  }

  test("caps highlights at 5", () => {
    const releases = [
      {
        version: "1.0.0",
        sections: {
          added: ["A", "B", "C", "D"],
          changed: ["E"],
          security: ["F"],
        },
      },
    ];
    expect(highlights(releases, "1.0.0").length).toBeLessThanOrEqual(5);
  });

  test("prioritises added section", () => {
    const releases = [{ version: "1.0.0", sections: { added: ["Feature A"] } }];
    const result = highlights(releases, "1.0.0");
    expect(result.some((h) => h.section === "added")).toBe(true);
  });

  test("returns empty array for unknown version", () => {
    const releases = [{ version: "1.0.0", sections: { added: ["x"] } }];
    expect(highlights(releases, "9.9.9")).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// updateChangelog (file system)
// ---------------------------------------------------------------------------

describe("updateChangelog", () => {
  test("rolls [Unreleased] to versioned section", () => {
    const tmpFile = writeTempChangelog(MINIMAL_CHANGELOG);
    try {
      runNodeEsm(`
        const { updateChangelog } = await import('./scripts/agents/release.agent.js');
        updateChangelog('0.2.0', { changelogPath: ${JSON.stringify(tmpFile)} });
        console.log('done');
      `);
      const content = fs.readFileSync(tmpFile, "utf8");
      expect(content).toContain("## [0.2.0]");
      expect(content).toContain("## [Unreleased]");
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("new [Unreleased] appears before versioned section", () => {
    const tmpFile = writeTempChangelog(MINIMAL_CHANGELOG);
    try {
      runNodeEsm(`
        const { updateChangelog } = await import('./scripts/agents/release.agent.js');
        updateChangelog('0.2.0', { changelogPath: ${JSON.stringify(tmpFile)} });
        console.log('done');
      `);
      const content = fs.readFileSync(tmpFile, "utf8");
      expect(content.indexOf("## [Unreleased]")).toBeLessThan(
        content.indexOf("## [0.2.0]"),
      );
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("dry-run returns updated content without writing", () => {
    const tmpFile = writeTempChangelog(MINIMAL_CHANGELOG);
    try {
      const result = JSON.parse(
        runNodeEsm(`
          const { updateChangelog } = await import('./scripts/agents/release.agent.js');
          const updated = updateChangelog('0.2.0', { changelogPath: ${JSON.stringify(tmpFile)}, dryRun: true });
          console.log(JSON.stringify(updated));
        `),
      );
      expect(result).toContain("## [0.2.0]");
      expect(fs.readFileSync(tmpFile, "utf8")).toBe(MINIMAL_CHANGELOG);
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });
});

// ---------------------------------------------------------------------------
// validatePostReleaseChangelog
// ---------------------------------------------------------------------------

describe("validatePostReleaseChangelog", () => {
  const VALID_POST_RELEASE = `# Changelog

## [Unreleased]

### Added

## [1.0.0] - 2025-06-01

### Added

- Initial release
`;

  test("passes for a valid post-release changelog", () => {
    const tmpFile = writeTempChangelog(VALID_POST_RELEASE);
    try {
      expect(() =>
        runNodeEsm(`
          const { validatePostReleaseChangelog } = await import('./scripts/agents/release.agent.js');
          validatePostReleaseChangelog(${JSON.stringify(tmpFile)}, '1.0.0');
          console.log('ok');
        `),
      ).not.toThrow();
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("throws when [Unreleased] section is missing", () => {
    const content = `# Changelog\n\n## [1.0.0] - 2025-06-01\n\n### Added\n\n- Initial release\n`;
    const tmpFile = writeTempChangelog(content);
    try {
      expect(() =>
        runNodeEsm(`
          const { validatePostReleaseChangelog } = await import('./scripts/agents/release.agent.js');
          validatePostReleaseChangelog(${JSON.stringify(tmpFile)}, '1.0.0');
        `),
      ).toThrow();
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  test("throws when versioned section is missing", () => {
    const content = `# Changelog\n\n## [Unreleased]\n\n### Added\n\n`;
    const tmpFile = writeTempChangelog(content);
    try {
      expect(() =>
        runNodeEsm(`
          const { validatePostReleaseChangelog } = await import('./scripts/agents/release.agent.js');
          validatePostReleaseChangelog(${JSON.stringify(tmpFile)}, '2.0.0');
        `),
      ).toThrow();
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });
});

// ---------------------------------------------------------------------------
// getReleaseProvider
// ---------------------------------------------------------------------------

describe("getReleaseProvider", () => {
  function providerInfo(name) {
    return JSON.parse(
      runNodeEsm(`
        const { getReleaseProvider } = await import('./scripts/agents/release.agent.js');
        const p = getReleaseProvider(${JSON.stringify(name)});
        console.log(JSON.stringify({
          name: p.name,
          hasPreflight: typeof p.preflight === 'function',
          hasCreateTag: typeof p.createTag === 'function',
          hasPushChanges: typeof p.pushChanges === 'function',
          hasCreateReleasePR: typeof p.createReleasePR === 'function',
          hasCreateRelease: typeof p.createRelease === 'function',
        }));
      `),
    );
  }

  test("returns shell provider with correct name", () => {
    expect(providerInfo("shell").name).toBe("shell");
  });

  test("returns mcp provider with correct name", () => {
    expect(providerInfo("mcp").name).toBe("mcp");
  });

  test("shell provider exposes required interface", () => {
    const info = providerInfo("shell");
    expect(info.hasPreflight).toBe(true);
    expect(info.hasCreateTag).toBe(true);
    expect(info.hasPushChanges).toBe(true);
    expect(info.hasCreateReleasePR).toBe(true);
    expect(info.hasCreateRelease).toBe(true);
  });

  test("mcp provider exposes required interface", () => {
    const info = providerInfo("mcp");
    expect(info.hasPreflight).toBe(true);
    expect(info.hasCreateTag).toBe(true);
    expect(info.hasPushChanges).toBe(true);
    expect(info.hasCreateReleasePR).toBe(true);
    expect(info.hasCreateRelease).toBe(true);
  });

  test("throws for unknown provider", () => {
    expect(() => providerInfo("unknown")).toThrow();
  });
});
