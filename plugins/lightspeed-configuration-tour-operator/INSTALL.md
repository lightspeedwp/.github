# Installation & Setup Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

Complete setup instructions for the Tour Operator Configuration Agent plugin across
all supported providers.

## Table of Contents

1. [Requirements](#requirements)
2. [Claude Installation](#claude-installation)
3. [GitHub Copilot Installation](#github-copilot-installation)
4. [OpenAI Installation](#openai-installation)
5. [Configuration](#configuration)
6. [Verification](#verification)
7. [Security Setup](#security-setup)
8. [Troubleshooting](#troubleshooting)

## Requirements

### Universal

- Access to a tour operator WordPress site (staging preferred)
- UK English language settings
- Git repository with plugin files

### Per Provider

**Claude:**

- Claude Code IDE or Claude API access
- `claude-opus-4-8` or equivalent model

**GitHub Copilot:**

- GitHub Copilot Chat enabled
- VS Code or GitHub.com access
- Organization/personal Copilot subscription

**OpenAI:**

- OpenAI API key with function calling support
- `gpt-4-turbo` or equivalent model
- Python or JavaScript runtime

## Claude Installation

### 1. Copy Agent Files

```bash
# Navigate to agents directory
cd /path/to/.github/agents

# Copy tour operator config agent
cp -r tour-operator-config-agent your-workspace/
cd tour-operator-config-agent

# Verify structure
ls -la claude/
# Expected: agent.md, tools.json
```

### 2. Load in Claude Code

In Claude Code IDE:

1. **Open the agent folder:** File → Open → select
   `tour-operator-config-agent/`
2. **Review AGENT.md:** Read the main specification
3. **Load tools:** Copy contents of `claude/tools.json` into Claude's tools
   configuration
4. **Test:** Ask "Audit a WordPress site" to verify function availability

### 3. Connect WordPress Site (Optional)

If using connected WordPress apps in Claude:

1. Add WordPress site connection in Claude settings
2. Reference site by name in prompts (e.g., "audit Southern Destinations
   staging")
3. Test connection: `@tour-operator-config Check WordPress connection`

### 4. Verify Installation

```
Prompt: "Audit the Southern Destinations staging site for tour operator readiness."

Expected: Agent calls site_analyzer function and returns current state snapshot
```

## GitHub Copilot Installation

### 1. Prepare Copilot Plugin

```bash
# Copy plugin manifest
cp copilot-plugin.json your-workspace/

# Verify content
cat copilot-plugin.json | jq '.name, .description'
```

### 2. Import into Copilot Chat

**In VS Code:**

1. Open Copilot Chat sidebar (Ctrl+Shift+I / Cmd+Shift+I)
2. Settings → Extensions → Configure Copilot
3. Look for "Skills" or "Agent Configuration"
4. Import `copilot-plugin.json`
5. Enable all five skills:
   - wordpress-site-analysis
   - woo-setup-optimization
   - tour-booking-config
   - performance-tuning
   - security-hardening

**On GitHub.com:**

1. Go to Settings → Copilot Chat
2. Select "Workspace Settings" or "Organization Settings"
3. Add custom instructions from `copilot/agent.md`
4. Import skills from `copilot/skills.yaml`

### 3. Configure Skills

Edit `copilot/skills.yaml` to match your environment:

```yaml
context_awareness:
  repository_structure: "lightspeedwp/.github"  # Your repo path
  slack_integration: "enabled"  # If using Slack
  github_projects: "tour-ops"  # Your project name
```

### 4. Verify Installation

```
Prompt: "@tour-operator-config audit Southern Destinations staging"

Expected: Agent responds with site analysis and key findings
```

## OpenAI Installation

### 1. Prepare Function Schema

```bash
# Copy function definitions
cp openai-functions.json your-project/

# Verify JSON syntax
jq '.' openai-functions.json > /dev/null && echo "Valid JSON"
```

### 2. Register Functions in OpenAI API

**Python Example:**

```python
import json
import openai

# Load function schema
with open('openai-functions.json') as f:
    config = json.load(f)
    functions = config['functions']

# Create client
openai.api_key = "your-api-key"

# Register functions
messages = [
    {
        "role": "system",
        "content": """You are the Tour Operator Configuration Agent...
        [Insert system prompt from openai/agent.md]
        """
    },
    {
        "role": "user",
        "content": "Audit my tour operator site for readiness."
    }
]

# Call with functions
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=messages,
    functions=functions,
    function_call="auto"
)
```

**JavaScript/Node.js Example:**

```javascript
const OpenAI = require("openai");
const fs = require("fs");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const config = JSON.parse(
  fs.readFileSync("openai-functions.json", "utf-8")
);

const response = await client.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [
    {
      role: "system",
      content: `You are the Tour Operator Configuration Agent...
      [Insert system prompt from openai/agent.md]`,
    },
    {
      role: "user",
      content: "Audit my tour operator site.",
    },
  ],
  functions: config.functions,
  function_call: "auto",
});
```

### 3. Configure Environment

```bash
# Set API key
export OPENAI_API_KEY="sk-..."

# Optional: set model and other settings
export OPENAI_MODEL="gpt-4-turbo"
export TOUR_OPERATOR_STANDARD="lightspeed-tour-operator"
```

### 4. Verify Installation

```bash
# Run test script
node test-openai.js

# Expected output:
# ✅ Function registration successful
# ✅ Test audit completed
# ✅ Response includes site_analyzer result
```

## Configuration

### Global Configuration

Create `.env` or configuration file:

```bash
# WordPress site URLs
STAGING_SITE_URL="https://staging.example.com"
LIVE_SITE_URL="https://example.com"

# Plugin stack
PLUGIN_STACK="gravity-forms,yoast-seo,woocommerce"

# Tour operator standard
TOUR_OPERATOR_STANDARD="lightspeed-tour-operator"

# Validation strictness
VALIDATION_STRICTNESS="moderate"  # lenient, moderate, strict

# Language
LANGUAGE="en-GB"  # UK English

# Logging
LOG_LEVEL="info"  # debug, info, warn, error
```

### Per-Provider Configuration

**Claude:**

Edit `claude/agent.md` to customize model, temperature, and max tokens:

```yaml
deployment:
  model: "claude-opus-4-8"
  temperature: 0.7
  max_tokens: 2048
```

**Copilot:**

Edit `copilot/agent.md` to customize chat behavior:

```yaml
chat:
  response_style: "professional-practical"
  detail_level: "structured-with-examples"
  formatting: "markdown-tables-and-lists"
```

**OpenAI:**

Set model and parameters:

```python
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",  # or gpt-4, gpt-4o
    temperature=0.7,
    max_tokens=2048,
    functions=functions,
    function_call="auto"
)
```

## Verification

### Claude Verification

```
Prompt: "List your available capabilities and tools"

Expected response should include:
- site_analyzer
- architecture_recommender
- setup_validator
- optimization_planner
- booking_system_configurator
```

### Copilot Verification

```
Prompt: "@tour-operator-config What skills are available?"

Expected response should list:
- wordpress-site-analysis
- woo-setup-optimization
- tour-booking-config
- performance-tuning
- security-hardening
```

### OpenAI Verification

```python
response = openai.ChatCompletion.create(
    model="gpt-4-turbo",
    messages=[
        {"role": "user", "content": "List available functions"}
    ],
    functions=functions
)
print(response.choices[0].message)

# Expected: Should reference available functions
```

## Security Setup

### 1. Environment Variables

Never commit secrets. Use environment variables for:

```bash
# WordPress credentials (never expose in configs)
WP_ADMIN_USER="admin"
WP_ADMIN_PASS="[use .env or secrets manager]"

# API keys
OPENAI_API_KEY="[use .env or secrets manager]"
CLAUDE_API_KEY="[use environment]"

# Site URLs
STAGING_SITE_URL="https://staging.example.com"
LIVE_SITE_URL="https://example.com"
```

### 2. Approval Gating

For write operations (WordPress changes, issue creation), require approval:

```python
# Example: Before making changes
print("Proposed changes:")
print(f"  - Update plugin X to version Y")
print(f"  - Configure Gravity Form Z")
approval = input("Approve changes? (yes/no): ")
if approval.lower() != "yes":
    print("Cancelled.")
else:
    # Make changes
    apply_changes()
```

### 3. Audit Logging

Enable audit logging for all operations:

```bash
# Enable detailed logging
export LOG_LEVEL="debug"
export LOG_FILE="tour-operator-audit.log"

# Log all function calls
agent.on('function_call', lambda call: 
  logger.info(f"Called: {call['name']} with {call['arguments']}")
)
```

### 4. Data Privacy

Configure data handling:

```yaml
privacy:
  redact_customer_data: true
  redact_payment_info: true
  redact_credentials: true
  log_retention_days: 30
```

## Troubleshooting

### Functions Not Available

**Symptom:** "Unknown function" error

**Solutions:**

1. Verify `tools.json` (Claude) or `functions.json` (OpenAI) is loaded
2. Check function names match exactly (case-sensitive)
3. Restart Claude Code / Copilot / OpenAI client
4. Reinstall plugin

### Site Not Found

**Symptom:** "Site identifier not recognised"

**Solutions:**

1. Verify site URL is correct (<https://example.com>, not example.com)
2. Check WordPress site is online and accessible
3. List available connected sites: `@tour-operator-config List sites`
4. Use full URL instead of name if connection failing

### Function Timeout

**Symptom:** Function call hangs or times out after 30+ seconds

**Solutions:**

1. Narrow scope: use specific scope (e.g., `scope="plugin-stack"`) instead of
   full audit
2. Check site is responding: `ping example.com`
3. Increase timeout: set `timeout=60` in function parameters
4. Try with smaller site or simplified request

### Permission Denied

**Symptom:** "Permission denied" when accessing WordPress site

**Solutions:**

1. Verify API credentials in environment variables
2. Check user role has sufficient permissions (Editor or Admin required for
   config inspection)
3. Enable WordPress REST API if needed: `wp rest-api --enable`
4. Verify user is not blocked by security plugin

## Next Steps

1. [Review AGENT.md](../AGENT.md) for full agent specification
2. [Read security policy](../.github/security-policy.md) for guardrails
3. [Check tour operator standards](../agent/references/) for best practices
4. [Run first audit](#verification) with staging site
5. [Schedule optimisation planning](#configuration) for production readiness

---

*Installation guide maintained by 🤖 LightSpeedWP Automation Team*

[Contact](https://lightspeedwp.agency/contact) for support or questions.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
