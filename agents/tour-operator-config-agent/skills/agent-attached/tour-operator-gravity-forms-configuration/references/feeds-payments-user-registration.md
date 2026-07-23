# Feeds, payments, and user registration

Use this reference whenever the task touches add-on feeds, payment feeds, marketing/CRM feeds, User Registration, multiple feeds, feed conditional logic, or feed troubleshooting.

## Operating stance

- Treat a feed as a consequential integration configuration, not a simple form setting.
- Read existing feeds before proposing changes.
- Preserve existing feed IDs, names, order, active state, conditional logic, and field mappings unless the user explicitly approves a change.
- Never create, disable, delete, reorder, or overwrite a payment or User Registration feed without explicit approval and a rollback note.
- Never store third-party credentials, webhook secrets, Stripe keys, PayPal credentials, CRM tokens, or licence keys in skill files, examples, test prompts, handoff notes, or chat output.

## Feed preflight

Before feed work, confirm:

1. Gravity Forms version and add-on version.
2. Add-on installed, active, licensed where applicable, and connected.
3. Current user capability allows reading/updating the feed.
4. Form has all fields required by the target feed.
5. Feed is active or intentionally inactive.
6. Field mappings are complete and type-compatible.
7. Conditional logic is intentional, testable, and documented.
8. Logs can be enabled temporarily if troubleshooting is required.
9. Spam handling is understood: feeds usually should not process spam entries.
10. Test mode/sandbox is available for payments before production changes.

## Multiple feeds

- Many marketing/CRM feeds may process all matching feeds.
- Payment add-ons should be treated as single-feed-per-submission flows unless conditional logic proves which payment feed should process.
- User Registration supports multiple Create User feeds but only one Update User feed per form.
- If multiple feeds route to different systems, create a feed matrix with conditions, required fields, target system, owner, and failure handling.

## Payment feed rules

Payment feed work is high risk. Require approval for every change.

Required evidence:

- Official payment add-on installed and active.
- Gateway account connected and in the intended live/test mode.
- SSL is active on the site.
- Pricing fields and totals are present and tested.
- Confirmation and notification wording does not imply payment success until gateway status is known.
- Entry payment status and gateway dashboard can be reviewed after test payment.
- Refund, cancellation, recurring billing, tax, fulfilment, and order ownership are out of scope unless explicitly approved.

Safe default:

- Plan in draft mode.
- Validate in sandbox/test mode.
- Run a small-value test transaction where permitted.
- Confirm entry status, gateway status, email notification, and accounting/fulfilment handoff.

## User Registration rules

User Registration work is high risk because it creates or updates WordPress users.

Required evidence:

- User Registration Add-On installed and active.
- Form includes required Username and Email mappings for user creation.
- Role assignment is approved and least-privilege.
- Password flow is approved: user-created password or email-based password setup.
- Activation flow is approved: email activation, manual activation, or immediate account creation.
- Update User feeds are not tested with an administrator account unless intentionally isolated on staging.
- Separate forms are preferred for new registrations and profile updates.

Refuse or route away when:

- The user asks to create Administrator accounts from a public form.
- Role, activation, or password behaviour is unclear and the change is live.
- Membership, recurring billing, fulfilment, commercial policy, or platform payment logic is broader architecture rather than Gravity Forms configuration.

## Marketing and CRM feeds

Before configuring Mailchimp, HubSpot, Salesforce, Slack, Zapier, Webhooks, or similar feeds:

- Confirm the add-on exists and is connected.
- Confirm consent basis and list/audience ownership.
- Confirm opt-in wording and whether double opt-in is required.
- Map fields conservatively and avoid sending unnecessary personal data.
- Use conditional logic only where the user's selection clearly determines the target feed.
- Test with a safe internal email and remove test contacts if required.

## Feed debugging playbook

1. Confirm a fresh test entry should trigger the feed.
2. Check the entry is not spam and not in trash.
3. Confirm feed active state.
4. Check conditional logic against the actual test values.
5. Verify field mappings and required external fields.
6. Check add-on/global connection settings.
7. Enable logging temporarily if available.
8. Submit a fresh test entry with realistic data.
9. Review logs for the form, add-on, and background processing.
10. Disable/delete logs after the investigation and record redaction needs.

## Output requirements

For feed-related tasks, prefer:

- `templates/feed-audit.md` for audits and troubleshooting.
- `templates/risk-review.md` for payment or user-registration changes.
- `templates/test-report.md` after test submissions.
- `templates/handoff-note.md` for team handoff.
