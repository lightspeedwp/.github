const scoreCalculator = require('../../includes/scoreCalculator.cjs');

describe('ScoreCalculator', () => {
  describe('calculateScore', () => {
    test('should return 100 for no failures', () => {
      const results = [
        { status: 'passed', severity: 'error' },
        { status: 'passed', severity: 'warning' }
      ];
      const score = scoreCalculator.calculateScore(results);
      expect(score.score).toBe(100);
    });

    test('should deduct 25 points per error', () => {
      const results = [
        { status: 'failed', severity: 'error' },
        { status: 'passed', severity: 'warning' }
      ];
      const score = scoreCalculator.calculateScore(results);
      expect(score.score).toBe(75);
    });

    test('should deduct 5 points per warning', () => {
      const results = [
        { status: 'passed', severity: 'error' },
        { status: 'failed', severity: 'warning' }
      ];
      const score = scoreCalculator.calculateScore(results);
      expect(score.score).toBe(95);
    });

    test('should combine error and warning deductions', () => {
      const results = [
        { status: 'failed', severity: 'error' },
        { status: 'failed', severity: 'error' },
        { status: 'failed', severity: 'warning' },
        { status: 'failed', severity: 'warning' }
      ];
      const score = scoreCalculator.calculateScore(results);
      expect(score.score).toBe(40); // 100 - (2*25) - (2*5)
    });

    test('should not go below 0', () => {
      const results = Array(20).fill({ status: 'failed', severity: 'error' });
      const score = scoreCalculator.calculateScore(results);
      expect(score.score).toBe(0);
    });

    test('should handle empty results', () => {
      const score = scoreCalculator.calculateScore([]);
      expect(score.score).toBe(100);
    });

    test('should handle non-array input', () => {
      const score = scoreCalculator.calculateScore(null);
      expect(score.score).toBe(100);
    });
  });

  describe('determineStatus', () => {
    test('should return "passing" for score >= 90', () => {
      expect(scoreCalculator.determineStatus(100)).toBe('passing');
      expect(scoreCalculator.determineStatus(90)).toBe('passing');
    });

    test('should return "warning" for score 75-89', () => {
      expect(scoreCalculator.determineStatus(89)).toBe('warning');
      expect(scoreCalculator.determineStatus(75)).toBe('warning');
    });

    test('should return "failing" for score < 75', () => {
      expect(scoreCalculator.determineStatus(74)).toBe('failing');
      expect(scoreCalculator.determineStatus(0)).toBe('failing');
    });
  });

  describe('getStatusLabel', () => {
    test('should return correct label for passing', () => {
      const label = scoreCalculator.getStatusLabel('passing');
      expect(label.label).toBe('PASS');
      expect(label.emoji).toBe('✓');
    });

    test('should return correct label for warning', () => {
      const label = scoreCalculator.getStatusLabel('warning');
      expect(label.label).toBe('WARN');
      expect(label.emoji).toBe('⚠');
    });

    test('should return correct label for failing', () => {
      const label = scoreCalculator.getStatusLabel('failing');
      expect(label.label).toBe('FAIL');
      expect(label.emoji).toBe('✗');
    });
  });

  describe('meetsReleaseRequirement', () => {
    test('should return true for patch release at 85+', () => {
      const result = scoreCalculator.meetsReleaseRequirement(85, 'patch');
      expect(result.meets).toBe(true);
    });

    test('should return true for minor release at 90+', () => {
      const result = scoreCalculator.meetsReleaseRequirement(90, 'minor');
      expect(result.meets).toBe(true);
    });

    test('should return true for major release at 95+', () => {
      const result = scoreCalculator.meetsReleaseRequirement(95, 'major');
      expect(result.meets).toBe(true);
    });

    test('should return false for scores below thresholds', () => {
      expect(scoreCalculator.meetsReleaseRequirement(84, 'patch').meets).toBe(false);
      expect(scoreCalculator.meetsReleaseRequirement(89, 'minor').meets).toBe(false);
      expect(scoreCalculator.meetsReleaseRequirement(94, 'major').meets).toBe(false);
    });
  });

  describe('formatScore', () => {
    test('should format score with status', () => {
      const scoreResult = { score: 85, status: 'warning' };
      const formatted = scoreCalculator.formatScore(scoreResult);
      expect(formatted).toContain('85/100');
      expect(formatted).toContain('WARN');
    });

    test('should handle invalid input', () => {
      const formatted = scoreCalculator.formatScore(null);
      expect(formatted).toBe('N/A');
    });
  });

  describe('batchCalculateScores', () => {
    test('should calculate scores for multiple result sets', () => {
      const resultSets = [
        [{ status: 'passed', severity: 'error' }],
        [{ status: 'failed', severity: 'error' }]
      ];
      const scores = scoreCalculator.batchCalculateScores(resultSets);
      expect(scores).toHaveLength(2);
      expect(scores[0].score).toBe(100);
      expect(scores[1].score).toBe(75);
    });

    test('should handle non-array input', () => {
      const scores = scoreCalculator.batchCalculateScores(null);
      expect(scores).toEqual([]);
    });
  });
});
