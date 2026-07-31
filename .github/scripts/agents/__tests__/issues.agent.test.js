/**
 * Jest suite verifying the baseline behaviour of `issues.agent.js`.
 * @see ../issues.agent.js
 */
// Basic smoke test for issues.agent.js
const path = require("path");
const { spawnSync } = require("child_process");

describe("issues.agent", () => {
  it("should load as an ESM module in Node", () => {
    const modulePath = path.resolve(__dirname, "../issues.agent.js");
    const script = `import(${JSON.stringify(modulePath)}).then(() => process.exit(0)).catch(() => process.exit(1));`;
    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", script],
      {
        encoding: "utf8",
      },
    );
    expect(result.status).toBe(0);
  });
});
