"use strict";

const {
  renderTemplate,
  TEMPLATES,
  buildFrontmatter,
  blockPluginTemplate,
  blockThemeTemplate,
  controlPlaneTemplate,
  platformTemplate,
  unknownTemplate,
} = require("../../lib/templates/repo-templates");

const SAMPLE_CTX = {
  repoName: "test-repo",
  owner: "lightspeedwp",
  date: "2026-08-29",
  period: "2026-08",
};

// ---------------------------------------------------------------------------
// buildFrontmatter
// ---------------------------------------------------------------------------

describe("buildFrontmatter", () => {
  it("produces valid YAML delimiters", () => {
    const fm = buildFrontmatter(
      "Title",
      "Desc",
      "metrics",
      "2026-08-29",
      "my-repo",
    );
    expect(fm.startsWith("---\n")).toBe(true);
    expect(fm).toContain("---\n\n");
  });

  it("includes all required frontmatter fields", () => {
    const fm = buildFrontmatter(
      "My Title",
      "My Desc",
      "analysis",
      "2026-08-29",
      "my-repo",
    );
    expect(fm).toContain('title: "My Title"');
    expect(fm).toContain('description: "My Desc"');
    expect(fm).toContain("file_type: report");
    expect(fm).toContain("category: analysis");
    expect(fm).toContain('created_date: "2026-08-29"');
    expect(fm).toContain('repository: "my-repo"');
    expect(fm).toContain('authors: ["automation"]');
  });
});

// ---------------------------------------------------------------------------
// Template registry
// ---------------------------------------------------------------------------

describe("TEMPLATES registry", () => {
  it("contains all five expected keys", () => {
    expect(Object.keys(TEMPLATES).sort()).toEqual(
      [
        "block-plugin",
        "block-theme",
        "control-plane",
        "platform",
        "unknown",
      ].sort(),
    );
  });

  it("all values are functions", () => {
    for (const fn of Object.values(TEMPLATES)) {
      expect(typeof fn).toBe("function");
    }
  });
});

// ---------------------------------------------------------------------------
// renderTemplate
// ---------------------------------------------------------------------------

describe("renderTemplate", () => {
  it("delegates to the matching template function", () => {
    const result = renderTemplate("block-plugin", SAMPLE_CTX);
    expect(result).toContain("Plugin Health");
  });

  it("falls back to unknown template for unrecognised key", () => {
    const result = renderTemplate("non-existent-key", SAMPLE_CTX);
    expect(result).toContain("Development Activity");
    expect(result).not.toContain("Plugin Health");
  });
});

// ---------------------------------------------------------------------------
// Block Plugin Template
// ---------------------------------------------------------------------------

describe("blockPluginTemplate", () => {
  let report;

  beforeEach(() => {
    report = blockPluginTemplate(SAMPLE_CTX);
  });

  it("includes the report title with period", () => {
    expect(report).toContain("test-repo — Plugin Report (2026-08)");
  });

  it("includes repository link", () => {
    expect(report).toContain("https://github.com/lightspeedwp/test-repo");
  });

  it("includes Plugin Health section", () => {
    expect(report).toContain("## Plugin Health");
  });

  it("includes Block Inventory section", () => {
    expect(report).toContain("## Block Inventory");
  });

  it("includes Test Coverage section", () => {
    expect(report).toContain("## Test Coverage");
  });

  it("includes Security & Compliance section", () => {
    expect(report).toContain("## Security & Compliance");
  });

  it("includes Development Activity section", () => {
    expect(report).toContain("## Development Activity");
  });

  it("includes required frontmatter fields", () => {
    expect(report).toContain("file_type: report");
    expect(report).toContain('repository: "test-repo"');
  });

  it("uses period from ctx when provided", () => {
    const r = blockPluginTemplate({ ...SAMPLE_CTX, period: "2026-Q3" });
    expect(r).toContain("2026-Q3");
  });

  it("falls back period to date when not provided", () => {
    const { period: _p, ...ctxNoPeriod } = SAMPLE_CTX;
    const r = blockPluginTemplate(ctxNoPeriod);
    expect(r).toContain("2026-08-29");
  });
});

// ---------------------------------------------------------------------------
// Block Theme Template
// ---------------------------------------------------------------------------

describe("blockThemeTemplate", () => {
  let report;

  beforeEach(() => {
    report = blockThemeTemplate(SAMPLE_CTX);
  });

  it("includes the report title with period", () => {
    expect(report).toContain("test-repo — Theme Report (2026-08)");
  });

  it("includes Theme Health section", () => {
    expect(report).toContain("## Theme Health");
  });

  it("includes Template & Pattern Inventory section", () => {
    expect(report).toContain("## Template & Pattern Inventory");
  });

  it("includes Design System section", () => {
    expect(report).toContain("## Design System");
  });

  it("includes Accessibility Checks section", () => {
    expect(report).toContain("## Accessibility Checks");
  });

  it("includes Performance section", () => {
    expect(report).toContain("## Performance");
  });
});

// ---------------------------------------------------------------------------
// Control-Plane Template
// ---------------------------------------------------------------------------

describe("controlPlaneTemplate", () => {
  let report;

  beforeEach(() => {
    report = controlPlaneTemplate(SAMPLE_CTX);
  });

  it("includes Control-Plane in title", () => {
    expect(report).toContain("Control-Plane Report");
  });

  it("includes Agent & Automation Health section", () => {
    expect(report).toContain("## Agent & Automation Health");
  });

  it("includes Workflow Activity section", () => {
    expect(report).toContain("## Workflow Activity");
  });

  it("includes Issue & PR Metrics section", () => {
    expect(report).toContain("## Issue & PR Metrics");
  });

  it("includes Test Coverage section", () => {
    expect(report).toContain("## Test Coverage");
  });

  it("includes Security & Compliance section", () => {
    expect(report).toContain("## Security & Compliance");
  });
});

// ---------------------------------------------------------------------------
// Platform Template
// ---------------------------------------------------------------------------

describe("platformTemplate", () => {
  let report;

  beforeEach(() => {
    report = platformTemplate(SAMPLE_CTX);
  });

  it("includes Platform Report in title", () => {
    expect(report).toContain("Platform Report");
  });

  it("includes Infrastructure Health section", () => {
    expect(report).toContain("## Infrastructure Health");
  });

  it("includes Deployment Activity section", () => {
    expect(report).toContain("## Deployment Activity");
  });

  it("includes Security section", () => {
    expect(report).toContain("## Security");
  });
});

// ---------------------------------------------------------------------------
// Unknown / Generic Template
// ---------------------------------------------------------------------------

describe("unknownTemplate", () => {
  let report;

  beforeEach(() => {
    report = unknownTemplate(SAMPLE_CTX);
  });

  it("includes the report title", () => {
    expect(report).toContain("test-repo — Report (2026-08)");
  });

  it("includes Development Activity section", () => {
    expect(report).toContain("## Development Activity");
  });

  it("includes Next Steps section", () => {
    expect(report).toContain("## Next Steps");
  });

  it("does NOT include Plugin Health section", () => {
    expect(report).not.toContain("## Plugin Health");
  });

  it("does NOT include Theme Health section", () => {
    expect(report).not.toContain("## Theme Health");
  });
});

// ---------------------------------------------------------------------------
// Shared template properties
// ---------------------------------------------------------------------------

describe("all templates share common properties", () => {
  const templates = [
    blockPluginTemplate,
    blockThemeTemplate,
    controlPlaneTemplate,
    platformTemplate,
    unknownTemplate,
  ];

  for (const tmpl of templates) {
    describe(`${tmpl.name}`, () => {
      let report;
      beforeEach(() => {
        report = tmpl(SAMPLE_CTX);
      });

      it("starts with YAML frontmatter", () => {
        expect(report.startsWith("---\n")).toBe(true);
      });

      it("includes Blockers & Risks section", () => {
        expect(report).toContain("## Blockers & Risks");
      });

      it("includes Next Steps section", () => {
        expect(report).toContain("## Next Steps");
      });

      it("includes Reporting Agent v2 attribution", () => {
        expect(report).toContain("Reporting Agent v2");
      });

      it("includes the generated date", () => {
        expect(report).toContain(SAMPLE_CTX.date);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Additional edge cases and comprehensive coverage
  // ---------------------------------------------------------------------------

  describe("edge cases and context handling", () => {
    it("handles missing optional context fields", () => {
      const minimalCtx = {
        repoName: "minimal-repo",
      };
      const result = blockPluginTemplate(minimalCtx);
      expect(result).toContain("minimal-repo");
    });

    it("handles empty context values gracefully", () => {
      const emptyCtx = {
        repoName: "",
        owner: "",
        date: "",
        period: "",
      };
      const result = blockPluginTemplate(emptyCtx);
      expect(result).toContain("---");
    });

    it("renders all template types without errors", () => {
      const templates = [
        blockPluginTemplate,
        blockThemeTemplate,
        controlPlaneTemplate,
        platformTemplate,
        unknownTemplate,
      ];

      for (const tmpl of templates) {
        expect(() => tmpl(SAMPLE_CTX)).not.toThrow();
      }
    });

    it("produces valid YAML frontmatter structure", () => {
      const report = blockPluginTemplate(SAMPLE_CTX);
      const lines = report.split("\n");

      expect(lines[0]).toBe("---");
      let endDelimiterFound = false;

      for (let i = 1; i < lines.length; i++) {
        if (lines[i] === "---") {
          endDelimiterFound = true;
          break;
        }
      }

      expect(endDelimiterFound).toBe(true);
    });

    it("includes repository link in all templates", () => {
      const templates = [
        blockPluginTemplate,
        blockThemeTemplate,
        controlPlaneTemplate,
        platformTemplate,
        unknownTemplate,
      ];

      for (const tmpl of templates) {
        const report = tmpl(SAMPLE_CTX);
        expect(report).toContain("lightspeedwp/test-repo");
      }
    });

    it("includes all frontmatter required fields", () => {
      const report = blockPluginTemplate(SAMPLE_CTX);
      expect(report).toContain("file_type:");
      expect(report).toContain("created_date:");
      expect(report).toContain("repository:");
      expect(report).toContain("authors:");
    });

    it("handles special characters in repository name", () => {
      const ctx = {
        ...SAMPLE_CTX,
        repoName: "repo-with-dashes_and_underscores",
      };
      const report = blockPluginTemplate(ctx);
      expect(report).toContain("repo-with-dashes_and_underscores");
    });

    it("preserves markdown structure in all templates", () => {
      const templates = [
        blockPluginTemplate,
        blockThemeTemplate,
        controlPlaneTemplate,
        platformTemplate,
        unknownTemplate,
      ];

      for (const tmpl of templates) {
        const report = tmpl(SAMPLE_CTX);
        // Should have at least one h2 header
        expect(report).toMatch(/^##\s/m);
      }
    });

    it("blockPluginTemplate specific sections", () => {
      const report = blockPluginTemplate(SAMPLE_CTX);
      expect(report).toContain("## Plugin Health");
      expect(report).toContain("## Block Inventory");
      expect(report).toContain("## Test Coverage");
      expect(report).toContain("## Security & Compliance");
    });

    it("blockThemeTemplate specific sections", () => {
      const report = blockThemeTemplate(SAMPLE_CTX);
      expect(report).toContain("## Theme Health");
      expect(report).toContain("## Template & Pattern Inventory");
      expect(report).toContain("## Design System");
      expect(report).toContain("## Accessibility Checks");
      expect(report).toContain("## Performance");
    });

    it("controlPlaneTemplate specific sections", () => {
      const report = controlPlaneTemplate(SAMPLE_CTX);
      expect(report).toContain("## Agent & Automation Health");
      expect(report).toContain("## Workflow Activity");
      expect(report).toContain("## Issue & PR Metrics");
    });

    it("platformTemplate specific sections", () => {
      const report = platformTemplate(SAMPLE_CTX);
      expect(report).toContain("## Infrastructure Health");
      expect(report).toContain("## Deployment Activity");
      expect(report).toContain("## Security");
    });

    it("unknownTemplate has generic sections", () => {
      const report = unknownTemplate(SAMPLE_CTX);
      expect(report).toContain("## Development Activity");
      expect(report).toContain("## Next Steps");
    });

    it("templates include period in title when provided", () => {
      const ctxWithPeriod = { ...SAMPLE_CTX, period: "2026-Q2" };
      const report = blockPluginTemplate(ctxWithPeriod);
      expect(report).toContain("2026-Q2");
    });

    it("templates fall back to date when period not provided", () => {
      const ctxNoperiod = { ...SAMPLE_CTX };
      delete ctxNoperiod.period;
      const report = blockPluginTemplate(ctxNoperiod);
      expect(report).toContain(SAMPLE_CTX.date);
    });

    it("renderTemplate returns consistent output for same input", () => {
      const result1 = renderTemplate("block-plugin", SAMPLE_CTX);
      const result2 = renderTemplate("block-plugin", SAMPLE_CTX);
      expect(result1).toBe(result2);
    });

    it("TEMPLATES registry includes all expected templates", () => {
      const templateNames = Object.keys(TEMPLATES);
      expect(templateNames).toContain("block-plugin");
      expect(templateNames).toContain("block-theme");
      expect(templateNames).toContain("control-plane");
      expect(templateNames).toContain("platform");
      expect(templateNames).toContain("unknown");
    });
  });
});
