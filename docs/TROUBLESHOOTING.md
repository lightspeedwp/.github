# Agent Specification Troubleshooting Guide

This guide helps you diagnose and fix common issues with agent specifications.

## Common Validation Errors

### "Missing required field 'category'"

**Cause:** The `category` field is missing from frontmatter.

**Solution:** Add the required field to your agent specification:

```yaml
---
name: My Agent
category: governance      # Required - choose: governance, analysis, generation, automation, integration, security, documentation
```

### "Invalid category value"

**Cause:** The `category` field contains an invalid value.

**Valid categories:**

- `governance` - Policy enforcement, compliance, moderation
- `analysis` - Data analysis, insights, reporting
- `generation` - Content creation, document generation
- `automation` - Workflow automation, task execution
- `integration` - External system integration, API management
- `security` - Security operations, threat detection
- `documentation` - Documentation generation and maintenance

### "Date must be in YYYY-MM-DD format"

**Cause:** Date fields (created_date, updated_date) are in wrong format.

**Solution:** Use ISO 8601 format:

```yaml
created_date: 2026-09-01      # ✅ Correct
created_date: 09/01/2026      # ❌ Wrong
created_date: 2026-9-1        # ❌ Wrong (missing zero padding)
```

### "Version must be semantic (X.Y.Z)"

**Cause:** Version field doesn't follow semantic versioning.

**Solution:** Use semantic versioning:

```yaml
version: 1.0.0                # ✅ Correct (MAJOR.MINOR.PATCH)
version: 1.0                  # ❌ Wrong (missing patch version)
version: v1.0.0               # ❌ Wrong (don't use 'v' prefix)
version: 1                    # ❌ Wrong (too simple)
```

### "Status must be one of: active, draft, deprecated, archived"

**Cause:** Invalid status value.

**Solution:** Use one of the valid status values:

```yaml
status: active                # Ready for production
status: draft                 # Under development
status: deprecated            # Superseded by newer version
status: archived              # Historical reference only
```

## Frontmatter Issues

### YAML Syntax Errors

**Symptom:** `Error parsing YAML frontmatter`

**Common causes:**

- Missing colons after field names
- Incorrect indentation
- Unquoted special characters
- Mismatched quotes

**Solution:** Check YAML syntax:

```yaml
# ❌ Wrong - missing colon
name My Agent

# ✅ Correct
name: My Agent

# ❌ Wrong - incorrect indentation
name: My Agent
  description: Does something

# ✅ Correct
name: My Agent
description: Does something

# ❌ Wrong - special chars need quotes
tags: [tag1, tag:with:colons, tag2]

# ✅ Correct
tags: [tag1, "tag:with:colons", tag2]
```

### Multiline Description Issues

**Symptom:** Description field is incomplete or truncated.

**Solution:** Use YAML multiline syntax:

```yaml
# Using > (folded) for paragraphs
description: >
  This is a long description that can span
  multiple lines. Newlines are converted to spaces,
  so paragraphs are preserved.

# Using | (literal) to preserve newlines
description: |
  First paragraph.
  
  Second paragraph with explicit line breaks.
```

## File Structure Problems

### "Implementation reference directory not found"

**Symptom:** Validation fails when checking implementation_reference.

**Solution:** Create the referenced directory:

```bash
# Your spec references:
implementation_reference: agents/my-agent/

# Create the directory:
mkdir -p agents/my-agent
```

### "Missing implementation files"

**Symptom:** Directory exists but is missing expected files.

**Solution:** Create required files:

```bash
agents/my-agent/
├── SKILL.md              # Technical documentation
├── README.md             # User-facing documentation
├── src/                  # Source code
│   └── main.js
└── tests/                # Test files
    └── main.test.js
```

## Validation Issues

### Pre-commit Hook Failures

**Symptom:** `pre-commit hook failed` when committing agent files.

**Solution:** Run validation manually:

```bash
npm run validate:frontmatter -- agents/my-agent.agent.md
```

Fix any reported issues, then retry commit.

### CI/CD Validation Failures

**Symptom:** GitHub Actions workflow fails validation.

**Solution:**

1. Check the workflow logs for specific error messages
2. Run validation locally: `npm run validate:frontmatter`
3. Fix issues and push again

### Cross-Reference Validation Errors

**Symptom:** `Broken reference to...`

**Solution:** Check all internal links:

```markdown
# ❌ Wrong - link doesn't exist
See [SKILL.md](agents/my-agent/SKILL.md)

# ✅ Correct - verify file exists
See [SKILL.md](agents/my-agent/SKILL.md)
```

## Content Issues

### Weak or Missing Description

**Symptom:** Description is too brief or vague.

**Solution:** Expand description to explain:

- What the agent does
- Who uses it
- Key capabilities
- Main use cases

```yaml
# ❌ Weak
description: A data agent

# ✅ Good
description: >
  Intelligent data analysis agent that processes structured data,
  identifies trends, and generates actionable insights. Used by
  data analysts and business stakeholders for reporting and forecasting.
```

### Missing or Incomplete Fields

**Symptom:** Fields are empty or have placeholder values.

**Solution:** Fill in all required fields with actual information:

```yaml
# ❌ Placeholder values
supported_platforms: [todo]
required_capabilities: [unknown]
tags: [tag1, tag2]

# ✅ Actual values
supported_platforms: [slack, web, api]
required_capabilities: [text_analysis, policy_matching]
tags: [moderation, content-control, enforcement]
```

### Invalid Email Addresses

**Symptom:** Creator/updater fields have invalid email format.

**Solution:** Use valid email addresses:

```yaml
created_by: claude@lightspeedwp.agency       # ✅ Correct
last_updated_by: team@example.com            # ✅ Correct
created_by: John Smith                       # ❌ Not an email
last_updated_by: claude@local                # ⚠️ Missing domain
```

## Testing Issues

### Test Suite Failures

**Symptom:** `npm test` fails for agent specifications.

**Solution:** Run tests and check output:

```bash
npm test 2>&1 | grep -A 5 "FAIL\|ERROR"
```

Common test failures:

- Frontmatter validation
- File existence checks
- Format validation
- Cross-reference validation

### Fixture Issues

**Symptom:** Test fixtures not found or invalid.

**Solution:** Verify fixtures exist and are valid:

```bash
# Check fixtures directory
ls -la .github/scripts/__tests__/fixtures/

# Validate a fixture
npm run validate:frontmatter -- .github/scripts/__tests__/fixtures/valid-agent.agent.md
```

## Documentation Issues

### Broken Links

**Symptom:** Links in agent spec point to missing files.

**Solution:** Check all links:

```bash
# Find broken links
grep -r "](.*)" agents/ | grep -v "http" | while read line; do
  file=$(echo "$line" | cut -d: -f2 | sed 's/.*\](//;s/).*//')
  if [ ! -f "$file" ]; then
    echo "Broken: $line"
  fi
done
```

### Unclear Examples

**Symptom:** Usage examples are confusing or incomplete.

**Solution:** Make examples clear and runnable:

```markdown
# ❌ Unclear
Example: Pass data to agent

# ✅ Clear
Example 1: Processing customer data
Input: CSV file with 10,000 customer records
Process:
  1. Load CSV file
  2. Clean and normalize data
  3. Generate customer profile
Output: Customer profiles with segments
```

## Performance Issues

### Slow Validation

**Symptom:** `npm run validate:frontmatter` takes too long.

**Solution:** Validate specific files:

```bash
# Slow - validates all files
npm run validate:frontmatter

# Fast - validates specific file
npm run validate:frontmatter -- agents/my-agent.agent.md
```

### Large File Sizes

**Symptom:** Agent specification file is very large.

**Solution:** Move detailed content to separate files:

```bash
# ❌ Everything in one file
agents/my-agent.agent.md (50KB)

# ✅ Separate files
agents/my-agent.agent.md (10KB)          # Spec only
agents/my-agent/SKILL.md (20KB)          # Technical docs
agents/my-agent/README.md (20KB)         # User guide
```

## Integration Issues

### Agent Not Found by Tools

**Symptom:** Tools can't locate your agent specification.

**Solution:** Verify file naming and location:

```bash
# ❌ Wrong - using .md instead of .agent.md
agents/my-agent.md

# ✅ Correct
agents/my-agent.agent.md

# ✅ Correct - alternative naming
agents/my-agent/specification.agent.md
```

### Pre-commit Hook Not Running

**Symptom:** Validation doesn't run before commit.

**Solution:** Reinstall git hooks:

```bash
npm install
npm run prepare  # Reinstall hooks
```

## Getting Help

If your issue isn't listed here:

1. **Check examples** - Review similar agents in `examples/agents/`
2. **Check API reference** - See [API_REFERENCE.md](./API_REFERENCE.md) for field definitions
3. **Check migration guide** - See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for format issues
4. **Run validation** - `npm run validate:frontmatter -- agents/my-agent.agent.md`
5. **Check logs** - Look for detailed error messages in validation output
6. **Open an issue** - Create GitHub issue with `type:documentation` label

---

**Last Updated:** 2026-09-03
**Related:** [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md), [API_REFERENCE.md](./API_REFERENCE.md)
