# Plugin Hooks

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
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

This folder contains validation and integration hooks for the lightspeed-planning-prd plugin.

## Available Hooks

### agent-spec-validator

Validates PRD agent AGENT.md for multi-provider compliance.

**Trigger:** When AGENT.md changes  
**Validates:**

- YAML frontmatter structure
- Required fields (name, description, providers, capabilities)
- Provider support (claude, copilot, openai)
- Semantic versioning

### multi-provider-consistency-checker

Ensures PRD agent configurations are consistent across providers.

**Trigger:** When any provider config changes  
**Checks:**

- All declared providers have config files
- Shared core-prompt.md exists
- No provider divergence on core capabilities

### plugin-integrity-checker

Validates plugin structure and manifests.

**Trigger:** When plugin manifest changes  
**Validates:**

- Required manifest files present
- Valid JSON in manifests
- Agent/skill references resolve
- Version consistency

### agent-security-auditor

Scans for hardcoded secrets and unsafe patterns.

**Trigger:** On all commits  
**Scans:**

- Credentials (API keys, tokens)
- Sensitive patterns
- Unsafe configurations
- File permissions

## Hook Registry

Hooks are registered in `.github/hooks/hook-registry.json`.

Entry for this plugin:

```json
{
  "plugin": "lightspeed-planning-prd",
  "hooks": [
    {
      "id": "agent-spec-validator",
      "trigger": ["agent.*.md"],
      "enabled": true
    },
    {
      "id": "multi-provider-consistency-checker",
      "trigger": ["*/agent.md", "*/tools.json", "*/skills.yaml"],
      "enabled": true
    },
    {
      "id": "plugin-integrity-checker",
      "trigger": ["**/plugin.json", "**/copilot-plugin.json"],
      "enabled": true
    },
    {
      "id": "agent-security-auditor",
      "trigger": ["**/*.md", "**/*.json", "**/*.js"],
      "enabled": true
    }
  ]
}
```

## Running Hooks

### Locally

```bash
# Run specific hook
node ../../hooks/agent-spec-validator/index.js ./agents/prd-agent/

# Run all hooks for plugin
npm run validate:plugin -- lightspeed-planning-prd
```

### In CI/CD

Hooks run automatically on:

- Pull requests (pre-merge validation)
- Commits to develop (pre-release validation)
- Releases (final validation before deploy)

### Manual Trigger

```bash
# Via GitHub CLI
gh workflow run validation.yml \
  -f plugin=lightspeed-planning-prd \
  -f hook=agent-spec-validator

# Via CLI
npm run validate
```

## Hook Output

When a hook passes:

```
✅ agent-spec-validator: ./agents/prd-agent is valid
```

When a hook fails:

```
❌ plugin-integrity-checker: Missing manifest .claude-plugin/plugin.json
   Context: Check that all required manifests exist
   Fix: Create missing manifest or update hook configuration
   Docs: See .github/hooks/plugin-integrity-checker/README.md
```

## Disabling Hooks

To temporarily disable a hook (not recommended):

```json
{
  "id": "agent-spec-validator",
  "enabled": false,
  "reason": "Debugging custom validation logic"
}
```

## Creating Custom Hooks

To add plugin-specific hooks:

1. Create folder: `plugins/lightspeed-planning-prd/hooks/{hook-name}/`
2. Create `index.js` with hook logic
3. Create `package.json` with dependencies
4. Register in `.github/hooks/hook-registry.json`
5. Document in this README

Example structure:

```
hooks/
├── custom-hook/
│   ├── index.js
│   ├── package.json
│   ├── __tests__/
│   │   └── custom-hook.test.js
│   └── README.md
```

## Testing Hooks

```bash
# Run hook tests
npm test -- hooks/

# Run with coverage
npm test -- hooks/ --coverage
```

## References

- **Hook Registry:** `.github/hooks/hook-registry.json`
- **Hook Docs:** `.github/hooks/{hook-name}/README.md`
- **Examples:** `.github/hooks/agent-spec-validator/`

---

*🎼 Orchestrated automation — where intelligence meets operations*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)
