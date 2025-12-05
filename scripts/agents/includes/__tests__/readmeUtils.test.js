const fs = require("fs");
// ...existing code...
const {
  findReadmeFiles,
  ensureStringInFile,
  updateReadme,
} = require("../readmeUtils");

// Mock fs for safe testing
jest.mock("fs");

describe("readmeUtils", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("findReadmeFiles finds README.md recursively", () => {
    // TODO: Fix path format expectation - function returns 'README.md' but test expects './README.md'
    // Either update readmeUtils.findReadmeFiles() to prepend './' or adjust test expectation
    fs.readdirSync.mockReturnValue([
      { name: "README.md", isDirectory: () => false },
      { name: "src", isDirectory: () => true },
    ]);
    fs.readdirSync.mockImplementationOnce(() => [
      { name: "README.md", isDirectory: () => false },
      { name: "README2.md", isDirectory: () => false },
    ]);
    expect(findReadmeFiles(".")).toEqual(
      expect.arrayContaining(["./README.md", "./README2.md"]),
    );
  });

  test("ensureStringInFile appends string if missing", () => {
    fs.readFileSync.mockReturnValue("content");
    fs.appendFileSync.mockImplementation(() => {});
    expect(ensureStringInFile("test.md", "missing", "add this")).toBe(true);
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      "test.md",
      expect.stringContaining("add this"),
    );
  });

  test("updateReadme adds license badge and contributing link", () => {
    fs.readFileSync.mockReturnValue("# Title\nSome content");
    fs.writeFileSync.mockImplementation(() => {});
    expect(updateReadme("README.md")).toBe(true);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
