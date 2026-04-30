# Skills Alignment with agentskills.io Specification

**Date**: 2026-04-30  
**Status**: Recommendations for alignment

---

## Executive Summary

Your current skills implementation has **good foundational structure** but requires significant alignment with the [agentskills.io specification](https://agentskills.io/specification). The main issues are:

1. ❌ **Missing YAML frontmatter** in all SKILL.md files (required fields: `name`, `description`)
2. ❌ **Inconsistent directory structure** (mix of directories and standalone .md files)
3. ❌ **Scripts not properly organized** (should be in skill-specific `scripts/` subdirectories)
4. ⚠️ **Descriptions not optimized** for agent triggering (too technical, not intent-focused)
5. ⚠️ **No progressive disclosure** (everything in SKILL.md vs using `references/`)
6. ⚠️ **Duplicate/redundant files** (e.g., wordpress-block-pattern-generator.md + directory)

---

## Current Structure Analysis

### ✅ Properly Structured Skills (need frontmatter)

These follow the directory + SKILL.md pattern but lack required YAML frontmatter:

```
wordpress-block-pattern-generator/
├── SKILL.md                          ❌ Missing frontmatter
wordpress-block-pattern-validator/
├── SKILL.md                          ❌ Missing frontmatter
├── README.md                         ⚠️ Should be references/README.md
├── validate-patterns.cjs             ⚠️ Should be scripts/validate-patterns.cjs
wordpress-theme-json-mapper/
├── SKILL.md                          ❌ Missing frontmatter
├── README.md                         ⚠️ Should be references/README.md
theme-json-to-preset-folders/
├── SKILL.md                          ❌ Missing frontmatter
```

### ❌ Improperly Structured Skills

These need to be converted to proper skill directories:

**Standalone markdown files:**
- `INC-FORMATTER.md` → Should become `inc-formatter/SKILL.md`
- `SPACING-MIGRATION.md` → Should become `spacing-migration/SKILL.md`
- `wordpress-block-pattern-generator.md` → Duplicate, should be removed

**Root-level scripts:**
- `inc-formatter.cjs` → Should move to `inc-formatter/scripts/inc-formatter.cjs`
- `spacing-mapper.cjs` → Should move to `spacing-mapper/scripts/spacing-mapper.cjs`

**Root-level documentation:**
- `SPACING-MAPPER-USAGE.md` → Should move to `spacing-mapper/references/USAGE.md`
- `INC-FORMATTER-BUGFIX-REPORT.md` → Should move to `inc-formatter/references/BUGFIX-REPORT.md`
- `README.md` → Keep as directory index

---

## Recommended Target Structure

```
skills/
├── README.md                                    ✅ Directory index
│
├── inc-formatter/                               🆕 NEW STRUCTURE
│   ├── SKILL.md                                 🆕 With frontmatter
│   ├── scripts/
│   │   └── inc-formatter.cjs                    📦 MOVED
│   └── references/
│       └── BUGFIX-REPORT.md                     📦 MOVED
│
├── spacing-mapper/                              🆕 NEW STRUCTURE
│   ├── SKILL.md                                 🆕 With frontmatter
│   ├── scripts/
│   │   └── spacing-mapper.cjs                   📦 MOVED
│   └── references/
│       ├── USAGE.md                             📦 MOVED
│       └── MIGRATION-GUIDE.md                   📦 MOVED
│
├── wordpress-block-pattern-generator/           ✅ KEEP
│   ├── SKILL.md                                 🔄 ADD frontmatter
│   └── references/                              🆕 OPTIONAL
│       └── ADVANCED-USAGE.md                    🆕 Move verbose content
│
├── wordpress-block-pattern-validator/           ✅ KEEP
│   ├── SKILL.md                                 🔄 ADD frontmatter
│   ├── scripts/
│   │   └── validate-patterns.cjs                📦 MOVED
│   └── references/
│       └── VALIDATION-RULES.md                  📦 MOVED (from README.md)
│
├── wordpress-theme-json-mapper/                 ✅ KEEP
│   ├── SKILL.md                                 🔄 ADD frontmatter
│   └── references/
│       ├── SCHEMA-REFERENCE.md                  📦 MOVED (from README.md)
│       └── EXAMPLES.md                          🆕 OPTIONAL
│
└── theme-json-to-preset-folders/                ✅ KEEP
    ├── SKILL.md                                 🔄 ADD frontmatter
    └── references/
        └── WORKFLOW-DETAILS.md                  🆕 Move verbose workflow content
```

---

## Required Changes by Skill

### 1. inc-formatter

**Actions:**
1. Create directory: `inc-formatter/`
2. Convert `INC-FORMATTER.md` → `inc-formatter/SKILL.md` with frontmatter
3. Move `inc-formatter.cjs` → `inc-formatter/scripts/inc-formatter.cjs`
4. Move `INC-FORMATTER-BUGFIX-REPORT.md` → `inc-formatter/references/BUGFIX-REPORT.md`
5. Delete original standalone files

**Recommended frontmatter:**
```yaml
---
name: inc-formatter
description: >
  Standardize WordPress theme PHP files with namespaces and remove legacy
  function prefixes. Use when migrating theme inc/ files to modern conventions,
  converting prefixed functions to namespaced ones, or ensuring consistent PHP
  code structure across themes.
license: MIT
compatibility: Requires Node.js 18+
metadata:
  version: "1.0.0"
  author: lightspeedwp
---
```

**Description optimization:**
- ✅ Uses imperative phrasing ("Use when...")
- ✅ Focuses on user intent (migrating, converting, ensuring)
- ✅ Includes triggering keywords (PHP, namespace, theme, inc files)
- ✅ Under 1024 characters

---

### 2. spacing-mapper

**Actions:**
1. Create directory: `spacing-mapper/`
2. Convert `SPACING-MIGRATION.md` content into `spacing-mapper/SKILL.md` with frontmatter
3. Move `spacing-mapper.cjs` → `spacing-mapper/scripts/spacing-mapper.cjs`
4. Move `SPACING-MAPPER-USAGE.md` → `spacing-mapper/references/USAGE.md`
5. Extract migration strategy to `spacing-mapper/references/MIGRATION-GUIDE.md`
6. Delete original standalone files

**Recommended frontmatter:**
```yaml
---
name: spacing-mapper
description: >
  Migrate WordPress theme spacing presets from numeric to semantic slugs
  (e.g., Die Papier to Ollie). Use when converting theme spacing systems,
  standardizing design tokens between themes, or updating spacing preset
  naming conventions in theme.json and pattern files.
license: MIT
compatibility: Requires Node.js 18+
metadata:
  version: "1.0.0"
  author: lightspeedwp
---
```

**SKILL.md structure:**
```markdown
# Spacing Mapper Skill

## Quick Start
[Brief usage instructions]

## What This Skill Does
[1-2 paragraphs of core functionality]

## Usage Workflow
[Step-by-step process]

## Running the Script
[Commands with examples]

## Common Scenarios
[When to use this skill]

## Validation
[How to verify results]

For detailed migration strategies, see [references/MIGRATION-GUIDE.md](references/MIGRATION-GUIDE.md).
```

---

### 3. wordpress-block-pattern-generator

**Actions:**
1. Add YAML frontmatter to `SKILL.md`
2. **Reduce SKILL.md content** - currently 100+ lines, should be < 50 core lines
3. Move verbose sections to `references/`:
   - Prerequisites & Setup → `references/SETUP-GUIDE.md`
   - Example Setup Dialogue → `references/EXAMPLES.md`
   - Integration patterns → `references/INTEGRATION.md`
4. Delete duplicate `wordpress-block-pattern-generator.md` file

**Recommended frontmatter:**
```yaml
---
name: wordpress-block-pattern-generator
description: >
  Generate production-ready WordPress block patterns with accessibility (WCAG 2.1 AA),
  proper spacing presets, BEM naming, and integration with WooCommerce, LifterLMS,
  and ACF custom fields. Use when creating block patterns, building query loops
  for custom post types, designing hero sections, or implementing taxonomy filters.
license: MIT
compatibility: Requires understanding of WordPress block theme structure
metadata:
  version: "1.0.0"
  author: lightspeedwp
  tags: wordpress, blocks, patterns, accessibility
---
```

**Optimized SKILL.md structure:**
```markdown
# WordPress Block Pattern Generator

## Core Capabilities

[Bullet list of key features - 8-10 items max]

## Usage Workflow

1. **Gather Context** - See [references/SETUP-GUIDE.md](references/SETUP-GUIDE.md)
2. **Generate Pattern** - [Key steps]
3. **Validate Output** - [Validation steps]

## Quick Reference

### Required Information
- Theme plugin details (CPTs, taxonomies)
- Guidelines directory path
- Design token system

### Common Pattern Types
- Hero sections
- Query loops (custom post types)
- Card components
- WooCommerce product grids
- LifterLMS course cards

## Examples

For detailed setup dialogues and integration patterns, see:
- [Setup Guide](references/SETUP-GUIDE.md)
- [Integration Examples](references/INTEGRATION.md)
```

**Description optimization notes:**
- Current description is too implementation-focused
- Should emphasize **when to use** not just **what it does**
- Add more triggering keywords: "hero", "cards", "query loop", "custom post types"

---

### 4. wordpress-block-pattern-validator

**Actions:**
1. Add YAML frontmatter to `SKILL.md`
2. Move `validate-patterns.cjs` → `scripts/validate-patterns.cjs`
3. Move `README.md` content → `references/VALIDATION-RULES.md`
4. Reduce SKILL.md to core workflow (move verbose validation rules to references)

**Recommended frontmatter:**
```yaml
---
name: wordpress-block-pattern-validator
description: >
  Validate and fix WordPress block pattern files to ensure HTML matches block
  comment attributes. Use when debugging block validation errors, fixing font
  family attribute mismatches, correcting malformed CSS classes, or ensuring
  pattern files pass WordPress core rendering rules.
license: MIT
compatibility: Requires Node.js 18+
metadata:
  version: "1.0.0"
  author: lightspeedwp
---
```

**Optimized SKILL.md structure:**
```markdown
# WordPress Block Pattern Validator

## Purpose

Detect and fix mismatches between WordPress block attributes (JSON in comments) 
and HTML output to prevent block validation errors.

## Usage

```bash
# Validate a single pattern
node scripts/validate-patterns.cjs patterns/hero.php

# Validate and fix all patterns
node scripts/validate-patterns.cjs patterns/ --fix

# Dry-run (preview changes)
node scripts/validate-patterns.cjs patterns/ --fix --dry-run
```

## Common Issues Detected

- ❌ Redundant fontFamily attributes (stripped by WordPress)
- ❌ Malformed font size classes (has-h-3-font-size vs has-h3-font-size)
- ❌ Missing CSS classes
- ❌ Incorrect inline styles

## Validation Workflow

1. Parse block comments and extract attributes
2. Compare against WordPress core rendering rules
3. Report or fix mismatches
4. Generate validation report

For detailed validation rules and examples, see [references/VALIDATION-RULES.md](references/VALIDATION-RULES.md).
```

---

### 5. wordpress-theme-json-mapper

**Actions:**
1. Add YAML frontmatter to `SKILL.md`
2. Move `README.md` content → `references/SCHEMA-REFERENCE.md`
3. Reduce SKILL.md to core workflow
4. Create `references/EXAMPLES.md` for code samples

**Recommended frontmatter:**
```yaml
---
name: wordpress-theme-json-mapper
description: >
  Map design system tokens (colors, typography, spacing, layouts) to WordPress
  theme.json configuration. Use when translating design tokens to theme.json,
  converting style guides to WordPress presets, generating block styles from
  design systems, or creating theme.json from existing documentation.
license: MIT
compatibility: Requires access to design system documentation
metadata:
  version: "1.0.0"
  author: lightspeedwp
---
```

**Optimized SKILL.md structure:**
```markdown
# WordPress Theme.json Mapper

## Purpose

Translate design system tokens into WordPress-compatible theme.json structure,
including color presets, typography scales, spacing systems, and block styles.

## Input Requirements

Design tokens organized in:
- `guidelines/design-tokens/colors.md`
- `guidelines/design-tokens/typography.md`
- `guidelines/design-tokens/spacing.md`
- `guidelines/design-tokens/layout.md`

## Workflow

1. **Scan design system** - Locate token files
2. **Extract tokens** - Parse color, typography, spacing, layout values
3. **Map to theme.json** - Convert to WordPress preset format
4. **Generate output** - Create theme.json sections

## Output Structure

- `settings.color` - Color palette and gradients
- `settings.typography` - Font families, sizes, weights
- `settings.spacing` - Spacing scale presets
- `settings.layout` - Content/wide widths
- `styles.blocks.*` - Block-specific styles

For detailed schema reference and examples, see:
- [Schema Reference](references/SCHEMA-REFERENCE.md)
- [Mapping Examples](references/EXAMPLES.md)
```

---

### 6. theme-json-to-preset-folders

**Actions:**
1. Add YAML frontmatter to `SKILL.md`
2. Reduce verbose workflow content
3. Move detailed validation commands → `references/VALIDATION.md`

**Recommended frontmatter:**
```yaml
---
name: theme-json-to-preset-folders
description: >
  Extract a monolithic WordPress theme.json into modular preset files under
  styles/presets/. Use when migrating to modular theme.json architecture,
  reducing merge conflicts in design tokens, aligning with reference theme
  structure, or improving maintainability of theme settings.
license: MIT
compatibility: Requires understanding of theme.json structure
metadata:
  version: "1.0.0"
  author: lightspeedwp
---
```

**Optimized SKILL.md structure:**
```markdown
# Theme JSON to Preset Folders

## Purpose

Break up a monolithic theme.json into focused, modular preset files to reduce
merge conflicts and improve maintainability.

## Goal

- Keep `theme.json` minimal (recognition + color tokens only)
- Extract non-color settings/styles to `styles/presets/*.json`
- Extract block styles to `styles/presets/blocks/*.json`

## Expected Inputs

- Target theme path
- Target `theme.json`
- Optional: Reference theme for naming conventions

## Workflow

1. **Audit** - Inspect current theme.json structure
2. **Plan** - Define what stays in root vs presets
3. **Extract** - Create focused preset files
4. **Trim** - Remove extracted nodes from theme.json
5. **Validate** - Verify JSON syntax and preset loader

## Output Structure

```
styles/presets/
├── layout.json
├── spacing.json
├── typography.json
├── shadows.json
├── buttons.json
├── links.json
└── blocks/
    ├── core-button.json
    ├── core-heading.json
    └── ...
```

For validation commands and detailed workflow, see [references/WORKFLOW-DETAILS.md](references/WORKFLOW-DETAILS.md).
```

---

## Progressive Disclosure Strategy

### What stays in SKILL.md (< 500 lines, < 5000 tokens)

- **Description** (frontmatter)
- **Quick start** (1-2 commands)
- **Core capabilities** (bullet list)
- **Basic workflow** (5-7 steps)
- **Common use cases**
- **Quick reference** (key commands, options)
- **Links to references/**

### What moves to references/

- **Detailed documentation** (> 2 paragraphs)
- **API specifications**
- **Extensive examples**
- **Migration guides**
- **Validation rules**
- **Troubleshooting**
- **Advanced usage**

### When to load reference files

Instruct the agent explicitly in SKILL.md:

```markdown
## Validation

Run the validator script on all patterns:

```bash
node scripts/validate-patterns.cjs patterns/
```

If validation fails, consult [references/VALIDATION-RULES.md](references/VALIDATION-RULES.md) 
for detailed error explanations and fixes.
```

---

## Description Optimization Guidelines

### ❌ Current Anti-Patterns

**Too technical:**
```yaml
description: Automates the process of translating design system tokens (colors, 
  typography, spacing, layouts) into WordPress-compatible theme.json structure
```

**Too vague:**
```yaml
description: Process CSV files.
```

**Implementation-focused:**
```yaml
description: Expert in validating and fixing WordPress block pattern files
```

### ✅ Best Practices

**Use imperative phrasing:**
```yaml
description: >
  Use this skill when...
```

**Focus on user intent:**
```yaml
description: >
  Map design system tokens to WordPress theme.json. Use when translating 
  design tokens, converting style guides to WordPress presets, or creating 
  theme.json from documentation.
```

**Include triggering keywords:**
```yaml
description: >
  Generate WordPress block patterns with accessibility, spacing presets, and
  WooCommerce integration. Use when creating patterns, building query loops,
  designing hero sections, or implementing taxonomy filters.
  # Keywords: patterns, blocks, accessibility, WooCommerce, query loops, hero
```

**Be pushy about scope:**
```yaml
description: >
  ...even if the user doesn't explicitly mention "theme.json" or "design tokens"
```

### Description Optimization Process

1. **Write initial description** (focus on intent)
2. **Create eval queries** (see next section)
3. **Test trigger rates** (should-trigger vs should-not-trigger)
4. **Iterate based on failures**
5. **Validate generalization** (validation set)

---

## Testing & Validation Strategy

### Create Eval Queries

For each skill, create `eval-queries.json`:

```json
[
  {
    "query": "I need to add proper namespaces to my theme's PHP files in the inc folder",
    "should_trigger": true
  },
  {
    "query": "can you help me write a Python script to parse CSV files?",
    "should_trigger": false
  },
  {
    "query": "my block patterns keep showing validation errors in the editor",
    "should_trigger": true
  }
]
```

**Should-trigger examples:**
- Casual phrasing with typos
- Contextual (file paths, company names)
- Implicit (doesn't name the domain directly)
- Multi-step workflows

**Should-not-trigger examples:**
- Near-misses (share keywords but different domain)
- Adjacent capabilities (related but not this skill)

### Test Trigger Rates

Run each query 3x, compute trigger rate:
- **Pass**: should-trigger queries > 0.5 trigger rate
- **Pass**: should-not-trigger queries < 0.5 trigger rate

### Train/Validation Split

- **Train set (60%)**: Use to identify failures and guide improvements
- **Validation set (40%)**: Check if improvements generalize

---

## Implementation Roadmap

### Phase 1: Structural Alignment (1-2 days)

**Priority: HIGH**

1. ✅ Create new skill directories
2. ✅ Add YAML frontmatter to all SKILL.md files
3. ✅ Move scripts to `scripts/` subdirectories
4. ✅ Move documentation to `references/` subdirectories
5. ✅ Delete duplicate files

**Result:** All skills follow agentskills.io directory structure

### Phase 2: Content Optimization (2-3 days)

**Priority: MEDIUM**

1. ✅ Reduce SKILL.md files to < 500 lines
2. ✅ Extract verbose content to `references/`
3. ✅ Add progressive disclosure links
4. ✅ Standardize SKILL.md structure across all skills

**Result:** SKILL.md files are concise, references are comprehensive

### Phase 3: Description Optimization (1-2 days)

**Priority: HIGH**

1. ✅ Rewrite descriptions with imperative phrasing
2. ✅ Focus on user intent, not implementation
3. ✅ Add triggering keywords
4. ✅ Create eval-queries.json for each skill

**Result:** Descriptions trigger reliably on relevant prompts

### Phase 4: Testing & Validation (1 day)

**Priority: MEDIUM**

1. ✅ Test trigger rates with eval queries
2. ✅ Iterate on failed queries
3. ✅ Validate with fresh query set
4. ✅ Run skills-ref validator

**Result:** All skills pass validation and trigger tests

---

## Validation Checklist

Before marking a skill as "aligned":

### Structure
- [ ] Directory named with lowercase-letters-and-hyphens
- [ ] SKILL.md exists with YAML frontmatter
- [ ] `name` field matches directory name
- [ ] `description` field is 1-1024 characters
- [ ] Scripts in `scripts/` subdirectory (if applicable)
- [ ] Documentation in `references/` subdirectory
- [ ] No redundant files at root level

### Content
- [ ] SKILL.md is < 500 lines
- [ ] Core workflow is 5-7 steps
- [ ] Links to references/ for detailed content
- [ ] Examples are concise and practical
- [ ] No implementation details in description

### Description
- [ ] Uses imperative phrasing ("Use when...")
- [ ] Focuses on user intent
- [ ] Contains triggering keywords
- [ ] Under 1024 characters
- [ ] Tested with eval queries

### Validation
- [ ] Passes `skills-ref validate ./skill-name`
- [ ] Trigger rate > 0.5 for should-trigger queries
- [ ] Trigger rate < 0.5 for should-not-trigger queries
- [ ] Fresh validation queries pass

---

## Quick Wins

Start with these **high-impact, low-effort** changes:

1. **Add frontmatter to existing SKILL.md files** (1 hour)
   - wordpress-block-pattern-generator
   - wordpress-block-pattern-validator
   - wordpress-theme-json-mapper
   - theme-json-to-preset-folders

2. **Move scripts to scripts/ subdirectories** (30 minutes)
   - validate-patterns.cjs → wordpress-block-pattern-validator/scripts/
   - inc-formatter.cjs → inc-formatter/scripts/
   - spacing-mapper.cjs → spacing-mapper/scripts/

3. **Delete duplicate files** (15 minutes)
   - wordpress-block-pattern-generator.md (duplicate)

4. **Rewrite 3 descriptions** (1 hour)
   - Focus on wordpress-block-pattern-generator, inc-formatter, spacing-mapper
   - Use imperative phrasing and intent focus

---

## Resources

- **Specification**: https://agentskills.io/specification
- **Best Practices**: https://agentskills.io/skill-creation/best-practices
- **Description Optimization**: https://agentskills.io/skill-creation/optimizing-descriptions
- **Validator**: `npm install -g skills-ref` (if available)

---

## Next Steps

1. **Review this document** - Validate recommendations
2. **Prioritize phases** - Start with Phase 1 (structural alignment)
3. **Create backup** - `cp -r skills/ skills-backup/`
4. **Implement changes** - Follow roadmap systematically
5. **Validate results** - Use checklist for each skill

Would you like me to begin implementing any of these changes?
