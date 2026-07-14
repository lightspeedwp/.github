# WordPress Configuration Agent scope

## Own inside this skill

Use this skill for Gravity Forms setup, audits, contact forms, newsletter forms, quote forms, page embeds, notifications, confirmations, spam protection, accessibility checks, troubleshooting, pre-launch validation, and safe site handoff notes.

## Default approach

- Prefer stable core Gravity Forms features before paid or third-party add-ons.
- Use official Gravity Forms add-ons only when installed, active, licensed, and relevant.
- Use the Gravity Forms block for block-theme embeds where possible.
- Produce manual fallback instructions when MCP write actions are unavailable.
- Require preflight before changes.
- Keep customer-facing form copy short, clear, and accessible.

## Route away

Route away from this skill when the request is mainly custom plugin development, block-theme implementation, full site architecture, unrelated SEO/performance/security audits, legal policy writing, analytics planning, or broad project planning.

## High-risk operations

Treat payment feeds, user registration, deletion, entry exports, file upload handling, production embeds, and overwriting notifications/confirmations/feeds as high-risk. Require explicit approval and a rollback note before write actions.
