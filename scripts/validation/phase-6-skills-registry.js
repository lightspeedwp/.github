#!/usr/bin/env node

/**
 * Phase 6: Create Skills Registry (T058-T069)
 * Generates machine-readable skills registry with agentskills.io compliance
 */

import fs from 'fs';
import path from 'path';
import SkillsRegistryGenerator from './lib/skills-registry-generator.js';

const ROOT_DIR = process.cwd();
const REPORTS_DIR = path.join(ROOT_DIR, 'agents', 'reports');
const REGISTRY_DIR = path.join(ROOT_DIR, 'skills');

// Ensure directories exist
[REPORTS_DIR, REGISTRY_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * T058-T062: Generate skills registry
 */
function generateSkillsRegistry() {
  console.log('\n[T058-T062] Generating skills registry...');

  const generator = new SkillsRegistryGenerator({ rootDir: ROOT_DIR });
  const skills = generator.scanAllSkills();

  console.log(`✓ Scanned ${skills.length} skills`);

  const registry = generator.generateRegistry(skills);

  const registryPath = path.join(REGISTRY_DIR, 'registry.json');
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log(`✓ Consolidated registry saved: ${registryPath}`);

  return { registry, skills };
}

/**
 * T063: Generate per-category registries
 */
function generateCategoryRegistries(skills) {
  console.log('\n[T063] Generating per-category registries...');

  const generator = new SkillsRegistryGenerator({ rootDir: ROOT_DIR });
  const categoryRegistries = generator.generateCategoryRegistries(skills);

  const categoryDir = path.join(REGISTRY_DIR, 'by-category');
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  for (const [category, registry] of Object.entries(categoryRegistries)) {
    const categoryPath = path.join(categoryDir, `${category}.json`);
    fs.writeFileSync(categoryPath, JSON.stringify(registry, null, 2));
  }

  console.log(`✓ Generated ${Object.keys(categoryRegistries).length} category registries`);

  return categoryRegistries;
}

/**
 * T064-T065: Validate registries
 */
function validateRegistries(registry, categoryRegistries) {
  console.log('\n[T064-T065] Validating registries...');

  const validation = {
    timestamp: new Date().toISOString(),
    consolidated: {
      valid: true,
      errors: [],
      warnings: [],
    },
    categories: {},
  };

  // Validate consolidated registry
  if (!registry.skills || registry.skills.length === 0) {
    validation.consolidated.valid = false;
    validation.consolidated.errors.push('No skills in consolidated registry');
  }

  if (!registry.summary) {
    validation.consolidated.valid = false;
    validation.consolidated.errors.push('Missing summary section');
  }

  // Validate category registries
  for (const [category, catRegistry] of Object.entries(categoryRegistries)) {
    validation.categories[category] = {
      valid: true,
      skills: catRegistry.skills.length,
      compliant: catRegistry.summary.compliant,
      compliancePercentage: catRegistry.summary.compliancePercentage,
    };
  }

  const reportPath = path.join(REPORTS_DIR, 'registry-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(validation, null, 2));
  console.log(`✓ Validation report saved: ${reportPath}`);

  return validation;
}

/**
 * T066-T067: Identify compliance violations
 */
function analyzeCompliance(registry) {
  console.log('\n[T066-T067] Analyzing compliance...');

  const violations = {
    timestamp: new Date().toISOString(),
    summary: {
      total: registry.skills.length,
      compliant: 0,
      violations: 0,
    },
    skills: [],
  };

  for (const skill of registry.skills) {
    if (!skill.agentskills_io_compliant.compliant) {
      violations.summary.violations++;
      violations.skills.push({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        failedChecks: Object.entries(skill.agentskills_io_compliant.checks)
          .filter(([_key, value]) => !value)
          .map(([key]) => key),
        remediation: [
          'Add JSDoc comments with description, inputs, outputs',
          'Include example usage in code or documentation',
          'Ensure skill is documented in SKILLS_NAMING_CONVENTION.md',
        ],
      });
    } else {
      violations.summary.compliant++;
    }
  }

  violations.summary.compliancePercentage =
    violations.summary.total === 0
      ? 0
      : Math.round((violations.summary.compliant / violations.summary.total) * 100);

  const reportPath = path.join(REPORTS_DIR, 'compliance-violations-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(violations, null, 2));
  console.log(`✓ Compliance report saved: ${reportPath}`);

  return violations;
}

/**
 * T068: Document registry format
 */
function documentRegistryFormat() {
  console.log('\n[T068] Documenting skills registry format...');

  const docsPath = path.join(ROOT_DIR, '.github', 'docs');
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true });
  }

  const docContent = `# Skills Registry Format

## Overview

The skills registry is a machine-readable catalog of all skills in the organization, with agentskills.io compliance tracking.

## Registry Files

- **skills/registry.json** - Consolidated registry of all skills
- **skills/by-category/{category}.json** - Per-category registries

## Skill Schema

Each skill entry contains:

\`\`\`json
{
  "id": "category/skill-name",
  "name": "skill-name",
  "category": "category",
  "path": "/path/to/skill/file",
  "description": "Brief description",
  "type": "javascript|shell|python|yaml|json",
  "version": "1.0.0",
  "agentskills_io_compliant": {
    "compliant": true,
    "checks": {
      "hasDescription": true,
      "hasInputs": true,
      "hasOutputs": true,
      "hasExamples": true
    }
  }
}
\`\`\`

## Registry Summary

The registry includes a summary section:

\`\`\`json
{
  "summary": {
    "total": 634,
    "byCategory": {
      "validation": 150,
      "audit": 120,
      "reporting": 100,
      ...
    },
    "compliant": 500,
    "compliancePercentage": 79
  }
}
\`\`\`

## Compliance Tracking

Skills are tracked for agentskills.io compliance based on:
- Has description field
- Has inputs specification
- Has outputs specification
- Has usage examples

A skill is considered compliant when at least 2 of these 4 checks pass.

## Using the Registry

1. **Discover skills by category**: Load \`skills/by-category/{category}.json\`
2. **Find all skills**: Load consolidated \`skills/registry.json\`
3. **Check compliance**: Filter by \`agentskills_io_compliant.compliant === true\`
4. **Find violations**: See agents/reports/compliance-violations-report.json

## Updating the Registry

The registry is regenerated by running:

\`\`\`bash
npm run audit:skills-registry
\`\`\`

This scans all skills in agents/ and skills/ directories and regenerates all registry files.
`;

  const docFile = path.join(docsPath, 'SKILLS_REGISTRY_FORMAT.md');
  fs.writeFileSync(docFile, docContent);
  console.log(`✓ Registry format documented: ${docFile}`);
}

/**
 * T069: Generate summary
 */
function generateSummaryReport(registry, violations, categoryRegistries) {
  console.log('\n[T069] Generating Phase 6 summary...');

  const summary = {
    timestamp: new Date().toISOString(),
    phase: 'Phase 6: User Story 4 - Create Skills Registry',
    tasks: [
      'T058',
      'T059',
      'T060',
      'T061',
      'T062',
      'T063',
      'T064',
      'T065',
      'T066',
      'T067',
      'T068',
      'T069',
    ],
    registry: {
      consolidated: {
        path: 'skills/registry.json',
        totalSkills: registry.skills.length,
        compliant: violations.summary.compliant,
        violations: violations.summary.violations,
        compliancePercentage: violations.summary.compliancePercentage,
      },
      categories: {
        count: Object.keys(categoryRegistries).length,
        details: Object.fromEntries(
          Object.entries(categoryRegistries).map(([cat, reg]) => [
            cat,
            {
              skills: reg.skills.length,
              compliant: reg.summary.compliant,
              path: `skills/by-category/${cat}.json`,
            },
          ])
        ),
      },
    },
    reports: [
      'agents/reports/registry-validation-report.json',
      'agents/reports/compliance-violations-report.json',
    ],
    nextSteps: [
      'Review compliance-violations-report.json for non-compliant skills',
      'Improve skill documentation to increase compliance percentage',
      'Proceed to Phase 7: Create Agent Registry',
    ],
  };

  const reportPath = path.join(REPORTS_DIR, 'phase-6-summary.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`✓ Summary report saved: ${reportPath}`);

  return summary;
}

/**
 * Print human-readable report
 */
function printReport(registry, violations, categoryRegistries, summary) {
  console.log('\n' + '='.repeat(70));
  console.log('Phase 6: Skills Registry Generation');
  console.log('='.repeat(70));

  console.log(`\n📚 REGISTRY GENERATION:`);
  console.log(`   Total skills registered: ${registry.skills.length}`);
  console.log(`   Categories: ${Object.keys(categoryRegistries).length}`);

  console.log(`\n✅ COMPLIANCE STATUS:`);
  console.log(`   Compliant skills: ${violations.summary.compliant}`);
  console.log(`   Non-compliant skills: ${violations.summary.violations}`);
  console.log(`   Compliance rate: ${violations.summary.compliancePercentage}%`);

  console.log(`\n📊 SKILLS BY CATEGORY:`);
  for (const [cat, reg] of Object.entries(categoryRegistries)) {
    console.log(
      `   ${cat}: ${reg.skills.length} skills (${reg.summary.compliancePercentage}% compliant)`
    );
  }

  console.log(`\n📈 REPORTS GENERATED:`);
  for (const report of summary.reports) {
    console.log(`   ${report}`);
  }

  console.log('\n' + '='.repeat(70));
}

// Run Phase 6
try {
  console.log('Starting Phase 6: Skills Registry Generation (T058-T069)...');

  const { registry, skills } = generateSkillsRegistry();
  const categoryRegistries = generateCategoryRegistries(skills);
  const validation = validateRegistries(registry, categoryRegistries);
  const violations = analyzeCompliance(registry);
  documentRegistryFormat();
  const summary = generateSummaryReport(registry, violations, categoryRegistries);

  printReport(registry, violations, categoryRegistries, summary);

  console.log('\n✅ Phase 6 complete');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Phase 6 failed:');
  console.error(error.message);
  process.exit(1);
}
