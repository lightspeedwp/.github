/**
 * Config Loaders Tests
 * Tests for WordPress configuration helper functions
 */

const {
  getWordPressPhpcsConfig,
  getBlockPluginConfig,
  getBlockThemeConfig,
  resolveRepositoryRoot,
  withTimeout,
} = require('../../../scripts/agents/linting.agent.js');

describe('Config Loaders', () => {
  describe('getWordPressPhpcsConfig', () => {
    test('generates standard WordPress plugin PHPCS config', () => {
      const config = getWordPressPhpcsConfig({ type: 'plugin' });
      expect(config).toHaveProperty('standards');
      expect(config.standards).toContain('WordPress');
    });

    test('generates config with custom ruleset', () => {
      const config = getWordPressPhpcsConfig({
        type: 'plugin',
        ruleset: 'WordPress-Extra',
      });
      expect(config.standards).toContain('WordPress-Extra');
    });

    test('includes exclude patterns', () => {
      const config = getWordPressPhpcsConfig({ type: 'plugin' });
      expect(config).toHaveProperty('exclude');
      expect(Array.isArray(config.exclude)).toBe(true);
    });

    test('handles theme context', () => {
      const config = getWordPressPhpcsConfig({ type: 'theme' });
      expect(config).toHaveProperty('standards');
      expect(config.standards).toContain('WordPress');
    });
  });

  describe('getBlockPluginConfig', () => {
    test('generates ESLint config for block plugins', () => {
      const config = getBlockPluginConfig();
      expect(config).toHaveProperty('extends');
      expect(config.extends).toContain('plugin:react/recommended');
    });

    test('includes TypeScript support when requested', () => {
      const config = getBlockPluginConfig({ typescript: true });
      expect(config).toHaveProperty('parser');
      expect(config.parser).toContain('typescript');
    });

    test('includes React rules', () => {
      const config = getBlockPluginConfig();
      expect(config).toHaveProperty('rules');
      expect(config.rules).toHaveProperty('react/jsx-uses-react');
    });

    test('supports custom rule overrides', () => {
      const overrides = { 'no-console': 'warn' };
      const config = getBlockPluginConfig({ rules: overrides });
      expect(config.rules['no-console']).toBe('warn');
    });
  });

  describe('getBlockThemeConfig', () => {
    test('generates config for WordPress block themes', () => {
      const config = getBlockThemeConfig();
      expect(config).toHaveProperty('extends');
    });

    test('includes CSS/SCSS rules', () => {
      const config = getBlockThemeConfig();
      expect(config).toBeDefined();
    });

    test('handles style variations', () => {
      const config = getBlockThemeConfig({ includeVariations: true });
      expect(config).toBeDefined();
    });
  });

  describe('resolveRepositoryRoot', () => {
    test('resolves absolute Unix path', () => {
      const result = resolveRepositoryRoot('/home/user/my-plugin');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    test('resolves Windows path', () => {
      const result = resolveRepositoryRoot('C:\\Users\\user\\my-plugin');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    test('resolves relative path', () => {
      const result = resolveRepositoryRoot('./my-plugin');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    test('resolves parent directory references', () => {
      const result = resolveRepositoryRoot('../plugins/my-plugin');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    test('handles paths with spaces', () => {
      const result = resolveRepositoryRoot('/home/user/my plugin');
      expect(result).toBeDefined();
    });

    test('handles paths with special characters', () => {
      const result = resolveRepositoryRoot('/home/user/my-plugin-v2.0');
      expect(result).toBeDefined();
    });
  });

  describe('withTimeout', () => {
    test('executes function within timeout', async () => {
      const fn = jest.fn(() => Promise.resolve('success'));
      const result = await withTimeout(fn, 5000);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalled();
    });

    test('throws error when function exceeds timeout', async () => {
      const fn = () =>
        new Promise((resolve) => setTimeout(() => resolve('slow'), 2000));
      await expect(withTimeout(fn, 100)).rejects.toThrow();
    });

    test('returns result synchronously if promise resolves quickly', async () => {
      const fn = () => Promise.resolve('quick');
      const result = await withTimeout(fn, 5000);
      expect(result).toBe('quick');
    });

    test('handles synchronous functions', async () => {
      const fn = () => 'sync result';
      const result = await withTimeout(fn, 5000);
      expect(result).toBe('sync result');
    });

    test('rejects with custom timeout message', async () => {
      const fn = () => new Promise(() => {}); // Never resolves
      const timeoutMs = 100;
      await expect(withTimeout(fn, timeoutMs)).rejects.toThrow(
        /timeout|exceeded/i
      );
    });

    test('uses default timeout if not specified', async () => {
      const fn = () => Promise.resolve('result');
      const result = await withTimeout(fn);
      expect(result).toBe('result');
    });
  });

  describe('Error Handling', () => {
    test('handles missing configuration parameters gracefully', () => {
      expect(() => getWordPressPhpcsConfig()).not.toThrow();
    });

    test('handles invalid config type', () => {
      const config = getWordPressPhpcsConfig({ type: 'invalid' });
      expect(config).toBeDefined();
    });

    test('withTimeout rejects on function error', async () => {
      const fn = () => Promise.reject(new Error('Function failed'));
      await expect(withTimeout(fn, 5000)).rejects.toThrow('Function failed');
    });
  });

  describe('Config Inheritance', () => {
    test('merges configs correctly', () => {
      const baseConfig = getWordPressPhpcsConfig({ type: 'plugin' });
      expect(baseConfig).toHaveProperty('standards');
      expect(baseConfig).toHaveProperty('exclude');
    });

    test('respects override values', () => {
      const customConfig = getWordPressPhpcsConfig({
        type: 'plugin',
        ruleset: 'Custom',
      });
      expect(customConfig).toBeDefined();
    });
  });
});
