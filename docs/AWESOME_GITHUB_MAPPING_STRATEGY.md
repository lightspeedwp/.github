---
file_type: documentation
title: Awesome GitHub Design-to-Content Mapping Strategy
version: '1.0'
created: '2026-06-04'
purpose: Comprehensive mapping of design handoff to Astro website implementation using existing repository content
status: active
maintainer: LightSpeed AI Operations
---

# Awesome GitHub Design-to-Content Mapping Strategy

## Executive Summary

This document provides a **complete, actionable mapping** between:

1. **Design source** (JSX prototypes, tokens, screenshots in `design_handoff_awesome_github/`)
2. **Content sources** (existing `.md` files across `ai/`, `instructions/`, `cookbook/`, etc.)
3. **Astro implementation** (target pages, components, routes in `website/src/`)

**Key principle:** Reuse existing repository content rather than creating new documentation. The website showcases what already exists in `.github`.

---

## Part 1: Repository Content Audit

### 1.1 Core Content Folders & Structure

| Folder | Files | Purpose | Website Feature |
|--------|-------|---------|-----------------|
| **`ai/`** | Claude.md, Gemini.md, RUNNERS.md, agents.md, README.md, audit reports | AI agent specifications & canonical references | Learn/Reference pages, Agents catalogue |
| **`instructions/`** | 37 `.instructions.md` files | Organisation-wide standards (coding, a11y, documentation, CI/CD) | Learn/Guides, Cookbooks, Reference |
| **`cookbook/`** | 4 `.md` files (playbooks, checklists, workflows) | Recipes, playbooks, implementation guides | Cookbook section |
| **`hooks/`** | Portable hooks & guardrails | Safety/automation mechanisms | Tools/Utilities catalogue |
| **`agents/`** | Agent specifications | Standalone agent definitions | Agents catalogue |
| **`plugins/`** | Plugin bundles | WordPress/GitHub plugin packages | Plugins catalogue |
| **`skills/`** | Skill definitions with `SKILL.md` entrypoints | Self-contained reusable skills | Skills catalogue |
| **`workflows/`** | Workflow definitions | Portable agentic workflows | Workflows catalogue |
| **`prompts/`** | Prompt library files | Reusable prompts & templates | Prompts catalogue |
| **`schemas/`** | Data structure definitions | Configuration schemas | Reference section |
| **`.github/scripts/`** | Script documentation | Utility scripts | Tools section |
| **`profile/`** | Profile configurations | Profile definitions | Tools section |
| **`.github/instructions/`** | Repo-local Copilot instructions | Control-plane-specific guidance | Reference section |
| **`docs/`** | Permanent documentation | Persistent human documentation | References, editorial |

### 1.2 Top-Level Documentation Files

| File | Content Type | Website Use |
|------|--------------|-------------|
| `CLAUDE.md` | Project instructions | Getting Started, References |
| `AGENTS.md` | Global AI rules | Learn/Rules section |
| `SECURITY.md` | Security policy | References/Security |
| `README.md` (in folders) | Folder overviews | Catalogue descriptions |

### 1.3 Key Files by Content Type

#### AI Agent & Operations

- `ai/Claude.md` — Claude-specific instructions
- `ai/Gemini.md` — Gemini agent reference
- `ai/RUNNERS.md` — Runner configurations
- `ai/agents.md` — Agent specifications overview
- `ai/README.md` — AI operations overview
- `ai/AUDIT-SUMMARY.md` — Audit results & findings

#### Instructions/Standards (37 files)

Core categories:

- **Coding & Development:** `coding-standards.instructions.md`, `documentation-formats.instructions.md`, `self-explanatory-code-commenting.instructions.md`
- **Community & Collaboration:** `community-standards.instructions.md`, `pull-requests.instructions.md`, `issues.instructions.md`
- **Operations & Infrastructure:** `automation.instructions.md`, `workflows.instructions.md`, `hooks.instructions.md`, `tools.instructions.md`
- **Project Management:** `task-implementation.instructions.md`, `spec-driven-workflow.instructions.md`, `planner.instructions.md`
- **Special Topics:** `a11y.instructions.md`, `languages.instructions.md`, `mermaid.instructions.md`, `wordpress-project-planning.instructions.md`

#### Recipes & Playbooks

- `cookbook/project-planning-and-prd-playbook.md`
- `cookbook/spec-driven-workflow-example.md`
- `cookbook/wordpress-plugin-checklist.md`
- `cookbook/README.md`

---

## Part 2: Design-to-Page Mapping

### 2.1 Design Pages & Corresponding Routes

| Screenshot | Design View | Route | Content Source | Status |
|---|---|---|---|---|
| **01-home-hero-dark** | Home hero + fold | `/awesome-github/` | README.md, introduction content | ✅ Exists |
| **02-home-scrolled** | Feature grid, stats, editorial | `/awesome-github/#features` | Folder READMEs, catalogue intro | ✅ Exists |
| **03-catalogue-agents** | Catalogue browser | `/awesome-github/c/[type]/` | `agents/`, `ai/` folder content | ✅ Partial |
| **04-learn-centre** | Educational hub | `/awesome-github/learn/[...]` | `instructions/`, `cookbook/`, `ai/` | ✅ Design only |
| **05-getting-started** | Onboarding (10-min flow) | `/awesome-github/getting-started` | CLAUDE.md, setup steps | ✅ Design only |
| Editorial pages | Why, References | `/awesome-github/why`, `/awesome-github/references` | docs/, AGENTS.md | ✅ Design only |

### 2.2 Catalogue Types & Content Mapping

**Resource Types** (from `design_source/data.js`):

```
- Agents         → /agents/ folder + ai/agents.md
- Instructions   → /instructions/ folder (37 files)
- Prompts        → /prompts/ folder
- Skills         → /skills/ folder (SKILL.md entries)
- Hooks          → /hooks/ folder
- Workflows      → /workflows/ folder
- Plugins        → /plugins/ folder
- Tools/Scripts  → /.github/scripts/ + /tools/ documentation
- Cookbook       → /cookbook/ folder
```

**Detailed Type-to-Content Mapping:**

#### 1. Agents Catalogue

**Route:** `/awesome-github/c/agents/` → `/awesome-github/c/agents/[slug]`
**Content Sources:**

- `agents/` folder (agent spec files)
- `ai/agents.md` (overview of AI agent ecosystem)
- `ai/Claude.md`, `ai/Gemini.md`, `ai/RUNNERS.md` (specific agent documentation)

**Catalogue Display Fields (from `data.js`):

- Icon (Heroicons, indexed by type)
- Title (from filename/frontmatter)
- Badge (agent type: "Claude", "Gemini", "Custom")
- Version + date (from frontmatter or file metadata)
- Short description (frontmatter summary)
- Tags (from frontmatter tags field)

**Detail Page Content:**

- Full markdown body (from agent spec file)
- Interaction buttons: Copy raw, Open on GitHub, Install in VS Code
- Branch switch (main ⇄ develop) for URL generation
- Related agents (via tags/category)

#### 2. Instructions Catalogue

**Route:** `/awesome-github/c/instructions/` → `/awesome-github/c/instructions/[slug]`
**Content Sources:**

- All 37 files in `instructions/` folder (structured by topic)
- `instructions/README.md` (folder overview)

**Subdirectories/Categories (from frontmatter):

- **Coding & Standards** — coding-standards, documentation-formats, commenting
- **Community & Collaboration** — community-standards, pull-requests, issues
- **AI Operations** — ai-operations, automation, hooks
- **Project Management** — task-implementation, planner, spec-driven
- **WordPress Specific** — wordpress-project-planning, plugin-structure
- **Accessibility & UX** — a11y, ux guidelines
- **Infrastructure** — workflows, tools, automation

**Catalogue Display Fields:**

- Title (from `.instructions.md` filename)
- Category/Topic (from frontmatter or folder)
- Last updated (from frontmatter `last_updated`)
- Difficulty level (Beginner/Intermediate/Advanced — add to frontmatter if needed)
- Read time estimate (calculate from word count)
- Tags (organisations, team, topic area)

**Detail Page Content:**

- Full markdown with all sections
- Table of contents (auto-generated)
- Related instructions (via category/tags)
- "Print" or "PDF export" button

#### 3. Cookbook Catalogue

**Route:** `/awesome-github/cookbook/` → `/awesome-github/cookbook/[slug]`
**Content Sources:**

- `cookbook/` folder (4 files currently)
- Each file: playbook, checklist, workflow example

**Catalogue Display:**

- Title + description
- Type badge (Playbook / Checklist / Workflow)
- Complexity level
- Time estimate
- Use case tags

**Detail Page Content:**

- Full markdown
- Downloadable templates/checklists
- Step-by-step walkthrough
- Links to related instructions

#### 4. Skills Catalogue

**Route:** `/awesome-github/c/skills/` → `/awesome-github/c/skills/[slug]`
**Content Sources:**

- `skills/` folder with `SKILL.md` files in each skill directory
- Each skill is self-contained

**Catalogue Display:**

- Icon/badge
- Skill name
- Category (AI, Automation, Analysis)
- Installation method badge
- Quick description

**Detail Page:**

- SKILL.md content (full skill definition)
- Installation instructions
- Usage examples
- Dependencies

#### 5. Hooks Catalogue

**Route:** `/awesome-github/c/hooks/` → `/awesome-github/c/hooks/[slug]`
**Content Sources:**

- `hooks/` folder (portable hooks and guardrails)

**Catalogue Display:**

- Hook name
- Type (guardrail/automation/validation)
- Trigger point (pre-commit, pre-push, etc.)
- Safety level

**Detail Page:**

- Hook documentation
- Code snippet
- Installation method
- Test cases

#### 6. Workflows Catalogue

**Route:** `/awesome-github/c/workflows/` → `/awesome-github/c/workflows/[slug]`
**Content Sources:**

- `workflows/` folder (portable agentic workflows)
- `.github/workflows/` folder (GitHub Actions workflows)

**Catalogue Display:**

- Workflow name
- Trigger type (manual/scheduled/event-based)
- Status (production/beta/experimental)
- Use case

**Detail Page:**

- Workflow definition
- Configuration options
- Trigger conditions
- Examples

#### 7. Prompts Catalogue

**Route:** `/awesome-github/c/prompts/` → `/awesome-github/c/prompts/[slug]`
**Content Sources:**

- `prompts/` folder (prompt library)

**Catalogue Display:**

- Prompt name
- Model compatibility
- Use case
- Difficulty level

**Detail Page:**

- Full prompt text (copyable)
- Variables/placeholders
- Example usage
- Related prompts

#### 8. Plugins Catalogue

**Route:** `/awesome-github/c/plugins/` → `/awesome-github/c/plugins/[slug]`
**Content Sources:**

- `plugins/` folder (installable plugin bundles)

**Catalogue Display:**

- Plugin name
- Compatibility (WordPress version, PHP version)
- Feature summary
- Installation method

**Detail Page:**

- Plugin documentation
- Feature list
- Configuration guide
- Requirements & dependencies

#### 9. Tools/Scripts Catalogue

**Route:** `/awesome-github/c/tools/` → `/awesome-github/c/tools/[slug]`
**Content Sources:**

- `.github/scripts/` folder (utility scripts documentation)
- `profile/` folder (profile configurations)
- `.github/` folder (GitHub-native tools)

**Catalogue Display:**

- Tool name
- Category (validation/automation/monitoring)
- Language/platform
- Quick description

**Detail Page:**

- Full documentation
- Usage examples
- Installation/setup
- Troubleshooting

---

## Part 3: Design Components to Astro Implementation

### 3.1 Existing Astro Components (Already in place)

**Navigation & Layout:**

- ✅ `AwesomeGithubLayout.astro` — Main layout wrapper
- ✅ `AwesomeGithubNav.astro` — Top navigation bar
- ✅ `AwesomeGithubFooter.astro` — Footer section

**UI Components:**

- ✅ `AwesomeGithubCard.astro` — Resource card component
- ✅ `AwesomeGithubButton.astro` — CTA button variants
- ✅ `AwesomeGithubChip.astro` — Tag/filter chip component

**Pages (Partial Implementation):**

- ✅ `src/pages/awesome-github/index.astro` — Home page
- ✅ `src/pages/awesome-github/c/[type]/index.astro` — Catalogue list
- ✅ `src/pages/awesome-github/c/[type]/[slug].astro` — Resource detail

### 3.2 Components Needed (from Design)

Based on `design_source/` JSX files:

**Layout & Chrome Components:**

- ☐ `SearchPalette.astro` — Command palette (search modal, Cmd/Ctrl+K)
- ☐ `ThemeToggle.astro` — Light/dark theme switcher
- ☐ `Toast.astro` — Transient notification (copy confirm, etc.)
- ☐ `BranchSwitch.astro` — main ⇄ develop URL switcher

**Page-Specific Components:**

- ☐ `HeroSection.astro` — Dark hero with eyebrow, H1, CTA pair
- ☐ `CatalogueGrid.astro` — Grid of resource cards with filters
- ☐ `ResourceDetail.astro` — Resource detail layout + action buttons
- ☐ `LearnTrackCard.astro` — Learning track summary card
- ☐ `LessonReader.astro` — Lesson content + progress tracking
- ☐ `OnboardingSteps.astro` — Numbered step layout
- ☐ `Breadcrumb.astro` — Navigation breadcrumb
- ☐ `MarkdownRenderer.astro` — Markdown-to-HTML with sanitisation
- ☐ `FilterInput.astro` — Live search/filter input
- ☐ `TagFilter.astro` — Pill-style tag filter row
- ☐ `CopyButton.astro` — Copy-to-clipboard with toast

**Data Helpers:**

- ☐ `generateResourceUrls()` — Build GitHub/raw/vscode: URLs with branch switch
- ☐ `parseResourceMetadata()` — Extract frontmatter, versions, dates
- ☐ `buildCatalogueIndex()` — Index resources by type/tags for search/filtering

### 3.3 Design Tokens & Styling

**Priority 1: Port Design Tokens**
From `design_source/colors_and_type.css`:

**CSS Variables (Light Mode):**

```css
--bg: #FFFFFF
--bg-alt: #F9FAFB
--fg: #090909
--fg-2: #565656
--fg-3: #757575
--border: #E1E1E1
--accent: #1E6AFF
--fg-link: #1E6AFF

--color-success: #16A34A
--color-warning: #F59E0B
--color-error: #EF4444
--color-info: #1E6AFF
```

**CSS Variables (Dark Mode `[data-theme="dark"]`):**

```css
--bg: #0F1014
--fg: #FFFFFF
--fg-2: #B8B8B8
--border: rgba(255,255,255,0.08)
--accent: #7BE7FF
```

**Typography Scale:**

- Display XL: `clamp(48px, 6vw, 80px)`
- H1: `clamp(40px, 4.5vw, 60px)`
- H2: `clamp(32px, 3.4vw, 48px)`
- H3: `40px`
- H4: `24px`
- Body: `16px`
- Body Small: `14px`
- Code: `13px`

**Font Families:**

- Display/Headings: **Inter** (700–800 weight, variable)
- Body: **Manrope** (400/500 weight, variable)
- Mono: **IBM Plex Mono** (code blocks, file paths)
- Quote: **Lora** italic (pull-quotes, testimonials)

**Spacing System (8pt grid):**

- Base unit: 8px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160px

**Border Radius:**

- Buttons: `4px`
- Inputs/cards: `8px`
- Content cards: `12px`
- Pills/chips: `9999px`

**Shadows:**

- Rest: `0 6px 16px rgba(9,9,9,.08)`
- Hover: `0 18px 40px rgba(9,9,9,.12)`

### 3.4 CSS Files to Port

From `design_source/`:

1. `colors_and_type.css` — **Design tokens + typography** (port first)
2. `app-styles.css` — **Component styling** (buttons, nav, layout)
3. `pages-v2.css` — **Page-specific styles**
4. `extra-styles.css` — **Utilities + helpers**

**Integration Approach:**

- Add tokens to Astro's global stylesheet (`src/styles/global.css` or new `design-tokens.css`)
- Scope component styles to individual `.astro` files using `<style>` blocks
- Use global CSS for layout/typography; scoped styles for component-specific rules

---

## Part 4: Content Collection Strategy

### 4.1 Astro Content Collections (Recommended)

Instead of querying file system, use Astro's `content/` collections for type-safety:

```
src/content/
├── agents/
│   ├── claude.md
│   ├── gemini.md
│   └── ...
├── instructions/
│   ├── coding-standards.md
│   ├── a11y.md
│   └── ...
├── cookbook/
│   ├── prd-playbook.md
│   └── ...
└── collections.config.ts
```

**Schema Example (collections.config.ts):**

```typescript
import { defineCollection, z } from 'astro:content';

const agentsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    last_updated: z.date().optional(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    estimated_read_time: z.number().optional(),
  }),
});

export const collections = {
  agents: agentsCollection,
  instructions: defineCollection({ /* ... */ }),
  cookbook: defineCollection({ /* ... */ }),
};
```

### 4.2 Content Migration (Preserve Existing .md Files)

**Do NOT move or rewrite** existing `.md` files. Instead:

1. Create Astro collection entries that **reference** the original files
2. Use file path aliases to import content at build time
3. Preserve `frontmatter` — add new fields as needed (e.g., `category`, `estimatedReadTime`)

**Example: Symlink or copy with path alias**

```typescript
// In build process
const content = await Astro.glob('../../instructions/*.instructions.md');
// Extract frontmatter, build collection index
```

---

## Part 5: Learning Centre & Progress Tracking

### 5.1 Learn Page Structure

**Route:** `/awesome-github/learn/`

**Data Sources:**

- `learn-data.js` (from design) → convert to `src/content/learn/`
- Lessons drawn from: `instructions/`, `cookbook/`, `ai/`

**Content Structure:**

```
Track 1: Getting Started (2 lessons)
├── Lesson 1.1: Setting up the .github repo
├── Lesson 1.2: Understanding branch governance

Track 2: Coding Standards (3 lessons)
├── Lesson 2.1: WordPress coding standards
├── Lesson 2.2: Documentation practices
├── Lesson 2.3: Code review expectations

Track 3: AI Operations (4 lessons)
├── Lesson 3.1: Claude agent introduction
├── Lesson 3.2: Writing effective prompts
├── Lesson 3.3: Automation & hooks
├── Lesson 3.4: Workflow orchestration
```

### 5.2 Progress Persistence

- **Storage:** localStorage (theme preference, learn progress, branch choice)
- **Schema:** `{ learnProgress: { lesson_id: true, ... }, theme: 'light'|'dark', branch: 'main'|'develop' }`
- **Component:** Small client island (Astro + minimal JS)

---

## Part 6: Data Files Mapping

### 6.1 Design Source Data Files → Astro Equivalent

| Design File | Purpose | Astro Approach |
|---|---|---|
| `data.js` | Catalogue items + interaction matrix | Build from file system + frontmatter metadata |
| `content-data.js` | Page/editorial content | Astro content collections |
| `learn-data.js` | Learning tracks & lessons | Astro collections + frontmatter |
| `glossary-data.js` | Term definitions | Astro collection or single glossary page |

### 6.2 Resource Interaction Matrix (from design `data.js`)

Maps resource **type** to available actions:

| Resource Type | Copy Raw | Download | Open GitHub | Install VS Code |
|---|---|---|---|---|
| Agent | ✓ | ✓ | ✓ | ✓ |
| Instruction | ✓ | ✓ | ✓ | ✗ |
| Workflow | ✓ | ✗ | ✓ | ✗ |
| Hook | ✓ | ✓ | ✓ | ✗ |
| Skill | ✓ | ✓ | ✓ | ✓ |
| Plugin | ✗ | ✗ | ✓ | ✗ |
| Tool/Script | ✓ | ✓ | ✓ | ✗ |

**Implementation:** Use frontmatter field `actions: ['copy', 'download', 'github', 'vscode']` to control button visibility.

---

## Part 7: Implementation Roadmap

### Phase 1: Foundation (Week 1)

- [ ] Port design tokens to `src/styles/design-tokens.css`
- [ ] Self-host fonts (Inter, Manrope) in `src/fonts/`
- [ ] Build shared layout components (Nav, Footer, Theme toggle)
- [ ] Set up content collections structure
- [ ] Index existing `.md` files from `instructions/`, `cookbook/`, `ai/`

### Phase 2: Home Page (Week 1-2)

- [ ] Dark hero section with CTA buttons
- [ ] Catalogue grid with category previews
- [ ] Stats/metrics strip
- [ ] Editorial blocks (alternating light/dark sections)
- [ ] Breadcrumb navigation

### Phase 3: Catalogue (Week 2-3)

- [ ] Catalogue list page with type-specific layouts
- [ ] Search/filter input with live count
- [ ] Tag filter pills
- [ ] Resource card grid with hover effects
- [ ] Detail page with markdown rendering + action buttons
- [ ] Branch switch (main ⇄ develop) for URL generation

### Phase 4: Learning Centre (Week 3-4)

- [ ] Learn hub page with track cards
- [ ] Lesson reader with progress tracking
- [ ] localStorage persistence
- [ ] Prev/next navigation between lessons
- [ ] Progress bar & completion badges

### Phase 5: Getting Started & Extras (Week 4)

- [ ] Getting-started onboarding (10-min flow)
- [ ] Cookbook page (recipes, playbooks)
- [ ] Glossary (term definitions)
- [ ] Editorial pages (Why, References)
- [ ] Search palette (Cmd/Ctrl+K)

### Phase 6: Polish & Testing (Week 5)

- [ ] Responsive design testing
- [ ] Accessibility audit (WCAG 2.2 AA)
- [ ] Performance optimization
- [ ] Dark mode testing
- [ ] Copy/clipboard interactions
- [ ] Toast notifications

---

## Part 8: File Organization

### Astro Project Structure (Final)

```
website/
├── src/
│   ├── components/
│   │   ├── AwesomeGithub/
│   │   │   ├── Nav.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Card.astro
│   │   │   ├── Button.astro
│   │   │   ├── SearchPalette.astro
│   │   │   ├── Toast.astro
│   │   │   ├── BranchSwitch.astro
│   │   │   └── [...more components]
│   │   └── [...other components]
│   ├── content/
│   │   ├── agents/
│   │   ├── instructions/
│   │   ├── cookbook/
│   │   ├── skills/
│   │   ├── hooks/
│   │   ├── workflows/
│   │   ├── prompts/
│   │   ├── tools/
│   │   ├── learn/
│   │   └── config.ts
│   ├── layouts/
│   │   ├── AwesomeGithubLayout.astro
│   │   └── [...other layouts]
│   ├── pages/
│   │   ├── awesome-github/
│   │   │   ├── index.astro
│   │   │   ├── getting-started.astro
│   │   │   ├── learn/
│   │   │   │   ├── index.astro
│   │   │   │   └── [...slug].astro
│   │   │   ├── cookbook/
│   │   │   ├── glossary/
│   │   │   ├── c/
│   │   │   │   ├── [type]/
│   │   │   │   │   ├── index.astro
│   │   │   │   │   └── [slug].astro
│   │   │   ├── why.astro
│   │   │   └── references.astro
│   │   └── [...other pages]
│   ├── styles/
│   │   ├── design-tokens.css
│   │   ├── global.css
│   │   └── [...utility styles]
│   ├── fonts/
│   │   ├── Inter-VariableFont_opsz_wght.woff2
│   │   └── Manrope-VariableFont_wght.woff2
│   ├── lib/
│   │   ├── resources.ts (index, search, filter)
│   │   ├── urls.ts (URL builders, branch switch)
│   │   └── metadata.ts (frontmatter parsing)
│   └── types/
│       └── content.ts
├── astro.config.mjs
└── package.json
```

---

## Part 9: Frontmatter Standards

### 9.1 Enhanced Frontmatter (Add to Existing .md Files)

**Instruction Files** (already have some fields):

```yaml
---
title: "Coding Standards"
description: "WordPress coding standards and best practices"
version: "1.0"
last_updated: "2026-06-01"
file_type: "instruction"
maintainer: "LightSpeed Team"
category: "Development"
difficulty: "Beginner"
estimated_read_time: 5
tags: ["coding", "standards", "wordpress"]
---
```

**Agent Files:**

```yaml
---
title: "Claude Agent"
description: "LightSpeedWP's primary AI agent"
version: "1.0"
last_updated: "2026-06-01"
category: "AI Agent"
type: "claude"
difficulty: "Intermediate"
tags: ["ai", "claude", "automation"]
actions: ["copy", "download", "github", "vscode"]
---
```

**Skill Files:**

```yaml
---
title: "Code Review Skill"
description: "Automated code review capability"
category: "Automation"
type: "skill"
installation: "vscode"
difficulty: "Intermediate"
tags: ["code-review", "automation"]
actions: ["copy", "download", "github", "vscode"]
---
```

**Cookbook/Recipe Files:**

```yaml
---
title: "Project Planning Playbook"
description: "Step-by-step guide for planning WordPress projects"
type: "playbook"
difficulty: "Intermediate"
estimated_read_time: 120
use_case: "Project Setup"
tags: ["planning", "wordpress", "process"]
---
```

---

## Part 10: Special Features & Interactions

### 10.1 Search Palette (Cmd/Ctrl+K)

**Implementation:** Small React/Astro island

- Index all resources by type/title/description
- Keyboard navigation (↑↓ arrows, Enter to select, Esc to close)
- Real-time filtering as user types
- Group results by type (Agents, Instructions, Skills, etc.)
- Show keyboard hint in nav

**Data Source:**

- Build index from all content collections at build time
- Expose via `generateSearchIndex()` utility

### 10.2 Branch Switch (main ⇄ develop)

**Implementation:** Toggle button in nav

- Stored in localStorage (`branch: 'main'|'develop'`)
- Affects all GitHub/raw/vscode: URL generation
- Selector function: `generateResourceUrl(slug, type, action, branch)`

**URL Patterns:**

```
Copy raw:
- develop: https://raw.githubusercontent.com/lightspeedwp/.github/develop/{path}/{file}
- main: https://raw.githubusercontent.com/lightspeedwp/.github/main/{path}/{file}

Open on GitHub:
- develop: https://github.com/lightspeedwp/.github/blob/develop/{path}/{file}
- main: https://github.com/lightspeedwp/.github/blob/main/{path}/{file}

VS Code:
- vscode:{route}/install?url=https://raw.githubusercontent.com/lightspeedwp/.github/{branch}/{path}/{file}
```

### 10.3 Copy-to-Clipboard & Toast

**Implementation:**

```typescript
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success', 2200);
  } catch (err) {
    showToast('Failed to copy', 'error', 2200);
  }
}
```

**Toast Component:**

- Auto-dismiss after 2.2 seconds
- Position: bottom-right
- Style: solid bg, white text, subtle shadow

### 10.4 Dark Mode Toggle

**Implementation:**

- Button in nav (sun/moon icon)
- Stored in localStorage
- CSS class on `<html>` root: `[data-theme="dark"]`
- CSS variable overrides for dark palette

**Persistence:**

```javascript
// On page load
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

// On toggle
localStorage.setItem('theme', newTheme);
```

---

## Part 11: Content Structure Examples

### 11.1 Example: Instructions Catalogue Entry

**Source:** `instructions/coding-standards.instructions.md`

**Frontmatter (enhance existing):**

```yaml
---
title: "Coding Standards"
description: "WordPress coding standards and best practices for LightSpeedWP projects"
version: "v1.2"
last_updated: "2026-05-20"
category: "Development"
difficulty: "Beginner"
estimated_read_time: 8
tags: ["coding", "standards", "wordpress", "php", "javascript"]
file_type: "instruction"
maintainer: "LightSpeed Team"
---
```

**Display in Catalogue:**

- Icon: 📋 (code brackets)
- Title: "Coding Standards"
- Category badge: "Development"
- Difficulty: "Beginner"
- Read time: "8 min"
- Description: first 100 chars of frontmatter `description`
- Tags: clickable filter pills

**Detail Page:**

- Full markdown content
- Table of contents (auto-generated from h2, h3)
- Copy buttons on code examples
- Related instructions (same category/tags)
- "Open on GitHub" button

### 11.2 Example: Agent Catalogue Entry

**Source:** `ai/Claude.md`

**Frontmatter (new for webpage):**

```yaml
---
title: "Claude Agent"
description: "LightSpeedWP's primary AI agent for code review, documentation, and automation tasks"
version: "1.0"
last_updated: "2026-05-15"
category: "AI Agent"
type: "claude"
complexity: "Intermediate"
tags: ["ai", "claude", "automation", "code-review"]
actions: ["copy", "download", "github", "vscode"]
---
```

**Display:**

- Icon: 🤖 (Claude logo/badge)
- Title: "Claude Agent"
- Type badge: "Claude"
- Description
- Tags

**Detail Page:**

- Full markdown (Claude.md content)
- Copy raw file button (with toast)
- Download JSON config button
- Open on GitHub button
- Install in VS Code deep link
- Branch switch (main/develop)
- Related agents (by tag)

---

## Part 12: Key Dependencies & Tools

### 12.1 Required Astro Integrations

```json
{
  "dependencies": {
    "astro": "^4.0.0",
    "marked": "^11.0.0",
    "dompurify": "^3.0.0",
    "@heroicons/react": "^2.0.0"
  }
}
```

### 12.2 Build Utilities

- **`generateSearchIndex()`** — Build searchable index from collections
- **`generateResourceUrl()`** — Build GitHub/raw/vscode URLs with branch switch
- **`parseMarkdown()`** — Convert markdown to HTML with sanitisation
- **`extractFrontmatter()`** — Parse YAML frontmatter from .md files
- **`calculateReadTime()`** — Estimate reading time from word count

---

## Part 13: Validation Checklist

### Before Launch

- [ ] All 9 resource types catalogue & displayable
- [ ] Home page matches design (dark hero, CTA, grid, stats)
- [ ] Learn centre with progress tracking functional
- [ ] Getting started 10-min flow complete
- [ ] Search palette (Cmd/Ctrl+K) functional
- [ ] Branch switch (main/develop) working
- [ ] Copy buttons fire toasts correctly
- [ ] Dark mode toggle persists
- [ ] All GitHub URLs correct (raw, blob, vscode:)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility: WCAG 2.2 AA (axe-core audit)
- [ ] Performance: Lighthouse >90 (LCP, CLS, FID)
- [ ] No console errors
- [ ] All fonts loaded (Inter, Manrope, IBM Plex Mono)
- [ ] Design tokens match pixels (colors, spacing, radii)

---

## Part 14: References & Authoritative Sources

**Design Documentation:**

- `design_handoff_awesome_github/README.md` — Design spec & requirements
- `design_source/colors_and_type.css` — All design tokens

**Repository Standards:**

- `CLAUDE.md` — Project instructions (this file, high-level)
- `AGENTS.md` — Global AI rules
- `docs/BRANCHING_STRATEGY.md` — Git workflow

**Content Sources:**

- `instructions/` — 37 standard guides
- `ai/` — AI agent references
- `cookbook/` — Recipes & playbooks
- `skills/` — Self-contained skills
- `hooks/`, `workflows/`, `plugins/` — Portable assets

**Astro Resources:**

- [Astro Docs](https://docs.astro.build) — Framework reference
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) — Type-safe content

---

## Appendix A: Frontmatter Field Definitions

| Field | Type | Required | Example | Use |
|-------|------|----------|---------|-----|
| `title` | string | ✓ | "Coding Standards" | Display title, SEO |
| `description` | string | ✓ | "WordPress standards…" | Catalogue preview, meta |
| `version` | string | ✗ | "1.0", "v1.2.3" | Display in catalogue |
| `last_updated` | date | ✗ | "2026-05-20" | Sort, freshness indicator |
| `category` | string | ✗ | "Development" | Grouping, filtering |
| `tags` | array | ✗ | ["coding", "standards"] | Search, filtering |
| `difficulty` | enum | ✗ | "Beginner" | Learning progression |
| `estimated_read_time` | number | ✗ | 8 | Display in catalogue |
| `type` | string | ✗ | "agent", "skill", "instruction" | Resource type |
| `actions` | array | ✗ | ["copy", "github", "vscode"] | Action button visibility |
| `file_type` | string | ✗ | "instruction", "agent" | Metadata, sorting |
| `maintainer` | string | ✗ | "LightSpeed Team" | Attribution |

---

## Appendix B: Design Source File Quick Reference

| File | Content | When to Reference |
|------|---------|-------------------|
| `app.jsx` | Main router, app structure | Routes, navigation flow |
| `chrome.jsx` | Nav, footer, theme toggle, toast | Layout, persistent UI |
| `views.jsx` | Home, catalogue, detail views | Page layouts |
| `pages.jsx` | Catalogue grid & filtering | Card display, filter logic |
| `learn.jsx` | Learning centre layout | Learn page structure |
| `onboarding.jsx` | Getting started steps | Onboarding layout |
| `cookbook.jsx` | Recipe/playbook listing | Cookbook page |
| `markdown.jsx` | Markdown rendering | Content rendering strategy |
| `search.jsx` | Search palette | Search UI, keyboard nav |
| `data.js` | Resource catalogue data | Resource types, actions |
| `learn-data.js` | Learning tracks & lessons | Learn structure |
| `glossary-data.js` | Term definitions | Glossary terms |
| `icons.jsx` | Icon definitions | Icon usage |
| `colors_and_type.css` | All design tokens | **Port first!** |
| `app-styles.css` | Component styling | Button, card styles |
| `pages-v2.css` | Page-specific styles | Page layouts |
| `Awesome GitHub.html` | Entry point, load order | Overall structure |

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*
