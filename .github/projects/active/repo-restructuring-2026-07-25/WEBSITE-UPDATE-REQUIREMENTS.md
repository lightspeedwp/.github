---
file_type: documentation
title: Website Update Requirements (Phase 4)
description: Documentation of website changes needed to support plugin adoption strategy and tiered onboarding
created: 2026-07-26
updated: 2026-07-26
status: active
owner: Web Team (github.lightspeedwp.agency)
---

# Website Update Requirements — Phase 4: Plugin Adoption

Requirements for updating github.lightspeedwp.agency to support plugin adoption documentation, tiered onboarding, and integrated documentation rendering.

**Handoff Status:** Ready for web team implementation  
**Deployment Timeline:** Before September 1, 2026 (Tier 2 rollout)  
**Support:** Coordinate with Ash Shaw for any clarifications

---

## Executive Summary

Phase 4 generates 7 new documentation files for plugin adoption. The website must be updated to:

1. **Route onboarding by team tier** (maintainers → contributors → consumers)
2. **Render documentation pages** from `/docs/` markdown
3. **Provide getting started guides** specific to each role
4. **Create references section** linking to agents, skills, hooks, plugins
5. **Integrate cookbook** for recipes and implementation examples

---

## Onboarding Page (`/`)

### Current State

- Generic getting started content
- No role-based routing
- Single onboarding flow

### Required Changes

#### Route by Team Tier

Implement role-based navigation on homepage:

```html
<!-- Decision Tree on Homepage -->
<section class="onboarding-routes">
  <h2>Getting Started (Select Your Role)</h2>
  
  <div class="role-cards">
    <!-- Card 1 -->
    <card>
      <title>I'm a Core Maintainer</title>
      <description>Full access to infrastructure, plugins, and governance docs</description>
      <link>/getting-started/maintainers/</link>
      <features>
        <li>Plugin setup guides</li>
        <li>Repository governance</li>
        <li>Agent & skill development</li>
        <li>Infrastructure maintenance</li>
      </features>
    </card>
    
    <!-- Card 2 -->
    <card>
      <title>I'm a Contributor</title>
      <description>Setup guide and workflow essentials</description>
      <link>/getting-started/contributors/</link>
      <features>
        <li>Plugin setup (quick)</li>
        <li>Branching strategy</li>
        <li>PR workflow</li>
        <li>Code standards</li>
      </features>
    </card>
    
    <!-- Card 3 -->
    <card>
      <title>I'm a Consumer (WordPress Team)</title>
      <description>Using agents and skills for WordPress projects</description>
      <link>/getting-started/consumers/</link>
      <features>
        <li>Getting started</li>
        <li>Using agents</li>
        <li>Using skills</li>
        <li>FAQ & support</li>
      </features>
    </card>
  </div>
</section>
```

**Implementation Details:**

- Use CSS cards with icon/image for each role
- Make choice obvious and easy to understand
- Include brief description of each path
- Links should be prominent and clear

---

## Getting Started Pages

### New Structure

Create three distinct onboarding flows:

```
/getting-started/
├── maintainers/
│   ├── index.md
│   ├── setup-complete.md
│   ├── vscode-workspace.md
│   └── governance.md
├── contributors/
│   ├── index.md
│   ├── setup-quick.md
│   ├── branching-strategy.md
│   └── pr-workflow.md
└── consumers/
    ├── index.md
    ├── quick-setup.md
    ├── using-agents.md
    ├── using-skills.md
    └── faq.md
```

### `/getting-started/maintainers/`

**Content:** Full setup including all plugins and infrastructure

**Sections:**

1. **Welcome Message**
   - Title: "Welcome, Core Maintainers"
   - Description: Full access to plugins, agents, and governance

2. **Plugin Setup**
   - Embed or link to: `/docs/plugin-setup-claude-code.md`
   - Embed or link to: `/docs/plugin-setup-github-copilot.md`
   - Link to: `/docs/plugin-testing.md`

3. **VSCode Workspace**
   - Link to: `/docs/vscode-workspace-setup.md`
   - Mention: Multi-root workspace configuration
   - Mention: Settings sync

4. **Repository Governance**
   - Link to: `/docs/BRANCHING_STRATEGY.md`
   - Link to: `/docs/AGENTS.md`
   - Link to: `/docs/PR_CREATION_PROCESS.md`

5. **Agent & Skill Development**
   - Link to: `/docs/AGENT_CREATION.md`
   - Link to: `/docs/SKILL_DEVELOPMENT.md`
   - Link to: `/agents/` reference

6. **Custom Agents**
   - How to create custom agents in Claude Code
   - Link to examples in `.claude/agents/`

7. **Troubleshooting**
   - Link to: `/docs/vscode-plugin-troubleshooting.md`
   - Common issues specific to maintainers

**Call-to-Action:** "Ready? Install Claude Code and GitHub Copilot"

### `/getting-started/contributors/`

**Content:** Quick setup for feature development

**Sections:**

1. **Welcome Message**
   - Title: "Welcome, Contributors"
   - Description: Everything you need to contribute

2. **Quick Plugin Setup** (Condensed)
   - Links to setup guides (don't embed full content)
   - Estimate: 15 minutes to setup
   - Plugins: Claude Code + GitHub Copilot

3. **Branching Strategy**
   - Link to: `/docs/BRANCHING_STRATEGY.md`
   - Key points: Branch naming, protection, reuse prevention

4. **PR Workflow**
   - Link to: `/docs/PR_CREATION_PROCESS.md`
   - Templates available
   - Review process

5. **Code Standards**
   - Link to: `/docs/coding-standards.md`
   - Language-specific guidelines
   - ESLint/Prettier config

6. **Getting Help**
   - Where to ask questions
   - GitHub discussions
   - Plugin help channel (`[plugin-help]` label)

**Call-to-Action:** "Let's get you set up in 15 minutes"

### `/getting-started/consumers/`

**Content:** WordPress teams using agents and skills

**Sections:**

1. **Welcome Message**
   - Title: "Welcome, WordPress Project Teams"
   - Description: How to use our agents and skills

2. **What Are Agents?**
   - Link to: `/agents/` directory
   - List available agents with descriptions
   - Example: "Use website-content-strategist for copy"

3. **What Are Skills?**
   - Link to: `/skills/` directory
   - List available skills with descriptions
   - Example: "Use figma-design-to-code for design implementation"

4. **Using Agents**
   - Link to agent documentation
   - Walkthrough of running an agent
   - Expected workflow

5. **Using Skills**
   - Link to skill documentation
   - When to use each skill
   - Limitations and best practices

6. **FAQ**
   - Common questions
   - Troubleshooting
   - Getting support

7. **Support**
   - When to open issues
   - Expected response time
   - Escalation process

**Call-to-Action:** "Browse our agents to get started"

---

## Documentation Page (`/documentation/`)

### Current State

- Likely doesn't exist or has minimal content
- Doesn't render docs from repository

### Required Changes

#### Auto-Render Documentation

Create page that dynamically renders markdown from `/docs/`:

```
/documentation/
├── index.md (Lists all docs)
├── plugin-setup-claude-code.html (rendered from docs/plugin-setup-claude-code.md)
├── plugin-setup-github-copilot.html (rendered from docs/plugin-setup-github-copilot.md)
├── plugin-comparison.html
├── plugin-adoption-phases.html
├── plugin-testing.html
├── vscode-plugin-troubleshooting.html
├── vscode-workspace-setup.html
├── branching-strategy.html
├── coding-standards.html
├── migration-guide.html
└── [other docs...]
```

**Implementation Approach:**

Option A: **Build-time rendering** (Recommended)

- Documentation build process reads `/docs/` markdown
- Renders to HTML during build
- Includes table of contents, search, syntax highlighting
- Build tool: Astro, Eleventy, Hugo, Jekyll, etc.

Option B: **Runtime rendering** (Alternative)

- Client-side markdown-to-HTML conversion
- Uses marked.js or remark
- Good for frequent updates

**Required Features:**

- [ ] Markdown frontmatter support
- [ ] Table of contents (auto-generated)
- [ ] Syntax highlighting for code blocks
- [ ] Search functionality
- [ ] Mobile responsive
- [ ] Dark/light mode
- [ ] Previous/next navigation

**Content to Render:**

From `/docs/`:

- plugin-setup-claude-code.md
- plugin-setup-github-copilot.md
- plugin-comparison.md
- plugin-adoption-phases.md
- plugin-testing.md
- vscode-plugin-troubleshooting.md
- vscode-workspace-setup.md
- branching-strategy.md
- coding-standards.md
- MIGRATION.md (if exists)

**Rendering Example:**

Input (Markdown):

```markdown
# Claude Code Setup Guide

A comprehensive guide to installing Claude Code...
```

Output (HTML):

```html
<article class="documentation">
  <h1>Claude Code Setup Guide</h1>
  <p>A comprehensive guide to installing Claude Code...</p>
  <nav class="table-of-contents">
    <!-- Auto-generated TOC -->
  </nav>
</article>
```

---

## References Section (`/references/`)

### Current State

- Doesn't exist
- No central reference for agents, skills, hooks, plugins

### Required Changes

Create reference hub linking to all reusable assets:

```
/references/
├── agents/
│   ├── index.md (List all agents with links)
│   └── [agent-specific docs if available]
├── skills/
│   ├── index.md (List all skills with links)
│   └── [skill-specific docs if available]
├── hooks/
│   └── index.md (Git hooks documentation)
├── plugins/
│   └── index.md (Plugin bundles)
├── instructions/
│   └── index.md (Portable instructions)
└── schemas/
    └── index.md (JSON schema reference)
```

#### `/references/agents/`

**Content:** List of all agents with descriptions

**Format:**

```markdown
# Agents Reference

## Available Agents

### [Agent Name]
**File:** `/agents/[agent-slug]/`
**Description:** What this agent does
**Use When:** Typical use case
**Status:** Stable/Beta/Experimental
**Link:** [View agent docs]

### Example: Website Content Strategist
**File:** `/agents/website-content-strategist-agent/`
**Description:** Generates SEO-optimised content for websites
**Use When:** Writing homepage copy, landing pages, blog posts
**Status:** Stable
**Link:** [View AGENT.md]
```

**Data Source:** Auto-generate from `/agents/` directory structure

#### `/references/skills/`

**Content:** List of all skills with descriptions

**Format:**

```markdown
# Skills Reference

## Available Skills

### [Skill Name]
**Skill ID:** [ID for slash command]
**Description:** What this skill does
**Use When:** Typical use case
**Link:** [View skill docs]

### Example: Figma Design to Code
**Skill ID:** `figma-design-to-code`
**Description:** Converts Figma designs to React/Vue code
**Use When:** Implementing design mockups as components
**Link:** [View SKILL.md]
```

**Data Source:** Auto-generate from `/skills/` directory structure

#### `/references/hooks/`

**Content:** Git hooks documentation

**Sections:**

- Available hooks (pre-commit, pre-push, etc.)
- How to install
- How to customise
- Link to: `/hooks/` directory

#### `/references/plugins/`

**Content:** Plugin bundles

**Sections:**

- Claude Code plugin
- GitHub Copilot plugin
- Other supported plugins
- Installation instructions
- Links to setup guides

#### `/references/instructions/`

**Content:** Portable instruction files

**List:**

- coding-standards.instructions.md
- a11y.instructions.md
- documentation-formats.instructions.md
- issues.instructions.md
- pull-requests.instructions.md
- community-standards.instructions.md

**Link:** Each to the source file in `/instructions/`

---

## Cookbook Page (`/cookbook/`)

### Current State

- Doesn't exist
- No recipes or implementation guides available

### Required Changes

Create recipe hub for common workflows:

```
/cookbook/
├── index.md (Overview of recipes)
├── getting-started/
│   ├── first-contribution.md
│   ├── setup-vscode.md
│   └── local-development.md
├── agents/
│   ├── create-custom-agent.md
│   ├── run-agent-in-workflow.md
│   └── debug-agent-issues.md
├── plugins/
│   ├── claude-code-quick-wins.md
│   ├── copilot-daily-workflow.md
│   └── plugin-troubleshooting-101.md
├── branching/
│   ├── feature-branch-workflow.md
│   ├── hotfix-workflow.md
│   └── release-branch-workflow.md
└── testing/
    ├── test-generation-with-copilot.md
    └── refactoring-with-claude-code.md
```

**Implementation:**

Option A: **Render from `/cookbook/` markdown files**

- Same approach as documentation page
- Auto-discover recipes and build nav

Option B: **Create content on website**

- Manual content creation
- Good for hand-curated examples

Recommendation: **Option A** (auto-render)

**Example Recipe:**

**Filename:** `cookbook/plugins/claude-code-quick-wins.md`

**Content:**

```markdown
# Claude Code Quick Wins

3 ways to use Claude Code today and save 30 minutes

## 1. Generate Test Cases
**Time saved:** 15 minutes per file
**Steps:**
1. Open a function in Claude Code
2. Ask: "Generate comprehensive test cases"
3. Claude creates Jest/Vitest tests
4. Review and merge into test file

## 2. Refactor to TypeScript
**Time saved:** 20 minutes per file
**Steps:**
1. Select JavaScript file
2. Ask: "Add TypeScript types, use strict typing"
3. Claude converts with proper types
4. Fix any lint errors

## 3. Document Code
**Time saved:** 10 minutes per file
**Steps:**
1. Select undocumented function
2. Ask: "Add JSDoc comments"
3. Claude generates docs
4. Review and accept
```

---

## Navigation Updates

### Homepage

Add section showing plugin adoption:

```html
<section class="feature-highlight">
  <h2>Modern Development Tools</h2>
  <p>Adopt AI-powered code assistants for faster development</p>
  <ul>
    <li>Claude Code: Advanced multi-file refactoring</li>
    <li>GitHub Copilot: Real-time inline suggestions</li>
    <li>See full comparison →</li>
  </ul>
  <cta>Get Started with Plugins</cta>
</section>
```

### Main Navigation

Add/Update navigation items:

```
← Back to home
Home
Getting Started ← Dropdown with three roles
  ├─ For Maintainers
  ├─ For Contributors
  └─ For Consumers
Documentation ← New page
References ← New section
  ├─ Agents
  ├─ Skills
  ├─ Hooks
  └─ Plugins
Cookbook ← New section
Governance
Community
```

### Footer

Add links to:

- Plugin adoption timeline
- Support channels
- GitHub discussions
- Help form

---

## Technical Implementation

### Technology Stack Recommendations

**Minimum Requirements:**

- Markdown parsing and rendering
- Frontmatter support
- Table of contents generation
- Search functionality
- Responsive design
- Dark mode support

**Recommended Tools:**

- **Static site generator:** Astro, Eleventy, Hugo
- **Markdown processor:** remark, markdown-it
- **Search:** Algolia, meilisearch (self-hosted)
- **Hosting:** Vercel, Netlify, GitHub Pages

### Build Process

```
1. Pull latest docs from /docs/
2. Parse frontmatter and markdown
3. Generate HTML with syntax highlighting
4. Build search index
5. Deploy to github.lightspeedwp.agency
```

### Deployment Checklist

Before going live:

- [ ] All markdown files parse without errors
- [ ] Code blocks have syntax highlighting
- [ ] Links are working (internal and external)
- [ ] Search index is complete
- [ ] Mobile responsive tested
- [ ] Dark/light mode works
- [ ] Navigation is clear
- [ ] Performance is acceptable (<3s page load)

---

## Content Migration Plan

### Phase 1: Setup (Week 1)

- [ ] Create new pages structure
- [ ] Set up markdown rendering
- [ ] Add placeholder content

### Phase 2: Documentation (Week 2)

- [ ] Render all `/docs/` markdown files
- [ ] Create documentation index
- [ ] Set up table of contents
- [ ] Add search functionality

### Phase 3: References (Week 2)

- [ ] Create agent reference page
- [ ] Create skill reference page
- [ ] Link to all agents/skills
- [ ] Add description metadata

### Phase 4: Cookbook (Week 3)

- [ ] Create cookbook structure
- [ ] Add example recipes
- [ ] Test rendering

### Phase 5: Testing & Launch (Week 3–4)

- [ ] Comprehensive testing
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Live deployment

---

## Success Criteria

### Launch Readiness

- [ ] All 7 plugin documentation files render correctly
- [ ] Onboarding routes to correct getting-started pages
- [ ] Documentation page has all required docs
- [ ] References section lists all agents/skills
- [ ] Cookbook has at least 5 recipes
- [ ] Navigation is intuitive and clear
- [ ] All links work (no 404s)
- [ ] Page load time <3 seconds
- [ ] Mobile responsive on all devices
- [ ] Search works across all pages

### Team Feedback

- [ ] Core team tests all flows (3/3 approve)
- [ ] Contributors can find what they need
- [ ] WordPress teams understand agent/skill usage
- [ ] No critical issues in first week

---

## Success Metrics

Post-launch, track:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load Time** | <3s | Lighthouse audit |
| **Mobile Performance** | >90 score | PageSpeed Insights |
| **Documentation Coverage** | 100% of /docs/ | File count match |
| **Link Validation** | 0 broken links | Automated checker |
| **Search Functionality** | >95% accuracy | Manual testing |
| **Navigation Clarity** | >80% task success | User testing |

---

## Support & Maintenance

### Ongoing Tasks

- **Weekly:** Monitor broken links, fix typos
- **Monthly:** Update documentation index
- **Quarterly:** SEO audit and optimization
- **As needed:** Add new agent/skill documentation

### Maintenance Contacts

- **Website:** Web team (github.lightspeedwp.agency)
- **Content:** Ash Shaw (<ashley@lightspeedwp.agency>)
- **Agents/Skills:** Core maintainers
- **Support:** GitHub issues `[plugin-help]` or website issues

---

## Timeline & Handoff

### Timeline

- **26 July 2026:** This requirements document created
- **August 2–9:** Web team implementation
- **August 10–23:** Testing and refinement
- **August 24:** Soft launch (internal team testing)
- **August 31:** Public launch (for Tier 2 rollout)

### Handoff Procedure

1. **Web team receives requirements** (this document)
2. **Clarification call** (if needed)
3. **Implementation begins** with weekly sync
4. **Testing phase** before launch
5. **Go-live coordination** with Ash Shaw
6. **Post-launch support** for first 2 weeks

### Questions/Clarifications

Contact Ash Shaw at <ashley@lightspeedwp.agency> with:

- Questions about requirements
- Implementation approach confirmation
- Timeline concerns
- Technical constraints

---

## Appendix A: File Mappings

### Docs to Render

| Source File | Target URL | Status |
|---------|-----------|--------|
| `/docs/plugin-setup-claude-code.md` | `/documentation/plugin-setup-claude-code/` | Ready |
| `/docs/plugin-setup-github-copilot.md` | `/documentation/plugin-setup-github-copilot/` | Ready |
| `/docs/plugin-comparison.md` | `/documentation/plugin-comparison/` | Ready |
| `/docs/plugin-adoption-phases.md` | `/documentation/plugin-adoption-phases/` | Ready |
| `/docs/plugin-testing.md` | `/documentation/plugin-testing/` | Ready |
| `/docs/vscode-plugin-troubleshooting.md` | `/documentation/vscode-plugin-troubleshooting/` | Ready |

### Agents to Reference

| Agent | Path | Link |
|--------|------|------|
| Website Content Strategist | `/agents/website-content-strategist-agent/` | [AGENT.md] |
| Figma Design to Code | `/agents/figma-design-to-code-agent/` | [AGENT.md] |
| [Others...] | `/agents/[slug]/` | [AGENT.md] |

### Skills to Reference

| Skill | Path | Link |
|-------|------|------|
| Figma Design to Code | `/skills/figma-design-to-code/` | [SKILL.md] |
| [Others...] | `/skills/[slug]/` | [SKILL.md] |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-26 | Initial requirements document for Phase 4 website updates |

---

*Created as part of Phase 4: Plugin Adoption Strategy*  
**Next Phase:** Phase 5 — Rollout & Team Communications (Aug 1+)
