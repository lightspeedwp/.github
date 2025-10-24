const { buildLabelingReport } = require('../label-reporting');

describe('buildLabelingReport', () => {
    it('generates a markdown report for labels', () => {
        const report = buildLabelingReport(
            ['status:needs-review', 'type:feature'],
            ['status:needs-review', 'type:feature']
        );
        expect(report).toMatch(/Label Audit Report/);
        expect(report).toMatch(/status:needs-review/);
    });
});
