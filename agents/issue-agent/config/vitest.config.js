import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
    exclude: ["node_modules", ".git", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["scripts/automation/issue-agent/**/*.js"],
      exclude: [
        "scripts/automation/issue-agent/**/__tests__/**",
        "scripts/automation/issue-agent/config/**",
      ],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
    setupFiles: ["./scripts/automation/issue-agent/config/vitest-setup.js"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../"),
    },
  },
});
