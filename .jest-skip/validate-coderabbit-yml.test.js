// validate-coderabbit-yml.test.js
// Jest test for validate-coderabbit-yml.cjs

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

describe("validate-coderabbit-yml.cjs", () => {
  const scriptPath = path.resolve(__dirname, "../validate-coderabbit-yml.cjs");
  const ymlPath = path.resolve(__dirname, "../../../.coderabbit.yml");
  const backupPath = ymlPath + ".bak";

  beforeAll(() => {
    // Backup the original .coderabbit.yml if it exists
    if (fs.existsSync(ymlPath)) {
      fs.copyFileSync(ymlPath, backupPath);
    }
    // Write a minimal valid .coderabbit.yml
    fs.writeFileSync(
      ymlPath,
      'reviews:\n  path_filters: ["src/"]\n  auto_review: true\n',
    );
  });

  afterAll(() => {
    // Restore the original .coderabbit.yml
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, ymlPath);
      fs.unlinkSync(backupPath);
    } else {
      fs.unlinkSync(ymlPath);
    }
  });

  it("validates a correct .coderabbit.yml and exits 0", () => {
    let output = "";
    expect(() => {
      output = execSync(`node ${scriptPath}`, { encoding: "utf8" });
    }).not.toThrow();
    expect(output).toMatch(/\.coderabbit\.yml is valid!/);
  });

  it("fails if required field is missing", () => {
    // Write an invalid .coderabbit.yml (missing reviews)
    fs.writeFileSync(ymlPath, "notreviews: true\n");
    let error = null;
    try {
      execSync(`node ${scriptPath}`, { encoding: "utf8", stdio: "pipe" });
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
    expect(error.stdout || error.message).toMatch(
      /Missing required top-level field: reviews/,
    );
  });
});
