#!/usr/bin/env node

/**
 * Inc Folder PHP Formatter - WordPress Themes
 * 
 * Formats PHP files in the inc/ folder to follow theme conventions:
 * 1. Add namespace to PHP files (auto-detected or specified)
 * 2. Remove function prefix from function names (auto-detected or specified)
 * 3. Update add_action/add_filter to use __NAMESPACE__ . '\function_name'
 * 
 * Usage:
 *   node scripts/inc-formatter.js --scan [file/folder] [--namespace=...] [--prefix=...]
 *   node scripts/inc-formatter.js --format [file/folder] [--dry-run] [--namespace=...] [--prefix=...]
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class IncFormatter {
	constructor(options = {}) {
		this.options = {
			verbose: options.verbose || false,
			dryRun: options.dryRun || false,
			namespace: options.namespace || null,
			prefix: options.prefix || null,
		};
		this.results = {
			filesScanned: 0,
			filesFormatted: 0,
			changes: [],
			errors: [],
		};
		this.namespace = null;
		this.functionPrefix = null;
	}

	/**
	 * Auto-detect namespace from existing PHP files
	 */
	async detectNamespace(targetPath) {
		const resolvedPath = path.resolve(targetPath);
		const files = this.getPhpFiles(resolvedPath);
		
		// Look for existing namespace declarations
		for (const file of files) {
			try {
				const content = fs.readFileSync(file, 'utf8');
				const namespaceMatch = content.match(/^\s*namespace\s+([^;]+);/m);
				if (namespaceMatch) {
					return namespaceMatch[1].trim();
				}
			} catch (error) {
				// Continue to next file
			}
		}
		
		return null;
	}

	/**
	 * Auto-detect function prefix from existing PHP files
	 */
	async detectPrefix(targetPath) {
		const resolvedPath = path.resolve(targetPath);
		const files = this.getPhpFiles(resolvedPath);
		
		// Look for common function prefix patterns
		const prefixCounts = {};
		
		for (const file of files) {
			try {
				const content = fs.readFileSync(file, 'utf8');
				const functionMatches = content.matchAll(/function\s+([a-z]+)_[a-zA-Z0-9_]+\s*\(/g);
				
				for (const match of functionMatches) {
					const prefix = match[1] + '_';
					prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
				}
			} catch (error) {
				// Continue to next file
			}
		}
		
		// Return most common prefix
		if (Object.keys(prefixCounts).length > 0) {
			return Object.entries(prefixCounts)
				.sort((a, b) => b[1] - a[1])[0][0];
		}
		
		return null;
	}

	/**
	 * Prompt user for namespace
	 */
	async promptNamespace(detected = null) {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		return new Promise((resolve) => {
			const suggestion = detected || 'YourTheme\\includes';
			rl.question(`\nEnter theme namespace [${suggestion}]: `, (answer) => {
				rl.close();
				resolve(answer.trim() || suggestion);
			});
		});
	}

	/**
	 * Prompt user for function prefix
	 */
	async promptPrefix(detected = null) {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		return new Promise((resolve) => {
			const suggestion = detected || 'theme_';
			rl.question(`\nEnter function prefix to remove [${suggestion}]: `, (answer) => {
				rl.close();
				resolve(answer.trim() || suggestion);
			});
		});
	}

	/**
	 * Initialize namespace and prefix (detect or prompt)
	 */
	async initialize(targetPath) {
		// Use provided options first
		if (this.options.namespace && this.options.prefix) {
			this.namespace = this.options.namespace;
			this.functionPrefix = this.options.prefix;
			console.log(`\n✓ Using namespace: ${this.namespace}`);
			console.log(`✓ Using prefix: ${this.functionPrefix}\n`);
			return;
		}

		// Try to auto-detect
		console.log('\n🔍 Auto-detecting theme configuration...\n');
		
		const detectedNamespace = await this.detectNamespace(targetPath);
		const detectedPrefix = await this.detectPrefix(targetPath);

		if (detectedNamespace) {
			console.log(`✓ Detected namespace: ${detectedNamespace}`);
		}
		if (detectedPrefix) {
			console.log(`✓ Detected prefix: ${detectedPrefix}`);
		}

		// Prompt for namespace if not provided
		if (!this.options.namespace) {
			this.namespace = await this.promptNamespace(detectedNamespace);
		} else {
			this.namespace = this.options.namespace;
		}

		// Prompt for prefix if not provided
		if (!this.options.prefix) {
			this.functionPrefix = await this.promptPrefix(detectedPrefix);
		} else {
			this.functionPrefix = this.options.prefix;
		}

		console.log(`\n→ Namespace: ${this.namespace}`);
		console.log(`→ Prefix: ${this.functionPrefix}\n`);
	}

	/**
	 * Check if file is a PHP file
	 */
	isPhpFile(filePath) {
		return path.extname(filePath).toLowerCase() === '.php';
	}

	/**
	 * Recursively get all PHP files in directory
	 */
	getPhpFiles(dirPath, fileList = []) {
		if (fs.statSync(dirPath).isFile()) {
			if (this.isPhpFile(dirPath)) {
				fileList.push(dirPath);
			}
			return fileList;
		}

		const files = fs.readdirSync(dirPath);

		files.forEach(file => {
			const filePath = path.join(dirPath, file);
			const stat = fs.statSync(filePath);

			if (stat.isDirectory()) {
				if (!file.startsWith('.') && file !== 'node_modules' && file !== 'vendor') {
					this.getPhpFiles(filePath, fileList);
				}
			} else if (this.isPhpFile(filePath)) {
				fileList.push(filePath);
			}
		});

		return fileList;
	}

	/**
	 * Analyze a PHP file for formatting needs
	 */
	analyzeFile(filePath) {
		try {
			const content = fs.readFileSync(filePath, 'utf8');
			const analysis = {
				file: filePath,
				hasNamespace: false,
				needsNamespace: false,
				prefixedFunctions: [],
				hookCalls: [],
				changes: [],
			};

			// Check for namespace
			const namespaceMatch = content.match(/^\s*namespace\s+([^;]+);/m);
			if (namespaceMatch) {
				analysis.hasNamespace = true;
				if (namespaceMatch[1].trim() !== this.namespace) {
					analysis.needsNamespace = true;
					analysis.changes.push({
						type: 'namespace',
						from: namespaceMatch[1].trim(),
						to: this.namespace,
					});
				}
			} else {
				analysis.needsNamespace = true;
				analysis.changes.push({
					type: 'namespace',
					from: null,
					to: this.namespace,
				});
			}

// Find function_exists wrappers (pluggable function pattern)
		const functionExistsPattern = /if\s*\(\s*!\s*function_exists\s*\(\s*['"]([a-zA-Z0-9_]+)['"]\s*\)\s*\)\s*:/g;
		const functionExistsWrappers = [];
		let match;
		while ((match = functionExistsPattern.exec(content)) !== null) {
			const funcName = match[1];
			functionExistsWrappers.push({
				funcName: funcName,
				line: this.getLineNumber(content, match.index),
			});
			analysis.changes.push({
				type: 'function_exists_wrapper',
				function: funcName,
				action: 'remove wrapper',
			});
		}
		analysis.functionExistsWrappers = functionExistsWrappers;
		
		// Find orphaned endif; statements (from previously removed wrappers)
		const orphanedEndifs = [];
		const lines = content.split('\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line === 'endif;' || line.startsWith('endif;')) {
				// Check if this endif has a matching if before it
				let hasMatchingIf = false;
				for (let j = i - 1; j >= 0; j--) {
					const prevLine = lines[j];
					// Look for if statements using colon syntax (alternative control structure)
					if (prevLine.trim().match(/^if\s*\([^)]+\)\s*:\s*$/)) {
						hasMatchingIf = true;
						break;
					}
				}
				// If no matching if found, this is orphaned
				if (!hasMatchingIf) {
					orphanedEndifs.push(i + 1); // Convert to 1-based line numbers
					analysis.changes.push({
						type: 'orphaned_endif',
						line: i + 1,
						action: 'remove orphaned endif',
					});
				}
			}
		}
		analysis.orphanedEndifs = orphanedEndifs;

		// Find function declarations with prefix
		const functionRegex = new RegExp(`function\\s+(${this.functionPrefix}[a-zA-Z0-9_]+)\\s*\\(`, 'g');
			while ((match = functionRegex.exec(content)) !== null) {
				const funcName = match[1];
				const newName = funcName.replace(new RegExp(`^${this.functionPrefix}`), '');
				analysis.prefixedFunctions.push({
					oldName: funcName,
					newName: newName,
					line: this.getLineNumber(content, match.index),
				});
				analysis.changes.push({
					type: 'function',
					from: funcName,
					to: newName,
				});
			}

			// Find add_action and add_filter calls
			const hookRegex = /(add_action|add_filter)\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g;
			while ((match = hookRegex.exec(content)) !== null) {
				const hookType = match[1];
				const hookName = match[2];
				const callback = match[3];
				
				// Check if callback uses prefix
				if (callback.startsWith(this.functionPrefix)) {
					const newCallback = callback.replace(new RegExp(`^${this.functionPrefix}`), '');
					analysis.hookCalls.push({
						type: hookType,
						hook: hookName,
						oldCallback: callback,
						newCallback: newCallback,
						line: this.getLineNumber(content, match.index),
					});
					analysis.changes.push({
						type: 'hook',
						hookType: hookType,
						from: callback,
						to: `__NAMESPACE__ . '\\${newCallback}'`,
					});
				}
			}

			this.results.filesScanned++;
			return analysis;
		} catch (error) {
			this.results.errors.push({ file: filePath, error: error.message });
			return null;
		}
	}

	/**
	 * Get line number for a character index in content
	 */
	getLineNumber(content, index) {
		return content.substring(0, index).split('\n').length;
	}

	/**
	 * Format a PHP file according to the rules
	 */
	formatFile(filePath, analysis) {
		if (this.options.dryRun) {
			return { formatted: false, changes: analysis.changes.length };
		}

		try {
			let content = fs.readFileSync(filePath, 'utf8');
			let changeCount = 0;

			// Step 1: Add or fix namespace
			if (analysis.needsNamespace) {
				const phpTag = '<?php';
				const phpTagIndex = content.indexOf(phpTag);
				
				if (phpTagIndex !== -1) {
					// Check if there's already a namespace
					const namespaceMatch = content.match(/^\s*namespace\s+([^;]+);/m);
					
					if (namespaceMatch) {
						// Replace existing namespace
						content = content.replace(
							/namespace\s+[^;]+;/,
							`namespace ${NAMESPACE};`
						);
					} else {
						// Add namespace after <?php and any docblock
						const afterPhpTag = content.substring(phpTagIndex + phpTag.length);
						const docBlockMatch = afterPhpTag.match(/^\s*(\/\*\*[\s\S]*?\*\/)?/);
						
						if (docBlockMatch) {
							const insertPosition = phpTagIndex + phpTag.length + docBlockMatch[0].length;
							content = content.substring(0, insertPosition) +
								`\nnamespace ${this.namespace};\n` +
								content.substring(insertPosition);
						}
					}
					changeCount++;
				}
			}

// Step 2: Remove function_exists wrappers (pluggable function pattern)
		if (analysis.functionExistsWrappers && analysis.functionExistsWrappers.length > 0) {
			analysis.functionExistsWrappers.forEach(wrapper => {
				// Remove the if ( ! function_exists(...) ) : line
				const ifPattern = new RegExp(
					`if\\s*\\(\\s*!\\s*function_exists\\s*\\(\\s*['"]${wrapper.funcName}['"]\\s*\\)\\s*\\)\\s*:\\s*\\n?`,
					'g'
				);
				const beforeReplace = content;
				content = content.replace(ifPattern, '');
				if (content !== beforeReplace) {
					changeCount++; // Increment for if statement removal
				}
			});
			
			// Now remove orphaned endif; statements
			// Split content into lines and look for standalone endif;
			const lines = content.split('\n');
			const linesToRemove = [];
			
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();
				
				// Check if this is a standalone endif; (possibly with comment)
				if (line === 'endif;' || line.startsWith('endif;')) {
					// This is an endif that needs to be removed
					// (since we removed all the if ( ! function_exists...) statements)
					linesToRemove.push(i);
				}
			}
			
			// Remove endifs in reverse order to preserve line indices
			for (let i = linesToRemove.length - 1; i >= 0; i--) {
				lines.splice(linesToRemove[i], 1);
				changeCount++;
			}
			
			content = lines.join('\n');
		}
		
		// Step 2.5: Clean up orphaned endif; statements (from previous formatter runs)
		if (analysis.orphanedEndifs && analysis.orphanedEndifs.length > 0) {
			const lines = content.split('\n');
			const linesToRemove = [];
			
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();
				if (line === 'endif;' || line.startsWith('endif;')) {
					linesToRemove.push(i);
				}
			}
			
			// Remove in reverse order
			for (let i = linesToRemove.length - 1; i >= 0; i--) {
				lines.splice(linesToRemove[i], 1);
				changeCount++;
			}
			
			content = lines.join('\n');
		}

		// Step 3: Remove prefix from function declarations
		analysis.prefixedFunctions.forEach(func => {
			const functionRegex = new RegExp(
				`function\\s+${func.oldName}\\s*\\(`,
				'g'
			);
			content = content.replace(functionRegex, `function ${func.newName}(`);
			changeCount++;
		});

		// Step 4: Update function checks (function_exists, !function_exists)
		analysis.prefixedFunctions.forEach(func => {
			const existsRegex = new RegExp(
				`(!?\\s*function_exists\\s*\\(\\s*)['"]${func.oldName}['"]`,
				'g'
			);
			content = content.replace(existsRegex, `$1'${func.newName}'`);
		});

		// Step 5: Update add_action and add_filter calls
		analysis.hookCalls.forEach(hook => {
			// Match the specific hook call and replace the callback
			const hookRegex = new RegExp(
				`(${hook.type}\\s*\\(\\s*['"]${hook.hook}['"]\\s*,\\s*)['"]${hook.oldCallback}['"]`,
				'g'
			);
			content = content.replace(
				hookRegex,
				`$1__NAMESPACE__ . '\\${hook.newCallback}'`
			);
			changeCount++;
		});

		// Write the formatted content
		if (changeCount > 0) {
			fs.writeFileSync(filePath, content, 'utf8');
			this.results.filesFormatted++;
			return { formatted: true, changes: changeCount };
		}

		return { formatted: false, changes: 0 };
		} catch (error) {
			this.results.errors.push({ file: filePath, error: error.message });
			return { formatted: false, changes: 0, error: error.message };
		}
	}

	/**
	 * Scan files and report what would be changed
	 */
	async scan(targetPath) {
		const resolvedPath = path.resolve(targetPath);
		
		if (!fs.existsSync(resolvedPath)) {
			console.error(`Error: Path does not exist: ${resolvedPath}`);
			return this.results;
		}

		// Initialize namespace and prefix
		await this.initialize(resolvedPath);

		console.log(`🔍 Scanning files...\n`);

		const files = this.getPhpFiles(resolvedPath);

		files.forEach(file => {
			if (this.options.verbose) {
				console.log(`Scanning: ${path.relative(resolvedPath, file)}`);
			}
			
			const analysis = this.analyzeFile(file);
			if (analysis && analysis.changes.length > 0) {
				this.results.changes.push(analysis);
			}
		});

		return this.results;
	}

	/**
	 * Format files according to the rules
	 */
	async format(targetPath) {
		// First scan to find what needs changing
		await this.scan(targetPath);

		if (this.results.changes.length === 0) {
			console.log('\n✅ No formatting needed.\n');
			return this.results;
		}

		console.log(`\n${this.options.dryRun ? '🔍 DRY RUN - ' : '✏️  '}Formatting files...\n`);

		// Format each file that needs changes
		this.results.changes.forEach(analysis => {
			const result = this.formatFile(analysis.file, analysis);
			if (result.formatted || this.options.dryRun) {
				console.log(`${this.options.dryRun ? '  Would format' : '  ✓ Formatted'}: ${path.basename(analysis.file)} (${analysis.changes.length} changes)`);
			}
		});

		return this.results;
	}

	/**
	 * Print detailed report
	 */
	printReport() {
		console.log('\n' + '═'.repeat(70));
		console.log('📊 INC FORMATTER REPORT');
		console.log('═'.repeat(70) + '\n');

		console.log(`Files scanned: ${this.results.filesScanned}`);
		console.log(`Files needing formatting: ${this.results.changes.length}`);
		console.log(`Files formatted: ${this.results.filesFormatted}\n`);

		if (this.results.errors.length > 0) {
			console.log(`\n⚠️  Errors encountered: ${this.results.errors.length}`);
			this.results.errors.forEach(err => {
				console.log(`  - ${path.basename(err.file)}: ${err.error}`);
			});
		}

		if (this.results.changes.length > 0) {
			console.log('📝 Changes Required:\n');
			
			this.results.changes.forEach(analysis => {
				console.log(`  ${path.basename(analysis.file)}`);
				
				// Namespace changes
				const namespaceChanges = analysis.changes.filter(c => c.type === 'namespace');
				if (namespaceChanges.length > 0) {
					namespaceChanges.forEach(change => {
						if (change.from) {
							console.log(`    ⚙️  Update namespace: ${change.from} → ${change.to}`);
						} else {
							console.log(`    ⚙️  Add namespace: ${change.to}`);
						}
					});
				}

				// Function changes
				const functionChanges = analysis.changes.filter(c => c.type === 'function');
				if (functionChanges.length > 0) {
					console.log(`    🔧 ${functionChanges.length} function(s) to rename:`);
					functionChanges.forEach(change => {
						console.log(`       ${change.from} → ${change.to}`);
					});
				}

				// Hook changes
				const hookChanges = analysis.changes.filter(c => c.type === 'hook');
				if (hookChanges.length > 0) {
					console.log(`    🪝 ${hookChanges.length} hook(s) to update:`);
					hookChanges.forEach(change => {
						console.log(`       ${change.hookType}: '${change.from}' → ${change.to}`);
					});
				}

				console.log('');
			});
		}

		console.log('═'.repeat(70) + '\n');
	}
}

/**
 * CLI Interface
 */
async function main() {
	const args = process.argv.slice(2);
	
	if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
		printHelp();
		process.exit(0);
	}

	const command = args[0];
	const targetPath = args[1] || './inc';
	
	// Extract namespace and prefix from args
	const namespaceArg = args.find(arg => arg.startsWith('--namespace='));
	const prefixArg = args.find(arg => arg.startsWith('--prefix='));
	
	const options = {
		verbose: args.includes('--verbose') || args.includes('-v'),
		dryRun: args.includes('--dry-run'),
		namespace: namespaceArg ? namespaceArg.split('=')[1] : null,
		prefix: prefixArg ? prefixArg.split('=')[1] : null,
	};

	const formatter = new IncFormatter(options);

	switch (command) {
		case '--scan':
		case '-s':
			await formatter.scan(targetPath);
			formatter.printReport();
			break;

		case '--format':
		case '-f':
			await formatter.format(targetPath);
			formatter.printReport();
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
║              🔧 Inc Formatter - WordPress Themes                   ║
╚════════════════════════════════════════════════════════════════════╝

USAGE:
  node scripts/inc-formatter.js <command> [path] [options]

COMMANDS:
  --scan, -s [path]     Scan files and report needed changes
  --format, -f [path]   Format files according to theme conventions
  --help, -h            Show this help message

OPTIONS:
  --namespace=<value>   Specify namespace (e.g., MyTheme\\\\includes)
  --prefix=<value>      Specify function prefix to remove (e.g., mytheme_)
  --dry-run             Preview changes without writing files
  --verbose, -v         Show detailed output

FORMATTING RULES:
  1. Add namespace to PHP files
  2. Remove function prefix from function names
  3. Update add_action/add_filter to use __NAMESPACE__ . '\\function_name'

AUTO-DETECTION:
  If --namespace or --prefix are not provided, the tool will:
  1. Auto-detect from existing PHP files
  2. Prompt you to confirm or enter values

EXAMPLES:
  # Scan with auto-detection
  node scripts/inc-formatter.js --scan ./inc

  # Scan with explicit values
  node scripts/inc-formatter.js --scan ./inc --namespace="MyTheme\\\\includes" --prefix="mt_"

  # Format with dry run (preview only)
  node scripts/inc-formatter.js --format ./inc --dry-run

  # Format all files in inc folder
  node scripts/inc-formatter.js --format ./inc

BEFORE:
  function mytheme_register_blocks() { ... }
  add_action( 'init', 'mytheme_register_blocks' );

AFTER:
  namespace MyTheme\\includes;
  
  function register_blocks() { ... }
  add_action( 'init', __NAMESPACE__ . '\\register_blocks' );
`);
}

// Run if called directly
if (require.main === module) {
	main();
}

module.exports = IncFormatter;
