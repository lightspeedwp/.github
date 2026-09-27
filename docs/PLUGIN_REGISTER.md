# Approved Plugin Register

- **Review owner:** LightSpeed Team
- **Last reviewed:** 2026-09-25
- **Status:** active
- **Companion issue:** [#1396](https://github.com/lightspeedwp/.github/issues/1396)

Org-wide canonical list of plugins approved for client builds. This register
answers _what may be installed globally_; why each entry is a plugin rather
than native code — and what replaces the rest — lives in the companion
[Plugin Advisories](PLUGIN_ADVISORIES.md). Client-specific stacks and concrete
payment-gateway approvals do not belong here; those live in a controlled
project register.

Status legend: **approved** (may be installed), **conditional** (requires
project-specific approval before installation), and **transitional** (approved
only until the tracked native replacement is available, then must be removed).

## Approved

| Plugin                    | Purpose                                                  | Notes                                                                                                     |
| ------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Gravity Forms             | Enquiry, application, quote and upload forms             | Approved form platform; see usage advisory (never site-wide elements, newsletters or pop-ups).            |
| Wordfence                 | Endpoint firewall, malware scanning, login hardening     | Incident response depends on its telemetry.                                                               |
| User Switching            | Capability-checked user impersonation for support        | Never reimplement session handling.                                                                       |
| Yoast SEO                 | Schema output, sitemaps, redirects UI, content analysis  | —                                                                                                         |
| WooCommerce Subscriptions | Recurring billing, proration, dunning, gateway tokens    | Commerce-critical logic no theme should own.                                                              |
| FacetWP                   | Indexed faceted search over large catalogues             | Naive `WP_Query` faceting does not scale.                                                                 |
| SearchWP                  | Relevance-ranked search with custom sources and stemming | Core search has no ranking model.                                                                         |
| Sequential Order Numbers  | Sequential, compliant order numbering                    | Touches invoicing and accounting compliance.                                                              |
| Redirection               | Bounded, administrator-managed redirects                 | Use for day-to-day editor-owned rules; use fleet-managed nginx rules for migrations and bulk URL changes. |

## Conditional (project approval required)

| Plugin class                     | Policy                                                                                                                                                                                                                                                                |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Concrete payment gateway plugins | No concrete gateway is globally approved by this register. WooCommerce core does not process payments. Before installation, record the exact plugin slug and version, provider, supported currencies, owner, test plan and approval in a controlled project register. |

## Transitional (remove once the native replacement ships)

| Plugin             | Pending replacement                                                                                                         | Tracking                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Safe SVG           | Capability-gated `upload_mimes` plus `enshrined/svg-sanitize` on upload                                                     | [block-plugin-scaffold#37](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37) |
| WP Mail SMTP       | Configured `PHPMailer` transport and sender values from deployment secrets, plus sender fields in generated plugin settings | [block-plugin-scaffold#37](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37) |
| Change Mail Sender | `phpmailer_init` from constants plus sender fields in generated plugin settings                                             | [block-plugin-scaffold#37](https://github.com/lightspeedwp/block-plugin-scaffold/issues/37) |

Anything not listed as approved or transitional is not globally approved.
Conditional entries still require the project approval described above. A plugin
with a native replacement in the advisories document remains unapproved until
that replacement is available and the entry is removed from this register.
