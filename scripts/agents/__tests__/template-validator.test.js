import {
  detectRequiredTemplate,
  checkRequiredSections,
  validateTemplate,
  generateRecommendations,
  generateTemplateFix,
  formatValidationComment,
} from "../includes/template-validator.js";

describe("Template Validator", () => {
  const validBody = `## Definition of Ready
- [x] Requirements clear
## Definition of Done
- [x] All tests pass`;

  it("detects required template by type", () => {
    const template = detectRequiredTemplate("type:feature");
    expect(template).toBeDefined();
    expect(template.requiredSections).toContain("## Definition of Ready");
  });

  it("checks required sections presence", () => {
    const result = checkRequiredSections(validBody, "type:feature");
    expect(result.present.length).toBeGreaterThan(0);
  });

  it("validates complete template", () => {
    const result = validateTemplate(validBody, "type:feature");
    expect(result).toHaveProperty("overview");
    expect(result).toHaveProperty("requiredSections");
  });

  it("generates recommendations for fixes", () => {
    const sections = { present: [], missing: ["## Definition of Ready"] };
    const sectionQuality = {};
    const recs = generateRecommendations(sections, sectionQuality);
    expect(Array.isArray(recs)).toBe(true);
  });

  it("generates template fix markdown", () => {
    const fix = generateTemplateFix("type:feature");
    expect(fix).toContain("## Definition of Ready");
  });

  it("formats validation as GitHub comment", () => {
    const validation = validateTemplate("No sections", "type:feature");
    const comment = formatValidationComment(validation);
    expect(comment).toContain("Completeness:");
  });
});
