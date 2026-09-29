# Plugin Advisories: Native Replacements, Gravity Forms Usage and Hosting-Stack Guidance

- **Review owner:** LightSpeed Team
- **Last reviewed:** 2026-09-25
- **Status:** active
- **Companion issue:** [#1396](https://github.com/lightspeedwp/.github/issues/1396)

This document is the single versioned home for plugin advisories. Every
advisory names its replacement or its alternative, never only the
restriction. The canonical list of what may be installed is the companion
[Approved Plugin Register](PLUGIN_REGISTER.md); anything not on that list
is not approved.

Generated projects use these implementation sources; retired starter
repositories are not authoritative:

| Generated artefact | Implementation source                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Plugin             | [`lightspeedwp/block-plugin-scaffold`](https://github.com/lightspeedwp/block-plugin-scaffold) `develop` |
| Theme              | [`lightspeedwp/block-theme-scaffold`](https://github.com/lightspeedwp/block-theme-scaffold) `develop`   |

Status legend used below:

- **available** — present in WordPress core or in the current `develop` branch
  of a generator, with a direct source link.
- **planned** — not implemented yet, with a tracking issue in the generator
  repository that will own the implementation.
- **conditional** — permitted only after project-specific approval; the
  advisory does not grant that approval.

Verify the current generator branch before changing a status. An example,
instruction or issue in a generator is not evidence that the feature ships.

## 1. Replaced natively in generated projects

| Plugin | Native replacement | Status | Notes |
| --- | --- | --- | --- |
| Safe SVG                                   | Capability-gated `upload_mimes` plus `enshrined/svg-sanitize` on upload                                                     | planned ([block-plugin-scaffold#37](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37))                                                       | SVG is executable markup. The MIME filter alone is not a replacement: sanitise the uploaded file server-side and allow SVG only for roles with the required upload capability.                      |
| WP Mail SMTP, Change Mail Sender           | Configured `PHPMailer` transport and sender values from deployment secrets, plus sender fields in generated plugin settings | planned ([block-plugin-scaffold#37](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37))                                                       | `phpmailer_init` fires after core sets defaults. Configure transport and sender values there, keep credentials outside the database, and test password-reset and admin mail in production mode.     |
| Cachebuster                                | WordPress build-manifest version from `*.asset.php`                                                                         | available ([block-theme-scaffold `functions.php`](https://github.com/lightspeedwp/block-theme-scaffold/blob/develop/functions.php))                         | The generated theme uses the build asset's version and falls back to the theme version. Do not use `filemtime()` as proof of freshness: timestamps can remain unchanged when content changes.       |
| Disable Emails                             | `pre_wp_mail` short-circuit driven by `wp_get_environment_type()`                                                           | planned ([block-plugin-scaffold#37](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37))                                                       | Return a non-null value only outside production. The default must remain production so a missing or unrecognised environment never suppresses live transactional mail.                              |
| View Transitions                           | Native CSS `@view-transition` with an identical no-animation fallback                                                       | planned ([block-theme-scaffold#9](https://github.com/lightspeedwp/block-theme-scaffold/issues/9))                                                           | Treat cross-document transitions as progressive enhancement, respect reduced-motion preferences and verify support for the project's browser matrix before relying on them.                         |
| Carousel Slider Block                      | CSS scroll-snap with core Group and Columns blocks                                                                          | planned ([block-theme-scaffold#9](https://github.com/lightspeedwp/block-theme-scaffold/issues/9))                                                           | Use native scrolling and keyboard-operable controls. Do not add autoplay or JavaScript unless a documented project requirement needs them.                                                          |
| GTM4WP, Google Site Kit                    | Container snippet and vendor-neutral `dataLayer` events in the generated plugin                                             | planned ([block-plugin-scaffold#37](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37))                                                       | Initialise `window.dataLayer` before the container and push named events from generated code. Keep vendor tags and triggers in the container so changing providers does not require theme rewrites. |
| WPFront Scroll Top                         | Generated `ScrollToTop` component                                                                                           | available ([block-plugin-scaffold component](https://github.com/lightspeedwp/block-plugin-scaffold/blob/develop/src/components/ScrollToTop/ScrollToTop.js)) | The component is exported but not automatically placed by every generated site. Verify keyboard behaviour, touch-target size and reduced-motion handling when integrating it.                       |
| Disable Comments RB                        | WordPress core discussion settings                                                                                          | available ([WordPress core](https://wordpress.org/documentation/article/settings-discussion-screen/))                                                       | Settings → Discussion can disable comments and pings globally and per post type. A plugin only adds another settings surface that can drift from core.                                              |
| User Menus, Visibility Logic for Elementor | Block-theme templates, template parts and navigation                                                                        | planned ([block-theme-scaffold#9](https://github.com/lightspeedwp/block-theme-scaffold/issues/9))                                                           | Keep conditional presentation in version-controlled theme structures. Do not carry Elementor-specific visibility metadata into a generated block theme.                                             |
| Social Sharing Block                       | Pattern with plain share URLs and no third-party JavaScript                                                                 | planned ([block-theme-scaffold#9](https://github.com/lightspeedwp/block-theme-scaffold/issues/9))                                                           | Share intents can be ordinary links. Third-party share scripts add tracking, payload and consent work without helping the basic action.                                                             |
| JWT Authentication for WP-API              | WordPress core Application Passwords                                                                                        | available ([WordPress core](https://developer.wordpress.org/advanced-administration/security/application-passwords/))                                       | Use HTTPS and individually issued, revocable credentials. Do not add a second token and secret lifecycle when core credentials meet the requirement.                                                |
| Yoast Duplicate Post                       | Capability-checked row action plus a reviewed `wp_insert_post()` clone                                                      | planned ([block-plugin-scaffold#37](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37))                                                       | Copy only supported post fields, taxonomies and meta. Scheduling and bulk duplication remain out of scope until a project explicitly requires them.                                                 |

## 2. Gravity Forms usage advisory

**Reason:** Gravity Forms is a full form framework: conditional logic, multi-page state, file handling and its theme CSS/JS ship on every page that renders a form. That payload is proportionate for enquiry, application, quote and upload forms. It is disproportionate when a newsletter form or pop-up loads the framework on every page, increasing transfer and execution cost and potentially degrading Core Web Vitals. Gravity Forms' own documentation provides `gform_disable_css` but warns that disabling it breaks conditional logic, honeypot hiding and multi-page forms — evidence the payload is structural, not optional.

**Rule:**

- Gravity Forms is the approved platform for enquiry, application, quote and upload forms.
- It must not be used for elements rendered site-wide, newsletter sign-ups, or pop-ups.

**Required alternatives (reference implementations, not just prohibitions):**

### Newsletter sign-up: plain form posting to a REST route

```html
<form id="newsletter-signup" method="post" action="/wp-json/ls/v1/newsletter">
  <label for="newsletter-email">Email address</label>
  <input id="newsletter-email" name="email" type="email" required autocomplete="email" />
  <button type="submit">Subscribe</button>
  <p data-newsletter-error role="alert" hidden></p>
</form>
<script>
  document.getElementById('newsletter-signup').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const showError = (message) => {
      const slot = form.querySelector('[data-newsletter-error]');
      if (slot) {
        slot.hidden = false;
        slot.textContent = message;
      }
    };

    let response;
    try {
      response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.elements.email.value }),
      });
    } catch (networkError) {
      showError('Could not reach the server. Please try again.');
      return;
    }

    if (response.ok) {
      form.outerHTML = '<p role="status">Subscribed. Please check your inbox.</p>';
      return;
    }

    // Leave the form in place on failure so the address survives and the
    // visitor can correct it and resubmit. The route answers 429 when the
    // limit is hit and 502 when the provider fails, and those need different
    // advice: telling someone to check an already-valid address while they
    // are blocked only invites a retry that will be refused again.
    if (response.status === 429) {
      // The limiter checks a per-address and a shared per-IP counter, and the
      // response does not say which one fired. A shared NAT can exhaust the IP
      // limit while the address typed here is still under its own, so do not
      // blame the field the visitor just filled in.
      showError('Too many attempts. Please try again later.');
      return;
    }
    if (response.status === 400 || response.status === 422) {
      showError('That email address was not accepted. Please check it and try again.');
      return;
    }
    showError('Subscription failed on our side. Please try again later.');
  });
</script>
```

```php
add_action( 'rest_api_init', function () {
	register_rest_route( 'ls/v1', '/newsletter', array(
		'methods'             => 'POST',
		'callback'            => 'ls_newsletter_subscribe',
		'permission_callback' => '__return_true',
		'args'                => array(
			'email' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_email',
				'validate_callback' => 'is_email',
			),
		),
	) );
} );

/**
 * Charge this request against the per-address and per-IP budgets.
 *
 * The return value distinguishes *why* a request did not proceed, because the
 * two cases need different answers from the caller and are not interchangeable:
 * a real limit is the visitor's own doing and Retry-After helps them, whereas a
 * storage or transaction fault is ours, carries no useful Retry-After, and
 * answering 429 tells clients to stop retrying for an hour over a transient
 * database error. A single boolean could not express that, and collapsing both
 * into one is what made a counter fault look like a rate limit.
 *
 * @return string 'allowed', 'limited' when a budget is genuinely exhausted, or
 *                'unavailable' when the counters could not be read or written.
 */
function ls_newsletter_rate_limited( $email ) {
	global $wpdb;

	$ip = isset( $_SERVER['REMOTE_ADDR'] )
		? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) )
		: 'unknown';

	if ( ! ls_newsletter_purge() ) {
		return 'unavailable';
	}

	// Both counters live in one table and are charged by a single statement, so
	// both hits are recorded before the decision and both are discarded together
	// if the answer is to refuse. The ROLLBACK is what makes the discard: without
	// it, a visitor behind a shared NAT address can drain the IP budget that
	// everyone behind them shares, by resubmitting an address that is already
	// blocked for them. The transaction also makes the discard atomic, so no
	// other request can observe a charge for a request that was refused.
	//
	// Charging both and then rolling back is deliberate rather than wasteful. A
	// request refused for the address limit does spend an increment on the shared
	// address for the length of the transaction, and only if that transaction
	// commits would it count; since the refusal path always rolls back, it never
	// does. Deciding first and writing only on success would need a second
	// statement to check the counters, which is the split write this design
	// exists to avoid.
	//
	// Every transaction-control result is checked, because the "a refused
	// request spends no budget" guarantee is only as good as the weakest of
	// them. An unchecked START TRANSACTION that failed leaves the writes to run
	// in autocommit, where they are already committed by the time ROLLBACK is
	// reached and cannot undo them.
	//
	// $wpdb->query() is not safe for this on its own. WordPress reconnects and
	// retries an individual query when the connection has gone, so a write issued
	// after a dropped connection can run on a *new* connection that is not in the
	// transaction, commit on its own, and leave a later ROLLBACK with nothing to
	// undo. wpdb::query() takes no connection handle, so there is no argument that
	// pins a write to the transaction's connection: the pair below is therefore
	// written as ONE multi-row statement, which InnoDB executes as a unit on a
	// single connection and which the retry path can therefore not split. The
	// atomicity this relies on is the same property the single-row upsert below
	// already depends on.
	if ( false === $wpdb->query( 'START TRANSACTION' ) ) {
		// The counters cannot be updated safely, so charge nothing at all
		// rather than write outside a transaction we do not have.
		return 'unavailable';
	}

	// Both counters are charged before the verdict is known, so each is compared
	// explicitly rather than treated as a boolean: a truthy 'unavailable' from
	// the first bump must not be mistaken for a spent budget, and a spent budget
	// must not be masked by a later fault. A fault outranks a limit, because it
	// is the one the visitor cannot wait out.
	$verdict = ls_newsletter_bump_pair(
		ls_newsletter_key( 'ls_newsletter_email_', strtolower( $email ) ),
		3,
		ls_newsletter_key( 'ls_newsletter_ip_', $ip ),
		20
	);

	if ( 'allowed' !== $verdict ) {
		// A failed rollback is a database fault to alert on rather than something
		// to retry, so it is recorded. It does not change the verdict: a request
		// that was over budget still answers 429, and a request whose counters
		// could not be read still answers 503.
		if ( false === $wpdb->query( 'ROLLBACK' ) ) {
			error_log( 'newsletter rate limit: rollback failed, counters may be charged' );
		}
		return $verdict;
	}

	// A commit that cannot be confirmed leaves the counters in an unknown
	// state. Continuing would let them drift, so refuse rather than guess.
	if ( false === $wpdb->query( 'COMMIT' ) ) {
		return 'unavailable';
	}

	return 'allowed';
}

function ls_newsletter_key( $prefix, $value ) {
	return $prefix . wp_hash( $value, 'auth' );
}

/**
 * Delete counters whose window has closed.
 *
 * Without this the table grows by a row per distinct address forever: the
 * per-IP limit slows that down but does not bound it, because each new address
 * still creates a fresh key. Purging here keeps the table to one window. The
 * cutoff is compared directly against the indexed column rather than adding an
 * interval to it, so the window_started index serves this as a range scan.
 *
 * @return bool False when the purge could not be completed.
 */
function ls_newsletter_purge() {
	global $wpdb;

	$table = $wpdb->prefix . 'ls_rate_limits';

	return false !== $wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$table} WHERE window_started <= %d",
			time() - HOUR_IN_SECONDS
		)
	);
}

/**
 * Atomically count one hit against a key and report whether it is over budget.
 *
 * A get_transient()/set_transient() pair is a read-modify-write, so two
 * concurrent submissions can read the same count, both write count + 1, and
 * the limit is silently bypassed. The increment and the read of the resulting
 * value happen in a single statement instead, so no increment is lost.
 *
 * The increment is committed by this call, so a true return leaves the hit on
 * disk unless the caller discards it. ls_newsletter_rate_limited() does not call
 * this function: it charges both keys with ls_newsletter_bump_pair(), because
 * one statement cannot be split by a reconnect while two can. This function
 * remains the single-key building block that pair writer documents, and a caller
 * that uses it on its own must wrap it in a transaction and roll back the hit,
 * or a refused request will still have spent budget.
 *
 * @return string 'allowed', 'limited' when the count is now over the limit, or
 *                'unavailable' when the counter could not be read at all.
 */
function ls_newsletter_bump( $key, $max ) {
	global $wpdb;

	$table = $wpdb->prefix . 'ls_rate_limits';
	$now   = time();

	// LAST_INSERT_ID() carries the new counter out of the same atomic statement
	// that performed the increment, so the number compared against $max is this
	// request's own count rather than whatever a later reader would observe.
	//
	// An expired window resets the count rather than incrementing it, so this
	// function is correct on its own and does not depend on ls_newsletter_purge()
	// having run first. The purge is an optimisation that bounds the table; the
	// reset is the correctness guarantee.
	$done = $wpdb->query(
		$wpdb->prepare(
			"INSERT INTO {$table} (rate_key, hits, window_started) VALUES (%s, LAST_INSERT_ID(1), %d)
			 ON DUPLICATE KEY UPDATE
			 hits = IF(
				window_started + %d < %d,
				LAST_INSERT_ID(1),
				LAST_INSERT_ID(hits + 1)
			 ),
			 window_started = IF(window_started + %d < %d, %d, window_started)",
			$key,
			$now,
			HOUR_IN_SECONDS,
			$now,
			HOUR_IN_SECONDS,
			$now,
			$now
		)
	);

	if ( false === $done ) {
		// The counter could not be read. Treating that as remaining capacity
		// would fail open and hand the caller an unlimited budget, so refuse.
		// 'unavailable' rather than 'limited': the budget may well have room, the
		// database is what failed, so the caller must not blame the visitor.
		return 'unavailable';
	}

	// Strictly greater: the request that reaches the configured maximum is
	// still allowed, and the one after it is refused.
	return (int) $wpdb->insert_id > $max ? 'limited' : 'allowed';
}

/**
 * Charge one hit against two keys at once and report the worse verdict.
 *
 * Two separate queries would each be a candidate for wpdb's reconnect-and-retry
 * path, and a retried write lands on a connection that is not in the
 * transaction, so a later ROLLBACK cannot undo it. One statement is executed as a
 * unit on a single connection, so the two counters are always consistent with
 * each other and with the transaction.
 *
 * @param {string} $first_key - Hashed key for the tighter limit.
 * @param {int} $first_max - Limit for the tighter key.
 * @param {string} $second_key - Hashed key for the looser limit.
 * @param {int} $second_max - Limit for the looser key.
 * @return string 'allowed', 'limited', or 'unavailable'. A fault on either key
 *   outranks a spent budget, because it is the one the visitor cannot wait out.
 */
function ls_newsletter_bump_pair( $first_key, $first_max, $second_key, $second_max ) {
	global $wpdb;

	$table = $wpdb->prefix . 'ls_rate_limits';
	$now   = time();

	// The handle this function's statements run on, captured before the write.
	$handle = $wpdb->dbh;

	// Both rows are matched by the primary key, so the update expression is
	// applied to each conflicting row in turn. It therefore has to name both
	// keys: an equality test against one of them would increment that key on
	// every request and leave the other frozen at its first hit, which would
	// make the looser IP limit unenforceable from the second request onwards.
	//
	// An expired window resets the count to 1 rather than incrementing it. The
	// purge is what normally expires a window, and if it has not run for a key
	// that still exists, incrementing the stale count would keep a blocked key
	// blocked for ever once its limit was reached. LAST_INSERT_ID() is set on
	// both branches so the value carried out is the one that was written.
	$done = $wpdb->query(
		$wpdb->prepare(
			"INSERT INTO {$table} (rate_key, hits, window_started) VALUES
				(%s, LAST_INSERT_ID(1), %d),
				(%s, LAST_INSERT_ID(1), %d)
			 ON DUPLICATE KEY UPDATE
			 hits = IF(
				window_started + %d < %d,
				LAST_INSERT_ID(1),
				IF(rate_key IN (%s, %s), LAST_INSERT_ID(hits + 1), hits)
			 ),
			 window_started = IF(window_started + %d < %d, %d, window_started)",
			$first_key,
			$now,
			$second_key,
			$now,
			HOUR_IN_SECONDS,
			$now,
			$first_key,
			$second_key,
			HOUR_IN_SECONDS,
			$now,
			$now
		)
	);

	if ( false === $done ) {
		return 'unavailable';
	}

	// The count read cannot be folded into the write, so it is a second
	// statement and inherits the same hazard. wpdb reconnects and retries a
	// statement whose handle has gone, and the new connection is not in the
	// transaction: it cannot see the uncommitted upsert, so the counts come back
	// stale or missing, and the caller's later COMMIT succeeds with nothing to
	// commit. That is a request allowed but not charged, which is the worse
	// failure of the two.
	//
	// There is no way to bind a statement to a connection through wpdb, so the
	// handle is compared instead. $wpdb->dbh is the live handle object, so
	// identity is the test rather than its string value.
	$counts = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT rate_key, hits FROM {$table} WHERE rate_key IN (%s, %s)",
			$first_key,
			$second_key
		),
		ARRAY_A
	);
	// Checked after the read, because that is when a reconnect can have happened:
	// the replacement may occur during the write or during this query, and only
	// the handle afterwards tells which. A changed handle means these counts were
	// read on a connection outside the transaction, so they describe neither this
	// request's charge nor anything the caller's rollback could undo.
	if ( $handle !== $wpdb->dbh || ! is_array( $counts ) ) {
		return 'unavailable';
	}

	$hits = array();
	foreach ( $counts as $row ) {
		$hits[ $row['rate_key'] ] = (int) $row['hits'];
	}
	// A key that is absent was not written, so its count is unknown rather than
	// zero; treating it as zero would report capacity that may not exist.
	if ( ! isset( $hits[ $first_key ] ) || ! isset( $hits[ $second_key ] ) ) {
		return 'unavailable';
	}

	if ( $hits[ $first_key ] > $first_max || $hits[ $second_key ] > $second_max ) {
		return 'limited';
	}
	return 'allowed';
}

function ls_newsletter_subscribe( WP_REST_Request $request ) {
	$email = sanitize_email( $request['email'] );
	$verdict = ls_newsletter_rate_limited( $email );

	if ( 'limited' === $verdict ) {
		// Retry-After has to be a real response header, not a field in the
		// WP_Error data. WordPress puts that data in the JSON body and does not
		// derive a header from it, so a client that obeys Retry-After would never
		// see one and a well-behaved client would keep retrying straight away.
		// rest_convert_error_to_response() is the function that performs
		// WordPress's own error conversion, so the body is the standard
		// {code, message, data} shape a REST client expects rather than the
		// {errors, error_data} a raw WP_Error serialises to. It is used instead of
		// rest_ensure_response(), which hands a WP_Error back unchanged and would
		// leave nothing to set a header on.
		$response = rest_convert_error_to_response(
			new WP_Error(
				'subscribe_rate_limited',
				'Subscription rate limit exceeded.',
				array( 'status' => 429 )
			)
		);
		$response->set_status( 429 );
		$response->header( 'Retry-After', (string) HOUR_IN_SECONDS );
		return $response;
	}

	if ( 'unavailable' === $verdict ) {
		// 503, not 429: no Retry-After is set because the window is unknown,
		// and a client obeying a 429 would back off for an hour over what is
		// most likely a transient database fault. Fail closed either way -- the
		// request is not performed -- but say plainly that the service is at
		// fault rather than the visitor.
		return new WP_Error(
			'subscribe_unavailable',
			'Subscription is temporarily unavailable. Please try again shortly.',
			array( 'status' => 503 )
		);
	}

	$response = wp_remote_post(
		'https://provider.example/api/subscribe',
		array(
			'timeout' => 10,
			'headers' => array(
				'Authorization' => 'Bearer ' . PROVIDER_API_KEY,
			),
			'body'    => array( 'email' => $email ),
		)
	);
	if ( is_wp_error( $response ) ) {
		return new WP_Error( 'subscribe_failed', 'Subscription failed.', array( 'status' => 502 ) );
	}
	$status_code = (int) wp_remote_retrieve_response_code( $response );
	if ( $status_code < 200 || $status_code >= 300 ) {
		return new WP_Error( 'subscribe_failed', 'Subscription failed.', array( 'status' => 502 ) );
	}
	return array( 'subscribed' => true );
}
```

The counter needs a table, created once with `dbDelta()`:

```sql
CREATE TABLE {$wpdb->prefix}ls_rate_limits (
  rate_key       VARCHAR(64) NOT NULL,
  hits           INT UNSIGNED NOT NULL DEFAULT 0,
  window_started BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (rate_key),
  KEY window_started (window_started)
) ENGINE=InnoDB;
```

`ENGINE=InnoDB` is load-bearing, not decoration. `ls_newsletter_rate_limited()`
discards a refused request's counter writes with `ROLLBACK`, and only InnoDB
honours that. On MyISAM the statements succeed, the rollback is a no-op, and
the counters behave exactly as the transactional version was written to prevent.
Older MySQL defaults and some hosts still create tables as MyISAM, so state the
engine rather than trusting the server default.

Rows are purged on each request once their hour is up, so the table holds at most one window of counters rather than growing with every distinct address.

The example allows 20 requests per IP and three per email address per hour,
storing only WordPress hashes of those values. A refused request is charged to
neither counter, so the per-IP limit does not throttle a caller who keeps
resubmitting an address that is already blocked: those requests are answered
with 429 before the provider is called, so they stay cheap, but they are not
counted. Sites that need volume-based throttling of that traffic should enforce
it in front of WordPress, at the reverse proxy or WAF, where it also covers
requests that never reach PHP. Tune both limits to the provider's
contract, use a shared rate-limit service when traffic spans multiple application
servers, and keep the provider secret in a constant rather than the database.
Return `role="status"` / `role="alert"` regions so assistive technology announces
the outcome.

### Pop-up: `<dialog>` with minimal JS

```html
<button id="site-popup-trigger" type="button">Open offer</button>
<dialog id="site-popup" aria-labelledby="site-popup-title">
  <h2 id="site-popup-title">Special offer</h2>
  <p>Offer copy goes here.</p>
  <form method="dialog">
    <button type="submit">Close</button>
  </form>
</dialog>
<script>
  const popup = document.getElementById('site-popup');
  document.getElementById('site-popup-trigger').addEventListener('click', () => {
    if (typeof popup.showModal === 'function') {
      popup.showModal();
    }
  });
</script>
```

`<dialog>.showModal()` is Baseline widely available (all browsers since March
2022): the browser provides the top layer, `::backdrop`, focus handling and
Escape-to-close with implicit `aria-modal="true"`. No library, no extra
payload, and an explicit close control satisfies the most robust dismissal
pattern.

## 3. Do not replace natively

These stay as plugins, with reasons:

- **Gravity Forms itself** — approved form platform per section 2; its entry handling, notifications, feeds and add-on ecosystem are not sensibly reimplemented.
- **Wordfence** — endpoint firewall, malware scanning and login hardening are a security product, not theme logic; incident response depends on its telemetry.
- **User Switching** — capability-checked user impersonation for support; reimplementing session handling is a security risk with no upside.
- **Yoast SEO** — schema output, sitemaps, redirects UI and content analysis are a maintained product surface; partial reimplementation drifts from SEO best practice silently.
- **Concrete payment gateway plugins** — money movement requires PCI-aware, vendor-maintained integrations, so gateways stay plugins rather than theme code. No concrete gateway is globally approved: require an exact plugin/version allowlist and project approval before installation. WooCommerce core does not process payments.
- **WooCommerce Subscriptions** — recurring billing, proration, dunning and gateway token management are commerce-critical logic no theme should own.
- **FacetWP** — indexed faceted search over large catalogues is a performance specialty; naive `WP_Query` faceting does not scale.
- **SearchWP** — relevance-ranked search with custom sources and stemming; core search has no ranking model.
- **Sequential Order Numbers** — order-number sequencing touches invoicing and accounting compliance; a maintained plugin owns the edge cases.

## 4. Hosting-stack advisories

**Reason:** the LightSpeed fleet already caches at two layers (nginx FastCGI page cache at origin, Cloudflare edge cache including APO HTML caching), purges both on content change, and runs CI. Each advisory below exists because a third tool would duplicate a layer the fleet already owns, move a check later than CI, or split ownership of a single event.

- **WP Rocket:** the fleet already runs nginx FastCGI page caching and Cloudflare edge caching, so a third page-cache layer is redundant and a stale-content risk (three invalidation paths instead of one). Approve for asset optimisation only — or not at all — on LightSpeed hosting. Gravity Forms' own cache FAQ independently warns that page caching serves stale output to dynamic, conditional and AJAX-driven forms.
- **Accessibility Checker:** run accessibility checks in CI (axe-core via `axe-core` npm package or pa11y-ci in a GitHub Action, gating on serious/critical violations) rather than as a production plugin. Production checkers add runtime weight to every page view and report after users are already affected; CI reports before merge. Automated engines catch roughly half of WCAG issues — pair with periodic human audit, not with a production plugin.
- **Redirection:** prefer fleet-managed nginx rules for migrations, bulk URL changes and other high-volume redirects because they are deterministic and part of the deployment path. Use the Redirection plugin only when editors need to manage a bounded set of day-to-day rules themselves; record the owner and review process.
- **Analytics:** one tool owns each event. No duplicate purchase, checkout or form events across Site Kit, GTM, WooCommerce Google Analytics Pro and the Gravity Forms add-on. Duplicate ownership double-counts conversions and makes every report untrustworthy; map event ownership explicitly (which tool fires `purchase`, which fires `form_submit`) during analytics setup and audit it when adding tools.

## References

- WordPress Developer Resources: `upload_mimes`, `phpmailer_init`, `pre_wp_mail`, `wp_get_environment_type`, Application Passwords, REST API authentication.
- johnbillion/wp_mail: catalogue of every core email and its disable path.
- MDN: `@view-transition` (limited availability), CSS Scroll Snap (Baseline), `<dialog>` / `showModal()` (Baseline since March 2022).
- Google Tag Platform docs: data layer initialisation and `dataLayer.push({ event })` model.
- dequelabs/axe-core, pa11y/pa11y-ci: CI accessibility scanning.
- Gravity Forms docs: `gform_disable_css` (with accessibility caveats), cache and script-optimiser FAQ.
- Cloudflare APO docs, nginx FastCGI caching guidance.
- `enshrined/svg-sanitize` (composer library; sanitizer behind Safe SVG and TYPO3 core).
- Generator sources: [`block-plugin-scaffold`](https://github.com/lightspeedwp/block-plugin-scaffold) and [`block-theme-scaffold`](https://github.com/lightspeedwp/block-theme-scaffold), including [plugin replacement tracking](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37) and [theme replacement tracking](https://github.com/lightspeedwp/block-theme-scaffold/issues/9).
