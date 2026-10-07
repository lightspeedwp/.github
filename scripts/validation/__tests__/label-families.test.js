const { LABEL_PREFIXES, STAGE_2_PREFIXES, hasLabelPrefix } = require('../lib/label-families.cjs');

describe('label families', () => {
  it('accepts a label in a family labels.yml carries today', () => {
    for (const name of ['area:ci', 'type:bug', 'meta:needs-approval', 'status:needs-review']) {
      expect(hasLabelPrefix(name)).toBe(true);
    }
  });

  it('rejects an unprefixed name and a family outside the list', () => {
    for (const name of ['bug', 'Hosting', 'CI/CD', 'other:example', 'areas:ci']) {
      expect(hasLabelPrefix(name)).toBe(false);
    }
  });

  it('does not match a family prefix that is only part of a longer family name', () => {
    expect(hasLabelPrefix('areaX:thing')).toBe(false);
    expect(hasLabelPrefix('area')).toBe(false);
  });

  it('keeps the Stage 2 families out of the default list until labels.yml carries them', () => {
    for (const prefix of STAGE_2_PREFIXES) {
      expect(LABEL_PREFIXES).not.toContain(prefix);
      expect(hasLabelPrefix(`${prefix}example`)).toBe(false);
      expect(hasLabelPrefix(`${prefix}example`, [...LABEL_PREFIXES, ...STAGE_2_PREFIXES])).toBe(
        true
      );
    }
  });

  it('gives every family a trailing colon, so a prefix cannot match half a word', () => {
    for (const prefix of [...LABEL_PREFIXES, ...STAGE_2_PREFIXES]) expect(prefix).toMatch(/:$/);
  });

  it('is not fooled by a non-string name', () => {
    expect(hasLabelPrefix(undefined)).toBe(false);
    expect(hasLabelPrefix(null)).toBe(false);
  });
});
