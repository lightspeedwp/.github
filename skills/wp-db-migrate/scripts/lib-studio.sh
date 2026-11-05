#!/bin/bash
# lib-studio.sh — Wrapper library for WordPress Studio CLI operations
# Provides common functions for site management, backups, database operations, and more
# Source this file: source ./lib-studio.sh

# Color codes
readonly GREEN='\033[0;32m'
readonly BLUE='\033[0;34m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly CYAN='\033[0;36m'
readonly GRAY='\033[0;90m'
readonly NC='\033[0m' # No Color

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LOGGING & OUTPUT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

log_info() {
    echo -e "${BLUE}ℹ${NC} $*"
}

log_success() {
    echo -e "${GREEN}✅ $*${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $*${NC}"
}

log_error() {
    echo -e "${RED}❌ $*${NC}" >&2
}

log_debug() {
    if [ "${STUDIO_DEBUG:-false}" = "true" ]; then
        echo -e "${GRAY}🔍 [DEBUG] $*${NC}"
    fi
}

log_section() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$*${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION & CHECKS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Check if studio CLI is available
check_studio_available() {
    if ! command -v studio &> /dev/null; then
        log_error "WordPress Studio CLI not found"
        log_info "Install from: https://developer.wordpress.com/docs/developer-tools/studio/cli/"
        return 1
    fi
    log_success "WordPress Studio CLI is available"
    return 0
}

# Check if a studio site exists at given path
site_exists() {
    local site_path="$1"

    if [ -z "$site_path" ]; then
        log_error "site_exists: No path provided"
        return 1
    fi

    if [ ! -d "$site_path" ]; then
        return 1
    fi

    # Check for wp-config.php or studio indicator
    if [ -f "$site_path/wp-config.php" ] || [ -f "$site_path/.wp-env.json" ]; then
        return 0
    fi

    return 1
}

# Validate that path is a valid WordPress Studio site
validate_site_path() {
    local site_path="${1:-.}"

    if [ ! -d "$site_path" ]; then
        log_error "Site path does not exist: $site_path"
        return 1
    fi

    if ! site_exists "$site_path"; then
        log_error "Not a valid WordPress Studio site: $site_path"
        log_info "Create one with: studio create --name my-site --path $site_path"
        return 1
    fi

    log_success "Site path is valid: $site_path"
    return 0
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SITE MANAGEMENT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# List all local Studio sites
studio_list_sites() {
    log_info "Fetching local Studio sites..."
    studio list
}

# Get details about a specific site
studio_get_site_info() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Getting site information..."
    studio status --path "$site_path"
}

# Get a site's current URL
studio_get_site_url() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    local url
    url=$(studio wp option get siteurl --path "$site_path" 2>/dev/null) || {
        log_error "Failed to get site URL from $site_path"
        return 1
    }

    echo "$url"
    return 0
}

# Get WordPress version of a site
studio_get_wp_version() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    studio wp core version --path "$site_path"
}

# Create a new Studio site
studio_create_site() {
    local site_name="$1"
    local site_path="$2"
    local domain="$3"

    if [ -z "$site_name" ]; then
        log_error "studio_create_site: No site name provided"
        return 1
    fi

    local args=(create --name "$site_name")

    if [ -n "$site_path" ]; then
        args+=(--path "$site_path")
    fi

    if [ -n "$domain" ]; then
        args+=(--domain "$domain")
    fi

    log_info "Creating new Studio site: $site_name"
    studio "${args[@]}" || {
        log_error "Failed to create site"
        return 1
    }

    log_success "Site created: $site_name"
    return 0
}

# Delete a Studio site
studio_delete_site() {
    local site_path="$1"
    local delete_files="${2:-false}"

    if [ -z "$site_path" ]; then
        log_error "studio_delete_site: No path provided"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_warning "About to delete Studio site: $site_path"
    log_info "This action cannot be undone"

    read -p "Are you sure? Type 'yes' to confirm: " confirm
    if [ "$confirm" != "yes" ]; then
        log_info "Deletion cancelled"
        return 0
    fi

    local args=(delete "$site_path")

    if [ "$delete_files" = "true" ]; then
        args+=(--files)
    fi

    studio "${args[@]}" || {
        log_error "Failed to delete site"
        return 1
    }

    log_success "Site deleted: $site_path"
    return 0
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SERVER MANAGEMENT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Start a Studio site
studio_start_server() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Starting Studio server..."
    studio start --path "$site_path" || {
        log_error "Failed to start server"
        return 1
    }

    log_success "Server started"
    return 0
}

# Stop a Studio site
studio_stop_server() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Stopping Studio server..."
    studio stop --path "$site_path" || {
        log_error "Failed to stop server"
        return 1
    }

    log_success "Server stopped"
    return 0
}

# Get server status
studio_server_status() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    studio status --path "$site_path"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATABASE OPERATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Backup database to file
studio_backup_database() {
    local site_path="${1:-.}"
    local backup_file="${2:-backup-$(date +%Y%m%d-%H%M%S).sql}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Backing up database to: $backup_file"
    studio export "$backup_file" --path "$site_path" --mode db || {
        log_error "Failed to backup database"
        return 1
    }

    local size
    size=$(du -h "$backup_file" | cut -f1)
    log_success "Database backed up ($size): $backup_file"
    echo "$backup_file"
    return 0
}

# Import database from backup
studio_import_database() {
    local backup_file="$1"
    local site_path="${2:-.}"

    if [ -z "$backup_file" ]; then
        log_error "studio_import_database: No backup file provided"
        return 1
    fi

    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_warning "This will replace the database in: $site_path"
    read -p "Are you sure? Type 'yes' to confirm: " confirm
    if [ "$confirm" != "yes" ]; then
        log_info "Import cancelled"
        return 0
    fi

    log_info "Importing database from: $backup_file"
    studio import "$backup_file" --path "$site_path" || {
        log_error "Failed to import database"
        return 1
    }

    log_success "Database imported successfully"
    return 0
}

# Export database to file
studio_export_database() {
    local site_path="${1:-.}"
    local export_file="${2:-export-$(date +%Y%m%d-%H%M%S).sql}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Exporting database to: $export_file"
    studio export "$export_file" --path "$site_path" --mode db || {
        log_error "Failed to export database"
        return 1
    }

    local size
    size=$(du -h "$export_file" | cut -f1)
    log_success "Database exported ($size): $export_file"
    echo "$export_file"
    return 0
}

# Replace URLs in database
studio_replace_urls() {
    local site_path="${1:-.}"
    local old_url="$2"
    local new_url="$3"

    if [ -z "$old_url" ] || [ -z "$new_url" ]; then
        log_error "studio_replace_urls: URLs not provided"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Replacing URLs in database"
    log_info "  From: $old_url"
    log_info "  To:   $new_url"

    studio wp search-replace "$old_url" "$new_url" --all-tables --path "$site_path" --quiet || {
        log_error "Failed to replace URLs"
        return 1
    }

    log_success "URLs replaced successfully"
    return 0
}

# Get database row counts for verification
studio_get_table_counts() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Fetching table row counts..."

    local tables=("posts" "postmeta" "users" "usermeta" "terms" "termmeta" "options")

    for table in "${tables[@]}"; do
        local count
        count=$(studio wp db query "SELECT COUNT(*) FROM wp_$table;" --path "$site_path" --skip-column-names 2>/dev/null || echo "0")
        echo "  wp_$table: $count"
    done
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PLUGIN & THEME MANAGEMENT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# List installed plugins
studio_list_plugins() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Fetching installed plugins..."
    studio wp plugin list --path "$site_path"
}

# Activate a plugin
studio_activate_plugin() {
    local plugin="$1"
    local site_path="${2:-.}"

    if [ -z "$plugin" ]; then
        log_error "studio_activate_plugin: No plugin specified"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Activating plugin: $plugin"
    studio wp plugin activate "$plugin" --path "$site_path" || {
        log_error "Failed to activate plugin: $plugin"
        return 1
    }

    log_success "Plugin activated: $plugin"
    return 0
}

# Deactivate a plugin
studio_deactivate_plugin() {
    local plugin="$1"
    local site_path="${2:-.}"

    if [ -z "$plugin" ]; then
        log_error "studio_deactivate_plugin: No plugin specified"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Deactivating plugin: $plugin"
    studio wp plugin deactivate "$plugin" --path "$site_path" || {
        log_error "Failed to deactivate plugin: $plugin"
        return 1
    }

    log_success "Plugin deactivated: $plugin"
    return 0
}

# List installed themes
studio_list_themes() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Fetching installed themes..."
    studio wp theme list --path "$site_path"
}

# Activate a theme
studio_activate_theme() {
    local theme="$1"
    local site_path="${2:-.}"

    if [ -z "$theme" ]; then
        log_error "studio_activate_theme: No theme specified"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Activating theme: $theme"
    studio wp theme activate "$theme" --path "$site_path" || {
        log_error "Failed to activate theme: $theme"
        return 1
    }

    log_success "Theme activated: $theme"
    return 0
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Get site configuration
studio_get_config() {
    local site_path="${1:-.}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Fetching site configuration..."
    studio config get --path "$site_path"
}

# Set WordPress version
studio_set_wp_version() {
    local version="$1"
    local site_path="${2:-.}"

    if [ -z "$version" ]; then
        log_error "studio_set_wp_version: No version provided"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Setting WordPress version to: $version"
    studio config set --wp "$version" --path "$site_path" || {
        log_error "Failed to set WordPress version"
        return 1
    }

    log_success "WordPress version set to: $version"
    return 0
}

# Set PHP version
studio_set_php_version() {
    local version="$1"
    local site_path="${2:-.}"

    if [ -z "$version" ]; then
        log_error "studio_set_php_version: No version provided"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Setting PHP version to: $version"
    studio config set --php "$version" --path "$site_path" || {
        log_error "Failed to set PHP version"
        return 1
    }

    log_success "PHP version set to: $version"
    return 0
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# EXPORT & IMPORT (Full sites)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Export entire site (database + files)
studio_export_site() {
    local site_path="${1:-.}"
    local export_file="${2:-site-export-$(date +%Y%m%d-%H%M%S).zip}"

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_info "Exporting site to: $export_file"
    studio export "$export_file" --path "$site_path" || {
        log_error "Failed to export site"
        return 1
    }

    local size
    size=$(du -h "$export_file" | cut -f1)
    log_success "Site exported ($size): $export_file"
    echo "$export_file"
    return 0
}

# Import entire site from backup
studio_import_site() {
    local backup_file="$1"
    local site_path="${2:-.}"

    if [ -z "$backup_file" ]; then
        log_error "studio_import_site: No backup file provided"
        return 1
    fi

    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_warning "This will replace the entire site at: $site_path"
    read -p "Are you sure? Type 'yes' to confirm: " confirm
    if [ "$confirm" != "yes" ]; then
        log_info "Import cancelled"
        return 0
    fi

    log_info "Importing site from: $backup_file"
    studio import "$backup_file" --path "$site_path" || {
        log_error "Failed to import site"
        return 1
    }

    log_success "Site imported successfully"
    return 0
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# WP-CLI PASSTHROUGH
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Run raw WP-CLI command against a site
studio_wp() {
    local site_path="${1:-.}"
    shift || {
        log_error "studio_wp: No command provided"
        return 1
    }

    if ! validate_site_path "$site_path"; then
        return 1
    fi

    log_debug "Running: studio wp $* --path $site_path"
    studio wp "$@" --path "$site_path"
}

# Run raw Studio command
studio_cmd() {
    log_debug "Running: studio $*"
    studio "$@"
}
