---
file_type: "instructions"
description: "WordPress security best practices - sanitization, escaping, nonces, and capability checks"
applyTo: "**/*.php"
version: "v1.0"
last_updated: "2025-11-27"
owners: ["LightSpeedWP Team"]
tags: ["security", "wordpress", "sanitization", "escaping"]
---

# Instruction: WordPress Security

- **Sanitize** inputs: `sanitize_text_field`, `esc_url_raw`, `absint`, etc.
- **Escape** outputs: `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`.
- **Nonces & caps**: verify `current_user_can` and `wp_verify_nonce` for admin actions.
- Avoid unprepared SQL; use `$wpdb->prepare` for queries.
- Never trust client data; validate server‑side.
