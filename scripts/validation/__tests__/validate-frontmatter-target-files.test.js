const fs = require("fs");
const os = require("os");
const path = require("path");

const { resolveCliTargetFiles } = require("../validate-frontmatter.js");

describe("resolveCliTargetFiles", () => {
  it("resolves relative files, de-duplicates, and skips missing files", () => {
    const tmpRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "frontmatter-targets-"),
    );
    const existing = path.join(tmpRoot, "README.md");
    fs.writeFileSync(existing, "# test");

    const result = resolveCliTargetFiles(
      ["README.md", existing, "missing.md"],
      tmpRoot,
    );

    expect(result).toEqual([existing]);
  });
});
