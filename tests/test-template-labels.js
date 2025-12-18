/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const labelsYaml = yaml.load(
  fs.readFileSync(path.resolve(".github/labels.yml"), "utf8"),
);
const labels = new Set(Object.keys(labelsYaml.labels || {}));

function findTemplates(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
    .map((f) => path.join(dir, f));
}

const templatesDir = path.resolve(".github/ISSUE_TEMPLATE");
const templates = fs.existsSync(templatesDir)
  ? findTemplates(templatesDir)
  : [];

let failed = false;

for (const file of templates) {
  const tpl = yaml.load(fs.readFileSync(file, "utf8"));
  const declared = new Set(tpl.labels || []);
  for (const l of declared) {
    if (!labels.has(l)) {
      console.error(`[ERROR] ${file} references non-canonical label: ${l}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("[OK] All template labels exist in automation/labels.yml");
