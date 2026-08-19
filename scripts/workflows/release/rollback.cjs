#!/usr/bin/env node
const { process, AbortController, setTimeout, clearTimeout, fetch, console } =
  globalThis;

const { execSync, execFileSync } = require("child_process");
const { readEnv, runMain } = require("../shared/runtime.cjs");

function execGit(command, allowError = false) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (allowError) {
      return "";
    }
    throw new Error(`Git command failed: ${command}\n${error.message}`, {
      cause: error,
    });
  }
}

function parseArgs(argv) {
  const args = {
    version: null,
    provider: "shell",
    dryRun: false,
    force: false,
  };

  for (const arg of argv.slice(2)) {
    if (arg.startsWith("--version=")) {
      args.version = arg.split("=")[1];
    } else if (arg.startsWith("--provider=")) {
      args.provider = arg.split("=")[1];
      if (!["shell", "mcp"].includes(args.provider)) {
        throw new Error(`Invalid provider: ${args.provider}`);
      }
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--force") {
      args.force = true;
    }
  }

  return args;
}

async function githubApiRequest(path, options = {}) {
  const {
    retries = 3,
    initialBackoffMs = 1000,
    backoffFactor = 2,
    timeoutMs = 30000,
  } = options;

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN not set");
  }

  let lastError;
  let backoffMs = initialBackoffMs;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      let response;
      try {
        response = await fetch(`https://api.github.com${path}`, {
          method: "DELETE",
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok) {
        const text = await response.text();
        lastError = new Error(
          `GitHub API error: ${response.status} ${response.statusText} - ${text}`,
        );

        if (response.status >= 500 && attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          backoffMs *= backoffFactor;
          continue;
        }

        throw lastError;
      }

      const text = await response.text();
      if (response.status === 204 || !text.trim()) {
        return { ok: true };
      }

      return JSON.parse(text);
    } catch (error) {
      lastError = error;
      if (attempt < retries && error.name === "AbortError") {
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        backoffMs *= backoffFactor;
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

async function rollbackRelease(options = {}) {
  const {
    version = process.env.ROLLBACK_TARGET_VERSION || "",
    dryRun = false,
    provider = "shell",
    force = false,
  } = options;

  const targetVersion = String(version ?? "")
    .trim()
    .replace(/^v/i, "");

  if (!targetVersion && !dryRun) {
    throw new Error(
      "ROLLBACK_TARGET_VERSION required or version option must be set.",
    );
  }

  // Validate version format: semver-like (e.g., 1.2.3, 1.2.3-alpha)
  if (
    targetVersion &&
    !/^[0-9]+\.[0-9]+\.[0-9]+(-[a-z0-9.]+)?$/i.test(targetVersion)
  ) {
    throw new Error(
      `Invalid version format: ${targetVersion}. Expected semver format (e.g., 1.2.3).`,
    );
  }

  console.log(
    `⚠️  RELEASE ROLLBACK INITIATED: Rolling back release ${targetVersion || "(dry-run)"}`,
  );
  console.log(dryRun ? "Running in DRY-RUN mode" : "Running in LIVE mode");
  console.log(`Provider: ${provider}`);
  console.log("");

  try {
    if (!dryRun) {
      execGit("git fetch origin main develop");
      console.log("✓ Git access verified");

      const tagExists = execGit(`git rev-parse v${targetVersion}`, true);
      if (!tagExists) {
        console.log(
          `Tag v${targetVersion} not found locally, checking remote...`,
        );
        const remoteTagExists = execGit(
          `git ls-remote origin refs/tags/v${targetVersion}`,
          true,
        );
        if (!remoteTagExists) {
          throw new Error(
            `Release tag v${targetVersion} not found. Cannot rollback.`,
          );
        }
      }
      console.log(`✓ Release tag v${targetVersion} found`);
    }

    if (provider === "shell") {
      console.log(
        `[${dryRun ? "DRY-RUN" : "SHELL"}] Deleting tag v${targetVersion}...`,
      );
      console.log(
        `  ${dryRun ? "[DRY-RUN]" : ""} git push origin :refs/tags/v${targetVersion}`,
      );
      console.log(
        `  ${dryRun ? "[DRY-RUN]" : ""} gh release delete v${targetVersion} --yes`,
      );
      console.log(
        `  ${dryRun ? "[DRY-RUN]" : ""} git push origin --delete release/v${targetVersion}`,
      );
    } else if (provider === "mcp") {
      console.log(
        `[${dryRun ? "DRY-RUN" : "MCP"}] Deleting release via MCP...`,
      );
      console.log(
        `  ${dryRun ? "[DRY-RUN] [MCP]" : "[MCP]"} Would delete remote tag v${targetVersion}`,
      );
      console.log(
        `  ${dryRun ? "[DRY-RUN] [MCP]" : "[MCP]"} Would delete release v${targetVersion}`,
      );
      console.log(
        `  ${dryRun ? "[DRY-RUN] [MCP]" : "[MCP]"} Would delete remote release branch release/v${targetVersion}`,
      );
    }

    if (!dryRun && !force) {
      console.log("");
      console.log(
        "No changes applied. Re-run with --force to apply the rollback.",
      );
    } else if (!dryRun && force) {
      console.log("Applying rollback...");

      if (provider !== "shell") {
        throw new Error(
          `Provider "${provider}" does not support live rollback. Use --provider=shell or --dry-run.`,
        );
      }

      execGit(`git tag -d v${targetVersion}`, true);
      execGit(`git push origin :refs/tags/v${targetVersion}`);
      execFileSync("gh", ["release", "delete", `v${targetVersion}`, "--yes"], {
        stdio: "inherit",
      });
      execGit(`git push origin --delete release/v${targetVersion}`, true);
    }

    console.log("");
    console.log(`✅ Rollback of v${targetVersion} complete`);
  } catch (error) {
    console.error(`❌ Rollback failed: ${error.message}`);
    console.error(
      "Manual recovery may be required. Check git status and verify main/develop branches.",
    );
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const targetVersion = (
    args.version ?? readEnv("ROLLBACK_TARGET_VERSION", { defaultValue: "" })
  ).trim();

  if (!targetVersion) {
    throw new Error(
      "ROLLBACK_TARGET_VERSION required. Set it via --version=... or ROLLBACK_TARGET_VERSION environment variable.",
    );
  }

  await rollbackRelease({
    version: targetVersion,
    dryRun: args.dryRun,
    provider: args.provider,
    force: args.force,
  });
}

module.exports = {
  rollbackRelease,
  parseArgs,
  githubApiRequest,
};

// Only execute when this script is run directly, not when imported by tests
if (require.main === module) {
  runMain(main);
}
