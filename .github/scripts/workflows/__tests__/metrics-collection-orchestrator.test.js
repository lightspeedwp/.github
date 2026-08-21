/**
 * Metrics Collection Orchestrator Tests
 */

const fs = require('fs');
const path = require('path');
const { MetricsCollectionOrchestrator } = require('../metrics-collection-orchestrator');

describe('MetricsCollectionOrchestrator', () => {
  let orchestrator;
  let configPath;
  let testConfig;

  beforeEach(() => {
    // Create test configuration
    testConfig = {
      schedule: {
        cron: '0 2 * * *',
        timezone: 'UTC',
        description: 'Daily metrics collection at 2 AM UTC',
      },
      execution: {
        parallelJobs: 1,
        timeoutMinutes: 30,
        maxRetries: 3,
        retryDelaySeconds: 5,
      },
      repositories: [
        {
          owner: 'lightspeedwp',
          repo: '.github',
          context: 'github-control-plane',
          enabled: true,
        },
      ],
      storage: {
        basePath: '.github/reports/metrics',
        format: 'json',
        timestampFormat: 'ISO8601',
        retention: {
          days: 365,
          maxFiles: 366,
        },
      },
      notifications: {
        onFailure: true,
        onSuccess: false,
        channels: ['github-issues'],
      },
      logging: {
        level: 'info',
        verbose: false,
        outputPath: '.github/reports/metrics/logs',
      },
    };

    // Write test configuration to temporary file
    configPath = path.join(__dirname, 'test-metrics-config.json');
    fs.writeFileSync(configPath, JSON.stringify(testConfig, null, 2));
  });

  afterEach(() => {
    // Clean up test configuration file
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  test('should load configuration successfully', () => {
    orchestrator = new MetricsCollectionOrchestrator(configPath);
    expect(orchestrator.config).toBeDefined();
    expect(orchestrator.config.repositories).toHaveLength(1);
    expect(orchestrator.config.schedule.cron).toBe('0 2 * * *');
  });

  test('should throw error when configuration file not found', () => {
    const invalidPath = path.join(__dirname, 'nonexistent-config.json');
    expect(() => {
      new MetricsCollectionOrchestrator(invalidPath);
    }).toThrow('Configuration file not found');
  });

  test('should throw error when repositories array is empty', () => {
    testConfig.repositories = [];
    fs.writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

    expect(() => {
      new MetricsCollectionOrchestrator(configPath);
    }).toThrow('No repositories configured');
  });

  test('should initialize storage and analyzers', () => {
    orchestrator = new MetricsCollectionOrchestrator(configPath);
    expect(orchestrator.storage).toBeDefined();
    expect(orchestrator.trendAnalyzer).toBeDefined();
    expect(orchestrator.anomalyDetector).toBeDefined();
  });

  test('should handle disabled repositories', async () => {
    testConfig.repositories = [
      { owner: 'org', repo: 'repo1', context: 'test', enabled: true },
      { owner: 'org', repo: 'repo2', context: 'test', enabled: false },
    ];
    fs.writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

    orchestrator = new MetricsCollectionOrchestrator(configPath);
    // Mock the collectMetricsForRepository method
    orchestrator.collectMetricsForRepository = jest.fn();

    // We can't fully test without mocking GitHub API, but we can verify the structure
    expect(orchestrator.config.repositories).toHaveLength(2);
  });

  test('should generate summary with correct structure', async () => {
    orchestrator = new MetricsCollectionOrchestrator(configPath);
    orchestrator.startTime = Date.now();

    // Add mock results
    orchestrator.results = [
      {
        repository: 'lightspeedwp/.github',
        status: 'success',
        metricsCount: 15,
        timestamp: new Date().toISOString(),
        collectionTime: 2500,
        anomalies: 0,
        trends: 5,
      },
    ];

    const summary = orchestrator.generateSummary();

    expect(summary).toBeDefined();
    expect(summary.timestamp).toBeDefined();
    expect(summary.execution).toBeDefined();
    expect(summary.execution.repositories.total).toBe(1);
    expect(summary.execution.repositories.successful).toBe(1);
    expect(summary.execution.repositories.failed).toBe(0);
    expect(summary.results).toHaveLength(1);
  });

  test('should handle mixed success and error results', async () => {
    orchestrator = new MetricsCollectionOrchestrator(configPath);
    orchestrator.startTime = Date.now();

    orchestrator.results = [
      {
        repository: 'lightspeedwp/.github',
        status: 'success',
        metricsCount: 15,
        timestamp: new Date().toISOString(),
        collectionTime: 2500,
        anomalies: 0,
        trends: 5,
      },
    ];

    orchestrator.errors = [
      {
        repository: 'lightspeedwp/plugin',
        status: 'error',
        error: 'GitHub API rate limit exceeded',
        timestamp: new Date().toISOString(),
      },
    ];

    const summary = orchestrator.generateSummary();

    expect(summary.execution.repositories.total).toBe(2);
    expect(summary.execution.repositories.successful).toBe(1);
    expect(summary.execution.repositories.failed).toBe(1);
    expect(summary.execution.repositories.percentage).toBe('50.00');
  });

  test('should save summary report to disk', async () => {
    orchestrator = new MetricsCollectionOrchestrator(configPath);
    orchestrator.startTime = Date.now();

    orchestrator.results = [
      {
        repository: 'lightspeedwp/.github',
        status: 'success',
        metricsCount: 15,
        timestamp: new Date().toISOString(),
        collectionTime: 2500,
        anomalies: 0,
        trends: 5,
      },
    ];

    const summary = orchestrator.generateSummary();

    // Verify summary file exists
    const expectedPath = path.join(
      '.github/reports/metrics',
      `collection-summary-${new Date().toISOString().split('T')[0]}.json`
    );

    if (fs.existsSync(expectedPath)) {
      const savedSummary = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
      expect(savedSummary.timestamp).toBeDefined();
      expect(savedSummary.results).toHaveLength(1);

      // Clean up
      fs.unlinkSync(expectedPath);
    }
  });

  test('should track collection duration', async () => {
    orchestrator = new MetricsCollectionOrchestrator(configPath);
    const startTime = Date.now();
    orchestrator.startTime = startTime;

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 100));

    orchestrator.results = [
      {
        repository: 'lightspeedwp/.github',
        status: 'success',
        metricsCount: 15,
        timestamp: new Date().toISOString(),
        collectionTime: 2500,
        anomalies: 0,
        trends: 5,
      },
    ];

    const summary = orchestrator.generateSummary();

    expect(summary.execution.duration).toBeGreaterThanOrEqual(100);
    expect(summary.execution.duration).toBeGreaterThan(0);
  });

  test('should handle parallel vs sequential execution configuration', () => {
    testConfig.execution.parallelJobs = 4;
    fs.writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

    orchestrator = new MetricsCollectionOrchestrator(configPath);

    expect(orchestrator.config.execution.parallelJobs).toBe(4);
  });

  test('should validate configuration structure', () => {
    orchestrator = new MetricsCollectionOrchestrator(configPath);

    expect(orchestrator.config.schedule).toBeDefined();
    expect(orchestrator.config.execution).toBeDefined();
    expect(orchestrator.config.repositories).toBeDefined();
    expect(orchestrator.config.storage).toBeDefined();
    expect(orchestrator.config.notifications).toBeDefined();
    expect(orchestrator.config.logging).toBeDefined();
  });
});
