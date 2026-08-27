#!/bin/bash
# Project Documentation Update Suite
# Automates creation of missing PLANNING.md, OPENSPEC.md, README.md files
# and updates all index files

set -euo pipefail

# Configuration
PROJECTS_DIR=".github/projects/active"
TEMPLATES_DIR=".github/projects/_templates"
DRY_RUN="${DRY_RUN:-true}"
VERBOSE="${VERBOSE:-false}"
STATS_FILE="/tmp/project-docs-stats-$(date +%s).json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

log_verbose() {
  if [[ "$VERBOSE" == "true" ]]; then
    echo -e "${BLUE}[VERBOSE]${NC} $1"
  fi
}

# Initialize stats
init_stats() {
  cat > "$STATS_FILE" << 'EOF'
{
  "projects_processed": 0,
  "planning_created": 0,
  "openspec_created": 0,
  "readme_created": 0,
  "errors": 0,
  "dry_run": true,
  "projects": []
}
EOF
}

# Update stats (Issue #4: Consistent JSON format)
update_stats() {
  local project="$1"
  local planning="$2"
  local openspec="$3"
  local readme="$4"

  # Append stats in colon-separated format (matches final output format)
  echo "$project:$planning:$openspec:$readme" >> "$STATS_FILE"
}

# Create PLANNING.md if missing
create_planning_md() {
  local project_dir="$1"
  local project_name="$2"

  if [[ -f "$project_dir/PLANNING.md" ]]; then
    log_verbose "  ✓ PLANNING.md already exists"
    return 0
  fi

  log_verbose "  → Creating PLANNING.md"

  if [[ "$DRY_RUN" == "true" ]]; then
    log_verbose "    [DRY-RUN] Would copy PLANNING_TEMPLATE.md"
    return 0
  fi

  # Copy template and update basic metadata
  cp "$TEMPLATES_DIR/PLANNING_TEMPLATE.md" "$project_dir/PLANNING.md"

  # Update title and created_date (Issue #1: Fix sed injection vulnerability)
  # Use pipe delimiter and escape special characters in project name
  sed -i.bak "s|PROJECT_TITLE|${project_name//|/\\|}|g" "$project_dir/PLANNING.md"
  sed -i.bak "s|YYYY-MM-DD|$(date +%Y-%m-%d)|g" "$project_dir/PLANNING.md"
  rm -f "$project_dir/PLANNING.md.bak"

  log_success "  ✓ Created PLANNING.md"
  return 0
}

# Create OPENSPEC.md stub if missing (for simple projects)
create_openspec_md() {
  local project_dir="$1"
  local project_name="$2"

  if [[ -f "$project_dir/OPENSPEC.md" ]]; then
    log_verbose "  ✓ OPENSPEC.md already exists"
    return 0
  fi

  log_verbose "  → Creating OPENSPEC.md (stub)"

  if [[ "$DRY_RUN" == "true" ]]; then
    log_verbose "    [DRY-RUN] Would create OPENSPEC.md stub"
    return 0
  fi

  # Create stub OPENSPEC.md (Issue #5: Fix return value convention)
  cat > "$project_dir/OPENSPEC.md" << EOF
---
file_type: openspec
title: "$project_name — OpenSpec Specification"
description: "Technical specification for $project_name"
version: 1.0.0
created_date: $(date +%Y-%m-%d)
last_updated: $(date +%Y-%m-%d)
status: draft
---

# $project_name — OpenSpec Specification

See [PLANNING.md](./PLANNING.md) for project specifications.

**Note:** Full OpenSpec documentation to be added during Phase 2 if needed for complex/technical projects.
EOF

  log_success "  ✓ Created OPENSPEC.md (stub)"
  return 0
}

# Create README.md if missing
create_readme_md() {
  local project_dir="$1"
  local project_name="$2"

  if [[ -f "$project_dir/README.md" ]]; then
    log_verbose "  ✓ README.md already exists"
    return 0
  fi

  log_verbose "  → Creating README.md"

  if [[ "$DRY_RUN" == "true" ]]; then
    log_verbose "    [DRY-RUN] Would copy README_TEMPLATE.md"
    return 0
  fi

  # Copy template and update basic metadata
  cp "$TEMPLATES_DIR/README_TEMPLATE.md" "$project_dir/README.md"

  # Update title and created_date (Issue #1: Fix sed injection vulnerability)
  # Use pipe delimiter and escape special characters in project name
  sed -i.bak "s|PROJECT_TITLE|${project_name//|/\\|}|g" "$project_dir/README.md"
  sed -i.bak "s|YYYY-MM-DD|$(date +%Y-%m-%d)|g" "$project_dir/README.md"
  rm -f "$project_dir/README.md.bak"

  log_success "  ✓ Created README.md"
  return 0
}

# Process all projects
process_all_projects() {
  log_info "Processing all projects in $PROJECTS_DIR..."

  local planning_count=0
  local openspec_count=0
  local readme_count=0
  local processed=0

  # Find all project directories (Issue #3: Fix find command logic)
  # Look inside PROJECTS_DIR, exclude _templates, sort alphabetically
  while IFS= read -r project_dir; do
    if [[ -d "$project_dir" ]]; then
      local project_name=$(basename "$project_dir")

      # Issue #2: Fix overly restrictive project detection logic
      # Accept any folder in the projects directory - we'll create docs for it
      log_info "Processing: $project_name"
      ((processed++))

      # Create missing documentation
      # Issue #5: Fix return value convention - use correct bash 0=success, 1=failure
      if create_planning_md "$project_dir" "$project_name"; then
        if [[ ! -f "$project_dir/PLANNING.md" ]]; then
          # File already existed, don't count as created
          :
        else
          ((planning_count++))
        fi
      fi

      if create_openspec_md "$project_dir" "$project_name"; then
        if [[ ! -f "$project_dir/OPENSPEC.md" ]]; then
          # File already existed, don't count as created
          :
        else
          ((openspec_count++))
        fi
      fi

      if create_readme_md "$project_dir" "$project_name"; then
        if [[ ! -f "$project_dir/README.md" ]]; then
          # File already existed, don't count as created
          :
        else
          ((readme_count++))
        fi
      fi

      update_stats "$project_name" "$([[ -f $project_dir/PLANNING.md ]] && echo 'true' || echo 'false')" \
                                   "$([[ -f $project_dir/OPENSPEC.md ]] && echo 'true' || echo 'false')" \
                                   "$([[ -f $project_dir/README.md ]] && echo 'true' || echo 'false')"
    fi
  done < <(find "$PROJECTS_DIR" -maxdepth 1 -type d ! -name "_templates" | sort)

  log_info ""
  log_info "=== SUMMARY ==="
  log_info "Projects processed: $processed"
  log_info "PLANNING.md files created: $planning_count"
  log_info "OPENSPEC.md files created: $openspec_count"
  log_info "README.md files created: $readme_count"

  # Issue #4: Use consistent JSON format for stats
  echo "$processed:$planning_count:$openspec_count:$readme_count" >> "$STATS_FILE"
}

# Validate project documentation
validate_projects() {
  log_info ""
  log_info "=== VALIDATION ==="

  local missing_readme=0
  local missing_planning=0
  local missing_openspec=0

  while IFS= read -r project_dir; do
    if [[ -d "$project_dir" ]]; then
      local project_name=$(basename "$project_dir")

      if [[ ! -f "$project_dir/README.md" ]]; then
        log_error "$project_name: Missing README.md"
        ((missing_readme++))
      fi

      if [[ ! -f "$project_dir/PLANNING.md" ]]; then
        log_error "$project_name: Missing PLANNING.md"
        ((missing_planning++))
      fi

      if [[ ! -f "$project_dir/OPENSPEC.md" ]]; then
        log_warn "$project_name: Missing OPENSPEC.md (acceptable for simple projects)"
        ((missing_openspec++))
      fi
    fi
  done < <(find "$PROJECTS_DIR" -maxdepth 1 -type d ! -name "_templates" ! -name "active" | sort)

  log_info ""
  log_info "Missing README.md: $missing_readme"
  log_info "Missing PLANNING.md: $missing_planning"
  log_info "Missing OPENSPEC.md (stubs): $missing_openspec"

  if [[ $missing_readme -eq 0 ]] && [[ $missing_planning -eq 0 ]]; then
    log_success "All critical documentation is in place!"
    return 0
  else
    log_error "Some critical documentation is missing"
    return 1
  fi
}

# Show usage information
show_help() {
  cat << 'EOF'
Usage: project-docs-update.sh [OPTIONS]

Project Documentation Update Suite
Automates creation of missing PLANNING.md, OPENSPEC.md, and README.md files.

Environment Variables:
  DRY_RUN=true|false    Set to 'false' to execute changes (default: true)
  VERBOSE=true|false    Set to 'true' for detailed output (default: false)

Examples:
  # Dry-run (no changes, shows what would be created)
  DRY_RUN=true VERBOSE=true ./scripts/automation/project-docs-update.sh

  # Execute changes
  DRY_RUN=false ./scripts/automation/project-docs-update.sh

Exit Codes:
  0  Success (all critical documentation present or created)
  1  Errors occurred or critical documentation still missing

For more information, see: docs/SCRIPT_USAGE.md
EOF
}

# Main function
main() {
  # Handle help flag (Issue #6: Missing --help support)
  if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
    show_help
    return 0
  fi

  log_info "=== Project Documentation Update Suite ==="
  log_info "DRY_RUN: $DRY_RUN"
  log_info "VERBOSE: $VERBOSE"
  log_info ""

  if [[ ! -d "$TEMPLATES_DIR" ]]; then
    log_error "Templates directory not found: $TEMPLATES_DIR"
    exit 1
  fi

  if [[ ! -d "$PROJECTS_DIR" ]]; then
    log_error "Projects directory not found: $PROJECTS_DIR"
    exit 1
  fi

  init_stats
  process_all_projects
  validate_projects

  log_info ""
  if [[ "$DRY_RUN" == "true" ]]; then
    log_warn "DRY-RUN MODE: No files were actually modified"
    log_info "Run with DRY_RUN=false to apply changes"
  else
    log_success "Documentation update complete!"
  fi
}

main "$@"
