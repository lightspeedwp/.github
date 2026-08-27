/**
 * @jest-environment jsdom
 */
const path = require("path");
const { execSync } = require("child_process");

describe("Coderabbit YML Validation", () => {
  it("should validate a correct coderabbit.yml file", () => {
    const script = path.resolve(__dirname, "../validate-coderabbit-yml.cjs");
    const file = path.resolve(
      __dirname,
      "../__fixtures__/valid-coderabbit.yml",
    );
    const result = execSync(`node ${script} ${file}`, { encoding: "utf8" });
    expect(result).toMatch(/\.coderabbit\.yml is valid!/i);
  });

  it("should fail on an invalid coderabbit.yml file", () => {
    const script = path.resolve(__dirname, "../validate-coderabbit-yml.cjs");
    const file = path.resolve(
      __dirname,
      "../__fixtures__/invalid-coderabbit.yml",
    );
    let error = null;
    try {
      execSync(`node ${script} ${file}`, { encoding: "utf8" });
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
    expect(error.stdout).toMatch(/Invalid \.coderabbit\.yml/i);
    expect(error.stderr).toMatch(/Missing required top-level field: reviews/);
  });
});
