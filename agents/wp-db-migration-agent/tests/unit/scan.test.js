/**
 * Unit tests for the sanitiser's risk scan (spec 020, FR-006 and FR-013):
 * risky statements are reported and never changed; the same words inside data
 * or column names are not reported.
 */

const fs = require('node:fs');
const path = require('node:path');

const { sanitise } = require('../../lib/sql-tool.cjs');
const { FIXTURES, tempDir } = require('./helpers.cjs');

describe('sanitise risk scan', () => {
  let result;
  let input;

  beforeAll(() => {
    input = path.join(FIXTURES, 'mysql-risky.sql');
    result = sanitise(input, { out: path.join(tempDir(), 'out.sql') });
  });

  const checks = () => result.findings.map((f) => f.check);

  it.each([
    'create-database',
    'use-database',
    'global-variable',
    'delimiter',
    'definer',
    'fulltext-index',
    'generated-column',
  ])('reports %s', (check) => {
    expect(checks()).toContain(check);
  });

  it('reports risks as warnings that need the user, never as automatic fixes', () => {
    const risks = result.findings.filter((f) => f.severity !== 'info');
    expect(risks.length).toBeGreaterThan(0);
    for (const finding of risks) {
      expect(finding).toMatchObject({ severity: 'warn', autoFixable: false });
    }
    expect(result.status).toBe('findings');
  });

  it('does not report words that appear in data or as a column name', () => {
    const lines = result.findings.map((f) => f.line);
    // Line 15 is the INSERT whose text mentions CREATE TRIGGER and DEFINER=.
    expect(lines).not.toContain(15);
    expect(result.findings.filter((f) => f.check === 'trigger' && f.line === 7)).toEqual([]);
  });

  it('leaves the file unchanged apart from the added DROP TABLE', () => {
    expect(result.edits.map((e) => e.rule)).toEqual(['drop-table']);
    const expected = fs
      .readFileSync(input, 'latin1')
      .replace(/^CREATE TABLE (`[^`]+`)/m, 'DROP TABLE IF EXISTS $1;\nCREATE TABLE $1');
    expect(fs.readFileSync(result.output.path, 'latin1')).toBe(expected);
  });
});
