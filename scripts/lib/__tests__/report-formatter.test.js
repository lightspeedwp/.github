import {
  formatAuditReportMarkdown,
  formatAuditReportJSON,
  formatDeletionCandidatesJSON,
  formatDISCUSSSection,
} from '../report-formatter.js';

describe('branch audit report formatting', () => {
  it.each([
    [true, 'Dry run (no deletions)'],
    [false, 'Live execution'],
  ])('formats the report mode when dryRun=%s', (dryRun, mode) => {
    expect(
      formatAuditReportMarkdown({ timestamp: '2026-06-30T14:00:00+02:00', dryRun, inactiveDays: 0 })
    ).toBe(
      `# Branch Audit Report\n\n**Date:** 2026-06-30T12:00:00.000Z\n**Mode:** ${mode}\n**Threshold:** 0 days inactive\n`
    );
  });
  it('rejects invalid report timestamps', () => {
    expect(() => formatAuditReportMarkdown({ timestamp: 'invalid' })).toThrow(RangeError);
  });
  it('round-trips nested audit data without changing the input', () => {
    const report = Object.freeze({
      dryRun: true,
      branches: [{ name: 'feat/account-login', reason: 'Review "login"\ncarefully' }],
    });
    const json = formatAuditReportJSON(report);
    expect(JSON.parse(json)).toEqual(report);
    expect(json).toContain('\n  "dryRun": true,');
  });
  it.each([
    { candidates: [] },
    { candidates: [{ name: 'feat/account-login', autoApproved: false }] },
  ])('preserves candidate data and report context', ({ candidates }) => {
    const summary = { count: candidates.length };
    const timestamp = '2026-06-30T12:00:00Z';
    expect(
      JSON.parse(formatDeletionCandidatesJSON(candidates, summary, timestamp, 'owner/repo'))
    ).toEqual({ candidates, summary, timestamp, repository: 'owner/repo' });
  });
  it('renders an empty manual-review section', () => {
    expect(formatDISCUSSSection([])).toBe('## Manual Review Required (DISCUSS)\n\n- None\n');
  });
  it('renders reasons and metadata with defaults for missing fields', () => {
    const markdown = formatDISCUSSSection([
      { name: 'feat/account-login', reason: 'Unmerged', ageInDays: 30.5, type: 'feat' },
      { name: 'legacy', reason: 'Invalid name' },
    ]);
    expect(markdown).toContain(
      '### `feat/account-login`\n- **Reason:** Unmerged\n- **Age:** 30.5 days\n- **Type:** feat'
    );
    expect(markdown).toContain(
      '### `legacy`\n- **Reason:** Invalid name\n- **Age:** 0 days\n- **Type:** unknown'
    );
  });
});
