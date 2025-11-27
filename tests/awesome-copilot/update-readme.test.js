// Minimal Jest test for update-readme.js

describe("update-readme", () => {
  it("should load without error", () => {
    expect(() =>
      require("../../scripts/awesome-copilot/update-readme"),
    ).not.toThrow();
  });
});
