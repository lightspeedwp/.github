#!/usr/bin/env node
/**
 * Agent Security Auditor Hook
 *
 * Scans an agent's text/config files for likely hardcoded credentials and
 * unsafe patterns. Confirmed credential assignments (quoted OR unquoted, in
 * Markdown, JSON, YAML, JS, and .env files) are reported as errors and block.
 * A file may opt out with the directive `SKIP:agent-security-auditor`; skips
 * are surfaced as warnings so bypasses remain auditable.
 *
 * @module hooks/agent-security-auditor
 */

const fs = require("fs");
const path = require("path");

const SCANNABLE_EXT = new Set([".json", ".md", ".js", ".yaml", ".yml"]);
const SKIP_DIRECTIVE = "SKIP:agent-security-auditor";

// Keys whose assigned values are treated as credentials.
const SECRET_KEY =
  "(?:password|passwd|pwd|api[_-]?key|secret[_-]?key|access[_-]?key|aws_secret_access_key|auth[_-]?token|client[_-]?secret|private[_-]?key|secret|token)";
// key <:|=> value, where value is single/double quoted or an unquoted scalar.
const ASSIGN_RE = new RegExp(
  `${SECRET_KEY}["']?\\s*[:=]\\s*(?<val>'[^']+'|"[^"]+"|[^\\s#'"]+)`,
  "gi",
);

const SOFT_PATTERNS = [
  { name: "Bearer token", regex: /bearer\s+[A-Za-z0-9._-]{16,}/gi },
  { name: "Private key block", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
];

// Values that are references or placeholders, not real secrets.
const SAFE_VALUE_RE =
  /^(?:\$\{|\$\{\{|<|secrets\.|env\.|process\.env|os\.environ|vault:|process\.|import\.meta)/i;
// Prefixes that mark a value as an obvious placeholder (matched at start).
const PLACEHOLDER_PREFIX_RE =
  /^(?:your[-_]|example|placeholder|changeme|change-me)/i;
// Whole-value placeholder tokens.
const PLACEHOLDER_RE =
  /^(?:xxx+|redacted|none|null|true|false|test|dummy|sample|todo|tbd|\.\.\.|\*+)$/i;

/**
 * Decide whether an assigned value looks like a real hardcoded secret.
 * @param {string} rawValue captured value (may be quoted)
 * @returns {boolean}
 */
function isLikelySecret(rawValue) {
  const value = rawValue.replace(/^['"]|['"]$/g, "").trim();
  if (value.length < 8) return false;
  if (SAFE_VALUE_RE.test(value)) return false;
  if (PLACEHOLDER_PREFIX_RE.test(value)) return false;
  if (PLACEHOLDER_RE.test(value)) return false;
  if (value.includes("example") || value.includes("YOUR_")) return false;
  // Pure UPPER_SNAKE_CASE tokens are env-var-name references, not secrets.
  if (/^[A-Z][A-Z0-9_]+$/.test(value)) return false;
  return true;
}

function isScannable(file) {
  const base = path.basename(file);
  if (base === ".env" || base.startsWith(".env.")) return true;
  return SCANNABLE_EXT.has(path.extname(file));
}

function getAllFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...getAllFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function lineOf(content, index) {
  return content.slice(0, index).split("\n").length;
}

/**
 * @param {string} targetPath Path to an agent (or any) directory.
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validate(targetPath) {
  const errors = [];
  const warnings = [];

  const files = getAllFiles(targetPath).filter(isScannable);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(targetPath, file);

    if (content.includes(SKIP_DIRECTIVE)) {
      warnings.push(`Security audit skipped via directive in ${rel}`);
      continue;
    }

    for (const m of content.matchAll(ASSIGN_RE)) {
      const value = m.groups && m.groups.val ? m.groups.val : "";
      if (isLikelySecret(value)) {
        errors.push(
          `Hardcoded credential in ${rel}:${lineOf(content, m.index)}`,
        );
      }
    }
    for (const { name, regex } of SOFT_PATTERNS) {
      for (const m of content.matchAll(regex)) {
        errors.push(`${name} in ${rel}:${lineOf(content, m.index)}`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

module.exports = {
  name: "agent-security-auditor",
  description: "Scans agent files for hardcoded secrets and unsafe patterns",
  validate,
  isLikelySecret,
};

if (require.main === module) {
  const target = process.argv[2] || process.cwd();
  const result = validate(target);
  for (const w of result.warnings) console.warn(`⚠️  ${w}`);
  if (result.valid) {
    console.log(`✅ agent-security-auditor: no hardcoded secrets in ${target}`);
    process.exit(0);
  }
  console.error(`❌ agent-security-auditor: ${target}`);
  for (const e of result.errors) console.error(`- ${e}`);
  process.exit(1);
}
