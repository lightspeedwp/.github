/**
 * Jest suite verifying the baseline behaviour of `footerUtils.js`.
 * @see ../footerUtils.js
 */
const fs = require("fs");
const { getRandomFooter, ensureFooter, footers } = require("../footerUtils");

jest.mock("fs");

describe("footerUtils", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("getRandomFooter returns a footer from the list", () => {
    const footer = getRandomFooter();
    expect(footers).toContain(footer);
  });

  test("ensureFooter replaces existing footer", () => {
    fs.readFileSync.mockReturnValue("Content\n" + footers[0]);
    fs.writeFileSync.mockImplementation(() => {});
    expect(ensureFooter("README.md")).toBe(true);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "README.md",
      expect.stringContaining("_"),
    );
  });

  test("ensureFooter appends if footer not present", () => {
    fs.readFileSync.mockReturnValue("Content\n");
    fs.writeFileSync.mockImplementation(() => {});
    expect(ensureFooter("README.md")).toBe(true);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
