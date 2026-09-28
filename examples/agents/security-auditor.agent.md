---
name: Security Auditor
# Another governance agent, but focused on security rather than content

description: >
  Continuous security auditing agent that monitors infrastructure, applications,
  and data for security vulnerabilities, compliance violations, and suspicious
  activity. Performs automated security scanning, generates audit reports, and
  tracks security metrics over time. Supports multiple frameworks (CIS, NIST,
  PCI-DSS, HIPAA) and integrates with SIEM platforms and incident management.
# Security auditing is a governance function ensuring compliance with security policies

file_type: .agent.md

category: governance
# Security auditing enforces security policies (governance)
# Similar to Content Moderator but for security instead of content

status: active

version: 2.0.0
# Major version 2.0 indicates significant architectural changes
# The .0.0 shows this is the initial release of v2

created_date: 2026-07-15
# This is an older agent (created before previous examples)

updated_date: 2026-09-03
# Recently updated with improvements and new capabilities

created_by: claude@lightspeedwp.agency

last_updated_by: claude@lightspeedwp.agency

approval_status: approved

implementation_reference: agents/security-auditor/
# Security agents often have integration with multiple external systems

supported_platforms: [aws, gcp, azure, kubernetes, on-premise, api]
# Security auditors run across cloud and on-premise infrastructure

required_capabilities: [vulnerability_scanning, compliance_checking, incident_detection, log_analysis]
# Different capabilities focused on security analysis

tags: [security, audit, compliance, vulnerability-scanning, incident-detection, siem]

---

## Overview

The Security Auditor agent is a governance-class agent designed to perform continuous security auditing across cloud infrastructure, applications, and data systems. It identifies vulnerabilities, checks compliance with security frameworks, detects suspicious activity, and generates audit reports for security teams and compliance officers.

### Key Capabilities

- **Vulnerability Scanning:** Identifies known and zero-day vulnerabilities in code, dependencies, and infrastructure
- **Compliance Checking:** Validates compliance with standards (CIS, NIST, PCI-DSS, HIPAA, SOC2)
- **Configuration Audit:** Reviews system configurations for security misconfigurations
- **Access Control Audit:** Validates authentication and authorization policies
- **Encryption Validation:** Checks encryption in transit and at rest
- **Threat Detection:** Analyzes logs and metrics for suspicious patterns
- **Remediation Tracking:** Monitors remediation progress for identified issues
- **Reporting:** Generates audit reports, compliance reports, and risk assessments

### Supported Compliance Frameworks

- CIS Benchmarks (CIS Controls, AWS CIS Benchmark)
- NIST Cybersecurity Framework (NIST 800-53)
- PCI-DSS (Payment Card Industry Data Security Standard)
- HIPAA (Health Insurance Portability and Accountability Act)
- SOC2 Type I and Type II
- GDPR (General Data Protection Regulation)
- ISO 27001 (Information Security Management)
- Custom organizational policies

## Implementation Requirements

### Directory Structure

```
agents/security-auditor/
├── SKILL.md                        # Technical documentation
├── README.md                       # User-facing documentation
├── src/
│   ├── vulnerability-scanner.js   # Vulnerability identification
│   ├── compliance-engine.js       # Compliance checking
│   ├── threat-detector.js         # Anomaly and threat detection
│   ├── log-analyzer.js            # Security log analysis
│   ├── remediation-tracker.js     # Track issue remediation
│   ├── report-generator.js        # Generate audit reports
│   └── framework-validator.js     # Validate against compliance frameworks
├── rules/
│   ├── cis-benchmarks.yaml
│   ├── nist-controls.yaml
│   ├── pci-dss-rules.yaml
│   └── custom-policies.yaml
└── tests/
    ├── vulnerability-scanner.test.js
    ├── compliance-engine.test.js
    ├── threat-detector.test.js
    └── report-generator.test.js
```

### Dependencies

- Vulnerability databases (NVD, CVE, GHSA)
- Cloud provider SDKs (AWS, GCP, Azure)
- Kubernetes client libraries
- SIEM integrations (Splunk, DataDog, New Relic)
- Configuration scanning tools (Checkov, kube-bench)
- Log analysis libraries (ELK Stack, Loki)
- SSL/TLS certificate validators

### Configuration Example

```yaml
# Security Auditing Configuration
auditing:
  frequency: daily              # Run daily audits
  frameworks: [cis, nist, pci]  # Enabled frameworks
  
  # Scan targets
  targets:
    cloud:
      - type: aws
        regions: [us-east-1, us-west-2, eu-west-1]
        services: [ec2, s3, rds, iam]
    kubernetes:
      - cluster: production
        namespaces: [default, kube-system]
      - cluster: staging
        namespaces: [default]
  
  # Severity thresholds
  severity_rules:
    critical: 
      max_age: 24_hours    # Must be resolved within 24 hours
      escalation: immediate
    high:
      max_age: 7_days
      escalation: next_business_day
    medium:
      max_age: 30_days
      escalation: weekly
    low:
      max_age: 90_days
      escalation: quarterly
  
  # Reporting
  reporting:
    formats: [html, pdf, json]
    recipients: [security-team@example.com]
    schedule: weekly
```

## Usage Examples

### Example 1: Infrastructure Compliance Audit

```
Input: AWS account with EC2, S3, RDS instances
Process:
  1. Connect to AWS account with provided credentials
  2. Enumerate all resources in configured regions
  3. Check each resource against CIS Benchmark rules
  4. Review IAM policies for least privilege violations
  5. Check encryption settings for data at rest and in transit
  6. Validate security group rules for overly permissive access
  7. Compile compliance report with findings
  8. Generate remediation recommendations
Output: CIS Benchmark compliance report with 47 findings and remediation steps
```

### Example 2: Container Security Scanning

```
Input: Kubernetes cluster with 150 running pods
Process:
  1. Connect to Kubernetes cluster API
  2. Enumerate all running pods and images
  3. Scan container images for vulnerabilities
  4. Check pod security policies
  5. Review network policies for proper segmentation
  6. Validate RBAC configuration
  7. Check resource quotas and limits
  8. Generate Kubernetes security assessment
Output: 12 high-priority vulnerabilities identified, remediation plan created
```

### Example 3: Threat Detection from Logs

```
Input: Application logs from past 24 hours
Process:
  1. Ingest logs from centralized logging system
  2. Parse logs for security-relevant events
  3. Apply threat detection rules
  4. Detect patterns: brute force attempts, SQL injection attempts, unusual access
  5. Correlate events across services
  6. Calculate risk scores
  7. Alert security team for immediate threats
  8. Generate daily threat summary report
Output: 3 alerts sent for investigation + daily summary report
```

### Example 4: Compliance Status Tracking

```
Input: Organization-wide audit from last month + today's audit
Process:
  1. Load previous audit results
  2. Run current comprehensive audit
  3. Compare findings between audits
  4. Track resolution status for remediation items
  5. Calculate compliance trend (improving/declining)
  6. Generate compliance dashboard update
  7. Forecast compliance status for next quarter
  8. Generate stakeholder report
Output: Compliance trending report with forecast and recommendations
```

## Validation Rules

- **Framework:** Must be one of: cis, nist, pci, hipaa, soc2, iso27001
- **Severity Level:** Must be one of: critical, high, medium, low, info
- **Status:** Must be one of: open, in-progress, resolved, accepted-risk
- **Remediation Deadline:** Must be valid date after current date

## Error Handling

The agent must handle:

- Authentication failures to cloud providers
- Network connectivity issues
- Rate limiting from APIs
- Credential expiration/rotation
- Partial scan failures (some resources inaccessible)
- Malformed configuration files
- Database connection failures

## Performance Considerations

- Full scan of large infrastructure: < 30 minutes
- Incremental scanning for changes: < 5 minutes
- Log analysis: Process in batches to manage memory
- Database queries: Use indexing and caching
- API rate limiting: Respect quota limits and backoff

## Security Considerations

- All credentials stored in secure vaults (HashiCorp Vault, AWS Secrets Manager)
- Audit logs encrypted and immutable
- Agents run in isolated sandboxes
- Findings and audit data encrypted at rest
- Access to audit reports restricted by role
- All agent operations logged for compliance

## Integration Points

- Cloud provider APIs (AWS, GCP, Azure)
- Kubernetes API servers
- SIEM platforms (Splunk, Datadog)
- Ticketing systems (Jira, ServiceNow) for remediation tracking
- Notification systems (Slack, PagerDuty, email)
- Compliance management platforms

## Reporting

The agent generates multiple report types:

- **Executive Summary:** High-level risk overview for executives
- **Compliance Report:** Framework-specific compliance status
- **Vulnerability Report:** Detailed vulnerability findings
- **Remediation Report:** Tracked remediation progress
- **Risk Assessment:** Risk scoring and prioritization
- **Metrics Dashboard:** Security KPIs and trends

## Escalation & Alerts

- Critical findings trigger immediate alerts
- Escalation paths based on severity
- Integration with incident response (PagerDuty, VictorOps)
- Automated ticket creation for findings
- SLA enforcement with time-based alerts

## Continuous Monitoring

- Scheduled audits (daily, weekly, monthly)
- Event-triggered scans (on deployment, config change)
- Real-time threat detection from logs
- Compliance drift monitoring
- Trend analysis and forecasting

## Related Specifications

- **Content Moderator:** Handles policy enforcement like this agent
- **Documentation Generator:** Creates audit documentation and reports
- **Data Analyst:** Analyzes security metrics and trends

## Compliance References

- CIS Benchmarks: <https://www.cisecurity.org/>
- NIST Framework: <https://www.nist.gov/cyberframework>
- PCI-DSS: <https://www.pcisecuritystandards.org/>
- HIPAA: <https://www.hhs.gov/hipaa/>
- ISO 27001: <https://www.iso.org/isoiec-27001-information-security-management.html>

---

For technical implementation, see [SKILL.md](agents/security-auditor/SKILL.md)  
For usage and configuration, see [README.md](agents/security-auditor/README.md)  
For troubleshooting, see [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)  
For compliance framework details, see [API_REFERENCE.md](docs/API_REFERENCE.md)
