# Security Requirements Quality Variant

> Domain-specific extension of the base Requirements Quality Checklist (8 dimensions) with Security-focused items

**Domain**: Security (Data Protection, Threat Mitigation, Compliance, Access Control)  
**Use When**: Specification handles sensitive data, requires threat protection, or has compliance requirements  
**Base Template**: Add these items to the standard 40-45 base items

---

## Security-Specific Items (18 items)

### Completeness: Threat Model and Attack Vectors

**CHK-046-Security-Completeness**

**Question**: Is a threat model documented identifying attack vectors and mitigations?

**Guidance**: Create threat model identifying:

- **Assets to protect**: What's valuable and needs protection?
  - Customer data (PII, payment info), intellectual property, credentials, API keys
  
- **Threat actors**: Who might attack?
  - External attackers (opportunistic, targeted), insiders, competitors
  
- **Attack vectors**: How might they attack?
  - SQL injection, XSS, CSRF, brute force, phishing, man-in-the-middle, privilege escalation
  - Supply chain attacks, malware, insider threats, DDoS
  
- **Impact if compromised**: What's the consequence?
  - Data breach (customer data exposed, reputational damage, GDPR fines)
  - Service disruption (unavailability, financial loss)
  - Fraud (unauthorized transactions, identity theft)

Use threat modeling framework (STRIDE):

- **S**poofing: Can attacker impersonate user/system?
- **T**ampering: Can attacker modify data?
- **R**epudiation: Can attacker deny actions?
- **I**nformation disclosure: Can attacker access sensitive data?
- **D**enial of service: Can attacker disrupt service?
- **E**levation of privilege: Can attacker gain higher access?

For each threat, document:

- Likelihood (high, medium, low)
- Impact (critical, high, medium, low)
- Mitigation (how is this prevented?)
- Residual risk (risk after mitigation)

Example threat:
"Threat: SQL Injection in user search. Likelihood: High (user input). Impact: Critical (database access, data breach). Mitigation: Parameterized queries, input validation. Residual risk: Low."

**Success Criteria**:

- Threat model documented
- Assets and attackers identified
- Attack vectors listed
- Mitigations defined for each threat
- Threat model reviewed by security team

---

### Completeness: Data Classification and Sensitivity

**CHK-047-Security-Completeness**

**Question**: Is data classified by sensitivity? Are handling requirements documented?

**Guidance**: Classify all data:

- **Public**: No confidentiality requirement (marketing copy, product names)
- **Internal**: Company-confidential but not sensitive (employee lists, strategy docs)
- **Confidential**: Requires protection (customer data, API keys, credentials)
- **Restricted/PII**: Highly sensitive (passwords, SSNs, payment info, health records)

For each data type, document:

- Classification level
- Handling requirements (storage, transmission, retention, access)
- Encryption requirements (at rest? in transit?)
- Access controls (who can access? under what conditions?)
- Retention period (how long kept? when deleted?)
- Audit logging (are accesses logged?)

Example:
"Customer email: Confidential. Storage: encrypted in database. Transmission: TLS 1.3. Access: only to support team (with audit log). Retention: 30 days after account deletion. Encryption key: rotated monthly."

Handling by sensitivity:

- Public: Basic security (HTTPS), no special storage
- Internal: Encryption, access controls, audit logs
- Confidential: Encryption (at rest & transit), role-based access, audit logs
- Restricted: Encryption, multi-factor access, minimal retention, compliance audit trail

**Success Criteria**:

- All data classified
- Handling requirements documented
- Encryption specified
- Access controls defined
- Retention and deletion procedures documented
- Classification reviewed with data owners

---

### Clarity: Authentication and Credential Management

**CHK-048-Security-Clarity**

**Question**: Are authentication mechanisms and credential requirements clearly specified?

**Guidance**: Specify:

- **Password policy**:
  - Minimum length (14+ characters recommended)
  - Complexity (uppercase, lowercase, numbers, symbols)
  - No reuse of last N passwords (3-5)
  - Password expiration (optional, not always recommended)
  - Account lockout (after N failed attempts, lockout M minutes)
  
- **Multi-factor authentication (MFA)**:
  - Is MFA required or optional?
  - MFA methods (SMS, authenticator app, hardware key, email)
  - Recovery codes (if MFA device lost)
  
- **Session management**:
  - Session timeout duration (idle logout after N minutes)
  - Session token format (JWT, opaque token)
  - Secure cookie attributes (HttpOnly, Secure, SameSite)
  
- **API authentication**:
  - API key format and rotation
  - Bearer token format (JWT claims)
  - OAuth 2.0 grant types
  - Certificate-based auth (mutual TLS)

- **Credential storage**:
  - Password hashing algorithm (bcrypt, scrypt, Argon2)
  - Salt usage (per-password salt)
  - Hash iterations (cost factor)
  - API keys: never log, never display after creation

Example:
"Password: min 14 chars, UPPERCASE+lowercase+numbers+symbols. Account lockout: 5 failed attempts → locked 15 min. MFA: required for admin accounts, optional for users (TOTP). Session: 30 min inactivity timeout, HttpOnly cookies. API keys: rotated quarterly, never logged."

Ambiguities to avoid:

- "Strong password" → define numerically
- "Secure authentication" → specify mechanism
- "Protected at rest" → specify encryption algorithm
- "Audit logging" → specify what's logged and retention

**Success Criteria**:

- Authentication mechanisms formally specified
- Credential requirements are measurable
- MFA strategy documented
- Session management defined
- Compliance with NIST or industry standards
- Tested with penetration testing

---

### Clarity: Data Encryption and Key Management

**CHK-049-Security-Clarity**

**Question**: Are encryption requirements and key management procedures documented?

**Guidance**: Specify:

- **Data at rest (stored in database/files)**:
  - Encryption algorithm: AES-256 (standard)
  - Key management: Where are keys stored? (KMS, HSM, key vault)
  - Key rotation: How often? (annually recommended)
  - Encrypted fields: Which fields must be encrypted? (all PII, payment info)
  
- **Data in transit (over network)**:
  - TLS version: TLS 1.3 minimum (1.2 acceptable for legacy)
  - Certificate authority: Self-signed or trusted CA?
  - Certificate pinning: Is pinning used? (for mobile apps)
  - Cipher suites: Which are acceptable? (modern ciphers only)
  
- **End-to-end encryption**:
  - Is data encrypted client-side before sending? (for highly sensitive)
  - Can server see plaintext? (if yes, E2EE not possible)
  - Example: Password managers, messaging apps

Key management:

- How are encryption keys generated?
- Where are keys stored? (separate from encrypted data)
- Who can access keys?
- How are keys rotated without losing access to encrypted data?
- What happens if key is compromised?
- How are keys backed up? (securely!)
- What's the disaster recovery procedure?

Example:
"PII: AES-256 encryption at rest, key stored in AWS KMS. Payment info: AES-256, PCI-compliant HSM key management. Transmission: TLS 1.3 minimum. Keys rotated annually. Lost key procedure: re-encrypt with new key (expensive but necessary)."

**Success Criteria**:

- Encryption algorithms specified (not vague)
- Key management documented
- Key rotation schedule defined
- Emergency/recovery procedures documented
- Encryption tested (can't access data without key)
- Compliant with industry standards (NIST, PCI-DSS, HIPAA)

---

### Clarity: Security Headers and HTTP Protections

**CHK-050-Security-Clarity**

**Question**: Are security headers and HTTP protections implemented?

**Guidance**: Specify:

- **Content Security Policy (CSP)**: Prevents XSS attacks
  - Example: `Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com`
  
- **X-Content-Type-Options**: Prevents MIME-sniffing
  - Example: `X-Content-Type-Options: nosniff`
  
- **X-Frame-Options**: Prevents clickjacking
  - Example: `X-Frame-Options: DENY` or `X-Frame-Options: SAME-ORIGIN`
  
- **Strict-Transport-Security (HSTS)**: Forces HTTPS
  - Example: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  
- **X-XSS-Protection**: Legacy XSS protection (older browsers)
  - Example: `X-XSS-Protection: 1; mode=block`
  
- **Referrer-Policy**: Controls referrer info
  - Example: `Referrer-Policy: strict-origin-when-cross-origin`
  
- **Permissions-Policy**: Controls browser features
  - Example: `Permissions-Policy: geolocation=(), microphone=(), camera=()`

Test headers:

- Use security header testing tools (securityheaders.com, Mozilla Observatory)
- All headers implemented and correct
- Grade: A or A+ (no failing headers)

**Success Criteria**:

- All critical security headers implemented
- Header values are appropriate (not too permissive)
- Headers tested and verified
- Non-compliance documented with justification
- Updates monitored (new headers added as threats evolve)

---

### Measurability: Security Testing and Vulnerability Management

**CHK-051-Security-Measurability**

**Question**: Are security testing requirements and vulnerability management processes documented?

**Guidance**: Specify:

- **Static Application Security Testing (SAST)**:
  - Tools: Snyk, Sonarqube, Semgrep
  - Frequency: On every commit
  - Threshold: Zero critical/high vulnerabilities allowed
  
- **Dynamic Application Security Testing (DAST)**:
  - Tools: OWASP ZAP, Burp Suite
  - Frequency: Weekly or before release
  - Coverage: All endpoints tested
  
- **Dependency scanning**:
  - Tools: Dependabot, Snyk, WhiteSource
  - Frequency: Continuous
  - Action: Auto-update or alert on vulnerability
  
- **Penetration testing**:
  - Frequency: Annually or before major release
  - Scope: What systems tested? (web app, APIs, infrastructure)
  - Approved tester: Internal or external?
  
- **Code review**:
  - Security review required for sensitive code (auth, crypto, PII handling)
  - Reviewer qualifications: Security training
  
- **Vulnerability disclosure**:
  - Do you have a bug bounty program?
  - Responsible disclosure policy?
  - Time to fix critical vulnerabilities (e.g., 24-72 hours)

Metrics:

- CVSS score for vulnerabilities (0-10, critical ≥9)
- Mean time to remediation (MTTR) for critical issues
- % of dependencies up-to-date
- Count of penetration test findings

Example:
"SAST: Snyk on every commit, block on critical. DAST: OWASP ZAP weekly. Penetration test: annual by third party. Vulnerability fix: critical (24 hours), high (72 hours), medium (2 weeks). Responsible disclosure: bug bounty on HackerOne."

**Success Criteria**:

- Testing strategy documented
- Tools and frequency specified
- SLA for fixes defined (by severity)
- Metrics tracked
- Testing automated (not manual)
- All findings remediated or documented with risk acceptance

---

### Scenario Coverage: Access Control and Authorization

**CHK-052-Security-Scenario-Coverage**

**Question**: Are access control mechanisms and authorization rules documented?

**Guidance**: Specify:

- **Role-based access control (RBAC)**:
  - Roles defined: admin, editor, viewer, guest, etc.
  - Permissions per role: what can each role do?
  - Example: admin=all permissions, viewer=read-only, guest=no access
  
- **Attribute-based access control (ABAC)**:
  - Attributes: user attributes (department, location), resource attributes (sensitivity), context (time of day, IP)
  - Rules: Allow if user department == resource owner department AND user location == home office
  
- **Principle of least privilege**:
  - Users get minimum permissions needed
  - Admin access temporary and audited
  - Service accounts have scoped permissions (not overprivileged)

Document:

- How are roles assigned? (admin approval, self-service, automated provisioning)
- How often are roles reviewed? (quarterly)
- What's the request approval process?
- How are permissions revoked? (immediately upon termination)
- Access logging: are all access decisions logged?

Example permissions matrix:

| Role | Create | Read | Update | Delete | Admin |
|------|--------|------|--------|--------|-------|
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| Editor | ✓ | ✓ | ✓ | - | - |
| Viewer | - | ✓ | - | - | - |
| Guest | - | - | - | - | - |

Access revocation:

- Immediate removal of credentials
- Session invalidation
- API key revocation
- Certificate revocation (CRL/OCSP)

**Success Criteria**:

- Access control model documented (RBAC/ABAC/hybrid)
- Roles and permissions explicitly defined
- Least privilege enforced
- Access provisioning/deprovisioning processes documented
- Access reviewed regularly
- Unauthorized access attempts logged

---

### Scenario Coverage: Compliance Requirements

**CHK-053-Security-Scenario-Coverage**

**Question**: Are applicable compliance requirements documented and mapped to controls?

**Guidance**: Identify and document compliance requirements:

- **GDPR (Europe)**: Right to privacy, data portability, right to be forgotten
  - Controls: Data encryption, access controls, retention limits, breach notification
  
- **HIPAA (US Healthcare)**: Patient data privacy
  - Controls: Encryption, audit logs, access controls, breach notification, BAA with vendors
  
- **PCI-DSS (Payment cards)**: Credit card data protection
  - Controls: Encryption, no cardholder data storage (use tokenization), access controls, vulnerability management
  
- **SOC 2 Type II (US Enterprise)**: Security, availability, processing integrity, confidentiality, privacy
  - Controls: Monitoring, incident response, access controls, auditing
  
- **HIPAA (Healthcare)**: Health records privacy
- **FedRAMP (US Government)**: Secure cloud services
- **Industry-specific**: Financial, healthcare, etc.

Compliance mapping:

| Requirement | Scope | Control | Owner | Audit |
|-------------|-------|---------|-------|-------|
| GDPR Right to Delete | All EU users | User deletion workflow | Product | Annual |
| HIPAA Encryption | Health data | AES-256 at rest | Eng | Annual |
| PCI-DSS No Storage | Payments | Tokenization (Stripe) | Ops | Annual |

Document:

- Which regulations apply?
- Which controls satisfy each regulation?
- Who's responsible for each control?
- How is compliance verified? (audit, testing)
- Audit schedule and certifications

**Success Criteria**:

- All applicable regulations listed
- Controls documented per requirement
- Compliance verified via audit
- Certifications obtained (SOC 2, ISO 27001, etc.)
- Compliance tracked continuously

---

### Edge Cases: Breach Response and Incident Management

**CHK-054-Security-Edge-Cases**

**Question**: Is a breach response plan documented with notification procedures?

**Guidance**: Create incident response plan:

- **Detection**: How is breach discovered?
  - Monitoring alerts, customer reports, security researcher disclosure
  - Response time: Alert triggered within 1 hour
  
- **Containment**: How is damage limited?
  - Isolate affected system
  - Revoke compromised credentials
  - Block attacker access
  - Target: Contain within 4 hours
  
- **Investigation**: What happened?
  - Forensic analysis (logs, system state, attacker tools)
  - Scope: How much data accessed? What accounts affected?
  - Timeline: When did breach start? When discovered?
  - Target: Investigation complete within 72 hours
  
- **Notification**: Who's informed?
  - Affected users (legal requirement in many jurisdictions)
  - Regulators (within 72 hours for GDPR)
  - Insurance company
  - Law enforcement (for criminal activity)
  - Notification template and timing documented
  
- **Remediation**: How's system fixed?
  - Patch vulnerability
  - Harden system
  - Implement controls
  - Monitor for re-occurrence
  - Target: Patch deployed within 30 days (or sooner for critical)
  
- **Post-incident**: What's learned?
  - Root cause analysis (RCA)
  - Preventive measures for future
  - Process improvements
  - Lessons learned documented

Example timeline:
"T+0: Intrusion detected by IDS. T+15 min: Team alerted, containment started. T+1 hour: Affected systems isolated. T+4 hours: Attacker locked out, investigation starts. T+24 hours: Scope determined (100 users affected). T+48 hours: Patch developed and tested. T+72 hours: Regulators notified. T+5 days: Patch deployed. T+30 days: RCA published."

Communication plan:

- Who communicates with users? (customer support, security team)
- What's the message? (what happened, what's being done, what users should do)
- What's the timeline? (initial notification, updates, final resolution)

**Success Criteria**:

- Incident response plan documented
- Roles and responsibilities assigned
- Notification procedures tested (tabletop exercise)
- Timelines realistic
- Post-incident review process in place
- Plan updated after incidents

---

### Dependencies: Third-Party Security and Vendor Risk

**CHK-055-Security-Dependencies**

**Question**: Are third-party vendors and their security assessed and monitored?

**Guidance**: For each vendor/service, assess:

- **Security practices**:
  - Encryption (at rest, in transit)
  - Access controls
  - Audit logging
  - Vulnerability management
  - Incident response plan
  
- **Certifications**:
  - SOC 2 Type II
  - ISO 27001
  - GDPR compliant
  - HIPAA (if handling health data)
  - FedRAMP (if government data)
  
- **Contract requirements**:
  - Data Processing Agreement (DPA) for GDPR
  - Business Associate Agreement (BAA) for HIPAA
  - SLA (Service Level Agreement) including security updates
  - Breach notification clause
  - Right to audit
  - Right to subprocessor transparency
  
- **Ongoing monitoring**:
  - Security status reviews (quarterly)
  - Breach notification alerts subscribed?
  - Vulnerability announcements monitored?
  - Compliance status verified?

Vendor inventory:

| Vendor | Service | Data Handled | Certification | Risk Level | Review Date |
|--------|---------|--------------|---|---|---|
| Stripe | Payments | Tokenized | PCI-DSS | Low | 2024-09-17 |
| Auth0 | Auth | User data | SOC 2 | Low | 2024-09-17 |
| AWS | Hosting | All data | SOC 2, FedRAMP | Low | 2024-09-17 |

**Success Criteria**:

- All vendors assessed for security
- Risk levels determined
- Contracts require security commitments
- Ongoing monitoring in place
- Vendor changes trigger re-assessment
- Compliance verified annually

---

### Ambiguities: Sensitive Information Handling

**CHK-056-Security-Ambiguities**

**Question**: Are rules clear for handling sensitive info (secrets, credentials, logs)?

**Guidance**: Specify:

- **API keys and secrets**:
  - Never log full value (log last 4 chars only)
  - Never commit to version control (use .gitignore, secrets manager)
  - Never display in UI (show masked or truncated)
  - Rotation frequency (quarterly minimum)
  - Revocation process (immediate for compromised)
  
- **Passwords and credentials**:
  - Never log passwords (not even masked)
  - Never send via email
  - Use secure password reset flow (token via email, not SMS/security questions)
  - Never display after initial creation (user must securely store)
  
- **Logs and monitoring**:
  - Redact PII from logs (email, phone, SSN, payment info)
  - Remove secrets before logging (API keys, bearer tokens, passwords)
  - Log retention: Keep for compliance period only (not forever)
  - Access to logs restricted to ops/security team
  - Log tampering detected? (immutable logs, read-only after written)
  
- **Debugging and troubleshooting**:
  - Debug logs enabled in production? (only in non-prod, or with restricted access)
  - What's visible in error messages? (generic for users, detailed for logs)
  - Stack traces: exposed to users? (no, only in logs)

Example:
"Secrets: never logged, stored in AWS Secrets Manager. Passwords: hashed bcrypt, never logged. Logs: PII redacted, secrets removed, retention 90 days. Errors to users: 'An error occurred, contact support.' Errors in logs: Full stack trace with context. Debug mode: dev/test only, not production."

Ambiguities to avoid:

- "Keep secrets safe" → specify mechanism
- "Don't log passwords" → what about API keys? Tokens?
- "Sensitive data redacted" → which fields? (list them)
- "Access restricted" → to whom specifically?

**Success Criteria**:

- Rules for secrets documented
- Secrets never logged or versioned
- PII redacted from logs
- Error messages appropriately detailed (safe for UI)
- Log retention and access policies defined
- Audits verify compliance

---

### Ambiguities: Security Incident Severity Levels

**CHK-057-Security-Ambiguities**

**Question**: Are security issue severity levels defined (Critical, High, Medium, Low)?

**Guidance**: Define severity with specific criteria:

- **Critical (Severity 1)**:
  - Definition: Remote code execution, authentication bypass, data breach
  - Examples: SQL injection allowing database access, credential theft, ransomware
  - Response time: Patch within 4-24 hours
  - Notification: Users immediately, regulators within 72 hours (GDPR)
  
- **High (Severity 2)**:
  - Definition: Privilege escalation, significant data exposure, DoS possible
  - Examples: Privilege escalation from user to admin, XSS exposing user data
  - Response time: Patch within 2-7 days
  - Notification: Users within 1 week
  
- **Medium (Severity 3)**:
  - Definition: Some impact but limited scope, workaround exists
  - Examples: Information disclosure, weak encryption, insecure defaults
  - Response time: Patch within 1 month
  - Notification: Included in regular release notes
  
- **Low (Severity 4)**:
  - Definition: Minimal impact, difficult to exploit
  - Examples: Typos in security documentation, deprecation warnings
  - Response time: Patch in next regular release
  - Notification: No specific notification

Scoring system (CVSS):

- Use CVSS v3.1 score (0-10)
- Critical: 9.0-10.0
- High: 7.0-8.9
- Medium: 4.0-6.9
- Low: 0.1-3.9

SLA for remediation:

| Severity | Initial Response | Patch Deployment | User Notification |
|----------|---|---|---|
| Critical | 1 hour | 4-24 hours | Immediate |
| High | 4 hours | 2-7 days | Within 1 week |
| Medium | 1 day | 1 month | Release notes |
| Low | 1 week | Next release | No notification |

**Success Criteria**:

- Severity levels formally defined
- Scoring methodology (CVSS or similar) used
- Response SLAs documented
- SLAs tracked and reported
- Severity classification tested (no ambiguity)

---

## Documentation

All 18 Security-specific items extend the base 40-45 item checklist. When generating a Security variant:

1. Include all base template items (completeness, clarity, consistency, measurability, scenario coverage, edge cases, dependencies, ambiguities)
2. Add these 18 Security-specific items
3. **Total for Security variant**: ~58-63 items (40-45 base + 18 Security-specific)

### Composition Rules

- Security variant items use consistent ID format: `CHK-###-Security-{Dimension}`
- Items are organized by dimension (Completeness, Clarity, Consistency, etc.)
- Security-specific items do not duplicate base template questions
- Overlap is intentional (e.g., "error handling" in base + "breach response" in Security) but from different perspectives

### When to Use Security Variant

Use the Security variant checklist when:

- ✅ Specification handles sensitive data (PII, payment info, health data)
- ✅ Specification requires compliance (GDPR, HIPAA, PCI-DSS, SOC 2)
- ✅ Threat model and attack vectors need definition
- ✅ Access control and authentication are in scope
- ✅ Third-party vendors handle sensitive data

Do not use Security variant for:

- ❌ Internal tools with no external data access
- ❌ Non-sensitive data (public marketing content)
- ❌ Infrastructure-only (no application-level concerns)

---

*Built by 🧱 LightSpeedWP with ☕ and security vigilance*
