/**
 * Metrics Collection Integration Tests
 * Test metrics snapshot collection, calculation, and export
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const agent = require('../../changelog.agent.js');
const metricsBuilder = require('../../includes/metricsSnapshotBuilder.cjs');
const trendCalc = require('../../includes/trendCalculator.cjs');

// Everything this suite writes goes to a temporary directory, never into the
// repository (#3498).
const TEST_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-metrics-'));
const TEST_CHANGELOG = path.join(TEST_DIR, 'CHANGELOG_METRICS.md');
const METRICS_DIR = path.join(TEST_DIR, 'metrics');

beforeAll(() => {
  fs.mkdirSync(METRICS_DIR, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('Metrics Collection Workflow', () => {
  beforeAll(() => {
    // Create a test changelog
    const changelogContent = `# Changelog

## [1.0.0] - 2026-09-12

### Added
- User dashboard with analytics and metrics
- Real-time notifications for important events
- Mobile app support for iOS and Android
- API rate limiting for better stability

### Fixed
- Authentication timeout issue that affected login flow
- Database query performance improved by 40%
- CSS styling bugs in responsive design

### Security
- Fixed XSS vulnerability in user input validation
- Updated dependencies to latest secure versions

## [0.9.0] - 2026-09-01

### Added
- Beta support for integrations
- Experimental feature flag system
`;

    fs.writeFileSync(TEST_CHANGELOG, changelogContent, 'utf8');
  });

  afterAll(() => {
    if (fs.existsSync(TEST_CHANGELOG)) {
      fs.unlinkSync(TEST_CHANGELOG);
    }
  });

  describe('Metrics Snapshot Collection', () => {
    test('should collect metrics for a release', async () => {
      const result = await agent.collectMetricsSnapshot(TEST_CHANGELOG, {
        version: '1.0.0',
        metricsDir: METRICS_DIR,
      });

      expect(result.success).toBe(true);
      expect(result.snapshot).toBeDefined();
      expect(result.file_path).toBeDefined();
    });

    test('should generate valid metrics snapshot structure', async () => {
      const result = await agent.collectMetricsSnapshot(TEST_CHANGELOG, {
        version: '1.0.0',
        metricsDir: METRICS_DIR,
      });

      const snapshot = result.snapshot;

      expect(snapshot).toHaveProperty('snapshot_date');
      expect(snapshot).toHaveProperty('total_entries');
      expect(snapshot).toHaveProperty('compliant_entries');
      expect(snapshot).toHaveProperty('compliance_percentage');
      expect(snapshot).toHaveProperty('entries_by_category');
      expect(snapshot).toHaveProperty('violations_by_rule');
    });

    test('should save metrics to dated file (YYYYMMDD.json)', async () => {
      const result = await agent.collectMetricsSnapshot(TEST_CHANGELOG, {
        version: '1.0.0',
        metricsDir: METRICS_DIR,
      });

      expect(result.file_path).toBeDefined();
      const filename = path.basename(result.file_path);
      expect(filename).toMatch(/^\d{8}\.json$/);
      expect(fs.existsSync(result.file_path)).toBe(true);
    });

    test('should calculate compliance percentage correctly', async () => {
      const result = await agent.collectMetricsSnapshot(TEST_CHANGELOG, {
        version: '1.0.0',
        metricsDir: METRICS_DIR,
      });

      const snapshot = result.snapshot;
      const expectedCompliance =
        snapshot.total_entries > 0
          ? (snapshot.compliant_entries / snapshot.total_entries) * 100
          : 0;

      expect(snapshot.compliance_percentage).toBe(Math.round(expectedCompliance * 10) / 10);
    });

    test('should categorize entries correctly', async () => {
      const result = await agent.collectMetricsSnapshot(TEST_CHANGELOG, {
        version: '1.0.0',
        metricsDir: METRICS_DIR,
      });

      const snapshot = result.snapshot;
      const categories = Object.keys(snapshot.entries_by_category);

      expect(categories.length).toBeGreaterThan(0);
      for (const category of categories) {
        const stats = snapshot.entries_by_category[category];
        expect(stats).toHaveProperty('total');
        expect(stats).toHaveProperty('compliant');
      }
    });
  });

  describe('Metrics Analysis', () => {
    test('should calculate compliance metrics', () => {
      const metrics = metricsBuilder.calculateComplianceMetrics(10, 8);

      expect(metrics.total_entries).toBe(10);
      expect(metrics.compliant_entries).toBe(8);
      expect(metrics.non_compliant_entries).toBe(2);
      expect(metrics.compliance_percentage).toBe(80);
    });

    test('should identify violation distribution', () => {
      const ruleResults = [
        {
          status: 'failed',
          ruleId: 'R001',
          ruleName: 'no_implementation_details',
        },
        {
          status: 'failed',
          ruleId: 'R001',
          ruleName: 'no_implementation_details',
        },
        {
          status: 'failed',
          ruleId: 'R003',
          ruleName: 'has_title',
        },
        { status: 'passed', ruleId: 'R002' },
      ];

      const distribution = metricsBuilder.calculateViolationDistribution(ruleResults);

      expect(distribution.length).toBeGreaterThan(0);
      expect(distribution[0].rule_id).toBe('R001');
      expect(distribution[0].count).toBe(2);
      expect(distribution[0].percentage).toBeGreaterThan(50);
    });

    test('should calculate category distribution', () => {
      const entries = [
        { category: 'Added', status: 'passing' },
        { category: 'Added', status: 'passing' },
        { category: 'Fixed', status: 'failing' },
        { category: 'Security', status: 'passing' },
      ];

      const distribution = metricsBuilder.buildCategoryDistribution(entries);

      expect(distribution.Added).toBeDefined();
      expect(distribution.Added.total).toBe(2);
      expect(distribution.Added.compliant).toBe(2);

      expect(distribution.Fixed).toBeDefined();
      expect(distribution.Fixed.total).toBe(1);
      expect(distribution.Fixed.non_compliant).toBe(1);
    });
  });

  describe('Trend Analysis', () => {
    test('should calculate linear regression', () => {
      const dataPoints = [
        { x: 0, y: 80 },
        { x: 1, y: 82 },
        { x: 2, y: 85 },
        { x: 3, y: 87 },
      ];

      const result = trendCalc.calculateLinearRegression(dataPoints);

      expect(result.slope).toBeGreaterThan(0);
      expect(result.trend).toBe('improving');
    });

    test('should identify declining trend', () => {
      const dataPoints = [
        { x: 0, y: 95 },
        { x: 1, y: 90 },
        { x: 2, y: 85 },
        { x: 3, y: 80 },
      ];

      const result = trendCalc.calculateLinearRegression(dataPoints);

      expect(result.slope).toBeLessThan(-0.5);
      expect(result.trend).toBe('declining');
    });

    test('should calculate compliance trend from snapshots', () => {
      const snapshots = [
        {
          snapshot_date: '2026-09-10T00:00:00Z',
          compliance_percentage: 80,
          total_entries: 10,
        },
        {
          snapshot_date: '2026-09-11T00:00:00Z',
          compliance_percentage: 85,
          total_entries: 12,
        },
        {
          snapshot_date: '2026-09-12T00:00:00Z',
          compliance_percentage: 90,
          total_entries: 15,
        },
      ];

      const trend = trendCalc.calculateComplianceTrend(snapshots);

      expect(trend.trend).toBe('improving');
      expect(trend.days_analyzed).toBe(3);
      expect(trend.first_compliance).toBe(80);
      expect(trend.last_compliance).toBe(90);
    });

    test('should calculate velocity metrics', () => {
      const snapshots = [
        { snapshot_date: '2026-09-01T00:00:00Z', total_entries: 10 },
        { snapshot_date: '2026-09-11T00:00:00Z', total_entries: 30 },
      ];

      const velocity = trendCalc.calculateVelocity(snapshots);

      expect(velocity.total_entries_added).toBe(20);
      expect(velocity.entries_per_day).toBeCloseTo(2, 0);
    });

    test('should identify common violations', () => {
      const snapshots = [
        {
          violations_by_rule: [
            { rule_id: 'R001', rule_name: 'no_impl_details', count: 5 },
            { rule_id: 'R003', rule_name: 'has_title', count: 2 },
          ],
        },
        {
          violations_by_rule: [
            { rule_id: 'R001', rule_name: 'no_impl_details', count: 4 },
            { rule_id: 'R010', rule_name: 'valid_pr_ref', count: 1 },
          ],
        },
      ];

      const common = trendCalc.identifyCommonViolations(snapshots);

      expect(common.length).toBeGreaterThan(0);
      expect(common[0].rule_id).toBe('R001');
      expect(common[0].total_occurrences).toBe(9);
    });

    test('should generate comprehensive trend report', () => {
      const snapshots = [
        {
          snapshot_date: '2026-09-10T00:00:00Z',
          compliance_percentage: 85,
          total_entries: 20,
          most_common_violations: [{ rule_id: 'R001', count: 3 }],
          violations_by_rule: [{ rule_id: 'R001', rule_name: 'no_impl_details', count: 3 }],
        },
        {
          snapshot_date: '2026-09-11T00:00:00Z',
          compliance_percentage: 88,
          total_entries: 22,
          most_common_violations: [{ rule_id: 'R001', count: 2 }],
          violations_by_rule: [{ rule_id: 'R001', rule_name: 'no_impl_details', count: 2 }],
        },
      ];

      const report = trendCalc.generateTrendReport(snapshots);

      expect(report).toHaveProperty('report_date');
      expect(report).toHaveProperty('compliance_trend');
      expect(report).toHaveProperty('velocity');
      expect(report).toHaveProperty('common_violations');
      expect(report).toHaveProperty('recommendation');
    });
  });

  describe('CSV Export', () => {
    test('should export metrics to CSV format', async () => {
      // First collect a metric
      await agent.collectMetricsSnapshot(TEST_CHANGELOG, {
        version: '1.0.0',
        metricsDir: METRICS_DIR,
      });

      // Then export to CSV
      const exportPath = path.join(TEST_DIR, 'metrics_export.csv');
      const result = await agent.exportMetricsToCSV(METRICS_DIR, {
        days: 30,
        outputPath: exportPath,
      });

      expect(result.success).toBe(true);
      expect(fs.existsSync(exportPath)).toBe(true);

      const csvContent = fs.readFileSync(exportPath, 'utf8');
      expect(csvContent).toContain('Date,Compliance %');
    });

    test('should include correct CSV columns', async () => {
      await agent.collectMetricsSnapshot(TEST_CHANGELOG, {
        version: '1.0.0',
        metricsDir: METRICS_DIR,
      });

      const exportPath = path.join(TEST_DIR, 'test_export.csv');
      await agent.exportMetricsToCSV(METRICS_DIR, {
        days: 30,
        outputPath: exportPath,
      });

      const csvContent = fs.readFileSync(exportPath, 'utf8');
      const header = csvContent.split('\n')[0];

      expect(header).toContain('Date');
      expect(header).toContain('Compliance %');
      expect(header).toContain('Total Entries');
      expect(header).toContain('Compliant');
    });
  });
});
