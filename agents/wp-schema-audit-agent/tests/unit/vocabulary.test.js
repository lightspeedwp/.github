/**
 * @jest-environment node
 *
 * Unit tests for the schema.org vocabulary loader (spec 021, FR-010 to FR-013).
 */

const fs = require('node:fs');
const path = require('node:path');

const {
  buildVocabulary,
  resolveVocabulary,
  compareVersions,
} = require('../../lib/schema-tool.cjs');
const { VOCAB_FILE, loadVocab, tempDir, stubFetch } = require('./helpers.cjs');

const API = 'https://api.github.com/repos/schemaorg/schemaorg/contents/data/releases';
const RAW = 'https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases';

describe('buildVocabulary', () => {
  const vocab = loadVocab();

  it('indexes types, properties and inheritance', () => {
    expect(vocab.isType('LodgingBusiness')).toBe(true);
    expect(vocab.isProperty('itemReviewed')).toBe(true);
    expect([...vocab.ancestors('LodgingBusiness')]).toEqual(
      expect.arrayContaining(['LocalBusiness', 'Organization', 'Place', 'Thing'])
    );
  });

  it('treats DataType subclasses such as URL and Integer as data types', () => {
    expect(vocab.isDataType('Text')).toBe(true);
    expect(vocab.isDataType('URL')).toBe(true);
    expect(vocab.isDataType('Integer')).toBe(true);
    expect(vocab.isDataType('Thing')).toBe(false);
  });

  it('knows enumeration members, pending terms and superseded terms', () => {
    expect(vocab.enumMembers.get('LimitedAvailability')).toEqual(['ItemAvailability']);
    expect(vocab.section.get('TouristTrip')).toBe('pending');
    expect(vocab.superseded.get('reviews')).toBe('review');
  });

  it('rejects a file without a @graph', () => {
    expect(() => buildVocabulary({})).toThrow(/no @graph/);
  });
});

describe('compareVersions', () => {
  it('orders releases numerically, not as text', () => {
    expect(['9.0', '30.1', '29.4', '30.0'].sort(compareVersions)).toEqual([
      '9.0',
      '29.4',
      '30.0',
      '30.1',
    ]);
  });
});

describe('resolveVocabulary', () => {
  const body = fs.readFileSync(VOCAB_FILE, 'utf8');

  it('downloads the latest release once, then reuses the cache', async () => {
    const cacheDir = tempDir();
    const fetch = stubFetch({
      [API]: {
        body: [
          { type: 'dir', name: '29.4' },
          { type: 'dir', name: '30.1' },
          { type: 'file', name: 'README' },
        ],
      },
      [`${RAW}/30.1/schemaorg-all-https.jsonld`]: { body },
    });

    const first = await resolveVocabulary({ cacheDir, fetch });
    expect(first.vocab.version).toBe('30.1');
    expect(fs.existsSync(path.join(cacheDir, '30.1', 'schemaorg-all-https.jsonld'))).toBe(true);

    const second = await resolveVocabulary({ cacheDir, fetch, version: '30.1' });
    expect(second.vocab.version).toBe('30.1');
    expect(fetch.calls.filter((u) => u.startsWith(RAW))).toHaveLength(1);
  });

  it('falls back to the newest cached release when GitHub cannot be reached', async () => {
    const cacheDir = tempDir();
    for (const v of ['9.0', '30.0']) {
      fs.mkdirSync(path.join(cacheDir, v));
      fs.writeFileSync(path.join(cacheDir, v, 'schemaorg-all-https.jsonld'), body);
    }
    const fetch = stubFetch({ [API]: new Error('getaddrinfo ENOTFOUND api.github.com') });
    const result = await resolveVocabulary({ cacheDir, fetch });
    expect(result.vocab.version).toBe('30.0');
    expect(result.notes.join(' ')).toMatch(/cached release 30\.0/);
  });

  it('fails clearly when there is no release online or cached', async () => {
    const fetch = stubFetch({});
    await expect(resolveVocabulary({ cacheDir: tempDir(), fetch })).rejects.toThrow(/--vocab/);
  });

  it('does not cache a download that is not JSON', async () => {
    const cacheDir = tempDir();
    const fetch = stubFetch({
      [`${RAW}/30.1/schemaorg-all-https.jsonld`]: { body: '<html>rate limited</html>' },
    });
    await expect(resolveVocabulary({ cacheDir, fetch, version: '30.1' })).rejects.toThrow();
    expect(fs.existsSync(path.join(cacheDir, '30.1', 'schemaorg-all-https.jsonld'))).toBe(false);
  });

  it('uses an explicit --vocab file without any network access', async () => {
    const fetch = stubFetch({});
    const result = await resolveVocabulary({ vocabPath: VOCAB_FILE, version: 'local', fetch });
    expect(result.vocab.version).toBe('local');
    expect(fetch.calls).toEqual([]);
  });
});
