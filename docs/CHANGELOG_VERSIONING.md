# Validation Rule Versioning & Backward Compatibility

How the changelog validation system evolves while maintaining backward compatibility.

## Rule Versioning

Each validation rule has a semantic version (e.g., `1.0`, `1.1`, `2.0`).

### Version Format

```yaml
- id: R001
  version: '1.0'     # MAJOR.MINOR format
  enabled: true
  rule_type: content
```

### Versioning Strategy

- **MAJOR** version: Breaking changes to rule behavior
- **MINOR** version: Non-breaking enhancements
- **No patch version**: Rules don't have patch versions (minor versions only)

## Compatibility Guarantees

### Within MAJOR Version (1.x)

All rules with version `1.x` are compatible:
- New `1.1` rules don't break entries passing `1.0`
- Entries validated against `1.0` pass `1.1`
- Non-breaking additions only (e.g., new pattern detections)

**Example**:
```yaml
# R001 v1.0: Detects ["async/await", "Promise.then"]
# R001 v1.1: Detects above + ["callback", "setTimeout"]
# 
# Entry with "async/await" fails BOTH v1.0 and v1.1 (breaking)
# Entry with "callback" passes v1.0 but fails v1.1 (non-breaking addition)
```

### Across MAJOR Versions (1.x → 2.x)

Major version changes may break existing entries:
- Rule `2.0` may have stricter validation than `1.x`
- Entries passing `1.x` may fail `2.0`
- Migration path provided for upgrades

## Rule Evolution

### Adding New Patterns (MINOR version bump)

When we add new pattern detections without changing core logic:

**Before (v1.0)**:
```yaml
- id: R001
  version: '1.0'
  patterns:
    - regex: 'async|await|Promise\.then'
```

**After (v1.1)**:
```yaml
- id: R001
  version: '1.1'
  patterns:
    - regex: 'async|await|Promise\.then|callback|setTimeout'
```

**Impact**: Non-breaking for compliant entries, may catch new issues

### Tightening Requirements (MAJOR version bump)

When we make validation stricter:

**Before (v1.x)**:
```yaml
- id: R004
  version: '1.0'
  description: "Description must be >= 20 characters"
```

**After (v2.0)**:
```yaml
- id: R004
  version: '2.0'
  description: "Description must be >= 50 characters AND contain user benefit"
```

**Impact**: Breaking change - entries need updates

## Backward Compatibility

### How It Works

The validation system maintains historical rule sets:

```
.github/changelog-rules.yml (current version)
├── R001 v1.0 rules (for legacy entries)
├── R001 v1.1 rules (for recent entries)
└── R001 v2.0 rules (for new entries)
```

### Validating Historical Entries

Entries include a `rules_version` field to specify validation version:

```yaml
# Entry created under R001 v1.0
rules_version: '1.0'
title: "Improved webhook async callback handling"
description: "Enhanced callback processing for async operations"
```

When validating this entry:
- Uses R001 v1.0 rules
- Passes (specific terminology allowed in v1.0)
- Doesn't need to be rewritten

### Validating New Entries

New entries default to current rule version:

```yaml
# Entry created today (R001 v1.1 rules)
title: "Webhooks now handle errors automatically"
description: "Improved error handling for webhook delivery"
```

When validating:
- Uses R001 v1.1 rules (stricter)
- Must pass stricter patterns
- Receives more detailed feedback

## Migration Guide

### Upgrading to New Rule Version

When a MAJOR version update occurs (e.g., v1.0 → v2.0):

**Option 1: Automatic migration**
```bash
npx changelog-validator migrate --from 1.0 --to 2.0
```

**Option 2: Manual review**
1. Audit affected entries: `npx changelog-validator audit --rules 2.0`
2. Review each entry that fails
3. Update entries to meet new requirements
4. Set `rules_version: '2.0'` in updated entries

**Option 3: Gradual migration**
Keep using v1.0 for old entries, v2.0 for new entries:
```yaml
# Old entry (grandfathered)
rules_version: '1.0'

# New entry (migrated)
rules_version: '2.0'
```

## Version History

### Current Versions (As of September 2026)

All rules are at version `1.0` - stable, no breaking changes planned.

```
R001 v1.0 - No implementation details
R002 v1.0 - Has category
R003 v1.0 - Has title
...
R020 v1.0 - Valid category
```

### Future Roadmap

Planned enhancements (not yet released):

- **v1.1 (Q4 2026)**: Add detection for more marketing hype patterns
- **v2.0 (2027)**: Stricter user-benefit validation (breaking)

## Rule Deprecation

When a rule becomes obsolete, it's deprecated (not deleted):

```yaml
- id: R099
  version: '1.0'
  deprecated: true
  replaced_by: R010
  description: "Use R010 instead"
```

Deprecated rules:
- Still validate (backward compatible)
- Don't apply to new entries
- Show migration path in results

## Querying Rule Versions

Check what rule versions are available:

```bash
# See all available rule versions
npm run validate:changelog -- --list-versions

# See specific rule version history
npm run validate:changelog -- --rule-history R001

# Validate against specific rule version
npm run validate:changelog -- --entry entry.yml --rules-version 1.0
```

## For Implementation Teams

### When Upgrading Rules

1. **Plan**: Announce version in advance (2-week notice minimum)
2. **Document**: Explain what changed and why
3. **Provide migration path**: Tools or guidance for existing entries
4. **Support**: Answer questions during transition
5. **Monitor**: Check compliance metrics for issues

### Breaking Changes Require

- [ ] New version number (e.g., 1.0 → 2.0)
- [ ] Migration guide in documentation
- [ ] At least 30-day notice period
- [ ] Tools to assist migration
- [ ] Clear explanation of why change is necessary

## FAQ

### Q: Will my old entries stop validating?

A: No - entries maintain their original `rules_version`, so they validate according to the rules that applied when created.

### Q: Do I need to update old entries to new versions?

A: No - but you may want to for consistency. Use automated migration tools if available.

### Q: How do I know which version to use?

A: New entries default to current version. Only specify a version if you have a reason to use an older one.

### Q: Can I use multiple rule versions simultaneously?

A: Yes - mixed versions are supported. New entries use current version, old entries keep their version.

---

For questions about versioning, see [CHANGELOG_QUALITY_AUDIT.md](./CHANGELOG_QUALITY_AUDIT.md) or contact the changelog team.
