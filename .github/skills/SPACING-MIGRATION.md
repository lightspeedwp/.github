# Die Papier to Ollie Spacing Migration

## Comparison Overview

### Current Die Papier Spacing System

```json
{
  "spacingSizes": [
    { "slug": "10", "size": "0.25rem", "name": "10 (Tiny)" },
    { "slug": "20", "size": "0.5rem", "name": "20 (XS)" },
    { "slug": "30", "size": "0.75rem", "name": "30 (Small)" },
    { "slug": "40", "size": "1rem", "name": "40 (Medium)" },
    { "slug": "50", "size": "1.25rem", "name": "50 (Large)" },
    { "slug": "60", "size": "1.5rem", "name": "60 (XL)" },
    { "slug": "70", "size": "1.75rem", "name": "70 (XL+)" },
    { "slug": "80", "size": "2rem", "name": "80 (2XL)" },
    { "slug": "100", "size": "2.5rem", "name": "100 (3XL)" }
  ]
}
```

### Ollie Spacing System

```json
{
  "spacingSizes": [
    { "slug": "small", "size": "0.75rem", "name": "Small" },
    { "slug": "medium", "size": "1rem", "name": "Medium" },
    { "slug": "large", "size": "1.25rem", "name": "Large" },
    { "slug": "x-large", "size": "1.5rem", "name": "Extra Large" },
    { "slug": "xx-large", "size": "2rem", "name": "2xl" },
    { "slug": "xxx-large", "size": "2.5rem", "name": "3xl" },
    { "slug": "xxxx-large", "size": "3rem", "name": "4xl" }
  ]
}
```

## Migration Strategy

### Automatic Mappings (Safe to Update)

These have exact rem value matches between systems:

| Die Papier | → | Ollie | Size | Confidence |
|------------|---|-------|------|-----------|
| `30` | → | `small` | 0.75rem | ✅ 100% |
| `40` | → | `medium` | 1rem | ✅ 100% |
| `50` | → | `large` | 1.25rem | ✅ 100% |
| `60` | → | `x-large` | 1.5rem | ✅ 100% |
| `80` | → | `xx-large` | 2rem | ✅ 100% |
| `100` | → | `xxx-large` | 2.5rem | ✅ 100% |

### Manual Review Required

These have no direct Ollie equivalent and require design decisions:

| Die Papier | Suggestion | Size | Reason |
|------------|-----------|------|--------|
| `10` | `small` (0.75rem) | 0.25rem | Ollie's smallest is 3x larger. Consider if this micro-spacing is essential to the design. |
| `20` | `small` (0.75rem) | 0.5rem | Ollie's smallest is 1.5x larger. May impact tight layouts. |
| `70` | `x-large` (1.5rem) or `xx-large` (2rem) | 1.75rem | Falls between two Ollie sizes. Choose based on visual preference. |

### Not in Die Papier

Ollie includes one size not present in Die Papier:

- `xxxx-large` (3rem) - Consider adding if larger spacing is needed

## Impact Assessment

### High-Use Considerations

Before migrating, audit usage of `10`, `20`, and `70`:

```bash
# Scan theme for spacing usage
node scripts/spacing-mapper.js --scan ./
```

If these sizes are heavily used:
1. **Option A**: Add custom Ollie sizes matching 0.25rem, 0.5rem, 1.75rem
2. **Option B**: Redesign layouts to use standard Ollie sizes
3. **Option C**: Accept visual differences and adjust manually

## Migration Steps

### 1. Backup Theme

```bash
# Create backup
cp -r wp-content/themes/die-papier-tema wp-content/themes/die-papier-tema-backup
```

### 2. Scan Current Usage

```bash
cd wp-content/themes/die-papier-tema
node scripts/spacing-mapper.js --scan ./
```

Review the report to understand:
- Which spacing values are most used
- Which files will be affected
- Scope of manual review needed

### 3. Preview Changes (Dry Run)

```bash
node scripts/spacing-mapper.js --update ./ --dry-run
```

### 4. Update Direct Mappings

```bash
# Update only exact rem matches (safe)
node scripts/spacing-mapper.js --update ./
```

### 5. Update spacing.json

Manually update `styles/presets/spacing.json` to Ollie slugs:

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "spacing": {
      "defaultSpacingSizes": false,
      "units": ["%", "px", "em", "rem", "vh", "vw"],
      "spacingSizes": [
        { "slug": "small", "size": "0.75rem", "name": "Small" },
        { "slug": "medium", "size": "1rem", "name": "Medium" },
        { "slug": "large", "size": "1.25rem", "name": "Large" },
        { "slug": "x-large", "size": "1.5rem", "name": "Extra Large" },
        { "slug": "xx-large", "size": "2rem", "name": "2xl" },
        { "slug": "xxx-large", "size": "2.5rem", "name": "3xl" },
        { "slug": "xxxx-large", "size": "3rem", "name": "4xl" }
      ]
    }
  }
}
```

### 6. Handle Edge Cases

For `10`, `20`, and `70` spacing values:

**Option 1 - Add Custom Sizes:**
```json
{
  "spacingSizes": [
    { "slug": "tiny", "size": "0.25rem", "name": "Tiny" },
    { "slug": "x-small", "size": "0.5rem", "name": "Extra Small" },
    { "slug": "small", "size": "0.75rem", "name": "Small" },
    // ... rest of Ollie sizes ...
    { "slug": "xxl-plus", "size": "1.75rem", "name": "XXL Plus" }
  ]
}
```

**Option 2 - Map to Nearest:**
```bash
node scripts/spacing-mapper.js --update ./ --include-suggestions
```
⚠️ **Review all changes carefully** - this will map to nearest available sizes.

### 7. Test Thoroughly

1. **Visual inspection**: Check layouts in browser
2. **Responsive testing**: Verify on mobile, tablet, desktop
3. **Pattern library**: Review all patterns and template parts
4. **Block editor**: Test spacing controls in editor

### 8. Commit Changes

```bash
git add .
git commit -m "Migrate spacing from Die Papier to Ollie system

- Update spacing slugs from numeric (30, 40, etc.) to semantic (small, medium, etc.)
- Maintain exact rem values for all direct mappings
- Manual review completed for edge case sizes (10, 20, 70)
"
```

## Pattern Reference Examples

### Before (Die Papier)

```json
{
  "spacing": {
    "padding": {
      "left": "var:preset|spacing|50",
      "right": "var:preset|spacing|50"
    }
  }
}
```

```css
.entry-content ul li {
  margin-bottom: var(--wp--preset--spacing--30);
}
```

### After (Ollie)

```json
{
  "spacing": {
    "padding": {
      "left": "var:preset|spacing|large",
      "right": "var:preset|spacing|large"
    }
  }
}
```

```css
.entry-content ul li {
  margin-bottom: var(--wp--preset--spacing--small);
}
```

## Rollback Plan

If issues arise:

1. **Restore from backup:**
   ```bash
   rm -rf wp-content/themes/die-papier-tema
   mv wp-content/themes/die-papier-tema-backup wp-content/themes/die-papier-tema
   ```

2. **Revert with Git:**
   ```bash
   git log --oneline  # Find commit hash before migration
   git revert <commit-hash>
   ```

3. **Selective rollback:**
   - Keep the spacing.json changes
   - Revert problematic files individually
   - Re-run mapper on specific folders only

## Tool Reference

```bash
# Show all available commands
node scripts/spacing-mapper.js --help

# Show spacing mapping table
node scripts/spacing-mapper.js --map

# Scan with detailed output
node scripts/spacing-mapper.js --scan ./ --verbose

# Update specific folder only
node scripts/spacing-mapper.js --update ./patterns/
```

## Additional Resources

- [WordPress Theme.json Spacing Documentation](https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/theme-json-living/#settings-spacing)
- [Ollie Theme Documentation](https://olliewp.com/documentation/)
- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github)
