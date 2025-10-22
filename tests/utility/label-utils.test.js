/**
 * Tests for label-utils reporting helpers.
 */
const { buildLabelingReport } = require('../../scripts/utility/label-utils');

describe('label-utils.js', () => {
    test('buildLabelingReport outputs markdown with applied labels', () => {
        const report = buildLabelingReport({
            type: 'Issue',
            newLabels: ['type:bug', 'priority:high'],
            suggestions: [],
        });
        expect(report).toContain('type:bug');
        expect(report).toContain('priority:high');
        expect(report).toContain('Auto-Labeling Report');
    });

    test('buildLabelingReport outputs markdown with suggestions', () => {
        const suggestions = [
            { from: 'bug', to: 'type:bug' },
            { from: 'urgent', to: 'priority:high' },
            { from: 'foo', to: null },
        ];
        const report = buildLabelingReport({
            type: 'Pull Request',
            newLabels: ['type:bug'],
            suggestions,
        });
        expect(report).toContain('bug');
        expect(report).toContain('type:bug');
        expect(report).toContain('urgent');
        expect(report).toContain('priority:high');
        expect(report).toContain('foo');
        expect(report).toContain('is non-standard and was removed');
    });
});
