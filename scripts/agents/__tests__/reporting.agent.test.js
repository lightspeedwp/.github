/**
 * Jest suite verifying the baseline behaviour of `reporting.agent.js` v2.
 *
 * Covers:
 *  - All original v1 exports (backwards compatibility)
 *  - v2 session cache helpers
 *  - v2 multi-repo report generation
 *  - v2 pluggable storage backend
 *  - runAgent action dispatcher
 *
 * @see ../reporting.agent.js
 */
const fs = require("fs");
const path = require("path");

// ── helpers ──────────────────────────────────────────────────────────────────

let agent;

beforeAll(async () => {
  agent = await import("../reporting.agent.js");
});

// ── 1. Module file exists ────────────────────────────────────────────────────

describe("module", () => {
  it("agent module file exists on disk", () => {
    const agentPath = path.join(__dirname, "../reporting.agent.js");
    expect(fs.existsSync(agentPath)).toBe(true);
  });

  it("exports AGENT_VERSION string", () => {
    expect(typeof agent.AGENT_VERSION).toBe("string");
    expect(agent.AGENT_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

// ── 2. CATEGORIES (v1 backwards compat) ─────────────────────────────────────

describe("CATEGORIES", () => {
  it("exports CATEGORIES object", () => {
    expect(typeof agent.CATEGORIES).toBe("object");
  });

  it("contains expected v1 categories", () => {
    const keys = Object.keys(agent.CATEGORIES);
    expect(keys).toContain("agents");
    expect(keys).toContain("linting");
    expect(keys).toContain("labeling");
    expect(keys).toContain("coverage");
    expect(keys).toContain("meta");
    expect(keys).toContain("issue-metrics");
  });
});

// ── 3. sanitiseFilename (v1) ─────────────────────────────────────────────────

describe("sanitiseFilename", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(agent.sanitiseFilename("My Report")).toBe("my-report");
  });

  it("strips illegal characters", () => {
    expect(agent.sanitiseFilename("report<>?.md")).toBe("report.md");
  });

  it("collapses multiple hyphens", () => {
    expect(agent.sanitiseFilename("a--b")).toBe("a-b");
  });
});

// ── 4. determineCategory (v1) ───────────────────────────────────────────────

describe("determineCategory", () => {
  it("returns 'linting' for lint content", () => {
    expect(agent.determineCategory("ESLint report")).toBe("linting");
  });

  it("returns 'coverage' for coverage content", () => {
    expect(agent.determineCategory("Test coverage summary")).toBe("coverage");
  });

  it("returns 'labeling' for labeling content", () => {
    expect(agent.determineCategory("Label automation run")).toBe("labeling");
  });

  it("returns default 'agents' for unknown content", () => {
    expect(agent.determineCategory("random stuff")).toBe("agents");
  });
});

// ── 5. getReportPath (v1) ───────────────────────────────────────────────────

describe("getReportPath", () => {
  it("returns a string path", () => {
    const p = agent.getReportPath("coverage", "report.md");
    expect(typeof p).toBe("string");
  });

  it("path ends with the given filename", () => {
    const p = agent.getReportPath("linting", "eslint.md");
    expect(p.endsWith("eslint.md")).toBe(true);
  });
});

// ── 6. generateFrontmatter (v1) ─────────────────────────────────────────────

describe("generateFrontmatter", () => {
  it("returns a string starting with ---", () => {
    const fm = agent.generateFrontmatter({
      title: "Test",
      description: "Desc",
      category: "agents",
    });
    expect(fm.startsWith("---")).toBe(true);
  });

  it("includes title, description, category fields", () => {
    const fm = agent.generateFrontmatter({
      title: "My Title",
      description: "My Desc",
      category: "coverage",
    });
    expect(fm).toContain('title: "My Title"');
    expect(fm).toContain('description: "My Desc"');
    expect(fm).toContain('category: "coverage"');
  });

  it("defaults author to automation", () => {
    const fm = agent.generateFrontmatter({
      title: "T",
      description: "D",
      category: "meta",
    });
    expect(fm).toContain('author: "automation"');
  });
});

// ── 7. generateReport (v1) ──────────────────────────────────────────────────

describe("generateReport", () => {
  const base = {
    title: "Test Report",
    description: "A test",
    category: "agents",
    summary: "All good",
  };

  it("returns a string containing the title", () => {
    const r = agent.generateReport(base);
    expect(r).toContain("# Test Report");
  });

  it("includes metrics table when metrics provided", () => {
    const r = agent.generateReport({
      ...base,
      metrics: [{ metric: "Tests", value: "100", status: "✅" }],
    });
    expect(r).toContain("## Key Metrics");
    expect(r).toContain("Tests");
  });

  it("includes recommendations section when provided", () => {
    const r = agent.generateReport({
      ...base,
      recommendations: ["Fix all the things"],
    });
    expect(r).toContain("## Recommendations");
    expect(r).toContain("Fix all the things");
  });
});

// ── 8. validateReport (v1) ──────────────────────────────────────────────────

describe("validateReport", () => {
  it("returns valid=false for content without frontmatter", () => {
    const result = agent.validateReport("# No frontmatter");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Missing YAML frontmatter");
  });

  it("returns valid=true for a well-formed report", () => {
    const content = `---
file_type: "report"
title: "T"
description: "D"
category: "agents"
created_date: "2026-08-29"
last_updated: "2026-08-29"
---

# T
`;
    const result = agent.validateReport(content);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("warns about missing last_updated", () => {
    const content = `---
file_type: "report"
title: "T"
description: "D"
category: "agents"
created_date: "2026-08-29"
---

# T
`;
    const result = agent.validateReport(content);
    expect(result.warnings).toContain("Missing last_updated field");
  });
});

// ── 9. Session cache (v2) ───────────────────────────────────────────────────

describe("session cache", () => {
  beforeEach(() => {
    agent.cacheClear();
  });

  it("cacheSet and cacheGet round-trips a value", () => {
    agent.cacheSet("my-key", { foo: "bar" });
    expect(agent.cacheGet("my-key")).toEqual({ foo: "bar" });
  });

  it("cacheGet returns undefined for missing keys", () => {
    expect(agent.cacheGet("nonexistent")).toBeUndefined();
  });

  it("cacheSize reflects live entries", () => {
    agent.cacheSet("k1", 1);
    agent.cacheSet("k2", 2);
    expect(agent.cacheSize()).toBe(2);
  });

  it("cacheClear empties the cache", () => {
    agent.cacheSet("x", 42);
    agent.cacheClear();
    expect(agent.cacheSize()).toBe(0);
  });

  it("expired entries are not returned", () => {
    agent.cacheSet("exp-key", "value", 1); // 1 ms TTL
    return new Promise((resolve) =>
      setTimeout(() => {
        expect(agent.cacheGet("exp-key")).toBeUndefined();
        resolve();
      }, 10),
    );
  });
});

// ── 10. parseRepoRef (v2) ───────────────────────────────────────────────────

describe("parseRepoRef", () => {
  it("parses 'owner/repo' string", () => {
    expect(agent.parseRepoRef("lightspeedwp/.github")).toEqual({
      owner: "lightspeedwp",
      repo: ".github",
    });
  });

  it("accepts { owner, repo } object", () => {
    expect(agent.parseRepoRef({ owner: "acme", repo: "widget" })).toEqual({
      owner: "acme",
      repo: "widget",
    });
  });

  it("throws on malformed string", () => {
    expect(() => agent.parseRepoRef("no-slash")).toThrow();
  });

  it("throws on object missing owner", () => {
    expect(() => agent.parseRepoRef({ repo: "widget" })).toThrow();
  });
});

// ── 11. buildRepoCacheKey (v2) ──────────────────────────────────────────────

describe("buildRepoCacheKey", () => {
  it("returns a predictable key", () => {
    const key = agent.buildRepoCacheKey(
      { owner: "acme", repo: "test" },
      "coverage",
    );
    expect(key).toBe("repo:acme/test:coverage");
  });
});

// ── 12. generateMultiRepoReport (v2) ────────────────────────────────────────

describe("generateMultiRepoReport", () => {
  const base = {
    title: "Multi-Repo Report",
    description: "Cross-repo summary",
    category: "agents",
    repos: ["lightspeedwp/.github", "lightspeedwp/lsx"],
  };

  it("returns a string containing the title", () => {
    const r = agent.generateMultiRepoReport(base);
    expect(r).toContain("# Multi-Repo Report");
  });

  it("lists all repositories in the output", () => {
    const r = agent.generateMultiRepoReport(base);
    expect(r).toContain("lightspeedwp/.github");
    expect(r).toContain("lightspeedwp/lsx");
  });

  it("shows repository count", () => {
    const r = agent.generateMultiRepoReport(base);
    expect(r).toContain("## Repositories (2)");
  });

  it("includes aggregate metrics when provided", () => {
    const r = agent.generateMultiRepoReport({
      ...base,
      metrics: [{ metric: "PRs", value: "12", status: "✅" }],
    });
    expect(r).toContain("## Aggregate Metrics");
    expect(r).toContain("PRs");
  });

  it("adds multi-repo tag to frontmatter", () => {
    const r = agent.generateMultiRepoReport(base);
    expect(r).toContain("multi-repo");
  });

  it("throws when repos array is empty", () => {
    expect(() =>
      agent.generateMultiRepoReport({ ...base, repos: [] }),
    ).toThrow();
  });
});

// ── 13. Pluggable storage (v2) ──────────────────────────────────────────────

describe("pluggable storage", () => {
  afterEach(() => {
    agent.resetStorage();
  });

  it("createMemoryStorage returns a backend with write/exists/mkdirp", () => {
    const mem = agent.createMemoryStorage();
    expect(typeof mem.write).toBe("function");
    expect(typeof mem.exists).toBe("function");
    expect(typeof mem.mkdirp).toBe("function");
  });

  it("memory storage write and exists round-trip", () => {
    const mem = agent.createMemoryStorage();
    mem.write("/tmp/report.md", "hello");
    expect(mem.exists("/tmp/report.md")).toBe(true);
  });

  it("setStorage + saveReport uses the injected backend", () => {
    const mem = agent.createMemoryStorage();
    agent.setStorage(mem);

    const content = `---
file_type: "report"
title: "T"
description: "D"
category: "agents"
created_date: "2026-08-29"
last_updated: "2026-08-29"
---
# T`;
    const result = agent.saveReport(content, "test-report.md", "agents");
    expect(result.success).toBe(true);
    expect(mem.store.size).toBeGreaterThan(0);
  });

  it("setStorage throws for invalid backend", () => {
    expect(() => agent.setStorage({})).toThrow();
  });
});

// ── 14. runAgent dispatcher ─────────────────────────────────────────────────

describe("runAgent", () => {
  it("default action returns version and categories", () => {
    const result = agent.runAgent({});
    expect(result.ok).toBe(true);
    expect(result.version).toBe(agent.AGENT_VERSION);
    expect(Array.isArray(result.categories)).toBe(true);
  });

  it("generate action returns a report string", () => {
    const result = agent.runAgent({
      action: "generate",
      options: {
        title: "CI Report",
        description: "desc",
        category: "agents",
        summary: "All good",
      },
    });
    expect(result.ok).toBe(true);
    expect(typeof result.report).toBe("string");
  });

  it("generate:multi-repo action returns repos array", () => {
    const result = agent.runAgent({
      action: "generate:multi-repo",
      options: {
        title: "Multi",
        description: "desc",
        category: "agents",
        repos: ["acme/one", "acme/two"],
      },
    });
    expect(result.ok).toBe(true);
    expect(result.repos).toHaveLength(2);
  });

  it("validate action returns validation object", () => {
    const result = agent.runAgent({
      action: "validate",
      options: { content: "# No frontmatter" },
    });
    expect(result.ok).toBe(true);
    expect(result.validation.valid).toBe(false);
  });

  it("cache:set and cache:get round-trip via runAgent", () => {
    agent.runAgent({
      action: "cache:set",
      options: { key: "rk", value: 99 },
    });
    const result = agent.runAgent({
      action: "cache:get",
      options: { key: "rk" },
    });
    expect(result.ok).toBe(true);
    expect(result.value).toBe(99);
    expect(result.hit).toBe(true);
  });

  it("cache:clear clears the cache", () => {
    agent.runAgent({ action: "cache:set", options: { key: "z", value: 1 } });
    agent.runAgent({ action: "cache:clear", options: {} });
    const result = agent.runAgent({
      action: "cache:get",
      options: { key: "z" },
    });
    expect(result.hit).toBe(false);
  });

  it("cache:size returns numeric size", () => {
    agent.runAgent({ action: "cache:clear", options: {} });
    agent.runAgent({ action: "cache:set", options: { key: "s1", value: 1 } });
    const result = agent.runAgent({ action: "cache:size", options: {} });
    expect(result.ok).toBe(true);
    expect(typeof result.size).toBe("number");
    expect(result.size).toBeGreaterThanOrEqual(1);
  });
});
