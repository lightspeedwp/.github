---
title: "LightSpeed Metrics Directory"
version: "v1.0"
last_updated: "2025-12-04"
author: "LightSpeed"
maintainer: "Ash Shaw"
description: "Metrics collection scripts, configuration, and automation for tracking repository health, documentation quality, and project activity."
tags: ["metrics", "analytics", "automation", "monitoring", "quality"]
file_type: "documentation"
category: "infrastructure"
jobs:
  metrics-update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run frontmatter metrics
        run: node .github/metrics/frontmatter-metrics.js
      - name: Move reports to reporting directory
        run: |
          mkdir -p .github/reporting/frontmatter
          mv metrics/out/frontmatter-metrics.* .github/reporting/frontmatter/
      - name: Commit metrics
        run: |
          git add .github/reporting
          git commit -m "chore: update metrics [skip ci]"
```

### Dashboard Integration

Metrics can feed external dashboards:

- **PowerBI**: Import JSON artifacts
- **Grafana**: Parse JSON for time-series visualization
- **Custom Dashboards**: Fetch via GitHub API

### Alert Integration

Configure alerts based on threshold violations:

```yaml
# Example: Slack notification on threshold failure
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Metrics thresholds failed in ${{ github.repository }}"
      }
```

## Development

### Adding New Metrics

1. **Create Collection Script**: Add new script in `.github/metrics/`
2. **Update Config**: Add configuration to `metrics.config.json`
3. **Define Output**: Specify artifact and report paths
4. **Integrate Workflow**: Update or create workflow in `.github/workflows/`
5. **Document**: Update this README with metric details
6. **Test**: Run locally and validate outputs

### Testing Metrics

```bash
# Test frontmatter metrics locally
node .github/metrics/frontmatter-metrics.js

# Validate output schema
npx ajv validate -s schemas/metrics-output.schema.json \
  -d metrics/out/frontmatter-metrics.json

# Run with test fixtures
TEST_MODE=true node .github/metrics/frontmatter-metrics.js
```

### Debugging

```bash
# Enable verbose logging
DEBUG=metrics:* node .github/metrics/frontmatter-metrics.js

# Dry run (no file writes)
DRY_RUN=true node .github/metrics/frontmatter-metrics.js

# Test specific file patterns
node .github/metrics/frontmatter-metrics.js --include="docs/**/*.md"
```

## Best Practices

- **Version Control Config**: Always commit `metrics.config.json` changes
- **Document Thresholds**: Explain rationale for threshold values
- **Test Before Deploy**: Run metrics locally before pushing changes
- **Schema Validation**: Validate JSON outputs against schemas
- **Incremental Changes**: Add metrics incrementally, not all at once
- **Monitor Performance**: Track execution time for metrics scripts
- **Archive Old Outputs**: Move historical data to `.github/reporting/archive/`

## Troubleshooting

**Script fails with "Cannot find module"**:

```bash
# Install dependencies
npm install
```

**Threshold failures causing build issues**:

```bash
# Review thresholds in metrics.config.json
# Adjust or fix underlying issues
# Set failOnError: false for warnings only
```

**Output files not generated**:

```bash
# Check output directory exists
mkdir -p metrics/out

# Verify script permissions
chmod +x .github/metrics/frontmatter-metrics.js

# Run with debug logging
DEBUG=* node .github/metrics/frontmatter-metrics.js
```

**Frontmatter validation errors**:

```bash
# Review schema: schemas/frontmatter.schema.json
# Validate individual file:
npx ajv validate -s schemas/frontmatter.schema.json -d path/to/file.md
```

## Related Resources

| Resource                  | Purpose                           | Location                                                                              |
| ------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| **Reporting Directory**   | Generated report outputs          | [.github/reporting/](../reporting/)                                                   |
| **Metrics Agent Spec**    | Future automated metrics agent    | [.github/agents/metrics.agent.md](../agents/metrics.agent.md)                         |
| **Branding Workflow**     | Branding metrics automation       | [.github/workflows/branding.yml](../workflows/branding.yml)                           |
| **Frontmatter Schema**    | Validation schema for frontmatter | [schemas/frontmatter.schema.json](../../schemas/frontmatter.schema.json)              |
| **Automation Governance** | Metrics and reporting policies    | [.github/automation/AUTOMATION_GOVERNANCE.md](../automation/AUTOMATION_GOVERNANCE.md) |

## Future Enhancements

See [.github/agents/metrics.agent.md](../agents/metrics.agent.md) for planned metrics automation:

- Automated issue/PR metrics collection
- Multi-repo aggregation
- Real-time metrics dashboards
- Configurable alert thresholds
- Metrics API endpoint

## Contributing

To contribute new metrics or improvements:

1. Review [CONTRIBUTING.md](../../CONTRIBUTING.md)
2. Follow [coding standards](../instructions/coding-standards.instructions.md)
3. Add tests for new metrics scripts
4. Document configuration changes
5. Submit PR with rationale and examples

---

Made with ❤️ by the LightSpeed team.
