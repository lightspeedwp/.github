const templateLoader = require("../skills/adr-template-loader");

describe("ADR Template Loader", () => {
  beforeEach(() => {
    templateLoader.clearTemplateCache();
  });

  describe("loadTemplate", () => {
    test("should load standard template", () => {
      const template = templateLoader.loadTemplate("standard");
      expect(template).toBeTruthy();
      expect(template).toContain("## Context");
      expect(template).toContain("## Decision");
      expect(template).toContain("## Rationale");
    });

    test("should load lightweight template", () => {
      const template = templateLoader.loadTemplate("lightweight");
      expect(template).toBeTruthy();
      expect(template).toContain("## Decision");
      expect(template).toContain("## Rationale");
      expect(template).toContain("## Consequences");
    });

    test("should load security template", () => {
      const template = templateLoader.loadTemplate("security");
      expect(template).toBeTruthy();
      expect(template).toContain("## Threat Model");
      expect(template).toContain("## Security Controls");
      expect(template).toContain("## Compliance & Standards");
    });

    test("should load infrastructure template", () => {
      const template = templateLoader.loadTemplate("infrastructure");
      expect(template).toBeTruthy();
      expect(template).toContain("## System Architecture");
      expect(template).toContain("## Scalability Analysis");
      expect(template).toContain("## Cost Impact");
    });

    test("should throw TemplateNotFoundError for invalid template", () => {
      expect(() => {
        templateLoader.loadTemplate("invalid");
      }).toThrow(templateLoader.TemplateNotFoundError);
    });

    test("should cache templates", () => {
      const template1 = templateLoader.loadTemplate("standard");
      const template2 = templateLoader.loadTemplate("standard");
      expect(template1).toBe(template2);
    });

    test("should clear cache", () => {
      const template1 = templateLoader.loadTemplate("standard");
      templateLoader.clearTemplateCache();
      const template2 = templateLoader.loadTemplate("standard");
      expect(template1).toEqual(template2);
      expect(template1.length).toBe(template2.length);
    });
  });

  describe("renderTemplate", () => {
    test("should render standard template with placeholders", () => {
      const rendered = templateLoader.renderTemplate("standard", {
        TITLE: "Use PostgreSQL",
        AUTHORS: "Alice, Bob",
        STATUS: "ACCEPTED",
      });

      expect(rendered).toContain("Use PostgreSQL");
      expect(rendered).toContain("Alice, Bob");
      expect(rendered).toContain("ACCEPTED");
    });

    test("should render lightweight template with placeholders", () => {
      const rendered = templateLoader.renderTemplate("lightweight", {
        TITLE: "Cache Strategy",
        DECISION: "Use Redis",
        RATIONALE: "Performance",
        CONSEQUENCES: "Added complexity",
      });

      expect(rendered).toContain("Cache Strategy");
      expect(rendered).toContain("Use Redis");
      expect(rendered).toContain("Performance");
      expect(rendered).toContain("Added complexity");
    });

    test("should use default placeholders when not provided", () => {
      const rendered = templateLoader.renderTemplate("standard");
      expect(rendered).toContain("Untitled Decision");
      expect(rendered).toContain("PROPOSED");
    });

    test("should throw TemplateNotFoundError for invalid template type", () => {
      expect(() => {
        templateLoader.renderTemplate("invalid");
      }).toThrow(templateLoader.TemplateNotFoundError);
    });
  });

  describe("substitutePlaceholders", () => {
    test("should substitute all placeholders", () => {
      const content = "Title: {TITLE}\nDate: {DATE}\nStatus: {STATUS}";
      const result = templateLoader.substitutePlaceholders(content, {
        TITLE: "My Decision",
        DATE: "2026-08-17",
        STATUS: "ACCEPTED",
      });

      expect(result).toContain("My Decision");
      expect(result).toContain("2026-08-17");
      expect(result).toContain("ACCEPTED");
    });

    test("should use default placeholders for missing values", () => {
      const content = "Title: {TITLE}";
      const result = templateLoader.substitutePlaceholders(content, {});
      expect(result).toContain("Untitled Decision");
    });

    test("should leave unrecognized placeholders unchanged", () => {
      const content = "Value: {UNKNOWN}";
      const result = templateLoader.substitutePlaceholders(content, {});
      expect(result).toContain("{UNKNOWN}");
    });
  });

  describe("getAvailableTemplates", () => {
    test("should return all valid templates", () => {
      const templates = templateLoader.getAvailableTemplates();

      expect(templates).toContain("standard");
      expect(templates).toContain("lightweight");
      expect(templates).toContain("security");
      expect(templates).toContain("infrastructure");
    });

    test("should not duplicate templates", () => {
      const templates = templateLoader.getAvailableTemplates();
      const unique = new Set(templates);
      expect(templates).toHaveLength(unique.size);
    });
  });

  describe("getTemplatePlaceholders", () => {
    test("should return all placeholders in standard template", () => {
      const placeholders = templateLoader.getTemplatePlaceholders("standard");

      expect(placeholders).toContain("TITLE");
      expect(placeholders).toContain("DATE");
      expect(placeholders).toContain("STATUS");
      expect(placeholders).toContain("AUTHORS");
    });

    test("should return placeholders in sorted order", () => {
      const placeholders = templateLoader.getTemplatePlaceholders("standard");
      const sorted = [...placeholders].sort();

      expect(placeholders).toEqual(sorted);
    });
  });

  describe("VALID_TEMPLATES constant", () => {
    test("should export VALID_TEMPLATES array", () => {
      expect(Array.isArray(templateLoader.VALID_TEMPLATES)).toBe(true);
      expect(templateLoader.VALID_TEMPLATES).toHaveLength(4);
    });

    test("should include all expected templates", () => {
      const expected = [
        "standard",
        "lightweight",
        "security",
        "infrastructure",
      ];
      expect(templateLoader.VALID_TEMPLATES).toEqual(expected);
    });
  });
});
