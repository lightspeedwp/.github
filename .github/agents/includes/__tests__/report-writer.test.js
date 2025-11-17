/**
 * ============================================================================
 * Tests for report-writer utility functions
 * Location: .github/agents/includes/__tests__/report-writer.test.js
 * Description:
 *   - Tests report generation for labeling agent runs
 *   - Covers telemetry reading, report sections, and recommendations
 * Standards:
 *   - Follows LightSpeedWP Coding Standards
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const {
    generateReport,
    readTelemetryData,
    getDefaultTelemetry,
    generateSummary,
    generateItemsSection,
    generateIssuesSection,
    generateChart,
    generateRecommendations,
} = require('../report-writer');

describe('report-writer.js', () => {
    const tempCacheDir = path.join(process.cwd(), '.github', 'cache');
    const tempTelemetryFile = path.join(
        tempCacheDir,
        'labeling-telemetry.json'
    );

    beforeAll(() => {
        if (!fs.existsSync(tempCacheDir)) {
            fs.mkdirSync(tempCacheDir, { recursive: true });
        }
    });

    afterAll(() => {
        if (fs.existsSync(tempTelemetryFile)) {
            fs.unlinkSync(tempTelemetryFile);
        }
    });

    afterEach(() => {
        if (fs.existsSync(tempTelemetryFile)) {
            fs.unlinkSync(tempTelemetryFile);
        }
    });

    describe('getDefaultTelemetry', () => {
        test('returns default telemetry structure', () => {
            const telemetry = getDefaultTelemetry();

            expect(telemetry).toHaveProperty('timestamp');
            expect(telemetry).toHaveProperty('totals');
            expect(telemetry.totals).toHaveProperty('issues_processed', 0);
            expect(telemetry.totals).toHaveProperty('prs_processed', 0);
            expect(telemetry.totals).toHaveProperty('discussions_processed', 0);
            expect(telemetry.totals).toHaveProperty('labels_added', 0);
            expect(telemetry.totals).toHaveProperty('labels_removed', 0);
            expect(telemetry).toHaveProperty('items', []);
            expect(telemetry).toHaveProperty('errors', []);
            expect(telemetry).toHaveProperty('warnings', []);
        });

        test('includes ISO timestamp', () => {
            const telemetry = getDefaultTelemetry();

            expect(telemetry.timestamp).toMatch(
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
            );
        });
    });

    describe('readTelemetryData', () => {
        test('reads existing telemetry file', () => {
            const mockData = {
                timestamp: '2025-01-01T12:00:00Z',
                totals: {
                    issues_processed: 5,
                    prs_processed: 3,
                    discussions_processed: 0,
                    labels_added: 10,
                    labels_removed: 2,
                    unknown_labels: 1,
                    alias_hits: 2,
                    one_hot_violations: 1,
                    defaults_applied: 3,
                },
                items: [],
                errors: [],
                warnings: [],
            };

            fs.writeFileSync(tempTelemetryFile, JSON.stringify(mockData));

            const telemetry = readTelemetryData();

            expect(telemetry).toEqual(mockData);
        });

        test('returns default telemetry when file does not exist', () => {
            const telemetry = readTelemetryData();

            expect(telemetry).toHaveProperty('totals');
            expect(telemetry.totals.issues_processed).toBe(0);
        });

        test('handles invalid JSON gracefully', () => {
            fs.writeFileSync(tempTelemetryFile, 'invalid json{');

            const telemetry = readTelemetryData();

            expect(telemetry).toHaveProperty('totals');
            expect(telemetry.totals.issues_processed).toBe(0);
        });
    });

    describe('generateSummary', () => {
        test('generates summary section with basic stats', () => {
            const telemetry = {
                timestamp: '2025-01-01T12:00:00Z',
                totals: {
                    issues_processed: 5,
                    prs_processed: 3,
                    discussions_processed: 2,
                    labels_added: 10,
                    labels_removed: 2,
                    unknown_labels: 1,
                    alias_hits: 2,
                    one_hot_violations: 3,
                    defaults_applied: 4,
                },
            };

            const summary = generateSummary(telemetry);

            expect(summary).toContain('## 📊 Summary');
            expect(summary).toContain('Total Items Processed:** 10');
            expect(summary).toContain('Issues | 5');
            expect(summary).toContain('Pull Requests | 3');
            expect(summary).toContain('Discussions | 2');
            expect(summary).toContain('Labels Added | 10');
            expect(summary).toContain('Labels Removed | 2');
        });

        test('includes duration when provided', () => {
            const telemetry = {
                timestamp: '2025-01-01T12:00:00Z',
                duration: 5432,
                totals: {
                    issues_processed: 1,
                    prs_processed: 0,
                    discussions_processed: 0,
                    labels_added: 0,
                    labels_removed: 0,
                    unknown_labels: 0,
                    alias_hits: 0,
                    one_hot_violations: 0,
                    defaults_applied: 0,
                },
            };

            const summary = generateSummary(telemetry);

            expect(summary).toContain('**Duration:**');
            expect(summary).toContain('5.43s');
        });

        test('formats durations correctly', () => {
            const cases = [
                { duration: 500, expected: '500ms' },
                { duration: 1500, expected: '1.50s' },
                { duration: 65000, expected: '1.08m' },
            ];

            for (const { duration, expected } of cases) {
                const telemetry = {
                    timestamp: '2025-01-01T12:00:00Z',
                    duration,
                    totals: {
                        issues_processed: 0,
                        prs_processed: 0,
                        discussions_processed: 0,
                        labels_added: 0,
                        labels_removed: 0,
                        unknown_labels: 0,
                        alias_hits: 0,
                        one_hot_violations: 0,
                        defaults_applied: 0,
                    },
                };

                const summary = generateSummary(telemetry);
                expect(summary).toContain(expected);
            }
        });
    });

    describe('generateItemsSection', () => {
        test('returns empty string when no items', () => {
            const telemetry = { items: [] };
            const section = generateItemsSection(telemetry);

            expect(section).toBe('');
        });

        test('generates section for processed items', () => {
            const telemetry = {
                items: [
                    {
                        type: 'Issue',
                        number: 123,
                        title: 'Test Issue',
                        labels_added: ['status:in-progress'],
                        labels_removed: ['status:needs-triage'],
                    },
                    {
                        type: 'PR',
                        number: 456,
                        title: 'Test PR',
                        labels_added: ['meta:needs-changelog'],
                    },
                ],
            };

            const section = generateItemsSection(telemetry);

            expect(section).toContain('## 📝 Processed Items');
            expect(section).toContain('### Issue #123: Test Issue');
            expect(section).toContain('### PR #456: Test PR');
            expect(section).toContain('**Labels Added:** `status:in-progress`');
            expect(section).toContain('**Labels Removed:** `status:needs-triage`');
            expect(section).toContain('`meta:needs-changelog`');
        });

        test('includes migrations when present', () => {
            const telemetry = {
                items: [
                    {
                        type: 'Issue',
                        number: 789,
                        title: 'Migrated Issue',
                        migrations: [
                            { from: 'bug', to: 'type:bug' },
                            { from: 'wip', to: 'status:in-progress' },
                        ],
                    },
                ],
            };

            const section = generateItemsSection(telemetry);

            expect(section).toContain('**Migrations:**');
            expect(section).toContain('- `bug` → `type:bug`');
            expect(section).toContain('- `wip` → `status:in-progress`');
        });

        test('includes notes when present', () => {
            const telemetry = {
                items: [
                    {
                        type: 'Issue',
                        number: 100,
                        title: 'Issue with notes',
                        notes: 'Applied default priority',
                    },
                ],
            };

            const section = generateItemsSection(telemetry);

            expect(section).toContain('**Notes:** Applied default priority');
        });
    });

    describe('generateIssuesSection', () => {
        test('returns empty string when no errors or warnings', () => {
            const telemetry = { errors: [], warnings: [] };
            const section = generateIssuesSection(telemetry);

            expect(section).toBe('');
        });

        test('generates errors section', () => {
            const telemetry = {
                errors: [
                    { context: 'API Call', message: 'Network timeout' },
                    { context: 'Validation', message: 'Invalid label name' },
                ],
                warnings: [],
            };

            const section = generateIssuesSection(telemetry);

            expect(section).toContain('## ⚠️ Errors');
            expect(section).toContain('- **API Call:** Network timeout');
            expect(section).toContain('- **Validation:** Invalid label name');
        });

        test('generates warnings section', () => {
            const telemetry = {
                errors: [],
                warnings: [
                    {
                        context: 'Label Migration',
                        message: 'Unknown label detected',
                    },
                ],
            };

            const section = generateIssuesSection(telemetry);

            expect(section).toContain('## ⚡ Warnings');
            expect(section).toContain(
                '- **Label Migration:** Unknown label detected'
            );
        });

        test('handles errors and warnings without context', () => {
            const telemetry = {
                errors: [{ message: 'Generic error' }],
                warnings: [{ message: 'Generic warning' }],
            };

            const section = generateIssuesSection(telemetry);

            expect(section).toContain('- **General:** Generic error');
            expect(section).toContain('- **General:** Generic warning');
        });
    });

    describe('generateChart', () => {
        test('generates Mermaid pie chart when items processed', () => {
            const telemetry = {
                totals: {
                    issues_processed: 10,
                    prs_processed: 5,
                    discussions_processed: 2,
                },
            };

            const chart = generateChart(telemetry);

            expect(chart).toContain('## 📈 Visual Breakdown');
            expect(chart).toContain('```mermaid');
            expect(chart).toContain('pie title Items Processed by Type');
            expect(chart).toContain('"Issues" : 10');
            expect(chart).toContain('"Pull Requests" : 5');
            expect(chart).toContain('"Discussions" : 2');
        });

        test('returns empty string when no items processed', () => {
            const telemetry = {
                totals: {
                    issues_processed: 0,
                    prs_processed: 0,
                    discussions_processed: 0,
                },
            };

            const chart = generateChart(telemetry);

            expect(chart).toBe('');
        });
    });

    describe('generateRecommendations', () => {
        test('returns empty string when no recommendations', () => {
            const telemetry = {
                totals: {
                    unknown_labels: 0,
                    one_hot_violations: 0,
                    alias_hits: 0,
                },
                errors: [],
            };

            const section = generateRecommendations(telemetry);

            expect(section).toBe('');
        });

        test('recommends reviewing unknown labels', () => {
            const telemetry = {
                totals: {
                    unknown_labels: 3,
                    one_hot_violations: 0,
                    alias_hits: 0,
                },
                errors: [],
            };

            const section = generateRecommendations(telemetry);

            expect(section).toContain('## 💡 Recommendations');
            expect(section).toContain('3 unknown label(s) detected');
            expect(section).toContain('canonical labels.yml');
        });

        test('recommends updating templates for high one-hot violations', () => {
            const telemetry = {
                totals: {
                    unknown_labels: 0,
                    one_hot_violations: 10,
                    alias_hits: 0,
                },
                errors: [],
            };

            const section = generateRecommendations(telemetry);

            expect(section).toContain('High number of one-hot violations (10)');
            expect(section).toContain('issue templates');
        });

        test('recommends documentation updates for alias usage', () => {
            const telemetry = {
                totals: {
                    unknown_labels: 0,
                    one_hot_violations: 0,
                    alias_hits: 5,
                },
                errors: [],
            };

            const section = generateRecommendations(telemetry);

            expect(section).toContain('5 alias migration(s) performed');
            expect(section).toContain('canonical label names');
        });

        test('recommends reviewing errors', () => {
            const telemetry = {
                totals: {
                    unknown_labels: 0,
                    one_hot_violations: 0,
                    alias_hits: 0,
                },
                errors: [{ message: 'Error 1' }, { message: 'Error 2' }],
            };

            const section = generateRecommendations(telemetry);

            expect(section).toContain('2 error(s) encountered');
            expect(section).toContain('Review error log');
        });
    });

    describe('generateReport', () => {
        test('generates complete report with all sections', () => {
            const telemetry = {
                timestamp: '2025-01-01T12:00:00Z',
                duration: 5000,
                totals: {
                    issues_processed: 5,
                    prs_processed: 3,
                    discussions_processed: 0,
                    labels_added: 10,
                    labels_removed: 2,
                    unknown_labels: 1,
                    alias_hits: 2,
                    one_hot_violations: 0,
                    defaults_applied: 3,
                },
                items: [
                    {
                        type: 'Issue',
                        number: 123,
                        title: 'Test',
                        labels_added: ['bug'],
                    },
                ],
                errors: [],
                warnings: [{ message: 'Test warning' }],
            };

            const report = generateReport(telemetry);

            expect(report).toContain('# 🏷️ Labeling Agent Report');
            expect(report).toContain('## 📊 Summary');
            expect(report).toContain('## 📈 Visual Breakdown');
            expect(report).toContain('## 📝 Processed Items');
            expect(report).toContain('## ⚡ Warnings');
            expect(report).toContain('## 💡 Recommendations');
            expect(report).toContain('## 📚 Reference');
            expect(report).toContain('_Generated by [LightSpeedWP Labeling Agent]');
        });

        test('generates report without telemetry parameter (reads from file)', () => {
            const mockData = getDefaultTelemetry();
            fs.writeFileSync(tempTelemetryFile, JSON.stringify(mockData));

            const report = generateReport();

            expect(report).toContain('# 🏷️ Labeling Agent Report');
            expect(report).toContain('## 📊 Summary');
        });

        test('includes reference links', () => {
            const telemetry = getDefaultTelemetry();
            const report = generateReport(telemetry);

            expect(report).toContain('[.github/automation/labels.yml]');
            expect(report).toContain('[.github/automation/labeler.yml]');
            expect(report).toContain('Labeling Agent Usage');
        });
    });

    describe('edge cases', () => {
        test('handles missing totals gracefully', () => {
            const telemetry = {
                timestamp: '2025-01-01T12:00:00Z',
                totals: {},
            };

            const summary = generateSummary(telemetry);

            expect(summary).toContain('## 📊 Summary');
            expect(summary).toContain('NaN'); // Will show as NaN, but won't crash
        });

        test('handles very large numbers', () => {
            const telemetry = {
                timestamp: '2025-01-01T12:00:00Z',
                totals: {
                    issues_processed: 999999,
                    prs_processed: 888888,
                    discussions_processed: 777777,
                    labels_added: 1000000,
                    labels_removed: 500000,
                    unknown_labels: 0,
                    alias_hits: 0,
                    one_hot_violations: 0,
                    defaults_applied: 0,
                },
            };

            const summary = generateSummary(telemetry);

            expect(summary).toContain('999999');
            expect(summary).toContain('1000000');
        });

        test('handles special characters in item titles', () => {
            const telemetry = {
                items: [
                    {
                        type: 'Issue',
                        number: 1,
                        title: 'Title with <html> & "quotes" and `code`',
                    },
                ],
            };

            const section = generateItemsSection(telemetry);

            expect(section).toContain('Title with <html> & "quotes" and `code`');
        });
    });
});
