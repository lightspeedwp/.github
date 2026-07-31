#!/usr/bin/env node
/**
 * Roll back a failed release by cleaning tags/releases/branch and restoring key files.
 */

const { execSync } = require("child_process");
const fs = require("fs");

function run(command, options = {}) {
  const { allowError = false, dryRun = false } = options;

  if (dryRun) {
    console.log(`[DRY-RUN] ${command}`);
    return "";
  }

  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    if (allowError) {
      return "";
    }
    throw new Error(
      `Command failed: ${command}\n${error.stderr || error.message}`,
    );
  }
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const versionArg = args.find((arg) => arg.startsWith("--version="));
  const providerArg = args.find((arg) => arg.startsWith("--provider="));
  const force = args.includes("--force");
  const dryRun = args.includes("--dry-run");

  if (!versionArg) {
    throw new Error("Missing required argument: --version=X.Y.Z");
  }

  const version = versionArg.split("=")[1];
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Invalid version format: ${version}. Expected X.Y.Z`);
  }

  const provider = (
    providerArg ? providerArg.split("=")[1] : process.env.RELEASE_PROVIDER
  )
    ? (providerArg
        ? providerArg.split("=")[1]
        : process.env.RELEASE_PROVIDER || "shell"
      )
        .toLowerCase()
        .trim()
    : "shell";

  if (!["shell", "mcp"].includes(provider)) {
    throw new Error(
      `Invalid provider: ${provider}. Expected one of: shell, mcp`,
    );
  }

  return { version, force, dryRun, provider };
}

function getRepositoryContext() {
  const fromPair = process.env.GITHUB_REPOSITORY || "";
  if (fromPair.includes("/")) {
    const [owner, repo] = fromPair.split("/");
    if (owner && repo) {
      return { owner, repo };
    }
  }

  const owner = process.env.RELEASE_REPO_OWNER || "";
  const repo = process.env.RELEASE_REPO_NAME || "";
  if (owner && repo) {
    return { owner, repo };
  }

  throw new Error(
    "Repository context missing. Set GITHUB_REPOSITORY or RELEASE_REPO_OWNER and RELEASE_REPO_NAME.",
  );
}

async function githubApiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    allowNotFound = false,
    token = process.env.GITHUB_TOKEN,
    retries = Number.parseInt(process.env.RELEASE_MCP_RETRIES || "3", 10),
    initialBackoffMs = Number.parseInt(
      process.env.RELEASE_MCP_BACKOFF_MS || "250",
      10,
    ),
    backoffFactor = Number.parseFloat(
      process.env.RELEASE_MCP_BACKOFF_FACTOR || "2",
    ),
  } = options;

  if (!token) {
    throw new Error("GITHUB_TOKEN is required for MCP rollback operations.");
  }

  const fetchFn = globalThis.fetch;
  if (typeof fetchFn !== "function") {
    throw new Error(
      "Fetch API is unavailable in this runtime. Use Node.js 18+ for MCP rollback operations.",
    );
  }

  let attempt = 0;
  let delayMs = Number.isNaN(initialBackoffMs) ? 250 : initialBackoffMs;
  const maxRetries = Number.isNaN(retries) ? 3 : Math.max(retries, 0);
  const growth = Number.isNaN(backoffFactor) ? 2 : Math.max(backoffFactor, 1);

  while (attempt <= maxRetries) {
    let response;
    try {
      response = await fetchFn(`https://api.github.com${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      if (attempt >= maxRetries) {
        throw new Error(
          `GitHub API ${method} ${endpoint} request failed after ${attempt + 1} attempt(s): ${error.message}`,
        );
      }

      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });
      delayMs = Math.max(Math.ceil(delayMs * growth), delayMs);
      attempt += 1;
      continue;
    }

    if (allowNotFound && response.status === 404) {
      return null;
    }

    const text = await response.text();
    const parsed = text ? JSON.parse(text) : null;

    if (response.ok) {
      return parsed;
    }

    const shouldRetry = response.status === 429 || response.status >= 500;
    const details = parsed?.message || text || response.statusText;
    if (!shouldRetry || attempt >= maxRetries) {
      throw new Error(
        `GitHub API ${method} ${endpoint} failed (${response.status}): ${details}`,
      );
    }

    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
    delayMs = Math.max(Math.ceil(delayMs * growth), delayMs);
    attempt += 1;
  }

  throw new Error(
    `GitHub API ${method} ${endpoint} failed unexpectedly after retries.`,
  );
}

async function safeStep(name, fn, force) {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    if (!force) {
      throw error;
    }
    console.warn(
      `⚠ ${name} failed (continuing due to --force): ${error.message}`,
    );
  }
}

async function rollbackRelease({ version, force, dryRun, provider }) {
  const tag = `v${version}`;
  const branch = `release/v${version}`;
  const useMcp = provider === "mcp";
  const repoContext = useMcp ? getRepositoryContext() : null;

  console.log("╔════════════════════════════════════════╗");
  console.log("║       Release Rollback Utility         ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`Version: ${version}`);
  console.log(`Provider: ${provider}`);
  console.log(`Mode: ${dryRun ? "DRY-RUN" : force ? "FORCE" : "SAFE"}`);

  const previousCommit = run(`git rev-list -n 1 ${tag}^`, {
    allowError: true,
    dryRun,
  });

  await safeStep(
    "Delete local release tag",
    () => {
      run(`git tag -d ${tag}`, { dryRun });
    },
    force,
  );

  await safeStep(
    "Delete remote release tag",
    async () => {
      if (useMcp) {
        if (dryRun) {
          console.log(`[DRY-RUN] [MCP] Would delete remote tag ${tag}`);
          return;
        }
        await githubApiRequest(
          `/repos/${repoContext.owner}/${repoContext.repo}/git/refs/tags/${tag}`,
          {
            method: "DELETE",
            allowNotFound: true,
          },
        );
        return;
      }
      run(`git push origin :refs/tags/${tag}`, { dryRun });
    },
    force,
  );

  await safeStep(
    "Delete GitHub release",
    async () => {
      if (useMcp) {
        if (dryRun) {
          console.log(`[DRY-RUN] [MCP] Would delete release ${tag}`);
          return;
        }
        const release = await githubApiRequest(
          `/repos/${repoContext.owner}/${repoContext.repo}/releases/tags/${tag}`,
          {
            allowNotFound: true,
          },
        );
        if (!release?.id) {
          return;
        }
        await githubApiRequest(
          `/repos/${repoContext.owner}/${repoContext.repo}/releases/${release.id}`,
          {
            method: "DELETE",
            allowNotFound: true,
          },
        );
        return;
      }
      run(`gh release delete ${tag} --yes`, { dryRun });
    },
    force,
  );

  await safeStep(
    "Delete remote release branch",
    async () => {
      if (useMcp) {
        if (dryRun) {
          console.log(
            `[DRY-RUN] [MCP] Would delete remote release branch ${branch}`,
          );
          return;
        }
        await githubApiRequest(
          `/repos/${repoContext.owner}/${repoContext.repo}/git/refs/heads/${branch}`,
          {
            method: "DELETE",
            allowNotFound: true,
          },
        );
        return;
      }
      run(`git push origin --delete ${branch}`, { dryRun });
    },
    force,
  );

  await safeStep(
    "Restore VERSION and CHANGELOG.md from git history",
    () => {
      if (!previousCommit && !dryRun) {
        throw new Error(
          "Could not determine previous commit for restoration. Use --force if cleanup-only rollback is acceptable.",
        );
      }

      run(`git checkout ${previousCommit || "HEAD"} -- VERSION CHANGELOG.md`, {
        dryRun,
      });

      if (!dryRun) {
        const hasVersion = fs.existsSync("VERSION");
        const hasChangelog = fs.existsSync("CHANGELOG.md");
        if (!hasVersion || !hasChangelog) {
          throw new Error("Failed to restore VERSION and CHANGELOG.md");
        }
      }
    },
    force,
  );

  console.log("\n✅ Rollback flow completed.");
  if (dryRun) {
    console.log("No changes were applied.");
  }
}

async function main() {
  const config = parseArgs(process.argv);
  await rollbackRelease(config);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`\n❌ Rollback failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  run,
  parseArgs,
  getRepositoryContext,
  githubApiRequest,
  safeStep,
  rollbackRelease,
  main,
};
