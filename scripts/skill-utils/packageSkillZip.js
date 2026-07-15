const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { validateSkillStructure } = require("./validateSkillStructure");

const SIZE_LIMIT = 15728640; // 15 MB in bytes

async function packageSkillZip(skillDir, outputDir = null) {
  try {
    // Validate skill structure first (skip package noise check since we exclude those in zip)
    validateSkillStructure(skillDir, {
      checkPlaceholders: false,
      checkPackageNoise: false,
    });

    const resolvedDir = path.resolve(skillDir);
    const resolvedOutDir = outputDir
      ? path.resolve(outputDir)
      : path.resolve(".");

    // Ensure output directory exists
    if (!fs.existsSync(resolvedOutDir)) {
      fs.mkdirSync(resolvedOutDir, { recursive: true });
    }

    const outputFile = path.join(resolvedOutDir, "skill.zip");

    // Remove existing file if it exists
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }

    const parentDir = path.dirname(resolvedDir);
    const folderName = path.basename(resolvedDir);

    // Build zip arguments array (safe from command injection)
    const zipArgs = [
      "-qr",
      outputFile,
      folderName,
      "-x",
      "*/__MACOSX/*",
      "-x",
      "*/.DS_Store",
      "-x",
      "*/__pycache__/*",
      "-x",
      "*.pyc",
      "-x",
      "*/node_modules/*",
      "-x",
      `${folderName}/evals/*`,
      "-x",
      "*/Icon",
      "-x",
      "*/Icon?",
    ];

    // Execute zip command from parent directory (no shell expansion)
    execFileSync("zip", zipArgs, {
      cwd: parentDir,
      stdio: "pipe",
    });

    // Get file size
    const stats = fs.statSync(outputFile);
    const bytes = stats.size;

    if (bytes > SIZE_LIMIT) {
      console.warn(`WARNING: skill.zip exceeds 15 MB (${bytes} bytes)`);
    }

    console.log(`OK: packaged ${outputFile} (${bytes} bytes)`);

    return { success: true, path: outputFile, bytes };
  } catch (error) {
    throw new Error(`Failed to create zip file: ${error.message}`, {
      cause: error,
    });
  }
}

module.exports = { packageSkillZip };
