/**
 * Unit tests for `sql-tool site-urls` (spec 022, User Story 3, FR-030).
 */

const path = require('node:path');

const { siteUrls } = require('../../lib/sql-tool.cjs');
const { FIXTURES, writeTemp } = require('./helpers.cjs');

describe('site-urls', () => {
  const result = siteUrls(path.join(FIXTURES, 'multisite-prefix.sql'));

  it('reads siteurl and home from every *_options table, whatever the prefix', () => {
    expect(result.siteUrls).toEqual([
      { table: 'wp123_options', option: 'siteurl', value: 'https://staging.example.com' },
      { table: 'wp123_options', option: 'home', value: 'https://www.example.com' },
      { table: 'wp123_2_options', option: 'siteurl', value: 'https://staging.example.com/shop' },
      { table: 'wp123_2_options', option: 'home', value: 'https://staging.example.com/shop' },
    ]);
    expect(result.input.prefixes).toEqual(['wp123_', 'wp123_2_']);
  });

  it('ignores "siteurl" inside serialised values and in non-options tables', () => {
    const values = result.siteUrls.map((u) => u.value);
    expect(values).not.toContain('http://decoy.example');
    expect(values).not.toContain('http://not-an-option.example');
  });

  it('notes when siteurl and home differ', () => {
    expect(result.findings).toEqual([
      expect.objectContaining({ check: 'siteurl-home-differ', table: 'wp123_options' }),
    ]);
  });

  it('warns rather than guessing when no options table exists', () => {
    const empty = siteUrls(writeTemp('CREATE TABLE `t` (\n  `id` int\n);\n'));
    expect(empty.siteUrls).toEqual([]);
    expect(empty.findings[0]).toMatchObject({ check: 'no-site-url', severity: 'warn' });
  });

  it('decodes UTF-8 URLs', () => {
    const file = writeTemp(
      Buffer.from(
        "CREATE TABLE `wp_options` (\n  `option_id` int,\n  `option_name` varchar(191),\n  `option_value` longtext,\n  `autoload` varchar(20)\n);\nINSERT INTO `wp_options` VALUES (1,'siteurl','https://café.example','yes');\n",
        'utf8'
      )
    );
    expect(siteUrls(file).siteUrls[0].value).toBe('https://café.example');
  });
});
