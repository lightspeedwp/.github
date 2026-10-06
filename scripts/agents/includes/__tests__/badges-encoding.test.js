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

  it('never puts a raw space in the badge URL', () => {
    for (const ref of ['workflow.docs', 'workflow.colon', 'workflow.plain']) {
      const url = /\((https:[^)]*)\)/.exec(resolveBadge(ref, defs, {}))[1];
      expect(url).not.toMatch(/\s/);
    }
  });
});
