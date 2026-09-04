---
title: GitHub Actions Environment Variable Marshalling Pattern
description: Security best practice for handling secrets in workflow steps
created: 2026-09-04
updated: 2026-09-04
category: security
related:
  - .github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/
  - issues/2800
  - issues/2641
  - issues/2601
---

# GitHub Actions Environment Variable Marshalling Pattern

## Overview

This document describes the **environment variable marshalling pattern** — a security best practice for handling secrets in GitHub Actions workflows. This pattern prevents shell injection vulnerabilities and accidental secret exposure in logs.

## The Problem

### Vulnerable Pattern (❌ Don't Do This)

```yaml
- name: Analyze Issues
  run: |
    curl -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
      "https://api.github.com/repos/${{ github.repository }}/issues" \
      | jq '.' > issues.json
```

**Why this is vulnerable:**

1. **Secrets exposed in script source**: The secret is interpolated directly into the shell script, making it visible in logs if the step fails
2. **Shell injection risk**: Special characters in secrets could break shell syntax or execute unintended commands
3. **Accidental logging**: Debugging or tracing might inadvertently reveal the secret
4. **Violates GitHub security best practices**: GitHub explicitly recommends against this pattern

### Related Vulnerabilities

- **CWE-94**: Improper Control of Generation of Code ('Code Injection')
- **CWE-78**: Improper Neutralization of Special Elements used in an OS Command ('OS Command Injection')
- **CWE-532**: Insertion of Sensitive Information into Log File

## The Solution

### Safe Pattern (✅ Do This)

```yaml
- name: Analyze Issues
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    REPO_NAME: ${{ github.repository }}
  run: |
    curl -H "Authorization: token $GITHUB_TOKEN" \
      "https://api.github.com/repos/$REPO_NAME/issues" \
      | jq '.' > issues.json
```

**Why this is secure:**

1. **Template expansion isolation**: Secrets are expanded in the `env` block only, not in script source
2. **No shell injection**: Secrets become clean environment variables with no special shell interpretation
3. **Log protection**: GitHub Actions automatically masks secret values in logs
4. **Clear source**: Easy to identify which variables come from secrets vs. context
5. **Follows best practices**: Aligns with GitHub Actions documentation

## How Environment Variable Marshalling Works

### Step 1: Template Expansion (GitHub Actions Runtime)

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # ← Template expanded here by GitHub
  REPO_NAME: ${{ github.repository }}        # ← Context variable resolved here
  BUILD_ID: ${{ github.run_id }}            # ← Runtime value inserted here
```

At this point:

- `GITHUB_TOKEN` contains the actual secret value
- `REPO_NAME` contains something like `"owner/repo"`
- `BUILD_ID` contains a numeric ID

**Important**: The secret value is NOT exposed in the workflow file, only the template expression.

### Step 2: Environment Variable Injection (Shell Process)

```yaml
run: |
  # These variables are available as environment variables
  echo "Repo: $REPO_NAME"
  echo "Build: $BUILD_ID"
  
  # Use variables with proper quoting for safety
  curl -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/$REPO_NAME/issues"
```

The shell process receives these as clean environment variables:

- No template syntax
- No special character interpretation
- No injection vectors

### Step 3: Log Masking (GitHub Actions)

When the step completes, GitHub Actions:

1. Detects that a secret value was used
2. Searches logs for the exact secret value
3. Replaces it with `***` in displayed logs

```
Run curl -H "Authorization: token $GITHUB_TOKEN" ...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    42  100    42    0     0    123      0 --:--:-- --:--:-- --:-- --:--:--
{"message":"401 Unauthorized"}
```

The actual `GITHUB_TOKEN` value is masked even though we used it in the curl command.

## Pattern Variants

### 1. Simple Environment Variables

**Best for**: Small workflows with few variables

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.DEPLOY_KEY }}
  run: |
    ./deploy.sh --key "$API_KEY"
```

### 2. Multiple Related Variables

**Best for**: Complex workflows with many context variables

```yaml
- name: Sync Repository
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ORG_NAME: ${{ github.repository_owner }}
    REPO_NAME: ${{ github.repository }}
    BRANCH: ${{ github.ref_name }}
    COMMIT_SHA: ${{ github.sha }}
  run: |
    node scripts/sync-repo.js \
      --org "$ORG_NAME" \
      --repo "$REPO_NAME" \
      --branch "$BRANCH" \
      --sha "$COMMIT_SHA" \
      --token "$GITHUB_TOKEN"
```

### 3. Step-Level vs Job-Level Environment

**Step-level** (preferred for secrets):

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.DEPLOY_KEY }}
  run: deploy.sh
```

**Job-level** (used for shared context):

```yaml
jobs:
  deploy:
    env:
      ENVIRONMENT: production
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.DEPLOY_KEY }}
        run: deploy.sh
```

The step-level `env` is preferred for secrets because it makes the dependency clear.

### 4. Passing to Script Arguments

**Using environment variables**:

```yaml
- name: Build
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    BUILD_VERSION: ${{ github.ref_name }}
  run: |
    npm ci --token "$NPM_TOKEN"
    npm run build --version "$BUILD_VERSION"
```

**Using node script arguments** (also secure):

```yaml
- name: Build
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
  run: |
    node scripts/build.js \
      --npm-token "$NPM_TOKEN" \
      --version "${{ github.ref_name }}"
```

## Implementation Checklist

When adding secrets to a workflow step, follow this checklist:

- [ ] **Use `env` block**: All secrets go in a separate `env:` block
- [ ] **Use shell variables**: Reference with `$VARIABLE_NAME` (not `${{ }}`)
- [ ] **Quote variables**: Always use `"$VARIABLE"` for safety
- [ ] **No direct interpolation**: Never use `${{ secrets.TOKEN }}` in `run` block
- [ ] **Consistent naming**: Use UPPERCASE_SNAKE_CASE for secret env vars
- [ ] **Document purpose**: Add comments explaining what each secret does
- [ ] **Test locally**: Verify the script works with dummy values
- [ ] **Validate in CI**: Let `npm run validate:workflows` confirm compliance

## Validation

### Manual Validation

Check that your workflow follows the pattern:

```bash
# Search for vulnerable patterns
grep -n '${{ secrets\.' .github/workflows/my-workflow.yml | grep -v 'env:'

# Should return no results - if it does, fix the vulnerability
```

### Automated Validation

The repository includes automated validation:

```bash
# Run workflow validation
npm run validate:workflows

# Run specific secrets audit
npm run audit:secrets
```

Both tools will flag any direct secrets interpolation in `run` blocks.

## Common Patterns by Use Case

### API Calls with Authentication

```yaml
- name: Call GitHub API
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    API_URL: https://api.github.com
  run: |
    curl -s \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      "$API_URL/repos/${{ github.repository }}/issues" \
      | jq '.[] | select(.state=="open")'
```

### Publishing to Package Registries

```yaml
- name: Publish to NPM
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
  run: |
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
    npm publish --access public
```

### Database Operations

```yaml
- name: Migrate Database
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    npm run migrate:up
```

### SSH Deployment

```yaml
- name: Deploy via SSH
  env:
    SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
    DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
    DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_KEY" > ~/.ssh/id_deploy
    chmod 600 ~/.ssh/id_deploy
    ssh -i ~/.ssh/id_deploy "$DEPLOY_USER@$DEPLOY_HOST" 'deploy.sh'
```

### Docker Registry Login

```yaml
- name: Login to Container Registry
  env:
    REGISTRY_USERNAME: ${{ secrets.REGISTRY_USERNAME }}
    REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}
  run: |
    echo "$REGISTRY_PASSWORD" | docker login -u "$REGISTRY_USERNAME" --password-stdin
```

## Troubleshooting

### Issue: "Secret value appears in logs"

**Cause**: You used `${{ secrets.TOKEN }}` in the `run` block instead of the `env` block

**Fix**:

```yaml
# ❌ Wrong
- run: echo ${{ secrets.API_KEY }}

# ✅ Correct
- env:
    API_KEY: ${{ secrets.API_KEY }}
  run: echo $API_KEY
```

### Issue: "Variable is empty in script"

**Cause**: You didn't define the env variable

**Fix**: Make sure the `env:` block is at the correct indentation level (same as `run:`)

```yaml
# ❌ Wrong (env indented too far)
- name: Deploy
  run: |
    env:
      KEY: ${{ secrets.KEY }}
    echo $KEY

# ✅ Correct (env at step level)
- name: Deploy
  env:
    KEY: ${{ secrets.KEY }}
  run: echo $KEY
```

### Issue: "Validation fails with 'secrets in run'"

**Cause**: The validator found `${{ secrets.` in your `run` block

**Fix**: Move the secret reference to the `env:` block

```yaml
# ❌ Fails validation
- run: node script.js --key ${{ secrets.API_KEY }}

# ✅ Passes validation
- env:
    API_KEY: ${{ secrets.API_KEY }}
  run: node script.js --key "$API_KEY"
```

## Performance Implications

The environment variable marshalling pattern has **no negative performance impact**:

- **Negligible overhead**: Setting environment variables is a standard shell operation
- **No additional API calls**: All work is local to the step
- **Caching still works**: Environment variables don't interfere with job caching
- **Same execution speed**: The only difference is where template expansion happens

## Security Considerations

### What This Protects Against

- ✅ Accidental secret exposure in logs
- ✅ Shell metacharacter injection
- ✅ Template injection attacks
- ✅ Secrets being visible in workflow source

### What This Does NOT Protect Against

- ❌ Malicious actor with repository access (can still extract secrets)
- ❌ Compromised Docker images in workflow (can capture environment)
- ❌ Secrets leaked by the actual script logic (application bug)
- ❌ Secrets passed to third-party actions (must trust the action)

**Always use the principle of least privilege**: Only grant secrets to workflows that actually need them.

## References

### GitHub Documentation

- [GitHub Actions: Security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [GitHub Actions: Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions: Environment variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables)

### Security Standards

- [CWE-94: Improper Control of Generation of Code](https://cwe.mitre.org/data/definitions/94.html)
- [CWE-78: OS Command Injection](https://cwe.mitre.org/data/definitions/78.html)
- [CWE-532: Insertion of Sensitive Information into Log File](https://cwe.mitre.org/data/definitions/532.html)

### Related Issues and PRs

- Issue #2798: [Audit remaining workflows for secrets exposure patterns](https://github.com/lightspeedwp/.github/issues/2798)
- Issue #2800: [Document environment variable marshalling pattern](https://github.com/lightspeedwp/.github/issues/2800)
- PR #2641: [Security Hardening: Environment Variable Marshalling](https://github.com/lightspeedwp/.github/pull/2641)

### Project Documentation

- [Phase 2 Label Remediation - Workflow Security Hardening](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/README.md)
- [Security Hardening Report](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/01-SECURITY-HARDENING-REPORT.md)
- [Workflow Modifications](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/02-WORKFLOW-MODIFICATIONS.md)

## Questions?

If you have questions about implementing this pattern:

1. Check this documentation first
2. Review the [Workflow Modifications](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/02-WORKFLOW-MODIFICATIONS.md) for concrete examples
3. Open an issue or ask in our team chat

---

**Document Status**: Complete and Ready for Use  
**Last Updated**: 2026-09-04  
**Maintained By**: Claude (AI Agent)  
**Related Issue**: #2800
