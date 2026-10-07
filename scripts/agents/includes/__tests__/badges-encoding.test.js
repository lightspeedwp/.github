/**
 * Badge URL encoding in includes/badges.js: labels with spaces or colons must
 * never reach the shields.io URL raw.
 */
const { resolveBadge, encodeBadgeSegment } = require('../badges.js');

const defs = {
  workflow: {
    docs: { label: 'Docs Validation' },
    colon: { label: 'Badges: Documentation Update', success_text: 'All Good' },
    plain: { label: 'Checks' },
  },
  meta: { license: { label: 'License' } },
};

describe('encodeBadgeSegment', () => {
  it('encodes spaces and keeps colons readable', () => {
    expect(encodeBadgeSegment('Docs Validation')).toBe('Docs%20Validation');
    expect(encodeBadgeSegment('Badges: Documentation Update')).toBe(
      'Badges:%20Documentation%20Update'
    );
  });

  it('leaves a plain word unchanged', () => {
    expect(encodeBadgeSegment('Checks')).toBe('Checks');
  });

  // shields.io reads a single "-" as the label/message/colour separator and "_" as
  // a space, so literal ones are doubled.
  it('doubles a literal hyphen', () => {
    expect(encodeBadgeSegment('pre-release')).toBe('pre--release');
    expect(encodeBadgeSegment('CC-BY-4.0')).toBe('CC--BY--4.0');
  });

  it('doubles a literal underscore', () => {
    expect(encodeBadgeSegment('snake_case')).toBe('snake__case');
  });

  it('handles spaces, hyphens, underscores and colons together', () => {
    expect(encodeBadgeSegment('Build: pre-release_1 ok')).toBe('Build:%20pre--release__1%20ok');
  });
});

describe('both badge generators encode the same way', () => {
  const branding = require('../../branding.agent.js');
  const samples = [
    'Docs Validation',
    'Badges: Health Check',
    'pre-release',
    'CC-BY-4.0',
    'snake_case',
    'Checks',
  ];

  it.each(samples)('agrees on %s', (sample) => {
    expect(branding.encodeBadgeSegment(sample)).toBe(encodeBadgeSegment(sample));
  });
});

describe('resolveBadge', () => {
  it('encodes a workflow label that contains a space', () => {
    expect(resolveBadge('workflow.docs', defs, {})).toBe(
      '![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)'
    );
  });

  it('encodes the colon label and a custom status text', () => {
    expect(resolveBadge('workflow.colon', defs, {})).toBe(
      '![Badges: Documentation Update](https://img.shields.io/badge/Badges:%20Documentation%20Update-All%20Good-success.svg)'
    );
  });

  it('leaves a plain label alone', () => {
    expect(resolveBadge('workflow.plain', defs, {})).toBe(
      '![Checks](https://img.shields.io/badge/Checks-OK-success.svg)'
    );
  });

  it('encodes a licence value', () => {
    expect(resolveBadge('meta.license', defs, { license: 'cc by 4.0' })).toBe(
      '![License](https://img.shields.io/badge/license-CC%20BY%204.0-blue.svg)'
    );
  });

  it('keeps a hyphenated licence in one field', () => {
    expect(resolveBadge('meta.license', defs, { license: 'cc-by-4.0' })).toBe(
      '![License](https://img.shields.io/badge/license-CC--BY--4.0-blue.svg)'
    );
  });

  it('never puts a raw space in the badge URL', () => {
    for (const ref of ['workflow.docs', 'workflow.colon', 'workflow.plain']) {
      const url = /\((https:[^)]*)\)/.exec(resolveBadge(ref, defs, {}))[1];
      expect(url).not.toMatch(/\s/);
    }
  });
});
