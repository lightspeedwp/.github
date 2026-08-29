#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import matter from "gray-matter";
import micromatch from "micromatch";
import YAML from "js-yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readJSON(p) {
  return JSON.parse(await fs.readFile(p, "utf8"));
}
async function readText(p) {
  return await fs.readFile(p, "utf8");
}

function loadConfig() {
  const cfgPath = path.join(process.cwd(), "metrics/metrics.config.json");
  return readJSON(cfgPath);
}

async function listFiles(includeGlobs, excludeGlobs) {
  const matches = await glob("**/*", { dot: true, nodir: true });
  const included = micromatch(matches, includeGlobs);
  return micromatch.not(included, excludeGlobs);
}

function getCategoryForPath(fp) {
  if (fp.startsWith(".github/ISSUE_TEMPLATE/")) return "issue_template";
  if (fp.startsWith(".github/PULL_REQUEST_TEMPLATE/")) return "pr_template";
  if (fp.startsWith(".github/DISCUSSION_TEMPLATE/"))
    return "discussion_template";
  return "md";
}

function extractFrontmatterMD(text) {
  // gray-matter handles '---' fenced YAML
  const fm = matter(text);
  if (!fm.data || Object.keys(fm.data).length === 0) return { data: null };
  return { data: fm.data };
}

function extractFrontmatterYAML(text) {
  // For *.yml templates that are entirely YAML (no fences)
  try {
    const data = YAML.load(text);
    if (data && typeof data === "object") return { data };
  } catch (e) {
    // Log YAML parsing errors for debugging, but continue gracefully.
    console.error("YAML parsing error in extractFrontmatterYAML:", e);
  }
  return { data: null };
}

async function loadSchemaAndValidator() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const schemaPath = path.join(
    process.cwd(),
    "schemas/frontmatter.schema.json",
  );
  const schema = await readJSON(schemaPath);
  const validate = ajv.compile(schema);
  return { validate, schema };
}

async function readRepoVersion(versionPath) {
  try {
    const txt = await readText(path.join(process.cwd(), versionPath));
    return txt.trim();
  } catch {
    return null;
  }
}

function semverCompare(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return 1;
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return -1;
  }
  return 0;
}

function collectReferences(obj) {
  const refs = obj?.references;
  if (!Array.isArray(refs)) return [];
  return refs.filter(Boolean);
}

function isInternalDevelop(url) {
  return (
    typeof url === "string" &&
    url.includes("github.com/lightspeedwp/.github/blob/develop/")
  );
}

async function urlLooksResolvable(u) {
  // For internal blob links we rely on path existence in the repo (fast, offline).
  if (!isInternalDevelop(u)) return true; // ignore external for now
  const rel = u.split("blob/develop/")[1];
  try {
    await fs.access(path.join(process.cwd(), rel));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const cfg = await loadConfig();
  const repoVersion = await readRepoVersion(cfg.version.repoVersionFile);

  const files = await listFiles(cfg.includeGlobs, cfg.excludeGlobs);
  const { validate } = await loadSchemaAndValidator();

  let eligible = 0,
    withValid = 0;
  const unknownKeys = [];
  const brokenRefs = [];
  const versionSkews = [];
  const perFile = [];

  for (const fp of files) {
    const category = getCategoryForPath(fp);
    const eligibleByType = Boolean(cfg.frontmatterEligible[category]);
    const text = await readText(fp);

    let data = null;
    if (fp.endsWith(".md")) data = extractFrontmatterMD(text).data;
    else if (fp.endsWith(".yml") || fp.endsWith(".yaml"))
      data = extractFrontmatterYAML(text).data;

    if (!eligibleByType) {
      perFile.push({
        fp,
        category,
        eligible: false,
        hasFrontmatter: Boolean(data),
      });
      continue;
    }

    eligible++;
    if (!data) {
      perFile.push({
        fp,
        category,
        eligible: true,
        hasFrontmatter: false,
        errors: ["missing frontmatter"],
      });
      continue;
    }

    // Attach category so schema can branch if it uses if/then/else on `category`
    data.category = data.category ?? category;

    const ok = validate(data);
    if (ok) withValid++;
    else {
      const errs = (validate.errors || []).map(
        (e) => `${e.instancePath || "."} ${e.message}`,
      );
      perFile.push({
        fp,
        category,
        eligible: true,
        hasFrontmatter: true,
        errors: errs,
      });
    }

    // Unknown keys (if schema uses additionalProperties: false)
    if (validate.errors) {
      const extras = validate.errors.filter(
        (e) => e.keyword === "additionalProperties",
      );
      extras.forEach((e) => unknownKeys.push({ fp, detail: e.message }));
    }

    // references audit
    const refs = collectReferences(data);
    for (const r of refs) {
      const okRef = await urlLooksResolvable(r);
      if (!okRef) brokenRefs.push({ fp, r });
    }

    // version skew (file ahead of repo)
    if (cfg.version.enforceFileNotAboveRepo && repoVersion && data.version) {
      if (semverCompare(String(data.version), String(repoVersion)) === 1) {
        versionSkews.push({
          fp,
          fileVersion: data.version,
          repoVersion,
        });
      }
    }

    if (ok) {
      perFile.push({
        fp,
        category,
        eligible: true,
        hasFrontmatter: true,
        errors: [],
      });
    }
  }

  const coveragePct =
    eligible === 0 ? 100 : Math.round((withValid / eligible) * 100);

  const out = {
    summary: {
      eligible,
      withValid,
      coveragePct,
      unknownKeys: unknownKeys.length,
      brokenRefs: brokenRefs.length,
      versionSkews: versionSkews.length,
      thresholds: cfg.thresholds,
    },
    unknownKeys,
    brokenRefs,
    versionSkews,
    files: perFile,
  };

  await fs.mkdir(path.join(process.cwd(), "metrics/out"), {
    recursive: true,
  });
  if (cfg.report.storeJsonArtifact) {
    await fs.writeFile(cfg.report.artifactPath, JSON.stringify(out, null, 2));
  }

  // Markdown report
  const md = [
    "# Weekly Frontmatter Metrics",
    "",
    `**Coverage:** ${coveragePct}% (${withValid}/${eligible})`,
    `**Unknown keys:** ${unknownKeys.length}`,
    `**Broken references:** ${brokenRefs.length}`,
    `**Version skews:** ${versionSkews.length}`,
    "",
    "## Notes",
    "- Eligible = files expected to contain valid frontmatter.",
    "- Version skew = file version greater than repo VERSION.",
    "",
    "## Broken references",
    ...(brokenRefs.length
      ? brokenRefs.map((b) => `- \`${b.fp}\` → ${b.r}`)
      : ["- None"]),
    "",
    "## Unknown keys",
    ...(unknownKeys.length
      ? unknownKeys.map((u) => `- \`${u.fp}\`: ${u.detail}`)
      : ["- None"]),
    "",
    "## Version skews",
    ...(versionSkews.length
      ? versionSkews.map(
          (v) => `- \`${v.fp}\`: file=${v.fileVersion} > repo=${v.repoVersion}`,
        )
      : ["- None"]),
    "",
    "## File results (errors only)",
    ...perFile
      .filter((f) => Array.isArray(f.errors) && f.errors.length)
      .map((f) => `- \`${f.fp}\` → ${f.errors.join("; ")}`),
  ].join("\n");

  await fs.writeFile(cfg.report.reportPath, md, "utf8");

  // Set non-zero exit if thresholds fail
  const t = cfg.thresholds;
  const fails = [];
  if (coveragePct < t.coveragePctMin)
    fails.push(`coverage < ${t.coveragePctMin}%`);
  if (unknownKeys.length > t.unknownKeysMax)
    fails.push(`unknownKeys > ${t.unknownKeysMax}`);
  if (brokenRefs.length > t.brokenRefsMax)
    fails.push(`brokenRefs > ${t.brokenRefsMax}`);
  if (versionSkews.length > t.versionSkewMax)
    fails.push(`versionSkews > ${t.versionSkewMax}`);

  if (fails.length) {
    console.error("Thresholds failed:", fails.join(", "));
    // Fail the job if configured to do so (set thresholds.failOnError: true in metrics.config.json)
    if (t.failOnError) {
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
