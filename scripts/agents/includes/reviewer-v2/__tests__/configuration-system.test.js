const { ConfigurationSystem, REPO_TYPES } = require('../configuration-system');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('ConfigurationSystem', () => {
  let configSystem;
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'config-test-'));
    configSystem = new ConfigurationSystem(tempDir);
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    configSystem.clearCache();
  });

  describe('initialization', () => {
    test('should create with default base directory', () => {
      expect(configSystem.baseDir).toBeDefined();
      expect(configSystem.configDir).toBeDefined();
    });

    test('should have empty cache initially', () => {
      expect(configSystem.cache).toEqual({});
    });
  });

  describe('loadConfiguration', () => {
    test('should return merged config', () => {
      const config = configSystem.loadConfiguration(REPO_TYPES.GITHUB);

      expect(config).toEqual(
        expect.objectContaining({
          excludedFiles: expect.any(Array),
          excludedCategories: expect.any(Array),
          autoResolvePatterns: expect.any(Array),
          escalatePatterns: expect.any(Array),
          suppressFalsePositives: expect.any(Array),
          commentOptions: expect.any(Object),
        })
      );
    });

    test('should cache configuration', () => {
      const config1 = configSystem.loadConfiguration(REPO_TYPES.GITHUB);
      const config2 = configSystem.loadConfiguration(REPO_TYPES.GITHUB);

      expect(config1).toBe(config2);
    });

    test('should support different repo types', () => {
      const github = configSystem.loadConfiguration(REPO_TYPES.GITHUB);
      const plugin = configSystem.loadConfiguration(REPO_TYPES.WORDPRESS_PLUGIN);
      const theme = configSystem.loadConfiguration(REPO_TYPES.WORDPRESS_THEME);

      expect(github).toBeDefined();
      expect(plugin).toBeDefined();
      expect(theme).toBeDefined();
    });
  });

  describe('mergeConfigs', () => {
    test('should merge multiple config objects', () => {
      const config1 = {
        excludedFiles: ['*.test.js'],
        excludedCategories: ['style'],
      };

      const config2 = {
        excludedFiles: ['node_modules/*'],
        excludedCategories: ['documentation'],
      };

      const result = configSystem.mergeConfigs(config1, config2);

      expect(result.excludedFiles).toContain('*.test.js');
      expect(result.excludedFiles).toContain('node_modules/*');
      expect(result.excludedCategories).toContain('style');
      expect(result.excludedCategories).toContain('documentation');
    });

    test('should remove duplicates from arrays', () => {
      const config1 = {
        excludedFiles: ['*.test.js', 'node_modules/*'],
      };

      const config2 = {
        excludedFiles: ['*.test.js', 'build/*'],
      };

      const result = configSystem.mergeConfigs(config1, config2);

      expect(result.excludedFiles.filter(f => f === '*.test.js')).toHaveLength(1);
    });

    test('should handle empty configs', () => {
      const result = configSystem.mergeConfigs({}, null, undefined, {});

      expect(result.excludedFiles).toEqual([]);
      expect(result.excludedCategories).toEqual([]);
    });

    test('should merge comment options', () => {
      const config1 = {
        commentOptions: {
          format: 'markdown',
          maxFindings: 10,
        },
      };

      const config2 = {
        commentOptions: {
          maxFindings: 5,
          includeLinks: true,
        },
      };

      const result = configSystem.mergeConfigs(config1, config2);

      expect(result.commentOptions.format).toBe('markdown');
      expect(result.commentOptions.maxFindings).toBe(5);
      expect(result.commentOptions.includeLinks).toBe(true);
    });
  });

  describe('detectRepoType', () => {
    test('should detect WordPress plugin', () => {
      const pluginFile = path.join(tempDir, 'plugin.php');
      fs.writeFileSync(pluginFile, '<?php\n// Plugin Name: Test Plugin\n');

      const type = configSystem.detectRepoType(tempDir);

      expect(type).toBe(REPO_TYPES.WORDPRESS_PLUGIN);
    });

    test('should detect WordPress theme', () => {
      const styleFile = path.join(tempDir, 'style.css');
      fs.writeFileSync(styleFile, '/*\nTheme Name: Test Theme\n*/');

      const type = configSystem.detectRepoType(tempDir);

      expect(type).toBe(REPO_TYPES.WORDPRESS_THEME);
    });

    test('should detect GitHub repo by default', () => {
      const type = configSystem.detectRepoType(tempDir);

      expect(type).toBe(REPO_TYPES.GITHUB);
    });

    test('should detect from composer.json', () => {
      const composerFile = path.join(tempDir, 'composer.json');
      fs.writeFileSync(composerFile, JSON.stringify({ type: 'wordpress-plugin' }));

      const type = configSystem.detectRepoType(tempDir);

      expect(type).toBe(REPO_TYPES.WORDPRESS_PLUGIN);
    });
  });

  describe('getOverrideConfigPath', () => {
    test('should return correct override path', () => {
      const overridePath = configSystem.getOverrideConfigPath(tempDir);

      expect(overridePath).toContain('.github');
      expect(overridePath).toContain('reviewer-agent-v2.yml');
    });
  });

  describe('validateConfiguration', () => {
    test('should validate correct configuration', () => {
      const config = {
        excludedFiles: [],
        excludedCategories: [],
        autoResolvePatterns: [],
        escalatePatterns: [],
        suppressFalsePositives: [],
        commentOptions: {},
      };

      const errors = configSystem.validateConfiguration(config);

      expect(errors).toHaveLength(0);
    });

    test('should report null config as error', () => {
      const errors = configSystem.validateConfiguration(null);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('object');
    });

    test('should validate array fields', () => {
      const config = {
        excludedFiles: 'not an array',
      };

      const errors = configSystem.validateConfiguration(config);

      expect(errors.some(e => e.includes('excludedFiles'))).toBe(true);
    });

    test('should validate object fields', () => {
      const config = {
        commentOptions: 'not an object',
      };

      const errors = configSystem.validateConfiguration(config);

      expect(errors.some(e => e.includes('commentOptions'))).toBe(true);
    });
  });

  describe('cache management', () => {
    test('should cache loaded configurations', () => {
      const config1 = configSystem.loadConfiguration(REPO_TYPES.GITHUB);
      expect(configSystem.cache[`${REPO_TYPES.GITHUB}:default`]).toBeDefined();

      const config2 = configSystem.loadConfiguration(REPO_TYPES.GITHUB);
      expect(config1).toBe(config2);
    });

    test('should clear cache', () => {
      configSystem.loadConfiguration(REPO_TYPES.GITHUB);
      expect(Object.keys(configSystem.cache).length).toBeGreaterThan(0);

      configSystem.clearCache();
      expect(configSystem.cache).toEqual({});
    });

    test('should cache different repo types separately', () => {
      configSystem.loadConfiguration(REPO_TYPES.GITHUB);
      configSystem.loadConfiguration(REPO_TYPES.WORDPRESS_PLUGIN);

      const cacheKeys = Object.keys(configSystem.cache);
      expect(cacheKeys.length).toBe(2);
    });
  });

  describe('error handling', () => {
    test('should handle missing config files gracefully', () => {
      const config = configSystem.loadConfiguration(REPO_TYPES.GITHUB);

      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    test('should handle invalid YAML gracefully', () => {
      const invalidYaml = 'invalid: yaml: content: [';
      const configPath = path.join(tempDir, 'invalid.yml');
      fs.writeFileSync(configPath, invalidYaml);

      const config = configSystem.loadYamlFile(configPath);

      expect(config).toEqual({});
    });
  });

  describe('REPO_TYPES constant', () => {
    test('should have all repo type constants', () => {
      expect(REPO_TYPES.GITHUB).toBe('github');
      expect(REPO_TYPES.WORDPRESS_PLUGIN).toBe('wordpress-plugin');
      expect(REPO_TYPES.WORDPRESS_THEME).toBe('wordpress-theme');
    });
  });
});
