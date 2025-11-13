---
title: "G-8: Link Checker Integration"
labels: ["🚀 promotion-ready", "enhancement", "documentation"]
assignees: []
---

## Summary

Integrate broken link checking into the CI pipeline to ensure all documentation links remain valid.

## Acceptance Criteria

- [ ] Select and integrate link checker tool (e.g., broken-link-checker, linkinator)
- [ ] Replace placeholder in `manage-readmes.yml:18-21` with actual link checker
- [ ] Configure link checker:
  - [ ] Check all markdown files
  - [ ] Check internal links
  - [ ] Check external links (with reasonable timeout)
  - [ ] Handle rate limiting gracefully
- [ ] Emit metrics for broken links found
- [ ] Document link checker configuration and usage
- [ ] Add exceptions/ignore list for known issues

## Implementation Notes

- Current placeholder: `npx broken-link-checker -r . || true`
- Remove `|| true` and make it fail on broken links
- Consider using linkinator or markdown-link-check as alternatives
- Add caching for external link checks to avoid rate limits
- Run on PR and push to develop

## Configuration Options

```yaml
# Example configuration
link-checker:
  internal-links: true
  external-links: true
  timeout: 30s
  retry: 3
  ignore-patterns:
    - localhost
    - 127.0.0.1
    - example.com
```

## Related Files

- `.github/workflows/manage-readmes.yml`
- `docs/**/*.md`
- `README.md`

## Testing Requirements

- [ ] Test with known broken internal link
- [ ] Test with known broken external link
- [ ] Test with valid links
- [ ] Verify metrics emission
- [ ] Test ignore patterns

## Dependencies

- Works with G-3 (Manage READMEs Agent)
- Works with G-6 (CI Metrics) for reporting
