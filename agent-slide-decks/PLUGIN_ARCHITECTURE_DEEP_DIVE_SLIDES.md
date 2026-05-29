---
title: "Plugin Architecture Deep Dive Slide Deck Prompt"
description: "NotebookLM and design prompt for plugin ecosystem and domain extensions"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Plugin Architecture Deep Dive Slide Deck Prompt

## System Overview

The **Plugin Architecture** enables domain-specific extensions to the core .github ecosystem. Five plugins (github-ops, release-ops, wordpress-governance, wordpress-planning, metrics-and-reporting) extend agents with specialized logic, add new skills, and provide governance hooks.

**Operational scope**: Plugin development, domain-specific capabilities, plugin integration, extension points.

**Owned by**: LightSpeed ops & engineering teams

## Key Plugins

1. **lightspeed-github-ops** - GitHub operations, automation, and CI/CD enhancements
2. **lightspeed-release-ops** - Release automation, versioning, artifact coordination
3. **lightspeed-wordpress-governance** - WordPress-specific validation and governance
4. **lightspeed-wordpress-planning** - WordPress project planning and roadmaps
5. **lightspeed-metrics-and-reporting** - Advanced metrics, dashboards, reporting

## Plugin Structure

Each plugin contains:

- `/skills/` - Domain-specific skill implementations
- `/hooks/` - Custom hooks and guardrails
- `/config/` - Domain-specific configuration
- `/agents/` - Domain-specific agent extensions
- `README.md` - Plugin documentation

## Integration Points

- **Skills Registry**: Plugins register their skills in SKILL_REGISTRY.json
- **Agent Discovery**: Agents discover and load plugin skills at runtime
- **Hook Interception**: Plugin hooks validate execution before tool use
- **Workflow Integration**: Workflows can invoke plugin-specific logic

## Use Cases & Examples

### Use Case 1: WordPress Release Hygiene Plugin

WordPress team has specific release requirements; plugin enforces them.

**Plugin flow:**

1. Release workflow triggered for WordPress plugin release
2. Release agent loads wordpress-governance plugin skills
3. Plugin skill: wordpress-release-hygiene-check
   - Verifies WordPress.org compatibility
   - Checks plugin header format
   - Validates minimum PHP version
   - Tests on WordPress latest version
4. If validation fails: release blocked until fixed
5. If validation passes: release proceeds

### Use Case 2: Advanced Metrics Plugin

Organization wants custom metrics dashboards; plugin provides them.

**Plugin flow:**

1. Metrics workflow triggered (daily)
2. Metrics reporting skill invokes plugin skills
3. Plugin skills:
   - lightspeed-metrics-reporting
   - lightspeed-pr-cycle-time-report
   - lightspeed-qa-signoff-summary
4. Each skill generates specific metrics
5. Aggregated dashboard published
6. Team reviews custom metrics

### Use Case 3: Custom Skill Addition

Team needs new capability; added to existing plugin.

**Plugin flow:**

1. New skill implemented: wordpress-block-validation
2. Added to wordpress-governance plugin
3. Registered in SKILL_REGISTRY.json
4. Workflow discovers and loads skill
5. Agent invokes skill when processing PRs
6. No workflow changes needed (discovery automatic)

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Core agents insufficient for specialized domains; need extensibility
- Stakes: Duplicate logic, rigid system, domain-specific needs unmet

**Slide 02** - Plugin System Overview

- 5 plugins extending core ecosystem
- Each plugin: skills + hooks + configuration
- Plugins integrate seamlessly with core
- Discovery mechanism: automatic skill loading
- No core changes needed for plugin addition

**Slide 03** - The 5 Plugins

- **github-ops**: Core GitHub automation, issue handling, PR routing
- **release-ops**: Release coordination, versioning, artifact publishing
- **wordpress-governance**: WordPress-specific validation and checks
- **wordpress-planning**: WordPress project planning, roadmaps
- **metrics-and-reporting**: Advanced metrics, dashboards, reporting

**Slide 04** - Plugin Directory Structure

- `/skills/` - Reusable domain-specific capabilities
- `/hooks/` - Guardrails and validation logic
- `/config/` - Domain-specific configuration files
- `/agents/` - Extended agent logic (optional)
- `package.json` - Plugin metadata and dependencies
- `README.md` - Documentation and usage

**Slide 05** - Skill Implementation

- Plugins implement skills following standard interface
- Skill signature: `async function skillName(context, params) { ... }`
- Skills are stateless, testable, composable
- Skills can call other skills (chain capabilities)
- Skills return structured results for agents

**Slide 06** - Hook Implementations

- Plugins can add hooks to intercept operations
- Hook types: before-execution, after-execution, validate
- Hooks can: validate context, check permissions, log activity
- Multiple hooks compose: validation, security, logging
- Hooks run before main logic (fail-fast pattern)

**Slide 07** - Plugin Registration & Discovery

- Plugins register skills in SKILL_REGISTRY.json
- Registry entry includes: skill-id, plugin-id, batch, description
- Agents query registry at runtime: "which skills apply?"
- Skills discovered automatically at workflow execution
- No core changes needed to add plugins

**Slide 08** - WordPress Plugin Deep Dive

- **lightspeed-wordpress-governance**:
  - WordPress version compatibility checks
  - Plugin header validation
  - Minimum PHP version enforcement
  - Block theme compatibility
- **lightspeed-wordpress-planning**:
  - WordPress release calendar integration
  - Feature priority (WordPress ecosystem aligned)
  - Roadmap coordination with WordPress.org

**Slide 09** - Release Ops Plugin Deep Dive

- **Release Orchestration**:
  - Multi-platform publishing (npm, WordPress.org, mirrors)
  - Version rollback safety checks
  - Release notes generation for WordPress
- **Skills**:
  - lightspeed-release-readiness
  - lightspeed-changelog-compliance
  - lightspeed-release-rollout-checklist

**Slide 10** - Metrics Plugin Deep Dive

- **Advanced Reporting**:
  - PR cycle time by team
  - Feature velocity tracking
  - Release cadence analysis
- **Skills**:
  - lightspeed-metrics-reporting
  - lightspeed-pr-cycle-time-report
  - lightspeed-repository-health-summary
- **Dashboards**: Custom visualizations per team

**Slide 11** - Plugin Configuration

- Each plugin can have domain-specific config
- Config files: YAML, JSON, or JavaScript
- Agents load plugin config at runtime
- Config supports: thresholds, allowlists, rules
- Configuration can be overridden per workflow

**Slide 12** - Plugin Testing & Quality

- Plugins have own test suites
- Test structure mirrors plugin structure
- Plugins tested independently and integrated
- Coverage requirements apply to plugins
- CI gates enforce plugin quality

**Slide 13** - Plugin Development Best Practices

- **Keep plugins focused**: One domain per plugin
- **Reuse core utilities**: Don't duplicate logic
- **Document thoroughly**: Skills and hooks documented
- **Test comprehensively**: >80% coverage required
- **Version carefully**: Semantic versioning enforced

**Slide 14** - Extending with New Plugins

- Start with: plugin structure, package.json, README
- Implement: skills in /skills/ directory
- Register: update SKILL_REGISTRY.json
- Test: add test suites, validate quality gates
- Deploy: push to repository, workflows automatically discover

**Slide 15** - Close & Next Actions

- Plugin architecture enables domain-specific extensions
- Contribute: Extend existing plugins or create new ones
- Questions & feedback

## Evidence Anchors

- `.github/plugins/` - Plugin directories (5 plugins)
- `.github/plugins/lightspeed-wordpress-governance/` - WordPress governance plugin
- `.github/plugins/lightspeed-release-ops/` - Release operations plugin
- `.github/plugins/lightspeed-metrics-and-reporting/` - Metrics plugin
- `.github/skills/SKILL_REGISTRY.json` - Plugin skill registry
- `.github/AGENTS.md` - Plugin integration points

## Design Notes

- **Visual theme**: Modular extensions (plugin blocks, integration points, extension architecture)
- **Color palette**: Use architecture colors (blues, greens, expansion arrows)
- **Key visuals**: Plugin dependency diagram, skill registry tree, plugin directory structure, integration flow
- **Accessibility**: Clear labels for each plugin; high contrast for connections
- **Animations**: Consider plugin loading animation, skill discovery reveal

## Quality Bar

- Show actual plugin examples from repository
- Include real skill implementations
- Validate against SKILL_REGISTRY structure
- Show plugin integration points
- Ensure all evidence references point to current develop branch
