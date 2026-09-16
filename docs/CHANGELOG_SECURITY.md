# Security & Privacy in Changelog Validation

Guidelines for keeping sensitive information out of changelogs and protecting API rate limits.

## Secrets & Sensitive Data

### Never Include

- API keys or tokens (GitHub, AWS, Firebase, etc.)
- Internal IP addresses or hostnames
- Private user data (email addresses, IDs)
- Security exploits or vulnerability details
- Internal metrics or performance data
- Private PR links to unrelated repos
- Customer names or account IDs
- Configuration secrets or credentials

### Examples of What NOT to Include

```yaml
# ❌ DON'T: Include API keys
description: "Now supports API key XYZ-12345-ABC for authentication"

# ❌ DON'T: Include internal IPs
description: "Fixed connectivity issue with 10.0.0.5"

# ❌ DON'T: Include customer data
description: "Fixed issue affecting customer Acme Corp"

# ❌ DON'T: Include internal metrics
description: "Improved performance - response time 125ms → 80ms on production"

# ❌ DON'T: Describe vulnerability before public disclosure
description: "Fixed critical buffer overflow in webhook handler"
```

### Safe Alternatives

```yaml
# ✅ DO: Generic reference
description: "Improved webhook authentication security"

# ✅ DO: Describe without specifics
description: "Fixed internal connectivity issue"

# ✅ DO: Use generic references
description: "Fixed issue affecting certain webhook configurations"

# ✅ DO: Use relative metrics
description: "Improved webhook delivery performance"

# ✅ DO: Disclose after appropriate time
description: "Security update: Please upgrade to patch version X.Y.Z"
```

## GitHub API Rate Limiting

The validation system uses GitHub API to verify PR references. Be aware of rate limits:

### Rate Limits

- **Authenticated requests**: 5,000 per hour
- **Unauthenticated requests**: 60 per hour
- **Rate limit resets**: Hourly (UTC)

### When Rate Limits Apply

Rate limiting occurs when:
1. Validating many PR references in batch
2. Running audit on large releases
3. Multiple CI/CD pipelines running simultaneously
4. Using default GitHub app token

### Handling Rate Limit Errors

**Error message**:
```
[ERROR] API Rate limit exceeded - requests limited until 2026-09-14T15:00:00Z
```

**Solutions**:

1. **Graceful degradation**: System continues without GitHub verification
   - PR references treated as valid
   - Warning logged: "PR reference not verified due to API rate limit"

2. **Wait and retry**: Allow 1 hour for rate limit to reset

3. **Increase token scope**: Use a higher-privilege token if available
   - Personal access token with `repo` scope
   - GitHub App with higher rate limits

### Configuration

Set GitHub token via environment variable:
```bash
export GITHUB_TOKEN=your-personal-access-token
npm run validate:changelog -- --entry entry.yml
```

**Token scope requirements**:
- Minimum: `public_repo` (public repos only)
- Recommended: `repo` (all repos you can access)
- Never: Store tokens in version control

## Authorization & Token Scopes

### GitHub Token Requirements

For changelog validation, the token needs:
- `repo` scope OR `public_repo` for public access
- Read-only access (write permission not needed)

### Using with CI/CD

In GitHub Actions, use default GITHUB_TOKEN:
```yaml
- name: Validate changelog
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: npm run validate:changelog
```

The default token has appropriate permissions.

### Personal Access Tokens

If using a personal access token:

1. Create at https://github.com/settings/tokens
2. Select only necessary scopes:
   - ✅ `public_repo` (for public repos)
   - ✅ `repo` (for all repos you can access)
3. Never commit token to version control
4. Use environment variable: `GITHUB_TOKEN=your-token npm run validate:changelog`

## Private Repositories

### Validation Behavior

- PR references to private repos may fail to validate
- Error: "PR not found or not accessible"
- Solution: Ensure GITHUB_TOKEN has access to private repo

### Recommended Approach

For private repos:
1. Use authenticated token with appropriate scope
2. Set `GITHUB_TOKEN` environment variable
3. Validation will verify access-controlled PRs

## Audit Trail & Logging

### Validation Logs

Logs may contain:
- PR numbers (public)
- Repository names (public)
- Validation results (public)
- NOT: API keys, personal data, or private content

### Log Retention

Validation logs stored in `.github/reports/validation-audits/`:
- Automatically cleaned after 90 days
- Safe to commit (contains no secrets)
- Queryable for compliance

## Compliance Checklist

Before committing a changelog entry, verify:

- [ ] No API keys or credentials
- [ ] No internal IP addresses
- [ ] No customer names or identifying data
- [ ] No security vulnerability details (before disclosure)
- [ ] No production metrics or private data
- [ ] PR references are public or accessible
- [ ] No internal hostnames or domain names
- [ ] No personal information (emails, IDs, names)

## Incident Response

If a secret is accidentally committed to changelog:

1. **Stop merge**: Do not merge PR with secret
2. **Regenerate secret**: If API key/token exposed, regenerate immediately
3. **Remove from history**: Use `git filter-branch` or similar
4. **Commit replacement**: Update entry to remove sensitive data
5. **Force push**: Push updated branch (once secrets are regenerated)

## Incident Example

```bash
# If you accidentally exposed GITHUB_TOKEN in a changelog entry:
1. Regenerate the token immediately at GitHub settings
2. Update the changelog entry to remove token
3. Force-push updated branch
4. Verify token is no longer in public history
5. Audit logs for any API calls with exposed token
```

---

For questions about secrets or compliance, contact your security team.
