/**
 * Tests for sync-version utility (shim remains in scripts/utility).
 * Moved from `tests/utility/sync-version.test.js`.
 * TODO: Expand with assertions validating semantic version sync behavior.
 */
const fs = require("fs");
const path = require("path");

describe("sync-version (canonical includes)", () => {
  it("loads without error", () => {
    // Mock fs.existsSync to avoid VERSION file check
    const mockExistSync = jest.spyOn(fs, "existsSync").mockReturnValue(true);
    const mockReadFile = jest
      .spyOn(fs, "readFileSync")
      .mockImplementation((filePath) => {
        if (filePath.endsWith("VERSION")) {
          return "1.0.0";
        }
        if (filePath.endsWith("package.json")) {
          return JSON.stringify({ version: "1.0.0" });
        }
        return "{}";
      });

    expect(() => require("../sync-version.js")).not.toThrow();

    mockExistSync.mockRestore();
    mockReadFile.mockRestore();
  });
});
