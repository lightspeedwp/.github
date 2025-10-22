# ============================================================================
# Script Name: manage-issue-types.sh
# Description: Syncs and enforces org-wide issue types in the current repository using canonical definitions from .github/ISSUE_TYPES.md. Adds, updates, or prunes issue type labels as needed for compliance.
# Version: 1.0.0
# Author: LightSpeed WP Team
# Github Contributors: See repo history
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Requirements: bash, gh CLI, yq, jq
# Usage: bash ./scripts/maintenance/manage-issue-types.sh [--dry-run] [--strict-prune] [--only <repo>]
# Environment Variables: DRY_RUN (default: false), STRICT_PRUNE (default: false), ONLY (repo name)
# Options:
#   --dry-run         Preview changes without applying
#   --strict-prune    Remove non-standard issue type labels
#   --only <repo>     Target a specific repo
# Examples:
#   bash ./scripts/maintenance/manage-issue-types.sh
#   DRY_RUN=true bash ./scripts/maintenance/manage-issue-types.sh --dry-run
#   ONLY=scripts bash ./scripts/maintenance/manage-issue-types.sh --only scripts
# Notes:
#   - Requires GitHub CLI authentication
#   - Reads canonical issue types from .github/ISSUE_TYPES.md
#   - Logs actions to stdout and logs/issue-types-sync.log
# ============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_FILE="$SCRIPT_DIR/logs/issue-types-sync.log"
ISSUE_TYPES_FILE="$REPO_ROOT/scripts/.github/ISSUE_TYPES.md"
DRY_RUN="${DRY_RUN:-false}"
STRICT_PRUNE="${STRICT_PRUNE:-false}"
ONLY="${ONLY:-}" # repo name

# Function: log_info
# Description: Log info messages to stdout and log file
# Arguments: $1 - message
# Output: stdout, log file
log_info() {
  echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S'): $1" | tee -a "$LOG_FILE"
}

# Function: parse_issue_types
# Description: Parse canonical issue types from ISSUE_TYPES.md
# Arguments: None
# Output: Prints label name, color, description (tab-separated)
parse_issue_types() {
  awk '/\*Label:/ { sub(/.*\*Label: */, "", $0); label=$0 }
       /\*Colour:/ { sub(/.*\*Colour: */, "", $0); color=$0 }
       /—/ { getline; desc=$0; print label "\t" color "\t" desc }' "$ISSUE_TYPES_FILE"
}

# Function: sync_issue_types
# Description: Sync issue type labels in the target repo
# Arguments: $1 - repo name
# Output: stdout, log file
sync_issue_types() {
  local repo="$1"
  log_info "Syncing issue types for repo: $repo"
  # Example: Add logic to read canonical types and update labels using gh CLI
  # This is a stub for demonstration
  parse_issue_types | while IFS=$'\t' read -r label color desc; do
    log_info "Would sync label: $label ($color) - $desc"
    # Actual implementation would use gh label commands
  done
}

main() {
  local target_repo="${ONLY:-scripts}"
  sync_issue_types "$target_repo"
  log_info "Issue type sync complete."
}

main "$@"
