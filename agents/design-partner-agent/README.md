---
file_type: 'documentation'
title: 'Design Partner Agent'
description: 'Multi-provider AI design consultant for design systems, accessibility assessment, and UI/UX review'
version: '1.0.1'
created_date: '2026-07-22'
last_updated: "2026-08-19"
maintainer: 'LightSpeed Team'
authors:
  - LightSpeed Team
license: 'GPL-3.0'
stability: 'stable'
status: 'production'
domain: 'design'
focus: 'partner-collaboration'
tags:
  - design
  - accessibility
  - figma
  - design-systems
  - ui-ux
---

# Design Partner Agent

**Multi-provider AI design consultant for design systems, accessibility assessment, and collaborative design work.**

## Overview

The Design Partner Agent provides expert design consultation across Figma, design systems, and accessibility standards. Deploy as a design partner for strategic guidance, design system audits, component documentation, and WCAG 2.2 AA compliance assessment.

### Domain Coverage

- **Design Systems** – Architecture, component libraries, token management
- **Accessibility** – WCAG 2.2 AA compliance, color contrast, semantic markup
- **UI/UX Review** – Design quality, interaction patterns, visual consistency
- **Figma Integration** – File inspection, token extraction, Code Connect mapping
- **Documentation** – Component specs, design decisions, usage guidelines

## Key Features

✅ Design system analysis and validation  
✅ WCAG 2.2 AA accessibility audits  
✅ Component documentation and specifications  
✅ Design token extraction and management  
✅ Figma design file integration  
✅ Color contrast and readability assessment  
✅ Design decision record generation  
✅ Multi-provider design sync  
✅ Responsive design review  
✅ Component variant documentation  

## Provider Support Matrix

| Provider | Status | Tier | Key Features |
|----------|--------|------|--------------|
| **Claude** | ✅ Production | Full | Deep analysis, streaming, file operations, design token export |
| **GitHub Copilot** | ✅ Production | Full | GitHub Projects integration, design sync, workflows |
| **OpenAI** | ✅ Production | Full | Function calling, API automation, batch processing |

### Provider Strengths

**Claude:** Best for in-depth design analysis, design system audits, comprehensive documentation generation  
**Copilot:** Best for GitHub-native workflows, design sync with repos, GitHub Projects integration  
**OpenAI:** Best for API automation, design tooling integration, batch processing workflows  

## Installation & Setup

### Claude Integration

```bash
# 1. Enable agent in Claude Code
claude code --agent design-partner

# 2. Configure Figma API access in .claude/settings.json

<!-- security:documentation-example - placeholder value, not a real credential -->
```json
{
  "agents": {
    "design-partner": {
      "enabled": true,
      "integrations": {
        "figma": {
          "api_key": "YOUR_FIGMA_API_KEY_HERE"
        }
      }
    }
  }
}
```

# 3. Verify configuration

claude agent validate design-partner

```

## GitHub Copilot Integration

```bash
# 1. Install skill in GitHub Copilot
gh extension install lightspeedwp/copilot-design-partner

# 2. Configure in .github/copilot-config.yml
agents:
  design-partner:
    enabled: true
    skills:
      - design-system-analysis
      - accessibility-audit
      - component-documentation

# 3. Enable in GitHub Projects
gh project configure --agent design-partner
```

## OpenAI Integration

```bash
# 1. Configure API credentials
export OPENAI_API_KEY="sk-..."

# 2. Update agent configuration
curl -X POST https://api.openai.com/v1/assistants \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @openai/assistant-config.json

# 3. Deploy function schemas
cp openai/tools.json /path/to/openai-functions/
```

## Usage Examples

### Design System Audit (Claude)

```bash
claude chat --agent design-partner

User: > Audit our design system in Figma.
      > Check component consistency, verify accessibility,
      > and document all design tokens.
      > File: https://figma.com/file/abc123/design-system

Agent: 
[Connects to Figma API, analyzes file structure]
[Extracts and validates design tokens]
[Checks color contrast ratios]
[Generates comprehensive audit report]

Output:
- Design System Audit Report (Markdown)
- Token Documentation (JSON/CSV)
- Component Inventory
- Accessibility Compliance Checklist
- Remediation Roadmap
```

### Accessibility Review (Copilot)

```github-copilot
@design-partner review this design for WCAG 2.2 AA compliance
figma-file: https://figma.com/file/xyz789/marketing-site

Agent analyzes:
- Color contrast ratios
- Semantic structure
- Interactive element states
- Responsive accessibility
- Focus management

Outputs:
- GitHub Issue with accessibility violations
- Pull request with design recommendations
- Automated accessibility report
```

### Component Documentation (OpenAI)

```bash
curl -X POST https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "assistant_id": "asst_design_partner",
    "messages": [{
      "role": "user",
      "content": "Generate component documentation for Button family including all variants and states"
    }]
  }'

Agent generates:
- Component specification document
- Variant and state matrix
- Usage guidelines
- Code examples
- Accessibility requirements
```

## Core Capabilities

### 1. Design System Analysis

- Component library structure review
- Token organization assessment
- Design pattern identification
- Consistency checking across components

### 2. Accessibility Assessment

- WCAG 2.2 AA compliance verification
- Color contrast ratio analysis
- Keyboard navigation review
- Screen reader compatibility check
- Focus management assessment

### 3. Component Documentation

- Specification generation
- Variant and state documentation
- Usage guidelines and examples
- Props and API documentation
- Code Connect mapping

### 4. Design Token Management

- Token extraction from Figma
- Token naming conventions
- Token hierarchy validation
- Export to multiple formats (JSON, CSS, JavaScript)

### 5. Figma Integration

- Design file inspection and analysis
- Component variant mapping
- Design token extraction
- Code Connect integration
- Design-to-code documentation

### 6. UI/UX Review

- Visual consistency assessment
- Interaction pattern review
- Responsive design validation
- Usability heuristics evaluation
- Design quality scoring

## Configuration Files

| File | Purpose | Size |
|------|---------|------|
| `AGENT.md` | Complete agent specification | 500-700 lines |
| `claude/agent.md` | Claude-specific instructions | 400-500 lines |
| `claude/tools.json` | Claude tool schemas | 500-700 lines |
| `copilot/agent.md` | Copilot skill definitions | 400-500 lines |
| `copilot/skills.yaml` | YAML skill specifications | 400-500 lines |
| `openai/agent.md` | OpenAI API configuration | 400-500 lines |
| `openai/tools.json` | OpenAI function schemas | 500-700 lines |
| `shared/core-prompt.md` | Provider-agnostic methodology | 800-1000 lines |

## Quick Command Reference

```bash
# Claude Code
claude agent enable design-partner
claude chat --agent design-partner

# GitHub Copilot
@design-partner analyze design-system
@design-partner audit accessibility

# OpenAI API
openai assistant call design-partner
```

## Security & Compliance

- ✅ Read-only Figma access (design team maintains source of truth)
- ✅ WCAG 2.2 AA compliance verification
- ✅ No credential exposure
- ✅ Audit trail for all design reviews
- ✅ GDPR and CCPA compliant
- ✅ Design IP protection

## Troubleshooting

**Issue:** Figma API connection fails  
**Solution:** Verify Figma API key in environment variables and API rate limits  

**Issue:** Design tokens not extracting correctly  
**Solution:** Ensure design file has proper token naming conventions and plugin installed  

**Issue:** Color contrast calculation differs from Figma  
**Solution:** Use WCAG AA formula verification; some tools may use different calculation methods  

## Related Resources

- [AGENT.md](./AGENT.md) – Complete agent specification
- [claude/agent.md](./claude/agent.md) – Claude implementation
- [copilot/agent.md](./copilot/agent.md) – Copilot integration
- [openai/agent.md](./openai/agent.md) – OpenAI setup
- [shared/core-prompt.md](./shared/core-prompt.md) – Core methodology
- [Figma API Docs](https://www.figma.com/developers/api)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

## Support

For issues, feature requests, or agent improvements:

- 🐛 [Report issues](https://github.com/lightspeedwp/.github/issues)
- 💡 [Feature requests](https://github.com/lightspeedwp/.github/discussions)
- 📖 [Documentation](./AGENT.md)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Repository Flow

```mermaid
graph LR
    A["Scope"] --> B["Inputs"]
    B --> C["Process"]
    C --> D["Validation"]
    D --> E["Outputs"]

    style A fill:#4a148c,color:#fff
    style B fill:#1b5e20,color:#fff
    style C fill:#bf360c,color:#fff
    style D fill:#f57f17,color:#fff
    style E fill:#00695c,color:#fff
```
