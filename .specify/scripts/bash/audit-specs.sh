#!/bin/bash
# audit-specs.sh — Specification directory structure audit
# Purpose: Scan .github/specs/ and verify numbering, naming conventions, file presence

set -euo pipefail

SPECS_DIR=".github/specs"

# Color output for readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# Audit Functions
# ============================================================================

# Print the count and paths of spec directories with three-digit prefixes.
audit_scan_directories() {
  echo "📋 Scanning directories in $SPECS_DIR..."

  local count=0
  local dirs=()

  for dir in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
    if [ -d "$dir" ]; then
      dirs+=("$dir")
      ((++count))
    fi
  done

  echo "Found $count specification directories"
  printf '%s\n' "${dirs[@]}"
}

# Print whether a directory basename follows the {NNN}-{lowercase-slug} format.
# Return 0 when it does and 1 otherwise.
verify_naming_convention() {
  local dir="$1"
  local basename=$(basename "$dir")

  # Check pattern: 3 digits, dash, lowercase alphanumeric/hyphens
  if [[ $basename =~ ^[0-9]{3}-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "✓ $basename"
    return 0
  else
    echo "✗ $basename (invalid format)"
    return 1
  fi
}

# Print whether the given directory contains a regular spec.md file.
# Return 0 when it does and 1 otherwise.
verify_spec_file() {
  local dir="$1"
  local spec_file="$dir/spec.md"

  if [ -f "$spec_file" ]; then
    echo "✓ spec.md present"
    return 0
  else
    echo "✗ spec.md MISSING"
    return 1
  fi
}

# Print the first three characters of the given directory's basename.
extract_number() {
  local dir="$1"
  local basename=$(basename "$dir")
  echo "${basename:0:3}"
}

# Check that spec directory prefixes form a contiguous sequence starting at 001.
# Print the result and return 1 when the sequence is not contiguous.
verify_sequential_numbering() {
  echo ""
  echo "🔢 Verifying sequential numbering..."

  local numbers=()

  for dir in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
    if [ -d "$dir" ]; then
      local num=$(extract_number "$dir")
      numbers+=("$num")
    fi
  done

  # Sort numbers
  IFS=$'\n' sorted=($(sort <<<"${numbers[*]}"))
  unset IFS

  # Check for gaps
  local has_gaps=0
  local expected=1

  for num in "${sorted[@]}"; do
    local num_int=$((10#$num))  # Convert to integer
    if [ $num_int -ne $expected ]; then
      echo "❌ Gap detected: expected $expected but found $num_int"
      has_gaps=1
    fi
    expected=$((num_int + 1))
  done

  if [ $has_gaps -eq 0 ]; then
    echo "✓ Sequential numbering verified: ${sorted[0]} to ${sorted[-1]} with no gaps"
    return 0
  else
    return 1
  fi
}

# Print per-directory checks and aggregate naming and spec.md pass counts.
generate_inventory_report() {
  echo ""
  echo "📊 Complete Inventory Report"
  echo "============================"
  echo ""

  local total_dirs=0
  local naming_pass=0
  local spec_file_pass=0

  # Scan and report on each directory
  for dir in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
    if [ -d "$dir" ]; then
      ((++total_dirs))
      local basename=$(basename "$dir")

      echo "Directory: $basename"

      # Check naming
      if verify_naming_convention "$dir"; then
        ((++naming_pass))
      fi

      # Check spec.md
      if verify_spec_file "$dir"; then
        ((++spec_file_pass))
      fi

      echo ""
    fi
  done

  # Summary
  echo "📈 Summary"
  echo "=========="
  echo "Total directories: $total_dirs"
  echo "Naming compliance: $naming_pass/$total_dirs"
  echo "spec.md present: $spec_file_pass/$total_dirs"
}

# ============================================================================
# Main
# ============================================================================

# Run the directory scan, numbering check, and inventory report in sequence.
main() {
  echo "🔍 SpecKit Folder Structure Audit"
  echo "=================================="
  echo ""

  # Run scans
  audit_scan_directories
  verify_sequential_numbering
  generate_inventory_report
}

# Run main function
main "$@"
