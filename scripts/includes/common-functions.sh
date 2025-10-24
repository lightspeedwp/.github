#!/bin/bash
# ============================================================================
# Script Name: common-functions.sh
# Description: Backward compatibility layer - sources new modular includes
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bash 4.0+, modular includes
# Usage: source scripts/includes/core/common-functions.sh
# Environment Variables: LOG_LEVEL (optional) - Set logging level (DEBUG, INFO, WARN, ERROR)
# Options: None - this is a library file
# Examples:
#   source scripts/includes/core/common-functions.sh
#   log_info "Starting process"
#   validate_required_tools "git" "curl"
# Notes: 
#   - This file provides backward compatibility by sourcing new modular includes
#   - All functions are now available through the modular system
#   - Existing scripts can continue to work without modification
# ============================================================================

# Strict mode for safety
set -euo pipefail

# Source all core includes for backward compatibility
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Core functionality
# shellcheck source=colors.sh
source "${SCRIPT_DIR}/colors.sh"
# shellcheck source=logging.sh
source "${SCRIPT_DIR}/logging.sh"
# shellcheck source=validation.sh
source "${SCRIPT_DIR}/validation.sh"

# CLI utilities
# shellcheck source=../cli/cli-utils.sh
source "${SCRIPT_DIR}/../cli/cli-utils.sh"

# File operations
# shellcheck source=../filesystem/file-operations.sh
source "${SCRIPT_DIR}/../filesystem/file-operations.sh"

# Git functions
# shellcheck source=../network/git-functions.sh
source "${SCRIPT_DIR}/../network/git-functions.sh"

# ============================================================================
# Backward Compatibility Aliases
# Description: Maintain compatibility with existing function names
# ============================================================================

# Alias old function names to new ones for backward compatibility
alias log_warn=log_warning

# Note: Most functions retain their original names and are available
# through the modular includes sourced above.

# End of common-functions.sh