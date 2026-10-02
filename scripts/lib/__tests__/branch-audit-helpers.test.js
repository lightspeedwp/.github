import { getAgeInDays, meetsAgeThreshold, formatAge } from '../age-calculator.js';
import {
  branchTypeOf,
  daysSince,
  estimateStorageFreedBytes,
  formatBytes,
  toInt,
  toPct,
} from '../branch-utils.js';
import {
  buildExclusionRegex,
  matchesExclusionPattern,
  filterByExclusionPattern,
} from '../exclusion-patterns.js';

describe.each([
  ['getAgeInDays', getAgeInDays],
  ['daysSince', daysSince],
])('%s', (_name, calculate) => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2026-06-30T12:00:00Z'));
  });
  afterEach(() => jest.restoreAllMocks());

  it.each([undefined, null, '', 'invalid-date'])('treats %s as recent', (date) => {
    expect(calculate(date)).toBe(0);
  });

  it.each([
    ['2024-03-01T00:00:00Z', '2024-02-28T00:00:00Z', 2],
    ['2026-03-09T00:00:00-04:00', '2026-03-08T00:00:00-05:00', 23 / 24],
    ['2026-11-02T00:00:00-05:00', '2026-11-01T00:00:00-04:00', 25 / 24],
  ])('measures elapsed time across calendar boundaries ending %s', (now, then, expected) => {
    Date.now.mockReturnValue(Date.parse(now));
    expect(calculate(then)).toBeCloseTo(expected, 10);
  });

  it.each([
    ['2026-06-29T00:00:00Z', 1.5],
    ['2026-06-30T12:00:00Z', 0],
    ['2026-07-01T12:00:00Z', -1],
    ['2026-06-30T14:00:00+02:00', 0],
  ])('measures elapsed days for %s', (date, expected) => {
    expect(calculate(date)).toBe(expected);
  });
});

describe('branch age and storage boundaries', () => {
  it.each([
    [29.999, false],
    [30, true],
    [30.001, true],
  ])('uses an inclusive default threshold for age %s', (age, expected) => {
    expect(meetsAgeThreshold(age)).toBe(expected);
  });
  it('honours custom and zero thresholds', () => {
    expect(meetsAgeThreshold(7, 7)).toBe(true);
    expect(meetsAgeThreshold(6.99, 7)).toBe(false);
    expect(meetsAgeThreshold(0, 0)).toBe(true);
    expect(meetsAgeThreshold(-1, 0)).toBe(false);
  });
  it.each([
    [0.99, '< 1 day'],
    [1, '1 day'],
    [6.99, '6 days'],
    [7, '1 week'],
    [14, '2 weeks'],
    [27, '3 weeks'],
    [30, '1 month'],
    [60, '2 months'],
  ])('formats age %s', (age, expected) => expect(formatAge(age)).toBe(expected));
  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [1024, '1.00 KB'],
    [1536, '1.50 KB'],
    [1048576, '1.00 MB'],
    [1073741824, '1024.00 MB'],
  ])('formats %s bytes', (bytes, expected) => expect(formatBytes(bytes)).toBe(expected));
  it('estimates storage from commit count', () => {
    expect(estimateStorageFreedBytes(0)).toBe(0);
    expect(estimateStorageFreedBytes(3)).toBe(12288);
  });
  it.each([
    ['feat/account-login', 'feat'],
    ['feat/account/login', 'feat'],
    ['main', 'other'],
    ['', 'other'],
  ])('extracts the branch type from %s', (branch, expected) =>
    expect(branchTypeOf(branch)).toBe(expected)
  );
  it.each([
    [' 42 ', 42],
    ['12commits', 12],
    ['3.9', 3],
    ['invalid', 7],
    [null, 7],
  ])('parses integer %s with a fallback', (value, expected) =>
    expect(toInt(value, 7)).toBe(expected)
  );
  it('formats percentages including a zero total', () => {
    expect(toPct(1, 3)).toBe('33.33%');
    expect(toPct(0, 5)).toBe('0.00%');
    expect(toPct(5, 0)).toBe('0.00%');
    expect(toPct(5, 5)).toBe('100.00%');
  });
});

describe('branch exclusions', () => {
  afterEach(() => jest.restoreAllMocks());

  it('keeps defaults anchored at the start of the branch name', () => {
    const pattern = buildExclusionRegex();
    expect(matchesExclusionPattern('release/v1.0', pattern)).toBe(true);
    expect(matchesExclusionPattern('hotfix/account-login', pattern)).toBe(true);
    expect(matchesExclusionPattern('feat/release-widget', pattern)).toBe(false);
    expect(matchesExclusionPattern('prerelease/v1.0', pattern)).toBe(false);
    expect(matchesExclusionPattern('main', null)).toBe(false);
  });
  it('adds trimmed comma and pipe alternatives while retaining defaults', () => {
    const pattern = buildExclusionRegex(' ^support/ , | ^archive/ | ');
    const branches = [
      'feat/account-login',
      'support/customer-fix',
      'release/v1',
      'fix/widget-bug',
      'archive/old-work',
    ];
    const original = [...branches];
    expect(filterByExclusionPattern(branches, pattern)).toEqual({
      excluded: ['support/customer-fix', 'release/v1', 'archive/old-work'],
      included: ['feat/account-login', 'fix/widget-bug'],
    });
    expect(branches).toEqual(original);
  });
  it('warns and preserves default exclusions after an invalid regex', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const pattern = buildExclusionRegex('^support/|[');
    expect(pattern.test('release/v1')).toBe(true);
    expect(pattern.test('hotfix/widget-bug')).toBe(true);
    expect(pattern.test('support/customer-fix')).toBe(false);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Using defaults'));
  });
  it('handles empty inputs and an absent pattern', () => {
    expect(filterByExclusionPattern(undefined, null)).toEqual({ excluded: [], included: [] });
    expect(filterByExclusionPattern(['main'], null)).toEqual({ excluded: [], included: ['main'] });
    expect(buildExclusionRegex(' , | ').test('release/v1')).toBe(true);
  });
});
