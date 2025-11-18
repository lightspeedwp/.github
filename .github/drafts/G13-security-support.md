---
name: "📚 Documentation"
about: "Request new documentation or propose updates/clarifications to existing docs."
title: "[Docs/Governance] Clarify SECURITY vs SUPPORT routing"
labels: [type:documentation, status:needs-triage, priority:normal, area:documentation, governance, version:v0.2.0]
assignees: []
projects: []
milestone: 'v0.2.0'
type: documentation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - ../SECURITY.md
  - ../SUPPORT.md
  - ../GOVERNANCE.md
---

## What documentation is needed?

We need to ensure SECURITY.md and SUPPORT.md have clear, non-overlapping guidance that explicitly defines:

- **SECURITY.md:** Private disclosure path for vulnerabilities with defined SLA
- **SUPPORT.md:** Public user-facing support channels, with clear redirection to SECURITY.md for vulnerabilities

**Current state:**

- Potential overlap between security and support routing
- Unclear when to use private vs public channels
- Risk of public disclosure of vulnerabilities
- Unclear SLAs for security response
- Possible contradictory guidance

**Desired state:**

- SECURITY.md clearly states private reporting channel and SLA
- SUPPORT.md clearly defers vulnerabilities to SECURITY.md
- No contradictory or overlapping guidance
- Users confidently know where to report issues
- Reduced risk of inappropriate public disclosure

## Why is this documentation important?

**For security:**

- **Critical** - Public disclosure of vulnerabilities creates immediate risk
- Clear private reporting channel enables responsible disclosure
- Defined SLA sets expectations and enables timely response
- Protects users and organisation from exploitation

**For contributors/users:**

- Clear routing eliminates confusion about where to report
- Confidence that security issues are handled appropriately
- Faster resolution through correct channel routing

**For maintainers:**

- Reduced triage burden from misrouted reports
- Clear SLAs enable accountability
- Compliance with security best practices

**Impact:**

- **High** - Risk of public disclosure or missed security incidents
- **High** - Compliance and legal risk if incidents mishandled
- **Medium** - Reputation damage from unclear security posture

## Acceptance Criteria

**SECURITY.md:**

- [ ] Private reporting channel clearly stated (e.g., <security@lightspeed.com>, GitHub Security Advisories)
- [ ] Reporting process documented step-by-step
- [ ] Expected response SLA defined (e.g., "Initial response within 24 hours")
- [ ] Scope of security policy clearly defined (what qualifies as vulnerability)
- [ ] Disclosure policy documented (coordinated disclosure timeline)
- [ ] No reference to public support channels for vulnerabilities
- [ ] Contact information current and monitored

**SUPPORT.md:**

- [ ] Public support channels clearly listed (GitHub Discussions, Slack, forums, etc.)
- [ ] Explicit statement: "**Do not report security vulnerabilities here**"
- [ ] Clear redirect to SECURITY.md for vulnerabilities
- [ ] Example text: "If you believe you've found a security vulnerability, please follow our [Security Policy](./SECURITY.md) for private disclosure."
- [ ] Support SLAs defined for different issue types (if applicable)
- [ ] No contradictory guidance about security reporting

**General:**

- [ ] No overlapping or contradictory guidance between files
- [ ] Cross-references between SECURITY.md ↔ SUPPORT.md
- [ ] Links verified and working
- [ ] Follows [WordPress documentation standards](https://developer.wordpress.org/coding-standards/inline-documentation/)
- [ ] Changelog entry prepared for PR
- [ ] Reviewed by security/governance teams

## Additional Context

**Example SECURITY.md structure:**

```markdown
# Security Policy

## Reporting a Vulnerability

**⚠️ Please do not report security vulnerabilities through public GitHub issues, discussions, or support channels.**

LightSpeed takes security seriously. If you believe you've discovered a security vulnerability, please report it privately using one of these methods:

### Preferred: GitHub Security Advisories
1. Go to the [Security Advisories page](https://github.com/lightspeedwp/.github/security/advisories)
2. Click "Report a vulnerability"
3. Provide detailed information about the vulnerability

### Alternative: Email
Send details to: **security@[your-domain].com** <!-- Replace with your actual security contact email -->

## What to Include

When reporting a vulnerability, please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested mitigation (if known)

## Response SLA

- **Initial response:** Within 24 hours
- **Status update:** Within 7 days
- **Resolution timeline:** Varies by severity (critical: 30 days, high: 60 days, medium: 90 days)

## Disclosure Policy

We follow **coordinated disclosure**:
1. You report the vulnerability privately
2. We investigate and develop a fix
3. We coordinate public disclosure timing with you
4. We credit you in release notes (if desired)

## Scope

This policy applies to:
- All repositories under the `lightspeedwp` organisation
- LightSpeed-maintained WordPress plugins and themes
- Infrastructure and services operated by LightSpeed

**Out of scope:**
- Third-party dependencies (report to their maintainers)
- Social engineering or phishing
- Physical attacks

## Questions?

For questions about this policy, contact: **governance@lightspeed.com**

For non-security support, see [SUPPORT.md](./SUPPORT.md).
```

**Example SUPPORT.md structure:**

```markdown
# Support

Need help with LightSpeed projects? Here's how to get support.

## ⚠️ Security Vulnerabilities

**Do not report security vulnerabilities through these support channels.**

If you believe you've found a security vulnerability, please follow our [Security Policy](./SECURITY.md) for private disclosure.

## Getting Help

### GitHub Discussions
For questions, ideas, and community support:
- [LightSpeed Discussions](https://github.com/orgs/lightspeedwp/discussions)

### Documentation
Check our documentation first:
- [Contributing Guide](./CONTRIBUTING.md)
- [Development Guide](./DEVELOPMENT.md)
- [Documentation Index](./DOCS.md)

### Slack Community
Join our Slack workspace:
- [LightSpeed Slack](https://lightspeed-community.slack.com)

### Issue Tracker
For bug reports and feature requests:
- [GitHub Issues](https://github.com/lightspeedwp/.github/issues)
- Use appropriate issue templates

## Support SLA

**Community support:** Best-effort, no guaranteed response time
**Bug reports:** Triaged within 2 business days
**Feature requests:** Reviewed during planning cycles

## Enterprise Support

For dedicated support, contact: **enterprise@lightspeed.com**

---

**Security issues?** See [SECURITY.md](./SECURITY.md) for private reporting.
```

**Cross-reference checklist:**

- [ ] SECURITY.md links to SUPPORT.md for non-security issues
- [ ] SUPPORT.md links to SECURITY.md for vulnerabilities
- [ ] CONTRIBUTING.md references both appropriately
- [ ] README.md links to both
- [ ] Issue templates reference appropriate channel

**Validation checklist:**

- [ ] No public security reporting mentioned in SECURITY.md
- [ ] SUPPORT.md explicitly excludes security vulnerabilities
- [ ] Contact emails are monitored and current
- [ ] SLAs are realistic and achievable
- [ ] Disclosure policy complies with industry standards

**Telemetry (post-merge):**

- Count misrouted security reports (before/after) - target: decrease
- Measure security report response time compliance with SLA
- Monitor public disclosure incidents - target: zero

## References

- [SECURITY.md](https://github.com/lightspeedwp/.github/blob/develop/SECURITY.md)
- [SUPPORT.md](https://github.com/lightspeedwp/.github/blob/develop/SUPPORT.md)
- [GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/GOVERNANCE.md)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories/repository-security-advisories/about-repository-security-advisories)
- [Coordinated Vulnerability Disclosure](https://vuls.cert.org/confluence/display/CVD)
- [Contribution Guidelines](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)

---

### Definition of Ready (DoR)

- [ ] Documentation need is clear and well-defined
- [ ] Related docs/issues or files linked
- [ ] Acceptance criteria listed
- [ ] Estimate added: **Medium** (2-3 hours: review, clarify, test routing)
- [ ] Security team consulted for SLA and process
- [ ] Milestone assigned: v0.2.0

### Definition of Done (DoD)

- [ ] SECURITY.md states private reporting channel and SLA
- [ ] SUPPORT.md defers vulnerabilities to SECURITY.md
- [ ] No contradictory guidance remains
- [ ] Cross-references added and verified
- [ ] Contact information verified as current and monitored
- [ ] Documentation meets org standards and guidelines
- [ ] Changelog entry prepared for PR (CHANGELOG.md)
- [ ] Documentation reviewed for clarity and accessibility
- [ ] Security/governance team approved
- [ ] PR uses correct branch prefix (`docs/security-support-routing`)

---

## Directions & Next Steps

1. Create feature branch: `docs/security-support-routing`
2. Review current SECURITY.md and SUPPORT.md for overlaps
3. Consult with security team on SLA and reporting process
4. Update SECURITY.md with clear private reporting channel and SLA
5. Update SUPPORT.md with explicit security exclusion and redirect
6. Add cross-references between files
7. Verify all contact information is current and monitored
8. Update CONTRIBUTING.md, README.md with appropriate links
9. Test routing clarity with sample scenarios
10. Update CHANGELOG.md
11. Submit PR with reference: `fixes #<issue_number>`
12. Tag @security-team and @governance-team for review

**Branch prefix:** `docs/`

**Files to update:**

- `SECURITY.md` (private channel, SLA, process)
- `SUPPORT.md` (public channels, security exclusion)
- `CONTRIBUTING.md` (reference both)
- `README.md` (reference both)
- `CHANGELOG.md`

**Testing:**
Create sample scenarios and verify routing is clear:

- "I found a bug" → SUPPORT.md channels
- "I think there's an XSS vulnerability" → SECURITY.md private reporting
- "The docs have a typo" → GitHub Issues
- "Someone is spamming our Slack" → SUPPORT.md → escalate to mods

See [Contribution Guidelines](../CONTRIBUTING.md) and [Coding Standards](../instructions/coding-standards.instructions.md).
