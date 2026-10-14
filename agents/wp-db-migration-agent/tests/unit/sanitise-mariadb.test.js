/**
 * Unit tests for the 2026-10-14 sanitiser fixes: MariaDB's invalid binary
 * defaults, refusing files already converted to SQLite's own dialect, and the
 * --prefix table rename. Synthetic dumps only; no real data.
 */

const fs = require('node:fs');
const path = require('node:path');

const { sanitise, preflight, siteUrls, tables, run } = require('../../lib/sql-tool.cjs');
const { FIXTURES, tempDir, writeTemp } = require('./helpers.cjs');

/** A phpMyAdmin-on-MariaDB style dump: keys added by ALTER TABLE at the end. */
function buildMariaDbDump({ defaultBytes = 16, extra = [] } = {}) {
  return [
    '-- phpMyAdmin SQL Dump',
    '-- Table structure for table `pfx_options`',
    'CREATE TABLE `pfx_options` (',
    '  `option_id` bigint(20) UNSIGNED NOT NULL,',
    "  `option_name` varchar(191) NOT NULL DEFAULT '',",
    '  `option_value` longtext NOT NULL,',
    "  `autoload` varchar(20) NOT NULL DEFAULT 'yes'",
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general1400_as_ci;',
    'INSERT INTO `pfx_options` (`option_id`, `option_name`, `option_value`, `autoload`) VALUES',
    "(1, 'siteurl', 'https://www.example.com', 'yes'),",
    "(2, 'pfx_user_roles', 'a:0:{}', 'yes'),",
    "(3, 'blogdescription', 'mentions pfx_posts in text', 'no');",
    'CREATE TABLE `pfx_posts` (',
    '  `ID` bigint(20) UNSIGNED NOT NULL',
    ') ENGINE=InnoDB;',
    'CREATE TABLE `pfx_usermeta` (',
    '  `umeta_id` bigint(20) UNSIGNED NOT NULL,',
    '  `user_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,',
    '  `meta_key` varchar(255) DEFAULT NULL,',
    '  `meta_value` longtext DEFAULT NULL',
    ') ENGINE=InnoDB;',
    'INSERT INTO `pfx_usermeta` (`umeta_id`, `user_id`, `meta_key`, `meta_value`) VALUES',
    "(1, 1, 'pfx_capabilities', 'a:0:{}'),",
    "(2, 1, 'nickname', 'pfx_admin');",
    'CREATE TABLE `pfx_wpb2d_options` (',
    '  `name` varchar(50) NOT NULL',
    ') ENGINE=InnoDB;',
    'CREATE TABLE `pfx_wfblocks7` (',
    `  \`IP\` binary(16) NOT NULL DEFAULT x AS \`${'00'.repeat(defaultBytes)}\`,`,
    '  `type` int(10) UNSIGNED NOT NULL DEFAULT 0',
    ') ENGINE=InnoDB;',
    ...extra,
    'ALTER TABLE `pfx_options`',
    '  ADD PRIMARY KEY (`option_id`),',
    '  ADD UNIQUE KEY `option_name` (`option_name`);',
    '',
  ].join('\n');
}

describe('sanitise: MariaDB binary defaults', () => {
  const input = writeTemp(buildMariaDbDump());
  const result = sanitise(input, { keepWordfence: true });
  const output = fs.readFileSync(result.output.path, 'latin1');

  it('rewrites DEFAULT x AS `<hex>` as a hex literal of the same bytes', () => {
    expect(output).not.toMatch(/DEFAULT x AS/);
    expect(output).toContain(`\`IP\` binary(16) NOT NULL DEFAULT X'${'00'.repeat(16)}',`);
    expect(result.edits.filter((e) => e.rule === 'binary-default')).toEqual([
      expect.objectContaining({ line: 29, table: 'pfx_wfblocks7' }),
    ]);
  });

  it('leaves every other line unchanged', () => {
    const expected = buildMariaDbDump()
      .replace(/DEFAULT x AS `([0-9a-f]+)`/, "DEFAULT X'$1'")
      .replace(/^CREATE TABLE (`[^`]+`)/gm, 'DROP TABLE IF EXISTS $1;\nCREATE TABLE $1');
    expect(output).toBe(expected);
  });

  it('adds DROP TABLE IF EXISTS before each CREATE TABLE that has none', () => {
    expect(result.edits.filter((e) => e.rule === 'drop-table').map((e) => e.table)).toEqual([
      'pfx_options',
      'pfx_posts',
      'pfx_usermeta',
      'pfx_wpb2d_options',
      'pfx_wfblocks7',
    ]);
  });

  it('does not add a second DROP TABLE when the export already has one', () => {
    const file = writeTemp(
      'DROP TABLE IF EXISTS `wp_x`;\nCREATE TABLE `wp_x` (\n  `id` int\n) ENGINE=InnoDB;\n'
    );
    const dropped = sanitise(file);
    expect(dropped.edits).toEqual([]);
    expect(fs.readFileSync(dropped.output.path, 'latin1').match(/DROP TABLE/g)).toHaveLength(1);
  });

  it('refuses a default whose length disagrees with binary(N), writing nothing', () => {
    const bad = writeTemp(buildMariaDbDump({ defaultBytes: 15 }));
    expect(() => sanitise(bad, { keepWordfence: true })).toThrow(
      /is 15 bytes but the column is binary\(16\)/
    );
    expect(fs.readdirSync(path.dirname(bad))).toEqual(['dump.sql']);
  });
});

describe('sanitise: files already in SQLite dialect', () => {
  it('refuses a native SQLite dump with an explanation, writing nothing', () => {
    const file = writeTemp(
      [
        '-- converted by hand',
        'PRAGMA foreign_keys=OFF;',
        'CREATE TABLE "wp_options" ("option_id" INTEGER PRIMARY KEY AUTOINCREMENT);',
        '',
      ].join('\n')
    );
    expect(() => sanitise(file)).toThrow(
      /line 2 is SQLite syntax \(PRAGMA \.\.\.\).*only accepts MySQL dumps/
    );
    expect(fs.readdirSync(path.dirname(file))).toEqual(['dump.sql']);
  });

  it('is flagged as a failure by preflight', () => {
    const file = writeTemp('BEGIN TRANSACTION;\nINSERT OR IGNORE INTO "t" VALUES (1);\nCOMMIT;\n');
    expect(preflight(file).findings).toContainEqual(
      expect.objectContaining({ check: 'sqlite-dialect', severity: 'fail', line: 1 })
    );
  });

  it('refuses a WITHOUT ROWID table in sanitise and preflight', () => {
    const file = writeTemp(
      'CREATE TABLE "wp_options" (\n  "id" INTEGER PRIMARY KEY\n) WITHOUT ROWID;\n'
    );
    expect(() => sanitise(file)).toThrow(/line 1 is SQLite syntax/);
    expect(preflight(file).findings).toContainEqual(
      expect.objectContaining({ check: 'sqlite-dialect', severity: 'fail', line: 1 })
    );
  });

  it('does not mistake MySQL AUTO_INCREMENT for SQLite AUTOINCREMENT', () => {
    const file = writeTemp(
      'CREATE TABLE `wp_x` (\n  `id` int NOT NULL AUTO_INCREMENT\n) ENGINE=InnoDB;\n'
    );
    expect(() => sanitise(file)).not.toThrow();
  });
});

describe('sanitise --prefix', () => {
  const input = writeTemp(buildMariaDbDump());
  const result = sanitise(input, { prefix: 'wp_' });
  const output = fs.readFileSync(result.output.path, 'latin1');

  it('renames every table in CREATE, INSERT, ALTER and comment lines', () => {
    expect(output).not.toMatch(/`pfx_/);
    for (const table of ['options', 'posts', 'usermeta', 'wpb2d_options']) {
      expect(output).toContain(`CREATE TABLE \`wp_${table}\``);
    }
    expect(output).toContain('INSERT INTO `wp_options` (`option_id`');
    expect(output).toContain('ALTER TABLE `wp_options`');
    expect(output).toContain('-- Table structure for table `wp_options`');
  });

  it('renames the prefixed keys WordPress looks up, and nothing else in the data', () => {
    expect(output).toContain("(2, 'wp_user_roles', 'a:0:{}', 'yes'),");
    expect(output).toContain("(1, 1, 'wp_capabilities', 'a:0:{}'),");
    expect(output).toContain("'mentions pfx_posts in text'");
    expect(output).toContain("(2, 1, 'nickname', 'pfx_admin');");
  });

  it('reports the renames and the prefix left inside data', () => {
    expect(result.edits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ rule: 'prefix-tables', count: 4 }),
        expect.objectContaining({ rule: 'prefix-data', count: 2 }),
      ])
    );
    expect(result.findings).toContainEqual(
      expect.objectContaining({ check: 'prefix-in-data', severity: 'info' })
    );
    expect(result.siteUrls).toEqual([
      expect.objectContaining({ table: 'wp_options', option: 'siteurl' }),
    ]);
  });

  it('keeps CREATE TABLE and INSERT counts equal', () => {
    expect(result.output).toMatchObject({ createTables: 4, inserts: 2 });
  });

  it('refuses an export with more than one WordPress prefix', () => {
    const file = path.join(FIXTURES, 'multisite-prefix.sql');
    const out = writeTemp('', 'out.sql');
    fs.rmSync(out);
    expect(() => sanitise(file, { out, prefix: 'wp_' })).toThrow(/found wp123_, wp123_2_/);
  });

  it('refuses a rename that would collide with an existing table', () => {
    const file = writeTemp(
      buildMariaDbDump({ extra: ['CREATE TABLE `wp_posts` (', '  `ID` int', ') ENGINE=InnoDB;'] })
    );
    expect(() => sanitise(file, { prefix: 'wp_' })).toThrow(
      /collide with the existing table wp_posts/
    );
  });

  it('renames unquoted table names in every statement', () => {
    const file = writeTemp(
      [
        'CREATE TABLE pfx_options (option_id int, option_name varchar(191));',
        "INSERT INTO pfx_options (option_id, option_name) VALUES (1, 'pfx_user_roles');",
        'CREATE TABLE pfx_posts (ID int);',
        'ALTER TABLE pfx_options ADD PRIMARY KEY (option_id);',
        'LOCK TABLES pfx_options WRITE, pfx_posts WRITE;',
        '',
      ].join('\n')
    );
    const renamed = fs.readFileSync(sanitise(file, { prefix: 'wp_' }).output.path, 'latin1');
    expect(renamed).not.toMatch(/pfx_(options|posts)\b/);
    expect(renamed).toContain('CREATE TABLE wp_options (option_id int');
    expect(renamed).toContain(
      "INSERT INTO `wp_options` (option_id, option_name) VALUES (1, 'wp_user_roles');"
    );
    expect(renamed).toContain('ALTER TABLE wp_options ADD PRIMARY KEY');
    expect(renamed).toContain('LOCK TABLES wp_options WRITE, wp_posts WRITE;');
  });

  it('leaves string literals and column names that match a table unchanged', () => {
    const file = writeTemp(
      [
        'CREATE TABLE `pfx_options` (`option_id` int);',
        'CREATE TABLE `pfx_posts` (',
        '  `pfx_options` int,',
        "  `ID` int COMMENT 'see `pfx_options` and \\'pfx_options\\''",
        ') ENGINE=InnoDB;',
        "UPDATE `pfx_options` SET `option_id` = 1 WHERE 'x' = 'mentions `pfx_posts`';",
        '',
      ].join('\n')
    );
    const renamed = fs.readFileSync(sanitise(file, { prefix: 'wp_' }).output.path, 'latin1');
    expect(renamed).toContain('CREATE TABLE `wp_posts`');
    expect(renamed).toContain('  `pfx_options` int,');
    expect(renamed).toContain("COMMENT 'see `pfx_options` and \\'pfx_options\\''");
    expect(renamed).toContain(
      "UPDATE `wp_options` SET `option_id` = 1 WHERE 'x' = 'mentions `pfx_posts`';"
    );
  });

  it('accepts --prefix from the CLI and rejects unsafe prefixes', () => {
    const file = writeTemp(buildMariaDbDump());
    expect(run(['sanitise', file, '--prefix', 'wp_', '--json']).code).toBe(0);
    expect(run(['sanitise', file, '--prefix', 'wp`;', '--force']).stderr).toMatch(
      /only letters, digits and underscores/
    );
  });
});

describe('sanitise: Wordfence tables', () => {
  const extra = [
    'CREATE TABLE `pfx_wfls_settings` (',
    '  `name` varchar(191) NOT NULL',
    ') ENGINE=InnoDB;',
    "INSERT INTO `pfx_wfls_settings` (`name`) VALUES ('x');",
    'ALTER TABLE `pfx_wfls_settings`',
    '  ADD PRIMARY KEY (`name`);',
    'CREATE TABLE `pfx_wfu_log` (',
    '  `idlog` int NOT NULL',
    ') ENGINE=InnoDB;',
  ];
  const input = writeTemp(buildMariaDbDump({ extra }));
  const result = sanitise(input, { prefix: 'wp_' });
  const output = fs.readFileSync(result.output.path, 'latin1');

  it('leaves out every statement for Wordfence tables by default', () => {
    expect(output).not.toMatch(/wfblocks7|wfls_settings/);
    expect(result.edits.filter((e) => e.rule === 'exclude-wordfence')).toEqual([
      expect.objectContaining({ table: 'pfx_wfblocks7', count: 1 }),
      expect.objectContaining({ table: 'pfx_wfls_settings', count: 3 }),
    ]);
    expect(result.findings).toContainEqual(
      expect.objectContaining({ check: 'wordfence-excluded', severity: 'info' })
    );
  });

  it("keeps other plugins' wf... tables that are not Wordfence's", () => {
    expect(output).toContain('CREATE TABLE `wp_wfu_log`');
  });

  it('counts the left-out statements in the input but not the output', () => {
    expect(result.input).toMatchObject({ createTables: 7, inserts: 3 });
    expect(result.output).toMatchObject({ createTables: 5, inserts: 2 });
  });

  it('imports Wordfence tables with --keep-wordfence', () => {
    const file = writeTemp(buildMariaDbDump({ extra }));
    const { code, stdout } = run(['sanitise', file, '--keep-wordfence', '--json']);
    expect(code).toBe(0);
    const kept = JSON.parse(stdout);
    expect(kept.edits.some((e) => e.rule === 'exclude-wordfence')).toBe(false);
    expect(fs.readFileSync(kept.output.path, 'latin1')).toContain(
      'CREATE TABLE `pfx_wfls_settings`'
    );
  });
});

describe('Studio site table prefix', () => {
  const studioSite = (prefix) => {
    const dir = tempDir();
    fs.writeFileSync(
      path.join(dir, 'wp-config.php'),
      `<?php\ndefine( 'DB_NAME', 'wordpress' );\n$table_prefix = '${prefix}';\n`
    );
    return dir;
  };
  const input = writeTemp(buildMariaDbDump());

  it('reports the WordPress prefix without counting plugin *_options tables', () => {
    expect(siteUrls(input).input.prefixes).toEqual(['pfx_']);
  });

  it('warns when the export prefix differs from the Studio site', () => {
    const result = siteUrls(input, { studioSite: studioSite('wp_') });
    expect(result.input.studioPrefix).toBe('wp_');
    expect(result.findings).toContainEqual(
      expect.objectContaining({ check: 'prefix-differs', severity: 'warn' })
    );
  });

  it('is satisfied once --prefix renames the tables to the Studio prefix', () => {
    const file = writeTemp(buildMariaDbDump());
    const result = sanitise(file, { prefix: 'wp_', studioSite: studioSite('wp_') });
    expect(result.findings.filter((f) => f.check === 'prefix-differs')).toEqual([]);
  });

  it('shows both prefixes in the Markdown report', () => {
    const { stdout } = run(['site-urls', input, '--studio-site', studioSite('wp_')]);
    expect(stdout).toContain('WordPress table prefix: `pfx_`; Studio site: `wp_`');
  });

  it('exits 2 when the folder has no readable wp-config.php', () => {
    expect(run(['site-urls', input, '--studio-site', tempDir()]).stderr).toMatch(
      /no wp-config\.php/
    );
  });
});

describe('sanitise --keep-users', () => {
  const users = [
    'CREATE TABLE `pfx_users` (',
    '  `ID` bigint(20) UNSIGNED NOT NULL,',
    "  `user_login` varchar(60) NOT NULL DEFAULT ''",
    ') ENGINE=InnoDB;',
    "INSERT INTO `pfx_users` (`ID`, `user_login`) VALUES (1, 'source-admin');",
  ];
  const studioSite = (prefix) => {
    const dir = tempDir();
    fs.writeFileSync(path.join(dir, 'wp-config.php'), `<?php\n$table_prefix = '${prefix}';\n`);
    return dir;
  };

  it("leaves out the export's users and usermeta tables", () => {
    const file = writeTemp(buildMariaDbDump({ extra: users }));
    const result = sanitise(file, { keepUsers: true });
    const output = fs.readFileSync(result.output.path, 'latin1');
    expect(output).not.toMatch(/pfx_users|pfx_usermeta|source-admin/);
    expect(result.edits.filter((e) => e.rule === 'exclude-users').map((e) => e.table)).toEqual([
      'pfx_usermeta',
      'pfx_users',
    ]);
    const checks = result.findings.map((f) => f.check);
    expect(checks).toEqual(expect.arrayContaining(['users-kept', 'users-kept-prefix']));
    expect(checks).not.toContain('users-replaced');
  });

  it("refuses when the tables would not use the Studio site's prefix", () => {
    const file = writeTemp(buildMariaDbDump({ extra: users }));
    expect(() => sanitise(file, { keepUsers: true, studioSite: studioSite('wp_') })).toThrow(
      /--keep-users needs .* prefix \(wp_\).*add --prefix wp_/
    );
    expect(fs.readdirSync(path.dirname(file))).toEqual(['dump.sql']);
  });

  it('is satisfied when --prefix matches the Studio site', () => {
    const file = writeTemp(buildMariaDbDump({ extra: users }));
    const { code, stdout } = run([
      'sanitise',
      file,
      '--keep-users',
      '--prefix',
      'wp_',
      '--studio-site',
      studioSite('wp_'),
      '--json',
    ]);
    expect(code).toBe(0);
    const checks = JSON.parse(stdout).findings.map((f) => f.check);
    expect(checks).toContain('users-kept');
    expect(checks).not.toContain('users-kept-prefix');
  });
});

describe('sanitise --exclude', () => {
  const logs = [
    'CREATE TABLE `pfx_bad_behavior` (',
    '  `id` int NOT NULL',
    ') ENGINE=InnoDB;',
    'INSERT INTO `pfx_bad_behavior` (`id`) VALUES (1),(2),(3);',
    'CREATE TABLE `pfx_gf_entry` (',
    '  `id` int NOT NULL',
    ') ENGINE=InnoDB;',
    'CREATE TABLE `pfx_gf_entry_meta` (',
    '  `id` int NOT NULL',
    ') ENGINE=InnoDB;',
  ];

  it('leaves out tables matching each pattern, with or without the prefix', () => {
    const file = writeTemp(buildMariaDbDump({ extra: logs }));
    const result = sanitise(file, { exclude: ['bad_behavior', 'pfx_gf_*'] });
    const output = fs.readFileSync(result.output.path, 'latin1');
    expect(output).not.toMatch(/bad_behavior|gf_entry/);
    expect(
      result.edits.filter((e) => e.rule === 'exclude-table').map((e) => [e.table, e.count])
    ).toEqual([
      ['pfx_bad_behavior', 2],
      ['pfx_gf_entry', 1],
      ['pfx_gf_entry_meta', 1],
    ]);
    expect(result.status).toBe('ok');
  });

  it('warns about patterns that match nothing and about core tables', () => {
    const file = writeTemp(buildMariaDbDump({ extra: logs }));
    const result = sanitise(file, { exclude: ['nothing_here', 'posts'] });
    expect(result.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          check: 'exclude-unmatched',
          detail: expect.stringContaining('nothing_here'),
        }),
        expect.objectContaining({ check: 'exclude-core', table: 'pfx_posts' }),
      ])
    );
  });

  it('takes repeated and comma-separated patterns from the CLI and rejects unsafe ones', () => {
    const file = writeTemp(buildMariaDbDump({ extra: logs }));
    const { code, stdout } = run([
      'sanitise',
      file,
      '--exclude',
      'bad_behavior,gf_entry',
      '--exclude',
      'gf_entry_meta',
      '--json',
    ]);
    expect(code).toBe(0);
    expect(JSON.parse(stdout).edits.filter((e) => e.rule === 'exclude-table')).toHaveLength(3);
    expect(run(['sanitise', file, '--exclude', "x'; DROP", '--force']).stderr).toMatch(
      /may contain only letters/
    );
  });
});

describe('tables', () => {
  it('lists every table with rows, size and group', () => {
    const file = writeTemp(buildMariaDbDump());
    const result = tables(file);
    const byName = Object.fromEntries(result.tableList.map((t) => [t.table, t]));
    expect(byName.pfx_options).toMatchObject({ group: 'core', rows: 3 });
    expect(byName.pfx_usermeta).toMatchObject({ group: 'users', rows: 2 });
    expect(byName.pfx_wfblocks7).toMatchObject({ group: 'wordfence', rows: 0 });
    expect(byName.pfx_wpb2d_options).toMatchObject({ group: 'plugin' });
    expect(result.input.prefixes).toEqual(['pfx_']);
  });

  it('prints a Markdown table from the CLI', () => {
    const { code, stdout } = run(['tables', writeTemp(buildMariaDbDump())]);
    expect(code).toBe(0);
    expect(stdout).toContain('| pfx_wfblocks7 | Wordfence: left out by default | 0 |');
  });
});

describe('URL replacement to the Studio site URL', () => {
  const links = [
    'INSERT INTO `pfx_posts` (`ID`) VALUES (1);',
    'CREATE TABLE `pfx_postmeta` (',
    '  `meta_value` longtext',
    ') ENGINE=InnoDB;',
    'INSERT INTO `pfx_postmeta` (`meta_value`) VALUES',
    "('http://example.com/a'),",
    '(\'{"url":"https:\\\\/\\\\/www.example.com\\\\/b"}\'),',
    "('https://example.com.evil.net/ and https://shop.example.com/');",
  ];
  const site = tempDir();
  fs.writeFileSync(path.join(site, 'wp-config.php'), "<?php\n$table_prefix = 'pfx_';\n");
  const config = path.join(tempDir(), 'cli.json');
  fs.writeFileSync(
    config,
    JSON.stringify({
      sites: [
        { name: 'Other', path: '/elsewhere', port: 8881, customDomain: 'other.local' },
        { name: 'Mine', path: site, port: 8883, customDomain: 'mine.local', enableHttps: true },
      ],
    })
  );
  beforeAll(() => {
    process.env.STUDIO_CLI_CONFIG = config;
  });
  afterAll(() => {
    delete process.env.STUDIO_CLI_CONFIG;
  });

  it("plans a replacement to the Studio site's custom URL and counts the links", () => {
    const result = siteUrls(writeTemp(buildMariaDbDump({ extra: links })), { studioSite: site });
    expect(result.input.studioUrl).toBe('https://mine.local');
    expect(result.urlReplacement).toMatchObject({
      sources: ['example.com'],
      destination: 'https://mine.local',
      replacement: 'https:${1}${2}mine.local',
      occurrences: 3,
    });
    expect(result.urlReplacement.regex).toBe(
      'https?:(\\\\?/)(\\\\?/)(?:www\\.)?example\\.com(?!\\.?[\\w-])'
    );
    expect(result.urlReplacement.command).toContain(`--path ${site} search-replace`);
    expect(result.urlReplacement.command).toContain('--dry-run');
    expect(result.findings).toContainEqual(
      expect.objectContaining({ check: 'url-replacement', severity: 'info' })
    );
  });

  it('never changes URLs inside the dump itself', () => {
    const file = writeTemp(buildMariaDbDump({ extra: links }));
    const result = sanitise(file, { studioSite: site });
    expect(result.urlReplacement.occurrences).toBe(3);
    expect(fs.readFileSync(result.output.path, 'latin1')).toContain("('http://example.com/a'),");
  });

  it('uses http://localhost:<port> for a site without a custom domain', () => {
    fs.writeFileSync(config, JSON.stringify({ sites: [{ path: site, port: 8890 }] }));
    const result = siteUrls(writeTemp(buildMariaDbDump()), { studioSite: site });
    expect(result.urlReplacement.destination).toBe('http://localhost:8890');
  });

  it('plans nothing when Studio does not list the site', () => {
    fs.writeFileSync(config, JSON.stringify({ sites: [] }));
    const result = siteUrls(writeTemp(buildMariaDbDump()), { studioSite: site });
    expect(result.urlReplacement).toBeNull();
    expect(result.findings.map((f) => f.check)).not.toContain('url-replacement');
  });
});
