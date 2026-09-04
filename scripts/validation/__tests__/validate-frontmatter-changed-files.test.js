jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
}));

const { execFileSync } = require("child_process");
const { FileDiscovery } = require("../validate-frontmatter");

describe("FileDiscovery.findChangedFiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("trims CRLF-delimited git diff output before filtering changed file paths", () => {
    execFileSync.mockReturnValue(
      "README.md\r\n.github/agents/test.md\r\nnode_modules/pkg/README.md\r\n",
    );

    const files = FileDiscovery.findChangedFiles(
      "abc123",
      "def456",
      ["**/*.md"],
      ["node_modules/**"],
      "/repo",
    );

    expect(files).toEqual([
      "/repo/.github/agents/test.md",
      "/repo/README.md",
    ]);
  });
});
