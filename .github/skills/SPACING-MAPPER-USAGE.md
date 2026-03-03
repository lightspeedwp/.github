# 🎨 Spacing Mapper Skill - Quick Reference

## What It Does

The Spacing Mapper is a theme skill that scans and migrates spacing preset references from **Die Papier's numeric system** (10, 20, 30, etc.) to **Ollie's semantic system** (small, medium, large, etc.).

It handles both WordPress spacing variable formats:
- `var:preset|spacing|40` (theme.json pipe format)
- `var(--wp--preset--spacing--40)` (CSS variable format)

## Quick Commands

```bash
# From theme root: /wp-content/themes/die-papier-tema/

# Show spacing mapping table
node scripts/spacing-mapper.js --map

# Scan entire theme
node scripts/spacing-mapper.js --scan ./

# Scan specific folder
node scripts/spacing-mapper.js --scan ./styles/presets

# Preview changes (safe - doesn't modify files)
node scripts/spacing-mapper.js --update ./ --dry-run

# Update files (only direct mappings)
node scripts/spacing-mapper.js --update ./

# Update including suggestions (use with caution)
node scripts/spacing-mapper.js --update ./ --include-suggestions

# Show detailed output
node scripts/spacing-mapper.js --scan ./ --verbose

# Show help
node scripts/spacing-mapper.js --help
```

## Current Theme Status

Based on the scan, your theme has:
- **126 spacing references** across **32 files**
- **96 references** can be auto-updated safely ✅
- **30 references** need manual review ⚠️

### Breakdown:
- `40` → `medium` : 41 occurrences (auto-update safe)
- `20` → needs review : 21 occurrences (no Ollie equivalent) ⚠️
- `60` → `x-large` : 15 occurrences (auto-update safe)
- `50` → `large` : 13 occurrences (auto-update safe)
- `30` → `small` : 11 occurrences (auto-update safe)
- `70` → needs review : 10 occurrences (no Ollie equivalent) ⚠️
- `10` → needs review : 9 occurrences (no Ollie equivalent) ⚠️
- `80` → `xx-large` : 6 occurrences (auto-update safe)

## Recommended Workflow

### 1. Backup First
```bash
cp -r /path/to/die-papier-tema /path/to/die-papier-tema-backup
```

### 2. Review Current Usage
```bash
node scripts/spacing-mapper.js --scan ./
```

### 3. Decide on Edge Cases

You have **40 references** (20 + 70 + 10) that don't have direct Ollie equivalents:

**Option A - Add Custom Sizes to Ollie:**
Add these to `styles/presets/spacing.json`:
```json
{ "slug": "tiny", "size": "0.25rem", "name": "Tiny" },
{ "slug": "x-small", "size": "0.5rem", "name": "Extra Small" },
{ "slug": "xl-plus", "size": "1.75rem", "name": "XL Plus" }
```

**Option B - Map to Nearest:**
Accept visual differences and map:
- `10` (0.25rem) → `small` (0.75rem)
- `20` (0.5rem) → `small` (0.75rem)
- `70` (1.75rem) → `x-large` (1.5rem) or `xx-large` (2rem)

### 4. Preview Changes
```bash
node scripts/spacing-mapper.js --update ./ --dry-run
```

### 5. Update Direct Mappings
```bash
node scripts/spacing-mapper.js --update ./
```

This updates the 96 references with direct Ollie equivalents.

### 6. Handle Manual Cases

For files with `10`, `20`, or `70`:
- Review each occurrence
- Decide if custom sizes are needed
- Or accept nearest mapping

### 7. Test Thoroughly
- Visual inspection in browser
- Responsive testing (mobile, tablet, desktop)
- Block editor spacing controls
- All patterns and template parts

## Files Requiring Attention

Based on scan results, these files contain spacing values needing review:

### Contains `20` (0.5rem):
- `parts/checkout-header.html`
- `styles/presets/card-compact.json`
- `styles/presets/section-title.json`
- And 3 more files

### Contains `70` (1.75rem):
- `styles/presets/section-archive.json`
- `styles/presets/section-comments.json`
- `styles/presets/section-footer.json`
- And 2 more files

### Contains `10` (0.25rem):
- `parts/newsletter.html`

## Safety Features

The tool includes:
- **Dry run mode**: Preview without modifying files
- **Automatic backups**: Suggested before updates
- **Detailed reports**: See exactly what will change
- **File exclusions**: Skips node_modules, .git, vendor
- **Pattern recognition**: Handles all WordPress spacing formats

## Documentation

Full documentation available:
- **[scripts/README.md](scripts/README.md)** - Complete tool documentation
- **[SPACING-MIGRATION.md](SPACING-MIGRATION.md)** - Migration strategy guide

## Support

For questions or issues:
1. Run with `--help` flag for detailed usage
2. Check [scripts/README.md](scripts/README.md) for examples
3. Review [SPACING-MIGRATION.md](SPACING-MIGRATION.md) for strategy

## Example Output

When you run a scan, you'll see:
```
🔍 Scanning: /path/to/theme

══════════════════════════════════════════════════════════════════
📊 SPACING MIGRATION REPORT
══════════════════════════════════════════════════════════════════

Files scanned: 236
Files with matches: 32
Total matches found: 126

✅ Direct Mappings (can be auto-updated):
  40 → medium          : 41 occurrences
  60 → x-large         : 15 occurrences
  
⚠️  Needs Manual Review:
  20 → small (suggested) : 21 occurrences
  70 → x-large (suggested) : 10 occurrences
```

---

**Created**: 2 March 2026  
**Theme**: Die Papier Tema  
**Tool Version**: 1.0.0
