---
title: Meta Agent v2.0 — Team Operations Guide
description: >
  Operations guide for maintainers. Procedures for updating schemas,
  managing issues, and maintaining Meta Agent v2.0.
file_type: guide
category: operations
status: active
language: en
owners:
  - lightspeedwp/maintainers
---

# Team Operations Guide — Meta Agent v2.0

Procedures for maintaining and operating Meta Agent v2.0.

## Table of Contents

1. [Onboarding](#onboarding)
2. [Schema Updates](#schema-updates)
3. [Issue Management](#issue-management)
4. [Release Process](#release-process)
5. [Monitoring & Support](#monitoring--support)
6. [Common Procedures](#common-procedures)

---

## Onboarding

### When to Onboard Team Members

- New project maintainer joining the team
- New repo adopting Meta Agent v2.0
- Developer needing to use frontmatter validation

### Onboarding Checklist

- [ ] Send [QUICK_START.md](./QUICK_START.md) link
- [ ] Schedule 30-min walkthrough
- [ ] Have team member complete [TRAINING_GUIDE.md](./TRAINING_GUIDE.md)
- [ ] Do first validation exercise together
- [ ] Answer questions

### Expected Outcomes

- ✅ Can write valid frontmatter
- ✅ Can run validation locally
- ✅ Understands pre-commit hook workflow
- ✅ Knows where to find help

---

## Schema Updates

### When to Update Schemas

**Add a new field:**
- New repo type requirement
- Team feedback from real-world usage
- Alignment with other metadata standards

**Fix validation issues:**
- False positives (valid content rejected)
- False negatives (invalid content accepted)
- Unclear error messages

**Update constraints:**
- Change required vs optional
- Adjust pattern matching
- Modify length constraints

### Schema Update Process

#### Step 1: Plan the Change

Document the change request:
- What field/schema?
- Why change?
- What impact on existing repos?
- Backwards compatible?

#### Step 2: Update Schema File

Edit the JSON schema file (e.g., `schemas/block-plugin.frontmatter.schema.json`):

```json
{
  "properties": {
    "new_field": {
      "type": "string",
      "description": "What this field is for",
      "minLength": 3,
      "maxLength": 100,
      "pattern": "^[a-z0-9-]+$"
    }
  },
  "required": ["title", "description", "status", "language", "new_field"]
}
```

#### Step 3: Update Documentation

- Update [README.md](./README.md) schema reference
- Add example in [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Add FAQ entry in [FAQ.md](./FAQ.md)
- Add troubleshooting tip in [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

#### Step 4: Add Tests

Create or update test case:

```bash
cd agents/meta-agent
npm test -- --testNamePattern="new-field"
```

#### Step 5: Create PR

- Branch name: `feat/meta-agent-schema-{field-name}`
- PR description: Document the change and rationale
- Link to issue

#### Step 6: Get Review & Merge

- Code review required
- All tests must pass
- Changelog updated

### Rolling Out Schema Changes

**Breaking change?** (makes previously valid files invalid)
- Deprecation period (2 weeks notice)
- Update migration guide
- Announce to team

**Non-breaking change?** (new optional field)
- Deploy immediately
- Document in release notes

---

## Issue Management

### Issue Types

| Type | When | How to handle |
|------|------|---------------|
| **Bug** | Validation failing incorrectly | Triage → Fix → Test → Merge |
| **Feature Request** | New field/schema needed | Discuss → Plan → Implement → Review |
| **Documentation** | Docs incomplete/unclear | Update docs → Review → Merge |
| **Question** | User asking how to use | Answer → Link to docs → Close |

### Support SLA

| Issue Type | Response Time | Resolution Time |
|-----------|---------------|-----------------|
| Critical bug | 24 hours | 48 hours |
| Bug | 48 hours | 1 week |
| Feature request | 1 week | 2 weeks |
| Question | 48 hours | Close when answered |

### Creating an Issue Template

```markdown
## Description
[What's the problem/request?]

## Steps to Reproduce (for bugs)
1. [Step 1]
2. [Step 2]

## Expected vs Actual
- Expected: [what should happen]
- Actual: [what happens]

## Environment
- Node version: [e.g., v18.12.1]
- npm version: [e.g., 9.2.0]
- OS: [macOS/Linux/Windows]

## Screenshots/Logs
[Attach if applicable]
```

---

## Release Process

### Release Types

| Type | When | Steps |
|------|------|-------|
| **Patch** (1.0.1) | Bug fix | 1. Fix bug 2. Test 3. Tag 4. Announce |
| **Minor** (1.1.0) | New field/schema | 1. Implement 2. Test 3. Changelog 4. Tag 5. Announce |
| **Major** (2.0.0) | Breaking changes | 1. Plan 2. Implement 3. Migrate guide 4. Test 5. Tag 6. Announce |

### Step-by-Step Release

#### 1. Update Version

```bash
# Edit package.json
{
  "version": "1.1.0"  # was 1.0.0
}
```

#### 2. Update CHANGELOG

Add entry at top of CHANGELOG.md:

```markdown
## [1.1.0] — 2026-08-28

### Added
- New optional field: author_email

### Fixed
- Validation false positive for control-plane repos

### Changed
- Updated FAQ with new field examples
```

#### 3. Create Release Commit

```bash
git add package.json CHANGELOG.md
git commit -m "release: v1.1.0 — New optional field and bug fix"
```

#### 4. Tag Release

```bash
git tag -a v1.1.0 -m "v1.1.0 release"
git push origin v1.1.0
```

#### 5. Create GitHub Release

- Go to GitHub → Releases → Draft new
- Tag: v1.1.0
- Title: "Meta Agent v1.1.0"
- Body: Copy from CHANGELOG.md
- Publish

#### 6. Announce to Team

**Slack:**
```
🚀 Meta Agent v1.1.0 released!

📋 Changes:
• New optional field: author_email
• Fixed validation false positive for control-plane repos
• Updated documentation

📖 See: [link to changelog]
```

---

## Monitoring & Support

### Monitoring Metrics

Track these metrics to identify issues:

1. **Test pass rate** — Should be 100%
   ```bash
   npm test
   ```

2. **Coverage** — Should be ≥85%
   ```bash
   npm test -- --coverage
   ```

3. **Performance** — Validation <100ms per file
   - Monitor in CI logs
   - Alert if >500ms

4. **Error reports** — Issues opened per month
   - Target: <1 per week
   - Alert if >3 per week

### Support Channels

| Channel | Response | Use for |
|---------|----------|---------|
| GitHub Issues | 48 hours | Bugs, feature requests |
| Slack #meta-agent | 24 hours | Quick questions |
| Email | 48 hours | Private concerns |

### Handling Support Requests

1. **Acknowledge** — Respond within 24 hours
2. **Diagnose** — Ask for details (Node version, error message, etc.)
3. **Help** — Point to relevant docs or provide solution
4. **Follow-up** — Check if issue resolved
5. **Document** — Add to FAQ if common question

---

## Common Procedures

### Procedure 1: Add New Repository Type

**Use case:** Supporting a new type of repo (e.g., WordPress plugin)

#### Steps:

1. **Create new schema file:**
   ```bash
   cp schemas/block-plugin.frontmatter.schema.json \
      schemas/wordpress-plugin.frontmatter.schema.json
   ```

2. **Update detection logic** in `skills/repo-type-detection.js`

3. **Update tests** in `__tests__/unit/repo-type-detection.test.js`

4. **Add examples** in IMPLEMENTATION_GUIDE.md

5. **Test thoroughly:**
   ```bash
   npm test
   npm run validate -- test-file.md
   ```

6. **Create PR** with all changes

### Procedure 2: Handle Validation False Positive

**Use case:** User reports valid content being rejected

#### Steps:

1. **Reproduce** the issue
   ```bash
   npm run validate -- user-file.md
   ```

2. **Add test case** showing the issue

3. **Debug** — Find which rule is causing false positive

4. **Fix** the schema or validation logic

5. **Test** — Ensure fix works and doesn't break other tests
   ```bash
   npm test
   ```

6. **Create PR** documenting the fix

### Procedure 3: Update Documentation

**Use case:** Docs need updating (new feature, clarification, etc.)

#### Steps:

1. **Identify** which docs need updating:
   - TRAINING_GUIDE.md?
   - IMPLEMENTATION_GUIDE.md?
   - TROUBLESHOOTING.md?
   - FAQ.md?
   - README.md?

2. **Make changes** in Markdown files

3. **Review** for accuracy and clarity

4. **Test** — Make sure examples work:
   ```bash
   npm run validate -- example.md
   ```

5. **Commit** and create PR

6. **Get review** before merging

### Procedure 4: Run Performance Benchmarks

**Use case:** Regular performance monitoring

#### Command:

```bash
time npm test
time npm run validate -- "**/*.md"
```

#### Expected times:

- Single file: <100ms ✅
- 100 files: 2–5s ✅
- Full test suite: 2–3s ✅

#### If slow:

- Check for missing optimizations
- Profile: `npm run validate:changed -- --debug`
- Create performance issue

### Procedure 5: Process a Schema Change Request

**Use case:** Team requests new field in schema

#### Timeline:

| When | What |
|------|------|
| **Immediately** | Acknowledge the request |
| **Within 1 day** | Assess impact & feasibility |
| **Within 3 days** | Propose solution (breaking/non-breaking?) |
| **Within 1 week** | Implement & test if approved |
| **Within 2 weeks** | Merge & release |

#### Discussion questions:

- Why is this field needed?
- Which schema(s)? (plugin, theme, control-plane, all?)
- Required or optional?
- What values are allowed?
- Breaking change or backwards compatible?

---

## Maintenance Checklist

**Weekly:**
- [ ] Check GitHub issues (any new bugs?)
- [ ] Review test results
- [ ] Check performance metrics

**Monthly:**
- [ ] Review issue backlog
- [ ] Check documentation accuracy
- [ ] Run security audit: `npm audit`
- [ ] Update dependencies (if needed)

**Quarterly:**
- [ ] Plan next version/features
- [ ] Review team feedback
- [ ] Assess adoption metrics
- [ ] Update roadmap

---

## Key Contacts

| Role | Contact | Responsibilities |
|------|---------|------------------|
| Project Lead | Ash Shaw | Overall direction, releases |
| Maintainer | LightSpeed team | Day-to-day support, merges |
| Security | [Security team] | Vulnerability disclosure |

---

## Reference

- [README.md](./README.md) — Architecture & overview
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) — Setup & usage
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — Common issues
- [FAQ.md](./FAQ.md) — Questions & answers
- [CHANGELOG.md](./CHANGELOG.md) — Version history

---

*Meta Agent v2.0 — Operations Guide* 🛠️

