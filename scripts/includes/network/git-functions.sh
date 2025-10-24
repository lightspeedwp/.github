#!/bin/bash
# ============================================================================
# Script Name: git-functions.sh
# Description: Git-related utility functions for LightSpeed WP automation scripts
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: git, bash 4.0+
# Usage: source scripts/includes/network/git-functions.sh
# Environment Variables: None
# Options: None - this is a library file
# Examples:
#   source scripts/includes/network/git-functions.sh
#   if is_git_repo; then echo "In git repo"; fi
#   current_branch=$(get_current_branch)
# Notes:
#   - All functions require git to be installed and available
#   - Functions are designed to work in any git repository
#   - Error handling follows LightSpeed WP standards
# ============================================================================

# Source required includes
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../core/logging.sh
source "${SCRIPT_DIR}/../core/logging.sh"

# ============================================================================
# Function: is_git_repo
# Description: Check if current directory is inside a git repository
# Arguments: None
# Output: None
# Notes: Returns 0 if in git repo, 1 otherwise
# ============================================================================
is_git_repo() {
    git rev-parse --git-dir >/dev/null 2>&1
}

# ============================================================================
# Function: get_current_branch
# Description: Get the name of the current git branch
# Arguments: None
# Output: Current branch name
# Notes: Returns empty string if not in git repo or detached HEAD
# ============================================================================
get_current_branch() {
    if is_git_repo; then
        git branch --show-current 2>/dev/null || echo ""
    else
        echo ""
    fi
}

# ============================================================================
# Function: get_repo_root
# Description: Get the root directory of the current git repository
# Arguments: None
# Output: Absolute path to git repository root
# Notes: Returns empty string if not in git repo
# ============================================================================
get_repo_root() {
    if is_git_repo; then
        git rev-parse --show-toplevel 2>/dev/null || echo ""
    else
        echo ""
    fi
}

# ============================================================================
# Function: has_uncommitted_changes
# Description: Check if there are uncommitted changes in the repository
# Arguments: None
# Output: None
# Notes: Returns 0 if there are uncommitted changes, 1 otherwise
# ============================================================================
has_uncommitted_changes() {
    if is_git_repo; then
        ! git diff-index --quiet HEAD -- 2>/dev/null
    else
        return 1
    fi
}

# ============================================================================
# Function: get_commit_hash
# Description: Get the full commit hash of the current HEAD
# Arguments: $1 (optional) - Short hash flag (--short)
# Output: Full or short commit hash
# Notes: Returns empty string if not in git repo
# ============================================================================
get_commit_hash() {
    local short_flag="${1:-}"

    if is_git_repo; then
        if [[ "$short_flag" == "--short" ]]; then
            git rev-parse --short HEAD 2>/dev/null || echo ""
        else
            git rev-parse HEAD 2>/dev/null || echo ""
        fi
    else
        echo ""
    fi
}

# ============================================================================
# Function: validate_clean_working_tree
# Description: Ensure working tree is clean before operations
# Arguments: None
# Output: Error message if working tree is dirty
# Notes: Returns 0 if clean, 1 if dirty
# ============================================================================
validate_clean_working_tree() {
    if ! is_git_repo; then
        log_error "Not in a git repository"
        return 1
    fi

    if has_uncommitted_changes; then
        log_error "Working tree has uncommitted changes"
        log_error "Please commit or stash your changes before proceeding"
        return 1
    fi

    return 0
}
