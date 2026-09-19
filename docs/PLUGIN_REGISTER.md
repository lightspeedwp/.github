# Approved Plugin Register

- **Review owner:** LightSpeed Team
- **Last reviewed:** 2026-09-19
- **Status:** active
- **Companion issue:** [#1396](https://github.com/lightspeedwp/.github/issues/1396)

Org-wide canonical list of plugins approved for client builds. This register
answers *what may be installed*; why each entry is a plugin rather than
native code — and what replaces the rest — lives in the companion
[Plugin Advisories](PLUGIN_ADVISORIES.md). Client-specific stacks do not
belong here; those live in project memory per the delivery skill guidance.

Status legend: **approved** (stays), **transitional** (approved until its
native replacement ships, then must be removed — see advisories).

## Approved

| Plugin | Purpose | Notes |
|---|---|---|
| Gravity Forms | Enquiry, application, quote and upload forms | Approved form platform; see usage advisory (never site-wide elements, newsletters or pop-ups). |
| Wordfence | Endpoint firewall, malware scanning, login hardening | Incident response depends on its telemetry. |
| User Switching | Capability-checked user impersonation for support | Never reimplement session handling. |
| Yoast SEO | Schema output, sitemaps, redirects UI, content analysis | — |
| Payment gateways | Money movement (WooCommerce core and approved gateway extensions) | Custom gateway code is a compliance and liability risk. |
| WooCommerce Subscriptions | Recurring billing, proration, dunning, gateway tokens | Commerce-critical logic no theme should own. |
| FacetWP | Indexed faceted search over large catalogues | Naive `WP_Query` faceting does not scale. |
| SearchWP | Relevance-ranked search with custom sources and stemming | Core search has no ranking model. |
| Sequential Order Numbers | Sequential, compliant order numbering | Touches invoicing and accounting compliance. |
| Redirection | Administrator-managed redirects | Web administrators manage rules themselves and the plugin scales; reserve nginx-level redirects for fleet-managed migration spikes. |

## Transitional (remove once the native replacement ships)

| Plugin | Pending replacement | Tracking |
|---|---|---|
| Safe SVG | Capability-gated `upload_mimes` plus `enshrined/svg-sanitize` on upload | [ls-starter-plugin#3](https://github.com/lightspeedwp/ls-starter-plugin/issues/3) |
| WP Mail SMTP | `phpmailer_init` from constants plus sender fields in Settings → General | [ls-starter-plugin#2](https://github.com/lightspeedwp/ls-starter-plugin/issues/2) |

Anything not on this list is not approved: either it has a native replacement
in the advisories document, or it needs a review entry here before use.
