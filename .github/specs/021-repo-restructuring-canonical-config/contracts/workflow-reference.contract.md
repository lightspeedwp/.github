# Validation Contract: Custom Workflow Reference Standards

**Scope**: Custom workflows in consumer repos (e.g., ThisOneTimeOnAcidCom/.github/workflows/)  
**Audience**: Repository maintainers, workflow authors

---

## Contract Purpose

Ensure custom workflows in consumer repos correctly reference (not duplicate) canonical governance elements from lightspeedwp/.github. This prevents configuration drift and maintains single source of truth while allowing repo-specific automation.

---

## Reference Standards

### ✅ CORRECT: Reference Canonical Labels via API

**Pattern**: Use GitHub API to read labels dynamically

```yaml
name: Custom WordPress CI

on:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Get canonical labels
        id: labels
        uses: actions/github-script@v6
        with:
          script: |
            // Fetch labels from GitHub API (not hardcoded)
            const labels = await github.rest.issues.listLabelsForRepo({
              owner: 'lightspeedwp',
              repo: '.github'
            });
            
            // Filter for type labels
            const typeLabels = labels.data.filter(l => l.name.startsWith('type:'));
            
            // Use in workflow
            core.setOutput('priority-labels', typeLabels);
      
      - name: Apply label to PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.addLabels({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: ['type:feature']  // Use canonical label name
            });
```

**Benefits**: 
- Dynamic; picks up label updates automatically
- No duplication of label definitions
- Single source of truth maintained

---

### ✅ CORRECT: Use PR Templates via Routing

**Pattern**: Let drift detection / template routing workflow handle template suggestions

```yaml
# Custom workflow does NOT define templates; relies on GitHub Actions routing

name: Custom WordPress CI

on:
  pull_request:

jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Verify PR uses canonical template
        uses: actions/github-script@v6
        with:
          script: |
            // Check that PR body follows expected template structure
            // (from canonical lightspeedwp/.github/PULL_REQUEST_TEMPLATE/*)
            
            const body = context.payload.pull_request.body;
            
            // Verify expected sections exist
            const hasDescription = body.includes('## Description');
            const hasTesting = body.includes('## Testing');
            
            if (!hasDescription || !hasTesting) {
              core.setFailed('PR must use canonical template structure');
            }
```

**Benefits**:
- No local template copies
- Workflows validate structure; routing handles suggestions
- Maintainable; templates update in one place

---

### ❌ WRONG: Hard-Code Canonical Label Names

**Anti-Pattern**: Duplicate label definitions in custom workflows

```yaml
# ❌ DON'T DO THIS
jobs:
  setup:
    steps:
      - name: Define labels (WRONG - duplicates .github!)
        run: |
          cat > labels.yml <<EOF
          - name: type:feature
            description: New feature
            color: 0075ca
          EOF
```

**Why it's wrong**:
- Creates label duplication
- Custom labels diverge from canonical set
- Violates Principle III (asset boundaries)

**Fix**: Reference canonical labels only via API

---

### ❌ WRONG: Copy PR Templates Locally

**Anti-Pattern**: Duplicate templates in consumer repo

```yaml
# ❌ DON'T DO THIS
jobs:
  test:
    steps:
      - name: Copy template (WRONG - creates drift!)
        run: |
          cp lightspeedwp/.github/PULL_REQUEST_TEMPLATE/pr_feature.md \
             ThisOneTimeOnAcidCom/.github/PULL_REQUEST_TEMPLATE/
```

**Why it's wrong**:
- Creates local copy (duplication)
- Local copy becomes stale as canonical version updates
- Breaks Principle III asset boundaries
- Drift detection will block this PR

**Fix**: Reference templates from lightspeedwp/.github; do not copy

---

### ❌ WRONG: Override Canonical Labels

**Anti-Pattern**: Redefine labels in custom workflow

```yaml
# ❌ DON'T DO THIS
jobs:
  analyze:
    steps:
      - name: Create custom type label (WRONG - overrides canonical!)
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createLabel({
              owner: context.repo.owner,
              repo: context.repo.repo,
              name: 'type:feature',  // ❌ This duplicates canonical label!
              color: 'FF0000'  // ❌ Different color than canonical
            });
```

**Why it's wrong**:
- Creates duplicate with different definition
- Violates canonical label governance
- Breaks PR template routing (label mismatch)

**Fix**: Use canonical labels as-is; do not override

---

## Validation Checklist

Use this checklist to validate custom workflows before merging:

### For Each Custom Workflow

- [ ] **No label definitions**: Workflow does NOT define labels (no `labels.yml`, no `createLabel` calls)
- [ ] **API references only**: If workflow uses labels, gets them via GitHub API (not hard-coded)
- [ ] **No template copies**: Workflow does NOT copy templates from lightspeedwp/.github
- [ ] **Template validation only**: If workflow checks templates, validates structure only (via routing)
- [ ] **No `.github/` governance files**: Workflow does NOT create/modify `.github/labels.yml`, `.github/issue-types.yml`, etc.
- [ ] **Custom workflows OK**: Workflow modifications to `.github/workflows/` are allowed (this is where repo-specific jobs live)

### Validation Command

```bash
# Audit custom workflow for reference violations
grep -E "labels\.yml|issue-types\.yml|PULL_REQUEST_TEMPLATE|ISSUE_TEMPLATE|createLabel" \
  ThisOneTimeOnAcidCom/.github/workflows/*.yml

# Result:
# - If matches found in file content (not comments): VIOLATION
# - If no matches: PASS
```

---

## Exception: Shared Reusable Workflows

**Reusable Workflows from lightspeedwp/.github**: These CAN be called from consumer repos.

**Pattern**:
```yaml
# ThisOneTimeOnAcidCom/.github/workflows/custom-ci.yml
jobs:
  shared-validation:
    uses: lightspeedwp/.github/.github/workflows/shared-validator.yml@main
    # ✅ This is OK - calling shared workflows is allowed
```

**Constraint**: Reusable workflows MUST be defined in `lightspeedwp/.github/.github/workflows/` with `workflow_call` trigger, per Principle III exception.

---

## Testing Custom Workflows

Before merging, verify custom workflows work correctly with canonical governance:

```bash
# 1. Manual PR creation test
git checkout -b feat/test-workflow
# Make PR
# → Verify: PR template routing suggests pr_feature.md ✅
# → Verify: type:feature label applied ✅
# → Verify: Custom workflow runs ✅

# 2. Automated audit test
npm run audit:workflows -- --repo ThisOneTimeOnAcidCom
# Checks: No governance file references, no label duplication

# 3. Label API test
# Custom workflow queries GitHub API for labels
# → Should return canonical label set from lightspeedwp/.github
```

---

## Success Criteria

| Criterion | Pass Condition |
|-----------|---|
| Label references | All label references via API; zero hard-coded label definitions |
| Template references | All template references via routing; zero template file copies |
| Governance files | Zero `.github/labels.yml`, `.github/issue-types.yml` definitions in custom workflows |
| Drift detection | Drift detection workflow allows all custom workflow changes |
| Compatibility | Custom workflows run successfully with canonical governance |

---

## References

- Canonical Labels: `lightspeedwp/.github/labels.yml`
- Canonical Templates: `lightspeedwp/.github/PULL_REQUEST_TEMPLATE/`, `lightspeedwp/.github/ISSUE_TEMPLATE/`
- Principle III (Asset Boundaries): `lightspeedwp/.github/.specify/memory/constitution.md`
- Drift Detection Workflow: `lightspeedwp/.github/.github/specs/021-repo-restructuring-canonical-config/contracts/drift-detection.contract.md`
