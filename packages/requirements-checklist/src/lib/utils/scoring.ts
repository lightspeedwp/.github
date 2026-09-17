/**
 * Hierarchical scoring logic for checklist results
 * Item score → Dimension score → Overall score
 */

/**
 * Calculate dimension score from item results
 * Score = (passed items / total applicable items) × 100
 * Returns 0-100
 */
export function calculateDimensionScore(passedItems: number, totalItems: number): number {
  if (totalItems === 0) {
    return 100; // No items = perfect score
  }
  return Math.round((passedItems / totalItems) * 100);
}

/**
 * Determine dimension pass/fail status
 * Dimension passes if score >= threshold (default 75%)
 */
export function isDimensionPassing(score: number, threshold: number = 75): boolean {
  return score >= threshold;
}

/**
 * Calculate overall score from dimension scores
 * Overall = average of all dimension scores
 */
export function calculateOverallScore(dimensionScores: Record<string, number>): number {
  const scores = Object.values(dimensionScores);
  if (scores.length === 0) {
    return 0;
  }
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / scores.length);
}

/**
 * Score breakdown utility for reporting
 */
export interface ScoreBreakdown {
  item_results: Array<{
    item_id: string;
    passed: boolean;
  }>;
  dimension_scores: Record<string, number>;
  dimension_status: Record<string, 'pass' | 'fail'>;
  overall_score: number;
  pass_rate: number; // percentage of passing items
}

export function generateScoreBreakdown(
  itemResults: Array<{ item_id: string; passed: boolean }>,
  dimensionScores: Record<string, number>,
  threshold: number = 75
): ScoreBreakdown {
  const dimensionStatus: Record<string, 'pass' | 'fail'> = {};

  for (const [dimension, score] of Object.entries(dimensionScores)) {
    dimensionStatus[dimension] = isDimensionPassing(score, threshold) ? 'pass' : 'fail';
  }

  const passedCount = itemResults.filter((r) => r.passed).length;
  const passRate = itemResults.length > 0 ? (passedCount / itemResults.length) * 100 : 0;

  return {
    item_results: itemResults,
    dimension_scores: dimensionScores,
    dimension_status: dimensionStatus,
    overall_score: calculateOverallScore(dimensionScores),
    pass_rate: Math.round(passRate),
  };
}
