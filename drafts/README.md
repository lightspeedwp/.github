# Issue Drafts - Part 02 - Community Health Files & Governance

This directory contains 13 comprehensive issue drafts for improving community health files and governance documentation.

## Quick Reference

| Issue | Title | Template Used | Labels | Priority |
|-------|-------|---------------|--------|----------|
| **G01** | Relocate front-matter schema to `schemas/frontmatter/` | Documentation | area:docs, devex, v0.2.0 | Normal |
| **G02** | Fix stale links after automation move | Documentation | area:docs, area:workflows, v0.2.0, link-hygiene | Normal |
| **G03** | Create `issue-types.yml` or remove references | Automation | area:workflows, labeling, v0.2.0 | Normal |
| **G04** | Refresh folder READMEs and cross-links | Documentation | area:docs | Normal |
| **G05** | Fix CHANGELOG/VERSION and add doc-versioning policy | Documentation | area:docs, governance, v0.2.0 | Normal |
| **G06** | Unify AI instructions/prompts/chat modes | Documentation | area:docs, area:agents | Normal |
| **G07** | Branding agent: synopsis only or stub | Documentation | area:docs, area:agents | Normal |
| **G08** | Standardise Mermaid accessibility palette + captions | Accessibility | area:a11y, area:docs | Important |
| **G09** | Reconcile labeling docs vs YAML configs | Automation | area:workflows, labeling | Normal |
| **G10** | Publish Governance → Team → Paths matrix | Documentation | governance, area:docs | Normal |
| **G11** | Create Live Links index | Documentation | area:docs, link-hygiene | Normal |
| **G12** | Stub strategy + optional sync PRs to child repos | Improvement | area:devex, area:docs | Normal |
| **G13** | Clarify SECURITY vs SUPPORT routing | Documentation | area:docs, governance, v0.2.0 | Normal |

## Files in This Directory

1. `G01-schema-relocation.md` - Documentation template
2. `G02-fix-stale-links.md` - Documentation template
3. `G03-issue-types-yml.md` - Automation template
4. `G04-refresh-readmes.md` - Documentation template
5. `G05-changelog-version.md` - Documentation template
6. `G06-unify-ai-instructions.md` - Documentation template
7. `G07-branding-agent.md` - Documentation template
8. `G08-mermaid-accessibility.md` - Accessibility template
9. `G09-reconcile-labeling.md` - Automation template
10. `G10-governance-matrix.md` - Documentation template
11. `G11-live-links-index.md` - Documentation template
12. `G12-stub-strategy.md` - Improvement template
13. `G13-security-support.md` - Documentation template

## How to Create Issues

### Option 1: Manual Creation via GitHub Web Interface

1. Go to: https://github.com/lightspeedwp/.github/issues/new/choose
2. Select the appropriate template (see table above)
3. Copy the content from the corresponding `.md` file in this directory
4. Paste into the issue form
5. Verify all sections are filled correctly
6. Submit the issue

### Option 2: Batch Creation via GitHub CLI

```bash
# Navigate to this directory
cd drafts/

# Create all issues (requires gh CLI installed and authenticated)
gh issue create --title "$(grep '^title:' G01-schema-relocation.md | cut -d':' -f2- | sed -e 's/^[[:space:]]*//' -e 's/^["'\'']//;s/["'\'']$//')" --body-file G01-schema-relocation.md
gh issue create --title "$(grep '^title:' G02-fix-stale-links.md | cut -d':' -f2- | sed -e 's/^[[:space:]]*//' -e 's/^["'\'']//;s/["'\'']$//')" --body-file G02-fix-stale-links.md
# ... repeat for each file

# Or use a loop
for file in G*.md; do
  title=$(grep '^title:' "$file" | cut -d':' -f2- | sed -e 's/^[[:space:]]*//' -e 's/^["'\'']//;s/["'\'']$//' | xargs)
  gh issue create --title "$title" --body-file "$file"
done
```

### Option 3: Semi-Automated with Script

Save this as `create-issues.sh`:

```bash
#!/bin/bash

# Array of issue files
issues=(
  "G01-schema-relocation.md"
  "G02-fix-stale-links.md"
  "G03-issue-types-yml.md"
  "G04-refresh-readmes.md"
  "G05-changelog-version.md"
  "G06-unify-ai-instructions.md"
  "G07-branding-agent.md"
  "G08-mermaid-accessibility.md"
  "G09-reconcile-labeling.md"
  "G10-governance-matrix.md"
  "G11-live-links-index.md"
  "G12-stub-strategy.md"
  "G13-security-support.md"
)

for issue_file in "${issues[@]}"; do
  if [[ -f "$issue_file" ]]; then
    title=$(grep '^title:' "$issue_file" | cut -d':' -f2- | xargs)
    echo "Creating issue: $title"
    gh issue create --title "$title" --body-file "$issue_file"
  else
    echo "File not found: $issue_file"
  fi
done
```

Run with:
```bash
chmod +x create-issues.sh
./create-issues.sh
```

## Template Mapping

Each issue uses the most appropriate LightSpeed template:

- **Documentation (19-documentation.md):** G01, G02, G04, G05, G06, G07, G10, G11, G13
- **Automation (10-automation.md):** G03, G09
- **Accessibility (13-a11y.md):** G08
- **Improvement (07-improvement.md):** G12

## Key Features of These Drafts

✅ **Complete frontmatter** with proper labels, types, and references
✅ **Comprehensive acceptance criteria** for each issue
✅ **Detailed context** including examples, templates, and testing approaches
✅ **Clear DoR/DoD checklists** for tracking readiness and completion
✅ **Step-by-step directions** for implementation
✅ **Telemetry/success metrics** for post-merge validation
✅ **UK English** throughout
✅ **LightSpeed standards compliance**

## Priority & Dependencies

### High Priority (v0.2.0 milestone)
- G01: Schema relocation (blocks other schema work)
- G02: Fix stale links (affects documentation credibility)
- G03: Issue types clarity (affects workflow automation)
- G05: CHANGELOG/VERSION (required for v0.2.0 release)
- G13: SECURITY vs SUPPORT (security best practice)

### Medium Priority
- G04: Refresh READMEs (quality-of-life improvement)
- G06: Unify AI instructions (affects AI agent predictability)
- G08: Mermaid accessibility (a11y compliance)
- G09: Reconcile labeling (improves triage)
- G10: Governance matrix (improves review speed)
- G11: Live Links index (navigation improvement)

### Lower Priority
- G07: Branding agent synopsis (prevents dead-ends)
- G12: Stub strategy (DevEx improvement, non-blocking)

## Estimated Total Effort

| Effort Level | Count | Total Hours (approx) |
|--------------|-------|----------------------|
| Small | 2 | 1-2 hours |
| Small-Medium | 3 | 4-6 hours |
| Medium | 6 | 12-18 hours |
| Medium-Large | 2 | 6-10 hours |
| **Total** | **13** | **~23-36 hours** |

## Suggested Implementation Order

1. **G02** - Fix stale links (prevents further confusion)
2. **G01** - Schema relocation (enables other schema work)
3. **G05** - CHANGELOG/VERSION (needed for v0.2.0)
4. **G13** - SECURITY vs SUPPORT (critical for security posture)
5. **G03** - Issue types (clarifies automation behaviour)
6. **G09** - Reconcile labeling (improves triage quality)
7. **G10** - Governance matrix (speeds up reviews)
8. **G11** - Live Links index (improves navigation)
9. **G04** - Refresh READMEs (documentation quality)
10. **G08** - Mermaid accessibility (a11y compliance)
11. **G06** - Unify AI instructions (improves AI predictability)
12. **G07** - Branding agent synopsis (quick win)
13. **G12** - Stub strategy (longer-term DevEx improvement)

## Notes

- All issues follow LightSpeed CLAUDE.md guidance
- UK English used throughout
- WordPress coding standards referenced where applicable
- Accessibility considerations included
- Security best practices followed
- Each issue is self-contained and can be worked on independently
- Cross-references provided where issues have dependencies

## Questions or Issues?

If you find any errors or need clarification on any of these issue drafts, please:

1. Check the original template in `.github/ISSUE_TEMPLATE/`
2. Review the acceptance criteria and context sections
3. Consult with the appropriate team (docs, workflows, governance, etc.)
4. Tag @docs-team or maintainers for review

---

**Created:** 2025-11-12
**Version:** 1.0
**Author:** Claude (Sonnet 4.5)
**Purpose:** Community Health Files & Governance Improvements - Part 02
