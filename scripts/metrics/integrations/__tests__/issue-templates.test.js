/**
 * Issue Templates Generator Tests
 */

const IssueTemplateGenerator = require('../issue-templates');

describe('IssueTemplateGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new IssueTemplateGenerator({
      org: 'lightspeedwp',
      repo: '.github'
    });
  });

  describe('Constructor', () => {
    test('should initialize with defaults', () => {
      const g = new IssueTemplateGenerator();
      expect(g).toBeInstanceOf(IssueTemplateGenerator);
      expect(g.org).toBe('lightspeedwp');
      expect(g.repo).toBe('.github');
    });

    test('should initialize with custom options', () => {
      const g = new IssueTemplateGenerator({
        org: 'custom-org',
        repo: 'custom-repo'
      });
      expect(g.org).toBe('custom-org');
      expect(g.repo).toBe('custom-repo');
    });

    test('should have default thresholds', () => {
      const thresholds = generator.getDefaultThresholds();
      expect(thresholds.staleIssues).toBeDefined();
      expect(thresholds.reviewTime).toBeDefined();
      expect(thresholds.healthScore).toBeDefined();
    });
  });

  describe('Should Create Issue Logic', () => {
    test('should create issue when absolute threshold exceeded', () => {
      const metric = {
        name: 'staleIssues',
        current: 10,
        percentChange: 5
      };

      expect(generator.shouldCreateIssue(metric)).toBe(true);
    });

    test('should create issue when percent change exceeded', () => {
      const metric = {
        name: 'staleIssues',
        current: 4,
        percentChange: 50
      };

      expect(generator.shouldCreateIssue(metric)).toBe(true);
    });

    test('should not create issue below both thresholds', () => {
      const metric = {
        name: 'staleIssues',
        current: 3,
        percentChange: 10
      };

      expect(generator.shouldCreateIssue(metric)).toBe(false);
    });

    test('should not create for unknown metric', () => {
      const metric = {
        name: 'unknownMetric',
        current: 100,
        percentChange: 100
      };

      expect(generator.shouldCreateIssue(metric)).toBe(false);
    });
  });

  describe('Generate Stale Issues Alert', () => {
    test('should generate alert when stale issues high', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 10 }
            }
          }
        ]
      };

      const issue = generator.generateStaleIssuesAlert(metrics);

      expect(issue).not.toBeNull();
      expect(issue.title).toContain('Stale Issues');
      expect(issue.body).toContain('10 issues');
      expect(issue.labels).toContain('priority:important');
    });

    test('should not generate when stale issues low', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 2 }
            }
          }
        ]
      };

      const issue = generator.generateStaleIssuesAlert(metrics);

      expect(issue).toBeNull();
    });

    test('should include recommended actions', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 8 }
            }
          }
        ]
      };

      const issue = generator.generateStaleIssuesAlert(metrics);

      expect(issue.body).toContain('Recommended Actions');
      expect(issue.body).toContain('Review Stale Issues');
    });

    test('should include correct labels', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 8 }
            }
          }
        ]
      };

      const issue = generator.generateStaleIssuesAlert(metrics);

      expect(issue.labels).toContain('metrics-alert');
      expect(issue.labels).toContain('team-leads');
    });
  });

  describe('Generate PR Review Degradation', () => {
    test('should generate alert when review time high', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              pullRequests: { averageReviewTime: 2.5 }
            }
          }
        ]
      };

      const issue = generator.generatePRReviewDegradation(metrics);

      expect(issue).not.toBeNull();
      expect(issue.title).toContain('PR Review Time');
      expect(issue.body).toContain('2.5 days');
    });

    test('should not generate when review time normal', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              pullRequests: { averageReviewTime: 1.0 }
            }
          }
        ]
      };

      const issue = generator.generatePRReviewDegradation(metrics);

      expect(issue).toBeNull();
    });

    test('should include SLA recommendations', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              pullRequests: { averageReviewTime: 2.5 }
            }
          }
        ]
      };

      const issue = generator.generatePRReviewDegradation(metrics);

      expect(issue.body).toContain('24-hour');
      expect(issue.body).toContain('Review SLA');
    });
  });

  describe('Generate Health Alert', () => {
    test('should generate alert when health low', () => {
      const metrics = {
        healthScore: {
          overall: 65,
          components: {
            responseTime: 60,
            codeQuality: 75
          }
        }
      };

      const issue = generator.generateHealthAlert(metrics);

      expect(issue).not.toBeNull();
      expect(issue.title).toContain('Health Score');
      expect(issue.body).toContain('65');
    });

    test('should not generate when health acceptable', () => {
      const metrics = {
        healthScore: {
          overall: 75
        }
      };

      const issue = generator.generateHealthAlert(metrics);

      expect(issue).toBeNull();
    });

    test('should include health breakdown', () => {
      const metrics = {
        healthScore: {
          overall: 60,
          components: {
            responseTime: 60,
            codeQuality: 75
          }
        }
      };

      const issue = generator.generateHealthAlert(metrics);

      expect(issue.body).toContain('Health Breakdown');
      expect(issue.body).toContain('responseTime');
      expect(issue.body).toContain('codeQuality');
    });

    test('should mark as critical when very low', () => {
      const metrics = {
        healthScore: {
          overall: 55,
          components: {}
        }
      };

      const issue = generator.generateHealthAlert(metrics);

      expect(issue.labels).toContain('priority:critical');
    });
  });

  describe('Generate Team Capacity Alert', () => {
    test('should generate alert when capacity low', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              contributors: { active: 6 }
            }
          }
        ]
      };

      const issue = generator.generateTeamCapacityAlert(metrics);

      expect(issue).not.toBeNull();
      expect(issue.title).toContain('Team Capacity');
      expect(issue.body).toContain('6 engineers');
    });

    test('should not generate when capacity adequate', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              contributors: { active: 12 }
            }
          }
        ]
      };

      const issue = generator.generateTeamCapacityAlert(metrics);

      expect(issue).toBeNull();
    });

    test('should include capacity planning recommendations', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              contributors: { active: 8 }
            }
          }
        ]
      };

      const issue = generator.generateTeamCapacityAlert(metrics);

      expect(issue.body).toContain('Capacity Planning');
      expect(issue.body).toContain('hiring plans');
    });
  });

  describe('Generate All Issues', () => {
    test('should generate multiple issues when all conditions met', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 10 },
              pullRequests: { averageReviewTime: 2.5 },
              contributors: { active: 6 }
            }
          }
        ],
        healthScore: {
          overall: 65,
          components: {}
        },
        anomalies: []
      };

      const issues = generator.generateAllIssues(metrics);

      expect(issues.length).toBeGreaterThan(0);
    });

    test('should return empty array when no issues', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 2 },
              pullRequests: { averageReviewTime: 1.0 },
              contributors: { active: 12 }
            }
          }
        ],
        healthScore: { overall: 85 },
        anomalies: []
      };

      const issues = generator.generateAllIssues(metrics);

      expect(issues).toEqual([]);
    });
  });

  describe('Health Breakdown Formatting', () => {
    test('should format health components as markdown table', () => {
      const components = {
        responseTime: 80,
        codeQuality: 75,
        teamCapacity: 60
      };

      const table = generator.formatHealthBreakdown(components);

      expect(table).toContain('Component');
      expect(table).toContain('Score');
      expect(table).toContain('Status');
      expect(table).toContain('responseTime');
      expect(table).toContain('✅');
      expect(table).toContain('⚠️');
      expect(table).toContain('❌');
    });

    test('should correctly show health status icons', () => {
      const components = {
        high: 85,
        medium: 75,
        low: 55
      };

      const table = generator.formatHealthBreakdown(components);

      expect(table).toContain('✅'); // Healthy
      expect(table).toContain('⚠️'); // At Risk
      expect(table).toContain('❌'); // Below Target
    });
  });

  describe('Issue Structure', () => {
    test('issues should have required fields', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 10 }
            }
          }
        ]
      };

      const issue = generator.generateStaleIssuesAlert(metrics);

      expect(issue).toHaveProperty('title');
      expect(issue).toHaveProperty('body');
      expect(issue).toHaveProperty('labels');
      expect(issue).toHaveProperty('assignees');
    });

    test('issue labels should be valid format', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 10 }
            }
          }
        ]
      };

      const issue = generator.generateStaleIssuesAlert(metrics);

      issue.labels.forEach((label) => {
        // Labels should follow format: category:value
        expect(label).toMatch(/^[a-z]+:|^[a-z-]+$/);
      });
    });
  });

  describe('Links in Issues', () => {
    test('should include links to metrics reports', () => {
      const metrics = {
        repositories: [
          {
            metrics: {
              issues: { staleIssues: 10 }
            }
          }
        ]
      };

      const issue = generator.generateStaleIssuesAlert(metrics);

      expect(issue.body).toContain('github.com');
      expect(issue.body).toContain('Weekly Metrics');
    });
  });
});
