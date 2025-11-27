---
description: "Perform comprehensive accessibility audit for WordPress websites, themes, and plugins using WCAG 2.1 AA standards"
mode: "ask"
license: "GPL-3.0-or-later"
---

# Accessibility Audit & Testing

Conduct a thorough accessibility assessment of WordPress websites, themes, or plugins to ensure WCAG 2.1 AA compliance and inclusive user experience for people with disabilities.

## Audit Scope & Methodology

**Assessment Areas:**

- **Perceivable**: Information presentation and user interface visibility
- **Operable**: User interface components and navigation functionality
- **Understandable**: Information clarity and predictable functionality
- **Robust**: Content compatibility with assistive technologies

**Testing Approach:**

- **Automated testing** with tools and scanners
- **Manual testing** with keyboard and assistive technology
- **User testing** with people who use assistive technology
- **Code review** for semantic HTML and ARIA implementation

## Automated Testing Tools

### Primary Scanning Tools

- **axe-core DevTools**: Browser extension for comprehensive scanning
- **WAVE (Web Accessibility Evaluation Tool)**: Visual feedback tool
- **Lighthouse**: Performance and accessibility auditing
- **Pa11y**: Command-line accessibility testing
- **Accessibility Insights**: Microsoft's testing platform

### WordPress-Specific Tools

- **WP Accessibility Plugin**: WordPress accessibility features
- **Accessibility Checker**: WordPress plugin for content auditing
- **Theme Check**: WordPress theme accessibility validation
- **Plugin Check**: WordPress plugin accessibility assessment

## Manual Testing Procedures

### Keyboard Navigation Testing

```
Test Procedure:
1. Use only Tab, Shift+Tab, Enter, Space, Arrow keys
2. Verify all interactive elements are reachable
3. Check logical tab order throughout the page
4. Ensure no keyboard traps exist
5. Verify skip links function correctly
6. Test form navigation and submission
7. Check modal dialog focus management
```

### Screen Reader Testing

```
Testing with NVDA (Windows):
1. Navigate by headings (H key)
2. Navigate by links (K key)
3. Navigate by landmarks (D key)
4. Test forms mode functionality
5. Verify image alt text readings
6. Check table header associations
7. Test live region announcements

Testing with VoiceOver (macOS):
1. Use VO+CMD+H for headings
2. Use VO+CMD+L for links
3. Use VO+CMD+J for form controls
4. Test rotor navigation
5. Verify spoken feedback quality
6. Check gesture navigation on mobile
```

### Visual Testing

```
Color and Contrast:
1. Check contrast ratios (4.5:1 normal, 3:1 large text)
2. Test with color blindness simulators
3. Verify content works without color
4. Test high contrast mode compatibility

Zoom and Magnification:
1. Test 200% zoom functionality
2. Check content reflow and readability
3. Verify no horizontal scrolling at 320px width
4. Test with screen magnification software
```

## Code Review Checklist

### HTML Semantic Structure

```html
<!-- Good: Proper heading hierarchy -->
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
<h2>Another Section</h2>

<!-- Good: Landmark roles -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <main role="main">
      <aside role="complementary">
        <footer role="contentinfo">
          <!-- Good: Form labels -->
          <label for="email">Email Address</label>
          <input type="email" id="email" name="email" required />

          <!-- Good: Image alt text -->
          <img src="chart.png" alt="Sales increased 25% from Q1 to Q2 2023" />
        </footer>
      </aside>
    </main>
  </nav>
</header>
```

### ARIA Implementation

```html
<!-- Good: ARIA labels for context -->
<button aria-label="Close dialog" aria-expanded="false">×</button>

<!-- Good: ARIA descriptions -->
<input type="password" aria-describedby="pwd-help" />
<div id="pwd-help">Must be at least 8 characters</div>

<!-- Good: Live regions -->
<div aria-live="polite" id="status"></div>

<!-- Good: Hidden content -->
<span class="screen-reader-text">Opens in new window</span>
<div aria-hidden="true">Decorative content</div>
```

### Focus Management

```css
/* Good: Visible focus indicators */
:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Good: Custom focus styles */
.button:focus {
  box-shadow: 0 0 0 3px rgba(0, 95, 204, 0.3);
}
```

## WordPress-Specific Audit Points

### Theme Accessibility

- **Skip links** to main content and navigation
- **Keyboard navigation** through menus and widgets
- **Screen reader** compatibility with theme features
- **Color contrast** in default color schemes
- **Focus management** in interactive components
- **Responsive design** accessibility at all breakpoints

### Block Editor Accessibility

- **Block patterns** with semantic HTML structure
- **Custom blocks** with proper ARIA implementation
- **Inspector controls** keyboard and screen reader access
- **Toolbar controls** accessibility and labeling
- **Rich text editing** with assistive technology support

### Plugin Accessibility

- **Form controls** with proper labels and instructions
- **AJAX interactions** with screen reader announcements
- **Modal dialogs** with focus trapping and restoration
- **Data tables** with headers and captions
- **Custom widgets** following accessibility patterns

## Common Issues & Solutions

### Critical Issues

```
Issues Found:
❌ Missing alt text on informational images
❌ Insufficient color contrast (2.1:1, needs 4.5:1)
❌ Keyboard trap in modal dialog
❌ Missing form labels
❌ No skip link to main content

Solutions:
✅ Add descriptive alt attributes
✅ Use darker colors or white text on dark backgrounds
✅ Implement proper focus management with JavaScript
✅ Associate labels with form controls
✅ Add skip link as first focusable element
```

### Medium Priority Issues

```
Issues Found:
⚠️ Heading hierarchy skips from h1 to h3
⚠️ Links with same text go to different destinations
⚠️ No focus indicator on custom buttons
⚠️ Tables missing headers

Solutions:
✅ Use logical heading progression (h1→h2→h3)
✅ Make link text descriptive and unique
✅ Add visible focus styles to interactive elements
✅ Use <th> elements with scope attributes
```

### Enhancement Opportunities

```
Improvements:
💡 Add ARIA landmarks for better navigation
💡 Provide text alternatives for complex images
💡 Add keyboard shortcuts for frequently used actions
💡 Implement high contrast mode support
💡 Add reduced motion preferences respect
```

## Testing Documentation

### Test Results Format

```
Accessibility Audit Report
Date: [Date]
Scope: [URLs/Components tested]
Standards: WCAG 2.1 AA

Summary:
- Critical issues: X
- Medium issues: Y
- Enhancements: Z
- Overall compliance: Pass/Fail

Detailed Findings:
[Issue #1]
- Severity: Critical
- WCAG Criterion: 1.4.3 Contrast (Minimum)
- Description: Button text has 2.1:1 contrast ratio
- Impact: Users with low vision cannot read button labels
- Solution: Change button color to #0073aa for 4.5:1 ratio
- Testing method: Color contrast analyzer
```

### User Testing Protocol

```
Participants:
- Screen reader users (JAWS, NVDA, VoiceOver)
- Keyboard-only users
- Users with low vision
- Users with motor disabilities

Tasks:
1. Navigate to main content
2. Complete contact form
3. Search for specific content
4. Use interactive features (menus, accordions)
5. Access help or support information

Metrics:
- Task completion rate
- Time to complete tasks
- Number of errors encountered
- Subjective satisfaction ratings
- Specific pain points identified
```

## Remediation Guidelines

### Priority Framework

1. **Critical (P1)**: Complete barriers to access (must fix)
2. **High (P2)**: Significant barriers (should fix soon)
3. **Medium (P3)**: Usability issues (should fix eventually)
4. **Low (P4)**: Enhancement opportunities (nice to have)

### Implementation Strategy

- Fix critical and high priority issues first
- Test fixes with the same tools and methods
- Validate solutions with assistive technology users
- Document changes and accessibility features
- Establish ongoing monitoring and testing procedures

Focus on creating an inclusive experience that works for all users, regardless of their abilities or the assistive technologies they use. Accessibility is not a one-time audit but an ongoing commitment to inclusive design.
