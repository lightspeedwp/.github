/**
 * Tests for Checkbox Parser
 */

const {
  parseCheckboxLine,
  parseCheckboxes,
  countCheckboxes,
  findItemById,
  formatToMarkdown,
} = require('../../lib/checkbox-parser');

describe('Checkbox Parser', () => {
  describe('parseCheckboxLine', () => {
    it('should parse checked item', () => {
      const line = '- [x] CHK-001-Completeness: Are error handling requirements defined?';

      const result = parseCheckboxLine(line);

      expect(result).not.toBeNull();
      expect(result.id).toBe('CHK-001-Completeness');
      expect(result.question).toBe('Are error handling requirements defined?');
      expect(result.isChecked).toBe(true);
      expect(result.state).toBe('checked');
      expect(result.marker).toBeNull();
    });

    it('should parse unchecked item', () => {
      const line = '- [ ] CHK-002-Clarity: Are vague terms replaced?';

      const result = parseCheckboxLine(line);

      expect(result).not.toBeNull();
      expect(result.id).toBe('CHK-002-Clarity');
      expect(result.isChecked).toBe(false);
      expect(result.state).toBe('unchecked');
    });

    it('should parse item with gap marker', () => {
      const line =
        '- [ ] CHK-003-Consistency: Are dependencies documented? [Gap: API requirements missing]';

      const result = parseCheckboxLine(line);

      expect(result).not.toBeNull();
      expect(result.id).toBe('CHK-003-Consistency');
      expect(result.marker).toBe('Gap');
      expect(result.markerDetail).toBe('API requirements missing');
      expect(result.state).toBe('gap');
    });

    it('should parse item with ambiguity marker', () => {
      const line =
        '- [ ] CHK-004-Measurability: Are SLAs defined? [Ambiguity: Uptime target unclear]';

      const result = parseCheckboxLine(line);

      expect(result).not.toBeNull();
      expect(result.marker).toBe('Ambiguity');
      expect(result.markerDetail).toBe('Uptime target unclear');
      expect(result.state).toBe('ambiguity');
    });

    it('should parse item with critical ambiguity marker', () => {
      const line =
        '- [ ] CHK-005-Edge-Cases: Are recovery flows documented? [Ambiguity-Critical: Blocking architecture decision]';

      const result = parseCheckboxLine(line);

      expect(result).not.toBeNull();
      expect(result.marker).toBe('Ambiguity-Critical');
      expect(result.state).toBe('ambiguity-critical');
    });

    it('should return null for non-checkbox lines', () => {
      const lines = ['### Heading', 'Some regular text', 'No checkbox here', '- Not a checkbox'];

      lines.forEach((line) => {
        expect(parseCheckboxLine(line)).toBeNull();
      });
    });

    it('should handle uppercase X', () => {
      const line = '- [X] CHK-001-Completeness: Are error handling requirements defined?';

      const result = parseCheckboxLine(line);

      expect(result.isChecked).toBe(true);
      expect(result.state).toBe('checked');
    });
  });

  describe('parseCheckboxes', () => {
    it('should parse multiple checkboxes from markdown', () => {
      const markdown = `
## Completeness

- [x] CHK-001-Completeness: Are error handling requirements defined?
- [ ] CHK-002-Completeness: Are non-functional requirements covered?
- [ ] CHK-003-Completeness: Are external dependencies documented? [Gap: API specs missing]

## Clarity

- [x] CHK-004-Clarity: Are vague terms replaced?
`;

      const items = parseCheckboxes(markdown);

      expect(items).toHaveLength(4);
      expect(items[0].id).toBe('CHK-001-Completeness');
      expect(items[2].marker).toBe('Gap');
    });

    it('should return empty array for invalid input', () => {
      expect(parseCheckboxes('')).toEqual([]);
      expect(parseCheckboxes(null)).toEqual([]);
      expect(parseCheckboxes(undefined)).toEqual([]);
    });
  });

  describe('countCheckboxes', () => {
    it('should count checkbox states', () => {
      const markdown = `
- [x] CHK-001-Completeness: Are error handling requirements defined?
- [x] CHK-002-Completeness: Are non-functional requirements covered?
- [ ] CHK-003-Completeness: Are external dependencies documented?
- [ ] CHK-004-Clarity: Are vague terms replaced? [Gap: Missing metrics]
- [ ] CHK-005-Clarity: Is terminology consistent? [Ambiguity-Critical: Blocking decision]
`;

      const stats = countCheckboxes(markdown);

      expect(stats.total).toBe(5);
      expect(stats.checked).toBe(2);
      expect(stats.unchecked).toBe(3);
      expect(stats.gaps).toBe(1);
      expect(stats.criticalAmbiguities).toBe(1);
      expect(stats.completionPercent).toBe(40);
    });
  });

  describe('findItemById', () => {
    it('should find item by ID', () => {
      const markdown = `
- [x] CHK-001-Completeness: Are error handling requirements defined?
- [ ] CHK-002-Clarity: Are vague terms replaced?
`;

      const item = findItemById(markdown, 'CHK-002-Clarity');

      expect(item).not.toBeNull();
      expect(item.id).toBe('CHK-002-Clarity');
      expect(item.isChecked).toBe(false);
    });

    it('should return null for non-existent ID', () => {
      const markdown = '- [x] CHK-001-Completeness: Are error handling requirements defined?';

      const item = findItemById(markdown, 'CHK-999-Unknown');

      expect(item).toBeNull();
    });
  });

  describe('formatToMarkdown', () => {
    it('should format item to markdown checkbox', () => {
      const item = {
        id: 'CHK-001-Completeness',
        question: 'Are error handling requirements defined?',
        isChecked: true,
      };

      const markdown = formatToMarkdown(item);

      expect(markdown).toBe('- [x] CHK-001-Completeness: Are error handling requirements defined?');
    });

    it('should format item with marker', () => {
      const item = {
        id: 'CHK-002-Clarity',
        question: 'Are vague terms replaced?',
        isChecked: false,
        marker: 'Gap',
        markerDetail: 'Performance metrics undefined',
      };

      const markdown = formatToMarkdown(item);

      expect(markdown).toContain('[Gap: Performance metrics undefined]');
    });
  });
});
