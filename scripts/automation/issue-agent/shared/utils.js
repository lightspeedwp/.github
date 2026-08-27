import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

const REPO_ROOT = process.cwd();

let labelCache = null;
let labelCacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Load GitHub issue templates from .github/ISSUE_TEMPLATE/
 * @returns {Promise<Object>} Map of template name -> template content
 */
export async function loadTemplates() {
  const templatesDir = path.join(REPO_ROOT, ".github/ISSUE_TEMPLATE");
  const templates = {};

  try {
    const files = await fs.readdir(templatesDir);
    for (const file of files) {
      if (file.endsWith(".md") || file.endsWith(".yml")) {
        const filePath = path.join(templatesDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const templateName = path.basename(file, path.extname(file));
        templates[templateName] = content;
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error(`Failed to load templates: ${error.message}`, {
        cause: error,
      });
    }
  }

  return templates;
}

/**
 * Load canonical labels from .github/labels.yml with 5-minute cache
 * @returns {Promise<Array>} Array of label objects {name, description, color}
 */
export async function loadCanonicalLabels() {
  const now = Date.now();

  // Return cached labels if cache is still valid
  if (labelCache && labelCacheTime && now - labelCacheTime < CACHE_TTL) {
    return labelCache;
  }

  const labelsPath = path.join(REPO_ROOT, ".github/labels.yml");

  try {
    const content = await fs.readFile(labelsPath, "utf-8");
    const data = yaml.load(content);
    labelCache = Array.isArray(data) ? data : [];
    labelCacheTime = now;
    return labelCache;
  } catch (error) {
    if (error.code === "ENOENT") {
      labelCache = [];
      labelCacheTime = now;
      return labelCache;
    }
    throw new Error(`Failed to load canonical labels: ${error.message}`, {
      cause: error,
    });
  }
}

/**
 * Deduplicate labels while preserving order
 * @param {Array} labels - Array of label objects or strings
 * @returns {Array} Deduplicated labels in original order
 */
export function deduplicateLabels(labels) {
  const seen = new Set();
  const result = [];

  for (const label of labels) {
    const key = typeof label === "string" ? label : label.name;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(label);
    }
  }

  return result;
}

/**
 * Normalize GitHub markdown formatting
 * @param {string} text - Markdown text to format
 * @returns {string} Normalized markdown
 */
export function formatMarkdown(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  // Normalize line endings
  let formatted = text.replace(/\r\n/g, "\n");

  // Trim trailing whitespace on each line
  formatted = formatted
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  // Ensure single blank line at end
  formatted = formatted.replace(/\n+$/, "\n");

  // Fix multiple blank lines (max 2)
  formatted = formatted.replace(/\n\n\n+/g, "\n\n");

  return formatted;
}

/**
 * Validate label format (alphanumeric, hyphens, underscores)
 * @param {string} label - Label name to validate
 * @returns {boolean} True if valid format
 */
export function validateLabelFormat(label) {
  if (!label || typeof label !== "string") {
    return false;
  }
  return /^[a-zA-Z0-9\-_]+$/.test(label.trim());
}

/**
 * Validate GitHub issue number format
 * @param {string|number} issueNumber - Issue number to validate
 * @returns {boolean} True if valid issue number
 */
export function validateIssueNumber(issueNumber) {
  if (issueNumber === null || issueNumber === undefined) {
    return false;
  }
  const raw = String(issueNumber).trim();
  if (!/^\d+$/.test(raw)) {
    return false;
  }
  const num = Number.parseInt(raw, 10);
  return Number.isInteger(num) && num > 0;
}

/**
 * Validate GitHub username format
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid GitHub username
 */
export function validateUsername(username) {
  if (!username || typeof username !== "string") {
    return false;
  }
  // GitHub usernames: alphanumeric + hyphens, 1-39 characters
  return /^[a-zA-Z0-9-]{1,39}$/.test(username.trim());
}

/**
 * Parse GitHub issue number from string (e.g., "#1234" or "1234")
 * @param {string} input - Input string containing issue number
 * @returns {number|null} Parsed issue number or null if invalid
 */
export function parseIssueNumber(input) {
  if (!input || typeof input !== "string") {
    return null;
  }

  // Remove '#' prefix if present
  const cleaned = input.trim().replace(/^#/, "");
  if (!/^\d+$/.test(cleaned)) {
    return null;
  }
  const num = Number.parseInt(cleaned, 10);

  // Validate the parsed number
  if (Number.isInteger(num) && num > 0) {
    return num;
  }

  return null;
}

/**
 * Clear the label cache (useful for testing)
 */
export function clearLabelCache() {
  labelCache = null;
  labelCacheTime = null;
}
