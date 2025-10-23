require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: process.env.PLAYWRIGHT_TEST_DIR || './tests/e2e',
    reporter: [[process.env.PLAYWRIGHT_REPORTER || 'list']],
    use: {
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:8888',
        headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
