const {
  stripHtmlComments,
  sectionBody,
  hasIssueReference,
  hasChangelogEntry,
  hasCompletedChecklist,
  extractIssueNumbers,
  extractClosingIssueNumbers,
  validatePullRequestBody,
} = require("../template-helpers.cjs");

describe("stripHtmlComments", () => {
  it("removes single-line HTML comments", () => {
    expect(stripHtmlComments("text <!-- comment --> more")).toBe("text  more");
  });

  it("removes multi-line HTML comments", () => {
    const text = "start <!-- multi\nline\ncomment --> end";
    expect(stripHtmlComments(text)).toBe("start  end");
  });

  it("removes multiple comments", () => {
    expect(stripHtmlComments("<!-- a -->text<!-- b -->more")).toBe("textmore");
  });

  it("handles empty string", () => {
    expect(stripHtmlComments("")).toBe("");
  });

  it("handles null/undefined", () => {
    expect(stripHtmlComments(null)).toBe("");
    expect(stripHtmlComments(undefined)).toBe("");
  });

  it("preserves text without comments", () => {
    expect(stripHtmlComments("no comments here")).toBe("no comments here");
  });
});

describe("sectionBody", () => {
  it("extracts content between headings", () => {
    const body = "## Linked issues\nFixes #123\n## Changelog\nAdded feature";
    expect(sectionBody(body, /^##\s+Linked issues\s*$/im)).toContain(
      "Fixes #123",
    );
  });

  it("handles CRLF line endings", () => {
    const body = "## Test\r\nContent\r\n## Next";
    const result = sectionBody(body, /^##\s+Test\s*$/im);
    expect(result).toContain("Content");
  });

  it("returns empty string if heading not found", () => {
    const body = "## Section A\nContent";
    expect(sectionBody(body, /^##\s+Missing Heading\s*$/im)).toBe("");
  });

  it("trims whitespace from extracted content", () => {
    const body = "## Test\n   Trimmed content   \n## Next";
    const result = sectionBody(body, /^##\s+Test\s*$/im);
    expect(result).toBe("Trimmed content");
  });

  it("handles heading at end of document", () => {
    const body = "## First\nContent1\n## Last\nContent2";
    expect(sectionBody(body, /^##\s+Last\s*$/im)).toContain("Content2");
  });

  it("handles null/undefined body", () => {
    expect(sectionBody(null, /test/)).toBe("");
    expect(sectionBody(undefined, /test/)).toBe("");
  });
});

describe("hasIssueReference", () => {
  it("detects #number references", () => {
    expect(hasIssueReference("Fixes #123")).toBe(true);
  });

  it("detects keyword-prefixed references", () => {
    expect(hasIssueReference("closes #456")).toBe(true);
    expect(hasIssueReference("fixes #789")).toBe(true);
    expect(hasIssueReference("resolves #111")).toBe(true);
    expect(hasIssueReference("relates to #222")).toBe(true);
  });

  it("detects bullet-prefixed references", () => {
    expect(hasIssueReference("- #123")).toBe(true);
    expect(hasIssueReference("* #456")).toBe(true);
  });

  it("case-insensitive keyword detection", () => {
    expect(hasIssueReference("FIXES #123")).toBe(true);
    expect(hasIssueReference("Closes #456")).toBe(true);
  });

  it("detects references in multiline text at line start", () => {
    expect(hasIssueReference("line 1\n#123\nline 3")).toBe(true);
  });

  it("detects references with line-initial whitespace", () => {
    expect(hasIssueReference("line 1\n  #456\nline 3")).toBe(true);
  });

  it("ignores HTML comments", () => {
    expect(hasIssueReference("<!-- #123 -->")).toBe(false);
  });

  it("returns false for no references", () => {
    expect(hasIssueReference("no issue here")).toBe(false);
    expect(hasIssueReference("")).toBe(false);
  });

  it("detects issue at document start", () => {
    expect(hasIssueReference("#999")).toBe(true);
  });

  it("detects cross-repo references (owner/repo#number)", () => {
    expect(hasIssueReference("Closes lightspeedwp/.github#1393")).toBe(true);
    expect(hasIssueReference("Fixes org/repo#456")).toBe(true);
    expect(hasIssueReference("lightspeedwp/.github#1087")).toBe(true);
  });

  it("detects cross-repo references with closing keywords", () => {
    expect(hasIssueReference("Relates to lightspeedwp/.github#1079")).toBe(
      true,
    );
    expect(hasIssueReference("resolves org/repo#100")).toBe(true);
  });

  it("detects full GitHub issue/PR URLs", () => {
    expect(hasIssueReference("https://github.com/org/repo/issues/123")).toBe(
      true,
    );
    expect(hasIssueReference("https://github.com/org/repo/pull/456")).toBe(
      true,
    );
  });
});

describe("hasChangelogEntry", () => {
  it("detects bullet-point changelog entries", () => {
    expect(hasChangelogEntry("- Added new feature")).toBe(true);
    expect(hasChangelogEntry("* Fixed bug")).toBe(true);
  });

  it("rejects placeholder entries", () => {
    expect(hasChangelogEntry("- [placeholder]")).toBe(false);
    expect(hasChangelogEntry("- [ placeholder ]")).toBe(false);
  });

  it("accepts entries with content after placeholder", () => {
    expect(hasChangelogEntry("- [placeholder] real entry")).toBe(false); // Still placeholder format
  });

  it("detects entries with leading whitespace", () => {
    expect(hasChangelogEntry("  - Added feature")).toBe(true);
  });

  it("detects entries in multiline text", () => {
    expect(hasChangelogEntry("line 1\n- Added feature\nline 3")).toBe(true);
  });

  it("ignores HTML comments", () => {
    expect(hasChangelogEntry("<!-- - Real entry -->")).toBe(false);
  });

  it("returns false for empty text", () => {
    expect(hasChangelogEntry("")).toBe(false);
  });

  it("requires non-whitespace content", () => {
    expect(hasChangelogEntry("- ")).toBe(false);
    expect(hasChangelogEntry("-    ")).toBe(false);
  });
});

describe("hasCompletedChecklist", () => {
  it("detects fully checked checklists", () => {
    expect(hasCompletedChecklist("- [x] First\n- [x] Second")).toBe(true);
    expect(hasCompletedChecklist("- [X] Uppercase X")).toBe(true);
  });

  it("rejects partially checked checklists", () => {
    expect(hasCompletedChecklist("- [x] Checked\n- [ ] Unchecked")).toBe(false);
  });

  it("rejects fully unchecked checklists", () => {
    expect(hasCompletedChecklist("- [ ] First\n- [ ] Second")).toBe(false);
  });

  it("rejects empty checklists", () => {
    expect(hasCompletedChecklist("No checkboxes here")).toBe(false);
  });

  it("ignores HTML comments", () => {
    expect(hasCompletedChecklist("<!-- - [x] Hidden -->")).toBe(false);
  });

  it("handles checklists with leading whitespace", () => {
    expect(hasCompletedChecklist("  - [x] Item 1\n  - [x] Item 2")).toBe(true);
  });

  it("returns false for empty text", () => {
    expect(hasCompletedChecklist("")).toBe(false);
  });
});

describe("extractIssueNumbers", () => {
  it("extracts closing issue numbers", () => {
    const text = "Closes #123";
    expect(extractIssueNumbers(text)).toEqual([123]);
  });

  it("extracts multiple issue numbers", () => {
    const text = "Closes #123\nFixes #456\nRelates to #789";
    const result = extractIssueNumbers(text);
    expect(result).toContain(123);
    expect(result).toContain(456);
    expect(result).toContain(789);
  });

  it("handles duplicate issue numbers", () => {
    const text = "Closes #123\nRelates to #123";
    const result = extractIssueNumbers(text);
    expect(result).toEqual([123]);
  });

  it("ignores HTML comments", () => {
    const text = "Closes #123 <!-- #456 -->";
    const result = extractIssueNumbers(text);
    expect(result).toEqual([123]);
  });

  it("returns empty array for no issues", () => {
    const text = "No issues here";
    expect(extractIssueNumbers(text)).toEqual([]);
  });
});

describe("extractClosingIssueNumbers", () => {
  it("extracts only closing issue numbers", () => {
    const text = "Closes #123\nRelates to #456";
    const result = extractClosingIssueNumbers(text);
    expect(result).toContain(123);
    expect(result).not.toContain(456);
  });

  it("handles various closing keywords", () => {
    const text = "Closes #123\nFixes #456\nResolves #789";
    const result = extractClosingIssueNumbers(text);
    expect(result).toContain(123);
    expect(result).toContain(456);
    expect(result).toContain(789);
  });

  it("case-insensitive keyword detection", () => {
    const text = "closes #123\nFIXES #456";
    const result = extractClosingIssueNumbers(text);
    expect(result).toContain(123);
    expect(result).toContain(456);
  });

  it("ignores 'relates to' keyword", () => {
    const text = "Relates to #123\nCloses #456";
    const result = extractClosingIssueNumbers(text);
    expect(result).not.toContain(123);
    expect(result).toContain(456);
  });

  it("returns empty array for only relates to", () => {
    const text = "Relates to #123\nRelates to #456";
    expect(extractClosingIssueNumbers(text)).toEqual([]);
  });
});

describe("validatePullRequestBody", () => {
  const sampleBody = `## Linked issues
Fixes #123

## Changelog
- Added new feature

### Checklist (Global DoD / PR)
- [x] Code complete
- [x] Tests pass`;

  it("validates complete PR body", () => {
    const labels = [];
    const result = validatePullRequestBody(sampleBody, labels, "feature/test");
    expect(result.missing).toEqual([]);
  });

  it("detects missing Linked issues section", () => {
    const body = `## Changelog\n- Added feature\n### Checklist (Global DoD / PR)\n- [x] Done`;
    const result = validatePullRequestBody(body, [], "feature/test");
    expect(result.missing).toContain("Linked issues");
  });

  it("detects missing Changelog section", () => {
    const body = `## Linked issues\nFixes #123\n### Checklist (Global DoD / PR)\n- [x] Done`;
    const result = validatePullRequestBody(body, [], "feature/test");
    expect(result.missing).toContain("Changelog");
  });

  it("skips changelog validation with meta:no-changelog label", () => {
    const body = `## Linked issues\nFixes #123\n### Checklist (Global DoD / PR)\n- [x] Done`;
    const labels = [{ name: "meta:no-changelog" }];
    const result = validatePullRequestBody(body, labels, "feature/test");
    expect(result.missing).not.toContain("Changelog");
  });

  it("detects missing Global DoD checklist", () => {
    const body = `## Linked issues\nFixes #123\n## Changelog\n- Added feature`;
    const result = validatePullRequestBody(body, [], "feature/test");
    expect(result.missing).toContain("Global DoD checklist");
  });

  it('uses "Linked issues & merged PRs" for release branches', () => {
    const body = `## Linked issues & merged PRs\nFixes #123\n## Changelog\n- Feature\n### Checklist (Global DoD / PR)\n- [x] Done`;
    const result = validatePullRequestBody(body, [], "release/v1.0.0");
    expect(result.missing).not.toContain("Linked issues & merged PRs");
  });

  it("handles multiple missing sections", () => {
    const body = "Some content";
    const result = validatePullRequestBody(body, [], "feature/test");
    expect(result.missing.length).toBeGreaterThan(0);
  });

  it("handles null labels", () => {
    const result = validatePullRequestBody(sampleBody, null, "feature/test");
    expect(result.missing).toEqual([]);
  });

  it("handles empty head ref as non-release branch", () => {
    const result = validatePullRequestBody(sampleBody, [], "");
    expect(result.missing).toEqual([]);
  });
});
