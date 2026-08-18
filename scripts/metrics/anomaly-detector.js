/**
 * Anomaly Detector — Identifies metrics that deviate significantly from baseline
 * Flags anomalies when metrics deviate >50% from moving average
 */

const { MetricsStorage } = require("./metrics-storage");

class AnomalyDetector {
  constructor(storageDir = ".github/reports/metrics", deviationThreshold = 0.5) {
    this.storage = new MetricsStorage(storageDir);
    this.deviationThreshold = deviationThreshold; // 0.5 = 50%
  }

  detectAnomalies(repository, days = 30) {
    const history = this.storage.getMetricsSince(repository, days);

    if (history.length < 3) {
      return { anomalies: [], confidence: 0 };
    }

    const anomalies = [];
    const latest = history[history.length - 1];

    // Calculate moving average for each metric
    for (const category in latest.metrics) {
      if (latest.metrics[category]) {
        for (const metricName in latest.metrics[category]) {
          const values = history
            .map((entry) => {
              const val = entry.metrics[category]?.[metricName];
              return val !== undefined ? parseFloat(val) : null;
            })
            .filter((v) => v !== null);

          if (values.length < 2) {
            continue;
          }

          const latestValue = values[values.length - 1];
          const movingAvg = this.calculateMovingAverage(values, 7);
          const stdDev = this.calculateStdDev(values);
          const deviation = Math.abs(latestValue - movingAvg) / (movingAvg || 1);

          if (deviation > this.deviationThreshold) {
            anomalies.push({
              category,
              metric: metricName,
              value: latestValue,
              baseline: movingAvg,
              deviation: (deviation * 100).toFixed(2),
              severity: this.calculateSeverity(deviation),
              timestamp: latest.timestamp,
            });
          }
        }
      }
    }

    return {
      anomalies: anomalies.sort((a, b) => parseFloat(b.deviation) - parseFloat(a.deviation)),
      confidence: Math.min(history.length / 30, 1), // Max confidence at 30 data points
      timestamp: Date.now(),
    };
  }

  detectTrendBreak(repository, days = 30) {
    const history = this.storage.getMetricsSince(repository, days);

    if (history.length < 4) {
      return { trends: [], confidence: 0 };
    }

    const trends = [];
    const latest = history[history.length - 1];

    for (const category in latest.metrics) {
      if (latest.metrics[category]) {
        for (const metricName in latest.metrics[category]) {
          const values = history
            .map((entry) => {
              const val = entry.metrics[category]?.[metricName];
              return val !== undefined ? parseFloat(val) : null;
            })
            .filter((v) => v !== null);

          if (values.length < 3) {
            continue;
          }

          // Compare recent slope to historical slope
          const midpoint = Math.floor(values.length / 2);
          const oldSlope = this.calculateSlope(values.slice(0, midpoint));
          const newSlope = this.calculateSlope(values.slice(midpoint));

          // Detect reversal or acceleration
          if (oldSlope !== 0 && newSlope !== 0) {
            const slopeChange = (newSlope - oldSlope) / Math.abs(oldSlope);

            if (Math.abs(slopeChange) > 0.5) {
              trends.push({
                category,
                metric: metricName,
                oldTrend: oldSlope > 0 ? "increasing" : "decreasing",
                newTrend: newSlope > 0 ? "increasing" : "decreasing",
                acceleration: (slopeChange * 100).toFixed(2),
                timestamp: latest.timestamp,
              });
            }
          }
        }
      }
    }

    return {
      trends: trends.sort((a, b) => parseFloat(b.acceleration) - parseFloat(a.acceleration)),
      confidence: Math.min(history.length / 30, 1),
      timestamp: Date.now(),
    };
  }

  calculateMovingAverage(values, window = 7) {
    if (values.length === 0) return 0;

    const windowSize = Math.min(window, values.length);
    const recent = values.slice(-windowSize);
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  }

  calculateStdDev(values) {
    if (values.length < 2) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }

  calculateSlope(values) {
    if (values.length < 2) return 0;

    const n = values.length;
    const meanX = (n - 1) / 2;
    const meanY = values.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    values.forEach((y, x) => {
      numerator += (x - meanX) * (y - meanY);
      denominator += (x - meanX) ** 2;
    });

    return denominator !== 0 ? numerator / denominator : 0;
  }

  calculateSeverity(deviation) {
    if (deviation > 1.0) return "critical";
    if (deviation > 0.75) return "high";
    if (deviation > 0.5) return "medium";
    return "low";
  }

  getBaselineStatistics(repository, days = 30) {
    const history = this.storage.getMetricsSince(repository, days);

    if (history.length === 0) {
      return {};
    }

    const stats = {};

    const latest = history[history.length - 1];
    for (const category in latest.metrics) {
      if (latest.metrics[category]) {
        stats[category] = {};

        for (const metricName in latest.metrics[category]) {
          const values = history
            .map((entry) => {
              const val = entry.metrics[category]?.[metricName];
              return val !== undefined ? parseFloat(val) : null;
            })
            .filter((v) => v !== null);

          if (values.length > 0) {
            stats[category][metricName] = {
              mean: values.reduce((a, b) => a + b, 0) / values.length,
              min: Math.min(...values),
              max: Math.max(...values),
              stdDev: this.calculateStdDev(values),
            };
          }
        }
      }
    }

    return stats;
  }
}

module.exports = { AnomalyDetector };
