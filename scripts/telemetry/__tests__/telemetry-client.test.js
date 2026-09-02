/**
 * Telemetry Client Unit Tests
 * 
 * Comprehensive tests for the telemetry client covering:
 * - Property validation
 * - Backend switching
 * - Error handling
 * - Environment detection
 * - Statistics tracking
 */

const fs = require('fs');
const path = require('path');
const {
  TelemetryClient,
  createTelemetryClient,
  Environment,
  BackendType
} = require('../telemetry-client');
const { EVENT_SCHEMAS } = require('../event-schemas');

describe('TelemetryClient', () => {
  let client;
  let tempDir;

  beforeEach(() => {
    // Create temp directory for file backend tests
    tempDir = path.join(__dirname, '.temp-telemetry');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Reset environment
    delete process.env.NODE_ENV;
    delete process.env.CI;
    delete process.env.TELEMETRY_INCLUDE_RESTRICTED;
  });

  afterEach(() => {
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Constructor and Initialization', () => {
    it('should create a telemetry client with default options', () => {
      client = new TelemetryClient();
      
      expect(client).toBeDefined();
      expect(client.enabled).toBe(true);
      expect(client.stats.totalEvents).toBe(0);
    });

    it('should accept custom options', () => {
      client = new TelemetryClient({
        environment: Environment.PRODUCTION,
        backend: BackendType.FILE,
        outputPath: tempDir,
        enabled: false
      });

      expect(client.environment).toBe(Environment.PRODUCTION);
      expect(client.backend).toBe(BackendType.FILE);
      expect(client.outputPath).toBe(tempDir);
      expect(client.enabled).toBe(false);
    });

    it('should accept event schemas', () => {
      client = new TelemetryClient({
        eventSchemas: EVENT_SCHEMAS
      });

      expect(client.eventSchemas).toBeDefined();
      expect(client.eventSchemas['release.validation.started']).toBeDefined();
    });
  });

  describe('Environment Detection', () => {
    it('should detect test environment', () => {
      process.env.NODE_ENV = 'test';
      client = new TelemetryClient();
      
      expect(client.detectEnvironment()).toBe(Environment.TEST);
    });

    it('should detect production environment from NODE_ENV', () => {
      process.env.NODE_ENV = 'production';
      client = new TelemetryClient();
      
      expect(client.detectEnvironment()).toBe(Environment.PRODUCTION);
    });

    it('should detect production environment from CI flag', () => {
      process.env.CI = 'true';
      client = new TelemetryClient();
      
      expect(client.detectEnvironment()).toBe(Environment.PRODUCTION);
    });

    it('should default to development environment', () => {
      client = new TelemetryClient();
      
      expect(client.detectEnvironment()).toBe(Environment.DEVELOPMENT);
    });
  });

  describe('Backend Selection', () => {
    it('should use NONE backend for test environment', () => {
      process.env.NODE_ENV = 'test';
      client = new TelemetryClient();
      
      expect(client.getDefaultBackend()).toBe(BackendType.NONE);
    });

    it('should use CONSOLE backend for development environment', () => {
      client = new TelemetryClient();
      
      expect(client.getDefaultBackend()).toBe(BackendType.CONSOLE);
    });

    it('should use FILE backend for production environment', () => {
      process.env.NODE_ENV = 'production';
      client = new TelemetryClient();
      
      expect(client.getDefaultBackend()).toBe(BackendType.FILE);
    });
  });

  describe('Event Emission', () => {
    beforeEach(() => {
      client = new TelemetryClient({
        backend: BackendType.NONE,
        eventSchemas: EVENT_SCHEMAS
      });
    });

    it('should emit a basic event', () => {
      const result = client.emit('release.validation.started', {
        safe: {
          component: 'release-agent',
          version: '1.0.0'
        },
        restricted: {
          repositoryName: 'test/repo'
        }
      });

      expect(result).toBe(true);
      expect(client.stats.totalEvents).toBe(1);
      expect(client.stats.eventsByType['release.validation.started']).toBe(1);
    });

    it('should not emit when disabled', () => {
      client.enabled = false;
      
      const result = client.emit('release.validation.started', {
        safe: { component: 'test', version: '1.0.0' },
        restricted: { repositoryName: 'test/repo' }
      });

      expect(result).toBe(false);
      expect(client.stats.totalEvents).toBe(0);
    });

    it('should handle missing event type', () => {
      const result = client.emit('', {
        safe: { component: 'test' }
      });

      expect(result).toBe(false);
      expect(client.stats.errors).toBe(1);
    });

    it('should track statistics correctly', () => {
      client.emit('release.validation.started', {
        safe: { component: 'test', version: '1.0.0' },
        restricted: { repositoryName: 'test/repo' }
      });
      client.emit('release.validation.started', {
        safe: { component: 'test', version: '1.0.0' },
        restricted: { repositoryName: 'test/repo' }
      });
      client.emit('metrics.collection.started', {
        safe: { repositoryCount: 5, collectionType: 'weekly' }
      });

      expect(client.stats.totalEvents).toBe(3);
      expect(client.stats.eventsByType['release.validation.started']).toBe(2);
      expect(client.stats.eventsByType['metrics.collection.started']).toBe(1);
    });
  });

  describe('Property Validation', () => {
    beforeEach(() => {
      client = new TelemetryClient({
        backend: BackendType.NONE,
        eventSchemas: EVENT_SCHEMAS
      });
    });

    it('should validate required safe properties', () => {
      const result = client.emit('release.validation.started', {
        safe: {
          // Missing required 'component' and 'version'
        },
        restricted: {
          repositoryName: 'test/repo'
        }
      });

      expect(result).toBe(false);
      expect(client.stats.errors).toBe(1);
    });

    it('should validate required restricted properties', () => {
      const result = client.emit('release.validation.started', {
        safe: {
          component: 'release-agent',
          version: '1.0.0'
        },
        restricted: {
          // Missing required 'repositoryName'
        }
      });

      expect(result).toBe(false);
      expect(client.stats.errors).toBe(1);
    });

    it('should accept valid properties', () => {
      const result = client.emit('release.validation.started', {
        safe: {
          component: 'release-agent',
          version: '1.0.0',
          trigger: 'manual'  // optional
        },
        restricted: {
          repositoryName: 'test/repo',
          changelogPath: 'CHANGELOG.md'  // optional
        }
      });

      expect(result).toBe(true);
      expect(client.stats.errors).toBe(0);
    });
  });

  describe('Restricted Properties Handling', () => {
    it('should include restricted properties in development', () => {
      client = new TelemetryClient({
        environment: Environment.DEVELOPMENT,
        backend: BackendType.NONE
      });

      expect(client.shouldIncludeRestrictedProperties()).toBe(true);
    });

    it('should include restricted properties in test', () => {
      client = new TelemetryClient({
        environment: Environment.TEST,
        backend: BackendType.NONE
      });

      expect(client.shouldIncludeRestrictedProperties()).toBe(true);
    });

    it('should not include restricted properties in production by default', () => {
      client = new TelemetryClient({
        environment: Environment.PRODUCTION,
        backend: BackendType.NONE
      });

      expect(client.shouldIncludeRestrictedProperties()).toBe(false);
    });

    it('should include restricted properties in production when env var set', () => {
      process.env.TELEMETRY_INCLUDE_RESTRICTED = 'true';
      client = new TelemetryClient({
        environment: Environment.PRODUCTION,
        backend: BackendType.NONE
      });

      expect(client.shouldIncludeRestrictedProperties()).toBe(true);
    });
  });

  describe('Backend - Console', () => {
    beforeEach(() => {
      client = new TelemetryClient({
        backend: BackendType.CONSOLE
      });
    });

    it('should log to console', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      client.emit('test.event', {
        safe: { key: 'value' }
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Telemetry]',
        expect.stringContaining('"eventType":"test.event"')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Backend - File', () => {
    beforeEach(() => {
      client = new TelemetryClient({
        backend: BackendType.FILE,
        outputPath: tempDir
      });
    });

    it('should write events to file', () => {
      client.emit('test.event', {
        safe: { key: 'value' }
      });

      const date = new Date().toISOString().split('T')[0];
      const filepath = path.join(tempDir, `telemetry-${date}.jsonl`);

      expect(fs.existsSync(filepath)).toBe(true);

      const content = fs.readFileSync(filepath, 'utf8');
      const event = JSON.parse(content);

      expect(event.eventType).toBe('test.event');
      expect(event.safe.key).toBe('value');
    });

    it('should append multiple events to the same file', () => {
      client.emit('test.event.1', { safe: { id: 1 } });
      client.emit('test.event.2', { safe: { id: 2 } });

      const date = new Date().toISOString().split('T')[0];
      const filepath = path.join(tempDir, `telemetry-${date}.jsonl`);

      const content = fs.readFileSync(filepath, 'utf8');
      const lines = content.trim().split('\n');

      expect(lines.length).toBe(2);

      const event1 = JSON.parse(lines[0]);
      const event2 = JSON.parse(lines[1]);

      expect(event1.eventType).toBe('test.event.1');
      expect(event2.eventType).toBe('test.event.2');
    });

    it('should handle file write errors gracefully', () => {
      // Use invalid path to trigger error
      client.outputPath = '/invalid/path/that/does/not/exist';

      const result = client.emit('test.event', {
        safe: { key: 'value' }
      });

      // Should still return true but log error
      expect(client.stats.errors).toBeGreaterThan(0);
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      client = new TelemetryClient({
        backend: BackendType.NONE
      });
    });

    it('should get current statistics', () => {
      client.emit('test.event.1', { safe: {} });
      client.emit('test.event.1', { safe: {} });
      client.emit('test.event.2', { safe: {} });

      const stats = client.getStats();

      expect(stats.totalEvents).toBe(3);
      expect(stats.eventsByType['test.event.1']).toBe(2);
      expect(stats.eventsByType['test.event.2']).toBe(1);
    });

    it('should reset statistics', () => {
      client.emit('test.event', { safe: {} });
      client.emit('test.event', { safe: {} });

      expect(client.stats.totalEvents).toBe(2);

      client.resetStats();

      expect(client.stats.totalEvents).toBe(0);
      expect(client.stats.eventsByType).toEqual({});
      expect(client.stats.errors).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should use custom error handler', () => {
      const customHandler = jest.fn();
      
      client = new TelemetryClient({
        backend: BackendType.NONE,
        errorHandler: customHandler
      });

      client.emit('', { safe: {} }); // Invalid event type

      expect(customHandler).toHaveBeenCalled();
      expect(customHandler).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({ eventType: '' })
      );
    });

    it('should never throw errors', () => {
      client = new TelemetryClient({
        backend: BackendType.NONE,
        eventSchemas: EVENT_SCHEMAS
      });

      // Should not throw even with invalid data
      expect(() => {
        client.emit('invalid.event.type', { safe: {} });
      }).not.toThrow();

      expect(() => {
        client.emit('release.validation.started', {
          // Missing required properties
        });
      }).not.toThrow();
    });
  });

  describe('createTelemetryClient factory', () => {
    it('should create a client instance', () => {
      const client = createTelemetryClient({
        backend: BackendType.NONE
      });

      expect(client).toBeInstanceOf(TelemetryClient);
      expect(client.backend).toBe(BackendType.NONE);
    });
  });

  describe('Flush', () => {
    it('should flush pending events', async () => {
      client = new TelemetryClient({
        backend: BackendType.FILE,
        outputPath: tempDir
      });

      await expect(client.flush()).resolves.toBeUndefined();
    });
  });
});
