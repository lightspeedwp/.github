---
file_type: documentation
name: Issue Triage & Template Application Guide
about: Procedures for manually applying issue templates and bulk template application runbooks
version: 1.0.1
last_updated: '2026-08-18'
category: operations
---

# Issue Triage & Template Application Guide

**Role:** Team members and automation systems responsible for issue triage, template enforcement, and bulk issue template application.

This guide documents procedures for applying GitHub issue templates to issues that are missing the required **Definition of Ready (DoR)** and **Definition of Done (DoD)** sections, as enforced by the [`template-enforcement.yml`](../.github/workflows/template-enforcement.yml) GitHub Actions workflow.

## General Rules

1. **Template Selection** — Choose the issue type template that best matches the issue's purpose and scope
2. **Content Preservation** — All existing issue content must be preserved when applying templates
3. **Idempotency** — Repeated template applications must not duplicate sections or lose content
4. **Validation** — After applying templates, verify that DoR and DoD sections are present
5. **Workflow Compliance** — Issue bodies must pass the template-enforcement workflow validation

## Overview

### Why Templates Matter

Issue templates in this repository ensure:

- **Consistent structure** across all issue types (bug, feature, epic, research, etc.)
- **Required sections** (DoR and DoD) are present before work begins
- **Compliance** with GitHub Actions automation that validates template sections
- **Team clarity** on readiness criteria and completion expectations

### Issue Type Templates

The repository includes **25 issue type templates** in [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/):

| Template | File | Use When |
|----------|------|----------|
| Task | `01-task.md` | Scoped work, config updates, small delivery items |
| Bug | `02-bug.md` | Reproducible defects with environment details |
| Feature | `03-feature.md` | New capabilities or user-visible enhancements |
| Design | `04-design.md` | UI/UX, token, or accessibility design work |
| Epic | `05-epic.md` | Large, multi-part initiatives grouping stories |
| Story | `06-story.md` | User-centric narratives with acceptance criteria |
| Improvement | `07-improvement.md` | Enhancements to existing functionality |
| Chore | `08-chore.md` | Small housekeeping (labels, repo tweaks) |
| Code Refactor | `09-code-refactor.md` | Structured code cleanup (non-user-facing) |
| Build/CI | `10-build-ci.md` | Build system, CI/CD, pipeline changes |
| Automation | `11-automation.md` | Workflow automation and tooling |
| Testing | `12-testing-coverage.md` | New or refactored automated tests |
| Performance | `13-performance.md` | Speed, resource, or latency work |
| Accessibility | `14-a11y.md` | WCAG 2.2 AA compliance improvements |
| Security | `15-security.md` | Vulnerabilities or security hardening |
| Compatibility | `16-compatibility.md` | Cross-version, browser, platform issues |
| Integration | `17-integration-issue.md` | Third-party system integration problems |
| Release | `18-release.md` | Release planning, coordination, delivery |
| Maintenance | `19-maintenance.md` | System maintenance, dependency updates |
| Documentation | `20-documentation.md` | Docs and content updates |
| Research | `21-research.md` | Exploratory or assessment work |
| Audit | `22-audit.md` | System audits and compliance checks |
| Code Review | `23-code-review.md` | Code quality discussions, review standards |
| AI Ops | `24-ai-ops.md` | AI agent and automation workflows |
| Content Modelling | `25-content-modelling.md` | Content structure and taxonomy work |

## Manual Template Application

When an issue is flagged by the template-enforcement workflow as missing DoR/DoD sections, you can manually apply the correct template.

### Step 1: Identify the Issue Type

Review the issue title and description to determine the most appropriate type:

```
Issue Title: "Fix broken login flow on mobile"
→ Type: Bug (02-bug.md)

Issue Title: "Add dark mode theme support"
→ Type: Feature (03-feature.md)

Issue Title: "Consolidate 31 workflows into 25"
→ Type: Research (21-research.md)
```

### Step 2: Read the Template

Open the appropriate template file in [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/):

```bash
cat .github/ISSUE_TEMPLATE/20-documentation.md
```

### Step 3: Preserve Existing Content

Extract the valuable content from the current issue body:

- Scope and objectives
- Acceptance criteria
- Links to related issues/PRs
- Technical details or context

### Step 4: Restructure Content

Map existing content into the template sections. For example, if applying a **Documentation template**:

**Original Content:**

```
Project documentation and knowledge transfer for the Repository Maintenance Infrastructure.
Completed deliverables:
- README.md with overview
- IMPLEMENTATION_NOTES.md with technical details
```

**Restructured into Template:**

```markdown
## What documentation is needed?

Project completion documentation and knowledge transfer for the Repository Maintenance Infrastructure initiative. Includes:
- README.md with overview and deliverables
- IMPLEMENTATION_NOTES.md with technical details

## Why is this documentation important?

Ensures project knowledge is accessible and sustainable for the team.

## Acceptance Criteria

- [x] Documentation is clear, accurate, and up-to-date
- [x] Follows WordPress documentation standards
- [x] Documentation is accessible and easy to find
- [x] Changelog entry prepared for PR if user-facing update

## Additional Context

[Insert relevant context, links, related issues]

---

## Definition of Ready (DoR)

- [x] Documentation need is clear and well-defined
- [x] Related docs/issues or files linked
- [x] Acceptance criteria listed
- [x] Estimate added if relevant
- [x] Milestone/release assigned

## Definition of Done (DoD)

- [x] Documentation meets org standards and guidelines
- [x] Changelog entry prepared for PR
- [x] Documentation reviewed for clarity and accessibility
- [x] Screenshots/code examples included if relevant
- [x] PR uses correct branch prefix
```

### Step 5: Update the Issue

Use the GitHub CLI to update the issue:

```bash
gh issue edit <ISSUE_NUMBER> --body "$(cat /path/to/new_body.md)"
```

Or via the GitHub web interface:

1. Open the issue
2. Click the pencil icon (✎) in the issue body
3. Replace the content with the new template structure
4. Click "Update comment"

### Step 6: Verify

Check that:

- ✅ DoR section is present with checklist items
- ✅ DoD section is present with checklist items
- ✅ All original content is preserved
- ✅ Markdown formatting is valid

## Bulk Template Application (Runbook)

For applying templates to **multiple issues at once** (e.g., batch-created issues), use the Python script approach.

### Prerequisites

- Python 3.7+
- GitHub CLI (`gh`) installed and authenticated
- Access to the `.github` repository

### Runbook: Python Script for Bulk Application

#### 1. Create Issue Type Mapping

Create a Python dictionary mapping issue numbers to their types and template info. This example shows the abbreviated structure; a complete runbook would include all issue numbers:

```python
import pathlib

ISSUE_TEMPLATES = {
    '1220': {
        'type': 'build-ci',
        'template_file': '10-build-ci.md',
        'dor': [
            'Requirements for CI/CD changes defined',
            'Impact on workflows assessed',
            'Related workflows/jobs linked',
            'Milestone assigned if applicable'
        ],
        'dod': [
            'CI/CD changes tested and validated',
            'Workflows run successfully',
            'Documentation updated',
            'Related issues/PRs closed'
        ]
    },
    '1221': {
        'type': 'documentation',
        'template_file': '20-documentation.md',
        # Actual template-specific sections loaded from file
    },
    # ... additional entries (1222–1241 following same pattern)
}

# Path to template directory
TEMPLATE_DIR = pathlib.Path('.github/ISSUE_TEMPLATE')
```

#### 2. Create Body Transformation Function

```python
import re

def create_issue_body(issue_id, current_body, template_info):
    """Create properly formatted issue body with DoR and DoD sections.
    
    Makes the transformation idempotent by detecting and replacing existing
    DoR/DoD blocks instead of appending to them.
    """
    
    dor_items = template_info.get('dor', [
        'Requirements clearly defined',
        'Related issues/PRs linked',
        'Acceptance criteria listed',
        'Milestone assigned'
    ])
    
    dod_items = template_info.get('dod', [
        'Work completed as specified',
        'Tests/validation complete',
        'Documentation updated',
        'Changes merged'
    ])
    
    # Generate unchecked checklist items by default
    dor_section = '\n'.join([f'- [ ] {item}' for item in dor_items])
    dod_section = '\n'.join([f'- [ ] {item}' for item in dod_items])
    
    # Remove any existing DoR/DoD sections (idempotent)
    # Pattern matches optional separator followed by DoR/DoD blocks
    pattern = r'(?:\n---\n)?## Definition of Ready.*?## Definition of Done.*?(?=\Z|\n---)'
    clean_body = re.sub(pattern, '', current_body, flags=re.DOTALL)
    
    # Combine into new body
    new_body = f"""{clean_body.strip()}

---

## Definition of Ready (DoR)

{dor_section}

## Definition of Done (DoD)

{dod_section}"""
    
    return new_body.strip()
```

#### 3. Create Update Function

```python
import subprocess

def update_issue(issue_id, new_body, timeout=30):
    """Update GitHub issue with new body.
    
    Args:
        issue_id: GitHub issue number
        new_body: Issue body content
        timeout: Maximum seconds to wait for gh CLI (default 30)
    """
    try:
        result = subprocess.run(
            ['gh', 'issue', 'edit', str(issue_id), '--body', new_body],
            cwd='/path/to/.github',
            capture_output=True,
            text=True,
            timeout=timeout
        )
        
        if result.returncode == 0:
            print(f"✅ Issue #{issue_id} updated")
            return True
        else:
            print(f"❌ Failed to update #{issue_id}: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print(f"❌ Timeout updating #{issue_id} (exceeded {timeout}s)")
        return False
    except Exception as e:
        print(f"❌ Error updating #{issue_id}: {e}")
        return False
```

#### 4. Iterate Over Issues

```python
def main():
    successful = 0
    failed = 0
    
    for issue_id in sorted(ISSUE_TEMPLATES.keys(), key=int):
        # Get current body
        try:
            result = subprocess.run(
                ['gh', 'issue', 'view', str(issue_id), '--json', 'body', '-q', '.body'],
                cwd='/path/to/.github',
                capture_output=True,
                text=True,
                timeout=30
            )
        except subprocess.TimeoutExpired:
            print(f"❌ Timeout fetching #{issue_id} (exceeded 30s)")
            failed += 1
            continue
        
        if result.returncode != 0:
            failed += 1
            continue
        
        current_body = result.stdout.strip()
        template_info = ISSUE_TEMPLATES[issue_id]
        new_body = create_issue_body(issue_id, current_body, template_info)
        
        if update_issue(issue_id, new_body):
            successful += 1
        else:
            failed += 1
    
    print(f"\nResults: {successful} successful, {failed} failed")

if __name__ == '__main__':
    main()
```

#### 5. Run the Script

```bash
python3 apply_issue_templates.py
```

### Example: Batch Template Application (2026-07-24)

**Context:** Applied templates to 22 issues (#1220-#1241) that were created without proper template structure.

**Execution:**

```bash
python3 apply_issue_templates.py
# Output:
# Applying issue templates to all issues...
# 
# Processing #1220... ✅ Issue #1220 updated with Build/CI template
# Processing #1221... ✅ Issue #1221 updated with Documentation template
# ... (20 more)
# 
# ==================================================
# Results: 22 successful, 0 failed
# Total: 22/22 issues
```

**Verification:** All issues now contain DoR and DoD sections, resolving template-enforcement workflow flags.

## Troubleshooting

### Issue: "Template enforcement workflow still flagging issue"

**Cause:** The issue body doesn't contain the required text patterns for Definition of Ready and Definition of Done.

**Actual Validation:** The workflow in [`../.github/workflows/template-enforcement.yml`](../.github/workflows/template-enforcement.yml) performs **case-insensitive, unanchored text checks**:

```javascript
const dorRegex = /definition of ready \(dor\)/i;
const dodRegex = /definition of done \(dod\)/i;
```

This means:

- ✅ `## Definition of Ready (DoR)` works
- ✅ `### Definition of ready (dor)` works (case-insensitive)
- ✅ `Some text with Definition of Ready (DoR) inline` works
- ✅ Any heading level (##, ###, ####) works

**Solution:**

1. Verify the phrase "Definition of Ready (DoR)" appears somewhere in the issue body
2. Verify the phrase "Definition of Done (DoD)" appears somewhere in the issue body
3. Wait for the next workflow run to validate (typically within 5 minutes)
4. If the workflow still flags the issue, check the workflow logs for the specific error

### Issue: "Original content was lost during template application"

**Cause:** Template structure wasn't carefully preserving existing issue details, or the transformation function wasn't idempotent.

**Solution:**

1. Revert the issue (undo the last edit)
2. Carefully map original content into template sections
3. Ensure all acceptance criteria, links, and context are preserved
4. Use the idempotent transformation function to avoid data loss on retries
5. Re-apply the template

## Detailed Guidance

### Choosing the Right Template

When multiple issue types seem applicable, consider these tiers:

1. **Primary Category** — The main work type (feature, bug, refactor, documentation, etc.)
2. **Sub-Category** — More specific type if appropriate (e.g., a11y for accessibility, security for vulnerabilities)
3. **Context** — Epic for multi-part initiatives, research for exploratory work, task for small scoped items

### Handling Incomplete Issues

If an issue is created without a template or with an incomplete template:

1. Identify the issue type based on title and description
2. Preserve all existing content
3. Restructure into the appropriate template
4. Run template validation against the workflow requirements
5. Verify DoR and DoD sections are present

### Bulk Operations Best Practices

- Use the Python script for 3+ issues requiring template application
- Test the script on 1-2 issues first before bulk runs
- Always make transformations idempotent to safely retry failed batches
- Log each issue update with the applied template type
- Verify success rate before considering the batch complete

## Validation

After applying templates to any issue:

1. **Visual Check** — Confirm the issue body renders correctly on GitHub
2. **Workflow Check** — Wait for the template-enforcement workflow to validate
3. **Content Check** — Ensure no original content was lost or corrupted
4. **Reference Check** — Verify any links to related issues/PRs are still valid
5. **Format Check** — Confirm markdown syntax is correct (no broken lists, formatting)

The template-enforcement workflow will:

- ✅ Pass if both "Definition of Ready (DoR)" and "Definition of Done (DoD)" text appear anywhere in the body
- ❌ Fail if either phrase is missing or misspelled
- 🏷️ Label the issue with `status:needs-more-info` if validation fails (automatically removed when fixed)

## References

- [BRANCHING_STRATEGY.md](BRANCHING_STRATEGY.md) — Issue creation and branching workflows
- [AUTOMATION.md](AUTOMATION.md) — GitHub Actions workflow details  
- [PR_CREATION_PROCESS.md](PR_CREATION_PROCESS.md) — Pull request templates and processes
- [Template Enforcement Workflow](../.github/workflows/template-enforcement.yml) — Automation that validates templates
- [Issue Templates](../.github/ISSUE_TEMPLATE/) — All 25 issue type template files
- [AGENTS.md](AGENTS.md) — AI governance rules for issue automation

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
