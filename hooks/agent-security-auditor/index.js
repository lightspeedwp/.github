#!/usr/bin/env node
/**
 * Agent Security Auditor Hook
 *
 * Scans an agent's text/config files for likely hardcoded secrets and unsafe
 * patterns. Findings are reported as warnings; assigned-value credential
 * patterns are treated as errors. A file may opt out with the directive
 * `SKIP:agent-security-auditor`.
 *
 * @module hooks/agent-security-auditor
 */

const fs = require("fs");
const path = require("path");

const SCANNABLE = new Set([".json", ".md", ".js", ".yaml", ".yml"]);
const SKIP_DIRECTIVE = "SKIP:agent-security-auditor";

const HARD_PATTERNS = [
  {
    name: "Assigned password",
    regex: /password["']?\s*[:=]\s*['"][^'"]+['"]/gi,
  },
  {
    name: "Assigned API key",
    regex: /api[_-]?key["']?\s*[:=]\s*['"][^'"]+['"]/gi,
  },
  { name: "Assigned secret", regex: /secret["']?\s*[:=]\s*['"][^'"]+['"]/gi },
  {
    name: "AWS secret access key",
    regex: /aws_secret_access_key["']?\s*[:=]\s*['"][^'"]+['"]/gi,
  },
];
const SOFT_PATTERNS = [
  { name: "Bearer token", regex: /bearer\s+[A-Za-z0-9._-]{12,}/gi },
  { name: "Private key block", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
];

function getAllFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".git")) continue;
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

  const files = getAllFiles(targetPath).filter((f) =>
    SCANNABLE.has(path.extname(f)),
  );

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes(SKIP_DIRECTIVE)) continue;
    const rel = path.relative(targetPath, file);

    for (const { name, regex } of HARD_PATTERNS) {
      for (const m of content.matchAll(regex)) {
        errors.push(`${name} in ${rel}:${lineOf(content, m.index)}`);
      }
    }
    for (const { name, regex } of SOFT_PATTERNS) {
      for (const m of content.matchAll(regex)) {
        warnings.push(`${name} in ${rel}:${lineOf(content, m.index)}`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

module.exports = {
  name: "agent-security-auditor",
  description: "Scans agent files for hardcoded secrets and unsafe patterns",
  validate,
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
