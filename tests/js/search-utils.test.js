import {
  matchesSearchQuery,
  rankSearchItems,
} from "../../website/src/scripts/search-utils.js";

describe("search-utils", () => {
  test("matches queries across punctuation and casing", () => {
    const fields = ["Open Source", "Reusable prompts", "WordPress tools"];

    expect(matchesSearchQuery(fields, "open-source")).toBe(true);
    expect(matchesSearchQuery(fields, "OPEN source")).toBe(true);
    expect(matchesSearchQuery(fields, "open policies")).toBe(false);
  });

  test("ranks stronger name matches ahead of weaker description matches", () => {
    const items = [
      {
        name: "Open source governance",
        description: "A page about policies",
        cat: "instructions",
        tags: ["open", "source"],
      },
      {
        name: "Governance guide",
        description: "Source notes for policy owners",
        cat: "instructions",
        tags: ["policy"],
      },
      {
        name: "Search helpers",
        description: "Utility functions for filtering entries",
        cat: "tools",
        tags: ["search", "utility"],
      },
    ];

    const results = rankSearchItems(items, "open source");

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe("Open source governance");
    expect(results[1].name).toBe("Governance guide");
  });
});
