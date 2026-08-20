# Source register

Last reviewed: 2026-07-03. Use this register to ground audit criteria. Official Gravity Forms documentation is preferred for platform behaviour. Third-party sources are only used after the target site confirms the plugin/add-on is installed and relevant. LightSpeed recommendations must be labelled as recommendations, not official Gravity Forms rules.

| Source URL | Source type | Last reviewed date | Topic | Confidence | Version caveat | Notes |
|---|---|---:|---|---|---|---|
| <https://www.gravityforms.com/> | Official vendor site | 2026-07-03 | Platform overview and ecosystem | High | Marketing pages can change | Use for platform context only, not live-site proof. |
| <https://docs.gravityforms.com/> | Official docs | 2026-07-03 | Documentation hub | High | Navigation can change | Primary source for audit rules. |
| <https://docs.gravityforms.com/gravity-forms-system-requirements/> | Official docs | 2026-07-03 | WordPress/PHP/MySQL requirements | High | Requirements change over time | Preflight uses current site evidence plus this source. |
| <https://docs.gravityforms.com/rest-api-v2/> | Official docs | 2026-07-03 | REST API v2, endpoints, auth, forms, entries, feeds | High | REST availability depends on site/settings/connector | Supports capability mapping, not proof of connector support. |
| <https://docs.gravityforms.com/gravity-forms-commitment-to-accessibility/> | Official docs | 2026-07-03 | Accessibility commitment | High | Theme/content still matter | Use with the accessibility checklist. |
| <https://docs.gravityforms.com/accessibility-checklist-for-gravity-forms/> | Official docs | 2026-07-03 | Accessibility QA checklist | High | Visual checks require page evidence | Primary accessibility checklist. |
| <https://docs.gravityforms.com/category/gravity-forms-2-9/> | Official docs | 2026-07-03 | Gravity Forms 2.9 features | High | Requires confirmed 2.9+ version | Do not assume 2.9 fields/settings on older sites. |
| <https://docs.gravityforms.com/category/gravity-forms-3-0/> | Official docs | 2026-07-03 | Gravity Forms 3.0 beta | Medium | Beta/version-specific | Do not treat 3.0 accessibility-by-default behaviour as stable everywhere. |
| <https://docs.gravityforms.com/spam-detection-and-protection-first-steps/> | Official docs | 2026-07-03 | Honeypot, state validation, submission speed, spam handling | High | Some controls are version-specific | Supports layered spam review and false-positive notes. |
| <https://docs.gravityforms.com/spam-detection-and-protection-integrations-and-plugins/> | Official docs | 2026-07-03 | Akismet, Turnstile, reCAPTCHA, Zero Spam, Partial Entries | High | Third-party/plugin support varies | Use to classify anti-spam layers and limitations. |
| <https://docs.gravityforms.com/turnstile/> | Official docs | 2026-07-03 | Cloudflare Turnstile Add-On | High | Requires add-on and keys | Audit presence/config only; do not configure. |
| <https://docs.gravityforms.com/configuring-notifications-in-gravity-forms/> | Official docs | 2026-07-03 | Notifications, recipients, From, Reply-To, merge tags | High | Delivery depends on WordPress/mail stack | Primary notification configuration source. |
| <https://docs.gravityforms.com/troubleshooting-notifications/> | Official docs | 2026-07-03 | Notification troubleshooting and deliverability | High | Live delivery requires logs/test evidence | Separates Gravity Forms handoff from SMTP/recipient delivery. |
| <https://docs.gravityforms.com/category/user-guides/confirmations/> | Official docs | 2026-07-03 | Confirmations and redirect/page/text behaviour | High | Redirect risks depend on site | Use for confirmation alignment checks. |
| <https://docs.gravityforms.com/file-upload-security/> | Official docs | 2026-07-03 | File upload restrictions, storage, secure links | High | Server config matters | Treat file uploads as high-risk evidence area. |
| <https://docs.gravityforms.com/personal-data-settings/> | Official docs | 2026-07-03 | Personal data export/erase, retention, IP storage | High | Privacy/legal stance must be project-specific | Use for retention/data handling audit. |
| <https://docs.gravityforms.com/category/user-guides/add-on-feeds/> | Official docs | 2026-07-03 | Feed documentation index | High | Feed availability depends on add-ons | Routing source for feed audits. |
| <https://docs.gravityforms.com/debugging-feed-issues/> | Official docs | 2026-07-03 | Feed troubleshooting, logs, active feeds, mappings | High | Logs can contain personal data | Logging review must be safe/redacted. |
| <https://docs.gravityforms.com/working-with-multiple-feeds/> | Official docs | 2026-07-03 | Multiple feeds, payment-feed constraints, User Registration limits | High | Add-on behaviour varies | Payment/User Registration feeds are high risk. |
| <https://docs.gravityforms.com/user-registration-add-on/> | Official docs | 2026-07-03 | User Registration add-on prerequisites and limitations | High | Requires add-on/licence | Public account creation and role assignment require escalation. |
| <https://docs.gravityforms.com/stripe-add-on/> | Official docs | 2026-07-03 | Stripe Add-On prerequisites and payments | High | Requires SSL, Stripe account, add-on, test/live awareness | Audit only; configuration requires approval and handoff. |
| <https://docs.gravityforms.com/embedding-one-form-multiple-times-per-page/> | Official docs | 2026-07-03 | Duplicate same-form embeds | High | Depends on page evidence | Duplicate embeds can cause submission/payment/CAPTCHA/focus issues. |
| <https://docs.gravityforms.com/adding-a-form-using-block/> | Official docs | 2026-07-03 | Gravity Forms block embedding | High | Block editor availability varies | Prefer for block-theme evidence when present. |
| <https://docs.gravityforms.com/gravity-forms-form-shortcode/> | Official docs | 2026-07-03 | Shortcode parameters | High | Shortcode behaviour/version varies | Inspect page embed settings before conclusions. |
| <https://docs.gravityforms.com/faq-on-cache-and-script-optimizer-issues/> | Official docs | 2026-07-03 | Cache/CDN/script optimisation conflicts | High | Depends on site stack | Important for broken front-end/dynamic forms. |
| <https://docs.gravityforms.com/logging-and-debugging/> | Official docs | 2026-07-03 | Logging and debugging | High | Logs may contain personal data | Do not enable logging in auditor; read safe logs only if permitted. |
| <https://gravitywiz.com/documentation/gravity-perks/> | Third-party vendor docs | 2026-07-03 | Gravity Perks ecosystem | Medium | Commercial add-ons require licence/support checks | Use only when Gravity Perks/Perk is installed. |
| <https://www.gravityforms.com/developers/gravity-wiz/> | Official partner profile | 2026-07-03 | Gravity Wiz certified developer context | Medium | Partner status/features can change | Ecosystem context only. |
| <https://www.gravityforms.com/add-ons/zero-spam/> | Official marketplace/add-on page | 2026-07-03 | Zero Spam marketplace listing | Medium | Third-party support varies | Verify installed plugin and support posture. |
| <https://wordpress.org/plugins/zero-spam/> | WordPress.org plugin page | 2026-07-03 | Zero Spam features, REST API, integrations, reviews/changelog | Medium | Listings and reviews change | Treat as plugin evidence, not an official Gravity Forms rule. |
| <https://github.com/Highfivery/zero-spam> | GitHub repository | 2026-07-03 | Zero Spam source repository | Medium | Repo availability/ownership can change | Use for code/source review if accessible. |
| <https://developer.wordpress.org/plugins/> | Official WordPress developer docs | 2026-07-03 | WordPress plugin guidance | High | General WordPress docs | Use for connector-safe/plugin-boundary context. |
| <https://modelcontextprotocol.io/specification/2025-06-18/server/tools> | Official MCP spec | 2026-07-03 | MCP tools, schemas, human-in-loop, security | High | Spec versions change | Supports capability discovery and read-only boundaries. |
| <https://modelcontextprotocol.io/specification/2025-06-18/server/resources> | Official MCP spec | 2026-07-03 | MCP resources, listing/reading resources | High | Spec versions change | Use where forms/logs/site state are exposed as resources. |

## Source-use rules

- Prefer official Gravity Forms docs for behaviour, fields, notifications, confirmations, feeds, REST API, accessibility, security, privacy, spam, file uploads, and troubleshooting.
- Use third-party add-on docs only after MCP evidence confirms the add-on is installed and relevant.
- Treat Gravity Forms 3.0 guidance as beta/version-specific unless the audited site confirms a compatible version and the risk is accepted.
- Label LightSpeed standards as recommendations, especially around maintainability, client-safe reporting, preferred handoff format, and tour-operator enquiry defaults.
