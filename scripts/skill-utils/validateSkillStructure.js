const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function validateSkillStructure(skillDir, options = {}) {
  const { checkPlaceholders = true } = options;

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

  const skillContent = fs.readFileSync(skillMd, "utf8");
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

  const noisePatterns = [
    "__MACOSX",
    ".DS_Store",
    "*.pyc",
    "__pycache__",
    "node_modules",
  ];

  for (const pattern of noisePatterns) {
    try {
      const cmd = `find "${skillDir}" -name "${pattern}" 2>/dev/null | head -1`;
      const result = execSync(cmd, { encoding: "utf8", stdio: "pipe" }).trim();
      if (result) {
        throw new Error("package noise found");
      }
    } catch (error) {
      if (error.message === "package noise found") {
        throw error;
      }
    }
  }

  const warnings = [];
  if (checkPlaceholders) {
    const excludePatterns = [
      "quick_check_skill.sh",
      "validateSkillStructure.js",
    ];
    try {
      const excludeArgs = excludePatterns
        .map((p) => `--exclude="${p}"`)
        .join(" ");
      const cmd = `grep -r "TODO\\|placeholder\\|Replace with" "${skillDir}" ${excludeArgs} 2>/dev/null || true`;
      const hits = execSync(cmd, {
        encoding: "utf8",
        shell: "/bin/bash",
      }).trim();
      if (hits) {
        const lines = hits.split("\n").slice(0, 20);
        warnings.push("possible placeholder text found:\n" + lines.join("\n"));
      }
    } catch {
      // Ignore grep errors
    }
  }

  return {
    valid: true,
    name,
    folderName,
    warnings,
  };
}

module.exports = { validateSkillStructure };
