#!/bin/bash
# audit-specs.sh — Specification directory structure audit
# Purpose: Scan .github/specs/ and verify numbering, naming conventions, file presence

set -euo pipefail

# Shared resolution also honours SPECIFY_INIT_DIR and configured roots.
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"
repo_root=$(get_repo_root) || exit 2
if ! SPECS_DIRECTORY=$(read_specs_directory "$repo_root"); then
  echo "Error: Unable to read specs_directory configuration" >&2
  exit 2
fi
SPECS_DIR="$repo_root/$SPECS_DIRECTORY"
VALIDATOR="$SCRIPT_DIR/../../../scripts/validation/spec-allocations.cjs"

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

# verify_sequential_numbering - Validate accounted allocations or strict legacy contiguity.
# Parameters: None
# Returns:
#   0 when numbering is contiguous with no gaps or duplicates
#   1 when gaps, duplicates, or empty inventory is detected
# Output:
#   Status messages for each validation check and overall result
verify_sequential_numbering() {
  echo ""
  echo "🔢 Verifying specification allocations..."
  local args=(validate --repo-root "$repo_root" --specs-directory "$SPECS_DIRECTORY")
  if [ -n "${SPEC_ALLOCATION_BASELINE:-}" ]; then
    args+=(--baseline "$SPEC_ALLOCATION_BASELINE")
  fi
  if ! command -v node >/dev/null 2>&1 || [ ! -f "$VALIDATOR" ]; then
    echo "Error: Node.js and the shared allocation validator are required" >&2
    return 2
  fi
  node "$VALIDATOR" "${args[@]}"
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
  local numbering_rc=0
  verify_sequential_numbering || numbering_rc=$?
  [ "$numbering_rc" -le "$rc" ] || rc="$numbering_rc"
  generate_inventory_report || { [ "$rc" -ne 0 ] || rc=1; }

  return $rc
}

# Run main function
main "$@"
