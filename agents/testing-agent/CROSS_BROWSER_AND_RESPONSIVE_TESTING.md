---
file_type: documentation
title: Playwright Testing Agent — Cross-Browser & Responsive Testing
description: Comprehensive guide to testing across browsers and devices. Covers viewport strategies, responsive breakpoints, touch vs. mouse interactions, and browser-specific quirks for WordPress and WooCommerce sites.
last_updated: '2026-08-18'
domain: generic
tags:
  - playwright
  - testing
  - responsive
  - cross-browser
  - wordpress
  - woocommerce
---

# Cross-Browser & Responsive Testing

This guide covers strategies for efficiently testing across multiple browsers,
devices, and viewport sizes without creating brittle, slow test suites.

## 1. Viewport Strategy

### 1.1 Critical Breakpoints

Instead of testing every possible viewport width, focus on **critical breakpoints**
where layout changes significantly:

**Standard breakpoints for WordPress themes:**

```javascript
const viewports = {
  mobile: { width: 375, height: 667 },      // iPhone SE
  tablet: { width: 768, height: 1024 },     // iPad
  desktop: { width: 1280, height: 800 },    // Desktop
  wide: { width: 1920, height: 1080 },      // Large desktop (optional)
};
```

**Why not test all widths?**

- Responsive design breaks at specific points (CSS media queries)
- Testing 320–1920 pixel widths is redundant if layout is identical
- Test the breakpoints, not every pixel

**In test pack:**

```javascript
// Test once at each breakpoint, not every 50px
test.describe('responsive layout', () => {
  Object.entries(viewports).forEach(([name, viewport]) => {
    test(`layout correct at ${name}`, async ({ browser }) => {
      const page = await browser.newPage({ viewport });
      // Test layout, navigation, form interaction at this viewport
    });
  });
});
```

### 1.2 Mobile-First Testing

WordPress/WooCommerce sites often fail on mobile due to:

- **Horizontal scrolling** — container wider than viewport
- **Touch targets too small** — buttons < 44px × 44px
- **Text overflow** — long product names, prices don't wrap
- **Modal overflow** — lightboxes don't fit viewport
- **Sticky header conflicts** — nav fixed, content hidden beneath

**Mobile test pattern:**

```javascript
test('no horizontal scroll on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
  const windowWidth = await page.evaluate(() => window.innerWidth);
  expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
});
```

## 2. Touch vs. Mouse Interaction

### 2.1 Touch-Only Interactions

Mobile browsers do not support hover; test tap-based workflows:

- **Hover to reveal** — menu items, cart preview, tooltips hidden on hover
- **Long-press interactions** — swipe for image carousel, context menus
- **Double-tap zoom** — confirmation that images don't zoom when tapped once
- **Pinch-zoom** — zoom level changes; ensure text stays readable

**Test pattern:**

```javascript
test('menu opens on tap, not hover (mobile)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // Tap, not hover
  await page.locator('.nav-toggle').tap();
  await expect(page.locator('.nav-menu')).toBeVisible();
  
  // Tap again to close
  await page.locator('.nav-toggle').tap();
  await expect(page.locator('.nav-menu')).not.toBeVisible();
});
```

### 2.2 Hover States (Desktop Only)

Desktop tests can verify hover effects; mobile tests should skip:

```javascript
test('price highlight on hover (desktop only)', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'hover not applicable on mobile');
  
  await page.hover('.product-item');
  await expect(page.locator('.product-item')).toHaveClass(/highlighted/);
});
```

## 3. Browser-Specific Behavior

### 3.1 Chromium (Chrome, Edge, Brave)

**Strengths:**

- Fastest for CI
- Most consistent rendering
- Full DevTools Protocol support

**Quirks to test:**

- Service Workers cache aggressively; clear caches between tests
- Autoplay restricted; `muted` required for videos
- Web Payments API requires user activation

### 3.2 Firefox

**Differences from Chromium:**

- Scroll bar width affects layout (adds ~15px on Windows)
- CSS Grid renders differently in some edge cases
- WebGL performance varies
- Different console message formatting

**Test pattern:**

```javascript
test('layout accounts for Firefox scrollbar', async ({ browserName, page }) => {
  if (browserName === 'firefox') {
    // Firefox always shows scrollbar, Chromium only if needed
    // Account for 15px difference
    const layoutWidth = await page.evaluate(() => {
      return document.querySelector('.main-content').offsetWidth;
    });
    expect(layoutWidth).toBeLessThanOrEqual(1265); // 1280 - 15px scrollbar
  }
});
```

### 3.3 Safari (WebKit)

**Safari-specific issues:**

- CSS Grid percentage heights may not work as expected
- Flexbox alignment differs in some cases
- Video autoplay disabled by default (requires muted + user gesture)
- IndexedDB quota lower than other browsers
- `position: sticky` has rendering bugs in some versions
- `input type="date"` shows native picker (different UX)

**Test pattern:**

```javascript
test('form date picker works on Safari', async ({ browserName, page }) => {
  if (browserName === 'webkit') {
    // Safari shows native date picker; test native interaction
    await page.locator('input[type="date"]').click();
    // Native picker opens — verify date can be selected
  } else {
    // Test custom date picker on other browsers
    await page.locator('.date-picker-button').click();
    await page.locator('[aria-label="15"]').click();
  }
});
```

## 4. Responsive Typography

### 4.1 Font Scaling

- **Zoom level** — user zooms to 120% or 150%; test with `--force-device-scale-factor`
- **Text size override** — browser font size setting; test at 16px base, 18px, 20px
- **RTL text** — Arabic, Hebrew; test right-to-left layout

**Test pattern:**

```javascript
test('text readable at 150% zoom', async ({ page }) => {
  // Simulate user zoom
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '18px'; // ~112.5% at 16px base
  });
  
  // Verify no overflow, text wraps properly
  const overflowX = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(overflowX).toBe(false);
});
```

### 4.2 Heading Hierarchy

- **Font size progression** — H1 > H2 > H3; proportional reduction
- **Line height** — readable line height at each font size (1.5–1.6 for body, tighter for headers)
- **Letter spacing** — uppercase headings need tighter spacing

## 5. WooCommerce Responsive Patterns

### 5.1 Product Grid

- **Column count** — desktop: 4 cols, tablet: 2, mobile: 1
- **Image scaling** — product image fits viewport width
- **Price alignment** — aligned across rows

```javascript
test('product grid responsive at breakpoints', async ({ page }) => {
  const breakpoints = {
    mobile: 375,
    tablet: 768,
    desktop: 1280,
  };
  
  for (const [name, width] of Object.entries(breakpoints)) {
    await page.setViewportSize({ width, height: 800 });
    const products = page.locator('.product-item');
    const count = await products.count();
    const firstTop = await products.nth(0).boundingBox().then(b => b.y);
    const secondTop = await products.nth(1).boundingBox().then(b => b.y);
    
    if (name === 'desktop') {
      expect(firstTop).toBe(secondTop); // Same row (4 columns)
    } else if (name === 'tablet') {
      expect(firstTop).toBe(secondTop); // Same row (2 columns)
    } else {
      expect(firstTop).not.toBe(secondTop); // Different rows (1 column)
    }
  }
});
```

### 5.2 Checkout Form

- **Single column on mobile** — inputs full width
- **Multi-column on desktop** — billing and shipping side-by-side
- **Sticky summary** — order summary stays visible while scrolling form

### 5.3 Shopping Cart

- **Mobile table layout** — becomes list on small screens
- **Quantity buttons** — touch-friendly size (44px minimum)
- **Coupon entry** — input and button stack on mobile

## 6. Cross-Browser Testing Strategy

### 6.1 Parallel Testing

Run tests across browsers in parallel to keep CI time reasonable:

```javascript
// playwright.config.js
export default {
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
};
```

**CI time:**

- Sequential: 4 browsers × 10min per suite = 40min
- Parallel: 10min total (all browsers at once)

### 6.2 Focused Cross-Browser Tests

Not every test needs to run on every browser. Mark cross-browser tests explicitly:

```javascript
test('@cross-browser - product card render', async ({ page }) => {
  // Runs on all browsers
});

test('@chromium-only - DevTools Protocol test', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  // Only Chromium has full DevTools support
});
```

## 7. Common Responsive Test Failures

### 7.1 Flaky Assertion: Element Position

**Problem:** Element position changes based on viewport; assertion hardcoded for one breakpoint.

**Fix:** Use relative positioning assertions:

```javascript
// ❌ Flaky: assumes element at specific pixel
expect(box.y).toBe(100);

// ✅ Better: element appears before scroll
const inViewport = box.y + box.height > 0 && box.y < window.innerHeight;
expect(inViewport).toBe(true);
```

### 7.2 Slow Tests: Testing All Viewports

**Problem:** Test suite includes 100 viewport widths; suite takes 2 hours.

**Fix:** Test critical breakpoints only:

```javascript
// ❌ Slow: tests every 50px
for (let width = 320; width <= 1920; width += 50) {
  test(`layout at ${width}px`, ...);
}

// ✅ Fast: only breakpoints matter
['mobile', 'tablet', 'desktop'].forEach(name => {
  test(`layout correct on ${name}`, ...);
});
```

### 7.3 Inconsistent Touch Behavior

**Problem:** Test works on desktop; fails on mobile because hover state blocks interaction.

**Fix:** Test touch-specific paths on mobile:

```javascript
test('interaction works on mobile', async ({ page, isMobile }) => {
  if (isMobile) {
    await page.tap('.button'); // Not hover, then click
  } else {
    await page.hover('.button');
    await page.click('.button');
  }
});
```

## 8. Checklist: Responsive & Cross-Browser Coverage

- [ ] Mobile viewport (375px) — no horizontal scroll, touch targets ≥44px
- [ ] Tablet viewport (768px) — layout change for medium screens
- [ ] Desktop viewport (1280px) — full multi-column layout
- [ ] Wide desktop (1920px) — if content restricts to max-width
- [ ] Touch interactions tested on mobile (tap, not hover)
- [ ] Hover states tested on desktop only
- [ ] Font scaling (zoom 120%, 150%)
- [ ] Chromium (Chrome/Edge) — primary test target
- [ ] Firefox — test sticky positioning, scrollbar width
- [ ] Safari (WebKit) — test video autoplay, flexbox edge cases
- [ ] Heading hierarchy — sizes, contrast, proportional
- [ ] Product grid — correct column count per breakpoint
- [ ] Checkout — single column mobile, multi-column desktop
- [ ] No hardcoded pixel positions — use relative assertions

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
