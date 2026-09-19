# Plugin Advisories: Native Replacements, Gravity Forms Usage and Hosting-Stack Guidance

- **Review owner:** LightSpeed Team
- **Last reviewed:** 2026-09-19
- **Status:** active
- **Companion issue:** [#1396](https://github.com/lightspeedwp/.github/issues/1396)

This document is the single versioned home for plugin advisories. Every
advisory names its replacement or alternative, never only the restriction.
Status legend used below: **shipped** means the replacement exists in the
starter codebase today with a link; **planned** means it does not exist yet
and the link points at the tracking issue (or states that none exists yet).

Enforcement mechanism: the starter plugin ships a redundant-plugin admin
notice (`inc/class-redundant-plugins-notice.php`) backed by a registry with
`replaced`/`planned` statuses. `planned` entries never prompt for
deactivation. Add registry entries as replacements ship.

## 1. Replaced natively in the starter theme/plugin

| Plugin | Native replacement | Status | Caveat |
|---|---|---|---|
| Safe SVG | `upload_mimes` gated on a capability plus `enshrined/svg-sanitize` on upload | planned ([ls-starter-plugin#3](https://github.com/lightspeedwp/ls-starter-plugin/issues/3)) | SVG is executable markup: allowing the mime type without server-side sanitising re-opens stored-XSS. The filter alone is not a replacement. Sanitize with `enshrined/svg-sanitize` (used by Safe SVG itself and TYPO3 core) on `wp_handle_upload_prefilter`, and gate the mime type on an upload capability so only trusted roles can upload SVG. The starter registry already carries this as `planned` and warns without prompting deactivation. |
| WP Mail SMTP, Change Mail Sender | `phpmailer_init` from constants plus sender fields in Settings → General | partial: from-name/address shipped ([ls-starter-plugin#11](https://github.com/lightspeedwp/ls-starter-plugin/pull/11)); constants and settings fields planned ([ls-starter-plugin#2](https://github.com/lightspeedwp/ls-starter-plugin/issues/2)) | `phpmailer_init` fires after core calls `setFrom()`, so set `From`/`FromName`/`Sender` from constants there; the `wp_mail_from` / `wp_mail_from_name` filters are the simpler path for sender identity alone. Do not store SMTP passwords in the database when constants will do. The starter registry marks Change Mail Sender `replaced` (from-name/address handled). |
| Cachebuster | `filemtime()` asset versioning helper | shipped ([ls-starter-plugin#11](https://github.com/lightspeedwp/ls-starter-plugin/pull/11), `inc/class-cachebusting.php`; registry status `replaced`) | Version strings must change when file contents change; `filemtime()` on the asset path does this with no build step and no stale-cache risk. |
| Disable Emails | `pre_wp_mail` short-circuit driven by `wp_get_environment_type()` | planned (no tracking issue yet) | `pre_wp_mail` (core since 5.7) short-circuits `wp_mail()` when the filter returns non-null. Gate on environment type (core since 5.5: `local`, `development`, `staging`, `production`, defaulting to `production`) so non-production never sends. Unlike the plugin, this keeps password-reset and admin mails working in production. |
| View Transitions | native CSS `@view-transition` | planned (no tracking issue yet) | `@view-transition` (cross-document opt-in) is **not** Baseline as of September 2026 — treat it as progressive enhancement with identical no-animation fallback, and verify current Baseline status before relying on it. Same-document transitions via `document.startViewTransition()` have wider support. |
| Carousel Slider Block | CSS scroll-snap with core blocks | planned (no tracking issue yet) | `scroll-snap-type` / `scroll-snap-align` are Baseline widely available (all browsers since 2022) and compose with core Group/Columns blocks, so most marketing carousels need no JS library and no extra DOM weight. |
| GTM4WP, Google Site Kit | container snippet and `dataLayer` output from the enhancement plugin | planned (no tracking issue yet) | Emit `window.dataLayer = window.dataLayer || []` before the container snippet and push named events (`dataLayer.push({ event: 'signup' })`) from theme/plugin code; configure tags and triggers in the container. This keeps markup vendor-neutral: swapping analytics vendors means editing container config, not theme code. |
| WPFront Scroll Top | CSS plus a few lines of JS in the theme | planned (no tracking issue yet) | A positioned button, `scroll-behavior: smooth` (with `prefers-reduced-motion` respect), and a scroll listener is under 30 lines. No settings UI or extra payload is justified. |
| Disable Comments RB | core discussion settings | planned (no tracking issue yet) | Settings → Discussion already disables comments and pings globally and per post type; a plugin adds nothing except another settings surface that can drift from core. |
| User Menus, Visibility Logic for Elementor | block theme templates and template parts | planned (no tracking issue yet) | Block visibility and template-part conditions belong in theme templates where they are version-controlled and reviewable, not in per-element plugin metadata. |
| Social Sharing Block | pattern with plain share URLs, no JS | planned (no tracking issue yet) | Share intents are plain links (`https://www.facebook.com/sharer/sharer.php?u=…`, `https://x.com/intent/post?url=…`, `mailto:`, WhatsApp `wa.me`). A block pattern renders them with zero JS; third-party share scripts are a tracking and performance liability. |
| JWT Authentication for WP-API | core Application Passwords | planned (no tracking issue yet) | Application Passwords (core since 5.6) give per-user, individually revocable credentials over Basic Auth on HTTPS, with usage metadata and no extra plugin surface. JWT plugins add token lifecycle, secret storage and revocation problems core already solved. |
| Yoast Duplicate Post | row action plus `wp_insert_post` clone | planned (no tracking issue yet) | Cloning is `get_post()` → `wp_insert_post()` with copied taxonomies and meta in one admin row action. The plugin's scheduling and bulk features are out of scope until a client asks for them. |

## 2. Gravity Forms usage advisory

**Reason:** Gravity Forms is a full form framework: conditional logic, multi-page state, file handling and its theme CSS/JS ship on every page that renders a form. That payload is proportionate for enquiry, application, quote and upload forms — it is disproportionate for site-wide elements, newsletter sign-ups and pop-ups, where it adds render-blocking weight to every page view and degrades Core Web Vitals (particularly INP and LCP on mobile). Gravity Forms' own documentation provides `gform_disable_css` but warns that disabling it breaks conditional logic, honeypot hiding and multi-page forms — evidence the payload is structural, not optional.

**Rule:**

- Gravity Forms is the approved platform for enquiry, application, quote and upload forms.
- It must not be used for elements rendered site-wide, newsletter sign-ups, or pop-ups.

**Required alternatives (reference implementations, not just prohibitions):**

### Newsletter sign-up: plain form posting to a REST route

```html
<form id="newsletter-signup" method="post" action="/wp-json/ls/v1/newsletter">
  <label for="newsletter-email">Email address</label>
  <input id="newsletter-email" name="email" type="email" required autocomplete="email">
  <button type="submit">Subscribe</button>
</form>
<script>
document.getElementById('newsletter-signup').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const response = await fetch(form.action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: form.email.value }),
  });
  form.outerHTML = response.ok
    ? '<p role="status">Subscribed. Please check your inbox.</p>'
    : '<p role="alert">Subscription failed. Please try again later.</p>';
});
</script>
```

```php
add_action( 'rest_api_init', function () {
	register_rest_route( 'ls/v1', '/newsletter', array(
		'methods'             => 'POST',
		'callback'            => 'ls_newsletter_subscribe',
		'permission_callback' => '__return_true', // Public endpoint: rate-limit and validate below.
		'args'                => array(
			'email' => array(
				'required'          => true,
				'sanitize_callback' => 'sanitize_email',
				'validate_callback' => 'is_email',
			),
		),
	) );
} );

function ls_newsletter_subscribe( WP_REST_Request $request ) {
	$response = wp_remote_post(
		'https://provider.example/api/subscribe',
		array(
			'timeout' => 10,
			'headers' => array(
				'Authorization' => 'Bearer ' . PROVIDER_API_KEY, // Constant, never the database.
			),
			'body'    => array( 'email' => $request['email'] ),
		)
	);
	if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
		return new WP_Error( 'subscribe_failed', 'Subscription failed.', array( 'status' => 502 ) );
	}
	return array( 'subscribed' => true );
}
```

Adapt the provider call to the newsletter vendor in use; keep the secret in a
constant, validate and rate-limit the route, and return `role="status"` /
`role="alert"` regions so assistive technology announces the outcome.

### Pop-up: `<dialog>` with minimal JS

```html
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
- **All payment gateways** — money movement requires PCI-aware, vendor-maintained integrations; custom gateway code is a compliance and liability risk.
- **WooCommerce Subscriptions** — recurring billing, proration, dunning and gateway token management are commerce-critical logic no theme should own.
- **FacetWP** — indexed faceted search over large catalogues is a performance specialty; naive `WP_Query` faceting does not scale.
- **SearchWP** — relevance-ranked search with custom sources and stemming; core search has no ranking model.
- **Sequential Order Numbers** — order-number sequencing touches invoicing and accounting compliance; a maintained plugin owns the edge cases.

## 4. Hosting-stack advisories

**Reason:** the LightSpeed fleet already caches at two layers (nginx FastCGI page cache at origin, Cloudflare edge cache including APO HTML caching), purges both on content change, and runs CI. Each advisory below exists because a third tool would duplicate a layer the fleet already owns, move a check later than CI, or split ownership of a single event.

- **WP Rocket:** the fleet already runs nginx FastCGI page caching and Cloudflare edge caching, so a third page-cache layer is redundant and a stale-content risk (three invalidation paths instead of one). Approve for asset optimisation only — or not at all — on LightSpeed hosting. Gravity Forms' own cache FAQ independently warns that page caching serves stale output to dynamic, conditional and AJAX-driven forms.
- **Accessibility Checker:** run accessibility checks in CI (axe-core via `axe-core` npm package or pa11y-ci in a GitHub Action, gating on serious/critical violations) rather than as a production plugin. Production checkers add runtime weight to every page view and report after users are already affected; CI reports before merge. Automated engines catch roughly half of WCAG issues — pair with periodic human audit, not with a production plugin.
- **Redirection:** use the Redirection plugin. Web administrators need to manage rules themselves, and the plugin scales to that workload — server-level redirects would force every rule change through fleet config and the deploy pipeline. Reserve nginx-level redirects for one-off migration spikes managed by the fleet team.
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
- Starter code: `ls-starter-plugin/inc/class-redundant-plugins-notice.php`, `ls-starter-plugin/inc/class-cachebusting.php`; tracking issues [ls-starter-plugin#2](https://github.com/lightspeedwp/ls-starter-plugin/issues/2) (mail sender) and [ls-starter-plugin#3](https://github.com/lightspeedwp/ls-starter-plugin/issues/3) (SVG).
