---
file_type: "documentation"
title: "Security Policy"
description: "Security vulnerability reporting and responsible disclosure policy for LightSpeed projects"
version: "1.0"
last_updated: "2025-12-04"
owners: ["LightSpeed Security Team"]
tags: ["security", "vulnerability", "disclosure", "reporting"]
---

# Security Policy

If you discover a security vulnerability in this project, please report it responsibly.

## Reporting a Vulnerability

### Contact Methods

- **Email:** [support@lightspeedwp.agency](mailto:support@lightspeedwp.agency)
- **Subject Line:** Include `[SECURITY]` prefix for priority routing
- **Private Disclosure:** Do NOT open a public GitHub issue for security vulnerabilities

### What to Include in Your Report

Please provide as much detail as possible to help us assess and address the issue quickly:

- **Description** – Clear description of the vulnerability
- **Impact** – Potential impact and severity (Low, Medium, High, Critical)
- **Steps to Reproduce** – Detailed steps to reproduce the vulnerability
- **Affected Versions** – Which versions are affected
- **Proposed Fix** – Any suggestions for remediation (optional)
- **Your Contact Info** – How we can reach you for follow-up

**Example:**

```markdown
Subject: [SECURITY] XSS Vulnerability in Search Form

Description: Cross-site scripting (XSS) vulnerability in search form due to unsanitised user input.

Impact: High - Allows attackers to inject malicious scripts

Steps to Reproduce:

1. Navigate to /search
2. Enter: <script>alert('XSS')</script>
3. Observe script execution in search results

Affected Versions: v1.0 - v1.5

Proposed Fix: Sanitise search input using esc_html() before rendering

Contact: security-researcher@example.com
```

## Service Level Agreement (SLA)

We take security seriously and commit to the following response times:

| Severity     | Initial Response | Triage Complete  | Fix Target | Public Disclosure |
| ------------ | ---------------- | ---------------- | ---------- | ----------------- |
| **Critical** | 4 hours          | 24 hours         | 48 hours   | 7 days post-fix   |
| **High**     | 1 business day   | 3 business days  | 7 days     | 14 days post-fix  |
| **Medium**   | 3 business days  | 5 business days  | 14 days    | 30 days post-fix  |
| **Low**      | 5 business days  | 10 business days | 30 days    | 60 days post-fix  |

**Severity Definitions:**

- **Critical** – Remote code execution, authentication bypass, data breach
- **High** – Privilege escalation, SQL injection, XSS affecting admin users
- **Medium** – XSS affecting regular users, CSRF, information disclosure
- **Low** – Denial of service (local), minor information leaks

## Our Commitment

1. **Acknowledgement** – We will acknowledge receipt of your report within the SLA timeframe
2. **Assessment** – We will assess the vulnerability and provide an initial severity rating
3. **Fix Development** – We will develop and test a fix according to the SLA target
4. **Release** – We will release a security patch and notify affected users
5. **Credit** – We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

We follow industry-standard security practices:

- [WordPress Security Best Practices](https://developer.wordpress.org/security)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Our Security Measures

- **Input Validation** – All user inputs are validated and sanitised
- **Output Escaping** – All outputs are escaped to prevent XSS
- **Prepared Statements** – SQL queries use prepared statements to prevent SQL injection
- **Nonce Verification** – Forms and AJAX requests verify nonces
- **Capability Checks** – Admin functions check user capabilities
- **Security Headers** – Appropriate security headers are set
- **Dependency Management** – Regular dependency updates and vulnerability scanning

## Vulnerability Disclosure Policy

- **Private Disclosure** – Report vulnerabilities privately before public disclosure
- **Coordinated Disclosure** – We coordinate disclosure timelines with reporters
- **Public Disclosure** – Security advisories published after fixes are released
- **CVE Assignment** – Critical vulnerabilities receive CVE identifiers

## Security Updates and Advisories

- **Release Notes** – Security fixes documented in [CHANGELOG.md](./CHANGELOG.md)
- **Notifications** – Critical security updates announced via GitHub Discussions

## Questions or Concerns?

For questions about this security policy, contact:

- **Email:** [support@lightspeedwp.agency](mailto:support@lightspeedwp.agency)
- **Lead Security Contact:** @ashleyshaw

---

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
