# UX Requirements Quality Variant

> Domain-specific extension of the base Requirements Quality Checklist (8 dimensions) with UX-focused items

**Domain**: UX (User Experience & Interaction Design)  
**Use When**: Specification emphasizes visual design, interaction patterns, user workflows, or UI component behavior  
**Base Template**: Add these items to the standard 40-45 base items

---

## UX-Specific Items (18 items)

### Completeness: UX Errors and Edge Cases

**CHK-046-UX-Completeness**

**Question**: Are all user error states documented with recovery paths?

**Guidance**: For each user-triggerable error (form validation, network timeout, permission denied), document:

- Visual indicator (error color, icon, animation, toast/modal style)
- User-friendly error message in plain language (avoid technical jargon)
- Recovery action (retry button, correction instruction, escalation path)
- Example states: invalid email format, password too short, file too large, upload failed, session expired

Document error affordances:

- Is error clearly distinguishable from other UI states?
- Can user understand what went wrong without error codes?
- What's the recovery path (self-service vs. contact support)?

**Success Criteria**:

- All error scenarios have visual and textual treatment defined
- Error messages are user-centric, not system-centric
- Recovery paths exist for every error
- Error states are tested with target users

---

### Clarity: Visual Hierarchy and Information Architecture

**CHK-047-UX-Clarity**

**Question**: Is visual hierarchy and content organization clear?

**Guidance**: Specify:

- Primary action vs. secondary action visual distinction
- Content priority order (what users see first, second, third)
- Information grouping (related items grouped, distinct items separated)
- Visual white space allocation (breathing room, not cramped)
- Typography hierarchy (heading levels, emphasis, contrast)
- Color usage (semantic colors: success=green, error=red, warning=yellow, info=blue)

Create simple wireframe or visual spec showing:

- Where does user's eye land first?
- What information is in the primary context vs. secondary?
- Are CTAs obvious and scannable?

Example:
"Page layout: Hero image → headline → 3-column feature grid → CTA section → FAQ. Heading hierarchy: H1 (page title) → H2 (sections) → H3 (subsections). Color scheme: primary action=blue, secondary=gray, error=red, success=green."

**Success Criteria**:

- Visual hierarchy is deliberate and intentional
- Information architecture supports user mental model
- Typography and color guide user attention
- Content is scannable (users can find what they need in <10 seconds)

---

### Clarity: Interaction States and Feedback

**CHK-048-UX-Clarity**

**Question**: Are all interactive element states documented (hover, focus, active, disabled)?

**Guidance**: For buttons, links, form inputs, and interactive elements, document visual states:

- **Resting state**: Default appearance when element is idle
- **Hover state**: Appearance when pointer hovers over element (desktop)
- **Focus state**: Appearance when element receives keyboard focus (accessibility)
- **Active/pressed state**: Appearance while being interacted with (mouse down)
- **Disabled state**: Appearance when element is unavailable
- **Loading state**: Appearance during async operations (spinner, progress bar)

For each element type (primary button, secondary button, text input, checkbox, etc.), define:

- Visual difference between states (color change, shadow, border, opacity)
- Transition timing (instant vs. smooth fade/bounce animation)
- Disabled affordance (is it clear the element is disabled? grayed out? hidden?)

Example:
"Primary button: resting=blue #0066cc, hover=dark blue #004499, active=darker #003366, disabled=gray #cccccc with strikethrough cursor. Transition time: 200ms ease-out."

**Success Criteria**:

- All interactive states are visually distinct
- Disabled state is clearly distinguishable
- Transitions (if any) are smooth and purposeful
- Focus states meet WCAG accessibility standards
- Users understand which states are interactive vs. inactive

---

### Clarity: User Workflows and Task Flows

**CHK-049-UX-Clarity**

**Question**: Are primary user workflows documented with step-by-step flows?

**Guidance**: For each primary user journey, document:

1. **Entry point**: How does user start this flow? (landing page link, navigation menu, search result, etc.)
2. **Steps**: 3-10 sequential steps to complete the task
3. **Decision points**: Where might user need to choose a path? (e.g., new user vs. returning user)
4. **Exit points**: How does user finish or abandon the flow?
5. **Time estimate**: How long should this flow take for target user?

Create task flow diagram or numbered sequence:
"1. User lands on product page → 2. Clicks 'Get Started' → 3. Selects plan (monthly/annual) → 4. Enters payment info → 5. Confirms purchase → 6. Receives confirmation email."

Include edge cases:

- Existing customer returning? (different flow)
- Returning to incomplete purchase? (recovery flow)
- User cancellation? (exit path)

**Success Criteria**:

- All primary user tasks are documented
- Steps are sequential and actionable
- Decision points are explicit
- Task flows are validated with target users
- Time estimates are realistic based on user testing

---

### Measurability: Accessibility Compliance

**CHK-050-UX-Measurability**

**Question**: Are accessibility compliance targets defined (WCAG level)?

**Guidance**: Specify:

- **WCAG Level**: A, AA, or AAA (recommend AA for most products)
- **Keyboard accessibility**: All functionality available via keyboard; Tab order logical
- **Screen reader support**: All meaningful content and interactive elements announced to screen readers
- **Color contrast**: Text contrast ratio ≥4.5:1 (normal) or ≥3:1 (large text) per WCAG AA
- **Motion/animation**: Respects prefers-reduced-motion setting; no auto-playing animations
- **Form accessibility**: Labels associated with inputs; error messages linked to fields
- **Mobile accessibility**: Touch targets ≥48×48 dp; text is legible without zoom

Testing requirements:

- Keyboard navigation tested
- Screen reader tested (NVDA, JAWS, VoiceOver)
- Color contrast verified
- Automated accessibility scanning (axe, Lighthouse)

Example:
"Target: WCAG 2.2 AA compliance. Touch targets min 44×44 pixels. Text contrast ≥4.5:1. All form errors announced to screen readers. Keyboard-only navigation supported."

**Success Criteria**:

- WCAG level explicitly stated
- Accessibility testing plan documented
- Automated and manual testing scheduled
- No critical or major accessibility violations
- Team trained on accessibility principles

---

### Scenario Coverage: Responsive Design Breakpoints

**CHK-051-UX-Scenario-Coverage**

**Question**: Are responsive design breakpoints and layout behaviors documented?

**Guidance**: For each screen size category, specify:

- **Mobile**: Small phone (375px), large phone (640px) — single column, stacked navigation, touch-optimized
- **Tablet**: Portrait (768px), landscape (1024px) — 2-column layout, collapsible nav
- **Desktop**: 1024px–1440px — full multi-column layout
- **Large desktop**: 1440px+ — wide layout, side panels

For each breakpoint, document:

- Layout changes (column reflow, sidebar visibility)
- Navigation changes (mobile hamburger menu vs. desktop nav bar)
- Typography adjustments (font sizes, line heights)
- Touch target sizing (larger on mobile, standard on desktop)
- Image treatment (scaling, resolution, format)

Example:
"Mobile (≤640px): Single-column layout, hamburger menu, images 100% width, touch targets 48px. Tablet (641–1024px): 2-column layout, collapsible nav, images 50% width. Desktop (>1024px): 3-column layout, persistent nav, images optimized."

Include testing:

- Tested on actual devices (not just browser resize)
- Layout stability (no jumping content)
- Touch interactions work at mobile sizes
- Text remains readable at all sizes

**Success Criteria**:

- Breakpoints explicitly defined
- Layout behavior documented for each breakpoint
- Tested on actual devices
- No layout shifts or broken interactions
- Responsive design tested as part of QA

---

### Scenario Coverage: Zero State and Empty States

**CHK-052-UX-Scenario-Coverage**

**Question**: Are empty states and zero-state scenarios documented?

**Guidance**: For features that can be empty (empty shopping cart, no search results, no notifications, no data loaded yet), document:

- **Empty state appearance**: What does the UI look like when empty?
- **Empty state message**: Friendly, helpful text explaining why it's empty
- **Action to populate**: What's the primary action to fill this state? (e.g., "Add items to cart", "Try a different search")
- **Help/guidance**: Provide next steps or links to related content
- **Illustration/visual treatment**: Empty states can be friendly and encourage action (vs. bleak)

Example empty states:

- Shopping cart: "Your cart is empty" + "Continue shopping" button + suggested products
- Search results: "No results for 'xyz'" + "Try different keywords" + popular searches
- Notifications: "All caught up!" + when user will see notifications again
- First time user: Onboarding wizard + guided tour + sample data option

Avoid:

- Blank gray screens
- Confusing or negative messaging
- Empty states that don't guide next action

**Success Criteria**:

- All empty states documented
- Empty state messages are helpful and encouraging
- Clear next action provided
- Visual treatment is polished and brand-consistent
- User testing confirms empty states don't confuse users

---

### Scenario Coverage: Real-Time and Live Data

**CHK-053-UX-Scenario-Coverage**

**Question**: Are real-time updates and live data refresh behaviors documented?

**Guidance**: For features with live data (dashboards, feeds, notifications, multiplayer interactions):

- **Refresh frequency**: How often is data updated? (real-time, every 30s, every 5min, manual refresh)
- **Update notification**: How does user know data has changed? (highlight, banner, count badge, animation)
- **User control**: Can user pause/resume updates? (useful for reading long content)
- **Offline behavior**: What happens if connection lost? (queued updates, error message, retry)
- **Data consistency**: If user is editing while data refreshes, how is conflict handled?

Example:
"Dashboard updates every 5 seconds. New data row appears with yellow highlight. Data locked while user editing; updates queue and apply after save. Offline message appears; updates sync when reconnected."

**Success Criteria**:

- Refresh behavior is predictable
- User is informed of updates
- Offline scenarios handled gracefully
- No data loss or conflicts
- Real-time behavior tested under various network conditions

---

### Edge Cases: Loading States and Skeleton Screens

**CHK-054-UX-Edge-Cases**

**Question**: Are loading states, spinners, and skeleton screens documented?

**Guidance**: For async operations (data loading, file upload, form submission), document:

- **Loading indicator**: Spinner type, size, color, animation speed
- **Skeleton screen**: If using placeholder content, what does it look like?
- **Loading message**: Text describing what's being loaded? (e.g., "Loading products...", "Uploading file...")
- **Expected duration**: How long should user expect to wait? (show estimate for long operations)
- **Timeout behavior**: What happens if loading takes >30 seconds?
- **Progress indication**: For long operations, show progress bar with % complete

Example:
"Form submission shows centered spinner with 'Saving...' text. If >3 seconds, show progress bar. If >30 seconds, show timeout error with retry button."

Skeleton screens:
"While loading product list, show 5 gray placeholder cards (same dimensions as real cards) with pulsing animation to indicate content loading."

**Success Criteria**:

- All async operations have visual loading state
- Loading messaging is clear
- Progress is shown for long operations
- Timeout scenarios handled gracefully
- Users never feel stuck or confused about what's happening

---

### Edge Cases: Truncation and Overflow

**CHK-055-UX-Edge-Cases**

**Question**: How are long text, titles, and content handled when exceeding available space?

**Guidance**: Specify truncation strategy for:

- **Long titles**: Max length before truncation? (e.g., "New Long Product Title..." @ 50 chars)
- **Descriptions**: Multi-line or single-line? Expand/collapse behavior?
- **User-generated content**: How to display unpredictable text length?
- **URLs and technical text**: Monospace font? Truncate with ellipsis or word-break?

Document:

- Truncation indicator (ellipsis "...", "Read more" button, expandable section)
- Line clamp (e.g., 1 line, 3 lines, unlimited with scroll)
- Tooltips on truncated text (hover to see full content)
- Mobile vs. desktop differences (mobile might truncate sooner)

Example:
"Product title: 1-line truncate with ellipsis if >40 chars on desktop, >20 chars on mobile. Hover shows full title in tooltip. Description: 2-line truncate with 'Read more' button to expand."

**Success Criteria**:

- Truncation strategy is consistent
- Full content accessible (not just hidden)
- Truncation indicator is clear
- Works for various content lengths
- Mobile truncation tested

---

### Dependencies: Third-Party UI Libraries and Frameworks

**CHK-056-UX-Dependencies**

**Question**: Are third-party UI libraries and their versions documented?

**Guidance**: If using component libraries (Material Design, Bootstrap, custom design system), document:

- **Library name and version**: e.g., "Material Design 5.14.0"
- **Customizations**: How is it customized beyond defaults? (theme, overrides)
- **Browser support**: Which browsers does library support?
- **Dependencies**: What does library require? (React, Vue, etc.)
- **Licensing**: Is library freely usable? (MIT, Apache, commercial?)
- **Maintenance**: Is library actively maintained?
- **Fallback**: What happens if library can't load? (graceful degradation)

Document component choices:
"Using Material Design components: Button, TextField, Card, Dialog. Custom theme colors (primary=#0066cc, error=#ff0000). Fallback: if Material CSS fails to load, basic HTML styling applied."

**Success Criteria**:

- All UI libraries documented
- Versions pinned (not floating)
- Customizations explicit
- Licensing confirmed compatible
- Support and maintenance plan documented

---

### Ambiguities: Design System Consistency

**CHK-057-UX-Ambiguities**

**Question**: Are design system tokens (colors, typography, spacing) documented and consistent?

**Guidance**: Define and document:

- **Color palette**: Primary, secondary, success, warning, error, neutral colors with hex values
- **Typography**: Font families, sizes (with px/rem equivalents), weights, line heights
- **Spacing**: Unit system (8px grid, 16px base, etc.); margins, padding, gaps
- **Shadows**: Box shadow definitions for elevation levels
- **Borders**: Border radius, stroke widths, colors
- **Icons**: Icon library (Font Awesome, Material Icons, custom), sizing, usage

Example:
"Color: primary=#0066cc, secondary=#6699ff, error=#ff3333. Typography: body=14px/1.5, heading=20px bold. Spacing: base unit 8px (use multiples: 8, 16, 24, 32). Corner radius: small=4px, medium=8px, large=16px."

Consistency check:

- Are colors used consistently (not multiple shades of same color)?
- Do all buttons use same padding/typography?
- Are spacing gaps consistent across components?

**Success Criteria**:

- Design tokens documented
- Design system clearly defined
- Consistency enforced in component library
- Deviations documented with rationale
- Design spec matches implementation

---

### Ambiguities: Interaction Semantics and Intent

**CHK-058-UX-Ambiguities**

**Question**: Are interaction patterns unambiguous (single-click vs. double-click, swipe direction, gesture meaning)?

**Guidance**: For each interaction, be explicit:

- **Single-click**: Submits form, navigates to page, opens dialog, etc.
- **Double-click**: Editing mode, zoom, selection, etc. (or is it disabled?)
- **Long-press**: Mobile context menu? Delete action? (document in mobile context)
- **Swipe left/right**: Pagination? Dismissal? Action menu?
- **Pinch/zoom**: Permitted? Locked to prevent accidental zoom?
- **Keyboard shortcuts**: Are there shortcuts? (Ctrl+S, ?, etc.)
- **Right-click**: Context menu available? Custom or browser default?

Example:
"Single-click on product: navigate to detail page. Single-click on checkbox: toggle selection. Long-press on item (mobile): open context menu (delete, share, etc.). Keyboard: Ctrl+K opens search, ? shows help."

Ambiguity resolution:
"If action is destructive (delete, logout), require confirmation. If action is reversible (like/unlike), single-click OK."

**Success Criteria**:

- Interaction patterns are unambiguous
- Destructive actions require confirmation
- Keyboard shortcuts documented
- Gestures clearly defined (especially mobile)
- User testing confirms intent is clear

---

### Ambiguities: Notification and Toast Messages

**CHK-059-UX-Ambiguities**

**Question**: Are notification types, timing, and dismissal behavior clear?

**Guidance**: Document notification patterns:

- **Toast notification**: Appears for 3-5 seconds, auto-dismisses (non-critical feedback)
  - Example: "Item added to cart", "Copied to clipboard"
- **Inline error message**: Stays visible until issue resolved (form validation)
  - Example: "Email is invalid", "Password too short"
- **Modal dialog**: Blocks interaction, requires user action (critical info, confirmation)
  - Example: "Are you sure you want to delete?"
- **Banner notification**: Persistent, high-priority (system alerts, warnings)
  - Example: "Maintenance scheduled tonight", "Your session is expiring"

For each notification type, specify:

- **Trigger**: What causes this notification?
- **Content**: Specific message wording?
- **Tone**: Friendly, professional, urgent?
- **Duration**: How long visible?
- **Dismissal**: Can user dismiss? Auto-dismiss? Undo action?
- **Placement**: Top, bottom, inline, modal?
- **Visual treatment**: Color, icon, sound?

Example:
"Success toast: 'Task completed' in green toast, bottom-right corner, auto-dismisses after 4s. Error modal: Red header, explanation + recovery actions, requires user response."

**Success Criteria**:

- Notification types are consistent and predictable
- Messages are clear and actionable
- Placement doesn't block important content
- No notification overload or annoyance
- Critical alerts are distinguishable from casual feedback

---

### Ambiguities: Permission and Authentication UI

**CHK-060-UX-Ambiguities**

**Question**: Are permission requests, login states, and authentication flows unambiguous?

**Guidance**: Document:

- **Login state indicators**: How does user know they're logged in? (profile icon, name, logout button)
- **Permission requests**: How are permissions requested? (in-feature prompts, upfront, progressive)
  - Example: "Camera permission needed for video call" + "Allow" / "Deny" buttons
- **Authentication errors**: What if wrong password or credentials? (message clarity, retry limits)
- **Session expiration**: How long is session? What happens if expired? (grace period, auto-logout, re-auth warning)
- **Multi-factor authentication**: Is MFA required/optional? Flow with SMS/email/app?

Example:
"Login: email/password form with 'Remember me' option. Session: 30 min inactivity timeout with 5-min warning banner. MFA: optional, SMS code sent to registered phone. Session expiration: 'Session expired, please log in again' + redirect to login."

Avoid ambiguity:

- Not clear when user is/isn't authenticated
- Unclear what permissions app is requesting
- Confusing error messages that don't explain what went wrong
- Session timeouts that surprise users

**Success Criteria**:

- Login/logout states are clearly visible
- Permissions requests are understandable
- Authentication errors have clear recovery paths
- Session timeout behavior is predictable and documented
- User testing confirms understanding of auth flows

---

## Documentation

All 18 UX-specific items extend the base 40-45 item checklist. When generating a UX variant:

1. Include all base template items (completeness, clarity, consistency, measurability, scenario coverage, edge cases, dependencies, ambiguities)
2. Add these 18 UX-specific items
3. **Total for UX variant**: ~58-63 items (40-45 base + 18 UX-specific)

### Composition Rules

- UX variant items use consistent ID format: `CHK-###-UX-{Dimension}`
- Items are organized by dimension (Completeness, Clarity, Consistency, etc.)
- UX-specific items do not duplicate base template questions
- Overlap is intentional (e.g., "error handling" in base + "error states" in UX) but from different perspectives

### When to Use UX Variant

Use the UX variant checklist when:

- ✅ Specification includes UI/UX design requirements
- ✅ Interaction patterns need to be validated
- ✅ Accessibility is a primary concern
- ✅ Responsive design or mobile experience is in scope
- ✅ Visual design system needs documentation

Do not use UX variant for:

- ❌ Backend-only APIs (use API variant instead)
- ❌ Infrastructure/ops specifications
- ❌ Purely data-driven requirements without UI

---

*Built by 🧱 LightSpeedWP with ☕ and meticulous UX precision*
