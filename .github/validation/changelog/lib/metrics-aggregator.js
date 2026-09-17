import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MetricsAggregator {
  constructor(metricsPath = null) {
    this.metricsPath = metricsPath || path.join(__dirname, '..', 'data', 'metrics.json');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    const dataDir = path.dirname(this.metricsPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  aggregateValidation(validationResult) {
    const { total_entries, passed, failed, validations } = validationResult;

    const snapshot = {
      snapshot_id: `snapshot-${Date.now()}`,
      timestamp: new Date().toISOString(),
      snapshot_period: 'daily',
      total_entries,
      compliant_entries: passed,
      compliance_percent: total_entries > 0 ? ((passed / total_entries) * 100).toFixed(1) : 0,
      length_distribution: this.calculateLengthDistribution(validations),
      impl_detail_rate: this.calculateImplDetailRate(validations),
      pr_link_coverage: this.calculatePRLinkCoverage(validations),
      issues_found: this.categorizeViolations(validations),
      trend_vs_previous: this.calculateTrend(passed, failed),
    };

    return snapshot;
  }

  calculateLengthDistribution(validations) {
    const buckets = {
      '0_to_100': 0,
      '100_to_250': 0,
      '250_to_500': 0,
      '500_plus': 0,
    };

    for (const validation of validations) {
      if (!validation.entry_metadata) {
        continue;
      }

      const contentLength = validation.entry_metadata.contentLength || 0;

      if (contentLength <= 100) {
        buckets['0_to_100']++;
      } else if (contentLength <= 250) {
        buckets['100_to_250']++;
      } else if (contentLength <= 500) {
        buckets['250_to_500']++;
      } else {
        buckets['500_plus']++;
      }
    }

    const total = Object.values(buckets).reduce((sum, count) => sum + count, 0);

    if (total === 0) {
      return buckets;
    }

    return {
      '0_to_100': ((buckets['0_to_100'] / total) * 100).toFixed(1),
      '100_to_250': ((buckets['100_to_250'] / total) * 100).toFixed(1),
      '250_to_500': ((buckets['250_to_500'] / total) * 100).toFixed(1),
      '500_plus': ((buckets['500_plus'] / total) * 100).toFixed(1),
    };
  }

  calculateImplDetailRate(validations) {
    let entriesWithImplDetails = 0;

    for (const validation of validations) {
      if (!validation.violations) {
        continue;
      }

      const hasImplDetailViolation = validation.violations.some(
        (v) => v.rule_id === 'CHK_NO_IMPL_DETAILS' && !v.passed
      );

      if (hasImplDetailViolation) {
        entriesWithImplDetails++;
      }
    }

    const total = validations.length || 1;
    return ((entriesWithImplDetails / total) * 100).toFixed(1);
  }

  calculatePRLinkCoverage(validations) {
    let entriesWithPRLink = 0;

    for (const validation of validations) {
      if (!validation.violations) {
        continue;
      }

      const hasPRLinkViolation = validation.violations.some(
        (v) => v.rule_id === 'CHK_HAS_PR_LINK' && v.passed === true
      );

      if (hasPRLinkViolation || validation.entry_metadata?.hasPRLink) {
        entriesWithPRLink++;
      }
    }

    const total = validations.length || 1;
    return ((entriesWithPRLink / total) * 100).toFixed(1);
  }

  categorizeViolations(validations) {
    const violations = {};

    for (const validation of validations) {
      if (!validation.violations || validation.violations.length === 0) {
        continue;
      }

      for (const violation of validation.violations) {
        const ruleId = violation.rule_id;
        if (!violations[ruleId]) {
          violations[ruleId] = {
            rule_id: ruleId,
            count: 0,
            severity: violation.severity,
            examples: [],
          };
        }

        violations[ruleId].count++;

        if (violations[ruleId].examples.length < 3) {
          violations[ruleId].examples.push({
            entry_id: validation.entry_id,
            message: violation.message,
          });
        }
      }
    }

    return Object.values(violations);
  }

  calculateTrend(currentPassed, currentFailed) {
    try {
      const previousMetrics = this.getLatestMetrics();

      if (!previousMetrics) {
        return {
          compliance_delta: 0,
          entries_added: currentPassed + currentFailed,
          entries_refactored: 0,
        };
      }

      const previousCompliance = parseFloat(previousMetrics.compliance_percent);
      const currentTotal = currentPassed + currentFailed;
      const previousTotal = previousMetrics.total_entries;

      const complianceDelta = ((currentPassed / currentTotal) * 100 - previousCompliance).toFixed(
        1
      );

      return {
        compliance_delta: parseFloat(complianceDelta),
        entries_added: Math.max(0, currentTotal - previousTotal),
        entries_refactored: Math.max(0, previousTotal - currentTotal),
      };
    } catch (error) {
      return {
        compliance_delta: 0,
        entries_added: currentPassed + currentFailed,
        entries_refactored: 0,
      };
    }
  }

  saveMetrics(snapshot) {
    try {
      let metricsData = { snapshots: [] };

      if (fs.existsSync(this.metricsPath)) {
        const existing = fs.readFileSync(this.metricsPath, 'utf-8');
        metricsData = JSON.parse(existing);
      }

      metricsData.snapshots.push(snapshot);

      metricsData.snapshots = this.retainLastDaysMetrics(metricsData.snapshots, 90);

      metricsData.last_updated = new Date().toISOString();
      metricsData.latest_snapshot = snapshot;

      fs.writeFileSync(this.metricsPath, JSON.stringify(metricsData, null, 2));

      return {
        success: true,
        path: this.metricsPath,
        snapshot_id: snapshot.snapshot_id,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  retainLastDaysMetrics(snapshots, days) {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

    return snapshots.filter((snapshot) => {
      const snapshotTime = new Date(snapshot.timestamp).getTime();
      return snapshotTime >= cutoffTime;
    });
  }

  getLatestMetrics() {
    try {
      if (!fs.existsSync(this.metricsPath)) {
        return null;
      }

      const content = fs.readFileSync(this.metricsPath, 'utf-8');
      const data = JSON.parse(content);

      return data.latest_snapshot || null;
    } catch (error) {
      return null;
    }
  }

  getAllMetrics() {
    try {
      if (!fs.existsSync(this.metricsPath)) {
        return { snapshots: [] };
      }

      const content = fs.readFileSync(this.metricsPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to read metrics:', error.message);
      return { snapshots: [], error: error.message };
    }
  }

  getMetricsSummary() {
    const allMetrics = this.getAllMetrics();

    if (!allMetrics.latest_snapshot) {
      return {
        status: 'no_data',
        message: 'No metrics recorded yet',
      };
    }

    const latest = allMetrics.latest_snapshot;

    return {
      status: 'healthy',
      compliance_percent: latest.compliance_percent,
      total_entries: latest.total_entries,
      compliant_entries: latest.compliant_entries,
      compliance_status:
        latest.compliance_percent >= 90
          ? 'excellent'
          : latest.compliance_percent >= 75
            ? 'good'
            : 'needs_improvement',
      length_distribution: latest.length_distribution,
      impl_detail_rate: latest.impl_detail_rate,
      pr_link_coverage: latest.pr_link_coverage,
      top_issues: (latest.issues_found || []).sort((a, b) => b.count - a.count).slice(0, 3),
      last_updated: latest.timestamp,
    };
  }
}

export default MetricsAggregator;
