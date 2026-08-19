/**
 * Trend Analyzer — Period-over-period metric calculations
 * Calculates trends, growth rates, and comparative analysis
 */

const { MetricsStorage } = require("./metrics-storage");

class TrendAnalyzer {
  constructor(storageDir = ".githu./.github/reports/metrics") {
    this.storage = new MetricsStorage(storageDir);
  }

  calculateWeeklyTrend(repository) {
    const history = this.storage.getMetricsSince(repository, 14);

    if (history.length < 2) {
      return null;
    }

    // Split into two weeks
    const midpoint = Math.floor(history.length / 2);
    const weekOne = history.slice(0, midpoint);
    const weekTwo = history.slice(midpoint);

    if (weekOne.length === 0 || weekTwo.length === 0) {
      return null;
    }

    const avgWeekOne = this.averageMetrics(weekOne);
    const avgWeekTwo = this.averageMetrics(weekTwo);

    return this.calculateDeltas(avgWeekOne, avgWeekTwo, "week-over-week");
  }

  calculateMonthlyTrend(repository) {
    const history = this.storage.getMetricsSince(repository, 60);

    if (history.length < 2) {
      return null;
    }

    // Compare most recent 30 days with prior 30 days
    const midpoint = Math.floor(history.length / 2);
    const monthOne = history.slice(0, midpoint);
    const monthTwo = history.slice(midpoint);

    if (monthOne.length === 0 || monthTwo.length === 0) {
      return null;
    }

    const avgMonthOne = this.averageMetrics(monthOne);
    const avgMonthTwo = this.averageMetrics(monthTwo);

    return this.calculateDeltas(avgMonthOne, avgMonthTwo, "month-over-month");
  }

  calculateDeltas(baseline, current, period) {
    const deltas = {
      period,
      timestamp: Date.now(),
      changes: {},
    };

    // Calculate changes for numeric metrics
    for (const category in current.metrics) {
      if (current.metrics[category] && baseline.metrics[category]) {
        deltas.changes[category] = {};

        for (const metric in current.metrics[category]) {
          const baseVal = parseFloat(baseline.metrics[category][metric]) || 0;
          const currVal = parseFloat(current.metrics[category][metric]) || 0;

          if (baseVal === 0 && currVal === 0) {
            deltas.changes[category][metric] = { delta: 0, percent: 0 };
          } else if (baseVal === 0) {
            deltas.changes[category][metric] = {
              delta: currVal,
              percent: 100,
            };
          } else {
            const delta = currVal - baseVal;
            const percent = (delta / baseVal) * 100;
            deltas.changes[category][metric] = { delta, percent };
          }
        }
      }
    }

    return deltas;
  }

  averageMetrics(entries) {
    if (entries.length === 0) {
      return null;
    }

    const summed = {
      metrics: {
        issues: {},
        pull_requests: {},
        contributors: {},
      },
    };

    // Sum all numeric values
    entries.forEach((entry) => {
      for (const category in entry.metrics) {
        if (entry.metrics[category]) {
          for (const metric in entry.metrics[category]) {
            const val = parseFloat(entry.metrics[category][metric]) || 0;
            if (!summed.metrics[category][metric]) {
              summed.metrics[category][metric] = 0;
            }
            summed.metrics[category][metric] += val;
          }
        }
      }
    });

    // Calculate averages
    for (const category in summed.metrics) {
      for (const metric in summed.metrics[category]) {
        summed.metrics[category][metric] /= entries.length;
      }
    }

    return summed;
  }

  getGrowthRate(repository, metricPath, days = 30) {
    const history = this.storage.getMetricsSince(repository, days);

    if (history.length < 2) {
      return null;
    }

    const first = this.getMetricValue(history[0], metricPath);
    const last = this.getMetricValue(history[history.length - 1], metricPath);

    if (first === null || last === null) {
      return null;
    }

    if (first === 0 && last === 0) {
      return 0;
    }

    if (first === 0) {
      return 100;
    }

    return ((last - first) / first) * 100;
  }

  getMetricValue(entry, path) {
    const parts = path.split(".");
    let value = entry;

    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return null;
      }
    }

    return parseFloat(value) || null;
  }

  predictNextValue(repository, metricPath, days = 30) {
    const history = this.storage.getMetricsSince(repository, days);

    if (history.length < 3) {
      return null;
    }

    const values = history
      .map((entry) => this.getMetricValue(entry, metricPath))
      .filter((v) => v !== null);

    if (values.length < 2) {
      return null;
    }

    // Simple linear regression prediction
    const n = values.length;
    const meanX = (n - 1) / 2;
    const meanY = values.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    values.forEach((y, x) => {
      numerator += (x - meanX) * (y - meanY);
      denominator += (x - meanX) ** 2;
    });

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = meanY - slope * meanX;

    // Predict next value
    return intercept + slope * n;
  }
}

module.exports = { TrendAnalyzer };
