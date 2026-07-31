const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { validateDesignMd, findDesignMdCliCmd } = require("./validateDesignMd");

function runLintWithAvailableCli(designFile, jsonFile) {
  const { cmd: cliCmd, cwd: cliCwd = "." } = findDesignMdCliCmd(null);

  if (!cliCmd) {
    return false;
  }

  try {
    const lintCmd = `cd "${cliCwd}" && ${cliCmd} lint "${designFile}" --format json`;
    const output = execSync(lintCmd, { encoding: "utf8", stdio: "pipe" });
    fs.writeFileSync(jsonFile, output);
    return true;
  } catch (error) {
    if (error.stdout) {
      try {
        fs.writeFileSync(jsonFile, error.stdout);
        return true;
      } catch {
        // Ignore write errors
      }
    }
    return false;
  }
}

function parseJsonReport(jsonFile) {
  try {
    if (!fs.existsSync(jsonFile)) {
      return { errors: 0, warnings: 0, infos: 0, findings: [] };
    }

    const content = fs.readFileSync(jsonFile, "utf8");
    const report = JSON.parse(content);

    return {
      errors: Number(report.summary?.errors || 0),
      warnings: Number(report.summary?.warnings || 0),
      infos: Number(report.summary?.infos || 0),
      findings: Array.isArray(report.findings) ? report.findings : [],
    };
  } catch {
    return { errors: 0, warnings: 0, infos: 0, findings: [] };
  }
}

function generatePrComment(jsonFile, commentFile) {
  const { errors, warnings, infos, findings } = parseJsonReport(jsonFile);

  const topFindings = findings.slice(0, 10).map((finding) => {
    const severity = String(finding.severity || "info").toUpperCase();
    const pathStr = finding.path ? ` \`${finding.path}\`` : "";
    return `- **${severity}**${pathStr}: ${finding.message}`;
  });

  const body = [
    "<!-- design-md-lint-comment -->",
    "## DESIGN.md Lint Summary",
    "",
    `- Errors: ${errors}`,
    `- Warnings: ${warnings}`,
    `- Infos: ${infos}`,
    "",
    "### Top findings",
    "",
    ...(topFindings.length > 0
      ? topFindings
      : ["- No findings reported by the CLI."]),
    "",
    "Full report file: `design-md-validation-report.md`",
  ].join("\n");

  fs.writeFileSync(commentFile, body);
}

function ciDesignMdCheck(repoRoot = process.cwd()) {
  const designFile =
    process.env.DESIGN_MD_FILE || path.join(repoRoot, "DESIGN.md");
  const reportFile =
    process.env.DESIGN_MD_REPORT ||
    path.join(repoRoot, "design-md-validation-report.md");
  const jsonFile =
    process.env.DESIGN_MD_JSON_REPORT ||
    path.join(repoRoot, "designmd-lint.json");
  const commentFile =
    process.env.DESIGN_MD_PR_COMMENT ||
    path.join(repoRoot, "design-md-pr-comment.md");

  if (!fs.existsSync(designFile)) {
    console.error(`DESIGN.md not found at ${designFile}`);
    process.exit(1);
  }

  console.log(`Validating ${designFile}`);

  try {
    validateDesignMd(designFile, reportFile);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  if (!runLintWithAvailableCli(designFile, jsonFile)) {
    console.error(
      "No runnable DESIGN.md CLI was found after validation. Report written to",
      reportFile,
    );
    process.exit(1);
  }

  const { errors, warnings, infos } = parseJsonReport(jsonFile);
  console.log(
    `DESIGN.md summary: errors=${errors} warnings=${warnings} infos=${infos}`,
  );

  generatePrComment(jsonFile, commentFile);

  if (errors > 0) {
    console.error(`DESIGN.md lint failed with ${errors} error(s).`);
    process.exit(1);
  }

  console.log(`DESIGN.md validation completed. Report: ${reportFile}`);
  process.exit(0);
}

module.exports = {
  ciDesignMdCheck,
  generatePrComment,
  parseJsonReport,
  runLintWithAvailableCli,
};
