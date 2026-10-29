#!/bin/bash
# lib-wp-cli.sh — WP-CLI wrapper library for WordPress database operations
# Provides safe, reusable functions for WP-CLI tasks with graceful fallback
# Usage: source "$(dirname "${BASH_SOURCE[0]}")/lib-wp-cli.sh"

set -o pipefail

# Colors for output
readonly WP_CLI_SUCCESS='\033[0;32m'  # Green
readonly WP_CLI_ERROR='\033[0;31m'    # Red
readonly WP_CLI_WARN='\033[1;33m'     # Yellow
readonly WP_CLI_INFO='\033[0;34m'     # Blue
readonly WP_CLI_RESET='\033[0m'       # Reset

# Logging functions
wpcli_log() {
    echo -e "${WP_CLI_INFO}[WP-CLI]${WP_CLI_RESET} $*" >&2
}

wpcli_success() {
    echo -e "${WP_CLI_SUCCESS}✓${WP_CLI_RESET} $*" >&2
}

wpcli_error() {
    echo -e "${WP_CLI_ERROR}✗${WP_CLI_RESET} $*" >&2
}

wpcli_warn() {
    echo -e "${WP_CLI_WARN}⚠${WP_CLI_RESET} $*" >&2
}

# Check if WP-CLI is available and working
# Returns 0 if available, 1 if not
# Sets WP_CLI_AVAILABLE env variable
wpcli_detect() {
    local wp_cmd="wp"

    # Check if wp command exists
    if ! command -v "$wp_cmd" &> /dev/null; then
        export WP_CLI_AVAILABLE=0
        wpcli_warn "WP-CLI not found in PATH. Fallback to bash approach."
        return 1
    fi

    # Verify wp command works (test with version)
    if ! "$wp_cmd" --version &> /dev/null; then
        export WP_CLI_AVAILABLE=0
        wpcli_warn "WP-CLI found but not working. Fallback to bash approach."
        return 1
    fi

    export WP_CLI_AVAILABLE=1
    wpcli_success "WP-CLI available"
    return 0
}

# Validate WP-CLI is available before running a command
# Returns 0 if available, 1 if not (and logs warning)
wpcli_require() {
    if [ "${WP_CLI_AVAILABLE:-0}" -ne 1 ]; then
        wpcli_error "WP-CLI is required for this operation"
        return 1
    fi
    return 0
}

# Execute a WP-CLI command with error handling
# Usage: wpcli_run <wp_command> [wp_args...]
# Example: wpcli_run db tables --path=/path/to/site
# Returns: command exit code, output on stdout
wpcli_run() {
    local -a cmd_array=("$@")

    if ! wpcli_require; then
        return 1
    fi

    # Validate array is not empty
    if [ ${#cmd_array[@]} -eq 0 ]; then
        wpcli_error "No command specified"
        return 1
    fi

    # Execute with error handling
    wp "${cmd_array[@]}" || {
        local exit_code=$?
        wpcli_error "WP-CLI command failed with exit code $exit_code"
        return $exit_code
    }
}

# Get WordPress version
# Usage: wpcli_get_wp_version <site_path>
# Returns: version number (e.g., "6.4.1")
wpcli_get_wp_version() {
    local site_path="$1"

    if [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid site path: $site_path"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    local version
    version=$(wp core version --path="$site_path" 2>/dev/null) || return 1
    echo "$version"
}

# Check WordPress installation is healthy
# Usage: wpcli_check_health <site_path>
# Returns: 0 if healthy, 1 if issues found
wpcli_check_health() {
    local site_path="$1"

    if [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid site path: $site_path"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    wpcli_log "Checking WordPress installation health..."

    # Check database connection
    if ! wp db check --path="$site_path" &> /dev/null; then
        wpcli_error "Database check failed"
        return 1
    fi
    wpcli_success "Database connection OK"

    # Check WordPress installation
    if ! wp core is-installed --path="$site_path" &> /dev/null; then
        wpcli_error "WordPress not fully installed"
        return 1
    fi
    wpcli_success "WordPress installation OK"

    return 0
}

# Get current site URL
# Usage: wpcli_get_siteurl <site_path>
# Returns: site URL (e.g., "https://example.local")
wpcli_get_siteurl() {
    local site_path="$1"

    if [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid site path: $site_path"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    local siteurl
    siteurl=$(wp option get siteurl --path="$site_path" 2>/dev/null) || return 1
    echo "$siteurl"
}

# Get WordPress option value
# Usage: wpcli_get_option <option_name> <site_path>
# Returns: option value
wpcli_get_option() {
    local option_name="$1"
    local site_path="$2"

    if [ -z "$option_name" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments: option_name=$option_name, site_path=$site_path"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    wp option get "$option_name" --path="$site_path" 2>/dev/null || return 1
}

# Set WordPress option value
# Usage: wpcli_set_option <option_name> <option_value> <site_path>
# Returns: 0 on success
wpcli_set_option() {
    local option_name="$1"
    local option_value="$2"
    local site_path="$3"

    if [ -z "$option_name" ] || [ -z "$option_value" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    # Use bash array to prevent word splitting
    wp option update "$option_name" "$option_value" --path="$site_path" 2>/dev/null || return 1
    wpcli_success "Updated option: $option_name"
    return 0
}

# Get database table prefix
# Usage: wpcli_get_table_prefix <site_path>
# Returns: table prefix (e.g., "wp_")
wpcli_get_table_prefix() {
    local site_path="$1"

    if [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid site path: $site_path"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    # Get all tables and extract prefix from first table
    local prefix
    prefix=$(wp db tables --path="$site_path" 2>/dev/null | head -1 | sed 's/^\([a-z_]*\)posts$/\1/')

    if [ -n "$prefix" ]; then
        echo "$prefix"
        return 0
    else
        wpcli_error "Could not detect table prefix"
        return 1
    fi
}

# Get list of database tables
# Usage: wpcli_get_tables <site_path>
# Returns: newline-separated list of table names
wpcli_get_tables() {
    local site_path="$1"

    if [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid site path: $site_path"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    wp db tables --path="$site_path" 2>/dev/null || return 1
}

# Count rows in a table
# Usage: wpcli_count_table_rows <table_name> <site_path>
# Returns: row count
wpcli_count_table_rows() {
    local table_name="$1"
    local site_path="$2"

    if [ -z "$table_name" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    # Use bash array for safe command construction
    local -a query_args=("db" "query" "SELECT COUNT(*) FROM ${table_name};" "--path=$site_path" "--skip-column-names")
    wp "${query_args[@]}" 2>/dev/null || return 1
}

# Verify plugin exists and is installed
# Usage: wpcli_plugin_exists <plugin_slug> <site_path>
# Returns: 0 if installed, 1 if not
wpcli_plugin_exists() {
    local plugin_slug="$1"
    local site_path="$2"

    if [ -z "$plugin_slug" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    wp plugin list --name="$plugin_slug" --path="$site_path" --format=json 2>/dev/null | grep -q "$plugin_slug" || return 1
}

# Activate a plugin
# Usage: wpcli_activate_plugin <plugin_slug> <site_path>
# Returns: 0 on success
wpcli_activate_plugin() {
    local plugin_slug="$1"
    local site_path="$2"

    if [ -z "$plugin_slug" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    if ! wpcli_plugin_exists "$plugin_slug" "$site_path"; then
        wpcli_error "Plugin not found: $plugin_slug"
        return 1
    fi

    wp plugin activate "$plugin_slug" --path="$site_path" 2>/dev/null || {
        wpcli_error "Failed to activate plugin: $plugin_slug"
        return 1
    }

    wpcli_success "Plugin activated: $plugin_slug"
    return 0
}

# Deactivate a plugin
# Usage: wpcli_deactivate_plugin <plugin_slug> <site_path>
# Returns: 0 on success
wpcli_deactivate_plugin() {
    local plugin_slug="$1"
    local site_path="$2"

    if [ -z "$plugin_slug" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    wp plugin deactivate "$plugin_slug" --path="$site_path" 2>/dev/null || {
        wpcli_error "Failed to deactivate plugin: $plugin_slug"
        return 1
    }

    wpcli_success "Plugin deactivated: $plugin_slug"
    return 0
}

# Get database integrity info (for validation)
# Usage: wpcli_check_db_integrity <site_path>
# Returns: 0 if healthy, 1 if issues found
wpcli_check_db_integrity() {
    local site_path="$1"

    if [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid site path: $site_path"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    wpcli_log "Running database integrity checks..."

    # Check tables
    if ! wp db check --path="$site_path" &> /dev/null; then
        wpcli_error "Database integrity check failed"
        return 1
    fi

    wpcli_success "Database integrity check passed"
    return 0
}

# Export database to file
# Usage: wpcli_export_db <output_file> <site_path> [--single-transaction]
# Returns: 0 on success
wpcli_export_db() {
    local output_file="$1"
    local site_path="$2"
    local single_transaction="${3:---single-transaction}"

    if [ -z "$output_file" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    # Validate output directory exists
    local output_dir
    output_dir=$(dirname "$output_file")
    if [ ! -d "$output_dir" ]; then
        wpcli_error "Output directory does not exist: $output_dir"
        return 1
    fi

    wpcli_log "Exporting database to: $output_file"

    # Use bash array for command construction
    local -a export_args=("db" "export" "$output_file" "--path=$site_path" "$single_transaction")
    wp "${export_args[@]}" 2>/dev/null || {
        wpcli_error "Database export failed"
        return 1
    }

    wpcli_success "Database exported successfully"
    return 0
}

# Import database from file
# Usage: wpcli_import_db <input_file> <site_path>
# Returns: 0 on success
wpcli_import_db() {
    local input_file="$1"
    local site_path="$2"

    if [ -z "$input_file" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments"
        return 1
    fi

    if [ ! -f "$input_file" ]; then
        wpcli_error "Input file not found: $input_file"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    wpcli_log "Importing database from: $input_file"

    # Handle compressed files
    local temp_file="$input_file"
    if [[ "$input_file" == *.gz ]]; then
        temp_file="${input_file%.gz}"
        wpcli_log "Decompressing gzip file..."
        gunzip -c "$input_file" > "$temp_file" || {
            wpcli_error "Failed to decompress file"
            return 1
        }
    fi

    # Use bash array for command construction
    local -a import_args=("db" "import" "$temp_file" "--path=$site_path")
    wp "${import_args[@]}" 2>/dev/null || {
        wpcli_error "Database import failed"
        [ "$temp_file" != "$input_file" ] && rm -f "$temp_file"
        return 1
    }

    # Clean up temporary file if we created one
    [ "$temp_file" != "$input_file" ] && rm -f "$temp_file"

    wpcli_success "Database imported successfully"
    return 0
}

# Export WordPress user data
# Usage: wpcli_export_users <output_file> <site_path>
# Returns: 0 on success
wpcli_export_users() {
    local output_file="$1"
    local site_path="$2"

    if [ -z "$output_file" ] || [ -z "$site_path" ] || [ ! -d "$site_path" ]; then
        wpcli_error "Invalid arguments"
        return 1
    fi

    if ! wpcli_require; then
        return 1
    fi

    # Get table prefix first
    local prefix
    prefix=$(wpcli_get_table_prefix "$site_path") || return 1

    wpcli_log "Exporting users to: $output_file"

    # Use bash array for command construction
    local -a export_args=("db" "export" "$output_file" "--path=$site_path" "--tables=${prefix}users,${prefix}usermeta")
    wp "${export_args[@]}" 2>/dev/null || {
        wpcli_error "User export failed"
        return 1
    }

    wpcli_success "Users exported successfully"
    return 0
}

# Check if WP-CLI was properly initialized
# Call this at the start of any script that uses wpcli functions
wpcli_init() {
    # Initialize WP-CLI detection if not already done
    if [ -z "${WP_CLI_AVAILABLE}" ]; then
        wpcli_detect
    fi
}

# Export functions so they're available when sourcing this file
export -f wpcli_log wpcli_success wpcli_error wpcli_warn
export -f wpcli_detect wpcli_require wpcli_run wpcli_init
export -f wpcli_get_wp_version wpcli_check_health wpcli_get_siteurl
export -f wpcli_get_option wpcli_set_option wpcli_get_table_prefix wpcli_get_tables
export -f wpcli_count_table_rows wpcli_plugin_exists
export -f wpcli_activate_plugin wpcli_deactivate_plugin
export -f wpcli_check_db_integrity wpcli_export_db wpcli_import_db
export -f wpcli_export_users
