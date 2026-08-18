# LightSpeed Planning PRD Plugin — Installation Guide

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
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
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
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

## Prerequisites

- **Claude users:** Claude.ai account or Claude Code
- **Copilot users:** GitHub account with Copilot access
- **OpenAI users:** OpenAI API key
- Basic familiarity with product planning concepts

## Installation Methods

### Method 1: Claude.ai / Claude Code

**Step 1:** Open Claude.ai or Claude Code  
**Step 2:** Access the Plugins section (gear icon → Plugins)  
**Step 3:** Search for "lightspeed-planning-prd"  
**Step 4:** Click "Install"  
**Step 5:** Accept permissions and confirm

**Verify Installation:**

```
/plugins list
# Should show: lightspeed-planning-prd (v2.0.0) ✓ Active
```

### Method 2: GitHub Copilot

**Step 1:** Open your IDE with Copilot enabled (VS Code, JetBrains, etc.)  
**Step 2:** Open Copilot Chat  
**Step 3:** Run command:

```
@lightspeed-planning-prd
```

**Or add to `.vscode/settings.json` (VS Code):**

```json
{
  "github.copilot.plugins": {
    "lightspeed-planning-prd": {
      "version": "2.0.0",
      "enabled": true
    }
  }
}
```

**Verify Installation:**

- Try slash commands: `/prd create`, `/features plan`, `/roadmap create`

### Method 3: OpenAI API

**Step 1:** Get your OpenAI API key from <https://platform.openai.com/api-keys>

**Step 2:** Create or update an assistant:

```bash
curl https://api.openai.com/v1/assistants \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
    "model": "gpt-4-turbo",
    "name": "PRD Agent",
    "description": "Expert product planning agent",
    "tools": [
      {"type": "code_interpreter"},
      {
        "type": "function",
        "function": {
          "name": "create_prd",
          "description": "Generate complete PRD document",
          "parameters": {...}
        }
      }
    ]
  }'
```

**Step 3:** Store your Assistant ID for future use

```bash
export ASSISTANT_ID=asst_...
```

**Verify Installation:**

```bash
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

## Post-Installation Setup

### 1. Configure Your Preferences

**For Claude:**
Edit your system prompt to include specific requirements:

```markdown
# Additional Instructions for PRD Agent
- Always include timeline contingency of 25%
- Format PRDs in Markdown with clear hierarchy
- Validate completeness before final output
```

**For Copilot:**
Create `.copilot/config.json`:

```json
{
  "agents": {
    "prd": {
      "enabled": true,
      "github_integration": true,
      "auto_create_issues": false,
      "sync_to_projects": true
    }
  }
}
```

**For OpenAI:**
Set environment variables:

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_ORG_ID="org-..."  # if applicable
```

### 2. Create Your Workspace

**Claude:**

- Create a new chat for each project/PRD
- Save important PRDs to your library

**Copilot:**

- Create a GitHub issue to track PRD reviews
- Use GitHub Projects for planning tracking

**OpenAI:**

- Store API responses in your workflow system
- Integrate with CI/CD pipelines

### 3. Test the Installation

**Claude:**

```
Create a sample PRD for a note-taking app with:
- Target users: busy professionals
- Key requirement: offline support
- Timeline: 3 months
```

**Copilot:**

```
/prd template
# Select "MVP Note-Taking App"
```

**OpenAI:**

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4-turbo",
    "assistant_id": "'$ASSISTANT_ID'",
    "messages": [
      {
        "role": "user",
        "content": "Create a PRD for a note-taking app"
      }
    ]
  }'
```

## Uninstallation

### Claude

```
/plugins disable lightspeed-planning-prd
/plugins uninstall lightspeed-planning-prd
```

### Copilot

Remove from `.copilot/config.json` or disable in settings.

### OpenAI

Delete the assistant:

```bash
curl -X DELETE https://api.openai.com/v1/assistants/$ASSISTANT_ID \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Troubleshooting

### Plugin not appearing in list

- **Claude:** Clear cache and reload (Cmd/Ctrl + Shift + R)
- **Copilot:** Restart IDE completely
- **OpenAI:** Verify API key and permissions

### Errors during PRD creation

- Check that all required fields are provided
- Review error message for specific missing information
- Try a simpler request first to verify basic functionality

### GitHub integration issues (Copilot)

- Verify GitHub authentication: `gh auth status`
- Check repository permissions: `gh repo view`
- Ensure Copilot has org access: GitHub Settings → Applications

### Rate limits (OpenAI)

- Check usage: <https://platform.openai.com/account/usage/overview>
- Implement exponential backoff for retries
- Request higher limits from OpenAI if needed

### Performance issues

- Claude: Shorter context often helps; break work into smaller pieces
- Copilot: Ensure good network connection to GitHub
- OpenAI: Check API response times on status page

## Security & Permissions

### Data Protection

- PRDs contain potentially sensitive product information
- Only share with authorized team members
- Use GitHub organization-level permissions (Copilot)
- Implement API authentication and rate limiting (OpenAI)

### Best Practices

✅ Don't include credentials in PRDs  
✅ Anonymize customer data in examples  
✅ Version control all PRD artifacts  
✅ Use GitHub branch protection for production PRDs  
✅ Audit changes regularly  

## Getting Help

### Documentation

- **Full Guide:** `.github/agents/prd-agent/AGENT.md`
- **Cookbook:** `cookbook/project-planning-and-prd-playbook.md`
- **Provider Configs:** `agents/prd-agent/{claude,copilot,openai}/agent.md`

### Support Channels

- **Issues:** <https://github.com/lightspeedwp/.github/issues>
- **Discussions:** <https://github.com/lightspeedwp/.github/discussions>
- **Email:** <contact@lightspeedwp.agency>

### Common Questions

**Q: Can I use all three providers for the same PRD?**  
A: Yes! Start with Claude for initial draft, refine in Copilot with GitHub integration, then automate with OpenAI.

**Q: What if I need custom planning templates?**  
A: Edit `agents/prd-agent/shared/core-prompt.md` and rebuild the plugin.

**Q: Can I export PRDs in other formats?**  
A: Currently Markdown and JSON. Other formats available through GitHub Actions.

**Q: How do I update to new versions?**  
A: Claude and Copilot update automatically. For OpenAI, recreate the assistant with new function definitions.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
