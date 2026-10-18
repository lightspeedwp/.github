# GitHub Actions Contract: PR Template Routing Workflow

**Workflow Name**: `pr-template-routing.yml`  
**Location**: `lightspeedwp/.github/workflows/pr-template-routing.yml`  
**Triggered By**: Pull request opened/reopened  
**Audience**: Repository maintainers, developers

---

## Contract Purpose

Automatically detect branch type from PR branch prefix (e.g., `feat/`, `fix/`) and suggest the appropriate PR template from canonical lightspeedwp/.github source. Guide developers to use canonical templates without enforcing (suggestion-only; developer retains choice).

---

## Input Specification

| Input | Type | Required | Example | Description |
|-------|------|----------|---------|------------|
| pr-number | integer | Yes | 123 | PR number |
| pr-branch | string | Yes | feat/my-feature | Branch name |
| pr-base-branch | string | Yes | develop | Target branch |

**How Inputs Arrive**: GitHub Actions `github.event.pull_request.number`, `github.event.pull_request.head.ref`, `github.event.pull_request.base.ref`

---

## Branch Type to Template Mapping

See `.github/branch-types.yml` in lightspeedwp/.github for authoritative mapping.

Example subset:
```yaml
routing:
  feat:
    template: pr_feature.md
    label: type:feature
  fix:
    template: pr_bug.md
    label: type:bug
  docs:
    template: pr_docs.md
    label: type:docs
  # ... [38 types total]
```

---

## Routing Logic

```
Input: PR with branch name `feat/my-feature`

1. Extract prefix: `feat` from `feat/my-feature`
2. Look up in branch-types.yml routing
3. Find template: `pr_feature.md`
4. Find label: `type:feature`

Output:
- Suggested template: pr_feature.md
- Suggested label: type:feature
- Canonical location: lightspeedwp/.github/PULL_REQUEST_TEMPLATE/pr_feature.md
```

---

## Output Specification

### Success Case (Valid Branch Type)

**Check Status**: ✅ SUCCESS

**Comment on PR**:
```
✅ PR Template Suggestion

Branch: feat/my-feature
Type: feature

Suggested template: `pr_feature.md`
Canonical location: lightspeedwp/.github/PULL_REQUEST_TEMPLATE/pr_feature.md

👉 Use this template to ensure consistency across all LightSpeed repositories.

Type label: type:feature (auto-applied)

---
*Suggested by PR Template Router • lightspeedwp/.github*
```

**Label Applied**: `type:feature` (from routing mapping)

---

### Invalid Branch Type (Forbidden Prefix)

**Check Status**: ⚠️ WARNING (not blocking)

**Comment on PR**:
```
⚠️ Branch Name Format

Branch: claude/my-feature

❌ FORBIDDEN: `claude/` prefix is reserved for Claude Code internal sessions

Allowed prefixes:
- feat/, fix/, docs/, etc. (38 authorized types)
- See: lightspeedwp/.github/CLAUDE.md

👉 Recommendation:
1. Identify the correct type for your change (feature, fix, docs, etc.)
2. Rename branch to follow pattern: {type}/{scope}-{title}
3. Create new PR with corrected branch name

---
*Branch validation by PR Template Router • lightspeedwp/.github*
```

**Label Applied**: None (no valid type detected)

---

### Unknown Branch Type (Not in Routing)

**Check Status**: ⚠️ WARNING (not blocking)

**Comment on PR**:
```
⚠️ Branch Type Not Recognized

Branch: my-feature (no type prefix)

Branch should follow pattern: {type}/{scope}-{title}

Examples:
- feat/my-feature
- fix/bug-123
- docs/readme-update

See: lightspeedwp/.github/CLAUDE.md

---
*Suggested by PR Template Router • lightspeedwp/.github*
```

**Label Applied**: `type:documentation` (default fallback; can be overridden by author)

---

## Implementation Details

### Workflow Structure

```yaml
name: PR Template Routing

on:
  pull_request:
    types: [opened, reopened]

jobs:
  route-template:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          sparse-checkout: .github/branch-types.yml
      
      - name: Extract branch type
        id: branch-type
        run: |
          BRANCH="${{ github.event.pull_request.head.ref }}"
          
          # Extract prefix (everything before first /)
          if [[ $BRANCH == *"/"* ]]; then
            TYPE="${BRANCH%%/*}"
          else
            TYPE="unknown"
          fi
          
          echo "type=$TYPE" >> $GITHUB_OUTPUT
          echo "branch=$BRANCH" >> $GITHUB_OUTPUT
      
      - name: Look up template mapping
        id: template-lookup
        run: |
          # Parse branch-types.yml and find mapping for $TYPE
          TYPE="${{ steps.branch-type.outputs.type }}"
          
          # Use yq or Python to extract template and label
          TEMPLATE=$(yq eval ".routing.$TYPE.template" .github/branch-types.yml)
          LABEL=$(yq eval ".routing.$TYPE.label" .github/branch-types.yml)
          
          if [[ $TEMPLATE == "null" ]] || [[ -z $TEMPLATE ]]; then
            echo "status=unknown" >> $GITHUB_OUTPUT
            echo "template=pr_feature.md" >> $GITHUB_OUTPUT  # fallback
            echo "label=type:documentation" >> $GITHUB_OUTPUT  # fallback
          else
            echo "status=found" >> $GITHUB_OUTPUT
            echo "template=$TEMPLATE" >> $GITHUB_OUTPUT
            echo "label=$LABEL" >> $GITHUB_OUTPUT
          fi
      
      - name: Comment with suggestion
        uses: actions/github-script@v6
        with:
          script: |
            const template = "${{ steps.template-lookup.outputs.template }}";
            const label = "${{ steps.template-lookup.outputs.label }}";
            const branch = "${{ steps.branch-type.outputs.branch }}";
            const status = "${{ steps.template-lookup.outputs.status }}";
            
            let comment = "";
            if (status === "found") {
              comment = `✅ PR Template Suggestion\n\nBranch: ${branch}\nSuggested template: \`${template}\`\nType label: \`${label}\`\n\nCanonical location: lightspeedwp/.github/PULL_REQUEST_TEMPLATE/${template}`;
            } else {
              comment = `⚠️ Branch Type Not Recognized\n\nBranch: ${branch}\n\nBranch should follow: {type}/{scope}-{title}\nSee: lightspeedwp/.github/CLAUDE.md`;
            }
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
      
      - name: Apply type label
        uses: actions/github-script@v6
        with:
          script: |
            const label = "${{ steps.template-lookup.outputs.label }}";
            
            github.rest.issues.addLabels({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: [label]
            });
```

---

## Error Handling

| Error Scenario | Response |
|---|---|
| branch-types.yml not found | Use fallback mapping (hardcoded list) |
| YAML parsing fails | Log error; use fallback mapping |
| GitHub API rate limit | Retry after delay; do not fail check |
| Branch extraction fails | Treat as unknown type; apply default |

---

## Integration Points

- **Consumed By**: GitHub PR process (informational comment)
- **Consumed By**: Developers (suggestion guidance)
- **Reads From**: `lightspeedwp/.github/branch-types.yml` (authoritative mapping)
- **Writes To**: GitHub PR comments, labels
- **Cross-Repo**: References canonical `.github/PULL_REQUEST_TEMPLATE/` in lightspeedwp/.github

---

## Important Notes

### Suggestion vs. Enforcement

This workflow is **suggestion-only**:
- Comments suggest appropriate template
- Labels are applied as guidance
- Developer can override (is not blocked)
- No merge gate; informational only

**Rationale**: Guidance without friction; developers retain flexibility for edge cases.

### Custom Workflows Are OK

This workflow does NOT block custom workflows in consumer repos:
- Only comments on PR with routing suggestion
- Does not enforce template use
- Allows developer choice

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Template suggestion accuracy | ≥95% | Verify suggested templates match branch type |
| Routing latency | <2s | Measure workflow execution time |
| Developer adoption | ≥70% | Track % of PRs using suggested template |
| False negatives | 0 | Confirm no branch type goes unrouted |
