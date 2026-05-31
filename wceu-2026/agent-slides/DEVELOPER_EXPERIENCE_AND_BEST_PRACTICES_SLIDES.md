---
title: "Developer Experience & Best Practices Slide Deck Prompt"
description: "NotebookLM and design prompt for optimizing developer interactions with automation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# Developer Experience & Best Practices Slide Deck Prompt

## System Overview

The **Developer Experience & Best Practices System** optimizes how developers interact with the .github automation ecosystem. It focuses on reducing friction, providing clear feedback, enabling efficient workflows, and establishing best practices that maximize productivity while maintaining quality.

**Operational scope**: Developer interaction patterns, feedback mechanisms, workflow optimization, best practice guidelines, friction reduction.

**Owned by**: LightSpeed product & engineering teams

## Key Experience Areas

1. **Immediate Feedback** - Quick, clear CI status on PRs
2. **Error Communication** - Helpful error messages that guide fixes
3. **Workflow Efficiency** - Minimize time to successful PR merge
4. **Clear Guidance** - Obvious next steps when issues occur
5. **Reduced Friction** - Few manual steps, good defaults
6. **Community Standards** - Shared practices across teams

## Integration Points

- **Pull Request Checks**: CI status and feedback
- **Error Messages**: Helpful output from agents and linting
- **Issue Templates**: Guide developers to complete information
- **Comment Feedback**: Reviewer suggestions and explanations
- **Documentation**: Clear guides and examples
- **Slack Integration**: Notifications and status updates

## Use Cases & Examples

### Use Case 1: Developer First-Time PR Experience

New developer submitting first PR; experience should be welcoming and clear.

**DX flow:**

1. Developer creates PR
2. Receives immediate feedback:
   - "✅ CI checks running (2 min)"
   - "📋 PR template good"
   - "✅ No code style issues detected"
3. After 3 minutes:
   - All checks pass
   - Comment from linting agent: "Great code style!"
   - Reviewer assigned
4. Reviewer provides constructive feedback:
   - Acknowledges good work
   - Suggests improvement
   - Explains why
5. Developer iterates quickly
6. PR merges with positive experience
7. Developer leaves with: "This was smooth!"

### Use Case 2: Debugging Failed Tests

Developer's PR has failing test; needs to understand why.

**Debugging DX:**

1. Developer commits, pushes
2. CI runs, test fails
3. Clear error output in CI logs:

   ```
   ❌ Test failed in labeling.agent.test.js
   Expected: ["feature", "needs-review"]
   Received: ["feature"]
   
   Root cause: Label condition not met
   Fix: Check test fixture PR data
   Docs: See CONTRIBUTING.md section "Testing"
   ```

4. Developer clicks link, reads docs
5. Understands issue, fixes test
6. Pushes again, all pass
7. Smooth debugging experience

### Use Case 3: Complex Release Process

Developer managing release; wants to understand each step.

**Release DX:**

1. Merge PR, release workflow starts
2. Real-time progress in PR:
   - ✅ Changelog validated
   - ✅ Tests passed
   - ✅ Build artifacts created
   - 🔄 Publishing to npm...
   - 🔄 Publishing to WordPress.org...
   - ⏳ Notifying customers...
3. Slack notification: "Release 2.5.0 live! 🎉"
4. Developer checks release metrics
5. All systems working, customer feedback positive
6. Confident release experience

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: Complex automation creates friction; unclear feedback frustrates developers
- Stakes: Slower development, lower quality PRs, developer frustration

**Slide 02** - Developer Experience Overview

- Immediate, clear feedback on changes
- Helpful error messages that guide fixes
- Efficient workflows with few manual steps
- Transparent automation with clear status
- Supportive community with shared standards

**Slide 03** - Immediate Feedback on Pull Requests

- **Check status**: Immediate visibility (running, passed, failed)
- **Status badges**: Visual indicators (✅, ❌, 🔄)
- **Timeline**: How long each check takes
- **Progress**: Real-time update as checks run
- **Summary**: Quick overview of all results
- **Example**: "All checks passed (3m 42s)"

**Slide 04** - Clear Error Messages

- **Specific**: Which test failed, exact assertion that failed
- **Actionable**: What needs to change to fix
- **Guidance**: Links to relevant documentation
- **Context**: Code context showing the problem
- **Examples**: Similar passing cases for reference
- **No jargon**: Explain technical terms for newcomers

**Slide 05** - Failure Communication

- **Subject**: What failed (linting, tests, security, accessibility)
- **Why**: Why it's a problem
- **Fix**: How to resolve it
- **Docs**: Where to learn more
- **Examples**: Passing/failing comparison
- **Encouragement**: "You're almost there!"

**Slide 06** - PR Review Best Practices

- **Timely reviews**: Response within 24 hours
- **Constructive feedback**: Explain why, not just what
- **Acknowledge good work**: Recognize strengths
- **Suggest improvements**: Guide without dictating
- **Ask questions**: Help developer think through issues
- **Be respectful**: Reviews are about code, not people

**Slide 07** - Workflow Optimization

- **Minimal manual steps**: Defaults for common cases
- **Smart detection**: Automatically detect issue type
- **Template guidance**: Clear instructions in templates
- **Progressive disclosure**: Show advanced options only if needed
- **Undo capability**: Easy to fix mistakes
- **Documentation links**: Quick access to guides

**Slide 08** - Local Development Experience

- **Quick start**: `npm install && npm test` works immediately
- **Watch mode**: Auto-run tests as you edit
- **Clear error output**: Understand problems quickly
- **Debugging support**: Tools for step-through debugging
- **Offline support**: Can work without network access
- **Reset capability**: Easy to start fresh

**Slide 09** - Comment & Code Review Patterns

Good review comment:

```
Great work on the refactoring! One small suggestion:

This loop could be more efficient with Array.map():
  // Instead of this:
  for (let i = 0; i < items.length; i++)
  
  // Consider this:
  items.map(item => processItem(item))

See section X of our guide for more examples.
```

Bad review comment:

```
This is inefficient.
```

**Slide 10** - Feedback Loops & Iteration

- **Rapid iterations**: Don't wait weeks for feedback
- **Incremental improvement**: Small steps toward perfection
- **Learning opportunity**: Each review teaches something
- **Psychological safety**: Mistakes are learning opportunities
- **Progress visibility**: See your improvement over time

**Slide 11** - Agent Assistance & Automation

- **Linting agent**: Catches style issues automatically
- **Testing agent**: Validates coverage and test quality
- **Security agent**: Flags potential security issues
- **Accessibility agent**: Checks for WCAG compliance
- **Meta agent**: Provides suggestions for improvement
- **Reviewer agent**: Provides initial code review

**Slide 12** - Documentation Access

- **README**: Quick start, overview
- **CONTRIBUTING.md**: Contribution standards
- **DEVELOPMENT.md**: Setup and architecture
- **TROUBLESHOOTING.md**: Common issues and fixes
- **API reference**: Generated from code comments
- **In-context links**: Help when you need it most

**Slide 13** - Notifications & Updates

- **PR status**: When checks pass/fail
- **Review ready**: When code review requested
- **Feedback**: When comments need response
- **Merge ready**: When PR is ready to merge
- **Release updates**: When releases go live
- **Smart alerts**: Customize what you're notified about

**Slide 14** - Best Practices Summary

- **Code quality**: Automated checks + thoughtful reviews
- **Testing**: Write tests alongside code (TDD)
- **Documentation**: Update docs with code changes
- **Iteration**: Review feedback as learning opportunity
- **Communication**: Clear commit messages and PR descriptions
- **Collaboration**: Help others, ask for help

**Slide 15** - Close & Next Actions

- Developer experience drives productivity and satisfaction
- Contribute: Follow best practices, respect review process
- Questions & feedback

## Evidence Anchors

- `.github/CONTRIBUTING.md` - Code standards and expectations
- `.github/.github/PULL_REQUEST_TEMPLATE.md` - PR template guiding developers
- `.github/.github/ISSUE_TEMPLATE/` - Issue templates providing structure
- `.github/scripts/agents/reviewer.agent.js` - Code review assistance
- `.github/scripts/agents/linting.agent.js` - Style feedback
- Documentation files - Access to help

## Design Notes

- **Visual theme**: Developer-friendly (smooth, helpful, encouraging)
- **Color palette**: Use approachable colors (blues, greens, friendly accents)
- **Key visuals**: PR feedback mockup, error message examples, workflow diagram, before/after DX comparison
- **Accessibility**: Readable error messages, high contrast for code examples
- **Tone**: Encouraging, supportive, helpful (not condescending)

## Quality Bar

- Show real examples of good/bad feedback
- Include actual error messages from CI
- Validate best practices against team experience
- Show measurable DX improvements
- Include developer testimonials on experience
- Demonstrate feedback patterns that work well
- Ensure all references point to current develop branch
