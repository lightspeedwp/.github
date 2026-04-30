## Validation & Testing

All generated patterns must pass these validation checks:

### 1. Block Comment Syntax Validation
- **Check**: All block comments properly closed with `-->` (not `>`)
- **Pattern**: `<!-- wp:block-name {JSON} -->` for opening tags
- **Pattern**: `<!-- /wp:block-name -->` for closing tags
- **Common Error**: `<!-- wp:group {...}}>` should be `<!-- wp:group {...} -->`

### 2. Block Structure Validation
- **Check**: Every opening block has matching closing block
- **Check**: Block nesting is logically correct (no orphaned blocks)
- **Check**: JSON attributes are valid (properly escaped quotes, no trailing commas)
- **Test**: Copy pattern into WordPress block editor - should load without validation errors

### 3. PHP Syntax Validation
- **Check**: All PHP tags properly opened `<?php` and closed `?>`
- **Check**: Proper escaping for translatable strings: `esc_html__()`, `esc_attr__()`
- **Check**: No syntax errors in inline PHP (missing semicolons, brackets)
- **Test**: Run `php -l pattern-file.php` to check for parse errors

### 4. WordPress Block Validation Errors
- **Monitor**: Browser console for block validation errors
- **Pattern**: `Block validation: Block validation failed for...`
- **Fix**: Check that content structure matches block's expected output
- **Example**: If error shows `<div>` expected but `<p>` found, review block type

### 5. Accessibility Testing
- **Check**: Run WAVE or axe DevTools on rendered pattern
- **Verify**: Proper heading hierarchy (no skipped levels)
- **Verify**: Interactive elements have accessible names
- **Test**: Keyboard navigation works (Tab, Enter, Escape keys)

### 6. Responsive Testing
- **Test**: Pattern renders correctly at mobile (375px), tablet (768px), desktop (1200px+)
- **Check**: Images use responsive sizing or object-fit
- **Check**: Typography scales appropriately with font-size presets

### 7. Integration Testing
- **WooCommerce**: Products display with correct pricing, ratings, add-to-cart buttons
- **LifterLMS**: Courses show enrollment status and CTAs correctly
- **ACF**: Custom fields populate with display field block correctly
- **Custom Post Types**: Query loops filter and display CPT content as expected

### Testing Workflow

1. **Generate Pattern** → Create pattern file with proper PHP header
2. **Syntax Check** → Run `php -l` and validate block comment syntax
3. **WordPress Test** → Insert pattern in block editor, check for validation errors
4. **Browser Console** → Monitor for JavaScript errors or warnings
5. **Visual Review** → Check spacing, alignment, typography across breakpoints
6. **Accessibility Scan** → Run WAVE/axe, test keyboard navigation
7. **Integration Verify** → Confirm plugin/ACF data populates correctly
8. **Performance Check** → Verify lazy loading, no unnecessary scripts loaded

### Common Validation Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| Malformed block comment | `Block validation failed` error | Change `}>` to `} -->` |
| Missing closing block | Pattern doesn't render | Add `<!-- /wp:block-name -->` |
| Invalid JSON | Block doesn't load | Fix JSON syntax (quotes, commas) |
| PHP parse error | White screen | Check PHP syntax with `php -l` |
| Incorrect block type | Content doesn't match | Use correct block (paragraph vs heading) |
| Missing escaping | Security warning | Wrap translations in `esc_html__()` |

