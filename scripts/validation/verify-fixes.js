#!/usr/bin/env node

/**
 * Verification Script (T025)
 * Verifies that all broken reference fixes were applied successfully
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ReferenceDetector from './lib/reference-detector.js';
import FileScanner from './lib/file-scanner.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

class FixVerifier {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.reportPath = options.reportPath || 'agents/reports/broken-references-audit.json';
    this.detector = new ReferenceDetector();
    this.scanner = new FileScanner({ rootDir: this.rootDir });
    this.results = {
      verified: [],
      stillBroken: [],
      noLongerExists: [],
    };
  }

  /**
   * Load audit report
   */
  loadAuditReport() {
    const fullPath = path.join(this.rootDir, this.reportPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`Audit report not found: ${fullPath}`);
      return null;
    }
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  }

  /**
   * Verify a single fix
   */
  verifyFix(file, oldRef, newRef, refType) {
    const fullPath = path.join(this.rootDir, file);

    if (!fs.existsSync(fullPath)) {
      return {
        file,
        status: 'file-missing',
        message: `File no longer exists: ${file}`,
      };
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf-8');

      // Check that old reference is gone
      if (content.includes(oldRef)) {
        return {
          file,
          status: 'still-broken',
          message: `Old reference still found: ${oldRef}`,
          severity: 'HIGH',
        };
      }

      // Check that new reference is present
      if (!content.includes(newRef)) {
        return {
          file,
          status: 'fix-missing',
          message: `New reference not found: ${newRef}`,
          severity: 'HIGH',
        };
      }

      return {
        file,
        status: 'verified',
        message: `Fix verified: ${oldRef} → ${newRef}`,
      };
    } catch (error) {
      return {
        file,
        status: 'error',
        message: `Cannot read file: ${error.message}`,
        severity: 'ERROR',
      };
    }
  }

  /**
   * Verify all fixes from audit report
   */
  verifyAllFixes() {
    const report = this.loadAuditReport();
    if (!report) {
      return { success: false, message: 'No audit report found' };
    }

    console.log(`Verifying ${report.brokenCount || 0} fixes...`);

    for (const entry of report.byFile || []) {
      const result = this.verifyFix(
        entry.file,
        entry.reference,
        entry.suggestedFix,
        entry.referenceType
      );

      if (result.status === 'verified') {
        this.results.verified.push(result);
      } else if (result.status === 'still-broken') {
        this.results.stillBroken.push(result);
      } else {
        this.results.noLongerExists.push(result);
      }
    }

    return {
      success: this.results.stillBroken.length === 0,
      summary: {
        verified: this.results.verified.length,
        stillBroken: this.results.stillBroken.length,
        errors: this.results.noLongerExists.length,
      },
      results: this.results,
    };
  }

  /**
   * Generate verification report
   */
  generateReport(outputPath) {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        verified: this.results.verified.length,
        stillBroken: this.results.stillBroken.length,
        noLongerExists: this.results.noLongerExists.length,
        success: this.results.stillBroken.length === 0,
      },
      details: this.results,
    };

    if (outputPath) {
      fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    }

    return report;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const reportPath = args.includes('--report') ? args[args.indexOf('--report') + 1] : null;

  const verifier = new FixVerifier();
  const result = verifier.verifyAllFixes();

  if (reportPath) {
    verifier.generateReport(reportPath);
  }

  console.log('\n=== Fix Verification Results ===');
  console.log(`Verified: ${result.summary.verified}`);
  console.log(`Still Broken: ${result.summary.stillBroken}`);
  console.log(`Errors: ${result.summary.errors}`);
  console.log(`Success: ${result.success ? '✓' : '✗'}`);

  if (result.summary.stillBroken > 0) {
    console.log('\nStill Broken References:');
    result.results.stillBroken.forEach((r) => {
      console.log(`  ${r.file}: ${r.message}`);
    });
  }

  process.exit(result.success ? 0 : 1);
}

main().catch((error) => {
  console.error('Verification failed:', error);
  process.exit(1);
});
