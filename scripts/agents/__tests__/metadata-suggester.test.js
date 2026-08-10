import {
  generateSuggestions,
  formatSuggestionsForComment,
  shouldAutoApply,
  suggestCustomFields,
  generateGitHubPayload,
} from "../includes/metadata-suggester.js";

describe("Metadata Suggester", () => {
  const mockAnalysis = {
    type: { type: "type:bug", confidence: 85 },
    areas: [{ label: "area:backend", confidence: 80 }],
    priority: { level: "priority:important", confidence: 80 },
    assignees: [{ assignee: "@john", confidence: 85, reason: "mentioned" }],
    context: { project: "Q3 2026", milestone: "v2.1" },
    confidence: { overall: 80 },
  };

  it("generates suggestions with confidence filtering", () => {
    const result = generateSuggestions(mockAnalysis, 70);
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("areas");
  });

  it("formats suggestions for GitHub comment", () => {
    const result = generateSuggestions(mockAnalysis, 70);
    const markdown = formatSuggestionsForComment(result);
    expect(markdown).toContain("Type:");
  });

  it("determines auto-apply eligibility", () => {
    const result = shouldAutoApply(mockAnalysis, 85);
    expect(typeof result).toBe("boolean");
  });

  it("suggests custom fields", () => {
    const result = suggestCustomFields(mockAnalysis);
    expect(result).toHaveProperty("domain");
    expect(result).toHaveProperty("risk");
  });

  it("generates GitHub API payload", () => {
    const result = generateSuggestions(mockAnalysis, 70);
    const payload = generateGitHubPayload(result);
    expect(payload).toHaveProperty("labels");
  });
});
