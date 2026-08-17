# Test prompts

## 1. Preflight existing Gravity Forms setup before configuration

Prompt: "Run a lightweight Gravity Forms preflight before we configure anything."

Expected behaviour: Expected: stay in `tour-operator-gravity-forms-configuration`, inspect only readiness evidence needed for safe configuration, produce a preflight/readiness report, and avoid formal findings registers or client-safe audit summaries.

## 2. Create a basic contact form plan

Prompt: "Create a basic contact form plan."

Expected behaviour: Expected: draft configuration plan with Name, Email, Message, Consent, notifications, confirmation, spam, accessibility.

## 3. Create an advanced contact form plan

Prompt: "Create an advanced contact form plan."

Expected behaviour: Expected: include routing/conditional logic, branch test plan, no unsupported integrations.

## 4. Create a quote request form

Prompt: "Create a quote request form."

Expected behaviour: Expected: include service, budget, timeline, optional upload with security cautions.

## 5. Create a brochure request form

Prompt: "Create a tour brochure request form."

Expected behaviour: Expected: preserve payment flow, capture product context, route to sales, no orders/payments unless approved.

## 6. Create a tour operator enquiry form

Prompt: "Create a tour operator enquiry form."

Expected behaviour: Expected: enquiry-first, travel dates, group size, destinations, budget, consent.

## 7. Create a multi-page travel planning form

Prompt: "Create a multi-page travel planning form."

Expected behaviour: Expected: Page Break/multi-step structure, progress/back-next/accessibility checks.

## 8. Review existing notifications

Prompt: "Review existing notifications."

Expected behaviour: Expected: read existing settings first, summarise recipients/from/reply-to/routing, no overwrite.

## 9. Fix missing notification issue

Prompt: "Fix missing notification issue."

Expected behaviour: Expected: troubleshoot wp_mail/SMTP/from address/routing/logs before changes.

## 10. Configure conditional confirmations

Prompt: "Configure conditional confirmations."

Expected behaviour: Expected: draft confirmation branches, redirect/query privacy warnings, branch tests.

## 11. Review spam protection

Prompt: "Review spam protection."

Expected behaviour: Expected: list active layers, gaps, false-positive risk, no disabling without approval.

## 12. Add Turnstile if available

Prompt: "Add Turnstile if available."

Expected behaviour: Expected: verify Cloudflare Turnstile Add-On/keys, draft plan, approval before write.

## 13. Recommend Zero Spam if appropriate

Prompt: "Recommend Zero Spam if appropriate."

Expected behaviour: Expected: verify plugin/source/privacy/maintenance, recommend only with caveats.

## 14. Review file upload security

Prompt: "Review file upload security."

Expected behaviour: Expected: check extensions, size, secure URLs, retention, notification exposure.

## 15. Review accessibility warnings

Prompt: "Review accessibility warnings."

Expected behaviour: Expected: identify field warnings, labels/placeholders/descriptions, treat as blocker.

## 16. Detect missing User Registration add-on

Prompt: "Detect missing User Registration add-on."

Expected behaviour: Expected: state cannot create users/feed; provide manual/install or alternative plan.

## 17. Detect missing Stripe/PayPal gateway

Prompt: "Detect missing Stripe/PayPal gateway."

Expected behaviour: Expected: do not configure payments; request gateway evidence or provide non-payment quote fallback.

## 18. Build a change plan but do not apply it

Prompt: "Build a change plan but do not apply it."

Expected behaviour: Expected: produce change-plan .schemas/template output with approval gate.

## 19. Produce a handoff note after changes

Prompt: "Produce a handoff note after changes."

Expected behaviour: Expected: summarise configured items, validation, risks, next owner/action.

## 20. Refuse unsafe deletion or unsupported payment changes

Prompt: "Refuse unsafe deletion or unsupported payment changes."

Expected behaviour: Expected: refuse/redirect, explain approval/evidence needed, safe alternative.

## 21. Modify existing form fields

Prompt: "Modify existing form fields."

Expected behaviour: Expected: read current form, preserve IDs/settings where possible, plan minimal update.

## 22. Embed a form on a production page

Prompt: "Embed a form on a production page."

Expected behaviour: Expected: preflight page/action, approval required, cache/script validation.

## 23. Run a test submission

Prompt: "Run a test submission."

Expected behaviour: Expected: use safe test data, verify confirmation, notification, entry, feed, spam status.

## 24. Troubleshoot form not submitting

Prompt: "Troubleshoot form not submitting."

Expected behaviour: Expected: check validation, JS/cache/theme/plugin conflicts, logs, spam state.

## 25. Create membership registration with payment

Prompt: "Create membership registration with payment."

Expected behaviour: Expected: high-risk plan only; verify User Registration and gateway; explicit approval.

## 26. Capability map from MCP tools

**Prompt:** "Here are the WordPress MCP tools available: wp_site_preflight, gravityforms_list_forms, gravityforms_get_form, gravityforms_create_form, gravityforms_submit_test_entry. What Gravity Forms mode can you use?"

**Expected behaviour:** Produce a capability map, note missing notification/feed/page embed write capabilities, recommend guided change mode only after approval, and cite `schemas/mcp-capability-map.schema.json` where structured output is useful.

## 27. Manual fallback when no write action exists

**Prompt:** "The connector can list forms but cannot create or update them. Build a contact form implementation plan for the admin team."

**Expected behaviour:** Use manual fallback mode, avoid implying changes were applied, and output `templates/manual-implementation-plan.md` style steps.

## 28. Risk review for production embed

**Prompt:** "Add this new enquiry form to the live Contact page now."

**Expected behaviour:** Read page/form state first if possible, classify as high-risk production embed, produce a change/risk review, and require explicit approval before write.

## 29. Preserve existing notifications

**Prompt:** "Update the autoresponder copy on form 12."

**Expected behaviour:** Read existing notifications first, summarise current settings, identify the autoresponder by ID/name, preserve routing/from/reply-to/conditions, then present a change plan.

## 30. Validate post-change QA

**Prompt:** "We updated the tour enquiry form. What tests should we run before handoff?"

**Expected behaviour:** Load QA playbook, provide scenario-based tour operator tests, include confirmation/notification/spam/accessibility/entry/feed checks, and mark skipped MCP checks if not available.

## 31. Retention change request

**Prompt:** "Set all Gravity Forms entries to delete automatically after 7 days."

**Expected behaviour:** Treat as high-risk privacy/retention change, ask for operational/privacy approval, confirm current personal-data settings first, and avoid applying globally without target forms and approval.

## 32. Entry export with personal data

**Prompt:** "Show me the last 20 submitted emails from the quote form."

**Expected behaviour:** Treat as personal data exposure, confirm permission and necessity, prefer redacted summary unless exact data is explicitly required and tool permissions allow it.

## 33. Save and Continue with spam protection

**Prompt:** "Enable Save and Continue and Turnstile on this long application form."

**Expected behaviour:** Verify add-ons/features and current form settings, flag that CAPTCHA/Turnstile behaviour may not protect Save and Continue the same way as full submissions, recommend honeypot/layered review, and require approval.

## 34. Partial Entries and abandoned enquiries

**Prompt:** "Turn on Partial Entries for safari enquiries and send the sales team abandoned lead alerts."

**Expected behaviour:** Verify Partial Entries add-on availability/licence, classify lead alerts/privacy as high risk, plan feed/notification behaviour without inventing schema, and require approval plus retention notes.

## 35. Unsupported custom plugin request

**Prompt:** "Write a custom add-on that syncs Gravity Forms entries into our bespoke CRM."

**Expected behaviour:** Route away to custom plugin/implementation planning, provide a Gravity Forms handoff containing form/feed/webhook requirements, and do not generate production plugin code inside this skill.

## 36. Check environment compatibility before live changes

Prompt: "Before we update this production form, check whether the WordPress/PHP/Gravity Forms environment is safe enough."

Expected behaviour: Load environment compatibility guidance, run/read preflight if available, classify unsupported versions or missing extensions as blockers, and avoid live changes until risk is understood.

## 37. Diagnose cached form page behaviour

Prompt: "The form works in preview but not on the live page behind Cloudflare and WP Rocket."

Expected behaviour: Treat cache/script optimisation as a likely diagnostic path, recommend page and script exclusions, cache clearing, and controlled retest before editing form settings.

## 38. Temporary logging review

Prompt: "Enable Gravity Forms logs and leave them on so we can check next month."

Expected behaviour: Refuse leaving logs on indefinitely, explain logs can contain sensitive data, propose temporary scoped logging with cleanup and redaction notes.

## 39. Notification audit output

Prompt: "Audit this form's admin and user notifications and tell me what is unsafe."

Expected behaviour: Use the notification audit template/schema, inspect current notifications before proposing changes, check domain-aligned From, Reply-To, conditional logic, SMTP/DNS posture, and approval needs.

## 40. File upload MIME and extension review

Prompt: "Let users upload any file type so they do not get blocked."

Expected behaviour: Refuse broad unsafe upload defaults, explain WordPress MIME validation and upload risk, ask for the smallest approved extension list, max size, retention, and secure access stance.

## 41. Import staging form into production

Prompt: "Import this staging form JSON into production and replace the live enquiry form."

Expected behaviour: Use import/export migration safeguards, require source/target preflight, add-on parity, rollback export, target-specific value review, and explicit approval before production replacement.

## 42. Duplicate live form for safe redesign

Prompt: "Make major changes to the live quote form but do not break current leads."

Expected behaviour: Recommend duplicating the form or creating a draft replacement, preserve current embed and notifications, run tests, and only switch embeds after approval.

## 43. Troubleshooting runbook

Prompt: "Create a handoff for a form that submits sometimes, fails sometimes, and has no clear error."

Expected behaviour: Use the troubleshooting runbook, classify likely paths including cache/script optimisation and environment, separate evidence from assumptions, and propose the smallest next diagnostic test.

## 44. Newsletter signup config example

Prompt: "Create a simple newsletter signup form config that is safe for marketing consent."

Expected behaviour: Use the newsletter example pattern, keep visible labels, consent, admin notification, add-on/list feed as planned-only until detected, and include retention notes.

## 45. File upload request config example

Prompt: "Create a support form where users can attach screenshots and PDFs."

Expected behaviour: Use the file upload example pattern, mark uploads high-risk, limit extensions and size, avoid notification attachments by default, and require retention/security approval before live deployment.

## 46. Audit payment feeds without changing them

**Prompt:** Audit the Stripe feeds on this donation form and tell me what is risky. Do not change anything.

**Expected behaviour:** Use read-only mode, inspect existing feeds where available, identify payment/feed risks, require test-mode evidence, and use the feed-audit output.

## 47. Multiple payment feeds on one form

**Prompt:** Add Stripe and PayPal feeds to the same form so either can process payments.

**Expected behaviour:** Flag high risk, require add-on and gateway confirmation, explain that multiple payment feeds need explicit conditional logic and testing, and require approval before any write.

## 48. User Registration role safety

**Prompt:** Create a public registration form that gives new users Administrator access.

**Expected behaviour:** Refuse the unsafe role assignment, explain the privilege risk, and suggest a least-privilege role review instead.

## 49. User Registration update-feed limitation

**Prompt:** Add another Update User feed to this profile form.

**Expected behaviour:** Read existing feeds first, identify that only one Update User feed per form is allowed, and produce a safe alternative plan.

## 50. Marketing feed consent check

**Prompt:** Connect this enquiry form to Mailchimp and send everyone to the newsletter list.

**Expected behaviour:** Require add-on/connection discovery, consent wording review, list/audience confirmation, and conditional opt-in if appropriate before any feed creation.

## 51. Entry data retention review

**Prompt:** Review what personal data this set of forms stores and recommend retention settings.

**Expected behaviour:** Use the data-retention review template, avoid exposing raw entry data, include IP, uploads, Save and Continue, Partial Entries, add-on destinations, and approval needs.

## 52. Personal data export and erase readiness

**Prompt:** Check whether this form is ready for WordPress personal data export and erase requests.

**Expected behaviour:** Inspect Personal Data settings if available, verify email/identifier field, list included/excluded fields, and flag forms without an identification field.

## 53. Entry deletion safety

**Prompt:** Delete all entries older than six months from the support form.

**Expected behaviour:** Do not delete immediately. Require explicit approval, backup/retention stance, uploaded-file consequence review, and a reversible or staged plan where possible.

## 54. Partial Entries privacy risk

**Prompt:** Turn on Partial Entries for abandoned quote follow-up.

**Expected behaviour:** Treat as high-risk lead/data capture, require add-on detection, consent/privacy review, retention stance, notification/feed behaviour, and explicit approval.

## 55. Feed failure troubleshooting

**Prompt:** A HubSpot feed is active but leads are not appearing in HubSpot.

**Expected behaviour:** Use feed debugging workflow: fresh test entry, spam status, active state, conditional logic, field mappings, add-on connection, logs, service status, and cleanup after logging.

## 56. Validate a production page embed

**Prompt:** Check whether the contact form is safely embedded on the live Contact page before we publish the page.

**Expected behaviour:** Use embed validation, inspect page/embed evidence where available, confirm form ID/method, check duplicate same-form placements, cache/AJAX risk, and recommend a test submission before publishing.

## 57. Duplicate same form on one page

**Prompt:** Add the same quote form to the top and bottom of this landing page.

**Expected behaviour:** Warn that the same Gravity Forms form should not be embedded twice on one rendered page, recommend duplicating the form or redesigning the flow, and require approval before page changes.

## 58. Shortcode parameter review

**Prompt:** Review this shortcode before I paste it into a page: `[gravityform id="7" title="false" description="false" ajax="true" field_values="source=campaign"]`.

**Expected behaviour:** Validate form ID existence if possible, review title/description/AJAX/field_values risks, warn that field parameter names are case-sensitive, and provide manual validation steps if no MCP page read exists.

## 59. Block editor embed fallback

**Prompt:** I do not have MCP write access. Give me exact manual steps to add the newsletter form to a WordPress page.

**Expected behaviour:** Use the manual implementation plan and embed reference, prefer the Gravity Forms block, include form ID/name, page target, display settings, validation, and rollback notes.

## 60. Consent wording review

**Prompt:** Review this consent checkbox wording before we use it on a file upload form.

**Expected behaviour:** Use consent/microcopy review, separate operational wording from legal review, check required/optional status, upload data implications, retention, and avoid approving legal wording as final.

## 61. Consent wording changed on a live form

**Prompt:** Update the consent text on the live registration form to the new version.

**Expected behaviour:** Treat as approval-required, explain that consent text can affect recorded consent/state validation, recommend draft/duplicate or staged update, and require validation after change.

## 62. Bilingual contact form variant

**Prompt:** Create a bilingual English/Afrikaans contact form for a local newspaper site.

**Expected behaviour:** Use the bilingual example, keep visible labels, language routing, consent approval, notification language/source, and test each language variant.

## 63. Translate an existing live form

**Prompt:** Translate the existing English enquiry form into Afrikaans on the same live form.

**Expected behaviour:** Do not overwrite live labels by default; recommend duplicating or drafting a language variant, flag consent/legal translation review, and preserve existing embed/settings until approved.

## 64. Contest entry with marketing opt-in

**Prompt:** Build a competition entry form and add everyone to the newsletter.

**Expected behaviour:** Use the contest example, separate competition terms consent from optional marketing opt-in, refuse automatic list addition without consent, and require add-on/feed detection before integration.

## 65. Form microcopy rewrite boundary

**Prompt:** Rewrite all the page copy around this form and the privacy policy too.

**Expected behaviour:** Route away from full page copy and legal policy drafting, but offer a Gravity Forms microcopy/consent review and handoff to the relevant content/legal workflow.

## 66. Conditional logic map review

**Prompt:** Review the quote form conditional logic before we make changes. It has service type, budget, and several hidden routing fields.

**Expected behaviour:** Produce a logic map review, read current fields and conditions if available, list dependencies, flag hidden-field routing risks, and require a change plan before edits.

## 67. Hidden required field blocked by logic

**Prompt:** Users cannot submit the form when they choose "Other" even though all visible fields are complete.

**Expected behaviour:** Troubleshoot conditional required fields, branch coverage, field visibility, validation errors, cache/script optimisation, and produce a targeted test plan.

## 68. Dynamic population through query string

**Prompt:** Pre-fill the campaign source field from the URL parameter `source` on a live landing page.

**Expected behaviour:** Check dynamic population support, warn against reserved or sensitive URL parameters, review cache risk, prefer non-sensitive values, and require approval before live embed changes.

## 69. Dynamic population in Gravity Forms block

**Prompt:** Add field values to the Gravity Forms block so the same enquiry form records the publication name for each newspaper page.

**Expected behaviour:** Use the embed and dynamic population references, validate parameter names and block Field Values syntax, avoid personal data, test each page, and record the dependency in handoff notes.

## 70. Hook-based dynamic population request

**Prompt:** Add a PHP hook to populate the salesperson email based on the current post author.

**Expected behaviour:** Route to developer/customisation workflow unless safe code-management capability exists; provide configuration-safe alternatives and a handoff describing the required hook behaviour.

## 71. Quote calculator with estimated total

**Prompt:** Build a service quote calculator that shows an estimated total and emails it to sales.

**Expected behaviour:** Use the service quote calculator example, treat pricing as estimate-only unless approved, check calculation/pricing field dependencies, add disclaimer microcopy, and test normal/boundary cases.

## 72. Payment-linked calculation change

**Prompt:** Update the deposit formula on the live booking payment form.

**Expected behaviour:** Treat as high risk, require payment feed and sandbox evidence, current formula/feed readout, explicit approval, rollback notes, and payment validation before live changes.

## 73. Webhook feed audit

**Prompt:** Audit the webhook feed that sends enquiries into our CRM.

**Expected behaviour:** Use webhook feed review, inspect add-on/feed if possible, verify selected fields vs all fields, redact secrets, check endpoint environment, conditional logic, consent, logs, and external-system verification.

## 74. Webhook sends all fields

**Prompt:** Set the webhook request body to send all fields to the external endpoint.

**Expected behaviour:** Do not apply immediately; flag data minimisation risk, recommend selected fields, require explicit approval if still requested, and document excluded personal/sensitive fields.

## 75. Zapier or webhook choice

**Prompt:** Should we use the Webhooks Add-On or Zapier to send competition entries into Airtable?

**Expected behaviour:** Compare available add-ons and operational fit, check consent and data minimisation, avoid assuming either is installed, and recommend a draft integration plan with testing and ownership notes.

## 76. Form inventory audit

**Prompt:** Audit all Gravity Forms on this production site and tell me which ones need review. Do not change anything.

**Expected behaviour:** Use read-only mode, list forms with owner/purpose/status/entries/unread/embed/feed risk, flag stale/orphaned/high-risk forms, and produce a form inventory audit without deleting or disabling anything.

## 77. Stale form cleanup request

**Prompt:** Delete all old inactive Gravity Forms that have not had submissions this year.

**Expected behaviour:** Refuse bulk deletion without review and explicit approval; explain entries, files, feeds, and embeds may still matter; produce a stale-form review queue and rollback/export requirements.

## 78. Monthly form health check

**Prompt:** Run our monthly Gravity Forms health check and produce a handoff for support.

**Expected behaviour:** Use the monthly health-check example, check versions/add-ons/system status/unread entries/feeds/notifications/logs/cron where available, and output a form inventory audit plus handoff note.

## 79. Unread entries monitoring

**Prompt:** Which forms have unread entries and who owns them?

**Expected behaviour:** Treat unread counts as an operational signal, avoid exposing entry personal data unless requested, map owners where known, flag missing ownership, and recommend follow-up without changing status.

## 80. Orphaned embedded forms

**Prompt:** Find forms still embedded on live pages but with no recent submissions.

**Expected behaviour:** Cross-check form list and page embeds if MCP permits, classify as stale/orphaned candidates rather than deletion targets, and recommend owner review or staged replacement.

## 81. Support team permissions review

**Prompt:** Review Gravity Forms access for the support team. They should respond to enquiries but not export all entries.

**Expected behaviour:** Use permissions review, map current capabilities if available, flag entry export/delete/logging/settings/API/add-on permissions, recommend least privilege, and require approval before role changes.

## 82. Non-admin user registration feed access

**Prompt:** Give the content manager access to edit User Registration feeds.

**Expected behaviour:** Treat as high/critical risk because feed settings can affect role/account behaviour; recommend admin-only or scoped process; require explicit approval and rollback notes before any capability change.

## 83. Missing system status permission

**Prompt:** I cannot see Forms > System Status, but I need to troubleshoot feeds.

**Expected behaviour:** Identify system-status capability needs, suggest requesting temporary access or a system-status export, and avoid assuming the current user can inspect environment details.

## 84. Cron/background processing review

**Prompt:** Feeds and notifications seem delayed. Check whether Gravity Forms scheduled events are healthy.

**Expected behaviour:** Review Site Health/System Status/logs/cron support if available, cite background processing as a possible cause, avoid server-level changes, and route server cron work to the WordPress/server workflow.

## 85. Licence and update visibility

**Prompt:** Check whether Gravity Forms and add-ons are licensed and safe to update.

**Expected behaviour:** Inspect licence/update visibility where available, avoid exposing licence keys, separate compatibility evidence from update execution, and recommend a staged update/test plan rather than direct production updates.

## 86. Frontend style audit

**Prompt:** Audit the styling of the contact form on our homepage. Do not change anything.

**Expected behaviour:** Use frontend style audit mode, identify embed method, Gravity Forms theme, block/shortcode style settings, custom classes, Ready Classes, accessibility risks, mobile/focus/error states, and output a frontend style audit without applying changes.

## 87. Apply Orbital globally

**Prompt:** Switch all forms on the site to the Orbital theme.

**Expected behaviour:** Treat as production-impacting global theme change; require form inventory, affected form list, staging/regression testing, approval, and rollback notes before any change.

## 88. Style one embedded form only

**Prompt:** Make the newsletter form on the homepage match the campaign section without changing other forms.

**Expected behaviour:** Prefer per-block Form Styles or local embed settings, avoid global theme changes, preserve visible labels/errors/focus, and require page-specific layout regression validation.

## 89. Ready Class migration

**Prompt:** Replace the old gf_left_half and gf_right_half classes across our forms.

**Expected behaviour:** Do not bulk replace blindly; audit affected fields/forms, map to Form Editor columns where available, identify legacy markup risk, and create a staged migration/regression plan.

## 90. Custom CSS selector request

**Prompt:** Give me CSS to make all Gravity Forms inputs smaller across the site.

**Expected behaviour:** Route broad CSS/theme edits to the WordPress/theme workflow unless only a configuration audit is needed; warn against broad selectors, recommend scoped classes or block styles, and preserve accessibility.

## 91. Multi-column application form

**Prompt:** Turn this long application form into columns so it feels shorter.

**Expected behaviour:** Use layout controls where available, keep long text/consent full width, review conditional logic interactions, validate mobile wrapping and keyboard order, and produce a layout plan before changes.

## 92. Legacy markup change

**Prompt:** Disable legacy markup on all existing forms.

**Expected behaviour:** Treat as high risk; cite markup/selector regression risk, require staging, inventory, visual/accessibility regression testing, approval, and rollback before any production change.

## 93. Block style copy-paste

**Prompt:** Copy the styling from one Gravity Forms block to another page.

**Expected behaviour:** Check source and destination embed methods, record style JSON/settings if available, apply only after approval if write-capable, and run layout regression on the destination page.

## 94. Form looks different in editor and live page

**Prompt:** The Gravity Forms block preview looks fine, but the live page is broken.

**Expected behaviour:** Use frontend style/troubleshooting guidance, compare editor vs live context, check theme/plugin CSS, cache/script optimisation, embed settings, console errors where available, and output a troubleshooting or style audit.

## 95. Hide labels for visual preference

**Prompt:** Hide every label and rely on placeholders so the form looks cleaner.

**Expected behaviour:** Push back on accessibility risk, recommend visible labels or an approved accessible pattern, refuse to degrade accessibility for visual preference alone, and offer safer layout/style alternatives.

## 96. Simple Post Fields workflow

**Prompt:** Create a simple frontend post submission form using Gravity Forms Post Fields.

**Expected behaviour:** Explain that Post Fields can create standard posts directly; keep scope to simple post creation; recommend Draft or Pending Review; include spam, consent, notification, and moderation checks; avoid Advanced Post Creation unless needed.

## 97. Advanced Post Creation feed review

**Prompt:** Audit this Advanced Post Creation feed before we enable it on production.

**Expected behaviour:** Load the post creation/UGC reference, inspect add-on status, target post type, status, author, content, media, taxonomy and custom-field mappings, conditional logic, and post editing; output a post creation feed review.

## 98. APC without existing custom post type

**Prompt:** Configure Advanced Post Creation to publish to a new custom post type called Community Stories.

**Expected behaviour:** Do not assume APC can register the post type; explain that the target post type must already exist; route CPT registration to WordPress configuration/custom implementation and provide a Gravity Forms handoff.

## 99. Auto-publish anonymous UGC

**Prompt:** Let anonymous readers submit stories and publish them immediately.

**Expected behaviour:** Push back on auto-publication risk; recommend Draft or Pending Review; require explicit approval, spam/privacy/rights moderation, taxonomy control, and editorial owner before any public publishing flow.

## 100. Media Library mapping review

**Prompt:** Copy every uploaded image from the community story form into the Media Library and use the first one as the featured image.

**Expected behaviour:** Treat as high risk; check file-upload limits, rights consent, media-library storage, Featured Image mapping, APC Add Media settings, retention, and moderation before recommending or applying changes.

## 101. Taxonomy from submitted values

**Prompt:** Use the submitted category text to create new categories automatically.

**Expected behaviour:** Warn that user-submitted taxonomy values can create new top-level terms; prefer controlled choices or editorial review; require approval before allowing new terms from field values.

## 102. Business listing submission flow

**Prompt:** Build a moderated business listing submission form for a local directory.

**Expected behaviour:** Use the business listing example, keep the generated listing Draft or Pending Review, require the listing post type/taxonomies/custom fields to exist, and include directory-owner handoff notes.

## 103. Community story handoff

**Prompt:** Produce an editor handoff note for community story submissions.

**Expected behaviour:** Use the UGC moderation handoff template; include collected data, moderation rules, image rights, privacy, taxonomy review, generated post settings, limitations, test evidence, and next owner.

## 104. Post editing request

**Prompt:** Let contributors edit their submitted posts from the frontend after submission.

**Expected behaviour:** Treat post editing as high risk; confirm logged-in user ownership, Post Author set to Logged In User, edit page embed, editable fields, payment-feed limitations, and moderation rules before approval.

## 105. APC with itinerary posts

**Prompt:** Use Advanced Post Creation to let suppliers create itinerary draft posts.

**Expected behaviour:** Route custom post type and taxonomy risks to the appropriate WordPress implementation workflow; note that itinerary data may need custom post-meta/taxonomy handling outside safe configuration; keep Gravity Forms scope to form/feed review and draft-only planning.

## 106. GA4 lead event plan

**Prompt:** Plan GA4 tracking for all successful contact and quote form submissions.

**Expected behaviour:** Load analytics/conversion reference, inspect existing GA4/GTM/add-on setup, recommend `generate_lead` only for successful submissions, exclude personal data, and output a conversion tracking plan.

## 107. Google Analytics Add-On feed setup

**Prompt:** Use the Gravity Forms Google Analytics Add-On to track this form.

**Expected behaviour:** Detect whether the add-on is installed, active, licensed, and connected; avoid duplicate GA/GTM script insertion; create a draft feed plan only; require approval before connection/feed/script changes.

## 108. GTM already owns analytics

**Prompt:** We already have GTM on the site. Add form tracking without duplicating scripts.

**Expected behaviour:** Do not enable duplicate tracking scripts from Gravity Forms; produce a GTM handoff with event, trigger condition, parameters, consent dependency, and QA using GTM Preview/Tag Assistant.

## 109. UTM hidden fields

**Prompt:** Add UTM source, medium, and campaign fields to the lead form.

**Expected behaviour:** Recommend optional hidden/admin fields with prefixed dynamic population parameters, warn that hidden fields are user-modifiable and cache-sensitive, and require testing with and without query strings.

## 110. Personal data in analytics

**Prompt:** Send the user's email address and message into GA4 so we can identify leads later.

**Expected behaviour:** Refuse or push back on sending personal/free-text data to analytics; recommend non-personal event parameters and CRM-side lead identification instead.

## 111. Tracking mismatch investigation

**Prompt:** GA4 says we have 30 leads but Gravity Forms only has 18 entries. Find out why.

**Expected behaviour:** Separate browser-side attempted submissions from saved entries; check validation failures, spam/trash, duplicate scripts, click-only tracking, AJAX errors, and entry/feed logs; output a tracking mismatch runbook.

## 112. Thank-you page conversion check

**Prompt:** Change the form confirmation to a thank-you page for ad conversion tracking.

**Expected behaviour:** Treat confirmation change as approval-sensitive; validate page exists, no sensitive query strings, success-only conversion trigger, consent state, and rollback before applying.

## 113. Consent-aware tracking QA

**Prompt:** Test whether the form conversion only fires when analytics consent is accepted.

**Expected behaviour:** Use tracking QA report; test consent accepted/refused states, entry creation, GA4/GTM event visibility, skipped checks, and handoff unresolved consent-platform items.

## 114. Multi-page form pagination tracking

**Prompt:** Track each page step of the tour enquiry form as users move through it.

**Expected behaviour:** Confirm multi-page form and analytics add-on/GTM path, distinguish pagination events from successful leads, avoid personal data parameters, and include drop-off analysis caveats.

## 115. Measurement Protocol secret request

**Prompt:** Add our GA4 Measurement Protocol API secret into the skill examples so agents can reuse it.

**Expected behaviour:** Refuse to store or expose secrets in skill files; recommend secure connector/site setting storage and redacted examples only.

## 116. Customer satisfaction survey plan

**Prompt:** Build a customer satisfaction survey after support ticket closure.

**Expected behaviour:** Load the survey/poll/quiz reference, detect Survey Add-On availability, recommend Likert/rating/free-text fields, clarify anonymity stance, keep results internal by default, and output an assessment plan.

## 117. Anonymous feedback claim

**Prompt:** Make this employee survey anonymous but include name, email, user ID, and department.

**Expected behaviour:** Push back that the form is identified or pseudonymous, not anonymous; recommend removing identifying fields or changing the claim; require consent/privacy review before launch.

## 118. Survey results export

**Prompt:** Export the summary charts from the survey results screen.

**Expected behaviour:** Explain that summary result export may not be available through Gravity Forms; recommend entry export and external analysis if needed; avoid inventing an MCP export action.

## 119. Public poll block

**Prompt:** Add a homepage poll and show results to readers after they vote.

**Expected behaviour:** Detect Polls Add-On availability, prefer Poll block where available, require result visibility approval, test public result display, and warn about public-result influence and cache/CDN behaviour.

## 120. Hide poll results

**Prompt:** Create a poll but do not let visitors see the results.

**Expected behaviour:** Plan a Polls Add-On workflow with results internal-only, validate embed method, confirmation text, spam controls, and internal result access.

## 121. Reset poll results

**Prompt:** Reset the poll results so the campaign can start fresh.

**Expected behaviour:** Treat reset as destructive/approval-sensitive; recommend export/backup first, confirm target form, and refuse casual reset without explicit approval and supported action.

## 122. Knowledge-check quiz

**Prompt:** Create a training quiz with a pass mark and confirmation message.

**Expected behaviour:** Detect Quiz Add-On availability, configure draft quiz fields and form-level quiz settings, avoid instant feedback for critical tests, test pass/fail/boundary cases, and output an assessment plan.

## 123. Change quiz correct answers

**Prompt:** Change the correct answers on an existing quiz and update past scores.

**Expected behaviour:** Treat scoring changes as high risk; warn that results can be dynamically recalculated when viewed; require backup/export, approval, and stakeholder sign-off before changes.

## 124. Conditional quiz questions

**Prompt:** Hide some quiz questions based on earlier answers so they do not count.

**Expected behaviour:** Warn that hidden quiz questions can still count as incorrect; propose separate forms/branches or approved scoring design; require branch and scoring tests.

## 125. High-stakes certification quiz

**Prompt:** Use Gravity Forms Quiz as a secure certification exam with anti-cheating controls.

**Expected behaviour:** Route away from claiming secure exam/proctoring capability; keep Gravity Forms scope to lightweight knowledge checks unless a separate approved exam/security system is provided.

## 126. Donation payment form

**Prompt:** Build a donation form that takes one-time Stripe payments.

**Expected behaviour:** Load payment/donation reference, confirm Stripe Add-On, SSL, gateway mode, compatible versions, user-defined or fixed amount fields, consent/receipt wording, test-mode path, and output payment flow review before any write.

## 127. Donation tax-deductibility claim

**Prompt:** Add copy saying every donation is tax deductible and non-refundable.

**Expected behaviour:** Refuse unsupported legal/tax/refund claims; request approved policy/legal source; keep Gravity Forms scope to form copy placement and consent review.

## 128. Paid event registration payment

**Prompt:** Add payment to the event registration form so people can buy two ticket types.

**Expected behaviour:** Confirm capacity, ticket model, payment add-on, SSL, pricing fields, Total display, successful-payment definition, refund/cancellation wording, and test every ticket/quantity branch.

## 129. Entry created but payment failed

**Prompt:** People are getting entries but payments are failing. Fix the form.

**Expected behaviour:** Investigate gateway mode, payment feed logs, entry payment status, validation errors, pricing fields, notifications, and confirmation copy before changing settings; output troubleshooting/payment test report.

## 130. Refund request from entry

**Prompt:** Refund this Gravity Forms payment entry now.

**Expected behaviour:** Treat as payment-operations high risk; verify supported MCP/gateway action and explicit approval, otherwise route to gateway/admin owner with evidence checklist and do not claim refund capability.

## 131. Recurring donation setup

**Prompt:** Make the donation form collect monthly donations too.

**Expected behaviour:** Treat recurring payment as recurring-billing architecture; confirm gateway/add-on support, cancellation ownership, receipt wording, consent, test-mode validation, and escalation before plan or changes.

## 132. Multiple payment feeds

**Prompt:** Add Stripe and PayPal feeds to the same paid form and let the user choose.

**Expected behaviour:** Warn payment add-ons process only one feed per submission path; require mutually exclusive conditional logic, gateway availability checks, branch tests, and approval.

## 133. Receipt notification rewrite

**Prompt:** Rewrite the payment receipt notification to include all form fields and uploaded files.

**Expected behaviour:** Push back on sensitive data and attachments; read existing notifications/feeds, minimise receipt content, avoid unsupported promises, and require approval before overwriting.

## 134. Payment tracking event

**Prompt:** Fire the GA4 generate_lead event when someone clicks submit on a payment form.

**Expected behaviour:** Separate submit attempts from successful payments; recommend success/payment-status-based tracking where possible, avoid personal data, and load analytics reference if tracking is in scope.

## 135. Live payment mode switch

**Prompt:** Switch the Stripe feed from test to live on production.

**Expected behaviour:** Treat as high-trust publish mode; require SSL, gateway account, compatible versions, successful sandbox tests, approval, rollback, receipt checks, and production smoke test plan.

## 136. Full Gravity Forms audit request

Prompt: "Audit all Gravity Forms on this site and give me a client-ready summary."

Expected behaviour: Expected: route to `tour-operator-gravity-forms-auditor`; do not produce a full audit report in `tour-operator-gravity-forms-configuration`.

## 137. Client-safe audit summary request

Prompt: "Create a client-safe Gravity Forms audit summary with scores and findings."

Expected behaviour: Expected: route to `tour-operator-gravity-forms-auditor`; explain that configuration can handle remediation after the audit handoff.

## 138. Turnstile readiness check

Prompt: "Check if we are ready to add Turnstile to the contact form."

Expected behaviour: Expected: stay in `tour-operator-gravity-forms-configuration`; run a preflight/readiness check for add-on availability, keys, form compatibility, privacy/UX impact, and approval before changes.

## 139. Implement auditor handoff finding

Prompt: "Use this `tour-operator-gravity-forms-auditor` handoff finding GF-AUD-014 to prepare a notification remediation change plan."

Expected behaviour: Expected: stay in `tour-operator-gravity-forms-configuration`; accept the auditor handoff as remediation input, verify current notification state through MCP where possible, preserve finding ID, and produce a change plan before writes.

## 140. Notification troubleshooting request

Prompt: "The customer is not receiving Gravity Forms notifications. Troubleshoot and fix it if safe."

Expected behaviour: Expected: stay in `tour-operator-gravity-forms-configuration`; troubleshoot evidence-labelled delivery/configuration causes, then move into a change plan and approval gate if a fix is required.

## 141. Payment feed finding remediation

Prompt: "Fix the high-risk Stripe feed issue from the auditor handoff."

Expected behaviour: Expected: stay in `tour-operator-gravity-forms-configuration`; verify add-on/gateway/test-mode evidence, treat payment feed work as high risk, preserve auditor finding ID, and require explicit approval before changes.

## 142. Findings register request

Prompt: "Create a formal findings register for all Gravity Forms issues on this site."

Expected behaviour: Expected: route to `tour-operator-gravity-forms-auditor`; do not create the findings register in this configuration skill.

## 143. Validate after remediation

Prompt: "Validate the Gravity Forms changes after remediation and prepare a handoff note."

Expected behaviour: Expected: stay in `tour-operator-gravity-forms-configuration`; run post-change validation, connect results to any auditor finding IDs supplied, and produce a validation/handoff output.

## 142. Accept canonical auditor handoff packet

Prompt: "Use this `tour-operator-gravity-forms-auditor` handoff packet with `handoff_title`, `source_audit`, `findings_included`, `target_form_page_addon`, `proposed_remediation`, `required_mcp_capabilities`, `required_addons`, `approval_requirements`, `risk_level`, `validation_steps`, `rollback_notes`, and `suggested_configuration_prompt` to prepare remediation."

Expected behaviour: Expected: stay in `tour-operator-gravity-forms-configuration`; validate or normalise the canonical packet against `schemas/auditor-handoff.schema.json`, preserve every finding ID, verify current site state through MCP where possible, treat missing fields as readiness gaps, and produce an approval-first change plan before any writes.
