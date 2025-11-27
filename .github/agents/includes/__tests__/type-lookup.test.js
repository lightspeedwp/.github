/**
 * Tests for type-lookup utility functions.
 */
const { buildTypeAliasMap, findStandardType } = require("../type-lookup");

describe("type-lookup.js", () => {
  const types = [
    { name: "Bug", label: "type:bug" },
    { name: "Feature", label: "type:feature" },
    { name: "Task", label: "type:task" },
    { name: "Refactor", label: "type:refactor" },
  ];
  const aliasMap = buildTypeAliasMap(types);

  test("finds canonical type for direct match", () => {
    expect(findStandardType("type:bug", aliasMap)).toBe("type:bug");
    expect(findStandardType("type:feature", aliasMap)).toBe("type:feature");
  });

  test("finds canonical type for alias match", () => {
    expect(findStandardType("bug", aliasMap)).toBe("type:bug");
    expect(findStandardType("Feature", aliasMap)).toBe("type:feature");
    expect(findStandardType("task", aliasMap)).toBe("type:task");
  });

  test("returns null for unknown type", () => {
    expect(findStandardType("foo", aliasMap)).toBeNull();
  });
});
