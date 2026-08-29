/**
 * Repository context detector for Reporting Agent v2.
 * Automatically detects repository type (WordPress block plugin, block theme,
 * platform, or control-plane) and returns the appropriate context descriptor.
 */

/** @typedef {'block-plugin'|'block-theme'|'platform'|'control-plane'|'unknown'} RepoType */

/**
 * @typedef {Object} RepoContext
 * @property {RepoType} type - Detected repository type
 * @property {string} name - Repository name
 * @property {string[]} signals - Evidence used for detection
 * @property {string} templateKey - Key for selecting the correct report template
 * @property {Record<string, unknown>} meta - Additional repository metadata
 */

class RepoContextDetector {
  /**
   * @param {Object} [options]
   * @param {string} [options.owner] - GitHub organisation / user name
   */
  constructor(options = {}) {
    this.owner = options.owner || "";
  }

  /**
   * Detect repository context from file manifest and repository metadata.
   *
   * @param {string} repoName - Repository name (without owner)
   * @param {string[]} filePaths - List of file paths in the repository root
   * @param {Record<string, unknown>} [repoMeta] - Optional GitHub repo metadata
   * @returns {RepoContext}
   */
  detect(repoName, filePaths = [], repoMeta = {}) {
    if (!repoName || typeof repoName !== "string") {
      throw new Error("repoName must be a non-empty string");
    }

    const signals = [];
    const files = new Set(filePaths.map((p) => p.toLowerCase()));

    // --- Control-plane detection ---
    if (this._isControlPlane(repoName, files, repoMeta, signals)) {
      return this._buildContext("control-plane", repoName, signals, repoMeta);
    }

    // --- WordPress block plugin detection ---
    if (this._isBlockPlugin(files, repoMeta, signals)) {
      return this._buildContext("block-plugin", repoName, signals, repoMeta);
    }

    // --- WordPress block theme detection ---
    if (this._isBlockTheme(files, repoMeta, signals)) {
      return this._buildContext("block-theme", repoName, signals, repoMeta);
    }

    // --- Platform / generic detection ---
    if (this._isPlatform(files, repoMeta, signals)) {
      return this._buildContext("platform", repoName, signals, repoMeta);
    }

    signals.push("no-distinctive-signals");
    return this._buildContext("unknown", repoName, signals, repoMeta);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * @param {string} repoName
   * @param {Set<string>} files
   * @param {Record<string, unknown>} meta
   * @param {string[]} signals
   * @returns {boolean}
   */
  _isControlPlane(repoName, files, meta, signals) {
    if (repoName === ".github") {
      signals.push("repo-name:.github");
      return true;
    }

    const topics = Array.isArray(meta.topics) ? meta.topics : [];
    if (topics.includes("control-plane")) {
      signals.push("topic:control-plane");
      return true;
    }

    if (files.has(".github/agents") || files.has("agents")) {
      signals.push("has:agents-directory");
    }
    if (files.has(".github/workflows") && files.has("agents")) {
      signals.push("has:workflows+agents");
      return true;
    }

    return false;
  }

  /**
   * @param {Set<string>} files
   * @param {Record<string, unknown>} meta
   * @param {string[]} signals
   * @returns {boolean}
   */
  _isBlockPlugin(files, meta, signals) {
    const hasPluginHeader = [...files].some(
      (f) => f.endsWith(".php") && !f.includes("/"),
    );
    const hasBlockJson = [...files].some((f) => f.endsWith("block.json"));
    const hasComposerJson = files.has("composer.json");
    const hasPackageJson = files.has("package.json");

    const topics = Array.isArray(meta.topics) ? meta.topics : [];
    if (topics.includes("wordpress-plugin")) {
      signals.push("topic:wordpress-plugin");
    }
    if (topics.includes("gutenberg")) {
      signals.push("topic:gutenberg");
    }

    if (hasPluginHeader) signals.push("has:php-root-file");
    if (hasBlockJson) signals.push("has:block.json");
    if (hasComposerJson) signals.push("has:composer.json");
    if (hasPackageJson) signals.push("has:package.json");

    // Strong signal: root PHP file + block.json = block plugin
    if (hasPluginHeader && hasBlockJson) return true;

    // Strong signal: explicit topic
    if (topics.includes("wordpress-plugin")) {
      if (hasBlockJson || hasComposerJson) return true;
    }

    return false;
  }

  /**
   * @param {Set<string>} files
   * @param {Record<string, unknown>} meta
   * @param {string[]} signals
   * @returns {boolean}
   */
  _isBlockTheme(files, meta, signals) {
    const hasThemeJson = files.has("theme.json");
    const hasFunctionsPhp = files.has("functions.php");
    const hasStyleCss = files.has("style.css");
    const hasTemplatesDir = [...files].some((f) => f.startsWith("templates/"));

    const topics = Array.isArray(meta.topics) ? meta.topics : [];
    if (topics.includes("wordpress-theme")) {
      signals.push("topic:wordpress-theme");
    }
    if (topics.includes("block-theme")) {
      signals.push("topic:block-theme");
    }

    if (hasThemeJson) signals.push("has:theme.json");
    if (hasFunctionsPhp) signals.push("has:functions.php");
    if (hasStyleCss) signals.push("has:style.css");
    if (hasTemplatesDir) signals.push("has:templates-directory");

    // Strong signal: theme.json = block theme
    if (hasThemeJson) return true;

    // Strong signal: style.css + functions.php = classic/hybrid theme
    if (hasStyleCss && hasFunctionsPhp) return true;

    // Topic-based
    if (
      topics.includes("wordpress-theme") ||
      topics.includes("block-theme")
    ) {
      return true;
    }

    return false;
  }

  /**
   * @param {Set<string>} files
   * @param {Record<string, unknown>} meta
   * @param {string[]} signals
   * @returns {boolean}
   */
  _isPlatform(files, meta, signals) {
    const hasDockerfile = files.has("dockerfile");
    const hasTerraform = [...files].some((f) => f.endsWith(".tf"));
    const hasHelmChart = files.has("chart.yaml") || files.has("chart.yml");

    const topics = Array.isArray(meta.topics) ? meta.topics : [];
    if (topics.includes("platform")) {
      signals.push("topic:platform");
      return true;
    }
    if (topics.includes("infrastructure")) {
      signals.push("topic:infrastructure");
      return true;
    }

    if (hasDockerfile) signals.push("has:dockerfile");
    if (hasTerraform) signals.push("has:terraform");
    if (hasHelmChart) signals.push("has:helm-chart");

    if (hasDockerfile || hasTerraform || hasHelmChart) return true;

    return false;
  }

  /**
   * Build a normalised context object.
   *
   * @param {RepoType} type
   * @param {string} name
   * @param {string[]} signals
   * @param {Record<string, unknown>} meta
   * @returns {RepoContext}
   */
  _buildContext(type, name, signals, meta) {
    return {
      type,
      name,
      signals: [...signals],
      templateKey: type,
      meta: {
        owner: this.owner,
        description: meta.description || "",
        topics: Array.isArray(meta.topics) ? meta.topics : [],
        defaultBranch: meta.default_branch || "main",
        isPrivate: meta.private || false,
      },
    };
  }
}

module.exports = { RepoContextDetector };
