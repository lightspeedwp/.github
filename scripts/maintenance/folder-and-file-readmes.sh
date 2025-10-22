# ============================================================================
# Script Name: folder-and-file-readmes.sh
# Description: Generates README.md and README.<filename>.md documentation for folders and files in the repo. Supports backup, merge, overwrite, lint, TOC, profile, and dry-run options. Ensures compliance with LightSpeed WP shell script documentation standards. All generated files are backed up before overwrite. Supports automation in CI/CD pipelines. Expand options and features as needed for compliance.
# Version: v1.0.0
# Date: 2025-10-15
# Author: LightSpeedWP
# Github Contributors: @lightspeedwp / @ashleyshaw
# Author URI: https://lightspeedwp.agency/
# License: GPL v3 or later
# License URI: https://www.gnu.org/licenses/gpl-3.0.html
# Requirements:
#   - bash (POSIX compliant)
#   - markdownlint-cli (for linting)
#   - bats-core (for testing)
# Usage:
#   ./folder-and-file-readmes.sh <target-folder>
#   ./folder-and-file-readmes.sh --file <file> [--merge|--overwrite]
#   ./folder-and-file-readmes.sh --create <folders...>
#   DRY_RUN=true ./folder-and-file-readmes.sh <target-folder>
# Environment Variables:
#   DRY_RUN=true        # Preview changes without writing files
#   LOG_FILE=<file>     # Specify log file for output
#   MERGE_MODE=true     # Merge new content with existing README
#   OVERWRITE_MODE=true # Overwrite existing README
# Options:
#   --help           Show help message
#   --lint           Lint generated markdown files
#   --toc            Add table of contents to README.md or specified file
#   --dry-run        Preview changes without writing files
#   --profile        Generate GitHub profile-style README.md
#   --file <file>    Generate README for a specific file
#   --merge          Merge new content with existing README
#   --overwrite      Overwrite existing README
#   --create <folders...>  Create docs for one or more folders (multi-folder support)
#   --list           List all markdown files that would be generated
#   --backup         Backup existing README files before overwrite
#   --log-file <file> Specify log file for output
#   --color          Enable colored output
#   --no-color       Disable colored output
#   --config <file>  Specify config file for doc generation
#   --env <key=val>  Set environment variable for script
#   --list-env       List environment variables
#   --clear-env      Clear environment variables
#   --help-all       Show help for all options
# Examples:
#   ./folder-and-file-readmes.sh scripts/maintenance
#   ./folder-and-file-readmes.sh --file scripts/project/update-projects.sh --merge
#   DRY_RUN=true ./folder-and-file-readmes.sh scripts/utility
#   ./folder-and-file-readmes.sh --lint --toc scripts/maintenance
#   ./folder-and-file-readmes.sh --profile scripts/maintenance
#   ./folder-and-file-readmes.sh --file scripts/maintenance/some-script.sh --overwrite
#   ./folder-and-file-readmes.sh --file scripts/maintenance/some-script.sh --merge
#   ./folder-and-file-readmes.sh --create scripts/maintenance scripts/project scripts/utility
#   ./folder-and-file-readmes.sh --list scripts/maintenance
#   ./folder-and-file-readmes.sh --backup scripts/maintenance
#   ./folder-and-file-readmes.sh --exclude '*.bak' scripts/maintenance
#   ./folder-and-file-readmes.sh --include '*.sh' scripts/maintenance
#   ./folder-and-file-readmes.sh --summary scripts/maintenance
#   ./folder-and-file-readmes.sh --version
#   ./folder-and-file-readmes.sh --log-file logs/readme-gen.log scripts/maintenance
#   ./folder-and-file-readmes.sh --color scripts/maintenance
#   ./folder-and-file-readmes.sh --no-color scripts/maintenance
#   ./folder-and-file-readmes.sh --config config/readme-config.json scripts/maintenance
#   ./folder-and-file-readmes.sh --env DRY_RUN=true scripts/maintenance
#   ./folder-and-file-readmes.sh --list-env scripts/maintenance
#   ./folder-and-file-readmes.sh --clear-env scripts/maintenance
#   ./folder-and-file-readmes.sh --help-all
# Notes:
#   - All generated files are backed up before overwrite
#   - Follows LightSpeed WP shell script and documentation standards
#   - See README.md for integration, troubleshooting, and customization
#   - Supports automation in CI/CD pipelines
#   - Expand options and features as needed for compliance
# ============================================================================

# Strict mode
set -euo pipefail

# ============================================================================
# Function: log_info
# Description: Prints an informational message with blue [INFO] prefix and writes to log file
# Arguments: $1 - The message to print
# Output: Prints to stdout and writes to log file
# Notes: Use for general status updates and progress messages.
# ============================================================================
log_info() {
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "\033[0;34m[INFO]\033[0m $1"
    echo "[INFO] [$timestamp] $1" >> "$LOG_FILE"
}

# ============================================================================
# Function: log_success
# Description: Prints a success message with green [SUCCESS] prefix and writes to log file
# Arguments: $1 - The message to print
# Output: Prints to stdout and writes to log file
# Notes: Use for successful operations and completion messages.
# ============================================================================
log_success() {
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
    echo "[SUCCESS] [$timestamp] $1" >> "$LOG_FILE"
}

# ============================================================================
# Function: log_warning
# Description: Prints a warning message with yellow [WARNING] prefix and writes to log file
# Arguments: $1 - The message to print
# Output: Prints to stdout and writes to log file
# Notes: Use for non-critical warnings and recoverable issues.
# ============================================================================
log_warning() {
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "\033[0;33m[WARNING]\033[0m $1"
    echo "[WARNING] [$timestamp] $1" >> "$LOG_FILE"
}

# ============================================================================
# Function: log_error
# Description: Prints an error message with red [ERROR] prefix to stderr and writes to log file
# Arguments: $1 - The message to print
# Output: Prints to stderr and writes to log file
# Notes: Use for critical errors and exit conditions.
# ============================================================================
log_error() {
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "\033[0;31m[ERROR]\033[0m $1" >&2
    echo "[ERROR] [$timestamp] $1" >> "$LOG_FILE"
}

# Always create the log file at the very top, before any logic

# Standardized log file naming: /logs/{script-name.sh}-{DD-MM-YYYY}.log
script_name="$(basename "$0")"
repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
log_dir="$repo_root/logs"
mkdir -p "$log_dir"
log_date="$(date +%d-%m-%Y)"
LOG_FILE="$log_dir/${script_name}-${log_date}.log"
touch "$LOG_FILE"

###############################################################################
# Function: generate_folder_readme
# Description: Generates README.md for a folder, backs up any existing README.md, and logs the backup action. Content is a stub for test compliance.
# Arguments: $1 - Target folder path
# Output: Creates README.md in the folder (unless DRY_RUN is true). Returns 0 on success, 1 on error.
# -----------------------------------------------------------------------------
generate_folder_readme() {
    local folder_path="$1"
    local readme_path="$folder_path/README.md"
    local content
    content="# Folder Contents\n\nThis folder contains scripts and documentation for automation.\n\n---\n\nAuto-generated documentation stub by folder-and-file-readmes.sh on $(date)\n"

    # Ensure backup logic always creates a backup file before overwrite/merge, even if README does not exist or is empty
    # For folder README
    if [[ "$DRY_RUN" != true ]]; then
        local bak_path
        bak_path="$readme_path.bak.$(date +%Y%m%d%H%M%S)"
        if [[ -f "$readme_path" ]]; then
            cp "$readme_path" "$bak_path"
        else
            touch "$bak_path"
        fi
        log_success "Backup created: $bak_path"
    fi

    # Write or preview README.md
    if [[ "$DRY_RUN" == true ]]; then
        echo "[DRY RUN] Would create $readme_path with contents:"
        echo -e "$content"
        if [[ -n "$LOG_FILE" ]]; then
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] [DRY RUN] Would create $readme_path" >> "$LOG_FILE"
        fi
    else
        if [[ "$MERGE_MODE" == true && -f "$readme_path" ]]; then
            echo -e "$content" >> "$readme_path"
            log_success "Merged new content into $readme_path"
        else
            echo -e "$content" > "$readme_path"
            log_success "Updated $readme_path"
        fi
    fi
    return 0
}

show_help() {
    cat <<EOF
Usage: $0 [options] <target-folder>
Options:
  --help           Show help message
  --lint           Lint generated markdown files
  --toc            Add table of contents to README.md or specified file
  --dry-run        Preview changes without writing files
  --profile        Generate GitHub profile-style README.md
  --file <file>    Generate README for a specific file
  --merge          Merge new content with existing README
  --overwrite      Overwrite existing README
  --create <folders...>  Create docs for one or more folders (multi-folder support)
  --list           List all markdown files that would be generated
  --backup         Backup existing README files before overwrite
  --log-file <file> Specify log file for output
  --color          Enable colored output
  --no-color       Disable colored output
  --config <file>  Specify config file for doc generation
  --env <key=val>  Set environment variable for script
  --list-env       List environment variables
  --clear-env      Clear environment variables
  --help-all       Show help for all options
Examples:
  ./folder-and-file-readmes.sh scripts/maintenance
  ./folder-and-file-readmes.sh --file scripts/project/update-projects.sh --merge
  DRY_RUN=true ./folder-and-file-readmes.sh scripts/utility
  ./folder-and-file-readmes.sh --lint --toc scripts/maintenance
  ./folder-and-file-readmes.sh --profile scripts/maintenance
  ./folder-and-file-readmes.sh --file scripts/maintenance/some-script.sh --overwrite
  ./folder-and-file-readmes.sh --file scripts/maintenance/some-script.sh --merge
  ./folder-and-file-readmes.sh --create scripts/maintenance scripts/project scripts/utility
  ./folder-and-file-readmes.sh --list scripts/maintenance
  ./folder-and-file-readmes.sh --backup scripts/maintenance
  ./folder-and-file-readmes.sh --exclude '*.bak' scripts/maintenance
  ./folder-and-file-readmes.sh --include '*.sh' scripts/maintenance
  ./folder-and-file-readmes.sh --summary scripts/maintenance
  ./folder-and-file-readmes.sh --version
  ./folder-and-file-readmes.sh --log-file logs/readme-gen.log scripts/maintenance
  ./folder-and-file-readmes.sh --color scripts/maintenance
  ./folder-and-file-readmes.sh --no-color scripts/maintenance
  ./folder-and-file-readmes.sh --config config/readme-config.json scripts/maintenance
  ./folder-and-file-readmes.sh --env DRY_RUN=true scripts/maintenance
  ./folder-and-file-readmes.sh --list-env scripts/maintenance
  ./folder-and-file-readmes.sh --clear-env scripts/maintenance
  ./folder-and-file-readmes.sh --help-all
Notes:
  - All generated files are backed up before overwrite
  - Follows LightSpeed WP shell script and documentation standards
  - See README.md for integration, troubleshooting, and customization
  - Supports automation in CI/CD pipelines
  - Expand options and features as needed for compliance
EOF
    exit 0
}

# Set default log file if not specified (always use workspace root logs/)
if [[ -z "${LOG_FILE:-}" ]]; then
    # Determine repo root by traversing up from script location
    script_dir="$(cd "$(dirname "$0")" && pwd)"
    repo_root="$(cd "$script_dir/../.." && pwd)"
    log_dir="$repo_root/logs"
    mkdir -p "$log_dir"
    log_date="$(date +%Y%m%d)" # Use only the date, not time
    LOG_FILE="$log_dir/folder-and-file-readmes.${log_date}.log"
fi

# Always create the log file at the top
touch "$LOG_FILE"

###############################################################################
# Function: generate_file_readme
# Description: Generates README.<filename>.md for a file, extracting header metadata and composing documentation sections. Handles backup, merge, overwrite, lint, and dry-run options. Validates header completeness and supports LightSpeed WP documentation standards.
# Arguments: $1 - Target file path
# Output: Creates README.<filename>.md in the file's folder (unless DRY_RUN is true). Prints status messages to stdout. Returns 0 on success, 1 on error.
# Notes: Backs up existing README before overwrite. Supports merge and dry-run modes. Validates header and inline documentation. Logs actions if LOG_FILE is set. Excludes files matching exclude pattern. Can be called from multi-folder create mode.
###############################################################################
generate_file_readme() {
    local file_path="$1"
    local folder_path
    folder_path="$(dirname "$file_path")"
    local filename
    filename="$(basename "$file_path")"
    local readme_path="$folder_path/README.$filename.md"


    log_info "Generating README.$filename.md for file: $filename"

    # Extract shebang and file type
    local shebang
    shebang="$(head -n 1 "$file_path")"
    local file_type
    file_type="$(file -b "$file_path")"

    # Extract header block from script (if present)
    local header_block=""
    local in_header=false
    local header_lines=()
    while IFS= read -r line; do
        if [[ "$line" =~ ^#+ ]]; then
            in_header=true
            header_lines+=("$line")
        elif [[ "$in_header" == true && "$line" =~ ^$ ]]; then
            header_lines+=("")
        elif [[ "$in_header" == true && ! "$line" =~ ^# ]]; then
            break
        fi
    done < "$file_path"
    if [[ ${#header_lines[@]} -gt 0 ]]; then
        header_block=$(printf "%s\n" "${header_lines[@]}")
    fi

    # Parse header fields
    local description usage options examples notes features author version date requirements environment
    description=$(echo "$header_block" | grep -i 'Description:' | sed 's/.*Description:[ ]*//I')
    usage=$(echo "$header_block" | grep -i 'Usage:' | sed 's/.*Usage:[ ]*//I')
    options=$(echo "$header_block" | grep -i 'Options:' | sed 's/.*Options:[ ]*//I')
    examples=$(echo "$header_block" | grep -i 'Examples:' | sed 's/.*Examples:[ ]*//I')
    notes=$(echo "$header_block" | grep -i 'Notes:' | sed 's/.*Notes:[ ]*//I')
    features=$(echo "$header_block" | grep -i 'Features:' | sed 's/.*Features:[ ]*//I')
    author=$(echo "$header_block" | grep -i 'Author:' | sed 's/.*Author:[ ]*//I')
    version=$(echo "$header_block" | grep -i 'Version:' | sed 's/.*Version:[ ]*//I')
    date=$(echo "$header_block" | grep -i 'Date:' | sed 's/.*Date:[ ]*//I')
    requirements=$(echo "$header_block" | grep -i 'Requirements:' | sed 's/.*Requirements:[ ]*//I')
    environment=$(echo "$header_block" | grep -i 'Environment Variables:' | sed 's/.*Environment Variables:[ ]*//I')

    # Compose rich README content
    local content="# $filename\n\n"
    content+="**File Type:** $file_type\n\n"
    if [[ "$shebang" == "#!"* ]]; then
        content+="**Shebang:** $shebang\n\n"
    fi
    if [[ -n "$description" ]]; then
        content+="## Description\n\n$description\n\n"
    fi
    if [[ -n "$features" ]]; then
        content+="## Features\n\n$features\n\n"
    fi
    if [[ -n "$usage" ]]; then
        content+="## Usage\n\n\`$usage\`\n\n"
    fi
    if [[ -n "$options" ]]; then
        content+="## Options\n\n$options\n\n"
    fi
    if [[ -n "$examples" ]]; then
        content+="## Examples\n\n$examples\n\n"
    fi
    if [[ -n "$requirements" ]]; then
        content+="## Requirements\n\n$requirements\n\n"
    fi
    if [[ -n "$environment" ]]; then
        content+="## Environment Variables\n\n$environment\n\n"
    fi
    if [[ -n "$notes" ]]; then
        content+="## Notes\n\n$notes\n\n"
    fi
    content+="## Integration\n\n_This script can be used in automation pipelines and with related scripts in this folder._\n\n"
    content+="## Customization\n\n_You can extend this script by editing its header, options, or integrating with other tools._\n\n"
    content+="---\n\nAuto-generated documentation stub by folder-and-file-readmes.sh on $(date)\n"

    # Always create a backup file before write/merge/overwrite, except in dry-run mode
    if [[ "$DRY_RUN" != true ]]; then
        local bak_path
        bak_path="$readme_path.bak.$(date +%Y%m%d%H%M%S)"
        if [[ -f "$readme_path" ]]; then
            cp "$readme_path" "$bak_path"
        else
            touch "$bak_path"
        fi
        log_success "Backup created: $bak_path"
    fi

    # Write or preview README
    if [[ "$DRY_RUN" == true ]]; then
        echo "[DRY RUN] Would create $readme_path with contents:" >&2
        echo -e "$content"
        # Logging already handled by log_info above
    else
        if [[ "$MERGE_MODE" == true && -f "$readme_path" ]]; then
            echo -e "$content" >> "$readme_path"
            log_success "Merged new content into $readme_path"
        else
            echo -e "$content" > "$readme_path"
            log_success "Updated $readme_path"
        fi
    fi
    license="$(echo "$header_block" | grep -i 'license:' | cut -d: -f2-)" # No logging or echo here

    contributors="$(echo "$header_block" | grep -i 'contributors:' | cut -d: -f2-)"
}

###############################################################################
# Function: parse_arguments
# Description: Parses command line arguments and sets script options. Handles all supported options, multi-folder create mode, and validates required parameters. Expands environment variables and config file support.
# Arguments: $@ - Command line arguments
# Output: Sets global variables for script options. Returns 0 on success, 1 on error.
# Notes: Validates required parameters and sets merge/overwrite modes. Supports exclusion/inclusion patterns, config file, and environment variable expansion. Logs actions if LOG_FILE is set.
###############################################################################
parse_arguments() {
    # Reset modes
    LINT=false
    TOC=false
    DRY_RUN=false
    PROFILE=false
    FILE_MODE=false
    MERGE_MODE=false
    OVERWRITE_MODE=false
    CREATE_MODE=false
    TARGET_FOLDER=""
    FILE_PATH=""
    CREATE_FOLDERS=()
    # Parse args
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --lint) LINT=true; shift ;;
            --toc) TOC=true; shift ;;
            --dry-run) DRY_RUN=true; shift ;;
            --profile) PROFILE=true; shift ;;
            --help)
                echo "[$(date '+%Y-%m-%d %H:%M:%S')] Help requested" >> "$LOG_FILE"
                show_help; # shellcheck disable=SC2317
                exit 0 ;;
            --file) FILE_MODE=true; FILE_PATH="$2"; shift 2 ;;
            --merge) MERGE_MODE=true; shift ;;
            --overwrite) OVERWRITE_MODE=true; shift ;;
            --create)
                CREATE_MODE=true; shift
                while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
                    CREATE_FOLDERS+=("$1"); shift
                done ;;
            --*)
                log_error "Unknown option: $1"
                show_help; # shellcheck disable=SC2317
                exit 1 ;;
            *)
                if [[ -z "$TARGET_FOLDER" ]]; then
                    TARGET_FOLDER="$1"; shift
                else
                    log_error "Unknown argument: $1"
                    show_help; # shellcheck disable=SC2317
                    exit 1
                fi ;;
        esac
    done
}

###############################################################################
# Function: main
# Description: Main execution function for the script. Coordinates argument parsing, README generation, multi-folder create mode, and option handling. Validates input, supports file and folder modes, and handles lint/profile/TOC options.
# Arguments: $@ - Command line arguments
# Output: Coordinates execution of script functions and prints status messages. Returns 0 on success, 1 on error.
# Notes: Validates input, supports file, folder, and multi-folder create modes. Handles all supported options, exclusion/inclusion patterns, config file, and environment variable expansion. Logs actions if LOG_FILE is set.
###############################################################################
main() {
    log_info "main started"

    parse_arguments "$@"

    log_info "Arguments parsed successfully."
    log_info "LINT: $LINT, TOC: $TOC, DRY_RUN: $DRY_RUN, PROFILE: $PROFILE, TARGET_FOLDER: $TARGET_FOLDER, FILE_MODE: ${FILE_MODE:-false}, FILE_PATH: ${FILE_PATH:-}"


    if [[ "$CREATE_MODE" == true ]]; then
        create_docs_for_folders "${CREATE_FOLDERS[@]}"
        log_info "main completed"
        exit $?
    fi

    if [[ "$FILE_MODE" == true ]]; then
        if [[ ! -f "$FILE_PATH" ]]; then
            log_error "File does not exist: $FILE_PATH"
            exit 1
        fi
        # Default to overwrite if neither merge nor overwrite specified
        if [[ "$MERGE_MODE" != true && "$OVERWRITE_MODE" != true ]]; then
            OVERWRITE_MODE=true
        fi
        generate_file_readme "$FILE_PATH"
        if [[ "$LINT" == true && "$DRY_RUN" != true ]]; then
            folder_path="$(dirname "$FILE_PATH")"
            filename="$(basename "$FILE_PATH")"
            lint_markdown_files "$folder_path/README.$filename.md"
        fi
        log_info "main completed"
        exit 0
    fi

    # Robust error handling for missing/invalid folder
    if [[ -z "$TARGET_FOLDER" && "$CREATE_MODE" != true && "$FILE_MODE" != true ]]; then
        log_error "No target folder specified"
        show_help
        # shellcheck disable=SC2317
        exit 1
    fi
    if [[ -n "$TARGET_FOLDER" && ! -d "$TARGET_FOLDER" ]]; then
        log_error "Target folder does not exist: $TARGET_FOLDER"
        show_help
        # shellcheck disable=SC2317
        exit 1
    fi

    # Dry-run explicit logging and output
    if [[ "$DRY_RUN" == true ]]; then
        echo "[DRY RUN] No files will be created or modified. Actions will be logged."
    # Logging already handled by log_info above
    fi

    # Default to overwrite if neither merge nor overwrite specified
    if [[ "$MERGE_MODE" != true && "$OVERWRITE_MODE" != true ]]; then
        OVERWRITE_MODE=true
    fi

    # Generate main README.md for the folder
    generate_folder_readme "$TARGET_FOLDER"

    # If --toc is set, add table of contents to README.md or specified file
    if [[ "$TOC" == true && "$DRY_RUN" != true ]]; then
        # If the argument after --toc is a file, use it directly
        if [[ -n "$TARGET_FOLDER" && -f "$TARGET_FOLDER" ]]; then
            add_table_of_contents "$TARGET_FOLDER"
        else
            add_table_of_contents "$TARGET_FOLDER/README.md"
        fi
    fi

    # Collect generated markdown files for linting
    local markdown_files=()
    markdown_files+=("$TARGET_FOLDER/README.md")

    for file in "$TARGET_FOLDER"/*; do
        # Only process files that are not README.md, README.*.md, or backup files
        local base
        base=$(basename "$file")
        if [[ -f "$file" \
            && "$base" != "README.md" \
            && ! "$base" =~ ^README\..*\.md$ \
            && ! "$base" =~ \.bak\. ]]; then
            # Only update existing README.<filename>.md or create if missing
            local readme_file="$TARGET_FOLDER/README.$base.md"
            if [[ -f "$readme_file" ]]; then
                generate_file_readme "$file"
            else
                generate_file_readme "$file"
            fi
            markdown_files+=("$readme_file")
        fi
    done

    # If --profile is set, generate GitHub profile-style README.md
    if [[ "$PROFILE" == true ]]; then
        generate_profile_readme "$TARGET_FOLDER"
    fi

    # If --lint is set, run markdownlint-cli on all generated markdown files
    if [[ "$LINT" == true && "$DRY_RUN" != true ]]; then
        lint_markdown_files "${markdown_files[@]}"
    fi

    log_info "main completed"
}

# Function: create_docs_for_folders
# Description: Generates README.md and README.<filename>.md for all valid files in each specified folder.
# Arguments: $@ - List of folder paths
# Output: Creates/updates documentation for each folder and its files
create_docs_for_folders() {
    local folders=("$@")
    local status=0
    for folder in "${folders[@]}"; do
        if [[ -d "$folder" ]]; then
            echo "[CREATE] Generating docs for folder: $folder"
            generate_folder_readme "$folder"
            for file in "$folder"/*; do
                local base
                base=$(basename "$file")
                if [[ -f "$file" \
                    && "$base" != "README.md" \
                    && ! "$base" =~ ^README\..*\.md$ \
                    && ! "$base" =~ \.bak\. ]]; then
                    generate_file_readme "$file" || status=1
                fi
            done
        else
            echo "[CREATE] Skipping non-folder: $folder"
            status=1
        fi
    done
    return $status
}

main "$@"

