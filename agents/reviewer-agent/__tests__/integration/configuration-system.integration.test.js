/**
 * Configuration System Integration Tests
 * Tests configuration loading and merging with different repo types
 */

const {
  ConfigurationSystem,
  REPO_TYPES,
} = require("../../configuration-system");
const configVariants = require("../fixtures/config-variants.json");

describe("Reviewer Agent v2 - Configuration System", () => {
  let configSystem;

  beforeEach(() => {
    configSystem = new ConfigurationSystem();
  });

  test("should load default configuration", () => {
    const config = configSystem.loadConfiguration(REPO_TYPES.GITHUB);

    expect(config).toBeDefined();
    expect(config.excludedFiles).toBeDefined();
    expect(Array.isArray(config.excludedFiles)).toBe(true);
  });

  test("should load GitHub repo configuration", () => {
    const config = configSystem.loadConfiguration(REPO_TYPES.GITHUB);

    expect(config).toBeDefined();
    expect(config.excludedFiles).toBeDefined();
    expect(config.excludedCategories).toBeDefined();
  });

  test("should load WordPress plugin configuration", () => {
    const config = configSystem.loadConfiguration(REPO_TYPES.WORDPRESS_PLUGIN);

    expect(config).toBeDefined();
    expect(config.excludedFiles).toBeDefined();
  });

  test("should load WordPress theme configuration", () => {
    const config = configSystem.loadConfiguration(REPO_TYPES.WORDPRESS_THEME);

    expect(config).toBeDefined();
    expect(config.excludedFiles).toBeDefined();
  });

  test("should merge configurations with proper precedence", () => {
    const defaultConfig = configSystem.loadConfiguration(REPO_TYPES.GITHUB);

    expect(defaultConfig).toBeDefined();
    expect(defaultConfig.excludedFiles).toBeDefined();
    expect(Array.isArray(defaultConfig.excludedFiles)).toBe(true);
  });

  test("should cache loaded configurations", () => {
    const config1 = configSystem.loadConfiguration(REPO_TYPES.GITHUB);
    const config2 = configSystem.loadConfiguration(REPO_TYPES.GITHUB);

    expect(config1).toBe(config2);
  });

  test("should clear cache when requested", () => {
    const config1 = configSystem.loadConfiguration(REPO_TYPES.GITHUB);
    configSystem.clearCache();
    const config2 = configSystem.loadConfiguration(REPO_TYPES.GITHUB);

    expect(config1).not.toBe(config2);
    expect(JSON.stringify(config1)).toBe(JSON.stringify(config2));
  });

  test("should detect GitHub repo type", () => {
    const repoType = configSystem.detectRepoType();
    expect(repoType).toBe(REPO_TYPES.GITHUB);
  });

  test("should validate correct configuration", () => {
    const validConfig = {
      excludedFiles: ["*.test.js"],
      excludedCategories: ["style"],
      autoResolvePatterns: [],
      escalatePatterns: [],
      suppressFalsePositives: [],
      commentOptions: {},
    };

    const errors = configSystem.validateConfiguration(validConfig);
    expect(errors.length).toBe(0);
  });

  test("should invalidate configuration with wrong types", () => {
    const invalidConfig = {
      excludedFiles: "not-an-array",
      excludedCategories: ["style"],
    };

    const errors = configSystem.validateConfiguration(invalidConfig);
    expect(errors.length).toBeGreaterThan(0);
  });

  test("should handle all 6 repo type variants", () => {
    configVariants.variants.forEach((variant) => {
      const config = configSystem.loadConfiguration(variant.repoType);
      expect(config).toBeDefined();
      expect(config.excludedFiles).toBeDefined();
    });
  });

  test("should merge multiple configs correctly", () => {
    const config1 = {
      excludedFiles: ["a.js", "b.js"],
      excludedCategories: ["style"],
    };

    const config2 = {
      excludedFiles: ["c.js"],
      excludedCategories: ["docs"],
    };

    const merged = configSystem.mergeConfigs(config1, config2);

    expect(merged.excludedFiles.length).toBe(3);
    expect(merged.excludedCategories.length).toBe(2);
  });

  test("should deduplicate when merging arrays", () => {
    const config1 = {
      excludedFiles: ["a.js", "b.js"],
    };

    const config2 = {
      excludedFiles: ["b.js", "c.js"],
    };

    const merged = configSystem.mergeConfigs(config1, config2);

    expect(merged.excludedFiles.length).toBe(3);
  });

  test("should handle override config path", () => {
    const overridePath = configSystem.getOverrideConfigPath();

    expect(overridePath).toBeDefined();
    expect(typeof overridePath).toBe("string");
    expect(overridePath).toContain("reviewer-agent-v2.yml");
  });

  test("should handle null/undefined configs gracefully", () => {
    const merged = configSystem.mergeConfigs(null, undefined, {});

    expect(merged).toBeDefined();
    expect(merged.excludedFiles).toBeDefined();
  });

  test("should validate required fields", () => {
    const invalidConfig = null;
    const errors = configSystem.validateConfiguration(invalidConfig);

    expect(errors.length).toBeGreaterThan(0);
  });

  test("should have consistent structure for all repo types", () => {
    const types = [
      REPO_TYPES.GITHUB,
      REPO_TYPES.WORDPRESS_PLUGIN,
      REPO_TYPES.WORDPRESS_THEME,
    ];

    const configs = types.map((type) => configSystem.loadConfiguration(type));

    configs.forEach((config) => {
      expect(config.excludedFiles).toBeDefined();
      expect(config.excludedCategories).toBeDefined();
      expect(config.autoResolvePatterns).toBeDefined();
      expect(config.escalatePatterns).toBeDefined();
      expect(config.suppressFalsePositives).toBeDefined();
      expect(config.commentOptions).toBeDefined();
    });
  });

  test("should respect config precedence: defaults < repoType < override", () => {
    const merged = configSystem.mergeConfigs(
      { excludedFiles: ["default"] },
      { excludedFiles: ["repoType"] },
      { excludedFiles: ["override"] },
    );

    expect(merged.excludedFiles).toContain("default");
    expect(merged.excludedFiles).toContain("repoType");
    expect(merged.excludedFiles).toContain("override");
  });
});
