import fs from "node:fs";
import path from "node:path";

const filesToValidate = [
  ".github/scripts/agents/includes/check-template-labels.js",
  ".github/scripts/agents/includes/label-sync.js",
  ".github/scripts/agents/includes/build-labeling-report.js",
  ".github/scripts/agents/includes/fetch-canonical-labels.js",
  ".github/scripts/agents/includes/label-utils.js",
  ".github/scripts/agents/includes/type-lookup.js",
  ".github/scripts/agents/includes/yaml-parser.js",
  ".github/scripts/agents/includes/yaml-validator.js",
  ".github/scripts/agents/labeling.agent.js",
  ".github/scripts/agents/project-meta-sync.agent.js",
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
      const absolutePath = path.resolve(process.cwd(), filePath);
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
