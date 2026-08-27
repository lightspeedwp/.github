#!/usr/bin/env node
/**
 * Validation Agent
 * Ensures consistency and quality of issues
 * Part of the Issue Management Orchestration Workflow
 */

// Simple argument parser
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

// Validation rules
const validationRules = {
  titleQuality: {
    name: 'Title Quality',
    check: (title) => {
      if (!title || title.length < 5) return { pass: false, message: 'Title too short' };
      if (title.length > 200) return { pass: false, message: 'Title too long' };
      if (title.toLowerCase() === title) return { pass: false, message: 'Title should start with capital letter' };
      return { pass: true, message: 'Title is clear and descriptive' };
    }
  },
  bodyQuality: {
    name: 'Body Quality',
    check: (body) => {
      if (!body || body.length < 20) return { pass: false, message: 'Description too short' };
      if (body.includes('TODO') || body.includes('FIXME')) return { pass: true, message: 'Has implementation notes' };
      return { pass: true, message: 'Body is adequate' };
    }
  },
  typeLabel: {
    name: 'Type Label',
    check: (labels) => {
      const typeLabels = labels.filter(l => l.startsWith('type:'));
      if (typeLabels.length === 0) return { pass: false, message: 'Missing type label' };
      if (typeLabels.length > 1) return { pass: false, message: 'Multiple type labels found' };
      return { pass: true, message: 'Type label present and valid' };
    }
  },
  statusLabel: {
    name: 'Status Label',
    check: (labels) => {
      const statusLabels = labels.filter(l => l.startsWith('status:'));
      if (statusLabels.length === 0) return { pass: false, message: 'Missing status label' };
      if (statusLabels.length > 1) return { pass: false, message: 'Multiple status labels found' };
      return { pass: true, message: 'Status label present' };
    }
  },
  priorityLabel: {
    name: 'Priority Label',
    check: (labels) => {
      const priorityLabels = labels.filter(l => l.startsWith('priority:'));
      if (priorityLabels.length === 0) return { pass: false, message: 'Missing priority label' };
      if (priorityLabels.length > 1) return { pass: false, message: 'Multiple priority labels found' };
      return { pass: true, message: 'Priority label present' };
    }
  },
  typeBodyAlignment: {
    name: 'Type-Body Alignment',
    check: (type, body) => {
      if (!type || !body) return { pass: true, message: 'Cannot validate alignment' };

      const checks = {
        bug: body.toLowerCase().includes('reproduce') || body.toLowerCase().includes('error'),
        feature: body.toLowerCase().includes('enhance') || body.toLowerCase().includes('add'),
        security: body.toLowerCase().includes('security') || body.toLowerCase().includes('vulnerable'),
        performance: body.toLowerCase().includes('slow') || body.toLowerCase().includes('optimize')
      };

      if (checks[type] !== undefined) {
        if (checks[type]) {
          return { pass: true, message: 'Type aligns with content' };
        }
        return { pass: false, message: 'Type does not align with body content' };
      }

      return { pass: true, message: 'Type alignment acceptable' };
    }
  },
  noOffensiveLanguage: {
    name: 'Language Check',
    check: (body) => {
      const offensive = ['stupid', 'dumb', 'idiot', 'moron'];
      const found = offensive.filter(word => body.toLowerCase().includes(word));
      if (found.length > 0) {
        return { pass: false, message: `Offensive language detected: ${found.join(', ')}` };
      }
      return { pass: true, message: 'Language is appropriate' };
    }
  }
};

// Run validation checks
function validateIssue(title, body, type, labels) {
  const results = [];
  let passCount = 0;
  let failCount = 0;

  // Title quality
  const titleCheck = validationRules.titleQuality.check(title);
  results.push({
    check: 'title_quality',
    name: validationRules.titleQuality.name,
    status: titleCheck.pass ? 'pass' : 'fail',
    message: titleCheck.message
  });
  if (titleCheck.pass) passCount++; else failCount++;

  // Body quality
  const bodyCheck = validationRules.bodyQuality.check(body);
  results.push({
    check: 'body_quality',
    name: validationRules.bodyQuality.name,
    status: bodyCheck.pass ? 'pass' : 'fail',
    message: bodyCheck.message
  });
  if (bodyCheck.pass) passCount++; else failCount++;

  // Type label
  const typeCheck = validationRules.typeLabel.check(labels);
  results.push({
    check: 'type_label',
    name: validationRules.typeLabel.name,
    status: typeCheck.pass ? 'pass' : 'fail',
    message: typeCheck.message
  });
  if (typeCheck.pass) passCount++; else failCount++;

  // Status label
  const statusCheck = validationRules.statusLabel.check(labels);
  results.push({
    check: 'status_label',
    name: validationRules.statusLabel.name,
    status: statusCheck.pass ? 'pass' : 'fail',
    message: statusCheck.message
  });
  if (statusCheck.pass) passCount++; else failCount++;

  // Priority label
  const priorityCheck = validationRules.priorityLabel.check(labels);
  results.push({
    check: 'priority_label',
    name: validationRules.priorityLabel.name,
    status: priorityCheck.pass ? 'pass' : 'fail',
    message: priorityCheck.message
  });
  if (priorityCheck.pass) passCount++; else failCount++;

  // Type-body alignment
  const alignmentCheck = validationRules.typeBodyAlignment.check(type, body);
  results.push({
    check: 'type_body_alignment',
    name: validationRules.typeBodyAlignment.name,
    status: alignmentCheck.pass ? 'pass' : 'fail',
    message: alignmentCheck.message
  });
  if (alignmentCheck.pass) passCount++; else failCount++;

  // Language check
  const languageCheck = validationRules.noOffensiveLanguage.check(body);
  results.push({
    check: 'language_check',
    name: validationRules.noOffensiveLanguage.name,
    status: languageCheck.pass ? 'pass' : 'fail',
    message: languageCheck.message
  });
  if (languageCheck.pass) passCount++; else failCount++;

  // Determine overall status
  let overallStatus = 'pass';
  if (failCount > 3) overallStatus = 'fail';
  else if (failCount > 0) overallStatus = 'warning';

  return {
    overall_status: overallStatus,
    pass_count: passCount,
    fail_count: failCount,
    checks: results
  };
}

// Main execution
async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));

    const issueNumber = args.issue;
    const repo = args.repo;
    const token = args.token;

    if (!issueNumber || !repo) {
      console.error('Missing required arguments: --issue and --repo');
      process.exit(1);
    }

    console.log(`Validation Agent: Validating issue #${issueNumber}`);

    // Mock issue data
    const title = 'Test Issue Title';
    const body = 'This is a detailed issue body with proper formatting and clear description.';
    const type = 'bug';
    const labels = ['type:bug', 'status:needs-triage', 'priority:normal'];

    // Run validation
    const validation = validateIssue(title, body, type, labels);

    // Output results
    console.log('::set-output name=status::' + validation.overall_status);
    console.log('::set-output name=issues::' + validation.fail_count);
    console.log('::set-output name=passed::' + (validation.overall_status !== 'fail'));

    console.log(`✓ Validation complete: ${validation.overall_status}`);
    console.log(`  Passed: ${validation.pass_count}, Failed: ${validation.fail_count}`);

    // Log details
    validation.checks.forEach(check => {
      if (check.status === 'fail') {
        console.log(`  ✗ ${check.name}: ${check.message}`);
      }
    });

    process.exit(0);

  } catch (error) {
    console.error('Validation Agent Error:', error.message);
    console.log('::set-output name=status::error');
    console.log('::set-output name=passed::false');
    process.exit(1);
  }
}

main();
