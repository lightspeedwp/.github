/**
 * Module system consistency checks for planner/reviewer agents.
 */

const fs = require("fs");
const path = require("path");

describe("agent module-system consistency", () => {
  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const plannerPath = path.join(repoRoot, "scripts/agents/planner.agent.cjs");
  const reviewerPath = path.join(repoRoot, "scripts/agents/reviewer.agent.js");
  const packageJsonPath = path.join(repoRoot, "package.json");

  test("package.json is configured for ESM", () => {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    expect(pkg.type).toBe("module");
  });

  test("planner and reviewer use ESM syntax consistently", () => {
    const planner = fs.readFileSync(plannerPath, "utf8");
    const reviewer = fs.readFileSync(reviewerPath, "utf8");

    for (const source of [planner, reviewer]) {
      expect(source).toMatch(/import\s+/);
      expect(source).toMatch(/export\s+\{\s*run/);
      expect(source).not.toMatch(/module\.exports\s*=|require\(/);
    }
  });
});
