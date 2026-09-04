/**
 * Dedicated lint-staged configuration (takes precedence over package.json's
 * "lint-staged" field).
 *
 * All tasks filter out bundled/vendored skill reference material and
 * intentionally-invalid test fixtures before invoking eslint/markdownlint,
 * since those tools do not honour ignore globs against explicitly passed
 * file paths (only against their own glob expansion). This mirrors the
 * exclusions already applied in eslint.config.cjs, package.json's `lint:md`
 * script, and .github/workflows/meta.yml's `lint-and-links` job.
 */
const EXCLUDED_PATTERNS = [
  /^projects\/active\//,
  /\/plugin-provided\//,
  /\/platform-managed\//,
  /\/directory-installed\//,
  /\/tests\/markdown-issues\.md$/,
  /\/agentskills-main\//,
  /scripts\/dashboard\//,
];

function isExcluded(filename) {
  return EXCLUDED_PATTERNS.some((pattern) => pattern.test(filename));
}

function quoteAll(filenames) {
  return filenames.map((f) => `"${f}"`).join(" ");
}

module.exports = {
  "*.{js,jsx,ts,tsx}": (filenames) => {
    const included = filenames.filter((f) => !isExcluded(f));
    if (!included.length) return [];
    return [
      `eslint --fix ${quoteAll(included)}`,
      `prettier --write ${quoteAll(included)}`,
    ];
  },
  "*.{md,mdx}": (filenames) => {
    const included = filenames.filter((f) => !isExcluded(f));
    return included.length
      ? [`markdownlint-cli2 --fix ${quoteAll(included)}`]
      : [];
  },
  "*.json": ["prettier --write"],
  "*.{yml,yaml}": ["prettier --write"],
};
