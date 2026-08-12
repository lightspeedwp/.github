---
title: "Content Migration Strategy"
description: "Guidelines for migrating content to Astro and Content Collections"
version: "1.0"
last_updated: "2026-06-04"
---

# Content Migration to Astro

This document provides guidelines for migrating existing repository content to the Awesome GitHub Astro website using Astro Content Collections.

## Overview

Instead of moving or rewriting existing `.md` files, the migration strategy creates Astro collection entries that **reference** the original files in their existing locations. This preserves:

- Original file structure and organization
- Historical metadata and version information
- Existing frontmatter and documentation standards
- Links and cross-references throughout the codebase

## Approach: Reference, Don't Move

**Do NOT move or rewrite** existing `.md` files. Instead:

1. Create Astro collection entries that import content from the original file paths
2. Use file path aliases to reference content at build time
3. Extract and enhance frontmatter as needed
4. Build collection indexes for search, filtering, and navigation

### Example: Instructions Collection

**Original file location:**

```
instructions/coding-standards.instructions.md
```

**Astro collection approach:**

```
src/content/instructions/coding-standards.md (new entry, references original)
```

The new entry:

- Copies frontmatter from the original file
- Adds new fields (category, difficulty, estimated_read_time) without breaking existing files
- Points to the original file via import or alias
- Provides type-safe schema validation in Astro

## Content Collection Structure

### File Organization

```
src/content/
├── agents/                    # From agents/ folder
├── instructions/              # From instructions/ folder  
├── cookbook/                  # From cookbook/ folder
├── skills/                    # From skills/ folder (SKILL.md files)
├── hooks/                     # From hooks/ folder
├── workflows/                 # From workflows/ folder
├── prompts/                   # From prompts/ folder
├── tools/                     # From .github/scripts/ + tools/ documentation
└── config.ts                  # Unified schema definitions
```

### Frontmatter Standards

All resource types should follow a consistent set of fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✓ | Display title |
| `description` | string | ✓ | One-line summary |
| `category` | string | ✗ | Topic/grouping |
| `difficulty` | enum | ✗ | Beginner, Intermediate, Advanced |
| `estimated_read_time` | number | ✗ | Minutes to read |
| `tags` | array | ✗ | For search/filtering |
| `last_updated` | date | ✗ | ISO format |
| `type` | string | ✗ | Resource type (agent, skill, workflow) |
| `actions` | array | ✗ | Available actions (copy, download, github, vscode) |
| `version` | string | ✗ | Version number |

### Schema Consistency

All collections should use consistent field names:

- **Always `difficulty`** (not `complexity`) for skill level
- **Always `estimated_read_time`** (in minutes) for time estimates
- **Always `last_updated`** (snake_case, ISO date) for metadata
- **Always `snake_case`** for all field names (consistency with existing frontmatter)

## Build-Time Integration

### Content Collection Configuration (collections.config.ts)

```typescript
import { defineCollection, z } from 'astro:content';

// Shared base schema
const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  last_updated: z.date().optional(),
  version: z.string().optional(),
});

// Instructions collection
const instructionsCollection = defineCollection({
  schema: baseSchema.extend({
    file_type: z.literal('instruction'),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    estimated_read_time: z.number().optional(),
  }),
});

// Agents collection
const agentsCollection = defineCollection({
  schema: baseSchema.extend({
    type: z.string(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    actions: z.array(z.string()).optional(),
  }),
});

// Skills collection
const skillsCollection = defineCollection({
  schema: baseSchema.extend({
    type: z.literal('skill'),
    installation: z.string().optional(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    actions: z.array(z.string()).optional(),
  }),
});

export const collections = {
  instructions: instructionsCollection,
  agents: agentsCollection,
  skills: skillsCollection,
  // ... other collections
};
```

## Migration Phases

### Phase 1: Infrastructure Setup

- [ ] Create `src/content/` directory structure
- [ ] Define collection schemas in `collections.config.ts`
- [ ] Create collection helper functions in `src/lib/`
- [ ] Test collection loading and schema validation

### Phase 2: Content Indexing

- [ ] Index all `instructions/` files as collection entries
- [ ] Index all `ai/` files as agent collection entries
- [ ] Index all `skills/` files with SKILL.md extraction
- [ ] Index other resource types (hooks, workflows, etc.)

### Phase 3: Frontmatter Enhancement

- [ ] Add missing frontmatter fields to existing `.md` files
- [ ] Standardize field names and types
- [ ] Validate against collection schemas
- [ ] Fix any schema validation errors

### Phase 4: Search & Navigation

- [ ] Build searchable resource index
- [ ] Implement filtering by type, category, difficulty, tags
- [ ] Create catalogue pages using collection data
- [ ] Wire up search palette and navigation

## References

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Awesome GitHub Mapping Strategy](../AWESOME_GITHUB_MAPPING_STRATEGY.md)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
