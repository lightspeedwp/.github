/**
 * Tests for Item Validator
 */

const {
  validateItem,
  validateItems,
  isValidItemId,
  VALID_DIMENSIONS,
  VALID_STATES,
} = require('../../lib/item-validator');

describe('Item Validator', () => {
  describe('validateItem', () => {
    it('should validate a correct item', () => {
      const item = {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'checked',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject item with missing id', () => {
      const item = {
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'checked',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: id');
    });

    it('should reject item with invalid id format', () => {
      const item = {
        id: 'INVALID-001',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'checked',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid item ID format'))).toBe(true);
    });

    it('should reject item with missing question', () => {
      const item = {
        id: 'CHK-001-Completeness',
        dimension: 'Completeness',
        state: 'checked',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: question');
    });

    it('should reject item with invalid dimension', () => {
      const item = {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'InvalidDimension',
        state: 'checked',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid dimension'))).toBe(true);
    });

    it('should reject item with invalid state', () => {
      const item = {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'invalid-state',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid state'))).toBe(true);
    });

    it('should reject gap marker without specReference', () => {
      const item = {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'gap',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('specReference'))).toBe(true);
    });

    it('should accept gap with specReference', () => {
      const item = {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'gap',
        specReference: 'Error handling for API timeouts not specified',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate optional fields', () => {
      const item = {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'checked',
        priority: 'high',
        reviewerComment: 'Thoroughly documented',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid priority', () => {
      const item = {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        dimension: 'Completeness',
        state: 'checked',
        priority: 'super-high',
      };

      const result = validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid priority'))).toBe(true);
    });
  });

  describe('validateItems', () => {
    it('should validate array of items', () => {
      const items = [
        {
          id: 'CHK-001-Completeness',
          question: 'Are error handling requirements defined?',
          dimension: 'Completeness',
          state: 'checked',
        },
        {
          id: 'CHK-002-Clarity',
          question: 'Are vague terms replaced?',
          dimension: 'Clarity',
          state: 'checked',
        },
      ];

      const result = validateItems(items);

      expect(result.isValid).toBe(true);
      expect(result.validItems).toBe(2);
      expect(result.invalidItems).toBe(0);
    });

    it('should report invalid items', () => {
      const items = [
        {
          id: 'CHK-001-Completeness',
          question: 'Are error handling requirements defined?',
          dimension: 'Completeness',
          state: 'checked',
        },
        {
          id: 'INVALID',
          question: 'Bad item',
          dimension: 'BadDimension',
          state: 'checked',
        },
      ];

      const result = validateItems(items);

      expect(result.isValid).toBe(false);
      expect(result.invalidItems).toBe(1);
      expect(result.itemResults.some((r) => !r.isValid)).toBe(true);
    });

    it('should reject non-array input', () => {
      const result = validateItems('not an array');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Items must be an array');
    });
  });

  describe('isValidItemId', () => {
    it('should accept valid item IDs', () => {
      const validIds = [
        'CHK-001-Completeness',
        'CHK-045-Ambiguities',
        'CHK-020-Measurability',
        'CHK-999-Edge-Cases',
      ];

      validIds.forEach((id) => {
        expect(isValidItemId(id)).toBe(true);
      });
    });

    it('should reject invalid item IDs', () => {
      const invalidIds = [
        'INVALID-001',
        'CHK-1-Completeness',
        'CHK-001',
        'CHK-001-BadDimension',
        'item-001',
        '001-Completeness',
      ];

      invalidIds.forEach((id) => {
        expect(isValidItemId(id)).toBe(false);
      });
    });
  });
});
