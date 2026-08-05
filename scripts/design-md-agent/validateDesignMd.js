const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function findDesignMdRepo(designDir, _searchRoots = []) {
  const repoPath = process.env.DESIGNMD_REPO_PATH;
  if (repoPath && isDesignMdCliRepo(repoPath)) {
    return repoPath;
  }

  const candidates = [
    path.join(designDir, "design.md-main/packages/cli"),
    path.join(designDir, "packages/cli"),
    path.join(process.cwd(), "design.md-main/packages/cli"),
    path.join(process.cwd(), "packages/cli"),
    path.join(__dirname, "../../design.md-main/packages/cli"),
    path.join(__dirname, "../../tmp/designmd-repo/design.md-main/packages/cli"),
    path.join(
      __dirname,
      "../../../tmp/designmd-repo/design.md-main/packages/cli",
    ),
    "/workspace/design.md-main/packages/cli",
    "/workspace/tmp/designmd-repo/design.md-main/packages/cli",
  ];

  for (const candidate of candidates) {
    if (isDesignMdCliRepo(candidate)) {
      return candidate;
    }
  }

  return null;
}

function isDesignMdCliRepo(candidate) {
  try {
    if (!fs.existsSync(candidate)) return false;
    if (!fs.existsSync(path.join(candidate, "package.json"))) return false;
    if (!fs.existsSync(path.join(candidate, "src/index.ts"))) return false;

    const pkg = JSON.parse(
      fs.readFileSync(path.join(candidate, "package.json"), "utf8"),
    );
    return pkg.name === "@google/design.md";
  } catch {
    return false;
  }
}

function commandExists(command) {
  try {
    execSync(`command -v ${command}`, { shell: "/bin/bash", stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function findDesignMdCliCmd(repoDir) {
  const customCmd = process.env.DESIGNMD_CLI_CMD;
  if (customCmd) return { cmd: customCmd, source: "env" };

  if (commandExists("designmd")) {
    return { cmd: "designmd", source: "installed command" };
  }

  if (commandExists("design.md")) {
    return { cmd: "design.md", source: "installed command" };
  }

  if (repoDir && commandExists("bun")) {
    return { cmd: "bun run src/index.ts", cwd: repoDir, source: "local repo" };
  }

  if (commandExists("npx")) {
    return { cmd: "npx --yes @google/design.md", source: "npx package" };
  }

  return { cmd: null, source: "not available" };
}

function checkFrontmatter(designMdPath) {
  const content = fs.readFileSync(designMdPath, "utf8");
  const lines = content.split("\n");
  return lines[0] === "---";
}

function checkHeading(designMdPath, label, pattern) {
  const content = fs.readFileSync(designMdPath, "utf8");
  const regex = new RegExp(pattern, "m");
  return regex.test(content);
}

function validateDesignMd(designMdPath, reportPath = null) {
  if (!fs.existsSync(designMdPath)) {
    throw new Error(`ERROR: DESIGN.md not found: ${designMdPath}`);
  }

  const designDir = path.dirname(path.resolve(designMdPath));
  const repoDir = findDesignMdRepo(designDir);
  const {
    cmd: cliCmd,
    cwd: cliCwd = ".",
    source: cliSource,
  } = findDesignMdCliCmd(repoDir);

  const report = ["# DESIGN.md Validation Report", "", "## Summary"];
  report.push(`- File: \`${designMdPath}\``);

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toISOString().split("T")[1].split(".")[0];
  report.push(`- Validation date (UTC): ${dateStr} ${timeStr}`);

  if (cliCmd) {
    report.push(`- CLI command: \`${cliCmd}\``);
    report.push(`- CLI working directory: \`${cliCwd}\``);
    report.push(`- CLI source: ${cliSource}`);
  } else {
    report.push("- CLI command: not available");
  }

  if (repoDir) {
    report.push(`- Local DESIGN.md repo detected: \`${repoDir}\``);
    if (!commandExists("bun")) {
      report.push(
        "- Local repo execution note: repo found, but `bun` is not installed, so source execution is unavailable in this environment.",
      );
    }
  }

  report.push("", "## Automated checks");

  let specStatus = "not run";
  let lintStatus = "not run";

  if (cliCmd) {
    // Run spec check
    try {
      const specCmd = `cd "${cliCwd}" && ${cliCmd} spec --rules --format json`;
      execSync(specCmd, { encoding: "utf8", stdio: "pipe" });
      specStatus = "pass";
      report.push("### Spec check");
      report.push("- Result: pass");
    } catch (error) {
      specStatus = "fail";
      report.push("### Spec check");
      report.push("- Result: fail");
      report.push("```text");
      const errorOutput = (error.stderr || error.stdout || String(error))
        .split("\n")
        .slice(0, 80);
      report.push(...errorOutput);
      report.push("```");
    }

    // Run lint check
    try {
      const lintCmd = `cd "${cliCwd}" && ${cliCmd} lint "${designMdPath}" --format json`;
      execSync(lintCmd, { encoding: "utf8", stdio: "pipe" });
      lintStatus = "pass";
    } catch {
      lintStatus = "fail";
    }

    report.push("", "### Lint check");
    report.push(`- Result: ${lintStatus}`);
  } else {
    report.push(
      "- No supported DESIGN.md CLI command was found. Skipped `spec` and `lint` checks.",
    );
  }

  report.push("", "## Manual checks");

  const content = fs.readFileSync(designMdPath, "utf8");
  if (content.includes("^---$") || checkFrontmatter(designMdPath)) {
    report.push("- Front matter delimiter present: yes");
  } else {
    report.push("- Front matter delimiter present: no");
  }

  const headingChecks = [
    ["Overview or Brand & Style", "^## (Overview|Brand & Style)$"],
    ["Colors", "^## Colors$"],
    ["Typography", "^## Typography$"],
    ["Layout or Layout & Spacing", "^## (Layout|Layout & Spacing)$"],
    ["Elevation & Depth or Elevation", "^## (Elevation & Depth|Elevation)$"],
    ["Shapes", "^## Shapes$"],
    ["Components", "^## Components$"],
    ["Do's and Don'ts", "^## Do's and Don'ts$"],
  ];

  for (const [label, pattern] of headingChecks) {
    if (checkHeading(designMdPath, label, pattern)) {
      report.push(`- Heading present: ${label}`);
    } else {
      report.push(`- Heading missing: ${label}`);
    }
  }

  const isCalled = path.basename(designMdPath) === "DESIGN.md" ? "yes" : "no";
  report.push(`- File name is DESIGN.md: ${isCalled}`);

  report.push("", "## Result");
  report.push(`- Spec status: ${specStatus}`);
  report.push(`- Lint status: ${lintStatus}`);

  const reportContent = report.join("\n");

  if (reportPath) {
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    fs.writeFileSync(reportPath, reportContent);
  }

  return { specStatus, lintStatus, report: reportContent };
}

module.exports = {
  validateDesignMd,
  findDesignMdCliCmd,
  findDesignMdRepo,
  isDesignMdCliRepo,
};
