const fs = require("fs");
const path = require("path");

function validateSkillStructure(skillDir, options = {}) {
  const { checkPlaceholders = true, checkPackageNoise = true } = options;

  if (!fs.existsSync(skillDir)) {
    throw new Error("Skill directory not found");
  }

  const skillMd = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillMd)) {
    throw new Error("SKILL.md not found");
  }

  const agentYaml = path.join(skillDir, "agents/openai.yaml");
  if (!fs.existsSync(agentYaml)) {
    throw new Error("agents/openai.yaml not found");
  }

  const skillContent = fs.readFileSync(skillMd, "utf8").replace(/\r\n/g, "\n");
  const firstLine = skillContent.split("\n")[0];
  if (firstLine !== "---") {
    throw new Error("SKILL.md must start with YAML frontmatter");
  }

  const nameMatch = skillContent.match(/^name: [a-z][a-z0-9-]*$/m);
  if (!nameMatch) {
    throw new Error("frontmatter name must be lowercase hyphen-case");
  }

  if (!skillContent.match(/^description: /m)) {
    throw new Error("frontmatter description missing");
  }

  const nameLineMatch = skillContent.match(/^name: (.+)$/m);
  if (!nameLineMatch) {
    throw new Error("Could not parse name from SKILL.md");
  }

  const name = nameLineMatch[1].trim();
  const folderName = path.basename(skillDir);
  if (name !== folderName) {
    throw new Error("frontmatter name must match folder name");
  }

  const warnings = [];
  const excludePatterns = [
    "quick_check_skill.sh",
    "validateSkillStructure.js",
    "packageSkillZip.js",
  ];

  function traverse(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const entryName = entry.name;

      if (
        checkPackageNoise &&
        (entryName === "__MACOSX" ||
          entryName === ".DS_Store" ||
          entryName === "__pycache__" ||
          entryName === "node_modules" ||
          entryName.endsWith(".pyc"))
      ) {
        throw new Error("package noise found");
      }

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        if (excludePatterns.includes(entryName)) {
          continue;
        }
        if (checkPlaceholders) {
          try {
            const content = fs.readFileSync(fullPath, "utf8");
            const lines = content.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (
                line.includes("TODO") ||
                line.includes("placeholder") ||
                line.includes("Replace with")
              ) {
                warnings.push(fullPath + ":" + line.trim());
              }
            }
          } catch {
            // Ignore binary files or read errors
          }
        }
      }
    }
  }

  traverse(skillDir);

  const formattedWarnings = [];
  if (warnings.length > 0) {
    const lines = warnings.slice(0, 20);
    formattedWarnings.push(
      "possible placeholder text found:\n" + lines.join("\n"),
    );
  }

  return {
    valid: true,
    name,
    folderName,
    warnings: formattedWarnings,
  };
}

module.exports = { validateSkillStructure };
