---
title: "Troubleshooting & Debugging Slide Deck Prompt"
description: "NotebookLM and design prompt for diagnosing and fixing automation issues"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Troubleshooting & Debugging Slide Deck Prompt

## System Overview

The **Troubleshooting & Debugging System** provides structured approaches to diagnosing and fixing issues in the .github automation ecosystem. It covers agent failures, workflow errors, skill problems, hook issues, and includes tools for debugging, logging analysis, and root cause investigation.

**Operational scope**: Issue diagnosis, error investigation, debugging workflows, log analysis, root cause analysis, failure remediation.

**Owned by**: LightSpeed ops & engineering teams

## Key Debugging Tools & Techniques

1. **Session Logs** - Complete operation logs with timestamps and context
2. **Workflow Logs** - GitHub Actions logs for workflow execution
3. **Agent Logging** - Debug output from agent execution
4. **Error Stack Traces** - Full context for exceptions
5. **Metrics Analysis** - Identifying performance regressions
6. **Local Reproduction** - Running scenarios locally for debugging
7. **Integration Testing** - Testing specific workflow interactions

## Integration Points

- **Session Logger**: Captures complete operation context
- **Observability System**: Provides log search and filtering
- **Meta Agent**: Generates debugging reports
- **Reviewer Agent**: Helps debug code quality issues
- **GitHub Actions**: Workflow logs for CI debugging

## Use Cases & Examples

### Use Case 1: PR Not Getting Labeled

Issue: PR submitted, but labels not applied automatically.

**Debugging flow:**

1. Developer submits PR
2. Expected: Labeling agent applies "feature", "needs-review" labels
3. Actual: No labels applied
4. Steps to debug:
   - Check labeling.agent.js logs: "Labeling agent failed: error parsing PR body"
   - Review PR body: Non-standard format (tabs instead of spaces)
   - Look at issue #1234: Similar issue reported
   - Fix: Add error handling for non-standard formatting
5. Test fix locally: `npm test -- labeling.agent.test.js`
6. Deploy fix: Create PR with fix, merge after review

### Use Case 2: Release Workflow Timeout

Issue: Release workflow takes 45 minutes instead of expected 10.

**Debugging flow:**

1. Monitor metrics: Release workflow duration increased
2. Check workflow logs: Stuck on "Publishing to WordPress.org"
3. Investigation: WordPress.org API responding slowly (server issue)
4. Check metrics: Timeout detection triggered alert
5. Options:
   - Increase timeout (if acceptable)
   - Add retry logic with backoff
   - Switch to faster alternative
6. Implement fix: Add retry logic with exponential backoff
7. Monitor next release: Performance returns to normal

### Use Case 3: Security Scan False Positive

Issue: PR blocked by dependency vulnerability that's actually patched.

**Debugging flow:**

1. Developer submits PR with dependency update
2. Security scan fails: "Critical CVE in lodash@3.0.0"
3. Developer investigation: "But we updated to 4.17.21!"
4. Problem: Lock file has transitive dependency with old version
5. Solution: `npm update` to resolve dependency tree
6. Run security scan locally: `npm audit`
7. Fix verified, PR unblocked

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Automation failures hard to diagnose; root causes unclear; fixes take days
- Stakes: Blocked PRs, frustrated developers, operational overhead

**Slide 02** - Debugging System Overview

- Comprehensive logging of all operations
- Multiple log sources: agents, workflows, hooks
- Structured log format for searchability
- Debugging tools and techniques
- Common failure patterns and solutions

**Slide 03** - Common Failure Categories

- **Agent Failures**: Agent crashes, logic errors, timeout issues
- **Workflow Errors**: GitHub Actions failures, setup issues, resource limits
- **Skill Problems**: Individual skill failures, parameter validation
- **Hook Issues**: Guardrail rejections, validation failures
- **Integration Issues**: Skill-to-skill communication, data format mismatches
- **External Issues**: API failures, dependency problems, third-party service outages

**Slide 04** - Reading Agent Logs

- **Log location**: Session logs in `.github/logs/`
- **Log structure**: JSON format with timestamp, agent, context
- **Key fields**:
  - `timestamp`: When operation occurred
  - `agent`: Which agent executed
  - `action`: What operation performed
  - `status`: success/failure
  - `error`: Error message (if failed)
  - `context`: PR/issue details
- **Example search**: Find all labeling.agent failures on 2026-05-28

**Slide 05** - Reading Workflow Logs

- **Access**: GitHub Actions tab on PR
- **Log structure**: Timestamped output from each step
- **Common issues**:
  - Setup failure (dependency installation)
  - Test failure (showing specific test)
  - Timeout (step took too long)
  - Resource limit (out of disk/memory)
- **Example**: "npm install" fails due to network timeout

**Slide 06** - Stack Traces & Error Messages

- **Stack trace**: Shows call hierarchy leading to error
- **Error message**: What went wrong
- **Error type**: Category of error (TypeError, ReferenceError, etc.)
- **Reproducing**: Use stack trace to locate problem in code
- **Example**:

  ```
  TypeError: Cannot read property 'labels' of undefined
    at Labeler.applyLabels (labeling.agent.js:42:15)
    at LabelingAgent.execute (labeling.agent.js:18:5)
  ```

**Slide 07** - Debugging Locally

- **Reproduction**: Create minimal test case locally
- **Debug mode**: `NODE_DEBUG=* node script.js` for detailed output
- **Breakpoints**: Use Node inspector for step-through debugging
- **Logging**: Add console.log() statements strategically
- **Test fixtures**: Use real PR/issue data as test cases
- **Example**: Debug labeling agent with specific PR data

**Slide 08** - Performance Debugging

- **Metrics**: Track execution time per agent
- **Bottlenecks**: Which operations are slowest?
- **Profiling**: Identify where time is spent
- **Optimization**: Cache, parallelize, or skip expensive operations
- **Monitoring**: Watch metrics for regressions
- **Example**: Release workflow suddenly takes 3x longer

**Slide 09** - Workflow Debugging in GitHub Actions

- **View logs**: Click workflow run → view logs
- **Search logs**: Use browser search (Ctrl+F) for key terms
- **Debug mode**: Set `ACTIONS_STEP_DEBUG=true` secret for verbose output
- **Job matrix**: Test multiple combinations (Node versions, OS)
- **Artifacts**: Download logs and artifacts for offline analysis
- **Common patterns**: Setup, dependency, resource limit failures

**Slide 10** - Debugging Skill Failures

- **Isolation**: Test skill independently from agent
- **Input validation**: Are parameters correct?
- **Output validation**: Is returned value expected format?
- **Dependency checks**: Are required APIs/tools available?
- **Mock testing**: Test with mock data to isolate issues
- **Example**: Release skill failing on artifact upload

**Slide 11** - Debugging Hook Issues

- **Hook logs**: Check hook execution in session logs
- **Rejection reasons**: Why was operation blocked?
- **Guardrail rules**: Are rules too strict?
- **False positives**: Is rule incorrectly triggering?
- **Overrides**: Can hook be temporarily disabled for testing?
- **Example**: Secrets scanner blocking legitimate content

**Slide 12** - Root Cause Analysis

- **Gather information**: Collect logs, metrics, error messages
- **Reproduce**: Can you recreate the issue locally?
- **Hypothesis**: What might be causing this?
- **Test hypothesis**: Validate or refute
- **Timeline**: When did it start? What changed?
- **Impact**: How many operations affected?
- **Example**: PRs stuck in "needs-review" since Tuesday

**Slide 13** - Debugging External Issues

- **API failures**: GitHub API returning errors? Check status page
- **Dependency problems**: npm package unavailable? Check registry
- **Network issues**: DNS failures, timeouts? Check connectivity
- **Service outages**: Third-party service down? Check status
- **Workarounds**: Can we retry, use fallback, or skip operation?
- **Communication**: Notify affected teams of blockers

**Slide 14** - Best Practices for Debugging

- **Reproduce first**: Don't fix what you don't understand
- **Isolate problem**: Test one thing at a time
- **Use logs**: Session logs are your primary tool
- **Read error messages**: They often point directly to problem
- **Check recent changes**: What changed before failure started?
- **Ask for help**: Don't struggle alone, pair with teammate
- **Document solution**: Update troubleshooting guide with solution

**Slide 15** - Close & Next Actions

- Debugging toolkit enables quick resolution of issues
- Contribute: Use techniques to resolve blockers
- Questions & feedback

## Evidence Anchors

- `.github/logs/` - Session log directory
- `.github/hooks/session-logger/` - Logging hook implementation
- `.github/scripts/agents/__tests__/` - Agent test suites for debugging
- `.github/.github/workflows/*.yml` - Workflow logs in Actions tab
- `.github/TROUBLESHOOTING.md` - Common issues and solutions (if exists)

## Design Notes

- **Visual theme**: Problem-solving and diagnosis (magnifying glass, detective work, flowcharts)
- **Color palette**: Use diagnostic colors (reds for errors, yellows for warnings, greens for success)
- **Key visuals**: Debugging flowchart, log example with annotations, stack trace diagram, troubleshooting decision tree
- **Accessibility**: Readable error messages, high contrast for log outputs
- **Animations**: Consider process flow animation, log search reveal

## Quality Bar

- Show real error examples from repository
- Include actual stack traces with annotations
- Validate debugging techniques against actual log structure
- Show real troubleshooting examples
- Include common mistakes and how to avoid
- Ensure all evidence references point to current develop branch
