#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const DRY = process.env.DRY_RUN === "true";
function hasScript(n) {
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return pkg.scripts && pkg.scripts[n];
  } catch {
    return false;
  }
}
function run(c) {
  console.log(`$ ${c}`);
  if (!DRY) execSync(c, { stdio: "inherit" });
}
try {
  if (hasScript("build")) run("npm run build");
  else if (fs.existsSync("node_modules/.bin/wp-scripts"))
    run("node node_modules/.bin/wp-scripts build");
  else console.log("No build script; skipping.");
  if (hasScript("test:e2e")) run("npm run test:e2e");
  else if (
    fs.existsSync("playwright.config.ts") ||
    fs.existsSync("playwright.config.js")
  )
    run("npx playwright test --reporter=list");
  else console.log("No Playwright config; skipping e2e.");
  console.log("✅ Block build & smoke tests completed");
} catch (e) {
  console.error(`❌ ${e.message}`);
  process.exit(1);
}
