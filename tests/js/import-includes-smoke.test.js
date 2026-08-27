import fs from "node:fs";
import path from "node:path";

const filesToValidate = [
  "scripts/agents/includes/check-template-labels.js",
  "scripts/agents/includes/label-sync.cjs",
  "scripts/agents/includes/build-labeling-report.js",
  "scripts/agents/includes/fetch-canonical-labels.js",
  "scripts/agents/includes/label-utils.js",
  "scripts/agents/includes/type-lookup.js",
  "scripts/agents/includes/yaml-parser.js",
  "scripts/agents/includes/yaml-validator.js",
  "scripts/agents/labeling.agent.js",
  "scripts/agents/project-meta-sync.agent.js",
];

const importRegex = /import\s+(?:[^'";]+\s+from\s+)?['"]([^'"]+)['"]/g;
const requireRegex = /require\(\s*['"]([^'"]+)['"]\s*\)/g;

function localImportTargets(source) {
  const matches = [];
  for (const regex of [importRegex, requireRegex]) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(source)) !== null) {
      const target = match[1];
      if (target.startsWith("./") || target.startsWith("../")) {
        matches.push(target);
      }
    }
  }
  return matches;
}

function resolveCandidate(baseDir, target) {
  const raw = path.resolve(baseDir, target);
  const candidates = [
    raw,
    `${raw}.js`,
    `${raw}.cjs`,
    `${raw}.mjs`,
    path.join(raw, "index.js"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

describe("workflow and agent JS import/include smoke validation", () => {
  test.each(filesToValidate)(
    "validates local imports/includes in %s",
    (filePath) => {
      const repoRoot = path.resolve(__dirname, "../..");
      const absolutePath = path.resolve(repoRoot, filePath);
      const source = fs.readFileSync(absolutePath, "utf8");
      const baseDir = path.dirname(absolutePath);

      const missing = localImportTargets(source)
        .map((target) => ({
          target,
          resolved: resolveCandidate(baseDir, target),
        }))
        .filter(({ resolved }) => !resolved)
        .map(({ target }) => target);

      expect(missing).toEqual([]);
    },
  );
});
