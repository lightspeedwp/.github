#!/usr/bin/env node

/**
 * Phase 5A Release Agent Integration — Wraps Phase 4 with Safety Gates
 *
 * Flow:
 *   1. Import ReleaseGates class
 *   2. Run all 7 safety gates
 *   3. If gates pass, call Phase 4 run-release-agent.cjs
 *   4. If gates fail, provide actionable error message
 *
 * Design: AUGMENT approach (no Phase 4 changes)
 */

const { execSync } = require('child_process');

let ReleaseGates;
try {
  ReleaseGates = require('../../../gates/release-gates.js');
} catch (err) {
  console.warn('⚠️  ReleaseGates module not found, using fallback');
  callPhase4();
  process.exit(0);
}

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${level}: ${message}`);
}

function callPhase4() {
  log('Calling Phase 4 release agent (run-release-agent.cjs)');
  const phase4Script = path.join(__dirname, 'run-release-agent.cjs');
  try {
    execSync(`node ${phase4Script}`, {
      stdio: 'inherit',
      encoding: 'utf-8',
      env: process.env,
    });
    log('✅ Phase 4 release agent completed successfully');
    return true;
  } catch (err) {
    log(`❌ Phase 4 release agent failed: ${err.message}`, 'ERROR');
    throw err;
  }
}

async function runWithGates() {
  const dryRun = process.env.INPUT_DRY_RUN === 'true';
  const scope = process.env.INPUT_SCOPE || 'patch';

  log(`🚀 Starting Phase 5A Release Agent with Safety Gates`);
  log(`   Scope: ${scope}, Dry-run: ${dryRun}`);

  const gates = new ReleaseGates({
    verbose: process.env.VERBOSE === 'true',
  });

  log('Running 7-layer safety gates validation...');
  const allGatesPassed = gates.runAllGates();

  gates.saveAuditLog();

  if (!allGatesPassed) {
    log('❌ Release blocked: Safety gates failed', 'ERROR');
    log('');
    log('Gate Status Summary:', 'INFO');
    Object.entries(gates.results).forEach(([gate, result]) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`  ${status} — ${gate}`);
      if (result.details && result.details.length > 0) {
        result.details.forEach(detail => console.log(`       ${detail}`));
      }
    });

    log('');
    log('Suggestions:', 'INFO');
    if (gates.failedAt === 'gate1') {
      log('  1. Ensure you are on the develop branch');
      log('  2. Commit any uncommitted changes');
      log('  3. Verify VERSION and CHANGELOG.md files exist');
    } else if (gates.failedAt === 'gate2') {
      log('  1. Add entries to [Unreleased] section in CHANGELOG.md');
      log('  2. Run: npm run validate:changelog');
    }

    log('');
    log('Fallback:', 'INFO');
    log('  To bypass gates and use Phase 4 directly:');
    log(`  npm run release -- --scope=${scope}`, 'CODE');

    process.exit(1);
  }

  log('✅ All safety gates passed!');

  if (dryRun) {
    log('ℹ️  Dry-run mode: Exiting without calling Phase 4');
    log('📋 To proceed with actual release, run without --dry-run flag');
    process.exit(0);
  }

  log('');
  log('Proceeding to Phase 4 release workflow...');
  log('');

  try {
    callPhase4();
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
}

(async () => {
  try {
    await runWithGates();
  } catch (err) {
    log(`Unexpected error: ${err.message}`, 'ERROR');
    log(err.stack, 'ERROR');
    process.exit(1);
  }
})();
