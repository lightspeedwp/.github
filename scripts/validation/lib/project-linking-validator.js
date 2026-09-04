"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Validates that all active projects have Related Issues section in README.
 * @param {string} projectsPath - Path to .github/projects/active directory
 * @returns {{projectsFound: number, projectsWithLinks: number, missingLinks: string[], valid: boolean}}
 */
function validateProjectLinking(projectsPath) {
  const result = {
    projectsFound: 0,
    projectsWithLinks: 0,
    missingLinks: [],
    valid: true,
  };

  if (!fs.existsSync(projectsPath)) {
    result.valid = false;
    return result;
  }

  const projectDirs = fs.readdirSync(projectsPath).filter((file) => {
    const fullPath = path.join(projectsPath, file);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const projectName of projectDirs) {
    result.projectsFound += 1;
    const projectDir = path.join(projectsPath, projectName);
    const readmePath = path.join(projectDir, "README.md");

    if (!fs.existsSync(readmePath)) {
      result.missingLinks.push(projectName);
      result.valid = false;
      continue;
    }

    const content = fs.readFileSync(readmePath, "utf8");

    // Check for "Related Issues" section (accept emoji-prefixed headers like "## 🔗 Related Issues")
    if (/^## +[^\n#]*Related Issues/m.test(content)) {
      result.projectsWithLinks += 1;
    } else {
      result.missingLinks.push(projectName);
      result.valid = false;
    }
  }

  return result;
}

/**
 * Validates that issue numbers in Related Issues sections are valid.
 * @param {string} projectsPath - Path to .github/projects/active directory
 * @returns {{invalidIssues: Array<{project: string, issue: string}>, valid: boolean}}
 */
function validateIssueNumbers(projectsPath) {
  const result = {
    invalidIssues: [],
    valid: true,
  };

  if (!fs.existsSync(projectsPath)) {
    return result;
  }

  const projectDirs = fs.readdirSync(projectsPath).filter((file) => {
    const fullPath = path.join(projectsPath, file);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const projectName of projectDirs) {
    const projectDir = path.join(projectsPath, projectName);
    const readmePath = path.join(projectDir, "README.md");

    if (!fs.existsSync(readmePath)) {
      continue;
    }

    const content = fs.readFileSync(readmePath, "utf8");
    const issueMatches = content.matchAll(/#(\d+)/g);

    for (const match of issueMatches) {
      const issueNum = match[1];

      // Validate: must be 1-5 digit number
      if (!/^\d{1,5}$/.test(issueNum)) {
        result.invalidIssues.push({
          project: projectName,
          issue: issueNum,
        });
        result.valid = false;
      }
    }
  }

  return result;
}

module.exports = {
  validateProjectLinking,
  validateIssueNumbers,
};
