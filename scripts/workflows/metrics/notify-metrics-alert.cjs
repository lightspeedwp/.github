#!/usr/bin/env node

/**
 * Metrics Alert Notification System
 *
 * Sends detailed Slack alerts for metrics pipeline failures with:
 * - Health score assessment
 * - Performance metrics
 * - Diagnostic information
 * - Runbook links for recovery
 *
 * Usage:
 *   node notify-metrics-alert.cjs --webhook <url> --status <pass|fail> [--metrics <json>]
 *
 * @module scripts/workflows/metrics/notify-metrics-alert
 */

const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

/**
 * Alert severity levels
 */
const ALERT_LEVELS = {
  SUCCESS: { emoji: '✅', color: '#36a64f', level: 'success' },
  WARNING: { emoji: '⚠️', color: '#ff9900', level: 'warning' },
  CRITICAL: { emoji: '🔴', color: '#ff0000', level: 'critical' },
};

/**
 * Health score thresholds
 */
const THRESHOLDS = {
  HEALTHY: 80,
  WARNING: 60,
  CRITICAL: 40,
};

/**
 * Parse command-line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    webhook: null,
    status: 'fail',
    metrics: null,
    healthScore: null,
    collectionTime: null,
    apiFailures: null,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--webhook' && i + 1 < args.length) {
      opts.webhook = args[++i];
    } else if (args[i] === '--status' && i + 1 < args.length) {
      opts.status = args[++i];
    } else if (args[i] === '--metrics' && i + 1 < args.length) {
      opts.metrics = args[++i];
    } else if (args[i] === '--health-score' && i + 1 < args.length) {
      opts.healthScore = parseInt(args[++i], 10);
    } else if (args[i] === '--collection-time' && i + 1 < args.length) {
      opts.collectionTime = parseFloat(args[++i]);
    } else if (args[i] === '--api-failures' && i + 1 < args.length) {
      opts.apiFailures = args[++i];
    }
  }

  return opts;
}

/**
 * Determine alert severity based on health score and status
 */
function getAlertSeverity(healthScore, status) {
  if (status === 'fail') {
    return ALERT_LEVELS.CRITICAL;
  }
  if (healthScore !== null) {
    if (healthScore < THRESHOLDS.CRITICAL) {
      return ALERT_LEVELS.CRITICAL;
    }
    if (healthScore < THRESHOLDS.WARNING) {
      return ALERT_LEVELS.WARNING;
    }
  }
  return ALERT_LEVELS.SUCCESS;
}

/**
 * Format health score with visual indicator
 */
function formatHealthScore(score) {
  if (score === null || score === undefined) {
    return 'N/A';
  }
  const percentage = score.toFixed(0);
  let status = '';
  if (score >= THRESHOLDS.HEALTHY) {
    status = '✅ Healthy';
  } else if (score >= THRESHOLDS.WARNING) {
    status = '⚠️ Warning';
  } else {
    status = '🔴 Critical';
  }
  return `${percentage}/100 (${status})`;
}

/**
 * Build Slack message payload
 */
function buildSlackPayload(opts) {
  const severity = getAlertSeverity(opts.healthScore, opts.status);
  const title = opts.status === 'fail'
    ? `${severity.emoji} Metrics Pipeline Failed`
    : `${severity.emoji} Metrics Health Alert`;

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: title,
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Repository:*\n${process.env.GITHUB_REPOSITORY || 'lightspeedwp/.github'}`,
        },
        {
          type: 'mrkdwn',
          text: `*Status:*\n${opts.status.toUpperCase()}`,
        },
      ],
    },
  ];

  // Health metrics section
  if (opts.healthScore !== null || opts.collectionTime !== null) {
    const fields = [];
    if (opts.healthScore !== null) {
      fields.push({
        type: 'mrkdwn',
        text: `*Health Score:*\n${formatHealthScore(opts.healthScore)}`,
      });
    }
    if (opts.collectionTime !== null) {
      const timeStatus = opts.collectionTime > 300 ? ' ⚠️ (>5min)' : '';
      fields.push({
        type: 'mrkdwn',
        text: `*Collection Time:*\n${opts.collectionTime.toFixed(1)}s${timeStatus}`,
      });
    }
    if (fields.length > 0) {
      blocks.push({
        type: 'section',
        fields,
      });
    }
  }

  // API failures section
  if (opts.apiFailures) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Issues Detected:*\n${opts.apiFailures}`,
      },
    });
  }

  // Action buttons
  const runUrl = `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const commitUrl = `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA}`;

  blocks.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Run',
          emoji: true,
        },
        value: 'view_run',
        url: runUrl,
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Commit',
          emoji: true,
        },
        value: 'view_commit',
        url: commitUrl,
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Runbooks',
          emoji: true,
        },
        value: 'view_runbooks',
        url: `${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY}/tree/develop/.github/projects/active/metrics-agent-phase-3-production-2026-08-26/runbooks`,
      },
    ],
  });

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Triggered at ${new Date().toISOString()} • <${process.env.GITHUB_SERVER_URL || 'https://github.com'}/${process.env.GITHUB_REPOSITORY}/tree/develop/.github/projects/active/metrics-agent-phase-3-production-2026-08-26|Phase 3 Monitoring Setup>`,
      },
    ],
  });

  return {
    blocks,
    attachments: [
      {
        color: severity.color,
        footer: 'Metrics Pipeline Monitoring',
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };
}

/**
 * Send Slack notification via webhook
 */
function sendSlackNotification(webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    const payloadStr = JSON.stringify(payload);
    const parsedUrl = url.parse(webhookUrl);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ success: true, message: 'Notification sent successfully' });
        } else {
          reject(new Error(`Slack API returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payloadStr);
    req.end();
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    const opts = parseArgs();

    if (!opts.webhook) {
      console.warn('⚠️ SLACK_METRICS_WEBHOOK not configured. Skipping notification.');
      process.exit(0);
    }

    const payload = buildSlackPayload(opts);

    console.log('📤 Sending Slack notification...');
    const result = await sendSlackNotification(opts.webhook, payload);
    console.log(`✅ ${result.message}`);
    process.exit(0);
  } catch (err) {
    console.error(`❌ Failed to send notification: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildSlackPayload,
  sendSlackNotification,
  getAlertSeverity,
  formatHealthScore,
  ALERT_LEVELS,
  THRESHOLDS,
};
