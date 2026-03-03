# LightSpeed Theme Skills

Reusable code transformation and migration tools for WordPress themes.

## Overview

This folder contains automated "skills" - Node.js scripts that analyze and transform theme code to maintain consistency, migrate to new standards, and enforce best practices across all LightSpeed WordPress themes.

## Available Skills

### 🎨 1. Spacing Mapper
**File**: `spacing-mapper.cjs`  
**Purpose**: Migrate spacing presets from numeric slugs to semantic slugs (e.g., Die Papier → Ollie)

**Use Cases**:
- Converting theme spacing systems
- Standardizing design tokens
- Theme preset migrations

**Quick Start**:
```bash
# Show spacing mapping reference
node spacing-mapper.cjs --map

# Scan theme for spacing usage
node spacing-mapper.cjs --scan /path/to/theme

# Preview changes
node spacing-mapper.cjs --update /path/to/theme --dry-run

# Apply changes
node spacing-mapper.cjs --update /path/to/theme
```

**Documentation**: 
- [SPACING-MIGRATION.md](./SPACING-MIGRATION.md) - Migration strategy
- [SPACING-MAPPER-USAGE.md](./SPACING-MAPPER-USAGE.md) - Quick reference

**Pattern Formats Handled**:
- `var:preset|spacing|40` (theme.json)
- `var(--wp--preset--spacing--40)` (CSS)
- `--wp--preset--spacing--40` (direct references)

---

### 🔧 2. Inc Formatter
**File**: `inc-formatter.cjs`  
**Purpose**: Standardize PHP files with namespaces and remove legacy function prefixes

**Use Cases**:
- Migrating to namespaced architecture
- Removing legacy prefixes (e.g., `dp_`, `theme_`)
- Standardizing hook callbacks

**Quick Start**:
```bash
# Scan inc folder
node inc-formatter.cjs --scan /path/to/theme/inc

# Preview formatting
node inc-formatter.cjs --format /path/to/theme/inc --dry-run

# Apply formatting
node inc-formatter.cjs --format /path/to/theme/inc
```

**Documentation**: [INC-FORMATTER.md](./INC-FORMATTER.md)

**Transformations**:
1. Adds namespace declaration
2. Removes `if ( ! function_exists(...) )` wrappers (pluggable function pattern)
3. Removes function prefixes (e.g., `dp_function` → `function`)
4. Updates `add_action`/`add_filter` to use `__NAMESPACE__`
5. Updates `function_exists` checks to use new names

---

## Installation & Usage

### Using Skills in Your Theme

#### Option 1: Direct Execution (Recommended)
```bash
# From your theme root
node /path/to/.github/skills/spacing-mapper.cjs --scan ./
node /path/to/.github/skills/inc-formatter.cjs --scan ./inc
```

#### Option 2: Create Local Symlinks
```bash
# From your theme's scripts folder
ln -s /path/to/.github/skills/spacing-mapper.cjs ./spacing-mapper.cjs
ln -s /path/to/.github/skills/inc-formatter.cjs ./inc-formatter.cjs

# Then use locally
node scripts/spacing-mapper.cjs --scan ./
```

#### Option 3: Add npm Scripts
Add to your theme's `package.json`:
```json
{
  "scripts": {
    "scan:spacing": "node ../../../.github/skills/spacing-mapper.cjs --scan ./",
    "scan:inc": "node ../../../.github/skills/inc-formatter.cjs --scan ./inc",
    "format:inc": "node ../../../.github/skills/inc-formatter.cjs --format ./inc"
  }
}
```

Then run:
```bash
npm run scan:spacing
npm run scan:inc
npm run format:inc
```

---

## Skill Development

### Creating a New Skill

1. **Create the script** in `.github/skills/your-skill.js`
2. **Follow the template**:

```javascript
#!/usr/bin/env node

class YourSkill {
  constructor(options = {}) {
    this.options = {
      verbose: options.verbose || false,
      dryRun: options.dryRun || false,
    };
    this.results = {
      filesScanned: 0,
      filesChanged: 0,
      errors: [],
    };
  }

  scan(targetPath) {
    // Analysis logic
  }

  apply(targetPath) {
    // Transformation logic
  }

  printReport() {
    // Report generation
  }
}

function main() {
  const args = process.argv.slice(2);
  
  // Handle --help, --scan, --apply, --dry-run
}

if (require.main === module) {
  main();
}

module.exports = YourSkill;
```

3. **Make it executable**: `chmod +x your-skill.js`
4. **Add documentation**: Create `YOUR-SKILL.md`
5. **Update this README** with the new skill

### Skill Requirements

All skills **MUST**:
- ✅ Support `--help` flag
- ✅ Support `--dry-run` mode
- ✅ Provide detailed reports
- ✅ Handle errors gracefully
- ✅ Include comprehensive documentation
- ✅ Skip common folders (node_modules, .git, vendor)
- ✅ Be executable (`chmod +x`)

All skills **SHOULD**:
- ✅ Support `--verbose` flag
- ✅ Accept file or directory paths
- ✅ Show progress indication
- ✅ Generate exit codes (0 = success, 1 = error)
- ✅ Include usage examples
- ✅ Document before/after examples

---

## Common Patterns

### CLI Arguments
```javascript
const options = {
  verbose: args.includes('--verbose') || args.includes('-v'),
  dryRun: args.includes('--dry-run'),
};
```

### File Scanning
```javascript
const isValidFile = (filePath) => {
  const ext = path.extname(filePath);
  return ['.php', '.json', '.css'].includes(ext);
};

const skipFolder = (name) => {
  return ['.git', 'node_modules', 'vendor'].includes(name);
};
```

### Reporting Format
```
══════════════════════════════════════════════════════════════════════
📊 SKILL NAME REPORT
══════════════════════════════════════════════════════════════════════

Files scanned: X
Files changed: Y
Total changes: Z

✅ Success category
⚠️  Warning category

══════════════════════════════════════════════════════════════════════
```

---

## Testing Skills

### Before Using a Skill:

1. **Read the documentation** (linked above)
2. **Run --help** to see all options
3. **Test on a single file**:
   ```bash
   node skill-name.js --scan path/to/single-file.ext
   ```
4. **Use --dry-run**:
   ```bash
   node skill-name.js --apply path/to/theme --dry-run
   ```
5. **Backup or commit** before applying changes
6. **Test thoroughly** after applying

### Recommended Workflow:
```bash
# 1. Backup
git add . && git commit -m "Before skill: [skill-name]"

# 2. Scan
node /path/to/skill.js --scan ./

# 3. Review report
# Check what will be changed

# 4. Dry run
node /path/to/skill.js --apply ./ --dry-run

# 5. Apply
node /path/to/skill.js --apply ./

# 6. Test
# Verify theme still works

# 7. Commit
git add . && git commit -m "Applied skill: [skill-name]"
```

---

## Integration Points

### Pre-commit Hooks
Add skills to `.husky/pre-commit`:
```bash
#!/bin/sh
node .github/skills/spacing-mapper.cjs --scan ./
node .github/skills/inc-formatter.cjs --scan ./inc
```

### CI/CD Pipeline
Add to GitHub Actions workflow:
```yaml
- name: Validate spacing consistency
  run: node .github/skills/spacing-mapper.cjs --scan ./

- name: Check inc formatting
  run: node .github/skills/inc-formatter.cjs --scan ./inc
```

### VS Code Tasks
Add to `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Scan Spacing",
      "type": "shell",
      "command": "node",
      "args": [
        "${workspaceFolder}/../../../.github/skills/spacing-mapper.cjs",
        "--scan",
        "${workspaceFolder}"
      ]
    }
  ]
}
```

---

## Skill Catalog

| Skill | Purpose | Input | Output | Status |
|-------|---------|-------|--------|--------|
| **spacing-mapper** | Migrate spacing slugs | Theme files | Standardized spacing | ✅ Stable |
| **inc-formatter** | Format PHP includes | PHP files | Namespaced code | ✅ Stable |
| _Future: pattern-validator_ | Validate patterns | Pattern files | Validation report | 💡 Planned |
| _Future: asset-optimizer_ | Optimize assets | Images, CSS, JS | Optimized files | 💡 Planned |
| _Future: i18n-scanner_ | Find translations | PHP files | POT file | 💡 Planned |

---

## Skill Versions

| Skill | Version | Last Updated | Compatibility |
|-------|---------|--------------|---------------|
| spacing-mapper | 1.0.0 | 2026-03-02 | Node.js 14+ |
| inc-formatter | 1.0.0 | 2026-03-02 | Node.js 14+ |

---

## Contributing

### Adding a New Skill

1. Create the skill script following the template
2. Add comprehensive documentation
3. Test on multiple themes
4. Update this README
5. Submit a PR with examples

### Updating an Existing Skill

1. Update version number in the script
2. Document changes in the skill's .md file
3. Update this README if needed
4. Test backwards compatibility
5. Submit a PR with migration notes

---

## Support & Documentation

- **LightSpeed Coding Standards**: [.github/instructions/coding-standards.instructions.md](../instructions/coding-standards.instructions.md)
- **File Organisation**: [.github/instructions/file-organisation.instructions.md](../instructions/file-organisation.instructions.md)
- **Agent Creation Guide**: [docs/AGENT_CREATION.md](../docs/AGENT_CREATION.md)

---

## Frequently Asked Questions

### Why are skills in .github instead of each theme?

**Benefits**:
- ✅ Single source of truth for all themes
- ✅ Easier to maintain and update
- ✅ Consistent behavior across projects
- ✅ Version controlled in one place
- ✅ Can be used by any theme

### Can I modify a skill for my theme?

Yes, but:
- **Recommended**: Contribute improvements back to .github
- **Alternative**: Copy to theme and maintain separately
- **Warning**: Local copies won't get upstream updates

### How do I know which skills to use?

- Check your theme's documentation
- Run skills in `--scan` mode to see if changes are needed
- Review the skill's documentation for use cases

### What if a skill breaks my theme?

- Always use `--dry-run` first
- Commit before applying changes
- Review the generated report
- Test thoroughly after applying
- Revert the commit if issues arise

---

## Examples

### Migrate Theme Spacing
```bash
# Die Papier → Ollie migration
cd /path/to/theme
node /path/to/.github/skills/spacing-mapper.cjs --scan ./
node /path/to/.github/skills/spacing-mapper.cjs --update ./ --dry-run
node /path/to/.github/skills/spacing-mapper.cjs --update ./
```

### Format Inc Folder
```bash
# Standardize PHP includes
cd /path/to/theme
node /path/to/.github/skills/inc-formatter.cjs --scan inc/
node /path/to/.github/skills/inc-formatter.cjs --format inc/ --dry-run
node /path/to/.github/skills/inc-formatter.cjs --format inc/
```

---

## License

These skills are part of the LightSpeed WordPress organization and are licensed under GPL-3.0.

---

**Maintained by**: LightSpeed Team  
**Repository**: lightspeedwp/.github  
**Last Updated**: 2 March 2026  
**Status**: Production Ready 🚀
