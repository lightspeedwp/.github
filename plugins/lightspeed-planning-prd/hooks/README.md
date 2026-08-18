# Plugin Hooks

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
