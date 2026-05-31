---
title: "Agent Slide Deck Prompts"
description: "NotebookLM and design-ready prompts for creating agent-specific slide presentations"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Agent Slide Deck Prompts

Customizable presentation prompts for each LightSpeedWP agent. Use these with NotebookLM, Figma, or your preferred design tool to generate agent-specific slide decks.

## Available Agents

Each agent has a dedicated slide generation prompt:

1. **[Release Agent](./RELEASE_AGENT_SLIDES.md)** - Automation, versioning, and release pipeline orchestration
2. **[Branding Agent](./BRANDING_AGENT_SLIDES.md)** - Document standardization, frontmatter governance, and unified identity
3. **[Meta Agent](./META_AGENT_SLIDES.md)** - Operational intelligence and repository health metrics
4. **[Reviewer Agent](./REVIEWER_AGENT_SLIDES.md)** - Code and documentation quality review automation
5. **[Linting Agent](./LINTING_AGENT_SLIDES.md)** - Markdown, YAML, JSON, and code style enforcement
6. **[Labelling Agent](./LABELLING_AGENT_SLIDES.md)** - Issue and PR label automation and governance
7. **[Planner Agent](./PLANNER_AGENT_SLIDES.md)** - Project planning, roadmap, and strategy orchestration

## Infrastructure & Ecosystem

System-wide architecture and integration prompts:

1. **[Plugin, Agents, Skills & Hooks](./PLUGIN_AGENTS_SKILLS_HOOKS_SLIDES.md)** - Integrated ecosystem architecture, capability distribution, and guardrails
2. **[Scripts & Automation](./SCRIPTS_AND_AUTOMATION_SLIDES.md)** - Foundational script infrastructure, agent scripts, shared utilities, and orchestration
3. **[Workflows](./WORKFLOWS_SLIDES.md)** - Event-driven GitHub Actions orchestration, CI/CD pipeline, and automation triggers

## Processes & Lifecycle

Developer workflows and operational processes:

1. **[Pull Request Lifecycle](./PULL_REQUEST_LIFECYCLE_SLIDES.md)** - PR creation through merge, automated validation, review coordination, and quality gates
2. **[Issue Triage & Routing](./ISSUE_TRIAGE_AND_ROUTING_SLIDES.md)** - Issue intake, automatic categorization, template detection, and team routing
3. **[Release Process & Cadence](./RELEASE_PROCESS_AND_CADENCE_SLIDES.md)** - Version governance, semantic versioning, changelog management, and artifact publishing
4. **[Documentation Standards](./DOCUMENTATION_STANDARDS_SLIDES.md)** - 16 document categories, frontmatter schema, footer governance, and accessibility compliance
5. **[Repository Metrics & KPIs](./REPOSITORY_METRICS_AND_KPIS_SLIDES.md)** - Release metrics, development velocity, code quality tracking, and trend analysis
6. **[Quality Assurance & Testing](./QUALITY_ASSURANCE_AND_TESTING_SLIDES.md)** - Jest testing, coverage enforcement, security scanning, and accessibility validation
7. **[Plugin Architecture](./PLUGIN_ARCHITECTURE_DEEP_DIVE_SLIDES.md)** - 5 domain-specific plugins, skill registration, hook implementations, and ecosystem extensions
8. **[Observability & Logging](./OBSERVABILITY_AND_LOGGING_SLIDES.md)** - Session logging, audit trails, debugging support, and performance monitoring

## Governance & Standards

Technical and community standards:

1. **[WordPress-Specific Governance](./WORDPRESS_SPECIFIC_GOVERNANCE_SLIDES.md)** - WordPress version compatibility, PHP requirements, coding standards, and ecosystem compliance
2. **[Contributing Guidelines](./CONTRIBUTING_GUIDELINES_SLIDES.md)** - Code standards, testing requirements, review process, and community norms

## Developer Experience & Strategy

Onboarding, support, and strategic direction:

1. **[Getting Started & Onboarding](./GETTING_STARTED_AND_ONBOARDING_SLIDES.md)** - New contributor setup, development workflow, first contribution path, and support resources
2. **[Developer Experience & Best Practices](./DEVELOPER_EXPERIENCE_AND_BEST_PRACTICES_SLIDES.md)** - Feedback mechanisms, error communication, workflow optimization, and quality patterns
3. **[Troubleshooting & Debugging](./TROUBLESHOOTING_AND_DEBUGGING_SLIDES.md)** - Issue diagnosis, log analysis, root cause investigation, and debugging techniques
4. **[Roadmap & Future Vision](./ROADMAP_AND_FUTURE_VISION_SLIDES.md)** - Strategic pillars, feature roadmap, plugin ecosystem expansion, and long-term vision
5. **[Case Studies & Success Stories](./CASE_STUDIES_AND_SUCCESS_STORIES_SLIDES.md)** - Impact demonstration, quantified benefits, team success stories, and testimonials

## Usage

### With NotebookLM

1. Select your target agent's prompt file
2. Copy the complete prompt section
3. Paste into NotebookLM after adding repository sources (`.github` develop branch)
4. Request slide deck generation with 12-15 slides
5. Specify visual style and branding preferences

### With Figma

1. Use the prompt as a design brief
2. Reference the "Slide structure" section for layout guidance
3. Follow the "Design notes" for visual consistency
4. Adapt evidence anchors to your design system

### With Other Tools

- Adapt the "Deliverables" section to your platform
- Use "Evidence anchors" to validate claims with repository references
- Follow "Quality bar" for output consistency

## Prompt Structure

Each agent prompt includes:

- **Agent overview** - Purpose, scope, and operational role
- **Key capabilities** - What the agent does and why it matters
- **Integration points** - How it connects to other systems
- **Use cases** - Real-world scenarios and examples
- **Slide structure** - Recommended 12-15 slide breakdown
- **Evidence anchors** - Repository files backing each slide
- **Design notes** - Visual guidance and accessibility requirements
- **Quality bar** - Output standards and validation criteria

## Customization

Each prompt is designed to be:

- **Self-contained** - Complete agent context without external dependencies
- **Evidence-backed** - All claims map to repository documentation
- **Platform-agnostic** - Works with NotebookLM, Figma, Slides, or generalist tools
- **Audience-flexible** - Can be adapted for technical, product, or executive audiences

## Related Materials

- **WCEU 2026 Talk**: [wceu-2026/](../wceu-2026/) - 25-minute presentation on the complete agent ecosystem
- **Agent Registry**: [AGENTS.md](../AGENTS.md) - Complete agent specifications and responsibility matrix
- **Skills & Hooks**: [skills/](../skills/) and [hooks/](../hooks/) - Agent capabilities and enforcement mechanisms

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)
