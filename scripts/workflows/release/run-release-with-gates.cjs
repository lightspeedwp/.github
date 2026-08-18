#!/usr/bin/env node

/**
 * Phase 5A Release Agent — Integration Wrapper
 *
 * Orchestrates Phase 5A safety gates before calling Phase 4 release agent.
 * Implements AUGMENT strategy: wraps Phase 4 without breaking changes.
 *
 * Flow:
 *   1. Run all 7 safety gates
 *   2. If gates pass, call Phase 4 release agent
 *   3. If gates fail, return error without touching releases
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ReleaseGates = require('../../gates/release-gates.cjs');

function main() {
  const isDryRun = process.env.INPUT_DRY_RUN === 'true';
  const verbose = process.env.VERBOSE === 'true';

  console.log('\n📋 Phase 5A Release Agent with Safety Gates');
  console.log('═'.repeat(50));

  // Initialize gates
  const gates = new ReleaseGates({
    verbose,
    logDir: './.agentic-logs',
  });

  try {
    // Run all 7 gates
    console.log('\n🔐 Running 7-layer safety gates...\n');

    gates.gate1Preflight();
    if (!gates.results.gate1_preflight.passed) {
      logGateFailed('GATE 1: Pre-flight Checks', gates.results.gate1_preflight.details);
      gates.failedAt = 'GATE 1';
      gates.saveAuditLog();
      process.exit(1);
    }
    logGatePassed('GATE 1: Pre-flight Checks', gates.results.gate1_preflight.details);

    gates.gate2AgenticScore();
    if (!gates.results.gate2_agentic.passed) {
      logGateFailed('GATE 2: Agentic Reasoning Score', gates.results.gate2_agentic.details);
      gates.failedAt = 'GATE 2';
      gates.saveAuditLog();
      process.exit(1);
    }
    logGatePassed('GATE 2: Agentic Reasoning Score', gates.results.gate2_agentic.details);

    gates.gate3VersionConsistency();
    if (!gates.results.gate3_version.passed) {
      logGateFailed('GATE 3: Version Consistency', gates.results.gate3_version.details);
      gates.failedAt = 'GATE 3';
      gates.saveAuditLog();
      process.exit(1);
    }
    logGatePassed('GATE 3: Version Consistency', gates.results.gate3_version.details);

    gates.gate4TagUniqueness();
    if (!gates.results.gate4_tag_unique.passed) {
      logGateFailed('GATE 4: Tag Uniqueness', gates.results.gate4_tag_unique.details);
      gates.failedAt = 'GATE 4';
      gates.saveAuditLog();
      process.exit(1);
    }
    logGatePassed('GATE 4: Tag Uniqueness', gates.results.gate4_tag_unique.details);

    gates.gate5Authorization();
    if (!gates.results.gate5_authorization.passed) {
      logGateFailed('GATE 5: Authorization', gates.results.gate5_authorization.details);
      gates.failedAt = 'GATE 5';
      gates.saveAuditLog();
      process.exit(1);
    }
    logGatePassed('GATE 5: Authorization', gates.results.gate5_authorization.details);

    gates.gate6IntegrityFilter();
    if (!gates.results.gate6_integrity.passed) {
      logGateFailed('GATE 6: Integrity Filter', gates.results.gate6_integrity.details);
      gates.failedAt = 'GATE 6';
      gates.saveAuditLog();
      process.exit(1);
    }
    logGatePassed('GATE 6: Integrity Filter', gates.results.gate6_integrity.details);

    gates.gate7ApprovalEnforcement();
    if (!gates.results.gate7_approval.passed) {
      logGateFailed('GATE 7: Approval Enforcement', gates.results.gate7_approval.details);
      gates.failedAt = 'GATE 7';
      gates.saveAuditLog();
      process.exit(1);
    }
    logGatePassed('GATE 7: Approval Enforcement', gates.results.gate7_approval.details);

    // All gates passed
    console.log('\n✅ All 7 safety gates PASSED\n');
    gates.saveAuditLog();

    if (isDryRun) {
      console.log('🔍 DRY-RUN MODE: Skipping Phase 4 release agent execution\n');
      process.exit(0);
    }

    // Call Phase 4 release agent
    console.log('📦 Calling Phase 4 release agent...\n');
    execSync('node scripts/workflows/release/run-release-agent.cjs', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

  } catch (error) {
    console.error(`\n❌ Release workflow failed: ${error.message}`);
    gates.failedAt = gates.failedAt || 'UNKNOWN';
    gates.saveAuditLog();
    process.exit(1);
  }
}

function logGatePassed(gateName, details = []) {
  console.log(`✅ ${gateName}`);
  details.forEach(detail => {
    if (!detail.startsWith('❌')) {
      console.log(`   ${detail}`);
    }
  });
}

function logGateFailed(gateName, details = []) {
  console.error(`\n❌ ${gateName} FAILED`);
  details.forEach(detail => {
    console.error(`   ${detail}`);
  });
}

main();
