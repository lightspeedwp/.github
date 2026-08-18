const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const REPO_TYPES = {
  GITHUB: 'github',
  WORDPRESS_PLUGIN: 'wordpress-plugin',
  WORDPRESS_THEME: 'wordpress-theme',
};

class ConfigurationSystem {
  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.configDir = path.join(baseDir, 'scripts', 'agents', 'includes', 'reviewer-v2', 'configs');
    this.cache = {};
  }

  loadConfiguration(repoType = REPO_TYPES.GITHUB, overridePath = null) {
    const cacheKey = `${repoType}:${overridePath || 'default'}`;

    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    const defaults = this.loadDefaultConfig();
    const repoTypeConfig = this.loadRepoTypeConfig(repoType);
    const overrideConfig = overridePath ? this.loadYamlFile(overridePath) : {};

    const merged = this.mergeConfigs(defaults, repoTypeConfig, overrideConfig);

    this.cache[cacheKey] = merged;
    return merged;
  }

  loadDefaultConfig() {
    return this.loadYamlFile(path.join(this.configDir, 'defaults.yml'));
  }

  loadRepoTypeConfig(repoType) {
    const configFileName = this.getRepoTypeConfigFileName(repoType);
    return this.loadYamlFile(path.join(this.configDir, configFileName));
  }

  getRepoTypeConfigFileName(repoType) {
    const mapping = {
      [REPO_TYPES.GITHUB]: 'github.yml',
      [REPO_TYPES.WORDPRESS_PLUGIN]: 'wordpress-plugin.yml',
      [REPO_TYPES.WORDPRESS_THEME]: 'wordpress-theme.yml',
    };

    return mapping[repoType] || 'github.yml';
  }

  loadYamlFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return {};
      }

      const content = fs.readFileSync(filePath, 'utf8');
      return yaml.load(content, { schema: yaml.SAFE_SCHEMA }) || {};
    } catch (e) {
      console.error(`Error loading YAML config from ${filePath}:`, e.message);
      return {};
    }
  }

  mergeConfigs(...configs) {
    const result = {
      excludedFiles: [],
      excludedCategories: [],
      autoResolvePatterns: [],
      escalatePatterns: [],
      suppressFalsePositives: [],
      commentOptions: {},
    };

    for (const config of configs) {
      if (!config || typeof config !== 'object') {
        continue;
      }

      if (Array.isArray(config.excludedFiles)) {
        result.excludedFiles = [...new Set([...result.excludedFiles, ...config.excludedFiles])];
      }

      if (Array.isArray(config.excludedCategories)) {
        result.excludedCategories = [...new Set([...result.excludedCategories, ...config.excludedCategories])];
      }

      if (Array.isArray(config.autoResolvePatterns)) {
        result.autoResolvePatterns = [...new Set([...result.autoResolvePatterns, ...config.autoResolvePatterns])];
      }

      if (Array.isArray(config.escalatePatterns)) {
        result.escalatePatterns = [...result.escalatePatterns, ...config.escalatePatterns];
      }

      if (Array.isArray(config.suppressFalsePositives)) {
        result.suppressFalsePositives = [...result.suppressFalsePositives, ...config.suppressFalsePositives];
      }

      if (config.commentOptions && typeof config.commentOptions === 'object') {
        result.commentOptions = { ...result.commentOptions, ...config.commentOptions };
      }
    }

    return result;
  }

  detectRepoType(baseDir = this.baseDir) {
    try {
      if (this.isWordPressPlugin(baseDir)) {
        return REPO_TYPES.WORDPRESS_PLUGIN;
      }

      if (this.isWordPressTheme(baseDir)) {
        return REPO_TYPES.WORDPRESS_THEME;
      }

      return REPO_TYPES.GITHUB;
    } catch (e) {
      console.error('Error detecting repo type:', e.message);
      return REPO_TYPES.GITHUB;
    }
  }

  isWordPressPlugin(baseDir) {
    const pluginFile = path.join(baseDir, 'plugin.php');
    if (fs.existsSync(pluginFile)) {
      const content = fs.readFileSync(pluginFile, 'utf8');
      return content.includes('Plugin Name:') || content.includes('Plugin URI:');
    }

    const composerFile = path.join(baseDir, 'composer.json');
    if (fs.existsSync(composerFile)) {
      try {
        const composer = JSON.parse(fs.readFileSync(composerFile, 'utf8'));
        return composer.type === 'wordpress-plugin';
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  isWordPressTheme(baseDir) {
    const styleFile = path.join(baseDir, 'style.css');
    if (fs.existsSync(styleFile)) {
      const content = fs.readFileSync(styleFile, 'utf8');
      return content.includes('Theme Name:') || content.includes('Template:');
    }

    const composerFile = path.join(baseDir, 'composer.json');
    if (fs.existsSync(composerFile)) {
      try {
        const composer = JSON.parse(fs.readFileSync(composerFile, 'utf8'));
        return composer.type === 'wordpress-theme';
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  getOverrideConfigPath(baseDir = this.baseDir) {
    return path.join(baseDir, '.github', 'reviewer-agent-v2.yml');
  }

  validateConfiguration(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
      errors.push('Configuration must be an object');
      return errors;
    }

    if (config.excludedFiles && !Array.isArray(config.excludedFiles)) {
      errors.push('excludedFiles must be an array');
    }

    if (config.excludedCategories && !Array.isArray(config.excludedCategories)) {
      errors.push('excludedCategories must be an array');
    }

    if (config.autoResolvePatterns && !Array.isArray(config.autoResolvePatterns)) {
      errors.push('autoResolvePatterns must be an array');
    }

    if (config.escalatePatterns && !Array.isArray(config.escalatePatterns)) {
      errors.push('escalatePatterns must be an array');
    }

    if (config.suppressFalsePositives && !Array.isArray(config.suppressFalsePositives)) {
      errors.push('suppressFalsePositives must be an array');
    }

    if (config.commentOptions && typeof config.commentOptions !== 'object') {
      errors.push('commentOptions must be an object');
    }

    return errors;
  }

  clearCache() {
    this.cache = {};
  }
}

module.exports = {
  ConfigurationSystem,
  REPO_TYPES,
};
