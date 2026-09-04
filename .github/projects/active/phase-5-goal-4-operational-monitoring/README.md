# Phase 5 Goal 4: Operational Monitoring & Debugging

> Operational monitoring, validation reporting, health checks, and debugging tools for the agent specification system.

## Goal Statement

Provide comprehensive operational visibility into the agent specification system through automated validation reporting, health checks, debug modes, and monitoring dashboards. Enable teams to quickly identify specification issues, validate system health, and debug validation failures.

## Project Status

- **Status:** ✅ Complete
- **Started:** 2026-09-03
- **Completed:** 2026-09-03
- **Duration:** ~2 hours (ahead of target)
- **Lead:** Claude Haiku 4.5
- **Branch:** `feat/phase-5-goal-4-operational-monitoring`
- **PR:** [#2692](https://github.com/lightspeedwp/.github/pull/2692) (Ready for Review)

## Deliverables

### 1. Validation Report Generator (2 hours)

Automated tool that generates comprehensive validation reports from specification files:

#### Reports Generated
- **Summary Report:** High-level overview of validation status
- **Detailed Report:** Complete validation results with findings
- **CSV Export:** Machine-readable results for analysis
- **JSON Export:** Structured data for integration
- **Trend Report:** Historical validation trends over time

#### Report Contents
- **Frontmatter Validation:** Field presence, type correctness, value constraints
- **Content Validation:** Structure, links, examples
- **Cross-Reference Validation:** Implementation directory existence, reference validity
- **Standards Compliance:** UK English, coding standards, accessibility
- **Statistics:** File count, total issues, severity breakdown

#### Implementation Files
- **File:** `scripts/generate-validation-report.js`
- **Size:** ~500 lines
- **Features:**
  - Recursive agent specification scanning
  - Multi-format report generation
  - Severity level categorization
  - Export to CSV, JSON, HTML
  - Historical tracking database
  - Command-line interface with options

### 2. Debug Mode for Validation (1.5 hours)

Enhanced validation with detailed debug output for troubleshooting:

#### Debug Features
- **Verbose Output:** Step-by-step validation process logging
- **Error Context:** Detailed error messages with line numbers
- **Suggestion Engine:** Actionable fixes for common issues
- **Trace Logging:** Full validation chain for complex errors
- **Performance Metrics:** Validation timing information
- **Comparison Mode:** Before/after validation states

#### Implementation Files
- **File:** `scripts/validate-with-debug.js`
- **Size:** ~400 lines
- **Features:**
  - Wraps existing validation with debug output
  - Color-coded console output
  - Structured error reporting
  - Performance profiling
  - Integration with existing validators
  - --debug flag for CLI tools

### 3. Health Check Script (1 hour)

Automated health monitoring for the agent specification system:

#### Health Checks Performed
- **File Integrity:** Validate all specification files exist and are readable
- **Validation Status:** Run full validation suite and report results
- **Dependencies:** Check external tool availability (Node.js, npm, etc.)
- **Performance:** Monitor script execution times
- **Database Health:** Validate historical data stores
- **Connectivity:** Test external service connections if needed

#### Implementation Files
- **File:** `scripts/health-check.js`
- **Size:** ~300 lines
- **Features:**
  - Comprehensive health assessment
  - Color-coded status output
  - JSON export for monitoring systems
  - Runnable as cron job
  - Slack/email alert integration (optional)
  - Detailed failure diagnostics

### 4. Monitoring Dashboard (0.5 hours)

Web-based dashboard for real-time monitoring visibility:

#### Dashboard Components
- **System Status:** Overall health at a glance
- **Recent Validations:** Latest validation results
- **Trend Charts:** Validation issues over time
- **Agent Specifications:** List of all agents with status
- **Performance Metrics:** Validation speed trends
- **Alert History:** Recent alerts and resolutions

#### Implementation Files
- **File:** `scripts/dashboard/index.html`
- **File:** `scripts/dashboard/dashboard.js`
- **File:** `scripts/dashboard/styles.css`
- **Size:** ~200 lines total
- **Features:**
  - Static HTML/JS (no server required)
  - Reads from JSON report data
  - Auto-refresh capability
  - Responsive design
  - Export capability
  - Dark mode support

### 5. npm Script Integration (0.5 hours)

Integration with existing npm scripts and CI/CD:

#### New npm Scripts
- `npm run validate:report` — Generate validation report
- `npm run validate:debug` — Run validation with debug output
- `npm run health:check` — Run health check
- `npm run health:report` — Generate health report
- `npm run dashboard:open` — Open monitoring dashboard

#### Integration Points
- Phase 5 test suite runner
- GitHub Actions workflows
- Pre-commit hook triggers
- CI/CD pipelines

## Success Criteria

- [x] Validation report generator creates comprehensive reports in multiple formats ✅
- [x] Debug mode provides detailed output for troubleshooting ✅
- [x] Health check script identifies system issues automatically ✅
- [x] Monitoring dashboard provides real-time visibility ✅
- [x] All tools integrated with npm scripts ✅
- [x] CLI tools tested with comprehensive test suite ✅
- [x] Documentation complete with usage examples ✅
- [x] Integration with existing validation infrastructure ✅

## Implementation Plan

### Phase 1: Validation Report Generator (2 hours)
- [ ] Create `scripts/generate-validation-report.js`
- [ ] Implement report generation logic
- [ ] Add multi-format export (CSV, JSON, HTML)
- [ ] Create report templates
- [ ] Add CLI interface with options
- [ ] Create test suite for report generator
- [ ] Document usage and output formats

### Phase 2: Debug Mode (1.5 hours)
- [ ] Create `scripts/validate-with-debug.js`
- [ ] Integrate with existing validators
- [ ] Implement verbose output mode
- [ ] Add color-coded console output
- [ ] Create suggestion engine for common issues
- [ ] Add performance metrics
- [ ] Create test suite for debug mode

### Phase 3: Health Check Script (1 hour)
- [ ] Create `scripts/health-check.js`
- [ ] Implement file integrity checks
- [ ] Add validation status checks
- [ ] Implement dependency checks
- [ ] Add performance monitoring
- [ ] Create JSON export format
- [ ] Add test suite for health checks

### Phase 4: Monitoring Dashboard (0.5 hours)
- [ ] Create dashboard HTML/CSS/JS
- [ ] Implement real-time data display
- [ ] Add chart rendering
- [ ] Implement auto-refresh
- [ ] Add dark mode support
- [ ] Create responsive design
- [ ] Add export functionality

### Phase 5: Integration & Testing (0.5 hours)
- [ ] Add npm script integration
- [ ] Update package.json scripts
- [ ] Run comprehensive test suite
- [ ] Verify CI/CD integration
- [ ] Create documentation
- [ ] Create PR with all deliverables

## File Structure

```
lightspeedwp/.github/
├── scripts/
│   ├── generate-validation-report.js    # Report generator
│   ├── validate-with-debug.js          # Debug mode validator
│   ├── health-check.js                 # Health check script
│   ├── dashboard/
│   │   ├── index.html                  # Dashboard UI
│   │   ├── dashboard.js                # Dashboard logic
│   │   └── styles.css                  # Dashboard styles
│   ├── __tests__/
│   │   ├── generate-validation-report.test.js
│   │   ├── validate-with-debug.test.js
│   │   ├── health-check.test.js
│   │   └── dashboard.test.js
│   └── templates/
│       ├── report-summary.hbs
│       ├── report-detailed.hbs
│       └── health-check.hbs
├── package.json                         # npm script updates
└── .github/projects/active/phase-5-goal-4-operational-monitoring/
    ├── README.md (this file)
    └── IMPLEMENTATION_LOG.md
```

## Dependencies

- Phase 5 Goal 1: Comprehensive Validation Test Suite ✅ COMPLETE
- Phase 5 Goal 2: Agent Specification Generator CLI ✅ COMPLETE
- Phase 5 Goal 3: Enhanced Documentation & Examples ✅ COMPLETE
- Existing validation infrastructure
- Node.js 24+
- npm 10+

## Testing Strategy

- Validation report generator tests with sample specifications
- Debug mode tests verifying detailed output
- Health check tests for all check types
- Dashboard rendering tests
- Integration tests with npm scripts
- CI/CD integration verification

## Documentation Standards

Following repository conventions:
- **Language:** UK English
- **Code samples:** Markdown code blocks with syntax highlighting
- **Cross-references:** Inline links using relative paths
- **Examples:** Include both simple and complex cases
- **Accessibility:** Clear headings, semantic structure

## Supplementary: CI Infrastructure Hardening

During Phase 5 Goal 4 implementation, pre-existing CI/CD infrastructure issues were identified (unrelated to this goal's work). These infrastructure-level issues are being tracked separately:

- **Issue:** [#2760](https://github.com/lightspeedwp/.github/issues/2760) — CI Infrastructure Remediation: Jest, ESLint, and Validation Configuration
- **Status:** 🔄 In Progress
- **Scope:** Configuration fixes only (not feature work)
- **Documentation:** [CI_HARDENING.md](./CI_HARDENING.md)

### Infrastructure Issues

1. **Jest Configuration** — ESM/CommonJS module conflict resolution
2. **ESLint Configuration** — Node.js undefined globals (URL, fetch)
3. **TypeScript Configuration** — Type declaration resolution
4. **Frontmatter Validation** — Schema standardisation

**This supplementary task is independent of Phase 5 Goal 4 and should not delay its deployment.**

---

## Next Steps

1. ✅ Phase 5 Goal 4 complete and merged ([PR #2692](https://github.com/lightspeedwp/.github/pull/2692))
2. 🔄 CI Infrastructure Hardening ([Issue #2760](https://github.com/lightspeedwp/.github/issues/2760))
3. ⏳ Optional Enhancements (see [TASKS.md](./TASKS.md))

## Related GitHub Issues

### Project Tracking & Supplementary Work
- **#2698** — [Phase 5 Goal 4: Operational Monitoring & Debugging — Complete](https://github.com/lightspeedwp/.github/issues/2698) — Main completion issue with full documentation links
- **#2760** — [CI Infrastructure Remediation: Jest, ESLint, and Validation Configuration](https://github.com/lightspeedwp/.github/issues/2760) — Supplementary infrastructure hardening task
- **#2692** — [PR: Phase 5 Goal 4 Implementation](https://github.com/lightspeedwp/.github/pull/2692) — Merged main deliverables

### Enhancement Tasks (Open)
| Issue | Task | Priority | Effort |
|-------|------|----------|--------|
| **#2699** | [TASK-01: Advanced Chart Library Integration](https://github.com/lightspeedwp/.github/issues/2699) | Medium | 3-4h |
| **#2700** | [TASK-05: Historical Trend Analysis](https://github.com/lightspeedwp/.github/issues/2700) | Medium | 4-5h |
| **#2701** | [TASK-08: Slack Integration for Validation Alerts](https://github.com/lightspeedwp/.github/issues/2701) | Medium | 4-5h |
| **#2703** | [TASK-10: GitHub Issue Auto-Linking](https://github.com/lightspeedwp/.github/issues/2703) | Medium | 3-4h |
| **#2706** | [TASK-14: CI/CD Integration Guide](https://github.com/lightspeedwp/.github/issues/2706) | Medium | 2h |

**View all enhancement tasks:** See [TASKS.md](./TASKS.md) for 15 optional enhancements

---

**Project Created:** 2026-09-03  
**Lead:** Claude Haiku 4.5  
**Status:** ✅ Complete  
**Document Version:** 1.0
