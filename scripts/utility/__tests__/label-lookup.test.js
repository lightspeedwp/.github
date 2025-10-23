const { buildLabelAliasMap, findStandardLabel } = require('../label-lookup');

describe('label-lookup utilities', () => {
  it('returns correct canonical label for an alias', () => {
    const labelsData = [
      { name: 'lang:php', aliases: ['php'] },
      { name: 'type:bug', aliases: ['bug', 'defect'] },
    ];
    const aliasMap = buildLabelAliasMap(labelsData);
    const canonicalSet = new Set(['lang:php', 'type:bug']);
    expect(findStandardLabel('php', aliasMap, canonicalSet)).toBe('