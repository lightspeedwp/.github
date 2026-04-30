#!/usr/bin/env node

/**
 * Spacing Mapper - Die Papier to Ollie Migration Tool
 * 
 * Scans theme files for spacing preset references and maps them
 * from Die Papier slugs (numeric) to Ollie slugs (semantic names).
 * 
 * Handles both formats:
 * - var:preset|spacing|40
 * - var(--wp--preset--spacing--40)
 * 
 * Usage:
 *   node scripts/spacing-mapper.js --scan [folder]
 *   node scripts/spacing-mapper.js --update [folder] [--dry-run]
 */

const fs = require('fs');
const path = require('path');

/**
 * Spacing size mapping from Die Papier to Ollie
 * Based on rem value equivalents
 */
const SPACING_MAP = {
	// Die Papier → Ollie (based on matching rem values)
	'30': 'small',      // 0.75rem → small (0.75rem)
	'40': 'medium',     // 1rem → medium (1rem)
	'50': 'large',      // 1.25rem → large (1.25rem)
	'60': 'x-large',    // 1.5rem → x-large (1.5rem)
	'80': 'xx-large',   // 2rem → xx-large (2rem)
	'100': 'xxx-large', // 2.5rem → xxx-large (2.5rem)
	
	// No Ollie equivalents (keep for reference, handle manually):
	// '10': null,  // 0.25rem - no Ollie equivalent
	// '20': null,  // 0.5rem - no Ollie equivalent
	// '70': null,  // 1.75rem - no Ollie equivalent
};

/**
 * Extended map with suggestions for sizes without direct equivalents
 */
const SPACING_SUGGESTIONS = {
	'10': 'small',      // 0.25rem → suggest small (0.75rem) - needs manual review
	'20': 'small',      // 0.5rem → suggest small (0.75rem) - needs manual review
	'70': 'x-large',    // 1.75rem → suggest x-large (1.5rem) or xx-large (2rem) - needs manual review
};

/**
 * File extensions to scan
 */
const SCANNABLE_EXTENSIONS = [
	'.json', '.css', '.scss', '.html', '.php', '.js', '.jsx', '.ts', '.tsx'
];

/**
 * Regex patterns for finding spacing references
 */
const PATTERNS = {
	// Matches: var:preset|spacing|40
	pipe: /var:preset\|spacing\|(\d+)/g,
	// Matches: var(--wp--preset--spacing--40)
	cssVar: /var\(--wp--preset--spacing--(\d+)\)/g,
	// Matches: --wp--preset--spacing--40 (for direct references)
	cssVarDirect: /--wp--preset--spacing--(\d+)/g,
};

class SpacingMapper {
	constructor(options = {}) {
		this.options = {
			verbose: options.verbose || false,
			dryRun: options.dryRun || false,
			includeSuggestions: options.includeSuggestions || false,
		};
		this.results = {
			filesScanned: 0,
			filesWithMatches: 0,
			totalReplacements: 0,
			matches: [],
			suggestions: [],
			errors: [],
		};
	}

	/**
	 * Check if file should be scanned based on extension
	 */
	shouldScanFile(filePath) {
		const ext = path.extname(filePath).toLowerCase();
		return SCANNABLE_EXTENSIONS.includes(ext);
	}

	/**
	 * Recursively get all files in directory
	 */
	getFiles(dirPath, fileList = []) {
		const files = fs.readdirSync(dirPath);

		files.forEach(file => {
			const filePath = path.join(dirPath, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				// Skip node_modules, .git, etc.
				if (!file.startsWith('.') && file !== 'node_modules' && file !== 'vendor') {
					this.getFiles(filePath, fileList);
				}
			} else if (this.shouldScanFile(filePath)) {
				fileList.push(filePath);
			}
		});

		return fileList;
	}

	/**
	 * Scan a single file for spacing references
	 */
	scanFile(filePath) {
		try {
			const content = fs.readFileSync(filePath, 'utf8');
			const matches = [];
			
			// Check each pattern type
			Object.entries(PATTERNS).forEach(([patternType, regex]) => {
				let match;
				while ((match = regex.exec(content)) !== null) {
					const oldSlug = match[1];
					const newSlug = SPACING_MAP[oldSlug];
					const suggestion = SPACING_SUGGESTIONS[oldSlug];
					
					matches.push({
						file: filePath,
						line: this.getLineNumber(content, match.index),
						pattern: patternType,
						match: match[0],
						oldSlug,
						newSlug,
						suggestion,
						hasDirectMapping: !!newSlug,
					});
				}
			});

			if (matches.length > 0) {
				this.results.filesWithMatches++;
				this.results.matches.push(...matches);
			}

			this.results.filesScanned++;
			return matches;
		} catch (error) {
			this.results.errors.push({ file: filePath, error: error.message });
			return [];
		}
	}

	/**
	 * Get line number for a character index in content
	 */
	getLineNumber(content, index) {
		return content.substring(0, index).split('\n').length;
	}

	/**
	 * Replace spacing references in a file
	 */
	updateFile(filePath, matches) {
		if (this.options.dryRun) {
			return { updated: false, replacements: matches.length };
		}

		try {
			let content = fs.readFileSync(filePath, 'utf8');
			let replacements = 0;

			// Group matches by pattern type and process
			const matchesByType = {};
			matches.forEach(match => {
				if (!matchesByType[match.pattern]) {
					matchesByType[match.pattern] = [];
				}
				matchesByType[match.pattern].push(match);
			});

			// Process each pattern type
			Object.entries(matchesByType).forEach(([patternType, typeMatches]) => {
				typeMatches.forEach(match => {
					if (!match.hasDirectMapping) {
						if (this.options.includeSuggestions && match.suggestion) {
							// Only update if suggestions are enabled
							const oldPattern = this.buildPattern(patternType, match.oldSlug);
							const newPattern = this.buildPattern(patternType, match.suggestion);
							content = content.replace(new RegExp(oldPattern, 'g'), newPattern);
							replacements++;
						}
						// Skip if no direct mapping and suggestions disabled
					} else {
						const oldPattern = this.buildPattern(patternType, match.oldSlug);
						const newPattern = this.buildPattern(patternType, match.newSlug);
						content = content.replace(new RegExp(oldPattern, 'g'), newPattern);
						replacements++;
					}
				});
			});

			if (replacements > 0) {
				fs.writeFileSync(filePath, content, 'utf8');
				this.results.totalReplacements += replacements;
				return { updated: true, replacements };
			}

			return { updated: false, replacements: 0 };
		} catch (error) {
			this.results.errors.push({ file: filePath, error: error.message });
			return { updated: false, replacements: 0, error: error.message };
		}
	}

	/**
	 * Build the correct pattern string based on type and slug
	 */
	buildPattern(patternType, slug) {
		switch (patternType) {
			case 'pipe':
				return `var:preset|spacing|${slug}`;
			case 'cssVar':
				return `var(--wp--preset--spacing--${slug})`;
			case 'cssVarDirect':
				return `--wp--preset--spacing--${slug}`;
			default:
				return '';
		}
	}

	/**
	 * Scan directory for spacing references
	 */
	scan(targetPath) {
		const resolvedPath = path.resolve(targetPath);
		
		if (!fs.existsSync(resolvedPath)) {
			console.error(`Error: Path does not exist: ${resolvedPath}`);
			return this.results;
		}

		console.log(`\n🔍 Scanning: ${resolvedPath}\n`);

		const stat = fs.statSync(resolvedPath);
		const files = stat.isDirectory() 
			? this.getFiles(resolvedPath)
			: [resolvedPath];

		files.forEach(file => {
			if (this.options.verbose) {
				console.log(`Scanning: ${path.relative(resolvedPath, file)}`);
			}
			this.scanFile(file);
		});

		return this.results;
	}

	/**
	 * Update files with new spacing slugs
	 */
	update(targetPath) {
		// First scan to find matches
		this.scan(targetPath);

		if (this.results.matches.length === 0) {
			console.log('\n✅ No spacing references found to update.\n');
			return this.results;
		}

		console.log(`\n${ this.options.dryRun ? '🔍 DRY RUN - ' : '✏️  '}Updating files...\n`);

		// Group matches by file
		const matchesByFile = {};
		this.results.matches.forEach(match => {
			if (!matchesByFile[match.file]) {
				matchesByFile[match.file] = [];
			}
			matchesByFile[match.file].push(match);
		});

		// Update each file
		Object.entries(matchesByFile).forEach(([file, matches]) => {
			const result = this.updateFile(file, matches);
			if (result.updated || this.options.dryRun) {
				console.log(`${this.options.dryRun ? '  Would update' : '  ✓ Updated'}: ${path.basename(file)} (${result.replacements} replacements)`);
			}
		});

		return this.results;
	}

	/**
	 * Print detailed results report
	 */
	printReport() {
		console.log('\n' + '═'.repeat(70));
		console.log('📊 SPACING MIGRATION REPORT');
		console.log('═'.repeat(70) + '\n');

		console.log(`Files scanned: ${this.results.filesScanned}`);
		console.log(`Files with matches: ${this.results.filesWithMatches}`);
		console.log(`Total matches found: ${this.results.matches.length}\n`);

		if (this.results.errors.length > 0) {
			console.log(`\n⚠️  Errors encountered: ${this.results.errors.length}`);
			this.results.errors.forEach(err => {
				console.log(`  - ${path.basename(err.file)}: ${err.error}`);
			});
		}

		// Group by mapping status
		const directMappings = this.results.matches.filter(m => m.hasDirectMapping);
		const needsReview = this.results.matches.filter(m => !m.hasDirectMapping);

		if (directMappings.length > 0) {
			console.log('\n✅ Direct Mappings (can be auto-updated):');
			this.printMappingTable(directMappings);
		}

		if (needsReview.length > 0) {
			console.log('\n⚠️  Needs Manual Review (no direct Ollie equivalent):');
			this.printMappingTable(needsReview, true);
		}

		// Summary by slug
		console.log('\n📈 Spacing Usage Summary:');
		const slugCounts = {};
		this.results.matches.forEach(match => {
			const key = `${match.oldSlug} → ${match.newSlug || match.suggestion || 'MANUAL'}`;
			slugCounts[key] = (slugCounts[key] || 0) + 1;
		});

		Object.entries(slugCounts)
			.sort((a, b) => b[1] - a[1])
			.forEach(([mapping, count]) => {
				console.log(`  ${mapping.padEnd(25)} : ${count} occurrences`);
			});

		console.log('\n' + '═'.repeat(70) + '\n');
	}

	/**
	 * Print a formatted table of mappings
	 */
	printMappingTable(matches, showSuggestions = false) {
		const grouped = {};
		matches.forEach(match => {
			const key = `${match.oldSlug}→${match.newSlug || match.suggestion || '?'}`;
			if (!grouped[key]) {
				grouped[key] = {
					oldSlug: match.oldSlug,
					newSlug: match.newSlug,
					suggestion: match.suggestion,
					files: new Set(),
					count: 0,
				};
			}
			grouped[key].files.add(path.basename(match.file));
			grouped[key].count++;
		});

		Object.values(grouped).forEach(group => {
			const target = group.newSlug || (showSuggestions ? `${group.suggestion} (suggested)` : 'NEEDS REVIEW');
			console.log(`\n  ${group.oldSlug} → ${target}`);
			console.log(`    Occurrences: ${group.count}`);
			console.log(`    Files: ${Array.from(group.files).slice(0, 3).join(', ')}${group.files.size > 3 ? ` +${group.files.size - 3} more` : ''}`);
		});
	}
}

/**
 * CLI Interface
 */
function main() {
	const args = process.argv.slice(2);
	
	if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
		printHelp();
		process.exit(0);
	}

	const command = args[0];
	const targetPath = args[1] || process.cwd();
	const options = {
		verbose: args.includes('--verbose') || args.includes('-v'),
		dryRun: args.includes('--dry-run'),
		includeSuggestions: args.includes('--include-suggestions'),
	};

	const mapper = new SpacingMapper(options);

	switch (command) {
		case '--scan':
		case '-s':
			mapper.scan(targetPath);
			mapper.printReport();
			break;

		case '--update':
		case '-u':
			mapper.update(targetPath);
			mapper.printReport();
			break;

		case '--map':
		case '-m':
			printSpacingMap();
			break;

		default:
			console.error(`Unknown command: ${command}`);
			printHelp();
			process.exit(1);
	}
}

function printHelp() {
	console.log(`
╔════════════════════════════════════════════════════════════════════╗
║           🎨 Spacing Mapper - Die Papier to Ollie                  ║
╚════════════════════════════════════════════════════════════════════╝

USAGE:
  node scripts/spacing-mapper.js <command> [path] [options]

COMMANDS:
  --scan, -s [path]     Scan files and report spacing usage
  --update, -u [path]   Update spacing references to Ollie slugs
  --map, -m             Show spacing mapping table
  --help, -h            Show this help message

OPTIONS:
  --dry-run             Preview changes without writing files
  --verbose, -v         Show detailed output
  --include-suggestions Update non-equivalent sizes with suggestions

EXAMPLES:
  # Scan current theme
  node scripts/spacing-mapper.js --scan ./

  # Scan specific folder
  node scripts/spacing-mapper.js --scan ./styles/presets

  # Update with dry run (preview only)
  node scripts/spacing-mapper.js --update ./ --dry-run

  # Update all files (CAUTION: modifies files!)
  node scripts/spacing-mapper.js --update ./

  # Update including suggested mappings for non-equivalent sizes
  node scripts/spacing-mapper.js --update ./ --include-suggestions

  # Show spacing mapping table
  node scripts/spacing-mapper.js --map

SPACING MAPPING:
  Direct equivalents (based on rem values):
    30 (0.75rem)  → small
    40 (1rem)     → medium
    50 (1.25rem)  → large
    60 (1.5rem)   → x-large
    80 (2rem)     → xx-large
    100 (2.5rem)  → xxx-large

  Needs review (no Ollie equivalent):
    10 (0.25rem)  → suggest: small (manual review needed)
    20 (0.5rem)   → suggest: small (manual review needed)
    70 (1.75rem)  → suggest: x-large (manual review needed)
`);
}

function printSpacingMap() {
	console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                    SPACING SIZE MAPPING REFERENCE                   ║
╚════════════════════════════════════════════════════════════════════╝

Die Papier Spacing:
  ┌─────────┬───────────┬──────────────────────────────────┐
  │ Slug    │ Size      │ Name                             │
  ├─────────┼───────────┼──────────────────────────────────┤
  │ 10      │ 0.25rem   │ Tiny                             │
  │ 20      │ 0.5rem    │ XS                               │
  │ 30      │ 0.75rem   │ Small                            │
  │ 40      │ 1rem      │ Medium                           │
  │ 50      │ 1.25rem   │ Large                            │
  │ 60      │ 1.5rem    │ XL                               │
  │ 70      │ 1.75rem   │ XL+                              │
  │ 80      │ 2rem      │ 2XL                              │
  │ 100     │ 2.5rem    │ 3XL                              │
  └─────────┴───────────┴──────────────────────────────────┘

Ollie Spacing:
  ┌─────────────┬───────────┬──────────────────────────────┐
  │ Slug        │ Size      │ Name                         │
  ├─────────────┼───────────┼──────────────────────────────┤
  │ small       │ 0.75rem   │ Small                        │
  │ medium      │ 1rem      │ Medium                       │
  │ large       │ 1.25rem   │ Large                        │
  │ x-large     │ 1.5rem    │ Extra Large                  │
  │ xx-large    │ 2rem      │ 2xl                          │
  │ xxx-large   │ 2.5rem    │ 3xl                          │
  │ xxxx-large  │ 3rem      │ 4xl                          │
  └─────────────┴───────────┴──────────────────────────────┘

Mapping (Die Papier → Ollie):
  ┌─────────┬─────────────┬──────────┬─────────────────────┐
  │ From    │ To          │ Size     │ Status              │
  ├─────────┼─────────────┼──────────┼─────────────────────┤
  │ 30      │ small       │ 0.75rem  │ ✅ Direct match     │
  │ 40      │ medium      │ 1rem     │ ✅ Direct match     │
  │ 50      │ large       │ 1.25rem  │ ✅ Direct match     │
  │ 60      │ x-large     │ 1.5rem   │ ✅ Direct match     │
  │ 80      │ xx-large    │ 2rem     │ ✅ Direct match     │
  │ 100     │ xxx-large   │ 2.5rem   │ ✅ Direct match     │
  ├─────────┼─────────────┼──────────┼─────────────────────┤
  │ 10      │ (small)     │ 0.25rem  │ ⚠️  Needs review    │
  │ 20      │ (small)     │ 0.5rem   │ ⚠️  Needs review    │
  │ 70      │ (x-large)   │ 1.75rem  │ ⚠️  Needs review    │
  └─────────┴─────────────┴──────────┴─────────────────────┘

PATTERN FORMATS DETECTED:
  • var:preset|spacing|40
  • var(--wp--preset--spacing--40)
  • --wp--preset--spacing--40
`);
}

// Run if called directly
if (require.main === module) {
	main();
}

module.exports = SpacingMapper;
