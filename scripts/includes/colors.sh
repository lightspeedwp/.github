#!/bin/bash
# ============================================================================
# Script Name: colors.sh
# Description: Color codes and formatting constants for LightSpeed WP scripts
# Version: v1.0.0
# Date: 2025-10-17
# Author: LightSpeed WP Team
# Github Contributors: LightSpeed WP Team
# Author URI: https://lightspeedwp.agency/
# License: MIT
# License URI: https://opensource.org/licenses/MIT
# Requirements: bash 4.0+, terminal with color support
# Usage: source scripts/includes/core/colors.sh
# Environment Variables: None
# Options: None - this is a library file
# Examples:
#   source scripts/includes/core/colors.sh
#   echo "${GREEN}Success message${NC}"
#   echo "${RED}Error message${NC}"
# Notes:
#   - Use NC (No Color) to reset formatting
#   - Colors work best with modern terminals
#   - All color constants follow standard ANSI codes
# ============================================================================

# Color constants
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[0;37m'
readonly BLACK='\033[0;30m'

# Bright colors
readonly BRIGHT_RED='\033[1;31m'
readonly BRIGHT_GREEN='\033[1;32m'
readonly BRIGHT_YELLOW='\033[1;33m'
readonly BRIGHT_BLUE='\033[1;34m'
readonly BRIGHT_PURPLE='\033[1;35m'
readonly BRIGHT_CYAN='\033[1;36m'
readonly BRIGHT_WHITE='\033[1;37m'

# Text formatting
readonly BOLD='\033[1m'
readonly DIM='\033[2m'
readonly UNDERLINE='\033[4m'
readonly BLINK='\033[5m'
readonly REVERSE='\033[7m'
readonly STRIKETHROUGH='\033[9m'

# Reset
readonly NC='\033[0m' # No Color

# ============================================================================
# Function: check_color_support
# Description: Check if the current terminal supports colors
# Arguments: None
# Output: None
# Notes: Returns 0 if colors are supported, 1 otherwise
# ============================================================================
check_color_support() {
    # Check if stdout is a terminal and TERM is set
    if [[ -t 1 && -n "${TERM:-}" ]]; then
        # Check if TERM indicates color support
        case "${TERM}" in
            *color*|*ansi*|*xterm*|*screen*|*tmux*)
                return 0
                ;;
            *)
                # Check terminfo capabilities if available
                if command -v tput >/dev/null 2>&1; then
                    local colors
                    colors=$(tput colors 2>/dev/null || echo 0)
                    [[ $colors -ge 8 ]]
                else
                    return 1
                fi
                ;;
        esac
    else
        return 1
    fi
}

# ============================================================================
# Function: colorize
# Description: Apply color to text with automatic fallback
# Arguments: $1 - Color code, $2 - Text to colorize
# Output: Colorized text or plain text if colors not supported
# Notes: Automatically handles color support detection
# ============================================================================
colorize() {
    local color="$1"
    local text="$2"
    
    if check_color_support; then
        echo -e "${color}${text}${NC}"
    else
        echo "$text"
    fi
}

# End of colors.sh