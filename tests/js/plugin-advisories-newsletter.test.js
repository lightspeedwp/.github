import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../..');
const advisoryPath = path.join(repoRoot, 'docs/PLUGIN_ADVISORIES.md');
const advisory = fs.readFileSync(advisoryPath, 'utf8');

/**
 * The newsletter rate-limit example in docs/PLUGIN_ADVISORIES.md is published
 * guidance: implementations are copied from it, so a flaw in it is copied too.
 * These tests read the PHP straight out of the document rather than keeping a
 * copy here, so they cannot drift from the code they police.
 */
function phpFence() {
  const blocks = [...advisory.matchAll(/```php\n([\s\S]*?)```/g)].map((match) => match[1]);
  expect(blocks).toHaveLength(1);
  return blocks[0];
}

function rateLimitFunctions() {
  const block = phpFence();
  const start = block.indexOf('function ls_newsletter_rate_limited');
  const end = block.indexOf('function ls_newsletter_subscribe');
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return block.slice(start, end);
}

function schemaFence() {
  const match = advisory.match(/```sql\n([\s\S]*?)```/g) || [];
  const schema = match.find((block) => block.includes('ls_rate_limits'));
  expect(schema).toBeDefined();
  return schema;
}

const phpAvailable = spawnSync('php', ['--version'], { encoding: 'utf8' }).status === 0;

/**
 * Executes the example's rate-limit functions against a stub $wpdb.
 *
 * The stub models the two InnoDB behaviours the example leans on:
 * LAST_INSERT_ID() carrying the counter out of the upsert, and
 * START TRANSACTION / ROLLBACK restoring the table to its pre-transaction
 * state. Scenarios print their results as JSON so the assertions live here
 * rather than being duplicated in the harness.
 */
const HARNESS_PREAMBLE = `<?php
define( 'HOUR_IN_SECONDS', 3600 );

function wp_hash( $value, $algo = 'auth' ) {
	// WordPress derives 'auth' from a site salt rather than a PHP algorithm.
	// The scenarios only need stable, collision-free keys.
	return substr( hash( 'sha256', $algo . '|' . $value ), 0, 32 );
}
function wp_unslash( $value ) {
	return is_string( $value ) ? stripslashes( $value ) : $value;
}
function sanitize_text_field( $value ) {
	return trim( strip_tags( (string) $value ) );
}

class Stub_WPDB {
	public $prefix = 'wp_';
	public $insert_id = 0;
	public $last_error = '';
	private $rows = array();
	private $snapshot = null;
	private $fail_commit = false;

	public function __construct( $fail_commit = false ) {
		$this->fail_commit = $fail_commit;
	}

	public function prepare( $sql, ...$args ) {
		$out = $sql;
		foreach ( $args as $arg ) {
			$value = is_int( $arg ) ? (string) $arg : "'" . addslashes( $arg ) . "'";
			$out   = preg_replace( '/%[ds]/', $value, $out, 1 );
		}
		return $out;
	}

	public function query( $sql ) {
		$sql = trim( $sql );
		$now = time();

		if ( 'START TRANSACTION' === $sql ) {
			$this->snapshot = $this->rows;
			return 1;
		}
		if ( 'ROLLBACK' === $sql ) {
			if ( null !== $this->snapshot ) {
				$this->rows = $this->snapshot;
			}
			$this->snapshot = null;
			return 1;
		}
		if ( 'COMMIT' === $sql ) {
			if ( $this->fail_commit ) {
				if ( null !== $this->snapshot ) {
					$this->rows = $this->snapshot;
				}
				$this->snapshot = null;
				$this->last_error = 'commit failed';
				return false;
			}
			$this->snapshot = null;
			return 1;
		}

		if ( preg_match( '/^DELETE FROM \\S+ WHERE window_started <= (\\d+)$/', $sql, $m ) ) {
			$cutoff = (int) $m[1];
			foreach ( $this->rows as $key => $row ) {
				if ( $row['window_started'] <= $cutoff ) {
					unset( $this->rows[ $key ] );
				}
			}
			return 1;
		}

		if ( preg_match(
			"/^INSERT INTO \\S+ \\(rate_key, hits, window_started\\) VALUES \\('(.*?)', LAST_INSERT_ID\\(1\\), (\\d+)\\)\\s*ON DUPLICATE KEY UPDATE\\s*hits = LAST_INSERT_ID\\(hits \\+ 1\\)$/s",
			$sql,
			$m
		) ) {
			$key = $m[1];
			$ts  = (int) $m[2];
			if ( isset( $this->rows[ $key ] ) ) {
				$this->rows[ $key ]['hits']++;
				$this->insert_id = $this->rows[ $key ]['hits'];
			} else {
				$this->rows[ $key ] = array( 'hits' => 1, 'window_started' => $ts );
				$this->insert_id    = 1;
			}
			return 1;
		}

		$this->last_error = 'unrecognised statement: ' . $sql;
		return false;
	}

	public function hits( $key ) {
		return isset( $this->rows[ $key ] ) ? $this->rows[ $key ]['hits'] : 0;
	}

	public function seed( $key, $hits, $age_seconds = 0 ) {
		$this->rows[ $key ] = array(
			'hits'           => $hits,
			'window_started' => time() - $age_seconds,
		);
	}

	public function row_count() {
		return count( $this->rows );
	}
}
`;

const HARNESS_SCENARIOS = `
function scenario( $db, $ip, $email ) {
	$GLOBALS['wpdb']       = $db;
	$_SERVER['REMOTE_ADDR'] = $ip;
	return ls_newsletter_rate_limited( $email ) ? 'refused' : 'allowed';
}

function key_for( $prefix, $value ) {
	return $prefix . wp_hash( $value, 'auth' );
}

$out = array();

// 1. The reported defect: resubmitting an address that is already blocked must
//    not spend the shared IP budget.
$db = new Stub_WPDB();
$decisions = array();
for ( $i = 1; $i <= 4; $i++ ) {
	$decisions[] = scenario( $db, '203.0.113.7', 'blocked@example.com' );
}
$out['repeat_same_address'] = array(
	'decisions'  => $decisions,
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '203.0.113.7' ) ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'blocked@example.com' ) ),
);

// 2. Legitimate traffic still spends the IP budget: the fix must not have
//    disabled the per-IP limit.
$db        = new Stub_WPDB();
$decisions = array();
for ( $i = 1; $i <= 21; $i++ ) {
	$decisions[] = scenario( $db, '198.51.100.9', 'visitor' . $i . '@example.com' );
}
$out['distinct_addresses'] = array(
	'decisions' => $decisions,
	'ip_hits'   => $db->hits( key_for( 'ls_newsletter_ip_', '198.51.100.9' ) ),
);

// 3. An address already over budget leaves both counters untouched.
$db = new Stub_WPDB();
$db->seed( key_for( 'ls_newsletter_ip_', '192.0.2.44' ), 19 );
$db->seed( key_for( 'ls_newsletter_email_', 'gone@example.com' ), 3 );
$out['address_refusal_is_free'] = array(
	'refused'    => scenario( $db, '192.0.2.44', 'gone@example.com' ),
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.44' ) ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'gone@example.com' ) ),
);

// 4. Symmetrically, an IP already over budget charges nothing either.
$db = new Stub_WPDB();
$db->seed( key_for( 'ls_newsletter_ip_', '192.0.2.55' ), 20 );
$out['ip_refusal_is_free'] = array(
	'refused'    => scenario( $db, '192.0.2.55', 'ipfull@example.com' ),
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.55' ) ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'ipfull@example.com' ) ),
);

// 5. Fail closed: a commit that cannot be confirmed must refuse, and must not
//    leave the increment behind.
$db = new Stub_WPDB( true );
$out['failed_commit_refuses'] = array(
	'refused' => scenario( $db, '192.0.2.66', 'commit@example.com' ),
	'ip_hits' => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.66' ) ),
);

// 6. The purge still bounds the table to one window.
$db = new Stub_WPDB();
$db->seed( 'ls_newsletter_ip_stale', 5, 2 * HOUR_IN_SECONDS );
scenario( $db, '192.0.2.77', 'purge@example.com' );
$out['purge'] = array(
	// The stale row is gone, and only the two rows belonging to the current
	// request remain: one for the address, one for the IP.
	'stale_hits' => $db->hits( 'ls_newsletter_ip_stale' ),
	'row_count'  => $db->row_count(),
);

echo json_encode( $out );
`;

function runScenarios() {
  const script = [HARNESS_PREAMBLE, rateLimitFunctions(), HARNESS_SCENARIOS].join('\n');
  const result = spawnSync('php', { input: script, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  if (result.status !== 0) {
    throw new Error(
      `php exited ${result.status}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`
    );
  }
  const json = result.stdout.slice(result.stdout.indexOf('{'));
  return JSON.parse(json);
}

describe('PLUGIN_ADVISORIES newsletter rate limiting', () => {
  describe('documented behaviour', () => {
    test('charges the address counter before the shared IP counter', () => {
      const functions = rateLimitFunctions();
      const emailAt = functions.indexOf("ls_newsletter_key( 'ls_newsletter_email_'");
      const ipAt = functions.indexOf("ls_newsletter_key( 'ls_newsletter_ip_'");
      expect(emailAt).toBeGreaterThan(-1);
      expect(ipAt).toBeGreaterThan(emailAt);
    });

    test('gates the IP increment behind the address decision', () => {
      const functions = rateLimitFunctions();
      // The IP bump must be inside the `if ( ! $refused )` guard, so a
      // request refused for the address limit never reaches the IP write.
      expect(functions).toMatch(
        /\$refused = ls_newsletter_bump\([^;]*email_[^;]*\);\s*\n\tif \( ! \$refused \) \{\s*\n\t\t\$refused = ls_newsletter_bump\([^;]*ip_/
      );
    });

    test('discards both counters together when the request is refused', () => {
      const functions = rateLimitFunctions();
      expect(functions).toContain("$wpdb->query( 'START TRANSACTION' )");
      expect(functions).toMatch(/\$refused \) \{\s*\n\t\t\$wpdb->query\( 'ROLLBACK' \);/);
      expect(functions).toContain("$wpdb->query( 'COMMIT' )");
    });

    test('refuses rather than guessing when the commit cannot be confirmed', () => {
      const functions = rateLimitFunctions();
      expect(functions).toMatch(/false === \$wpdb->query\( 'COMMIT' \) \) \{\s*\n\t\treturn true;/);
    });

    test('declares the counter table as InnoDB so ROLLBACK is honoured', () => {
      // Without this the transaction silently does nothing on MyISAM and the
      // counters behave exactly as the transactional version was written to
      // prevent.
      expect(schemaFence()).toMatch(/ENGINE\s*=\s*InnoDB/i);
    });

    test('purges expired counters without needing the transaction to commit', () => {
      const functions = rateLimitFunctions();
      const purge = functions.slice(functions.indexOf('function ls_newsletter_purge'));
      expect(purge).toContain('DELETE FROM');
      expect(purge).toContain('HOUR_IN_SECONDS');
      // The purge must not sit inside the counter transaction, or a refused
      // request would roll the cleanup back.
      expect(functions.indexOf('ls_newsletter_purge()')).toBeLessThan(
        functions.indexOf('START TRANSACTION')
      );
    });

    test('explains the trade-off the no-charge-on-refusal policy makes', () => {
      expect(advisory).toMatch(/refused request is charged to\s+neither counter/i);
      expect(advisory).toMatch(/reverse proxy or WAF/i);
    });
  });

  describe('executed against a stub $wpdb', () => {
    if (!phpAvailable) {
      test.skip('php is not on PATH', () => {
        // The documented-behaviour assertions above still run, so the ordering
        // regression this suite exists to catch cannot pass unnoticed.
      });
      return;
    }

    test('a refused request does not spend the shared IP budget', () => {
      const results = runScenarios();
      const scenario = results.repeat_same_address;

      // Three attempts are allowed, the fourth is refused (strictly greater
      // than the configured maximum of 3).
      expect(scenario.decisions).toEqual(['allowed', 'allowed', 'allowed', 'refused']);
      // The defect: the refusal used to leave ip_hits at 4.
      expect(scenario.ip_hits).toBe(3);
      expect(scenario.email_hits).toBe(3);
    });

    test('legitimate traffic still spends the IP budget', () => {
      const { decisions, ip_hits } = runScenarios().distinct_addresses;
      expect(decisions.filter((d) => d === 'allowed')).toHaveLength(20);
      expect(decisions[20]).toBe('refused');
      expect(ip_hits).toBe(20);
    });

    test('an address over budget leaves both counters untouched', () => {
      const result = runScenarios().address_refusal_is_free;
      expect(result.refused).toBe('refused');
      expect(result.ip_hits).toBe(19);
      expect(result.email_hits).toBe(3);
    });

    test('an IP over budget leaves both counters untouched', () => {
      const result = runScenarios().ip_refusal_is_free;
      expect(result.refused).toBe('refused');
      expect(result.ip_hits).toBe(20);
      expect(result.email_hits).toBe(0);
    });

    test('refuses and rolls back when the commit cannot be confirmed', () => {
      const result = runScenarios().failed_commit_refuses;
      expect(result.refused).toBe('refused');
      expect(result.ip_hits).toBe(0);
    });

    test('purges expired counters, keeping the table to one window', () => {
      const { stale_hits: staleHits, row_count: rowCount } = runScenarios().purge;
      // The two-hour-old row is deleted before the current request is counted.
      expect(staleHits).toBe(0);
      // Only the current request's two counters remain, so the table does not
      // grow with every distinct address that was ever seen.
      expect(rowCount).toBe(2);
    });
  });
});
