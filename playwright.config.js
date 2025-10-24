/**
 * Load environment variables from .env file
 * Enables Playwright configuration customization via environment variables
 */
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright End-to-End Testing Configuration
 *
 * This configuration provides:
 * - Cross-browser testing capabilities
 * - Configurable test environments via environment variables
 * - Base URL setup for consistent test targeting
 * - Device emulation for responsive testing
 *
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
module.exports = defineConfig({
    /**
     * Test directory location
     * Contains all E2E test files (.spec.js, .spec.ts)
     * Override via PLAYWRIGHT_TEST_DIR environment variable
     * Default: ./tests/e2e
     */
    testDir: process.env.PLAYWRIGHT_TEST_DIR || './tests/e2e',

    /**
     * Test reporter configuration
     * Controls how test results are displayed and saved
     * Available reporters: 'list', 'line', 'dot', 'json', 'junit', 'html'
     * Override via PLAYWRIGHT_REPORTER environment variable
     * Default: 'list' (shows test names and results)
     */
    reporter: [[process.env.PLAYWRIGHT_REPORTER || 'list']],

    /**
     * Global test configuration options
     * Applied to all test projects unless overridden
     */
    use: {
        /**
         * Base URL for all page navigation
         * Allows relative URLs in tests: page.goto('/path')
         * Override via E2E_BASE_URL environment variable
         * Default: http://localhost:8888 (common dev server port)
         */
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:8888',

        /**
         * Headless browser execution
         * true: Run without browser UI (faster, CI-friendly)
         * false: Show browser window (debugging, development)
         * Set PLAYWRIGHT_HEADLESS=false to show browser UI
         */
        headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
    },

    /**
     * Browser projects configuration
     * Each project runs tests in a different browser/device context
     *
     * Current setup:
     * - Chromium project with Desktop Chrome device emulation
     *
     * Additional projects can be added for:
     * - Firefox: { name: 'firefox', use: { ...devices['Desktop Firefox'] } }
     * - Safari: { name: 'webkit', use: { ...devices['Desktop Safari'] } }
     * - Mobile: { name: 'mobile', use: { ...devices['iPhone 12'] } }
     */
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'], // 1280x720 viewport, Chrome user agent
            },
        },
    ],
});
