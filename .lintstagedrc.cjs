/**
 * Dedicated lint-staged configuration (takes precedence over package.json's
 * "lint-staged" field).
 *
 * The markdown task filters out bundled/vendored skill reference material and
 * intentionally-invalid test fixtures before invoking markdownlint-cli2, since
 * `markdownlint-cli2 --fix` does not honour ignore globs against explicitly
 * passed file paths (only against its own glob expansion). This mirrors the
 * exclusions already applied in package.json's `lint:md` script and in
 * .github/workflows/meta.yml's `lint-and-links` job.
 */
const EXCLUDED_PATTERNS = [
  /\/plugin-provided\//,
  /\/platform-managed\//,
  /\/directory-installed\//,
  /\/tests\/markdown-issues\.md$/,
  /\/agentskills-main\//,
];

function isExcluded(filename) {
  return EXCLUDED_PATTERNS.some((pattern) => pattern.test(filename));
}

module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{md,mdx}": (filenames) => {
    const included = filenames.filter((f) => !isExcluded(f));
    return included.length
      ? [`markdownlint-cli2 --fix ${included.map((f) => `"${f}"`).join(" ")}`]
      : [];
  },
  "*.json": ["prettier --write"],
  "*.{yml,yaml}": ["prettier --write"],
};
