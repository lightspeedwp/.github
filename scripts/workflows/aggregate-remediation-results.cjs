#!/usr/bin/env node

/**
 * Aggregate Remediation Results
 *
 * Aggregates remediation logs from batch processing and generates
 * a summary report for metrics and progress tracking.
 */

const fs = require('fs');
const path = require('path');

// Read remediation logs
const reportsDir = 'reports';
let logFiles = [];

if (fs.existsSync(reportsDir)) {
  logFiles = fs
    .readdirSync(reportsDir)
    .filter((f) => f.startsWith('remediation-') && f.endsWith('.log'));
} else {
  console.warn(`Reports directory not found: ${reportsDir}`);
}

const results = {
  timestamp: new Date().toISOString(),
  logs_processed: logFiles.length,
  total_issues: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  handlers_executed: 0,
  handlers_failed: 0,
  handlers_skipped: 0,
  labels_processed: [],
  confidence_avg: 0,
  confidence_scores: [],
  auto_apply_eligible: 0,
  recommendations: {
    type: 0,
    areas: 0,
    priority: 0,
    assignees: 0,
    milestone: 0,
    template_fixes: 0,
  },
  errors: [],
};

// Parse each log file
let totalConfidence = 0;
let confidenceCount = 0;

logFiles.forEach((logFile) => {
  try {
    const content = fs.readFileSync(path.join(reportsDir, logFile), 'utf8');

    // Extract label name from filename
    const labelMatch = logFile.match(/remediation-(.*?)\.log/);
    if (labelMatch) {
      results.labels_processed.push(labelMatch[1]);
    }

    // Count issues processed
    const issueMatches = content.match(/🔧 Remediating #(\d+)/g);
    if (issueMatches) {
      results.total_issues += issueMatches.length;
    }

    // Count successes/failures
    const successMatches = content.match(/✅ .*: Success/g);
    if (successMatches) {
      results.successful += successMatches.length;
    }

    const failMatches = content.match(/❌ .*: Failed/g);
    if (failMatches) {
      results.failed += failMatches.length;
    }

    const skipMatches = content.match(/⏭️  .*: Skipped/g);
    if (skipMatches) {
      results.skipped += skipMatches.length;
    }

    // Extract confidence scores
    const confidenceMatches = content.match(/\*\*Confidence:\*\* (\d+)%/g);
    if (confidenceMatches) {
      confidenceMatches.forEach((match) => {
        const score = parseInt(match.match(/(\d+)/)[1]);
        results.confidence_scores.push(score);
        totalConfidence += score;
        confidenceCount++;
      });
    }

    // Count auto-apply eligible
    const autoApplyMatches = content.match(/\*\*Auto-Apply:\*\* ✅ Yes/g);
    if (autoApplyMatches) {
      results.auto_apply_eligible += autoApplyMatches.length;
    }

    // Count recommendations
    const typeRecs = content.match(/\*\*Type:\*\*/g);
    if (typeRecs) {
      results.recommendations.type += typeRecs.length;
    }

    const areaRecs = content.match(/\*\*Areas:/g);
    if (areaRecs) {
      results.recommendations.areas += areaRecs.length;
    }

    const priorityRecs = content.match(/\*\*Priority:/g);
    if (priorityRecs) {
      results.recommendations.priority += priorityRecs.length;
    }

    const assigneeRecs = content.match(/\*\*Assignees:/g);
    if (assigneeRecs) {
      results.recommendations.assignees += assigneeRecs.length;
    }

    const milestoneRecs = content.match(/\*\*Milestone:/g);
    if (milestoneRecs) {
      results.recommendations.milestone += milestoneRecs.length;
    }

    const templateRecs = content.match(/\*\*Template Issues:/g);
    if (templateRecs) {
      results.recommendations.template_fixes += templateRecs.length;
    }
  } catch (error) {
    results.errors.push({
      file: logFile,
      error: error.message,
    });
  }
});

// Calculate averages
if (confidenceCount > 0) {
  results.confidence_avg = Math.round(totalConfidence / confidenceCount);
}

// Calculate handler counts
results.handlers_executed = results.successful;
results.handlers_failed = results.failed;
results.handlers_skipped = results.skipped;

// Generate summary statistics
const summary = {
  timestamp: results.timestamp,
  execution_summary: {
    total_issues: results.total_issues,
    successfully_remediated: results.successful,
    failed: results.failed,
    skipped: results.skipped,
    success_rate: results.total_issues > 0 ? Math.round((results.successful / results.total_issues) * 100) : 0,
  },
  quality_metrics: {
    average_confidence: results.confidence_avg,
    auto_apply_eligible: results.auto_apply_eligible,
    auto_apply_rate:
      results.total_issues > 0 ? Math.round((results.auto_apply_eligible / results.total_issues) * 100) : 0,
  },
  recommendations_summary: {
    type_labels: results.recommendations.type,
    area_labels: results.recommendations.areas,
    priority_labels: results.recommendations.priority,
    assignee_suggestions: results.recommendations.assignees,
    milestone_assignments: results.recommendations.milestone,
    template_fixes: results.recommendations.template_fixes,
    total: Object.values(results.recommendations).reduce((a, b) => a + b, 0),
  },
  labels_processed: results.labels_processed,
  errors: results.errors,
};

// Output JSON
console.log(JSON.stringify(summary, null, 2));

// Exit with error if there were failures
if (results.errors.length > 0) {
  process.exit(1);
}
