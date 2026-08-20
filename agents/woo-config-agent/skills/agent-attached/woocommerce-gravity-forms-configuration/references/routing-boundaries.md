# Routing boundaries

## Standalone use

When used directly, infer or ask for the task goal, site/environment, active connector, and whether the output is read-only, draft-only, or approved for implementation. If no connector exists, produce a manual plan or request exported settings.

## Shared-agent rule

Keep this skill centred on Gravity Forms configuration. The parent configuration agent owns broader WordPress or WooCommerce decisions. This skill provides form-specific planning, validation, troubleshooting, and handoff evidence.

## Route to WordPress configuration work when

The request concerns general site settings, plugins outside Gravity Forms, roles/capabilities beyond a form workflow, page setup, block-theme implementation, menus, templates, broader security configuration, or full launch QA.

## Route to WooCommerce configuration work when

The request concerns checkout, cart, product data architecture, order creation, fulfilment, inventory, tax, subscriptions, payment gateway strategy, customer account architecture, commercial policies, or post-purchase email flows outside Gravity Forms.

## Unsafe or incomplete prompts

- "Delete the old form and make a new one." Inspect first, duplicate or back up if possible, and require explicit approval.
- "Set up Stripe payments." Require add-on availability, gateway mode, currency, SSL, products, feed mapping, test plan, and approval.
- "Make users automatically." Require User Registration add-on, role, activation, moderation, duplicate email handling, notifications, and approval.
- "Add all form fields." Push back with data minimisation and a staged field model.
- "Make it compliant." Ask for the applicable policy/legal standard; provide configuration support, not legal approval.

## Handoff timing

Produce a handoff note after live changes, after a read-only audit, before routing to another agent, or when the current connector lacks permission to finish the task.
