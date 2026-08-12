const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

class ConfigError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

class ConfigNotFoundError extends ConfigError {
  constructor(message) {
    super("ConfigNotFoundError", message);
  }
}

class ConfigInvalidError extends ConfigError {
  constructor(message) {
    super("ConfigInvalidError", message);
  }
}

class ConfigParseError extends ConfigError {
  constructor(message) {
    super("ConfigParseError", message);
  }
}

const DEFAULT_CONFIG = {
  adr: {
    directory: "docs/adr",
    template: "standard",
    number_format: {
      style: "sequential",
      zero_padded: true,
      width: 4,
    },
    approval_workflow: {
      enabled: false,
      method: "none",
      required_approvals: 1,
    },
    metadata: {
      required_fields: ["date", "status", "authors"],
      optional_fields: ["supersedes", "superseded-by", "tags"],
    },
    custom_fields: {
      wordpress: {
        impact_areas: [],
        performance_tier: "medium",
        backwards_compatible: true,
      },
    },
    validation: {
      enforce_unique_titles: true,
      enforce_valid_references: true,
      enforce_status_transitions: false,
      minimum_content_length: 100,
    },
  },
};

let cachedSchema = null;

function loadSchema() {
  if (cachedSchema) {
    return cachedSchema;
  }

  const schemaPath = path.join(__dirname, "../config/adr-config.schema.json");
  try {
    const schemaContent = fs.readFileSync(schemaPath, "utf-8");
    cachedSchema = JSON.parse(schemaContent);
    return cachedSchema;
  } catch (error) {
    throw new ConfigParseError(`Failed to load schema: ${error.message}`);
  }
}

function validateConfig(config, schema = null) {
  const schemaToUse = schema || loadSchema();
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schemaToUse);
  const valid = validate(config);

  if (!valid) {
    const errors = validate.errors.map((error) => ({
      path: error.instancePath || "root",
      message: error.message,
      value: error.data,
    }));

    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

function mergeConfigs(orgConfig, repoConfig) {
  const merged = JSON.parse(JSON.stringify(orgConfig));

  function deepMerge(target, source) {
    Object.keys(source).forEach((key) => {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        if (!target[key]) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
    return target;
  }

  return deepMerge(merged, repoConfig);
}

function getDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

function findConfigFile(startPath) {
  let currentPath = path.resolve(startPath);
  const root = path.parse(currentPath).root;

  while (currentPath !== root) {
    const configPath = path.join(currentPath, ".adr-config.json");
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    currentPath = path.dirname(currentPath);
  }

  return null;
}

function loadConfigFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    try {
      return JSON.parse(content);
    } catch (parseError) {
      throw new ConfigParseError(
        `Failed to parse ${filePath}: ${parseError.message}`,
      );
    }
  } catch (readError) {
    if (readError instanceof ConfigParseError) {
      throw readError;
    }
    throw new ConfigParseError(
      `Failed to read ${filePath}: ${readError.message}`,
    );
  }
}

function loadConfig(searchPath = process.cwd(), options = {}) {
  const { orgConfigPath = null, strict = false, debug = false } = options;

  let orgConfig = null;
  let repoConfig = null;

  if (orgConfigPath && fs.existsSync(orgConfigPath)) {
    try {
      orgConfig = loadConfigFile(orgConfigPath);
      if (debug) {
        console.log(`[ADR Config] Loaded org config from ${orgConfigPath}`);
      }
    } catch (error) {
      if (debug) {
        console.log(`[ADR Config] Failed to load org config: ${error.message}`);
      }
    }
  }

  const repoConfigPath = findConfigFile(searchPath);
  if (!repoConfigPath) {
    const checkedPaths = [];
    let currentPath = path.resolve(searchPath);
    const root = path.parse(currentPath).root;
    while (currentPath !== root) {
      checkedPaths.push(path.join(currentPath, ".adr-config.json"));
      currentPath = path.dirname(currentPath);
    }

    throw new ConfigNotFoundError(
      `No .adr-config.json found in ${searchPath} or parent directories`,
    );
  }

  repoConfig = loadConfigFile(repoConfigPath);
  if (debug) {
    console.log(`[ADR Config] Loaded repo config from ${repoConfigPath}`);
  }

  let mergedConfig = repoConfig;
  let wasMerged = false;

  if (orgConfig) {
    mergedConfig = mergeConfigs(orgConfig, repoConfig);
    wasMerged = true;
    if (debug) {
      console.log("[ADR Config] Merged org and repo configs");
    }
  }

  const validation = validateConfig(mergedConfig);
  if (!validation.valid) {
    const errorMessages = validation.errors
      .map((e) => `  ${e.path}: ${e.message}`)
      .join("\n");
    throw new ConfigInvalidError(
      `Configuration validation failed:\n${errorMessages}`,
    );
  }

  if (strict) {
    const schema = loadSchema();
    const strictValidation = validateConfig(mergedConfig, schema);
    if (!strictValidation.valid) {
      const errorMessages = strictValidation.errors
        .map((e) => `  ${e.path}: ${e.message}`)
        .join("\n");
      throw new ConfigInvalidError(
        `Configuration validation failed (strict mode):\n${errorMessages}`,
      );
    }
  }

  return {
    ...mergedConfig,
    _source: {
      orgConfig: !!orgConfig,
      repoConfig: !!repoConfig,
      merged: wasMerged,
      repoConfigPath,
      orgConfigPath,
    },
  };
}

module.exports = {
  loadConfig,
  validateConfig,
  mergeConfigs,
  getDefaults,
  loadConfigFile,
  findConfigFile,
  ConfigNotFoundError,
  ConfigInvalidError,
  ConfigParseError,
};
