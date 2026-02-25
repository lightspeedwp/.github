#!/usr/bin/env node

/**
 * WordPress Block Pattern Validator
 * 
 * Validates and optionally fixes WordPress block pattern files to ensure
 * HTML output matches block comment attributes.
 * 
 * Usage:
 *   node validate-patterns.js <file-or-directory> [--fix] [--verbose]
 * 
 * Examples:
 *   node validate-patterns.js patterns/hero.php
 *   node validate-patterns.js patterns/ --fix
 *   node validate-patterns.js patterns/ --verbose
 */

const fs = require('fs');
const path = require('path');

class WordPressBlockValidator {
  constructor(options = {}) {
    this.options = {
      fix: options.fix || false,
      verbose: options.verbose || false,
      dryRun: options.dryRun || false,
    };
    this.errors = [];
    this.filesScanned = 0;
    this.filesWithErrors = 0;
    this.totalErrors = 0;
  }

  /**
   * Parse WordPress block comment and extract attributes
   */
  parseBlockComment(line) {
    const match = line.match(/<!--\s+wp:([a-z/-]+)\s+({.*?})\s+-->/);
    if (!match) return null;
    
    try {
      return {
        blockType: match[1],
        attributes: JSON.parse(match[2]),
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Parse HTML tag and extract classes and styles
   */
  parseHtmlTag(line) {
    const tagMatch = line.match(/<([a-z0-9]+)([^>]*)>/i);
    if (!tagMatch) return null;

    const tagName = tagMatch[1];
    const attributes = tagMatch[2];

    // Extract class attribute
    const classMatch = attributes.match(/class="([^"]*)"/);
    const classes = classMatch ? classMatch[1].split(/\s+/).filter(Boolean) : [];

    // Extract style attribute
    const styleMatch = attributes.match(/style="([^"]*)"/);
    const styles = styleMatch ? styleMatch[1] : '';

    return { tagName, classes, styles, fullTag: line };
  }

  /**
   * Convert var:preset|type|value to var(--wp--preset--type--value)
   * Also handles var:custom|type|value to var(--wp--custom--type--value)
   */
  convertPresetNotation(value) {
    if (typeof value !== 'string') return value;
    // Handle both preset and custom notation
    return value
      .replace(/var:preset\|([^|]+)\|([^|]+)/g, 'var(--wp--preset--$1--$2)')
      .replace(/var:custom\|([^|]+)\|([^|]+)/g, 'var(--wp--custom--$1--$2)');
  }

  /**
   * Generate expected classes based on block attributes
   */
  generateExpectedClasses(blockType, attributes, isButtonLink = false) {
    const classes = [];

    // Base block class
    // Special case: button inner link uses 'wp-block-button__link' instead of 'wp-block-button'
    const baseClass = (blockType === 'button' && isButtonLink) 
      ? 'wp-block-button__link' 
      : `wp-block-${blockType.replace('/', '-')}`;
    classes.push(baseClass);

    // Alignment
    if (attributes.align) {
      classes.push(`align${attributes.align}`);
    }

    // Custom className - split by spaces to handle multiple classes
    if (attributes.className) {
      const customClasses = attributes.className.split(/\s+/).filter(Boolean);
      classes.push(...customClasses);
    }

    // Text color
    if (attributes.textColor) {
      classes.push(`has-${attributes.textColor}-color`);
      classes.push('has-text-color');
    }

    // Background color
    if (attributes.backgroundColor) {
      classes.push(`has-${attributes.backgroundColor}-background-color`);
      classes.push('has-background');
    }

    // Text alignment
    if (attributes.textAlign) {
      classes.push(`has-text-align-${attributes.textAlign}`);
    }

    // Font size
    // SPECIAL CASE: Button links always get font size classes, even for default (base)
    // Wrapper divs only get them for non-default sizes
    if (attributes.fontSize) {
      if (isButtonLink || attributes.fontSize !== 'base') {
        classes.push(`has-${attributes.fontSize}-font-size`);
      }
    }

    // Custom font size indicator (appears when fontSize is set)
    if (attributes.fontSize && isButtonLink) {
      classes.push('has-custom-font-size');
    }

    return classes;
  }

  /**
   * Generate expected inline styles based on block attributes
   */
  generateExpectedStyles(attributes) {
    const styles = [];

    if (!attributes.style) return '';

    const styleObj = attributes.style;

    // Spacing - Padding
    if (styleObj.spacing?.padding) {
      const padding = styleObj.spacing.padding;
      if (padding.top) styles.push(`padding-top:${this.convertPresetNotation(padding.top)}`);
      if (padding.right) styles.push(`padding-right:${this.convertPresetNotation(padding.right)}`);
      if (padding.bottom) styles.push(`padding-bottom:${this.convertPresetNotation(padding.bottom)}`);
      if (padding.left) styles.push(`padding-left:${this.convertPresetNotation(padding.left)}`);
    }

    // Spacing - Margin
    if (styleObj.spacing?.margin) {
      const margin = styleObj.spacing.margin;
      if (margin.top) styles.push(`margin-top:${this.convertPresetNotation(margin.top)}`);
      if (margin.right) styles.push(`margin-right:${this.convertPresetNotation(margin.right)}`);
      if (margin.bottom) styles.push(`margin-bottom:${this.convertPresetNotation(margin.bottom)}`);
      if (margin.left) styles.push(`margin-left:${this.convertPresetNotation(margin.left)}`);
    }

    // Border
    if (styleObj.border?.radius) {
      styles.push(`border-radius:${this.convertPresetNotation(styleObj.border.radius)}`);
    }
    if (styleObj.border?.width) {
      styles.push(`border-width:${this.convertPresetNotation(styleObj.border.width)}`);
    }
    if (styleObj.border?.color) {
      styles.push(`border-color:${this.convertPresetNotation(styleObj.border.color)}`);
    }

    // Colors (custom)
    if (styleObj.color?.background) {
      styles.push(`background-color:${this.convertPresetNotation(styleObj.color.background)}`);
    }
    if (styleObj.color?.text) {
      styles.push(`color:${this.convertPresetNotation(styleObj.color.text)}`);
    }

    // Background Image
    if (styleObj.background?.backgroundImage) {
      const bgImage = styleObj.background.backgroundImage;
      if (bgImage.url) {
        styles.push(`background-image:url('${bgImage.url}')`);
      }
    }
    if (styleObj.background?.backgroundSize) {
      styles.push(`background-size:${styleObj.background.backgroundSize}`);
    }
    if (styleObj.background?.backgroundPosition) {
      styles.push(`background-position:${styleObj.background.backgroundPosition}`);
    }
    if (styleObj.background?.backgroundRepeat) {
      styles.push(`background-repeat:${styleObj.background.backgroundRepeat}`);
    }

    // Typography
    if (styleObj.typography?.fontSize) {
      styles.push(`font-size:${this.convertPresetNotation(styleObj.typography.fontSize)}`);
    }
    if (styleObj.typography?.lineHeight) {
      styles.push(`line-height:${this.convertPresetNotation(styleObj.typography.lineHeight)}`);
    }

    return styles.join(';');
  }

  /**
   * Validate a single block
   */
  validateBlock(blockComment, htmlTag, lineNumber, filePath) {
    const block = this.parseBlockComment(blockComment);
    if (!block) return null;

    let html = this.parseHtmlTag(htmlTag);
    if (!html) return null;

    let isButtonLink = false;

    // SPECIAL CASE: Button blocks apply attributes to inner <a> tag, not wrapper div
    // WordPress structure: <div class="wp-block-button"><a class="wp-block-button__link ...">
    if (block.blockType === 'button' && html.tagName === 'div') {
      // Try to extract the inner <a> tag
      const innerLinkMatch = htmlTag.match(/<a\s+([^>]*)>/);
      if (innerLinkMatch) {
        const linkHtml = this.parseHtmlTag(innerLinkMatch[0]);
        if (linkHtml) {
          // Use the inner link for validation instead of wrapper div
          html = linkHtml;
          isButtonLink = true;
        }
      }
    }

    const expectedClasses = this.generateExpectedClasses(block.blockType, block.attributes, isButtonLink);
    const expectedStyles = this.generateExpectedStyles(block.attributes);

    const errors = [];
    const missingClasses = [];
    const extraClasses = [];
    const warnings = [];

    // Check for missing classes
    expectedClasses.forEach(expectedClass => {
      if (!html.classes.includes(expectedClass)) {
        missingClasses.push(expectedClass);
      }
    });

    // Check for expected styles
    const missingStyles = [];
    if (expectedStyles && !html.styles.includes(expectedStyles)) {
      if (expectedStyles && !html.styles) {
        missingStyles.push(`Missing entire style attribute: ${expectedStyles}`);
      } else {
        // Parse and compare individual style properties
        const expectedStyleProps = expectedStyles.split(';').filter(Boolean);
        expectedStyleProps.forEach(prop => {
          if (!html.styles.includes(prop.trim())) {
            missingStyles.push(prop.trim());
          }
        });
      }
    }

    // NEW CHECK: Detect redundant fontFamily that WordPress strips
    if (block.attributes.style?.typography?.fontFamily) {
      const fontFamilyValue = this.convertPresetNotation(block.attributes.style.typography.fontFamily);
      if (html.styles && html.styles.includes(`font-family:${fontFamilyValue}`)) {
        warnings.push({
          type: 'redundant-font-family',
          message: `Block has fontFamily in attributes that appears in HTML but WordPress may strip it if it matches theme default: ${fontFamilyValue}`,
          fix: 'Remove fontFamily from block attributes if it matches your theme.json default',
        });
      }
    }

    // NEW CHECK: Detect malformed font size classes (e.g., has-h-3-font-size instead of has-h3-font-size)
    if (block.attributes.fontSize) {
      const expectedFontSizeClass = `has-${block.attributes.fontSize}-font-size`;
      // Check for common typo: extra dashes in font size slug
      const malformedPattern = html.classes.find(cls => {
        return cls.startsWith('has-') && cls.endsWith('-font-size') && cls !== expectedFontSizeClass;
      });
      
      if (malformedPattern && !html.classes.includes(expectedFontSizeClass)) {
        warnings.push({
          type: 'malformed-font-size-class',
          message: `Font size class is malformed: "${malformedPattern}" should be "${expectedFontSizeClass}"`,
          current: malformedPattern,
          expected: expectedFontSizeClass,
          fix: `Change "${malformedPattern}" to "${expectedFontSizeClass}"`,
        });
      }
    }

    if (missingClasses.length > 0 || missingStyles.length > 0 || warnings.length > 0) {
      return {
        lineNumber,
        blockType: block.blockType,
        blockComment,
        htmlTag,
        missingClasses,
        missingStyles,
        warnings,
        expectedClasses,
        expectedStyles,
        currentClasses: html.classes,
        currentStyles: html.styles,
      };
    }

    return null;
  }

  /**
   * Fix HTML tag with correct classes and styles
   */
  fixHtmlTag(htmlTag, expectedClasses, expectedStyles) {
    const html = this.parseHtmlTag(htmlTag);
    if (!html) return htmlTag;

    // Rebuild class attribute
    const classAttr = `class="${expectedClasses.join(' ')}"`;

    // Rebuild style attribute
    const styleAttr = expectedStyles ? ` style="${expectedStyles}"` : '';

    // Extract any other attributes (href, etc.)
    let otherAttrs = '';
    const fullAttrs = htmlTag.match(/<[a-z0-9]+([^>]*)>/i);
    if (fullAttrs) {
      otherAttrs = fullAttrs[1]
        .replace(/class="[^"]*"/g, '')
        .replace(/style="[^"]*"/g, '')
        .trim();
    }

    // Reconstruct tag
    const indent = htmlTag.match(/^(\s*)/)[1];
    const closingTag = htmlTag.match(/>$/);
    const selfClosing = htmlTag.includes('/>');
    
    let newTag = `${indent}<${html.tagName} ${classAttr}`;
    if (styleAttr) newTag += styleAttr;
    if (otherAttrs) newTag += ` ${otherAttrs}`;
    newTag += selfClosing ? '/>' : '>';

    return newTag;
  }

  /**
   * Validate a single file
   */
  validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileErrors = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for non-WordPress block comments (these are not allowed)
      const htmlCommentMatch = line.match(/<!--\s*(.+?)\s*-->/);
      if (htmlCommentMatch) {
        const commentContent = htmlCommentMatch[1].trim();
        // Valid WordPress block comments start with "wp:" or "/wp:"
        const isWordPressComment = commentContent.startsWith('wp:') || commentContent.startsWith('/wp:');
        
        if (!isWordPressComment) {
          fileErrors.push({
            lineNumber: i + 1,
            blockType: 'invalid-comment',
            blockComment: line,
            htmlTag: '',
            missingClasses: [],
            missingStyles: [],
            warnings: [{
              type: 'non-wordpress-comment',
              message: `Invalid comment: Only WordPress block comments are allowed`,
              current: htmlCommentMatch[0],
              fix: 'Remove this comment. WordPress block templates should only contain block comments (<!-- wp:blocktype --> or <!-- /wp:blocktype -->)',
            }],
            expectedClasses: [],
            expectedStyles: '',
            currentClasses: [],
            currentStyles: '',
          });
        }
      }
      
      // Check for navigation block syntax errors (but not navigation-link)
      if (line.includes('<!-- wp:navigation ') && !line.includes('<!-- wp:navigation-link')) {
        const isSelfClosing = line.trim().endsWith('/-->');
        
        // Look ahead for children or closing tag
        let hasChildren = false;
        let hasClosingTag = false;
        
        for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
          const futureLine = lines[j];
          if (futureLine.indexOf('<!-- wp:navigation-link') !== -1) {
            hasChildren = true;
          }
          if (futureLine.indexOf('<!-- /wp:navigation -->') !== -1) {
            hasClosingTag = true;
            break;
          }
          // Stop if we hit another block opening
          if (j > i + 1 && futureLine.indexOf('<!-- wp:') !== -1 && futureLine.indexOf('<!-- /wp:') === -1) {
            break;
          }
        }
        
        // Error: Self-closing but has children or closing tag
        if (isSelfClosing && (hasChildren || hasClosingTag)) {
          fileErrors.push({
            lineNumber: i + 1,
            htmlLineNumber: i + 1, // Add this so report generation works
            blockType: 'navigation',
            blockComment: line.trim(),
            htmlTag: line.trim(),
            htmlLine: line.trim(),
            missingClasses: [],
            missingStyles: [],
            warnings: [{
              type: 'navigation-syntax-error',
              message: `Navigation block uses self-closing syntax (/-->) but has children or closing tag`,
              current: line.trim(),
              fix: hasChildren 
                ? 'Change /--&gt; to --&gt; (remove the slash) because this block has children'
                : 'Remove the closing <!-- /wp:navigation --> tag because this block is self-closing',
            }],
            expectedClasses: [],
            expectedStyles: '',
            currentClasses: [],
            currentStyles: '',
          });
        }
      }
      
      // Check if this is a WordPress block comment
      if (line.includes('<!-- wp:')) {
        // Get the next non-empty line
        let nextLineIndex = i + 1;
        while (nextLineIndex < lines.length && !lines[nextLineIndex].trim()) {
          nextLineIndex++;
        }

        if (nextLineIndex < lines.length) {
          const htmlLine = lines[nextLineIndex];
          const error = this.validateBlock(line, htmlLine, i + 1, filePath);
          
          if (error) {
            error.htmlLineNumber = nextLineIndex + 1;
            error.htmlLine = htmlLine;
            fileErrors.push(error);
          }
        }
      }
    }

    return { filePath, errors: fileErrors, lines };
  }

  /**
   * Fix errors in a file
   */
  fixFile(filePath, validationResult) {
    if (validationResult.errors.length === 0) return false;

    const lines = [...validationResult.lines];
    
    // Fix errors in reverse order to maintain line numbers
    validationResult.errors.reverse().forEach(error => {
      const fixedHtml = this.fixHtmlTag(
        error.htmlLine,
        error.expectedClasses,
        error.expectedStyles
      );
      lines[error.htmlLineNumber - 1] = fixedHtml;
    });

    if (!this.options.dryRun) {
      fs.writeFileSync(filePath, lines.join('\n'));
    }

    return true;
  }

  /**
   * Generate validation report
   */
  generateReport(results) {
    console.log('\n' + '='.repeat(60));
    console.log('WordPress Block Pattern Validation Report');
    console.log('='.repeat(60) + '\n');

    results.forEach(result => {
      const status = result.errors.length === 0 ? '✅' : '❌';
      console.log(`${status} ${result.filePath}`);
      
      if (result.errors.length > 0) {
        console.log(`   Found ${result.errors.length} error(s)\n`);
        
        result.errors.forEach((error, index) => {
          console.log(`   Error ${index + 1}:`);
          console.log(`   Block: ${error.blockType} (Line ${error.lineNumber})`);
          console.log(`   HTML Tag: Line ${error.htmlLineNumber}`);
          
          // Show warnings first (these are critical issues causing validation errors)
          if (error.warnings && error.warnings.length > 0) {
            error.warnings.forEach(warning => {
              if (warning.type === 'non-wordpress-comment') {
                console.log(`   ⚠️  ERROR: ${warning.message}`);
                console.log(`   Comment: ${warning.current}`);
                console.log(`   Fix: ${warning.fix}`);
              } else if (warning.type === 'navigation-syntax-error') {
                console.log(`   ⚠️  CRITICAL: ${warning.message}`);
                console.log(`   Block: ${warning.current}`);
                console.log(`   Fix: ${warning.fix}`);
              } else if (warning.type === 'malformed-font-size-class') {
                console.log(`   ⚠️  CRITICAL: ${warning.message}`);
                console.log(`   Fix: ${warning.fix}`);
              } else if (warning.type === 'redundant-font-family') {
                console.log(`   ⚠️  WARNING: ${warning.message}`);
                console.log(`   Fix: ${warning.fix}`);
              }
            });
          }
          
          if (error.missingClasses.length > 0) {
            console.log(`   Missing classes: ${error.missingClasses.join(', ')}`);
          }
          
          if (error.missingStyles.length > 0) {
            console.log(`   Missing styles: ${error.missingStyles.join('; ')}`);
          }

          if (this.options.verbose) {
            console.log(`   Current: ${error.currentClasses.join(' ')}`);
            console.log(`   Expected: ${error.expectedClasses.join(' ')}`);
            if (error.expectedStyles) {
              console.log(`   Expected styles: ${error.expectedStyles}`);
            }
          }
          
          console.log('');
        });
      }
    });

    console.log('='.repeat(60));
    console.log(`Files scanned: ${this.filesScanned}`);
    console.log(`Files with errors: ${this.filesWithErrors}`);
    console.log(`Total errors: ${this.totalErrors}`);
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Scan directory recursively for PHP files
   */
  scanDirectory(dirPath) {
    const files = [];
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.scanDirectory(fullPath));
      } else if (stat.isFile() && item.endsWith('.php')) {
        files.push(fullPath);
      }
    });

    return files;
  }

  /**
   * Run validation
   */
  run(targetPath) {
    let files = [];

    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      files = this.scanDirectory(targetPath);
    } else if (stat.isFile()) {
      files = [targetPath];
    }

    const results = [];

    files.forEach(file => {
      this.filesScanned++;
      const result = this.validateFile(file);
      
      if (result.errors.length > 0) {
        this.filesWithErrors++;
        this.totalErrors += result.errors.length;
        
        if (this.options.fix) {
          const fixed = this.fixFile(file, result);
          if (fixed) {
            console.log(`✅ Fixed: ${file}`);
          }
        }
      }

      results.push(result);
    });

    this.generateReport(results);

    return {
      success: this.totalErrors === 0,
      filesScanned: this.filesScanned,
      filesWithErrors: this.filesWithErrors,
      totalErrors: this.totalErrors,
    };
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
WordPress Block Pattern Validator

Usage:
  node validate-patterns.js <file-or-directory> [options]

Options:
  --fix         Automatically fix errors
  --verbose     Show detailed error information
  --dry-run     Show what would be fixed without making changes

Examples:
  node validate-patterns.js patterns/hero.php
  node validate-patterns.js patterns/ --fix
  node validate-patterns.js patterns/ --verbose --dry-run
    `);
    process.exit(0);
  }

  const targetPath = args[0];
  const options = {
    fix: args.includes('--fix'),
    verbose: args.includes('--verbose'),
    dryRun: args.includes('--dry-run'),
  };

  const validator = new WordPressBlockValidator(options);
  const result = validator.run(targetPath);

  process.exit(result.success ? 0 : 1);
}

module.exports = WordPressBlockValidator;
