/**
 * reporting.agent.js
 *
 * Reporting Agent v2 implementation for LightSpeed.
 * Automates report creation, organisation, and maintenance.
 * v2 adds multi-repository support, session caching, and flexible storage.
 *
 * @file reporting.agent.js
 * @version 2.0.0
 * @author LightSpeed Team
 * @license GPL-3.0
 * @module scripts/agents/reporting.agent.js
 * @see ../../agents/reporting.agent.md
 */

import fs from "fs";
import path from "path";

/** @type {string} Current semantic version of the Reporting Agent */
const AGENT_VERSION = "2.0.0";

/**
 * Report categories and their paths
 */
const CATEGORIES = {
  agents: ".github/reports/agents",
  linting: ".github/reports/linting",
  labeling: ".github/reports/labeling",
  frontmatter: ".github/reports/frontmatter",
  coverage: ".github/reports/coverage",
  meta: ".github/reports/meta",
  "issue-metrics": ".github/reports/issue-metrics",
};

// ---------------------------------------------------------------------------
// v2: Session cache
// ---------------------------------------------------------------------------

/**
 * In-memory session cache.
 * Stores keyed report data within a single process lifetime.
 *
 * @type {Map<string, {data: *, cachedAt: Date, ttlMs: number}>}
 */
const _sessionCache = new Map();

/** Default cache TTL: 15 minutes */
const DEFAULT_CACHE_TTL_MS = 15 * 60 * 1000;

/**
 * Store a value in the session cache.
 *
 * @param {string} key - Cache key
 * @param {*} data - Value to cache
 * @param {number} [ttlMs=DEFAULT_CACHE_TTL_MS] - Time-to-live in milliseconds
 */
function cacheSet(key, data, ttlMs = DEFAULT_CACHE_TTL_MS) {
  _sessionCache.set(key, { data, cachedAt: new Date(), ttlMs });
}

/**
 * Retrieve a value from the session cache, returning undefined if missing or
 * expired.
 *
 * @param {string} key - Cache key
 * @returns {*} Cached value or undefined
 */
function cacheGet(key) {
  const entry = _sessionCache.get(key);
  if (!entry) return undefined;
  const age = Date.now() - entry.cachedAt.getTime();
  if (age > entry.ttlMs) {
    _sessionCache.delete(key);
    return undefined;
  }
  return entry.data;
}

/**
 * Clear all entries from the session cache.
 */
function cacheClear() {
  _sessionCache.clear();
}

/**
 * Return the number of live (non-expired) entries in the session cache.
 *
 * @returns {number} Live entry count
 */
function cacheSize() {
  let count = 0;
  for (const [key, entry] of _sessionCache.entries()) {
    if (Date.now() - entry.cachedAt.getTime() <= entry.ttlMs) {
      count++;
    } else {
      _sessionCache.delete(key);
    }
  }
  return count;
}

// ---------------------------------------------------------------------------
// v2: Multi-repository helpers
// ---------------------------------------------------------------------------

/**
 * Normalise a repository identifier to `{ owner, repo }`.
 *
 * Accepts `"owner/repo"` strings or plain `{ owner, repo }` objects.
 *
 * @param {string|{owner: string, repo: string}} repoRef - Repository reference
 * @returns {{ owner: string, repo: string }}
 */
function parseRepoRef(repoRef) {
  if (typeof repoRef === "string") {
    const parts = repoRef.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(
        `Invalid repository reference "${repoRef}". Expected "owner/repo".`,
      );
    }
    const [owner, repo] = parts;
    return { owner: owner.trim(), repo: repo.trim() };
  }
  if (repoRef && typeof repoRef === "object") {
    const { owner, repo } = repoRef;
    if (!owner || !repo) {
      throw new Error(
        'Repository reference object must have "owner" and "repo" properties.',
      );
    }
    return { owner: String(owner).trim(), repo: String(repo).trim() };
  }
  throw new Error("Repository reference must be a string or object.");
}

/**
 * Build a canonical cache key for a per-repository report.
 *
 * @param {{ owner: string, repo: string }} parsed - Parsed repo ref
 * @param {string} category - Report category
 * @returns {string}
 */
function buildRepoCacheKey(parsed, category) {
  return `repo:${parsed.owner}/${parsed.repo}:${category}`;
}

/**
 * Generate a multi-repository summary report that aggregates data from
 * multiple repositories into a single Markdown document.
 *
 * @param {object} options - Report options
 * @param {string} options.title - Report title
 * @param {string} options.description - Description
 * @param {string} options.category - Report category
 * @param {Array<string|{owner:string,repo:string}>} options.repos - Repository list
 * @param {Array<{metric: string, value: string, status: string}>} [options.metrics] - Aggregate metrics
 * @param {string} [options.summary] - Executive summary
 * @param {string} [options.author] - Report author
 * @param {string[]} [options.tags] - Tags
 * @returns {string} Multi-repo Markdown report
 */
function generateMultiRepoReport(options) {
  const {
    title,
    description,
    category,
    repos = [],
    metrics = [],
    summary = "",
    author,
    tags = [],
  } = options;

  if (!Array.isArray(repos) || repos.length === 0) {
    throw new Error(
      "generateMultiRepoReport requires at least one repository.",
    );
  }

  const parsed = repos.map(parseRepoRef);

  const repoList = parsed
    .map((r) => `| \`${r.owner}/${r.repo}\` | — |`)
    .join("\n");

  const metricsTable =
    metrics.length > 0
      ? `## Aggregate Metrics\n\n| Metric | Value | Status |\n|--------|-------|--------|\n${metrics.map((m) => `| ${m.metric} | ${m.value} | ${m.status} |`).join("\n")}`
      : "";

  const frontmatter = generateFrontmatter({
    title,
    description,
    category,
    author,
    tags: ["multi-repo", ...tags],
  });

  return `${frontmatter}

# ${title}

## Repositories (${parsed.length})

| Repository | Notes |
|------------|-------|
${repoList}

## Summary

${summary || "Multi-repository report generated by Reporting Agent v2."}

${metricsTable}
`.trim();
}

// ---------------------------------------------------------------------------
// v2: Pluggable storage backend
// ---------------------------------------------------------------------------

/**
 * @typedef {object} StorageBackend
 * @property {function(string, string): void} write - Write content to path
 * @property {function(string): boolean} exists - Check path existence
 * @property {function(string): void} mkdirp - Ensure directory exists
 */

/**
 * Default filesystem storage backend (production use).
 *
 * @type {StorageBackend}
 */
const fsStorage = {
  write(filePath, content) {
    fs.writeFileSync(filePath, content, "utf-8");
  },
  exists(filePath) {
    return fs.existsSync(filePath);
  },
  mkdirp(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  },
};

/**
 * Create an in-memory storage backend (useful for testing).
 *
 * @returns {StorageBackend & {store: Map<string, string>}}
 */
function createMemoryStorage() {
  const store = new Map();
  return {
    store,
    write(filePath, content) {
      store.set(filePath, content);
    },
    exists(filePath) {
      return store.has(filePath);
    },
    mkdirp() {
      /* no-op for in-memory */
    },
  };
}

/** Active storage backend (defaults to filesystem, replaceable in tests) */
let _storage = fsStorage;

/**
 * Replace the active storage backend.
 *
 * @param {StorageBackend} backend - New storage backend
 */
function setStorage(backend) {
  if (
    !backend ||
    typeof backend.write !== "function" ||
    typeof backend.exists !== "function" ||
    typeof backend.mkdirp !== "function"
  ) {
    throw new Error(
      "Storage backend must implement { write, exists, mkdirp }.",
    );
  }
  _storage = backend;
}

/**
 * Reset storage backend to the default filesystem implementation.
 */
function resetStorage() {
  _storage = fsStorage;
}

/**
 * Generate frontmatter for a report
 *
 * @param {object} options - Report options
 * @param {string} options.title - Report title
 * @param {string} options.description - Report description
 * @param {string} options.category - Report category
 * @param {string} options.author - Report author
 * @param {string[]} options.tags - Report tags
 * @returns {string} YAML frontmatter string
 */
function generateFrontmatter(options) {
  const {
    title,
    description,
    category,
    author = "automation",
    tags = [],
  } = options;

  const date = new Date().toISOString().split("T")[0];

  return `---
file_type: "report"
title: "${title}"
description: "${description}"
category: "${category}"
created_date: "${date}"
last_updated: "${date}"
author: "${author}"
tags: ${JSON.stringify(tags)}
---`;
}

/**
 * Generate a standard report template
 *
 * @param {object} options - Report options
 * @param {string} options.title - Report title
 * @param {string} options.summary - Executive summary
 * @param {Array<{metric: string, value: string, status: string}>} options.metrics - Key metrics
 * @param {string} options.details - Detailed findings
 * @param {string[]} options.recommendations - Recommendations list
 * @param {Array<{name: string, path: string}>} options.references - Reference links
 * @returns {string} Complete report markdown
 */
function generateReport(options) {
  const {
    title,
    description,
    category,
    summary,
    metrics = [],
    details = "",
    recommendations = [],
    references = [],
    author,
    tags,
  } = options;

  const frontmatter = generateFrontmatter({
    title,
    description,
    category,
    author,
    tags,
  });

  const metricsTable =
    metrics.length > 0
      ? `## Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
${metrics.map((m) => `| ${m.metric} | ${m.value} | ${m.status} |`).join("\n")}`
      : "";

  const recommendationsList =
    recommendations.length > 0
      ? `## Recommendations

${recommendations.map((r) => `- ${r}`).join("\n")}`
      : "";

  const referencesList =
    references.length > 0
      ? `## References

${references.map((r) => `- [${r.name}](${r.path})`).join("\n")}`
      : "";

  return `${frontmatter}

# ${title}

## Summary

${summary}

${metricsTable}

## Details

${details}

${recommendationsList}

${referencesList}
`.trim();
}

/**
 * Generate a JSON specification file
 *
 * @param {object} options - Spec options
 * @param {string} options.jsonFile - Name of the JSON file
 * @param {string} options.purpose - Purpose description
 * @param {string} options.generation - How it's generated
 * @param {Array<{field: string, type: string, required: boolean, description: string}>} options.schema - Schema fields
 * @param {string} options.usage - How it's used
 * @param {object} options.example - Example JSON object
 * @param {string} options.category - Report category
 * @returns {string} Complete spec markdown
 */
function generateSpecFile(options) {
  const {
    jsonFile,
    purpose,
    generation,
    schema = [],
    usage,
    example,
    category,
    relatedFiles = [],
  } = options;

  const date = new Date().toISOString().split("T")[0];
  const title = jsonFile.replace(".json", "");

  const schemaTable =
    schema.length > 0
      ? `### Top-Level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
${schema.map((f) => `| ${f.field} | ${f.type} | ${f.required ? "yes" : "no"} | ${f.description} |`).join("\n")}`
      : "";

  const relatedList =
    relatedFiles.length > 0
      ? `## Related Files

${relatedFiles.map((r) => `- [${r.name}](${r.path}) - ${r.description}`).join("\n")}`
      : "";

  return `---
file_type: "specification"
title: "${title} Specification"
description: "Schema and usage documentation for ${jsonFile}"
json_file: "${jsonFile}"
category: "${category}"
created_date: "${date}"
last_updated: "${date}"
---

# ${title} Specification

## Purpose

${purpose}

## Generation

${generation}

## Schema

${schemaTable}

## Usage

${usage}

${relatedList}

## Example

\`\`\`json
${JSON.stringify(example, null, 2)}
\`\`\`
`.trim();
}

/**
 * Determine the correct category for a report
 *
 * @param {string} content - Report content or title
 * @returns {string} Category name
 */
function determineCategory(content) {
  const contentLower = content.toLowerCase();

  if (
    contentLower.includes("eslint") ||
    contentLower.includes("lint") ||
    contentLower.includes("code quality")
  ) {
    return "linting";
  }
  if (
    contentLower.includes("agent") ||
    contentLower.includes("automation bot")
  ) {
    return "agents";
  }
  if (contentLower.includes("label") || contentLower.includes("labeling")) {
    return "labeling";
  }
  if (
    contentLower.includes("frontmatter") ||
    contentLower.includes("schema validation")
  ) {
    return "frontmatter";
  }
  if (
    contentLower.includes("coverage") ||
    contentLower.includes("test coverage")
  ) {
    return "coverage";
  }
  if (
    contentLower.includes("meta agent") ||
    contentLower.includes("metadata") ||
    contentLower.includes("branding agent") ||
    contentLower.includes("header") ||
    contentLower.includes("footer") ||
    contentLower.includes("badge")
  ) {
    return "meta";
  }
  if (
    contentLower.includes("issue") ||
    contentLower.includes("pr") ||
    contentLower.includes("metrics")
  ) {
    return "issue-metrics";
  }

  return "agents"; // Default fallback
}

/**
 * Get the full path for a report
 *
 * @param {string} category - Report category
 * @param {string} filename - Report filename
 * @returns {string} Full path to the report
 */
function getReportPath(category, filename) {
  const categoryPath = CATEGORIES[category] || CATEGORIES.agents;
  return path.join(process.cwd(), categoryPath, filename);
}

/**
 * Sanitise filename to lowercase with hyphens
 *
 * @param {string} filename - Original filename
 * @returns {string} Sanitised filename
 */
function sanitiseFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-.]/g, "")
    .replace(/--+/g, "-");
}

/**
 * Save a report to the correct location
 *
 * @param {string} content - Report content
 * @param {string} filename - Report filename
 * @param {string} category - Report category
 * @returns {object} Result with path and success status
 */
function saveReport(content, filename, category) {
  const sanitisedFilename = sanitiseFilename(filename);
  const reportPath = getReportPath(category, sanitisedFilename);

  // Ensure directory exists via pluggable storage backend
  const dir = path.dirname(reportPath);
  try {
    _storage.mkdirp(dir);
    _storage.write(reportPath, content);
    return { success: true, path: reportPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Validate a report has required frontmatter
 *
 * @param {string} content - Report content
 * @returns {object} Validation result
 */
function validateReport(content) {
  const errors = [];
  const warnings = [];

  // Check for frontmatter
  if (!content.startsWith("---")) {
    errors.push("Missing YAML frontmatter");
  } else {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];

      // Check required fields
      const requiredFields = [
        "file_type",
        "title",
        "description",
        "category",
        "created_date",
      ];
      requiredFields.forEach((field) => {
        if (!frontmatter.includes(`${field}:`)) {
          errors.push(`Missing required field: ${field}`);
        }
      });

      // Check for last_updated
      if (!frontmatter.includes("last_updated:")) {
        warnings.push("Missing last_updated field");
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Archive a report
 *
 * @param {string} reportPath - Path to the report
 * @returns {object} Result with new path and success status
 */
function archiveReport(reportPath) {
  const dir = path.dirname(reportPath);
  const filename = path.basename(reportPath);
  const archiveDir = path.join(dir, "archive");
  const archivePath = path.join(archiveDir, filename);

  // Ensure archive directory exists
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  try {
    // Read content and add archived flag
    let content = fs.readFileSync(reportPath, "utf-8");
    if (content.includes("---")) {
      content = content.replace(
        /^(---\n)/,
        '$1archived: true\narchived_date: "' +
          new Date().toISOString().split("T")[0] +
          '"\n',
      );
    }

    fs.writeFileSync(archivePath, content, "utf-8");
    fs.unlinkSync(reportPath);

    return { success: true, newPath: archivePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Main agent runner function
 *
 * @param {object} context - Execution context
 * @returns {object} Execution result
 */
function runAgent(context = {}) {
  const { action, options = {} } = context;

  switch (action) {
    case "generate":
      return {
        ok: true,
        report: generateReport(options),
        category: options.category || determineCategory(options.title || ""),
      };

    case "generate:multi-repo":
      return {
        ok: true,
        report: generateMultiRepoReport(options),
        category: options.category || "agents",
        repos: (options.repos || []).map(parseRepoRef),
      };

    case "spec":
      return {
        ok: true,
        spec: generateSpecFile(options),
      };

    case "validate":
      return {
        ok: true,
        validation: validateReport(options.content || ""),
      };

    case "archive":
      return archiveReport(options.path);

    case "save":
      return saveReport(options.content, options.filename, options.category);

    case "cache:get": {
      const cached = cacheGet(options.key);
      return {
        ok: true,
        value: cached,
        hit: cached !== undefined,
      };
    }

    case "cache:set":
      cacheSet(options.key, options.value, options.ttlMs);
      return { ok: true };

    case "cache:clear":
      cacheClear();
      return { ok: true };

    case "cache:size":
      return { ok: true, size: cacheSize() };

    default:
      return {
        ok: true,
        timestamp: new Date().toISOString(),
        version: AGENT_VERSION,
        categories: Object.keys(CATEGORIES),
        message: "Reporting Agent v2 ready",
      };
  }
}

export {
  runAgent,
  generateReport,
  generateMultiRepoReport,
  generateSpecFile,
  generateFrontmatter,
  determineCategory,
  getReportPath,
  sanitiseFilename,
  saveReport,
  validateReport,
  archiveReport,
  parseRepoRef,
  buildRepoCacheKey,
  cacheGet,
  cacheSet,
  cacheClear,
  cacheSize,
  setStorage,
  resetStorage,
  createMemoryStorage,
  CATEGORIES,
  AGENT_VERSION,
};

export default { runAgent };
