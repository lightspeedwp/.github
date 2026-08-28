#!/usr/bin/env node
/**
 * Content Analysis Agent
 * Analyzes issue content and detects issue type
 * Part of the Issue Management Orchestration Workflow
 */

// Simple argument parser for this script
function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      result[key] = args[i + 1];
      i++;
    }
  }
  return result;
}

// Type detection patterns
const typePatterns = {
  bug: {
    keywords: ['bug', 'error', 'crash', 'fail', 'broken', 'issue', 'problem', 'not working', 'exception', 'defect'],
    pattern: /bug|error|crash|fail|broken|not working|exception|doesn't work/i
  },
  feature: {
    keywords: ['feature', 'enhancement', 'improve', 'add', 'new', 'request', 'capability'],
    pattern: /feature|enhancement|improve|add support|new capability|would like/i
  },
  documentation: {
    keywords: ['doc', 'document', 'guide', 'example', 'tutorial', 'readme', 'wiki', 'update docs'],
    pattern: /doc|document|guide|example|tutorial|readme|update.*doc/i
  },
  task: {
    keywords: ['task', 'chore', 'refactor', 'cleanup', 'update', 'maintenance'],
    pattern: /task|chore|refactor|cleanup|update|maintenance|housekeeping/i
  },
  security: {
    keywords: ['security', 'vulnerability', 'xss', 'csrf', 'injection', 'exploit', 'cve'],
    pattern: /security|vulnerability|xss|csrf|injection|exploit|cve|unsafe/i
  },
  performance: {
    keywords: ['performance', 'optimize', 'speed', 'slow', 'latency', 'throughput'],
    pattern: /performance|optimize|speed|slow|latency|throughput|efficiency/i
  },
  a11y: {
    keywords: ['accessibility', 'a11y', 'wcag', 'screen reader', 'contrast', 'keyboard'],
    pattern: /accessibility|a11y|wcag|screen reader|contrast|keyboard.*access/i
  },
  design: {
    keywords: ['design', 'ui', 'ux', 'layout', 'styling', 'appearance'],
    pattern: /design|ui|ux|layout|styling|appearance|visual/i
  }
};

// Analyze issue content
function analyzeIssue(title, body) {
  const content = `${title} ${body}`.toLowerCase();

  let detectedType = 'task'; // Conservative default
  let confidence = 0;

  // Test each type pattern
  for (const [type, { pattern }] of Object.entries(typePatterns)) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      // Higher confidence for more matches
      const matchCount = matches.length;
      if (matchCount > confidence) {
        confidence = Math.min(matchCount / 5, 1.0); // Normalize to 0-1
        detectedType = type;
      }
    }
  }

  // Special cases
  if (content.includes('reproduction steps') || content.includes('steps to reproduce')) {
    if (detectedType !== 'bug') {
      detectedType = 'bug';
      confidence = Math.max(confidence, 0.85);
    }
  }

  if (content.includes('acceptance criteria') || content.includes('definition of done')) {
    if (detectedType !== 'feature') {
      confidence = Math.max(confidence, 0.75);
    }
  }

  return {
    type: detectedType,
    confidence: Math.round(confidence * 100) / 100
  };
}

// Extract keywords
function extractKeywords(title, body) {
  const content = `${title} ${body}`.toLowerCase();
  const keywords = new Set();

  // Extract technology keywords
  const techKeywords = ['react', 'vue', 'angular', 'node', 'js', 'typescript', 'php', 'python', 'java', 'rust', 'go', 'database', 'api', 'frontend', 'backend', 'mobile', 'web', 'cli', 'rest'];
  techKeywords.forEach(keyword => {
    if (content.includes(keyword)) keywords.add(keyword);
  });

  // Extract platform keywords
  const platforms = ['windows', 'mac', 'linux', 'ios', 'android', 'chrome', 'firefox', 'safari'];
  platforms.forEach(platform => {
    if (content.includes(platform)) keywords.add(platform);
  });

  // Extract priority indicators
  if (content.includes('critical') || content.includes('urgent') || content.includes('blocking')) {
    keywords.add('urgent');
  }

  return Array.from(keywords);
}

// Assess structure quality
function assessStructure(title, body) {
  let score = 100;

  if (!title || title.length < 5) {
    score -= 30;
  } else if (title.length < 10) {
    score -= 10;
  }

  if (!body || body.length < 20) {
    score -= 40;
  } else if (body.length < 100) {
    score -= 20;
  }

  if (body && (body.includes('**Steps:') || body.includes('**Expected:') || body.includes('**Actual:'))) {
    score += 20;
  }

  let quality;
  if (score >= 80) quality = 'excellent';
  else if (score >= 60) quality = 'good';
  else if (score >= 40) quality = 'fair';
  else quality = 'poor';

  return quality;
}

// Main execution
async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));

    // Mock GitHub API for demonstration
    // In production, this would fetch from GitHub API using a token
    const issueNumber = args.issue;
    const repo = args.repo;

    if (!issueNumber || !repo) {
      console.error('Missing required arguments: --issue and --repo');
      process.exit(1);
    }

    console.log(`Content Analysis Agent: Starting analysis of issue #${issueNumber}`);

    // Mock issue data - in production would fetch from GitHub
    const issue = {
      number: issueNumber,
      title: 'Test Issue Title',
      body: 'This is a test issue body with details about the problem.',
      author: 'test-user'
    };

    // Perform analysis
    const { type, confidence } = analyzeIssue(issue.title, issue.body);
    const keywords = extractKeywords(issue.title, issue.body);
    const structure = assessStructure(issue.title, issue.body);

    // Generate suggested labels
    const labels = [`type:${type}`, 'status:needs-triage', 'priority:normal'];
    keywords.forEach(keyword => {
      if (keyword === 'urgent') labels.push('priority:high');
    });

    // Output results as GitHub Actions outputs
    console.log('::set-output name=type::' + type);
    console.log('::set-output name=confidence::' + confidence);
    console.log('::set-output name=keywords::' + JSON.stringify(keywords));
    console.log('::set-output name=labels::' + JSON.stringify(labels));
    console.log('::set-output name=status::success');

    console.log(`✓ Analysis complete: type=${type}, confidence=${confidence * 100}%`);
    process.exit(0);

  } catch (error) {
    console.error('Content Analysis Error:', error.message);
    console.log('::set-output name=status::error');
    process.exit(1);
  }
}

main();
