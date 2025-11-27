// Minimal Jest test for yaml-parser.js

describe("yaml-parser", () => {
  it("should load without error", () => {
    expect(() =>
      require("../../scripts/awesome-copilot/yaml-parser"),
    ).not.toThrow();
  });
});
