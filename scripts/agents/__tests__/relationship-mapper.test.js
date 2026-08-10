import {
  parseRelationships,
  validateRelationships,
  formatRelationships,
  generateRelationshipGraph,
  formatValidationComment,
  suggestRelationshipFixes,
} from "../includes/relationship-mapper.js";

describe("Relationship Mapper", () => {
  it("parses parent issue reference", () => {
    const body = "Parent: #123";
    const result = parseRelationships(body);
    expect(result.parent).toBe(123);
  });

  it("parses blocked-by relationships", () => {
    const body = "Blocked by: #100\nAlso blocked by: #101";
    const result = parseRelationships(body);
    expect(result.blockedBy).toContain(100);
    expect(result.blockedBy).toContain(101);
  });

  it("parses blocking relationships", () => {
    const body = "Blocks: #300";
    const result = parseRelationships(body);
    expect(result.blocking).toContain(300);
  });

  it("validates relationships", () => {
    const relationships = {
      parent: 100,
      blockedBy: [],
      blocking: [],
    };
    const result = validateRelationships(relationships);
    expect(result).toHaveProperty("isValid");
    expect(result).toHaveProperty("issues");
  });

  it("detects circular dependencies", () => {
    const relationships = {
      parent: 123,
      blockedBy: [123],
      blocking: [],
    };
    const result = validateRelationships(relationships);
    expect(result.isValid).toBe(false);
  });

  it("formats relationships for display", () => {
    const relationships = {
      parent: 123,
      blockedBy: [],
      blocking: [],
    };
    const formatted = formatRelationships(relationships);
    expect(formatted).toContain("Parent:");
  });

  it("generates relationship graph", () => {
    const relationships = { parent: 100, blockedBy: [], blocking: [] };
    const graph = generateRelationshipGraph(123, relationships);
    expect(graph.issue).toBe(123);
    expect(graph.parent).toBe(100);
  });

  it("formats validation comment", () => {
    const relationships = { parent: null, blockedBy: [], blocking: [] };
    const validation = validateRelationships(relationships);
    const comment = formatValidationComment(validation);
    expect(comment).toContain("✅");
  });

  it("suggests relationship fixes", () => {
    const relationships = { parent: 123, blockedBy: [123], blocking: [] };
    const validation = validateRelationships(relationships);
    const fixes = suggestRelationshipFixes(validation);
    expect(Array.isArray(fixes)).toBe(true);
  });
});
