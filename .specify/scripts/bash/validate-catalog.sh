#!/bin/bash
# validate-catalog.sh — Catalog validation for specification governance
# Purpose: Validate CATALOG.md structure, links, and schema compliance

set -euo pipefail

# Enable debug output for troubleshooting environment-specific issues
if [ "${DEBUG:-}" = "1" ] || [ "${GITHUB_ACTIONS:-}" = "true" ]; then
  set -x
fi

# CATALOG_PATH - Always use relative path from repo root
CATALOG_PATH=".github/specs/CATALOG.md"

# validate_catalog_exists - Verify CATALOG.md file exists
# Parameters: None
# Returns:
#   0 when CATALOG.md file exists and is a regular file
#   1 when CATALOG.md is missing or not found
# Output:
#   Status message confirming file existence or reporting it not found
validate_catalog_exists() {
  if [ -f "$CATALOG_PATH" ]; then
    echo "✓ CATALOG.md exists"
    return 0
  else
    echo "✗ CATALOG.md not found at $CATALOG_PATH"
    return 1
  fi
}

# validate_canonical_schema - Verify CATALOG.md contains canonical schema and table format
# Parameters: None
# Returns:
#   0 when table header matches exact canonical schema format
#   1 when table header does not match required canonical schema
# Output:
#   Status messages confirming schema section presence and table format validation
validate_canonical_schema() {
  if grep -q "Catalog Schema (Canonical)" "$CATALOG_PATH"; then
    echo "✓ Canonical schema section found"
  else
    echo "⚠ Canonical schema section not documented"
  fi

  # Verify table headers match exactly in both Active and Draft sections
  local schema_valid=0

  if grep -A 2 "## Active Specifications" "$CATALOG_PATH" | grep -q "^| # | Slug | Title | Status | Created | Link |$"; then
    echo "✓ Active Specifications table follows canonical schema"
  else
    echo "✗ Active Specifications table does not follow canonical schema"
    schema_valid=1
  fi

  if grep -A 2 "## Draft Specifications" "$CATALOG_PATH" | grep -q "^| # | Slug | Title | Status | Created | Link |$"; then
    echo "✓ Draft Specifications table follows canonical schema"
  else
    echo "✗ Draft Specifications table does not follow canonical schema"
    schema_valid=1
  fi

  return $schema_valid
}

# validate_catalog_links - Verify all markdown links in CATALOG.md point to existing targets
# Parameters: None
# Returns:
#   0 when all extracted markdown links resolve to existing files or directories
#   1 when one or more broken links are detected (targets not found)
# Output:
#   Status message for each broken link found with target path, summary of validation result
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

# validate_maintenance_schema - Verify MAINTENANCE.md exists and documents canonical schema
# Parameters: None
# Returns:
#   0 when MAINTENANCE.md exists and documents canonical schema, or file is optional
#   1 when MAINTENANCE.md exists but does not document canonical schema
# Output:
#   Status message confirming maintenance documentation presence and schema compliance
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

# main - Run all catalog validation checks in sequence
# Parameters:
#   $@ - Arguments passed through main function (currently unused)
# Returns:
#   0 when all validation checks pass
#   1 when any validation check fails
# Output:
#   Complete catalog validation report with results of all checks
main() {
  echo "📋 Catalog Validation"
  echo "===================="
  echo "Working directory: $(pwd)"
  echo "CATALOG_PATH: $CATALOG_PATH"
  [ -f "$CATALOG_PATH" ] && echo "CATALOG.md size: $(wc -c < "$CATALOG_PATH") bytes" || echo "CATALOG.md: NOT FOUND"
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

  echo "Final result: rc=$rc"
  return $rc
}

main "$@"
