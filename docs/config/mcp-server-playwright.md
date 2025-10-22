# Playwright MCP Server Configuration

## 🎭 Automated Browser Testing & E2E Test Generation

## Table of Contents

- [Overview](#overview)
- [Installation & Configuration](#installation--configuration)
- [🚀 Core Capabilities](#-core-capabilities)
- [🎯 Essential Commands](#-essential-commands)
- [Test Generation Workflows](#test-generation-workflows)
- [Browser Automation](#browser-automation)
- [Integration with Development](#integration-with-development)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

The **Playwright MCP Server** (`@modelcontextprotocol/server-playwright`) revolutionizes **browser testing** by enabling AI to **generate, execute, and maintain** end-to-end tests through natural language commands.

> **🎯 Game Changer:** Let AI write your browser tests, capture screenshots, interact with web pages, and debug test failures—all through simple chat commands.

## Installation & Configuration

### Prerequisites

```bash
# Install Playwright and browsers
npm install --save-dev @playwright/test
npx playwright install
```

### MCP Configuration (`.vscode/mcp.json`)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"]
    }
  }
}
```

### Playwright Configuration (`playwright.config.js`)

```javascript
module.exports = {
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } }
  ]
};
```

## 🚀 Core Capabilities

### **🤖 AI-Powered Test Generation**

- ✅ **Generate complete test suites** from natural language descriptions
- ✅ **Create page object models** automatically
- ✅ **Write accessibility tests** with WCAG compliance
- ✅ **Generate regression tests** from bug reports

### **🌐 Browser Automation**

- ✅ **Multi-browser testing** (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile device emulation** with real device configurations
- ✅ **Screenshot and video capture** for debugging
- ✅ **Network monitoring** and request interception

### **🔍 Advanced Interactions**

- ✅ **Form filling and submission** with validation
- ✅ **File upload and download** testing
- ✅ **Drag and drop operations**
- ✅ **Keyboard and mouse event simulation**

### **📊 Test Analysis & Reporting**

- ✅ **Visual regression testing** with pixel-perfect comparison
- ✅ **Performance metrics** collection
- ✅ **Test result analysis** and failure diagnosis
- ✅ **HTML and JSON reporting**

## 🎯 Essential Commands

### **Test Generation (Most Important!)**

```bash
# 🎭 GENERATE COMPLETE TEST SUITES
@playwright generate tests for login flow
@playwright generate tests for WordPress block editor
@playwright generate tests for checkout process with payment
@playwright generate accessibility tests for homepage

# 📝 SPECIFIC TEST SCENARIOS
@playwright generate test "User can create a new blog post"
@playwright generate test "Shopping cart updates correctly when items are added"
@playwright generate test "Contact form validation works properly"
@playwright generate test "Mobile navigation menu functions on small screens"
```

### **🚀 Test Execution & Management**

```bash
# ▶️ RUN TESTS
@playwright run all tests
@playwright run tests --project chromium
@playwright run tests --headed
@playwright run test login.spec.js --debug

# 📊 TEST RESULTS & ANALYSIS
@playwright show last results
@playwright analyze failed tests
@playwright compare screenshots --baseline vs --current
@playwright generate report
```

### **🌐 Browser Automation Commands**

```bash
# 🖱️ PAGE INTERACTIONS
@playwright navigate to https://lightspeedwp.agency
@playwright click "Sign In" button
@playwright fill form field "email" with "test@example.com"
@playwright select dropdown "Country" value "United States"
@playwright upload file to "attachment" field "./test-document.pdf"

# 📸 CAPTURE & ANALYSIS
@playwright screenshot current page
@playwright screenshot element ".hero-section"
@playwright record video of test execution
@playwright capture network requests during navigation
```

### **🔧 Debugging & Development**

```bash
# 🐛 DEBUG TESTS
@playwright debug failed test login.spec.js
@playwright show test traces for last run
@playwright inspect element selector ".login-button"
@playwright validate selectors on current page

# 🔍 PAGE ANALYSIS
@playwright analyze page performance
@playwright check accessibility violations
@playwright audit lighthouse scores
@playwright validate HTML structure
```

## Test Generation Workflows

### **🎯 WordPress-Specific Test Generation**

```bash
# Block Editor Testing
@playwright generate tests for Gutenberg block creation
@playwright generate tests for block theme customization
@playwright generate tests for WordPress admin dashboard navigation

# E-commerce Testing (WooCommerce)
@playwright generate tests for product catalog browsing
@playwright generate tests for cart and checkout flow
@playwright generate tests for user account management
```

### **🎨 Component Testing**

```bash
# UI Component Tests
@playwright generate tests for navigation menu responsiveness
@playwright generate tests for modal dialog interactions
@playwright generate tests for form validation feedback
@playwright generate tests for carousel/slider functionality
```

### **♿ Accessibility Testing**

```bash
# WCAG Compliance
@playwright generate accessibility audit for all pages
@playwright test keyboard navigation for entire site
@playwright check color contrast ratios
@playwright validate screen reader compatibility
```

## Browser Automation

### **🎭 Advanced Automation Scenarios**

```bash
# Multi-step User Journeys
@playwright automate "User registration → Email verification → Profile setup"
@playwright automate "Product search → Add to cart → Guest checkout"
@playwright automate "Admin login → Create post → Publish → Verify frontend"

# Cross-browser Testing
@playwright run tests across all configured browsers
@playwright compare behavior between Chrome and Safari
@playwright test responsive design on mobile devices
```

### **📱 Mobile & Device Testing**

```bash
# Device Emulation
@playwright test on iPhone 14 Pro
@playwright test on iPad landscape orientation
@playwright test on Android tablet
@playwright simulate slow network conditions
```

## Integration with Development

### **🔄 CI/CD Integration**

```bash
# GitHub Actions Integration
@playwright generate CI workflow for test execution
@playwright setup test results reporting in PR comments
@playwright configure automatic screenshot uploads on failure

# Local Development
@playwright watch mode for test development
@playwright run tests on file changes
@playwright setup test coverage reporting
```

### **🛠️ WordPress Development Workflow**

```bash
# Block Theme Development
@playwright test new block functionality
@playwright verify theme customizer changes
@playwright test plugin activation/deactivation effects

# Content Management
@playwright test content creation workflows
@playwright verify SEO metadata updates
@playwright test media library functionality
```

## Advanced Features

### **🎥 Visual Testing & Regression**

```bash
# Screenshot Comparison
@playwright capture baseline screenshots for all pages
@playwright detect visual regressions since last deployment
@playwright update visual baselines after design changes
@playwright compare screenshots between environments

# Video Recording
@playwright record user journey videos
@playwright generate test execution videos for bug reports
@playwright capture performance metrics during test runs
```

### **🌊 Network & Performance**

```bash
# Network Testing
@playwright intercept API calls during test execution
@playwright mock external service responses
@playwright test offline functionality
@playwright simulate network failures

# Performance Monitoring
@playwright measure page load times
@playwright track Core Web Vitals during tests
@playwright analyze resource loading performance
@playwright test under different network conditions
```

## Troubleshooting

### **🚨 Common Issues & Solutions**

#### **"Playwright browsers not installed"**

```bash
# Install all browsers
npx playwright install

# Install specific browser
npx playwright install chromium
```

#### **"Test timeouts or failures"**

```bash
# Debug mode for investigation
@playwright debug failing-test.spec.js

# Check element selectors
@playwright inspect selectors on page

# Increase timeout for slow operations
@playwright set default timeout to 30000ms
```

#### **"Screenshot differences in CI"**

```bash
# Update baselines
@playwright update screenshots --force

# Check pixel tolerance settings
@playwright configure visual comparison threshold

# Review failing visual comparisons
@playwright show visual diff report
```

### **🔧 Debug Information**

```bash
# System Information
@playwright check browser installations
@playwright verify configuration
@playwright show environment details

# Test Analysis
@playwright analyze slow tests
@playwright show flaky test patterns
@playwright generate test coverage report
```

## Best Practices

### **🎯 Test Organization**

1. **Page Object Models:** Use AI to generate maintainable page objects
2. **Test Data Management:** Separate test data from test logic
3. **Selector Strategy:** Use stable, semantic selectors
4. **Test Independence:** Ensure tests can run in isolation

### **🚀 Performance Optimization**

```bash
# Parallel Execution
@playwright configure parallel test execution
@playwright optimize test suite runtime
@playwright setup test result caching

# Resource Management  
@playwright cleanup test data after execution
@playwright manage browser contexts efficiently
@playwright optimize screenshot storage
```

### **📊 Reporting & Monitoring**

1. **Comprehensive Reports:** Generate detailed HTML reports
2. **Failure Analysis:** Implement automatic failure categorization
3. **Metrics Tracking:** Monitor test execution metrics over time
4. **Integration Alerts:** Setup notifications for test failures

### **🔒 Security & Reliability**

```bash
# Secure Testing
@playwright manage test credentials securely
@playwright implement test data isolation
@playwright configure secure browser contexts

# Reliability Patterns
@playwright implement retry strategies for flaky tests
@playwright add wait conditions for dynamic content
@playwright use explicit waits over implicit delays
```

## Integration

This Playwright MCP server integrates with:

- [MCP Server GitHub](./mcp-server-github.md) for test result reporting
- [VS Code Settings](./vscode-settings.md) for development workflow
- [NPM Package.json](./npm-package-json.md) for script management
- [VS Code MCP Overview](./vscode-mcp.md) for general setup
