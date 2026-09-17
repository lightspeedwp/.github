# Telemetry Infrastructure

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

Lightweight telemetry system for tracking events across the LightSpeed .github repository.

## Overview

This telemetry infrastructure enables monitoring, debugging, and performance tracking of critical workflows including:

- Release agent changelog validation
- Metrics collection orchestration
- Metrics reporting generation  
- Website theme toggle interactions

## Features

- **Privacy-First**: Clear separation between safe (anonymous) and restricted (detailed) properties
- **Environment-Aware**: Automatic detection of development, production, and test environments
- **Multiple Backends**: Support for console, file, and analytics service backends
- **Zero-Impact**: Telemetry failures never break application flow
- **Schema Validation**: Automatic property validation against event schemas

## Architecture

```
scripts/telemetry/
├── telemetry-client.js       # Core telemetry client
├── event-schemas.js           # Event definitions and validation schemas
└── __tests__/
    └── telemetry-client.test.js   # Unit tests
```

## Quick Start

### Node.js Usage

```javascript
const { createTelemetryClient } = require('./scripts/telemetry/telemetry-client.js');
const { EVENT_SCHEMAS } = require('./scripts/telemetry/event-schemas.js');

// Create client
const telemetry = createTelemetryClient({
  eventSchemas: EVENT_SCHEMAS
});

// Emit an event and flush (wrapped in async function to avoid top-level await)
(async () => {
  telemetry.emit('release.validation.started', {
    safe: {
      component: 'release-agent',
      version: '1.0.0'
    },
    restricted: {
      repositoryName: 'lightspeedwp/.github'
    }
  });

  // Flush (optional, for file backend)
  await telemetry.flush();
})();
```

### Browser Usage

```javascript
// Simple inline telemetry for browser contexts
const telemetry = {
  emit(eventType, properties) {
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      environment: 'browser',
      ...properties
    };
    console.log('[Telemetry]', event);
  }
};

telemetry.emit('website.theme.toggled', {
  safe: { fromTheme: 'light', toTheme: 'dark' }
});
```

## Event Catalog

### Release Agent Events (3 events)

#### `release.validation.started`

Emitted when release validation workflow begins.

**Safe Properties:**

- `component` (required): Component name
- `version` (required): Version number
- `trigger` (optional): Trigger type (manual, dry-run, automated)

**Restricted Properties:**

- `repositoryName` (required): Repository identifier
- `changelogPath` (optional): Path to CHANGELOG.md
- `versionFile` (optional): Path to VERSION file

#### `release.validation.completed`

Emitted when release validation completes successfully.

**Safe Properties:**

- `component` (required): Component name
- `version` (required): Version number
- `validationDuration` (required): Duration in milliseconds
- `gatesPassed` (optional): Number of gates passed
- `warningCount` (optional): Number of warnings

**Restricted Properties:**

- `repositoryName` (required): Repository identifier
- `changelogPath` (optional): Path to CHANGELOG.md
- `validationResults` (optional): JSON string of validation results

#### `release.gate.failure`

Emitted when a validation gate fails.

**Safe Properties:**

- `component` (required): Component name
- `gateName` (required): Name of failed gate
- `failureReason` (required): Reason for failure
- `attemptNumber` (optional): Attempt number
- `recoverable` (optional): Whether failure is recoverable

**Restricted Properties:**

- `repositoryName` (required): Repository identifier
- `changelogPath` (optional): Path to CHANGELOG.md
- `errorDetails` (optional): Detailed error message
- `stackTrace` (optional): Error stack trace

### Metrics Collection Events (3 events)

#### `metrics.collection.started`

Emitted when metrics collection workflow begins.

**Safe Properties:**

- `repositoryCount` (required): Number of repositories
- `collectionType` (required): Type of collection (manual, weekly, daily)
- `scheduledRun` (optional): Whether triggered by schedule
- `trigger` (optional): Trigger source

**Restricted Properties:**

- `repositories` (optional): Array of repository names
- `configPath` (optional): Path to configuration file

#### `metrics.collection.completed`

Emitted when metrics collection completes.

**Safe Properties:**

- `repositoryCount` (required): Total repositories
- `successCount` (required): Successful collections
- `failureCount` (required): Failed collections
- `collectionDuration` (required): Duration in milliseconds
- `metricsCollected` (optional): Total metrics collected
- `anomaliesDetected` (optional): Anomalies found

**Restricted Properties:**

- `repositories` (optional): Array of repository names
- `failedRepositories` (optional): Array of failed repositories
- `summaryPath` (optional): Path to summary report

#### `metrics.repository.collection.failed`

Emitted when collection fails for a specific repository.

**Safe Properties:**

- `failureReason` (required): Reason for failure
- `attemptNumber` (required): Attempt number
- `recoverable` (optional): Whether recoverable
- `retryScheduled` (optional): Whether retry is scheduled

**Restricted Properties:**

- `repository` (required): Repository identifier
- `errorDetails` (optional): Detailed error message
- `apiResponse` (optional): API response code
- `stackTrace` (optional): Error stack trace

### Metrics Reporting Events (1 event)

#### `metrics.report.generated`

Emitted when a metrics report is successfully generated.

**Safe Properties:**

- `reportType` (required): Type of report
- `period` (required): Reporting period (weekly, monthly)
- `metricsIncluded` (required): Number of metrics
- `trendsIncluded` (optional): Whether trends included
- `anomaliesIncluded` (optional): Whether anomalies included
- `generationDuration` (optional): Duration in milliseconds

**Restricted Properties:**

- `repository` (required): Repository identifier
- `reportPath` (optional): Path to report file
- `fileSize` (optional): Report file size in bytes

### Website Events (2 events)

#### `website.theme.toggled`

Emitted when user toggles website theme.

**Safe Properties:**

- `fromTheme` (required): Previous theme
- `toTheme` (required): New theme
- `method` (optional): Toggle method (user-click, auto, system)

**Restricted Properties:**

- `userAgent` (optional): Browser user agent
- `viewport` (optional): Viewport dimensions

#### `website.theme.storage.failure`

Emitted when theme storage fails (e.g., private browsing).

**Safe Properties:**

- `failureType` (required): Type of failure
- `theme` (optional): Theme that failed to save
- `fallbackUsed` (optional): Whether fallback was used

**Restricted Properties:**

- `storageError` (optional): Storage error message
- `browserInfo` (optional): Browser information

## Configuration

### Environment Variables

- `NODE_ENV`: Environment (development, production, test)
- `CI`: Set to 'true' for CI/production environments
- `TELEMETRY_INCLUDE_RESTRICTED`: Set to 'true' to include restricted properties in production

### Backend Selection

The telemetry client automatically selects backends based on environment:

| Environment | Default Backend | Behavior |
|------------|----------------|----------|
| test | NONE | No output (silent) |
| development | CONSOLE | Logs to console |
| production | FILE | Writes to `.github/reports/telemetry/` |

### Custom Configuration

```javascript
const telemetry = createTelemetryClient({
  environment: 'production',
  backend: 'file',
  outputPath: './custom/telemetry/path',
  eventSchemas: EVENT_SCHEMAS,
  enabled: true
});
```

## Privacy & Security

### Safe vs. Restricted Properties

**Safe Properties:**

- Anonymous, aggregated data
- Safe for all environments
- Always included in telemetry events
- Examples: counts, durations, types, status

**Restricted Properties:**

- May contain repository-specific or detailed information
- Included in development/test by default
- Excluded in production unless `TELEMETRY_INCLUDE_RESTRICTED=true`
- Examples: repository names, file paths, error details

### Data Collection Principles

1. **No PII**: Never collect personally identifiable information
2. **Fail-Safe**: Telemetry errors never break application flow
3. **Opt-Out**: Can be disabled via `enabled: false` configuration
4. **Transparent**: All events documented with clear schemas

## Testing

Run unit tests:

```bash
npm test scripts/telemetry/__tests__/telemetry-client.test.js
```

Test coverage targets 100% for scripts, including the telemetry client.

## Instrumented Code

| File | Events | Description |
|------|--------|-------------|
| `.github/agentic-workflows/release.agent.js` | 3 | Release validation workflow |
| `scripts/workflows/metrics-collection-orchestrator.cjs` | 3 | Metrics collection across repositories |
| `scripts/workflows/metrics-reporting-orchestrator.cjs` | 1 | Metrics report generation |
| `website/src/scripts/theme-toggle.js` | 0 (not yet instrumented) | Website theme toggle (browser) — prior instrumentation targeted a deleted duplicate at `.github/website/`, not the real site |

## Troubleshooting

### Events not appearing

1. Check environment: telemetry disabled in test mode by default
2. Verify `enabled: true` in configuration
3. Check output path permissions for file backend

### File backend not writing

1. Ensure output directory exists and is writable
2. Check disk space
3. Verify no file system errors in logs

### Schema validation errors

1. Check required properties are provided
2. Verify event type exists in EVENT_SCHEMAS
3. Review property names match schema exactly

## Maintenance

### Adding New Events

1. Add schema to `event-schemas.js`
2. Update this README with event documentation
3. Add unit tests for the new event
4. Instrument code to emit the event

### Modifying Events

1. Update schema in `event-schemas.js`
2. Update documentation
3. Update existing instrumentation
4. Run tests to verify compatibility

## Future Enhancements

- Analytics service backend integration (Google Analytics, Mixpanel, Segment)
- Real-time telemetry dashboard
- Anomaly detection and alerting
- Event aggregation and reporting
- Browser-compatible telemetry client module

## License

GPL-3.0

## Related Documentation

- [Release Process](../../docs/RELEASE_PROCESS.md)
- [Metrics Documentation](../../docs/METRICS.md)
- [Issue #2530](https://github.com/lightspeedwp/.github/issues/2530)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)
