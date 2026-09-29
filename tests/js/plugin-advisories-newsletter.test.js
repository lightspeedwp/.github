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

// WordPress defines these in wp-includes/wp-db.php; the doc snippet relies on
// ARRAY_A, so the harness has to supply it rather than the snippet avoiding it.
define( 'ARRAY_A', 'ARRAY_A' );

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
	public $dbh = 'handle-1';
	public $swap_handle_before_select = false;
	public $insert_id = 0;
	public $last_error = '';
	public $logged = array();
	public $counter_writes = array();
	public $counter_write_rows = 0;
	private $rows = array();
	private $snapshot = null;
	private $fail_commit = false;
	private $fail_start = false;
	private $fail_rollback = false;
	private $fail_purge = false;

	public function __construct(
		$fail_commit = false,
		$fail_start = false,
		$fail_rollback = false,
		$fail_purge = false
	) {
		$this->fail_commit   = $fail_commit;
		$this->fail_start    = $fail_start;
		$this->fail_rollback = $fail_rollback;
		$this->fail_purge    = $fail_purge;
	}

	public function prepare( $sql, ...$args ) {
		$out = $sql;
		foreach ( $args as $arg ) {
			$value = is_int( $arg ) ? (string) $arg : "'" . addslashes( $arg ) . "'";
			$out   = preg_replace( '/%[ds]/', $value, $out, 1 );
		}
		return $out;
	}

	public function get_results( $sql, $format = null ) {
		return $this->query( $sql );
	}

	/**
	 * Apply one ON DUPLICATE KEY UPDATE to the rows it matched.
	 *
	 * @param array $seeds   Each row as array( key, window_start ).
	 * @param array $guarded Keys whose counter the guard increments.
	 * @param int   $window  Window length in seconds.
	 * @param int   $cutoff  Current time, for the expiry comparison.
	 * @param int   $reset   Window start written when the window has expired.
	 */
	private function apply_upsert( $seeds, $guarded, $window, $cutoff, $reset ) {
		foreach ( $seeds as $seed ) {
			list( $key, $ts ) = $seed;
			if ( ! isset( $this->rows[ $key ] ) ) {
				$this->rows[ $key ] = array( 'hits' => 1, 'window_started' => $ts );
				$this->insert_id    = 1;
				continue;
			}
			// An expired window resets both the count and the window start. The
			// count matters as much as the window: a key that kept incrementing
			// across its reset would stay blocked for ever once it reached its
			// limit, which is why this is evaluated rather than assumed.
			if ( $this->rows[ $key ]['window_started'] + $window < $cutoff ) {
				$this->rows[ $key ] = array( 'hits' => 1, 'window_started' => $reset );
				$this->insert_id    = 1;
				continue;
			}
			// Otherwise only a key the guard names is incremented, and the guard
			// is evaluated per row the way MySQL evaluates it.
			if ( in_array( $key, $guarded, true ) ) {
				$this->rows[ $key ]['hits']++;
				$this->insert_id = $this->rows[ $key ]['hits'];
			}
		}
	}

	public function query( $sql ) {
		$sql = trim( $sql );
		$now = time();

		if ( 'START TRANSACTION' === $sql ) {
			if ( $this->fail_start ) {
				// A failed START leaves no transaction open, so the writes that
				// follow run in autocommit and are committed immediately.
				$this->last_error = 'start failed';
				return false;
			}
			$this->snapshot = $this->rows;
			return 1;
		}
		if ( 'ROLLBACK' === $sql ) {
			if ( $this->fail_rollback ) {
				// There is nothing to undo, so the charges already written stay.
				$this->last_error = 'rollback failed';
				return false;
			}
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

		if ( 0 === strpos( $sql, 'DELETE FROM' ) ) {
			// A purge that cannot run is a storage fault, and only the purge: the
			// counter writes that follow must still be exercised.
			if ( $this->fail_purge ) {
				$this->last_error = 'purge failed';
				return false;
			}
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

		// Both upsert shapes are recognised and both are applied rather than
		// assumed. A stub that incremented every conflicting row would pass the
		// per-IP scenarios even if the documented IF(rate_key = ...) guard named
		// the wrong key, which is the exact bug that guard exists to prevent.
		if (
			preg_match(
				"/^INSERT INTO \\S+ \\(rate_key, hits, window_started\\) VALUES\\s*\\('(.*?)', LAST_INSERT_ID\\(1\\), (\\d+)\\),\\s*\\('(.*?)', LAST_INSERT_ID\\(1\\), (\\d+)\\)\\s*ON DUPLICATE KEY UPDATE\\s*hits = IF\\(\\s*window_started \\+ (\\d+) < (\\d+),\\s*LAST_INSERT_ID\\(1\\),\\s*IF\\(rate_key IN \\('(.*?)', '(.*?)'\\), LAST_INSERT_ID\\(hits \\+ 1\\), hits\\)\\s*\\),\\s*window_started = IF\\(window_started \\+ (\\d+) < (\\d+), (\\d+), window_started\\)$/s",
				$sql,
				$m
			)
		) {
			// The pair writer: two rows, and the guard names the keys that move.
			$this->counter_writes[]     = $sql;
			$this->counter_write_rows   = 2;
			$this->apply_upsert(
				array( array( $m[1], (int) $m[2] ), array( $m[3], (int) $m[4] ) ),
				array( $m[7], $m[8] ),
				(int) $m[5],
				(int) $m[6],
				(int) $m[11]
			);
			return 1;
		}

		// The single-key building block: one row and no guard, so it always
		// increments. It resets an expired window the same way, so copying it
		// cannot introduce a key that stays blocked after its window ends.
		if (
			preg_match(
				"/^INSERT INTO \\S+ \\(rate_key, hits, window_started\\) VALUES\\s*\\('(.*?)', LAST_INSERT_ID\\(1\\), (\\d+)\\)\\s*ON DUPLICATE KEY UPDATE\\s*hits = IF\\(\\s*window_started \\+ (\\d+) < (\\d+),\\s*LAST_INSERT_ID\\(1\\),\\s*LAST_INSERT_ID\\(hits \\+ 1\\)\\s*\\),\\s*window_started = IF\\(window_started \\+ (\\d+) < (\\d+), (\\d+), window_started\\)$/s",
				$sql,
				$m
			)
		) {
			$this->counter_writes[]   = $sql;
			$this->counter_write_rows = 1;
			$this->apply_upsert(
				array( array( $m[1], (int) $m[2] ) ),
				array( $m[1] ),
				(int) $m[3],
				(int) $m[4],
				(int) $m[7]
			);
			return 1;
		}

		// The follow-up count read. A dropped connection is what makes this
		// statement unsafe, so the stub can model one: the handle is replaced with
		// a different object, exactly as wpdb's reconnect does.
		if ( $this->swap_handle_before_select ) {
			$this->dbh                           = 'handle-2';
			$this->swap_handle_before_select     = false;
		}
		if ( preg_match( "/^SELECT rate_key, hits FROM \\S+ WHERE rate_key IN \\('(.*?)', '(.*?)'\\)$/", $sql, $m ) ) {
			$out = array();
			foreach ( array( $m[1], $m[2] ) as $key ) {
				if ( isset( $this->rows[ $key ] ) ) {
					$out[] = array( 'rate_key' => $key, 'hits' => (string) $this->rows[ $key ]['hits'] );
				}
			}
			return $out;
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

	public function error_log_calls() {
		return $GLOBALS['error_log_calls'];
	}
}
`;

const HARNESS_SCENARIOS = `
function scenario( $db, $ip, $email ) {
	$GLOBALS['wpdb']       = $db;
	$_SERVER['REMOTE_ADDR'] = $ip;
	return ls_newsletter_rate_limited( $email );
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
	'verdict'    => scenario( $db, '192.0.2.44', 'gone@example.com' ),
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.44' ) ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'gone@example.com' ) ),
);

// 4. Symmetrically, an IP already over budget charges nothing either.
$db = new Stub_WPDB();
$db->seed( key_for( 'ls_newsletter_ip_', '192.0.2.55' ), 20 );
$out['ip_refusal_is_free'] = array(
	'verdict'    => scenario( $db, '192.0.2.55', 'ipfull@example.com' ),
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.55' ) ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'ipfull@example.com' ) ),
);

// 5. Fail closed: a commit that cannot be confirmed must refuse, and must not
//    leave the increment behind.
$db = new Stub_WPDB( true );
$out['failed_commit_refuses'] = array(
	'verdict' => scenario( $db, '192.0.2.66', 'commit@example.com' ),
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

// 7. A transaction that cannot be opened must charge nothing. Without the
//    START TRANSACTION check the writes below would run in autocommit, be
//    committed immediately, and leave a refused request charged.
$db     = new Stub_WPDB( false, true );
$out['failed_start_refuses'] = array(
	'verdict'    => scenario( $db, '192.0.2.88', 'nostart@example.com' ),
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.88' ) ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'nostart@example.com' ) ),
	'row_count'  => $db->row_count(),
);

// 8. A refused request whose rollback fails is still refused, and the failed
//    discard is recorded rather than swallowed.
$db     = new Stub_WPDB( false, false, true );
$db->seed( key_for( 'ls_newsletter_ip_', '192.0.2.99' ), 19 );
$db->seed( key_for( 'ls_newsletter_email_', 'norollback@example.com' ), 3 );
$out['failed_rollback_still_refuses'] = array(
	'verdict'    => scenario( $db, '192.0.2.99', 'norollback@example.com' ),
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.99' ) ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'norollback@example.com' ) ),

);

// 9. The two counters must be written by ONE statement. wpdb::query() takes no
//    connection handle, so a write cannot be pinned to the transaction's
//    connection; a retried write would commit outside the transaction and
//    survive the ROLLBACK. A single multi-row statement cannot be split, which
//    is the property this design buys instead.
$db     = new Stub_WPDB();
$out['one_statement_writes_both'] = array(
	'verdict'       => scenario( $db, '192.0.2.120', 'pinned@example.com' ),
	'counter_writes' => count( $db->counter_writes ),
	'rows_in_one_statement'  => $db->counter_write_rows,
);

// 11. An expired window must restart the count, not increment it. The purge
//     normally removes the stale row first, so this only matters when the purge
//     has not run for that key: a key that kept incrementing across its reset
//     would stay blocked for ever once it reached its limit.
$db     = new Stub_WPDB();
$db->seed( key_for( 'ls_newsletter_email_', 'stale@example.com' ), 9, 2 * HOUR_IN_SECONDS );
$db->seed( key_for( 'ls_newsletter_ip_', '192.0.2.130' ), 9, 2 * HOUR_IN_SECONDS );
$out['expired_window_restarts'] = array(
	'verdict'    => scenario( $db, '192.0.2.130', 'stale@example.com' ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'stale@example.com' ) ),
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.130' ) ),
);


// 12. A reconnect between the write and the count read must be refused. The
//     read is a second statement, so it can land on a new connection that is not
//     in the transaction and cannot see the uncommitted upsert. Believing those
//     counts would allow a request that was not charged.
$db                                  = new Stub_WPDB();
$db->swap_handle_before_select      = true;
$out['reconnect_mid_transaction_is_refused'] = array(
	'verdict'    => scenario( $db, '192.0.2.140', 'reconnect@example.com' ),
	'handles'    => array( 'before' => 'handle-1', 'after' => $db->dbh ),
	'ip_hits'    => $db->hits( key_for( 'ls_newsletter_ip_', '192.0.2.140' ) ),
	'email_hits' => $db->hits( key_for( 'ls_newsletter_email_', 'reconnect@example.com' ) ),
);


// 10. A purge that cannot run is a storage fault, so the caller must be able to
//    tell it apart from a genuine limit refusal and answer 503 rather than 429.
$db     = new Stub_WPDB( false, false, false, true );
$out['failed_purge_is_a_fault'] = array(
	'verdict' => scenario( $db, '192.0.2.111', 'nopurge@example.com' ),
	'row_count' => $db->row_count(),
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
  // error_log() is a PHP built-in and cannot be shimmed, so in the CLI it writes
  // to stderr. Carry it through so the failure path can assert the report
  // happened rather than assuming it did.
  return { ...JSON.parse(json), stderr: result.stderr };
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

    test('charges both keys in one call and compares each against its own limit', () => {
      const functions = rateLimitFunctions();
      // The tighter address key must be bound before the looser IP key, and both
      // limits must be the pair call's own arguments rather than a second call.
      const call = functions.match(/ls_newsletter_bump_pair\([\s\S]*?\);/);
      expect(call).not.toBeNull();
      const [body] = call;
      expect(body.indexOf('email_')).toBeGreaterThan(-1);
      expect(body.indexOf('email_')).toBeLessThan(body.indexOf('ip_'));
      // A second bump would reintroduce the split write, so the caller must not
      // contain one. The scope is the caller: the single-key builder is still
      // defined below as the documented building block, and its definition is not
      // a call.
      const caller = functions.slice(0, functions.indexOf('function ls_newsletter_bump('));
      expect(caller).not.toMatch(/ls_newsletter_bump\(/);
      // A fault must outrank a spent budget, so the comparison is explicit.
      expect(functions).toMatch(
        /\$hits\[ \$first_key \] > \$first_max \|\| \$hits\[ \$second_key \] > \$second_max/
      );
    });

    test('discards both counters together when the request is refused', () => {
      const functions = rateLimitFunctions();
      expect(functions).toContain("$wpdb->query( 'START TRANSACTION' )");
      // The rollback must be checked, not merely issued, and an explanatory
      // comment may sit between the branch and the call.
      expect(functions).toMatch(
        /'allowed' !== \$verdict \) \{[\s\S]{0,400}?false === \$wpdb->query\( 'ROLLBACK' \)/
      );
      expect(functions).toContain("$wpdb->query( 'COMMIT' )");
    });

    test('refuses rather than guessing when the commit cannot be confirmed', () => {
      const functions = rateLimitFunctions();
      expect(functions).toMatch(
        /false === \$wpdb->query\( 'COMMIT' \) \) \{\s*\n\t\treturn 'unavailable';/
      );
    });

    test('separates a storage fault from a spent budget in the HTTP status', () => {
      // The whole point of the verdict string: a counter fault must not answer
      // 429, because Retry-After would tell a client to stop retrying for an hour
      // over a transient database error, and would tell the visitor they had
      // submitted too often when they had not. The dispatch lives in the
      // subscriber, which is past the block this helper slices, so read the
      // whole PHP fence here.
      const functions = phpFence();
      // Retry-After must be set on the response, not inside the WP_Error data:
      // WordPress serialises the WP_Error data into the JSON body and never
      // derives a header from it, so the documented 429 would carry no
      // Retry-After at all. The body has to come from WordPress's own
      // conversion, and that happens only when the response *is* the error
      // object. Storing a WP_Error as response data instead serialises its
      // {errors, error_data} properties rather than {code, message, data}, so
      // set_data() is a near-miss this rejects. rest_ensure_response() is the
      // other: it returns a WP_Error unchanged, so header() on its result would
      // fail to send. rest_convert_error_to_response() does the conversion and
      // returns a real response, which is what makes the header settable.
      expect(functions).toMatch(
        /if \( 'limited' === \$verdict \)[\s\S]{0,1200}?\$response = rest_convert_error_to_response\(/
      );
      expect(functions).toMatch(/\$response->set_status\( 429 \);/);
      expect(functions).toMatch(
        /\$response->header\( 'Retry-After', \(string\) HOUR_IN_SECONDS \)/
      );
      expect(functions).not.toMatch(/'Retry-After' => HOUR_IN_SECONDS/);
      // Both of the near-misses: a WP_Error stored as data, and the function
      // that returns one unchanged so no header can be set on it.
      expect(functions.replace(/\/\/[^\n]*/g, '')).not.toMatch(/set_data\(/);
      expect(functions.replace(/\/\/[^\n]*/g, '')).not.toMatch(/rest_ensure_response\(/);
      expect(functions.replace(/\/\/[^\n]*/g, '')).not.toMatch(/new WP_REST_Response\(/);
      expect(functions).toMatch(
        /if \( 'unavailable' === \$verdict \)[\s\S]{0,900}?'subscribe_unavailable'[\s\S]{0,400}?'status' => 503/
      );
      // A fault outranks a limit, so it is never answered as 429.
      expect(functions).not.toMatch(/'unavailable'[\s\S]{0,120}'Retry-After'/);
      // Every failure path has to name the fault rather than defaulting to true.
      expect(functions).not.toMatch(/\n\t\treturn true;/);
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

    test('does not blame the address field for a 429 that may be the IP limit', () => {
      // The limiter checks a per-address and a shared per-IP counter, and the
      // 429 response does not identify which fired. A shared NAT can exhaust
      // the IP limit while the submitted address is still under its own, so the
      // message must not attribute it to the field the visitor filled in.
      expect(advisory).toContain("showError('Too many attempts. Please try again later.')");
      expect(advisory).not.toContain('Too many attempts from this address');
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
      expect(scenario.decisions).toEqual(['allowed', 'allowed', 'allowed', 'limited']);
      // The defect: the refusal used to leave ip_hits at 4.
      expect(scenario.ip_hits).toBe(3);
      expect(scenario.email_hits).toBe(3);
    });

    test('legitimate traffic still spends the IP budget', () => {
      const { decisions, ip_hits } = runScenarios().distinct_addresses;
      expect(decisions.filter((d) => d === 'allowed')).toHaveLength(20);
      expect(decisions[20]).toBe('limited');
      expect(ip_hits).toBe(20);
    });

    test('an address over budget leaves both counters untouched', () => {
      const result = runScenarios().address_refusal_is_free;
      expect(result.verdict).toBe('limited');
      expect(result.ip_hits).toBe(19);
      expect(result.email_hits).toBe(3);
    });

    test('an IP over budget leaves both counters untouched', () => {
      const result = runScenarios().ip_refusal_is_free;
      expect(result.verdict).toBe('limited');
      expect(result.ip_hits).toBe(20);
      expect(result.email_hits).toBe(0);
    });

    test('refuses and rolls back when the commit cannot be confirmed', () => {
      const result = runScenarios().failed_commit_refuses;
      expect(result.verdict).toBe('unavailable');
      expect(result.ip_hits).toBe(0);
    });

    test('reports unavailable, not limited, when the transaction cannot be opened', () => {
      // A refused request spending no budget is only true if START TRANSACTION
      // succeeded. Left unchecked, the two writes run in autocommit, commit
      // immediately, and the refusal is charged anyway.
      const result = runScenarios().failed_start_refuses;
      expect(result.verdict).toBe('unavailable');
      expect(result.ip_hits).toBe(0);
      expect(result.email_hits).toBe(0);
      expect(result.row_count).toBe(0);
    });

    test('still reports limited and records when the rollback of a refusal fails', () => {
      // stderr is a sibling of the scenario keys, not one of them.
      const { stderr, ...scenarios } = runScenarios();
      const result = scenarios.failed_rollback_still_refuses;
      expect(result.verdict).toBe('limited');
      // Both counters were charged by the one statement and the discard failed,
      // so the refusal is charged after all. The IP counter moved from 19 to 20
      // because the pair write charges both keys together, and a 20-hit request
      // is the last one the limit allows; the address is over its limit of 3 at
      // 4, which is what refuses it. This is the documented database-fault case,
      // reported rather than swallowed, not a silent success.
      expect(result.email_hits).toBe(4);
      expect(result.ip_hits).toBe(20);
      expect(stderr).toContain('rollback failed');
    });

    test('reports a failed purge as a fault, not as a spent budget', () => {
      // The distinction decides 503 against 429, so it needs its own check: a
      // regression that returned 'limited' here would tell a client to stop
      // retrying for an hour over a transient database error.
      const result = runScenarios().failed_purge_is_a_fault;
      expect(result.verdict).toBe('unavailable');
      // The purge runs before the transaction, so a failure must not have
      // written anything.
      expect(result.row_count).toBe(0);
    });

    test('refuses when the connection was replaced before the count read', () => {
      // The count read is a second statement, so a reconnect puts it on a
      // connection that is not in the transaction and cannot see the
      // uncommitted upsert. Reading those counts anyway would allow a request
      // that was never charged, which is the worse of the two failure modes, so
      // a changed handle is a fault rather than an answer.
      const result = runScenarios().reconnect_mid_transaction_is_refused;
      expect(result.handles.before).toBe('handle-1');
      expect(result.handles.after).toBe('handle-2');
      expect(result.verdict).toBe('unavailable');
    });

    test('an expired window restarts the count instead of incrementing it', () => {
      // The purge normally removes the stale row, so this path only runs when the
      // purge has not reached the key. A count that carried across the reset
      // would keep a key blocked for ever after it reached its limit, so the
      // first request in a new window has to start from one.
      const result = runScenarios().expired_window_restarts;
      // Nine hits would have been over the address limit of three, so only the
      // reset explains the verdict.
      expect(result.verdict).toBe('allowed');
      expect(result.email_hits).toBe(1);
      expect(result.ip_hits).toBe(1);
    });

    test('writes both counters in one statement, so a replay cannot split them', () => {
      // wpdb::query() takes no connection handle, so a write cannot be pinned to
      // the transaction's connection: a dropped connection makes WordPress replay
      // the query on a new one, where it commits on its own and a later ROLLBACK
      // has nothing to undo. One multi-row statement cannot be split, which is
      // the guarantee this relies on. Needs the stub, so it belongs here rather
      // than with the assertions that must run without PHP.
      const result = runScenarios().one_statement_writes_both;
      expect(result.verdict).toBe('allowed');
      // One statement, not one per key.
      expect(result.counter_writes).toBe(1);
      // Both keys in that statement. Counting the value tuples rather than
      // LAST_INSERT_ID() calls, because the reset branch names it too and would
      // inflate the count to three.
      expect(result.rows_in_one_statement).toBe(2);
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
