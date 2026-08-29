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
    const fm = buildFrontmatter("Title", "Desc", "metrics", "2026-08-29", "my-repo");
    expect(fm.startsWith("---\n")).toBe(true);
    expect(fm).toContain("---\n\n");
  });

  it("includes all required frontmatter fields", () => {
    const fm = buildFrontmatter("My Title", "My Desc", "analysis", "2026-08-29", "my-repo");
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
      ["block-plugin", "block-theme", "control-plane", "platform", "unknown"].sort(),
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
      beforeEach(() => { report = tmpl(SAMPLE_CTX); });

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
});
