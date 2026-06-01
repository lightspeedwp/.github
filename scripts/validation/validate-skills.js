#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const skillsDir = path.join(root, "skills");
const errors = [];

for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith(".")) continue;
  const skillPath = path.join(skillsDir, entry.name);
  const skillMd = path.join(skillPath, "SKILL.md");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
    errors.push(`Invalid skill folder name: ${entry.name}`);
  }
  if (!fs.existsSync(skillMd)) {
    const hasNestedSkill = fs
      .readdirSync(skillPath, { withFileTypes: true })
      .some(
        (child) =>
          child.isDirectory() &&
          fs.existsSync(path.join(skillPath, child.name, "SKILL.md")),
      );
    if (!hasNestedSkill) {
      errors.push(`Missing SKILL.md: skills/${entry.name}/SKILL.md`);
    }
  }
}

if (errors.length) {
  console.error("Skill validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Skill validation passed.");
