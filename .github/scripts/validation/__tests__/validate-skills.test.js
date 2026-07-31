const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const scriptPath = path.join(__dirname, "../validate-skills.js");

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "skills-validate-"));
  fs.mkdirSync(path.join(root, "skills"), { recursive: true });
  return root;
}

test("fails when a skill folder misses SKILL.md", () => {
  const root = makeRepo();
  fs.mkdirSync(path.join(root, "skills", "bad-skill"), { recursive: true });
  expect(() =>
    execFileSync(process.execPath, [scriptPath], {
      cwd: root,
      encoding: "utf8",
      stdio: "pipe",
    }),
  ).toThrow();
});
