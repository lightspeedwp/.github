# Security Instructions

## Basics
- Escape on output (`esc_html`, `esc_attr`, etc.).
- Sanitize on input; validate types and ranges.
- Check capabilities; use nonces for state-changing requests.
- Harden REST endpoints: permissions callbacks; minimal data exposure.
