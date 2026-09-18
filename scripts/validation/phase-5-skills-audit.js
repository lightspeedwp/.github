#!/usr/bin/env node

/**
 * Phase 5: Skills Consolidation & Deduplication Audit (T045-T057)
 * Generates deduplication audit report and consolidation recommendations
 */

import fs from 'fs';
import path from 'path';
import SkillsCatalog from './lib/skills-catalog.js';
import DedupEngine from './lib/dedup-engine.js';

const ROOT_DIR = process.cwd();
const REPORTS_DIR = path.join(ROOT_DIR, 'agents', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * T045: Scan all skills
 */
function scanAllSkills() {
  console.log('\n[T045] Scanning all skills...');

  const catalog = new SkillsCatalog({ rootDir: ROOT_DIR });
  const _skills = catalog.scanAllSkills();

  console.log(`✓ Total skills found: ${_skills.length}`);

  return { catalog, skills: _skills };
}

/**
 * T050: Generate deduplication audit report
 */
function generateDeduplicationAudit(catalog, skills) {
  console.log('\n[T050] Generating deduplication audit report...');

  const catalogReport = catalog.generateCatalog();

  const reportPath = path.join(REPORTS_DIR, 'deduplication-audit.json');
  fs.writeFileSync(reportPath, JSON.stringify(catalogReport, null, 2));
  console.log(`✓ Deduplication audit report saved: ${reportPath}`);

  return catalogReport;
}

/**
 * T051: Identify exact duplicates
 */
function identifyExactDuplicates(catalogReport) {
  console.log('\n[T051] Identifying exact duplicates...');

  const exactDuplicates = catalogReport.exactDuplicates;
  console.log(`✓ Found ${exactDuplicates.length} exact duplicate groups`);

  if (exactDuplicates.length > 0) {
    const totalDuplicates = exactDuplicates.reduce((sum, g) => sum + (g.count - 1), 0);
    console.log(`✓ Total duplicate instances: ${totalDuplicates}`);
  }

  return exactDuplicates;
}

/**
 * T052: Identify near-duplicates
 */
function identifyNearDuplicates(skills) {
  console.log('\n[T052] Identifying near-duplicates (85%+ similarity)...');

  const dedupEngine = new DedupEngine({ threshold: 0.85 });
  const nearDuplicates = dedupEngine.findNearDuplicates(skills);

  console.log(`✓ Found ${nearDuplicates.length} near-duplicate pairs`);

  return { dedupEngine, nearDuplicates };
}

/**
 * T053-T055: Create consolidation recommendations
 */
function generateConsolidationPlan(dedupEngine, exactDuplicates, nearDuplicates, skills) {
  console.log('\n[T053-T055] Generating consolidation plan...');

  const recommendations = dedupEngine.generateRecommendations(exactDuplicates, nearDuplicates);

  const analysis = dedupEngine.analyzeDuplication(skills, exactDuplicates, nearDuplicates);

  const consolidationPlan = {
    timestamp: new Date().toISOString(),
    analysis,
    recommendations: recommendations,
    strategy: {
      phase1: {
        focus: 'Exact duplicates (100% match)',
        approach: 'Consolidate to single source',
        effort: 'low',
        count: exactDuplicates.length,
      },
      phase2: {
        focus: 'Near-duplicates (85%+ match)',
        approach: 'Manual review and merge',
        effort: 'medium',
        count: nearDuplicates.length,
        requirement: 'requires-manual-review',
      },
    },
    nextSteps: [
      'Review exact duplicates and consolidate to single sources',
      'Manually review near-duplicate pairs for consolidation candidates',
      'Update agents to use consolidated skills',
      'Remove redundant skill definitions',
      'Update skill imports and references',
    ],
  };

  const reportPath = path.join(REPORTS_DIR, 'skill-consolidation-plan.json');
  fs.writeFileSync(reportPath, JSON.stringify(consolidationPlan, null, 2));
  console.log(`✓ Consolidation plan saved: ${reportPath}`);

  return consolidationPlan;
}

/**
 * T046: Document skills naming convention
 */
function documentNamingConvention() {
  console.log('\n[T046] Documenting skills naming convention...');

  const namingGuide = {
    convention: '{category}/{scope}-{title}',
    examples: [
      'validation/changelog-format-check.js',
      'audit/structure-conformance-audit.js',
      'reporting/agent-metrics-report.js',
      'registry/skill-registry-generator.js',
      'utilities/file-hash-calculator.js',
    ],
    categories: [
      'validation - Skills that validate content or structure',
      'audit - Skills that audit and report on system state',
      'reporting - Skills that generate reports and summaries',
      'registry - Skills that build and manage registries',
      'utilities - Shared utility skills',
      'integration - Skills for cross-system integration',
      'migration - Skills for data and schema migrations',
    ],
    guidelines: [
      'Use kebab-case for skill names',
      'Prefix with category subdirectory',
      'Keep scope clear and specific',
      'Avoid generic names (helper, util, etc.)',
      'Document purpose in file header',
    ],
  };

  const docsPath = path.join(ROOT_DIR, '.github', 'docs');
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true });
  }

  const docFile = path.join(docsPath, 'SKILLS_NAMING_CONVENTION.md');
  const markdownContent = `# Skills Naming Convention

**Format**: \`{category}/{scope}-{title}\`

## Examples

${namingGuide.examples.map((ex) => `- \`${ex}\``).join('\n')}

## Categories

${namingGuide.categories.map((cat) => `- ${cat}`).join('\n')}

## Guidelines

${namingGuide.guidelines.map((g) => `- ${g}`).join('\n')}

## Rationale

This convention ensures:
- Skills are discoverable by category
- Purpose is clear from the filename
- Naming is consistent across all agents
- Skills can be organized into root \`skills/\` directory by category
`;

  fs.writeFileSync(docFile, markdownContent);
  console.log(`✓ Naming convention documented: ${docFile}`);

  return namingGuide;
}

/**
 * T047: Create category subdirectories
 */
function createCategoryDirectories() {
  console.log('\n[T047] Creating category subdirectories...');

  const categories = [
    'validation',
    'audit',
    'reporting',
    'registry',
    'utilities',
    'integration',
    'migration',
  ];

  const skillsDir = path.join(ROOT_DIR, 'skills');
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  const created = [];

  for (const category of categories) {
    const categoryPath = path.join(skillsDir, category);

    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      created.push(category);
    }
  }

  if (created.length > 0) {
    console.log(`✓ Created ${created.length} category directories`);
  } else {
    console.log('✓ Category directories already exist');
  }

  return categories;
}

/**
 * T057: Generate summary report
 */
function generateSummaryReport(analysis, consolidationPlan) {
  console.log('\n[T057] Generating summary report...');

  const summary = {
    timestamp: new Date().toISOString(),
    phase: 'Phase 5: User Story 3 - Consolidate & Deduplicate Skills',
    tasks: [
      'T045',
      'T046',
      'T047',
      'T048',
      'T049',
      'T050',
      'T051',
      'T052',
      'T053',
      'T054',
      'T055',
      'T056',
      'T057',
    ],
    skills: {
      totalScanned: analysis.totalSkills,
      byLocation: {
        agentSkills: analysis.summary.agentSkills,
        rootSkills: analysis.summary.rootSkills,
      },
      byType: analysis.summary.skillsByType,
      byCategory: analysis.summary.skillsByCategory,
    },
    duplication: {
      exactDuplicateGroups: consolidationPlan.analysis.exactDuplicateGroups,
      exactDuplicateInstances: consolidationPlan.analysis.exactDuplicateCount,
      nearDuplicatePairs: consolidationPlan.analysis.nearDuplicatePairs,
      skillsInvolvedInDuplication: consolidationPlan.analysis.duplicatedSkillsCount,
      consolidationCandidates: consolidationPlan.analysis.consolidationOpportunities,
      similarityThreshold: '85%',
    },
    nextSteps: consolidationPlan.nextSteps,
    reports: [
      'agents/reports/deduplication-audit.json',
      'agents/reports/skill-consolidation-plan.json',
      'agents/reports/skill-audit-summary.json',
    ],
  };

  const reportPath = path.join(REPORTS_DIR, 'skill-audit-summary.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`✓ Summary report saved: ${reportPath}`);

  return summary;
}

/**
 * Print human-readable report
 */
function printReport(summary, _consolidationPlan) {
  console.log('\n' + '='.repeat(70));
  console.log('Phase 5: Skills Consolidation & Deduplication Audit');
  console.log('='.repeat(70));

  console.log(`\n📚 SKILLS CATALOG:`);
  console.log(`   Total skills scanned: ${summary.skills.totalScanned}`);
  console.log(
    `   Agent skills: ${summary.skills.byLocation.agentSkills} | Root skills: ${summary.skills.byLocation.rootSkills}`
  );

  console.log(`\n📊 SKILLS BY TYPE:`);
  for (const [type, count] of Object.entries(summary.skills.byType)) {
    console.log(`   ${type}: ${count}`);
  }

  console.log(`\n🔍 DUPLICATION ANALYSIS:`);
  console.log(`   Exact duplicate groups: ${summary.duplication.exactDuplicateGroups}`);
  console.log(`   Near-duplicate pairs (85%+ similar): ${summary.duplication.nearDuplicatePairs}`);
  console.log(
    `   Skills involved in duplication: ${summary.duplication.skillsInvolvedInDuplication}`
  );
  console.log(`   Consolidation opportunities: ${summary.duplication.consolidationCandidates}`);

  if (summary.duplication.exactDuplicateGroups > 0 || summary.duplication.nearDuplicatePairs > 0) {
    console.log(`\n💡 STRATEGY:`);
    console.log(
      `   Phase 1: Consolidate ${summary.duplication.exactDuplicateGroups} exact duplicates`
    );
    console.log(
      `   Phase 2: Review and merge ${summary.duplication.nearDuplicatePairs} near-duplicate pairs`
    );
  }

  console.log(`\n📈 REPORTS GENERATED:`);
  for (const report of summary.reports) {
    console.log(`   ${report}`);
  }

  console.log('\n' + '='.repeat(70));
}

// Run audit
try {
  console.log('Starting Phase 5 Skills Consolidation & Deduplication Audit...');

  createCategoryDirectories();
  documentNamingConvention();

  const { catalog, skills } = scanAllSkills();
  const catalogReport = generateDeduplicationAudit(catalog, skills);
  const exactDuplicates = identifyExactDuplicates(catalogReport);
  const { dedupEngine, nearDuplicates } = identifyNearDuplicates(skills);
  const consolidationPlan = generateConsolidationPlan(
    dedupEngine,
    exactDuplicates,
    nearDuplicates,
    skills
  );
  const summary = generateSummaryReport(catalogReport, consolidationPlan);

  printReport(summary, consolidationPlan);

  console.log('\n✅ Phase 5 audit complete');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Phase 5 audit failed:');
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
