---
name: spacing-mapper
description: >
  Migrate WordPress theme spacing presets from numeric to semantic slugs
  (e.g., Die Papier to Ollie). Use when converting theme spacing systems,
  standardizing design tokens between themes, updating spacing preset naming
  conventions in theme.json and pattern files, migrating spacing values,
  updating CSS variables for spacing, or aligning with reference theme spacing
  architecture—even when they just mention spacing presets or design token migration.
license: MIT
compatibility: Requires Node.js 18+
metadata:
  version: "1.0.0"
  author: lightspeedwp
---

# Spacing Mapper

## Purpose

Scan and migrate spacing preset references from **numeric system** (10, 20, 30, etc.) to **semantic system** (small, medium, large, etc.) across WordPress theme files.

Handles both WordPress spacing variable formats:
- `var:preset|spacing|40` (theme.json pipe format)
- `var(--wp--preset--spacing--40)` (CSS variable format)

## Quick Start

```bash
# From theme root

# Show spacing mapping table
node scripts/spacing-mapper.cjs --map

# Scan entire theme
node scripts/spacing-mapper.cjs --scan ./

# Preview changes (safe - doesn't modify files)
node scripts/spacing-mapper.cjs --update ./ --dry-run

# Update files (only direct mappings)
node scripts/spacing-mapper.cjs --update ./

# Show detailed output
node scripts/spacing-mapper.cjs --scan ./ --verbose
```

## Direct Mappings (Auto-Update Safe)

| Numeric | → | Semantic | Size | 
|---------|---|----------|------|
| `30` | → | `small` | 0.75rem |
| `40` | → | `medium` | 1rem |
| `50` | → | `large` | 1.25rem |
| `60` | → | `x-large` | 1.5rem |
| `80` | → | `xx-large` | 2rem |
| `100` | → | `xxx-large` | 2.5rem |

## Usage Workflow

1. **Backup theme** - Commit to git or create backup copy
2. **Scan current usage** - See which spacing values are used
3. **Review report** - Identify auto-safe vs manual-review cases
4. **Preview changes** - Dry-run to see what will change
5. **Update files** - Apply direct mappings
6. **Handle edge cases** - Manually review values without direct mappings
7. **Test thoroughly** - Visual inspection and responsive testing

## Common Use Cases

- Migrating from Die Papier to Ollie spacing system
- Standardizing spacing tokens across themes
- Converting numeric to semantic naming conventions
- Aligning with WordPress theme.json best practices

## Edge Cases Requiring Manual Review

Some values don't have direct semantic equivalents:

- `10` (0.25rem) - No Ollie equivalent, suggest `small` (0.75rem)
- `20` (0.5rem) - No Ollie equivalent, suggest `small` (0.75rem)
- `70` (1.75rem) - Falls between `x-large` and `xx-large`

**Options:**
1. Add custom sizes to target theme
2. Map to nearest semantic size
3. Accept visual differences

## Validation

After migration:

```bash
# Check for remaining numeric spacing references
grep -r "spacing|[0-9]" ./patterns ./parts

# Verify theme.json spacing presets updated
cat styles/presets/spacing.json
```

For detailed migration strategy and examples, see:
- [Migration Guide](references/MIGRATION-GUIDE.md)
- [Usage Reference](references/USAGE.md)
