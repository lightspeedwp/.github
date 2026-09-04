/**
 * Jest suite verifying the baseline behaviour of `project-meta-sync.agent.js`.
 * @see ../project-meta-sync.agent.js
 */

// Mock @actions/github since it's only available in GitHub Actions environment
jest.mock("@actions/github");
jest.mock("@actions/core");

const agent = require("../project-meta-sync.agent");

describe("project-meta-sync.agent", () => {
  it("exports a callable function", () => {
    expect(typeof agent).toBe("function");
  });

  it("does not execute run() on require (no LS_PROJECT_URL side-effect)", () => {
    // If the module-scope guard is absent, requiring the file calls run() immediately,
    // which throws "LS_PROJECT_URL not set" and sets process.exitCode = 1.
    expect(process.exitCode).not.toBe(1);
  });
});
