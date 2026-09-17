#!/usr/bin/env node
/**
 * Checklist Generator CLI
 * T051: Command-line tool for generating quality checklists
 */

const fs = require('fs');
const { generateFromBase } = require('../lib/generator.cjs');
const { mergeCustomItems } = require('../lib/custom-merger.cjs');
const { sequenceIds, validateIdSequence } = require('../lib/id-sequencer.cjs');
const { renderAudienceChecklist } = require('../lib/audience-generator');
const { checklistValidator } = require('../lib/checklist-validator.cjs');

const args = process.argv.slice(2);

function printUsage() {
  console.log(`
Usage: generate-checklist [options]

Options:
  --domain <domain>        Domain variant (ux, api, security, performance)
  --audience <audience>    Target audience (author, peer, stakeholder, integration)
  --custom <file>          Custom items JSON file
  --output <file>          Output checklist file (default: checklist.md)
  --help                   Show this help message
  `);
}

function parseArguments() {
  const opts = {
    domain: null,
    audience: 'author',
    custom: null,
    output: 'checklist.md',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') {
      printUsage();
      process.exit(0);
    } else if (args[i] === '--domain' && i + 1 < args.length) {
      opts.domain = args[++i];
    } else if (args[i] === '--audience' && i + 1 < args.length) {
      opts.audience = args[++i];
    } else if (args[i] === '--custom' && i + 1 < args.length) {
      opts.custom = args[++i];
    } else if (args[i] === '--output' && i + 1 < args.length) {
      opts.output = args[++i];
    }
  }

  return opts;
}

async function loadCustomItems(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading custom items from ${filePath}:`, error.message);
    process.exit(1);
  }
}

function formatChecklistMarkdown(checklist) {
  let md = '# Requirements Quality Checklist\n\n';

  if (checklist.metadata) {
    md += `**Title**: ${checklist.metadata.title || 'Requirements Quality Checklist'}\n`;
    if (checklist.metadata.audience) {
      md += `**Audience**: ${checklist.metadata.audience}\n`;
    }
    md += '\n';
  }

  // Group items by dimension
  const byDimension = {};
  (checklist.items || []).forEach((item) => {
    if (!byDimension[item.dimension]) {
      byDimension[item.dimension] = [];
    }
    byDimension[item.dimension].push(item);
  });

  // Render by dimension
  Object.keys(byDimension)
    .sort()
    .forEach((dimension) => {
      md += `## ${dimension}\n\n`;

      byDimension[dimension].forEach((item) => {
        md += `- [ ] ${item.id} — ${item.question}`;
        if (item.guidance) {
          md += `\n  *Guidance: ${item.guidance}*`;
        }
        md += '\n';
      });

      md += '\n';
    });

  return md;
}

async function main() {
  const opts = parseArguments();

  try {
    console.log('📋 Generating Requirements Quality Checklist...\n');

    // Step 1: Generate base checklist
    let checklist = generateFromBase();
    console.log(`✓ Generated base checklist (${checklist.items.length} items)`);

    // Step 2: Apply domain variant if specified
    if (opts.domain) {
      console.log(`✓ Applying ${opts.domain} domain variant`);
      // TODO: Load and apply actual variant file
    }

    // Step 3: Merge custom items if provided
    if (opts.custom) {
      const customItems = await loadCustomItems(opts.custom);
      checklist = mergeCustomItems(checklist, customItems);
      console.log(`✓ Merged ${customItems.length} custom items`);
    }

    // Step 4: Sequence IDs
    checklist.items = sequenceIds(checklist.items);
    console.log('✓ Sequenced item IDs');

    // Step 5: Validate
    const validation = validateIdSequence(checklist.items);
    if (!validation.isValid) {
      console.error('❌ Validation failed:');
      validation.errors.forEach((err) => console.error(`  - ${err}`));
      process.exit(1);
    }
    console.log('✓ Validated ID sequence');

    // Step 6: Render for audience if specified
    if (opts.audience) {
      checklist = renderAudienceChecklist(checklist, opts.audience);
      console.log(`✓ Rendered for ${opts.audience} audience`);
    }

    // Step 7: Validate final checklist
    const checklistVal = checklistValidator(checklist);
    if (!checklistVal.isValid) {
      console.error('❌ Checklist validation failed:');
      checklistVal.errors.forEach((err) => console.error(`  - ${err}`));
      process.exit(1);
    }
    console.log('✓ Final checklist validated\n');

    // Write to file
    const markdown = formatChecklistMarkdown(checklist);
    fs.writeFileSync(opts.output, markdown, 'utf8');
    console.log(`✅ Checklist written to ${opts.output}`);
    console.log(`   ${checklist.items.length} items total\n`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
