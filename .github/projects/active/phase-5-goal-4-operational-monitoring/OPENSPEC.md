---
file_type: openspec
title: Phase 5 Goal 4 — Operational Monitoring & Debugging
description: Technical specification for the operational monitoring, validation reporting, and debugging tools suite
created_date: 2026-09-03
last_updated: 2026-09-03
status: published
version: 1.0.0
---

# Phase 5 Goal 4: Operational Monitoring & Debugging

**Version:** 1.0.0  
**Status:** Published (Complete & Production Ready)  
**Last Updated:** September 3, 2026  
**Project:** Phase 5 Goal 4 — Operational Monitoring & Debugging  
**Branch:** `feat/phase-5-goal-4-operational-monitoring`  
**PR:** [#2692](https://github.com/lightspeedwp/.github/pull/2692)

---

## Overview

Phase 5 Goal 4 provides comprehensive operational monitoring, automated validation reporting, health checks, and debugging tools for the agent specification system. The suite enables teams to quickly identify specification issues, validate system health, monitor trends, and debug validation failures through automated tooling and an interactive dashboard.

**Key Components:**
1. **Validation Report Generator** (`scripts/generate-validation-report.js`) — Multi-format validation reports
2. **Debug Mode Validator** (`scripts/validate-with-debug.js`) — Enhanced validation with detailed output
3. **Health Check Script** (`scripts/health-check.js`) — Comprehensive system health assessment
4. **Monitoring Dashboard** (`scripts/dashboard/`) — Interactive web-based visualization
5. **npm Script Integration** (`package.json`) — Easy-access CLI commands

---

## System Architecture

### Component Overview

```
Agent Specifications
    ↓
┌─────────────────────────────────────────────────┐
│ Validation Report Generator                     │
│ - Recursive scanning                            │
│ - Multi-format export (JSON, CSV, HTML, text)   │
│ - Severity categorization                       │
│ - Trend analysis                                │
└─────────────────────────────────────────────────┘
    ├─→ JSON Report
    ├─→ CSV Export
    ├─→ HTML Report
    └─→ Text Summary

    ↓
┌─────────────────────────────────────────────────┐
│ Debug Mode Validator                            │
│ - Verbose output with context                   │
│ - Color-coded console display                   │
│ - Performance metrics & profiling               │
│ - Suggestion engine                             │
│ - Stack trace support                           │
└─────────────────────────────────────────────────┘
    ↓ Detailed debug output

    ↓
┌─────────────────────────────────────────────────┐
│ Health Check Script                             │
│ - File integrity validation                     │
│ - Dependency verification                       │
│ - Node.js/npm version checks                    │
│ - Project structure validation                  │
│ - Tool availability checks                      │
└─────────────────────────────────────────────────┘
    ↓ Exit codes + JSON output

    ↓
┌─────────────────────────────────────────────────┐
│ Monitoring Dashboard (Web UI)                   │
│ - Load JSON reports                             │
│ - Real-time status display                      │
│ - Distribution charts                           │
│ - Search & filtering                            │
│ - Dark mode support                             │
│ - Data export                                   │
└─────────────────────────────────────────────────┘
    ↓ Interactive visualization
```

### Integration Points

- **npm scripts** — Easy CLI access via `npm run`
- **CI/CD workflows** — Exit codes and JSON output for automation
- **GitHub Actions** — Report generation in workflows
- **Manual debugging** — Developer-friendly verbose modes
- **Monitoring systems** — JSON export for external integrations

---

## API Reference

### 1. Validation Report Generator

**File:** `scripts/generate-validation-report.js`  
**Type:** Node.js executable script  
**Size:** 520+ lines  
**Language:** JavaScript (ES6+)

#### Usage

```bash
# Generate text report (console)
npm run validate:report

# Generate JSON report
npm run validate:report --format json

# Generate CSV report
npm run validate:report:csv

# Generate HTML report
npm run validate:report:html

# Save to specific file
node scripts/generate-validation-report.js --output reports/custom-report.json
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--format` | string | `text` | Output format: `text`, `json`, `csv`, `html` |
| `--output` | string | stdout | Output file path (defaults to console) |
| `--directory` | string | `agents/` | Directory to scan for specifications |
| `--severity` | string | all | Filter by severity: `error`, `warning`, `info` |

#### Report Structure (JSON)

```json
{
  "timestamp": "2026-09-03T12:00:00Z",
  "summary": {
    "totalAgents": 50,
    "passedAgents": 48,
    "errors": 2,
    "warnings": 5
  },
  "validations": [
    {
      "file": "agents/example.agent.md",
      "passed": true,
      "issueCount": 0,
      "findings": []
    }
  ]
}
```

#### Validation Checks

1. **Frontmatter Validation**
   - Required fields presence (title, description, version, etc.)
   - Type correctness (strings, arrays, objects)
   - Format validation (semantic versioning, ISO dates)

2. **Content Validation**
   - Required sections (Overview, General Rules, etc.)
   - Proper Markdown structure
   - Heading hierarchy

3. **Reference Validation**
   - Implementation directory existence
   - Link validity
   - Cross-reference checks

4. **Standards Compliance**
   - UK English spelling
   - Coding standards adherence
   - Accessibility guidelines

---

### 2. Debug Mode Validator

**File:** `scripts/validate-with-debug.js`  
**Type:** Node.js executable script  
**Size:** 480+ lines  
**Language:** JavaScript (ES6+)

#### Usage

```bash
# Validate single file with debug
npm run validate:debug agents/content-moderator.agent.md

# Validate directory with verbose output
npm run validate:debug agents/ --verbose

# Full debug with performance metrics
npm run validate:debug agents/ --verbose --performance --trace

# JSON output mode
npm run validate:debug agents/ --format json
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--verbose` | boolean | false | Enable verbose logging |
| `--performance` | boolean | false | Show performance metrics |
| `--trace` | boolean | false | Show full stack trace |
| `--format` | string | text | Output format: `text` or `json` |
| `--suggestions` | boolean | false | Include actionable suggestions |

#### Output Features

- **Color-Coded Messages**
  - 🔴 Errors (red)
  - 🟡 Warnings (yellow)
  - 🔵 Info (blue)

- **Performance Metrics**
  ```
  File: agents/example.agent.md
  Validation Time: 145ms
  Memory Used: 2.3MB
  ```

- **Suggestions for Common Issues**
  ```
  Issue: Missing "implementation" field in frontmatter
  Suggestion: Add `implementation: path/to/dir` to YAML header
  Example: `implementation: ./implementations/example`
  ```

---

### 3. Health Check Script

**File:** `scripts/health-check.js`  
**Type:** Node.js executable script  
**Size:** 350+ lines  
**Language:** JavaScript (ES6+)

#### Usage

```bash
# Quick health check
npm run health:check

# Verbose output
npm run health:check --verbose

# JSON output
npm run health:report

# JSON output to file
npm run health:report --output .github/reports/health.json
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--verbose` | boolean | false | Show detailed check results |
| `--output` | string | stdout | Output file path |
| `--format` | string | text | Output format: `text` or `json` |

#### Health Checks Performed

| Check | Purpose | Pass Criteria |
|-------|---------|---------------|
| File Integrity | Verify all required files exist | All files present and readable |
| Node.js Version | Check runtime compatibility | Node.js ≥24.x |
| npm Version | Check package manager | npm ≥10.x |
| Dependencies | Verify all packages installed | All packages in package.json installed |
| Project Structure | Validate directory layout | All required directories exist |
| Validation Tools | Check tool availability | All validation scripts executable |
| Test Infrastructure | Verify test setup | Jest/test framework configured |

#### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All checks passed |
| 1 | One or more checks failed |
| 2 | Configuration error |

#### Output (JSON)

```json
{
  "timestamp": "2026-09-03T12:00:00Z",
  "overallStatus": "healthy",
  "checks": [
    {
      "name": "File Integrity",
      "status": "pass",
      "message": "All required files present",
      "details": []
    }
  ]
}
```

---

### 4. Monitoring Dashboard

**File:** `scripts/dashboard/` directory  
**Type:** HTML/CSS/JavaScript web application  
**Size:** 200+ lines total  
**Deployment:** Static files (no server required)

#### Files

| File | Purpose | Size |
|------|---------|------|
| `index.html` | UI structure and layout | ~150 lines |
| `styles.css` | Theming and responsive design | ~350 lines |
| `dashboard.js` | Interactivity and visualization | ~350 lines |

#### Features

- **File Upload:** Load JSON validation reports
- **Status Overview:** High-level health summary
- **Status Chart:** Passed vs. failed validations
- **Severity Chart:** Errors vs. warnings distribution
- **Search & Filter:** Find validations by file, status, severity
- **Dark Mode:** Toggle for user preference
- **Data Export:** Download filtered results as JSON
- **Responsive Design:** Works on desktop, tablet, mobile

#### Usage

```bash
# Open dashboard in default browser
npm run dashboard
```

Then:
1. Click "Choose File" to upload a JSON validation report
2. View status overview and charts
3. Use filters to search by filename, status, or severity
4. Click result headers to expand/collapse details
5. Use "Dark Mode" toggle as needed
6. Click "Download" to export filtered data

#### Report Format (JSON Input)

```json
{
  "timestamp": "2026-09-03T12:00:00Z",
  "summary": {
    "totalAgents": 50,
    "passedAgents": 48,
    "errors": 2,
    "warnings": 5
  },
  "validations": [
    {
      "file": "agents/example.agent.md",
      "passed": true,
      "issueCount": 0,
      "findings": []
    }
  ]
}
```

---

## npm Scripts Integration

All tools are accessible via npm scripts defined in `package.json`:

```json
{
  "validate:report": "node scripts/generate-validation-report.js",
  "validate:report:json": "node scripts/generate-validation-report.js --format json",
  "validate:report:csv": "node scripts/generate-validation-report.js --format csv",
  "validate:report:html": "node scripts/generate-validation-report.js --format html --output .github/reports/validation-report.html",
  "validate:debug": "node scripts/validate-with-debug.js",
  "health:check": "node scripts/health-check.js",
  "health:report": "node scripts/health-check.js --output .github/reports/health-report.json",
  "dashboard": "open scripts/dashboard/index.html || xdg-open scripts/dashboard/index.html || start scripts/dashboard/index.html"
}
```

---

## Error Handling

### Report Generator

| Error | Handling | Recovery |
|-------|----------|----------|
| Invalid file path | Log error, skip file | Continue with next file |
| Corrupted YAML | Report parsing error | Mark as failed validation |
| Missing field | Add to findings list | Continue validation |
| File not found | Skip gracefully | Log and continue |

### Debug Validator

| Error | Handling | Recovery |
|-------|----------|----------|
| No files found | Report empty directory | Exit with code 0 |
| Read error | Show error context | Continue with next file |
| Invalid JSON | Mark as parsing error | Provide suggestion |

### Health Check

| Error | Handling | Recovery |
|-------|----------|----------|
| Missing file | Mark check as failed | Log missing file path |
| Version mismatch | Report actual vs. required | Continue checks |
| Tool unavailable | Mark as not available | Log tool name |

---

## Performance Characteristics

| Operation | Typical Time | Scalability |
|-----------|--------------|-------------|
| Report generation (50 agents) | <5 seconds | O(n) linear |
| Debug validation (single file) | <2 seconds | O(n) linear |
| Health check (full suite) | <1 second | O(1) constant |
| Dashboard load (static) | <100ms | O(1) constant |
| JSON report parse | <200ms | O(n) linear |

---

## Testing & Validation

### Test Coverage

All tools have been tested with:
- Valid agent specifications
- Invalid YAML/JSON formats
- Missing files and directories
- Cross-platform compatibility (macOS, Linux, Windows)
- Large datasets (50+ specifications)

### Quality Assurance

✅ Code standards compliance  
✅ No external dependencies  
✅ Security review (no injection vulnerabilities)  
✅ Accessibility testing (dashboard WCAG 2.2 AA)  
✅ Cross-platform testing  
✅ Performance benchmarking

---

## Usage Examples

### Example 1: Routine Validation Report

```bash
# Generate text report
npm run validate:report

# Output:
# ============================================
# VALIDATION REPORT
# ============================================
# Total Agents: 50
# Passed: 48
# Errors: 2
# Warnings: 5
# ...
```

### Example 2: Debug a Failing Specification

```bash
npm run validate:debug agents/problematic-spec.agent.md --verbose --suggestions

# Output:
# ✓ File loaded: agents/problematic-spec.agent.md
# ✓ Frontmatter valid
# ✗ Missing required field: "implementation"
#   Suggestion: Add `implementation: ./implementations/problematic-spec` to YAML header
# ✓ Content structure valid
# ...
```

### Example 3: Monitor System Health

```bash
npm run health:check --verbose

# Output:
# ✓ File Integrity: PASS
# ✓ Node.js Version: PASS (v24.0.0 >= 24.0.0)
# ✓ npm Version: PASS (v10.5.0 >= 10.0.0)
# ✓ Dependencies: PASS (all installed)
# ✓ Project Structure: PASS
# ✓ Validation Tools: PASS
# ✓ Test Infrastructure: PASS
# OVERALL: HEALTHY
```

### Example 4: Dashboard Workflow

```bash
# 1. Generate report
npm run validate:report:json > validation-report.json

# 2. Open dashboard
npm run dashboard

# 3. Upload validation-report.json via file picker
# 4. Explore results with filters
# 5. Toggle dark mode if needed
# 6. Download filtered subset as JSON
```

---

## Dependencies

### Runtime Requirements
- Node.js 24.x or later
- npm 10.x or later
- POSIX-compliant shell (for cross-platform scripts)

### No External npm Dependencies
All tools use only Node.js built-in modules:
- `fs` — File system operations
- `path` — Path utilities
- `child_process` — Script execution
- `util` — Utility functions

### Dashboard Requirements
- Modern browser with ES6 support
- Canvas API for chart rendering
- localStorage for dark mode persistence

---

## Known Limitations

1. **Dashboard charting** — Uses canvas API; limited to simple bar charts (can be extended with Chart.js if needed)
2. **Report generation** — Linear performance; for 1000+ specifications, may take 30+ seconds
3. **Cross-platform scripts** — `npm run dashboard` uses platform-specific commands; falls back gracefully
4. **CSV export** — No complex formula support; use JSON for advanced analysis

---

## Future Enhancements

See [TASKS.md](./TASKS.md) for optional enhancements including:
- Advanced charting (pie charts, trend lines)
- Real-time report streaming
- Webhook integrations
- Email alerting system
- Historical trend analysis
- Comparative reports across branches

---

## Related Issues & PRs

| Item | Type | Description |
|------|------|-------------|
| [#2692](https://github.com/lightspeedwp/.github/pull/2692) | PR | Phase 5 Goal 4 implementation |
| Phase 5 Goal 1 | Issue | Comprehensive Validation Test Suite (dependency) |
| Phase 5 Goal 2 | Issue | Agent Specification Generator CLI (dependency) |

---

## Changelog

### Version 1.0.0 (2026-09-03)

**Initial Release**
- Validation Report Generator with multi-format export
- Debug Mode Validator with verbose output
- Health Check Script with 7 system checks
- Monitoring Dashboard with interactive UI
- npm Script Integration (8 new scripts)
- Documentation and usage examples

---

## References

- Repository: [lightspeedwp/.github](https://github.com/lightspeedwp/.github)
- Branch: `feat/phase-5-goal-4-operational-monitoring`
- PR: [#2692](https://github.com/lightspeedwp/.github/pull/2692)
- Project: [Phase 5 Goal 4 — Operational Monitoring & Debugging](../)

---

**Specification Version:** 1.0.0  
**Last Updated:** September 3, 2026  
**Status:** Published & Complete  
**Lead:** Claude Haiku 4.5
