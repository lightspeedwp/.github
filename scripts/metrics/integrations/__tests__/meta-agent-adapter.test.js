/**
 * Meta Agent Adapter Tests
 */

const MetricsContextProvider = require('../meta-agent-adapter');
const fs = require('fs');
const path = require('path');

describe('MetricsContextProvider', () => {
  let provider;
  const fixturesDir = path.join(__dirname, 'fixtures');

  beforeEach(() => {
    provider = new MetricsContextProvider({
      metricsDir: fixturesDir,
      validateSchema: true
    });
  });

  afterEach(() => {
    provider.clearCache();
  });

  describe('Constructor', () => {
    test('should initialize with default options', () => {
      const p = new MetricsContextProvider();
      expect(p).toBeInstanceOf(MetricsContextProvider);
      expect(p.cache).toBeInstanceOf(Map);
    });

    test('should initialize with custom options', () => {
      const p = new MetricsContextProvider({
        metricsDir: '/custom/path',
        validateSchema: false,
        cacheExpiry: 7200000
      });
      expect(p.metricsDir).toBe('/custom/path');
    });
  });

  describe('Schema Validation', () => {
    test('should validate correct schema', () => {
      const validMetrics = {
        type: 'metrics-collection',
        timestamp: '2026-08-19T02:00:00Z',
        context: 'control-plane',
        repositories: [{ name: 'test' }],
        healthScore: { overall: 75 },
        insights: []
      };

      expect(() => {
        provider.validateMetricsSchema(validMetrics);
      }).not.toThrow();
    });

    test('should reject missing required fields', () => {
      const invalidMetrics = {
        type: 'metrics-collection',
        timestamp: '2026-08-19T02:00:00Z'
        // Missing: context, repositories, healthScore, insights
      };

      expect(() => {
        provider.validateMetricsSchema(invalidMetrics);
      }).toThrow('Missing required field');
    });

    test('should reject invalid type', () => {
      const invalidMetrics = {
        type: 'wrong-type',
        timestamp: '2026-08-19T02:00:00Z',
        context: 'control-plane',
        repositories: [],
        healthScore: { overall: 75 },
        insights: []
      };

      expect(() => {
        provider.validateMetricsSchema(invalidMetrics);
      }).toThrow('Invalid metrics type');
    });

    test('should reject non-array repositories', () => {
      const invalidMetrics = {
        type: 'metrics-collection',
        timestamp: '2026-08-19T02:00:00Z',
        context: 'control-plane',
        repositories: 'not-an-array',
        healthScore: { overall: 75 },
        insights: []
      };

      expect(() => {
        provider.validateMetricsSchema(invalidMetrics);
      }).toThrow('Repositories must be an array');
    });

    test('should reject invalid healthScore', () => {
      const invalidMetrics = {
        type: 'metrics-collection',
        timestamp: '2026-08-19T02:00:00Z',
        context: 'control-plane',
        repositories: [{ name: 'test' }],
        healthScore: {},
        insights: []
      };

      expect(() => {
        provider.validateMetricsSchema(invalidMetrics);
      }).toThrow('Invalid healthScore');
    });
  });

  describe('Extract Top Issues', () => {
    test('should extract high severity anomalies', () => {
      const metrics = {
        anomalies: [
          {
            type: 'increase',
            metric: 'staleIssues',
            from: 5,
            to: 8,
            percentChange: 60,
            severity: 'high'
          }
        ]
      };

      const issues = provider.extractTopIssues(metrics);
      expect(issues).toHaveLength(1);
      expect(issues[0].metric).toBe('staleIssues');
      expect(issues[0].actionRequired).toBe(true);
    });

    test('should extract moderate severity anomalies', () => {
      const metrics = {
        anomalies: [
          {
            type: 'increase',
            metric: 'reviewTime',
            from: 1.2,
            to: 1.5,
            percentChange: 25,
            severity: 'moderate'
          }
        ]
      };

      const issues = provider.extractTopIssues(metrics);
      expect(issues).toHaveLength(1);
      expect(issues[0].severity).toBe('moderate');
    });

    test('should skip low severity anomalies', () => {
      const metrics = {
        anomalies: [
          {
            type: 'decrease',
            metric: 'minorMetric',
            from: 10,
            to: 9,
            percentChange: 10,
            severity: 'low'
          }
        ]
      };

      const issues = provider.extractTopIssues(metrics);
      expect(issues).toHaveLength(0);
    });

    test('should handle missing anomalies', () => {
      const metrics = {};
      const issues = provider.extractTopIssues(metrics);
      expect(issues).toEqual([]);
    });
  });

  describe('Get Trend Summary', () => {
    test('should extract trend summary from metrics', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              activityTrend: {
                issuesTrend: 'stable',
                prsTrend: 'increasing',
                contributorsTrend: 'stable'
              }
            }
          }
        ]
      };

      const trends = provider.getTrendSummary(metrics);
      expect(trends.issues).toBe('stable');
      expect(trends.pullRequests).toBe('increasing');
      expect(trends.contributors).toBe('stable');
    });

    test('should handle missing trends', () => {
      const metrics = { repositories: [{ metrics: {} }] };
      const trends = provider.getTrendSummary(metrics);
      expect(trends).toEqual({
        issues: 'unknown',
        pullRequests: 'unknown',
        contributors: 'unknown'
      });
    });
  });

  describe('Format for Meta Agent', () => {
    test('should format complete metrics', () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, 'sample-metrics.json'), 'utf8')
      );

      const context = provider.formatForMetaAgent(rawMetrics);

      expect(context.type).toBe('metrics-context');
      expect(context.timestamp).toBe(rawMetrics.timestamp);
      expect(context.healthScore).toBe(75);
      expect(context.topIssues).toBeDefined();
      expect(context.trendSummary).toBeDefined();
      expect(context.recommendations).toBeDefined();
      expect(context.contextMetrics).toBeDefined();
    });

    test('should format without recommendations', () => {
      const rawMetrics = {
        type: 'metrics-collection',
        timestamp: '2026-08-19T02:00:00Z',
        context: 'control-plane',
        healthScore: { overall: 75, components: {} },
        anomalies: [],
        repositories: [
          {
            metrics: {
              issues: { total: 145, open: 42, closureRate: 0.71 },
              pullRequests: { total: 23, merged: 18, averageReviewTime: 1.5 },
              contributors: { active: 12 },
              codeQuality: { testCoverage: 0.87 }
            }
          }
        ]
      };

      const context = provider.formatForMetaAgent(rawMetrics);
      expect(context.recommendations).toEqual([]);
    });

    test('should limit recommendations to top 3', () => {
      const rawMetrics = {
        type: 'metrics-collection',
        timestamp: '2026-08-19T02:00:00Z',
        context: 'control-plane',
        healthScore: { overall: 75 },
        anomalies: [],
        repositories: [],
        recommendations: [
          { action: 'Fix 1', priority: 'high', effort: 'low', owner: 'team', timeframe: 'week' },
          { action: 'Fix 2', priority: 'high', effort: 'low', owner: 'team', timeframe: 'week' },
          { action: 'Fix 3', priority: 'medium', effort: 'medium', owner: 'team', timeframe: 'week' },
          { action: 'Fix 4', priority: 'medium', effort: 'medium', owner: 'team', timeframe: 'week' }
        ]
      };

      const context = provider.formatForMetaAgent(rawMetrics);
      expect(context.recommendations).toHaveLength(3);
    });
  });

  describe('Extract Context Metrics', () => {
    test('should extract all metric types', () => {
      const rawMetrics = JSON.parse(
        fs.readFileSync(path.join(fixturesDir, 'sample-metrics.json'), 'utf8')
      );

      const contextMetrics = provider.extractContextMetrics(rawMetrics);

      expect(contextMetrics.issueMetrics).toBeDefined();
      expect(contextMetrics.prMetrics).toBeDefined();
      expect(contextMetrics.teamMetrics).toBeDefined();
      expect(contextMetrics.qualityMetrics).toBeDefined();
    });

    test('should handle missing repositories', () => {
      const rawMetrics = { repositories: [] };
      const contextMetrics = provider.extractContextMetrics(rawMetrics);

      expect(contextMetrics.issueMetrics.total).toBe(0);
      expect(contextMetrics.prMetrics.merged).toBe(0);
    });
  });

  describe('Caching', () => {
    test('should cache metrics', () => {
      const rawMetrics = {
        type: 'metrics-collection',
        timestamp: '2026-08-19T02:00:00Z',
        context: 'control-plane',
        repositories: [],
        healthScore: { overall: 75 },
        insights: []
      };

      const spy = jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(rawMetrics));

      // First call - reads from file
      provider.loadLatestMetrics('control-plane');
      expect(spy).toHaveBeenCalled();

      spy.mockClear();

      // Second call - should be cached
      provider.loadLatestMetrics('control-plane');
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    test('should clear cache', () => {
      const cacheData = { test: 'data' };
      provider.cache.set('test-key', cacheData);

      expect(provider.cache.has('test-key')).toBe(true);
      provider.clearCache();
      expect(provider.cache.has('test-key')).toBe(false);
    });
  });

  describe('Get Metrics Context', () => {
    test('should return full context', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(
        JSON.stringify({
          type: 'metrics-collection',
          timestamp: '2026-08-19T02:00:00Z',
          context: 'control-plane',
          repositories: [],
          healthScore: { overall: 75 },
          insights: [],
          anomalies: []
        })
      );

      const context = await provider.getMetricsContext('control-plane');

      expect(context.type).toBe('metrics-context');
      expect(context.context).toBe('control-plane');

      jest.restoreAllMocks();
    });
  });
});
