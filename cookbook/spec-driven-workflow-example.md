---
file_type: documentation
title: Spec-Driven Workflow Example
description: Example of moving from requirements to design, tasks, and validation in a WordPress governance feature.
version: v0.1.1
last_updated: '2026-08-21'
owners:
  - LightSpeedWP Team
---

# Spec-Driven Workflow Example

## Overview

This example demonstrates the complete spec-driven workflow for implementing a feature: from specification to testing and deployment.

## Scenario: Add Comment Count to Post Cards

### The Feature Request

"Users want to see how many comments a post has without opening it. We should display the comment count prominently on post cards in the archive page."

### Step 1: Write the Specification

**Feature**: Post Comment Count Display
**User Story**: As a reader, I want to see the number of comments on a post directly on the post card so I can identify popular discussions without clicking through.

**Acceptance Criteria**:

- Comment count is displayed on every post card
- If a post has 0 comments, show "No comments"
- If a post has 1 comment, show "1 comment" (singular)
- If a post has 2+ comments, show "N comments" (plural)
- The comment count is displayed in the bottom-right corner of each card
- The display is accessible (proper contrast, readable font size)
- Mobile and desktop responsive

**Technical Specification**:

- Query comment count from WordPress using `wp_count_comments()`
- Add count to post card template
- Implement as a reusable component

### Step 2: Create Tests Before Implementation

```javascript
// tests/components/PostCard.test.js
describe('PostCard', () => {
  it('displays comment count for posts with comments', () => {
    const post = { id: 1, comments: 5 };
    const { getByText } = render(<PostCard post={post} />);
    expect(getByText('5 comments')).toBeInTheDocument();
  });

  it('displays singular form for single comment', () => {
    const post = { id: 1, comments: 1 };
    const { getByText } = render(<PostCard post={post} />);
    expect(getByText('1 comment')).toBeInTheDocument();
  });

  it('displays no comments text when comment count is zero', () => {
    const post = { id: 1, comments: 0 };
    const { getByText } = render(<PostCard post={post} />);
    expect(getByText('No comments')).toBeInTheDocument();
  });
});
```

### Step 3: Implement the Feature

**Phase 1: Backend**

- Add WordPress function to retrieve comment counts
- Create API endpoint if needed
- Cache results for performance

**Phase 2: Frontend**

- Update post card template to include comment count
- Add styling and responsive design
- Implement accessible markup

**Phase 3: Testing**

- Run unit tests
- Test on mobile and desktop
- Test with screen readers
- Verify performance impact

### Step 4: Code Review

- Verify implementation matches specification
- Check test coverage
- Review code for standards compliance
- Performance profiling
- Accessibility audit

### Step 5: Deployment

- Merge to main branch
- Deploy to staging
- Verify on staging environment
- Deploy to production
- Monitor for issues

## Key Principles

1. **Specification First**: Never code without a clear spec
2. **Test-Driven**: Write tests before implementation
3. **Acceptance Criteria**: Implementation succeeds only if all criteria are met
4. **Iterative Review**: Get feedback early and often
5. **Documentation**: Keep specs and tests in sync with implementation

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
