const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

async function installDeps(scriptDir = __dirname) {
  try {
    const resolvedDir = path.resolve(scriptDir);
    const nodeModulesPath = path.join(resolvedDir, "node_modules");

    if (fs.existsSync(nodeModulesPath)) {
      console.log("[OK] node_modules already present");
      return { success: true, installed: false, directory: resolvedDir };
    }

    console.log("[INFO] Installing JS deps (pdf-lib, pdfjs-dist)...");
    execSync("npm install --silent", {
      cwd: resolvedDir,
      stdio: "pipe",
    });
    console.log("[OK] Installed JS deps");

    return { success: true, installed: true, directory: resolvedDir };
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
}

module.exports = { installDeps };
