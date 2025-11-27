/**
 * issue-type.agent.js
 * Lightweight stub for the Issue Type Assignment Agent.
 * Responsibility: analyse issue/PR text and map to a canonical type defined
 * in `.github/automation/issue-types.yml` (loading logic to be added later).
 * Current implementation provides minimal exported API so tests asserting
 * module presence pass without throwing while consolidation work proceeds.
 */

// Minimal heuristic map (placeholder). Real implementation will ingest YAML.
const KEYWORD_TYPE_MAP = {
  bug: "type:bug",
  fix: "type:bug",
  feature: "type:feature",
  feat: "type:feature",
  docs: "type:documentation",
  doc: "type:documentation",
  test: "type:test",
  perf: "type:performance",
  security: "type:security",
};

/**
 * Detect a canonical type label from free‑form content.
 * @param {string} content Issue or PR body/title text.
 * @returns {string|null} Canonical type label or null if none matched.
 */
function detectIssueType(content = "") {
  const lower = content.toLowerCase();
  for (const key of Object.keys(KEYWORD_TYPE_MAP)) {
    if (lower.includes(key)) return KEYWORD_TYPE_MAP[key];
  }
  return null;
}

/**
 * Primary run function (placeholder).
 * @param {object} context Optional execution context.
 * @returns {Promise<object>} Summary payload.
 */
async function run(context = {}) {
  return {
    ok: true,
    detected: detectIssueType(context.content || ""),
  };
}

module.exports = {
  run,
  detectIssueType,
};
