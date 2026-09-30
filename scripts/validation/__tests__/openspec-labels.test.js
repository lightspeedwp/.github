/**
 * Tests for OpenSpec Status Labels
 * Validates label configuration and lifecycle tracking against the
 * canonical taxonomy in .github/labels.yml (locked file — the source of
 * truth; this suite asserts its current 9-label OpenSpec scheme).
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('OpenSpec Status Labels', () => {
  let labelsConfig;

  beforeAll(() => {
    const labelsPath = path.join(__dirname, '..', '..', '..', '.github', 'labels.yml');
    const fileContent = fs.readFileSync(labelsPath, 'utf8');
    labelsConfig = yaml.load(fileContent);
  });

  const openspecLabels = () =>
    labelsConfig.filter((l) => l.name.startsWith("openspec:"));

  // Canonical scheme: name -> [color, description substring]. Mirrors
  // .github/labels.yml exactly; update both together via the label
  // governance process if the taxonomy changes.
  const CANONICAL = {
    "openspec:discovery": ["FBCA04", "discovery phase"],
    "openspec:planning": ["FF6600", "planning phase"],
    "openspec:specification-in-progress": ["FF6600", "actively worked on"],
    "openspec:specification-complete": ["FF6600", "specification finalized"],
    "openspec:implementation-pending": ["0052CC", "awaiting being built"],
    "openspec:implementation-in-progress": [
      "0052CC",
      "actively being built",
    ],
    "openspec:status-testing": ["9B00CC", "tested and validated"],
    "openspec:status-production": ["28A745", "production-ready"],
    "openspec:implementation-complete": ["6F42C1", "no longer active"],
  };

  describe("Label Configuration", () => {
    it("should have openspec labels defined", () => {
      expect(labelsConfig).toBeDefined();
      expect(Array.isArray(labelsConfig)).toBe(true);
    });

    it("should match the canonical OpenSpec taxonomy", () => {
      const names = openspecLabels().map((l) => l.name);
      expect(names.sort()).toEqual(Object.keys(CANONICAL).sort());
    });

    it.each(Object.entries(CANONICAL))(
      "should define %s with canonical color and description",
      (name, [color, snippet]) => {
        const label = labelsConfig.find((l) => l.name === name);
        expect(label).toBeDefined();
        expect(label.color).toBe(color);
        expect(label.description).toContain(snippet);
      },
    );
  });

  describe("Naming Convention", () => {
    it("should follow naming pattern: openspec:{phase}[-{status}]", () => {
      const pattern = /^openspec:[a-z]+(-[a-z]+)*$/;

      openspecLabels().forEach((label) => {
        expect(label.name).toMatch(pattern);
      });
    });

    it("should have proper descriptions", () => {
      openspecLabels().forEach((label) => {
        expect(label.description).toBeDefined();
        expect(label.description.length).toBeGreaterThan(0);
        expect(label.description.length).toBeLessThan(200);
      });
    });
  });

  describe("Phase Progression", () => {
    it("should cover the full lifecycle", () => {
      const names = openspecLabels().map((l) => l.name);
      for (const phase of [
        "discovery",
        "planning",
        "specification",
        "implementation",
        "testing",
        "production",
      ]) {
        expect(names.some((n) => n.includes(phase))).toBe(true);
      }
    });

    it("should track specification and implementation separately", () => {
      const names = openspecLabels().map((l) => l.name);
      expect(names).toContain("openspec:specification-complete");
      expect(names).toContain("openspec:implementation-in-progress");
    });
  });

  describe("Integration with Existing Labels", () => {
    it("should not conflict with existing type labels", () => {
      const typeLabels = labelsConfig.filter((l) => l.name.startsWith("type:"));

      const allNames = new Set();
      [...typeLabels, ...openspecLabels()].forEach((l) => {
        expect(allNames.has(l.name)).toBe(false);
        allNames.add(l.name);
      });
    });

    it('should be compatible with status labels', () => {
      const statusLabels = labelsConfig.filter((l) => l.name.startsWith('status:'));
      expect(statusLabels.length).toBeGreaterThan(0);

      // OpenSpec labels should be distinguishable from status labels
      const statusNames = statusLabels.map((l) => l.name);

      openspecLabels()
        .map((l) => l.name)
        .forEach((name) => {
          expect(statusNames).not.toContain(name);
        });
    });
  });

  describe("Documentation", () => {
    it("should have clear descriptions for each label", () => {
      const requiredTerms = ["Openspec", "phase", "component"];

      openspecLabels().forEach((label) => {
        const hasRelevantTerm = requiredTerms.some((term) =>
          label.description.includes(term),
        );
        expect(hasRelevantTerm).toBe(true);
      });
    });
  });

  describe("Lifecycle Tracking", () => {
    it("should enable tracking discovery through production flow", () => {
      const names = openspecLabels().map((l) => l.name);
      const flow = [
        "openspec:discovery",
        "openspec:planning",
        "openspec:specification-in-progress",
        "openspec:specification-complete",
        "openspec:implementation-pending",
        "openspec:implementation-in-progress",
        "openspec:status-testing",
        "openspec:status-production",
      ];

      flow.forEach((name) => {
        expect(names).toContain(name);
      });
    });

    it('should allow parallel specification and implementation tracking', () => {
      // An issue could have both a specification and implementation label
      const specLabel = labelsConfig.find((l) => l.name === 'openspec:specification-complete');
      const implLabel = labelsConfig.find((l) => l.name === 'openspec:implementation-in-progress');

      expect(specLabel).toBeDefined();
      expect(implLabel).toBeDefined();
      expect(specLabel.name).not.toEqual(implLabel.name);
    });
  });
});
