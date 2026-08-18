# Organization Context: Using PRD Agent v2.1 Across LightSpeedWP

## Overview

The PRD Agent v2.1 is designed to serve all LightSpeedWP WordPress projects from a single unified prompt. This document explains how organization-wide portability works, why it's valuable, and how to integrate it with your workflows.

**Key Principle:** One agent, one prompt, all project types (plugins, themes, hybrid projects).

---

## Why Organization-Wide Portability?

### The Old Way

- **Separate agents** for plugins, themes, and hybrid projects
- **Duplicated prompt maintenance** — changes ripple across multiple versions
- **Inconsistent methodologies** — teams follow slightly different processes
- **Repo-specific forks** — some repos have custom PRD templates
- **Learning curve** — teams need to learn project-specific agent variants

### The New Way (v2.1)

- **Single unified agent** works for all project types
- **Context auto-detection** determines project type from repo structure
- **Consistent methodology** across all teams
- **Centralized updates** — fix or enhance once, all projects benefit
- **Faster onboarding** — one agent to learn, works everywhere

### Concrete Benefits

| Aspect | Old Way | New Way (v2.1) |
|---|---|---|
| **Maintenance** | 3 prompt versions × N teams | 1 prompt version |
| **Consistency** | Slight variations per repo | 100% consistent |
| **Updates** | 3 deploys, cross-team coordination | 1 deploy, automatic everywhere |
| **Onboarding** | "Use plugin version or theme version?" | "Use the PRD agent" |
| **Quality** | Best practices in one version | Best practices everywhere |

---

## How Context Auto-Detection Works

### Detection Strategy

The agent examines your repository structure to determine project type:

```
Step 1: Look for plugin.php
├─ Found → Could be plugin or hybrid
└─ Not found → Could be theme or custom

Step 2: Look for theme.json
├─ Found → Could be theme or hybrid
└─ Not found → Could be plugin or custom

Step 3: Identify supporting folders
├─ blocks/ folder → Plugin project
├─ templates/, patterns/ → Theme project
├─ Both → Hybrid project
└─ Neither → Custom, ask for clarification

Step 4: Confirm with user
└─ "I detected a Block Plugin. Should I proceed with plugin-focused PRD sections?"
```

### Detection Markers

**WordPress Block Plugin:**
```
✓ plugin.php in root
✓ blocks/ folder with block definitions
✓ blocks/my-block/block.json (block registration)
✓ blocks/my-block/index.js (block script)
✓ Class files (class-*.php for block classes)
```

**WordPress Block Theme:**
```
✓ theme.json in root (FSE configuration)
✓ templates/ folder with template files (index.html, single.html, etc.)
✓ patterns/ folder (optional, block patterns)
✓ block-styles/ folder (optional, block style variations)
✓ functions.php for theme setup
```

**Hybrid Project (Plugin + Theme):**
```
✓ Both plugin.php AND theme.json present
✓ Both blocks/ AND templates/ folders
✓ Plugin functionality + theme functionality
```

### Validation & Override

If the auto-detection is uncertain, the agent asks:

> "I detected a Block Plugin based on your repo structure. Let me confirm:
> - **Project Type**: Block Plugin / Block Theme / Hybrid / Custom?
> - **Target WordPress Version**: 6.4+?
> - **Key Dependencies**: Any specific plugins or WP features this requires?"

You can override the detected type:

```
"Actually, treat this as a hybrid project"
"This is a custom WordPress implementation, not a standard block plugin"
"Focus on theme aspects even though there's a plugin.php present"
```

---

## Integration Patterns

### Pattern 1: Direct Agent Invocation

**When:** Creating a PRD from scratch, need agent's interactive guidance

**How:**
```
User: "Create a PRD for our new block gallery plugin"
Agent:
  1. Detects: Block Plugin
  2. Confirms: "I detected a block plugin. Target WP 6.5+?"
  3. Creates: PRD with block inventory, hooks, WP compatibility sections
```

**Result:** Complete PRD document tailored to project type

---

### Pattern 2: GitHub Workflow Integration

**When:** Automatically generate PRD when new project is created, or trigger PRD generation on branch creation

**File:** `.github/workflows/prd-generation.yml` (example)

```yaml
name: Generate Initial PRD
on:
  issues:
    types: [opened]
    
jobs:
  prd-generation:
    runs-on: ubuntu-latest
    if: contains(issue.labels.*.name, 'needs-prd')
    steps:
      - uses: actions/checkout@v4
      - name: Invoke PRD Agent
        uses: lightspeedwp/prd-agent@v2.1
        with:
          issue-number: ${{ github.event.issue.number }}
          template: 'auto-detect'
        # Agent auto-detects project type, generates PRD comment
```

**Result:** PRD automatically generated as comment on GitHub issue

---

## Project Type Guidance

### When to Use: Block Plugin

**Characteristics:**
- Adds custom Gutenberg blocks to WordPress editor
- Provides blocks that site builders can use in block composition
- Typically includes JavaScript (block UI) + PHP (block rendering)

**PRD Focuses On:**
- Block inventory (what blocks are included)
- Block settings and configuration options
- WordPress hooks and filters the plugin provides/uses
- JavaScript/PHP version requirements
- WordPress version compatibility matrix
- Performance implications (bundle size, render time)

**Examples:**
- Custom gallery block plugin
- Product grid block plugin
- Form builder block plugin
- Advanced columns/layout block plugin

---

### When to Use: Block Theme

**Characteristics:**
- Complete WordPress theme built with Full Site Editing (FSE)
- Uses block-based templates instead of PHP template files
- Configurable via theme.json and block patterns

**PRD Focuses On:**
- Theme settings and design tokens (colors, typography)
- Block patterns (pre-built block compositions)
- Template hierarchy (which templates required)
- Full Site Editing (FSE) support level
- Browser support for FSE
- Design system and token management
- Accessibility in theme customizer

**Examples:**
- Agency-ready block theme
- Minimal/starter block theme
- Industry-specific block theme (real estate, portfolios, etc.)
- Accessible block theme

---

### When to Use: Hybrid Project

**Characteristics:**
- Combines plugin + theme functionality
- Plugin adds blocks or features
- Theme provides interface to use plugin features
- Tight coupling between components

**PRD Focuses On:**
- **Separate sections** for plugin requirements and theme requirements
- **Interdependencies** between plugin and theme
- **Coordination** of version releases (same or staggered)
- **Testing matrix** for both components together
- **User experience** across admin (plugin) and frontend (theme)

**Examples:**
- Block plugin + complementary theme
- Real estate plugin + real estate-specific theme
- Marketplace plugin + marketplace storefront theme
- Design system (blocks) + design system implementation (theme)

---

## Assumptions & Validation

### Default Assumptions (Agent Makes)

The agent makes reasonable WordPress assumptions but **validates with you**:

```
Default Assumptions:
✓ Project supports current WordPress major version (6.6 as of Aug 2026)
✓ Minimum PHP version is 7.4 (WordPress minimum)
✓ Project will be tested on multiple WordPress versions
✓ WCAG 2.2 AA accessibility is a requirement
✓ Project uses WordPress coding standards
✓ Performance matters (Web Vitals, loading time)
```

### How to Override

Tell the agent explicitly:

```
"This plugin only needs to support WP 6.5 and later"
"Accessibility is nice-to-have, not required for MVP"
"We're targeting PHP 8.0+, no legacy support needed"
"This is a custom implementation, follow these patterns instead"
```

### Validation Confirmation

The agent confirms before proceeding:

> "I'm assuming this block theme:
> - Target WordPress: 6.5–6.6
> - Minimum PHP: 7.4
> - WCAG 2.2 AA required
> - FSE support: Full (theme.json v3)
>
> Are these correct, or should I adjust?"

---

## FAQ: Organization-Wide Use

### Q: What if my project doesn't fit the standard types?

**A:** The agent is flexible. It will:
1. Ask clarifying questions about your project type
2. Propose context-specific PRD sections
3. Adapt the template accordingly
4. Document assumptions in PRD

You don't need a separate version or custom agent.

---

### Q: How often is the prompt updated?

**A:** When the core prompt is updated:
- ✅ All projects automatically benefit (new version, next use)
- ✅ No per-repo updates needed
- ✅ Consistency maintained across teams
- ✅ Changes rolled out to entire organization

---

### Q: Can teams customize the agent for their repo?

**A:** No repo-specific customization needed because:
- ✅ Context auto-detection adapts to your project
- ✅ Assumptions can be overridden per project
- ✅ Output is flexible and portable
- ✅ No forking or branching of prompt

If your team has unique needs, discuss with product leadership about whether those are organization-wide needs (add to core) or team-specific exceptions (document in your repo's CLAUDE.md).

---

### Q: What about multisite WordPress projects?

**A:** Multisite is handled as a **constraint**, not a separate project type:

```
Project Type: Block Plugin (detected)
Constraint: Multisite-compatible required

Impact:
  - Additional testing for network-wide activation
  - Additional hooks/filters for multisite scenarios
  - Timeline includes multisite testing buffer
  - Accessibility matrix includes multisite-specific testing
```

---

## Best Practices for Organization-Wide Use

### ✅ Do

- ✅ Use the PRD agent for all WordPress project planning
- ✅ Override assumptions if they don't fit your project
- ✅ Document WordPress version constraints explicitly
- ✅ Include accessibility requirements in every PRD
- ✅ Align timelines with WordPress release calendar
- ✅ Share PRDs across teams (standardized format)
- ✅ Link PRDs in GitHub projects, issues, and documentation

### ❌ Don't

- ❌ Fork the agent or create project-specific versions
- ❌ Ignore WordPress version requirements
- ❌ Treat accessibility as optional
- ❌ Plan timelines without WordPress compatibility buffer
- ❌ Assume all projects follow identical patterns (ask for clarification)
- ❌ Update PRD templates directly (propose changes to core team)

---

## Related Documentation

- **[README.md](README.md)** — Product overview, quick start guide
- **[AGENT.md](AGENT.md)** — Agent metadata, capabilities, configuration
- **[CONTEXT_DETECTION.md](CONTEXT_DETECTION.md)** — Technical details on detection logic
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** — GitHub workflows, CI/CD patterns, roadmap sync

---

**Built by 🧱 LightSpeedWP for organization-wide WordPress product planning**
