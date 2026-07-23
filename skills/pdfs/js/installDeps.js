const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

async function installDeps(scriptDir = __dirname) {
  try {
    const resolvedDir = path.resolve(scriptDir);
    const nodeModulesPath = path.join(resolvedDir, "node_modules");

    if (fs.existsSync(nodeModulesPath)) {
      console.log("[OK] node_modules already present");
      return { success: true, installed: false, directory: resolvedDir };
    }

    const packageJsonPath = path.join(resolvedDir, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("package.json not found");
    }

    console.log("[INFO] Installing JS deps (pdf-lib, pdfjs-dist)...");
    await execAsync("npm install --silent", {
      cwd: resolvedDir,
    });
    console.log("[OK] Installed JS deps");

    return { success: true, installed: true, directory: resolvedDir };
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`, {
      cause: error,
    });
  }
}

module.exports = { installDeps };
