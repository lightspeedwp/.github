#!/bin/bash
# audit-specs.sh — Specification directory structure audit
# Purpose: Scan .github/specs/ and verify numbering, naming conventions, file presence

set -euo pipefail

# Resolve SPECS_DIR from repo root using find_specify_root or by looking for .specify
# find_repo_root - Locate repository root by searching for .specify directory
# Parameters:
#   $1 - Starting directory (default: current directory)
# Returns:
#   0 on success with repo root path echoed
#   1 if .specify directory not found in any parent directory
find_repo_root() {
  local dir="${1:-.}"
  dir="$(cd "$dir" 2>/dev/null && pwd)" || return 1
  local prev_dir=""
  while [ "$dir" != "$prev_dir" ]; do
    if [ -d "$dir/.specify" ]; then
      echo "$dir"
      return 0
    fi
    prev_dir="$dir"
    dir="$(dirname "$dir")"
  done
  return 1
}

# Prefer the repo that contains the current directory; fall back to the repo
# that contains this script so the audit works from any cwd.
SPECS_DIR=".github/specs"
if repo_root=$(find_repo_root); then
  SPECS_DIR="$repo_root/.github/specs"
elif repo_root=$(find_repo_root "$(dirname "${BASH_SOURCE[0]}")"); then
  SPECS_DIR="$repo_root/.github/specs"
fi

# ============================================================================
# Audit Functions
# ============================================================================

# audit_scan_directories - Print the count and paths of spec directories with three-digit prefixes.
# Parameters: None
# Returns:
#   0 always succeeds
# Output:
#   Status message with count and list of all spec directory paths
audit_scan_directories() {
  echo "📋 Scanning directories in $SPECS_DIR..."

  local count=0
  local dirs=()

  # Enumerate ALL immediate subdirectories (including malformed ones) for inventory and validation
  for dir in "$SPECS_DIR"/*/; do
    if [ -d "$dir" ]; then
      dirs+=("$dir")
      ((++count))
    fi
  done

  echo "Found $count specification directories"
  printf '%s\n' "${dirs[@]}"
}

# verify_naming_convention - Print whether a directory basename follows the {NNN}-{lowercase-slug} format.
# Parameters:
#   $1 - Directory path to validate
# Returns:
#   0 when directory name matches pattern {NNN}-{lowercase-slug}
#   1 when directory name does not match required format
verify_naming_convention() {
  local dir="$1"
  local basename
  basename=$(basename "$dir")

  # Check pattern: 3 digits, dash, lowercase alphanumeric/hyphens
  if [[ $basename =~ ^[0-9]{3}-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "✓ $basename"
    return 0
  else
    echo "✗ $basename (invalid format)"
    return 1
  fi
}

# verify_spec_file - Print whether the given directory contains a regular spec.md file.
# Parameters:
#   $1 - Directory path to check for spec.md
# Returns:
#   0 when spec.md file exists and is a regular file
#   1 when spec.md is missing or not a regular file
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

# extract_number - Print the first three characters of the given directory's basename.
# Parameters:
#   $1 - Directory path to extract number from
# Returns:
#   0 always succeeds
# Output:
#   Three-digit specification number extracted from directory basename
extract_number() {
  local dir="$1"
  local basename
  basename=$(basename "$dir")
  echo "${basename:0:3}"
}

# verify_sequential_numbering - Check that spec directory prefixes form a contiguous sequence starting at 001.
# Parameters: None
# Returns:
#   0 when numbering is contiguous with no gaps or duplicates
#   1 when gaps, duplicates, or empty inventory is detected
# Output:
#   Status messages for each validation check and overall result
verify_sequential_numbering() {
  echo ""
  echo "🔢 Verifying sequential numbering..."

  local numbers=()

  for dir in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
    if [ -d "$dir" ]; then
      local num
      num=$(extract_number "$dir")
      numbers+=("$num")
    fi
  done

  # Check for empty inventory
  if [ ${#numbers[@]} -eq 0 ]; then
    echo "❌ No specification directories found"
    return 1
  fi

  # Sort numbers
  mapfile -t sorted < <(printf '%s\n' "${numbers[@]}" | sort)

  # Check for gaps and duplicates
  local has_gaps=0
  local expected=1

  for num in "${sorted[@]}"; do
    local num_int=$((10#$num))  # Convert to integer
    if [ $num_int -lt $expected ]; then
      echo "❌ Duplicate number: $num_int"
      has_gaps=1
    elif [ $num_int -ne $expected ]; then
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

# generate_inventory_report - Print per-directory checks and aggregate naming and spec.md pass counts.
# Parameters: None
# Returns:
#   0 when all directories pass naming and spec.md checks
#   1 if any directory fails naming or spec.md validation
# Output:
#   Per-directory validation results and summary table with pass counts
generate_inventory_report() {
  echo ""
  echo "📊 Complete Inventory Report"
  echo "============================"
  echo ""

  local total_dirs=0
  local naming_pass=0
  local spec_file_pass=0

  # Scan ALL immediate subdirectories (including malformed ones) for inventory and validation
  for dir in "$SPECS_DIR"/*/; do
    if [ -d "$dir" ]; then
      ((++total_dirs))
      local basename
      basename=$(basename "$dir")

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

  # Return 1 if checks failed
  if [ "$naming_pass" -ne "$total_dirs" ] || [ "$spec_file_pass" -ne "$total_dirs" ]; then
    return 1
  fi
  return 0
}

# ============================================================================
# Main
# ============================================================================

# main - Run the directory scan, numbering check, and inventory report in sequence.
# Parameters:
#   $@ - Arguments passed through to main function (currently unused)
# Returns:
#   0 when all audit checks pass
#   1 when any audit check fails
# Output:
#   Complete audit report with header, directory scans, numbering verification, and inventory summary
main() {
  echo "🔍 SpecKit Folder Structure Audit"
  echo "=================================="
  echo ""

  # Run scans and collect exit codes
  local rc=0

  # Always run every check so one failure does not hide the others.
  audit_scan_directories
  verify_sequential_numbering || rc=1
  generate_inventory_report || rc=1

  return $rc
}

# Run main function
main "$@"
