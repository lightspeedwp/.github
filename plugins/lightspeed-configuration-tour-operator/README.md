# LightSpeed Configuration Tour Operator Plugin

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

Multi-provider plugin bundle for the Tour Operator Configuration Agent, providing tour operator site configuration, auditing, and optimisation capabilities across Claude, GitHub Copilot, OpenAI, and native platforms.

## Overview

This plugin extends the Tour Operator Configuration Agent with integrated tools,
skills, and manifest definitions across multiple AI providers and platforms.

### Capability Matrix

| Capability | Claude | Copilot | OpenAI | Native |
| --- | --- | --- | --- | --- |
| Site analysis | ✅ | ✅ | ✅ | ✅ |
| Architecture recommendations | ✅ | ✅ | ✅ | ✅ |
| Setup validation | ✅ | ✅ | ✅ | ✅ |
| Optimisation planning | ✅ | ✅ | ✅ | ✅ |
| Booking system configuration | ✅ | ✅ | ✅ | ✅ |
| GitHub integration | ⚠️ | ✅ | ⚠️ | - |
| WordPress direct integration | ✅ | ⚠️ | ✅ | - |
| BugHerd integration | ⚠️ | ⚠️ | ⚠️ | ⚠️ |

*(✅ = full support, ⚠️ = optional/approval-gated, - = not applicable)*

## Installation

### For Claude Code / Claude API

```bash
# Copy agent definition
cp -r ../.github/agents/tour-operator-config-agent /path/to/agents/

# Load provider config
source claude/agent.md claude/tools.json
```

### For GitHub Copilot

Import `copilot-plugin.json` into Copilot Chat workspace:

```bash
# In VS Code or GitHub.com
# Copilot Chat → Settings → Skills → Import
# Select: copilot-plugin.json
```

### For OpenAI API

Register functions from `openai-functions.json`:

```python
import json
import openai

with open('openai-functions.json') as f:
  functions = json.load(f)['functions']

response = openai.ChatCompletion.create(
  model="gpt-4-turbo",
  functions=functions,
  function_call="auto"
)
```

### For Native Integration (WordPress, Slack, etc.)

Manifests available in provider-specific subdirectories:

- `.claude-plugin/` — Claude desktop/mobile plugin format
- `.codex-plugin/` — GitHub Codex plugin format
- `.gemini-plugin/` — Google Gemini plugin format
- `.wordpress-plugin/` — WordPress admin plugin format (if applicable)

## Files & Structure

```
lightspeed-configuration-tour-operator/
├── README.md (this file)
├── INSTALL.md (detailed setup instructions)
├── copilot-plugin.json (GitHub Copilot manifest)
├── openai-functions.json (OpenAI function schema)
├── .claude-plugin/ (Claude plugin format)
│   ├── manifest.json
│   ├── agent.md
│   └── tools.json
├── .codex-plugin/ (GitHub Codex format)
│   ├── codex.json
│   └── skills.yaml
├── .gemini-plugin/ (Google Gemini format)
│   ├── gemini-manifest.json
│   └── agent-config.yaml
└── .wordpress-plugin/ (WordPress integration, if applicable)
    ├── plugin.php
    └── admin-page.php
```

## Quick Start

### Audit a Tour Operator Site (Claude)

```markdown
**Prompt:** "Audit our Southern Destinations staging site for tour operator configuration readiness."

**Agent Response:**
1. Calls `site_analyzer` to inspect site
2. Returns: WordPress version, plugins, custom post types, findings
3. Provides: Confirmed findings, risks, remediation roadmap
4. Asks: Next steps (validation, optimisation planning)?
```

### Design a Booking System (All Providers)

```markdown
**Prompt:** "Design a booking system for group adventure tours with deposits."

**Agent Response:**
1. Calls `architecture_recommender` with tour type and requirements
2. Returns: Recommended plugin stack, CPT structure, Gravity Forms workflow
3. Provides: Payment flow design, automation setup
4. Includes: Implementation roadmap with phases and effort estimates
```

### Pre-Launch Validation (Copilot)

```markdown
**Prompt:** "@tour-operator-config Is our site ready to launch?"

**Copilot Response:**
1. Calls `setup_validator` with full validation scope
2. Returns: Component-by-component validation report
3. Identifies: Blockers, important issues, improvements
4. Delivers: Go/no-go recommendation with justification
```

## Security & Privacy

- **Staging-first:** Default to inspecting staging environments before live sites
- **Read-first:** Analyse current state before recommending changes
- **Approval-gated:** Writes require explicit user authorisation
- **No secrets:** Never store or emit credentials, API keys, or sensitive data
- **GDPR/Privacy:** Respects customer data boundaries and privacy regulations
- **Compliance:** Validates PCI compliance for payment handling

See `INSTALL.md` for full security configuration.

## Supported Models & Providers

| Provider | Recommended Model | Supported Models |
| --- | --- | --- |
| Claude | claude-opus-4-8 | claude-opus-4-7, claude-sonnet-5 |
| Copilot | gpt-4-turbo | gpt-4, gpt-3.5-turbo, gpt-4o |
| OpenAI | gpt-4-turbo | gpt-4, gpt-4o, gpt-3.5-turbo |
| Gemini | Gemini Pro | Gemini Flash, Gemini Ultra |

## Configuration Options

### Required

- **Site identifier** — Which WordPress site to audit (URL or connected app name)
- **Scope** — Type of review (audit, validation, optimisation, architecture)

### Optional

- **Reference standard** — Validation standard (default: lightspeed-tour-operator)
- **Constraints** — Budget, timeline, technical capacity for planning
- **Tour types** — Specific tour types offered (guides architecture recommendations)

See `INSTALL.md` for full configuration guide.

## Troubleshooting

### "Site not found"

Ensure site identifier matches a connected WordPress app or provide full URL
(<https://example.com>). Check available sites:

```
@tour-operator-config What sites are connected?
```

### "Plugin incompatibility detected"

Plugin versions may be outdated or conflicting. Run full validation:

```
@tour-operator-config Validate plugin coherence for [site-name]
```

### "Function not available"

Check that provider is configured and plugin is properly installed. For Claude:
verify `claude/tools.json` is loaded. For Copilot: verify `copilot-plugin.json`
is imported. For OpenAI: verify functions are registered.

## Support & Feedback

Report issues, request features, or submit feedback:

- **GitHub Issues:** [LightSpeedWP/.github](https://github.com/lightspeedwp/.github/issues)
- **Email:** [Contact LightSpeedWP](https://lightspeedwp.agency/contact)
- **Chat:** [@tour-operator-config in Copilot Chat](https://github.com/)

## Maintained By

🤖 LightSpeedWP Automation Team

[AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [Contact](https://lightspeedwp.agency/contact)

---

*Built by LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
