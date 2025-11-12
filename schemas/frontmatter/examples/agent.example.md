---
$schema: "../frontmatter.schema.json"
file_type: "agent"
name: "example-security-agent"
description: "Example agent that performs WordPress security audits and recommends fixes"
version: "v1.0.0"
last_updated: "2025-11-12"
owners: ["lightspeedwp/security-team"]
status: "active"
category: "security"
domain: "security"
stability: "stable"
tags: ["security", "audit", "wordpress", "owasp"]
labels: ["security", "wordpress", "automated"]
references:
  - path: "../../docs/SECURITY.md"
    description: "Security guidelines and policies"
  - path: "../../.github/instructions/coding-standards.instructions.md"
    description: "Coding standards including security requirements"
  - path: "../frontmatter.schema.json"
    description: "Frontmatter schema definition"
---

# Example Security Agent

This is an example agent specification showing proper frontmatter structure.

## Purpose

This agent performs comprehensive security audits on WordPress codebases, checking for:

- SQL injection vulnerabilities
- XSS vulnerabilities
- CSRF protection
- Input validation and sanitization
- Output escaping
- Authentication and authorization
- Nonce verification
- Capability checks

## Usage

```bash
# Trigger via GitHub Copilot
@agent example-security-agent audit this file for security issues
```

## Expected Behavior

1. Scans the specified files or codebase
2. Identifies potential security vulnerabilities
3. Provides specific recommendations for fixes
4. References WordPress Coding Standards and OWASP guidelines
5. Generates a security report

## Output Format

The agent produces a markdown report with:

- Executive summary
- Detailed findings by severity (Critical, High, Medium, Low)
- Code snippets showing vulnerabilities
- Recommended fixes with code examples
- References to security best practices

## Related

- [WordPress Security Guidelines](https://developer.wordpress.org/apis/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Instructions](../../.github/instructions/security.instructions.md)
