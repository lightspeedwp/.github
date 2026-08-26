const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const scriptPath = path.join(__dirname, "../validate-structure.js");

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "validate-structure-"));
}

function writeFile(filePath, content = "# Test\n") {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

describe("structure validation", () => {
  it("fails when required portable folders are missing", () => {
    const root = makeTempRoot();

    expect(() => {
      execFileSync(process.execPath, [scriptPath, "--root", root], {
        encoding: "utf8",
        stdio: "pipe",
      });
    }).toThrow(/Missing required directory: \.schemas/);
  });

  it("passes when required portable folders and README files exist", () => {
    const root = makeTempRoot();
    for (const folder of [
      ".schemas",
      "agents",
      "cookbook",
      "hooks",
      "instructions",
      "plugins",
      "skills",
      "workflows",
    ]) {
      writeFile(path.join(root, folder, "README.md"));
    }

    const output = execFileSync(process.execPath, [scriptPath, "--root", root], {
      encoding: "utf8",
    });

    expect(output).toMatch(/Structure validation passed/);
  });
});
