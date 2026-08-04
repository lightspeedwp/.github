const { parseRelationshipHints } = require("../issue-pr-metadata.cjs");

describe("blocking relationship logic", () => {
  test("extracts blocked-by references from issue body", () => {
    const hints = parseRelationshipHints(
      ["Some issue content", "Blocked by: #1324, #1325", "More content"].join(
        "\n",
      ),
    );

    expect(hints.blockedByRefs).toEqual([1324, 1325]);
  });

  test("extracts blocks references from issue body", () => {
    const hints = parseRelationshipHints(
      ["Some issue content", "Blocks: #1400, #1401", "More content"].join("\n"),
    );

    expect(hints.blocksRefs).toEqual([1400, 1401]);
  });

  test("handles both blocks and blocked-by in same issue", () => {
    const hints = parseRelationshipHints(
      ["Description", "Blocks: #1400", "Blocked by: #1324", "Other stuff"].join(
        "\n",
      ),
    );

    expect(hints).toMatchObject({
      blocksRefs: [1400],
      blockedByRefs: [1324],
    });
  });

  test("returns hasBidirectionalBlocking flag when blocking relationships exist", () => {
    const hintsWithBlocking = parseRelationshipHints("Blocked by: #1324");
    const hintsWithoutBlocking = parseRelationshipHints(
      "Some content without blocking",
    );

    expect(hintsWithBlocking.hasBidirectionalBlocking).toBe(true);
    expect(hintsWithoutBlocking.hasBidirectionalBlocking).toBe(false);
  });

  test("handles multiple blockers correctly", () => {
    const hints = parseRelationshipHints(
      [
        "Issue description",
        "Blocked by: #100, #200, #300",
        "Blocks: #500",
      ].join("\n"),
    );

    expect(hints.blockedByRefs).toEqual([100, 200, 300]);
    expect(hints.blocksRefs).toEqual([500]);
    expect(hints.hasBidirectionalBlocking).toBe(true);
  });

  test("handles blocked-by with various whitespace", () => {
    const hints1 = parseRelationshipHints("Blocked by: #1324");
    const hints2 = parseRelationshipHints("Blocked by #1324");
    const hints3 = parseRelationshipHints("blocked by: #1324");

    expect(hints1.blockedByRefs).toEqual([1324]);
    expect(hints2.blockedByRefs).toEqual([1324]);
    expect(hints3.blockedByRefs).toEqual([1324]);
  });

  test("ignores invalid issue numbers", () => {
    const hints = parseRelationshipHints(
      ["Blocked by: #1324, #invalid, #999999999", "Blocks: #0, #-1"].join("\n"),
    );

    // Should only include valid positive integers
    expect(hints.blockedByRefs).toEqual([1324, 999999999]);
    expect(hints.blocksRefs).toEqual([]);
  });

  test("handles blocking relationships in markdown list format", () => {
    const issueBody = [
      "## Description",
      "Some issue description",
      "",
      "Blocked by: #1324",
      "Blocks: #1400, #1401",
    ].join("\n");

    const hints = parseRelationshipHints(issueBody);

    expect(hints.blockedByRefs).toEqual([1324]);
    expect(hints.blocksRefs).toEqual([1400, 1401]);
  });

  test("identifies blocking issues correctly", () => {
    const blockingIssueBody =
      "Blocks: #100, #200, #300\n\nThis issue blocks three other issues.";
    const nonBlockingIssueBody = "Some issue without blocking relationships";

    const blockingHints = parseRelationshipHints(blockingIssueBody);
    const nonBlockingHints = parseRelationshipHints(nonBlockingIssueBody);

    expect(blockingHints.blocksRefs).toEqual([100, 200, 300]);
    expect(blockingHints.hasBidirectionalBlocking).toBe(true);

    expect(nonBlockingHints.blocksRefs).toEqual([]);
    expect(nonBlockingHints.hasBidirectionalBlocking).toBe(false);
  });

  test("prevents both blocked and blocking issues from closing inappropriately", () => {
    const issueBlockedAndBlocking = [
      "Description",
      "Blocked by: #1000",
      "Blocks: #2000, #2001",
    ].join("\n");

    const hints = parseRelationshipHints(issueBlockedAndBlocking);

    // Issue is both blocked and blocking
    expect(hints.blockedByRefs).toEqual([1000]);
    expect(hints.blocksRefs).toEqual([2000, 2001]);
    expect(hints.hasBidirectionalBlocking).toBe(true);

    // Should not be allowed to close until:
    // 1. Its blocker (#1000) is closed, AND
    // 2. The issues it blocks (#2000, #2001) are closed
  });
});
