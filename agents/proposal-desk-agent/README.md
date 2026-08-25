# Proposal Desk Agent

**Multi-provider AI assistant for generating professional proposals, quotes, and project scopes.**

## Overview

The Proposal Desk Agent automates proposal and quote generation, project scoping, and client communication. Deploy as an intelligent sales assistant for streamlined proposal creation and project estimation.

## Key Features

✅ Professional proposal generation  
✅ Accurate quote creation with pricing models  
✅ Project scope definition and deliverables  
✅ Client communication templates  
✅ Proposal tracking and analytics  
✅ Invoice generation  
✅ Timeline and milestone planning  
✅ Template management and customization  
✅ Multi-format export (PDF, Word, email)  
✅ Integration with Linear, Harvest, and CRM systems  

## Provider Support Matrix

| Provider | Status | Tier | Key Features |
|----------|--------|------|--------------|
| **Claude** | ✅ Production | Full | Professional formatting, deep analysis, document generation |
| **GitHub Copilot** | ✅ Production | Full | GitHub Projects integration, workflow automation |
| **OpenAI** | ✅ Production | Full | API automation, batch processing, function calling |

## Installation & Setup

### Claude

```bash
claude code --agent proposal-desk
```

### GitHub Copilot

```bash
@proposal-desk generate proposal for [client]
```

### OpenAI API

```bash
curl -X POST https://api.openai.com/v1/assistants \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d @openai/assistant-config.json
```

## Usage Examples

### Generate Proposal

```
User: Generate a proposal for website redesign
      Client: Acme Corp
      Budget: $35,000
      Timeline: 10 weeks
      
Agent: 
✓ Creates professional proposal
✓ Defines project scope
✓ Sets realistic timeline
✓ Provides pricing breakdown
✓ Includes terms and conditions
```

### Create Quote

```
User: Create a quote for:
      - Graphic design (60 hours @ $125/hr)
      - Web development (100 hours @ $150/hr)
      - Testing (30 hours @ $100/hr)
      
Agent:
✓ Calculates total: $27,500
✓ Creates professional quote
✓ Includes timeline
✓ Sets validity period
```

### Define Project Scope

```
User: Define scope for e-commerce optimization
      Current state: Basic WooCommerce
      Goals: Performance, conversions, mobile
      
Agent:
✓ Lists all deliverables
✓ Sets success metrics
✓ Creates timeline
✓ Defines resource needs
```

## Configuration

- `AGENT.md` – Complete specification (500+ lines)
- `claude/agent.md` – Claude instructions (400+ lines)
- `claude/tools.json` – Tool schemas (500+ lines)
- `copilot/agent.md` – Copilot skills (400+ lines)
- `copilot/skills.yaml` – YAML definitions (400+ lines)
- `openai/agent.md` – OpenAI setup (400+ lines)
- `openai/tools.json` – Function schemas (500+ lines)
- `shared/core-prompt.md` – Core methodology (800+ lines)

## Security & Compliance

✅ Pricing protection (recommendations only)  
✅ Data privacy for client information  
✅ Legal review flagging  
✅ No auto-send (user approval required)  
✅ Audit trail logging  
✅ Approval workflow  

## Support

- 🐛 [Report issues](https://github.com/lightspeedwp/.github/issues)
- 💡 [Feature requests](https://github.com/lightspeedwp/.github/discussions)
- 📖 [Documentation](./AGENT.md)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.
