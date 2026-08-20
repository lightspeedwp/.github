/**
 * file_type: agent-js
 * title: "Linting JavaScript Agent"
 * description: Runs linting checks on code files to ensure coding standards.
 * references: ["./linting.agent.md"]
 *
 * Wave 2A kickoff (#467):
 * - canonical spec path confirmed: agents/linting.agent.md
 * - runtime path confirmed: scripts/agents/linting.agent.js
 * - current gap: the previous stub provided no reusable lint orchestration
 *   helpers, which meant the coverage phase could not exercise parsing,
 *   selection, reporting, or failure handling in a meaningful way
 * - next concrete action: expose a small, deterministic helper surface that
 *   can be covered with Jest without depending on a live linter process
 *
 * @module scripts/agents/linting.agent.js
 * @see ../../../.github/agents/linting.agent.md
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_RULES = [
  {
    name: "eslint",
    extensions: [".js", ".cjs", ".mjs", ".jsx", ".ts", ".tsx"],
  },
  { name: "markdownlint", extensions: [".md", ".markdown"] },
  { name: "yamllint", extensions: [".yml", ".yaml"] },
  { name: "jsonlint", extensions: [".json"] },
  { name: "shellcheck", extensions: [".sh"] },
  { name: "phpcs", extensions: [".php"] },
];

const configCache = new Map();

function toPosixPath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normaliseFilePath(value, rootDir = process.cwd()) {
  if (!value) {
    return "";
  }

  const root = path.resolve(rootDir);
  const absolute = path.isAbsolute(value)
    ? path.normalize(value)
    : path.resolve(root, value);
  const relative = path.relative(root, absolute) || path.basename(absolute);

  return toPosixPath(relative === "" ? path.basename(absolute) : relative);
}

function splitList(input) {
  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === "string") {
    return input
      .split(/[\n,;]+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [];
}

function parseLintTargets(input, rootDir = process.cwd()) {
  if (!input) {
    return [];
  }

  const rawTargets =
    typeof input === "object" && !Array.isArray(input)
      ? input.files || input.paths || input.targets || []
      : input;

  const seen = new Set();
  const targets = [];

  for (const entry of splitList(rawTargets)) {
    const target = normaliseFilePath(entry, rootDir);
    if (!target || seen.has(target)) {
      continue;
    }

    seen.add(target);
    targets.push(target);
  }

  return targets;
}

function createDefaultConfig() {
  return {
    rules: DEFAULT_RULES.map((rule, index) => ({
      name: rule.name,
      extensions: [...rule.extensions],
      enabled: true,
      order: index,
    })),
    reportTitle: "Lint Report",
    groupBy: "file",
  };
}

function validateConfigShape(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new TypeError("lint config must be an object");
  }

  if (config.rules && !Array.isArray(config.rules)) {
    throw new TypeError("lint config rules must be an array");
  }

  return config;
}

function resolveConfigPath(source, rootDir) {
  if (!source || typeof source !== "string") {
    return null;
  }

  return path.isAbsolute(source) ? source : path.resolve(rootDir, source);
}

function readConfigFile(configPath, fsImpl = fs) {
  if (!fsImpl.existsSync(configPath)) {
    throw new Error(`Lint config file not found: ${configPath}`);
  }

  const raw = fsImpl.readFileSync(configPath, "utf8");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid lint config at ${configPath}: ${error.message}`, {
      cause: error,
    });
  }

  return validateConfigShape(parsed);
}

function normaliseConfig(config, rootDir = process.cwd(), fsImpl = fs) {
  if (!config) {
    return createDefaultConfig();
  }

  if (typeof config === "object" && !Array.isArray(config)) {
    const validated = validateConfigShape(config);
    return {
      ...createDefaultConfig(),
      ...validated,
      rules: Array.isArray(validated.rules)
        ? validated.rules.map((rule, index) => ({
            name: String(rule.name || "").trim(),
            extensions: Array.isArray(rule.extensions)
              ? rule.extensions
                  .map((extension) => String(extension).trim())
                  .filter(Boolean)
              : [],
            enabled: rule.enabled !== false,
            order: Number.isFinite(rule.order) ? rule.order : index,
          }))
        : createDefaultConfig().rules,
    };
  }

  if (typeof config === "string") {
    const configPath = resolveConfigPath(config, rootDir);
    if (configCache.has(configPath)) {
      return clone(configCache.get(configPath));
    }

    const loaded = readConfigFile(configPath, fsImpl);
    const resolved = {
      ...createDefaultConfig(),
      ...loaded,
      rules: Array.isArray(loaded.rules)
        ? loaded.rules.map((rule, index) => ({
            name: String(rule.name || "").trim(),
            extensions: Array.isArray(rule.extensions)
              ? rule.extensions
                  .map((extension) => String(extension).trim())
                  .filter(Boolean)
              : [],
            enabled: rule.enabled !== false,
            order: Number.isFinite(rule.order) ? rule.order : index,
          }))
        : createDefaultConfig().rules,
    };

    configCache.set(configPath, clone(resolved));
    return resolved;
  }

  throw new TypeError("lint config must be an object or a path string");
}

function clearLintConfigCache() {
  configCache.clear();
}

function selectRulesForFile(filePath, config = createDefaultConfig()) {
  const extension = path.extname(filePath).toLowerCase();
  const rules = Array.isArray(config.rules)
    ? config.rules
    : createDefaultConfig().rules;

  return rules
    .filter((rule) => rule && rule.enabled !== false)
    .filter((rule) => {
      const extensions = Array.isArray(rule.extensions) ? rule.extensions : [];
      return extensions
        .map((value) => String(value).toLowerCase())
        .includes(extension);
    })
    .sort((left, right) => {
      const leftOrder = Number.isFinite(left.order) ? left.order : 0;
      const rightOrder = Number.isFinite(right.order) ? right.order : 0;
      return leftOrder - rightOrder;
    })
    .map((rule) => rule.name)
    .filter(Boolean);
}

function normaliseFinding(finding, fallbackFilePath = "") {
  if (!finding || typeof finding !== "object") {
    return null;
  }

  const filePath = normaliseFilePath(
    finding.filePath || finding.file || finding.path || fallbackFilePath,
    process.cwd(),
  );
  const message = String(finding.message || finding.text || "").trim();
  const rule = String(
    finding.rule || finding.ruleId || finding.name || "",
  ).trim();
  const severity = String(finding.severity || "error").toLowerCase();

  if (!filePath || !message || !rule) {
    return null;
  }

  return {
    filePath,
    message,
    rule,
    severity,
  };
}

function flattenFindings(result, fallbackFilePath = "") {
  if (!result) {
    return [];
  }

  const items = Array.isArray(result)
    ? result
    : Array.isArray(result.findings)
      ? result.findings
      : Array.isArray(result.issues)
        ? result.issues
        : Array.isArray(result.errors)
          ? result.errors
          : [];

  return items
    .map((finding) => normaliseFinding(finding, fallbackFilePath))
    .filter(Boolean);
}

function dedupeFindings(findings = []) {
  const seen = new Set();
  const deduped = [];

  for (const finding of findings) {
    const key = [
      finding.filePath,
      finding.rule,
      finding.message,
      finding.severity,
    ].join("|");
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(finding);
  }

  return deduped;
}

function groupFindingsByFile(findings = []) {
  const grouped = {};

  for (const finding of findings) {
    if (!grouped[finding.filePath]) {
      grouped[finding.filePath] = {
        filePath: finding.filePath,
        count: 0,
        severities: {},
        findings: [],
      };
    }

    const group = grouped[finding.filePath];
    group.count += 1;
    group.severities[finding.severity] =
      (group.severities[finding.severity] || 0) + 1;
    group.findings.push(finding);
  }

  return grouped;
}

function detectRepositoryType(rootDir = process.cwd(), fsImpl = fs) {
  const resolvedRoot = path.resolve(rootDir);

  // Check for block plugin first (block.json takes precedence)
  const blockJsonPath = path.join(resolvedRoot, "block.json");
  const blockPluginPath = path.join(resolvedRoot, "src", "plugin.php");
  if (fsImpl.existsSync(blockJsonPath) || fsImpl.existsSync(blockPluginPath)) {
    return "BLOCK_PLUGIN";
  }

  // Check for control-plane markers (.github/CLAUDE.md, .github/workflows, or .github/actions)
  const claudeMdPath = path.join(resolvedRoot, ".github", "CLAUDE.md");
  const workflowsPath = path.join(resolvedRoot, ".github", "workflows");
  const actionsPath = path.join(resolvedRoot, ".github", "actions");
  if (
    fsImpl.existsSync(claudeMdPath) ||
    fsImpl.existsSync(workflowsPath) ||
    fsImpl.existsSync(actionsPath)
  ) {
    return "control-plane";
  }

  // Check for WordPress theme markers (theme.json or style.css with "Theme Name:" header)
  const themeJsonPath = path.join(resolvedRoot, "theme.json");
  const styleCssPath = path.join(resolvedRoot, "style.css");

  if (fsImpl.existsSync(themeJsonPath)) {
    return "wordpress-theme";
  }

  if (fsImpl.existsSync(styleCssPath)) {
    const styleContent = fsImpl.readFileSync(styleCssPath, "utf8");
    if (styleContent.includes("Theme Name:")) {
      return "wordpress-theme";
    }
  }

  // Check for WordPress plugin markers (plugin.php with Plugin Header)
  const pluginPhpPath = path.join(resolvedRoot, "plugin.php");
  if (fsImpl.existsSync(pluginPhpPath)) {
    const pluginContent = fsImpl.readFileSync(pluginPhpPath, "utf8");
    if (pluginContent.includes("Plugin Name:")) {
      return "wordpress-plugin";
    }
  }

  return "UNKNOWN";
}

function getWordPressPhpcsConfig(options = {}) {
  const { type = "plugin", ruleset = "WordPress" } = options;

  const baseConfig = {
    standards: [ruleset],
    extensions: ["php"],
    exclude: ["vendor/", "node_modules/", "tests/"],
    severity: 5,
  };

  if (type === "plugin") {
    return {
      ...baseConfig,
      standards: [ruleset || "WordPress-Core", "WordPress-Docs"],
    };
  }

  if (type === "theme") {
    return {
      ...baseConfig,
      standards: [ruleset || "WordPress"],
    };
  }

  return baseConfig;
}

function getBlockPluginConfig(options = {}) {
  const { typescript = false, rules = {} } = options;

  const config = {
    extends: ["plugin:react/recommended"],
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-console": "error",
      ...rules,
    },
  };

  if (typescript) {
    config.parser = "@typescript-eslint/parser";
    config.parserOptions = { ecmaVersion: 2021, sourceType: "module" };
    config.extends.push("plugin:@typescript-eslint/recommended");
  }

  return config;
}

function getBlockThemeConfig(options = {}) {
  const { includeVariations = false } = options;

  return {
    extends: "stylelint-config-wordpress",
    rules: {
      "color-no-invalid-hex": true,
      "font-family-no-missing-generic-family-keyword": true,
      "property-no-unknown": true,
      "selector-pseudo-element-no-unknown": true,
      "unit-no-unknown": true,
    },
    ignoreFiles: ["vendor/**", "node_modules/**", "dist/**"],
  };
}

function resolveRepositoryRoot(startPath = process.cwd(), fsImpl = fs) {
  let current = path.resolve(startPath);
  const root = path.parse(current).root;

  while (current !== root) {
    const markers = [
      path.join(current, ".github"),
      path.join(current, "package.json"),
      path.join(current, "composer.json"),
      path.join(current, "plugin.php"),
      path.join(current, "style.css"),
    ];

    if (markers.some((marker) => fsImpl.existsSync(marker))) {
      return current;
    }

    current = path.dirname(current);
  }

  return startPath;
}

function withTimeout(promise, timeoutMs = 30000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ]);
}

function buildSummary(findings = [], targets = []) {
  const severityCounts = findings.reduce((accumulator, finding) => {
    accumulator[finding.severity] = (accumulator[finding.severity] || 0) + 1;
    return accumulator;
  }, {});

  return {
    filesScanned: targets.length,
    filesWithFindings: Object.keys(groupFindingsByFile(findings)).length,
    totalFindings: findings.length,
    severityCounts,
  };
}

function formatLintReport(result = {}) {
  const title = result.title || "Lint Report";
  const summary =
    result.summary || buildSummary(result.findings || [], result.targets || []);
  const grouped =
    result.groupedFindings || groupFindingsByFile(result.findings || []);

  const lines = [
    `# ${title}`,
    "",
    "## Summary",
    "",
    `- Files scanned: ${summary.filesScanned || 0}`,
    `- Files with findings: ${summary.filesWithFindings || 0}`,
    `- Total findings: ${summary.totalFindings || 0}`,
  ];

  const severities = Object.entries(summary.severityCounts || {});
  if (severities.length > 0) {
    lines.push("", "### Severity");
    for (const [severity, count] of severities) {
      lines.push(`- ${severity}: ${count}`);
    }
  }

  const fileEntries = Object.values(grouped);
  if (fileEntries.length === 0) {
    lines.push("", "## Findings", "", "No lint findings.");
    return lines.join("\n");
  }

  lines.push("", "## Findings");
  for (const entry of fileEntries) {
    lines.push("", `### ${entry.filePath}`, "");
    for (const finding of entry.findings) {
      lines.push(`- [${finding.severity}] ${finding.rule}: ${finding.message}`);
    }
  }

  return lines.join("\n");
}

async function lintCodebase(rootDir = process.cwd(), options = {}) {
  const resolvedRoot = path.resolve(rootDir || process.cwd());
  const logger = options.logger || console;
  const targets = parseLintTargets(
    options.files || options.targets || options.paths || [],
    resolvedRoot,
  );
  const config = normaliseConfig(
    options.config || options.configPath || null,
    resolvedRoot,
    options.fs || fs,
  );

  if (targets.length === 0) {
    const emptySummary = buildSummary([], []);
    const emptyReport = formatLintReport({
      title: config.reportTitle || "Lint Report",
      summary: emptySummary,
      targets: [],
      findings: [],
      groupedFindings: {},
    });

    logger.info?.("[linting.agent] No files scheduled for linting");
    return {
      rootDir: resolvedRoot,
      targets: [],
      config,
      findings: [],
      groupedFindings: {},
      summary: emptySummary,
      report: emptyReport,
      status: "passed",
    };
  }

  const runner =
    options.runner ||
    (async () => ({
      findings: [],
    }));
  const timeout = options.timeout || 30000;

  const collectedFindings = [];

  for (const filePath of targets) {
    const rules = selectRulesForFile(filePath, config);
    logger.info?.(
      `[linting.agent] Linting ${filePath} with ${rules.length} rule(s)`,
    );

    try {
      const result = await withTimeout(
        Promise.resolve(
          runner({
            rootDir: resolvedRoot,
            filePath,
            rules,
            config,
          }),
        ),
        timeout,
      );
      collectedFindings.push(...flattenFindings(result, filePath));
    } catch (error) {
      if (error.message.includes("timed out")) {
        logger.warn?.(
          `[linting.agent] Timeout linting ${filePath}: ${error.message}`,
        );
      } else {
        logger.error?.(
          `[linting.agent] Error linting ${filePath}: ${error.message}`,
        );
      }
    }
  }

  const findings = dedupeFindings(collectedFindings);
  const groupedFindings = groupFindingsByFile(findings);
  const summary = buildSummary(findings, targets);
  const report = formatLintReport({
    title: config.reportTitle || "Lint Report",
    summary,
    targets,
    findings,
    groupedFindings,
  });

  if (findings.length > 0) {
    logger.warn?.(
      `[linting.agent] ${findings.length} lint finding(s) detected`,
    );
  } else {
    logger.info?.("[linting.agent] No lint findings detected");
  }

  return {
    rootDir: resolvedRoot,
    targets,
    config,
    findings,
    groupedFindings,
    summary,
    report,
    status: findings.length > 0 ? "failed" : "passed",
  };
}

module.exports = lintCodebase;
module.exports.lintCodebase = lintCodebase;
module.exports.normaliseFilePath = normaliseFilePath;
module.exports.parseLintTargets = parseLintTargets;
module.exports.selectRulesForFile = selectRulesForFile;
module.exports.normaliseConfig = normaliseConfig;
module.exports.resolveConfigPath = resolveConfigPath;
module.exports.readConfigFile = readConfigFile;
module.exports.clearLintConfigCache = clearLintConfigCache;
module.exports.normaliseFinding = normaliseFinding;
module.exports.flattenFindings = flattenFindings;
module.exports.dedupeFindings = dedupeFindings;
module.exports.groupFindingsByFile = groupFindingsByFile;
module.exports.buildSummary = buildSummary;
module.exports.formatLintReport = formatLintReport;
module.exports.detectRepositoryType = detectRepositoryType;
module.exports.getWordPressPhpcsConfig = getWordPressPhpcsConfig;
module.exports.getBlockPluginConfig = getBlockPluginConfig;
module.exports.getBlockThemeConfig = getBlockThemeConfig;
module.exports.resolveRepositoryRoot = resolveRepositoryRoot;
module.exports.withTimeout = withTimeout;
