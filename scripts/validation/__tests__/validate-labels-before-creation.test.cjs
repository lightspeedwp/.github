/**
 * Unit Tests: validate-labels-before-creation.cjs
 *
 * Test suite for pre-creation label validation script.
 * Validates:
 * 1. Canonical label existence
 * 2. Family prefix requirements
 * 3. One-hot per family constraint
 * 4. Required type: label
 * 5. Error and warning messages
 */

const { execSync } = require('child_process');
const path = require('path');

const SCRIPT_PATH = path.join(__dirname, '../validate-labels-before-creation.cjs');
const LABELS_FILE = path.join(__dirname, '../../../.github/labels.yml');

/**
 * Execute validation script and parse output
 * @param {string[]} labels - Labels to validate
 * @returns {object} Parsed result
 */
function validateLabels(labels) {
  const labelStr = labels.join(',');
  try {
    execSync(
      `node ${SCRIPT_PATH} --labels "${labelStr}" --canonical-file ${LABELS_FILE}`,
      { stdio: 'pipe' }
    );
    return { valid: true, errors: [], warnings: [] };
  } catch (error) {
    // Extract JSON from stderr
    const stderr = error.stderr.toString();
    const jsonMatch = stderr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { valid: false, errors: [error.message], warnings: [] };
  }
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Label Validation', () => {
  describe('Valid Labels', () => {
    test('accepts canonical type:bug label', () => {
      const result = validateLabels(['type:bug']);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('accepts full canonical label set', () => {
      const result = validateLabels([
        'type:bug',
        'status:needs-triage',
        'priority:critical',
        'area:ci'
      ]);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('accepts all type:* variants', () => {
      const types = [
        'type:bug',
        'type:feature',
        'type:task',
        'type:documentation',
        'type:design',
        'type:refactor',
        'type:chore'
      ];

      for (const type of types) {
        const result = validateLabels([type]);
        expect(result.valid).toBe(true);
      }
    });

    test('accepts multiple meta: labels (allowed exception)', () => {
      const result = validateLabels([
        'type:bug',
        'meta:needs-changelog',
        'meta:has-pr'
      ]);
      expect(result.valid).toBe(true);
    });
  });

  describe('Bare Labels (Invalid)', () => {
    test('rejects bare "bug" label', () => {
      const result = validateLabels(['bug']);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('bug'))).toBe(true);
    });

    test('rejects bare "feature" label', () => {
      const result = validateLabels(['feature']);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('feature'))).toBe(true);
    });

    test('rejects all common bare labels', () => {
      const bareLabels = [
        'bug',
        'feature',
        'task',
        'documentation',
        'urgent',
        'critical',
        'ci',
        'docs',
        'release',
        'automation'
      ];

      for (const bare of bareLabels) {
        const result = validateLabels([bare]);
        expect(result.valid).toBe(false);
      }
    });

    test('detects bare labels in mixed set', () => {
      const result = validateLabels(['type:bug', 'feature', 'status:needs-triage']);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('feature'))).toBe(true);
    });
  });

  describe('Non-Existent Labels', () => {
    test('rejects unknown label', () => {
      const result = validateLabels(['type:unknown']);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('not found'))).toBe(true);
    });

    test('rejects completely made-up label', () => {
      const result = validateLabels(['invalid:label']);
      expect(result.valid).toBe(false);
    });
  });

  describe('One-Hot Constraint (One per Family)', () => {
    test('rejects multiple type: labels', () => {
      const result = validateLabels(['type:bug', 'type:feature']);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Multiple labels'))).toBe(true);
    });

    test('rejects multiple status: labels', () => {
      const result = validateLabels([
        'type:bug',
        'status:needs-triage',
        'status:in-progress'
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Multiple labels'))).toBe(true);
    });

    test('rejects multiple priority: labels', () => {
      const result = validateLabels([
        'type:bug',
        'priority:critical',
        'priority:important'
      ]);
      expect(result.valid).toBe(false);
    });

    test('allows multiple meta: labels (exception)', () => {
      const result = validateLabels([
        'type:bug',
        'meta:needs-changelog',
        'meta:has-pr',
        'meta:duplicate'
      ]);
      expect(result.valid).toBe(true);
    });

    test('allows multiple comp: labels (exception)', () => {
      const result = validateLabels([
        'type:feature',
        'comp:block-editor',
        'comp:theme-json'
      ]);
      expect(result.valid).toBe(true);
    });
  });

  describe('Required type: Label', () => {
    test('requires at least one type: label', () => {
      const result = validateLabels(['status:needs-triage', 'priority:critical']);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes("Missing required 'type:*'"))).toBe(true);
    });

    test('passes with any type: variant', () => {
      const types = [
        'type:bug',
        'type:feature',
        'type:task',
        'type:documentation'
      ];

      for (const type of types) {
        const result = validateLabels([type]);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe('Warnings', () => {
    test('warns about bare label "bug"', () => {
      const result = validateLabels(['bug']);
      expect(result.warnings.some(w => w.includes('Bare label'))).toBe(true);
    });

    test('suggests corrections for bare labels', () => {
      const result = validateLabels(['bug']);
      expect(result.warnings.some(w => w.includes('type:bug'))).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty label list', () => {
      const result = validateLabels([]);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes("Missing required 'type:*'"))).toBe(true);
    });

    test('ignores whitespace in labels', () => {
      const result = validateLabels(['type:bug ', ' status:needs-triage']);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('handles very long label list', () => {
      const labels = [
        'type:feature',
        'status:ready',
        'priority:normal',
        'area:ci',
        'meta:needs-changelog'
      ];
      const result = validateLabels(labels);
      expect(result.valid).toBe(true);
    });
  });
});
