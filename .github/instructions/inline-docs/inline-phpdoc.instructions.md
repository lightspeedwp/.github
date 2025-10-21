# INLINE-PHPDOC.md

LightSpeedWP standard for **inline documentation in PHP** using PHPDoc and WordPress inline docs.

## Principles
- **Every public class, interface, trait, function, hook, and filter** requires a DocBlock.
- File headers for main plugin files, bootstrap files, or files with multiple concerns.
- Match **WPCS** (WordPress Coding Standards) expectations and naming.
- Include `@since` for new public APIs and changes.

## Required elements
- **File DocBlock**: brief summary, package, since.
- **Class/Interface DocBlock**: purpose, `@since`, `@see` (links/issues).
- **Method/Function DocBlock**:
  - `@param type $name Description.` (one per param, note nullable `?type`)
  - `@return type Description.`
  - `@throws ExceptionType When condition.` (if thrown)
  - `@since X.Y.Z` on introduction or behaviour changes
  - `@deprecated X.Y.Z Use other_function() instead.` if applicable
- **Hooks (actions/filters)** must be documented where applied:
  - Include tag “Fires/Filters” description and all parameters.

## WordPress specifics
- Escaping & sanitisation MUST be noted where relevant.
- Add **translators** comments before translatable strings:
  ```php
  /* translators: %d: number of items */
  printf( esc_html__( 'Found %d items', 'text-domain' ), $count );
  ```
- Use **prefixes/namespaces** to avoid collisions; document prefixes in file header.

## Examples

### Function
```php
/**
 * Calculate inclusive VAT.
 *
 * @param float $amount  Net amount in ZAR.
 * @param float $rate    VAT rate as decimal. Default 0.15.
 * @return float Gross amount including VAT.
 * @since 1.2.0
 */
function lswp_calc_vat( $amount, $rate = 0.15 ) {
    return round( $amount * ( 1 + $rate ), 2 );
}
```

### Filter
```php
/**
 * Filters the default VAT rate.
 *
 * @since 1.2.0
 *
 * @param float $rate Default VAT rate as decimal.
 */
$rate = apply_filters( 'lswp_vat_rate', 0.15 );
```
