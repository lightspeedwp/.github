#!/usr/bin/env node

/**
 * Retry wrapper with exponential backoff
 * Executes a command with configurable retry logic
 *
 * Usage:
 *   node retry-with-backoff.js <maxRetries> <initialDelayMs> <maxDelayMs> [command...]
 *
 * Example:
 *   node retry-with-backoff.js 5 1000 30000 npm run sync-project
 */

const { spawn } = require("child_process");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoffDelay(attempt, initialDelay, maxDelay, jitter = true) {
  const exponentialDelay = Math.pow(2, attempt) * initialDelay;
  const boundedDelay = Math.min(exponentialDelay, maxDelay);

  if (jitter) {
    // Add random jitter: ±10% of delay
    const jitterRange = boundedDelay * 0.1;
    const randomJitter = (Math.random() - 0.5) * jitterRange * 2;
    return Math.max(boundedDelay + randomJitter, initialDelay);
  }

  return boundedDelay;
}

async function executeCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error(
      "Usage: node retry-with-backoff.js <maxRetries> <initialDelayMs> <maxDelayMs> [command...]",
    );
    console.error("");
    console.error("Example:");
    console.error(
      "  node retry-with-backoff.js 5 1000 30000 npm run sync-project",
    );
    process.exit(1);
  }

  const maxRetries = parseInt(args[0], 10) || 5;
  const initialDelay = parseInt(args[1], 10) || 1000;
  const maxDelay = parseInt(args[2], 10) || 30000;
  const commandArgs = args.slice(3);

  if (commandArgs.length === 0) {
    console.error("No command provided");
    process.exit(1);
  }

  const commandStr = commandArgs.join(" ");
  const command = commandArgs[0];
  const cmdArgs = commandArgs.slice(1);

  let lastError;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      console.log(
        `[Attempt ${attempt + 1}/${maxRetries + 1}] Executing: ${commandStr}`,
      );
      await executeCommand(command, cmdArgs);
      console.log(`✅ Command succeeded on attempt ${attempt + 1}`);
      process.exit(0);
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const backoffDelay = calculateBackoffDelay(
          attempt,
          initialDelay,
          maxDelay,
        );
        console.error(`❌ Command failed: ${error.message}`);
        console.log(
          `⏳ Waiting ${Math.round(backoffDelay)}ms before retry ${attempt + 2}/${maxRetries + 1}...`,
        );
        await sleep(backoffDelay);
        attempt++;
      } else {
        break;
      }
    }
  }

  console.error(`❌ Command failed after ${maxRetries + 1} attempts`);
  if (lastError) {
    console.error(`Last error: ${lastError.message}`);
  }
  process.exit(1);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
