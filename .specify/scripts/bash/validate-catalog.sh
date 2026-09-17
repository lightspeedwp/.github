#!/bin/bash
# validate-catalog.sh — Catalog validation for specification governance
# Purpose: Validate CATALOG.md structure, links, and schema compliance

set -euo pipefail

# CATALOG_PATH - Always use relative path from repo root
CATALOG_PATH=".github/specs/CATALOG.md"

# validate_catalog_exists - Verify CATALOG.md file exists
validate_catalog_exists() {
  if [ -f "$CATALOG_PATH" ]; then
    echo "✓ CATALOG.md exists"
    return 0
  else
    echo "✗ CATALOG.md not found at $CATALOG_PATH"
    return 1
  fi
}

# validate_canonical_schema - Verify CATALOG.md contains canonical schema
validate_canonical_schema() {
  if grep -q "Catalog Schema (Canonical)" "$CATALOG_PATH"; then
    echo "✓ Canonical schema section found"
  else
    echo "⚠ Canonical schema section not documented"
  fi

  # Verify table header matches exactly
  if grep -A 2 "## Active Specifications" "$CATALOG_PATH" | grep -q "^| # | Slug | Title | Status | Created | Link |$"; then
    echo "✓ Table follows canonical schema"
    return 0
  else
    echo "✗ Table does not follow canonical schema"
    return 1
  fi
}

# validate_catalog_links - Verify all markdown links point to existing targets
validate_catalog_links() {
  local broken_links=0
  local catalog_dir=$(dirname "$CATALOG_PATH")

  # Use process substitution with while loop to validate links
  # Extract all markdown links in format ](./NNN-*/...
  while IFS= read -r link; do
    [ -z "$link" ] && continue

    # Extract target path by removing ]( prefix and ) suffix
    local target="${link:2}"      # Remove ](
    target="${target%\)}"         # Remove )

    # Skip external links
    [[ $target == http* ]] && continue

    # Resolve full path
    local full_path="$catalog_dir/$target"

    # Check if target exists (file or directory)
    if [ ! -f "$full_path" ] && [ ! -d "$full_path" ]; then
      echo "✗ Broken link: $link (target not found: $full_path)"
      ((++broken_links))
    fi
  done < <(grep -oE '\]\(\./[0-9]{3}-[^)]+\)' "$CATALOG_PATH")

  if [ $broken_links -eq 0 ]; then
    echo "✓ All catalog links point to existing specifications"
    return 0
  else
    echo "✗ Found $broken_links broken link(s) in CATALOG.md"
    return 1
  fi
}

# validate_maintenance_schema - Verify MAINTENANCE.md exists and documents schema
validate_maintenance_schema() {
  local maintenance_file="${CATALOG_PATH%/CATALOG.md}/MAINTENANCE.md"

  if [ ! -f "$maintenance_file" ]; then
    echo "⚠ MAINTENANCE.md not found"
    return 0
  fi

  if grep -q "Canonical Schema" "$maintenance_file"; then
    echo "✓ MAINTENANCE.md documents canonical schema"
    return 0
  else
    echo "✗ MAINTENANCE.md must document canonical schema"
    return 1
  fi
}

# main - Run all validation checks in sequence
main() {
  echo "📋 Catalog Validation"
  echo "===================="
  echo ""

  local rc=0

  # Run all validations
  echo "Validating catalog existence..."
  validate_catalog_exists || rc=1
  echo ""

  echo "Validating canonical schema..."
  validate_canonical_schema || rc=1
  echo ""

  echo "Validating catalog links..."
  validate_catalog_links || rc=1
  echo ""

  echo "Validating MAINTENANCE.md..."
  validate_maintenance_schema || rc=1
  echo ""

  return $rc
}

main "$@"
