const fs = require('fs');
const path = require('path');
const MetricsReportGenerator = require('../generate-metrics-report');

jest.mock('fs');

describe('MetricsReportGenerator', () => {
  const mockOutputDir = '/tmp/metrics-reports';
  const mockMetrics = {
    schema_version: '1.0',
    context: 'github-control-plane',
    collection_period: 7,
    metrics: {
      total_issues: 42,
      total_prs: 28,
      avg_issue_closure_rate: '78.50',
      avg_pr_merge_rate: '85.00',
      total_contributors: 12,
    },
    insights: [
      {
        type: 'stale-issues',
        severity: 'warning',
        message: 'Found 3 stale issues',
      },
    ],
    recommendations: [
      {
        action: 'triage-stale-issues',
        priority: 'high',
        description: 'Review and close/reopen stale issues',
      },
    ],
    health_score: 82,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.GITHUB_OUTPUT;
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
    fs.writeFileSync.mockImplementation(() => {});
    fs.appendFileSync.mockImplementation(() => {});
  });

  describe('constructor', () => {
    it('initializes with default options', () => {
      const generator = new MetricsReportGenerator();
      expect(generator.verbose).toBe(false);
    });

    it('initializes with custom options', () => {
      const generator = new MetricsReportGenerator({
        outputDir: '/custom/path',
        verbose: true,
      });
      expect(generator.outputDir).toBe('/custom/path');
      expect(generator.verbose).toBe(true);
    });
  });

  describe('validateMetrics', () => {
    it('validates metrics with required fields', () => {
      const generator = new MetricsReportGenerator();
      expect(() => generator.validateMetrics(mockMetrics)).not.toThrow();
    });

    it('throws error for null metrics', () => {
      const generator = new MetricsReportGenerator();
      expect(() => generator.validateMetrics(null)).toThrow(/must be an object/);
    });

    it('throws error for missing context', () => {
      const generator = new MetricsReportGenerator();
      const invalid = { ...mockMetrics, context: undefined };
      expect(() => generator.validateMetrics(invalid)).toThrow(/must have a context/);
    });

    it('throws error for missing metrics', () => {
      const generator = new MetricsReportGenerator();
      const invalid = { ...mockMetrics, metrics: undefined };
      expect(() => generator.validateMetrics(invalid)).toThrow(/must have a metrics/);
    });
  });

  describe('generateTitle', () => {
    it('generates title with context and date', () => {
      const generator = new MetricsReportGenerator();
      const title = generator.generateTitle(mockMetrics);
      expect(title).toMatch(/Metrics Report — github-control-plane/);
      expect(title).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('generateFrontmatter', () => {
    it('generates valid YAML frontmatter', () => {
      const generator = new MetricsReportGenerator();
      const frontmatter = generator.generateFrontmatter(mockMetrics);
      expect(frontmatter).toContain('---');
      expect(frontmatter).toContain('name: Metrics Report');
      expect(frontmatter).toContain('context: github-control-plane');
      expect(frontmatter).toContain('period: 7 days');
    });
  });

  describe('generateSummary', () => {
    it('generates summary with key metrics', () => {
      const generator = new MetricsReportGenerator();
      const summary = generator.generateSummary(mockMetrics);
      expect(summary).toContain('## Summary');
      expect(summary).toContain('Total Issues');
      expect(summary).toContain('42');
      expect(summary).toContain('Total Pull Requests');
      expect(summary).toContain('28');
      expect(summary).toContain('Issue Closure Rate');
      expect(summary).toContain('Health Score');
    });

    it('handles missing metrics gracefully', () => {
      const generator = new MetricsReportGenerator();
      const sparse = { context: 'test', collection_period: 7, metrics: {} };
      const summary = generator.generateSummary(sparse);
      expect(summary).toContain('## Summary');
      expect(summary).toContain('test');
    });
  });

  describe('generateDetails', () => {
    it('generates details table from metrics', () => {
      const generator = new MetricsReportGenerator();
      const details = generator.generateDetails(mockMetrics);
      expect(details).toContain('## Detailed Metrics');
      expect(details).toContain('| Metric | Value |');
      expect(details).toContain('| Total Issues | 42 |');
    });

    it('handles empty metrics', () => {
      const generator = new MetricsReportGenerator();
      const sparse = { context: 'test', metrics: {} };
      const details = generator.generateDetails(sparse);
      expect(details).toContain('No detailed metrics available');
    });
  });

  describe('generateInsights', () => {
    it('generates insights with severity emoji', () => {
      const generator = new MetricsReportGenerator();
      const insights = generator.generateInsights(mockMetrics);
      expect(insights).toContain('## Insights');
      expect(insights).toContain('stale issues');
      expect(insights).toContain('Found 3 stale issues');
    });

    it('handles missing insights', () => {
      const generator = new MetricsReportGenerator();
      const sparse = { context: 'test', metrics: {} };
      const insights = generator.generateInsights(sparse);
      expect(insights).toContain('No insights available');
    });

    it('uses correct severity emoji for critical', () => {
      const generator = new MetricsReportGenerator();
      expect(generator.getSeverityEmoji('critical')).toBe('🔴');
      expect(generator.getSeverityEmoji('error')).toBe('🔴');
      expect(generator.getSeverityEmoji('warning')).toBe('🟡');
      expect(generator.getSeverityEmoji('info')).toBe('🔵');
      expect(generator.getSeverityEmoji('success')).toBe('🟢');
    });
  });

  describe('generateRecommendations', () => {
    it('generates recommendations table', () => {
      const generator = new MetricsReportGenerator();
      const recs = generator.generateRecommendations(mockMetrics);
      expect(recs).toContain('## Recommendations');
      expect(recs).toContain('| Priority | Action | Description |');
      expect(recs).toContain('high');
      expect(recs).toContain('triage stale issues');
    });

    it('handles missing recommendations', () => {
      const generator = new MetricsReportGenerator();
      const sparse = { context: 'test', metrics: {} };
      const recs = generator.generateRecommendations(sparse);
      expect(recs).toContain('No recommendations available');
    });
  });

  describe('generateReport', () => {
    it('generates complete report', () => {
      const generator = new MetricsReportGenerator();
      const report = generator.generateReport(mockMetrics);
      expect(report).toContain('---'); // frontmatter
      expect(report).toContain('# Metrics Report');
      expect(report).toContain('## Summary');
      expect(report).toContain('## Detailed Metrics');
      expect(report).toContain('## Insights');
      expect(report).toContain('## Recommendations');
    });

    it('throws error on invalid metrics', () => {
      const generator = new MetricsReportGenerator();
      expect(() => generator.generateReport(null)).toThrow();
      expect(() => generator.generateReport({ metrics: {} })).toThrow();
    });
  });

  describe('saveReport', () => {
    it('saves report to output directory', () => {
      fs.existsSync.mockReturnValue(true);
      const generator = new MetricsReportGenerator({ outputDir: mockOutputDir });
      const markdown = '# Test Report';

      generator.saveReport(markdown, 'github-control-plane');

      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('saves both dated and latest versions', () => {
      fs.existsSync.mockReturnValue(true);
      const generator = new MetricsReportGenerator({ outputDir: mockOutputDir });
      const markdown = '# Test Report';

      generator.saveReport(markdown, 'test-context');

      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
      const calls = fs.writeFileSync.mock.calls;
      expect(calls[0][0]).toContain('metrics-report-test-context-');
      expect(calls[1][0]).toContain('metrics-report-test-context-latest.md');
    });

    it('creates output directory if missing', () => {
      fs.existsSync.mockReturnValueOnce(false);
      const generator = new MetricsReportGenerator({ outputDir: mockOutputDir });

      generator.saveReport('# Test', 'test');

      expect(fs.mkdirSync).toHaveBeenCalledWith(mockOutputDir, { recursive: true });
    });
  });

  describe('generate', () => {
    it('generates and saves report from metrics file', async () => {
      fs.readFileSync.mockReturnValue(JSON.stringify(mockMetrics));
      const generator = new MetricsReportGenerator();

      const result = await generator.generate('/path/to/metrics.json');

      expect(fs.readFileSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(result.context).toBe('github-control-plane');
      expect(result.markdown).toContain('# Metrics Report');
    });

    it('throws error if metrics file not found', async () => {
      fs.existsSync.mockReturnValueOnce(false);
      const generator = new MetricsReportGenerator();

      jest.spyOn(process, 'exit').mockImplementation(() => {});

      await generator.generate('/nonexistent/metrics.json');

      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('sets GitHub Actions output when env var is set', async () => {
      fs.readFileSync.mockReturnValue(JSON.stringify(mockMetrics));
      process.env.GITHUB_OUTPUT = '/tmp/github-output';
      const generator = new MetricsReportGenerator();

      await generator.generate('/path/to/metrics.json');

      expect(fs.appendFileSync).toHaveBeenCalledWith(
        '/tmp/github-output',
        expect.stringMatching(/report_file=/),
      );
    });
  });

  describe('log', () => {
    it('logs messages with appropriate prefix', () => {
      jest.spyOn(console, 'log').mockImplementation();
      const generator = new MetricsReportGenerator({ verbose: true });

      generator.log('test message', 'info');
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('test message'));
    });

    it('respects verbose flag', () => {
      jest.spyOn(console, 'log').mockImplementation();
      const generator = new MetricsReportGenerator({ verbose: false });

      generator.log('debug message', 'debug');
      expect(console.log).not.toHaveBeenCalled();

      generator.log('info message', 'info');
      expect(console.log).toHaveBeenCalled();
    });
  });
});
