# Prompt: Secure a PHP Render Callback

Given a callback, add sanitization/escaping and capability checks as needed.

- Identify inputs (GET/POST/db/options) and sanitise.
- Escape all outputs by context.
- Verify nonces & capabilities in admin context.
- Add unit tests for valid/invalid input paths.
