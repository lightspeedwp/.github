const fs = require("fs");
const os = require("os");
const path = require("path");

const { resolveCliTargetFiles } = require("../validate-frontmatter.js");

describe("resolveCliTargetFiles", () => {
  let tmpRoot;

  afterEach(() => {
    if (tmpRoot) {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
      tmpRoot = null;
    }
  });

  it("resolves relative files, de-duplicates, and skips missing files", () => {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "frontmatter-targets-"));
    const existing = path.join(tmpRoot, "README.md");
    fs.writeFileSync(existing, "# test");

    const result = resolveCliTargetFiles(
      ["README.md", existing, "missing.md"],
      tmpRoot,
    );

    expect(result).toEqual([existing]);
  });

  it("returns empty array when fileArgs is not an array", () => {
    expect(resolveCliTargetFiles(null, "/tmp")).toEqual([]);
  });

  it("returns empty array for an empty file list", () => {
    expect(resolveCliTargetFiles([], "/tmp")).toEqual([]);
  });
});
