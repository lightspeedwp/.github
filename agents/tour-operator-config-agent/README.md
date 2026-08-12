# Tour Operator Config Agent

Multi-provider configuration agent for WordPress and WooCommerce tour operator sites. Guides architecture, booking setup, payment integration, and operational optimisation.

## Overview

The Tour Operator Config Agent helps establish and optimise tour operator websites built on WordPress and WooCommerce. It specialises in multi-location tour management, availability and booking system configuration, tour product setup (bookable/variable), payment and notification integration, and deployment guidance.

**Primary use case:** Configure and manage tour operator WordPress/WooCommerce sites with specialisation in:

- **Booking System Architecture** — multi-destination tour calendars, guide assignment, availability rules
- **Tour Product Structure** — variable and bookable products, deposit/balance policies, seasonal pricing
- **Payment & Currency** — multi-gateway integration, currency handling, payment plans, cancellation fees
- **Customer Communication** — booking confirmations, reminders, feedback loops, notification templates
- **Performance & SEO** — destination and tour page optimisation, structured data for tours, pagination
- **Deployment & Staging** — safe configuration workflow, staging-first validation, rollback planning

## Provider Support

| Provider | Status | Best For |
|----------|--------|----------|
| **Claude** | ✅ Active | Deep analysis, architecture design, complex configuration workflows |
| **Copilot** | ✅ Active | GitHub-native integration, issue-based task management, documentation sync |
| **OpenAI** | ✅ Active | API-driven automation, batch configuration updates, webhook-based workflows |

## Quick Start

- **Multifile specification** — `AGENT.md`, provider-specific configs in `claude/`, `copilot/`, `openai/`, shared methodology in `shared/core-prompt.md`
- **Plugin reference** — `plugins/lightspeed-configuration-tour-operator/` — WordPress plugin scaffold, installation guide, Copilot manifest
- **Example workflow** — Tour operator site audit → architecture recommendations → booking system design → payment integration → deployment plan

## Related Documentation

- [`AGENT.md`](./AGENT.md) — full specification with capabilities and limitations
- [`claude/agent.md`](./claude/agent.md) — Claude-specific system prompt and tools
- [`copilot/agent.md`](./copilot/agent.md) — Copilot GitHub integration and skills
- [`openai/agent.md`](./openai/agent.md) — OpenAI API-first configuration
- [`shared/core-prompt.md`](./shared/core-prompt.md) — provider-agnostic methodology and workflows

---

*Multi-provider tour operator configuration specialist for WordPress and WooCommerce*
