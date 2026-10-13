/**
 * Unit tests for `sql-tool preflight` (spec 020, User Story 2, FR-020 to FR-024).
 * Each check has a failing fixture and a passing one (SC-004).
 */

const fs = require('node:fs');
const path = require('node:path');

const { preflight, run } = require('../../lib/sql-tool.cjs');
const { FIXTURES, writeTemp } = require('./helpers.cjs');

const STUDIO = path.join(FIXTURES, 'studio-export.sql');

const CLEAN = [
  'CREATE TABLE `wp_options` (',
  '  `option_id` bigint unsigned NOT NULL,',
  '  `option_name` varchar(191) NOT NULL,',
  '  `option_value` longtext NOT NULL,',
  '  `autoload` varchar(20) NOT NULL',
  ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;',
  "INSERT INTO `wp_options` VALUES (1,'siteurl','https://staging.example.com','yes');",
  '',
].join('\n');

describe('preflight on a Studio export', () => {
  const result = preflight(STUDIO, { target: 'mysql-5.7', prefix: 'wp_' });
  const find = (check) => result.findings.filter((f) => f.check === check);

  it('fails internal SQLite integration tables and ignores their data', () => {
    expect(find('internal-table')).toEqual([
      expect.objectContaining({ severity: 'fail', table: '_wp_sqlite_global_variables' }),
    ]);
  });

  it('fails a 0900 collation on a MySQL 5.7 target', () => {
    expect(find('collation-0900')).toEqual([
      expect.objectContaining({ severity: 'fail', table: 'wp_options' }),
    ]);
  });

  it('only warns about a 0900 collation when the target is unknown, and passes on MySQL 8', () => {
    expect(preflight(STUDIO).findings.find((f) => f.check === 'collation-0900').severity).toBe(
      'warn'
    );
    expect(
      preflight(STUDIO, { target: 'mysql-8' }).findings.some((f) => f.check === 'collation-0900')
    ).toBe(false);
  });

  it('notes legacy character sets', () => {
    expect(find('legacy-charset')).toEqual([
      expect.objectContaining({ severity: 'info', table: 'wp_posts' }),
    ]);
  });

  it('fails CREATE DATABASE and USE statements', () => {
    expect(find('create-database')[0].severity).toBe('fail');
    expect(find('use-database')[0].severity).toBe('fail');
  });

  it('warns once about DROP TABLE statements', () => {
    expect(find('drop-table')).toEqual([
      expect.objectContaining({ severity: 'warn', detail: expect.stringMatching(/^4 DROP TABLE/) }),
    ]);
  });

  it('warns about a table prefix that differs from the target', () => {
    expect(find('prefix-mismatch').map((f) => f.table)).toEqual(['custom_log']);
  });

  it('warns about local Studio URLs per host, with counts', () => {
    const urls = Object.fromEntries(find('local-url').map((f) => [f.detail, f.table]));
    expect(urls).toEqual({
      '5 occurrence(s) of https://beta.local.': 'wp_options, wp_posts',
      '1 occurrence(s) of http://localhost:8881.': 'wp_posts',
    });
  });

  it('reports site URLs from a phpMyAdmin multi-line INSERT', () => {
    expect(result.siteUrls).toEqual([
      { table: 'wp_options', option: 'siteurl', value: 'https://beta.local' },
      { table: 'wp_options', option: 'home', value: 'https://beta.local' },
    ]);
  });

  it('never writes a file', () => {
    expect(fs.readdirSync(FIXTURES).sort()).toEqual([
      'multisite-prefix.sql',
      'mysql-risky.sql',
      'studio-export.sql',
    ]);
  });

  it('exits 1 from the CLI when anything is flagged', () => {
    expect(run(['preflight', STUDIO, '--target', 'mysql-5.7']).code).toBe(1);
  });
});

describe('preflight on a clean export', () => {
  it('passes every check and exits 0', () => {
    const file = writeTemp(CLEAN);
    const result = preflight(file, { target: 'mysql-5.7', prefix: 'wp_' });
    expect(result.findings).toEqual([]);
    expect(result.status).toBe('ok');
    expect(run(['preflight', file, '--target', 'mysql-5.7', '--prefix', 'wp_']).code).toBe(0);
  });

  it('fails a file with no tables', () => {
    expect(preflight(writeTemp('-- empty\n')).findings[0].check).toBe('no-tables');
  });

  it('rejects an unknown target', () => {
    expect(run(['preflight', writeTemp(CLEAN), '--target', 'oracle']).code).toBe(2);
  });
});
